---
layout: [post, post-xml]              # Pflichtfeld. Nicht ändern!
title:  "Komplex vernetzte Logistikdaten persistieren - Von Objekten in die Graphdatenbank per OGM" # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2022-07-27 11:00              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2022-07-27 11:00       # Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author_ids: [x1285]                   # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesen Namen geben.
categories: [Softwareentwicklung]     # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Graphdatenbank,Gremlin,Neptune,OGM,TinkerPop,Java] # Bitte auf Großschreibung achten.
---

Logistikprozesse können riesige Datenmengen darstellen, bei denen oftmals untereinander hochkomplexe Abhängigkeiten bestehen.
Diese Informationen lassen sich hervorragend in Graphdatenbanken hinterlegen, wo stark vernetzte Daten als Knoten und Kanten modelliert werden.
Um diese Daten zur Laufzeit automatisiert speichern und auslesen zu können, entwickelten wir eine Lösung, die wir nachfolgend vorstellen.

Das Ergebnis von untereinander abhängigen und referenzierenden Daten ist ein Netz von Informationen, bei welchen insbesondere den Beziehungen der Entitäten eine wichtige Rolle zugeordnet wird.
Die Erfahrung zeigt, dass relationale Datenbanken hier an ihre Grenzen kommen.
Passend hierzu existieren mehrere Prognosen, dass Graphdatenbanken in Zukunft deutlich öfters eingesetzt werden als noch heute.

Im Falle unseres Projekts fiel die Entscheidung zum Einsatz von Neptune als Graphdatenbank.
Neptune wird von Amazon als Datenbankservice in der AWS Cloud angeboten und ist für eine Anwendung, welche dieselbe Infrastruktur nutzt, eine entsprechend sinnvolle Entscheidung.
Neptune unterstützt Gremlin als Abfragesprache, die von Apache als Teil des TinkerPop Frameworks zur Verfügung gestellt wird.

Für relationale Datenbanken bietet sich bei Java Anwendungen als Schnittstelle die Jakarta Persistence API (JPA; ehemals Java Persistence API) und als implementierendes ORM-Framework (object-relational mapping) beispielsweise Hibernate an.
Dahingegen existiert für Graphdatenbanken derzeit keine offizielle Java API.
Für die neu entwickelte Logistik Anwendung war das Ziel ein Tool nutzen zu können, das automatisiert Gremlin Queries erzeugt, um Daten in der Graphdatenbank persistieren zu können, sowie diese durch definierte Abfragen wieder zur Laufzeit in die Anwendung zu laden.
Nachfolgend wird das entwickelte OGM-Framework (object-graph mapping) zusammengefasst und gehen auf Herausforderungen ein, die bei stark vernetzten Daten auftreten.

Um Java Objekte in der Graphdatenbank zu persistieren, ist zunächst ein System notwendig, welches definiert, wie die Daten als Graph abzubilden sind.
Diese Schnittstelle, die zwischen dem Datenmodell der Anwendung und dem entwickelten Persistenz-Framework agiert, wurde unter anderem als Annotation-API umgesetzt, wie Entwickler sie bereits von JPA kennen.
Um definieren zu können, ob Klassen die in der Graphdatenbank als Knoten oder Kanten zu modellieren sind, werden zusätzlich folgende abstrakte Klassen angeboten:
- Vertex
- Edge

In den implementierenden Java Klassen kann über die zuvor genannte Annotation-API definiert werden, wie einzelne Klassenvariablen in der Graphdatenbank darzustellen sind:

| Annotation | Beschreibung |
| --- | --- |
| `@Property` | Die Klassenvariable ist als Eigenschaft des Elements darzustellen.<br>Der Variablentyp muss ein direkt unterstützter Datentyp* sein. |
| `@Edge` | Die Klassenvariable stellt eine Kante dar.<br>Der Variablentyp muss vom Typ `Edge` oder `Collection<? extends Edge>` sein. |
| `@ViaEdge` | Die Klassenvariable ist als Knoten über eine Kante darzustellen.<br>Der Variablentyp muss vom Typ `Vertex`, `Collection<? extends Vertex>` oder ein unterstützer Datentyp[^1] sein. |
[^1]: Direkt unterstützte Datentypen sind alle primitiven Java Datentypen und Strings.

