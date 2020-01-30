---
layout: [post, post-xml]                                                # Pflichtfeld. Nicht ändern!
title:  "Die End to End Testautomatisierung: wie geht das denn? (Teil 1)"          # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2020-01-25 09:00                                                # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2020-01-25 09:00
author: andernach                                                       # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: [Branchen & People]                                         # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Testing, Softwarequalitätssicherung, Oberflächentests]           # Optional.
---

Nach den allgemeinen Prinzipien des Softwaretestens sollten die Tests die Anwesenheit von Fehlern anzeigen.
Keine Fehler zu finden bedeutet, dass ein brauchbares System vorliegt<sup>1</sup>, das die Akzeptanzkriterien erfüllt und das System zur Abnahme bereit ist.
Die Erfüllung dieser Akzeptanzkriterien sollen über den gesamten Entwicklungszeitraum wiederholt getestet.

Hierbei gibt es verschiedene eingesetzte Prüftechniken und Testverfahren wie z.B. das manuelle Testen oder auch das sogenannte End to End Testing (E2E), die die Anwesenheit von Fehlern anzeigen und die angemessene Erfüllung der Anforderungen aus einer funktionalen Sicht der Anwender sicherstellen.

Das E2E Testing bietet die Möglichkeit, dass das gesamte Softwareprodukt anhand produktionsähnliche Szenarien vom Anfang bis zum Ende automatisiert getestet wird, um sicherzustellen, dass sich der Anwendungsfluss wie erwartet verhält.

Somit ist das E2E Testautomatisierung ein benutzernahes Testvorgehen und eine sehr gute Alternative zum manuellen testen, wenn das E2E Testing adäquat umgesetzt ist.

Im Vergleich zum manuellen Testen können automatisierten E2E Tests automatisiert und wiederholt ausgeführt werden, erfordern keine geschulten Testern oder menschliches Eingreifen und lassen sich im gesamten Entwicklungsprozess des Softwareprodukts besser integrieren.

Es gibt jedoch viele die meinen, dass eine gute End to End Testabdeckung in der Praxis kaum möglich sei und die Automatisierung der Testfälle viel Zeit in Anspruch nehme.
Solche Aussagen können mit einem gut erarbeiteten Konzept relativiert werden.

Im Folgenden werden Aspekte dargestellt, die im Rahmen der Realisierung eines umfangreichen Software-Projekts ausgearbeitet wurden.
Wir werden uns mit praxisnahen technischen und organisatorische Guidelines vertraut machen und bewahrten Werkzeugen und Vorgehensweisen kennenlernen bzw. ans Rampenlicht bringen, die die Entwicklung und die Pflege von automatisierten E2E Tests erleichtert und vereinfacht.

Die Guidelines sind möglichst von einander getrennt und bieten in Gesamtheit eine gute Basis für das automatisierte Testen.
Somit können sie sowohl am Projektanfang als auch in einem laufenden Projekt umgesetzt werden.

Wir werden uns mit einer Softwarelösung beschäftigen, die aus einer Bedienoberfläche (fortan die Anwendung) und den Backendsysteme (fortan Umgebung) besteht.
Die Anwendungsentwicklung und die Umgebungsentwicklung sind wahrscheinlich voneinander losgelöst. 


# Testaufbau

Eine gut durchgedachte Struktur ist für die Entwicklung eines Tests notwendig.
Eine Struktur, die die grafische Benutzeroberfläche (UI) Darstellung, UI Logik und Testdaten voneinander trennt, erleichtert die parallele Entwicklung und macht einen Code wesentlich wartbarer, als einen Boiler Plate-Code (Die Codeabschnitte, die an vielen Stellen in mehr oder weniger unveränderter Forum benötigt werden).

Denn ein Boiler Plate-Code könnte auf Anhieb durch das Kopieren und Hinzufügen von Codeabschnitten schnelle Ergebnisse liefern, würde aber auf Dauer kostspieliger in der Wartung sein. 
Beispielhaft wird im Folgenden eine einfache Login Seite mit zwei Textfeldern für Nutzername und Passwort sowie einem Button für den Login und ein Button für die Registrierung getestet.
![Vorgeschlagene Struktur](/assets/images/posts/konzept-fuer-die-e2e-testautomatisierung/struktur.png)      
Die Struktur besteht im Einzelnen aus: 	
* __UI__: Die UI Darstellung wird mit Hilfe einer Abstrakten Klasse (AbstractPage) als Oberklasse realisiert, von der alle Anwendungsseiten erben.
Eine Klasse (Die Klasse für den Test der Login Seite in unserem Beispiel) besteht aus: UI Elementen (wie die Eingabefelder für den Benutzername und Password, Bestätigungstaste Login) und möglichen Interaktionen mit den Elementen (z.B. Bestätigungstaste anklicken).
Diese Interaktionen werden durch Methoden für andere Klassen ( Testschritte ) zur Verfügung gestellt. 
* __Testschritte__: Die einzelnen Testschritte werden in Klassen gegliedert.
Die Klassen interagieren mit der UI und stellen Methoden zur Verfügung, die komplette Prozesse oder Teilprozesse wie z.B. das Befüllen eines Formulars für die Eingabe von Login Daten anbieten.
Eine Testschritte-Klasse kann in unserem Beispiel die Methode (Anmelden als) anbieten.
Die zur Verfügung gestellten Methoden können dann in den Testfällen benutzt und mit Testdaten befüllt werden.
* __Testdata__: Einzelne Testdaten für die Testfälle können in gesonderten Klassen gepflegt werden.
Pro Testfall sollte eine Klasse mit Testdaten vorhanden sein.
Testdaten können voneinander erben.
Das ist sinvoll, wenn verschiedene Dialoge im Software-Produkt den gleichen Teil für die Eingabe von Adressen haben.
Hier wird eine Klasse (AbstractAddressData) mit initialen Daten (Straße, Ort...) erstellt, von der andere Klassen erben.
Wenn spezifische Testdaten für die Adresse gewünscht sind, dann kann die TestData-Klasse für den bestimmten Testfall die Daten überschreiben.
* __Testfälle__: Das Zusammenspiel zwischen Testdaten und Testschritten, dem Input und der Validierung des Outputs, findet in einem Testfall statt.
In diesem Ordner befinden sich die Testfälle so sortiert, wie die Anwendung die Prozesse in Einstiegspunkte (bspw. Menüs) aufteilt.
So können Testfälle für einzelne Bereiche (bspw. Stammdaten) eine Testsuite (Eine Sammlung von Testfällen die z.B. eine fachliche oder technische Gemeinsamkeit haben) bilden.
* __Utils__ : Hier sind Hilfsklassen zu finden, die z.B. die Anwendung starten und schließen.


