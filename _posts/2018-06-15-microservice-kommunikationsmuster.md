---
layout:         [post, post-xml]
title:          "Kommunikationsmuster in verteilten Systemen"
date:           2018-06-15 16:00
modified_date:  2018-06-21 17:01
author:         thombergs
categories:     [Architektur]
tags:           [Microservices]
---

In einer verteilten Architektur spielt die Kommunikation der verteilten Services eine zentrale Rolle.
Wie sollen die Services miteinander reden? Sollten sie synchron kommunizieren? Oder asynchron über
einen Messaging-Mechanismus? Wie so oft ist dies keine einfache Entscheidung zwischen zwei Alternativen, die
Abhängig vom jeweiligen Kontext getroffen werden muss. Dieser Artikel beschreibt einige Kommunikationsmuster
zwischen verteilten Services.

# Synchrone Aufrufe

Das einfachste Kommunikationsmuster besteht darin, einen entfernten Service einfach synchron aufzurufen.
Dies geschieht heutzutage üblicherweise per REST:

![Synchroner Aufruf](/assets/images/posts/communication-patterns/rest.jpg)

Service 1 ruft Service 2 auf und wartet, bis dieser die Anfrage verarbeitet hat und eine Antwort geliefert hat.
Service 1 kann dann die Antwort von Service 2 in derselben Transaktion verarbeiten, in der auch die Anfrage
an Service 2 stattgefunden hat.

