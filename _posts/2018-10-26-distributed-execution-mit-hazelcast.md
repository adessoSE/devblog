---
layout: [post, post-xml]
title: "Distributed Execution mit Hazelcast"
date: 2018-10-26 09:00:00
modified_date: 2018-10-26 09:00:00
author: karnik
categories: [Architekturen]
tags: [Microservices,Mainframe,Migration,Hazelcast]
---

Bei der Migration von Legacy-Anwendungen in eine Serviceorientierte Architektur, stellen einen die meist rechenintensiven und damit häufig auch langläufigen Batch-Verarbeitungen bzw. Tasks vor die Aufgabe der Definition einer geeigneten und vergleichbar leistungsfähigen Zielarchitektur. Eine mögliche Antwort gibt dieser Blog-Artikel.

Für die Definition der Architektur stellen sich mindestens zwei Grundsatzfragen:

1. Wie ist die Schnittstelle zu definieren, mit der die Steuerung und Überwachung von langläufigen Tasks gewährleistet werden kann?
2. Wie kann gewährleistet werden, dass die Leistungsfähigkeit des neuen Systems ähnlich skaliert wie beispielsweise die eines Parallel Sysplex der Mainframe-Welt.

Ein Lösungsvorschlag für diese kombinierte Fragestellung wird im Folgenden beschrieben und anhand eines [Beispiels](https://github.com/karnik/devblog-hazelcast) demonstriert.


# Langläufige Operationen mit REST 
Als abstraktes Beispiel für die Problemstellung kann an dieser Stelle eine Service angenommen werden, der eine komplexe oder auf großen Datenmengen basierte Operation durchführt, die eine lange Laufzeit aufweist. Wird dieser Service aufgerufen und die Operation gestartet, ist es erforderlich, dass der Client sich jederzeit über den Status informieren und bei Bedarf auch einen Abbruch der Ausführung anfordern kann. Der Start einer solchen Operation darf zudem nicht das System für anderen Clients blockieren.

Besteht außerdem noch die Vorgabe diesen Service als RESTful web service für die Außenwelt anzubieten, muss sichergestellt sein, dass der Client Zugriff auf das Ergebnis der Operation erhält, ohne die Verbindung während der Laufzeit offenzuhalten. Eine über einen langen Zeitraum offene HTTP-Verbindung gilt es, aufgrund der Fehleranfälligkeit von Netzwerkverbindungen, möglicher Timeouts und der hohen Ressourcenbelastung beim Offenhalten von HTTP-Verbindungen und Sessions, zu vermeiden.

## Lösungsansatz
Als Lösung für diese Problemstellung bietet sich an, die langläufige Operation als Ressource zu definieren, deren Erzeugung über einen definierten ```CREATE```-Endpunkt beauftragt werden kann. Wird der ```CREATE```-Endpunkt aufgerufen, startet er die Operation asynchron und liefert ein Response mit einer ```Location``` zu dem ```STATUS```-Endpunkt, unter welchem der Client den Status der Operation abrufen kann. Damit kehrt der Request umgehend zurück und die Operation läuft in einem asynchronen Prozess, ohne den Endpunkt oder den Client zu blockieren.

Solange noch kein Ergebnis vorliegt, liefert ein Request auf  den ```STATUS```-Endpunkt ein Response mit dem Status der Verarbeitung. Erste nachdem das Ergebnis vollständig erzeugt wurde, antwortet der ```STATUS```-Endpunkt mit einer weiteren ```Location``` auf den ```RESULT```-Endpunkt unter dem das Ergebnis abgerufen werden kann.

Zusätzlich hat der Client die Möglichkeit über den ```DELETE```-Endpunkt einen Job während der Verarbeitung abzubrechen und/oder das Ergebnis der Operation zu löschen.

## Berechnung der Fibonacci-Folge
Um die Problemstellung zu verdeutlichen, beschreibt das folgende Beispiel ein REST-Endpunkt für die Berechnung der Fibonacci-Zahl an Position __*n*__ der Fibonacci-Folge (__*Fib(n)*__). Diese Berechnung bietet eine gute Möglichkeit zur Demonstration einer langläufigen Task mit einem einfachen Ergebnis. Die rekursive Implementierung ermöglicht zudem einen kontrollierten Abbruch der Operation zur Laufzeit.

**HINWEIS:** Für die Darstellung dieses Beispiels wird das [httpie-Tool](https://httpie.org/) verwendet.

Im ersten Schritt wird die Erzeugung der Ressource, also die Berechnung der Fibonacci-Zahl an Position __*30*__, mit einem POST-Request auf den ```CREATE```-Endpunkt gestartet. Die Position der gewünschte Zahl in der Fibonacci-Reihe wird im Body übergeben (__*n=30*__).
```bash
$ http POST http://localhost:8080/fibonacci/ n=30
HTTP/1.1 202
Location: http://localhost:8080/fibonacci/e0e857a0-7654-415e-ae35-8b65bed813b1
```

Bei einer fehlerfreien Übergabe wird die Berechnung gestartet und der ```CREATE```-Endpunkt antwortet mit dem HTTP-Status-Code ```202 ACCEPTED```, sowie der URL des ```STATUS```-Endpunkt für die Abfrage des Status. Die URL ist durch eine UUID, an die auch die Berechnungs-Task gebunden ist, eindeutig.

Bei einem GET-Request auf den ```STATUS```-Endpunkt liefert er den HTTP-Status-Code ```200 OK```, sowie den Status der Berechnung.
```bash
$ http GET http://localhost:8080/fibonacci/e0e857a0-7654-415e-ae35-8b65bed813b1
HTTP/1.1 200
Content-Type: application/json;charset=UTF-8
Transfer-Encoding: chunked
{
    "id": "e0e857a0-7654-415e-ae35-8b65bed813b1",
    "n": 30,
    "status": "RUNNING",
    "statusMessage": null
}
```

Der identische Request liefert nach der erfolgreichen Berechnung von __*Fib(30)*__ den HTTP-Status-Code ```303 SEE OTHER```, sowie die URL für den ```RESULT```-Endpunkt. Das Ergebnis, welches in diesem Fall __*832040*__ lautet, kann anschließend mit einem GET-Request auf den ```RESULT```-Endpunkt abgerufen werden.
```bash
$ http GET http://localhost:8080/fibonacci/e0e857a0-7654-415e-ae35-8b65bed813b1/result
HTTP/1.1 200
Content-Type: application/json;charset=UTF-8
Transfer-Encoding: chunked
{
    "result": 832040
}
```

## Bewertung 
Durch den beschriebenen Aufbau steht dem Client eine robuste und für verteilte Systeme geeignete Schnittstelle zur Verfügung, die zudem noch ressourcenschonend arbeitet.

Es gilt dabei aber zu beachten, dass der Client eine Polling-Logik implementieren muss, die eine zusätzliche Komplexität und damit Fehlerquelle einbringt. Wird z.B. zu oft nach dem Status gefragt, kann das die Leistung des Gesamtsystems negativ beeinflussen. Auch muss darauf geachtet werden, dass die Ergebnisse nach einer Zeit automatisch bereinigt werden, da man nicht davon ausgehen kann, dass die Clients die Möglichkeit zur Löschung der Ergebnisse und Jobs auch nutzen.

Ein Beispiel für eine Umsetzung dieses Schemas bietet unter anderem die [AWS Glacier REST API](https://docs.aws.amazon.com/amazonglacier/latest/dev/job-operations.html).

# Lastverteilung mit Hazelcast
Nach der Definition der REST-API gilt es die Implementierung der dahinterliegenden Logik so auszulegen, dass das zugrundeliegende System den ```CREATE```-Endpunkt für die Berechnung nicht blockiert und zudem ausreichend skalierbar ist.

In der Java-Welt bietet sich dafür das [Java Executor Framework](https://docs.oracle.com/javase/tutorial/essential/concurrency/executors.html) an, das mit JDK 5 eingeführt wurde. Dieses erlaubt die asynchrone Ausführung von langläufigen Tasks oder Geschäftsprozess wie z.B. umfangreichen SQL-Abfragen oder komplexen Berechnungen in einem Thread-Pool.

Dies alleine würde reichen, um die Last auf einem einzelnen System über mehrere Prozesse bzw. CPU-Cores zu verteilen. Mit der Leistung und Skalierbarkeit eines Mainframe kann dieser Ansatz im Normallfall aber nicht konkurrieren. Hier ist es erforderlich eine Skalierbarkeit über mehrere Systeme, die beispielsweise zu einem Cluster zusammengeschlossen werden, zu gewährleisten.

Für die Umsetzung einer solchen Skalierbarkeit bietet sich der Einsatz einer **In-Memory Computing Platfrom** wie z.B. [Hazelcast IMDG](https://hazelcast.com/), [Apache Ignite](https://ignite.apache.org/) oder [GridGain](https://www.gridgain.com/) an.

Diese Frameworks bieten die Möglichkeit eine beliebige Anzahl von Nodes bzw. Servern zu einem Cluster zusammenzuschließen, in dem die Daten des Clusters, sowie die Ausführung von Tasks gleichmäßig über alle Nodes verteilt  werden. Jede zusätzliche Node erhöht die Leistungsfähigkeit des Clusters, was eine einfache horizontale Skalierung erlaubt.

Für die Implementierung des Beispiels wurde Hazelcast IMDG gewählt. Das Framework, sowie die API von Hazelcast, haben sich in mehreren Projekten bewährt und als sehr praktikabel erwiesen.

Die konkrete Implementierung setzt auf die verteilte Ausführung in einem [Distributed Executor Service](https://docs.hazelcast.org/docs/3.10.6/manual/html-single/index.html#distributed-computing), einer verteilten Variante des Java Executor Service. Damit können Tasks nicht nur über die Ressource eines Servers, sondern über alle Nodes eines Hazelcast-Clusters verteilt und ausgeführt werden.

## Architektur des Beispiel-Projekts
Typischerweise setzt sich ein Hazelcast IMDG aus __*n*__ Nodes zu einem Hazelcast-Cluster zusammen. Der Hazelcast-Client verbindet sich dann auf den Cluster und beauftragt Operationen, die auf einer oder mehreren Nodes des Clusters ausgeführt werden.

![Architektur des Beispielprojekts - Client](/assets/images/posts/distributed-execution-mit-hazelcast/hazelcast-client-example.png)

Für die Demonstration des Distributed Executor Service, sowie der REST-API wurden Hazelcast Node und Client in dem Beispiel-Projekt vereint. Jede gestartete _Spring Boot_-Instanz ist so konfiguriert, dass sie als Node dem konfigurierten Hazelcast-Cluster beitritt und zudem noch die REST-API anbietet, deren Aufrufe über den integrierten Hazelcast-Client den Cluster ansprechen.

![Architektur des Beispielprojekts - Cluster](/assets/images/posts/distributed-execution-mit-hazelcast/hazelcast-cluster-example.png)

Die Nodes ließen sich in diesem Setup z.B. durch einen Load-Balancer verbinden und damit auch die Last der Berechnungs-Anfragen über die Nodes verteilen.

## Implementierung der Fibonacci-Task
Wie beschrieben, bietet der ```CREATE```-Endpunkt die Berechnung einer Fibonacci-Zahl an. Die Berechnung der Zahl soll nun als Operation an den Hazelcast-Cluster in einem Distributed Executor Service übergeben und dort asynchron ausgeführt werden. Um eine Task oder Berechnung in einem Executor Service des Hazelcast-Clusters ausführen zu können, muss sie eines der beiden folgenden Interfaces implementieren:

```java.util.concurrent.Callable```: Wenn ein Rückgabewert erforderlich ist.

```java.util.concurrent.Runnable```: Wenn kein Rückgabewert erforderlich ist.

**HINWEIS:** Alle Klasse, deren Instanzen in dem Hazelcast-Cluster zwischen den Nodes ausgetauscht werden sollen, müssen das Interface ```java.io.Serializable``` implementieren.

Da im Fall der Berechnung der Fibonacci-Zahl eine Rückgabe erwartet wird, wurde die Task auf Basis des ```Callable```-Interface umgesetzt.

In diesem Beispiel wird zusätzlich noch das Interface ```com.hazelcast.core.HazelcastInstanceAware``` implementiert. Damit erhält die Task Zugriff auf die aktuelle Hazelcast-Umgebung und kann dem System seinen aktuellen Status mitteilen.

Um die Task eindeutig zu identifizieren, erhält sie eine **UUID**. Diese **UUID** ist identisch zu der ID, die auch im ```CREATE```-Endpunkt an den Client übertragen wird.

**Definition der [FibonacciTask](https://github.com/karnik/devblog-hazelcast/blob/master/src/main/java/com/adt/devblog/hazelcast/task/FibonacciTask.java)-Klasse:**
```Java
public class FibonacciTask implements Callable<FibonacciTaskResult>, HazelcastInstanceAware, Serializable {
  private String taskUUID;
  ...
}
```

## Zentrale Speicherung des Task-Status
Der Status sowie das Ergebnis müssen während und nach der Laufzeit an einer zentralen Stelle, redundant und von allen Nodes des Clusters erreichbar, gespeichert sein. Hierzu bietet sich beim Einsatz von Hazelcast eine [Distributed Map](https://docs.hazelcast.org/docs/3.10.6/manual/html-single/index.html#map) an. Als Key dient dabei wieder die **UUID** der Task. So ist eine einfache systemübergreifende Zuordnung möglich.

Das Ergebnis der Berechnung besteht in diesem Fall aus einem einfach ```Long```.
**Definition der [FibonacciTaskResult](https://github.com/karnik/devblog-hazelcast/blob/master/src/main/java/com/adt/devblog/hazelcast/task/FibonacciTaskResult.java)-Klasse:**
```Java
public class FibonacciTaskResult implements Serializable {
  private Long result;
}
```

Der Status der Task hält die Position der zu berechnenden Zahl, den aktuellen Status, sowie eine mögliche Text-Information zu dem Status.
**Definition der [FibonacciTaskStatus](https://github.com/karnik/devblog-hazelcast/blob/master/src/main/java/com/adt/devblog/hazelcast/task/FibonacciTaskStatus.java)-Klasse:**
```Java
public class FibonacciTaskStatus implements Serializable {
  @NotNull
  private Long n;
  private STATUS status;
  private String statusMessage;

  public enum STATUS {
    SUBMITTED,
    RUNNING,
    FINISHED,
    CANCELLED,
    ERROR
  }
}
```

## Ausführung der Task in einem Distributed Executor Service
Um die Task auszuführen muss sie dem Distributed Executor Service (```IExecutorService```) einer der ```submit```-Methoden übergeben werden. Zusätzlich zu der Task wird noch ein ```ExecutionCallback``` gesetzt, mit dem auf das erfolgreiche Ende oder einen Fehler der Task reagiert werden kann. Diese Logik könnte zwar auch in der Task implementiert werden, würde diese aber unnötige verkomplizieren oder im schlimmsten Fall sogar ein negativen Einfluss auf die Performance nehmen.

**Definition der [DistributedFibonacciTaskService#submit](https://github.com/karnik/devblog-hazelcast/blob/master/src/main/java/com/adt/devblog/hazelcast/service/DistributedFibonacciTaskService.java)-Methode:**
``` java
public String submit(FibonacciTaskStatus fibonacciTaskStatus) {
  String taskUUID = UUID.randomUUID().toString();
  IExecutorService executorService = hcInstance.getExecutorService(HazelcastConfiguration.REST_EXECUTOR_SERVICE);

  // submit the task for execution
  FibonacciTask fibonacciTask = new FibonacciTask(taskUUID, fibonacciTaskStatus.getN());
  executorService.submit(fibonacciTask, new ExecutionCallback<FibonacciTaskResult>() {
      @Override
      public void onResponse(FibonacciTaskResult response) {
        ...
      }

      @Override
      public void onFailure(Throwable t) {
        ...
      }
    });

    return taskUUID;
  }
```

Sobald die Task abgearbeitete wurde, wird über den Callback das Ergebnis in die entsprechende Map geschrieben und der Status aktualisiert. Der Client erfährt bei seiner nächsten Anfrage an den ```STATUS```-Endpunkt, dass die Task abgeschlossen ist und das Ergebnis abgeholt werden kann.

Der gesamte Ablauf der Logik für die erfolgreiche Ausführung der Fibonacci Task stellt sich dann wie folgt dar:
![Architektur des Beispielprojekts](/assets/images/posts/distributed-execution-mit-hazelcast/flow.png)

## Build & Run
Das ausführbare FatJar der Spring Boot Anwendung wird mit dem folgenden Befehl ```$ gradle clean bootJar``` gebaut.

Anschließend werden drei Nodes mit jeweils einem  dedizierten Server-Port für den HTTP-Server gestartet:
```bash
# Konsole 1
$ java -jar build/libs/devblog-hazelcast-<version>.jar --server.port=8080

# Konsole 2
$ java -jar build/libs/devblog-hazelcast-<version>.jar --server.port=8081

# Konsole 3
$ java -jar build/libs/devblog-hazelcast-<version>.jar --server.port=8082
```

Nach dem Start erkennt man in **allen** Konsolen, dass die Nodes einen Cluster gebildet haben. Anhand des **this** erkennt man zudem die Node, die zu der aktuellen Konsole gehört.
```bash
Members {size:3, ver:2} [
 Member [127.0.0.1]:5701 - 5ee54b4d-5957-4b8b-9dc1-6c106e9a0f2a this
 Member [127.0.0.1]:5702 - 34e82cd3-77cc-46cc-9ba9-947b04b54b24
 Member [127.0.0.1]:5703 - cc0a6ba7-6d99-4bc4-b9e4-a6d5afd7de27
]
```

Startet man nun via httpie-Tool die Berechnung der Fibonacci-Zahl __*Fib(10)*__, so erscheinen die folgenden Log-Meldungen:
```bash

$ http POST http://localhost:8080/fibonacci/ n=10

# Task wurde erzeugt - Status wurde durch Client in Node 1 geschrieben
TaskMapListener  : FibonacciTaskStatus with ID a3d0f6a9-a28b-4978-8123-e0e3b0606b4b added by Member [127.0.0.1]:5701 - 5ee54b4d-5957-4b8b-9dc1-6c106e9a0f2a this

# Task wurde gestartet - Status wurde durch die Task selbst in Node 3 aktualisiert
TaskMapListener  : FibonacciTaskStatus with ID a3d0f6a9-a28b-4978-8123-e0e3b0606b4b updated by Member [127.0.0.1]:5703 - cc0a6ba7-6d99-4bc4-b9e4-a6d5afd7de27. New value: FibonacciTaskStatus(n=10, status=RUNNING, statusMessage=null), Old value: FibonacciTaskStatus(n=10, status=SUBMITTED, statusMessage=null)

# Task wurde erfolgreich beendet - Status wurde durch Callback an Client in Node 1 aktualisiert
TaskMapListener  : FibonacciTaskStatus with ID a3d0f6a9-a28b-4978-8123-e0e3b0606b4b updated by Member [127.0.0.1]:5701 - 5ee54b4d-5957-4b8b-9dc1-6c106e9a0f2a this. New value: FibonacciTaskStatus(n=10, status=FINISHED, statusMessage=null), Old value: FibonacciTaskStatus(n=10, status=RUNNING, statusMessage=null)
```

**HINWEIS:** Die Log-Meldungen werden durch einen Map-Listener erzeugt, der an der Distributed Map registriert wurde. Er schreibt eine Meldung in das Log, wenn ein Wert in der Map aktualisiert, hinzugefügt oder gelöscht wird. Dadurch, dass der Status immer in den Maps aktualisiert wird, erhalten wir bei jedem Wechsel eine Log-Ausgabe. Zu dem Wechsel wird auch die Node (Member) gelogged, die die Änderung durchführt.

# Fazit
Dieser Artikel beantwortet die eingangs gestellte kombinierte Fragestellung, wie ein System zu definieren ist, das einerseits eine klare Schnittstelle für die Ausführung und Steuerung von langläufigen Tasks anbietet und gleichzeitig eine Skalierbarkeit vorweist, die das System in die Lage versetzt mit der Performance bzw. Belastbarkeit eines Mainframes mithalten zu können.

Die gezeigte Implementierung ermöglich es eine langläufige Task in einem frei skalierbaren Cluster asynchron zur Ausführung zu bringen. Zusätzlich lässt sich Ausführung und der Status über eine klar definierte REST-Schnittstelle kontrollieren, die zu keinem Zeitpunkt durch die Ausführung geblockt wird. Damit konnte der Lösungsvorschlag eine Antwort auf beide Fragen der kombinierten Fragestellung geben.

Es gilt allerdings erneut darauf hinzuweisen, dass die Implementierung bzw. Konfiguration des Client bei diesem Verfahren eine entscheidende Rolle spielt. Fragt der Client das System nach dem Ergebnis, so muss eine gute Balance zwischen Frequenz und Last des Systems gefunden werden. Wie Eingangs beschrieben, kann eine zu hohe Frequenz beim Einholen des Status einen negativen Einfluss auf die Leistung des Gesamtsystems haben. Ist der Client aber korrekt konfiguriert, erhält man ein schnell reagierendes und hervorragend skalierbares System, dessen Einsatztauglichkeit bereits erfolgreich in einem Migrations-Projekt bewiesen werden konnte.

Der vollständige Quellcode des Beispiels steht als [Spring Boot](https://spring.io/projects/spring-boot)-Projekt auf [Github](https://github.com/karnik/devblog-hazelcast) zur Verfügung.

**Quellen:**
1. [Rest and long running jobs](https://farazdagi.com/2014/rest-and-long-running-jobs/)
2. [Long running operation polling](http://restalk-patterns.org/long-running-operation-polling.html)
