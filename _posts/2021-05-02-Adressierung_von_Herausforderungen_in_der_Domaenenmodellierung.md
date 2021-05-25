---
layout: [post, post-xml]              # Pflichtfeld. Nicht ändern!
title:  "Adressierung von Herausforderungen in der Domänenmodellierung"         # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2021-05-02 13:00              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2021-05-02 13:00             # Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author: viktor-mucha                  # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: [Softwareentwicklung]                    # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Domain Driven Design, Modellierung, Architektur]         # Bitte auf Großschreibung achten.
---

Von zentraler Bedeutung für die Softwareentwicklung ist die Modellierung der Fachdomäne.
_Domain Driven Design_, kurz DDD, ist eine Sammlung von Werkzeugen, um die Modellierung der Domäne zu unterstützen.
DDD wurde erstmalig durch Eric Evans in seinem Buch _Domain Driven Design - Tackling Complexity in the Heart of Software_ beschrieben.

In dem adesso Blog [Herausforderungen in der Domänenmodellierung](https://www.adesso.de/de/news/blog/herausforderungen-in-der-domaenenmodellierung.jsp) werden einige Herausforderungen in der Domänenmodellierung nach DDD beschrieben.
Es wird die Notwendigkeit für ein gemeinsames Domänenverständnis innerhalb der Projektteams aufgezeigt.
Zudem wird auf die Möglichkeit einer hohen Domänenkomplexität hingewiesen.
In der Detailmodellierung ist die Modellierung der Domänenelemente notwendig.
Weiterhin ist das Gestalten der Abhängigkeiten zwischen den zuvor ermittelten Domänenelementen zu betrachten.

In DDD stehen Werkzeuge zur Verfügung, diese Herausforderungen zu adressieren.
Dieser Artikel beschreibt diese Werkzeuge, sowie deren Anwendung, anhand eines fiktiven Beispiels.
Es wird die Entwicklung einer Software zur Verwaltung und Abrechnung von Reisebuchungen betrachtet.

## Ubiquitous Language und Bounded Context

Die Herausforderung für ein gemeinsames Domänenverständnis können wir in DDD durch Anwendung einer gemeinsamen Domänensprache adressieren.
Diese wird als _Ubiquitous Language_, also _allgegenwärtige Sprache_, bezeichnet. 
Sie beinhaltet die in der Domäne wichtigen Begriffe und Funktionen, die in einem begrenzten fachlichen Kontext zu modellieren sind.
In DDD wird für den Kontext der Begriff _Bounded Context_ verwendet.
Die Begriffe und Funktionen können wir unter den Teams bekannt machen, die an dem Projekt beteiligt sind.
Dies sind insbesondere die Teams aus der Entwicklung, die das fachliche Modell erstellen, und die Teams aus der Fachabteilung mit Domänenexpertise, die zur Anforderungsanalyse zur Verfügung stehen.
Das gemeinsame Domänenverständnis wird somit durch Anwendung der gemeinsamen Domänensprache erreicht.

In dem Beispiel der Reisebuchungen sind mindestens die Begriffe _Reisebuchung_, _Rechnung_, _Kunde_ und _Reise-Betrieb_ relevant. 
Wir betrachten zunächst den Begriff _Reisebuchung_.
Sowohl die Teams aus der Entwicklung als auch aus der Fachabteilung müssen ein gemeinsames Verständnis für die fachlichen Eigenschaften einer Reisebuchung haben.
In unserem einfachen Beispiel beinhaltet eine _Reisebuchung_ ein _Startdatum_ und _Enddatum_, ein _Startpunkt_ und _Endpunkt_, sowie optionale _Zwischenstationen_.
Die weiteren Begriffe und die sie betreffenden Funktionen müssen wir ebenfalls definieren und modellieren.

Der _Bounded Context_ legt nun für uns fest, welche fachlichen Funktionen in einem Kontext abgedeckt sind.
In unserem Beispiel gibt es die Anforderungen _Reisebuchungen_ und _Rechnungen_ zu verwalten.
Eine Mitarbeiterin oder ein Mitarbeiter des Fachbereichs möchte eine _Reisebuchung_ erstellen, die von einem _Kunden_ in Auftrag gegeben wird.
Weiterhin ist mindestens ein _Reise-Betrieb_ zur Durchführung der Reise festzulegen.
Hat nun die _Rechnung_ in diesem Aufgabenfeld keine Relevanz, ist die _Rechnung_ nicht Teil des Kontexts zur Erstellung einer _Reisebuchung_.

Die _Ubiquitous Language_ kann durch wiederkehrende Meetings zwischen den Teams aus der Fachabteilung und der Entwicklung aufgebaut werden. 
In den Meetings stellen die Mitarbeiterinnen und Mitarbeiter der Fachabteilung die Anforderungen an das System durch Beschreibung der eigenen Aufgaben vor.
Die Entwicklerinnen und Entwickler greifen die in den Anforderungen erwähnten fachlichen Begriffe und Funktionen auf und teilen ihr Verständnis hiervon durch Modellierung der Domäne mit.
Der Fachbereich überprüft und korrigiert das von den Entwicklerinnen und Entwicklern aufgenommene Verständnis.
Die Korrekturen können sich auf die fachliche Bedeutung der aufgegriffenen Begriffe und Funktionen beziehen.
Es kann aber auch zur Ergänzung neuer Begriffe und Funktionen kommen.
So kann sich im Verlauf der Gespräche unseres Beispiels herausstellen, dass ein _Verkehrsmittel_ zu Planungszwecken relevant sein kann.

![Initiales Domänenmodell](/assets/images/posts/Adressierung-von-Herausforderungen-in-der-Domaenenmodellierung/bild_01_initiales_domaenenmodell.png)

Die Effekte durch Anwendung der _Ubiquitous Language_ sind nach DDD ein erhöhtes Verständnis der Entwicklerinnen und Entwickler für die Domäne.
Dies wiederum reduziert das Risiko für Missverständnisse während der Entwicklung.
Demnach wird der _Ubiquitous Language_ eine zentrale Rolle bei der Entwicklung einer Software zugeschrieben.

## Subdomains

Ab einer gewissen Größe und Komplexität der Domäne wird die Modellierung dieser zunehmend aufwändig.
Für diesen Fall wird in DDD die Unterteilung in einzelne Teilbereiche empfohlen, die als _Subdomains_ bezeichnet werden.
Die Unterteilung wird notwendig, wenn unterschiedliche Elemente der _Ubiquitous Language_ nicht in einen gemeinsamen _Bounded Context_ fallen.
Die Herausforderung besteht dabei nicht nur in der Erkennung einer Unterteilung in Teilbereiche, sondern insbesondere in der Festlegung dieser.

In unserem Beispiel können wir zunächst die _Subdomain_ _Verwaltung Reisebuchung_ definieren.
Wie wir weiterhin gesehen haben, ist unter anderem der Begriff _Rechnung_ relevant.
Allerdings ist in den Gesprächen mit den Teams aus der Fachabteilung erkennbar, dass die _Rechnung_ bei der Zusammenstellung einer Reisebuchung keine direkte Rolle spielt.
Die _Rechnung_ ist in diesem einfachen Beispiel viel mehr eine Folge der Zusammenstellung einer Reisebuchung.
Da die _Rechnung_ aber weiterhin Relevanz hat, ist es sinnvoll, diese in eine eigene _Subdomain_ _Abrechnung_ mit einem entsprechenden _Bounded Context_ zu legen.
Die Definition des _Bounded Context_ legt somit den Umfang der _Subdomains_ _Verwaltung Reisebuchung_ und _Abrechnung_ fest.
Dies entspricht der geforderten Festlegung der Unterteilung von fachlichen Teilbereichen.

DDD bietet neben der Adressierung einer sinnvollen Unterteilung auch ein Werkzeug zur Kommunikation der _Subdomains_ untereinander.
Hierzu werden Schnittstellen einer _Subdomain_ definiert, welche von einer anderen _Subdomain_ verwendet werden.
In DDD wurde für die Festlegung dieser Schnittstellen der Begriff _Context Map_ eingeführt.

Aus den Gesprächen mit den Teams aus der Fachabteilung wissen wir, dass die Erstellung einer _Reisebuchung_ zur Erstellung einer _Rechnung_ führt.
Wir benötigen somit eine Schnittstelle in der _Subdomain_ _Abrechnung_, welche Daten der _Reisebuchung_ entgegen nimmt, die für die Erstellung der _Rechnung_ benötigt werden.

![Subdomains und Context Map](/assets/images/posts/Adressierung-von-Herausforderungen-in-der-Domaenenmodellierung/bild_02_subdomains_und_context_map.png)

Die Unterteilung der Domäne in _Subdomains_ reduziert die Komplexität innerhalb eines Kontexts, da nicht direkt im Kontext beteiligte Domänenelemente ausgeklammert werden.

## Entitites und Values

Die Domänenelemente haben wir bereits implizit bei Erstellung der _Ubiquitous Language_ definiert.
Die Herausforderung in der Detailmodellierung ist nun, wie wir diese Elemente in einem fachlichen Kontext modellieren.
DDD bietet hier das Konzept der _Entities_ und _Values_.
Zunächst stellen sowohl _Entities_ als auch _Values_ fachliche Elemente mit bestimmten Eigenschaften dar.
_Entities_ haben in der Fachlichkeit eine eindeutige Identität.
Wenn Veränderungen einer _Entity_ erforderlich sind, erfolgen sie in den Eigenschaften dieser.
_Values_ hingegen definieren sich ausschließlich über ihre Eigenschaften und besitzen keine eindeutige Identität.
Tritt die Erfordernis nach geänderten Eigenschaften auf, wird das bestehende _Value_ durch ein neues _Value_ mit den geänderten Eigenschaften ersetzt.

In unserem Beispiel sind die Elemente _Reisebuchung_, _Kunde_ und _Reise-Betrieb_ als _Entities_ zu modellieren.
Ein _Kunde_ beispielsweise definiert sich nicht ausschließlich über seine Eigenschaften, wie Vor- und Nachname.
Ein _Verkehrsmittel_ hat die Eigenschaften _Verkehrs-Typ_, _Startpunkt_ und _Endpunkt_.
In unserem vereinfachten Beispiel dient das Element lediglich zu optionalen Planungszwecken in der Endanwendung.
Die Fachabteilung benötigt hier keine eindeutige Identifikation und das _Verkehrsmittel_ kann als _Value_ modelliert werden.

Durch die Modellierung in _Entities_ und _Values_ rückt der fachliche Zweck der einzelnen Domänenelemente in den Vordergrund.

## Aggregates

Wir stehen weiterhin vor der Herausforderung, wie die Abhängigkeiten unter den zuvor modellierten Domänenelementen zu gestalten sind.
DDD bietet hierzu das Konzept der _Aggregates_.
Ein _Aggregate_ fasst ein oder mehrere Domänenelemente zusammen, die fachlich gemeinsam relevant sind.
Dies kann bedeuten, dass ein _Aggregate_ aus lediglich einer _Entity_ besteht, da diese separat betrachtet werden kann.
Jedoch ist es auch möglich, dass eine _Entity_ oder ein _Value_ nur dann fachlich relevant ist, wenn bereits eine andere _Entity_ betrachtet wird.
In diesem Fall ist eine Zusammenfassung in einem _Aggregate_ sinnvoll.
Die _Entity_, die hierbei vordergründig betrachtet wird, dient als Einstiegspunkt für das _Aggregate_ und wird als _Aggregate-Root_ bezeichnet.
Dies bedeutet insbesondere, dass ein Zugriff auf ein anderes Element des _Aggregates_ nur über das _Aggregate-Root_ möglich ist.
Weiterhin wird im _Aggregate-Root_ eine fachliche Invariantenprüfung der Eigenschaften aller _Aggregate_-Elemente durchgeführt.

In unserem Beispiel sehen wir zunächst, dass die Teams aus der Fachabteilung eine _Reisebuchung_ ohne Notwendigkeit weiterer _Entities_ betrachten.
Wir erkennen weiter, dass ein _Kunde_, ein _Reise-Betrieb_ und ein _Verkehrsmittel_ nur dann fachlich relevant sind, wenn eine _Reisebuchung_ gegeben ist.
Wir fassen somit die _Entities_ _Reisebuchung_, _Kunde_, _Reise-Betrieb_ und _Verkehrsmittel_ in einem _Aggregate_ zusammen.
Die _Reisebuchung_ modellieren wir hierbei als _Aggregate-Root_.
Als fachliche Invariantenprüfung können wir uns beispielsweise vorstellen, dass das _Startdatum_ einer _Reisebuchung_ vor dem _Enddatum_ liegen muss.

![Aggregate Reisebuchung](/assets/images/posts/Adressierung-von-Herausforderungen-in-der-Domaenenmodellierung/bild_03_aggregate_reisebuchung.png)

Die Verwendung von _Aggregates_ ermöglicht eine fachliche Gruppierung der Domänenelemente sowie eine lose Kopplung dieser innerhalb einer _Subdomain_.
Die lose Kopplung wird dadurch erreicht, dass nur das _Aggregate-Root_ für Abhängigkeiten außerhalb des _Aggregates_ verwendet wird.
Außerdem wird die fachliche Konsistenz erhöht, da eine Invariantenprüfung in den _Aggregates_ angewandt wird.

## Fazit

In diesem Blogartikel wurden wiederkehrende Herausforderungen in der Domänenmodellierung nach DDD aufgegriffen.
Es wurden Maßnahmen vorgestellt, die diese wiederkehrenden Herausforderungen adressieren.
Die Herausforderung eines gemeinsamen Domänenverständnisses wird mit der _Ubiquitous Language_ und dem _Bounded Context_ adressiert.
Der Möglichkeit einer hohen Domänenkomplexität wird mit Verwendung mehrerer _Subdomains_ begegnet.
Diese kommunizieren über Schnittstellen, die zusammengefasst als _Context Map_ bezeichnet werden.
Die Detailmodellierung in einer _Subdomain_ wird mit dem Konzept der _Entities_ und _Values_ adressiert.
Schließlich dienen _Aggregates_ zur Festlegung der Abhängigkeiten von _Entities_ und _Values_ in einer _Subdomain_.
Anhand des Beispiels zur Verwaltung und Abrechnung von Reisebuchungen wurde dargelegt, wie die Konzepte angewendet werden können.