Dieses Kommunikationsmuster ist leicht nachvollziehbar, schließlich nutzen wir alle es jeden Tag, wenn wir im Browser
eine beliebige Webseite öffnen. Synchrone Aufrufe werden auch technologisch gut unterstützt. Es gibt viele Libraries,
die synchrone Kommunikation über HTTP unterstützen, z. B. die Open Source Libraries [Feign](https://github.com/OpenFeign/feign)
und [Hystrix](https://github.com/Netflix/Hystrix) von Netflix.

Beleuchten wir mal einige Vor- und Nachteile von synchroner Kommunikation:

## Timeouts

Was passiert, wenn Service 2 zwischendurch einfach mal sehr lange braucht, um eine Anfrage zu beantworten? Irgendwann
will Service 1 nicht mehr auf eine Antwort warten, was sich üblicherweise in einer Timeout-Exception niederschlägt, die
dafür sorgt, dass die lokale Transaktion in Service 1 zurückgerollt wird.

Aber Service 2 weiß nichts davon, dass Service 1 seine Transaktion zurückgerollt hat und arbeitet munter weiter,
bis die Anfrage von Service 1 schließlich doch irgendwann erfolgreich verarbeitet wurde. Das kann zu einem inkonsistenten
Datenbestand zwischen Service 1 und Service 2 führen.

## Starke Kopplung

Naturgemäß erzeugt synchrone Kommunikation eine starke Kopplung zwischen den Kommunikationspartnern. Service 1
funktioniert nicht mehr, wenn Service 2 gerade mal nicht erreichbar ist. Um mit solchen Ausfällen umzugehen,
müssen wir mit Retry- oder Fallback-Mechanismen arbeiten. Das müssen wir aber zum Glück gar nicht selbst
programmieren, sondern wir nutzen einfach [Hystrix](https://github.com/Netflix/Hystrix) dafür.

Aber auch Retry- und Fallback- haben ihre Grenzen und sind nicht für jede Anforderung geeignet.

## Einfach zu Implementieren

Wie schon erwähnt, ist synchrone Kommunikation einfach umzusetzen. Es gibt jede Menge Libraries, die verschiedenste
Arten von HTTP-Clients und -Servern zur Verfügung stellen, um uns dabei zu unterstützen. Wir sollten nur schauen,
dass wir eine Library finden, die unsere Anforderungen hinsichtlich Retry und Fallback auch unterstützt.

# Einfaches Messaging

Als Nächstes beleuchten wir mal asynchrones Messaging.

![Einfaches Messaging](/assets/images/posts/communication-patterns/messaging.jpg)

Service 1 schickt eine Nachricht an einen Message Broker und vergisst danach, dass er diese Nachricht überhaupt geschickt hat.
Service 2 abonniert ein bestimmtes Topic beim Message Broker und wird von diesem mit allen Messages versorgt, die zu diesem
Topic gehören. Die Services müssen sich gegenseitig nicht kennen. Sie müssen nur wissen, dass es Nachrichten
mit bestimmten Topics und mit einer bestimmten Struktur gibt.

## Retry

Abhängig vom Message Broker bekommen wir ggf. einen Retry-Mechanismus umsonst dazu. Wenn Service 2 gerade ausgefallen ist,
wird der Message Broker so lange versuchen, die Nachricht zuzustellen, bis Service 2 irgendwann wieder verfügbar ist und
die Nachricht erhalten hat. Das Stichwort hier ist "guaranteed delivery".

## Lose Kopplung
Da Service 2 nicht in dem Moment erreichbar sein muss, zu dem Service 1 seine Anfrage sendet,
sind die Services nun nicht mehr so stark aneinander gekoppelt, was uns Flexibilität und Stabilität bringt.

Zu irgendeinem späteren Zeitpunkt muss Service 2 natürlich trotzdem wieder zur Verfügung stehen, um die Anfrage
zu verarbeiten.

## Ausfall des Message Brokers

Mit dem Message Broker haben wir ein zentrales Stück Infrastruktur in unsere Architektur eingebaut, das von
allen Services verwendet wird, die asynchron mit anderen Services sprechen möchten. Wenn der Message Broker
ausfällt, haben wir ein Problem... .

## Nachrichten-Schema

Alle Nachrichten beinhalten Informationen, die in einem bestimmten Schema, beispielsweise einer definierten JSON-Struktur, abgelegt sind.
Wenn das Format eines Nachrichtentyps sich nicht-abwärtskompatibel ändert, dann müssen alle
Nachrichten dieses Typs, die gerade noch im Message Broker liegen, entweder in das neue Format migriert werden, oder wir müssen
warten bis diese Nachrichten alle abgearbeitet sind, bevor wir die Format-Änderung einspielen.

Dies ist ein Widerspruch zur Idee der unabhängigen Deployments, einem der Ziele einer Microservice-Architektur.
Wir können das Problem umgehen, indem wir jederzeit nur noch abwärtskompatible Änderungen erlauben, was aber nicht
immer möglich sein wird.

## Two-Phase Commit

Üblicherweise entstehen Nachrichten aus einer Business-Transaktion heraus. Innerhalb dieser Transaktion möchten wir
unsere Business-Daten in der Datenbank speichern. Schlägt diese Datenbank-Transaktion fehl, möchten wir auch nicht, dass
eine Nachricht an den Message Broker versendet wird.

Dies kann mit Two-Phase Commit zwischen der Datenbank-Transaktion und der Message Broker Transaktion realisiert werden.
Hierbei werden beide Transaktionen erst committed, wenn sie "auf Probe" durchgeführt wurden.

Da das Two-Phase Commit Protokoll nicht ganz einfach ist, ist es häufig schwierig zu konfigurieren und noch
schwieriger zuverlässig zu testen.

# Transaktionales Messaging

Wir können das "einfache Messaging" erweitern, um einige der Mankos auszugleichen:

![Transaktionales Messaging](/assets/images/posts/communication-patterns/transactional-messaging.jpg)

Anstatt eine Nachricht direkt an den Message Broker zu schicken, speichern wir sie zunächst in der Datenbank von Service 1.
Von dort wird sie von einem regelmäßig laufenden Job wieder gelesen und an den Message Broker gesendet.
Auf der Empfängerseite können wir genau so vorgehen, und jede Nachricht erstmal in der Datenbank speichern, bevor sie
verarbeitet wird.

## Kein Two-Phase Commit erforderlich

Die Nachrichten werden mit derselben Datenbank-Transaktion in der Datenbank gespeichert, in der auch die Business-Logik
arbeitet. Wenn in der Business-Logik ein Fehler auftritt, rollt die Transaktion zurück und eine ggf. vorher gespeicherte
Nachricht wird ebenfalls zurückgerollt. Es kann also nicht mehr passieren, dass wir eine Nachricht versenden, wenn
die Business-Transaktion fehlgeschlagen ist.

## Message Broker darf ausfallen

Da wir die Nachrichten auf der Sender-Seite in einer Datenbank zwischenspeichern, kann der Message Broker zwischendurch
ausfallen, ohne dass Nachrichten verloren gehen. Sobald der Message Broker dann wieder erreichbar ist, werden die
Nachrichten aus der Datenbank an den Broker übermittelt (Retry).

## Komplexes Setup

Wir erkaufen uns die oben genannten Features natürlich mit erhöhter Komplexität. Schließlich müssen wir dafür sorgen,
dass Nachrichten in der Datenbank zwischengespeichert werden und wir müssen auf beiden Seiten Jobs bauen, die
auf Einträge in den Nachrichten-Tabellen reagieren, indem sie

* eine Nachricht zum Message Broker senden (auf der Sender-Seite)
* eine Nachricht in die eigentliche Verarbeitungslogik übergeben (auf der Empfängerseite).

# Zero-Payload Events

Das letzte Muster, das wir hier diskutieren wollen, ist dem oben beschriebenen "einfachen" Messaging
sehr ähnlich, allerdings reduzieren wir den Inhalt der Nachrichten, so dass wir keine großen Datenstrukturen
versenden, sondern lediglich Zeiger auf diese Daten (z. B. eine ID).

![Transaktionales Messaging](/assets/images/posts/communication-patterns/zero-payload-events.jpg)

Hier fungiert die Nachricht lediglich als ein Event, welches signalisiert, dass etwas passiert (z. B. "eine
Bestellung mit der ID 4711 wurde versandt"). Die Nachricht selbst beinhaltet also nur den Event-Typ (z. B. "orderShipped")
und die ID der Bestellung (4711). Wenn Service 2 an "orderShipped" Events interessiert ist, ruft er Service 1
mit der übergebenen ID auf, um sich die Bestell-Daten synchron zu holen.

## Dumb Pipe

Dieses Muster nimmt den Nachrichten den Großteil ihrer Struktur, da sie nur noch IDs beinhalten müssen. Dadurch
wird der Message Broker zu einer "Dumb Pipe", [wie es in Microservice-Architekturen wünschenswert ist](https://martinfowler.com/articles/microservices.html#SmartEndpointsAndDumbPipes).
Wir müssen nicht mehr so sehr darauf achten, die Struktur der Nachrichten nicht zu verändern, da sie kaum noch Struktur
haben. Natürlich müssen bei dem bisschen Struktur, was noch da ist, immer noch darauf achten, dass wir nur abwärtskompatible Änderungen
vornehmen, allerdings fällt das viel leichter.

## Kombination mit Transaktionalem Messaging

Kombinieren wir das Zero-Payload Muster mit dem weiter oben beschriebenen transaktionalen Messaging, bekommen
wir sowohl den Vorteil der Entkopplung vom Message Broker als auch einen Retry-Mechanismus, falls der Message Broker
mal ausfällt. Natürlich haben wir dadurch auch die kombinierte Komplexität beider Wege, da wir nun sowohl asynchrone
als auch synchrone Kommunikation umsetzen müssen.

# Wann nutze ich welches Kommunikationsmuster?

Wie schon erwähnt kommt es auf den Kontext an, welches Kommunikationsmuster in welchem Fall am meisten Sinn ergibt.
Schauen wir uns ein paar Indikatoren an, wann welches Muster sinnvoll sein kann.

**Synchrone Aufrufe** sind sinnvoll, wenn

* wir nur Daten abfragen wollen, ohne den Zustand zu verändern, denn dann brauchen wir uns keine Gedanken über
  verteilte Transaktionen und übergreifende Datenkonsistenz zu machen
* es nicht schlimm ist, wenn der Aufruf fehlschlägt, oder uns ein sicherer Retry-Mechanismus zur Verfügung steht.

**Einfaches Messaging** ist sinnvoll, wenn

* wir Zustands-verändernde Nachrichten versenden möchten
* die Nachricht auf jeden Fall ankommen muss (guaranteed delivery)
* komplexe Datenstrukturen in den Nachrichten uns nicht stören.

**Transaktionales Messaging** ist sinnvoll, wenn

* wir Zustands-verändernde Nachrichten nur dann versenden möchten, wenn die zugehörige Business-Transaktion auch
  erfolgreich war
* Two-Phase Commit keine Option ist
* wir der Verfügbarkeit des Message Brokers nicht vertrauen (wobei wir uns dann vielleicht nochmal nach einem
  anderen umschauen sollten...).

**Zero-Payload Events** sind sinnvoll, wenn

* wir Zustands-verändernde Events versenden möchten
* wir ansonsten eine sehr komplexe Nachrichtenstruktur hätten, die in der weiteren Entwicklung schwierig in
  abwärtskompatibler Art und Weise handhabbar wäre.




