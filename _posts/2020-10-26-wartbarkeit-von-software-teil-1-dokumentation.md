---
layout: 		[post, post-xml]             								# Pflichtfeld. Nicht ändern!
title:  		"Wartbarkeit von Software – Teil 1: Dokumentation"         	# Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   		2020-10-23 10:25              								# Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 	2020-10-23             										# Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author: 		abetla                       								# Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: 	[Softwareentwicklung]                    					# Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: 			[Wartbarkeit, Dokumentation]         						# Bitte auf Großschreibung achten.
---


Nach dem Ende eines Entwicklungsprojektes und dem erfolgreichen Go-Live der entwickelten Software ist deren Lebenszyklus noch lange nicht beendet. 
Im Gegenteil, nun muss sie sich im realen Einsatz bewähren.

Da komplexe Softwareanwendungen nie ganz fehlerfrei sind, Software altert und sich Umstände und Anforderungen im Laufe des Lebenszyklus ändern können, werden viele Softwareprojekte nach dem Abschluss des initialen Entwicklungsprojektes durch ein Wartungsteam betreut. 
Im Rahmen der Wartung werden Fehler behoben, Change Requests umgesetzt, Komponenten aktualisiert aber auch umfangreiche Weiterentwicklungen durchgeführt.

Oft wird die Wartung von einem anderen Team als dem ursprünglichen Entwicklungsteam geleistet. 
Manchmal fällt diese Aufgabe auch einem ganz anderen Dienstleister zu.

Um die Transition von der Entwicklung in die Wartung möglichst einfach und effizient zu gestalten und dem Wartungsteam anschließend die Arbeit zu erleichtern, ist eine gute Wartbarkeit der Software die wichtigste Voraussetzung.

Aber was zeichnet gute Wartbarkeit aus und wie können wir diese erreichen? 
In dieser dreiteiligen Serie wollen wir auf unterschiedliche Themen eingehen, die die Wartbarkeit von Software beeinflussen.

Viele der angesprochenen Themen, die die spätere Pflege der Anwendung massiv erleichtern, lassen sich ohne großen Mehraufwand im Projekt umsetzen und lohnen sich schon in der Projektumsetzung, da sie zu einer hohen Qualität der Software führen und somit einige Nerven bei der Entwicklung und beim Go-Live sparen.

Für eine schnelle Übersicht haben wir am Ende jedes Artikels die einzelnen Themen in einer kompakten Check-liste als PDF zum Download zur Verfügung gestellt.


#Dokumentation
Der erste Schritt in der Transition einer Software von der Entwicklung in die Wartung erfolgt in den meisten Fällen über die bereitgestellte Dokumentation der Software und der Prozesse. 
Bei der Analyse von Fehlern in der Wartung spielt die Dokumentation ebenfalls eine wichtige Rolle. 
Daher wollen wir uns im ersten Teil dieser Serie mit der Dokumentation von Softwareprojekten beschäftigen.

Die meisten Dokumente, die dem Wartungsteam bei der Transition und in der Wartung helfen, sind heutzutage „state-of-the-art“ in der professionellen Softwareentwicklung, so dass entweder gar kein oder nur wenig zusätzlicher Aufwand für die Bereitstellung für das Wartungsteam anfällt.

#Anforderungen
##Funktionale Anforderungen
Als ersten Schritt benötigt das Wartungsteam einen Überblick über die fachlichen Funktionen der Anwendung. 
Im einfachsten Fall reicht hierfür eine Liste der umgesetzten Anwendungsfälle mit je 2-3 Sätzen Beschreibung. 
Im besten Fall gibt es eine ausführliche fachliche Spezifikation der Anwendung, die idealerweise auch vom Kunden abgenommen wurde. 
Eine ausführliche Spezifikation kann dem Wartungsteam vor allem bei der Analyse von fachlichen Fehlern helfen und bei der Unterscheidung zwischen Fehler und Change Request unterstützen.

Falls während der Entwicklung die Anforderungen in einem Ticketsystem gepflegt wurden, ist es hilfreich, wenn diese zur Übergabe an das Wartungsteam in einem zentralen Dokument als Überblick zusammengefasst werden. 
Auch wenn während der Entwicklung die Arbeit mit Tickets sehr hilfreich sein kann, erschwert es jedoch dem Wartungsteam im Nachhinein die Arbeit. 
Vor allem wenn das gleiche Ticketsystem für die Qualitätssicherung und das Fehlerreporting verwendet wird, geht sehr schnell die Übersicht über die umgesetzten Funktionen verloren. 
Das zusammfassende Dokument muss nicht sehr formal gestaltet sein. 
Es reicht z.B. eine Liste in einem Word-Dokument, eine Excel-Tabelle oder eine Auflistung in einem Collaboration-Raum (z.B. Confluence).

