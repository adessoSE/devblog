---
layout: [post, post-xml]                          
title:  "ArchUnit – Die Umsetzung von Architekturvorgaben lässt sich testen!"         
date:   2020-08-17 20:25                   
author: klausSchnaithmann                                  
categories: [Architektur]                        
tags: [Architektur, Testing]       
---

Eine gute Softwarearchitektur ist einer der Bestandteile, der den Erfolg eines Softwareentwicklungsprojektes maßgeblich mitbestimmt.  
Diese muss nicht nur auf dem Reißbrett entwickelt werden, sondern auch konsequent über den  ganzen Lebenszyklus eines Projektes im Code umgesetzt werden. 
Wie dies mit Hilfe von Tool Unterstützung durch ArchUnit sichergestellt werden kann, möchte ich in diesem Beitrag vorstellen.


# "Das ist historisch gewachsen"

Dies ist ein Satz, den ich schon häufig gehört habe, genauso wie sicherlich auch die meisten anderen Entwickler in IT Projekten. 
Es ist ein Satz der häufig erklären soll, warum etwas nicht so aussieht wie man es erwartet. 
Er soll entschuldigen, dass etwas nicht so aussieht, wie es aussehen sollte. 
Und damit meint der Satz häufig, dass etwas nicht so aussieht, wie es die Architektur beim Aufsetzen des Projektes noch vorgesehen hatte.

Wie genau es dazu kam, lässt sich in den meisten Fällen nicht mehr herausfinden – aber Gründe dafür kann es viele geben. 
Und diese Abweichungen können bewusst oder unbewusst entstanden sein. 
Bewusst, vielleicht unter Zeitnot, um eine Deadline zu halten, und mit dem Ziel, das ganze wieder in Ordnung zu bringen, sobald etwas Zeit dafür ist. 
Oder unbewusst, da einem Entwickler nicht klar war, dass dies kein wünschenswerter Lösungsansatz war. 
Vielleicht war er auch einfach neu dabei, und er war mit der Architektur noch nicht vertraut. 
Sind diese Abweichungen jedenfalls erstmal da, werden sie häufig nicht gleich wieder korrigiert.
Dann verfestigen sie sich durch weiteren Code, der auf diesen Abweichungen aufbaut.

Und genau hier setzt ArchUnit an: 
Unbewusste Abweichungen sollen vermieden werden. 
Und das ganze auf eine Weise, deren Verwendung sich für Entwickler völlig natürlich anfühlt.
Daher schafft ArchUnit die Möglickeit die Einhaltung von Architekturvorgaben über Unit Tests zu validieren! 


# Architekturelle Abweichungen über Tests entdecken!

Und diese Tests zu erstellen ist in den meisten Fällen gar nicht schwer! 
Zunächst müssen wir nur die Abhängigkeiten zu ArchUnit definieren – das ist sowohl mit Maven als auch Gradle ein Kinderspiel. 
So reichen mit Maven zum Beispiel diese 3 Abhängigkeiten, um sein Projekt mit JUnit 4 und ArchUnit zu testen:

```xml
		<dependency>
			<groupId>junit</groupId>
			<artifactId>junit</artifactId>
			<version>4.11</version>
			<scope>test</scope>
		</dependency>
		<dependency>
			<groupId>com.tngtech.archunit</groupId>
			<artifactId>archunit</artifactId>
			<version>0.14.1</version>
			<scope>test</scope>
		</dependency>
		<dependency>
			<groupId>com.tngtech.archunit</groupId>
			<artifactId>archunit-junit4</artifactId>
			<version>0.14.1</version>
			<scope>test</scope>
		</dependency>
```

Natürlich ist alternativ auch der Support für JUnit 5 gegeben.

Und schon können wir auf die 3 APIs zugreifen, die einem ArchUnit zur Definition von Architektur-Tests bietet: 
* Library API
* Lang API
* Core API

Einen kleinen Einblick in diese APIs werden wir im Folgenden anhand eines Beispiels gewinnen.
Dafür lasst uns davon ausgehen, dass wir eine Schichten-Architektur mit folgenden Schichten sicherstellen sollen:

