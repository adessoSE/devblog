---
layout: [post, post-xml]              # Pflichtfeld. Nicht ändern!
title:  "Angular, React, Vue.js - Wie wähle ich das passende Frontend-Framework aus?"     # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2019-07-19 15:00              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2019-01-30             # Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author: frederikschlemmer                    # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: [Softwareentwicklung] # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Angular, React, Vue.js, SPA]         # Optional.
---

Wie wird heutzutage die Fragestellung beantwortet mit welcher Technologie eine Webanwendung umgesetzt werden soll? Angular, React oder Vue.js?
Die Entwicklung von Webanwendungen in Form von Multi Page Applications (MPAs) mittels der Beschreibungssprachen HTML, CSS und JavaScript wird zunehmend durch die steigende Anzahl von Single Page Application (SPA) Frameworks verdrängt.
Dieser Trend hält nun bereits seit 10 Jahren an, wodurch eine Vielzahl von verschiedenen Frameworks mit unterschiedlichen Ansätzen entstanden ist.
So unterschiedlich die Ansätze der Frameworks untereinander sind, ist das gemeinsame Ziel doch das selbe: *Performante Webanwendungen mit einer guten User Experience.*

# Was ist eine Single Page Application überhaupt?

Viele namhafte Firmen haben bereits einen Umstieg zu den SPA durchgeführt. 
Nutzer von Netflix, Paypal oder Google Maps benutzen bereits täglich Single Page Applikationen. 
**Aber was ist überhaupt eine SPA und welche Vorteile bietet diese?**

Zum allgemeinen Verständnis des Begriffes Single Page Application bietet Dr. Siepermann von der TU Dortmund eine treffende Definition:

*... eine webbasierte Anwendung oder Website, die statt wie üblich auf mehrere Seiten verteilt, komplett auf einer Seite realisiert ist, um den Nutzern den Eindruck und das Gefühl einer Desktop-Anwendung zu vermitteln. Die Inhalte der Anwendung werden entweder zu Beginn einmalig geladen, oder dynamisch während der Laufzeit, sobald Nutzer eine Aktion ausführen möchten.*

Aus dieser Definition werden die Schlüsselelemente einer SPA deutlich. 
Die Weboberfläche bietet einen ähnlichen Funktions- und Komplexitätsumfang wie eine Desktop-Anwendung, wodurch dem Nutzer vermittelt wird, eine vollwertige Desktop-Anwendung anstelle einer einfachen Webanwendung zu benutzen.

Durch den Anstieg der Komplexität müssen SPA unausweichlich eine Form der Modularisierung unterstützen. 
Die komplette Anwendung kann mithilfe von individuellen Komponenten realisiert werden, wodurch eine erhöhte Wartbarkeit und Wiederverwendbarkeit der Funktionalitäten erreicht werden.

Diese individuellen Komponenten ermöglichen ein dynamisches Nachladen der Inhalte während der Laufzeit.
Entweder können diese Komponenten ein Update vollziehen und neue Werte annehmen oder können vollständig ersetzt werden.
Diese Aktualisierungsmöglichkeiten benötigen keine neue Initialisierung der Seite und bieten dadurch eine verbesserte User Experience.

Des Weiteren kann mit der Anwendung uneingeschränkt interagiert werden und Aktionen ausgelöst werden.
Die Aktionen werden wie bei einer Desktop-Anwendung in Echtzeit verarbeitet und die Oberfläche reagiert dynamisch auf das Ereignis.

Aus der Beschreibung werden schon einige Vorteile gegenüber MPAs deutlich, was aber bedeutet das nun konkret?

Zum besseren Verständnis sollen im Folgenden ein paar Vorteile genauer erläutert werden:

**1. Wartbarkeit des Codes**
   
