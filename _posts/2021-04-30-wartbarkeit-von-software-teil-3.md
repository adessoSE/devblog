---
layout:			[post, post-xml]											# Pflichtfeld. Nicht ändern!
title:			"Wartbarkeit von Software – Teil 3: Qualität und Automatisierung"	# Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:			2021-04-30 10:00											# Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 	2021-04-30 10:00											# Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author:			bethge_lange												# Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: 	[Softwareentwicklung]										# Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags:			[Wartbarkeit, Qualität, Continuous Integration]				# Bitte auf Großschreibung achten.
---


Eine gut wartbare Software minimiert den Aufwand für Fehlerbehebung, adaptive Wartung und folgende Change Requests deutlich.
Aber was zeichnet gute Wartbarkeit aus und wie können wir diese erreichen?
Nachdem wir uns in den ersten beiden Teilen der Reihe "Wartbarkeit von Software" mit der Dokumentation und den Tests beschäftigt haben, wollen wir uns nun im letzten Teil zuerst kurz mit der Code-Qualität beschäftigen und dann näher auf das Automatisieren von Prozessen im Rahmen von Continuous Integration und Deployment eingehen.

# Code-Qualität

Bei der Übergabe der entwickelten Anwendung erwartet das Wartungsteam eine entsprechende Code-Qualität.
Um die Code-Qualität im Projekt sicherzustellen, muss diese werkzeuggestützt geprüft werden.
Es gibt unterschiedliche Open-Source Werkzeuge (z.B. Sonarqube, ESLint) für verschiedene Programmiersprachen.

Die Konfiguration des eingesetzten Werkzeuges sollte zu Beginn des Projektes zentral erstellt und an das gesamte Entwicklungsteam verteilt werden, so dass der gesamte Code immer auf die gleichen Qualitätsziele geprüft wird.
Abweichungen von der Standardkonfiguration wie z.B. der Ausschluss von bestimmten Prüfregeln müssen dann mit einer kurzen Begründung dokumentiert werden.

Im besten Fall erfolgt die Prüfung der Code-Qualität zentral durch die Integration in ein CI-Tool, z.B. mit SonarQube im Jenkins oder GitLab.
Nach unserer Erfahrung sollte der Buildprozess dabei so konfiguriert werden, das der Build automatisch scheitert, sobald die vorgegebenen Qualitätsziele nicht eingehalten werden.
Somit wird sichergestellt, dass die definierten Qualitätsziele stets erfüllt werden.

Falls die automatisierte Prüfung durch ein CI-Tool nicht möglich sein sollte, muss darauf geachtet werden, dass das gesamte Entwicklungsteam die Werkzeuge selbst einsetzt.
Die gefundenen Mängel müssen korrigiert werden, bevor der Quellcode in die Versionsverwaltung eingecheckt wird.
Die Prüfung der Code-Qualität sollte in diesem Fall als separater Schritt in die Definition of Done und in die Review-Checkliste aufgenommen werden, damit die Code-Qualität fest in den Entwicklungsprozess verankert wird.

Bei der Übergabe an das Wartungsteam sollten die folgenden Grenzwerte eingehalten sein (Beispiel SonarQube):

* Keine offenen Bugs
* Keine offenen Vulnerabilities
* Keine Code Smells vom Typ "Blocker"
* Keine Code Smells vom Typ "Critical"
* Der Anteil von doppeltem Code liegt unter 5%

__Wenn Ausnahmen doch einmal notwendig sein sollten, müssen diese entweder im Quellcode oder im Werkzeug nachvollziehbar begründet sein!__

# Continuous Integration und Deployment

Es gibt gute Gründe, all diejenigen Prozesse, die in einem Entwicklungsprojekt regelmäßig durchzuführen sind und sich im Projektverlauf selten ändern, im Rahmen der Continuous Integration (CI) und des Continuous Deploymens (CD) zu automatisieren.
Der Aufwand, diese Prozesse zu Beginn eines Entwicklungsprojektes einmalig zu automatisieren und dann bei Konfigurationsänderungen anzupassen, ist meist geringer, als der Aufwand, diese Prozesse immer wieder manuell durchführen zu müssen.

