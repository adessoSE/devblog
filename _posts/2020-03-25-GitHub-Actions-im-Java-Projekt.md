---
layout: [post, post-xml]              
title:  "GitHub-Actions im Java Projekt"            
date:   2020-03-25 09:38              
modified_date:          
author: ccaylak                       
categories: [Java, Softwareentwicklung, Methodik]       
---
GitHub Actions ist das hauseigene Tool der Open-Source Plattform, um Prozesse in einem Softwareprojekte zu automatisieren.
In diesem Blogpost wirst du methodisch lernen, wie ein Java-Projekt mit GitHub Actions ausgestattet wird.
Die Schwerpunkte sind das Projekt bauen lassen, Tests laufen lassen, Statische Codeanalyse und das Erzeugen eines Releases, alles völlig automatisch. 

# Was ist GitHub Actions?
Diese API wird für öffentliche GitHub-Projekte zur Verfügung gestellt.
Dadurch können Workflowschritte definiert werden, die durch GitHub-Events wie einem pullrequest ausgelöst werden.
Die Workflowschritte sind demnach vom Code losgelöst und sind ein Teil des Repositorys. 
Die eigenen Software Development Practices können erstellt, geteilt, wiederverwendet und geforked werden.
Danach übernimmt Github die Ausführung, gibt ein umfangreiches Feedback und sichert.
Außerdem wird eine plattformunabhängige Automatisierung der Build-, Test-, und Deploy-Schritte ermöglicht.
Es kann zwischen den gängigen Betriebssystemen Windows, macOS und Windows gewählt werden.
Zudem kannst du festlegen, ob die Workflows in einem Container oder in einer virtuellen Maschine ausgeführt werden sollen.
Des Weiteren werden viele Programmiersprachen sowie Frameworks unterstützt.

