---
layout:			[post, post-xml]											# Pflichtfeld. Nicht ändern!
title:			"Orchestrierung mit Nomad"                                  # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:			2022-10-20 18:00											# Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 	2022-10-20 18:00											# Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author_ids:			[unexist]								                # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: 	[Softwareentwicklung]										# Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags:			[Orchestrierung, Kubernetes, Nomad, Consul, Fabio]	        # Bitte auf Großschreibung achten.
---

Orchestrierung ist in aller Munde und aus vielen Bereichen gar nicht mehr wegzudenken - doch gibt es
neben dem Platzhirschen [Kubernetes][29] eigentlich Alternativen?
Im Zuge dieses Artikels beschäftigen wir uns mit dem Job Scheduler [Nomad][35] aus dem Hause
[HashiCorp][15] und sehen uns anhand von einfachen Beispielen an, welche Möglichkeiten hier geboten
werden.
Anschließend beschäftigen wir uns mit Deployments und fortgeschritteneren Themen wie Service
Discovery und Canary Deployments.

# Was genau ist Nomad?

 Bei [Nomad][35] handelt es sich um einen kleinen Job Scheduler und Orchestrator, der im Gegensatz zu
 [Kubernetes][29] nicht nur Container, sondern über Plugins im Grunde alles mögliche verwalten kann.

Dies wird über [Task Driver][54] realisiert, die sowohl von der Community beigesteuert werden aber
auch direkt von Hause aus mit dabei sind.
Darunter befinden sich neben üblichen Verdächtigen wie [Docker][11] und [Podman][39] auch
beispielsweise ein [Task Driver][54] speziell für [Java-Anwendungen][21] sowie [Raw/Exec][43] für alle
sonstigen ausführbare Anwendungen.

Bevor wir jetzt in ein Beispiel einsteigen, sollten wir kurz über die Konfiguration sprechen.

# Konfiguration ohne YAML

Im Gegensatz zum rein deklarativen Ansatz von [Kubernetes][29], bei dem [YAML][59] Dateien den
gewünschten Zielzustand beschreiben, verwendet [Nomad][35] die hauseigene Konfigurationssprache
[HCL][16].
Ursprünglich für den Einsatz bei [Terraform][56] erdacht bringt sie Logikfunktionen und Operatoren
mit, über die auch komplexe Szenarien abgebildet werden können, sodass ein Einsatz von weiteren
Hilfsmitteln wie [kustomize][30] nicht erforderlich ist.

Natürlich steht mit [Nomad Pack][34] ein vergleichbares Pendant zu [Helm][18] zur Verfügung, sodass
wir auch hier versionierte Artefakte erstellen können.

Hier dazu ein einfaches Beispiel zu [HCL][16]:

```hcl
company = "adesso"
message = "Hallo ${company}"
loud_message = upper(message)
colors = [ "red", "blue" ]
options = {
  color: element(colors, 1),
  amount: 100
}

configuration {
  service "greeter" {
    message = loud_message
    options = var.override_options ? var.override_options : var.options
  }
}
```

> **_NOTE:_** Eine vollständige Dokumentation findest du auf der [offiziellen Projektseite][37].

# Alles über Jobs

[Jobs][25] stellen in [Nomad][35] die eigentliche Arbeitseinheit dar und können über verschiedene Wege
an den Server geschickt werden - dazu aber später mehr.

Grundsätzlich läuft die Einreichung eines [Jobs][25] wie folgt ab:
Nach erfolgter Übermittlung findet zunächst die [Evaluation][13] statt und es werden die notwendigen
Schritte erfasst und aufbereitet.
Anschließend startet die [Allocation][1], hierbei wird ein Ausführplan erstellt und eine
[Task Group][55] angelegt und somit auch die Zuweisung eines [Jobs][25] zu einem aktiven Client erstellt.

> **_NOTE:_** Diese Schritte sollte man zumindest einmal gehört haben, denn sie begegnen einem
durchaus als Status im täglichen Umgang mit [Nomad][35].

## Wie sieht ein Job aus?

[Jobs][25] bzw. die eigentlichen [Job Files][23] bestehen aus verschiedensten Objekten (auch [Stanza][52]
genannt) und lassen sich am einfachsten an konkreten Beispielen erklären.

Als groben Rahmen für die nächsten Abschnitte nutzen wir eine [Quarkus][41]-basierte Backendanwendung,
mit der über eine einfache [REST][45] API Todo-Einträge erstellt und verwaltet werden können.

> **_NOTE:_** Die passende [OpenAPI][38]-Spezifikation zum Beispiel findet ihr [hier][19].

Hier jetzt aber unser erstes [Job File][24]:

