---
layout: [post, post-xml]
title:  "Technische Dinge für nichttechnische Leute (Teil 4)"
date:   2018-11-01 08:00
author: florianluediger
categories: [Softwareentwicklung]
tags: [Datenbanken]
---

Nachdem Annegret in den ersten drei Teilen der Serie schon einiges über die Welt der IT berichtet hat, möchte ich in diesem Artikel auf das Thema Datenhaltung eingehen.
Dazu kläre ich auf, wie Datenbankmanagementsysteme dazu verwendet werden können, Anwendungsdaten effizient zu verwalten und welche Alternativen es zu den klassischen, relationalen Systemen gibt.

# Wozu werden Datenbankmanagementsysteme überhaupt benötigt?
Stellt euch vor, wir verwalten ein System mit Wissenschaftlern und deren Errungenschaften und möchten deren Daten effizient speichern, lesen, durchsuchen und verändern können.
Zu jedem Wissenschaftler speichern wir _Id, Name, Vorname, Telefonnummer_ und _Auszeichnungen_.
Ein naiver Ansatz für die Speicherung dieser Daten könnte darin bestehen, sämtliche Wissenschaftler in einer Textdatei untereinander zu schreiben und diese auf der Festplatte abzulegen.
Dieser Ansatz hat allerdings einige offensichtliche Schwachstellen.

**(A)** Schon bei einer moderaten Anzahl von Wissenschaftlern wird das Durchsuchen schwierig. 
Das Programm müsste immer die gesamte Liste von oben bis unten durchlaufen, bis es den gesuchten Wissenschaftler findet. 
Dies könnte leicht optimiert werden, indem die Liste zum Beispiel nach Nachnamen alphabetisch sortiert wird. 
Somit kann wie bei einem Telefonbuch leichter gesucht werden. 
Möchten wir dann allerdings zum Beispiel herausfinden, welcher Wissenschaftler zu einer bestimmten Telefonnummer gehört, bringt uns diese Sortierung überhaupt nichts und es müsste wieder die gesamte Liste durchlaufen werden.
 
**(B)** Falls wir uns dazu entschieden haben, die Wissenschaftler nach Nachnamen zu sortieren, gibt es das nächste Problem, wenn es um das Hinzufügen neuer Einträge geht. 
Hat eure Software dazu die Stelle gefunden, an der der neue Wissenschaftler eingefügt werden muss, müssen sämtliche darunterliegende Einträge um eine Position weiter versetzt werden, damit Platz für den neuen Eintrag geschaffen wird.
Möchten wir also einen neuen Wissenschaftler ganz an den Anfang unserer Liste setzen, müssen sämtliche Daten neu geschrieben werden, was einen enormen Schreibaufwand bedeuten würde.

**(C)** Bei besonders erfolgreichen Wissenschaftlern kann es vorkommen, dass sie mehrere Auszeichnungen erhalten haben, die in unserem Beispiel für jeden Wissenschaftler hintereinander aufgelistet wären.
Möchten wir jetzt aber alle Wissenschaftler aufgelistet bekommen, die einen Nobelpreis bekommen haben, müssen wir wieder erheblichen Aufwand leisten.
Es muss jeder Eintrag der Liste untersucht werden und innerhalb jedes Eintrages die Liste von Preisen vollständig durchlaufen werden, um zu prüfen, ob der Nobelpreis vergeben wurde.

**(D)** Meistens will auf die Daten auch nicht nur eine Person zugreifen, sondern oftmals gleichzeitig hunderte Instanzen.
Dabei kann es schnell vorkommen, dass Inkonsistenzen entstehen, wenn ein Eintrag gleichzeitig von unterschiedlichen Leuten geändert wird.

Es gibt noch einige weitere Nachteile dieses naiven Ansatzes, wodurch er für wirklich große Datenmengen völlig unpraktikabel ist.
Um diese ganzen Probleme zu lösen, wurden **Datenbankmanagementsysteme(DBMS)** entwickelt, die mit intelligenten Algorithmen und Datenstrukturen das Erstellen, Lesen, Anpassen und Löschen von Datenmengen verwalten.
Die wohl verbreitetste Kategorie von DBMS sind die **relationalen** Systeme(RDBMS), für die ich klären möchte, wie sie die Probleme **A-D** zu lösen versuchen.

# Grundaufbau und Lösungsansätze einer relationalen Datenbank
Daten in einer relationalen Datenbank werden in einer Sammlung von Tabellen, sogenannten **Relationen**, abgelegt.
Die Spalten der Tabellen, in unserem Beispiel _Id, Name, Vorname, Telefonnummer_ und _Auszeichnungen_, werden **Attribute** genannt.
Einzelne Tabelleneinträge, sogenannte **Tupel**, können somit strukturiert abgelegt werden.
Durch diese Strukturierung und mithilfe einiger intelligenter Kniffe lassen sich die oben genannten Probleme in den Griff bekommen.
Unser sogenanntes **Datenbankschema**, welches hier nur aus einer Relation besteht, würde somit folgendermaßen aussehen.