Durch die ansteigende Komplexität der Webanwendungen ist die Wartbarkeit des Codes ein wichtiges Kriterium.
Die Frameworks versuchen dieses Problem mithilfe von verschiedenen Entwurfsmustern zu beheben.
Beispielsweise benutzt das Framework Vue.js eine MVVM-Architektur. Diese Abkürzung steht für Model, View und View-Model.
Das Model beinhaltet die Logik sowie die Daten der Anwendung.
Die View spiegelt die visuelle Repräsentation der Anwendung dar, welcher der Nutzer zur Interaktion nutzt.
Das View-Model bildet das Bindemittel der vorherigen Schichten und beinhaltet die Logik und Daten der View. Diese Schicht reagiert auf die Eingaben des Nutzers.

Durch diese strikte Trennung von den einzelnen Komponenten der Anwendung entstehen keine Abhängigkeiten zwischen diesen.
Das Resultat dieser Entwurfsmuster ist ein strukturierter und wartbarer Programmcode.

**2. Modularität**
   
Eine Webanwendung besteht grundlegend aus einem Client und einem Server.
Das grundlegende Prinzip beruht darauf, dass der Client verschiedene Anfragen an den Server stellt und darauf eine Antwort erhält.
Allerdings beinhaltet bei einer SPA die Antwort des Servers nicht eine HTML-Datei, sondern strukturiert die Daten mit einem Format wie JSON.
Dadurch findet eine Entkopplung der serverseitigen Implementierung bzw. Anwendungslogik und der Anzeige beim Client statt.
Der Client muss nur wissen, welche HTTP-Abfragen für die benötigten Informationen zur Verfügung stehen.
Hierdurch wird es ermöglicht eine SPA im Webbrowser und eine mobile Anwendung von demselben Server mit Informationen zu versorgen.

**3. Verbesserte User Experience**

Eine SPA bietet eine enorm verbesserte User Experience im Vergleich zu MPA.
Dies beruht auf dem flüssigen und reaktionsschnellen Verhalten einer SPA.
Das Nutzererlebnis wird nicht mehr durch das typische Neuladen und Rendering der Anwendung gestört.
Darüber hinaus kann die Anwendung während einer Abfrage mit erhöhter Bearbeitungsdauer dem Nutzer signifikante Informationen über den Status vermitteln.

# Die Populärsten SPA-Frameworks

Die Auswahl der Frameworks, welche in diesem Blogpost thematisiert werden, wurde anhand der Popularität der Frameworks getätigt. Mittels Google Trends wurde die Anzahl der Websuchen im Zeitraum der letzten 12 Monate für die Frameworks Angular, React, Vue.js und Ember.js in Deutschland analysiert. Das Ergebnis von Google Trends ist in der nachfolgenden Abbildung dargestellt:

![Statistik zu Websuchen mittels Google](/assets/images/posts/Die-Qual-der-Wahl-bei-Single-Page-Application-Frameworks/trends.png)

In diesem Graphen ist die Anzahl der Websuchen der einzelnen Frameworks vom 27.05.2018 bis zum 25.05.2019 visuell dargestellt.
Angular und React setzen sich von Vue.js und Ember.js deutlich ab.

Anhand dieser Trends wird erkennbar, dass zum aktuellen Zeitpunkt die Frameworks Angular, React und Vue.js zu den führenden Frameworks zählen.

## Angular

Angular stellt aktuell eines der populärsten SPA-Frameworks dar. 
Es hat zum Zeitpunkt der Ausarbeitung auf GitHub eine Gesamtanzahl von 43.000 Sternen.
Angular ist die Neufassung des vorherigen Frameworks AngularJS und wird durch Google entwickelt und ist als Open-Source-Software unter der MIT-Lizenz verfügbar.

Angular bezeichnet sich selbst nicht als Framework, sondern als Plattform zur Erstellung von Webanwendungen.
Entwickelt wurde es basierend auf TypeScript, wodurch eine standardmäßige Entwicklung ebenfalls in dieser Sprache stattfindet.
Die Bezeichnung als Plattform entstammt dem Grundgedanken, dass Angular-Anwendungen verschiedene Plattformen wie Smartphone, Desktop oder Fernseher bedienen können.

