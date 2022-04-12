---
layout:			[post, post-xml]											# Pflichtfeld. Nicht ändern!
title:			"Logging vs Tracing"                                        # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:			2022-04-02 18:00											# Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 	2022-04-12 11:00											# Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author_ids:			[unexist]								                # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: 	[Softwareentwicklung]										# Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags:			[Logging, Kibana, Tracing, OpenTelemetry, Jaeger]	        # Bitte auf Großschreibung achten.
---

Wenn wir im normalen Betrieb unserer Anwendung sehen möchten, ob sie ihren Job fehlerfrei erledigt, genügt normalerweise
ein Blick in die Logs.
Darin können wir meistens schnell erkennen, ob alles reibungslos läuft oder ob sich Fehler häufen.
Dies klappt bei einfachen Anwendungen ziemlich gut, aber wie sieht es bei komplexeren oder gar verteilten
Anwendungen aus?

In diesem Artikel beschäftigen wir uns zunächst allgemein mit **Logging** und **Tracing**, sehen uns anhand von
Beispielen verschiedene Einsatzmöglichkeiten an und sprechen über Good Practices.
Und abschließend vergleichen wir dann beides nochmal direkt miteinander und betrachten verschiedene Use Cases.

## Logging

### Was ist ein Log?

Grundsätzlich ist ein **Log** die Ausgabe eines Ereignisses, welches innerhalb einer Anwendung auf einem bestimmten
System zu einer bestimmten Uhrzeit eingetreten ist - eine Art Journal der Ereignisse.
Dies kann rein informativer Natur sein, beispielsweise wenn ein bestimmter Request eingegangen ist, kann aber auch
hilfreiche Informationen liefern, die im Falle eines Ausfalls beim Troubleshooting helfen, das Problem zu finden.

Jetzt fallen im Laufe eines Tages auf diese Weise riesige Datenmengen an und es wird irgendwann sehr schwierig, dieser
Herr zu werden und etwas konkretes darin zu finden.
Als erste Vereinfachung werden diese Logs jetzt in verschiedene Kategorien (oder [Levels][15]) wie **Info**, **Warn**
oder **Error** eingeteilt.
Dies ermöglicht eine konkretere Suche, aber auch die Erstellung von Filtern oder Alarmen in Monitoring Tools für einen
Fehlerfall.

Hier ist ein einfaches Beispiel einer Nachricht:

```java
LOGGER.info("Created todo");
```

```log
2022-01-19 16:46:14,298 INFO  [dev.une.sho.tod.ada.TodoResource] (executor-thread-0) Created todo
```

### Erweiterter Kontext

Einfache Nachrichten wie diese enthalten nicht besonders viel Kontextinformation und helfen leider nur wenig dabei,
nachzuvollziehen was hier wirklich passiert ist.
Besser ist es daher, im nächsten Schritt Informationen zu ergänzen, beispielsweise eignen sich die ID des Request
oder beteiligter User- oder Businessobjekte immer gut dafür und sie ermöglichen es zudem, zusammenhängende Nachrichten
leichter zu finden.

```java
LOGGER.info("Created todo: id={}", todo.getId());
```

```log
2022-01-19 16:46:14,298 INFO  [dev.une.sho.tod.ada.TodoResource] (executor-thread-0) Created todo: id=8659a492-1b3b-42f6-b25c-3f542ab11562
```

Möchten wir hier nur einzelne Nachrichten verändern, so ist dies schnell erledigt, allerdings schleichen sich bei
hunderten von Anpassungen schnell Fehler ein und erschweren dadurch wieder eine Suche:

```java
LOGGER.info("Created todo: id ={}", todo.getId());
```

### Mapped Diagnostic Context

Eine bessere Möglichkeit bietet [MDC][17], welches von den meisten **Logging**-Bibliotheken direkt unterstützt wird.
Hiermit können wir mittels einer Reihe statischer Methoden Informationen zu einem thread-basierten Kontext hinzufügen
und diesen mit einem entsprechend konfigurierten Logger automatisch an nachfolgende Nachrichten anhängen lassen.

```java
/* Manuelles MDC Handling */
MDC.put("todo_id", todo.getId());
LOGGER.info("Created todo");
MDC.remove("todo_id");

/* try-with-resources Block */
try (MDC.MDCCloseable closable = MDC.putCloseable("todo_id", toto.getId())) {
    LOGGER.info("Created todo");
}
```

