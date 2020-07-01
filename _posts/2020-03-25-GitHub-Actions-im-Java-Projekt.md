---
layout: [post, post-xml]              
title: "GitHub Actions im Java Projekt"            
date: 2020-03-25 09:38              
modified_date: 2020-06-25 13:55
author: ccaylak                       
categories: [Softwareentwicklung]
tags: [GitHub, Gradle, Spring Boot, Java]     
---
GitHub Actions ist das hauseigene Tool der Code-Hosting-Plattform GitHub, um Prozesse in einem Softwareprojekt zu automatisieren.
In diesem Blogpost wirst du lernen, wie ein Java Projekt mit GitHub Actions ausgestattet wird.
Die Schwerpunkte sind das Bauen und Testen des Projekts, sowie das Deployen von Artefakten und die Anbindung von Cloud Services wie z.B. SonarCloud.
Abschließend schauen wir uns auch die Erzeugung eines Releases an. 

# Was ist GitHub Actions?
Diese API wird für GitHub Projekte zur Verfügung gestellt.
Dadurch können Workflowschritte definiert werden, die durch Events wie beispielsweise **Pull Requests** ausgelöst werden.

Diese Workflows werden direkt in der Oberfläche des Repositories entwickelt. 
Praktischerweise können sie auch geteilt und wiederverwendet werden.

Danach wird die Actions ausgeführt und es wird ein umfangreiches Feedback mit z.B. Logs und Ausführzeiten erstellt.
Das umfangreiche Feedback kann individuell für jeden Schritt angepasst werden.
Die Ausführung kann unter den gängigen Betriebssystemen Windows, Linux und macOS durchgeführt werden.
Auch kannst du festlegen, ob die Workflows in einem Container oder in einer virtuellen Maschine ausgeführt werden sollen.