## React

Auf die gleiche Stufe wie Angular stellt sich React.
Aktuell schafft es React auf GitHub auf eine Gesamtanzahl von 116.000 Sternen.
Veröffentlicht wurde React im Jahr 2013 und wird entwickelt durch Facebook.
Es ist ebenfalls als Open-Source-Software unter der MIT-Lizenz veröffentlicht.

Die Bezeichnung als "Framework" ist bei React ebenfalls nicht korrekt. 
React versteht sich als View-Bibliothek, da es in Bezug auf das Model-View-Controller Prinzip nur die View widerspiegelt. 
Zur Entwicklung wurde JavaScript verwendet, allerdings ist die Nutzung von der JavaScript-Erweiterung JSX (JavaScript XML) empfohlen seitens React.
Durch die Verwendung von JSX wird eine Kombination von JavaScript und HTML produziert.
Hierdurch entstehen Komponenten, welche sowohl Markup als auch die Logik beinhalten.

## Vue.js

Aktuell kann Vue.js im deutschsprachigen Raum noch nicht mit der Popularität von Angular oder React mithalten, allerdings erfährt dieses Framework aktuell einen verstärkten Zuspruch seitens der Community.
Deutlich wird dieser Zuspruch durch die 120.000 Sternen auf GitHub. Im Vergleich zu Angular spiegelt das die dreifache Menge wider. React kann sich ebenfalls in diesem Zahlenbereich halten.

Laut Google Trends (siehe Graph oben) ist Vue.js im deutschsprachigen Raum dennoch nicht so populär wie Angular oder React.
Mit einem Blick auf den asiatischen Raum hingegen stellt Vue.js aktuell das gefragteste Framework dar, woraus die hohe Anzahl an Sternen auf Github resultiert.

Veröffentlicht wurde das Framework im Jahr 2014 durch den ehemaligen Google-Mitarbeiter Evan You als Open-Source-Software unter der MIT-Lizenz. 
Genauso wie React wurde Vue.js mittels JavaScript umgesetzt, allerdings bietet es auch eine Unterstützung für TypeScript an.

Vue.js bietet dem Nutzer passend zum Anwendungszweck Skalierungsmöglichkeiten an. Es kann zwischen einer leichtgewichtigen Bibliothek oder einem gesamten Framework ausgewählt werden.
Die Bibliothek bietet ähnlich wie React nur Funktionalität für die Ansichtsebene und kann daher zur Integration in bestehende Projekte genutzt werden.

# Vergleichskriterien

Der Vergleich wurde zunächst mit einer Evaluation von groben Themengebieten begonnen.
Diese wurde basierend auf literarischen Quellen durchgeführt und brachte folgende Themengebiete als Ergebnis hervor:


* **Sicherheit:** Durch den Anstieg der Funktionalitäten werden vertrauliche Informationen durch Webanwendungen gespeichert. Hierdurch steigt die Anzahl der Angriffe auf solche Systeme enorm an. Ebenfalls wird die Top 10 der Sicherheitsrisiken des Open Web Application Security Project (OWASP) berücksichtigt.
* **Modularität:** Ein erhöhter Funktionsumfang resultiert in einer komplexeren Anwendung, wodurch die Modularität einen wichtigen Aspekt für moderne Webanwendungen widerspiegelt. Es sollte eine Unterteilung in kleinere isolierte Komponenten ermöglicht werden, damit diese in späteren Anwendungen wiederverwendet werden können.
* **Performance:** Die User Experience kann gravierend durch die Performance beeinträchtigt werden. Des Weiteren sollten unnötige Datentransfers reduziert werden.
* **Testbarkeit:** Testbasierte Entwicklung ist heutzutage ein verbreitetes Vorgehen. Eine Anwendung muss durch automatische Tests ausreichend auf ihre Richtigkeit durchgetestet werden.
* **Wartbarkeit und Zukunftssicherheit:** Eine hohe Wartbarkeit eines Projektes ist für die Zukunft entscheidend. Außerdem sollte das verwendete Framework stetig weiterentwickelt werden.
* **Plattformunabhängigkeit und Kompatibilität:** Anwendungen müssen heutzutage auf mobilen Geräten sowie in Browsern mit identischem Funktionsumfang funktionieren.
* **Popularität und verfügbares Know-How:** Eine erhöhte Popularität bietet eine größere Community. Dadurch ist ein breites verfügbares Know-How durch Foren oder Blogs verfügbar.
* **Einfachheit und Benutzerfreundlichkeit:** Das Framework sollte den Entwickler in dem Entstehungsprozess der Anwendung unterstützen. Außerdem sollten standardisierte Abläufe vorhanden sein.
* **Eignung zur Umsetzung von Lean- und Fat-SPAs:** Eine flexible Anpassung zur Umsetzung von Lean oder Fat-SPAs sollte ermöglicht werden. Hierdurch werden kleinere Anwendungen nicht durch ein schwergewichtiges Framework unnötig überladen.

