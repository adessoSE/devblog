---
layout: [post, post-xml]              # Pflichtfeld. Nicht ändern!
title:  "Herausforderungen in der Domänenmodellierung"         # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2020-08-09 17:04              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2020-08-09             # Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author: viktor-mucha                  # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: [Softwareentwicklung]                    # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Softwareentwicklung]         # Bitte auf Großschreibung achten.
---

Software dient dazu die tägliche Arbeit einer Anwenderdomäne zu unterstützen. 
Trotz dieser grundlegenden Tatsache fällt es uns Entwicklern oft schwer, den Software-Entwicklungsprozess auf die Bedürfnisse der Domäne auszurichten. 
In seinem Buch "Domain Driven Design - Tackling Complexity in the Heart of Software" hat Eric Evans die Notwendigkeit einer effizienten Ausrichtung der Software-Entwicklung auf die Domäne erkannt und Maßnahmen vorgestellt, dies zu erreichen. 
Diese Sammlung von Werkzeugen ist seitdem unter dem Begriff Domain Driven Design, kurz DDD, bekannt.

In der Modellierung der Anwenderdomäne stehen wir Entwickler häufig vor wiederkehrenden Herausforderungen, die durch die DDD-Werkzeuge adressiert werden. 
Dieser Artikel stellt exemplarisch einige dieser Herausforderungen vor.
Zur Verdeutlichung werden die Herausforderungen anhand eines fiktiven Beispiels erklärt.
Es wird die Software zur Verwaltung von Reisebuchungen sowie der durch sie entstehenden Rechnungen betrachtet.

## Gemeinsames Verständnis des Domänenmodells

Die grundlegende Herausforderung, vor welcher wir Entwickler bei der Domänenmodellierung stehen, ist die Sicherstellung eines gemeinsamen Verständnisses der Fachlichkeit bei allen Projektbeteiligten.
Das Verständnis über die Domäne kann als Domänensprache bezeichnet werden, die in DDD als Ubiqitous Language bekannt ist.
Die gemeinsame Domänensprache sollte insbesondere von allen Entwicklern, aber generell auch von allen im Projekt involvierten Domänenexperten gesprochen werden.
Die Domänenexperten sind Anwender der Software mit einem hohen fachlichen Wissen.
Sie dienen als Kommunikationsschnittstelle zwischen dem Entwicklerteam und dem Fachbereich und helfen dabei, fachliche Fragen zu beantworten.
Die Domänensprache ist unter anderem eine Sammlung der fachlichen Begriffe, die in der Software relevant sind.
Die fachlichen Begriffe können sich dann im Code der Software wiederfinden.

Wir müssen uns im Falle der Software zur Verwaltung von Reisebuchungen somit die Frage stellen, welche fachlichen Begriffe für diese Relevanz haben.
Hierbei sind die Begriffe "Reisebuchung" und "Rechnung" selbst zu nennen. 
Weitere relevante Begriffe sind "Kunde" und "Reise-Betrieb".
Der Begriff "Reise-Betrieb" repräsentiert die während einer Reise involvierten Betriebe wie beispielsweise Hotels und Gastronomien.
Besonders herausfordernd ist es, den fachlichen Rahmen der Software entsprechend den fachlichen Bedürfnissen einzugrenzen.
Es stellt sich beispielsweise die Frage, ob für die Verwaltung der Reisebuchungen eine Bewertung eines Reise-Betriebs unterstützt werden soll.

## Unterteilung des Domänenmodells
 
In vielen großen Software-Projekten ist eine Unterteilung des Domänenmodells notwendig, um die fachliche Komplexität für die einzelnen Teilbereiche zu reduzieren.
Diese fachlichen Teilbereiche werden in DDD als Subdomains bezeichnet und haben jeweils einen fachlich abgegrenzten Kontext.
Eine durch DDD adressierte Herausforderung ist nun die sinnvolle Festlegung dieser Subdomains.
Als Entwickler stehen wir somit vor der Frage welche fachlichen Begriffe gemeinsam in einer Subdomain gruppiert werden sollten.
Müssen die Subdomains untereinander durch definierte Schnittstellen interagieren?
Wie sind diese Schnittstellen zwischen den Subdomains zu modellieren?

