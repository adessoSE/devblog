---
layout: [post, post-xml]              # Pflichtfeld. Nicht ändern!
title:  "Selenium Basics - Basis Projekt"     # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2020-01-02 09:00              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2020-01-02 09:00
author: lubbyhst                      # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: [Branchen & People]       # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Testing]                       # Optional.
---


In dieser Blogreihe möchte ich einen Einstieg für das Automatisierungstool Selenium vorstellen.
Der erste Artikel gibt einen Überblick zu Selenium und dessen Verwendung. 
Darüber hinaus möchte ich auf Basis eines Java Projektes und dem Maven Buildtool ein einfaches Beispielprojekt vorstellen.
Vorkenntinsse im Bereich Java, Spring, JUnit, Docker und Maven sind empfohlen. 
Der Fokus dieses Blogs liegt mehr auf der Verknüpfung der Technologien.
Dies soll keine Step by Step Anleitung für Neueinsteiger darstellen.


# Vorstellung Selenium

Selenium ist ein Framework zum automatisieren von Browsern.
Es stellt alle notwendigen Interfaces bereit um Eingaben auf einem Browser auszuführen oder Inhalte auszulesen.
Der typisch Einsatzbereich des Frameworks liegt im testen von Webanwendungen jeder Art. 
Es gibt diverse Frameworks die auf als Basis den Selenium Webdriver verwenden.
Bekannte Testframeworks sind z.B. Appium, Fluentlenium oder Serenity.
Der Selenium WebDriver wird auch als Selenium 2 bezeichnet. 
Dieses Projekt ist aus einer Zusammenführung des Projektes „WebDriver“ von Google und Selenium 1 entstanden. 
Die Idee dahinter ist, dass die heutigen Browser nativ angesprochen werden sollen. 
Da Selenium 1 nur über JavaScript mit einem Browser kommuniziert, kommt es in einigen Fällen zu Problemen. 
Durch das native Ansprechen der Browser werden Probleme mit JavaScript vermieden und die Geschwindigkeit von Selenium gesteigert. 
Googles WebDriver ermöglicht es Selenium 1 nativ, mit dem Browser zu kommunizieren. 
Aus der Zusammenführung der beiden Projekte entstand der Selenium WebDriver. 
Für gewöhnlich wird einfach nur von dem „WebDriver“ gesprochen. 
In einigen Berichten kann es jedoch auch vorkommen, dass von Selenium 2 gesprochen wird.

## Interfaces

Die Basisfunktionalität des WebDriver wir über zwei Interfaces abgedeckt.
Das erste Interface lautet "org.openqa.selenium.WebDriver" und das zweite  "org.openqa.selenium.WebElement"

### WebDriver

Das WebDriver Interafce stellt die zentrale Schnittstelle für die Browserinteraktion dar. 
Dazu wird für jeden gängingen Webbrowser eine eigene Implementierung dieses Interfaces bereitgestellt.
Der WebDriver enthält Funktionen zur Interaktion mit dem Browser selbst.
Z.b. Fenstergröße anpassen, Tabs wechseln oder Cookies setzen.

### WebElement

Das WebElement stellt ein Element aus dem DOM einer Website dar.
So ist es Möglich mit einzelnen Elementen auf einer Website zu interagieren.
Wie das Klicken eines Buttons oder das Auslesen eines Feldes.
Ein WebElement muss dazu immer zuerst durch den WebDriver gesucht werden. 
Dieser stellt hierzu die Methoden findElement(By locator) oder findElements(By locator) zur verfügung.

### Locator

Für das suchen von Elementen auf einer Website werden verschiedene Locator angeboten:

- ID
- Name
- Link Text
- CSS Selector
- XPath

Für das genaue finden eines Elements auf einer Website wird empfohlen möglichst immer der ID Locator zu verwenden.
Leider ist es üblich das Frontend Frameworks dynamisch ID's vergeben oder es gar nicht einfach möglich ist selbst ID's zu vergeben.
Oder es müssen Dynamische Inhalte gesucht werden wie das auftauchen eines bestimmten Textes in der ersten Zeile einer Tabelle.
Dann werden die anderen Locatoren benötigt um Elemente flexibler und dynamischer suchen zu können. 
Darüber hinaus ist das suchen nach Elementen mittels ID die schnellste Art diese zu finden.
Die Praxis hat jedoch gezeigt, dass auch die Verwendung der anderen Locatoren möglich ist ohne die Geschwindigkeit drasitsch zu verringern.

## Basis Projekt

Bei dem Basis Projekt handelt es sich um ein Maven Projekt bestehend aus mehreren Projekten.

![Basis Porjekt Struktur](/assets/images/posts/selenium-einstieg-basis-projekt/basis-projekt.png)

