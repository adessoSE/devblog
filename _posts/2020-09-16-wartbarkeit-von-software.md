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

Das Application Management Team wird den entwickelten Source Code verändern...
einerseits werden im Rahmen der Wartung Fehler zu beheben sein, anderseits wird es Change Requests geben, die vom Application Management Team umgesetzt werden.
Um sicherzustellen, dass die dann vorgenommenen Code-Änderungen keine Seiteneffekte haben und alle Anwendungsfälle der Software weiterhin funktionieren, müssen automatisierte Tests mit einer hohen Testabdeckung vorhanden sein.

## Unit Tests 

Es sind automatisierte Unit Tests vorhanden, sowohl für das Backend (Java) als auch für das Frontend (JavaScript etc.).
Die Codeabdeckung der Unitestes erreicht eine Zweigabdeckung von mindestens 80%.
Die Metriken zur Codeabdeckung werden automatisiert im Rahmen der Continuous Integration erhoben.

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
