---
layout:			[post, post-xml]											# Pflichtfeld. Nicht ändern!
title:			"Wartbarkeit von Software – Teil 2: Tests"					# Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:			2021-01-18 00:00											# Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 	2021-01-18 00:00											# Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author:			bethge_lange												# Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: 	[Softwareentwicklung]										# Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags:			[Wartbarkeit, Softwaredokumentation]						# Bitte auf Großschreibung achten.
---


Eine gut wartbare Software minimiert den Aufwand für Fehlerbehebung, adaptive Wartung und folgende Change Requests deutlich.
Aber was zeichnet gute Wartbarkeit aus und wie können wir diese erreichen?
Nachdem wir uns im ersten Teil der Reihe "Wartbarkeit von Software" mit der Dokumentation beschäftigt haben, wollen wir nun in Teil 2 näher auf die Tests eingehen.
Dazu beschäftigen wir uns mit den unterschiedlichen Testarten, mit Automatisierung und Testumgebungen und verdeutlichen die Notwendigkeit einer hohen Testabdeckung.

# Einleitung

Das Wartungs-Team wird die Aufgabe haben, vom Kunden gemeldetes Fehlverhalten möglichst schnell in einer dem Produktivsystem ähnlichen Umgebung (Integrations- oder Test-Stage) zu reproduzieren.
Basierend auf der folgenden Fehleranalyse wird dann der Quell-Code korrigiert werden müssen.
Auch für fachliche Änderungen (Change Requests), die in der Wartungs- und Betriebs-Phase umzusetzen sind, wird der Quell-Code angepasst werden.
Aber Code-Anpassungen können Seiteneffekte haben, vor allem, wenn Sie an zentraler Stelle vorgenommen werden.

In den meisten Fällen besteht das Wartungs-Team aus weniger Mitarbeitern als das für die ursprüngliche Entwicklung verantwortliche Team.
In gleichem Maße ist auch die zur Verfügung stehende Zeit und das Budget häufig deutlich kleiner.
Trotzdem wird vom Kunden zurecht erwartet, dass die komplexe Fachlichkeit und Technik der Software bereits bei der ersten Fehlerbehebung verstanden wird und weitere Code-Anpassungen mit ebenso hoher Qualität wie in der vorangegangenen Neuentwicklung erfolgen.

__Um dem Wartungs-Team Sicherheit zu geben, dass die vorgenommenen Änderungen keine unerwünschten Seiteneffekte auf andere Anwendungsfälle haben, ist eine möglichst hohe Testabdeckung durch die unterschiedlichen automatisierten Testmethoden unerlässlich.__

Wäre die Testabdeckung fachlicher Anwendungsfälle gering oder schlimmstenfalls gar nicht vorhanden, müsste das Wartungs-Team bei der Behebung eines Fehlers die gesamte Fachlichkeit kennen.
Zusätzlich müsste nach einer Code Änderung ein vollständiger manueller Systemtest wiederholt werden, in gleichem Umfang wie er zur Abnahme durchgeführt wurde.
Nur so wäre sichergestellt, dass die vorgenommene Änderung korrekt, vollumfänglich und frei von Seiteneffekten ist.

Umfängliche Unit Tests, automatisierte Integrations-Tests und regelmäßige Last- und Performance-Tests sind zur Erhaltung der Qualität für das Wartungs-Team sehr wertvoll.
Damit das Wartungs-Team diese Tests bestmöglich und schnell nutzen kann, müssen sie in einer Test-Umgebung automatisiert sowie Inhalt und Durchführung gut dokumentiert sein.

# Unit Tests

Wie schon häufig beschrieben, ist es unerlässlich, dass Unit Tests (Modul- bzw. Komponententests) überhaupt vorhanden sind.
Diese Anforderung gilt dabei nicht nur für Backend-Code (z.B. Java) sondern gleichermaßen auch für den im Webumfeld in den letzten Jahren wieder wachsenden Anteil an Frontend-Code (z.B. Javascript, Angular).

