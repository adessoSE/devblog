---
layout: [post, post-xml]              
title:  "GitHub-Actions im Java Projekt"            
date:   2020-03-25 09:38              
modified_date:        
author: ccaylak                       
categories: [Softwareentwicklung]
tags: [GitHub, Java, Spring Boot, Gradle]     
---
GitHub-Actions ist das hauseigene Tool der Open-Source Plattform, um Prozesse in einem Softwareprojekte zu automatisieren.
In diesem Blogpost wirst du methodisch lernen, wie ein Java-Projekt mit GitHub-Actions ausgestattet wird.
Die Schwerpunkte sind das Bauen des Projekts, Testsausführung, statische Codeanalyse und das Erzeugen eines Releases. 

# Was ist GitHub-Actions?
Diese API wird für öffentliche GitHub-Projekte zur Verfügung gestellt.
Dadurch können Workflowschritte definiert werden, die durch GitHub-Events, wie einem **Pullrequest** ausgelöst werden.

Die Workflowschritte sind demnach vom Code losgelöst sowie ein Teil des Repositorys. 
Die eigenen Software Development Practices können erstellt, geteilt, wiederverwendet und geforked werden.

Danach übernimmt GitHub die Ausführung und gibt ein umfangreiches Feedback zurück.
Außerdem wird eine plattformunabhängige Automatisierung der Build-, Test-, und Deploy-Schritte ermöglicht.
Die Ausführung kann unter den gängigen Betriebssystemen Windows, macOS und Linux durchgeführt werden.
Zudem kannst du festlegen, ob die Workflows in einem Container oder in einer virtuellen Maschine ausgeführt werden sollen.