```hcl
job "todo" {
  datacenters = ["dc1"] # <1>

  group "web" { # <2>
    count = 1 # <3>

    task "todo" { # <4>
      driver = "java" # <5>

      config { # <6>
        jar_path = "/Users/christoph.kappel/Projects/showcase-nomad-quarkus/target/showcase-nomad-quarkus-0.1-runner.jar"
        jvm_options = ["-Xmx256m", "-Xms256m"]
      }

      resources { # <7>
        memory = 256
      }
    }

    network { # <8>
      port "http" `
        static = 8080
      }
    }
  }
}
```
**<1>** [Nomad][35] teilt Clients in Datacenter auf - ist somit Datacenter-aware.<br />
**<2>** Gruppen können aus verschiedenen Tasks bestehen und werden stets auf demselben Client ausgeführt.<br />
**<3>** Hier starten wir maximal eine Instanz dieser Gruppe.<br />
**<4>** Ein Task stellt die kleinste Einheit in [Nomad][35] dar - vergleichbar mit einem [Pod][40].<br />
**<5>** Der [Java][21] [Task Driver][54] startet ein Jar in einer [JVM][28]-Instanz.<br />
**<6>** Die meisten [Task Driver][54] können konfiguriert werden - hier setzen wir [JVM][28]-Optionen.<br />
**<7>** [Resource Limits][44] können ebenfalls gesetzt werden.<br />
**<8>** Und abschließend setzen wir noch den Netzwerkport - diesen brauchen wir später.<br />

> **_NOTE:_** Für die nächsten Schritte benötigst du eine laufende [Nomad][35]-Instanz - solltest du
hierbei noch Probleme haben, wirf am besten einen Blick in die [offizielle Anleitung][36].

## Wie reiche ich einen Job ein?

Für die meisten Aktionen bei [Nomad][35] stehen folgende drei Wege zur Verfügung:

### Via Browser

Die einfachste Möglichkeit, eine Aktion durchzuführen, ist über den Browser und das mitgelieferte Webinterfaces, welches
direkt nach dem Start von [Nomad][35] unter folgender Adresse erreichbar ist: <http://locahost:4646>

![image](/assets/images/posts/orchestrierung-mit-nomad/web.png)

Über den Knopf **Run Job** oben rechts gelangst du zu einem Dialog, in den du deine [Job][26]
Definition direkt entweder mittels [HCL][16] oder [JSON][27] abschicken kannst.

Mittels **Plan** wird ein Dry-Run ausgeführt und das Ergebnis unmittelbar angezeigt:

![image](/assets/images/posts/orchestrierung-mit-nomad/plan_success.png)

Und abschließend startet **Run** dann das finale Deployment:

![image](/assets/images/posts/orchestrierung-mit-nomad/job_success.png)

### Über die Kommandozeile

Für die [Commandline][7]-Liebhaber unter euch bietet [Nomad][35] natürlich auch hier eine [CLI][6]:

```bash
$ nomad job plan jobs/todo-java.nomad
+ Job: "todo"
+ Task Group: "web" (1 create)
  + Task: "todo" (forces create)

Scheduler dry-run:
- All tasks successfully allocated.

$ nomad job run jobs/todo-java.nomad
==> 2022-07-18T17:48:36+02:00: Monitoring evaluation "2c21d49b"
    2022-07-18T17:48:36+02:00: Evaluation triggered by job "todo"
==> 2022-07-18T17:48:37+02:00: Monitoring evaluation "2c21d49b"
    2022-07-18T17:48:37+02:00: Evaluation within deployment: "83abca16"
    2022-07-18T17:48:37+02:00: Allocation "d9ec1c42" created: node "d419df0b", group "web"
    2022-07-18T17:48:37+02:00: Evaluation status changed: "pending" -> "complete"
==> 2022-07-18T17:48:37+02:00: Evaluation "2c21d49b" finished with status "complete"
==> 2022-07-18T17:48:37+02:00: Monitoring deployment "83abca16"
  ✓ Deployment "83abca16" successful

    2022-07-18T17:48:47+02:00
    ID          = 83abca16
    Job ID      = todo
    Job Version = 0
    Status      = successful
    Description = Deployment completed successfully

    Deployed
    Task Group  Desired  Placed  Healthy  Unhealthy  Progress Deadline
    web         1        1       1        0          2022-07-18T17:58:46+02:00
