---
layout: [post, post-xml]
title:  "Technische Dinge für nichttechnische Leute (Teil 4)"
date:   2018-11-01 08:00
author: florianluediger
categories: [Softwareentwicklung]
tags: [Datenbanken]
---

Nachdem Annegret in den ersten drei Teilen der Serie schon einiges über die Welt der IT berichtet hat, möchte ich in diesem Artikel auf das Thema Datenhaltung eingehen.
Dazu kläre ich auf, wie Datenbankmanagementsysteme dazu verwendet werden können Anwendungsdaten effizient zu verwalten und welche Alternativen es zu den klassischen, relationalen Systemen gibt.

# Wozu werden Datenbankmanagementsysteme überhaupt benötigt?
Stellt euch vor, ihr möchtet all eure Kundendaten, welche aus Name, Vorname, Telefonnummer und Heimat-Geschäftsstelle bestehen, effizient speichern, lesen, durchsuchen und verändern können.
Ein naiver Ansatz für die Speicherung dieser Daten könnte darin bestehen sämtliche Kunden in einer Textdatei untereinander zu schreiben und diese auf der Festplatte abzulegen.
Dieser Ansatz hat allerdings einige offensichtliche Schwachstellen.

Schon bei einer moderaten Anzahl von Kunden, wird das Durchsuchen schwierig. 
Das Programm müsste immer die gesamte Liste von oben bis unten durchlaufen, bis es den gesuchten Kunden findet. 
Dies könnte leicht optimiert werden, indem die Liste zum Beispiel nach Nachnamen alphabetisch sortiert wird. 
Somit kann wie bei einem Telefonbuch leichter gesucht werden. 
Möchtet ihr dann allerdings zum Beispiel herausfinden, welcher Kunde zu einer bestimmten Telefonnummer gehört, bringt euch diese Sortierung überhaupt nichts und es müsste wieder die gesamte Liste durchlaufen werden.
 
Wenn ihr euch dazu entschieden habt, die Kunden nach Nachnamen zu sortieren, gibt es das nächste Problem, wenn es um das Hinzufügen neuer Kunden geht. 
Hat eure Software dazu die Stelle gefunden, an der der neue Kunde eingefügt werden muss, müssen sämtliche darunterliegende Einträge um eine Position weiter versetzt werden, damit Platz für den neuen Eintrag geschaffen wird.
Möchtet ihr also einen neuen Kunden ganz an den Anfang eurer Liste setzen, müssen sämtliche Kundendaten neu geschrieben werden, was einen enormen Schreibaufwand bedeuten würde.

Meistens will auf die Daten auch nicht nur eine Person zugreifen, sondern oftmals gleichzeitig hunderte Instanzen.
Dabei kann es schnell vorkommen, dass Inkonsistenzen entstehen, wenn ein Eintrag gleichzeitig von unterschiedlichen Leuten geändert wird.

Es gibt noch einige weitere Nachteile dieses naiven Ansatzes, wodurch er für wirklich große Datenmengen völlig unpraktikabel ist.
Um diese ganzen Probleme zu lösen, wurden Datenbankmanagementsysteme(DBMS) entwickelt, die mit intelligenten Algorithmen und Datenstrukturen das Erstellen, Lesen, Anpassen und Löschen von Datenmengen verwalten.
Die wohl verbreitetste Kategorie von DBMS sind die relationalen Systeme(RDBMS), deren Kernkonzepte ich hier mal etwas ausführen möchte.

# Grundaufbau einer relationalen Datenbank

# Die SQL-Anfragesprache

# Atomicity, Consistency, Isolation, Durability (ACID)

# Vergleich mit alternativen Konzepten

# Fazit