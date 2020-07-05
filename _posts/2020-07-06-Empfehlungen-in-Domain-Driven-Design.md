---
layout: [post, post-xml]              # Pflichtfeld. Nicht ändern!
title:  "Empfehlungen in Domain Driven Design"         # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2020-07-06 12:41              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2020-07-06             # Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author: mucha                         # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: [Softwareentwicklung]                    # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Softwareentwicklung]         # Bitte auf Großschreibung achten.
---

Software dient dazu die tägliche Arbeit einer Anwenderdomäne zu unterstützen. 
Trotz dieser grundlegenden Tatsache fällt es uns Entwicklern oft schwer, den Software-Entwicklungsprozess an die Bedürfnisse der Domäne auszurichten. 
In seinem Buch "Domain Driven Design - Tackling Complexity in the Heart of Software" hat Eric Evans die Notwendigkeit einer effizienten Ausrichtung der Software-Entwicklung an die Domäne erkannt und Maßnahmen vorgestellt, dies zu erreichen. 
Diese Sammlung von Werkzeugen ist seitdem unter dem Begriff Domain Driven Design, kurz DDD, bekannt. 
Um die Anwendung von DDD im Projektalltag zu veranschaulichen, können die Empfehlungen zur Verwendung der DDD-Werkzeuge betrachtet werden. 
Deshalb stellt dieser Artikel zunächst exemplarisch einige der DDD-Werkzeuge vor. 
Anschließend wird auf die Empfehlungen für ihre Verwendung eingegangen.

## Ubiquitous Language

Das wichtigste Hilfsmittel, welches uns Entwicklern in DDD nahegelegt wird, ist die Erarbeitung einer gemeinsamen Domänensprache. 
Diese wird als Ubiquitous Language bezeichnet. 
Sie ist eine Sammlung der fachlichen Begriffe, die von allen Projektteilnehmern inklusive den Domänenexperten gesprochen wird. 
Ziel ist die Erarbeitung eines gemeinsamen Verständnisses der Domäne zwischen den Domänenexperten und uns Entwicklern.
Die fachlichen Begriffe finden sich dann im Code der Software wieder. 
In objektorientierten Sprachen können dies Objekt-Klassen sein. 

Doch wie wird entschieden, ob ein von uns Entwicklern verwendeter Fachbegriff Teil der Ubiquitous Language ist? 
Hier wird empfohlen im Dialog mit Domänenexperten auf die Reaktion dieser zu achten, wenn ein Begriff durch uns Entwicklern eingeführt wird. 
Greift der Domänenexperte den Begriff bei der Diskussion einer Funktion auf? 
Neigt er stattdessen zu einer abweichenden Umschreibung oder ignoriert er gar den Begriff? 
Diese Hinweise können durch uns Entwicklern aufgegriffen und im Dialog explizit angesprochen werden, um die relevanten von den irrelevanten Begriffen auszusortieren. 
Dies kann einen entscheidenden Einfluss auf die Gestaltung der Modell-Objekte haben.

## Subdomains

Ein weiteres wichtiges Werkzeug in DDD ist das Unterteilen des Domänenmodells in einzelne Teilgebiete, die als Subdomains bezeichnet werden. 
Jede Subdomain beinhaltet einen abgegrenzten Anwendungskontext, dem sogenannten Bounded Context. 
Die Abgrenzung erfolgt zu den weiteren Subdomains. 
Die fachliche Komplexität wird somit auf die einzelnen Teilgebiete reduziert. 
Die abgegrenzten Subdomains interagieren miteinander an definierten Schnittstellen, die zusammengefasst Context Mapping genannt werden.

