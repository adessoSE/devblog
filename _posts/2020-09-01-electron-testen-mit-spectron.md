---
layout: [post, post-xml]              # Pflichtfeld. Nicht ändern!
title:  "End-2-End-Tests für Electron Anwendungen"     # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2020-07-08 15:00              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
author: sramathas                     # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: [Softwareentwicklung]     # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Testing, Spectron, Electron]   # Optional.
---

Im Rahmen eines Projektes wird eine Anwendung für den Bereich Gesundheitswesen von adesso entwickelt. 
Die Anwendung soll keine herkömmliche Webapplikation sein, sondern eine Desktopanwendung. 
Der ein oder andere hat bestimmt schon von plattformunabhängigen Frameworks gehört, um Desktopanwendungen für die Betriebssysteme Windows, MacOS und Linux mit einer Codebasis zu entwickeln. 
Das ausgewählte Framework für das Projekt heißt Electron. 
Mit dem Electron Framework ist es durch Web-Technologien möglich, Anwendungen desktoptauglich zu entwickeln.
Die Anwendung kann wie gewohnt installiert und aus der Taskleiste gestartet werden. 
Ein großer Vorteil gegenüber Webapplikationen ist, dass die Anwendung offlinefähig ist.
Unser Kunde wird nämlich auch mit der Anwendung arbeiten, wenn er keine Verbindung zum Internet hat, und später seinen Arbeitsstand synchronisieren, wenn er mit dem Internet verbunden ist.


# Electron

Gehen wir kurz auf den Hintergrund von Electron ein. 
Das Framework wurde von dem Unternehmen GitHub als Open Source Framework entwickelt. 
Electron erlaubt uns, wie schon oben erwähnt, Anwendungen mit nativen Webtechnologien wie HTML, CSS und JavaScript zu entwickeln. 
Die daraus entstehenden Anwendungen können auf unterschiedlichen Betriebssystemen ausgeführt werden. 
Im Jahr 2013 ist Electron initial unter dem Namen Atom Shell gestartet worden und diente als Fundament für den hauseigenen Editor 'Atom' für GitHub.
Durch die Beliebtheit dieses Editors hat GitHub daraufhin das Projekt Electron extrahiert und so bekam es durch ein Rebranding seinen Namen. 

Wie bereits erwähnt, ist dieses Framework im Einsatz, um eine Anwendung für eines unserer Kunden zu entwickeln. 
Die Anwendung wird jeden Sprint komplexer und natürlich brauchen wir mit jeder neuen Funktion, die dazu kommt, neue Tests. 
Tests sind ein wichtiges Element in dem Entwicklungsprozess, die vor einem Release sicherstellen, dass kein mangelhaftes Produkt an den Kunden ausgeliefert wird.
Dazu haben wir automatisierte Regressionstests, mit denen wir bei jedem Release die alten und, soweit es geht, auch die neuen Funktionen testen.



# Spectron

Nun, wie testet man eine Electron Anwendung automatisiert? 
Es gibt natürlich Tools wie Tricentis Tosca, Ranorex oder eggPlant, die es ermöglichen, Desktopanwendungen und sogar Anwendungen auf mobilen Geräten zu testen. 
Diese Tools benötigen aber Lizenzen und somit muss man entscheiden, ob das Projektbudget für eines dieser Tools ausreicht. 
 
An dieser Stelle möchte ich Euch das Testframework Spectron vorstellen. 
Spectron ist die hauseigene Testbibliothek für Electron Anwendungen.
Es wird dabei als Teil von Electron ausgeliefert und ist somit auch ein Open Source Framework.
Spectron baut auf ChromeDriver und WebDriverIO auf und durch die Unterstützung von Mocha und Chai können automatisierte End-to-End Tests entwickelt werden. 



# Beispiel

Da die Anwendung für unseren Kunden noch in der Entwicklung ist und noch nicht veröffentlicht werden darf, habe ich eine eigene kleine Beispielanwendung in Electron erstellt.
Im Folgenden werden wir zusammen einen kleinen Test entwickeln, um Euch einen kurzen Einblick in das Framework zu liefern.
 
```sh
npm install –save-dev spectron 
```
 
 
Damit wir in unserem Test Vergleiche anwenden können, um zum Beispiel Werte auszulesen und zu prüfen ob sie richtig sind, benötigen wir hier Chai. 
Zusätzlich installieren wir noch Mocha. Mocha ist ein Test-Framework für Node.js. 
Chai und Mocha werden auf die gleiche Weise wie Spectron installiert: 

 ```sh
npm install mocha chai 
``` 


Als nächstes bearbeiten wir unsere package.json. 
Wir ergänzen diese um ein Kommando, um die Tests ausführen zu können.

```json
"scripts": { 
"test": "mocha" 
} 
```


Sobald wir das Kommando „npm run test“ ausführen, schaut Mocha nach ausführbaren Tests und führt diese dann aus. 

