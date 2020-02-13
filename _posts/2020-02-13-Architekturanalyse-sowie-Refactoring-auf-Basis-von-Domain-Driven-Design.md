---
layout: [post, post-xml]
title:  "Architekturanalyse sowie Refactoring auf Basis von Domain-Driven Design"
date:   2020-02-13 11:22
modified_date: 2020-02-13
author: DanielKraft
categories: [Java]
tags: [Domain-Driven Design, Refactoring, Micronaut,jQAssistant]
---

Zurzeit wird das Domain-Driven Design gerne in der Softwareentwicklung
verwendet.
Allerdings werden meistens nicht alle Standards des Domain-Driven Design eingehalten, obwohl das Domain-Driven Design dabei helfen kann die Qualität unseres Quellcodes zu verbessern.
In diesem Blog-Artikel stelle ich euch ein Werkzeug vor welches Java-Systeme, basierend auf dem Domain-Driven Design analysieren, bewerten und verbessern kann.
Dieses Werkzeug ist in Verbindung mit meiner Bachelorarbeit an der [Hochschule Darmstadt](https://fbi.h-da.de/) entstanden.
Der Quellcode des Werkzeugs ist auf [GitHub](https://github.com/DanielKraft/illumi-code-ddd) zu finden.

# Aufbau und Funktionsweise des Werkzeugs
Das Werkzeug wurde von mir in dem [Micronaut-Framework](https://micronaut.io/) entwickelt.
Diese Framework wurde bereits in dem früheren Blog-Artikel [Micronaut - Eine Alternative zu Spring](https://www.adesso.de/de/news/blog/micronaut-eine-alternative-zu-spring-4.jsp) vorgestellt.
Für die Verwendung des Werkzeugs benötigen wir das Analysewerkzeug [jQAssistant](https://jqassistant.org/).
jQAssistant ermöglicht es uns Java-Artefakte zu analysieren und in einer [Neo4j](https://neo4j.com/) Graphendatenbank darzustellen.

![Ablaufplan des Werkzeugs](/assets/images/posts/Architekturanalyse-sowie-Refactoring-auf-Basis-von-Domain-Driven-Design/Workflow.png "Ablaufplan des Werkzeugs")

Der Ablauf des Werkzeugs gliedert sich in fünf Phasen.
Im ersten Schritt muss das Java-System mithilfe von jQAssistant ausgelesen werden.
Anschließend analysieren und bewerten wir den aktuellen Zustand des Java-Systems.
Aufgrund dieser Bewertung wird das Java-System nun verbessert und erneut bewertet.
In den folgenden Abschnitten werde ich die drei Funktionen des Werkzeugs näher erläutern.

## Architekturanalyse
Währende der Architekturanalyse werden benötigte Daten aus der Neo4j-Datenbank ausgelesen.
Anschließend werden die Java-Artefakte den verschiedenen Domain-Driven Design Bausteinen zugeordnet.
Um diese Funktion auszuführen, rufen wir folgende URL auf.
Die Funktion benötigt als Parameter den Fully Qualified Name des Projekt-Packages.
```bash
http://localhost:8040/analyse/${PACKAGE_FQN}
```
Die analysierten Java-Artefakte werden und wie im folgenden Beispiel als JSON zurückgegeben.
Das Beispiel zeigt, dass die Klasse `Pet` anhand ihrer Eigenschaften als Entity klassifiziert wurde.
```json
{
    "extends": "org.springframework.samples.petclinic.model.NamedEntity",
    "DDD": "ENTITY",
    "name": "Pet",
    "fields": [
        "- birthDate: java.time.LocalDate",
        ...
    ],
    "methods": [
        "+ <init>(): void",
        "+ setBirthDate(java.time.LocalDate): void",
        "+ getBirthDate(): java.time.LocalDate",
        ...
    ],
    ...
}
```

## Architekturbewertung
Die zweite Funktion des Werkzeugs ist die Architekturbewertung.
Dabei wird die analysierte Softwarearchitektur mithilfe von zwei Metriken bewertet.
Die Architekturbewertung können wir uns mit der nachfolgenden URL erzeugt lassen.
```bash
http://localhost:8040/metric
```

### Object-Oriented Design Metrik
Die Object-Oriented Design Metrik beschreibt die Abstraktheit sowie die Instabilität von Modulen.
Ein Modul gilt als abstrakt, wenn es nur Interfaces oder abstrakte Klassen enthält.
Die Instabilität wird daran gemessen von wie vielen Modulen das Modul abhängig ist.
Die Abstraktheit und Instabilität eines Moduls sollte ausgewogen sein.
```json
"OOD": {
    "distance": {
        "avg": 0.39,
        "min": 0.17,
        "median": 0.2,
        "max": 1,
        "standard deviation": 0.41
    },
    ...
}
```
Das Werkzeug liefert uns die durchschnittliche Distanz der Module zum optimalsten Zustand.
Je geringer dieser Wert ist , desto besser ist das Object-Oriented Design Java-Systems.

### Domain-Driven Design Metrik
Die Domain-Driven Design Metrik bewertet alle Artefakte des Java-Systems anhand von vordefinierten Kriterien.
Dabei sind die einzelnen Kriterien unterschiedlich stark gewichtet.
Die Gesamtbewertung des Java-Systems spiegelt als die prozentuale Einhaltung der gewichteten Kriterien wider.
```json
"DDD": {
    "metric": {
        "score": "E",
        "fitness": 46.21,
        "#Issues": 76,
        "statistic": {
            "avg": 30.09,
            "min": 0,
            "median": 40,
            "max": 80,
            "standard deviation": 27.22
        }
    },
    ...
}
```
Als Ergebnis dieser Metrik bekommen wir die Gesamtbewertung des Java-Systems sowie die Anzahl der nicht eingehaltenen Kriterien.
Anhand dieser Bewertung können wir nach der Generierung eines Architekturvorschlags überprüfen, ob es zu einer Verbesserung geführt hat.

## Generierung eines Architekturvorschlags
Die letzte Funktion des Werkzeugs bietet die Möglichkeit die analysierte Softwarearchitektur anhand von Domain-Driven Design Kriterien zu verbessern.
Diese Funktion steht über die folgende REST-Anfrage zur Verfügung.
Die Ergebnisse dieser Funktion werden im gleichen Format zurückgegeben wie bei der Architekturanalyse.
```bash
http://localhost:8040/refactor
```
Bei der Verbesserung der Softwarearchitektur werden folgende Anpassungen vorgenommen.
Die Java-Artefakte werden den richtigen Domain-Driven Design Modulen zugeordnet und außerdem werden ihnen fehlende Felder oder Methoden hinzugefügt.
Dabei kann es auch vorkommen, dass ein Java-Artefakt einem anderen Domain-Driven Design Baustein zugeordnet wird oder sogar neue Java-Artefakte erzeugt werden.

# Ergebnisse von verschiedenen Beispielsystemen
In diesem Abschnitt gehe ich auf die Ergebnisse von drei verschiedenen Beispielsystemen ein.

![Ergebnisse der zwei unterschiedlichen Metriken](/assets/images/posts/Architekturanalyse-sowie-Refactoring-auf-Basis-von-Domain-Driven-Design/metrics.png "Ergebnisse der zwei unterschiedlichen Metriken")

Das linke Diagramm zeigt die prozentuale Erfüllung der Object-Oriented Design Metrik.
Es ist zu erkennen, dass die Verbesserung der Softwarearchitektur nicht zu einer deutlichen Verschlechterung geführt hat.
Im rechten Diagramm zeigt sich allerdings ein ganz anderes Bild.
Dieses Diagramm visualisiert die Ergebnisse der Domain-Driven Design Metrik.
Daran ist deutlich zu erkennen, dass durch den Umwandlungsalgorithmus das Domain-Driven Design des Java-Systems deutlich verbessert wurde.

# Fazit
Dieses Werkzeug bietet uns die Möglichkeit, Java-System auf Basis vom Domain-Driven Design zu bewerten.
Die Bewertung kann uns das Aufspüren von möglichen Schwachstellen erleichtern.
Außerdem gibt es die Möglichkeit sich ein Architekturvorschlag auf Basis vom Domain-Driven Design zu generieren.
Dieser Architekturvorschlag kann anschließend als Inspiration für Architekturveränderungen genutzt werden.