Zusätzlich senkt eine Automatisierung das Risiko, Fehler bei der manuellen Durchführung der Prozesse zu begehen und stellt sicher, dass die Prozesse immer auf derselben Umgebung und Konfiguration durchgeführt werden.

Es ist zu bedenken, dass das Ende des initialen Entwicklungsprojektes nicht auch das Ende der Anpassungen an der entwickelten Software ist.
In der anschließenden Wartungs- und Betriebsphase sind weiterhin Fehler zu beheben und es wird nicht selten das Verhalten einer Applikation durch folgende Change Requests erweitert und/oder verändert.
Das Wartungsteam wird die bereits etablierte Automatisierung dann übernehmen und weiterverwenden.
Für eine reibungslose Übergabe ist an zentraler Stelle zu dokumentieren, welche Prozesse automatisiert wurden, wie sie konfiguriert sind und wie diese auszuführen sind.

Zur Unterstützung der Automatisierung gibt es Werkzeuge (z.B. Jenkins, GitLab oder Bamboo), die die Erstellung, Konfiguration, Verwaltung und Durchführung zeitgesteuerter oder auch anders getriggerter Prozesse (Jobs) erlauben.
In Unternehmen mit mehreren Entwicklungsprojekten wird häufig ein solches Werkzeug zentral bereitgestellt.
Dieses sollte im besten Fall auch verwendet werden, um ansonsten anfallende Einarbeitungszeit bei der Übergabe an das Wartungsteam zu sparen.
Zusätzlich entfallen bei Verwendung eines zentral bereitgestellten Werkzeugs die Aufwände und Ressourcen für die Installation, Konfiguration, Aktualisierungen, Berechtigungs-Management und Backup eines eigens für das Projekt eingesetzten Werkzeugs.

Die folgende Grafik zeigt beispielhaft ein Jenkins-Projekt, in dem mehrere Prozesse automatisiert wurden:

![Speicherbedarf unter Last](/assets/images/posts/wartbarkeit-von-software-teil-3/jenkins-job-list.png)

Aber welche Prozesse aus Entwicklung, Build, Test und Deployment sind zu automatisieren?
Wie eingangs bereits erwähnt, bieten sich hierfür alle regelmäßig durchzuführenden, sich selten ändernden Prozesse an.
Im Folgenden zeigen wir eine Konfiguration mehrerer Jobs für eine Automatisierung der Prozesse eines Beispiel-Projekts:

## Build Branch

Nach jedem Push in der Entwicklung muss der Quelltext des zugehörigen Branches von einem Build-Job automatisch kompiliert werden.
Basierend darauf werden dann die Komponententests (z.B. JUnit) und zusätzliche statische Code-Analysen (z.B. SonarQube, SpotBugs, Checkstyle) durchgeführt.
Arbeitet das Entwicklungsteam mit dem empfohlenen Branch-Modell nach Gitflow lässt sich hierfür im CI/CD-Werkzeug ein Job einrichten, der die unterschiedlichen Branches (feature, bugfix, release…) erkennen kann.
Im Jenkins gibt es dafür z.B. das Job-Element Multibranch Pipeline, andere CI/CD-Werkzeuge bieten mittlerweile ähnlich funktionierende Features an.

Der aktuelle Build-Status für einen Branch sollte sich im SCM (z.B. BitBucket) widerspiegeln, dazu sollte der Build-Job im CI/CD-Werkzeug zumindest bei Start, Abbruch und erfolgreichen Durchlauf den Build-Status im SCM-Werkzeug aktualisieren.
Das SCM-Werkzeug wiederum kann dann so eingestellt werden, dass ein Merge des Feature-Branches in den Haupt-Branch erst dann erlaubt ist, wenn mindestens ein erfolgreicher Build durchgeführt wurde.

Die folgende Grafik zeigt beispielhaft einen Pull Request im Bitbucket, bei dem der letzte Build fehlgeschlagenen ist: 

![Bitbucket PR fehlgeschlagen](/assets/images/posts/wartbarkeit-von-software-teil-3/bitbucket-pr-failed.png)

##	Build Version

