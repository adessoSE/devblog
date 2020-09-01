---
layout: [post, post-xml]              # Pflichtfeld. Nicht ändern!
title:  "End-2-End-Tests für Electron Anwendungen"     # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2020-07-08 15:00              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
author: sramathas                     # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: [Inside adesso]       # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Testing, Spectron, Electron]                       # Optional.
---


Im Rahmen eines Projektes wird eine Anwendung für den Bereich Gesundheitswesen von adesso entwickelt. 
Die Anwendung soll keine herkömmliche Webapplikation sein, sondern eine Desktopanwendung. 
Der ein oder andere hat bestimmt schon von plattformunabhängigen Frameworks gehört, um Desktopanwendungen für die Betriebssysteme Windows, MacOS und Linux mit einer Codebasis zu entwickeln. 
Das ausgewählte Framework für das Projekt heißt Electron. 
Mit dem Electron Framework ist es möglich durch Web-Technologien, Anwendungen desktoptauglich zu entwickeln. 
Die Anwendung kann wie gewohnt installiert und aus der Taskleiste gestartet werden. 
Ein großer Vorteil gegenüber Webapplikationen ist der, dass die Anwendung offlinefähig ist. 
Denn unser Kunde wird mit der Anwendung arbeiten auch wenn er keine Verbindung zum Internet hat und kann später seinen Arbeitsstand synchronisieren, wenn er mit dem Internet verbunden ist. 


# Electron

Gehen wir kurz auf den Hintergrund von Electron ein. 
Das Framework wurde von dem Unternehmen GitHub als Open Source Framework entwickelt. 
Electron erlaubt uns, wie schon oben erwähnt, Anwendungen mit nativen Webtechnologien wie HTML, CSS und JavaScript zu entwickeln. 
Die daraus entstehenden Anwendungen können auf unterschiedlichen Betriebssystemen ausgeführt werden. 
Im Jahr 2013 ist das Projekt (Electron) initial unter dem Namen Atom Shell gestartet worden und diente als Fundament für den hauseigenen Editor ‚Atom‘ für GitHub. 
Durch Beliebtheit dieses Editors hat GitHub daraufhin das Projekt Electron extrahiert und so bekam es durch ein Rebranding seinen Namen. 

Wie bereits erwähnt, ist dieses Framework im Einsatz, um eine Anwendung für eines unserer Kunden zu entwickeln. 
Die Anwendung wird jeden Sprint komplexer und natürlich brauchen wir mit jeder neuen Funktion, die dazu kommt, neue Tests. 
Tests sind ein wichtiges Element in dem Entwicklungsprozess, die vor einem Release sicherstellen, dass kein mangelhaftes Produkt an den Kunden ausgeliefert wird.
Dazu haben wir automatisierte Regressionstests, mit denen wir bei jedem Release die alten und soweit es geht, auch die neuen Funktionen testen.


# Spectron

Nun, wie testet man eine Electron Anwendung automatisiert? 
Es gibt natürlich Tools wie Tricentis Tosca, Ranorex oder eggPlant die es ermöglichen Desktopanwendungen und sogar Anwendungen auf mobilen Geräten zu testen. 
Diese Tools benötigen aber Lizenzen und somit muss man entscheiden, ob das Projektbudget für eines dieser Tools ausreicht. 
 
An dieser Stelle möchte ich Euch das Testframework Spectron vorstellen. 
Spectron ist die hauseigene Testbibliothek für Electron Anwendungen, welches ein OpenSource Framework ist, das sich wiederum in Electron befindet. 
Spectron baut auf ChromeDriver und WebDriverIO auf und durch die Unterstützung von Mocha und Chai können automatisierte End-to-End Tests entwickelt werden. 


# Beispiel

Da die Anwendung für unseren Kunden noch in der Entwicklung ist, und diese noch nicht veröffentlicht werden darf, habe ich eine eigene kleine Beispielanwendung in Electron erstellt. 
Im Folgenden werden wir einen kleinen Test zusammen entwickeln, um Euch einen kurzen Einblick in das Framework zu liefern.  
 
```sh
npm install –save-dev spectron 
```
 
Damit wir in unserem Test Vergleiche anwenden können, um zum Beispiel Werte auszulesen und zu prüfen ob sie richtig sind, benötigen wir hier Chai. 
Zusätzlich installieren wir noch Mocha. Mocha ist ein Test-Framework für Node.js. 
Chai und Mocha wird auf die gleiche Weise wie Spectron installiert: 

 ```sh
npm install mocha chai 
``` 

Nachdem wir unsere nötigen Packages hinzugefügt haben, sollte unsere Package.json folgendermaßen aussehen: 


# Fazit

Um mit Spectron, automatisierte Tests zu entwickeln, wäre es von Vorteil, wenn man fundierte Kenntnisse in Programmiersprachen besitzt wie TypeScript. 
Für Erfahrene Programmierer fällt der Einstieg in die Automatisierung natürlich leichter und es lassen sich gezielt schneller End-to-End Tests entwickeln. 
Diejenigen die gar keine oder nur wenig Erfahrung in Programmiersprachen haben, können auf die Tools wie Tricentis Tosca, Ranorex oder eggPlant ausweichen. 
Dort gibt es die Möglichkeit bestimmte Verläufe auf einer Oberfläche aufzunehmen und diesen als Skript abzuspeichern. 
Ein weiterer Pluspunkt für die Nutzung eines dieser drei Tools ist, dass man zusätzlich unterschiedliche Geräte bedienen kann. 
