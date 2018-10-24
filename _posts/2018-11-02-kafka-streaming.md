---
layout: [post, post-xml]
title:  "Apache Kafka als Streaming Plattform"
date:   2018-11-02 08:00
author: swindisch
categories: [Architektur]
tags: [Microservice, Message-Queue, Java]
---
In der heutigen Welt wird es immer wichtiger, Mengen verschiedener Informationen zu sammeln,
auszuwerten und an unterschiedliche Konsumenten zu verteilen.
Zusätzlich müssen Firmen möglichst schnell auf Marktsituationen reagieren und ihre Software-Systeme an diese anpassen.
Damit die Software-Systeme nicht in eine zu starke Abhängigkeit geraten,
wird die Architektur dieser Systeme oft als eine verteilte heterogene Landschaft
mit unterschiedlichen fachspezifischen Technologien umgesetzt,
deren Schnittstellen meist nur noch über den synchronen oder asynchronen Austausch von Nachrichten lose miteinander verbunden sind.
In diesem Blog wird der Einsatz von Kafka als Message-Queue und Streaming-Plattform erläutert.

# Nachrichtenorientierte Systeme, Message Oriented Middleware (MOM)

Zum Austausch der Nachrichten werden sogenannte nachrichtenorientierte Systeme, Message Oriented Middleware (MOM), eingesetzt,
die als eigenständige Produkte am Markt existieren.

Bei nachrichtenorientierten Systemen wird zwischen folgenden Protokollen unterschieden.
* Message Passing   	: Dies ist die direkte Kommunikation zwischen zwei Systemen.
* Message Queueing	    : Dies ist die indirekte Kommunikation über eine Middleware in Form einer Warteschlange.
* Publish & Subscribe   : Hier stellt ein Herausgeber dem Konsumenten Nachrichten zur Verfügung.
Der Austausch kann dabei asynchron oder synchron erfolgen.