# Object Orientierte Programmierung im Hinterkopf behalten

Die Einführung von OOP Konzepten, insbesondere Klassen, Vererbung und Polymorphie, erhöht nicht nur die Wiederverwendbarkeit, sondern auch die Wartbarkeit und die Lesbarkeit des Testfall-Codes.
Durch die Umsetzung dieser Denkweise kann der Entwickler im Allgemeinen die Testfälle effizienter automatisieren und der Testmanager die Aufgaben auf die Entwickler besser parallelisieren. 

Die Umsetzung von Page-Object Pattern  ist empfehlenswert.
Eine Page-Objekt Klasse umschließt eine HTML-Seite mit einer anwendungsspezifischen API, sodass es mit den UI-Elementen interagieren kann, ohne direkt den HTML-Code zu benutzen.
Diese Page-Object Klasse enthält:

•	Eine passende Benennung für das UI-Element ```loginButton= ```.
•	Und einen Zugreifer (oder Selektor): Jedes UI Elements hat eigene Merkmale, die es von anderen UI Elementen hervorhebt.
Die Merkmalen können beispielsweise die Attribute (Id oder data-id), die Elementpositionierung im DOM Baum einer HTML-Seite, bestimmte angewendete CSS-Klassen oder auch ein Text sein. 
In diesem Artikel die Abfrage gemeint, die das Element auswählen lässt. 

Weitere Informationen weden im zweiten Blog-Eintrag dieser Serie dargestellt.

Die investierte Zeit der Modulierung und Benutzung von *Page-Object Pattern* lohnt sich spätestens dann, wenn eine UI Änderung stattfindet oder bestimmte zentrale Datensätze angepasst werden sollen.
Anstatt auf verschiedenen Stellen eine Anpassung vorzunehmen, genügt meistens die Änderung an einer Stelle.

Die Anwendung nützlicher Werkzeuge wie Entwurfsmustern bieten erprobte Lösungen für wiederkehrende Probleme.
Beispielsweise durch das Benutzen von Fluent Interface können die Testdaten als Objekte einer geeigneten Methode als ein Parameter anstatt viele Parameter übergeben werden.
Das erhöht die Codelesbarkeit.

Andere Dateien wie *TestData.ts* und *TestFall.ts* können auch über ein geeignetes Template erzeugt werden.
Der Vorteil eines Code Generators (mehr dazu im dritten Teil) nebst Zeitersparnis ist, dass die generierte Klassen (TestData, TestFall, Page-Object Klasse…) einheitlich aufgebaut sind und sich ähneln.

Die Einarbeitung neuer KollegInnen wird dadurch erleichtert.
Der Entwickler kann sich auf das Wesentliche konzentrieren und die hierdurch gesparte Zeit kann in die Implementierung weiterer Funktionalitäten oder die Ausarbeitung weiterer Testfälle investiert werden. 


# Testautomatisierung: wer sind die Akteure und was ist zu automatisieren?

Sowohl der Hauptstrang eines Prozesses einer umgesetzten Anforderung, als auch die Abweichungen, sollten getestet werden. 
Durch den Austausch zwischen dem Product Owner, dem Testmanager und dem Entwicklungsteam wird entschieden, was für ein Testtyp sich am besten für die Umsetzungsüberprüfung einer Anforderung eignet. 

Ein Happy Path Testfall (Das einfachste Szenario, in welcher ein Codeabschnitt funktionieren soll, ohne dass Ausnahmen oder Fehlerzustände eintreten.
siehe [Testpfad](https://de.wikipedia.org/wiki/Testpfad)) sollte jedoch auch als ein E2E Test automatisiert werden.
Durch die Abnahme der Story werden wahrscheinlich Verhaltensabweichungen gefunden.
Wenn sich solche als Fehler erweisen und diese behoben worden sind, kann die Beseitigung des Fehlers durch einen E2E Testfall geprüft werden. 


# Ausblick

Der hier dargelegte Bolg-Beitrag soll als Einstieg in das Thema E2E Testautomatisierung dienen.
In den folgenden Bolg-Beiträgen wird die Testausführung beschrieben und es werden Herausforderungen mit zugehörigen Lösungsansätzen vorgestellt.
   
   
# Quellen

1. Basiswissen Softwaretest, Spillner und Linz.
