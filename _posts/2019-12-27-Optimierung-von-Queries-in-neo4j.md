---
layout: [post, post-xml]
title:  "Optimierung von Queries in Neo4j"
date:   2019-12-27 09:00
modified_date: 2019-12-27 09:00
author: maximAtanasov
categories: [Softwareentwicklung]
tags: [NoSQL, Graphdatenbanken, Neo4j]
---

Da NoSQL-Datenbanken in den letzten Jahren an Popularität zugenommen haben und öfters eingesetz werden, 
können viele Entwickler beim Wechsel von der klassischen, relationalen Denkweise über Daten zu einem völlig anderen Konzept auf eine steile Lernkurve stoßen.
In diesem Blogbeitrag werfen wir einen genaueren Blick auf die Graphdatenbank Neo4j und ihre Abfragesprache Cypher und erlernen Optimierungsstrategien und -konzepte anhand von Beispielen. 

Obwohl jeder, der Interesse an Graphdatenbanken hat, den Konzepten folgen und sie anderswo anwenden kann, empfehle ich, dass Ihr zumindest einige Erfahrungen mit Neo4j und seiner Abfragesprache habt. 
Falls Ihr mit Neo4j noch nicht vertraut seid, 
lohnt es sich, den Artikel [Neo4j – Ein Einblick in die Welt der Graphdatenbanken](https://www.adesso.de/de/news/blog/neo4j-ein-einblick-in-die-welt-der-graphdatenbanken-3.jsp) von Shahin Sanayei durchzulesen.
Aufgrund der Popularität des Spring Frameworks werden die meisten von euch wahrscheinlich auf Neo4j in Form von Spring-Data-Neo4j stoßen, daher werden wir auch auf dessen Vorteile und Grenzen eingehen.

## Ist mein Modell optimal?

Wir sollten immer versuchen, Probleme zu vermeiden, bevor sie auftreten. 
Performance-Probleme zu bekämpfen, nachdem wir unsere Anwendung in einer bestimmten Weise entwickelt haben, kann sehr frustrierend sein. 
Aus diesem Grund ist es sehr wichtig, die Zeit zu investieren, um das Graphenmodell sorgfältig zu planen und zu verfeinern, bevor es implementiert wird.
Eine nachträgliche Änderung kann schwierig sein und kostet wertvolle Zeit, die besser für die Implementierung neuer Features genutzt werden kann. 

Um dies zu veranschaulichen, werfen wir einen Blick auf das folgende Beispiel.

Betrachten wir folgendes Entitätsdiagramm:

![](/assets/images/posts/Optimierung-von-Queries-in-Neo4j/Initial_graph.png)

Dieses Scheint auf den ersten Blick vernünftig zu sein. 
Wir können alle Benutzer, ihre Projekte und die Aufgaben der Projekte abrufen.
Aber können wir alle Aufgaben erhalten, die einem Benutzer in einem bestimmten Projekt zugewiesen wurden? 
Ja, da alle erforderlichen Beziehungen vorhanden sind.
Die folgende Abfrage gibt uns genau das, was wir wollen:

```graphql
MATCH (u:User)<-[:IS_ASSIGNED_TO]-(t:Task)<-[:HAS]-(p:Project) WHERE ID(u) = 60 AND ID(p) = 61 RETURN t
```

Die Abfrage funktioniert einwandfrei und liefert alle fünfzig Aufgaben für den angegebenen Benutzer. 
Allerdings ist es nicht so effizient, wie es sein kann.
Wenn wir den Graphen so umstrukturieren, dass er eine Eigenschaft, nämlich die Projekt-ID, über die Beziehung zwischen Benutzern und Aufgaben verwendet, erhalten wir folgendes Modell:

![](/assets/images/posts/Optimierung-von-Queries-in-Neo4j/Second_graph.png)

Dann können wir die Abfrage hierauf vereinfachen:

```graphql
MATCH (u:User)-[:IS_ASSIGNED_TO {projectId: 61}]->(t:Task) WHERE ID(u) = 60 RETURN t
```

Die Ausführung der zweiten Abfrage im Neo4j-Profiler zeigt, dass die Datenbank nur ungefähr die Hälfte an Arbeit in die Abarbeitung des Query steckt, da wir keine Projektknoten mehr durchlaufen müssen.
Diese Verbesserung wird natürlich mit zunehmendem Datensatz skalieren. 
Der wesentliche Aspekt dieses Beispiels ist, dass man bei der Entwicklung des Modells auf die Zusammenhänge zwischen Daten achten sollte.
Unser primäres Ziel sollte es nicht sein, dass die Graphen in der Visualisierung "schön" aussehen (obwohl ein einfacher Graph helfen kann, das Modell zu verstehen). 
Man sollte sich überlegen, welche Abfragen auf den Daten auszuführen sind, diese vorher in Cypher aufschreiben und über mögliche Randfälle nachdenken, 
die im aktuellen Modell nicht funktionieren oder die Abfragen verlangsamen.

## Sind meine Queries optimal?

Ein gutes Modell wird uns helfen, die Cypher-Abfragen eher intuitiv zu schreiben. 
Es gibt jedoch ein paar Tricks, die man beachten sollte. 
Im Allgemeinen wollen wir, genau wie bei SQL, die Datenmenge in jeder Subquery so weit wie möglich reduzieren. 
Alles, was die Anzahl der zurückgegebenen Zeilen reduziert, wird in den meisten Fällen die Performance verbessern. 
Dies kann auf verschiedene Weisen erreicht werden:

* das Vermeiden von Kartesischen Produkten - Man sollte darauf achten, wie Ergebnisse von Subqueries behandelt werden, um unnötige Arbeit zu sparen.
    ```graphql
    # Schneller Query zum Abruf der Anzahl von Projekten
    MATCH (p:Project) WITH count(p) as countProjects MATCH (u:User) RETURN countProjects, count(u)
    # Langsamer Query
    MATCH (p:Project), (u:User) RETURN  count(p), count(u)
    ```
* das Benutzen von `LIMIT/DISTINCT/SKIP` - Funktioniert genauso wie `LIMIT/DISTINCT/OFFSET` in SQL.
* das Benutzen von `collect()/UNWIND` - Die `collect()` Funktion sammelt einzelne Elemente in einer Liste.
    Dies kann auch nützlich sein, um kartesische Produkte zwischen Subqueries zu vermeiden. `UNWIND` ist die inverse Operation zu `collect()`, es wird eine separate Zeile für jedes Element einer Liste erstellt.

Eine weitere Möglichkeit, Queries zu beschleunigen, besteht darin, dem Neo4j Query-Planner mit zusätzlichen Informationen über der Graphen zu füttern.
Das kann man machen, indem man:

* Indizes benutzt: 
    Das Platzieren von Indizes auf bestimmten Knoten bewirkt, dass Neo4j diese Knoten zwischenspeichert, sodass sie bei Bedarf schneller gefunden werden können. 
    Im obigen Beispiel möchten wir vielleicht einen Index auf die Knoten `ProjectEntity` und `UserEntity` setzen, 
    da diese Knoten höchstwahrscheinlich der Ausgangspunkt für die meisten Abfragen in unserer Anwendung sein werden. 
    Man muss jedoch vorsichtig sein, da das Platzieren von Indizes auf dem falschen Knoten nach hinten losgehen und zu Verlangsamungen führen kann.
* Labels benutzt: Im Allgemeinen sollte man beim Schreiben von Abfragen immer Labels verwenden. 
     ```graphql
     # Schneller Query
     MATCH (p:Project) WHERE p.name = "testProject" RETURN p
     # Langsamer Query
     MATCH (p) WHERE p.name = "testProject" RETURN p
    ```
Bei der zweiten Abfrage muss Neo4j alle Objekte in der Datenbank betrachten und nicht nur Projekte. 
Wenn man jedoch der Meinung ist, dass der Typ des Objekts irrelevant ist, kann man auch kein Label verwenden. 
In diesem Fall sollte man profilen und gucken, was am besten funktioniert.

## Profiling

Neo4j bietet auch Profiling-Tools an, die uns helfen können, einen Bottleneck zu lokalisieren und entsprechend anzupassen. 
Das Profiling erfolgt direkt über die Neo4j-Weboberfläche und ist sowohl für die Community als auch für die Enterprise Edition verfügbar.

### Was ist ein DB-Hit?

Ein Datenbankhit ist eine abstrakte Arbeitseinheit. 
Was als einen DB-Hit zählt, findet man [hier](https://neo4j.com/docs/cypher-manual/current/execution-plans/#execution-plans-dbhits). 
Im Regelfall möchte man die Anzahl der DB-Hits beim Optimieren von Abfragen reduzieren.

### Verwendenung des Schlüsselwortes `EXPLAIN`.

Man kann jede Anfrage mit dem Schlüsselwort `EXPLAIN` präfixieren und erhält einen detaillierten Ausführungsplan. 
Die Abfrage wird nicht ausgeführt, so dass man weder ein Ergebnis noch Informationen wie Ausführungszeit oder DB-Hits erhält.

So sieht beispielsweise der Ausführungsplan für die folgende Query aus: 

```graphql
EXPLAIN MATCH (u:UserEntity)-[:IS_ASSIGNED_TO {projectId: 21}]->(t:TaskEntity) WHERE ID(u) = 5 RETURN t
```

![](/assets/images/posts/Optimierung-von-Queries-in-Neo4j/EXPLAIN.png)

Man sieht, dass zuerst alle Knoten gefunden werden müssen, die mit dem `UserEntity` Label übereinstimmen, danach die Beziehungen `IS_ASSIGNED_TO` und dann ein Filter, um die richtige `projectId` zu finden. 
Da die Abfrage nicht ausgeführt wird, ist dies eine schnelle Methode, um zu sehen, ob die Abfrage wie erwartet abläuft.

### Verwendenung des Schlüsselwortes `PROFILE`.
   
Das Schlüsselwort `PROFILE` funktioniert genauso wie `EXPLAIN`, diesmal wird jedoch die Abfrage ausgeführt, so dass man genau sehen kann, 
wie viele DB-Hits jede Operation verursacht und wie viele Zeilen sie produziert. 
So kann man herausfinden, wo ein möglicher Bottleneck liegen könnte.

Betrachten wir ein Beispiel mit der gleichen Abfrage wie oben.

```graphql
PROFILE MATCH (u:UserEntity)-[:IS_ASSIGNED_TO {projectId: 21}]->(t:TaskEntity) WHERE ID(u) = 5 RETURN t
```

![](/assets/images/posts/Optimierung-von-Queries-in-Neo4j/PROFILE.png)

Man sieht nun, dass eine einzelne `UserEntity` mit der angegebenen ID gefunden wird. 
Danach werden alle 500 `IS_ASSIGNED_TO` Beziehungen gefunden und dann auf nur noch 50 gefiltert, die der Projekt-ID entsprechen.
Bei komplexeren Queries kann man auch sehen, welche Daten zusammengefügt werden und erhält mehr Einblicke in die problematischsten Teile der Query.

## Spring-Data-Neo4j

Ich kann mir vorstellen, dass die meisten von Euch mit Spring-Data-JPA und dem Hibernate ORM sehr vertraut sind. 
Ähnliche Funktionen sind für Neo4j mit Spring-Data-Neo4j und Neo4j-OGM (Object-Graph Mapper) verfügbar. 
Die Zuordnung von Klassen zu Graph-Knoten ist analog zur Verwendung von SD-JPA. 
Man verwendet einfach die richtigen Annotationen und fügt die Objekte dem Entity-Scan hinzu.

Zum Beispiel haben wir hier zwei Klassen nebeneinander. 
Die linke ist eine SD-JPA-Entität und die rechte eine SD-Ne4j-Entität.

![](/assets/images/posts/Optimierung-von-Queries-in-Neo4j/classes.png)

Sie sehen sehr ähnlich aus (zumindest an der Oberfläche). 
Dies kann bei der Umstellung von SD-JPA auf SD-Neo4j etwas hilfreich sein.

Bitte beachtet, dass Neo4j keine maximale Zeichenkettenlänge hat. 
Das bedeutet, dass man (sehr) große Zeichenketten als Properties speichern kann, aber im Normalfall sollte man das nicht tun, da es nicht performancefreundlich ist. 
Mehr darüber, wie das Speichern von Zeichenketten intern abläuft, findet man [hier](https://neo4j.com/docs/operations-manual/current/performance/property-compression/).

Man kann Repositories auch wie in SD-JPA anlegen, indem man Interfaces erstellt, die das Interface `Neo4jRepository` erweitern.
Mit den Standardmethoden (<code class="highlight language-java">findById(), delete(), save()</code> usw.) kann man einen zusätzlichen Tiefenparameter angeben, 
der bestimmt, wie tief die Graphen, die man erhält/speichert, sein werden. 
Ich habe festgestellt, dass diese Repositories gut für grundlegende CRUD-Operationen sind, aber zu wenig Flexibilität und Leistung für komplexe Abfragen anbieten. 
Man kann eine Methode jedoch mit der Annotation `@Query` annotieren und die Queries manuell schreiben. 
Dies hat den Vorteil, dass man genau festlegen kann, welche Teile des Graphen man haben möchte, sowie die Möglichkeit, Abfragen auch in der Neo4j-Weboberfläche profilen und anpassen zu können.

Insgesamt ist diese Obeject-Graph Mapping-Ebene sehr nützlich und vereinfacht und beschleunigt die Entwicklung erheblich. 
Leider ist dieser Komfort mit Kosten verbunden. 
SD-Neo4j verwendet viele Reflections, um das Mapping durchzuführen, und für bestimmte Operationen kann sich ein zusätzlicher Overhead als Bottlneck herausstellen. 
Das Framework ist definitiv nicht geeignet, um mehrere Millionen Knoten gleichzeitig zu speichern und man sollte vielleicht auf den Neo4j Java-Treiber zurückgreifen, um solche Operationen effizient durchzuführen.

## Fazit

Ich hoffe, dass ich Euch zumindest eine allgemeine Vorstellung gegeben habe, wie man Queries optimieren und ihre Performance verbessern kann. 
Ich habe es in diesem Artikel aus Gründen der Einfachheit vermieden, überkomplexe Graphen/Queries zu präsentieren.
Ich weiß, dass "echte" Domänenmodelle um ein Vielfaches komplexer sind als die von mir vorgestellten Beispiele, 
aber die Konzepte bleiben gültig und sollten Euch auf den richtigen Weg bringen, um Schwachstellen zu beseitigen. 
