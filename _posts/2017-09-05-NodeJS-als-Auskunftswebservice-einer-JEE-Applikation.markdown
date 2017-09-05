---
layout: [post, post-xml]
title:  "NodeJS als Auskunftswebservice einer JEE-Applikation"
date:   2017-09-04 14:30
modified_date: 2017-09-04
author: AdessoMaDa
categories: [Java, Architektur]
tags: []
---

## Worum geht's hier?

Im Zuge der Digitalisierung von Geschäftsprozessen laufen große unternehmenskritische Applikationen zunehmend nicht mehr ausschließlich im internen Betrieb, sondern
müssen auch unternehmensexterne Benutzer wie Geschäftspartner und Kunden ansprechen. Diesen werden ausgewählte Informationen zu laufenden Geschäftsvorgängen zugänglich gemacht.
Dabei muss die Verschlossenheit der nur intern genutzten Daten zu den Geschäftsvorgängen erhalten bleiben. Nur jene Informationen, die explizit freigegeben wurden, 
dürfen für externe Nutzer einsehbar sein.

Dies wird sichergestellt durch einen Prozess, der eine explizite Freigabe der zu veröffentlichenden Informationen vorsieht und durch separate Speicherung der veröffentlichten Daten 
sowie durch separate Zugriffspfade.

