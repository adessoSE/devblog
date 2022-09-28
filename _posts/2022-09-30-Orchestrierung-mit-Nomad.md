---
layout:			[post, post-xml]											# Pflichtfeld. Nicht ändern!
title:			"Orchestrierung mit Nomad"                                  # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:			2022-09-30 12:00											# Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 	2022-09-30 12:00											# Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author_ids:			[unexist]								                # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: 	[Softwareentwicklung]										# Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags:			[Orchestrierung, Kubernetes, Nomad, Consul, Fabio]	        # Bitte auf Großschreibung achten.
---

Orchestrierung ist in aller Munde und aus vielen Bereichen gar nicht mehr wegzudenken - doch gibt es
neben dem Platzhirschen [Kubernetes][] eigentlich Alternativen?

Im Zuge dieses Artikels beschäftigen wir uns mit dem Job Scheduler [Nomad][] aus dem Hause
[HasiCorp][] und sehen uns anhand von einfachen Beispielen an welche Möglichkeiten hier geboten
werden.
Anschließend beschäftigen wir uns mit Deployments und fortgeschritteneren Themen wie Service
Discovery und Canary Deployments.

## Was genau ist Nomad?

 Bei [Nomad][] handelt es sich um einen kleinen Job Scheduler und Orchestrator, der im Gegensatz zu
 [Kubernetes][] nicht nur Container, sondern über Plugins im Grunde alles mögliche verwalten kann.

Dies wird über [Task Driver][] realisiert, die teils von der Community beigesteuert werden aber
auch teils von Hause aus direkt mit dabei sind.
Darunter befinden sich die neben üblichen Verdächtigen wie [Docker][] und [Podman][], aber auch
speziell einer für [Java][] Anwendungen sowie für sonstige Anwendungen über [Raw/Exec][].

Bevor wir jetzt in ein Beispiel einsteigen sollten wir kurz über die Konfiguration sprechen.

## Konfiguration ohne YAML

Im Gegensatz zum rein deklarativem Ansatz von [Kubernetes][], bei dem [YAML][] Dateien den
gewünschten Zielzustand beschreiben, erlaubt [Nomad][] durch den Einsatz der eigenen
Skriptsprache [HCL][] den Einsatz von Logik und Kontrollstrukturen.
Ursprünglich für die Konfiguration in [Terraform][] entwickelt, kommt [HCL][] nicht als Aufsatz
wie beispielsweise [jsonnet][] daher und macht den Einsatz von Hilfen wie beispielsweise
[kustomize][] überflüssig.

Natürlich gibt es mit [Nomad Pack][] ein vergleichbares Pendant zu [Helm][] und sämtliche
Operationen können hier ebenfalls über die [API][] vorgenommen werden.

Hier ein kurzes Beispiel zu [HCL][]:

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

 Eine vollständige Dokumentation befindet sich auf der [offiziellen Projekteseite][].

## Jobs

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

### Wie startet man einen Job?

#### Via Browser

![image](/assets/images/posts/orchestrierung-mit-nomad/web.png)

![image](/assets/images/posts/orchestrierung-mit-nomad/plan_success.png)

![image](/assets/images/posts/orchestrierung-mit-nomad/job_success.png)

#### Über die Kommandozeile

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

#### Über die API

```bash
$ curl --request POST --data @jobs/todo-java.json http://localhost:4646/v1/jobs
{"EvalCreateIndex":228,"EvalID":"bd809b77-e2c6-c336-c5ca-0d1c15ff6cce","Index":228,"JobModifyIndex":228,"KnownLeader":false,"LastContact":0,"NextToken":"","Warnings":""}
```

### Status eines Jobs überprüfen

```bash
$ nomad job status
ID    Type     Priority  Status   Submit Date
todo  service  50        running  2022-07-18T17:48:36+02:00
```

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

### Jobs stoppen

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

## Themen für Fortgeschrittene

### Scaling out

```hcl
group "web" {
  count = 5
}
```

```hcl
network {
  port "http" {}
}
```

```hcl
config {
  jar_path = "/U`ers/christoph.kappel/Projects/showcase-nomad-quarkus/target/showcase-nomad-quarkus-0.1-runner.jar"
  jvm_options = [
    "-Xmx256m", "-Xms256m",
    "-Dquarkus.http.port=${NOMAD_PORT_http}" # <1>
  ]
}
```

![image](/assets/images/posts/orchestrierung-mit-nomad/plan_update_scale.png)

![image](/assets/images/posts/orchestrierung-mit-nomad/update_success.png)

### Service Discovery

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

![image](/assets/images/posts/orchestrierung-mit-nomad/consul_services_nomad.png)

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

![image](/assets/images/posts/orchestrierung-mit-nomad/consul_services_todo.png)

### Load-balancing

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

```hcl
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

![image](/assets/images/posts/orchestrierung-mit-nomad/loadbalancer.gif)

### Update Strategien

```hcl
update {
  canary       = 1 # <1>
  max_parallel = 5 # <2>
}
```

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

```bash
----
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

![image](/assets/images/posts/orchestrierung-mit-nomad/canary.gif)

![image](/assets/images/posts/orchestrierung-mit-nomad/promote_canary.png)

![image](/assets/images/posts/orchestrierung-mit-nomad/promote_canary_success.png)

## Fazit

<https://github.com/unexist/showcase-nomad-quarkus>