Im Bounded Context stellt sich nun die Frage welche Modell-Objekte zu einem bestimmten Bounded Context gehören. 
Verwenden zwei Entwickler das selbe Modell-Objekt für unterschiedliche Funktionen? 
Reichern sie beispielsweise eine Klasse mit unterschiedlichen Attributen oder Methoden an, um ihre jeweilige Aufgabe zu erfüllen? 
Verändern sie das Domänenmodell einer bereits vorhandenen Funktion maßgeblich? 
Dies sind nach Evans Hinweise, dass der fachliche Kontext für eine bestimmte Teilfunktion nicht ausreichend definiert ist. 
Somit bestehen Unklarheiten oder Mehrdeutigkeiten im Verständnis der Modell-Objekte. 
Abhilfe verschafft es die Grenzen der Teilfunktionen zu definieren und diese unter dem Entwicklungsteam bekannt zu machen. 
Daraus kann resultieren, dass ein Begriff in unterschiedlichen Kontexten unterschiedlich verwendet wird. 
Eine Unterteilung in zwei unterschiedliche Subdomains ist dann sinnvoll.

## Entities und Values

DDD bietet zudem Werkzeuge, um ein Domänenmodell im Detail zu erarbeiten. 
Dies erfolgt auf Ebene eines fachlichen Teilgebiets, also eines Subdomains innerhalb eines abgegrenzten Kontexts. 
Zunächst ist das Definieren der Modell-Objekte, hier Entities und Values genannt, notwendig. 
Entities sind eindeutige, veränderliche Objekte der Domäne. 
Values hingegen sind unveränderliche Werteobjekte. 

Wann ist ein Modell-Objekt als Entity und wann als Value zu implementieren? 
Hierzu können wir uns die folgenden Fragen stellen. 
Wird eine eindeutige Identifizierung des Objekts über einen kompletten Lebenszyklus des Datensatzes benötigt? 
Ist die Identifizierung über die einzelnen Objektattribute ausreichend? 
Ist es notwendig, dass zwei Datensätze mit exakt gleichen Attributwerten unterschieden werden können? 
Das Beantworten dieser Fragen erfordert Kenntnis über die Handhabung der Datensätze in der Domäne. 
Diese Fragen zu klären hilf die Objekte deutlich stärker dem fachlichen Zweck entsprechend zu modellieren.

## Aggregates

Um das Gestalten der Abhängigkeiten zwischen Modell-Objekten sinnvoll an die Domäne auszurichten, bietet DDD das Konzept der Aggregates. 
Ein Aggregate ist eine Gruppierung von Objekten mit einer Abgrenzung zu weiteren Objekten des Modells. 
Diese ist fachlich motiviert, resultiert jedoch auch in der Implementierung einer technischen Transaktionsgrenze. 
Datensätze werden somit in einem Verbund gemeinsam erstellt, aktualisiert oder gelöscht. 
In einem Aggregate existiert immer eine Entity, die ausschließlich außerhalb des Aggregates verwendet werden kann. 
Diese spezielle Rolle der Entity trägt den Namen Aggregate-Root. 
Weitere Entities und Values, die dem Aggregate zugeordnet sind, dürfen ausschließlich über das Aggregate-Root referenziert werden.

Wie können wir Entwickler ermitteln, ob Entities und Values gemeinsam in einem Aggregate zusammengefasst werden sollen? 
Wir können uns dazu fragen, ob eine Entity in der gesamten Domäne eindeutig verwendet werden muss. 
In diesem Fall sollte die Entität ihrem eigenen Aggregate zugeordnet sein. 
Reicht alternativ eine Unterscheidung innerhalb des fachlichen Verbunds? 
Ist die Suche nach einem Datensatz einer Entity fachlich nur dann sinnvoll, wenn zuvor eine andere Entity ermittelt wird? 
Dann sollte die erste Entity der zweiten in einem Aggregate untergeordnet werden.

## Fazit

Domain Driven Design bietet nützliche Werkzeuge um den Fokus des Software-Entwicklungsprozesses auf die Domäne zu richten. 
Dieser Artikel hat einige der Werkzeuge, sowie Empfehlungen zu ihrer Verwendung, vorgestellt. 
Die Empfehlungen bieten einen Einblick in die Verwendung der Werkzeuge im Projektalltag. 
Die Fragen in diesem Zusammenhang begegnen uns Entwicklern in der Praxis gelegentlich oder gar häufig. 
In der Auseinandersetzung mit den DDD-Werkzeugen können somit die Empfehlungen hervorgehoben betrachtet werden. 
Dies bietet eine Möglichkeit zu klären, ob und wie die DDD-Werkzeuge im eigenen Projektalltag Verwendung finden können. 