![Schema der Beispieldatenbank](assets/images/posts/Technische-Dinge-fuer-nichttechnische-Leute-DBMS/wissenschaftler.png)

## Beschleunigung der Suche durch Indexe
Für das in **(A)** beschriebene Durchsuchen der Wissenschaftler nach Nachnamen würde in einem RDBMS ein Index angelegt, mit dem in kürzester Zeit die Stelle gefunden werden kann, an der sich ein Eintrag auf der Festplatte befindet.
Diesen Index könnt ihr euch vorstellen wie ein Stichwortverzeichnis am Ende eines Buches, in dem die Begriffe alphabetisch aufgelistet sind und zu jedem Begriff vermerkt ist, auf welcher Seite dieser erklärt wird.
Die tatsächliche Reihenfolge, in der sich die Einträge auf der Festplatte befinden, spielt dadurch keinerlei Rolle mehr.
Möchten wir zusätzlich jetzt nach einer Telefonnummer in unserem Datensatz suchen, können wir einen zweiten Index anlegen.
Wir können unsere Daten also quasi nach mehreren Attributen gleichzeitig sortieren.

Da wie gerade beschrieben die physikalische Reihenfolge der Daten keine Rolle mehr spielt, löst sich das in **(B)** beschriebene Problem schon fast von alleine.
Neu eingefügte Daten können einfach hintereinander in beliebiger Reihenfolge in den Speicher geschrieben werden, dabei muss nur darauf geachtet werden, dass die angelegten Indexe entsprechend aktualisiert werden, damit die neuen Einträge auch damit gefunden werden können.

## Normalisierung
Für das in **(C)** dargestellte Problem bringt uns die neue Strukturierung der Daten leider noch nichts, da sich schlecht ein Index für das _Auszeichnungen_-Attribut erstellen lässt, da hier mehrere Einträge drin stehen könnten.
Da außerdem ein Preis an mehrere Wissenschaftler verliehen werden kann, wird hier von einer **many-to-many-Beziehung** gesprochen.
Daher müssen wir das Datenbankschema etwas anpassen.

![Schema einer normalisierten Datenbank](assets/images/posts/Technische-Dinge-fuer-nichttechnische-Leute-DBMS/normalisiert.png)

Im Vergleich zum vorherigen Schema müssen hier nicht sämtliche Details der Auszeichnungen in der _Wissenschaftler_-Relation gespeichert werden.
In unserem einfachen Beispiel betrifft das zwar nur den Namen, wir könnten aber in Zukunft weitere Informationen, wie _Institut, Preisgeld, Kategorie, Verleihungsjahr, Thema, ..._ hinzufügen wollen, wodurch die Liste im _Auszeichnungen_-Attribut sehr lang werden würde und jegliche Struktur verloren ging.
Die Tabelle _Verleihungen_ wird dazu benötigt, zu vermerken, welcher Preis an welchen Wissenschaftler verliehen wurde.
Da Albert Einstein beispielsweise den Jules-Janssen-Preis bekommen hat, steht das Tupel (1, 2) in dieser Tabelle.
Das Aufteilen von Relationen in kleinere Relationen wird **Normalisierung** genannt.

Die Normalisierung hat außerdem den Vorteil, dass wir endlich effizient nachschauen können, welche Wissenschaftler den Nobelpreis erhalten haben.
Dazu schauen wir in der _Auszeichnungen_-Tabelle, welche Id der Nobelpreis hat, in unserem Falle wäre das 1.
In der _Verleihungen_-Tabelle können dann die Einträge herausgefiltert werden, welche die Id 1 besitzen, wodurch wir alle Wissenschaftler-Ids erhalten, die einen Nobelpreis erhalten haben.
Wenn uns das noch nicht reicht, können wir mit den Ids in der _Wissenschaftler_-Tabelle die anderen Informationen nachschlagen.
Dieses Vorgehen scheint vielleicht auf den ersten Blick umständlich, allerdings können all diese Operationen mithilfe von Indexen erfolgen und somit hocheffizient durchgeführt werden.

## Atomicity, Consistency, Isolation, Durability (ACID)
Anfragen, auch **Queries** genannt, können in einem RDBMS Tupel erstellen, lesen, verändern oder löschen.
Mehrere Anfragen können dabei in **Transaktionen** zusammengefasst werden, mit denen eine gewisse Sicherheit für die Operationen gewährleistet werden kann.
Beispielsweise würden wir beim Erstellen eines völlig neuen Eintrages die drei Anfragen zum Einfügen der Einträge in die drei Tabellen in einer Transaktion zusammenfassen.

