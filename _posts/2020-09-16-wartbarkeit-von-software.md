---
layout: 		[post, post-xml]										# Pflichtfeld. Nicht ändern!
title:			"Wartbarkeit von Software"								# BLOG-Titel eintragen
date:			2020-09-16 00:00										# Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date:	2020-09-16 00:00										# Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author:			tlange													# Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories:		[Softwareentwicklung]									# Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags:			[Wartbarkeit]											# Optional.
---

In diesem Blog-Post möchten wir Kriterien vorstellen, die als Grundlage für die spätere Übergabe einer Software in das Application Management, in die Wartung, zu beachten sind.
Voraussetzung dafür ist eine gute Wartbarkeit.
Denn eine gut wartbare Software minimiert den Aufwand des Application Management Teams deutlich... für Fehlerbehebung, adaptive Wartung und folgende Change Requests.
Aber was zeichnet gute Wartbarkeit aus und wie können wir diese erreichen.
Dieser Post richtet sich an Architekten, Entwickler und Test-Manager und bietet eine kommentierte Checkliste von Anforderungen, von denen manche erst nach Ende des Entwicklungs-Projektes wirksam werden.
Diese Anforderungen erfüllen zu können, beginnt jedoch schon mit der Planung in den ersten Phasen der Entwicklung!

# Einleitung

Ziel des Dokumentes ist es langjährige Erfahrung aus der Wartung und Weiterent-wicklung von Software zu sammeln und die daraus abgeleiteten Erkenntnisse in die Projekte zurückzuspielen.
Viele Dinge, die die spätere Pflege der Anwendung massiv erleichtern, lassen sich ohne großen Mehraufwand im Projekt umsetzen und lohnen sich schon in der Projektumsetzung – entweder in Budget oder durch „gesparte“ Ner-ven beim Go-Live.
Mit dem Ziel der fortwährenden Professionalisierung und Anpassung der Software-entwicklungsprozesse bei adesso an die steigende Projektgröße, die auch eine höhe-re Komplexität mit sich bringt, formuliert dieses Dokument Anforderungen an die zu erstellende Software.
Wie immer gilt bei adesso der gesunde Menschenverstand und nicht in jedem Projekt ist jeder Punkt verpflichtend – aber man sollte sinnvoll drüber nachgedacht haben und bewusst entschieden haben.
Und wenn am Ende dieses Prozesses, dann nur ein kleiner Teil der Anforderungen umgesetzt ist, so sollte man nochmal über seinen eigenen Anspruch an die Soft-wareentwicklung nachdenken – die Liste besteht nämlich eigentlich aus Selbstver-ständlichkeiten und die einzelnen Punkte sind „state-of-the-art“ in professioneller Softwareentwicklung. 

# Dokumentation

## Anforderungen

Die funktionalen und nicht-funktionalen Anforderungen an die Software sind spezifi-ziert.
Die Spezifikation enthält mindestens die folgenden Artefakte:

* Liste der Anwendungsfälle inkl. mindestens je 2-3 Sätzen Beschreibung.

Hinweis: Wenn die Anwendungsfälle nur als Tickets vorliegen, sollte trotzdem eine Liste als Dokument (z.B. Word, Excel oder im Confluence) gepflegt sein.

* Erwartetes Nutzeraufkommen im produktiven Betrieb
* Einzuhaltende Antwortzeiten
* Erwartetes Datenaufkommen im produktiven Betrieb (Mengenbetrachtung)
* Liste der einzuhaltenden Standards/Verordnungen etc. (z.B. BITV 2.0 für Bar-rierefreiheit)

## Architektur

Die Architektur der Software ist klar und verständlich dokumentiert und aktuell.
In der Architekturdokumentation sind mindestens die folgenden Artefakte vorhanden:

* Kontextdiagramm
* Bausteinsicht(en)
* Erläuterung des verwendeten Architekturmusters
* Liste der verwendeten Technologien
* Architekturentscheidungen; insbesondere, wenn kein Standard-Stack ver-wendet wird (siehe adesso Technologie-Radar)
* Liste der technischen Schulden
* Liste aller vorgenommenen Modifikationen von eingesetzten Bibliotheken und Frameworks