## Erzeugung des Java Projekts
Als Java Projekt dient eine Spring Boot Anwendung, die mit dem [Spring Boot Starter](https://start.spring.io/) erstellt wurde.
Das Projekt ist mit Gradle und Version 13 von Java ausgestattet und zeigt exemplarisch wie Actions erstellt werden.
Somit hat dieses keine Logik und dient als leere Hülle auf dessen die o.g Schwerpunkte gezeigt werden.

### Gradle Projekt bauen
Um Actions in der Oberfläche von GitHub aufzurufen gibt es im Repository den Reiter "Action".
![Bild vom Actions Reiter](/assets/images/posts/github-actions/actions-tab.JPG)
angekommen im Punkt Actions kriegen wir vom intuitiven System eine Menge Actions, die bereits "out of the box" kommen.
Namhafte Sprachen und Frameworks werden direkt unterstützt.
Zum Herumexperimentieren von Actions gibt GitHub dem Benutzer einen kleinen Appell zu einem Starter-Action.
![Bild der Starter-Action](/assets/images/posts/github-actions/starter.JPG)
In diesem werden alle Punkte einer YML-Datei grob angeschnitten und erklärt, wofür diese benötigt werden.
Nichts destotrotz gibt es bereits eine Action, um ein Gradle Projekt bauen zu lassen.
Diese Action wird im späteren Verlauf dieses Blogposts als Grundlage für die anderen Tasks des Workflows wiederverwendet.
![Bild des Gradle-Build-Actions](/assets/images/posts/github-actions/gradle-build-action.JPG)
Im Folgenden wird der Codeblock der Action genauer betrachtet und die einzelnen Werte werden genauer erklärt, wieso und wofür diese da sind und was sie bewirken.
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
Das Schlüsselwort ```name``` gibt an, wie das Action später in der Ausführung bzw. in der Oberfläche heißen soll.
Danach folgt ```on```, was festlegt, auf welche GitHub-Events das Action reagieren soll.
In den eckigen Klammern folgen die Repositorys, für die, diese Actions gelten sollen.
Normalerweise wird in Softwareprojekten mit pull_requests gearbeitet, jedoch ist es für Testzwecke in Ordnung auf ```push``` sowie ```pull_request``` zu hören.
Welche weiteren Event-Typen es gibt, kann unter der dafür vorhandenen [Dokumentation](https://help.github.com/en/actions/reference/events-that-trigger-workflows) nachgesehen werden.
Anschließend beginnt der Workflow, der auch aus ein oder mehreren Workflowschritten bestehen kann.
Je nach Konfiguration werden diese sequenziell oder parallel abgearbeitet.
Nun folgen die einzelnen Jobs, wobei ```build``` den Namen des einzigen Workflowschritt angibt, zudem wird mit ```runs-on``` angegeben, auf welchem Runner dieser ausgeführt werden soll.
Mit ```steps``` wird eine Folge von Schritten definiert, die für diesen Job benötigt werden.
Als nächstes wird das Repository mit ```- uses: actions/checkout@v2``` ausgecheckt, damit es für den Job benutzt werden kann.
Nachdem das Repository ausgecheckt wurde, wird mit den nächsten drei Zeilen das Java SDK gesetzt.
Für dieses Projekt wurde Java 13 verwendet, weshalb die Zahl bei ```java-version``` von _1.8_ auf **13** geändert wurde.
Der Job braucht wiederum Rechte, um den danach folgenden Befehl ausführen zu können, daher werden diese mit ```run: chmod +x gradlew``` eingeholt.
Im letzten Schritt der Action wird das Gradle-Projekt mit ```./gradlew build``` gebaut.
![Bild des Ergebnisses des Gradle Builds](/assets/images/posts/github-actions/gradle-build-result.JPG)
Oben links am Icon ist erkennbar, ob die Action erfolgreich durchlaufen ist.
Daneben ist der Ziel-Branch, die Commitnummer und Commit-Message angegeben.
Darunter wird der Name des Actions angegeben, also das was in der ersten Zeile des o.g steht.
Darunter werden die einzelnen Jobs aufgelistet und zu guter Letzt gibt es rechts einen genauen Ablauf der einzelnen Steps.
Diese besitzen eine Zeitangabe und können bei Bedarf aufgeklappt und näher betrachtet werden.

### Gradle Projekt testen
In diesem Abschnitt wird die bereits erstellte Action um einen weiteren Job erweitert.
Dieser kommt direkt nach ```build``` und wird namensgebend ```test``` heißen.
Für diesen Job müssen wieder die bekannten Schritte durchgeführt werden.
Das Projekt muss ausgecheckt, mit Java 13 gebaut und mit Rechten versorgt werden.
Das einzige was sich vom voherigen Job unterscheidet ist der Gradle Befehl, denn dieses mal wird ```./gradlew test``` ausgeführt.
Als Referenz dient das [Projekt](https://github.com/adessoAG/github-actions/) des Blogposts, welches unter dem GitHub Account von der adesso SE auffindbar ist. 
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
Einer der weiteren Kernaspekte dieses Blogposts ist die Analyse eines Java-Projekts mittels statischer Codeanalyse.
Statische Code Analyse bedeutet, dass ein Tool nach typischen Codemustern sucht und dadurch die Codequalität stark verbessert.
Als Optionen standen CheckStyle, FindBugs und PMD zur Auswahl. 
Für unseren Anwendungsfall eignet sich PMD am besten, denn CheckStyle ist rein für die Formatierung zuständig.
FindBugs hat zwar einen größeren Funktionsumfang und findet typische Muster, wie infinite Loops usw.
Jedoch besitzt PMD den größten Funktionsumfang und eignet sich daher am besten zum Zeigen.
GitHub Actions hat einen eigenen Marketplace, ähnlich wie eine Art iOS oder Google Play Store.
Dort kann der Nutzer nach Actions suchen die er für nützlich empfindet und einige davon haben einen Verifizierungshaken.
Nach einer kurzen Google-Recherche fand ich heraus, dass es für PMD schon eine [Community-Action](https://github.com/marketplace/actions/pmd-source-code-analyzer-action) gab und dieser sogar einige Sterne auf GitHub hatte.
Das Beispiel funktioniert problemlos, jedoch fehlte der Checkout des Repositorys.
Der Folgende Ausschnitt der YML zeigt was hinzugefügt wurde.
```yaml
pmd:
    
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    - uses: sfdx-actions/setup-pmd@v1
    - name: PMD Source Code Analyzer Action
      run: pmd -d ./src/main/java -f text -R category/java/bestpractices.xml/UnusedLocalVariable -language java -version 13

```
Wir erstellen einen neuen Job namens ```pmd```. 
Dieser hat wieder einen Runner, der essenziell ist, ohne diesen funktioniert ein Job nicht.
Zuerst wird das Repository ausgecheckt und danach wird das Community-Action verwendet.
Im ```run``` wird ```pmd``` aufgerufen mit einem ```-d``` was den Pfad angibt, auf die das RuleSet ausgeführt werden soll.
Das Format des Ergebnisses wird  mit -f angegeben, da wird alles auf GitHub benötigen ist text die beste Wahl.
Das RuleSet wird mit -R und allen Regeln definiert, diese können in der offiziellen [Dokumentation](https://pmd.github.io/latest/pmd_rules_java.html#best-practices) von PMD gefunden werden.
Am Ende wird noch die Programmiersprache und dessen Version festgelegt.
Als der Job positiv durchlief, habe ich zum Testen eine ungenutze lokale Variable angelegt und die erwartete Fehlermeldung kam auch.
![Bild des Fehlgeschlagenen PMD-Checks](/assets/images/posts/github-actions/local-variable-fail.JPG)

### Release erzeugen
Als Letztes werden wir automatisiert einen Release erzeugen lassen.
Hierfür suchen wir wieder im Marketplace nach einer passenden Action.
Es gibt bereits [Create A Release](https://github.com/actions/create-release), die verifiziert von GitHub selbst kommt.
Nach näherer Betrachtung des vorgegeben Beispiels kann es problemlos angewandt werden.
Hierfür wird ein neuer Workflow erstellt der nur den Job der Release erstellung beinhaltet.
Das wird erstellt da er neben dem Eventtypen auch auf den Tag des Push/Pullrequests achten soll.
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
Als Erstes muss wieder der Eventtyp angegeben werden, optional kann auch ein Branch gegeben werden, wenn keiner angegeben ist, gilt diese Action für alle.
Anschließend auf welche getaggten pushs reagiert werden soll ```v*```, bedeutet das alles was mit dem Buchstaben v startet einen Release erzeugt.
Beispielsweise v1.0, v1.0.0 oder weitere, die diesem Muster entsprechen.
Wieder wird der Runner und der bekannte Step ausgeführt um das Repository zu bekommen.
Danach wird die Action zum Release erzeugen aufgerufen, diese benötigt eine Umgebungsvariable die sich GitHub selbst erstellt, hier muss also kein Token selbst erzeugt werden.
Den Tag-Namen und den Release-Name setzt bzw. holt sich GitHub selbst vom Commit.
Im Body steht dann der textuelle Inhalt des Releases.
Der Draft gibt an, ob der Release published _(true)_ oder unpublished _(false)_ sein soll.
Der Wert des Prerelease Attributs legt fest, ob es sich um einen vollwertigen eigenständigen Release handelt oder einen Prerelease.
Anschließend sieht der Release wie folgt aus.
![Bild des Releases](/assets/images/posts/github-actions/release.JPG)
Die Workflows werden in der Oberfläche separiert aufgelistet.
![Bild der Workflows](/assets/images/posts/github-actions/workflows.JPG)
Und als Abschluss eine kleine visuelle Darstellung der drei Jobs in der Oberfläche des Workflows.
![Bild aller Jobs](/assets/images/posts/github-actions/all-actions.JPG)

## Mein Fazit
Zum Abschluss dieses Blogposts gibt es ein persönliches Fazit.
Ich finde GitHub Actions ist ein muss bei Anwendungen, die sowieso auf der Plattform GitHub verwaltet werden, insbesondere im Open Source Bereich.
Einige der größten Vorteile sind, dass es eine sehr detaillierte Dokumentation gibt, es einfach zu verstehen ist und einen Marketplace besitzt, wo die Community zu beitragen kann.
Der Funktionsumfang ist gigantisch und jeder, dessen Interesse erweckt wurde, sollte sich die Dokumentation genauer anschauen.
Denn dieser Blogpost dient lediglich als Guide um zu zeigen wie einfach CI/CD Prozesse mit Actions realisiert werden können. 
Außerdem ist es schön, dass Actions vom Repository, also vom Code, getrennt sind.
Natürlich werden die Dateien mit ins Repository gepusht, aber die Erstellung dieser erfolgt in der Oberfläche von GitHub.