##Nicht funktionale Anforderungen
Neben den funktionalen Anforderungen spielen vor allem die nicht funktionalen Anforderungen eine große Rolle, da diese sich auf die Architektur der Anwendung auswirken und deren Erfüllung einen großen Einfluss auf die Akzeptanz der Software durch den Kunden hat.

Nicht funktionale Anforderungen, die auf jeden Fall betrachtet und dokumentiert sein sollten, sind das zu erwartende Nutzeraufkommen, die einzuhaltenden Antwortzeiten und das zu erwartende Datenaufkommen im produktiven Betrieb. 
Hierbei sind die durchschnittlichen und maximalen Werte mit dem Kunden abzustimmen und vom Kunden abzunehmen. 
Wichtig ist dabei auch, dass diese Werte und Annahmen im Hinblick auf die geplante Lebenszeit der Software erhoben werden. 
Nutzeraufkommen und Datenvolumen steigen typischerweise im Laufe der Zeit, die die Software im Einsatz ist. 
Dem Wartungsteam dienen diese dokumentierten und abgenommenen Werte als Abgrenzung zwischen Fehler und Change Request.
Für die Dokumentation der nicht funktionalen Anforderungen reicht im einfachsten Fall eine Liste mit einer knappen Beschreibung je Anforderung.

##Standards
Wenn die Anwendung bestimmte Standards oder Verordnungen einhalten muss, wie z.B. BITV 2.0 für Barrierefreiheit oder den BSI IT-Grundschutz, sollte dies entsprechend dokumentiert sein. 
Eine Dokumentation, wie die geforderten Standards in der Software technisch umgesetzt wurden ist ebenfalls hilfreich.

