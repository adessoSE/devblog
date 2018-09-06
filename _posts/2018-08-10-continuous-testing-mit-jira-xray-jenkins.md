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
![JIRA/Xray Nachverfolgbarkeit](/assets/images/posts/jenkins-xray/jira-xray-traceability-small.jpg)
XRay integriert sehr gut in bestehende JIRA-Projekte und lässt sich einfach und umfassend an die Projektbedürfnisse anpassen. Unter anderem kann XRay ein eigenständiges Testprojekt verwenden, das mit dazugehörenden Entwicklungsprojekten verknüpft wird, oder bestehende Entwicklungsprojekte maßgeschneidert ergänzen.
Die neuen Entitäten, darunter Testfälle, Testpläne und Testausführungen, und JQL, die XRay mitbringt ermöglichen eine zielgerichtete und transparente Steterung der erforderlichen Testaktivitäten.

## generische Testfälle für die Testautomatisierung
Testfälle werden nach manuellen, cucumber und generisch unterschieden. Generisch wird für automatisierte Testfälle verwendet, die von einem CI-Server regelmäßig ausgeführt werden

![Xray Testfall](/assets/images/posts/jenkins-xray/jira-testcase.jpg)

#Verbindung zwischen Jenkins & XRay herstellen
In Jenkins muss die Verbindung zu JIRA/XRay konfiguriert werden, so dass Ergebnisse von automatisierten Testausführungen direkt übertragen werden können. Hierzu wird das kostenfreie [Xray-Plugin für Jenkins](https://confluence.xpand-addons.com/display/XRAY/Integration+with+Jenkins) benötigt.

## Jenkins Xray-Plugin einrichten
Nach der Installation des Plugins tragen Sie die Daten der JIRA-Instanz, die Sie verbinden möchten unter `Jenkins verwalten` - `System konfigurieren` - `Xray for JIRA configuration` ein.
![Jenkins Xray Konfiguration](/assets/images/posts/jenkins-xray/jenkins-plugin-config.jpg)
Anschließend lässt sich diese Instanz in Jenkins-Jobs verwenden.

## Jenkins-Slave für Testausführung anlegen
Für die Ausführung automatisierter Testfälle sollten eigenständige Jenkins-Slave-Knoten anstelle des Jenkins-Master verwendet werden, damit die Testausführung Build- und Deployment-Jobs nicht blockiert.
### Node konfigurieren
 Einige Oberflächen-Testautomatisierungs-Werkzeuge, beispielsweise HP UFT, lassen sich nur unter Windows ausführen, wodurch häufig ein separater Jenkins-Knoten erforderlich wird.
In den Jenkins-Einstellungen wird dazu ein neuer Knoten angelegt, ein Label vergeben, damit später nur bestimmte Jobs auf ihm ausgeführt werden und `c:\jenkins` als Workspace definiert.

![Jenkins Node](/assets/images/posts/jenkins-xray/jenkins-node-config.jpg)
### JNLP-Verbindung herstellen
![Jenkins JNLP-Slave](/assets/images/posts/jenkins-xray/jenkins-jnlp-slave1.jpg)
![Jenkins JNLP-Slave](/assets/images/posts/jenkins-xray/jenkins-jnlp-slave2.jpg)

# Testausführung über Jenkins
## Anlage des Jenkins-Jobs
![Jenkins Job](/assets/images/posts/jenkins-xray/jenkins-job-config.jpg)

## Ausführen des Jenkins-Jobs
![Jenkins Testausfuehrung](/assets/images/posts/jenkins-xray/jenkins-job-run.jpg)

## Testergebnis in JIRA/Xray
![JIRA/XRay Testausfuehrung](/assets/images/posts/jenkins-xray/jira-testrun.jpg)
![JIRA/Xray Testfall](/assets/images/posts/jenkins-xray/jira-testcase.jpg)
