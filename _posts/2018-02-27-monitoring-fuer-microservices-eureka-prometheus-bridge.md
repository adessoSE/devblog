---
layout:         [post, post-xml]              
title: "Monitoring für Microservices - Eine Bridge für Eureka und Prometheus"
date: 2018-02-14 17:45
modified_date:
author: silasmahler
categories: [Monitoring, Microservices, Kotlin]
tags: [Prometheus, Eureka, Bridge, JVM, Kotlin, Spring, Microservices]
---
Monitoring mittels Servertechnologien wie Prometheus wird für Anwendungen heutzutage immer wichtiger. Microservicelandschaften bilden in 
ihrer Dynamik hier keine Ausnahme. Die Service-Discovery Eureka, die im Spring Cloud Umfeld häufig Verwendung findet, soll deshalb
auch mit Prometheus zusammenarbeiten können. Eine Lösung wird in diesem Artikel vorgestellt.

# Einleitung

### Vorbereitung

1. IDE mit Tooling für Spring
2. Spring Basics
3. Kotlin Basics
4. Hilfreich: Docker Basics

### Eureka

Eureka ist eine sogenannte Service-Discovery aus dem Spring Cloud Umfeld. Diese Systeme werden in Microservice-Landschaften zum automatischen erkennen, registrieren und deregistrieren von Services genutzt. 

### Prometheus

Prometheus ist ein relativ junges Open Source Projekt, dass eine Monitoring-Lösung für Anwendungssysteme bietet. Dazu sammelt Prometheus Metriken von konfigurierten Zielen ein und stellt diese auf verschiedene Weise dar.

### Problem & Ziel

Aktuell gibt es für Prometheus noch kaum eine Möglichkeit in einer dynamischen Microservice-Umgebung im Spring Cloud Umfeld die dynamisch veränderlichen Konfigurationen von Services mit einzubeziehen, sodass bei Veränderungen immer die neusten Service-Urls für das Sammeln von Metriken genutzt werden. Speziell für Eureka fehlt eine Implementierung. Dies soll sich mit dieser Anwendung ändern und folgende Ziele soll unsere Anwendung erfüllen:

1. Regelmäßig Informationen über Services von Eureka anfordern
2. Informationen verarbeiten und für Erstellung einer prometheus.yml nutzen
3. Statische und dynamische Tests in einer Produktionsähnlichen Umgebung



# Los gehts!

