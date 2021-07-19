---
layout: [post, post-xml]              
title: "GitHub Actions im Java Projekt"            
date: 2020-08-17 13:00              
modified_date: 2021-03-08 14:50
author: ccaylak                       
categories: [Softwareentwicklung]
tags: [Java, Gradle, CI, GitHub, Open Source]     
---
In diesem Blogpost wirst du lernen, wie ein Java Projekt mit GitHub Actions ausgestattet wird.
Die Schwerpunkte sind das Bauen und Testen des Projekts, sowie das Deployen von Artefakten und die Anbindung von Cloud Services wie z.B. SonarCloud.
Abschließend schauen wir uns die automatisierte Release-Erzeugung an. 

# Was ist GitHub Actions?
GitHub Actions ist ein hauseigenes Tool der Code-Hosting-Plattform GitHub, um Prozesse in einem Softwareprojekt zu automatisieren.
Dadurch kannst du Workflows für dein Repository erstellen.
Ein Workflow besteht aus einem oder mehreren Jobs, wobei ein Job aus einem oder mehreren Schritten besteht.
Du kannst festlegen, ob Workflows in einem Container oder in einer virtuellen Maschine ausgeführt werden sollen.
Die Ausführung kann unter den gängigen Betriebssystemen Windows, Linux und macOS erfolgen.
Workflows werden durch Events wie beispielsweise **Pull Requests** ausgelöst und ausgeführt.
Wenn ein Workflow ausgeführt wird, arbeitet er alle seine Jobs, sowie Schritte ab und erstellt dir ein umfangreiches Feedback mit Logs und Ausführungszeiten.
Das Feedback kann individuell für jeden Schritt angepasst werden.
Eine Action wird in der Web-Oberfläche von GitHub erstellt.
Praktischerweise kann eine erstellte Action geteilt und wiederverwendet werden.