Die folgende Abbildung zeigt eine grobe Prozessbechreibung:
![Prozessbechreibung zu NodeJS als Auskunftswebservice einer JEE-Applikation](https://github.com/adessoAG/devblog/raw/master/assets/images/NodeJS-als-Auskunftswebservice-einer-JEE-Applikation/Aktivitaetsdiagramm.png)

Im vorliegenden Projektbeispiel haben wir uns entschieden, die Geschäftsapplikation als JEE-Applikation zu entwickeln und diese um einen Auskunftsservice auf Basis des MEAN-Stacks zu erweitern.

## Warum entwickeln wir JEE-Applikationen?

In vielen größeren Unternehmen werden für die Entwicklung von unternehmenskritischen Applikationen Referenzarchitekturen vorgegeben.
Diese Vorgabe dient vor allem dem Zweck, einheitliche Strukturen für Deployment und Rollout dieser Anwendungen einzuhalten und somit 
auch einheitliche Verfahren für den Betrieb dieser Applikationen durchzusetzen. Damit sollen die Total Cost of Ownership für den Betrieb
der Applikationen so gering wie möglich gehalten werden. Einheitliche Architekturen unterstützen außerdem die Wiederverwendung von
Querschnittsfunktionen wie Benutzerauthentifizierung, Autorisierung oder Logging durch verschiedene Applikationen.

Im vorliegenden Projektbeispiel ist durch den Kunden eine Referenzarchitektur auf Basis von Java Enterprise Edition (JEE) vorgegeben.
Auf dieser Basis haben wir eine unternehmenskritische Applikation entwickelt, die von internen Mitarbeitern des Auftraggebers im Intranet des Unternehmens genutzt wird.

## Was sind die Vorteile dieser Architektur?

Unternehmenskritische Applikationen auf Basis einer solchen Plattform aufzusetzen bringt eine Reihe von Vorteilen.
In der Datenhaltungsschicht wird eine relationales Datenbanksystem eingesetzt, das viele Anforderungen in Bezug auf eine revisionssichere Datenhaltung durch 
eingebaute Funktionen abdeckt. Konzepte und Werkzeuge zur Datensicherung und zur Wiederherstellung liegen vor und müssen nicht speziell entwickelt werden.
In der Geschäftskogikschicht steht eine Reihen von Querschnittsfunktionen und Bibliotheken zur Verfügung, mit denen komplexe Geschäftsabläufe effizient umgesetzt werden können.
Die Verarbeitung auch von großen Datenmengen ist möglich und es stehen Werkzeuge zur Verfügung, um diese möglichst effizient zu gestalten.

## Welche Nachteile hat diese Architektur?

Der große Funktionsumfang der zugrunde liegenden Softwaresysteme  bringt aber auch Nachteile mit sich. Relationale Datenbanksysteme mit transaktionsorientierter Arbeitsweise
begrenzen die Möglichkeit von echt paralleler Verarbeitung, da beim gleichzeitigen Zugriff auf sich überschneidende Datenbestände immer eine logische Serialisierung der Zugriffe stattfindet.
Dies erzwingt Wartezeiten beim gelichzeitigen Zugriff auf sich überschneidende Datenbestände. Die Mechanismen, welche die dauerhafte Speicherung von ausgeführten Datenänderungen
sicherstellen, führen zu zusätzliche Verarbeitungsschritten und verlängern somit die Ausführungszeit.

Die Vielzahl der eigebauten Funktionen bringt außerdem einen hohen Bedarf an Systemressourcen wie zum Beispiel Arbeitsspeicher mit sich. Deshalb müssen Applikationen, die einer solchen
Architektur basieren, gezielt dimensioniert werden. Um eine solche Dimensionierung durchführen zu können, sollte das Gerüst an Datenmengen, die Anzahl der Nutzer, welche die Appliaktion
insgesamt nutzen sowie die Anzahl der gleichzeitigen Zugriffe auf die einzelnen Funktionen bekannt sein. Im vorliegenden Projektbeispiel wird die Mittelschicht
auf 4 unterschiedlichen Serverknoten ausgeführt und langlaufende Geschäftsprozesse werden asynchron ausgeführt.

## Was ist, wenn diese Randbedingungen nicht bekannt sind?

Soll unsere unternehmenskritischen Anwendung nun zusärzlich einen öffentlichen Auskunftsservice beinhalten, so sind viele dieser Randbedingungen nicht mehr bekannt.
Wir wissen nicht, wieviele Nutzer zu welcher Zeit in welcher Häufigkeit Anfragen an den Auskunftsservice stellen werden. Wir benötigen daher eine Architektur, 
welche mit vorgegeben Systemressourcen eine hohe Skalierbarkeit ermöglicht. Wenn es sich um einenn reinen Auskunftsservice handelt, benötigen wir andererseits auch viele 
der in der JEE-Plattform eingebauten Funktionen nicht, da wir hier keine  Daten verändern und somit auch keine besonderen Anforderungen an die Erhaltung von Datenkonsitenz 
und die dauerhafte Speicherung unserer Änderungen stellen müssen.

Ein leichtgewichtiger und hoch skalierbarer Auskunftsdienst lässt sich gut auf Basis des MEAN Architekturstacks aufbauen:
* MongoDB
* Express
* AngularJS
* Node.js

Node.js ist hierbei die Serverkomponenten, welche Anfragen entgegen nimmt und beantwortet. Die Anfragen werden in eine Abarbeitungswarteschlange eingereiht und sequentiell verarbeitet.
Die Verarbeitung der einzelnen Anfragen erfolgt dabei in einer Reihe von sehr kleinen und kurz laufenden Arbeitsschritten. Dies ermöglicht es, dass ein Node.js in einem einzigen Thread 
laufen kann und dabei abwechselnd Anfragen verarbeiten und neuen Anfragen entgegennehmen kann. Werden mittels des Zusatzmoduls PM2 mehrere solche Threads gestartet, so erreicht man eine
sehr hohe Skalierbarkeit. Dabei ist Node.js nicht mehr als eine Ausführunmgsumgebung für JavaScript-Programme und benötigt daher sehr wenig Systemressourcen.
Für die Datenhaltung für einen mit Node.js implementierten Service bietet sich MongoDB an, da die Datenverarbeitung in den JavaScript-Programmen, die in einem Node.js-Server laufen
in der Regel aus JSON-Objekten basiert und die dokumentenorientierte Datenablage in MongoDB dieser Struktur sehr nahe kommt. 
Außerdem untstützt MongoDB den direkten Austausch von binär kodierten JSON-Objekten (BSON). 
Der Rechenaufwand für Marshalling und Unmarshalling beim Datenaustausch zwischen MongoDB und Node.js ist somit minimal.

## Wie passt das alles zusammen?

Wir haben nun also einerseits eine unternehmenskritische Applikation mit vielen Querschnittsfunktionen und einer Implementierung für komplexe Geschäftsprozesse auf einer 
vergleichweise schwerfälligen Ausführungsumgebung auf Basis von JEE. Auf der anderen Seite steht ein hochskalierbarer Auskunftsservice für relativ einfach strukturierte Anfragen
zur Verfügung.

Die eigentliche Datenhaltung unserer Applikation erfolgt in einem transaktionssicheren relationalen Datenbanksystemen mit allen notwendigen Funktionen zur revisionsicheren dauerhaften Speicherung unserer Geschäftsdaten.
Die Daten, die für die Beauskunftung über unseren Auskunftsservice freigegeben sind, übertragen wir nun aus dieser Datenhaltung in die Datenhaltung des Auskunftsservices.
Dies erfolgt über ein PUSH-Verfahren von unserer Appliaktion aus. Die Anwendung des PUSH-Verfahrens hat folgende Vorteile:
* Die Geschäftslogik bestimmt, wann sie eine Datenübertragung ausführt. Damit können wire steuern, dass diese zusätzliche Datenübertragung minimalen Einfluss auf die Leistungsfähigkeit der Applikation hat.
* Die Geschäftslogik bestimmt, welche Daten übertragen werden. Der Schutz vertraulicher Daten kann somit nicht von außerhalb der Appliaktion kompromittiert werden.
* Die Geschäftslogik bestimmt, wohin die Daten übertragen werden.