* Controllers: 
Hier sind Schnittstellen (z.B. REST) enthalten, sodass unsere Backendanwendung durch Clients aufgerufen werden kann. 
Sie leitet die Requests dann an fachliche Prozesse weiter. 
Controller-Klassen sollten so benannt werden, dass sie auf "Controller" enden.
* Processes: 
Prozesse bilden die Fachlogik eines bestimmten Use Cases ab. 
Sie werden von Controllern aufgerufen. 
Zur Implementierung der Fachlogik rufen sie ggf. unterschiedliche Services auf und orchestrieren deren Verwendung. 
Prozesse sind streng getrennt voneinander und rufen sich nicht gegenseitig auf. 
Prozess-Klassen sollten so benannt werden, dass sie auf "Process" enden.
* Services: 
Kapseln Funktionalitäten, die von unterschiedlichen Prozessen verwendet werden sollen, um eine einheitliche Umsetzung dieser Funktionalitäten sicherzustellen. 
Dabei können Services sowohl von Prozessen als auch von anderen Services aufgerufen werden. 
Sie rufen dann weitere Services oder Klassen aus der Persistenzschicht auf. 
Service-Klassen sollten so benannt werden, dass sie auf "Service" enden.
* Persistence: 
Hierbei handelt es sich um eine klassische Persistenzschicht. 
Sie soll nur durch Services aufgerufen werden.

## Library API - Eine Bibliothek an Möglichkeiten

Mit der Library API bietet einem ArchUnit bereits eine ganze Bibliothek an fertigen Regeln. 
Diese decken die grundlegenden Regeln von gängigen Architekturmuster ab und müssen nur entsprechend der eigenen Anforderungen konfiguriert werden. 
Mit Hilfe der Library API lassen sich so bereits ein großer Teil der obigen Anforderungen mit wenigen Zeilen sicherstellen:

```java
@RunWith(ArchUnitRunner.class)
@AnalyzeClasses(packages = "de.adesso.blog.archunit.layers")
public class LayerTest {

	@ArchTest
	public static final ArchRule LAYER_DEPENDENCIES_ARE_RESPECTED_CHECK = layeredArchitecture()
			.layer("Controllers").definedBy("de.adesso.blog.archunit.layers.controller..")
			.layer("Processes").definedBy("de.adesso.blog.archunit.layers.process..")
			.layer("Services").definedBy("de.adesso.blog.archunit.layers.service..")
			.layer("Persistence").definedBy("de.adesso.blog.archunit.layers.persistence..")

			.whereLayer("Controllers").mayNotBeAccessedByAnyLayer()
			.whereLayer("Processes").mayOnlyBeAccessedByLayers("Controllers")
			.whereLayer("Services").mayOnlyBeAccessedByLayers("Processes")
			.whereLayer("Persistence").mayOnlyBeAccessedByLayers("Services");
```

Zunächst wird über die RunWith Annotation festgelegt, dass der Test mit ArchUnit ausgeführt werden soll. 
AnalyseClasses legt dann fest für welches Package der Test ausgeführt werden soll.
Jeder Architekturtest kann nun mit @ArchTest eingeleitet und als Variable vom Typ ArchRule erstellt werden.
Für unseren ersten Test definieren wir zunächst jede der 4 Schichten: 
Innerhalb von layer() wird ihr ein Name gegeben, mit definedBy() wird festgelegt in welchem Paket man Klassen dieser Schicht findet.
Anschließend wird noch festgelegt welche Schichten auf welche anderen Schichten zugreifen dürfen.
Beim ausführen dieser Klasse als JUnit Test, geht ArchUnit nun über die Klassen einer Schicht und prüft, ob diese Referenzen zu Klassen aus Schichten enthalten, für die ein Zugriff nicht erlaubt ist. 
Ist dies der Fall, wird der Test rot – ein nicht vorgesehener Zugriff auf Schichten wird somit verhindert.

Dieses Beispiel zeigt, wie einfach die Library API zu verwenden ist. 
Neben der Prüfung auf Schichten Architekturen bietet die Library API noch viele weitere Möglichkeiten wie Prüfungen für Hexagonale Architekturen oder auch generelle Programmierrichtlinien. 
Aber natürlich kann ArchUnit mit der Library API keine vorgefertigte Blaupause für alle architekturellen Vorgaben bieten. 


## Lang API - Tests als Sätze formulieren

Wenn es spezieller wird, müssen wir auf die Lang API ausweichen. 
Diese ist mit dem Ziel entwickelt worden, ein möglichst breites Spektrum an Vorgaben so einfach beschreiben zu können, wie mit natürlicher Sprache. 
Hiermit können wir nun eine Lücke füllen, die sich nach der Umsetzung mit der Library API oben noch ergeben hat: 
Sicherstellen, dass Klassen entsprechend der Erwartung benannt sind.

