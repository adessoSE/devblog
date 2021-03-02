---
layout: [post, post-xml]
title:  "NodeJS als Auskunftswebservice einer JEE-Applikation"
date:   2018-03-06 12:00
modified_date: 2018-02-20
author: AdessoMaDa
categories: [Softwareentwicklung]
tags: [Java, Architektur]
---

Seit über zehn Jahren sind JEE-Applikationen etabliert, um unternehmenskritische Verfahren auf einer vereinheitlichten IT-Infrastruktur zu entwickeln.
In den letzten Jahren sind leichtgewichtigere Alternativen wie NodeJs immer beliebter geworden und werden oft als Alternative zu JEE-Applikationsservern angesehen.
Dieser Beitrag stellt dar, wie beide Technologien zusammenspielen können.

## Worum geht's hier?

Im Zuge der Digitalisierung von Geschäftsprozessen laufen große unternehmenskritische Applikationen zunehmend nicht mehr ausschließlich im internen Betrieb, sondern
müssen auch unternehmensexterne Benutzer wie Geschäftspartner und Kunden ansprechen. Diesen werden ausgewählte Informationen zu laufenden Geschäftsvorgängen zugänglich gemacht.
Dabei muss die Vertraulichkeit der nur intern genutzten Daten zu den Geschäftsvorgängen gewährleistet bleiben. Nur jene Informationen, die explizit freigegeben werden, 
dürfen für externe Nutzer einsehbar sein.

Dies kann sichergestellt werden durch einen Prozess, der eine explizite Freigabe der zu veröffentlichenden Informationen vorsieht sowie durch separate Speicherung der veröffentlichten Daten 
und separate Zugriffspfade.

Die folgende Abbildung zeigt eine grobe Prozessbeschreibung:
![Prozessbechreibung zu NodeJS als Auskunftswebservice einer JEE-Applikation](../assets/images/posts/NodeJS-als-Auskunftswebservice-einer-JEE-Applikation/Aktivitaetsdiagramm.png)

Im vorliegenden Projektbeispiel haben wir uns entschieden, die Geschäftsapplikation als JEE-Applikation zu entwickeln und diese um einen Auskunftsservice auf Basis des MEAN-Stacks zu erweitern.

## Warum entwickeln wir JEE-Applikationen?

In vielen größeren Unternehmen werden für die Entwicklung von unternehmenskritischen Applikationen Referenzarchitekturen vorgegeben.
Dies dient vor allem dem Zweck, einheitliche Strukturen für Deployment und Rollout dieser Anwendungen einzuhalten und somit 
auch einheitliche Verfahren für den Betrieb dieser Applikationen durchzusetzen. Damit soll die Total Cost of Ownership für den Betrieb
der Applikationen so gering wie möglich gehalten werden. Einheitliche Architekturen unterstützen außerdem die Wiederverwendung von
Querschnittsfunktionen wie Benutzerauthentifizierung, Autorisierung oder Logging durch verschiedene Applikationen.

Im vorliegenden Projektbeispiel ist durch den Kunden eine Referenzarchitektur auf Basis von Java Enterprise Edition (JEE) vorgegeben.
Auf dieser Basis haben wir eine unternehmenskritische Applikation entwickelt, die von internen Mitarbeitern des Auftraggebers im Intranet des Unternehmens genutzt wird.

## Was sind die Vorteile dieser Architektur?

Unternehmenskritische Applikationen auf Basis einer solchen Plattform aufzusetzen bringt eine Reihe von Vorteilen.
In der Datenhaltungsschicht wird ein relationales Datenbanksystem eingesetzt, das viele Anforderungen in Bezug auf eine revisionssichere Datenhaltung durch 
eingebaute Funktionen abdeckt. Konzepte und Werkzeuge zur Datensicherung und Wiederherstellung liegen vor und müssen nicht speziell entwickelt werden.
In der Geschäftslogikschicht steht eine Reihe von Querschnittsfunktionen und Bibliotheken zur Verfügung, mit denen komplexe Geschäftsabläufe effizient umgesetzt werden können.
Die Verarbeitung auch von großen Datenmengen ist möglich und es stehen Werkzeuge zur Verfügung, um diese möglichst effizient zu gestalten.

