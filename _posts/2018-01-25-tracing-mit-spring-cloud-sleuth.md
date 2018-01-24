---
layout:         [post, post-xml]              
title:          "Tracing in verteilten Systemen mit Spring Cloud Sleuth"
date:           2018-01-25 12:00
modified_date: 
author:         thombergs 
categories:     [Java, Architektur]
tags:           [Spring, Microservices]
---

In verteilten Systemen ist es selbstverständlich, dass viele verteilte Komponenten
an der Beantwortung eines einzelnen eingehenden Requests beteiligt sein können. Insbesondere für 
Debugging-Zwecke ist es unabdingbar, dass ein solcher Request  
innerhalb des verteilten Systems über alle beteiligten Komponenten hinweg nachvollzogen
werden kann. Dieser Artikel geht auf die Traceability von Requests und Fehlern in verteilten Systemen
ein und gibt einige Tipps und Tricks mit, um eine Lösung auf Basis von Spring Cloud Sleuth 
umzusetzen.

# Traceability in verteilten Systemen

Selbst in einem monolithischen System ist die Verfolgung von Fehlern oft schon schwer genug. Um die Ursache eines
Fehlers zu finden, durchsucht man die Logfiles der Application Server rund um den Zeitpunkt, zu dem der
Fehler aufgetreten ist, und hofft, dass man einen Stacktrace findet, der den Fehler erklärt. Idealerweise
wurde dem Benutzer eine Correlation-ID ausgegeben, die den Request eindeutig identifiziert, so dass man 
in den Logfiles einfach nach dieser ID suchen kann. Noch mehr hilft es, wenn die Logfiles zentral in einem Logserver wie z.B. Graylog 
aggregiert und durchsuchbar gemacht wurden.

In einem verteilten System wird diese Analyse noch mal erschwert, da verschiedene Komponenten (im folgenden 
"Services" genannt) an der Verarbeitung
eines einzelnen Requests beteiligt sind. Hier sind ein zentraler Logserver und eine Correlation-ID unabdingbar. Der 
Unterschied zum monolothischen System ist, dass diese Correlation-ID sich nun über verschiedene Services
spannt und somit zwischen den Services verteilt werden muss.

Als anschauliches Beispiel für diesen Artikel soll ein verteiltes System mit 3 Services dienen (siehe Abbildung unten).
Im Rahmen eines Requests `getCustomerWithAddress` sollen Kunden- und Addressdaten geliefert werden. Die Kundendaten und 
Addressdaten liegen aber jeweils in der Verantwortung eines anderen Service, so dass der initial angefragte 
Downstream-Service diese Daten dort anfragen und dann zu einer Antwort aggregieren muss. 
Tritt nun z.B. beim Ermitteln der Kundendaten in einem der Upstream-Services ein Fehler auf, wird dieser in dessen Logfile
festgehalten. Da der Downstream-Service eine Fehler-Antwort vom Upstream-Service erhält,
wird der Fehler auch dort geloggt. Für eine einfache Ursachenanalyse sollen die Fehler in beiden Logfiles
nun über eine gemeinsame ID miteinander korelliert werden.

![Verteilte Architektur](/assets/images/originals/tracing-mit-spring-cloud-sleuth/trace.png)

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

## Spring Cloud Sleuth aktivieren

Zunächst muss Spring Cloud Sleuth als Dependency in die eigene Anwendung eingebunden werden (Gradle Notation):

```groovy
compile('org.springframework.cloud:spring-cloud-starter-sleuth:1.2.4.RELEASE')
```

Sleuth ist damit standardmäßig aktiviert und erzeugt bei eingehenden Requests eine Trace-ID. Ist im Header des
Requests bereits eine Trace-ID enthalten, wird diese übernommen. In ausgehenden Requests (z.B. über [Feign](http://projects.spring.io/spring-cloud/spring-cloud.html#spring-cloud-feign)
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

Dieser Artikel hat gezeigt, dass man mit überschaubarem Konfigurationsaufwand mit Spring Boot und Sleuth 
ein sinnvolles Logging in einem verteilten System realisieren kann, das einem die Fehlersuche deutlich einfacher macht. 
Die Tracing-Daten können als separate, indizierbare Felder an einen zentralen Logserver übermittelt werden, so
dass die Suche nach Trace-IDs in den Logdaten ebenfalls vereinfacht wird.

# Beispiel-Projekte

Der Beispiel-Code mit einem Downstream- und einen Upstream-Service analog des in diesem Artikel genannten
Beispiels mit Adress- und Kundendaten ist über die folgenden Links auf Github zu finden: 
[downstream-service](https://github.com/thombergs/code-examples/tree/master/sleuth-downstream-service) und
[upstream-service](https://github.com/thombergs/code-examples/tree/master/sleuth-upstream-service).
Die Services sind jeweils mit einer README-Datei versehen, so dass sie sich einfach ausprobieren lassen.