## Entwicklerdokumentation

Das Entwicklungsvorgehen ist dokumentiert.
Die Entwicklerdokumentation enthält mindestens die folgenden Artefakte:

* Anleitung zur Einrichtung der Entwicklungsumgebung (Docker, IDE, VMs …)
* Liste der verwendeten Entwicklungswerkzeuge (Tools, Plugins etc.)
* Entwicklungsvorgaben
* Code Conventions
* Definition of Done
* Erläuterung des verwendeten Brachmodells und -prozesses
* Reviewprozess
* Workflows
* Anleitungen für Build, Deployment und Release der Software
* Beschreibung der Testumgebungen (-Stages) inkl. Konfiguration

## Betriebshandbuch

Für den Betrieb der Software ist eine entsprechende Dokumentation vorhanden.
Das Betriebshandbuch beinhaltet mindestens die folgenden Artefakte:

* Anleitung zu Installation und/oder Deployment neuer Releases (Updates) 
* Beschreibung der einzelnen Server/Komponenten inkl. Mindestvoraussetzun-gen
* Liste der anwendungsspezifischen Konfigurationsparameter inkl. Beschrei-bung und erlaubter Werte
* Beschreibung, wie das Monitoring der Software erfolgt (technisch & fachlich)

# Tests

Das Wartungs-Team wird die Aufgabe haben, vom Kunden gemeldetes Fehlverhalten möglichst schnell in einer dem Produktivsystem ähnlichen Umgebung (Integrations- oder Test-Stage) zu reproduzieren.
Basierend auf der folgenden Fehleranalyse wird das Wartungs-Team dann den entwickelten Quell-Code korrigieren müssen.
Auch für fachliche Änderungen (Change Requests), die zusätzlich in der Wartungs- und Betriebs-Phase umzusetzen sind, wird der Quell-Code angepasst werden.
Aber Code-Anpassungen können Seiteneffekte haben, vor allem, wenn Sie an zentraler Stelle vorgenommen werden.

Es ist häufig so, dass das Wartungs-Team aus weniger Mitarbeitern besteht als das für die Neuentwicklung verantwortliche Entwicklungs-Team.
In gleichem Maße ist auch die zur Verfügung stehende Zeit (und das Budget) in der Wartung häufig deutlich kleiner.
Trotzdem wird vom Kunden zurecht erwartet, dass die komplexe Fachlichkeit und Technik der Software schon bei der ersten Fehlerbehebung verstanden wird und weitere Code-Anpassungen dann mit ebenso hoher Qualität wie bereits der vorherigen Neuentwicklung erfolgen.

__Um dem Wartungs-Team Sicherheit zu geben, dass die vorgenommenen Änderungen keine unerwünschten Seiteneffekte auf andere Anwendungsfälle haben, ist eine möglichst hohe Testabdeckung durch die unterschiedlichen automatisierten Testmethoden unerlässlich.__

Wäre die Testabdeckung fachlicher Anwendungsfälle gering oder schlimmstenfalls gar nicht vorhanden, müsste das Wartungs-Team bei der Behebung eines Fehlers die gesamte Fachlichkeit kennen.
Zusätzlich müsste nach der Änderung ein vollständiger manueller Systemtest wiederholt werden, in gleichem Umfang wie er zur Abnahme durchgeführt wurde.
Nur so wäre sichergestellt, dass die Änderung korrekt, vollumfänglich und frei von Seiteneffekten ist.

Während der Neuentwicklung wurden bereits umfängliche Unit Tests geschrieben, automatisierte Integrations-Tests erstellt und regelmäßige Last- und Performance-Tests durchgeführt.
Diese sind zur Erhaltung der Qualität für das Wartungs-Team sehr wertvoll.
Damit das Wartungs-Team diese Tests auch bestmöglich und schnell nutzen kann, müssen sie in einer Test-Umgebung automatisiert und Inhalt und Durchführung gut dokumentiert sein.

## Unit Tests 

