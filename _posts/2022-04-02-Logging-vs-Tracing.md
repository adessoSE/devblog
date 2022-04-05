---
layout:			[post, post-xml]											# Pflichtfeld. Nicht ändern!
title:			"Logging vs Tracing"                                        # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:			2022-04-02 18:00											# Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 	2022-04-02 18:00											# Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author_ids:			[unexist]								                # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: 	[Softwareentwicklung]										# Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags:			[Logging, Kibana, Tracing, OpenTelemetry, Jaeger]	        # Bitte auf Großschreibung achten.
---

Wenn wir im normalen Betrieb unserer Anwendung sehen möchten, ob sie ihren Job fehlerfrei erledigt genügt normalerweise
ein Blick in die Logs.
Darin können wir meistens schnell erkennen, ob alles reibungslos läuft oder ob sich Fehler häufen.
Dies klappt bei einfachen Anwendungen ziemlich gut, aber wie sieht es aber jetzt bei komplexeren oder gar verteilten
Anwendungen aus?

In diesem Artikel beschäftigen wir uns zunächst allgemein mit **Logging** und **Tracing**, sehen uns anhand von
Beispielen verschiedene Einsatzmöglichkeiten an und sprechen über Good Practices.
Und abschließend vergleichen wir dann beides nochmal direkt miteinander und betrachten verschiedene Usecases.

## Logging

### Was ist ein Log?

Grundsätzlich ist ein **Log** die Ausgabe eines Ereignisses, welches innerhalb einer Anwendung auf einem bestimmten
System zu einer bestimmten Uhrzeit eingetreten ist - eine Art Journal der Ereignisse.
Dies kann rein informativ Natur sein, beispielsweise wenn ein bestimmter Request eingegangen ist, kann aber auch
hilfreiche Informationen liefern, die im Falle eines Ausfalls beim Troubleshooting helfen das Problem zu finden.

Im Laufe eines Tages fallen auf diese Weise riesige Datenmengen an und es wird schwierig darin etwas konkretes zu finden.
Eine erste Vereinfachung stellt hier eine Einteilung auf Basis der Wichtigkeit in Kategorien (oder [Levels][]) wie
**Info**, **Warn** oder **Error** da und ermöglicht eine konkretere Suche, aber auch die Erstellung von Filtern oder
Alarme in Monitoring Tools für einen Fehlerfall.

Hier ein einfaches Beispiel einer Nachricht:

```java
LOGGER.info("Created todo");
```

```log
2022-01-19 16:46:14,298 INFO  [dev.une.sho.tod.ada.TodoResource] (executor-thread-0) Created todo
```

### Erweiterter Kontext

Einfache Nachrichten wie diese enthalten nicht besonders viel Kontextinformation und helfen leider nur wenig dabei
nachzuvollziehen was hier wirklich passiert ist.
Besser ist es daher weitere Informationen zu ergänzen, beispielsweise eigenen sich die ID des Requests oder beteiligter
User- oder Businessobjekte immer gut dafür und ermöglichen zu dem zusammenhängende Nachrichten leichter zu finden.

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

Eine bessere Möglichkeit bietet [MDC][], welches von den meisten **Logging** Bibliotheken direkt unterstützt wird.
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
zum Kontext ergänzen.
Dies kann auch automatisiert über [Filter][], [Interceptor][] oder [Aspect-Oriented Programming][] vorgenommen
werden.

### Korrelation von Nachrichten

Unseres Services verarbeiten im Normalfall irgendeine Form eingehender Requests und hier ist es durchaus interessant,
den Lauf dieser Requests durch unsere Anwendung bei jedem Schritt zu verfolgen.
Betrachten wir jetzt alle zusammenhängen Nachrichten spricht man auch von Korrelation.
Eine einfache Möglichkeit dies zu erreichen besteht darin, eine neue einzigartige ID einzuführen und diese an alle
nachfolgenden Ausgaben anzuhängen.

Hier einmal ein Beispiel, wie wir das mit der Kombination von [MDC][] und [Interceptor][] umsetzen können:

```java
@Target({ METHOD })
@Retention(RUNTIME)
@Documented
@InterceptorBinding
public @interface Correlated { // <1>
}
```

**<1>** Wir legen zunächst eine Marker Annotation für unseren Interceptor an.

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

**<2>** Als nächstes erzeugen wir eine neue ID und legen sie im MDC ab. \
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

**<4>** Und zum Schluss markieren wie die Funktion mit unserer Annotation.

Schicken wir jetzt einen POST Request gegen unsere API, sollten wir im Log eine Ausgabe wie diese finden:

```log
2022-03-05 14:30:06,274 INFO  [de.un.sh.to.ad.TodoResource] (executor-thread-0) {correlation_id=f825c6981cb0dc603eb509189ed141b6} Received post request
```

### Structured Logs

