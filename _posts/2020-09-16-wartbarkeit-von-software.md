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
In einem größeren Unternehmen, das ein solches Tool bereits zentral bereitstellt, bietet es sich in jedem Fall an, dieses auch zu verwenden und mit einem Standard-Set an Metriken (z.B. Line- oder Condition-Coverage) zu beginnen.
Eine Abweichung vom Standard-Tool und –Set muss dann natürlich in der Projektdokumentation nachvollziehbar niedergeschrieben sein.

Bei all den hier beschriebenen Tätigkeiten, sollte jedoch nie vergessen werden, was  einen guten Unit Test eigentlich auszeichnet.
Zu sagen, der Test ist grün und hat eine Code Coverage von über 80% erfüllt zwar auf den ersten Blick die Anforderung, wäre jedoch bei weitem nicht ausreichend.
Ein guter Unit Test prüft die fachliche Anforderung in allen Aspekten, also auch die Grenzfälle, und ist für Dritte gut lesbar und verständlich.
Zur Bewertung der Qualität eines Unit Tests hilft häufig auch die Antwort auf die folgende Frage:

__Schlägt der Test fehl, sobald der zu testende Anwendungs-Code so geändert wird, dass danach die fachliche Anforderung nicht mehr korrekt umgesetzt ist?__

## Integrations- und Schnittstellentests 

Während Unit Tests die korrekte Funktionalität der kleinsten Einheiten, nämlich einzelner, in sich geschlossener Komponenten der Software sicherstellen, prüfen Integrationstests die Funktionalität, wenn mehrere solcher Komponenten zusammen arbeiten.
Zusätzlich prüfen Schnittstellentests die Korrektheit der zwischen den Komponenten ausgetauschten Daten.
Auch hierfür gilt aus Sicht der Wartung die Anforderung, dass entsprechende Tests während der Neuentwicklung der Software bereits mit hoher Testabdeckung umgesetzt wurden und möglichst automatisiert und regelmäßig durchgeführt werden.

In der Theorie werden bei einem Integrationstest einige, bereits durch Unit Tests getestete Einzel-Komponenten zu einer neuen Komponente zusammengefügt und deren Zusammenwirken getestet.
Die dabei entstandene „größere“ neue Komponente kann danach wieder als vollständig getestete Einzel-Komponente angesehen und wiederum in Kombination mit weiteren Komponenten getestet werden.
Im Ergebnis wird somit das gesamte System in Komponenten geschnitten, wobei der Schnitt anhand fachlicher und/oder technischer Grenzen vorgenommen wird und je nach Projekt und angewendeten Technologien unterschiedlich ausfällt.
Zusätzlich gilt es dann noch, die entstandenen Schnittstellen zwischen den Komponenten durch geeignete Schnittstellentests zu prüfen.
Dabei werden lediglich noch die Daten geprüft, die über diese Schnittstelle zwischen den Komponenten ausgetauscht werden.

Beispielhaft besteht eine Webanwendung aus einer Frontend- und einer Backend-Komponente, deren fachliches Zusammenwirken (z.B. mit Selenium) getestet werden kann.
Frontend und Backend bestehen wiederum aus unterschiedlichen Einzel-Komponenten, deren Fachlichkeit bereits durch entsprechende Unit-Test geprüft wurde.
Zwischen Frontend und Backend existiert dann noch eine Schnittstelle für die ein Schnittstellentest (z.B. mit SoapUI oder Postman) umzusetzen ist.

Nun zur Frage, wie hoch die Testabdeckung  durch fachliche Integrationstests sein muss.
Zumindest alle Kernfunktionalitäten sollten abgedeckt sein.
Da für den Rest jedoch auch immer eine Betrachtung von Kosten und Nutzen sinnvoll ist, kann die Liste aller Anwendungsfälle durch eine Gewichtung in 3 Kategorien eingeteilt werden:

* Kategorie A umfasst alle geschäftskritischen Kernprozesse der Anwendung.
Sie sind dauerhaft in Verwendung und dürfen nicht ausfallen.
Mindestens 80% sollten mit einem Test für den Positivfall und zwei Tests für Negativfälle abgedeckt sein.
 