Das in **(D)** beschriebene Problem fällt in die Kategorie **Concurrency-Control**, also Kontrolle von nebenläufigen Datenbankzugriffen, welche ein Hauptgebiet der Datenbankforschung darstellt.
Für RDBMS wurden daher die sogenannten ACID-Eigenschaften definiert, welche einige Anforderungen an das DBMS stellen, sodass verschiedenste Anomalien verhindert werden.
Auf diese Anomalien kann ich hier leider nicht weiter eingehen, die ACID-Eigenschaften dürften aber dennoch interessant sein.

1. **Atomicity**: Entweder **alle** oder **gar keine** der Änderungen innerhalb einer Transaktion werden übernommen.
Für unser Beispiel würde das bedeuten, dass der Eintrag in der _Verleihungen_-Tabelle nicht ohne die entsprechenden Einträge in den anderen Tabellen erstellt werden dürfte.
2. **Consistency**: Jede Transaktion überführt die Datenbank von einem **konsistenten** Zustand in einen anderen.
Beispielsweise dürfte bei einer Banküberweisung nicht Geld von einem Konto abgebucht werden, ohne auf das andere Konto eingegangen zu sein.
3. **Isolation**: Eine Transaktion darf keine der Änderungen von parallel laufenden Transaktionen **sehen**.
Unser in **(D)** beschriebenes Problem würde hierdurch verhindert werden.
4. **Durability**: Die Änderungen einer **erfolgreichen** Transaktion müssen in jedem Fall erhalten bleiben, auch beispielsweise nach einem Systemabsturz.

# Die SQL-Anfragesprache
Die oben beschriebenen Anfragen sind in relationalen Datenbanken stark optimiert und integriert worden.
Diese werden in der Sprache SQL formuliert, welche speziell dafür entwickelt wurde, dass auch weniger technisch ausgebildete Leute einfache Anfragen stellen können.
Eine entsprechende Anfrage könnte innerhalb unseres Beispiels etwa so aussehen:

```sql
SELECT Vorname, Telefonnummer FROM Wissenschaftler WHERE Name = 'Einstein'
```

Hier schränken drei Teile die Ergebnismenge ein:

1. Mit dem **SELECT**-Schlüsselwort werden die **Attribute** ausgewählt, die ihr von den Ergebnissen erfahren wollt. In unserem Falle interessieren uns nur _Vorname_ und _Telefonnummer_.
2. Das **FROM**-Schlüsselwort definiert die **Relation**, aus der die Ergebnisse abgerufen werden sollen. Wir möchten hier noch nichts über Auszeichnungen erfahren, daher reicht uns die _Wissenschaftler_-Relation.
3. Mit der **WHERE**-Operation legen wir schließlich noch fest, welche **Tupel** wir aus der Relation bekommen wollen. Hier sind dies alle Wissenschaftler, die den Nachnamen _Einstein_ tragen.

![Ergebnis der Anfrage](assets/images/posts/Technische-Dinge-fuer-nichttechnische-Leute-DBMS/ergebnis.png)

In unserem minimalen Beispiel besteht das Ergebnis nur aus einem einzigen Tupel, es kann aber auch vorkommen, dass mehrere Tupel oder sogar die gesamte Relation im Ergebnis zurückgeliefert werden.
Mit der SQL-Sprache lassen sich durch weitere Operationen noch sehr viel komplexere Anfragen stellen, sodass diese ein mächtiges Werkzeug zur Datenabfrage darstellt.

# Fazit
Leider konnte ich in diesem Artikel die Welt der Datenbankmanagementsysteme nur ganz kurz anreißen, ich hoffe trotzdem, dass ihr eine Vorstellung davon bekommen habt, warum diese Systeme gebraucht werden, um große Datenmengen zu verwalten.
Neben relationalen Datenbanksystemen gibt es zum Beispiel auch noch sogenannte NoSQL-Datenbanken, die beispielsweise durch Lockern einiger der ACID-Eigenschaften eine höhere Performanz erreichen.
Sogar innerhalb der relationalen Systeme gibt es erhebliche Unterschiede zwischen den einzelnen Produkten, wodurch die Auswahl der am besten geeigneten Software zur Herausforderung wird.

Falls ihr Interesse an weiteren, einfach erklärten, technischen Themen habt, dann schaut doch mal in die ersten drei Teile der Blog-Serie: [Teil 1 - Datenformate](https://www.adesso.de/de/news/blog/technische-dinge-fuer-nichttechnische-leute-teil-1.jsp), [Teil 2 - Microservices](https://www.adesso.de/de/news/blog/technische-dinge-fuer-nicht-technische-leute-teil-2.jsp), [Teil 3 - Deployments](https://www.adesso.de/de/news/blog/technische-dinge-fuer-nicht-technische-leute-teil-3.jsp)