```

> **_NOTE:_** Die verwendeten [Nomad][35]-Beispiel könnt ihr auch direkt hier finden:
<https://github.com/unexist/showcase-nomad-quarkus/tree/master/deployment/jobs>

### Über die API

Und analog zu [Kubernetes][29] können wir auch direkt die [Job API][22] ansprechen - beispielsweise
mittels [curl][9]:

```bash
$ curl --request POST --data @jobs/todo-java.json http://localhost:4646/v1/jobs
{"EvalCreateIndex":228,"EvalID":"bd809b77-e2c6-c336-c5ca-0d1c15ff6cce","Index":228,"JobModifyIndex":228,"KnownLeader":false,"LastContact":0,"NextToken":"","Warnings":""}
```

> **_NOTE:_** Und die entsprechende [JSON][27]-Variante findet ihr schließlich hier:
<https://github.com/unexist/showcase-nomad-quarkus/blob/master/deployment/jobs/todo-java.json>

Alle genannten Wege übermitteln unseren [Job][26] an [Nomad][35] und starten dann eine einzelne Instanz
auf einem Client des [Datacenters][10] `dc1`.

## Status eines Jobs überprüfen

Auskunft über den Status eines Jobs bekommen wir direkt über das Webinterface, aber natürlich können wir in
auch in gewohnter Weise den Status unseres [Jobs][25] über die [Commandline][7] erfragen:

```bash
$ nomad job status
ID    Type     Priority  Status   Submit Date
todo  service  50        running  2022-07-18T17:48:36+02:00
```

Alternativ können wir natürlich auch direkt auf unseren [REST][45] Service zugreifen - beispielsweise
erneut via [curl][9]:

```bash
$ curl -v -H "Accept: application/json" http://localhost:8080/todo
*   Trying ::1...
* TCP_NODELAY set
* Connected to localhost (::1) port 8080 (#0)
> GET /todo HTTP/1.1
> Host: localhost:8080
> User-Agent: curl/7.64.1
> Accept: application/json
`
< HTTP/1.1 204 No Content
<
* Connection #0 to host localhost left intact
* Closing connection 0
```

## Jobs stoppen

Und ebenso leicht können wir unseren Job auch wieder stoppen:

```
$ nomad job stop todo
==> 2022-07-18T18:04:55+02:00: Monitoring evaluation "efe42497"
    2022-07-18T18:04:55+02:00: Evaluation triggered by job "todo"
==> 2022-07-18T18:04:56+02:00: Monitoring evaluation "efe42497"
    2022-07-18T18:04:56+02:00: Evaluation within deployment: "577c3e71"
    2022-07-18T18:04:56+02:00: Evaluation status changed: "pending" -> "complete"
==> 2022-07-18T18:04:56+02:00: Evaluation "efe42497" finished with status "complete"
==> 2022-07-18T18:04:56+02:00: Monitoring deployment "577c3e71"
  ✓ Deployment "577c3e71" successful

    2022-07-18T18:04:56+02:00
    ID          = 577c3e71
    Job ID      = todo
    Job Version = 2
    Status      = successful
    Description = Deployment completed successfully

    Deployed
    Task Group  Desired  Placed  Healthy  Unhealthy  Progress Deadline
    web         1        1       1        0          2022-07-18T18:12:24+02:00
```

# Themen für Fortgeschrittene

Bisher haben wir uns mit den Basics beschäftigt und können jetzt einfache [Jobs][25] anlegen, starten
und auch wieder stoppen.
Darauf aufbauend beschäftigen wir uns jetzt im nächsten Abschnitt mit fortgeschrittenen Themen -
alleine schon damit sich der angestrebte Vergleich mit [Kubernetes][29] auch sehen lassen kann.

## Scaling out

Für einfache Anwendungsfälle reicht diese einzelne Instanz vollkommen aus, allerdings stoßen wir
damit im Berufsalltag natürlich schnell an eine Grenze.

Bisher haben wir über den Parameter `count = 1` eine Maximalanzahl von einer Instanz vorgegeben
und vermutlich wird es niemanden überraschen, aber natürlich können hier beliebige Werte eingesetzt
werden - beispielsweise `5`:

```hcl
group "web" {
  count = 5
}
```

Da es grundsätzlich nicht schadet, bei allen Änderungen einen **Dry-Run** durchzuführen, und man mit
guten Gewohnheiten nicht früh genug loslegen kann - machen wir das auch direkt:

![image](/assets/images/posts/orchestrierung-mit-nomad/plan_failure.png)

Dieser Fehler kommt jetzt gänzlich unerwartet, denn schließlich haben wir in unserem [Job][26]
lediglich **einen** einzelnen statischen Port festgelegt und streben hier ein Deployment von
**fünf** Instanzen auf einem einzelnen Client an.
Dies kann natürlich nicht funktionieren, [Nomad][35] weist uns hier folgerichtig auf dieses Problem
hin.

Abhilfe schafft hier [Dynamic Port Mapping][12], welches für uns dynamische Ports anlegt und unseren
Instanzen dann automatisch zuweist.

Auf unserer Seite sind dazu lediglich zwei kleinere Anpassungen notwendig:

1. Zunächst entfernen wir unseren statischen Port:

    ```hcl
    network {
      port "http" {}
    }
    ```

2. Und anschließend teilen wir unserer [Quarkus][41]-Anwendung noch mit, unter welchem Port sie jetzt
genau erreichbar ist.
Eine der einfachsten Möglichkeiten ist hier, über [Umgebungsvariablen][57] zu arbeiten:

    ```hcl
    config {
      jar_path = "/U`ers/christoph.kappel/Projects/showcase-nomad-quarkus/target/showcase-nomad-quarkus-0.1-runner.jar"
      jvm_options = [
        "-Xmx256m", "-Xms256m",
        "-Dquarkus.http.port=${NOMAD_PORT_http}" # <1>
      ]
    }
    ```
    **<1>** Hier verwenden wir eine [Magic Variable][33] von [Nomad][35], die den passenden dynamischen Port enthält.

Lassen wir nach diesen beiden Änderungen erneut einen **Dry-Run** laufen, sehen wir folgendes:

![image](/assets/images/posts/orchestrierung-mit-nomad/plan_update_scale.png)

Und wenn wir das Deployment schließlich über **Run** ausführen, sehen wir nach ein paar Sekunden
unsere **fünf** Instanzen:

![image](/assets/images/posts/orchestrierung-mit-nomad/update_success.png)

Sinnvollerweise sollten wir jetzt als nächstes irgendeine Art von [Load Balancer][32] vor unsere
fünf Instanzen schalten, damit diese erreicht werden können und natürlich die Last gleichmäßig verteilt werden
kann.

Dies bedeutet in den meisten Fällen manuelle Arbeit beim Einrichten der Ports und ein Zusammentragen
der Adressen.
Da es sich hierbei aber auch wieder um ein für uns bereits gelöstes Problem handelt, können wir auf eine
bewährte Lösung zurückgreifen.

## Service Discovery

Bei [Service Discovery][48] handelt es sich im Grunde um einen Katalog, bei dem sich Anwendungen mit
ihren bereitgestellten Diensten registrieren und bei dem andere Anwendungen dann Informationen über
bekannte Dienste einholen können.

Hierfür stehen wieder zahlreiche Alternativen zur Verfügung, eine der bekannteren mit hervorragender
Integration und ebenfalls aus dem Hause [HashiCorp][15] ist [Consul][8].

Wir könnten [Consul][8] jetzt regulär auf unserem System installieren, aber zur Übung verwenden wir
die [Artifact][2] Stanza und lassen [Nomad][35] die Anwendung direkt aus dem Internet laden und
direkt über den [Raw/Exec][43] Driver ausführen:

```hcl
job "consul" {
  datacenters = ["dc1"]

  group "consul" {
    count = 1

    task "consul" {
      driver = "raw_exec" # <1>

      config {
        command = "consul"
        args    = ["agent", "-dev"]
      }

      artifact { # <2>
        source = "https://releases.hashicorp.com/consul/1.12.3/consul_1.12.3_darwin_amd64.zip"
      }
    }
  }
}
```
**<1>** Zunächst benötigen wir einen neuen Task mit dem [Raw/Exec][43] Driver. <br />
**<2>** Und anschließend legen wir die Source unseres Artefakts fest.

Mittlerweile sollte das Deployment dieses Jobs ziemlich selbsterklärend sein:

```bash
$ nomad job run jobs/consul.nomad
==> 2022-07-20T12:15:24+02:00: Monitoring evaluation "eb0330c5"
    2022-07-20T12:15:24+02:00: Evaluation triggered by job "consul"
    2022-07-20T12:15:24+02:00: Evaluation within deployment: "c16677f8"
    2022-07-20T12:15:24+02:00: Allocation "7d9626b8" created: node "68168a84", group "consul"
    2022-07-20T12:15:24+02:00: Evaluation status changed: "pending" -> "complete"