```java
	@ArchTest
	public static final ArchRule CONTROLLER_NAMES_CHECK = ArchRuleDefinition.classes()
			.that().resideInAPackage("de.adesso.blog.archunit.layers.controller..")
			.should().haveSimpleNameEndingWith("Controller");

	@ArchTest
	public static final ArchRule PROCESS_NAMES_CHECK = ArchRuleDefinition.classes()
			.that().resideInAPackage("de.adesso.blog.archunit.layers.process..")
			.should().haveSimpleNameEndingWith("Process");

	@ArchTest
	public static final ArchRule SERVICE_NAMES_CHECK = ArchRuleDefinition.classes()
			.that().resideInAPackage("de.adesso.blog.archunit.layers.service..")
			.should().haveSimpleNameEndingWith("Service");
```

Wie angekündigt sind die Regeln der Language API aufgrund der sprechenden Benennung selbsterklärend – die Möglichkeiten sind aber dennoch sehr vielseitig. 
Es gibt viele weitere vordefinierte Prüfungen und Einschränkungen – statt auf den Namen können wir zum Beispiel auch auf Annotationen, Modifier oder den Zugriff auf andere Klassen prüfen. Zudem lassen sich auch weitere Prüfungen selber definieren. 
Hierbei ist zu beachten, dass eine Prüfung in der Language-Schicht üblicherweise wie folgt aussieht: 
"Klassen mit ${Einschränkung/Predicate} sollten ${Bedingung/Condition} erfüllen."

Beim Erstellen einer eigenen Prüfung können wir daher bei der Einschränkung oder der Bedingung ansetzen. 
In diesem Beispiel fehlt uns noch eine Bedingung, die verhindert, dass von Prozessen auf andere Prozesse zugegriffen wird. 
Die Einschränkung von oben aus der Library API konnte das nicht abdecken, da diese die Zugriffe innerhalb eines Layers nicht begrenzt. 


## Core API - Alles andere geht hiermit

Wenn wir diese Beschränkung nun umsetzen wollen, bekommen wir auch einen ersten Kontakt zur Core-API von ArchUnit. 
Diese verwendet zu einem großen Teil Konzepte, wie wir sie von der Java Reflection API kennen, erweitert diese aber, um die Beziehungen zwischen Code-Fragmenten besser darstellen zu können. 

Die Bedingung, dass Prozesse nicht auf andere Prozesse zugreifen dürfen, könnte man nun beispielsweise wie folgt umsetzen:

```java
	private static final ArchCondition<JavaClass> NOT_ACCESS_OTHER_PROCESSES_CONDITION 
		= new ArchCondition<JavaClass>("not access other processes") {
		
		@Override
		public void check(JavaClass classUnderTest, ConditionEvents events) {
			for (JavaAccess access : classUnderTest.getAllAccessesFromSelf()) {
				// access so same class is allowed
				if (access.getTargetOwner() != access.getOriginOwner() 
					// but call to other processes isn't allowed
					&& (access.getTargetOwner().getPackageName()
						.startsWith("de.adesso.blog.archunit.layers.process"))) {

					String message = String.format("Access to other process by %s", access.getOrigin());
					events.add(SimpleConditionEvent.violated(access, message));
				}
			}
		}
	};
```

Hierbei definieren wir zunächst eine Bedingung, die alle Zugriffe die von einer Klasse ausgehend überprüft. 
JavaClass entspricht hierbei, wie der Name bereits sagt, einer Java Klasse und gibt uns sehr viele Informationen über diese. 
In unserem Fall interessieren wir uns dafür, worauf von dieser Klasse aus zugegriffen wird – und mit classUnderTest.getAllAccessesFromSelf() erhalten wir damit nicht nur Methodenaufrufe, sondern auch direkte Feldzugriffe. 
Geprüft wird hierbei, ob der Zugriff zur selben Klassen geht – das ist natürlich erlaubt – und wenn nicht, ob die aufgerufene Klasse auch im Paket für Prozesse liegt. 
Sollte dies der Fall sein, wurde ein anderer Prozess aufgerufen, und unsere Regel wurde verletzt. 
Nun müssen wir diese Bedingung noch in eine Regel integrieren: 