#Architektur
Damit das Wartungsteam den Aufbau der Software schnell erfassen und verstehen kann, muss die Architektur der Software klar und verständlich dokumentiert sein. 
Im besten Fall wird hierfür eine Dokumentationsvorlage wie z.B. [arc42](https://arc42.org/download) verwendet. 
Nicht benötigte Abschnitte der Vorlage sollten dabei nicht gelöscht, sondern mit einem kurzen Hinweis versehen werden, warum sie nicht benötigt werden.

![Aufbau des Arc42 Templates](/assets/images/posts/wartbarkeit-von-software-teil-1-dokumentation/grafik-arc42.png)

Falls eine ausführliche Architekturdokumentation, aus welchen Gründen auch immer, nicht möglich sein sollte, sollten doch zumindest die folgenden Artefakte vorhanden sein:
* Ein **Kontextdiagramm**, zur Darstellung der Schnittstellen bzw. Grenzen zu den Nutzer(gruppen) und externen Systemen.
* Mindestens eine **Bausteinsicht** der wichtigsten Komponenten und deren Beziehungen untereinander.
* Eine kurze Erläuterung des verwendeten **Architekturmusters**.
* Eine Liste der **Architekturentscheidungen** inkl. der Problembeschreibung, der berücksichtigten Alternativen und einer Begründung für die getroffene Entscheidung. 
Architekturentscheidungen sind insbesondere dann zu dokumentieren, wenn kein firmen- und branchentypischer Standard-Stack verwendet wird.
* Eine zentrale Liste der **verwendeten Technologien** erleichtert dem Wartungsteam vor allem in Microservice-Architekturen oder Multi-Modul Anwendungen die Übersicht und den Einstieg in das Projekt. 
In kleinen Projekten kann hierauf ggf. verzichtet werden, wenn die verwendeten Abhängigkeiten durch ein geeignetes Build-Tool zentral verwaltet werden (z.B. Maven pom-Datei oder Gradle build-Datei).
* Die Liste der **technischen Schulden** ist besonders wichtig für das Wartungsteam. 
Anhand dieser Liste können zukünftige Probleme frühzeitig erkannt und ggf. noch vor dem Auftreten gemindert oder beseitigt werden.
* Falls an den eingesetzten Bibliotheken und Frameworks Modifikationen vorgenommen wurden, müssen diese unbedingt dokumentiert werden, um böse Überraschungen bei der nächsten Aktualisierung eben jener zu vermeiden.

Für die Übergabe an das Wartungsteam ist es wichtig, dass die Dokumentation der Architektur aktuell ist. 
Wenn sich während der Entwicklung Änderungen an der Architektur ergeben, müssen diese in die Dokumentation eingepflegt werden.

#Entwicklerdokumentation
Um dem Wartungsteam einen möglichst schnellen Einstieg in die Wartung und Weiterentwicklung der Software zu ermöglichen, sollte das Entwicklungsvorgehen dokumentiert sein. 
Zu den folgenden Themen sollte entsprechende Dokumentation vorhanden.

##Entwicklungsumgebung
Als erster Schritt wird eine Anleitung für die Einrichtung der Entwicklungsumgebung benötigt. 
Im einfachsten Fall ist diese bereits fertig vorkonfiguriert als Docker-Image oder Virtuelle Maschine vorhanden, die die Entwickler nur noch kopieren und starten müssen. 
Ist dies nicht vorhanden, ist eine Anleitung zur korrekten Einrichtung der IDE sowie der sonstigen genutzten Entwicklungswerkzeuge und Plugins notwendig.

##Vorgaben
Falls Entwicklungsvorgaben vorhanden sind, müssen diese ebenfalls dokumentiert und an das Wartungsteam übergeben werden, damit diese Vorgaben auch in der Wartung und Weiterentwicklung weiterhin eingehalten werden können. 
Dazu gehören z.B. Coding Conventions, Guidelines, Styleguides, Umsetzungsrichtlinien für einzuhaltende Standards oder ähnliches. 
Eine Vorgabe für die Umsetzung der Barrierefreiheit kann z.B. wie folgt aussehen.

![Beispiel für die technischen Vorgaben zur Umsetzung der Barrierefreiheit](/assets/images/posts/wartbarkeit-von-software-teil-1-dokumentation/grafik-doku-barrierefreiheit.png)

##Versionsverwaltung
Unabhängig davon, wie viele Entwickler an der Software arbeiten, muss eine Versionsverwaltung wie z.B. Git eingesetzt werden. 
Dabei sollten mindestens zwei Branhes erstellt und verwendet werden. 
Einen Masterbranch, der die aktuellste ausgelieferte Version der Software beinhaltet und einen Entwicklungsbranch, in dem neue Features für das nächste Release entwickelt und getestet werden. 
Das konkret verwendete Branchmodell (z.B. ein Branch pro Feature, zentrale Entwicklung im Entwicklungsbranch oder sonstiges) und die damit verbundenen Prozesse sollten dokumentiert sein.

##Definition of Done
Um sicherzustellen, dass alle entwickelten Features den gleichen Qualitätskriterien genügen, muss im Entwicklungsprojekt eine „Definition of Done“ definiert sein, die von allen Entwicklern eingehalten wird. 
Eine solche Definition of Done kann zum Beispiel wie folgt aussehen:

![Bild ergänzen]

##Reviewprozess
Um die Qualität der Anwendung zu erhöhen sollte der Entwicklungsprozess ein Codereview der entwickelten Features durch mindestens eine zweite Person beinhalten. 
Der Reviewprozess sollte in diesem Fall zentral für alle Entwickler und Reviewer dokumentiert sein. 
Durch die Verwendung einer Checkliste kann sichergestellt werden, dass jeder Reviewer ein Mindestsatz an Prüfungen durchführt. 
Eine solche Checkliste kann z.B. folgende Punkte beinhalten:

* Der Lösungsweg ist im Pull Request oder im zugehörigen Ticket beschrieben.
* Der Code ist ausreichend dokumentiert und kommentiert.
* Die vorgegebenen Guidelines wurden eingehalten.
* Texte für Masken, E-Mails usw. entsprechen den Vorgaben der Spezifikation (falls vorhanden) und enthalten keine Rechtschreib- bzw. Grammatikfehler.
* Es sind Unit-Tests vorhanden und die Code-Abdeckung entspricht dem vorgegebenen Ziel.
* Es sind ggf. Integrationstests vorhanden.
* Die „Definition of Done“ ist erfüllt.
* Die konfigurierten Codequalitätsziele werden eingehalten.

##Testumgebungen
Während der Entwicklungsphase wird die Software üblicherweise auf eine oder mehrere Testumgebungen deployt und getestet. 
Da diese Testumgebungen auch vom Wartungsteam verwendet werden, müssen sie dokumentiert und beschrieben sein. 
Dazu gehören der Zweck der Umgebung, die Konfiguration, die zugehörigen URL(s) und ggf. die Zugänge. 
Passwörter sind dabei natürlich in entsprechenden Passwortverwaltungstools zu sichern.

Üblicherweise kommen drei verschiedene Arten von Testumgebungen zum Einsatz:
* Entwicklung: Auf dieser Testumgebung befindet sich immer der aktuellste Entwicklungsstand der Anwendung. 
Üblicherweise wird diese Umgebung durch ein CI-Werkzeug automatisch, nach jedem Push in den Entwicklungsbranch und anschließendem erfolgreichen Build, aktualisiert. 
Dort können die Entwickler den aktuellen Stand der Software einsehen und ihre Features außerhalb ihrer lokalen Entwicklungsumgebung testen.
* Qualitätssicherung: Auf dieser Testumgebung führt das Qualitätssicherungsteam den internen Abnahmetest durch, bevor die Softwareversion an den Kunden ausgeliefert wird.
* Test: Diese Testumgebung wird für automatisierte Tests, wie z.B. Integrationstests, Massendatentests sowie Last- und Performancetests verwendet.

##Build und Auslieferung
Um Bugfixes oder neue Releases ausliefern zu können benötigt das Wartungsteam Anleitungen für den Build, das Deployment und die Auslieferung der Software. 
Im besten Fall erfolgt der Großteil dieser Schritte automatisiert auf Knopfdruck durch ein CI Werkzeug wie, z.B. Jenkins oder GitLab. 
Werden dabei sehr komplexe Pipelines oder selbstgeschriebene Skripte verwendet, sollten diese (am besten inline) dokumentiert sein, damit das Wartungsteam die Prozesse schnell erfassen und nachvollziehen kann.

Ist eine Automatisierung nicht möglich oder wenn zusätzliche Schritte notwendig sind, muss eine Anleitung mit allen notwendigen Schritten erstellt und dem Wartungsteam übergeben werden. 
Neben den technischen Aspekten muss die Anleitung auch die organisatorischen Aufgaben beinhalten. 
Dazu gehört z.B. die Liste der zu pflegenden Dokumente oder an wen und auf welchem Weg die Auslieferung auf Kundenseite zu erfolgen hat.

#Betriebshandbuch
Neben der Wartung und der Weiterentwicklung unterstützt das Wartungsteam auch den langjährlichen Betrieb der entwickelten Anwendung. Entweder, indem es selbst für den Betrieb der Anwendung verantwortlich ist oder indem es den Kunden bei Betriebsfragen unterstützt.

Um dem Wartungsteam den Einstieg in den Betrieb zu erleichtern sollte das Betriebshandbuch mindestens die folgenden Themen beinhalten.

* Eine Verteilungssicht der Server und Komponenten.
* Eine Beschreibung der benötigten Server und Komponenten inklusive der Mindestvoraussetzungen.
* Eine Anleitung zu Installation der kompletten Anwendung inkl. der benötigten Komponenten (Datenbank, Identity Provider, Loggingverwaltung, usw.). 
Dies kann ggf. auch in einem separaten Installationshandbuch erfolgen.
* Eine Anleitung zum Deployment der Anwendung.
* Eine Liste der anwendungsspezifischen Konfigurationsparameter inkl. einer kurzen Beschreibung und der erlaubten Werte.
* Eine Beschreibung, wie das Monitoring der Software erfolgt. 
Dies umfasst sowohl das technische, als auch das fachliche Monitoring der Anwendung.
* Eine Beschreibung der Backup-Strategie zum Wiederherstellen der Systeme.


#Fazit
TODO

Um die wichtigsten Themen beim nächsten Angebot bzw. Projektstart schnell zur Hand zu haben, haben wir eine kompakte Checkliste zum Thema Wartbarkeit erstellt, die ihr euch [hier](TODO:Link ergänzen) als PDF-Datei herunterladen könnt.

#Ausblick
Im nächsten Teil dieser Serien werfen wir einen Blick auf den Test von Softwareprojekten. 
Welche Tests helfen dem Wartungsteam bei ihrer Arbeit und welche Abdeckung ist sinnvoll und nützlich?