Bei Betrachtung der Software zur Verwaltung der Reisebuchungen stehen wir beispielsweise vor der Frage, ob die "Reisebuchung" und die "Rechnung" dieser in einer gemeinsamen Subdomain zusammengefasst werden sollen. 
Sollten wir zu dem Schluss kommen zwei getrennte Subdomains zu definieren, müssen wir die Interaktion dieser untereinander in Schnittstellen festlegen.
Es ist beispielsweise zu erwarten, dass die Erstellung einer "Reisebuchung" zu der Erstellung einer entsprechenden "Rechnung" führt.
Demenstprechend muss eine Schnittstelle zur Umsetzung dieser Funktion zwischen den Subdomains für die "Reisebuchung" und für die "Rechnung" bereitgestellt werden.

## Grundlegende Elemente des Domänenmodells

DDD bietet zudem Werkzeuge, um ein Domänenmodell im Detail zu erarbeiten. 
Dies erfolgt auf Ebene eines fachlichen Teilbereichs, also einer Subdomain. 
Wir Entwickler stehen hier vor der Herausforderung, welche grundlegenden Elemente der Domäne, also fachlichen Begriffe, relevant sind. 
Die Herausfoderung zur Erkennung der relevanten Elemente ist oft, die Rolle der Begriffe innerhalb der fachlichen Prozesse zu verstehen.
Es stellt sich ebenfalls die Frage, wie die identifizierten Elemente zu modellieren sind.
Diese Herausforderung adressiert DDD mit der Zielsetzung, die Elemente in fachlich eindeutige Entitäten und Werteobjekte zu unterteilen, die als Entities und Values bezeichnet werden.
Fachlich eindeutige Elemente benötigen ein eindeutiges Identifizierungsmerkmal innerhalb der Domäne.
Werteobjekte sind hingegen fachlich relevante Elemente der Domäne ohne Notwendigkeit der eindeutigen Identifizierung.
Sie werden somit allein durch ihre Attribute modelliert.

In der Subdomain für die Reisebuchungen benötigen wir unter anderem die Elemente "Reisebuchung", "Kunde" und "Reise-Betrieb".
Weitere Elemente können je nach fachlichem Prozess ergänzt werden.
So kann der Begriff "Verkehrsmittel" im Falle einer Pauschalreise eine Rolle spielen.
Eine entsprechende Modellierung muss in diesem Fall somit ergänzt werden.
Die "Reisebuchung", der "Kunde" und der "Reise-Betrieb" können wahrscheinlich als Entitäten modelliert werden, da sie vermutlich eine eindeutige Identifizierung innerhalb der Domäne benötigen.
Es ist nun denkbar, dass das involvierte "Verkehrsmittel" lediglich durch die Attribute Verkehrsmittel-Typ, Start- und Ziel-Ort modelliert werden kann.
In diesem Fall ist eine Modellierung als Werteobjekt ausreichend.

## Gruppierung grundlegender Elemente

Um das Gestalten der Abhängigkeiten zwischen Modell-Elementen sinnvoll auf die Domäne auszurichten, bietet DDD das Konzept der Aggregates.
Ein Aggregate ist eine Gruppierung von Elementen mit einer fachlichen Abgrenzung zu weiteren Elementen des Modells.
Die hierbei adressierte Herausforderung ist somit, die zuvor identifizierten Entities und Values nach fachlichen Kriterien zu gruppieren.

In der Subdomain für die Reisebuchungen ist beispielsweise eine Herausforderung, zu erkennen, ob die "Reisebuchung" und ein involvierter "Reise-Betrieb" nur gemeinsam eine fachliche Rolle spielen.
Weiterhin kann es sein, dass ein "Reise-Betrieb" fachlich nur dann betrachtet wird, wenn die zugehörige "Reisebuchung" ebenfalls betrachtet wird.
Dann ist eine Gruppierung der Elemente "Reisebuchung" und "Reise-Betrieb" in einem Aggregate sinnvoll, wobei die "Reisebuchung" in dem Aggregate eine übergeordnete Rolle spielt.

## Fazit

Domain Driven Design bietet nützliche Werkzeuge, die häufig auftretende Herausforderungen in der Domänenmodellierung adressieren.
Dieser Artikel hat einige der Herausforderungen und die durch sie adressierten DDD-Werkzeuge vorgestellt. 
Es ist insbesondere zu erkennen, dass wir diese Herausforderung in der Domänenmodellierung systematisch und gezielt im Blick haben können, wenn wir ein Domänenmodell erstellen, das in einer Software resultieren soll.
DDD bietet somit durch Anwendung der Werkzeuge die Möglichkeit, die Herausforderungen mit einer erhöhten Aufmerksamkeit zu betrachten.
So können Schwierigkeiten der effizienten Ausrichtung der Software auf die Domäne frühzeitig unterbunden werden.