* Kategorie B umfasst alle Standardprozesse der Anwendung.
Sie werden regelmäßig verwendet und führen zu einer starken Beeinträchtigung, wenn sie ausfallen.
Mindestens 70% der B-Prozesse sollten mit einem Test für den Positivfall und einem Test für Negativfälle abgedeckt sein.

* Kategorie C umfasst alle sonstigen Prozesse der Anwendung.
Sie werden selten verwendet und/oder führen nur zu einer geringen Beeinträchtigung, wenn sie ausfallen.
Mindestens 50% der C-Prozesse sollten jeweils mit einem Test für den Positivfall abgedeckt sein.

Häufig ist es für einen Integrationstest notwendig, Schnittstellen zu Komponenten, die in diesem Test nicht direkt getestet aber benötigt werden, zu simulieren.
Gleiches gilt für Schnittstellen zu Umsystemen, die manchmal nicht in einer Testumgebung zur Verfügung gestellt werden können.
Dazu können Mock-Services (z.B. mit SoapUID) implementiert werden, deren Konfiguration, Funktionsweise und fachliches Verhalten so dokumentiert sein muss, dass das Wartungs-Team diese verstehen und aufsetzen kann.

Für Integrations- und Schnittstellentests wurden während der Neuentwicklung der Software Testdaten erstellt oder vom Kunden bereitgestellt werden.
Diese sollten so aufgebaut sein, dass sie der Fachlichkeit so nah wie möglich kommen.
Es ist zu dokumentieren, wie diese Testdaten aufgebaut sind und welche Schritte notwendig sind, damit die Daten zum Zeitpunkt eines Testlaufs korrekt eingespielt werden können.
Im besten Fall passiert dies bereits automatisiert im Rahmen einer Continuous Integration (z.B. in eine DB im Docker Container).

## Last- und Performancetests

Um sicherzustellen, dass eine neu entwickelte Software im späteren produktiven Betrieb den geforderten, nichtfunktionalen Anforderungen genügt, sind entsprechende Last- und Performance-Tests zu implementieren.
Diese Tests sind so umzusetzen, dass sie einerseits zumindest das zu erwartende Nutzerverhalten (die zu erwartende Last) simulieren und andererseits eine Aussage über den zu erwarteten Ressourcen-Bedarf und die notwendige Skalierung treffen können.

Zur Durchführung der Last- oder Performance-Tests kann ein entsprechendes Tool (z.B. Gatling, JMeter…) so konfiguriert werden, dass es automatisiert Anwendungsfälle in gewünschter Häufigkeit, Parallelität und Last-Veränderung (Erhöhung, Senkung) ausführt… und zwar auf einem eigens dafür bereitgestellten Testsystem.
Das Testsystem muss dabei dem späteren Produktivsystem so ähnlich wie möglich sein.
Das betrifft nicht nur die verwendete Hardware und die Anbindung von Umsystemen, sondern auch die Menge und Qualität der auf dem Testsystem vorzubereitenden Testdaten.
Hierzu sollten die in einer Mengenbetrachtung ermittelten Anzahlen der im Produktivbetrieb zu erwartenden Entitäten, Aggregate, Sessions, Nutzer usw. verwendet werden.
Zusätzlich ist unbedingt auf fachliche Qualität, Stimmigkeit und Konsistenz der Testdaten zu achten.

Aber welche Anwendungsfälle sind für einen Last- oder Performance-Test auszuwählen?
Erstens sind zumindest Kernanwendungsprozesse, die am häufigsten benutzt werden im Einzelnen zu prüfen.
Zweitens sollte ein Test implementiert werden, der einen Mix aus unterschiedlichen Anwendungsfällen gleichzeitig ausführt.
Und drittens sind diejenigen Prozesse zu identifizieren und zu prüfen, die mit hoher Wahrscheinlichkeit einen negativen Einfluss auf die Performance haben werden.
Dazu zählen unter anderem Prozesse, die auf vielen Daten arbeiten und/oder einen komplexen Algorithmus implementieren (z.B. lang laufende Reports).

Im Projekt muss vorab entsprechend Zeit und Budget bereitgestellt werden, um die unterschiedlichen Tests planen zu können und die zu ermittelnden Kennzahlen und das Performance-Ziel (Grenzen) zu definieren.
Dann sind zu Projektbeginn das Testsystem aufzusetzen und zu konfigurieren, die Continuous Integration zu erweitern und natürlich die Tests so früh wie möglich umzusetzen.