Täglich bis wöchentlich, im besten Fall schon nach jeder Änderung des Branches mit dem aktuellen Entwicklungsstand (z.B. development) sollte zusätzlich zu den oben genannten Aufgaben ein weiterer Job eine aktuelle Version der Software zusammenstellen (assemble).
Das Ergebnis dieses Prozesses sind ein oder mehrere Artefakte, die auf dieselbe Art gebaut und zusammengestellt werden, wie die Release-Artefakte für das Produktivsystem.
Das erstellte Artefakt dieser Version sollte anschließend automatisiert abgelegt werden (z.B. im Nexus oder Artifactory), um weiteren nachgelagerten Prozessen den Zugriff darauf zu ermöglichen.
Zusätzlich können bereits in diesem Schritt weitere Prüfungen wie z.B. Security- (OWASP) und/oder License-Checks automatisiert durchgeführt werden.
Außerdem kann die Version im SCM mit einem entsprechenden Tag markiert werden.
Im besten Fall können die mit dieser Version erstellten Artefakte als Release Candidate bezeichnet und nach erfolgreichen Tests direkt als Release ausgeliefert werden.

Die folgende Grafik zeigt beispielhaft ein Jenkins-Projekt, in dem mehrere Prozesse automatisiert wurden:

![Speicherbedarf unter Last](/assets/images/posts/wartbarkeit-von-software-teil-3/jenkins-job-create-rc.png)

## Deployments

Täglich bis wöchentlich sollte ein Job den aktuellen Entwicklungsstand auf einer Testumgebung ausrollen, um darauf manuelle Tests durchführen zu können, Fehler reproduzieren zu können oder den Arbeitsfortschritt z.B. in einem Sprint Review präsentieren zu können.
Dazu wird durch einen Job die Testumgebung (z.B. mit Docker oder Ansible) mit der zuvor gebauten aktuellen Version der Software vorbereitet oder komplett neu erstellt, dann konfiguriert und gestartet.

Zusätzlich sollte ein weiterer Job regelmäßig nach jedem Release eine Umgebung mit der aktuell in Produktion ausgerollten Version bereitstellen, um hierauf jederzeit gemeldete Fehler nachstellen und Hotfixes bearbeiten zu können.

## Run Tests

Wöchentlich bis monatlich, zumindest jedoch vor jedem Release, führen ein oder mehrere Jobs Integrations- und Schnittstellentests (z.B. Selenium) sowie Last- und Performance-Tests durch.
Dazu wird durch einen Job automatisiert eine Testumgebung (z.B. mit Docker oder Ansible) mit der zuvor gebauten Version vorbereitet oder komplett neu erstellt, konfiguriert und gestartet.
Dann werden die dem Test zugrundeliegenden Testdaten darauf importiert oder generiert, der Test durchgeführt und abschließend die Testergebnisse gesammelt und abgelegt.
Diese Test-Jobs können z.B. so konfiguriert werden, dass sie direkt nach jedem erfolgreichen Build einer neuen Version ausgeführt werden.

# Fazit

Im letzten Teil der Serie zur Wartbarkeit von Software haben wir uns mit verschiedenen Kriterien beschäftigt, die einen Einfluss auf die Code-Qualität haben und gezeigt, mit welchen Werkzeugen und Prozessen diese während der Entwicklung gemessen und überprüft werden können.
Außerdem haben wir dargestellt, welche Prozesse im Entwicklungsprojekt werkzeuggestützt automatisiert werden sollten.
Die Automatisierung hilft, die Produktivität zu steigern, Fehler rechtzeitig zu erkennen bzw. gar nicht erst zu machen.

Die beiden ersten Teile verpasst?

[Hier geht es zu Teil 1 - Dokumentation](https://www.adesso.de/de/news/blog/wartbarkeit-von-software-teil-1-dokumentation.jsp)

[Hier geht es zu Teil 2 - Tests](https://www.adesso.de/de/news/blog/wartbarkeit-von-software-teil-2-tests.jsp)

# Checkliste

Zur Prüfung, ob alle in dieser Serie genannten Kriterien im Projekt umgesetzt wurden, könnt ihr hier eine Checkliste im PDF-Format herunterladen.

[Checkliste](/assets/images/posts/wartbarkeit-von-software-teil-3/checkliste.pdf)