Möchten wir jetzt die Suchergebnisse aussagekräftiger gestalten, stoßen wir bei _unstrukturierten_ Formaten wie die
aus unseren Beispielen sehr schnell an eine Grenze.
Abhilfe schafft hier ein _strukturiertes_ Format wie [JSON][] einzusetzen, welches einfacher weitere Attribute und
Metadaten wie beispielsweise die aufrufende Klasse oder den Hostname aufnehmen kann.

Hier exemplarisch die Ausgabe der [quarkus-logging-json][] Extension:

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

Die meisten modernen **Logging** Bibliotheken unterstützen [JSON][] von Hause aus und bringen zusätzlich diverse
Helfer mit, mit denen Key-Value Paare bequem ergänzt werden können:

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
Instanz die diese bündelt und zudem einfache Suchen, aber auch komplexe Anfragen auf Basis der Daten anbietet.
Hier gibt es verschiedene mögliche Stacks wie beispielsweise [EFK][] / [ELK][] oder auch [Grafana][], allerdings
sprengt eine Anleitung dafür den Rahmen dieses Artikels und im Internet gibt es zahlreiche und ausführliche Anleitungen.

In der Praxis sieht hier ein Beispiel mit [Kibana][]:

![image](/assets/images/posts/logging-vs-tracing/kibana_log.png)

## Tracing

### Was ist ein Trace?

Wir starten am besten erneut mit einer Definition:
Ein **Trace** ist eine direkte Visualisierung eines Requests beim Durchlauf durch eine Anwendung oder übergreifend
einer kompletten Anwendungslandschaft.
Hierbei wird er durch eine eindeutige **Trace ID** identifiziert und nimmt bei jedem Arbeitsschritt **Spans** auf.

**Spans** sind die kleinste Einheit des **Distributed Tracings** und bilden den eigentlichen Workflow ab.
Hierzu zählen beispielsweise HTTP Requests, der Aufruf einer Datenbank oder die Verarbeitung einer Nachricht beim
[Eventing][].
Analog zu einem **Trace** erhalten auch sie eine eindeutige **Span ID**, Angaben über das genaue Timing und optional
weitere Attribute, [Events][] oder [Status][] je nach Usecase.

Und passiert ein **Trace** die Grenze eines Services (Boundary), so kann dieser mittels [Context Propagation][] über
bestimmte HTTP oder [Kafka][] Header weitergegeben werden und entsprechend weitergeführt werden.

### Tracing mit OpenTelemetry

Ohne Beispiel ist es relativ schwierig sich vorzustellen wie das ganze dann aussieht, daher hier einmal exemplarisch
ein einfacher HTTP Request in einer [Quarkus][] Anwendung auf Basis von [OpenTelemetry][] und [Jaeger][]:

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

[Quarkus][] übernimmt hier den Großteil der Arbeit und wir müssen lediglich mittels [curl][] einen Request abschicken:

![image](/assets/images/posts/logging-vs-tracing/jaeger_simple_trace.png)

### Spans in Actions

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

```java
@WithSpan("Create todo") // <1>
public Optional<Todo> create(TodoBase base) {
    Todo todo = new Todo(base);

    todo.setId(UUID.randomUUID().toString());

    Span.current()
            .addEvent("Added id to todo", Attributes.of(
                    AttributeKey.stringKey("id"), todo.getId())) // <2>
            .setStatus(StatusCode.OK); // <3>

    return Optional.of(todo);
}
```

![image](/assets/images/posts/logging-vs-tracing/jaeger_advanced_trace.png)

![image](/assets/images/posts/logging-vs-tracing/jaeger_advanced_graph.png)

### Noch mehr spans

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

```java
public class TodoSink {
    @ConfigProperty(name = "quarkus.application.name")
    String appName;

    @Inject
    TodoService todoService;

    @Incoming("todo-stored")
    public CompletionStage<Void> consumeStored(IncomingKafkaRecord<String, Todo> record) {
        Optional<TracingMetadata> metadata = TracingMetadata.fromMessage(record); // <1>

        if (metadata.isPresent()) {
            try (Scope ignored = metadata.get().getCurrentContext().makeCurrent()) { // <2>
                Span span = GlobalOpenTelemetry.getTracer(appName)
                        .spanBuilder("Received message from todo-stored").startSpan(); // <3>

                if (this.todoService.update(record.getPayload())) {
                    span.addEvent("Updated todo", Attributes.of(
                            AttributeKey.stringKey("id"), record.getPayload().getId())); // <4>
                }

                span.end();
            }
        }

        return record.ack();
    }
```

![image](/assets/images/posts/logging-vs-tracing/jaeger_complex_trace.png)

## Logging und Tracing vereint

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
            result = context.proceed()
        }

        return result;
    }
}
```

# Fazit

<https://github.com/unexist/showcase-logging-tracing-quarkus>