```java
	@ArchTest
	public static final ArchRule PROCESSES_SHOULD_NOT_ACCESS_OTHER_PROCESSES_CHECK 
		= ArchRuleDefinition.classes()
			.that().resideInAPackage("de.adesso.blog.archunit.layers.process..")
			.should(NOT_ACCESS_OTHER_PROCESSES_CONDITION);
```

Dadurch, dass wir unsere neue Bedingung nun auf alle Klassen im Paket für Prozesse testen, haben wir sichergestellt, dass kein Prozess einen anderen aufrufen kann. 
Unsere zuvor aufgestellten architekturellen Anforderungen an unsere Schichten-Architektur sind damit nun komplett abgedeckt.

Hierbei handelt es sich natürlich um sehr einfache Beispiele. 
In einem realen Projekt hätten wir mit Sicherheit eine größere Komplexität und weitere Besonderheiten. 
Vielleicht existieren spezielle Annotationen für Prozesse und Services – eine Überprüfung hierauf wäre aber nicht komplizierter als die Prüfung auf den Klassennamen. 
Die Prüfung auf die Annotation könnte uns dann auch wieder Hilfsklassen mit anderen Namen in den Schichten erlauben, die durch die Namensprüfung aktuell ausgeschlossen wären.
Insgesamt haben wir bisher ein gutes Bild erhalten, wie wir mit wenigen Zeilen Code, die dazu recht sprechend sind, architekturelle Vorgaben sicherstellen können.


# Umgang mit Legacy Code und gewollten Abweichungen

Dennoch mag es Gründe geben, warum nicht auf einen Schlag die gesamte Anwendung den Vorgaben entsprechen kann. 
Insbesondere bei größeren Legacy Anwendungen ist ein entsprechendes Refactoring ein zeitaufwendiger Prozess, der sich eventuell nur Schrittweise durchführen lässt. 
Ein Hilfsmittel, das einem ArchUnit dabei an die Hand gibt, ist die sogenannte "Freezing Arch Rule". 
Um diese zu verwenden, müssen wir eine vorhandene ArchRule mit FreezingArchRule.freeze() umfassen:

```java
	@ArchTest
	public static final ArchRule PROCESSES_SHOULD_NOT_ACCESS_OTHER_PROCESSES_CHECK 
		= FreezingArchRule.freeze(
			ArchRuleDefinition.classes().
				that().resideInAPackage("de.adesso.blog.archunit.layers.process..")
				.should(notAccessOtherProcessesCondition));
```

Der Effekt davon? 
Beim ersten Aufrufen der Regeln werden alle existierenden Verletzungen der Regel gespeichert. 
Bei zukünftigen Testläufen werden sie dann nicht als Fehler gemeldet. 
Entsprechend lässt sich so sicherstellen, dass wir keine neuen Verletzungen der Regel einbauen, wir aber trotz der alten Verletzungen keine Testfehler erhalten. 
Das gibt uns den Freiraum, das Refactoring des Legacy Codes über einen angemessenen Zeitraum hinweg anzugehen.

Zudem sei erwähnt, dass es auch möglich ist, Ausnahmen zu den Tests zu definieren, wenn wir bewusst von den Regeln abweichen wollen. 
Natürlich sollte dies nur sehr sparsam und aus gutem Grund erfolgen. 
Und ein roter Test wird gleich ein paar Fragen aufwerfen: 
Warum haben wir eine Abweichung? Brauchen wir hier wirklich eine Ausnahme? 
Und selbst, wenn wir zu dem Schluss kommen, dass die Abweichung im besten Sinne des Projektes ist: 
Vielleicht können wir die Korrektur zu dieser Ausnahme direkt einplanen? 
Braucht es die Ausnahme auch im Branch für das kommende Release?


# Fazit

Dass wir diese Ausnahmen aber explizit festlegen müssen, bringt uns wieder zurück auf den Kern des Artikels: 
ArchUnit erlaubt es uns unbewusste Abweichungen zu Architekturvorgaben zu vermeiden! 
Es zwingt uns, uns mit den Abweichungen auseinanderzusetzen und eine bewusste Entscheidung im Sinne des Projektes zu treffen.
Zudem ist es relativ einfach anzuwenden. 
Und selbst falls wir nur einen Teil der Architekturvorgaben hiermit abbilden, kann dies bereits ein wichtiger Schritt für die Qualitätssicherung eines Projektes sein. 	