Im Folgenden sehen wir eine kleine Beispiel Anwendung, auf der eine Loginmaske platziert ist. 
Wir werden nun einen einfachen Test schreiben, bei dem wir die Überschrift der angezeigten Seite überprüfen.

![Login Maske Demo Anwendung](/assets/images/posts/electron-testen-mit-spectron/login_maske.png)

Bei diesem Testfall werden wir die Anwendung starten, die Überschrift auslesen und diese mit unserer Erwartung vergleichen. 
Die Testklasse für diesen Anwendungsfall sieht folgendermaßen aus: 

```typescript
const helper = require('./helper'); 
const chai = require('chai'); 
const expect = chai.expect; 
 
describe('Sample Test', () => { 
  let app; 
 
  beforeEach(async () => { 
    app = await helper.startApp(); 
  }); 
 
  afterEach(async() => { 
    await helper.stopApp(app); 
  }); 
 
  it('opens a window', async() => { 
    await app.client.waitUntilWindowLoaded(); 
    const ueberschrift = await app.client.getText('h1'); 
    expect(ueberschrift).to.be.equal('Login Form^'); 
  }); 
 
}); 
```


Die Syntax ‚describe‘ entspricht einer TestSuite. 
Innerhalb dieser TestStuite können sich mehrere Testfälle 'it' befinden, welche zum Beispiel prüfen, ob ein erwarteter Wert angezeigt wird. 
In der Helper Klasse befinden sich die Methoden, um die Anwendung zu starten und zu beenden. 
Das Starten und Beenden der Anwendung befindet sich jeweils in einer 'beforeEach()' und 'afterEarch()' Methode. 
Die 'beforeEach()' Methode wird vor jedem Testfall ausgeführt und startet die Anwendung.
In der 'afterEach()' Methode, die nach jedem Testfall ausgeführt wird, wird die Anwendung beendet.

In unserem Fall haben wir genau einen Testfall, den wir ausführen wollen. 
Der Ablauf von diesem automatisierten Test ist: 
1. Anwendung starten 
2. Warten, bis die Anwendung geladen wurde 
3. Auslesen des Titels anhand des TagName 'h1' und Speicherung in einer Variable 
4. Vergleich zwischen dem erzeugten Wert und dem erwarteten Wert 

Zusätzlich zu dieser Überprüfung, sehen wir ein Beispiel um die zwei Inputfelder Username und Passwort zu befüllen.

```typescript
  it('type username and password', async() => { 
    await app.client.setValue('#username', 'demoUser');
    await app.client.setValue('#password', 'demoPassword');
    const InputUsername = await app.client.getText('#username');
    const InputPasswort = await app.client.getText('#password');
    
    expect(InputUsername).to.be.equal('demoUser')
    expect(InputPasswort).to.be.equal('demoPassoword')

    await app.client.click('#submitButton');
  }); 
```

Wir nutzen hier die 'setValue()' Methode um ein Inputfeld mit Inhalt zu befüllen. 
Diese Methode benötigt zwei Paramenter. 
Der erste Paramenter dient dazu, das entsprechende Inputelement über die ID zu finden, der zweite weist dem Feld den angegebenen Wert zu.
Optional können wir an dieser Stelle überprüfen ob die beiden Inputfelder auch überhaupt bzw. richtig befüllt worden sind.
Wir holen uns die zwei befüllten Felder mit Hilfe der 'getText()' Methode und überprüfen diese mit 'expect' mit unseren erwarteten Werten.
Anschließend klicken wir mit der 'click()' Methode, der wir die ID des Buttons geben, auf den Einloggen Button.



# Fazit

Um mit Spectron automatisierte Tests zu entwickeln, wäre es von Vorteil, wenn man fundierte Kenntnisse in TypeScript besitzt.
Für Erfahrene Programmierer fällt der Einstieg in die Automatisierung natürlich leichter und es lassen sich gezielt schneller End-to-End Tests entwickeln. 
Diejenigen, die nur wenig oder gar keine Erfahrung in Programmiersprachen haben, können auf Tools wie Tricentis Tosca, Ranorex oder eggPlant ausweichen.
Dort gibt es die Möglichkeit, bestimmte Verläufe auf einer Oberfläche aufzunehmen und diese als Skript abzuspeichern. 
Ein weiterer Pluspunkt für die Nutzung eines dieser drei Tools ist, dass man zusätzlich unterschiedliche Geräte bedienen kann. 
Der Nachteil von Tools mit denen man die Schritte aufnehmen und als automatisiertes Skript laufen lassen kann, ist der das wir für jeden neuen Test auch jeden einzelnen Ablauf erneut aufnehmen müssen. 
Die Möglichkeit, bestimmte Abschnitte zu speichern und wieder zu verwenden, ist nicht gegeben. 
An dieser Stelle hat das Programmieren von Skripten, den Vorteil, bestimmte Abläufe bzw. Methoden immer wieder verwenden zu können.
