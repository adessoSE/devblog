---
layout:         [post, post-xml]              
title:          "Jetstream - Eine In-Memory DB für Microservices?"
date:           2017-11-23 15:00
modified_date: 
author:         smahler 
categories:     [Java, Datenbanken]
tags:           [Microservices, Performance]
---

Schaut man sich heutzutage um, so stellt man fest, dass die Anzahl an Datenbanken mittlerweile wirklich umfangreich geworden ist. Zu den klassischen Vertretern wie MySQL oder Oracle gesellen sich Graphendatenbanken wie Neo4J, das dokumentenbasierte MongoDB und viele andere - quasi ein buntes Potpourri an Möglichkeiten.

Doch was muss man bei jeder dieser Datenbanken in der Regel machen bevor man Daten speichern kann? \
Richtig! - Man muss das Objektschema aus Java ins entsprechende Format der jeweiligen Datenbank mappen.

Hier kommt [Jetstream](http://www.jetstream.one/index.html) ins Spiel.

## Doch was ist Jetstream?

Jetstream ist eine sogenannte "in Memory Database", d.h. sie läuft ausschließlich im RAM der JVM. \
Das macht sie extrem performant. \
Die Entwickler sprechen von einer Geschwindigkeit, die klassische SQL-Queries um das bis zu 1.000.000-fache übersteigt. Dieser Umstand wird durch den JiT (Just in Time Compiler der JVM) zusätzlich bis um den Faktor 10-100 verstärkt.

## Doch gar keine echte in Memory Datenbank?

Ok, streng genommen ist Jetstream eigentlich gar keine "in Memory DB" wie das Marketingteam von xDev gerne wirbt. Es handelt sich genau genommen um eine "Storage-Engine" für den gesamten Objektgraphen. \
Diese liest den gesamten Objektgraphen aus dem RAM und speichert ihn in einer einfachen Datei auf der Festplatte. Nur wenn der RAM nicht ausreichen sollte, werden restliche Dateien von der Festplatte nachgelesen. \

Ja, richtig gehört. Keine Tabellen, keine Schemata, keine Abfragen!

Nur:
```java
JetstreamDB.instance().storeRequired(myData);
``` 
und die Daten sind wegpersistiert.






## Jetstream ins Projekt einbinden

Jetstream kann aktuell mittels Maven-Dependency ins Projekt eingebunden werden. Zukünftig soll jedoch auch die ca. 2,5 MB große Bibliothek verfügbar sein. Diese kann man sich aktuell nämlich nur händisch vom Maven-Repo herunterladen. 

```xml
<repository>
        <id>jetstream-releases</id>
         <url>http://maven.jetstream.one/repository/maven-releases/</url>
         <releases>
        <enabled>true</enabled>
    </releases>
    <snapshots>
        <enabled>false</enabled>
    </snapshots>
</repository>
<repository>
    <id>jetstream-snapshots</id>
    <url>http://maven.jetstream.one/repository/maven-snapshots/</url>
    <releases>
        <enabled>false</enabled>
    </releases>
    <snapshots>
        <enabled>true</enabled>
    </snapshots>
</repository>

<dependency>
    <groupId>one.jetstream</groupId>
    <artifactId>jetstream-one-core</artifactId>
    <version>0.8.0</version>
</dependency>
```


# Ungeahnte Performance?


![Verteilte Architektur](https://lh3.googleusercontent.com/nYhPnY2I-e9rpqnid9u9aAODz4C04OycEGxqHG5vxFnA35OGmLMrrUmhM9eaHKJ7liB-=w170)

Diese Korrelations-ID wird üblicherweise Trace-ID genannt. Eine Trace-ID wird erzeugt, wenn ein Request von außen
an das System gestellt wird. Innerhalb des Systems wird die Trace-ID dann jeweils an den nächsten Upstream-Service
mitgegeben, so dass sie in Logausgaben aller beteiligten Services genutzt werden kann.


# Tracing implementieren mit Spring Cloud Sleuth

Eine Bibliothek, mit der ein solches Tracing implementiert werden kann, ist 
[Spring Cloud Sleuth](https://cloud.spring.io/spring-cloud-sleuth/) (engl. für "Spürhund").
Sleuth ist Teil des Spring Cloud Projekts, welches Lösungen für bestimmte
Herausforderungen in Cloud-Systemen - die per se verteilte Systeme sind - zur Verfügung stellt. Im folgenden wird beschrieben,
wie man Spring Cloud Sleuth in einer Spring Boot Anwendung konfiguriert und worauf man dabei achten muss.

Eine Beispiel-Anwendung bestehend aus zwei miteinander kommunizierenden Services auf Basis von Spring Boot ist auf Github
zu finden ([downstream-service](https://github.com/thombergs/code-examples/tree/master/sleuth-downstream-service) und
[upstream-service](https://github.com/thombergs/code-examples/tree/master/sleuth-upstream-service)).

[Feign](http://projects.spring.io/spring-cloud/spring-cloud.html#spring-cloud-feign)
oder das Spring [RestTemplate](https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-restclient.html#boot-features-restclient)) wird die Trace-ID
automatisch in den HTTP-Header `x-b3-traceid` geschrieben, so dass der aufgerufene Service sie übernehmen kann.
Der etwas seltsam anmutende Name des Felds ergibt sich aus dem Präfix `x`, welches für Headernamen genutzt wird, die nicht Teil des
HTTP-Standards sind und `b3` für "BigBrotherBird", was der ursprüngliche Name des Tracing-Tools [Zipkin](http://zipkin.io) ist,
an dessen Vokabular Sleuth sich bedient. 

## Trace-ID in Logausgaben verwenden

Nun, da eine Trace-ID vorhanden ist, soll diese auch in unseren Logausgaben erscheinen. Sleuth unterstützt hierbei,
indem es die Trace-ID an den [Mapped Diagnostic Context (MDC)](https://www.slf4j.org/manual.html#mdc) von SLF4J weitergibt. 
Über den Namen `X-B3-TraceId` kann sie in einer Log-Pattern referenziert werden. Hier ein Beispiel-Log-Pattern,
das in einer Logback-Konfiguration genutzt werden kann:

```
%d{yyyy-MM-dd HH:mm:ss.SSS} %5p [%X{X-B3-TraceId:-}] %m%n
```

Das obige Log-Pattern erzeugt Logausgaben im folgenden Format. Die erste Zeile stammt aus dem Downstream-Service,
die zweite und dritte jeweils von einem Upstream-Service. 

```
2017-09-03 15:31:29.189  INFO [903c472a08e5cda0] COLLECTING CUSTOMER AND ADDRESS WITH ID 1 FROM UPSTREAM SERVICE
2017-09-03 15:31:29.193  INFO [903c472a08e5cda0] GETTING CUSTOMER WITH ID 1
2017-09-03 15:31:29.198  INFO [903c472a08e5cda0] GETTING ADDRESS FOR CUSTOMER WITH ID 1
```

## Service-Namen ausgeben

Aus der Logausgabe wird bisher nicht deutlich, welche Logzeile von welchem Service stammt. Um diese Information
zu ergänzen, kann man sich der [Logging-Features](https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-logging.html#boot-features-custom-log-configuration) 
von Spring Boot bedienen. Spring Boot bietet
die Möglichkeit, eine Logging-Konfigurationsdatei mit Umgebungsvariablen der Spring-Boot-Anwendung anzureichern. 
Nutzt man Logback, legt man z.B. eine Datei namens `logback-spring.xml` im Classpath ab und kann in ihr 
mittels `<springProperty/>` z.B. wie folgt auf die Umgebungsvariable `spring.application.name` zugreifen:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <include resource="org/springframework/boot/logging/logback/defaults.xml"/>
    <springProperty scope="context" name="springAppName" source="spring.application.name"/>
    <property name="CONSOLE_LOG_PATTERN"
              value="%d{yyyy-MM-dd HH:mm:ss.SSS} %5p [${springAppName},%X{X-B3-TraceId:-}] %m%n"/>
    <!-- Konfiguration von Appendern und Root ausgelassen ... -->
</configuration>
```

Die Umgebungsvariablen werden aus der Spring-Boot-Konfiguration gelesen, also z.B. aus
der Datei `application.properties`. Da die Datei `application.properties` aber erst ausgewertet wird, nachdem
es schon einige Logausgaben gab, können die Variablen, die man in den Logausgaben benötigt, statt dessen in der
Datei `bootstrap.properties` abgelegt werden, die schon früher geladen wird.

Die Logausgabe inklusive Service-Namen sieht dann wie folgt aus:

```
2017-09-03 15:31:29.189  INFO [sleuth-downstream-service,903c472a08e5cda0] COLLECTING CUSTOMER AND ADDRESS WITH ID 1 FROM UPSTREAM SERVICE
2017-09-03 15:31:29.193  INFO [sleuth-upstream-service,903c472a08e5cda0] GETTING CUSTOMER WITH ID 1
2017-09-03 15:31:29.198  INFO [sleuth-upstream-service,903c472a08e5cda0] GETTING ADDRESS FOR CUSTOMER WITH ID 1
```

## Trace-ID bei Exceptions ausgeben

Wenn Exceptions auftreten, sollte die Trace-ID mitgeloggt werden. Schließlich ist die Nachverfolgung von Fehlern
der Hauptgrund, warum wir ein Tracing implementieren. Leider werden Exceptions in einer Spring Boot Anwendung
standardmäßig bis zum (embedded) Application Server durchgereicht und dort behandelt. In diesem Kontext ist die 
Trace-ID nicht mehr verfügbar und wird deshalb nicht mit geloggt.

Das Problem lässt sich leicht umgehen, indem man einen eigenen Exception Handler implementiert (was man in den
allermeisten Fällen sowieso tun würde). Dieser läuft innerhalb des Spring-Kontexts und kann die Exception 
samt Trace-ID loggen. Ein simpler Exception Handler für eine Spring MVC Anwendung sieht wie folgt aus:

```java
@ControllerAdvice
public class ControllerExceptionHandler {

  private Logger logger = LoggerFactory.getLogger(ErrorHandler.class);

  @ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
  @ExceptionHandler(Exception.class)
  @ResponseBody
  public String handleInternalError(Exception e) {
    logger.error("internal server error", e);
    return "Internal Server Error";
  }

}
```

## Trace-ID an den Client weitergeben

In manchen Anwendungen kann es sinnvoll sein, dem Benutzer im Fehlerfall die Trace-ID anzuzeigen, so 
dass er diese z.B. bei der Hotline angeben kann. Dort können die Logfiles dann nach der Trace-ID durchsucht
und der Fehler nachvollzogen werden. Da Sleuth die Trace-ID in den MDC schreibt, kann diese von dort
auch einfach wieder ausgelesen und an den Anwender übermittelt werden. Das folgende Beispiel erweitert
den Exception Handler, um die Trace-ID an den Client zu übertragen:

```java
@ControllerAdvice
public class ErrorHandler {

  private Logger logger = LoggerFactory.getLogger(ErrorHandler.class);

  @ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
  @ExceptionHandler(Exception.class)
  @ResponseBody
  public String handleInternalError(Exception e) {
    logger.error("internal server error", e);
    return String.format("Internal Server Error (traceId: %s)", MDC.get("X-B3-TraceId"));
  }

}
```

Anstatt eines einfachen Strings kann hier natürlich auch ein strukturiertes JSON-Objekt übertragen
werden, so dass die Trace-ID clientseitig strukturiert ausgelesen werden kann.

## Trace-ID an zentralen Logserver senden

Nutzt man einen zentralen Logserver wie z.B. [Graylog](https://www.graylog.org), macht es Sinn,
dass die Trace-ID nicht nur als Teil der textuellen Log-Nachricht sondern auch als separates, indizierbares
Feld übertragen wird. Ein Standardformat zur Datenübertragung von Logdaten ist das [Graylog Extended Log Format (GELF)](http://docs.graylog.org/en/2.3/pages/gelf.html).

Die folgende Logback-Konfiguration `logback-spring.xml` nutzt die Library 
`logback-gelf`, um Lognachrichten in das GELF-Format zu übersetzen und an einen Graylog-Server
zu senden. Die Library kann mit Gradle wie folgt eingebunden werden:

```groovy
compile('me.moocar:logback-gelf:0.3')
```

Mit ihrer Hilfe lässt sich ein Appender z.B. wie folgt konfigurieren:  

```xml
<configuration>
    <include resource="org/springframework/boot/logging/logback/defaults.xml"/>
    <springProperty scope="context" name="springAppName" source="spring.application.name"/>
    <appender name="GELF" class="me.moocar.logbackgelf.GelfUDPAppender">
        <remoteHost>graylog.host</remoteHost>
        <port>12201</port>
        <encoder class="ch.qos.logback.core.encoder.LayoutWrappingEncoder">
            <layout class="me.moocar.logbackgelf.GelfLayout">
                <includeFullMDC>true</includeFullMDC>
                <staticField class="me.moocar.logbackgelf.Field">
                  <key>serviceName</key>
                  <value>${springAppName}</value>
                </staticField>
            </layout>
        </encoder>
    </appender>

    <root level="debug">
        <appender-ref ref="GELF" />
    </root>
</configuration>
```

Der Parameter `includeFullMDC` sorgt dabei dafür, dass alle MDC-Variablen - also auch unsere Trace-ID - als eigenständiges
Feld innerhalb des GELF-Formats übertragen und im Graylog-Server strukturiert und durchsuchbar abgelegt werden. 

Diese Konfiguration nutzt auch wieder die Logging-Unterstützung von Spring Boot, indem der Name des Service
(`spring.application.name`) ebenfalls als eigenständiges Feld mit dem Namen `serviceName` übertragen wird.

## Traces analysieren

Reichen die Trace-IDs in den Logfiles nicht aus, kann man eine ausgiebigere Analyse der Traces mit Hilfe
von [Zipkin](http://zipkin.io) durchführen. Zipkin ist eine Anwendung, die Trace-Daten einsammelt und
in einer Weboberfläche sehr detaillierte Informationen darstellt, wie z.B. die Dauer der einzelnen Schritte
innerhalb eines Traces ("Spans") und wo und wann welcher Fehler aufgetreten ist. 

Sleuth sendet seine 
Traces standardmäßig an Zipkin, wenn die folgende Dependency im Classpath zu finden ist (Gradle Notation):

```groovy
compile('org.springframework.cloud:spring-cloud-starter-zipkin')
```

Zusätzlich muss über die folgende Property in der `application.properties` noch der Hostname des Zipkin-Servers
angegeben werden: 

```
spring.zipkin.baseUrl: http://localhost:9411/
```

# Zusammenfassung

Abschließend betrachtet lässt sich über Jetstream noch nicht sonderlich viel sagen. Die Entwicklung....

# Beispiel-Projekte
Unter [Beispiel-Projekt-Jetstream](https://github.com/silasmahler/jetstream-example) ist das Beispielprojekt nochmals zu finden.