## Welche Nachteile hat diese Architektur?

Der große Funktionsumfang der zugrunde liegenden Softwaresysteme  bringt aber auch Nachteile mit sich. Relationale Datenbanksysteme mit transaktionsorientierter Arbeitsweise
begrenzen die Möglichkeit von echt paralleler Verarbeitung, da beim gleichzeitigen Zugriff auf sich überschneidende Datenbestände immer eine logische Serialisierung der Zugriffe stattfindet.
Dies erzwingt Wartezeiten beim gleichzeitigen Zugriff auf diese Daten. Die Mechanismen, welche die dauerhafte Speicherung von ausgeführten Datenänderungen
sicherstellen, führen zu zusätzlichen Verarbeitungsschritten und verlängern somit die Ausführungszeit.

Die Vielzahl der eingebauten Funktionen bringt außerdem einen hohen Bedarf an Systemressourcen, wie zum Beispiel Arbeitsspeicher, mit sich. Deshalb müssen Applikationen, die auf einer solchen
Architektur basieren, gezielt dimensioniert werden. Hierfür sollte das Mengengerüst der Daten, die Anzahl der Nutzer, welche die Applikation
insgesamt nutzen, sowie die Anzahl der gleichzeitigen Zugriffe auf die einzelnen Funktionen bekannt sein. Im vorliegenden Projektbeispiel wird die Geschäftslogik
auf 4 unterschiedlichen Serverknoten ausgeführt und lang laufende Geschäftsprozesse werden asynchron ausgeführt.

## Was ist, wenn diese Randbedingungen nicht bekannt sind?

Soll unsere unternehmenskritische Anwendung nun zusätzlich einen öffentlich zugänglichen Auskunftsservice beinhalten, so sind viele dieser Randbedingungen nicht mehr bekannt.
Wir wissen nicht genau, wie viele Nutzer zu welcher Zeit und in welcher Häufigkeit Anfragen an den Auskunftsservice stellen werden. Wir benötigen daher eine Architektur, 
welche mit vorgegeben Systemressourcen eine hohe Skalierbarkeit ermöglicht. Da es sich um einen reinen Auskunftsservice handelt, benötigen wir andererseits auch viele 
der in der JEE-Plattform genutzten Funktionen nicht, da wir hier keine Daten verändern und somit auch keine besonderen Anforderungen an die Erhaltung von Datenkonsistenz 
und die dauerhafte Speicherung unserer Änderungen stellen müssen.

Ein leichtgewichtiger und hoch skalierbarer Auskunftsdienst lässt sich gut auf Basis des MEAN Architekturstacks aufbauen:

* MongoDB
* Express
* Angular
* Node.js

Node.js ist hierbei die Serverkomponente, welche Anfragen entgegen nimmt und beantwortet. Die Anfragen werden in eine Abarbeitungswarteschlange eingereiht und sequentiell verarbeitet.
Die Verarbeitung der einzelnen Anfragen erfolgt dabei in einer Reihe von sehr kleinen und kurz laufenden Arbeitsschritten. Dies ermöglicht es, dass Node.js in einem einzigen Thread 
laufen kann und dabei abwechselnd Anfragen verarbeiten und neuen Anfragen entgegennehmen kann. 

Werden mittels des Zusatzmoduls PM2 mehrere solcher Threads gestartet, so erreicht man eine
sehr hohe Skalierbarkeit. Dabei ist Node.js nicht mehr als eine Ausführungsumgebung für JavaScript-Programme und benötigt daher sehr wenig Systemressourcen.