Als Beispielprojekt wird eine Brücken-Applikation, auch Bridge genannt, verwendet, welche die Eureka-Komponente aus dem [Netflix-Open-Source-Stack](https://github.com/spring-cloud/spring-cloud-netflix) anfragt und die registrierten (Micro-)Services erkennt. Diese Daten werden dann dazu verwendet, eine valide yml-Konfigurationsdatei für den Monitoring-Server Prometheus zu erstellen, sodass dieser Daten über die Endpunkte der Services verarbeiten kann.

Unsere [Beispiel-App](https://github.com/adessoAG/eureka-prometheus-bridge) ist eine Spring Boot App.

### Umgebungskonfiguration

Für die grundlegende Konfiguration verwenden wir das Build-System Gradle und binden einige Spring-Projekte, sowie externe Frameworks ein.

[build.gradle](https://github.com/adessoAG/eureka-prometheus-bridge/blob/master/build.gradle)

```gradle
 buildscript {
	ext {
		kotlinVersion = '1.1.61'
		springBootVersion = '2.0.0.M7'
//...
}

//...

dependencies {
	compile('io.github.daviddenton:konfigur8:1.7.0')
	compile("com.github.jkcclemens:khttp:0.1.0")
	compile('org.springframework.boot:spring-boot-starter')
	compile('org.springframework.boot:spring-boot-starter-aop')
	compile('org.springframework.boot:spring-boot-starter-logging')
	compile("org.springframework.boot:spring-boot-configuration-processor")
	compile("org.jetbrains.kotlin:kotlin-stdlib-jre8")
	compile("org.jetbrains.kotlin:kotlin-reflect")
	compile("com.fasterxml.jackson.module:jackson-module-kotlin")
	compile group: 'org.json', name: 'json', version: '20171018'
	testCompile('org.springframework.boot:spring-boot-starter-test')
}
```

### Startklasse: EurekaPrometheusBridgeApplication

Die Haupt-Klasse oder Einstiegsklasse unserer Applikation wird mit der Annotation `@EnableScheduling` versehen. So können wir zeitgesteuerte Jobs in unserer Applikation ausführen 👍

[EurekaPrometheusBridgeApplication.kt](https://github.com/adessoAG/eureka-prometheus-bridge/blob/master/src/main/kotlin/de/adesso/eurekaprometheusbridge/EurekaPrometheusBridgeApplication.kt)

```kotlin
@SpringBootApplication
@EnableScheduling
class EurekaPrometheusBridgeApplication {
	//...
}
fun main(args: Array<String>) {
    runApplication<EurekaPrometheusBridgeApplication>(*args)
}
```

### Anwendungskonfiguration

Die Konfiguration der Anwendung wird an dieser Stelle vom Kotlin-Framework *Konfigur8*  übernommen. Durch das Framework lässt sich das Singleton-Konstrukt *Object* aus Kotlin nutzen, um eine Template zu erstellen, welche typsicher innerhalb des Codes definiert wird und zur Laufzeit als *Object* zur Verfügung steht. So ist die Konfiguration Refactoring-Safe und kann leicht überall wo Sie benötigt wird eingebunden werden. 

###### Definition einer Konfiguration in EurekaProperties

```kotlin
object EurekaProperties {
    var port = Property.int("eureka.bridge.port")
    var host = Property.string("eureka.bridge.host")
    var apiPath = Property.string("eureka.bridge.apiPath")
    var showJson = Property.bool("eureka.bridge.showJson")

    val configTemplate = ConfigurationTemplate()
            .withProp(port, 8761)
            .withProp(host, "http://127.0.0.1")
            .withProp(apiPath, "/eureka/apps/")
            .withProp(showJson, false)
}
```

Um die Konfiguration nun abzurufen muss später nur noch aus der Konfiguration ein Laufzeitobjekt erstellt werden und dann die Konfiguration ausgelesen werden. 

###### Laufzeitobjekt erzeugen

```kotlin
var eureka_config = EurekaProperties.configTemplate.reify() 
//In Kotlin möglichst im Companion-Objekt
```

###### Abrufen der Konfiguration

```kotlin
var port = eureka_config.valueOf(EurekaProperties.port)
```



## Die Anwendung

#### Zeitgesteuerte Ausführung

Sobald wir unsere App starten, wird ein zeitgesteuerter Job angestoßen, der regelmäßig die Hauptfunktion der Anwendung ausführt. Das Intervall wird hier klassisch aus einer Properties-Datein ausgelesen, da ein Annotationsparameter zur Compilezeit eine Konstante sein muss.

ScheduledJobs.kt

```kotlin
@Service
class ScheduledJobs(
        @Autowired var eurekaQuery: EurekaQuery) {
    
    @Scheduled(fixedDelayString = "\${query.interval.seconds:60}000")
    fun executeBridge() {
        eurekaQuery.queryEureka()
    }
}
```

#### Eureka anfragen

Um nun Eureka anzufragen wird die Klasse **EurekaQuery.kt** verwendet. 

Zu Beginn wird eine *nullable* Variable vom Typ Response angelegt. Standard in Kotli ist, dass eine Variable nicht mit null belegt werden darf, deswegen nutzt man hier den Operator "?".

Die Klasse Response kommt aus dem [khttp-Framework](https://github.com/jkcclemens/khttp) für Kotlin. Das Framework ermöglicht sehr einfache HTTP-Anfragen. Hier wird auch direkt auf die Konfigurationsparamater zugegriffen. 

```kotlin
var r: Response? = get(config.valueOf(EurekaProperties.host) + ":" + config.valueOf(EurekaProperties.port) + config.valueOf(EurekaProperties.apiPath))
```

#### JSON parsen

War die Anfrage bei Eureka von Erfolg gekrönt, muss das JSON verarbeitet werden. Hieraus werden service-name, -hostname, -port und -targeturl extrahiert. Exemplarisch hier für den Servicenamen zu sehen.

```kotlin
//...
var name = JSONObjectFromXML.getJSONObject("applications").getJSONObject("application").get("name").toString()
//...
log.info("Found property: $name with targeturl: $targeturl")
```

#### ConfigEntry erzeugen

Nun sollen die gewonnen Informationen in einem Objekt hinterlegt werden. Hierzu dient die Klasse ConfigEntry. Das Schlüsselwort *data* sorgt dafür, dass wir eine Klasse erhalten, die uns Getter- und Setter schenkt und sich im Gegensatz zu klassischen Entitäten unglaublich komprimiert (hier in einer Zeile!) schreiben lässt.

```kotlin
data class ConfigEntry(var name: String = "", var targeturl: String = "")
```

#### Generierung der Prometheus.yml 

Anschließend brauchen wir noch einen Generator, um unsere ConfigEntries zu verarbeiten.
Um nachzuvollziehen was genau passiert, schauen wir uns die Datei **Generator.kt** näher an.

```kotlin
@Service
class Generator {
    companion object {
        val log = LoggerFactory.getLogger(Generator::class.java.name)
        var config = PrometheusProperties.configTemplate.reify()
    }

    fun generatePrometheusConfig(entries: List<ConfigEntry>) {
        log.info("Reading basic Prometheusfile")
        var template = File(config.get(PrometheusProperties.configFileTemplatePath)).readText()
        for (configEntry in entries) {
            var entry = """
                - job_name: ${configEntry.name}
                  scrape_interval: ${config.get(PrometheusProperties.scrapeInterval)}s
                  scrape_timeout: ${config.get(PrometheusProperties.scrapeTimeout)}s
                  metrics_path: ${config.get(PrometheusProperties.metricsPath)}
                  scheme: ${config.get(PrometheusProperties.scheme)}
                  static_configs:
                  - targets:
                    - ${configEntry.targeturl}
                                """.trimIndent()
            template += "\n" + entry
        }
        var file = File(config.get(PrometheusProperties.generatedConfigFilePath))
        file.writeText(template)
        log.info("Config generated!")
    }
}
```

Die Klasse liest die grundlegende Prometheus-Konfigurationsdatei aus und fügt für jeden ConfigEntry aus der Liste einen weiteren Monitoring-Job für Prometheus ein. Anschließend wird die generierte Datei wieder abgelegt.

Die Anwendung an sich ist somit betriebsbereit. Um sie nun möglichst leicht zu betreiben und testen gibt es verschiedene Möglichkeiten.

### Tests mit Spring und JUni

Die Klasse **EurekaPrometheusBridgeApplicationTests.kt** implementiert Anwendungstests. Hier werden verschiedene Methoden aufgerufen und die Konfiguration getestet. Zusätzlich gibt es ein Beispiel mit Spring AOP in Kotlin.

### Tests mit Docker und einer Microservice-Landschaft

Statische Tests sind wichtig, aber um eine Anwendung besser einschätzen zu können, empfiehlt sich immer ein Produktionstest. Hierzu dient ein weiteres Projekt, welches eine Microservice-Landschaft bereitstellt, der [**Eureka-Prometheus-Bridge-Tester**](https://github.com/adessoAG/eureka-prometheus-bridge-tester)

Das Projekt kann natürlich innerhalb einer Entwicklungsumgebung gestartet werden: [Anleitung](https://github.com/adessoAG/eureka-prometheus-bridge-tester/blob/master/README.md) 

Einfacher gestaltet sich das ganze mittels Docker und Docker-Compose.

Hierzu wird lediglich ein Kommando benötigt, welches im Hauptverzeichnis des Programms ausgeführt wird: 

```dockerfile
docker-compose up
```

Detailliertere Informationen finden Sie im [Readme](https://github.com/adessoAG/eureka-prometheus-bridge/blob/master/Readme.md) des Projekts.
