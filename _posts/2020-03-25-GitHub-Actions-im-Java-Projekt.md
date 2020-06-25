---
layout: [post, post-xml]              
title: "GitHub Actions im Java Projekt"            
date: 2020-03-25 09:38              
modified_date: 2020-06-15 01:30
author: ccaylak                       
categories: [Softwareentwicklung]
tags: [GitHub, Gradle, Spring Boot, Java]     
---
GitHub Actions ist das hauseigene Tool Open-Source Plattform GitHub, um Prozesse in einem Softwareprojekt zu automatisieren.
In diesem Blogpost wirst du lernen, wie ein Java Projekt mit GitHub Actions ausgestattet wird.
Die Schwerpunkte sind das Bauen und Testen des Projekts, sowie das Deployen von Artefakten und die Anbindung von Cloud Services wie z.B SonarCloud.
Abschließend schauen wir uns auch die Erzeugung eines Releases an. 

# Was ist GitHub Actions?
Diese API wird für GitHub Projekte zur Verfügung gestellt.
Dadurch können Workflowschritte definiert werden, die durch Events wie beispielsweise **Pull Requests** ausgelöst werden.

Diese Workflows werden als Infrastructure as Code entwickelt, sind also ein Teil des Repositorys. 
Praktischerweise können sie auch geteilt und wiederverwendet werden.

Danach übernimmt GitHub die Ausführung und gibt dem Entwickler ein umfangreiches Feedback.
Außerdem wird eine plattformunabhängige Automatisierung der Build-, Test-, und Deployschritte ermöglicht.
Die Ausführung kann unter den gängigen Betriebssystemen Windows, Linux und macOS durchgeführt werden.
Auch kannst du festlegen, ob die Workflows in einem Container oder in einer virtuellen Maschine ausgeführt werden sollen.