Für die Datenhaltung eines mit Node.js implementierten Service bietet sich MongoDB an, da die Datenverarbeitung in den JavaScript-Programmen, die in einem Node.js-Server laufen,
in der Regel auf JSON-Objekten basiert und die dokumentenorientierte Datenablage in MongoDB dieser Struktur sehr nahe kommt. 
Außerdem unterstützt MongoDB den direkten Austausch von binär kodierten JSON-Objekten (BSON). 
Der Rechenaufwand für Marshalling und Unmarshalling beim Datenaustausch zwischen MongoDB und Node.js ist somit minimal.

Die Implementierung der Auskunftsservices erfolgt in Angular oder direkt in JavaScript.
Express dient dabei als Framework, das grundlegende Funktionalitäten für die Implementierung der Auskunftsservices bereitstellt.

## Wie passt das alles zusammen?

Wir haben nun also einerseits eine unternehmenskritische Applikation mit vielen Querschnittsfunktionen und einer Implementierung für komplexe Geschäftsprozesse auf einer 
vergleichsweise schwerfälligen Ausführungsumgebung auf Basis von JEE. Auf der anderen Seite steht ein hochskalierbarer Auskunftsservice für relativ einfach strukturierte Anfragen
zur Verfügung. Wie passt das zusammen?

Die eigentliche Datenhaltung unserer Applikation erfolgt in einem transaktionssicheren, relationalen Datenbanksystemen mit allen notwendigen Funktionen zur revisionssicheren dauerhaften Speicherung unserer Geschäftsdaten.
Die Daten, die für die Beauskunftung über unseren Auskunftsservice freigegeben sind, übertragen wir nun aus dieser Datenhaltung in die Datenhaltung des Auskunftsservices.
Hierfür wird ein PUSH-Verfahren von unserer Applikation aus realisiert. Dies hat folgende Vorteile:
* Die Geschäftslogik bestimmt, wann sie eine Datenübertragung ausführt. Damit können wir steuern, dass dies in Randzeiten stattfindet und so minimalen Einfluss auf die Leistungsfähigkeit zu Geschäftszeiten der Applikation hat.
* Die Geschäftslogik bestimmt, welche Daten übertragen werden. Der Schutz vertraulicher Daten kann somit nicht von außerhalb der Applikation kompromittiert werden.
* Die JEE-Anwendung mit den vertraulichen Daten kann weiterhin in einer nur intern zugänglichen und vor äußeren Zugriffen geschützten Netzwerkzone liegen.

In unserer Geschäftsapplikation läuft ein periodisch ausgeführter Prozess, der dies realisiert. Die Zeitsteuerung des Prozesses berücksichtigt typische Zeiträume niedriger
Systemauslastung und startet die Übertragung der zu veröffentlichenden Daten dann, wenn das System dadurch nicht beeinträchtigt wird.
Dieser Prozess erhält Daten, die zur Veröffentlichung freigegeben sind, aus einer dafür vorgesehenen Staging Area in der Geschäftsdatenbank.
Es werden somit tatsächlich nur explizit freigegebene Informationen übertragen und dieser Vorgang kann bei technischen Fehlern jederzeit wiederholt werden, falls beispielsweise der Auskunftsservice vorübergehend nicht erreichbar ist.
Ebenso kann dieselbe Funktionalität genutzt werden, um den Auskunftsservice mit einem initialen Datenbestand zu versorgen und jederzeit eine Vollsynchronisation durchzuführen.

![Implementierungsdiagramm zu NodeJS als Auskunftswebservice einer JEE-Applikation](../assets/images/posts/NodeJS-als-Auskunftswebservice-einer-JEE-Applikation/Implementierungsdiagramm.png)


## Was folgern wir hieraus?

Dieses abstrakt gehaltene Projektbeispiel soll illustrieren, dass die Wahl zwischen einer umfangreichen aber etwas schwerfälligen JEE-Architektur und 
einer leichtgewichtigen Architektur auf Basis des MEAN-Stacks in vielen realen Projekten keine Entweder-Oder-Entscheidung sein muss, sondern sich beide Architekturen
sinnvoll ergänzen können, da jeder der beiden Ansätze unterschiedliche Aspekte einer großen Applikation unterschiedlich gut bedient.