Der Quell-Code der Unit Tests sollte in Bezug auf Lesbarkeit und Robustheit von gleicher Qualität wie der Anwendungs-Code selbst sein.
Der Unit Test sollte so geschrieben sein, dass der in der Komponente umgesetzte fachliche Anwendungsfall nicht nur technisch geprüft wird, sondern auch das gewünschte Verhalten der Komponente aus dem Quell-Code abgelesen werden kann.

Alle vorhandenen Unit Tests müssen im Rahmen der Continuous Integration so automatisiert sein, dass sie nach jeder Änderung (jedem Push) schnellstmöglich ein Ergebnis liefern.
Das bedeutet, dass ein Werkzeug zur Code Analyse (z.B. SonarQube) bereitgestellt und konfiguriert wird.
Dieses kann die Metriken zur Testabdeckung direkt nach einem Push erheben und diese gegen ein für das Projekt definiertes Qualitätsziel (Quality Gate) prüfen.
Sollte die Prüfung fehlschlagen kann das Entwicklungsteam automatisch und zeitnah durch eine E-Mail informiert werden.

Aber wie hoch sollte die Testabdeckung durch Unit Tests denn nun sein?
Diese Frage ist viel diskutiert und dieser Artikel ist nicht dazu gedacht, eine abschließende Antwort für jedes Projekt zu finden.
Jedoch zeigt die Erfahrung aus Projekten, die bereits erfolgreich in Wartung übernommenen wurden, dass mit einer guten Planung, einem hohen Stellenwert für die Tests und entsprechender Konfiguration des Code Analyse Werkzeugs (z.B. Ignorieren von automatisch generiertem Code) eine hohe Testabdeckung jenseits der 80% mit vertretbarem Aufwand durchaus erreichbar ist.

Es ist wichtig, dass für das Einrichten, die Verwaltung, das Konfigurieren und das regelmäßige Nachjustieren der automatisierten Code Analyse entsprechend Zeit und Budget bereitgestellt werden.
Die dafür benötigten Arbeitspakete müssen bereits in der Angebotserstellung und Kalkulation für das neue Entwicklungsprojekt eingeplant werden.

Direkt zu Projektbeginn ist zu klären, welches Werkzeug und welche Metriken der Code Analyse für das Projekt zugrunde liegen sollen.
Wird im eigenen Unternehmen ein solches Werkzeug bereits zentral bereitstellt, sollte dieses auch zusammen mit einem Standard-Set an Metriken (z.B. Condition-Coverage) verwendet werden, da dies Aufwand und Budget im Projekt spart und eine weitestgehend einheitliche Qualität der Tests im Unternehmen fördert.
Eine Abweichung vom Standard-Werkzeug und -Set ist in der Projektdokumentation nachvollziehbar zu dokumentieren.