Das Hauptprojekt enthält drei Module.
### Modul Docker
Das Erste Modul "Docker" enthält die Module zum erzeugen und ausführen der Docker Container.
In diesem Projekt ist das die Webanwendung selbts und der Selenium Hub.
Der Selenium Hub wird als fertiges Dockerimage zur Verfügung gestellt. 
Dieses beinhaltet bereits alle Komponenten (Browser, Browser Driver, usw.) in der korrekten Version um diese mit dem WebDriver zu verwenden.
### Modul systemtests
Das Modul "systemtests" beinhaltet den Testcode inkl. aller Resourcen.
### Modul webapp-demo
Dieses Modul stellt eine kleine Spring Boot Web Anwendung bereit gegen die Systemtests ausgeführt werden sollen.

## Struktur systemtests

![Basis Struktur_systemtests](/assets/images/posts/selenium-einstieg-basis-projekt/struktur-systemtests.png)

Die Struktur des Moduls "systemtests" kann im Prinzip in drei Teile untergliedert werden. 
Je nach komplexität des Frameworks kann dieses natürlich indiviuell erweitert werden.
Es bietet sich z.B. an wiederholende Schritte in "Steps" zu bündeln. 
Diese Steps können dann durch die Tests verwendet werden.
Die Übersichtlichkeit der einzelnen Tests kann davon stark profitieren.
Das Package "base" enthält in diesem Beispiel die Basis Testklasse.
Diese ist abstract und wird von jeder Konkreten Testklasse erweitert. 
Die Basisklasse stellt die Basisfunktionen wie das initialisieren des WebDriver bereit.
In dem Package "tests" befinden sich ausschließlich die Testfälle für das Projekt.
In "pages" werden die PageObjects der zu testenden Anwendung gepflegt.
Page Objects repräsentieren die einzelnen Seiten einer Webanwendung.
Dieses Pattern wird genutzt um die Tests überschtlicher zu gestallten und die Wiederverwendbarkeit zu steigern.
Ein Grundgedanke des PageObject Pattern ist zudem, dass auf jede Aktion an einem PageObject wieder das passende PageObject zurück geliefert wird.
Damit wird das verketten von Aufrufen ermöglicht.
Hier liegt es aber am Entwickler und dem Projekt ob dieses Verhalten gewünscht ist.
Bei einem wechsel auf eine neue Seite sollte die entsprechende Methode allerdings immer das passende PageObject liefern.

### TestBase im Detail
![TestBase](/assets/images/posts/selenium-einstieg-basis-projekt/test-base.png)

Die Testbase enthält eine before Methode die vor jedem Test ausgeführt wird.
In der after Methode wird sicher gestellt, dass die driver Variable vor jedem Test geleert wird.
Wichtig ist darauf zu achten, dass die driver Variable nicht statisch ist. 
So wäre es nicht möglich die Tests parallel auszuführen.

In diesem Beispiel wird der RemoteWebDriver initialisiert.
Dies ist ein Driver um mit dem Selenium Hub kommunizieren zu können. 
Der Selenium Hub erhält über den RemoteWebDriver die Steuerbefehle und führt diese auf dem Browser aus.
Welcher Browser verwendet werden soll legen die "Capabilities" fest. 
In diesem Fall soll der Google Chrome verwendet werden. 
Es gibt für alle gängingen Browser Capabilities als statischen Aufruf an der Klasse DesiredCapapbilities.
Neben den Capabilities benötigt der RemoteWebDriver noch die URL zu dem Selenium Hub der verwendet werden soll.
In diesem Fall ist dies ein Docker Container welcher über den Standartport 4444 erreichbar ist.
Wichtig zu beachten!
Der Selenium Hub muss den angefragten Browser unterstützten damit dieser auch verwendet werden kann.
Vorteil dieser Lösung ist, dass das Projekt schnell auf ein Selenium Grid mit vielen verschiedenen Browsern wechseln kann.
Dazu muss lediglich die URL angepasst werden.

### BasePage im Detail
![BasePage](/assets/images/posts/selenium-einstieg-basis-projekt/base-page.png)

Die BasePage ist die Hauptklasse für jedes PageObject das erzeugt wird. 
Hier werden Basisfunktionalitäten angeboten die in jedem PageObject meist verwendet werden.
Dazu zählen z.B. Texteingabe oder das explizite Warten auf Elemente.
Neben dem Konstruktor sehen wir hier eine "input" Methode zur eingabe von Text an einem WebElement.
Außerdem werden Methoden zum Finden von WebElementen angeboten. 
Es kann vorkommen das WebElemente expilizt gesucht werden müssen oder durch JavaScript verändert werden. 
Dann können diese Methoden mit explizitem Warten genutzt werden um Elemente auf einer Seite zu finden.

### PageObject im Detail
![PageObject](/assets/images/posts/selenium-einstieg-basis-projekt/page-object.png)