Um auch komplexere Typen, wie beispielsweise `LocalDate` als Datenbank Property modellieren zu können, wird durch das Attribut `mapToJson` und mithilfe des Jackson Projekts ein Mapping zu JSON ermöglicht, sofern dies notwendig ist und Gremlin oder die Datenbank den Datentypen nicht direkt unterstützt.

Mit dieser API lässt sich eine Person beispielsweise als Knoten wie folgt definieren:

```java
public class Person extends Vertex {
    
    @Property
    private String name;
    
    @Property(mapToJson = "true")
    private LocalDate birthdate;
    
    @Edge
    private Relationship bestFriend;
    
    @ViaEdge
    private List<Person> knownPersons;
    
}
```

Anhand dieses Beispiels lässt sich der Unterschied zwischen den Annotationen `@Edge` und `@ViaEdge` erklären: 
- Über `@Edge` wird eine Kante vom Typ `Relationship` definiert, die als `Edge`-Typ eigene Attribute definieren kann, wie in unserem Beispiel die Information seit wann die Freundschaft bereits besteht.
- Über `@ViaEdge` wird eine einfache Kante definiert, die keine detaillierten Informationen bietet.
Zur Modellierung der Kante wird während der Implementierung kein extra `Edge`-Typ benötigt und der `Vertex`-Typ kann direkt verwendet werden.

Standardmäßig ermittelt unser Framework die Labels der Kanten und Properties durch den Variablennamen.
Das Label über ein Attribut der Annotation ist, sofern gewünscht, änderbar.
So kann etwa in unserem Beispiel die Kanten von bekannten Personen verändert werden:

```java
    @ViaEdge(label = "knows")
    private List<Person> knownPersons;
```

Mit dem Framework können so Java Objekte vom Typ Vertex in einer Graphdatenbank gespeichert werden.
Dazu wird vom Framework zur Laufzeit ein Klassenmodell der zu persistierenden Knoten- und Kanten-Objekte erzeugt.
Dieses Modell wird daraufhin von unserem Query Builder verwendet, um das Gremlin-Statement zu erzeugen, welches letztendlich genutzt wird, um die komplex verstrickte Datenmenge in der Datenbank ablegen zu können.

Gerade bei Lieferketten und Logistikrouten, bei denen wichtige Knotenpunkte hochfrequent am Prozess beteiligt sind, führt dies schnell zu tausenden von Beziehungen der Daten untereinander.
Zirkuläre Referenzen in den Daten stellen dabei ein mögliches Problem dar.
Der folgende Fall soll uns hierbei als vereinfachtes Beispiel begleiten:

![Zyklisch referenzierende Entitäten](/assets/images/posts/komplex-vernetzte-logistikdaten-persistieren/cyclic-dependent-entities.png)
1. Jana und Tina kennen sich.
2. Tina und Florian kennen sich.
3. Florian und Jana kennen sich.

Für den Speicherprozess bedeutet das:

1. Beim Speichern von Jana ist auch Tina zu speichern.
2. Beim Speichern von Tina ist auch Florian zu speichern.
3. Beim Speichern von Florian ist auch Jana zu speichern.

Um hier nicht wieder nach C mit A zu beginnen und Endlosschleifen und damit Stackoverflows zu vermeiden, muss der entwickelte Algorithmus Schleifen erkennen.
Als Resultat wird nach dem Speichern von Florian noch die Beziehung zwischen Florian und Jana verarbeitet.
Nach dieser Relation wird jedoch nicht wieder mit Jana fortgefahren, da man sich sonst in eine Schleife begibt.

Rückblickend konnten wir innerhalb kürzester Zeit ein robustes und effizientes OGM-Framework entwickeln, das bei den Entwicklern dank bekannter Konzepte schnell hohe Akzeptanz fand und positives Feedback brachte.
Graphdatenbanken stellen gerade für Datenstrukturen mit vielen Beziehungen untereinander eine clevere Möglichkeit dar, um aufwendige Join-Table Strukturen zu vermeiden und wie in unserem Beispiel zügig zu Lösungen zu realisieren.