Passend zu diesen einzelnen Themengebieten wurden Leitfragen formuliert, welche auf spezifische Aspekte des Themas eingehen. 
Dadurch wurden die Frameworks in diesem Vergleich mit 62 verschiedenen Kriterien untersucht.
Hierdurch sollte eine Abdeckung aller relevanten Merkmale der Frameworks gegeben sein.

# Vergleich von SPA-Frameworks mittels FrameworkBuddy

Die gewonnenen Ergebnisse über die Frameworks wurden in einer Anwendung namens *FrameworkBuddy* visuell zugänglich gemacht. 
Veröffentlicht wurde diese Anwendung als Open-Source-Software [auf GitHub](https://github.com/FrederikSchlemmer/FrameworkBuddy).

In dieser Anwendung kann der Nutzer die Leitfragen aus dem Vergleich passend zu seinem Projekt gewichten.
Hierdurch wird das Kriterium in dem Vergleich einbezogen oder vernachlässigt.
Der Fragebogen ist beispielhaft in der Abbildung anhand von einer Leitfrage dargestellt.

![Darstellung einer Leitfrage in der Anwendung](/assets/images/posts/Die-Qual-der-Wahl-bei-Single-Page-Application-Frameworks/fragebogen.png)

Ergänzend zu der theoretischen Sichtweise auf die Kriterien wurde intern bei adesso eine Umfrage mit erfahrenen Entwicklern durchgeführt, welche bereits Erfahrung mit den Frameworks Angular, React oder Vue.js besitzen.
Hieraus ergab sich eine Gewichtung der jeweiligen Leitfragen im Praxiskontext.
Dadurch wird das ermittelte Ergebnis durch die Anwendung praxisbezogen und optimiert.

Das Ergebnis sollte als Vorschlag angesehen werden, da die Auswahl noch weitere Faktoren zur Entscheidung einbeziehen sollte.

# Welches Framework sollte man nun verwenden?

Nach einem genauen Vergleich der drei Frameworks stellt sich nun die Frage, welches Framework nun die richtige Wahl sein könnte.
Wirft man einen ein Blick auf die Anwendung, fällt auf, dass es von dem jeweiligen Anwendungsfall abhängig ist und weitere nicht-technische Faktoren einbezogen werden sollten.

Die richtige Auswahl des Frameworks hängt durch die unterschiedlichen Ansätze der Frameworks nicht nur ganz von der Technik, sondern auch wesentlich vom Entwicklungsteam ab.
Teams mit einem starken Java-Hintergrund würden sich in dem Umfeld von Angular mit den vielen Strukturen durch TypeScript wohler fühlen. 
Teams mit einem starken JavaScript-Hintergrund würden in Angular die gewohnte Freiheiten und flexiblen Möglichkeiten vermissen. 
Daher würden sich hier React oder Vue.js eher anbieten.