==> 2022-07-20T12:15:24+02:00: Evaluation "eb0330c5" finished with status "complete"
==> 2022-07-20T12:15:24+02:00: Monitoring deployment "c16677f8"
  ✓ Deployment "c16677f8" successful

    2022-07-20T12:15:36+02:00
    ID          = c16677f8
    Job ID      = consul
    Job Version = 0
    Status      = successful
    Description = Deployment completed successfully

    Deployed
    Task Group  Desired  Placed  Healthy  Unhealthy  Progress Deadline
    consul      1        1       1        0          2022-07-20T12:25:34+02:00
```

Nach ein paar Sekunden sollte [Consul][8] dann gestartet und über folgende URL im Browser aufrufbar sein
<http://localhost:8500>:

![image](/assets/images/posts/orchestrierung-mit-nomad/consul_services_nomad.png)

Alle bekannten Services werden dann auf dem **Services**-Reiter aufgeführt - dazu zählen [Consul][8]
selbst und [Nomad][35] - allerdings leider Fehlanzeige was unsere Instanzen betrifft.

Zum jetzigen Zeitpunkt sind die Services unserer Instanzen für [Nomad][35] noch unbekannt und es
müssen weitere Informationen nachgeliefert werden.

Diese liefern wir dann über die [Service][51] Stanza nach:

```hcl
service {
  name = "todo"
  port = "http"

  tags = [
    "urlprefix-/todo", # <1>
  ]

  check { # <2>
    type     = "http"
    path     = "/"
    interval = "2s"
    timeout  = "2s"
  }
}
```
**<1>** [Nomad][35] erlaubt es, [Tags][53]s zu vergeben, die sich in etwa so verhalten wie [Label][31] bei [Kubernetes][29].
Was es mit diesem konkreten [Tag][53] auf sich hat, erfahrt ihr im nächsten Kapitel.<br />
**<2>** Über das [Check][5] Stanza legen wir fest, wie [Healthchecks][17] durchführt werden.

Danach führen wir schnell noch einen neuen **Dry-Run** aus, um weitere Überraschungen auszuschließen:

![image](/assets/images/posts/orchestrierung-mit-nomad/plan_update_service.png)

Hier werden dann noch einmal alle Parameter aufgeführt und man bekommt eine Idee, was für weitere
Konfigurationsmöglichkeiten obige Stanza noch mitbringt.

Haben wir alles überprüft, können wir den [Job][26] ausführen und sehen dann hoffentlich nach kurzer
Zeit neue Einträge in [Consul][8]:

![image](/assets/images/posts/orchestrierung-mit-nomad/consul_services_todo.png)

> **_NOTE:_** Diese Übersicht liefert uns dann auch direkt die Port Bindings unserer Instanzen.

Das ist auch geschafft - fehlt noch Traffic auf unseren Instanzen.

## Load-balancing

Für den nächsten Teil greifen wir abermals auf ein weiteres Tool zurück, da wir hier den
Aufgabenbereich von [Nomad][35] verlassen.

Eine der einfachsten Lösungen und mit ebenfalls exzellenter Integration in [Nomad][35] und
[Consul][8] ist der Proxy [Fabio][14].

In gewohnter Manie können wir uns auch hier zurücklehnen und [Nomad][35] die Arbeit überlassen:

```hcl
job "fabio" {
  datacenters = ["dc1"]

  group "fabio" {
    count = 1

    task "fabio" {
      driver = "raw_exec"
      config {
        command = "fabio"
        args    = ["-proxy.strategy=rr"] # <1>
      }
      artifact {
        source      = "https://github.com/fabiolb/fabio/releases/download/v1.6.1/fabio-1.6.1-darwin_amd64"
        destination = "local/fabio"
        mode        = "file"
      }
    }
  }
}
```
**<1>** Hiermit legen wir [Round-Robin][47] als Verteilungsstrategie fest.

Ein kurzer **Dry-Run** gefolgt von einem Deployment und schon sehen wir [Fabio][14] in der Liste
der bekannten Services:

```bash
$ nomad job plan jobs/fabio.nomad
+ Job: "fabio"
+ Task Group: "fabio" (1 create)
  + Task: "fabio" (forces create)