In diesem Beispiel enthält die Webanwendung zwei PageObject. 
In der Grafik ist das passende PageObject zu der index.html zu sehen.
Die annotierten Klassenvariablen werden automatisch befüllt sobald auf diese durch das PageObject zugegriffen wird.
Der Annotation wird dafür jeweils ein Locator übergeben. 
Für dieses PageObject ist dies meist die ID eines Elementes. 
Aber auch der TagName oder ein xpath Außdruck ist möglich.
Auf die WebElemente darf nicht direkt zugegriffen werden. 
Für jeden aufruf muss der Entwickler eine Methode bereitstellen.
Bei der Methode "clickButton" ist zu erkennen, dass diese ein anderes PageObject zurück liefert.
Das hat den Hintergrund sofort zu erkennen, dass hier ein Seitenwechsel stattfindet. 
In der Testklasse ist dies dann eindeutig zu erkennen.
In einem PageObject werden somit sämtliche Zugriffe auf eine Webseite gekapselt und den Tests bereitgestelt. 
Außerdem dürfen in den PageObjects keine Asserts vorgenommen werden um die Wiederverwendbarkeit durch andere Tests nicht einzuschränken.

### ExampleTest im Detail
![ExampleTest](/assets/images/posts/selenium-einstieg-basis-projekt/example-test.png)

Die Testklasse enthält sehr wenig code.
Sie ist eher übersichtlich gestalltet und sollte mit aussagekräftigen Methoden versehen werden.
Da die Testklasse bereits von der TestBase erbt müss sich nicht weiter um die Initialisierung des WebDriver gekümmert werden.
Durch den Aufruf einer statischen Methode an dem PageObject "DemoTestPage" wird die Webanwenung in dem Brower geöffnet.
Da mehrere Eingaben auf dem PageObject erfolgen wird dieses als Methodenvariable abgelegt.
Nach der eingabe eines Wertes wird der Button geklickt. 
Dieser Aufruf liefert das passende PageObject zu der Result Seite zurück.
Mit einem Assert wird nun noch geprüft der gewünschte Wert auf der Seite zu erkennen ist.
Da das Aufräumen bereits in der TestBase erledigt wird ist der Test damit bereits beendet.

Die Tests können wie übliche Unit Tests aus der IDE heraus gestartet werden oder über das Failsafe Plugin.


# Vorbereitung und Testausführung

Um das Beispiel Projekt bauen und ausführen zu können sind einige Vorbereitungen notwendig. 
Die Virtualisierungslösung Docker muss installiert und eingerichtet werden.
Java und Maven sollten auf dem Hostsystem vorhanden sein. 
Dabei sollte darauf geachtet werden, dass JAVA_HOME sowie MAVEN_HOME korrekt gesetzt ist.

Unter Windows kann dieses Projekt nicht ohne weitere Modifikationen ausgeführt werden.
Ich empfehle hierfür die Verwendung einer virtuellen Maschine mit Linux Betriebssystem.
Auf MacOs mit installiertem Docker dürfte es keine Probleme geben.

## Docker installation

Für die Installation und Einrichtung des Docker Deamons empfehle ich einen Blick in die sehr gute Dokumentaion von Docker.
[docs.docker](https://docs.docker.com/install/linux/docker-ce/ubuntu/)
Damit es zu keinen Problemen mit den Bereichtigungen kommt sollten noch die Post Installation Steps for Linux ausgeführt werden.
[Docker Post Intallation](https://docs.docker.com/install/linux/linux-postinstall/)

## Auschecken des Codes 

Der Code kann wie folgt augescheckt werden.

``git clone https://github.com/lubbyhst/selenium-example.git``

Nach dem Ausschecken in das Projektverzeichniss wechseln.

``cd selenium-example``

## Testausführung

Durch folgenden Befehl wird das Projekt erstellt und anschließenden die Selenium Tests ausgeführt.
(Die erste Ausführung kann länger dauern da sämtliche Abhängigkeiten heruntergeladen werden müssen.)

``mvn clean install``

Wenn alles korrekt eingerichtet war, sollte das Ergebnis wie folgt aussehen.

![BuildSuccess](/assets/images/posts/selenium-einstieg-basis-projekt/build-success.png)

## Anmerkungen

In diesem Beispiel wird der Entwickler keinerlei Bewegung auf dem Monitor erkennen. 
Da der Remotedriver mit dem Selenium Hub im Dockercontainer interagiert ist von den Tests nichts zu bemerken.
Es besteht jedoch die Möglchkeit eine VNC Verbindung zu dem Docker Container zu öffnen. 
So ist es möglich die Testausfühurng zu beobachten.
Dafür kann nach dem Start der Docker Umgebung mittels VNC Client über localhost:5900 auf den Selenium Hub zugegriffen werden.
Das Passwort für den Zugriff lautet "secret".

# Ausblick

In weiteren Blogs möchte ich den Docker Part des Projektes näher beleuchten und wie genau man weitere Tests erstellen kann.
Außerdem möchte ich gerne bekannte Pitfalls sowie Do's and Dont's ansprechen die mir bereits oft über den Weg gelaufen sind.
