---
layout:         [post, post-xml]              
title:          "Continuous Testing mit JIRA, XRay und Jenkins"
date:           2018-08-10 09:17
modified_date: 
author:         mhoeber
categories:     [Methodik]
tags:           [JIRA, Testautomatisierug, DevOps, Jenkins]
---
In der agilen Softwareentwicklung werden häufig Jenkins für Build & Deployment sowie JIRA für die Entwicklungs- und Testaufgaben verwendet. Sofern ein Testmanagement-Werkzeug verwendet wird, ist es selten JIRA. Automatisierte Testfälle werden separat gepflegt und berichtet. Von einer geschlossenen Werkzeugkette für Continuous Testing kann nicht die Rede sein. Die Grundkonfiguration ist jedoch einfacher als gedacht...

# Testmanagement mit JIRA & XRay
Das [JIRA-Plugin XRay](https://www.xpand-addons.com/xray/) vom Anbieter xpand-addons erweitert JIRA um ein umfassende Testmanagement-Funktionen, beispielsweise durch eine Testfallbibliothek, Visualisierung der Anforderungsabdeckung und eine bi-direktionale Nachverfolgbarkeit.
![JIRA/Xray Sprint-Board](/assets/images/posts/jenkins-xray/jira-xray-sprint-board-xsmall.jpg)
![JIRA/Xray Nachverfolgbarkeit](/assets/images/posts/jenkins-xray/jira-xray-traceability-xsmall.jpg)
XRay integriert sehr gut in bestehende JIRA-Projekte und lässt sich einfach und umfassend an die Projektbedürfnisse anpassen. Unter anderem kann XRay ein eigenständiges Testprojekt verwenden, das mit dazugehörenden Entwicklungsprojekten verknüpft wird, oder bestehende Entwicklungsprojekte maßgeschneidert ergänzen.
Die neuen Entitäten, darunter Testfälle, Testpläne und Testausführungen, und JQL, die XRay mitbringt ermöglichen eine zielgerichtete und transparente Steterung der erforderlichen Testaktivitäten.

## generische Testfälle für die Testautomatisierung
Testfälle werden nach manuellen, cucumber und generisch unterschieden. Generisch wird für automatisierte Testfälle verwendet, die von einem CI-Server regelmäßig ausgeführt werden
![Xray Testfall](/assets/images/posts/jenkins-xray/jira-testcase.jpg)

# Verbindung zwischen Jenkins & XRay herstellen
In Jenkins muss die Verbindung zu JIRA/XRay konfiguriert werden, so dass Ergebnisse von automatisierten Testausführungen direkt übertragen werden können. Hierzu wird das kostenfreie [Xray-Plugin für Jenkins](https://confluence.xpand-addons.com/display/XRAY/Integration+with+Jenkins) benötigt.

## Jenkins Xray-Plugin einrichten
Nach der Installation des Plugins tragen Sie die Daten der JIRA-Instanz, die Sie verbinden möchten unter `Jenkins verwalten` - `System konfigurieren` - `Xray for JIRA configuration` ein.
![Jenkins Xray Konfiguration](/assets/images/posts/jenkins-xray/jenkins-plugin-config.jpg)
Anschließend lässt sich diese Instanz in Jenkins-Jobs verwenden.

## Jenkins-Slave für Testausführung anlegen
Für die Ausführung automatisierter Testfälle sollten eigenständige Jenkins-Slave-Knoten anstelle des Jenkins-Master verwendet werden, damit die Testausführung Build- und Deployment-Jobs nicht blockiert.

### Knoten konfigurieren
Einige Oberflächen-Testautomatisierungs-Werkzeuge, beispielsweise HP UFT, lassen sich nur unter Windows ausführen, wodurch häufig ein separater Jenkins-Knoten erforderlich wird.
In den Jenkins-Einstellungen wird dazu ein neuer Knoten angelegt, ein Label vergeben, damit später nur bestimmte Jobs auf ihm ausgeführt werden und `c:\jenkins` als Workspace definiert.
![Jenkins Node](/assets/images/posts/jenkins-xray/jenkins-node-config.jpg)

### JNLP-Verbindung herstellen
Nachdem der Jenkins-Slave eingerichtet wurde, wird der gewünschte Rechner per JNLP mit dem Jenkins-Master verbunden. In der Übersicht des Knotens klickt man dazu auf die Schaltfläche `Launch`.
Daraufhin öffnet sich ein Java-Dialog, in dem bestätigt wird, dass der Jenkins Remoting Agent ausgeführt werden darf. 
![Jenkins JNLP-Slave](/assets/images/posts/jenkins-xray/jenkins-jnlp-slave1_small.jpg)
Anschließend erscheint ein Fenster mit dem Jenkins-Logo, in dem der Text `Connected` anzeigt, dass der verwendete Rechner als Jenkins-Slave verbunden ist.
![Jenkins JNLP-Slave](/assets/images/posts/jenkins-xray/jenkins-jnlp-slave2.jpg)

# Testausführung über Jenkins
Die Testausführung erfolgt über sog. Freestyle-Jobs. Es wird empfohlen, zuerst eine Vorlage je Testwerkzeug anzulegen und diese Vorlage später je nach Einsatzzweck zu kopieren und anzupassen.

## Anlage des Jenkins-Jobs
Zur Anlage eines neuen Jenkins-Jobs klickt man auf `Element anlegen`, gibt einen eindeutigen Namen ein, wählt `"Free Style"-Softwareprojekt bauen` aus und klickt auf `OK`.
Direkt im Anschluss öffnet sich die Bildschirmmaske zur Konfiguration des angelegten Jenkins-Jobs. Wichtig ist es, dass die Ausführung per Label-Ausdruck auf den zuvor eingerichteten Jenkins-Slave beschränkt wird.
![Jenkins Job](/assets/images/posts/jenkins-xray/jenkins-job-config.jpg)

### Testwerkzeug aufrufen
Je nach Testwerkzeug erfolgt der Aufruf anders. Beispielsweise kann SoapUI per `Buildverfahren` `Windows-Batch-Datei ausführen` gestartet werden, in dem man den testrunner mit dem entsprechenden Kommando aufruft. Alternativ lässt sich SoapUI mithilfe von Maven ausführen.

### Synchronisation mit JIRA/XRay
Die Synchronisation der Testausführungsergebnisse erfolgt mit dem Jenkins XRay Plugin als `Post Build Step`. Hierzu wird die eingangs angelegte JIRA Instanz ausgewählt, der Dateiname, beispielsweise junit_soapui.xml, angegeben und der Projekt-Schlüssel in JIRA, beispielsweise GTD, eingegeben. Alle weiteren Felder sind optional.

## Ausführen des Jenkins-Jobs
Die Testausführung erfolgt durch den Start des Jenkins-Jobs mittels dem `Pfeil-Symbol` rechts neben dem Job in der Job-Übersicht. Die vorhandenen Testfälle werden auf dem Jenkins-Slave ausgeführt und die Ergebnisse im jUnit-Format auf den Jenkins-Master übertragen und von dort nach JIRA/XRay synchronisiert.
![Jenkins Testausfuehrung](/assets/images/posts/jenkins-xray/jenkins-job-run.jpg)

## Testergebnis in JIRA/Xray
Die Testergebnisse, die aus Jenkins nach JIRA übertragen wurden, werden in verschiedenen Ansichten verwendet. Die Übersicht aller ausgeführten Testfälle kann man in Form einer neu angelegten Testausführung sehen. Wurde ein Testplan bei der Testausführung angegeben, so wird dieser ebenfalls aktualisiert.
![JIRA/XRay Testausfuehrung](/assets/images/posts/jenkins-xray/jira-testexecution.jpg)
Jeder ausgeführte Testfall wird automatisch aktualisiert. In der Ansicht eines Testfalls sind alle Testausführungen aufgeführt. Die neueste Ausführung zuerst.
![JIRA/Xray Testfall](/assets/images/posts/jenkins-xray/jira-testcase-executions.png)