## Erzeugung des Java Projekts
Um einen demonstrativen Workflow zu erstellen, nutzen wir ein [Java Projekt](https://github.com/adessoAG/github-actions-demo) das mit [Spring Boot Starter](https://start.spring.io/) initialisiert wurde.
Das Projekt ist mit Java 11 und Gradle ausgestattet.

### Gradle Projekt bauen und testen
Um Actions in der Oberfläche von GitHub aufzurufen, gibt es im Repository den Reiter "Action".

![Bild vom Actions Reiter](/assets/images/posts/github-actions/actions-tab.JPG)

Angekommen in den Actions, werden vom intuitiven System eine Menge bereits integrierter Actions bereitgestellt.
Namhafte Sprachen und Frameworks werden unterstützt.
Zum Experimentieren stellt GitHub dem Benutzer eine Starter-Action zur Verfügung.

In der Starter-Action werden alle Punkte einer YML-Datei kurz erläutert.
Es gibt bereits zahlreiche Actions die von GitHub und der Open-Source Community bereitgestellt sind.
Diese Action wird im späteren Verlauf dieses Blogposts als Grundlage für die anderen Tasks des Workflows wiederverwendet.

Im Folgenden wird der Codeblock der Action genauer betrachtet.
Weiterhin werden die einzelnen Werte genauer erklärt.
```yaml
name: Spring Boot

on:
  push:
    branches: [ master ]
  pull_request:
    branches: [ master ]

jobs:
  build:

    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2
    - name: Set up JDK 11
      uses: actions/setup-java@v1
      with:
        java-version: 11
    - name: Grant execute permission for gradlew
      run: chmod +x gradlew
    - name: Build with Gradle
      run: ./gradlew build
```
Das Schlüsselwort `name` gibt an, wie die Action in der Ausführung bzw. auf GitHub heißen wird.
Danach folgt `on`, was festlegt, auf welche GitHub-Events die Action reagieren soll.
In der Array-Schreibweise folgen die Repositorys bzw. Branches, für die diese Actions gelten sollen.
Dementsprechend können kommasepariert mehrere Branches angegeben werden.

Für unser Projekt wird auf die Event-Typen `push` und `pull_request` reagiert.
Welche weiteren Event-Typen es gibt, kann in der [Dokumentation](https://help.github.com/en/actions/reference/events-that-trigger-workflows) nachgesehen werden.

Anschließend beginnt der Workflow, der aus einem oder mehreren Workflowschritten besteht.
Je nach Konfiguration können diese sequenziell oder parallel abgearbeitet werden.

Nun folgen die einzelnen Jobs, wobei `build` den Namen des einzigen Workflowschritts angibt.
Zusätzlich wird mit `runs-on` angegeben, auf welcher Ausführungsumgebung dieser ausgeführt werden soll.
Mit `steps` wird eine Folge von Schritten definiert, die für diesen Job benötigt werden.
Als nächstes wird das Repository mit Befehl `- uses: actions/checkout@v2` über Git ausgecheckt, damit es für den Job benutzt werden kann.
Nachdem das Repository ausgecheckt wurde, wird mit den nächsten drei Zeilen das Java SDK gesetzt.
Für dieses Projekt wurde Java 11 verwendet, weshalb die Zahl bei `java-version` auf **11** wurde.

Der Gradle Wrapper ist hier noch nicht als ausführbar markiert, daher wird dieser mit `run: chmod +x gradlew` kurzerhand geändert.
Im letzten Schritt der Action wird das Gradle-Projekt mit `./gradlew build` gebaut und getestet.

![Bild des Ergebnisses des Gradle Builds](/assets/images/posts/github-actions/gradle-build-result.JPG)

In der ersten Zeile der Abbildung steht der Name des Commits und ob dieser erfolgreich war oder fehlgeschlagen ist.
Eine Zeile darunter ist der Branch, die Commit-Nummer und die Commit-Message angegeben.
Anschließend folgt der Name der Actions und darunter werden die einzelnen Jobs aufgelistet.
Zu guter Letzt gibt es rechts einen genauen Ablauf der einzelnen Steps.
Diese besitzen eine Zeitangabe und können bei Bedarf aufgeklappt und näher betrachtet werden.

### SonarCloud Anbindung
Ein weiterer Aspekt dieses Blogposts ist die SonarCloud Anbindung mittels Actions im Java Projekt.
Für unseren Anwendungsfall benötigen wir das [SonarQube](https://docs.sonarqube.org/latest/analysis/scan/sonarscanner-for-gradle/) und [Jacoco Plugin](https://docs.gradle.org/current/userguide/jacoco_plugin.html) für Gradle.
SonarQube ist ein cloudbasierter Dienst, der den Sourcecode auf Qualität testet und die Ergebnisse über eine Webseite darstellt.
JaCoCo steht für Java Code Coverage Library und erstellt Ergebnisse für die Testabdeckung eines Projekts.
Diese fügen wir dem Projekt hinzu, indem wir folgende Zeilen zum Abschnitt `plugins` innerhalb der `build.gradle` eintragen.

```gradle
plugins {
	id "org.sonarqube" version "3.0"
	id 'jacoco'
}
```

Nun legen wir die Version von Jacoco fest und dass ein Test-Report als XML generiert wird.

```gradle
jacoco {
	toolVersion = "0.8.5"
}

jacocoTestReport {
	reports {
		xml.enabled true
	}
}
```

Als Letztes muss SonarCloud in den `gradle.properties` konfiguriert werden.
Hierzu wird die Url, Organisation und der Project-Key eingeschrieben. 

```gradle
systemProp.sonar.host.url=https://sonarcloud.io/
systemProp.sonar.organization=adesso-ag
systemProp.sonar.projectKey=adessoAG_github-actions-demo
```
Auf SonarCloud musst du noch über den Pfad _My Account->Security->Tokens_ einen projektspezifischen Token generieren.
Dieser wird als [Secret](https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets) im GitHub Repository angelegt, damit er nicht von außen sichtbar ist.
Secrets werden in der GitHub Oberfläche des Repositories über Settings->Secrets angelegt.

Wir erstellen einen neuen Job namens `sonarcloud`.

```yaml
  sonarcloud:

    runs-on: ubuntu-latest

    steps:
    
    - uses: actions/checkout@v2
      with:
        fetch-depth: 0
    - name: Set up JDK 11
      uses: actions/setup-java@v1
      with:
        java-version: 11
    - name: Grant execute permission for gradlew
      run: chmod +x gradlew
```

Folgend verwenden wir den zuvor erstellten Sonar Token und von Actions selbst generierten GitHub Token als Umgebungsvariable.
Umgebungsvariablen bzw. Enviroment Variables werden unter `env` angegeben.
Hinterher wird `gradlew test jacocoTestReport sonarqube -Dsonar.login=$SONAR_TOKEN` im `run` ausgeführt.
Folgende Zeilen Code ergänzen den `sonarcloud` Workflow:
```yaml
- name: SonarQube and Jacoco
      run: ./gradlew test jacocoTestReport sonarqube -Dsonar.login=$SONAR_TOKEN      
      env: 
        SONAR_TOKEN: ${{secrets.SONAR_TOKEN}}
        GITHUB_TOKEN: ${{secrets.GITHUB_TOKEN}}
```

### Artefakte hochladen

Die Test-Coverage eines Projekts wird mit Jacoco gehandhabt, der Entwickler bekommt anschließend einen entsprechenden HTML-Report.
Außerdem erstellt Gradle selbst auch einen Test-Report im HTML-Format, der zusammen mit dem Jacoco Test-Report als Artefakt hochgeladen werden soll.
Dies wird mit den folgenden zwei Workflowschritten realisiert.

```yaml
 - name: Archive code coverage results
      uses: actions/upload-artifact@v1
      with:
        name: Jacoco Test-Report
        path: build/reports/jacoco/test/html
  - name: Archive test results
      uses: actions/upload-artifact@v1
      with:
        name: Gradle Test report
        path: build/reports/tests/test
``` 

Für das Hochladen von Artefakten wird `actions/upload-artifact@v1` verwendet.
Dem Workflowschritten wird ein Name unter `name` gegeben und ein Output-Pfad der zu den hochladenenden Dateien führt.
Da CSS Dateien oder andere Abhängigkeiten vom HTML-Output vorhanden sein können, werden ganze Pfade und keine einzelnen Dateien übergeben.

### Release erzeugen
Als Letztes werden wir automatisiert einen Release erzeugen lassen.
Es ist wichtig zu wissen, dass bei Commits Tags gesetzt werden können.
Dadurch wird ein Workflow bei festgelegten Versionstags ausgelöst.
Hierfür durchsuchen wir wieder den Marketplace nach einer passenden Action.
Es gibt bereits [Create A Release](https://github.com/actions/create-release), das verifiziert und von GitHub selbst erstellt wurde.

Hierfür wird ein neuer Workflow erstellt, der nur den Job der Release-Erstellung beinhaltet.
```yaml
on:
  push:
    # Sequence of patterns matched against refs/tags
    tags:
      - 'v*' # Push events to matching v*, i.e. v1.0, v20.15.10

name: Create Release

jobs:
  build:
    name: Create Release
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@master
      - name: Create Release
        id: create_release
        uses: actions/create-release@latest
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # This token is provided by Actions, you do not need to create your own token
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          body: |
            Changes in this Release
            - First Change
            - Second Change
          draft: false
          prerelease: false
```
Als Erstes muss wieder der Event-Typ angegeben werden.
Optional kann auch ein Branch gegeben werden.
Wenn keiner angegeben ist, gilt diese Actions für alle.

Anschließend wird angeordnet, auf welche Tags reagiert werden soll,
`v*`, bedeutet das alles, was mit dem Buchstaben v startet, einen Release erzeugt.
Dadurch wird die semantische Versionierung (v1.0, v1.0.0 usw.) unterstützt.
*Wie Patterns auf GitHub gehandhabt werden, kannst du [hier](https://help.github.com/en/actions/reference/workflow-syntax-for-github-actions#filter-pattern-cheat-sheet) nachschauen.* 
Wieder wird der Runner und der bekannte Step ausgeführt, um das Repository zu bekommen.

Danach erzeugt die Action einen Release.
Die Action benötigt eine Umgebungsvariable, die automatisiert von GitHub erstellt wird. 
Dementsprechend muss hier kein Token selbst erzeugt werden.
Den Tag-Namen und den Release-Namen setzt bzw. holt sich GitHub selbst vom Commit.
Im Body steht dann der Inhalt des Releases.

Der Draft gibt an, ob der Release published _(true)_ oder unpublished _(false)_ sein soll.
Der Wert des Prerelease Attributs legt fest, ob es sich um einen vollwertigen, eigenständigen Release handelt oder einen Prerelease.
Anschließend sieht das Release wie folgt aus.

![Bild des Releases](/assets/images/posts/github-actions/release.JPG)

## Mein Fazit
Nach etwas mehr als einer Stunde haben wir einen automatisierten Workflow erstellt. 
Dieser baut, testet ein Gradle Projekt und deployt HTML-Reports als Artefakte.
Dazu erstellt der Workflow mittels Commit-Tags Releases.
GitHub-Actions ist sehr empfehlenswert bei Anwendungen, die sowieso auf GitHub verwaltet werden.
Insbesondere im Open Source Bereich bzw. öffentlichen Repositories ist der Einsatz sehr empfehlenswert, da keine Kosten zu erwarten sind. 
Bei privaten Repositories ist es empfehlenswert auf [Restriktionen](https://help.github.com/en/github/setting-up-and-managing-billing-and-payments-on-github/about-billing-for-github-actions) und Kosten zu achten.
Detaillierte Dokumentation und eine breite Palette [vorgegebener Actions](https://github.com/marketplace?type=actions) ermöglichen uns schnelle Umsetzung gewünscher Workflows.
Der Funktionsumfang ist gigantisch und jeder, dessen Interesse erweckt wurde, sollte sich die Dokumentation genauer anschauen.
Dieser Blogpost dient lediglich als Einführung, um zu zeigen, wie einfach CI/CD Prozesse mit Actions realisiert werden können. 
Außerdem ist es schön, dass die Actions direkt in der Oberfläche von GitHub erstellt und anschließend mit ins Repository gepusht werden.
