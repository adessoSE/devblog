---
layout:         [post, post-xml]              
title: "Experimente mit Kotlin, Spring Boot  und Microservices"
date: 2018-02-14 17:45
modified_date:
author: silasmahler
categories: [Programmiersprachen, Kotlin]
tags: [Programmierung, Sprachen, JVM, Spring, Microservices]
---
Kotlin ist für Android-Entwickler nichts Neues, aber wird in der Java-Community immer populärer. Hier ein Hands-On mit einem Demo-Projekt.

### Einige Worte vorweg

Kotlin gibt es mittlerweile seit Februar 2016 und die Sprache wird immer populärer, wodurch sie mehr und mehr Firmen in Produktion einsetzen. Heute wollen wir uns deshalb anschauen, wie wir mit Kotlin relativ schlanke Anwendungen entwickeln können.

Es gibt mehr als genug Tutorials, um die grundlegenden Sprachkonzepte von Kotlin zu erklären, deshalb werden diese nicht in diesem Artikel behandelt. Stattdessen wird die Erstellung einer App mit möglichst minimaler Codebase in den Vordergrund gestellt.

Wenn Sie eine Übersicht über Kotlins Konzepte brauchen, finden Sie diese unter [Awesome Kotlin](https://kotlin.link/).

### Los gehts!

Als Beispielprojekt wird eine Brücken-Applikation, auch Bridge genannt, verwendet, welche die Eureka-Komponente aus dem [Netflix-Open-Source-Stack](https://github.com/spring-cloud/spring-cloud-netflix) anfragt und die registrierten (Micro-)Services erkennt. Diese Daten werden dann dazu verwendet, eine valide yml-Konfigurationsdatei für den Monitoring-Server Prometheus zu erstellen, sodass dieser Daten über die Endpunkte der Services verarbeiten kann.

Unsere [Beispiel-App](https://github.com/adessoAG/eureka-prometheus-bridge) ist eine Spring Boot App.
![Spring-Boot](https://i0.wp.com/thecuriousdev.org/wp-content/uploads/2017/12/spring-boot-logo.png?w=600&ssl=1)

### Konfiguration 

Für die grundlegende Konfiguration verwenden wir das Build-System Gradle. Gradle ist aufgrund des inkrementellen Build-Prozesses etwas schneller als Maven und der Code ist leichter zu lesen. Die Systeme sind aber leicht austauschbar, wenn man lieber mit Maven etc. arbeitet. 

Notiz: Das Projekt kann mit Java 9 kompiliert werden, muss dazu aber etwas anders konfiguriert werden. Darauf wird in diesem Artikel nicht eingegangen. Wenn man das Projekt von grundauf neu aufsetzen möchte, dann empfehle ich dies über [start.spring.io](https://start.spring.io/) zu tun und als Parameter: Gradle Projekt, Kotlin und Spring Boot 2.0.0.M7 sowie die Abhängigkeiten aus der gradle.build zu wählen.

[build.gradle](https://github.com/adessoAG/eureka-prometheus-bridge/blob/master/build.gradle)
```gradle
 buildscript {
	ext {
		kotlinVersion = '1.1.61'
		springBootVersion = '2.0.0.M7'
	}
	repositories {
		mavenCentral()
		maven { url "https://repo.spring.io/snapshot" }
		maven { url "https://repo.spring.io/milestone" }
	}
	dependencies {
		classpath("org.springframework.boot:spring-boot-gradle-plugin:${springBootVersion}")
		classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:${kotlinVersion}")
		classpath("org.jetbrains.kotlin:kotlin-allopen:${kotlinVersion}")
	}
}

apply plugin: 'kotlin'
apply plugin: 'kotlin-spring'
apply plugin: 'eclipse'
apply plugin: 'org.springframework.boot'
apply plugin: 'io.spring.dependency-management'
apply plugin: 'maven-publish'

publishing {	
    publications {
        maven(MavenPublication) {
            from components.java
            pom.withXml {
                asNode().dependencies.'*'.findAll() {
                    it.scope.text() == 'runtime' && project.configurations.compile.allDependencies.find { dep ->
                        dep.name == it.artifactId.text()
                    }
                }.each() {
                    it.scope*.value = 'compile'
                }
            }
        }
    }	
}
model {
    tasks.generatePomFileForMavenPublication {
        destination = file("$buildDir/libs/eureka-prometheus-bridge-0.0.1.pom")
    }	
}

group = 'de.adesso'
version = '0.0.1'
sourceCompatibility = 1.8
compileKotlin {
	kotlinOptions.jvmTarget = "1.8"
}
compileTestKotlin {
	kotlinOptions.jvmTarget = "1.8"
}

repositories {
	mavenCentral()
	jcenter()
	maven { url 'https://repo.spring.io/libs-snapshot' }
	maven { url "https://repo.spring.io/snapshot" }
	maven { url "https://repo.spring.io/milestone" }
	maven { url "https://jitpack.io" }
}

ext {
	springCloudVersion = 'Finchley.M5'
}

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

dependencyManagement {
	imports {
		mavenBom "org.springframework.cloud:spring-cloud-dependencies:${springCloudVersion}"
	}
}

task wrapper(type: Wrapper) {
    gradleVersion = '4.4.1'	
}
```
### Startklasse: EurekaPrometheusBridgeApplication.kt

Die Haupt-Klasse oder Einstiegsklasse unserer Applikation wird mit der Annotation `@EnableScheduling` versehen. So können wir zeitgesteuerte Jobs in unserer Applikation ausführen :+1:

[EurekaPrometheusBridgeApplication.kt](https://github.com/adessoAG/eureka-prometheus-bridge/blob/master/src/main/kotlin/de/adesso/eurekaprometheusbridge/EurekaPrometheusBridgeApplication.kt)
```kotlin
package de.adesso.eurekaprometheusbridge

import org.springframework.boot.autoconfigure.EnableAutoConfiguration
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.scheduling.annotation.EnableScheduling

@SpringBootApplication
@EnableScheduling
class EurekaPrometheusBridgeApplication{
 companion object {
        val log = LoggerFactory.getLogger(ScheduledJobs::class.java.name)
     	//Create runtime-configuration-objects from the provided config-templates
        var eureka_config = EurekaProperties.configTemplate.reify()
        var prometheus_config = PrometheusProperties.configTemplate.reify()
    }

    @PostConstruct
    fun logConfigurationParameters() {
        //Check Config-Template existing
        var file = File(prometheus_config.get(PrometheusProperties.configFileTemplatePath))
        if (!file.exists() || file.isDirectory()) {
            throw FileNotFoundException("The configFileTemplate wasn't found under: " + PrometheusProperties.configFileTemplatePath +
                    "\n The App can't start and will shut down.")
        }
        //Log all Parameters and Values (config_template exiting - throught konfigur8 secured)
        log.info("-------------- Initial Eureka-Properties --------------------------------")
        logConfigParameter(EurekaProperties.port, eureka_config)
        logConfigParameter(EurekaProperties.host, eureka_config)
        logConfigParameter(EurekaProperties.apiPath, eureka_config)
        logConfigParameter(EurekaProperties.showJson, eureka_config)
        log.info("-------------- Initial Eureka-Properties end --------------------------------")

        //Log all Parameters and Values (config_template exiting - throught konfigur8 secured)
        log.info("-------------- Initial Prometheus-Properties --------------------------------")
        logConfigParameter(PrometheusProperties.scrapeInterval, prometheus_config)
        logConfigParameter(PrometheusProperties.scrapeTimeout, prometheus_config)
        logConfigParameter(PrometheusProperties.metricsPath, prometheus_config)
        logConfigParameter(PrometheusProperties.scheme, prometheus_config)
        logConfigParameter(PrometheusProperties.configFileTemplatePath, prometheus_config)
        logConfigParameter(PrometheusProperties.generatedConfigFilePath, prometheus_config)
        log.info("-------------- Initial Prometheus-Properties end --------------------------------")
    }

    fun logConfigParameter(prop: Property<*>, config: Configuration) {
        log.info(prop.toString() + " \t Value: " + config.valueOf(prop).toString())
    }
}

fun main(args: Array<String>) {
    runApplication<EurekaPrometheusBridgeApplication>(*args)
}
```

###Konfiguration 2: Anwendungskonfiguration mit Konfigur8

Normalerweise würde man eine Konfiguration in Spring Boot über die application.properties/application.yml oder eine Klasse mit der Annotation *@Configurationproperties("propertygroup.subgroup")* einbinden. Jedoch kann man dann noch keine Templatingfeatures nutzen und die Konfiguration ist noch nicht typsicher. Nach Evaluation der Frameworks unter  [Awesome-Kotlin#Configuration](https://github.com/KotlinBy/awesome-kotlin#libraries-frameworks-configuration) eignet sich [Configur8](https://github.com/daviddenton/configur8) in der Version für Kotlin, die sich *Konfigur8* nennt, ziemlich gut für diese Aufgabe. Durch das Framework lässt sich das Singleton-Konstrukt *Object* aus Kotlin nutzen, um eine Template zu erstellen, welche typsicher innerhalb des Codes definiert wird und zur Laufzeit als *Object* zur Verfügung steht. So ist die Konfiguration Refactoring-Safe und kann leicht überall wo Sie benötigt wird eingebunden werden. 

Die Templates werden innerhalb des Companion-Objektes erzeugt. In Kotlin hat jede Klasse ein solches Objekt, um beispielsweise einen Logger sicher und maximal einmal pro Klasse zu instanziieren. Genauso kann man mit der Konfiguration verfahren, wenn diese über Instanzen hinweg einheitlich sein soll. Eine interessante Diskussion zu diesem Thema finden Sie [hier](https://discuss.kotlinlang.org/t/what-is-the-advantage-of-companion-object-vs-static-keyword/4034/2).

Als *Objects* für die Properties stehen **EurekaProperties.kt** und **PrometheusProperties.kt** zur Verfügung. Zu Beginn werden die Properties, der Typ, sowie der Key für die Property definiert. Danach folgt eine Template mit default-Belegung der Variablen.

EurekaProperties.kt

```kotlin
package de.adesso.eurekaprometheusbridge

import io.github.konfigur8.ConfigurationTemplate
import io.github.konfigur8.Property

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

Um die Konfiguration nun abzurufen muss später nur noch aus der Konfiguration ein Laufzeitobjekt erstellt werden und dann die Konfiguration ausgelesen werden. Wie das genau funktioniert wird gleich gezeigt.

###Funktionsweise der Eureka-Prometheus-Bridge

#### Schritt 0: Zeitgesteuerte Jobs

Sobald wir unsere App starten wird ein zeitgesteuerter Job angestoßen, der regelmäßig die Hauptfunktion der Anwendung ausführt. Hier *executeBridge()*. Der Klasse **ScheduledJobs** wird per Konstruktor-Injection der Service Eureka-Query injiziert. Dies wäre auch per Method oder Field-Injection möglich, jedoch erzeugt man so am wenigsten Code und kann die Injizierten Services direkt sehen. Die Methode der Dependency-Injection ist eine Geschmacksfrage und bietet verschiedene Vor- und Nachteile [hier](https://symfony.com/doc/current/service_container/injection_types.html) nachzulesen.

ScheduledJobs.kt

```kotlin
package de.adesso.eurekaprometheusbridge

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service

@Service
class ScheduledJobs(
        @Autowired var eurekaQuery: EurekaQuery) {
    
    @Scheduled(fixedDelayString = "\${query.interval.seconds:60}000")
    fun executeBridge() {
        eurekaQuery.queryEureka()
    }
}

```



#### Schritt 1: Eureka anfragen mit khttp

Um nun Eureka anzufragen wird die Klasse **EurekaQuery.kt** verwendet. Die Klasse injiziert den Generator für die spätere Generierung der prometheus.yml und das Companion-Object der Klasse bindet einen Logger sowie das EurekaProperties-Template ein. Das Template wird zu einem Laufzeitobjekt und in diesem Fall über die Variable *config* zugreifbar.

```kotlin
 var config = EurekaProperties.configTemplate.reify()
```

Zu Beginn wird eine *nullable* Variable vom Typ Response angelegt. Diese kommt aus dem [khttp-Framework](https://github.com/jkcclemens/khttp) für Kotlin. Das Framework ermöglich sehr einfache HTTP-Abfragen. Hier wird auch direkt auf die Konfigurationsparamater zugegriffen. Über den Key, der im Object-Singleton gespeichert ist, können entsprechende Werte ausgelesen werden.

```kotlin
 r = get(config.valueOf(EurekaProperties.host) + ":" + config.valueOf(EurekaProperties.port) + config.valueOf(EurekaProperties.apiPath))
```

#### Schritt 2: Daten parsen

War die Anfrage bei Eureka von Erfolg gekrönt, muss das JSON verarbeitet werden. Hieraus werden service-name, -hostname, -port und -targeturl extrahiert.

```kotlin
//Is it one object or an array?
if (!isArray) {
	var name = JSONObjectFromXML.getJSONObject("applications")
    		   .getJSONObject("application").get("name").toString()
	var hostname = JSONObjectFromXML.getJSONObject("applications")
    		   .getJSONObject("application").getJSONObject("instance").get("hostName")
	var port = JSONObjectFromXML.getJSONObject("applications")
	     	   .getJSONObject("application").getJSONObject("instance")
    	       .getJSONObject("port").get("content")
	var targeturl = (hostname.toString() + ":" + port.toString())

    log.info("Found property: $name with targeturl: $targeturl")

    configEntries.add(ConfigEntry(name = name, targeturl = targeturl))

} else if (isArray) {
	log.info("Found multiple Objects:")
    for (o in JSONObjectFromXML.getJSONObject("applications")
         					   .getJSONArray("application")) {
		if (o is JSONObject) {
        	var name = o.get("name").toString()
            var hostname = o.getJSONObject("instance").get("hostName")
            var port = o.getJSONObject("instance").getJSONObject("port").get("content")
            var targeturl = (hostname.toString() + ":" + port.toString())
            
            log.info(""" Found Service: $name with targeturl: $targeturl""".trimIndent())
            	configEntries.add(ConfigEntry(name = name, targeturl = targeturl))
		}
	}
}

```

Diese werden als ConfigEntry neu aufgebaut und zu einer Liste aus ConfigEntries hinzugefügt. Das Schlüsselwort *data* sorgt dafür, dass wir eine Klasse erhalten, die uns Getter- und Setter schenkt und sich im Gegensatz zu klassischen Entitäten unglaublich komprimiert (hier in einer Zeile!) schreiben lässt.

```kotlin
data class ConfigEntry(var name: String = "", var targeturl: String = "")
```

#### Schritt 3: Prometheus.yml erstellen

Anschließend muss noch der Generator aufgerufen werden, um die ConfigEntries zu verarbeiten.

```kotlin
 gen.generatePrometheusConfig(configEntries)
```

Um nachzuvollziehen was genau passiert, schauen wir uns die **Generator.kt** näher an.

```kotlin
 package de.adesso.eurekaprometheusbridge

import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.io.File

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

Die Klasse liest die grundlegende Prometheus-Konfigurationsdatei aus und fügt für jeden ConfigEntry aus der Liste einen weiteren Monitoring-Job ein. Anschließend wird die generierte Datei wieder abgelegt.

```kotlin
    var file = File(config.get(PrometheusProperties.generatedConfigFilePath))
    file.writeText(template)
```


Die Anwendung an sich ist somit beschrieben. Um sie nun möglichst leicht zu betreiben und testen gibt es verschiedene Möglichkeiten.

### Tests mit Spring und JUni

Die Klasse **EurekaPrometheusBridgeApplicationTests.kt** implementiert Anwendungstests. Hier werden verschiedene Methoden aufgerufen und die Konfiguration getestet. Zusätzlich gibt es ein Beispiel mit Spring AOP in Kotlin.

```kotlin
package de.adesso.eurekaprometheusbridge

import junit.framework.Assert.assertEquals
import org.aspectj.lang.ProceedingJoinPoint
import org.aspectj.lang.annotation.Around
import org.aspectj.lang.annotation.Aspect
import org.aspectj.lang.annotation.Pointcut
import org.junit.Test
import org.junit.runner.RunWith
import org.slf4j.LoggerFactory
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.stereotype.Component
import org.springframework.test.annotation.DirtiesContext
import org.springframework.test.context.junit4.SpringRunner
import java.io.File
import javax.annotation.Resource

@RunWith(SpringRunner::class)
@SpringBootTest
@DirtiesContext
class EurekaPrometheusBridgeApplicationTests {

    @Resource
    lateinit var eurekaQuery: EurekaQuery

    @Resource
    lateinit var generator: Generator

    @Resource
    lateinit var scheduledJobs: ScheduledJobs

    @Test
    fun testConfigTemplates() {
        var eureka_config = EurekaProperties.configTemplate.reify()
        var prometheus_config = PrometheusProperties.configTemplate.reify()

        assertEquals(8761, eureka_config.valueOf(EurekaProperties.port))
        assertEquals("http://127.0.0.1", eureka_config.valueOf(EurekaProperties.host))
        assertEquals("/eureka/apps/", eureka_config.valueOf(EurekaProperties.apiPath))
        assertEquals(false, eureka_config.valueOf(EurekaProperties.showJson))

        assertEquals(15, prometheus_config.valueOf(PrometheusProperties.scrapeInterval))
        assertEquals(10, prometheus_config.valueOf(PrometheusProperties.scrapeTimeout))
        assertEquals("/eureka/apps/", prometheus_config.valueOf(PrometheusProperties.metricsPath))
        assertEquals("http", prometheus_config.valueOf(PrometheusProperties.scheme))
        assertEquals("src/main/resources/prometheus-basic.yml", prometheus_config.valueOf(PrometheusProperties.configFileTemplatePath))
        assertEquals("generated-prometheus-configs/prometheus.yml", prometheus_config.valueOf(PrometheusProperties.generatedConfigFilePath))
    }

    @Test
    fun testConfigEntry() {
        var testEntry = ConfigEntry(name = "TestEntry", targeturl = "http://localhost:1234")
        assertEquals("TestEntry", testEntry.name)
        assertEquals("http://localhost:1234", testEntry.targeturl)
    }

    @Test
    fun testGenerator() {
        var configEntries = ArrayList<ConfigEntry>()
        configEntries.add(ConfigEntry("TestEntry1", "http://localhost:1001"))
        configEntries.add(ConfigEntry("TestEntry2", "http://localhost:1002"))
        generator.generatePrometheusConfig(configEntries)
        assertEquals(File(Generator.config.get(PrometheusProperties.testConfigFilePath)).readText(),
                File(Generator.config.get(PrometheusProperties.generatedConfigFilePath)).readText())
    }

    @Test
    fun testEurekaQuery() {
        eurekaQuery.queryEureka()
    }

    @Test
    fun testScheduledJobs() {
        scheduledJobs.executeBridge()
    }

}

@Aspect
@Component
open class TracingAspect {

    @Pointcut("execution(* de.adesso.eurekaprometheusbridge.*.*(..))")
    open fun testMethods() {
    }

    @Around("testMethods()")
    open fun before(joinPoint: ProceedingJoinPoint) {
        val log = LoggerFactory.getLogger(ScheduledJobs::class.java.name)
        val start = System.currentTimeMillis()
        log.info("Going to call the method: " + joinPoint.signature.name)
        val output = joinPoint.proceed()
        log.info("Method execution completed: " + joinPoint.signature.name)
        val elapsedTime = System.currentTimeMillis() - start
        log.info("Method execution time: $elapsedTime milliseconds for: " + joinPoint.signature.name)
    }
}

```



### Tests mit Docker und einer Microservice-Landschaft

Statische Tests sind wichtig, aber um eine Anwendung besser einschätzen zu können, empfiehlt sich immer ein Produktionstest. Hierzu dient ein weiteres Projekt, welches eine Microservice-Landschaft bereitstellt, der [**Eureka-Prometheus-Bridge-Tester**](https://github.com/adessoAG/eureka-prometheus-bridge-tester)

Das Projekt kann natürlich innerhalb einer Entwicklungsumgebund gestartet werden: [Anleitung](https://github.com/adessoAG/eureka-prometheus-bridge-tester/blob/master/README.md) 

Einfacher gestaltet sich das ganze mittels Docker und Docker-Compose.

Hierzu wird lediglich ein Kommanda benötigt, welches im Hauptverzeichnis des Programms ausgeführt wird: 

```dockerfile
docker-compose up
```

Detailliertere Informationen finden Sie im [Readme](https://github.com/adessoAG/eureka-prometheus-bridge/blob/master/Readme.md) des Projekts.



##  Cheers und viel Spaß beim Ausprobieren!