[Kafka](https://kafka.apache.org/) ist eine solches Nachrichtenorientiertes System, das Daten in Form von Nachrichten zwischen verschiedenen Systemen austauscht.
Es wurde ursprünglich von LinkedIn entwickelt, dann aber an die Apache Software Foundation übergeben.

Kafka wird in der Rolle des Publish & Subscribers implementiert und genutzt.
Es wird dabei als Middelware zwischen Systemen genutzt, ohne dass sich die Systeme kennen.
Der Erzeuger der Nachricht ist in der Rolle Herausgeber (Publisher) dafür verantwortlich seine Nachrichten an Kafka zu übergeben.
Der Konsument (Subscriber) ist dafür verantwortlich, die Nachrichten entgegen zu nehmen.

Herausgeber und Konsument kennen sich nicht. Sie kommunizieren über einen definierten Kanal in Kafka.
Da Kafka dann als zentrales System zum Austausch von Nachrichten dient, muss es stabil, hochverfügbar und belastbar aufgesetzt werden.
Diesen Ansprüchen genügt Kafka durch grundlegende Architekturentscheidungen, wie beispielsweise einen hohen Daten-Durchsatz
oder auch der Replikation der Kafka Nodes, um Ausfälle zu kompensieren.
Kafka wurde mit dem Gedanken an BigData und Streaming geplant.

In typischen Nachrichten-Systemen werden Nachrichten gelöscht, wenn sie gelesen wurden.
Kafka speichert die Nachrichten allerdings dauerhaft, um eine Nachrichtenhistorie abbilden zu können.
Damit können beispielsweise Event-Sourcing-Systeme mit Kafka abgebildet werden, ohne dass die angrenzenden Systeme dies selbst implementieren müssen.

Zusammengefasst ist Kafka eine nachrichtenorientierte Publish & Subscribe Open-Source-Software
basierend auf einer verteilten, partitionier- und verteilbaren Architektur.

# Einsatzgebiete

Der Einsatz von nachrichtenorientierten System kann in folgende Gebiete unterteilt werden.
* Nachrichten-Übermittlung (Messaging): Microservices nutzen eine MOM um Nachrichten und Events untereinander auszutauschen.

* Website Activity Tracking: Die Bedienung einer Web-Anwendung wird detailliert in Protokollen gespeichert, in Kafka gespeichert, verarbeitet und wieder verteilt. Dies war auch die ursprüngliche Anforderung für die Erschaffung von Kafka

* Log-Aggregation: Unterschiedliche Quellen und Formate von Protokoll-Dateien werden massenhaft von der MOM gesammelt, zentral gespeichert, in ein einheitliches Format überführt und zur Auswertung zur Verfügung gestellt.

* Stream Processing: Mehrfache und parallele Bearbeitung von Datenströmen zur Erweiterung oder Transformierung. Dabei werden die Datenströme durch Kafka Topics geschoben.

* Event Sourcing: 
Event Sourcing ist ein Enterprise Architecture Pattern, bei dem Veränderungen von Daten bzw. Objekten als Event-Folge gespeichert werden. Dadurch ist es jederzeit möglich den Zustand zu einem bestimmten Zeitpunkt durch das Einlesen der Event-Folge zu ermitteln.

* Real-Time Processing: Empfänger, die Echtzeit-Verarbeitung ermöglichen, wie beispielsweise Apache Spark oder Storm.

Bekannte Unternehmen, die Kafka einsetzen sind beispielsweise: LinkedIn, Yahoo, Twitter, Netflix, Square, FourSquare, Pinterest, Spotify, Uber, AirBnB, Tumblr.

# Architektur

Das folgende Kapitel beschreibt die grundlegende Architektur und die Bestandteile von Kafka.

Da sich in der Software-Welt oft die englischen Begriffe als Standard genutzt werden,
werden hier ebenfalls die englischen Begriffe verwendet und nur bei Bedarf deutsche Synonyme verwendet bzw. darauf hingewiesen.

## Records / Nachrichten

Kafka speichert die Nachrichten, genannt Records, als einfachen Wert ab.
Dabei wird der Inhalt nicht betrachtet. Das Format der Nachricht wird vom Ersteller bestimmt (JSON, XML).
Zusätzlich wird die Nachricht mit einem Schlüssel und einem Zeitstempel gespeichert.

Nachrichten werden nach dem Lesen nicht gelöscht, sondern dauerhaft aufbewahrt.
Allerdings kann konfigurativ bestimmt werden, dass eine Nachricht nach Ablauf einer bestimmten Zeit (Stunden / Tage) gelöscht wird.

## Topics

Records werden in Kafka in Topics kategorisiert. Fachlich getrennte Themen können so in eigenen Topics getrennt abgelegt werden.
Eine Topic kann am ehesten mit einem Ordner oder einem Ablagefach verglichen werden, in den gleichwertige Dokumente abgelegt werden.

## Partitionen

Ein Topic wird in Partitionen unterteilt. Neue Records werden an Partitionen gehangen.
Für jeden Konsumenten speichert Kafka die Position des zuletzt gelesenen Records ab,
wodurch für die Konsumenten immer erkenntlich bleibt, welcher Record zuletzt gelesen wurde.
Der Konsument muss das Lesen des Records an Kafka bestätigen, einen sogenannten Commit ausführen.
Dadurch kann Kafka die Position des Konsumenten speichern.

Es ist möglich eine Liste von Records in einem Commit zu bestätigen.
Dies beschleunigt die Bearbeitung, birgt aber auch die Gefahr, dass bei einem Fehler während einer Verarbeitung,
nochmals die ganze Liste gelesen und bestätigt werden muss.

Wenn für ein Topic mehrere Partitionen angelegt werden, so wird der Hash des Record-Keys zur Auswahl der Partitionen genommen.
Es ist aber auch möglich eine eigene Berechnungsfunktion zu hinterlegen.
Dadurch können die Records auf beliebig viele Partitionen verteilt werden,
was die gleichzeitige Bearbeitung der Daten durch viele Konsumenten ermöglicht.

Die Reihenfolge innerhalb einer Partition bleibt zwischen dem Schreiben und Lesen erhalten.
D.h. die Nachrichten können in der Reihenfolge vom Konsumenten gelesen werden, wie der Hersteller sie eingestellt hat.

Das Anhängen von Records an die Partitionen stellt eine sehr effiziente Operation statt, die auf klassischen Datenträgern (HDD, SDD) stattfinden kann.
Da Partitionen über Kafka-Server verteilt werden, kann eine gewünschte Skalierbarkeit und Redundanz sichergestellt werden.

## Push-Verfahren

Bei Nachrichten-Middleware wird zwischen einem Push- und Pull-Verfahren unterschieden.
Bei dem Push-Verfahren sorgt die Middleware dafür, dass der Konsument die neue Nachricht übermittelt bekommt,
während beim Pull-Verfahren der Konsument die Middleware zyklisch anfragen muss, ob eine neue Nachricht vorliegt.

Kafka wird im Pull-Verfahren betrieben. Dies hat den Vorteil, dass der Konsument selbst entscheidet,
wann er in der Lage ist, eine neue Nachricht zu verarbeiten. Beim Push-Verfahren kann es bei Lastspitzen zu einer Überflutung der Empfänger kommen.

## Replikation

Kafka bietet die Möglichkeit eine Nachricht auf mehrere Replikationen zu verteilen.
Dadurch wird eine hohe Ausfallsicherheit garantiert. Bei n Replikationen können bis zu n-1 Broker ausfallen,
ohne das die Nachricht nicht mehr abgerufen werden kann.

Die Anzahl der Replikationen wird pro Topic definiert. Dabei fungiert eine Replika als führend, während alle anderen die Folge-Replikas sind.

Kafka unterscheidet zwischen synchroner und asynchroner Replikation:
* Bei der synchronen Replikation sendet der Erzeuger die Nachricht an Kafka.
  Die Nachricht wird dann in der führenden Replika (Leader) gespeichert. Jede Folge-Replika holt sich die Nachricht vom Leader,
  speichert diese und sendet den Status zurück. Erst wenn alle Replikationen gespeichert wurden, wird der Erzeuger darüber informiert.
* Bei der asynchronen Replikation erhält der Erzeuger direkt nachdem die führende Replika die Nachricht gespeichert hat die Bestätigung.
  Der Rest läuft anschließend im Hintergrund ab.

## Broker

Ein Kafka Server wird Broker genannt. Der Server empfängt Nachrichten von Erzeugern und speichert diese in seinem Speicherbereich.
Er liefert die Nachrichten an die Konsumenten, wenn diese sie anfragen. Durch die Kafka Architektur ist es,
abhängig von der gewählten Infrastruktur, bereits möglich, dass ein Broker mit sehr vielen Partitionen und Nachrichten umgehen kann.

Bei weiteren Mengen- bzw. Performance-Anforderungen können mehrere Broker als ein Cluster zusammengeschaltet werden,
so dass dann Partition und Nachrichten auf verschiedene Broker verteilt und repliziert werden.

![Architektur von Kafka](/assets/images/posts/kafka_streaming/Kafka-Architektur.png)

## Schnittstellen

Um Kafka mit Nachrichten zu füllen bzw. diese wieder aus Kafka zu lesen,
gibt es die Möglichkeit dies über die bekannten Ersteller- und Konsumenten-Schnittstellen (Producer- / Consumer-API)
zu realisieren oder aber das Framwork Kafka Connect zu nutzen.

Die Producer- und Consumer-API wird genutzt, wenn die umliegenden Anwendungen selbst entwickelt werden,
und so Zugriff auf die Erstellung und Bearbeitung der Nachrichten möglich ist.

Das Framwork Kafka Connect wird genutzt, um Datenspeicher anzusprechen,
die von einem Dritthersteller stammen (Datastore, Datenbank, Big-Data-Systeme).
Das Framwork besteht aus einer API und einer Runtime-Umgebung, um die entwickelten Konnektoren als Plugins auszuführen.
Beispielsweise kann Kafka Connect genutzt werden, um Daten aus MySQL-Datenbanken zu laden und in ElasticSearch zu speichern.

# Installation

Kafka kann für verschiedene Datenmengen unterschiedlich aufgesetzt werden. Das installierte Kafka-System wird dabei als Cluster bezeichnet.
Beispielsweise kann Kafka als ein Cluster installiert werden, der entweder auf einem Server mit nur einem Broker aufgesetzt wird, oder aber verteilt auf mehreren Servern mit mehreren Brokern.

Der Cluster setzt sich dabei aus den folgenden Systemen zusammen:

* Zookeeper	: Zur zentralen Koordinierung der Konfiguration und Systeme
* Broker	: Kafka Prozess, verteilt auf einem oder mehreren Servern
* Topic		: Topic zur Sammlung der Nachrichten
* Ersteller	: Das System, das Nachrichten in Kafka ablegt
* Konsument	: Das System, das Nachrichten aus Kafka abholt

Für ein einfaches Beispiel nutzen wir Kafka in einer Windows-Umgebung mit einem bereits installierten Java Framework.

``` batch
c:\dev\kafka_2.11-2.0.0>java -version
java version "10.0.1" 2018-04-17
Java(TM) SE Runtime Environment 18.3 (build 10.0.1+10)
Java HotSpot(TM) 64-Bit Server VM 18.3 (build 10.0.1+10, mixed mode)
```

Kafka kann von der Apache Seite heruntergeladen werden. Die Aktuelle Version ist hier erreichbar:
[Kafka Download](https://kafka.apache.org/downloads "Kafka Download")

Das genutzte heruntergeladene Archiv `kafka_2.11-2.0.0.tgz` wird in das Verzeichnis `c:\dev` entpackt, so dass die folgende Verzeichnis-Struktur entsteht:

``` batch
Verzeichnis von c:\dev\kafka_2.11-2.0.0

11.10.2018  18:10    <DIR>          .
11.10.2018  18:10    <DIR>          ..
09.10.2018  12:34    <DIR>          bin
11.10.2018  07:44    <DIR>          config
09.10.2018  12:34    <DIR>          libs
24.07.2018  16:17            28.824 LICENSE
24.07.2018  16:17               336 NOTICE
09.10.2018  12:34    <DIR>          site-docs
12.10.2018  16:57    <DIR>          _src
               2 Datei(en),         29.160 Bytes
               7 Verzeichnis(se), 271.241.490.432 Bytes frei
```

In dem Unterverzeichnis `c:\dev\kafka_2.11-2.0.0\bin\windows` liegen die Batch-Dateien für die Windows-Umgebung.

Kafka nutzt Apache Zookepper als zentralen Dienst für Konfigurationen und verteilte Verwaltung, so dass dieser zuerst gestartet werden muss:
`zookeeper-server-start.bat ..\..\config\zookeeper.properties`

``` batch
[2018-10-24 08:29:06,221] INFO Reading configuration from: ..\..\config\zookeeper.properties (org.apache.zookeeper.server.quorum.QuorumPeerConfig)
[2018-10-24 08:29:06,252] INFO Starting server (org.apache.zookeeper.server.ZooKeeperServerMain)
[2018-10-24 08:29:10,847] INFO Server environment:zookeeper.version=3.4.13-2d71af4dbe22557fda74f9a9b4309b15a7487f03, built on 06/29/2018 00:39 GMT (org.apache.zookeeper.server.ZooKeeperServer)
[2018-10-24 08:29:10,847] INFO Server environment:host.name=192.168.220.1 (org.apache.zookeeper.server.ZooKeeperServer)
[2018-10-24 08:29:10,847] INFO Server environment:java.version=1.8.0_172 (org.apache.zookeeper.server.ZooKeeperServer)
[2018-10-24 08:29:10,847] INFO Server environment:java.vendor=Oracle Corporation (org.apache.zookeeper.server.ZooKeeperServer)
[2018-10-24 08:29:10,847] INFO Server environment:java.home=C:\dev\Java\jdk1.8.0_172_64\jre (org.apache.zookeeper.server.ZooKeeperServer)

...

[2018-10-24 08:29:10,847] INFO Server environment:java.io.tmpdir=C:\Users\windisch\AppData\Local\Temp\ (org.apache.zookeeper.server.ZooKeeperServer)
[2018-10-24 08:29:10,847] INFO Server environment:java.compiler=<NA> (org.apache.zookeeper.server.ZooKeeperServer)
[2018-10-24 08:29:10,847] INFO Server environment:os.name=Windows 10 (org.apache.zookeeper.server.ZooKeeperServer)
[2018-10-24 08:29:10,847] INFO Server environment:os.arch=amd64 (org.apache.zookeeper.server.ZooKeeperServer)
[2018-10-24 08:29:10,847] INFO Server environment:os.version=10.0 (org.apache.zookeeper.server.ZooKeeperServer)
[2018-10-24 08:29:10,847] INFO Server environment:user.name=windisch (org.apache.zookeeper.server.ZooKeeperServer)
[2018-10-24 08:29:10,847] INFO Server environment:user.home=C:\Users\windisch (org.apache.zookeeper.server.ZooKeeperServer)
[2018-10-24 08:29:10,847] INFO Server environment:user.dir=c:\dev\kafka_2.11-2.0.0\bin\windows (org.apache.zookeeper.server.ZooKeeperServer)
[2018-10-24 08:29:10,925] INFO binding to port 0.0.0.0/0.0.0.0:2181 (org.apache.zookeeper.server.NIOServerCnxnFactory)
```

Im Anschluss wird der Kafka Broker gestartet:

`kafka-server-start.bat ..\..\config\server.properties`

``` batch
[2018-10-24 08:34:49,966] INFO Registered kafka:type=kafka.Log4jController MBean (kafka.utils.Log4jControllerRegistration$)
[2018-10-24 08:34:50,231] INFO starting (kafka.server.KafkaServer)
[2018-10-24 08:34:50,231] INFO Connecting to zookeeper on localhost:2181 (kafka.server.KafkaServer)
[2018-10-24 08:34:50,247] INFO [ZooKeeperClient] Initializing a new session to localhost:2181. (kafka.zookeeper.ZooKeeperClient)
[2018-10-24 08:34:54,841] INFO Client environment:zookeeper.version=3.4.13-2d71af4dbe22557fda74f9a9b4309b15a7487f03, built on 06/29/2018 00:39 GMT (org.apache.zookeeper.ZooKeeper)
[2018-10-24 08:34:54,841] INFO Client environment:host.name=192.168.220.1 (org.apache.zookeeper.ZooKeeper)
[2018-10-24 08:34:54,841] INFO Client environment:java.version=1.8.0_172 (org.apache.zookeeper.ZooKeeper)
[2018-10-24 08:34:54,841] INFO Client environment:java.vendor=Oracle Corporation (org.apache.zookeeper.ZooKeeper)
[2018-10-24 08:34:54,841] INFO Client environment:java.home=C:\dev\Java\jdk1.8.0_172_64\jre (org.apache.zookeeper.ZooKeeper)
![Kafka](/assets/images/posts/kafka_streaming/kafka.png)

...

[2018-10-24 08:35:00,561] INFO [SocketServer brokerId=0] Started processors for 1 acceptors (kafka.network.SocketServer)
[2018-10-24 08:35:00,561] INFO Kafka version : 2.0.0 (org.apache.kafka.common.utils.AppInfoParser)
[2018-10-24 08:35:00,561] INFO Kafka commitId : 3402a8361b734732 (org.apache.kafka.common.utils.AppInfoParser)
[2018-10-24 08:35:00,561] INFO [KafkaServer id=0] started (kafka.server.KafkaServer)
```

Die Konfigurationsdateien sind mit Default-Werten belegt, so dass dieses einfache Beispiel ohne viel Aufwand gestartet werden kann.

# Konfiguration

Nachdem Kafka installiert und gestartet wurde, kann das System nun direkt genutzt werden.
Als ersten Schritt müssen die Topics angelegt werden, damit hier später die Nachrichten (Records) gespeichert werden können.

`kafka-topics.bat --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic Kunde1`

Mit dem Kommando wird die Topic mit Namen `Kunde1` angelegt und nur mit einer Replikation und Partition definiert.
Die Anzahl der Replikationen wird durch die Anzahl der gestarteten Broker beschränkt, während die Anzahl der Partitionen beliebig angegeben werden kann.
Eine Liste aller bereits erstellten Topics wird mit `kafka-topics.bat --list --zookeeper localhost:2181` abgefragt.

Um eine Konfiguration zu testen gibt es weitere Kommandos, die auf der Konsole ausgeführt werden können.
Eine Liste der Befehle kann über die offizielle Dokumentation erreicht werden.

Nachrichten können mit diesem Kommando erstellt werden:

`kafka-console-producer.bat --broker-list localhost:9092 --topic Kunde1`

Dabei wird ein Stream geöffnet, mit der Nachrichten pro Zeile eingegeben werden können.

``` batch
c:\dev\kafka_2.11-2.0.0\bin\windows>kafka-console-producer.bat --broker-list localhost:9092 --topic Kunde1
>Nachricht1
>Nachricht2
>Nachricht3
```

Nachrichten können mit diesem Kommando abgerufen werden.

`kafka-console-consumer.bat --bootstrap-server localhost:9092 --topic Kunde1  --from-beginning`

``` batch
c:\dev\kafka_2.11-2.0.0\bin\windows>kafka-console-consumer.bat --bootstrap-server localhost:9092 --topic Kunde1  --from-beginning
Nachricht1
Nachricht2
Nachricht3
Processed a total of 3 messages
```

# Code-Beispiele

Das folgende sehr einfache Beispiel zeigt die Erstellung von 100 Testnachrichten, die an die Kafka Topic `Kunde1` übergeben werden.
Zunächst werden die Konfiguration zum Kafka-System und die Methode der Daten-Serialisierung angegeben.
Innerhalb der Schleife wird im Anschluss jeweils ein Record erstellt und an das Producer-Objekt übergeben.
Dabei wird die Topic, der Nachrichten-Schlüssel und –Text mitgegeben.
Falls die Nachricht nicht als Text mitgegeben werden soll, muss ein passender Serialisierer angegeben bzw. entwickelt werden.

``` java

public class SimpleProducer
{
    public static void main(String[] args)
    {
        Properties properties = new Properties();
        properties.put("bootstrap.servers", "localhost:9092");
        properties.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
        properties.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");

        KafkaProducer kafkaProducer = new KafkaProducer(properties);

        for(int i = 1; i <= 100; i++)
        {
            System.out.println(String.format("Test Nachricht - %03d", i));
            kafkaProducer.send(new ProducerRecord("Kunde1",
                                                  Integer.toString(i),
                                                  String.format("Test Nachricht - %03d", i)));
        }
        kafkaProducer.close();
    }
}

```

Das folgende sehr einfache Beispiel zeigt das Konsumieren von Testnachrichten aus der Kafka Topic `Kunde1`.
Zunächst werden die Konfiguration zum Kafka-System und die Methode der Daten-Serialisierung angegeben.
Zusätzlich wird die Consumer-Gruppe und Consumer-id übergeben und bestimmt, dass das Commit automatisch durchgeführt werden soll.
Anschließend wird die Liste der Kafka-Topics angegeben, die für diesen Konsumenten von Interesse sind.
Innerhalb der while-Schleife wird eine Liste der neuen Nachrichten abgefragt und in eine lokale Liste geschrieben.
Innerhalb der for-Schleife wird dann jeder Eintrag der Liste auf der Konsole ausgegeben, mit dem Offset, dem Schlüssel und dem Wert.

``` java

public class SimpleConsumer
{
    public static void main(String[] args)
    {
        String topic = "Kunde1";
        Properties properties = new Properties();
        properties.put("bootstrap.servers", "localhost:9092");
        properties.put("group.id", "Kunde1_Gruppe");
        properties.put("enable.auto.commit", "true");
        properties.put("auto.commit.interval.ms", "1000");
        properties.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
        properties.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");

        KafkaConsumer<String, String> kafkaConsumer = new KafkaConsumer<String, String>(properties);
        kafkaConsumer.subscribe(Arrays.asList(topic));

        System.out.println(String.format("Konsumiere Daten aus Topic: '%s'", topic));

        boolean running = true;
        int count = 0;
        try
        {
            while(running)
            {
                ConsumerRecords<String, String> records = kafkaConsumer.poll(100);

                for (ConsumerRecord<String, String> record : records)
                {
                    System.out.println(String.format("Partition = '%s' - Offset = '%s' " +
                                                     "- Schluessel = '%s' - Wert = '%s'",
                                                     record.partition(),
                                                     record.offset(),
                                                     record.key(),
                                                     record.value()));
                }
                System.out.println("Verarbeitung des Stapels beendet. Kurze Pause...");
                Thread.sleep(1000);
            }
        }
        catch (InterruptedException e)
        {
            e.printStackTrace();
        }
        finally
        {
            kafkaConsumer.close();
        }
    }
}

```

# Was ist neu

Die aktuelle Version 2.0 von Kafka bringt ca. 40 neue Features, Kafka Improvement Proposals (KIP) genannt und über 200 Verbesserungen und Korrekturen.
Unter anderem sind dies:
* Eine Unterstützung von definierten Acess Control Listen (ACLs), um die Zugriffskontrolle in größeren Systemen zu vereinfachen.
* Ein Framework für die Authentifizierung von Kafka Brokern mittels OAuth2 Token.
* Anpassung des Replikationsprotokolls um Log-Divergenzen zu vermeiden.
* Die Überprüfung der Hostnamen bei einer SSL Verbindung, um Man-in-the-Middle Angriffen zu vermeiden.
* Die Ausfallsicherheit einzelner Broker wurde erhöht.
* Das Kafka-Connect Framework zur Anbindung von Dritt-Systemen wurde erweitert und verbessert.
* Es ist nun möglich zu entscheiden, wie mit Fehlern im Konnektor und bei der Transformation umgegangen werden soll.
* Kafka-Anbindungen werden informiert bevor es eine Drosselung durch das Erreichen von Quoten gibt.
* Verbesserung von der Testbarkeit von Kafka-Streams.
* Java in Version 7 wird nicht mehr unterstützt

# Stream Processing

Kafka wird oft als Stream-Processing Software bezeichnet, wobei es eher als ein nachrichtenorientiertes System zu sehen ist.
Die Nachrichten werden an Kafka übergeben, verwaltet und für Konsumenten bereitgestellt, aber nicht intern bearbeitet.

Für Stream-Processing, bei der Datenströme aufbereitet und verarbeitet werden,
gibt es eigene speziell dafür entwickelte Systeme wie beispielsweise Apache Spark mit der Erweiterung Spark Streaming,
Apache Storm oder Apache Flink, sowie natürlich auch lizenz- bzw. kostenpflichtige Systeme.

Eine relativ junge Erweiterung von Kafka ist Kafka Streams, mit der Kafka um die Echtzeit-Verarbeitung von Datenströmen erweitert wird.
Dabei werden die Datenströme aus Kafka gelesen, bearbeitet und wieder an Kafka übergeben.
D.h. Kafka kann mit dieser Erweiterung auch in die Bereiche der Stream-Processing Anwendungen gehoben werden.

In diesem Abschnitt schauen wir uns diese Erweiterung exemplarisch an.

Stream-Processing setzt auf Datenströmen auf. Ein Datenstrom kann als eine unendliche Folge von abstrakten
Datenereignissen bzw. Datensätzen beschrieben werden, die ständig durch neue Einträge erweitert wird.
Beispielsweise sind dies Finanztransaktionen, Aktienhandel, Events aus Webseiten oder auch Protokoll-Einträge.

Es gibt weitere Eigenschaften, die bei Datenströmen beachtet werden müssen:

* Reihenfolge: Die Reihenfolge der Einträge des Datenstroms ist obligatorisch und wird während der Verarbeitung eingehalten.
  Dabei muss definiert werden, was mit Einträgen passiert, die später als erwartet auftauchen.
* Unveränderbarkeit: Ein Eintrag des Datenstroms wird nicht mehr verändert.
  Bei einer Verarbeitung wird aus dem Eintrag ein neuer für den nächsten Datenstrom erstellt, wobei das Original unverändert bleibt.
* Wiederverwendbarkeit: Der Datenstrom wird über einen langen Zeitraum gespeichert,
  so dass eine Verarbeitung für andere Zwecke nochmals mit denselben Daten wiederholt werden kann.
* Echtzeit: Der Eintrag eines Datenstroms wird „direkt“ nach dem Auftreten verarbeitet und nicht erst über
  einen längeren Zeitraum gesammelt und in einem Stapel verarbeitet. Damit überein geht auch die Frage nach der Latenz und dem Durchsatz.
  D.h. wann muss der Eintrag verarbeitet werden und wie viele Einträge pro Zeiteinheit werden auftreten.
* Datenquelle und –format: Wie sehen die Einträge des Datenstroms aus und welches System stellt dieser bereit.
  Kann bei der Planung des Systems ein Einfluss auf diese Eigenschaften genommen werden.
* Parallelität: Können die Einträge des Datenstroms parallel verarbeitet werden, um einen höheren Durchsatz zu erreichen.
* Zeitfenster: Bei der Aggregation von Einträgen eines Datenstroms werden oft bestimmte Zeitfenster definiert.
  Beispielsweise werden alle Daten der letzten 5 Minuten gesammelt. Es muss geklärt werden, ob das Zeitfenster dann alle 5 Minuten weiterwandert
  oder unabhängig von der Länge ist. Hier wird die Unterscheidung „tumbling / fixed window“ und „sliding window“ genannt.

In dem hier genutzten Sinne wird Stream-Processing als ein Architektur-Muster gesehen,
bei dem Datenströme in großen Mengen kontinuierlich, und wenn möglich in Echtzeit, verarbeitet werden.

Stream-Processing kann in verschiedene Einsatz-Szenarien unterteilt werden.

### Single-Event Verarbeitung

Beim Single-Event Processing wird jeder Eintrag eines Datenstroms einzeln verarbeitet.
Dabei wird der Eintrag von einem Ersteller an eine Kafka Topic übergeben. Aus dieser wird der Eintrag gelesen und in Kafka verarbeitet.
Im Anschluss wird der Eintrag einem Konsumenten zur Verfügung gestellt.

Beispielsweise kann ein Datenstrom mit Finanzsummen überwacht werden.
Summen, die eine definierte Grenze überschreiten, werden an einen anderen speziellen Stream übergeben. „Normale“ Summen verworfen oder anderweitig verarbeitet.
Ein anderes Beispiel ist die Sammlung von Protokoll-Einträgen aus vielen zusammengehörenden Systemen.
Dabei werden die Datenströme nach der Priorität der Protokoll-Einträge (Info, Warnung, Fehler) unterschieden.

### Verarbeitung mit Statusinformationen

Bei dieser Art der Verarbeitung werden Statusinformationen über die Datenstrom-Einträge hinweg berechnet und gespeichert.
Typischerweise sind dies Aggregats-Funktionen wie Min- Max- oder Durchschnitt.

### Mehrstufige Verarbeitung

Bei der mehrstufigen Verarbeitung können die beiden erstgenannten in verschiedenen Reihenfolgen und Anzahl auftreten.
Beispielsweise werden zunächst mehrere Datenströme mit Aggregats-Funktionen aufbereitet und das berechnete Ergebnis an eine weitere Topic übergeben,
die dann wiederum diese Einträge für eigene Auswertungen bzw. Transformationen nutzt.
Als letztes wird der aggregierte und transformierte Eintrag wiederum einem Konsumenten zur Verfügung gestellt.

Es gibt weitere zu beachtende Fälle wie beispielsweise den Zugriff auf externe Daten oder aber auch die Verarbeitung von Einträgen, die außerhalb der Sortierung auftreten.

# Stream Processing Anwendung

Eine Kafka Streams Processing Anwendung besteht aus einem Konfigurationsteil,
mit dem die Umgebung konfiguriert und angesprochen werden kann und einer sogenannten Topologie.
Eine Topologie besteht dabei aus einer Menge an Methoden und Transformationen die jeder Eintrag eines Datenstroms durchläuft.

Die Skalierung der Anwendung und einzelner Methoden bzw. Transformationen wird dabei von Kafka Streams selber vorgenommen.
Die Anwendung kann in mehreren Task auf einem Server oder aber verteilt ausgeführt werden. Die Verteilung der Daten geschieht transparent im Hintergrund.
Jeder Partition einer Topic kann dabei von einem Task bearbeitet werden.
So ist es beispielsweise möglich eine Topic mit vier Partitionen anzulegen und die Stream-Processing-Anwendung auf vier Server zu verteilen.
Jeder Server bearbeitet dann genau eine Partition.

Falls die Verarbeitung einen Status mitführen muss, so wird dies über einen lokalen Status-Speicher umgesetzt,
der ebenfalls von Kafka verwaltet wird. Der Status kann dabei über eine interne Liste oder aber eine Datenbank abgebildet werden.

Die Steuerung des Stream Processing wird dabei über die Kafka Streams API vorgenommen.
Die API ist eine „einfache“ Java-API in Form einer JAR-Datei, die in die zu erstellende Anwendung integriert werden kann.
D.h. die API läuft im Kontext der eigenen Anwendung und kommuniziert intern mit dem Kafka-System.

Das folgende sehr einfache Beispiel zeigt das Konsumieren von Testnachrichten, aus der Kafka Topic `Kunde1`.

Zunächst werden die Konfiguration zum Kafka-System und die Methode der Daten-Serialisierung angegeben.
Im Anschluss wird ein StreamBuilder angelegt und mit einer Kafka Topic verbunden.
Die Topologie, bestehend aus den Methoden und Transformationen, wird auf dem angelegten StreamBuilder angewendet.

In diesem Beispiel besteht die Topologie aus einem Filter `.filter()`,
einem neuen Mapping des Eintrags `.map()` und der Übergabe an eine Ausgangs-Topic `.to()`.

* Der Filter übernimmt als simples Beispiel nur Einträge, bei denen die ID (Schlüssel) der Nachricht durch 5 teilbar ist.
* Das Mapping schreibt einfach nur den Text „NeuerSchlüssel“ und „NeueNachricht“ vor die alten Werte des Originaleintrags.

Interessant ist, dass die Topologie ein Java-Objekt ist, das zu Testzwecken auch ausgegeben werden kann.
Dadurch können die internen Bearbeitungsschritte zu testzwecken angezeigt werden.

In diesem Beispiel ist das folgendes:

``` java
Topologies:
   Sub-topology: 0
    Source: KSTREAM-SOURCE-0000000000 (topics: [Kunde1])
      --> KSTREAM-FILTER-0000000001
    Processor: KSTREAM-FILTER-0000000001 (stores: [])
      --> KSTREAM-MAP-0000000002
      <-- KSTREAM-SOURCE-0000000000
    Processor: KSTREAM-MAP-0000000002 (stores: [])
      --> KSTREAM-SINK-0000000003
      <-- KSTREAM-FILTER-0000000001
    Sink: KSTREAM-SINK-0000000003 (topic: Kunde2)
      <-- KSTREAM-MAP-0000000002
```

Erkennbar ist, dass der erste Prozessor die Daten aus der Topic `Kunde1` liest,
dann ein Filter- und Mapping-Prozessor eingesetzt werden und zum Schluss
die Daten über den letzten Prozessor an die Topic `Kunde2` übergeben werden.

Die Konfiguration und die Topologie werden zuletzt an ein KafkaStreams-Objekt übergeben und die Bearbeitung gestartet.
Die Anwendung läuft dann solange, bis ein Abbruchkriterium die Anwendung beendet.

``` java
public class SimpleStreamProcessor
{
    public static void main(String[] args)
    {
        Properties KafkaStreamProperties = new Properties();
        KafkaStreamProperties.put(StreamsConfig.APPLICATION_ID_CONFIG, "SimpleStreamProcessor");
        KafkaStreamProperties.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        KafkaStreamProperties.put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().getClass().getName());
        KafkaStreamProperties.put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, Serdes.String().getClass().getName());


        final StreamsBuilder streamsBuilder = new StreamsBuilder();
        KStream<String, String> source = streamsBuilder.stream("Kunde1");

        source.filter((key, value) -> (Long.valueOf(key) % 5) == 0)
                .map((key, value) -> KeyValue.pair("NeuerSchlüssel-"+ key, "NeueNachricht-" + value))
                .to("Kunde2");

        
        
                Topology topology = streamsBuilder.build();
        System.out.println(topology.describe());

        KafkaStreams streams = new KafkaStreams(topology, KafkaStreamProperties);
        streams.start();
    }
}

```

# Fazit

Kafka ist ein hochskalierbares, nachrichtenorientiertes System, das einen einfachen Einstieg ermöglicht,
aber auch in der Lage ist, für große Datenmengen konfiguriert zu werden.

Durch verschiedene APIs und Frameworks, wie beispielsweise Kafka Streams, wird das System um weitere Features erweitert.
Mit den Kafka Streams kann Kafka nun auch als eigenständige Streaming-Plattform betrieben werden, als neue Alternative zu den bekannten Systemen.