Um eine Veränderung der Performance frühzeitig erkennen zu können, sind die Last- und Performance-Tests während der Entwicklungs-Phase in regelmäßigen Abständen (z.B. 1-mal pro Sprint oder 1-mal im Monat) auszuführen.
Voraussetzung dafür ist jedoch, dass die funktionalen Tests (Unit-, Integrations- und Schnittstellentests) vorab erfolgreich durchgeführt wurden, also keine Fehler in den funktionalen Anforderungen bestehen.
Nach der Testausführung müssen die ermittelten Kennzahlen zusammengetragen und gegen das Performance-Ziel geprüft werden.
Ein Test sollte dann immer fehlschlagen, wenn eine der Kennzahlen die vorab definierten Grenzen (das Performance-Ziel) über- oder unter-schreitet.

Aufgrund der regelmäßig durchzuführenden Tätigkeiten rund um die Last- und Performance-Tests, bietet es sich an, diese ebenfalls zu automatisieren und in eine Continious Integration Pipeline zu integrieren.
Im besten Fall schlägt dann ein Pipeline-Build (Job) fehl, weil das Performance-Ziel für die aktuelle Version (Sprint) nicht erreicht wurde.

In jedem Fall muss an zentraler Stelle dokumentiert werden, welche Last- und Performance-Tests es gibt, wie diese durchzuführen sind, welche Testdaten zu verwenden sind, welche Kennzahlen zugrunde liegen und wie das Performance-Ziel definiert ist.
Außerdem sind die Testergebnisse der einzelnen Test-Läufe an geeigneter Stelle zu dokumentieren.

Beispielhaft sind hier einige mögliche Kennzahlen, Messpunkte und -werte aufgeführt, die je nach Art der Software und Art der nichtfunktionalen Anforderungen zu ermitteln sein können:

* Antwortzeit (Durchschnitt, Percentil, Min, Max)
* Maximal erreichbare Anzahl gleichzeitiger Nutzer bzw. Anwendungsfälle pro Nutzer
* Arbeitsspeicher-Bedarf (Min, Max, Durchsatz, Garbage-Collection)
* CPU-Auslastung, Anzahl paralleler Threads
* Laufzeit von Datenbank-Abfragen (Min, Max, Abhängigkeit von der Datenmenge)
* …

## Testumgebungen

Während Unit-Tests zum Build-Zeitpunkt auf dem aktuellen Code-Stand im Rahmen der Build-Umgebung ausgeführt werden, wird für die anderen Testarten (Integrations-, Schnittstellen-, Last- und Performance-Tests) die fertig gebaute Software auf einer eigens dafür konfigurierten Umgebung ausgerollt und diese konfiguriert.
Dafür sind meist mehrere passende Testumgebungen (Test-Stage) bereitzustellen, die im besten Fall so konfiguriert sind, dass sie der späteren produktiven Umgebung in jedem Aspekt so nahe wie möglich kommen.
Das betrifft zum Beispiel die folgenden Punkte:

* Ressourcen (CPU, Arbeitsspeicher, Festplatte)
* Software (Betriebssystem, Java…)
* Laufzeit-Umgebung (Application- oder Web-Server)
* Umsysteme (Schnittstellen, Test-Systeme des Kunden)

Die Erzeugung und Konfiguration der Test-Stages sollte möglichst automatisiert erfolgen (z.B. durch Docker, Ansible…).
Dazu kann im Rahmen der Continuous Integration durch einen der Testausführung vorgelagerten Schritt die benötigte Testumgebung sauber aufgebaut und konfiguriert werden.
Dann liegt dem folgenden Testlauf nicht nur die aktuelle Version der Software zugrunde, es werden auch gleich aktuelle Testdaten und eine sich möglicherweise veränderte Konfiguration der Umgebung (z.B. Tomcat-Version) herangezogen.

Eine der Testumgebungen kann explizit bereitgestellt werden, damit das QS-Team während der Entwicklung laufende manuelle Tests und spätestens zur Abnahme der Software den vollständigen Systemtest durchführen kann.
Außerdem kann diese Umgebung dann regelmäßig zur Präsentation des aktuellen Entwicklungsstandes (z.B. Sprint Review) dienen und zusätzlich zur Reproduktion auftretender Fehler verwendet werden.

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
