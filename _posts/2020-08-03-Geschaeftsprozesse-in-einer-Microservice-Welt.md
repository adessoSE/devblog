---
layout: [post, post-xml]
title:  "Geschäftsprozesse in einer Microservice-Welt"
date:   2020-08-03 09:00
author_ids: [swindisch]
categories: [Architektur]
tags: [Microservice, Geschäftsprozesse, Orchestrierung, Choreographie]
---
Das Verständnis von Geschäftsprozessen und damit verbunden ihre fachliche sowie technische Umsetzung sind ein wichtiger Bestandteil bei der Analyse und Planung von Software-Systemen. Gerade in Bezug auf eine verteilte Architektur gibt es einige knifflige Herausforderungen, die beachtet werden müssen.
In diesem Blogpost schauen wir uns zwei gängige Architektur-Ansätze an. 

# Einleitung

Bei der Neuentwicklung eines modernen Software-Systems wird dessen Architektur meist auf Basis von verteilten Systemen modelliert.
Die Granularität der Verteilung des Systems kann von einzelnen Komponenten, über Teilsysteme auf Basis von Microservices,
bis zu Serverless Computing in der Cloud festgelegt werden.
Basierend auf fachlichen Anforderungen werden Domänen gebildet, Datenstrukturen geplant, modelliert und auf die Domänen verteilt.
Dabei werden gängige Methoden eingesetzt, beispielsweise das Domain-driven Design (DDD), die die Planung unterstützen und die Entscheidungsfindung vereinfachen.
Was passiert, wenn ein größerer Geschäftsprozess modelliert werden muss, der sich über mehrere Domänen erstreckt?
Wird nun der Domänenschnitt überdacht?
Die Datenstrukturen neu verteilt?
Was passiert, wenn mehrere Geschäftsprozesse geplant werden, die verschiedene Domänen gleichzeitig nutzen?

Hier haben sich in den letzten Jahren zwei Ansätze herauskristallisiert, die in den gängigen Foren und Auditorien teils kontrovers diskutiert werden.

Die Ansätze werden als
* **Orchestrierung von Geschäftsprozessen** und
* **Choreographie von Geschäftsprozessen** bezeichnet.

In diesem Blogpost werde ich die beiden Ansätze detaillierter beschreiben, die Vor- und Nachteile aufzählen und anonymisierte Fälle aus verschiedenen realen Projekten der letzten Jahre beschreiben.

Ziel ist es, einen neutralen Überblick über die Modellierung von Geschäftsprozessen in verteilten Systemen aufzuzeigen ohne eine eigene Bewertung abzugeben.

# Szenario

Wir werden in der frühen Phase des Projektes VuP (Verkauf und Produktion von Waren) der Firma Hersteller AG als Lösungsarchitekt in das Projekt aufgenommen und sollen als Schnittstelle zwischen dem Kunden, den Anforderungs-Managern und dem Entwicklungsteam vermitteln.
Durch das Enterprise-Architecture-Management (EAM) der Firma Hersteller AG wurde bereits vorgeschrieben,
dass das Projekt VuP auf einer verteilten Architektur mit einem Web-Frontend realisiert werden soll.
Die Systemarchitektur besteht dabei aus dem Web-Client, einem Backend mit Geschäftslogik, welches auf Microservices basiert, und einer SQL-Datenbank.
Die Anforderungs-Manager übergeben uns einen modellierten und vom Kunden bereits abgenommenen Geschäftsprozess, mit der Bitte,
fachliche Domänen zu planen und den Prozess abzubilden.

**Geschäftsprozess "Verkauf und Versand von Produkten"**

Das folgende Modell stellt eine vereinfachte Form des Geschäftsprozesses "Verkauf und Versand von Produkten" dar
und basiert auf einem überschaubar gehaltenen BPMN-Modell.

![Gesamtprozess](/assets/images/posts/Geschaeftsprozesse-in-einer-Microservice-Welt/Geschaeftsprozesse_Gesamt.png)