## Erzeugung des Java Projekts
Um einen demonstrativen Workflow zu erstellen, nutzen wir ein [Java Projekt](https://github.com/adessoAG/github-actions-demo), das mit [Spring Boot Starter](https://start.spring.io/) initialisiert wurde.
Das Projekt ist mit Java 11 und Gradle ausgestattet.

## Gradle Projekt bauen und testen
Um GitHub Actions aufzurufen, gibt es in der Repository-Ansicht den Reiter "Actions".

![Bild vom Actions Reiter](/assets/images/posts/github-actions/actions-tab.JPG)

Angekommen in den Actions, werden bereits eine Menge integrierter Actions bereitgestellt.
Namhafte Sprachen und Frameworks werden unterstützt.
Zum Experimentieren stellt GitHub dem Benutzer eine Starter-Action zur Verfügung.

In der Starter-Action werden alle Punkte einer YML-Datei kurz erläutert.
Diese Action wird im späteren Verlauf dieses Blogposts als Grundlage für die anderen Jobs des Workflows wiederverwendet.
Außerdem gibt es bereits zahlreiche Actions die von GitHub selbst und der Open Source Community bereitgestellt sind.

Im Folgenden wird der Codeblock der Action genauer betrachtet.
Weiterhin werden die einzelnen Punkte genauer erklärt.
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
Das Schlüsselwort `name` gibt an, wie der Workflow in der Ausführung bzw. auf GitHub heißen wird.
Danach folgt `on`, was festlegt, auf welche Events die Action reagieren soll.
In der Array-Schreibweise folgen die Repositories bzw. Branches, für die diese Action gilt.
Dementsprechend können kommasepariert mehrere Branches angegeben werden.

Für unser Projekt wird auf die Event-Typen `push` und `pull_request` reagiert.
Welche weiteren Event-Typen es gibt, kann in der [Dokumentation](https://help.github.com/en/actions/reference/events-that-trigger-workflows) nachgesehen werden.

Nun folgen die einzelnen Jobs des Workflows, wobei `build` den Namen repräsentiert.
Je nach Konfiguration können Jobs sequenziell oder parallel ausgeführt werden.
Zusätzlich wird mit `runs-on` angegeben, auf welcher Ausführungsumgebung dieser ausgeführt werden soll.
Mit `steps` wird die Folge von Schritten definiert, die für diesen Job benötigt werden.
Als Nächstes wird das Repository mit dem Befehl `- uses: actions/checkout@v2` über Git ausgecheckt, damit es für den Job benutzt werden kann.
Nachdem das Repository ausgecheckt wurde, wird mit den nächsten drei Zeilen das Java SDK gesetzt.
Für dieses Projekt wurde Java 11 verwendet, weshalb die Zahl bei `java-version` auf **11** gesetzt wurde.

Die Action als Nutzer innerhalb der VM oder des Containers hat noch keine Rechte zum Ausführen des Gradle Wrappers.
Dies wird mit dem Befehl `run: chmod +x gradlew` geändert.
Im letzten Schritt der Action wird das Gradle-Projekt mit `./gradlew build` gebaut und getestet.

![Bild des Ergebnisses des Gradle Builds](/assets/images/posts/github-actions/gradle-build-result.JPG)

In der ersten Zeile der Abbildung steht der Name des Commits und ob dieser erfolgreich war oder fehlgeschlagen ist.
Eine Zeile darunter ist der Branch, die Commit-Nummer und die Commit-Message angegeben.
Anschließend folgt der Name der Action und darunter die einzelnen Jobs.
Zu guter Letzt gibt es rechts einen genauen Ablauf der einzelnen Schritte.
Diese besitzen eine Zeitangabe und können bei Bedarf aufgeklappt und näher betrachtet werden.

## SonarCloud Anbindung
Ein weiterer Aspekt dieses Blogposts ist die SonarCloud Anbindung mittels GitHub Actions.
Für unseren Anwendungsfall benötigen wir das [SonarQube-](https://docs.sonarqube.org/latest/analysis/scan/sonarscanner-for-gradle/) und [Jacoco-Plugin](https://docs.gradle.org/current/userguide/jacoco_plugin.html) für Gradle.
SonarCloud kann für Open Source Projekte kostenfrei genutzt werden, um die statische Analyse mit dem SonarQube Scanner zu veröffentlichen.
JaCoCo steht für Java Code Coverage Library und erstellt Ergebnisse für die Testabdeckung eines Projekts. Diese werden von der Sonar-Analyse aufgegriffen.
Diese fügen wir dem Projekt hinzu, indem wir folgende Zeilen im Abschnitt `plugins` innerhalb der `build.gradle` ergänzen.

```gradle
plugins {
	id "org.sonarqube" version "3.0"
	id 'jacoco'
}
```

Nun legen wir die Version von JaCoCo fest und dass ein Test-Report im XML-Format generiert wird.

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
Hierzu wird die Url, Organisation und der Project-Key eingetragen. 

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

Folgend verwenden wir den zuvor erstellten Sonar Token und den von Actions selbst generierten GitHub Token als Umgebungsvariable.
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

## Artefakte hochladen

Die Test-Coverage eines Projekts wird mit JaCoCo gehandhabt, der Entwickler bekommt anschließend einen HTML-Report.
Hierüber kann die Coverage eingesehen werden, wenn beispielsweise kein SonarQube vorhanden ist.
Außerdem erstellt Gradle selbst auch einen Test-Report im HTML-Format, der zusammen mit dem JaCoCo Test-Report als Artefakt hochgeladen werden soll.
Dies wird mit den folgenden zwei Jobs realisiert.

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
Unter `name` wird jeweils der Name des Jobs und unter `path` der Output-Pfad, der zu den hochzuladenden Dateien führt, angegeben.
Da CSS Dateien oder andere Abhängigkeiten vom HTML-Output vorhanden sein können, werden ganze Pfade und keine einzelnen Dateien übergeben.

## Release erzeugen
Als Letztes werden wir automatisiert ein Release erzeugen lassen.
Es ist wichtig zu wissen, dass bei Commits sogenannte Tags gesetzt werden können.
Dadurch wird ein Workflow bei festgelegten Versionstags ausgelöst.
Hierfür durchsuchen wir wieder den Marketplace nach einer passenden Action.
Es gibt bereits [Create A Release](https://github.com/actions/create-release), das von GitHub selbst erstellt wurde.

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
Optional kann auch ein Branch angegeben werden.
Wenn kein expliziter Branch angegeben ist, gilt diese Action implizit für alle Branches.

Anschließend wird angeordnet, auf welche Tags reagiert werden soll, `v*`, bedeutet das alles, was mit dem Buchstaben v startet, ein Release erzeugt.
Dadurch wird die semantische Versionierung (v1.0, v1.0.0 usw.) unterstützt.
*Wie Patterns auf GitHub gehandhabt werden, kannst du [hier](https://help.github.com/en/actions/reference/workflow-syntax-for-github-actions#filter-pattern-cheat-sheet) nachschauen.* 
Wieder wird der Runner und der bekannte Step ausgeführt, um das Repository zu bekommen.

Danach erzeugt die Action ein Release.
Die Action benötigt eine Umgebungsvariable, die automatisiert von GitHub erstellt wird. 
Dementsprechend muss hier kein Token selbst erzeugt werden.
Den Tag-Namen und den Release-Namen setzt bzw. holt sich GitHub selbst vom Commit.
Im Body steht der Inhalt des Release.

Der Draft gibt an, ob das Release published _(true)_ oder unpublished _(false)_ sein soll.
Der Wert des Prerelease Attributs legt fest, ob es sich um ein vollwertiges, eigenständiges Release handelt oder ein Prerelease.
Anschließend sieht das Release wie folgt aus.

![Bild des Release](/assets/images/posts/github-actions/release.JPG)

# Mein Fazit
Nach etwas mehr als einer Stunde haben wir einen automatisierten Workflow erstellt. 
Dieser baut und testet ein Gradle Projekt und deployt HTML-Reports als Artefakte.
Dazu erstellt der Workflow mittels Commit-Tags Releases.
GitHub-Actions sind einfach bei Anwendungen anzubinden, die bereits auf GitHub verwaltet werden.
Insbesondere im Open Source Bereich bzw. öffentlichen Repositories ist der Einsatz möglich, da keine Kosten zu erwarten sind. 
Bei privaten Repositories solltest du auf die [Restriktionen und Kosten](https://help.github.com/en/github/setting-up-and-managing-billing-and-payments-on-github/about-billing-for-github-actions) achten.
Detaillierte Dokumentation und eine breite Palette [vorgegebener Actions](https://github.com/marketplace?type=actions) ermöglichen uns schnelle Umsetzung gewünschter Workflows.
Der Funktionsumfang ist gigantisch und jeder, dessen Interesse erweckt wurde, sollte sich die Dokumentation genauer anschauen.
