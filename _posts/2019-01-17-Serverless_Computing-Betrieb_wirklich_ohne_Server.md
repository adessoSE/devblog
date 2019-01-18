---
layout:         [post, post-xml]              
title:          "Serverless Computing – Betrieb wirklich ohne Server"
date:           2019-01-27 12:01
modified_date: 
author:         hartmann42 
categories:     [Java]
tags:           [Spring, FaaS, Architektur]
---

Nachdem Microservice basierte Architekturen sich zunehmend als Architekturansatz der Wahl bei der Neuentwicklung von 
Anwendungslandschaften und der Modernisierung von Monolithen etabliert haben, baut sich bereits die nächste 
Innovationswelle mit Function as a Service (FaaS) und Serverless Computing auf.

Schaut man sich nun Function as a Service (FaaS) und Serverless Computing an, so wird man mit folgenden Aussagen konfrontiert:
* Eine FaaS beinhaltet lediglich den Fachcode einer Funktion. 
* Die klar fokussierte fachliche Komplexität einer FaaS führt zu einer sehr guten Wartbarkeit. 
* Eine FaaS ist prinzipiell stateless. Die ggf. notwendige Persistierung von Daten ist in einem externen System vorzunehmen.
* Eine FaaS ist ereignisgetrieben und hat keinen laufenden Serverprozess. 
* Bei der Ausführung einer FaaS wird jeweils eine neue Instanz erzeugt und nach der Ausführung verworfen. Die Ausführung einer FaaS kann z.B. mittels ein Http Request oder Event ausgelöst werden.  
* FaaS Laufzeitumgebungen skalieren automatisch. Im Rahmen der Entwicklung und des Betriebs muss man sich zunächst keine Gedanken hinsichtlich der Skalierbarkeit machen. Dies übernimmt der Cloudprovider.
* Serverless bedeutet in diesem Zusammenhang nicht, dass es keine Infrastruktur gibt, auf dem die Funktion ausgeführt wird. Vielmehr wird eine optimierte Laufzeitumgebung zur Ausführung der Funktionen von einem Cloudprovider zur Verfügung gestellt. 
* Der Einsatz von FaaS bietet sich insbesondere bei deutlichen Schwankungen hinsichtlich des Nutzungsverhaltens an.

Die drei großen Cloudprovider, Amazon Web Services, Microsoft Azure und Google Cloud Plattform bieten schon heute die 
entsprechenden Dienste zur Nutzung von FaaS an. Das Thema hat damit längst den experimentellen Rahmen verlassen und ist 
ein Lösungsansatz zur Umsetzung von verteilten Systemen geworden.

Bezüglich der Implementierung einer FaaS stellt sich schnell heraus, dass es kein einheitliches Programmiermodell für 
FaaS gibt, sondern man ein entsprechendes Vendor Lock-in hat. Will man also den FaaS Anbieter zu einem späteren Zeitpunkt 
wechseln oder gar von der Cloud hin zu On Premises wechseln hat, man prinzipiell Portierungs- und Testaufwand. 

Für das Problem des Vendor Lock-in bietet das Spring Cloud Function Projekt den passenden Lösungsansatz. Es stellt ein 
einheitliches FaaS Programmiermodell über eine Vielzahl von Cloud Providern hinweg zur Verfügung. So werden die Cloud 
Provider Amazon Web Services, Microsoft Azure und die Open Source Servless Plattform OpenWhisk von Apache unterstützt. 

Des Weiteren kann eine FaaS herkömmlich betrieben werden. Hierbei kommt dann eine Spring Boot Anwendung mit einem Tomcat 
zum Einsatz. Dies reduziert im Rahmen der Entwicklung die Aufwände, da diese on Premise durchgeführt werden kann und 
lediglich die Tests und Produktion in der Cloud stattfinden.

Zur Entwicklung einer FaaS können die bekannten Spring Boot Features wie die Konfiguration und die Dependency Injektion 
genutzt sowie mittels Spring Boot Actuator das Monitoring der FaaS durchgeführt werden. Darüber hinaus steht prinzipiell 
das gesamte Spring Ökosystem zur Verfügung, um möglichst effizient eine FaaS umzusetzen. Aus Entwicklungssicht 
unterscheidet sich somit die Programmierung einer FaaS nicht von der herkömmlichen Entwicklung mit Spring.

Die einfachste Form ein FaaS mittels Spring Cloud Function besteht dabei aus dem eigentlich Startklasse, 
siehe Application Klasse, und der FaaS Implementierung, siehe Greeter Klasse, selbst.

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}
}
```

```java
import java.util.function.Function;

public class Greeter implements Function<String, String> {

	@Override
	public String apply(String name) {
		return "Hello " + name;
	}	
}
```

Auf den ersten Blick hat dieser Ansatz zahlreiche Vorteile. So kann im Rahmen der Entwicklung das etablierte Spring 
Programmiermodell mit dem umfangreichen Ökosystem eingesetzt werden. Auch das Thema polyglotte Ausführungsumgebungen 
ist entsprechend berücksichtigt, da man die FaaS sowohl On Premise als auch auf ausgewählten Cloud Providern betreiben kann.

Aus Sicht der Ausführungsdauer einer FaaS und der damit einhergehenden laufenden Kosten und der ressourcenschonenden Nutzung 
stellt es sich leider nicht so positiv dar. Um die FaaS auf einer Cloud Plattform betreiben zu können, sind alle eingesetzten 
abhängigen Bibliotheken mit auszuliefern. Betrachtet man das oben aufgeführte Bsp. so ist der JAR File letztendlich wenige kB 
groß, wenn die benötigten Bibliotheken nicht mit ausgeliefert werden. Werden diese jedoch mittels des Maven Shade Plugins 
während des Buildprozesses mit hinzugenommen, ist der JAR nahezu 20.000 kB groß. 

Bei der Ausführung als AWS Lambda ist der Speicherverbrauch während der Ausführung mit annähernd 100 MB nicht gerade klein. 
Ohne den Overhead von Spring würde sich der benötigte Speicherverbrauch bei ca. 20 MB bewegen. Auch bei der Ausführungsdauer 
kann man mit ca. 100 ms gegenüber von ca. 10 ms ausgehen. Siehe hierzu auch den folgenden Blog Beitrag auf [Developer Zone](https://dzone.com/articles/run-code-with-spring-cloud-function-on-aws-lambda) 
und das [Einstiegstutorial zu AWS Lambda](https://docs.aws.amazon.com/de_de/lambda/latest/dg/get-started-create-function.html).

Da die Ausführungsdauer und der Speicherverbrauch bei dem [Abrechnungsmodell von AWS Lambda](https://aws.amazon.com/de/lambda/pricing/#Free_Tier) 
die abrechnungsrelevanten Faktoren sind, ist vor der produktiven Nutzung von Spring Cloud Functions abzuklären, ob die aus 
Sicht der Produktionskosten ein gangbarer Weg ist. Desweitern ist natürlich auch zu klären, ob die längere Ausführungsdauer 
bei der Nutzung von Spring Cloud Functions aus Benutzersicht akzeptabel ist.