## Microservices

Als Grundlage für das weitere Verständnis dieses Artikels folgt eine kurze Beschreibung, was Microservices sind.
Einen tieferen Einstieg bietet hier unser Blogpost zu "[Microservices für nichttechnische Leute](https://www.adesso.de/de/news/blog/technische-dinge-fuer-nicht-technische-leute-teil-2.jsp)". Die Herausforderungen, die sich durch die Nutzung von Microservices ergeben haben wir auch bereits [in einem weiteren Blogpost dargestellt](https://www.adesso.de/de/news/blog/microservices-erzeugen-lediglich-andere-technische-schulden.jsp).

Microservices sind ein Architekturmuster, bei der eine Anwendung aus unabhängigen Diensten besteht,
die kleine Aufgaben erledigen, wobei "klein" immer eine Projektdefinition ist.
Diese Dienste kommunizieren beispielsweise entkoppelt (asynchron) miteinander und tauschen idealerweise nur die notwendigsten Informationen aus.
Im besten Fall kennen sie sich untereinander gar nicht, sondern versenden einfach nur Nachrichten. Wer Interesse an den Nachrichten hat, hört diesen zu.

Zusammengefasst, ist die Anweisung an die Planung eines Microservice:
"Erledige nur eine Aufgabe und erledige sie gut!"

Im Folgenden werden wir zur vereinfachten Darstellung den Begriff "Service" nutzen.

## Domain-driven Design

Domain-driven Design (DDD) ist ein Modellierungsansatz für Software-Systeme.
Er basiert darauf, die Teilsysteme (Domänen) auf Basis der Fachlichkeit zu zerlegen.
Die Fachlichkeit und die Fachlogik werden als Schwerpunkt bei der Modellierung betrachtet.

# Domänenschnitt

Wie zu Beginn beschrieben, gibt es verschiedene Ansätze, wie Domänen geschnitten werden können.
Der bekannteste ist Domain-driven Design. Leider lassen es reale Kunden und Projekte nicht immer zu,
perfekt nach dem Lehrbuch zu arbeiten, sodass hier mitunter interessante Konstrukte entstehen.
Dazu zählen beispielsweise ausgiebige, fast philosophische Diskussionen über Domänen-Schnitte auf Architektenebene.
Manchmal wird aber auch nach Anzahl der Teams oder nach Interesse bzw. "Gefühl" des Product-Owners geplant.

In unserem Projekt VuP entstehen am Ende der Planung die folgenden vier Domänen:

![Domaenenschnitt](/assets/images/posts/Geschaeftsprozesse-in-einer-Microservice-Welt/Domaenenschnitt.png)

# Orchestrierung von Geschäftsprozessen

Der Begriff Orchestrierung ist an Musikkonzerte angelehnt. Hier sitzen viele Musiker und haben nur eine Aufgabe: Zur richtigen Zeit ihr Instrument zu spielen.
Der Dirigent steht dabei im Mittelpunkt und gibt den Takt und die Geschwindigkeit vor. Alles hängt von seinem Können ab.

Bei der Orchestrierung von Geschäftsprozess wird das System nach diesem Ansatz realisiert.
Die einzelnen Services warten auf die Anweisung eines orchestrierenden (steuernden) Service.
Die anderen Services kennen sich gegenseitig nicht und wissen auch nicht wann sie etwas zu tun haben.

In dem zentralen Service wird der Geschäftsprozess modelliert und gesteuert. Wie die Umsetzung des Prozesses im Detail entschieden wird, ist projektabhängig.
Es ist möglich, den Prozess selbst zu entwickeln oder eine Workflow-Engine zu nutzen und den Prozess "nur" zu modellieren.
Der Einsatz einer Workflow-Engine ist von Vorteil, wenn Prozesse komplexer werden und Berechtigungen und Eskalationen abgebildet werden müssen.
Viele Systeme bringen diese Features bereits mit, sodass das Verhältnis von Programmierung und Konfiguration zu Gunsten der Konfiguration ausfällt.
Auch das Verwalten von verschiedenen Versionen eines Prozesses wird über eine solche Workflow-Engine abgebildet.
Damit ist die Veränderung eines Prozesses während des produktiven Einsatzes gemeint. Die Workflow-Engine definiert,
wie sich aktuelle Prozess-Instanzen verhalten, wenn beispielsweise Prozess-Schritte hinzugefügt oder aber auch verändert werden.

Eine Instanz des Prozesses, beispielsweise die Bestellung 4711 des Kunden Müller, wird zentral durch die Workflow-Engine des orchestrierenden Service gesteuert.
Die einzelnen Services werden über ihre Aktionen informiert und mit Daten versorgt. Die Teilbearbeitung findet dabei in den einzelnen Service statt,
die von dem orchestrierenden Service überwacht werden. Im Anschluss werden ihre Daten wieder an die Zentrale zurückgeschickt.

![Orchestrierung](/assets/images/posts/Geschaeftsprozesse-in-einer-Microservice-Welt/Orchestrierung.png)

# Choreographie von Geschäftsprozessen

Der Begriff Choreographie ist an ein Ballett-Ensemble angelehnt. Hier sitzen im Vorfeld alle Beteiligten (Tänzer, Designer, Musiker) zusammen,
planen und proben gemeinsam eine Choreographie. Dabei weiß jeder, was er zu tun hat, vor allem, wann er etwas zu tun hat.
Dies bedeutet, der Tänzer kennt seine Vorgänger und seine Nachfolger, weiß, wo er zu stehen hat und wann sein Einsatz ist.
Hier hängt alles vom Können aller Beteiligten ab.

Bei der Choreographie von Geschäftsprozessen wird das System nach diesem Ansatz realisiert. Der Geschäftsprozess wird zum Zeitpunkt der Modellierung in Teilprozesse zerlegt,
die dann auf die einzelnen Domänen verteilt werden. Dadurch kennen die Services sich gegenseitig, zumindest den Vorgänger,
der ihm Daten liefert und den Nachfolger, an den er Daten liefern muss. Jeder weiß genau, wann er was zu tun hat, es gibt keine zentrale Steuerung.
Auch hier muss die Umsetzung des Teilprozesses im Detail entschieden werden, jeder Service kann dies selbst entscheiden.
Natürlich sollte dem Anwender ein zentrales Bild gezeigt werden.

Eine Instanz des Prozesses, beispielsweise die Bestellung 4712 vom Kunden Meyer, wird von dem ersten Service angelegt,
mit Daten angereichert und an den nächsten Service übergeben. Jeder Teilprozess wird dabei in dem jeweiligen Service gestartet, ausgeführt und wieder beendet.
Jeder weitere nachfolgende Service startet seinen eigenen, vollkommen unabhängigen Teilprozess.

![Choreographie](/assets/images/posts/Geschaeftsprozesse-in-einer-Microservice-Welt/Choreographie.png)

# Fallbeispiel "Erweiterung"

Das Projekt VuP wird im ersten Meilenstein umgesetzt und geht erfolgreich an den Start.
Nach einiger Zeit gibt es die ersten Kundenbeschwerden, weil die Produkte in einem schlechten Zustand bei den Kunden ankommen.
Die Firma entscheidet sich, den Geschäftsprozess um einen eigenen Prozess "Verpackung" zu erweitern, der wiederum aus einzelnen Teilprozessen besteht.

Aktuell sieht der Prozess-Ausschnitt folgendermaßen aus:

![Geschaeftsprozesse_Teil1](/assets/images/posts/Geschaeftsprozesse-in-einer-Microservice-Welt/Geschaeftsprozesse_Teil1.png)

Zukünftig wird vor der Auslieferung und der Übergabe an die Faktura noch der Prozess Verpackung aufgerufen:

![Geschaeftsprozesse_Teil2](/assets/images/posts/Geschaeftsprozesse-in-einer-Microservice-Welt/Geschaeftsprozesse_Teil2.png)

Eine Lösung im Bereich der Orchestrierung besteht aus folgenden Schritten:
* Es wird eine neue Domäne Verpackung als Service implementiert.
* Der Geschäftsprozess im orchestrierenden Service wird erweitert, sodass der neue Prozess technisch umgesetzt ist.
* Die Kommunikation zwischen Verpackung und Orchestrierung wird aufgesetzt.

![Orchestrierung_Neu](/assets/images/posts/Geschaeftsprozesse-in-einer-Microservice-Welt/Orchestrierung_neu.png)

Eine Lösung im Bereich der Choreographie besteht aus folgenden Schritten:
* Es wird eine neue Domäne Verpackung als Service implementiert.
* Der Service Verpackung kennt seinen Vorgänger Produktion und seine Nachfolger Kunden und Faktura.
* Die Kommunikation zwischen allen beteiligten Services wird aufgesetzt.
* Der rote Pfeil im Schaubild zeigt einen Fehler, der erst nach dem Go-Live auffiel: Es wurde vergessen, die Verbindung von Produktion und Faktura zu kappen, so dass dem Kunden pro Bestellung zwei Rechnungen geschickt wurden. Ein Versand wurde aus dem neuen Verpackungs-Service angestoßen. Ein weiterer Versand aus dem alten Produktions-Service.

![Choreographie_Neu](/assets/images/posts/Geschaeftsprozesse-in-einer-Microservice-Welt/Choreographie_neu.png)

# Fallbeispiel "Status"

Das Projekt VuP wird in einem weiteren Meilenstein umgesetzt und geht erfolgreich mit der neuen Version an den Start.
Aus den Erfahrungen des Tagesgeschäftes erkennt die Firma, dass manchmal Änderungen des Kunden an seiner Bestellung nachgetragen werden müssen.
Deshalb werden an das Projekt folgende zwei abhängige Anforderungen übergeben:
* Die Produktion darf nur Bestellungen korrigieren, wenn die Faktura diese noch nicht freigegeben hat!
* Die Faktura darf Bestellungen nur freigeben, wenn diese nicht gleichzeitig wieder zur Korrektur in der Produktion sind!

D.h. hier haben wir eine bidirektionale Abhängigkeit zwischen zwei Teilprozessen, wie folgt einfach dargestellt.

![Geschaeftsprozesse_Status](/assets/images/posts/Geschaeftsprozesse-in-einer-Microservice-Welt/Geschaeftsprozesse_Status.png)

Eine Lösung im Bereich der Orchestrierung besteht aus folgenden Schritten:
* Der Geschäftsprozess wird um eine Statuskontrolle ähnlich dem Schaubild erweitert. Dies bedeutet, dass nachdem ein Bearbeiter den Vorgang geöffnet hat, der Vorgang für die anderen Abteilungen gesperrt werden muss.
* Da der Prozess zentral verwaltet wird, kann hier der Status für alle Anwender, die Zugriff auf den Prozess haben, sichtbar dargestellt werden, beispielsweise "In Bearbeitung in der Abteilung Faktura".

Eine Lösung im Bereich der Choreographie besteht aus folgenden Schritten:
* Hier müssen zwei Teilprozesse und damit zwei Services direkt miteinander kommunizieren.
* Die erste Möglichkeit ist, die Kommunikation findet weiterhin asynchron über Nachrichten statt. Es kann dabei aber das Risiko bestehen, dass beide Anwender ihren Teilprozess gleichzeitig starten und dabei die Status-Nachrichten zu spät auf der anderen Seite ankommen.
* Die zweite Möglichkeit ist, die Kommunikation in diesem Fall synchron stattfinden zu lassen. Die Services können sich so direkt gegenseitig aufrufen und den Status übergeben.

# Fallbeispiel "Korrektur"

Das Projekt VuP wird in einem weiteren Meilenstein umgesetzt und geht erfolgreich mit der neuen Version an den Start.
Die Faktura der Firma stellt leider fest, dass der Vertrieb bei der Erfassung regelmäßig Fehler macht,
aber auch die Qualität der Produktion nicht dem Standard entspricht. Es wird die Entscheidung getroffen,
dass Fehler beim Verursacher behoben werden müssen und nicht ausschließlich in der Faktura.
Dies bedeutet, dass die Faktura Änderungen oder auch Stornos von Kunden nur noch erfasst und an die beiden Abteilungen zur Korrektur weiterleitet.

Exemplarisch könnte eine Prozessanpassung folgendermaßen aussehen:

![Geschaeftsprozesse_Korrektur](/assets/images/posts/Geschaeftsprozesse-in-einer-Microservice-Welt/Geschaeftsprozesse_Korrektur.png)

Eine Lösung im Bereich der Orchestrierung besteht aus folgenden Schritten:
* Der Geschäftsprozess wird um die Erfassung von Stornos und Korrekturen erweitert.
* Der Geschäftsprozess wird um zwei Teilprozesse erweitert, die unabhängig voneinander und gleichzeitig stattfinden können.
* Für die Anwender der jeweiligen Abteilung werden Bearbeitungsdialoge erstellt, die den Teilprozess aus der jeweiligen Sicht darstellen.
* Am Ende der Teilprozesse werden diese zentral wieder zum Hauptprozess zusammengefügt und die Bearbeitung findet wie gehabt statt.
* Die Steuerung der Parallelität und das Zusammenführen der Teilvorgänge werden von der Workflow-Engine übernommen.

Eine Lösung im Bereich der Choreographie besteht aus folgenden Schritten:
* Die Domäne Faktura wird um die Erfassung von Stornos und Korrekturen erweitert.
* Die beiden beteiligten Services "Kunde" und "Produktion" müssen die Kommunikation mit der Faktura Domäne anpassen und die Daten aus der Korrektur-Erfassung entgegennehmen.
* Da es sich hier um eine verteilte und asynchrone Kommunikation handelt, muss ein Service-übergreifender Schlüssel ausgetauscht werden, mit dem die Prozess-Instanz eindeutig identifiziert werden kann, beispielsweise eine Transaktions-ID oder Vorgangs-ID.
* Am Ende der Teilprozesse muss ein Service auf die Daten der beiden anderen Services warten, bis von beiden eine Rückmeldung geschickt wird, diese dann konsolidieren und weiterverarbeiten.

# Vorteile vs. Nachteile aus Sicht der Geschäftsprozess-Modellierung

![Vor-und-Nachteile.png](/assets/images/posts/Geschaeftsprozesse-in-einer-Microservice-Welt/Vor-und-Nachteile.png)

# Zusammenfassung

Orchestrierung und Choreographie sind zwei fantastische Architektur-Muster mit der die Interkation und Kommunikation zwischen verteilten Systemen gesteuert werden kann.
Der richtige Einsatz muss innerhalb jedes Projektes neu überdacht werden. Einen "Ansatz-passt-für-alles" gibt es leider nicht.

* **Microservices sind EINE richtige Architektur-Entscheidung!**
* **Die Architektur sollte durch die Anforderungen des Kunden abgeleitet werden!**
* **Choreographie von Geschäftsprozessen ist sinnvoll!**
* **Orchestrierung von Geschäftsprozessen ist sinnvoll!**
* **Workflow-Systeme sind nicht böse!**
* **Zu Beginn eines Projektes sollten alle Aspekte besprochen und mehrere Lösungsalternativen objektiv bewertet werden!**
* **Bei agilen Projekten in Sprints planen aber den Marathon sehen!**
* **Die schwarz-weißen Denkmuster abschalten!**
