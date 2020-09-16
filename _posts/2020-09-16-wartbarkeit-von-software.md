---
layout: 		[post, post-xml]										# Pflichtfeld. Nicht ändern!
title:			"Wartbarkeit von Software"								# BLOG-Titel eintragen
date:			2020-09-16 00:00										# Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date:	2020-09-16 00:00										# Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author:			tlange													# Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories:		[Softwareentwicklung]									# Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags:			[Wartbarkeit]											# Optional.
---

Voraussetzung für die Übernahme einer Software in das Application Management ist eine gute Wartbarkeit.
Die Übergabe einer gut wartbaren Software an das Wartungs- Team minimiert den Aufwand für Fehlerbehebung, adaptive Wartung und folgende Change Requests deutlich.
Aber was zeichnet gute Wartbarkeit aus und wie können wir diese erreichen.
In diesem Blog-Post möchten wir Kriterien als Checkliste vorstellen, die als Grundlage für die spätere Übergabe einer Software in das Application Management zu beachten sind.
Und das beginnt schon in den ersten Phasen der Entwicklung!


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