Die folgende Grafik zeigt beispielhaft die mit dem Werkzeug [EclEmma](https://www.eclemma.org) in der Entwicklungsumgebung Eclipse ermittelte Code-Coverage (Abdeckung) eines Unit-Tests:

![Darstellung der Code Coverage in Eclipse mit EclEmma](/assets/images/posts/wartbarkeit-von-software-teil-2-tests/grafik-eclemma.png)

Bei all den hier beschriebenen Tätigkeiten sollte jedoch nie vergessen werden, was einen guten Unit Test eigentlich auszeichnet.
Zu sagen, der Test ist grün und hat eine Code Coverage von über 80%, erfüllt zwar auf den ersten Blick die Anforderung, wäre jedoch bei weitem nicht ausreichend.
Ein guter Unit Test prüft die fachliche Anforderung in allen Aspekten, also auch die Grenzfälle, und ist für Dritte gut lesbar und verständlich.
Zur Bewertung der Qualität eines Unit Tests hilft häufig auch die Antwort auf die folgende Frage:

__Schlägt der Test fehl, sobald der zu testende Anwendungs-Code so geändert wird, dass danach die fachliche Anforderung nicht mehr korrekt umgesetzt ist?__

# Integrations- und Schnittstellentests

Während Unit Tests die korrekte Funktionalität der kleinsten Einheiten, nämlich einzelner, in sich geschlossener Komponenten der Software, sicherstellen, prüfen Integrationstests die Funktionalität, wenn mehrere solcher Komponenten zusammenarbeiten.
Zusätzlich prüfen Schnittstellentests die Korrektheit der zwischen den Komponenten ausgetauschten Daten.
Auch hierfür gilt aus Sicht der Wartung die Anforderung, dass entsprechende Tests während der Neuentwicklung der Software bereits mit hoher Testabdeckung umgesetzt und möglichst automatisiert und regelmäßig durchgeführt werden.

## Testaufbau

Für einen Integrationstest werden einige, bereits durch Unit Tests getestete Einzelkomponenten zu einer neuen Komponente zusammengefügt und das Zusammenwirken der Einzelkomponenten getestet.
Die dabei entstandene neue "größere" Komponente kann dann wiederum in Kombination mit weiteren Komponenten getestet werden.
Im Ergebnis wird somit das gesamte System in Komponenten zerlegt.
Zusätzlich gilt es dann noch, die Daten, die über die Schnittstellen zwischen den Komponenten ausgetauscht werden, durch geeignete Schnittstellentests zu prüfen.

Beispielhaft besteht eine einfache Webanwendung aus einer Frontend- und einer Backend-Komponente.
Deren fachliches Zusammenwirken soll durch Integrationstests (z.B. mit Selenium) getestet werden.
Frontend und Backend bestehen dabei aus unterschiedlichen Einzel-Komponenten, deren Fachlichkeit bereits durch entsprechende Unit-Tests sichergestellt wurden.
Zwischen Frontend und Backend existiert eine Schnittstelle, für die ein entsprechender Schnittstellentest (z.B. mit SoapUI oder Postman) umzusetzen ist.

## Testabdeckung

Nun zur Frage, wie hoch die Testabdeckung durch fachliche Integrationstests sein muss.
Zumindest alle Kernfunktionalitäten sollten abgedeckt sein.
Da für den Rest jedoch auch immer eine Betrachtung von Kosten und Nutzen sinnvoll ist, kann die Liste aller Anwendungsfälle durch eine Gewichtung in 3 Kategorien eingeteilt werden:

__Kategorie A__  umfasst alle geschäftskritischen Kernprozesse der Anwendung.
Sie sind dauerhaft in Verwendung und dürfen nicht ausfallen.
Mindestens 80% sollten mit einem Test für den Positivfall und zwei Tests für Negativfälle abgedeckt sein.

__Kategorie B__  umfasst alle Standardprozesse der Anwendung.
Sie werden regelmäßig verwendet und führen zu einer starken Beeinträchtigung, wenn sie ausfallen.
Mindestens 70% sollten mit einem Test für den Positivfall und einem Test für Negativfälle abgedeckt sein.

__Kategorie C__  umfasst alle sonstigen Prozesse der Anwendung.
Sie werden selten verwendet und/oder führen nur zu einer geringen Beeinträchtigung, wenn sie ausfallen.
Mindestens 50% sollten jeweils mit einem Test für den Positivfall abgedeckt sein.

## Mocks

Häufig ist es für einen Integrationstest notwendig, Schnittstellen zu Komponenten, die in diesem Test nicht direkt getestet aber benötigt werden, zu simulieren.
Gleiches gilt für Schnittstellen zu Umsystemen, die manchmal nicht in einer Testumgebung zur Verfügung gestellt werden können.
Dazu können Mock-Services (z.B. mit SoapUI) implementiert werden.
Deren Konfiguration, Funktionsweise und fachliches Verhalten sind so zu dokumentieren, dass das Wartungsteam diese verstehen, aufsetzen und ggf. an geänderte Anforderungen anpassen kann.

## Testdaten

Für Integrations- und Schnittstellentests werden während der Neuentwicklung der Software Testdaten erstellt.
Manchmal werden auch echte Daten anonymisiert als Testdaten vom Kunden bereitgestellt.
Diese sollten so aufgebaut sein, dass sie der Fachlichkeit so nah wie möglich kommen.
Es ist zu dokumentieren, wie die Testdaten aufgebaut sind und welche Schritte notwendig sind, um sie zum Zeitpunkt eines Testlaufs korrekt in die Datenbank einzuspielen.
Im besten Fall erfolgt dies automatisiert im Rahmen einer Continuous Integration (z.B. in einer Datenbank im Docker Container).

# Last- und Performancetests

Um sicherzustellen, dass eine neu entwickelte Software im produktiven Betrieb den geforderten, nichtfunktionalen Anforderungen genügt, sind entsprechende Last- und Performance-Tests zu implementieren.
Diese Tests sind so umzusetzen, dass sie einerseits das maximal zu erwartende Nutzerverhalten (die zu erwartende Last) simulieren und andererseits eine Aussage über den zu erwarteten Ressourcen-Bedarf und die notwendige Skalierung treffen können.

Zur Durchführung der Last- oder Performance-Tests kann ein entsprechendes Werkzeug (z.B. Gatling, JMeter) so konfiguriert werden, dass es automatisiert Anwendungsfälle in gewünschter Häufigkeit, Parallelität und Last-Veränderung (Erhöhung, Senkung) auf einem eigens dafür bereitgestellten Testsystem ausführt.
Das Testsystem muss dabei dem späteren Produktivsystem so ähnlich wie möglich sein.
Dies betrifft nicht nur die verwendete Hardware und die Anbindung von Umsystemen, sondern auch die Menge und Qualität der auf dem Testsystem vorzubereitenden Testdaten.
Hierzu sollten die in einer Mengenbetrachtung ermittelten Anzahlen der im Produktivbetrieb zu erwartenden Entitäten, Aggregate, Sessions, Nutzer usw. verwendet werden.
Zusätzlich ist unbedingt auf fachliche Qualität, Stimmigkeit und Konsistenz der Testdaten zu achten.

Aber welche Anwendungsfälle sind für einen Last- oder Performance-Test auszuwählen?
Erstens sind zumindest Kernanwendungsprozesse, die am häufigsten benutzt werden im Einzelnen zu prüfen.
Zweitens sollte ein Test implementiert werden, der einen Mix aus unterschiedlichen Anwendungsfällen gleichzeitig ausführt.
Und drittens sind diejenigen Prozesse zu identifizieren und zu prüfen, die mit hoher Wahrscheinlichkeit einen negativen Einfluss auf die Performance haben werden.
Dazu zählen unter anderem Prozesse, die auf vielen Daten arbeiten und/oder einen komplexen Algorithmus implementieren (z.B. lang laufende Reports).

Im Projekt muss vorab entsprechend Zeit und Budget bereitgestellt werden, um die unterschiedlichen Tests planen zu können und die zu ermittelnden Kennzahlen sowie das Performance-Ziel (Grenzen) zu definieren.
Anschließend sind zu Projektbeginn das Testsystem aufzusetzen und zu konfigurieren, die Continuous Integration zu erweitern und natürlich die Tests so früh wie möglich umzusetzen.

Die folgende Grafik zeigt an einem Beispiel den zeitlichen Verlauf des Speicher-Bedarfs einer Software unter Last:

![Speicherbedarf unter Last](/assets/images/posts/wartbarkeit-von-software-teil-2-tests/grafik-lasttest-speicher.png)

Um eine Veränderung der Performance frühzeitig erkennen zu können, sind die Last- und Performance-Tests während der Entwicklungs-Phase in regelmäßigen Abständen (z.B. ein mal pro Sprint oder ein mal im Monat) auszuführen.
Voraussetzung dafür ist jedoch, dass die funktionalen Tests (Unit-, Integrations- und Schnittstellentests) vorab erfolgreich durchgeführt wurden, also keine Fehler in den funktionalen Anforderungen bestehen.
Nach der Testausführung müssen die ermittelten Kennzahlen zusammengetragen und gegen das Performance-Ziel geprüft werden.
Ein Test sollte immer dann fehlschlagen, wenn eine der Kennzahlen die vorab definierten Grenzen (das Performance-Ziel) über- oder unterschreitet.

Aufgrund der regelmäßig durchzuführenden Tätigkeiten rund um die Last- und Performance-Tests bietet es sich an, diese ebenfalls zu automatisieren und in eine Continuous Integration Pipeline zu integrieren.
Im besten Fall schlägt dann ein Pipeline-Build (Job) fehl, weil das Performance-Ziel für die aktuelle Version (Sprint) nicht erreicht wurde.

In jedem Fall muss an zentraler Stelle dokumentiert werden, welche Last- und Performance-Tests es gibt, wie diese durchzuführen sind, welche Testdaten zu verwenden sind, welche Kennzahlen zugrunde liegen und wie das Performance-Ziel definiert ist.
Außerdem sind die Testergebnisse der einzelnen Testläufe an geeigneter Stelle zu protokollieren.

Beispielhaft sind hier einige mögliche Messpunkte und -werte aufgeführt, die sich als Kennzahlen je nach Art der Software und Art der nichtfunktionalen Anforderungen ermitteln lassen (z.B. durch JavaMelody):

* Antwortzeit (Durchschnitt, Percentil, Min, Max)
* Maximal erreichbare Anzahl gleichzeitiger Nutzer bzw. Anwendungsfälle pro Nutzer
* Arbeitsspeicher-Bedarf (Min, Max, Durchsatz, Garbage-Collection)
* CPU-Auslastung, Anzahl paralleler Threads
* Laufzeit von Datenbank-Abfragen (Min, Max, Abhängigkeit von der Datenmenge)

# Testumgebungen

Während Unit-Tests zum Build-Zeitpunkt auf dem aktuellen Code-Stand im Rahmen der Build-Umgebung ausgeführt werden, wird für die anderen Testarten (Integrations-, Schnittstellen-, Last- und Performance-Tests) die fertig gebaute Software auf einer eigens dafür konfigurierten Umgebung ausgerollt und diese konfiguriert.
Dafür sind meist mehrere passende Testumgebungen (Test-Stages) bereitzustellen, die im besten Fall so konfiguriert sind, dass sie der späteren produktiven Umgebung in jedem Aspekt so nahe wie möglich kommen.
Das betrifft zum Beispiel die folgenden Punkte:

* Ressourcen (CPU, Arbeitsspeicher, Festplatte)
* Software (Betriebssystem, Java-Version, …)
* Laufzeit-Umgebung (Application- oder Web-Server)
* Umsysteme (Schnittstellen, Test-Systeme des Kunden)

Die Erzeugung und Konfiguration der Test-Stages sollte möglichst automatisiert erfolgen (z.B. durch Docker, Ansible).
Dazu kann im Rahmen der Continuous Integration durch einen der Testausführung vorgelagerten Schritt die benötigte Testumgebung sauber aufgebaut und konfiguriert werden.
Dann liegt dem folgenden Testlauf nicht nur die aktuelle Version der Software zugrunde, es werden auch gleich aktuelle Testdaten und eine sich möglicherweise veränderte Konfiguration der Umgebung (z.B. Tomcat-Version) herangezogen.

Eine der Testumgebungen kann explizit bereitgestellt werden, damit das QS-Team während der Entwicklung laufend manuelle Tests und spätestens zur Abnahme der Software den vollständigen Systemtest durchführen kann.
Außerdem kann diese Umgebung regelmäßig zur Präsentation des aktuellen Entwicklungsstandes (z.B. im Sprint Review) dienen und zusätzlich zur Reproduktion auftretender Fehler verwendet werden.

# Fazit

Durch automatisierte Tests unterschiedlicher Art, Granularität und Abdeckung sollen Sicherheit und Schnelligkeit für nach Go-Live umzusetzende Code-Anpassungen erhöht werden.
Wir haben dazu Kriterien vorgestellt, die als Grundlage für die spätere Übergabe einer Software in das Application Management (die Wartung) zu beachten sind.
Wichtig ist, dass zur Erfüllung dieser Kriterien Tätigkeiten notwendig sind, die bereits in den ersten Phasen eines Softwareentwicklungsprojektes einzuplanen sind!

# Ausblick

Im dritten und letzten Teil dieser Serien werden wir uns abschließend mit Code-Qualität sowie Continuous Integration und Deployment beschäftigen.