## Erzeugung des Java Projekts
Als beispielhaftes Java Projekt dient eine Spring Boot Anwendung, die mit dem [Spring Boot Starter](https://start.spring.io/) erstellt wurde.
Das Projekt ist mit Gradle und Version 13 von Java ausgestattet.

### Gradle Projekt bauen
Um Actions in der Oberfläche von GitHub aufzurufen gibt es im Repository den Reiter "Action".

![Bild vom Actions Reiter](/assets/images/posts/github-actions/actions-tab.JPG)

Angekommen in den Actions, kriegen wir vom intuitiven System eine Menge bereits definierter Actions, die **out of the box** sind.
Namhafte Sprachen und Frameworks werden direkt unterstützt.
Zum Herumexperimentieren stellt GitHub dem Benutzer eine Starter-Action zur Verfügung bereit.

![Bild der Starter-Action](/assets/images/posts/github-actions/starter.JPG)

In diesem werden alle Punkte einer YML-Datei grob angeschnitten und erklärt, wofür diese benötigt werden.
Es gibt bereits zahlreiche Actions von der Community oder auch welche von GitHub selbst, beispielsweise eine um ein Gradle Projekt bauen zu lassen.
Diese Action wird im späteren Verlauf dieses Blogposts als Grundlage für die anderen Tasks des Workflows wiederverwendet.

![Bild des Gradle-Build-Actions](/assets/images/posts/github-actions/gradle-build-action.JPG)

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
    - name: Set up JDK 1.8
      uses: actions/setup-java@v1
      with:
        java-version: 1.8
    - name: Grant execute permission for gradlew
      run: chmod +x gradlew
    - name: Build with Gradle
      run: ./gradlew build
```
Das Schlüsselwort ```name``` gibt an, wie die Action später in der Ausführung bzw. auf GitHub heißen soll.
Danach folgt ```on```, was festlegt, auf welche GitHub-Events das Action reagieren soll.
In der Array-Schreibweise folgen die Repositorys bzw. Branches, für die diese Actions gelten sollen.
Dementsprechend können Komma separiert mehrere Branches angegeben werden.

Für unser Projekt wird auf die Event-Typen ```push``` und ```pull_request``` reagiert.
Welche weiteren Event-Typen es gibt, kann in der [Dokumentation](https://help.github.com/en/actions/reference/events-that-trigger-workflows) nachgesehen werden.

Anschließend beginnt der Workflow, der aus einem oder mehreren Workflowschritten besteht.
Je nach Konfiguration werden diese sequenziell oder parallel abgearbeitet.

Nun folgen die einzelnen Jobs, wobei ```build``` den Namen des einzigen Workflowschritt angibt.
Zudem wird mit ```runs-on``` angegeben, auf welcher Ausführungsumgebung dieser ausgeführt werden soll.

Mit ```steps``` wird eine Folge von Schritten definiert, die für diesen Job benötigt werden.
Als nächstes wird das Repository mit Befehl ```- uses: actions/checkout@v2``` über Git ausgecheckt, damit es für den Job benutzt werden kann.

Nachdem das Repository ausgecheckt wurde, wird mit den nächsten drei Zeilen das Java SDK gesetzt.
Für dieses Projekt wurde Java 13 verwendet, weshalb die Zahl bei ```java-version``` von _1.8_ auf **13** geändert wurde.

Der Job braucht wiederum Rechte, um den danach folgenden Befehl ausführen zu können, daher werden diese mit ```run: chmod +x gradlew``` eingeholt.

Im letzten Schritt der Action wird das Gradle-Projekt mit ```./gradlew build``` gebaut.

![Bild des Ergebnisses des Gradle Builds](/assets/images/posts/github-actions/gradle-build-result.JPG)

In der ersten Zeile der Abbildung steht der Name des Commits und ob dieser erfolgreich war oder fehlgeschlagen ist.
Eine Zeile darunter ist der Branch, die Commit-Nummer und die Commit-Message angegeben.
Anschließend folgt der Name der Actions, also das was in der ersten Zeile der o.g steht.
Darunter werden die einzelnen Jobs aufgelistet und zu guter Letzt gibt es rechts einen genauen Ablauf der einzelnen Steps.
Diese besitzen eine Zeitangabe und können bei Bedarf aufgeklappt und näher betrachtet werden.

### Gradle Projekt testen
In diesem Abschnitt wird die bereits erstellte Action um einen weiteren Job erweitert.
Dieser kommt direkt nach ```build``` und wird namensgebend ```test``` heißen.
Für diesen Job müssen wieder die bekannten Schritte durchgeführt werden.
Das Projekt muss ausgecheckt, mit Java 13 gebaut und mit Rechten versorgt werden.

Das einzige was sich vom voherigen Job unterscheidet ist der Gradle Befehl, denn dieses mal wird ```./gradlew test``` ausgeführt.

Als Referenz dient das [Projekt](https://github.com/adessoAG/github-actions/) des Blogposts, welches unter dem GitHub Account der adesso SE auffindbar ist. 
Anschließend erweitert sich die Action um die folgenden Codezeilen.
```yaml
test:
    
    runs-on: ubuntu-latest
    
    steps: 
    - uses: actions/checkout@v2
    - name: Set up JDK 13
      uses: actions/setup-java@v1
      with:
        java-version: 13
    - name: Grant execute permission for gradlew
      run: chmod +x gradlew
    - name: Test Gradle
      run: ./gradlew test
```
### Statische Codeanalyse mit PMD
Ein weiterer Aspekt dieses Blogposts ist das Ausführen einer statischen Codeanalyse mittels Actions im Java-Projekt.
Statische Codeanalyse bedeutet, dass ein Tool nach typischen Mustern im Code sucht.
Dies trägt zur Erkennung von Fehlern oder Code-Smells bei und fördert gleichzeitig die Verbesserung der Codequalität.
Als beispielhaftes Tool wird [PMD](https://pmd.github.io/) verwendet, was einen großen Funktionsumfang hat.

GitHub-Actions hat einen eigenen Marketplace, in dem nach **Community-Contributions** gesucht werden kann.
Dort kann der Nutzer nach Actions suchen die er für nützlich hält und einige davon haben einen Verifizierungshaken.
Der Verifizierungshaken bedeutet, dass es sich um die echten Entwickler des Toolings handelt.
Dadurch ist sichergestellt, dass die Action funktioniert und in naher Zukunft auch funktionieren wird. 

Nach einer kurzen Google-Recherche kam heraus, dass für PMD bereits eine [Community-Action](https://github.com/marketplace/actions/pmd-source-code-analyzer-action) existiert.
Die Action musste angepasst werden, denn das angegebene Beispiel funktioniert nicht. 
Das auschecken des Git Repositorys fehlte.

Der Folgende Ausschnitt zeigt, was hinzugefügt wurde.
```yaml
pmd:
    
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2 #fehlte im ursprünglichen Action
    - uses: sfdx-actions/setup-pmd@v1
    - name: PMD Source Code Analyzer Action
      run: pmd -d ./src/main/java -f text -R category/java/bestpractices.xml/UnusedLocalVariable -language java -version 13

```
Wir erstellen einen neuen Job namens ```pmd```.

Dieser hat wieder eine Ausführungsumgebung, die essenziell ist.

Zuerst wird das Repository ausgecheckt.
Danach wird die Community-Action verwendet.

Im ```run``` wird ```pmd``` aufgerufen mit einem ```-d```, was den Pfad angibt, auf die das RuleSet ausgeführt werden soll.
Das Format des Ergebnisses wird  mit ```-f``` angegeben.
Da wir die Ausgabe des Ergebnisses in texuteller Form bzw. direkt in den GitHub-Logs benötigen, ist ```text``` die richtige Option.
Das RuleSet wird mit ```-R``` und allen Regeln definiert.
Außerdem können diese in der offiziellen [Dokumentation](https://pmd.github.io/latest/pmd_rules_java.html#best-practices) von PMD gefunden werden.
Zum Ende wird noch die Programmiersprache und dessen Version festgelegt.

Als der Job positiv durchlief, wurde zu Testzwecken eine ungenutze lokale Variable angelegt.
Dies wurde getan um zu überprüfen, ob dadurch die erwartete Fehlermeldung ausgelöst, was der Fall war.
![Bild des Fehlgeschlagenen PMD-Checks](/assets/images/posts/github-actions/local-variable-fail.JPG)

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
```v*```, bedeutet das alles was mit dem Buchstaben v startet einen Release erzeugt.

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

Anschließend sieht der Release wie folgt aus.

![Bild des Releases](/assets/images/posts/github-actions/release.JPG)

Die Workflows werden in der Oberfläche separiert aufgelistet.

![Bild der Workflows](/assets/images/posts/github-actions/workflows.JPG)

Zum Schluss eine kleine visuelle Darstellung der drei Jobs in der Oberfläche des Workflows.

![Bild aller Jobs](/assets/images/posts/github-actions/all-actions.JPG)

## Mein Fazit
GitHub-Actions ist ein muss bei Anwendungen, die sowieso auf GitHub verwaltet wurden, insbesondere im Open Source Bereich.

Einige der größten Vorteile sind, dass es eine sehr detaillierte Dokumentation gibt und es einfach zu verstehen ist.
Des Weiteren gibt es einen [Marketplace](https://github.com/marketplace?type=actions), zu dem die Community beitragen kann.

Der Funktionsumfang ist gigantisch und jeder, dessen Interesse erweckt wurde, sollte sich die Dokumentation genauer anschauen.
Denn dieser Blogpost dient lediglich als Guide, um zu zeigen wie einfach CI/CD Prozesse mit Actions realisiert werden können. 

Außerdem ist es schön, dass Actions direkt in der Oberfläche von GitHub erstellt werden können.
Die Dateien werden anschließend mit ins Repository gepusht, aber der Support ist dank der Oberflächte angenehmer.