Scheduler dry-run:
- All tasks successfully allocated.

$ nomad job run jobs/fabio.nomad
==> 2022-07-19T15:53:33+02:00: Monitoring evaluation "eb13753c"
    2022-07-19T15:53:33+02:00: Evaluation triggered by job "fabio"
    2022-07-19T15:53:33+02:00: Allocation "d923c41d" created: node "dd051c02", group "fabio"
==> 2022-07-19T15:53:34+02:00: Monitoring evaluation "eb13753c"
    2022-07-19T15:53:34+02:00: Evaluation within deployment: "2c0db725"
    2022-07-19T15:53:34+02:00: Evaluation status changed: "pending" -> "complete"
==> 2022-07-19T15:53:34+02:00: Evaluation "eb13753c" finished with status "complete"
==> 2022-07-19T15:53:34+02:00: Monitoring deployment "2c0db725"
  ✓ Deployment "2c0db725" successful

    2022-07-19T15:53:46+02:00
    ID          = 2c0db725
    Job ID      = fabio
    Job Version = 0
    Status      = successful
    Description = Deployment completed successfully

    Deployed
    Task Group  Desired  Placed  Healthy  Unhealthy  Progress Deadline
    fabio       1        1       1        0          2022-07-19T16:03:45+02:00
```

![image](/assets/images/posts/orchestrierung-mit-nomad/consul_services_fabio.png)

Sprechen wir jetzt [Fabio][14] über den Defaultport `9999` an, bekommen wir erneut die altbekannte
Ausgabe:

```bash
$ curl -v -H "Accept: application/json" http://localhost:9999/todo
*   Trying ::1...
* TCP_NODELAY set
* Connected to localhost (::1) port 9999 (#0)
> GET /todo HTTP/1.1
> Host: localhost:9999
> User-Agent: curl/7.64.1
> Accept: application/json
>
< HTTP/1.1 204 No Content
<
* Connection #0 to host localhost left intact
* Closing connection 0
```

Wenn wir das ganze jetzt wiederholen, sollte [Fabio][14] theoretisch die Last gleichmäßig auf unsere
Instanzen verteilen, allerdings würden wir davon derzeit nichts mitbekommen.

Ein einfacher Trick hier ist, einen neuen [HTTP Header][20] zu setzen, der die entsprechende
IP-Adresse und den Port der Instanz enthält:

```hcl
config {
  jar_path = "/Users/christoph.kappel/Projects/showcase-nomad-quarkus/target/showcase-nomad-quarkus-0.1-runner.jar"
  jvm_options = [
    "-Xmx256m", "-Xms256m",
    "-Dquarkus.http.port=${NOMAD_PORT_http}",
    "-Dquarkus.http.header.TodoServer.value=${NOMAD_IP_http}:${NOMAD_PORT_http}", # <1>
    "-Dquarkus.http.header.TodoServer.path=/todo",
    "-Dquarkus.http.header.TodoServer.methods=GET"
  ]
}
```
**<1>** Wir verwenden hier eine weitere [Magic Variable][33] und befüllen damit unseren neuen
[HTTP Header][20].

Vermutlich könnt ihr euch die nächsten Schritte denken, daher das ganze im Schnelldurchlauf:

```bash
$ nomad job plan jobs/todo-java-scaled-service-header.nomad
+/- Job: "todo"
+/- Task Group: "web" (1 create/destroy update, 4 ignore)
  +/- Task: "todo" (forces create/destroy update)
    +/- Config {
        jar_path:       "/Users/christoph.kappel/Projects/showcase-nomad-quarkus/target/showcase-nomad-quarkus-0.1-runner.jar"
        jvm_options[0]: "-Xmx256m"
        jvm_options[1]: "-Xms256m"
        jvm_options[2]: "-Dquarkus.http.port=${NOMAD_PORT_http}"
      + jvm_options[3]: "-Dquarkus.http.header.TodoServer.value=${NOMAD_IP_http}:${NOMAD_PORT_http}"
      + jvm_options[4]: "-Dquarkus.http.header.TodoServer.path=/todo"
      + jvm_options[5]: "-Dquarkus.http.header.TodoServer.methods=GET"
        }

$ nomad job run jobs/todo-java-scaled-service-header.nomad
==> 2022-07-20T17:03:39+02:00: Monitoring evaluation "909df36e"
    2022-07-20T17:03:39+02:00: Evaluation triggered by job "todo"
==> 2022-07-20T17:03:40+02:00: Monitoring evaluation "909df36e"
    2022-07-20T17:03:40+02:00: Evaluation within deployment: "409e814e"
    2022-07-20T17:03:40+02:00: Allocation "03e95d99" created: node "9293fb2f", group "web"
    2022-07-20T17:03:40+02:00: Evaluation status changed: "pending" -> "complete"
==> 2022-07-20T17:03:40+02:00: Evaluation "909df36e" finished with status "complete"
==> 2022-07-20T17:03:40+02:00: Monitoring deployment "409e814e"
  ✓ Deployment "409e814e" successful

    2022-07-21T14:38:50+02:00
    ID          = 409e814e
    Job ID      = todo
    Job Version = 2
    Status      = successful
    Description = Deployment completed successfully

    Deployed
    Task Group  Desired  Placed  Healthy  Unhealthy  Progress Deadline
    web         5        5       5        0          2022-07-20T17:14:49+02:00

Scheduler dry-run:
- All tasks successfully allocated.
```

Testen wir das ganze nach erfolgreichem Deployment, sehen wir, wie die verschiedenen
Instanzen der Reihe nach angesprochen werden:

![image](/assets/images/posts/orchestrierung-mit-nomad/loadbalancer.gif)

Falls ihr euch jetzt fragt weshalb, das ganze überhaupt ohne weitere Konfiguration funktioniert:

Einer der großen Vorteile von [Fabio][14] ist, Routen können über [Service Tags][49] festgelegt werden.
Und schaut ihr jetzt genau hin, haben wir dies in unseren Beispielen auch schon gemacht:
`urlprefix-/todo`

Über diesen [Service Tag][50] teilen wir [Fabio][14] mit, wie es mit Requests für die Route `/todo`
umgehen und anhand der konfigurierten Strategie verteilen soll.

> **_NOTE:_** Weitere Konfigurationsmöglichkeiten findet ihr im entsprechenden [Quickstart Guide][42].

## Update Strategien

Unsere Anwendung läuft jetzt erfolgreich auf einem einzelnen Client und wir haben sowohl die
Ausfallwahrscheinlichkeit reduziert als auch Lastverteilung eingeführt, indem wir unsere fünf
Instanzen in einem gemeinsamen [Load-Balancer][32]-Verbund zusammengefasst haben.

Soweit, so gut - aber wie können wir hier jetzt am geschicktesten Updates durchführen?

Grundsätzlich stehen dafür verschiedene Ansätze zur Verfügung und der einfachste ist natürlich, alle Instanzen
in einem Rutsch zu aktualisieren.

> **_NOTE:_** Hier spricht man auch von [Batch Size][3] und diese wäre in unserem Beispiel `5`.

Wählen wir diesen Ansatz, negieren wir vermutlich einige der vorhin angesprochenen Vorteile und
enden im Fehlerfall möglicherweise mit einer zu geringen Anzahl an Instanzen für unseren Workload.
Ein besserer Ansatz hier ist, eine möglichst kleine [Batch Size][3] zu wählen und die Instanzen
rollend - sprich nach und nach - zu aktualisieren.

Standardmäßig führt [Nomad][35] ein [Rolling Update][46] durch, allerdings lassen sich viele weitere
Strategien über das [Update][58] Stanza realisieren.


```hcl
update {
  canary       = 1 # <1>
  max_parallel = 5 # <2>
}
```
**<1>** Dies legt die Anzahl der Instanzen fest, die in einem [Canary Update][4] aktualisiert werden.<br />
**<2>** Und hiermit wird die [Batch Size][3] des Updates festgelegt.

Bevor wir jetzt als einfaches Beispiel ein [Canary Update][4] durchführen, sollten wir noch einmal
kurz in uns gehen und überlegen, wie wir sicherstellen können, dass ein Update den gewünschten
Erfolg gebracht hat.

Ein [Canary Update][4] mit `canary = 1` bedeutet, unser Orchestrator startet eine neue Instanz und
wartet anschließend auf die Bestätigung, fortzufahren.
Bei unserer Aufgabe zu prüfen, ob diese neue Instanz ordnungsgemäß funktioniert, laufen
aber natürlich wieder in die altbekannte Problematik.

Vorhin hat der Trick mit dem [HTTP Header][20] hervorragend geklappt - nutzen wir die Idee also
erneut:

```hcl
config {
  jar_path = "/Users/christoph.kappel/Projects/showcase-nomad-quarkus/target/showcase-nomad-quarkus-0.1-runner.jar"
  jvm_options = [
    "-Xmx256m", "-Xms256m",
    "-Dquarkus.http.port=${NOMAD_PORT_http}",
    "-Dquarkus.http.header.TodoServer.value=${NOMAD_IP_http}:${NOMAD_PORT_http}",
    "-Dquarkus.http.header.TodoServer.path=/todo",
    "-Dquarkus.http.header.TodoServer.methods=GET",
    "-Dquarkus.http.header.TodoServerCanary.value=yes", # <1>
    "-Dquarkus.http.header.TodoServer.path=/todo",
    "-Dquarkus.http.header.TodoServer.methods=GET"
  ]
}
```
**<1>** Unser neuer [HTTP Header][20] für das Update.

Wir führen erneut einen **Dry-Run** gefolgt von einem Deployment aus:

```bash
$ nomad job plan jobs/todo-java-scaled-service-header-canary.nomad
+/- Job: "todo"
+/- Task Group: "web" (1 canary, 5 ignore)
  +/- Update {
        AutoPromote:      "false"
        AutoRevert:       "false"
    +/- Canary:           "0" => "1"
        HealthCheck:      "checks"
        HealthyDeadline:  "300000000000"
    +/- MaxParallel:      "1" => "5"
        MinHealthyTime:   "10000000000"
        ProgressDeadline: "600000000000"
      }
  +/- Task: "todo" (forces create/destroy update)
    +/- Config {
        jar_path:       "/Users/christoph.kappel/Projects/showcase-nomad-quarkus/target/showcase-nomad-quarkus-0.1-runner.jar"
        jvm_options[0]: "-Xmx256m"
        jvm_options[1]: "-Xms256m"
        jvm_options[2]: "-Dquarkus.http.port=${NOMAD_PORT_http}"
        jvm_options[3]: "-Dquarkus.http.header.TodoServer.value=${NOMAD_IP_http}:${NOMAD_PORT_http}"
        jvm_options[4]: "-Dquarkus.http.header.TodoServer.path=/todo"
        jvm_options[5]: "-Dquarkus.http.header.TodoServer.methods=GET"
      + jvm_options[6]: "-Dquarkus.http.header.TodoServerCanary.value=yes"
      + jvm_options[7]: "-Dquarkus.http.header.TodoServer.path=/todo"
      + jvm_options[8]: "-Dquarkus.http.header.TodoServer.methods=GET"
        }

Scheduler dry-run:
- All tasks successfully allocated.

$ nomad job run jobs/todo-java-scaled-service-header-canary.nomad
==> 2022-07-20T17:11:53+02:00: Monitoring evaluation "43bdfab2"
    2022-07-20T17:11:53+02:00: Evaluation triggered by job "todo"
    2022-07-20T17:11:53+02:00: Allocation "4963b7fc" created: node "9293fb2f", group "web"
==> 2022-07-20T17:11:54+02:00: Monitoring evaluation "43bdfab2"
    2022-07-20T17:11:54+02:00: Evaluation within deployment: "a0c1e782"
    2022-07-20T17:11:54+02:00: Allocation "4963b7fc" status changed: "pending" -> "running" (Tasks are running)
    2022-07-20T17:11:54+02:00: Evaluation status changed: "pending" -> "complete"
==> 2022-07-20T17:11:54+02:00: Evaluation "43bdfab2" finished with status "complete"
==> 2022-07-20T17:11:54+02:00: Monitoring deployment "a0c1e782"
  ⠇ Deployment "a0c1e782" in progress...

    2022-07-21T15:12:10+02:00
    ID          = a0c1e782
    Job ID      = todo
    Job Version = 6
    Status      = running
    Description = Deployment is running but requires manual promotion

    Deployed
    Task Group  Promoted  Desired  Canaries  Placed  Healthy  Unhealthy  Progress Deadline
    web         false     5        1         1       1        0          2022-07-20T17:22:06+02:00
```

Der spannende Teil hier ist, dass [Nomad][35] das Deployment unterbricht und wir die nötige Zeit
bekommen, um zu prüfen, ob unsere neue Version ordnungsgemäß funktioniert:

![image](/assets/images/posts/orchestrierung-mit-nomad/canary.gif)

Haben wir uns davon ausreichend überzeugt, können wir [Nomad][35] anweisen, das Deployment fortzusetzen
und auch die verbleibenden Instanzen auszurollen.
Hierfür stehen uns wie bisher verschiedene Wege zur Verfügung, allerdings ist dies im Webinterface
sehr anschaulich:

![image](/assets/images/posts/orchestrierung-mit-nomad/promote_canary.png)

Mit **Promote Canary** setzen wir das unterbrochene Deployment dann schließlich fort:

![image](/assets/images/posts/orchestrierung-mit-nomad/promote_canary_success.png)

# Fazit

[Nomad][35] ist ein einfacher und flexibler [Job][26] Scheduler, der durch die Integration weiterer
Produkte praxistaugliche Lösungen für gängige Probleme liefert und sich somit in keiner Weise
hinter dem großen Bruder [Kubernetes][29] verstecken muss.

Sämtliche Beispiele dieses Beitrags könnt ihr in folgendem Repository einsehen:

<https://github.com/unexist/showcase-nomad-quarkus>

[1]: https://www.nomadproject.io/docs/concepts/scheduling/scheduling
[2]: https://www.nomadproject.io/docs/job-specification/artifact#artifact-stanza=
[3]: https://en.wikipedia.org/wiki/Batch_processing
[4]: https://martinfowler.com/bliki/CanaryRelease.html
[5]: https://www.nomadproject.io/docs/job-specification/check#check-stanza=
[6]: https://en.wikipedia.org/wiki/Command-line_interface
[7]: https://en.wikipedia.org/wiki/Command-line_interface
[8]: https://www.consul.io/
[9]: https://curl.se/
[10]: https://developer.hashicorp.com/nomad/docs/concepts/architecture
[11]: https://www.nomadproject.io/docs/drivers/docker
[12]: https://www.nomadproject.io/docs/job-specification/network#dynamic-ports=
[13]: https://developer.hashicorp.com/nomad/docs/concepts/scheduling/scheduling
[14]: https://fabiolb.net/
[15]: https://www.hashicorp.com/
[16]: https://github.com/hashicorp/hcl
[17]: https://microservices.io/patterns/observability/health-check-api.html
[18]: https://helm.se
[19]: https://blog.unexist.dev/redoc/
[20]: https://en.wikipedia.org/wiki/List_of_HTTP_header_fields
[21]: https://www.nomadproject.io/docs/drivers/java
[22]: https://www.nomadproject.io/api-docs/jobs
[23]: https://www.nomadproject.io/docs/job-specification/resources
[24]: https://www.nomadproject.io/docs/job-specification/resources
[25]: https://www.nomadproject.io/docs/job-specification/job
[26]: https://www.nomadproject.io/docs/job-specification/job
[27]: https://www.json.org/json-en.html
[28]: https://en.wikipedia.org/wiki/Java_virtual_machine
[29]: https://kubernetes.io/
[30]: https://kustomize.io/
[31]: https://developer.hashicorp.com/nomad/docs/job-specification
[32]: https://en.wikipedia.org/wiki/Load_balancing_(computing)
[33]: https://developer.hashicorp.com/nomad/docs/runtime/interpolation
[34]: https://learn.hashicorp.com/tutorials/nomad/nomad-pack-intro
[35]: https://www.nomadproject.io
[36]: https://learn.hashicorp.com/tutorials/nomad/get-started-intro
[37]: https://github.com/hashicorp/hcl/blob/main/hclsyntax/spec.md
[38]: https://www.openapis.org/
[39]: https://developer.hashicorp.com/nomad/plugins/drivers/podman
[40]: https://kubernetes.io/docs/concepts/workloads/pods/
[41]: https://quarkus.io
[42]: https://fabiolb.net/quickstart/
[43]: https://www.nomadproject.io/docs/drivers/raw_exec
[44]: https://developer.hashicorp.com/nomad/docs/job-specification/resources
[45]: https://en.wikipedia.org/wiki/Representational_state_transfer
[46]: https://en.wikipedia.org/wiki/Rolling_release
[47]: https://en.wikipedia.org/wiki/Round-robin_scheduling
[48]: https://en.wikipedia.org/wiki/Service_discovery
[49]: https://developer.hashicorp.com/consul/docs/discovery/services
[50]: https://developer.hashicorp.com/consul/docs/discovery/services
[51]: https://www.nomadproject.io/docs/job-specification/service
[52]: https://en.wikipedia.org/wiki/Stanza
[53]: https://developer.hashicorp.com/consul/docs/discovery/services
[54]: https://www.nomadproject.io/docs/internals/plugins/task-drivers
[55]: https://www.nomadproject.io/docs/job-specification/group
[56]: https://terraform.io
[57]: https://en.wikipedia.org/wiki/Environment_variable
[58]: https://www.nomadproject.io/docs/job-specification/update
[59]: https://yaml.org/