Wie schon vielerorts beschrieben, ist es unerlässlich, dass Unit Tests (Modul- bzw. Komponenten-tests) überhaupt vorhanden sind.
Diese Anforderung gilt dabei nicht nur für Backend-Code (z.B. Java) sondern gleichermaßen auch für den im Webumfeld in den letzten Jahren wieder wachsenden Anteil an Frontend-Code (z.B. Javascript).

Der Quelltext der Unit Tests sollte in Bezug auf Lesbarkeit und Robustheit von gleicher Qualität wie der Anwendungs-Code selbst sein.
Außerdem kann der optimale Zustand für einen Unit Test sein, dass er nicht nur die fachliche Anforderung sicherstellt, sondern diese auch gleich dokumentiert.

Alle vorhandenen Unit Tests sollten im Rahmen der Continuous Integration so automatisiert sein, dass sie nach jeder Änderung (nach jedem Commit) schnellstmöglich ein Ergebnis liefern.
Das bedeutet, dass ein Tool zur Code Analyse (z.B. SonarQube) bereitgestellt und konfiguriert wird, das die Metriken zur Testabdeckung direkt nach einem Commit erhebt, diese durch ein für das Projekt definiertes Qualitätsziel (Quality Gate) prüft und die Entwickler und Entwicklerinnen dann per E-Mail zeitnah informiert.

Aber wie hoch sollte die Testabdeckung durch Unit Tests denn nun sein?
Diese Frage ist viel diskutiert und dieser BLOG ist nicht dazu gedacht, eine abschließende Antwort für jedes Projekt zu finden.
Jedoch zeigt die Erfahrung, dass mit einer guten Planung, einem hohen Stellenwert für die Tests und entsprechender Konfiguration des Code Analyse Tools eine hohe Testabdeckung von jenseits der 80% mit vertretbarem Aufwand durchaus erreichbar ist.
Das Team, das die Neuentwicklung durchführt, benötigt dazu nicht nur Zeit und Budget für das eigentliche Schreiben der Unit Tests selbst, sondern auch für das Management der Tests und für das Konfigurieren und regelmäßige Nachjustieren der automatisierten Code Analyse.

Im Zusammenhang mit Unit Tests ist dabei zu klären, welches Tool und welche Metriken der Code Analyse für ein Projekt zugrunde liegen sollen.
In einem größeren Unternehmen, das ein solches Tool bereits zentral bereitstellt, bietet es sich in jedem Fall an, dieses auch zu verwenden und mit einem Standard-Set an Metriken zu beginnen.
Eine Abweichung vom Standard-Tool und –Set muss dann natürlich in der Projektdokumentation nachvollziehbar niedergeschrieben sein.

## Integrationstests 

Es sind automatisierte Integrationstests vorhanden (z.B. via SoapUI, Postman, Selenium, Cypress etc.).
Es wird eine ABC-Einteilung der Geschäftsprozesse vorgenommen.  

Kategorie A umfasst alle geschäftskritischen Kernprozesse der Anwendung.
Sie sind dauerhaft in verwenden und dürfen nicht ausfallen. 

Kategorie B umfasst alle Standardprozesse der Anwendung.
Sie werden regelmäßig verwendet und führen zu einer starken Beeinträchtigung, wenn sie ausfallen. 

Kategorie C umfasst alle sonstigen Prozesse der Anwendung.
Sie werden selten verwendet und/oder führen nur zu einer geringen Beeinträchtigung, wenn sie ausfallen. 

Die drei Kategorien werden wie folgt durch Integrationstests abgedeckt. 

* Mindestens 80% der A-Prozesse sind jeweils mit einem Test für den Positivfall und zwei Tests für Negativfälle abgedeckt.  
* Mindestens 70% der B-Prozesse sind jeweils mit einem Test für den Positivfall und einem Test für Negativfälle abgedeckt.  
* Mindestens 50% der C-Prozesse sind jeweils mit einem Test für den Positivfall abgedeckt. 

## Last- und Performancetests  

Es werden automatisiert Last- und Performancetests durchgeführt, im besten Fall auf einer produktionsnah konfigurierten Testumgebung.
Für die Tests werden die in den nicht funktionalen Anforderungen vorgegebenen maximalen Nutzerzahlen und Datenvolumen verwendet.
Die Antwortzeiten der Software bleiben in den vorgegebenen Werten. 

