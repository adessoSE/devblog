---
layout: [post, post-xml]              
title:  "Neo4j – Ein Einblick in die Welt der Graphdatenbanken"        
date:   2018-10-17 19:15              
modified_date: 2018-10-28 15:40                        
author: shsanayei                     
categories: [Softwareentwicklung]             
tags: [Graphdatenbanken, Neo4j]
---
Es gibt viele komplexe Daten, die miteinander in Beziehung stehen. 
Um diese Daten auf eine Datenbank abzubilden, existieren verschiedene Technologien, unter denen sich die relationalen Datenbanken und Graphdatenbanken etabliert haben.
Letztere, wie Neo4j, bieten viele Vorteile gegenüber von relationalen Datenbanken, die es wert sind näher betrachtet zu werden.

Relationale Datenbanken halten Daten in Tabellen und bilden Beziehungen mit Fremdschlüsseln ab. 
Bei der Abfrage dieser Daten sind oft mehrere Tabellen involviert. 
Das zugehörige SQL-Statement kann daher mehrere JOIN-Operationen enthalten, um in einer großen Datenstruktur korrekte Ergebnisse zu liefern. 
Das Problem besteht darin, dass dabei die Beziehungen erst zur Laufzeit der Abfrage ermittelt werden. 
Die dafür verwendeten JOIN-Operationen verbrauchen viel Speicher und CPU-Leistung. 
Das führt dazu, dass eine Abfrage, abhängig von der Größe der Abfrage und der Anzahl an Joins, mehrere Minuten bis Stunden dauern kann. 
Die Performanz und Effizienz leiden darunter. 

Eine alternative Lösung für dieses Problem bieten Graphendatenbanken. 
Sie bilden Beziehungen zwischen Elementen effektiver ab und erlauben dadurch effiziente und performante Datenabfragen. Neo4j ist dabei der bekannteste und verbreitetste Vertreter dieser Kategorie.