## Erzeugung des Java Projekts
Als beispielhaftes Java Projekt dient eine Spring Boot Anwendung, die mit dem [Spring Boot Starter](https://start.spring.io/) erstellt wurde.
Das Projekt ist mit Java 11 und Gradle ausgestattet.

### Gradle Projekt bauen und testen
Um Actions in der Oberfläche von GitHub aufzurufen, gibt es im Repository den Reiter "Action".

![Bild vom Actions Reiter](/assets/images/posts/github-actions/actions-tab.JPG)

Angekommen in den Actions, kriegen wir vom intuitiven System eine Menge bereits definierter Actions, die out of the box einsetzbar sind.
Namhafte Sprachen und Frameworks werden unterstützt.
Zum Experimentieren stellt GitHub dem Benutzer eine Starter-Action zur Verfügung.

In diesem werden alle Punkte einer YML-Datei grob angeschnitten und erklärt, wofür diese benötigt werden.
Es gibt bereits zahlreiche Actions von GitHub selbst und der Open-Source Community, beispielsweise eine um ein Gradle Projekt bauen und testen zu lassen.
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
Das Schlüsselwort ```name``` gibt an, wie die Action in der Ausführung bzw. auf GitHub heißen wird.
Danach folgt ```on```, was festlegt, auf welche GitHub-Events die Action reagieren soll.
In der Array-Schreibweise folgen die Repositorys bzw. Branches, für die diese Actions gelten sollen.
Dementsprechend können Komma separiert mehrere Branches angegeben werden.

Für unser Projekt wird auf die Event-Typen ```push``` und ```pull_request``` reagiert.
Welche weiteren Event-Typen es gibt, kann in der [Dokumentation](https://help.github.com/en/actions/reference/events-that-trigger-workflows) nachgesehen werden.

Anschließend beginnt der Workflow, der aus einem oder mehreren Workflowschritten besteht.
Je nach Konfiguration können diese sequenziell oder parallel abgearbeitet werden.

Nun folgen die einzelnen Jobs, wobei ```build``` den Namen des einzigen Workflowschritt angibt.
Zusätzlich wird mit ```runs-on``` angegeben, auf welcher Ausführungsumgebung dieser ausgeführt werden soll.

Mit ```steps``` wird eine Folge von Schritten definiert, die für diesen Job benötigt werden.
Als nächstes wird das Repository mit Befehl ```- uses: actions/checkout@v2``` über Git ausgecheckt, damit es für den Job benutzt werden kann.

Nachdem das Repository ausgecheckt wurde, wird mit den nächsten drei Zeilen das Java SDK gesetzt.
Für dieses Projekt wurde Java 11 verwendet, weshalb die Zahl bei ```java-version``` auf **11** wurde.

Der Gradle Wrapper ist hier noch nicht als ausführbar markiert, daher wird dieser mit ```run: chmod +x gradlew``` kurzerhand geändert.

Im letzten Schritt der Action wird das Gradle-Projekt mit ```./gradlew build``` gebaut und getestet.

![Bild des Ergebnisses des Gradle Builds](/assets/images/posts/github-actions/gradle-build-result.JPG)

In der ersten Zeile der Abbildung steht der Name des Commits und ob dieser erfolgreich war oder fehlgeschlagen ist.
Eine Zeile darunter ist der Branch, die Commit-Nummer und die Commit-Message angegeben.
Anschließend folgt der Name der Actions und darunter werden die einzelnen Jobs aufgelistet.
Zu guter Letzt gibt es rechts einen genauen Ablauf der einzelnen Steps.
Diese besitzen eine Zeitangabe und können bei Bedarf aufgeklappt und näher betrachtet werden.

### SonarCloud Anbindung
Ein weiterer Aspekt dieses Blogposts ist die SonarCloud Anbindung mittels Actions im Java Projekt.
Für unseren Anwendungsfall benötigen wir das SonarQube und Jacoco für Gradle. 
Diese fügen wir dem Projekt hinzu, indem wir folgende Zeilen zum Punkt plugins der build.gradle eintragen.

```gradle
plugins {
	id "org.sonarqube" version "3.0"
	id 'jacoco'
}
```

Ferner muss die Version von Jacoco und dass ein Test-Report im XML format generiert werden soll angegeben.

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

Als Letztes muss SonarCloud in den gradle.properties konfiguriert werden.
Hierzu wird die Url, Organisation und der Project-Key eingeschrieben. 

```gradle
systemProp.sonar.host.url=https://sonarcloud.io/
systemProp.sonar.organization=adesso-ag
systemProp.sonar.projectKey=adessoAG_github-actions-demo
```
Auf SonarCloud muss du noch über den Pfad _My Account->Security->Tokens_ einen projektspezifischen Token generieren.
Dieser wird als Secret im GitHub Repository angelegt, damit er nicht von außen sichtbar ist.

Wir erstellen einen neuen Job namens ```sonarcloud```.

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

Folgend wird der zuvor erstellte Sonar Token und von Actions selbst generierter GitHub Token als Umgebungsvariable angegeben.
Umgebungsvariablen bzw. Enviroment variables werden unter ```env``` angegeben.
Hinterher wird ```gradlew test jacocoTestReport sonarqube -Dsonar.login=$SONAR_TOKEN``` im ```run``` ausgeführt.
Folgende Zeilen Code ergänzen den ```sonarcloud``` Workflow:
```yaml
- name: SonarQube and Jacoco
      run: ./gradlew test jacocoTestReport sonarqube -Dsonar.login=$SONAR_TOKEN      
      env: 
        SONAR_TOKEN: ${{secrets.SONAR_TOKEN}}
        GITHUB_TOKEN: ${{secrets.GITHUB_TOKEN}}
```

### Artefakte hochladen

Die Test-Coverage eines Projekts wird mit Jacoco prima gehandelt, der Entwickler würde den entsprechenden HTML-Report gerne als Artefakt hochladen.
Außerdem erstellt Gradle selbst auch einen Test-Report im HTML-Format, der ebenfalls als Artefakt hochgeladen werden soll.
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

Für das Hochladen von Artefakten wird  ```actions/upload-artifact@v1``` verwendet.
Dem Workflowschritten wird ein Name unter ```name``` gegeben und ein Output-Pfad der zur hochladenenden Datei bzw. Dateien.
Da CSS Dateien oder andere Abhängigkeiten vom HTML-Output vorhanden sein können, werden ganze Pfade und keine einzelnen Dateien übergeben.

### Release erzeugen
Als Letztes werden wir automatisiert einen Release erzeugen lassen.
Hierfür durchsuchen wir wieder den Marketplace nach einer passenden Action.
Es gibt bereits [Create A Release](https://github.com/actions/create-release), das verifiziert und von GitHub selbst erstellt wurde.
Nach näherer Betrachtung des vorgegeben Beispiels, kann es problemlos angewandt werden.

Hierfür wird ein neuer Workflow erstellt, der nur den Job der Release-Erstellung beinhaltet.
Ein eigener Workflow ist sinnvoll, da er neben dem Event-Typen auch auf den Tag eines **Push** oder **Pullrequests** achten soll.
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
`v*`, bedeutet das alles was mit dem Buchstaben v startet einen Release erzeugt.
Dadurch wird die semantische Versionierung (v1.0, v1.0.0 usw) unterstützt.
*Wie Patterns auf GitHub gehandhabt werden, kannst du [hier](https://help.github.com/en/actions/reference/workflow-syntax-for-github-actions#filter-pattern-cheat-sheet) nachschauen.* 
Wieder wird der Runner und der bekannte Step ausgeführt um das Repository zu bekommen.

Danach wird die Action zum Release erzeugen aufgerufen.
Diese benötigt eine Umgebungsvariable, die sich GitHub selbst erstellt. 
Dementsprechend muss hier kein Token selbst erzeugt werden.
Den Tag-Namen und den Release-Name setzt bzw. holt sich GitHub selbst vom Commit.
Im Body steht dann der textuelle Inhalt des Releases.

Der Draft gibt an, ob der Release published _(true)_ oder unpublished _(false)_ sein soll.
Der Wert des Prerelease Attributs legt fest, ob es sich um einen vollwertigen, eigenständigen Release handelt oder einen Prerelease.
Anschließend sieht das Release wie folgt aus.

![Bild des Releases](/assets/images/posts/github-actions/release.JPG)

## Mein Fazit
GitHub-Actions ist ein muss bei Anwendungen, die sowieso auf GitHub verwaltet wurden, insbesondere im Open Source Bereich.

Einige der größten Vorteile sind, dass es eine sehr detaillierte Dokumentation gibt und es einfach zu verstehen ist.
Des Weiteren gibt es einen [Marketplace](https://github.com/marketplace?type=actions), zu dem die Community beitragen kann.

Der Funktionsumfang ist gigantisch und jeder, dessen Interesse erweckt wurde, sollte sich die Dokumentation genauer anschauen.
Denn dieser Blogpost dient lediglich als Guide, um zu zeigen wie einfach CI/CD Prozesse mit Actions realisiert werden können. 

Außerdem ist es schön, dass Actions direkt in der Oberfläche von GitHub erstellt werden können.
Die Dateien werden anschließend mit ins Repository gepusht, aber der Support ist dank der Oberflächte angenehmer.