Die Last- und Performancetests werden regelmäßig durchgeführt.
Je nach Projektumfang erfolgt dies mindestens einmal alle 1 – 3 Monate.
Die Ergebnisse und ggf. daraus resultierende Maßnahmen werden dokumentiert. 

## Massendatentests 

Es werden automatisierte Massendatentests durchgeführt, im besten Fall auf einer produktionsnah konfigurierten Testumgebung.
Für die Tests wird das in den nicht funktionalen Anforderungen vorgegebene maximale Datenaufkommen verwendet.
Die Tests beinhalten die Ausführung von allen vorhandenen datenintensiven Anwendungsfällen (z.B. Massendatenimport und –export, Statistikberechnungen etc.).
Die Auswertung der Massendatentests trifft Aussagen über die folgenden Themen: 

* Speicherauslastung 
* Garbage-Collection 
* Auswirkung auf die Performance 
* Auswirkung auf die Datenbank (z.B. arbeiten Views/Queries weiterhin performant?) 

Die Massendatentests werden regelmäßig durchgeführt.
Je nach Projektumfang erfolgt dies mindestens einmal alle 1 – 3 Monate.
Die Ergebnisse und ggf. daraus resultierende Maßnahmen werden dokumentiert. 

## Automatisierung der Testumgebungen 

Die Erzeugung und Konfiguration der Test-Stages soll möglichst automatisiert erfolgen z.B. durch den Einsatz von Docker, Ansible etc..  

## Produktionsnahe Testumgebung 

Mindestens eine Testumgebung ist der geplanten bzw. bereits existierenden produktiven Umgebung so nah wie möglich nachempfunden. 

Auf dieser produktionsnahen Testumgebung führt das QS-Team den Test (spätestens zur Abnahme) der Software durch. 

# Code-Qualität

## SonarQube

Die Software wird regelmäßig bei jedem Push in das Repository mit SonarQube ana-lysiert.
Es müssen die folgenden Grenzwerte eingehalten werden.

* Bugs = 0
* Vulnerabilities = 0
* Code Smells Blocker = 0
* Code Smells Critical = 0
* Code Duplication < 5%

Ausnahmen müssen im SonarQube nachvollziehbar begründet sein!
Grundsätzlich muss das für das Projekt eingerichtete QualityGate eingehalten wer-den.

# Continuous Integration und Deployment

## Jenkins / SonarQube

Es wird empfohlen, Continuous Integration und Continous Deployment auf dem adesso Jenkins einzurichten und die Code-Analyse vom adesso SonarQube durchführen zu lassen.
Dies mindert Reibungsverluste bei der Übergabe des Projektes an das Application Management Team, da der Umgang mit dem adesso Jenkins bekannt ist und bereits in vielen Projekten praktiziert wird.
Wir empfehlen eine Konfiguration unter Verwendung von Jenkins Pipeline Skripten und dem Multibranch Feature, das auch vom Sonar-Qube unterstützt wird.

Es existiert ein Projekt auf dem adesso Jenkins, das regelmäßig die folgenden Aufgaben ausführt:

**Bei jedem Push auf einem Branch:**
* Build der Software
* Ausführung von Unit Tests
* Code-Analyse mit z.B. SonarQube

**Täglich bis wöchentlich:**
* Deployment auf Teststages
* Security-Check der verwendeten Bibliotheken und Frameworks (z.B. OWASP)
* Ausführung der Integrationstests

**Wöchentlich bis monatlich:**
* Ausführung der Last-Tests
* Ausführung der Performance- uns/oder Massendaten-Tests


## Artefakt-Repository

Die Auslieferungsartefakte von Releases und Release Candidates sind nachvollziehbar versioniert und in einem Artefakt-Repository archiviert.
Wir empfehlen, die Releases durch einen Jenkins Job erstellen zu lassen und von dort autmoatisiert auf das adesso Artifactory (oder Nexus) übertragen zu lassen.