# Neo4j
[Neo4j Inc.](https://neo4j.com) ist das Unternehmen, das hinter der gleichnamigen Graphdatenbank steckt und wurde von Emil Eifrem und Johan Svensson 2007 gegründet. 
Die Datenbank hatte seine Anfänge im Jahr 2000 als die Gründer mit Performanzproblemen mit relationalen Datenbanken zu kämpfen hatten. 
Die erste offizielle Version wurde 2010 veröffentlicht. 
Das Unternehmen hat seinen Hauptsitz in Sillicon Valley und verfügt weltweit über mehrere Zweigstellen, unter anderem in München. 

Neo4j ist eine Open Source Software, die in zwei Lizenzvarianten angeboten wird. Zum einen gibt es die Community Edition, die unter der [GPL v3 Lizenz](http://www.gnu.org/licenses/quick-guide-gplv3.html) läuft. 
Diese Version ist sehr gut geeignet für private, kleinere oder Unternehmensinterne Projekte. 
Zum anderen gibt es die Enterprise Edition. Sie ist für größere Projekte, die unter anderem eine hohe Verfügbarkeit und Sicherheit benötigen geeignet. 
Diese Version besitzt zusätzlich zur GPL v3 auch die [AGPL v3](https://www.gnu.org/licenses/agpl-3.0.en.html) Lizenz.

# Datenbank modellieren
Ein Graph besteht aus Knoten und Kanten. 
Die Knoten haben durch die Kanten eine Beziehung zueinander. 
Die Kanten sind gerichtete Pfeile. Um die Beziehung zwischen Schauspielern, Regisseuren und Filmen zu modellieren, kann man diese ganz einfach auf ein Whiteboard als Graphen zeichnen. 
Dabei bilden „Person“ und „Movie“ die Knoten und „ACTED_IN“ und „DIRECTED“ die Kanten des Graphen. 
Diese können zusätzlich Eigenschaften haben:

![Neo4j Graph](/assets/images/posts/neo4j-ein-einblick-in-die-welt-der-graphdatenbanken/1-neo4j-graph.png)

In Neo4j werden Beziehungen nach diesem Schema abgebildet. 
Es ist sehr einfach und intuitiv. Man zeichnet auf einem Blatt Papier oder einer Tafel das Datenbankmodell als Graph, welcher später meist für die Datenbank übernommen werden kann.
Die Knoten und Kanten einer Graphdatenbank besitzen zusätzliche Eigenschaften. 
Zum einen sind das Labels wie „:Person“,  „:Movie“ oder „:ACTED_IN“, zum anderen Properties, die aus Key-/Value-Paaren bestehen. Knoten können beliebig viele Labels und Properties haben, Kanten nur ein Label und beliebig viele Properties. 
Auf diese Weise lassen sich komplexe Zusammenhänge zwischen Daten als Graph darstellen.

# Cypher - Die Abfragesprache von Neo4j

Neo4j hat eine eigene deklarative Abfragesprache, die sich Cypher nennt. 
Sie orientiert sich an SQL und ist einfach aufgebaut. 
Die Syntax besteht zum Teil aus „ASCII-Kunst“, die Knoten und Kanten repräsentiert: 
* Knoten werden als `(...)` dargestellt
* Kanten werden als `-[...]->` dargestellt

Innerhalb der Klammerung stehen Labels und Properties, die dann die gesuchten Daten genauer spezifizieren können.

## Abfragen
Möchte man die Beziehung zwischen Martin Freeman und allen Filmen, in denen er mitgespielt hat, abfragen, sieht die Syntax wie folgt aus:

```graphql
MATCH (martin:Person)-[:ACTED_IN]->(martinMovies:Movie)
WHERE p.name = "Martin Freeman"
RETURN p,m;
```

Als Ergebnis wird ein Subgraph zurückgegeben, der die gesuchte Beziehung aus dem Gesamtgraphen zeigt.

![Neo4j Subgraph](/assets/images/posts/neo4j-ein-einblick-in-die-welt-der-graphdatenbanken/2-neo4j-subgraph.png)
 
Das gleiche Ergebnis kann man auch erreichen, indem man auf die explizite WHERE-Klausel verzichtet und diese direkt in dem MATCH-Befehl angibt:

```graphql
MATCH (martin:Person {name: "Martin Freeman"})-[:ACTED_IN]->(martinMovies:Movie) RETURN martin,martinMovies;
```

Möchte man statt dem Graphen eine tabellarische Darstellung des Ergebnisses erhalten, kann dies mit folgender Query erreicht werden:

```graphql
MATCH (martin:Person {name: "Martin Freeman"})-[:ACTED_IN]->(martinMovies:Movie)
RETURN martinMovies.title, martinMovies.released;
```

Das Ergebnis der Abfrage wird als Tabelle zurückgegeben:


![Ergebnistabelle](/assets/images/posts/neo4j-ein-einblick-in-die-welt-der-graphdatenbanken/query-result-table.png)             

Die verwendeten Klauseln haben folgende Bedeutung:

* `MATCH`: Der Ausdruck gibt an, nach welchem Muster in der Datenbank gesucht werden soll (wie das `SELECT` in SQL).
* `WHERE`: Diese Klausel definiert Bedingungen für den MATCH-Befehl, um die Suche zu präzisieren.
* `RETURN`: Definiert was im Abfrageergebnis hinzugefügt werden soll.

Mit Cypher ist es auch möglich komplexe, verschachtelte Abfragen zu formulieren. 
Es lassen sich natürlich auch Knoten und Kanten hinzufügen, aktualisieren und löschen. 
Sie bietet außerdem eine Vielzahl von Funktionen wie *size()*, *count()* und *avg()* an, die in der Anwendungsentwicklung sinnvoll eingesetzt werden können.
Das [Cypher-Entwickler-Handbuch](https://neo4j.com/docs/developer-manual/current/cypher/functions/) verfügt über eine Liste aller Funktionen.

## Datensätze einfügen

Mit `CREATE` kann man neue Knoten und Beziehungen hinzufügen. 
Das folgende Beispiel fügt den Film „Black Panther“, in dem Martin Freeman 2018 gespielt hat, als Knoten hinzu. 
Anschließend wird eine neue Beziehung zwischen beiden Knoten erzeugt. 
Das Ergebnis wird in die Variable „path“ gespeichert und im `RETURN` ausgegeben:

```graphql
MATCH (martin:Person)
WHERE martin.name = "Martin Freeman"
CREATE path = (martin)-[:ACTED_IN {role: "Everett K. Ross"}]->(:Movie {title: "Black Panther", released: 2018})
RETURN path;
```

![Neu erzeugter Knoten](/assets/images/posts/neo4j-ein-einblick-in-die-welt-der-graphdatenbanken/3-create-node.png)

# Vorteile von Neo4j
**Einfachheit:** Neo4j ist durch die Graphdarstellung sehr anschaulich und intuitiv. 
Ein auf einem Whiteboard gezeichneter Graph kann meist 1:1 in die Datenbank übernommen werden. 
Die Abfragesprache Cypher ist durch die „ASCII-Kunst“ verständlich gehalten. 

**Performanz:** Einfache und komplexe Suchabfragen werden in Echtzeit ausgeführt. 
Die Abfragezeit verhält sich proportional zur Ergebnismenge und nicht zur Gesamtdatenmenge und führt dazu, dass ein und dieselbe Abfrage ähnlich schnell ist, unabhängig von der Gesamtmenge der Daten in der Datenbank. Folglich führt dies zu konstant schnellen Abfragen, Vermeidung von Join-Problemen und nur teilweiser Verarbeitung der gesamten Datenmenge.

**Agilität:** Neue Strukturen lassen sich gut in den Graphen integrieren und existierende Daten können erweitert werden ohne bestehende Applikationen dadurch zu beeinflussen. 
Beispielsweise ist es möglich, einem Knoten Labels und Properties hinzuzufügen oder diese zu entfernen. 
Mit Einschränkungen ist dies auch für Kanten möglich. 

**Zuverlässigkeit:** Neo4j verfügt über ausgereifte Funktionen, die die Erstellung zuverlässiger Systeme ermöglichen. 
Sie erfüllt die ACID-Anforderungen an Transaktionen und hat durch Clustering hohe Verfügbarkeit und Datendurchsatzrate.

# Neo4j näher kennenlernen
Die [Neo4j-Sandbox](https://neo4j.com/sandbox-v2/) ermöglicht einen interaktiven Einstieg in die Technologie. 
Sie besitzt eingebaute Anleitungen mit Beispielqueries und -codes. Man kann aus Sandboxen auszuwählen, die jeweils einen bekannten Anwendungsfall darstellen oder mit einer leeren Sandbox beginnen. 
Darüber hinaus bietet Neo4j ein kostenloses [Online-Training](https://neo4j.com/graphacademy/online-training/), in dem mit anschaulichen Übungsaufgaben, die unterschiedlichsten Datenbank-Operationen vermittelt werden. 
Eine sehr gute und umfangreiche Dokumentation rundet das ganze ab.

# Fazit
Für Applikationen mit großen Datenmengen, komplexen und stark vernetzten Strukturen bietet sich Neo4j als Datenbank-Technologie am besten an. 
Durch ihre Einfachheit ist es viel angenehmer eine Datenbank zu modellieren und sie dann in die Applikation zu integrieren. 
Da keine Join-Probleme existieren und in einer Abfrage keine komplizierten Ergebnistabellen erzeugt werden, arbeitet Neo4j sehr effizient. 
Zudem ist die Technologie durch ihre Skalierbarkeit und die hohe Verfügbarkeit der Datenbank sehr empfehlenswert. 
Schließlich machen die verschiedenen Lernmöglichkeiten den Einstieg ziemlich einfach.