```log
2022-01-19 16:46:14,298 INFO  [de.un.sh.to.ad.TodoResource] (executor-thread-0) {todo_id=8659a492-1b3b-42f6-b25c-3f542ab11562} Created todo
```

Auf diese Art und Weise können wir komfortabel eine Vielzahl an Nachrichten manuell verändern und Informationen
zum Kontext ergänzen, aber auch automatisiert über [Filter][8], [Interceptors[10] oder [Aspect-Oriented Programming][1]
beisteuern.

### Korrelation von Nachrichten

Unsere Services verarbeiten im Normalfall irgendeine Form eingehender Requests und hier ist es durchaus interessant,
den Lauf dieser Requests durch unsere Anwendung bei jedem Schritt zu verfolgen.
Dazu ist es notwendig, alle Nachrichten der zugehörigen Ereignisse zusammenzuführen - dies nennt man auch Korrelation.
Eine einfache Möglichkeit, dies zu erreichen, besteht darin, eine neue einzigartige ID einzuführen und diese in allen
nachfolgenden Ausgaben mitzugeben.

Hier seht ihr ein Beispiel, wie wir das mit der Kombination von [MDC][17] und [Interceptor][10] umsetzen können:

```java
@Target({ METHOD })
@Retention(RUNTIME)
@Documented
@InterceptorBinding
public @interface Correlated { // <1>
}
```

**<1>** Wir legen zunächst eine Marker-Annotation für unseren Interceptor an.

```java
@Correlated
@Priority(10)
@Interceptor
public class CorrelatedInterceptor {

    @AroundInvoke
    public Object correlate(InvocationContext context) throws Exception {
        Object result = null;

        try (MDC.MDCCloseable closable = MDC.putCloseable("correlation_id",
                UUID.randomUUID().toString())) // <2>
        {
            result = context.proceed(); // <3>
        }

        return result;
    }
}
```

**<2>** Als nächstes erzeugen wir eine neue ID und legen sie im MDC ab.<br />
**<3>** Jetzt rufen wir die ursprüngliche Methode auf und reichen unsere neue ID weiter.

```java
@POST
@Consumes(MediaType.APPLICATION_JSON)
@Operation(summary = "Create new todo")
@Tag(name = "Todo")
@APIResponses({
        @APIResponse(responseCode = "200", description = "Todo created")
}
@Correlated // <4>
public Response create(TodoBase todoBase) {
    LOGGER.log("Received post request");

    return Response.ok().build();
}
```

**<4>** Und zum Schluss markieren wir die Funktion mit unserer Annotation.

Schicken wir jetzt einen POST Request gegen unsere API, sollten wir im Log eine Ausgabe wie diese finden:

```log
2022-03-05 14:30:06,274 INFO  [de.un.sh.to.ad.TodoResource] (executor-thread-0) {correlation_id=f825c6981cb0dc603eb509189ed141b6} Received post request
```

### Structured Logs

Möchten wir jetzt die Suchergebnisse aussagekräftiger gestalten, stoßen wir bei _unstrukturierten_ Formaten wie in
unseren Beispielen sehr schnell an eine Grenze.
Abhilfe schafft hier, ein _strukturiertes_ Format wie [JSON][12] einzusetzen, welches einfacher weitere Attribute und
Metadaten wie beispielsweise die aufrufende Klasse oder den Hostname aufnehmen kann.

Hier sehen wir exemplarisch die Ausgabe der [quarkus-logging-json][20] Extension:

```json
{
  "timestamp": "2022-02-04T17:23:34.674+01:00",
  "sequence": 1987,
  "loggerClassName": "org.slf4j.impl.Slf4jLogger",
  "loggerName": "dev.unexist.showcase.todo.adapter.TodoResource",
  "level": "INFO",
  "message": "Created todo",
  "threadName": "executor-thread-0",
  "threadId": 104,
  "mdc": {
    "todo_id": "8659a492-1b3b-42f6-b25c-3f542ab11562"
  },
  "hostName": "c02fq379md6r",
  "processName": "todo-service-create-dev.jar",
  "processId": 97284
}
```

Die meisten modernen **Logging**-Bibliotheken unterstützen [JSON][12] von Hause aus und bringen zusätzlich diverse
Helfer mit, mit denen Key-Value-Paare bequem ergänzt werden können:

```java
/* quarkus-logging-json */
LOGGER.info("Created todo", kv("todo_id", todo.getId()));

/* Logstash */
LOGGER.info("Created todo", keyValue("todo_id", todo.getId()));
```

### Aggregation von Logs

Eine Anwendungslandschaft besteht normalerweise nicht nur aus einer Anwendung, sondern aus vielen verschiedenen bei denen
ebenfalls **Logs** anfallen.
Diese möchten wir natürlich nicht verteilt über alle Systeme zusammensuchen müssen, sondern hätten gerne eine zentrale
Instanz, die die Logausgaben bündelt und zudem einfache Suchen, aber auch komplexe Anfragen auf Basis der Daten anbietet.
Hier gibt es verschiedene mögliche Stacks wie beispielsweise [EFK][4] / [ELK][5] oder auch [Grafana][9], allerdings
sprengt eine Anleitung dafür den Rahmen dieses Artikels und im Internet gibt es zahlreiche und ausführliche Anleitungen.

In der Praxis kann das ganze dann mittels [Kibana][14] wie folgt aussehen:

![image](/assets/images/posts/logging-vs-tracing/kibana_log.png)

## Tracing

### Was ist ein Trace?

Wir starten am besten erneut mit einer Definition:
Ein **Trace** ist eine direkte Visualisierung eines Requests beim Durchlauf durch eine Anwendung oder
einer kompletten Anwendungslandschaft.
Hierbei wird er durch eine eindeutige **Trace ID** identifiziert und nimmt bei jedem Arbeitsschritt **Spans** auf.

**Spans** sind die kleinste Einheit des **Distributed Tracings** und bilden den eigentlichen Workflow ab.
Hierzu zählen beispielsweise HTTP Requests, der Aufruf einer Datenbank oder die Verarbeitung einer Nachricht beim
[Eventing][6].
Analog zu einem **Trace** erhalten auch sie eine eindeutige **Span ID** und zusätzlich noch Angaben über das genaue
Timing, optionale weitere Attribute, [Events][7] oder [Status][22], je nach Use Case.

Und passiert ein **Trace** die Grenze eines Service (Boundary), so kann dieser mittels [Context Propagation][2] über
bestimmte HTTP oder [Kafka][13] Header weitergegeben und entsprechend weitergeführt werden.

### Tracing mit OpenTelemetry

Ohne Beispiel ist es relativ schwierig, sich vorzustellen, wie das ganze dann aussieht, daher springen wir hier
auch direkt zum ersten Beispiel.

Unser Beispiel basiert auf einem einfachen REST Endpoints in [Quarkus][21] und [OpenTelemetry][18] und verwendet
[Jaeger][11] als Visualisierung:

```java
@POST
@Consumes(MediaType.APPLICATION_JSON)
@Operation(summary = "Create new todo")
@Tag(name = "Todo")
@APIResponses({
        @APIResponse(responseCode = "200", description = "Todo created")
})
public Response create(TodoBase todoBase) {
    return Response.ok().build();
}
```

[Quarkus][21] übernimmt hier den Großteil der Arbeit, wir müssen hier nichts weiter ergänzen und lediglich mittels
[curl][3] einen Request abschicken:

![image](/assets/images/posts/logging-vs-tracing/jaeger_simple_trace.png)

### Spans in Aktion

Wie eingangs erwähnt bieten **Spans** die Möglichkeit, weitere Informationen mitzuführen. Dies wollen wir uns im
nächsten Beispiel einmal ansehen.
Basierend auf dem vorherigen Endpoint, ergänzen wir hier Namen sowie Status und fügen einen Service-Call hinzu:

```java
@Inject
TodoService todoService;

@POST
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@Operation(summary = "Create new todo")
@Tag(name = "Todo")
@APIResponses({
        @APIResponse(responseCode = "201", description = "Todo created"),
})
public Response create(TodoBase todoBase, @Context UriInfo uriInfo) {
    Response.ResponseBuilder response;

    Span.current()
            .updateName("Received post request"); // <1>

    Optional<Todo> todo = this.todoService.create(todoBase); // <2>

    if (todo.isPresent()) {
        Span.current()
                .setStatus(StatusCode.OK, todo.get().getId()); // <3>

        URI uri = uriInfo.getAbsolutePathBuilder()
                .path(todo.get().getId())
                .build();

        response = Response.created(uri);
    }

    return response.build();
}
```

**<1>** Hier setzen wir zunächst den Namen des aktuellen Spans.<br />
**<2>** Als nächstes rufen wir unseren neuen Service auf.<br />
**<3>** Abhängig vom Ergebnis des vorherigen Aufrufs setzen wir einen Status.

```java
@WithSpan("Create todo") // <4>
public Optional<Todo> create(TodoBase base) {
    Todo todo = new Todo(base);

    todo.setId(UUID.randomUUID().toString());

    Span.current()
            .addEvent("Added id to todo", Attributes.of(
                    AttributeKey.stringKey("id"), todo.getId())) // <5>
            .setStatus(StatusCode.OK); // <6>

    return Optional.of(todo);
}
```

**<4>** Mittels dieser Annotation von [OpenTelemetry][18] legen wir automatisch einen neuen Span an.<br />
**<5>** Neben Status können auch Logevents mit weiteren Attributen angehangen werden.<br />
**<6>** Und abschließend setzen wir auch hier den Status.

Sobald wir jetzt einen erneuten Post an unseren Endpoint schicken, finden wir in [Jaeger][11] folgendes vor:

![image](/assets/images/posts/logging-vs-tracing/jaeger_advanced_trace.png)

[Jaeger][11] bietet zusätzlich noch eine experimentelle Graphansicht auf **Traces** und **Spans** an:

![image](/assets/images/posts/logging-vs-tracing/jaeger_advanced_graph.png)

### Spans und Eventing

[Context Propagation][2] erlaubt es, wie bereits erwähnt, einen Kontext über Servicegrenzen hinaus zu transportieren und
dies wollen wir uns jetzt einmal mit [Kafka][13] ansehen.
Wir starten abermals mit dem bekannten Beispiel, daher sollte es bis auf den [Quarkus][21]-typischen Aufruf auch keine
Überraschungen geben:

```java
@Inject
TodoService todoService;

@Inject
TodoSource todoSource;

@POST
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@Operation(summary = "Create new todo")
@Tag(name = "Todo")
@APIResponses({
        @APIResponse(responseCode = "201", description = "Todo created"),
})
public Response create(TodoBase todoBase, @Context UriInfo uriInfo) {
    Response.ResponseBuilder response;

    Span.current()
            .updateName("Received post request");

    Optional<Todo> todo = this.todoService.create(todoBase);

    if (todo.isPresent()) {
        Span.current()
                .setStatus(StatusCode.OK, todo.get().getId());

        this.todoSource.send(todo.get()); // <1>

        URI uri = uriInfo.getAbsolutePathBuilder()
                .path(todo.get().getId())
                .build();

        response = Response.created(uri);
    }

    return response.build();
}
```

**<1>** Wir rufen hier einen neuen Service auf, welcher die Anbindung an [Kafka][13] für uns übernimmt.

```java
public class TodoSink {
    @ConfigProperty(name = "quarkus.application.name")
    String appName;

    @Inject
    TodoService todoService;

    @Incoming("todo-stored")
    public CompletionStage<Void> consumeStored(IncomingKafkaRecord<String, Todo> record) {
        Optional<TracingMetadata> metadata = TracingMetadata.fromMessage(record); // <2>

        if (metadata.isPresent()) {
            try (Scope ignored = metadata.get().getCurrentContext().makeCurrent()) { // <3>
                Span span = GlobalOpenTelemetry.getTracer(appName)
                        .spanBuilder("Received message from todo-stored").startSpan(); // <4>

                if (this.todoService.update(record.getPayload())) {
                    span.addEvent("Updated todo", Attributes.of(
                            AttributeKey.stringKey("id"), record.getPayload().getId())); // <5>
                }

                span.end(); // <6>
            }
        }

        return record.ack();
    }
```

**<2>** Im Gegensatz zu [OpenTracing][19] müssen wir uns bei [OpenTelemetry][18] um die Übernahme des Kontext selber kümmern.<br />
**<3>** Daher erzeugen wir zunächst einen neuen Kontext.<br />
**<4>** Und erzeugen anschließend über einen Builder einen neuen Span.<br />
**<5>** Jetzt setzen wir auch hier ein entsprechendes Logevent.<br />
**<6>** Am Ende schließen wir den Span ab.

Setzt man dieses Schema in seiner Anwendung fort, bekommt man am Ende ein vollständiges Bild eines Requests wie
beispielsweise hier zu sehen:

![image](/assets/images/posts/logging-vs-tracing/jaeger_complex_trace.png)

## Korrelation über Tracing

Leider bietet [OpenTelemetry][18] derzeit keine einfache Möglichkeit, die **Trace ID** oder **Span ID** automatisiert an
**Logs** anzuhängen, aber grundsätzlich ist natürlich die **Trace ID** ein schöner Kandidat für eine **correleation ID**.

In einem vorherigen Beispiel haben wir gesehen, wie wir mittels [MDC][17] und [Interceptor][10] Informationen durchreichen
können und das kann man ebenso mit der **Trace ID** machen:

```java
@Traced
@Priority(10)
@Interceptor
public class TracedInterceptor {

    @AroundInvoke
    public Object trace(InvocationContext context) throws Exception {
        Object result = null;

        try (MDC.MDCCloseable closable = MDC.putCloseable("trace_id",
                Span.current().getSpanContext().getTraceId())) // <1>
        {
            result = context.proceed();
        }

        return result;
    }
}
```

**<1>** Hier holen wir uns die **Trace ID** und legen sie im [MDC][17] ab.

# Fazit

Beim Einsatz von [Logging][16] oder [Tracing][24] gibt es hier kein echtes entweder/oder.
Beides kann helfen, Probleme einzugrenzen, und bietet jeweils ein anderes Bild der Vorgänge mit einem Satz komplementärer
Informationen zur Diagnose.

| Logging                                          | Tracing                                          |
|--------------------------------------------------|--------------------------------------------------|
| Bietet Insights in einfache Anwendungen          | Hilft, Requests durch Applikationen zu verfolgen |
| Zeigt Status von Anwendungen                     | Liefert Timings und Latenzen für Requests        |
| Kann einfach integriert werden                   | Erhöht die Komplexität des Codes                 |
| Gut geeignet für Monolithen                      | Besser geeignet für Microservicearchitekturen    |
| Unterstützt Debugging und Diagnosen              | Unterstützt Debugging und Diagnosen              |

Während sich [Logging][16] sehr gut für den normalen Monolithen eignet, lohnt sich die erhöhte Komplexität durch
[Tracing][24] gerade innerhalb einer Microservicearchitektur.
Beide zusammen bilden die ersten beiden Säulen der [Three Pillars of Observability][23] und unterstützen
Entwicklungsteams dabei, Fehler zu debuggen, Diagnosen zu erstellen und allgemein robustere Systeme zu bauen.

Sämtliche Beispiele können im folgenden Repository eingesehen werden:

<https://github.com/unexist/showcase-logging-tracing-quarkus>

[1]: https://en.wikipedia.org/wiki/Aspect-oriented_programming
[2]: https://opentelemetry.io/docs/instrumentation/java/manual/#context-propagation
[3]: https://curl.se/
[4]: https://www.digitalocean.com/community/tutorials/how-to-set-up-an-elasticsearch-fluentd-and-kibana-efk-logging-stack-on-kubernetes
[5]: https://www.elastic.co/what-is/elk-stack
[6]: https://docs.microsoft.com/en-us/events/dotnetconf-focus-on-microservices/beyond-rest-and-rpc-asynchronous-eventing-and-messaging-patterns
[7]: https://opentelemetry.io/docs/reference/specification/trace/api/#add-events
[8]: https://blog.adamgamboa.dev/understanding-jax-rs-filters/
[9]: https://grafana.com/
[10]: https://www.baeldung.com/cdi-interceptor-vs-spring-aspectj
[11]: https://www.jaegertracing.io/
[12]: https://www.json.org/json-en.html
[13]: https://kafka.apache.org/
[14]: https://www.elastic.co/kibana/
[15]: https://www.papertrail.com/solution/tips/logging-in-java-best-practices-and-tips/
[16]: https://en.wikipedia.org/wiki/Logging
[17]: https://logback.qos.ch/manual/mdc.hml
[18]: https://opentelemetry.io
[19]: https://opentracing.io/
[20]: https://github.com/quarkiverse/quarkus-logging-json
[21]: https://quarkus.io/
[22]: https://opentelemetry.lightstep.com/spans/
[23]: https://www.oreilly.com/library/view/distributed-systems-observability/9781492033431/ch04.html
[24]: https://en.wikipedia.org/wiki/Tracing_(software)