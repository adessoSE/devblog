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
Der erste Schritt in der Transition einer Software von der Entwicklung in die Wartung erfolgt in den meisten Fällen über die bereitgestellte Dokumentation der Software und der Prozesse. Auch in der Wartung spielt die Dokumentation eine wichtige Rolle bei der Analyse von Fehlern. Daher wollen wir uns im ersten Teil dieser Serie mit der Dokumentation von Softwareprojekten beschäftigen.
Die meisten Dokumente, die dem Wartungsteam bei der Transition und in der Wartung helfen, sind heutzutage „state-of-the-art“ in der professioneller Softwareentwick-lung, so dass entweder gar kein oder nur wenig zusätzlicher Aufwand für die Bereitstellung für das Wartungsteam anfällt.
Für eine schnelle Übersicht haben wir am Ende des Artikels die in diesem Artikel ge-nannten Punkte als übersichtliche Checkliste zusammengefasst.


## Anforderungen

###Funktionale Anforderungen 
Als ersten Schritt benötigt das Wartungsteam einen Überblick über die fachlichen Funktionen der Anwendung. Im einfachsten Fall reicht hierfür eine Liste der umgesetzten Anwendungsfälle mit je 2-3 Sätzen Beschreibung. Im besten Fall gibt es eine ausführliche fachliche Spezifikation der Anwendung, die idealerweise auch vom Kunden abgenommen wurde. Eine ausführliche Spezifikation kann dem Wartungsteams vor allem bei der Analyse von fachlichen Fehlern helfen und bei der Unterscheidung zwischen Fehler und Change Request unterstützen.
Falls während der Entwicklung die Anforderungen in einem Ticketsystem gepflegt wurden, ist es hilfreich, wenn diese zur Übergabe an das Wartungsteam in einem zentralen Dokument zusammengefasst werden. Auch wenn während der Entwick-lung die Arbeit mit Tickets sehr hilfreich sein kann, erschwert es jedoch dem Wartungsteam im Nachhinein die Arbeit. Vor allem wenn das gleiche Ticketsystem für die Qualitätssicherung und das Fehlerreporting verwendet wird bzw. wurde, geht so sehr schnell die Übersicht über die umgesetzten Funktionen verloren. Das Dokument muss nicht sehr formal gestaltet sein. Es reicht z.B. eine Liste in einem Word-Dokument, eine Excel-Tabelle oder Collaboration-Raum (z.B. Confluence).

###Nicht funktionale Anforderungen
Neben den funktionalen Anforderungen spielen vor allem die nicht funktionalen Anforderungen eine große Rolle, da diese sich auf die Architektur der Anwendung auswirken und deren Erfüllung einen großen Einfluss auf die Akzeptanz der Software durch den Kunden hat.
Nicht funktionale Anforderungen, die auf jeden Fall betrachtet und dokumentiert sein sollten, sind das zu erwartende Nutzeraufkommen, die einzuhaltenden Antwortzeiten und das zu erwartende Datenaufkommen im produktiven Betrieb. Hierbei sind die durchschnittlichen und maximalen Werte mit dem Kunden abzustimmen und vom Kunden abzunehmen. Wichtig ist dabei auch, dass diese Werte/Annahmen im Hinblick auf die geplante Lebenszeit der Software erhoben werden. Nutzeraufkommen und Datenvolumen steigen typischerweise im Laufe der Zeit, die die Software im Einsatz ist. Dem Wartungsteam dienen diese dokumentierten und abgenommenen Werte als Abgrenzung zwischen Fehler und Change Request.
Für die Dokumentation der nicht funktionalen Anforderungen reicht im einfachsten Fall ebenfalls eine Liste mit einer knappen Beschreibung je Anforderung.

###Standards
Wenn die Anwendung bestimmte Standards oder Verordnungen einhalten muss, wie z.B. BITV 2.0 für Barrierefreiheit oder BSI IT-Grundschutz, sollte dies entsprechend dokumentiert sein. Eine Dokumentation, wie die geforderten Standards in der Software umgesetzt wurden ist ebenfalls hilfreich.


## Architektur

Damit das Wartungsteam den Aufbau der Software schnell erfassen und verstehen kann, muss die Architektur der Software klar und verständlich dokumentiert sein. Im besten Fall wird hierfür eine Dokumentationsvorlage wie z.B. arc42 (https://arc42.org/download) verwendet. Nicht benötigte Abschnitte der Vorlage soll-ten dabei nicht gelöscht, sondern mit einem kurzen Hinweis versehen werden, warum sie nicht benötigt werden.

Falls eine ausführliche Architekturdokumentation, aus welchen Gründen auch immer, nicht möglich sein sollte, sollten doch zumindest die folgenden Artefakte vorhanden sein:
* Ein **Kontextdiagram**, zur Darstellung der Schnittstellen bzw. Grenzen zu den Nutzer(gruppen) und externen Systemen.
* Mindestens eine **Bausteinsicht** der wichtigsten Komponenten und deren Beziehungen untereinander.
* Eine kurze Erläuterung des verwendeten **Architekturmuster**s.
* Eine Liste der **Architekturentscheidungen** inkl. der Problembeschreibung, der berücksichtigten Alternativen und einer Begründung für die getroffene Entscheidung. Architekturentscheidungen sind insbesondere dann zu dokumentieren, wenn kein firmen- und branchentypischer Standard-Stack verwendet wird.
* Eine zentrale Liste der **verwendeten Technologien**, erleichtert dem War-tungsteam vor allem in Microservice-Architekturen oder Multi-Modul Anwendungen die Übersicht und den Einstieg in das Projekt. In kleinen Projekten kann hierauf ggf. verzichtet werden, wenn die verwendeten Abhängigkeiten durch ein geeignetes Build-Tool zentral verwaltet werden (z.B. Maven pom-Datei oder Gradle build-Datei). 
* Die Liste der **technischen Schulden** ist besonders wichtig für das Wartungs-team. Anhand dieser Liste können zukünftige Probleme frühzeitig erkannt und ggf. noch vor dem Auftreten gemindert oder beseitigt werden. 
* Falls an den eingesetzten Bibliotheken und Frameworks **Modifikationen** vorgenommen wurden, müssen diese unbedingt dokumentiert werden, um böse Überraschungen bei der nächsten Aktualisierung eben jener zu vermeiden. 

Für die Übergabe an das Wartungsteam ist es wichtig, dass die Dokumentation der Architektur aktuell ist. Wenn sich während der Entwicklung Änderungen an der Architektur ergeben, müssen diese in die Dokumentation eingepflegt werden.

## Entwicklerdokumentation

Um dem Wartungsteam einen möglichst schnellen Einstieg in die Wartung und Wei-terentwicklung der Software zu ermöglichen, sollte das Entwicklungsvorgehen do-kumentiert sein. Zu den folgenden Themen sollte entsprechende Dokumentation vor-handen.

###Entwicklungsumgebung
Als erster Schritt wird hierbei eine Anleitung für die Einrichtung der Entwicklungsum-gebung benötigt. Im einfachsten Fall ist diese bereits fertig vorkonfiguriert als Docker-Image oder Virtuelle Maschine vorhanden, die die Entwickler nur noch kopieren und starten müssen. Ist dies nicht vorhanden, ist eine Anleitung zur korrekten Einrichtung der IDE sowie der sonstigen genutzten Entwicklungswerkzeuge und Plugins notwen-dig.

###Vorgaben
Falls Entwicklungsvorgaben vorhanden sind, müssen diese ebenfalls dokumentiert und an das Wartungsteam übergeben werden, damit diese Vorgaben auch in der Wartung und Weiterentwicklung weiterhin eingehalten werden können. Dazu gehören z.B. Code Conventions, Guidelines oder ähnliches.

###Versionsverwaltung
Unabhängig davon, wie viele Entwickler an der Software arbeiten, muss eine Versi-onsverwaltung wie z.B. Git eingesetzt werden. Dabei sollten mindestens zwei Bran-ches erstellt und verwendet werden. Einen Masterbranch, der die aktuellste ausgelie-ferte Version der Software beinhaltet und einen Entwicklungsbranch, in dem neue Features für das nächste Release entwickelt und getestet werden. Das konkret ver-wendete Branchmodell (z.B. ein Branch pro Feature, zentrale Entwicklung im Ent-wicklungsbranch oder sonstiges) und die damit verbundenen Prozesse sollten doku-mentiert sein.

###Definition of Done
Im Entwicklungsprojekt muss eine „Definition of Done“ definiert sein, die von allen Entwicklern eingehalten wird. Ein Beispiel für eine solche Definition ist in Abbildung x dargestellt.

###Reviewprozess
Um die Qualität der Anwendung zu erhöhen sollte der Entwicklungsprozess ein Codereview der entwickelten Features durch mindestens eine zweite Person beinhalten. Der Reviewprozess sollte in diesem Fall zentral für alle Entwickler und Reviewer dokumentiert sein. Durch die Verwendung einer Checkliste kann sichergestellt werden, dass jeder Reviewer ein Mindestsatz an Prüfungen durchführt. Eine solche Checkliste kann z.B. folgenden Punkte beinhalten:

* Der Lösungsweg ist im Pull Request oder im zugehörigen Ticket beschrieben.
* Der Code ist ausreichend dokumentiert und kommentiert.
* Die vorgegebenen Guidelines wurden eingehalten.
* Texte für Masken, E-Mails usw. entsprechen den Vorgaben der Spezifikation (falls vorhanden) und enthalten keine Rechtschreib- bzw. Grammatikfehler.
* Es sind UnitTests vorhanden und die Code-Abdeckung entspricht dem vorgegebenen Ziel.
* Es sind ggf. Integrationstests vorhanden.
* Die „Definition of Done“ ist erfüllt.
* Die konfigurierten Codequalitätsziele werden eingehalten.

###Testumgebungen
Während der Entwicklungsphase wird die Software üblicherweise auf eine oder mehrere Testumgebungen deployt und getestet. Da diese Testumgebungen auch vom Wartungsteam verwendet werden, müssen dokumentiert und beschrieben sein. Dazu gehören der Zweck der Umgebung, die Konfiguration, die URL(s) und ggf. die Zugänge. Passwörter sind dabei natürlich in entsprechenden Passwortverwaltungstools zu sichern.
Üblicherweise kommen drei verschiedene Arten von Testumgebungen zum Einsatz: 

* **Entwicklung**: Auf dieser Testumgebung befindet sich immer der aktuellste Entwicklungsstand der Anwendung. Üblicherweise wird diese Umgebung durch ein CI-Werkzeug automatisch, nach jedem Push in den Entwicklungsbranch und anschließendem erfolgreichen Build, aktualisiert. Dort können die Entwickler den aktuellen Stand der Software einsehen und ihre Features außerhalb ihrer lokalen Entwicklungsumgebung testen.
* **Qualitätssicherung**: Auf dieser Testumgebung führt das Qualitätssiche-rungsteam den internen Abnahmetest durch, bevor die Softwareversion an den Kunden ausgeliefert wird. 
* **Test**: Diese Testumgebung wird für automatisierte Tests, wie z.B. Integrati-onstests, Massendatentests sowie Last- und Performancetests verwendet.

###Build und Auslieferung
Um Bugfixes oder neue Releases ausliefern zu können benötigt das Wartungsteam Anleitungen für den Build, das Deployment und die Auslieferung der Software. Im besten Fall erfolgt der Großteil dieser Schritte automatisiert auf Knopfdruck durch ein CI Werkzeug wie, z.B. Jenkins oder GitLab. Ist dies nicht möglich oder wenn zusätzliche Schritte notwendig sind, muss eine Anleitung mit allen notwendigen Schritten erstellt und dem Wartungsteam übergeben werden. Neben den technischen Aspekten muss die Anleitung auch die organisatorischen Aufgaben beinhalten. Dazu gehört z.B. die Liste zu pflegenden Dokumente oder an wen und auf welchem Weg die Auslieferung auf Kundenseite zu erfolgen hat. 


## Betriebshandbuch

Neben der Wartung und der Weiterentwicklung unterstützt das Wartungsteam auch den langjährlichen Betrieb der entwickelten Anwendung. Entweder, indem es selbst für den Betrieb der Anwendung verantwortliche ist oder indem es den Kunden bei Betriebsfragen unterstützt.
Um dem Wartungsteam den Einstieg in den Betrieb zu erleichtern sollte das Be-triebshandbuch mindestens die folgenden Themen beinhalten.
*	Eine Beschreibung der benötigten Server und Komponenten inklusive der Mindestvoraussetzungen.
*	Eine Anleitung zu Installation der kompletten Anwendung inkl. der benötigten Komponenten (Datenbank, Identity Provider, Loggingverwaltung, usw.). Dies kann ggf. auch in einem separaten Installationshandbuch erfolgen. 
*	Eine Anleitung zum Deployment der Anwendung.
*	Eine Liste der anwendungsspezifischen Konfigurationsparameter inkl. einer kurzen Beschreibung und der erlaubten Werte.
*	Eine Beschreibung, wie das Monitoring der Software erfolgt. Dies umfasst sowohl das technische, als auch das fachliche Monitoring der Anwendung.


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

Bei der Übergabe der entwickelten Anwendung erwartet das Wartungsteam eine entsprechende Codequalität.

Um die Codequalität im Projekt sicherzustellen muss diese werkzeuggestützt geprüft werden. Hierzu gibt es unterschiedliche Open-Source Werkzeuge für unterschiedliche Programmiersprachen, die zu diesem Zweck eingesetzt werden können.
Die Konfiguration des eingesetzten Werkzeuges sollte zu Beginn des Projektes zent-ral erstellt und an die Entwickler verteilt werden, so dass der gesamte Code immer auf die gleichen Qualitätsziele geprüft wird. Abweichungen von der Standardkonfiguration, wie z.B. der Ausschluss von bestimmten Prüfregeln, sollten mit einer kurzen Begründung dokumentiert werden.

Im besten Fall erfolgt die Prüfung der Codequalität zentral durch die Integration in ein CI-Tool, z.B. mit SonarQube im Jenkins oder GitLab. Der Buildprozess sollte dabei so konfiguriert werden, das der Build automatisch scheitert, sobald die vorgegebenen Qualitätsziele nicht eingehalten werden. Somit wird sichergestellt, dass die definierten Qualitätsziele stets erfüllt werden.

Falls die automatisierte Prüfung durch ein CI-Tool nicht möglich sein sollte, muss darauf geachtet werden, dass die Entwickler die Werkzeuge selbst einsetzen. Die gefundenen Mängel müssen korrigiert werden, bevor der Quellcode in die Versions-verwaltung eingecheckt wird. Die Prüfung der Codequalität sollte in diesem Fall als separater Schritt in die Definition of Done und in die Review-Checkliste aufgenommen werden, um diese fest in den Entwicklungsprozess zu verankern.
Bei der Übergabe an das Wartungsteam sollten die folgenden Grenzwerte eingehalten sein (Beispiel SonarQube):

*	Keine offenen Bugs
*	Keine offenen Vulnerabilities
*	Keine Code Smells vom Typ “Blocker”
*	Keine Code Smells vom Typ “Critical“
*	Die Code Duplizierung liegt unter 5%

Wenn Ausnahmen doch einmal notwendig sein sollten, müssen diese entweder im Quellcode oder im Werkzeug nachvollziehbar begründet sein!


# Continuous Integration und Deployment

Es gibt gute Gründe, all diejenigen Prozesse, die in einem Entwicklungsprojekt regelmäßig durchzuführen sind und sich im Projektverlauf selten ändern, im Rahmen der Continuous Integration (CI) und des Continuous Deploymens (CD) zu automatisieren.
Der Aufwand, regelmäßige Prozesse zu Beginn eines Entwicklungsprojektes einmalig zu automatisieren und dann bei Konfigurationsänderungen anzupassen, ist meist geringer, als der Aufwand diese Prozesse immer wieder manuell durchführen zu müssen.
Zusätzlich senkt eine Automatisierung das Risiko, Fehler bei der manuellen Durchführung der Prozesse zu begehen und kann sicherstellen, dass die Prozesse immer auf derselben Umgebung und Konfiguration durchgeführt werden.

Dabei ist auch zu bedenken, dass das Ende des initialen Entwicklungsprojektes nicht auch das Ende der Anpassungen an der entwickelten Software sind.
In der anschließenden Wartungs- und Betriebsphase sind noch Fehler zu beheben und es wird nicht selten das Verhalten einer Applikation durch folgende Change Requests erweitert und/oder verändert.
Das Wartungs-Team wird die etablierte Automatisierung übernehmen und weiterverwenden. Für eine reibungslose Übergabe ist an zentraler Stelle zu dokumentieren, welche Prozesse automatisiert wurden, wie sie konfiguriert sind und wie sie auszuführen sind.

Zur Unterstützung der Automatisierung gibt es Tools (z.B. Jenkins, GitLab oder Bamboo), die die Erstellung, Konfiguration, Verwaltung und Durchführung zeitgesteuerter oder auch anders getriggerter Prozesse (Jobs) erlauben.
In Unternehmen mit mehreren Entwicklungsprojekten wird häufig ein zentrales Tool bereitgestellt… dieses sollte im besten Fall auch verwendet werden, um ansonsten anfallende Einarbeitungszeit bei der Übergabe an andere Teams oder Entwickler zu sparen.
Zusätzlich entfallen bei Verwendung eines zentral bereitgestellten Tools immer auch die für ein eigens einzurichtendes Tool benötigten Aufwände und benötigte Ressourcen für Installation, Konfiguration, Aktualisierungen, Berechtigungs-Management und Backup.

Aber welche Prozesse aus Entwicklung, Build, Test und Deployment sind zu automatisieren?
Wie eingangs bereits erwähnt, bieten sich hierfür alle regelmäßig durchzuführenden, sich selten ändernden Prozesse an, die grundsätzlich auch automatisierbar sind.
Im Folgenden zeigen wir eine Konfiguration mehrerer Jobs für eine Automatisierung der Prozesse eines Beispiel-Projekts:

## Build Branch
Nach jedem Push eines Entwicklers muss der Quelltext des zugehörigen Branches von einem Build-Job automatisch kompiliert werden.
Basierend darauf werden dann die Komponententests (z.B. JUnit) und zusätzliche statische Code-Analysen (z.B. SonarQube, SpotBugs, Checkstyle) durchgeführt.
Arbeitet das Entwicklungsteam mit dem empfohlenen Branch-Modell nach Git-flow lässt sich hierfür im CD/CI-Tool ein Job einrichten, der die unterschiedlichen Branches (feature, bugfix, release…) erkennen kann.
Im Jenkins gibt es dafür z.B. das Job-Element Multibranch Pipeline, andere CI/CD-Tools bieten mittlerweile ähnlich funktionierende Features an.
Der aktuelle Build-Status für einen Branch sollte sich im SCM (BitBucket) widerspiegeln, dazu sollte der Build-Job im CI/CD-Tool zumindest bei Start, Abbruch und erfolgreichen Durchlauf den Build-Status im SCM-Tool aktualisieren.
Das SCM-Tool wiederum kann dann so eingestellt werden, dass ein Merge des Feature-Branches in erst dann erlaubt ist, wenn mindestens ein erfolgreicher Build durchgeführt wurde.

## Build Version

Täglich bis wöchentlich, im besten Fall schon nach jeder Änderung des Branches mit dem aktuellen Entwicklungsstand (z.B. development) sollte zusätzlich zu den oben genannten Aufgaben ein weiterer Job eine aktuelle Version der Software zusammenstellen (assemble).
Das Ergebnis dieses Prozesses sind ein oder mehrere Artefakte, die auf dieselbe Art gebaut und zusammengestellt wurden, wie die späteren Release-Artefakte auch.
Diese Version kann dabei automatisiert abgelegt werden (z.B. im Nexus oder Artifactory), um weiteren nachgelagerten Prozessen den Zugriff darauf zu ermöglichen.
In diesem Schritt können bereits weitere Checks wie z.B. Security- (OWASP) und/oder License-Checks automatisiert durchgeführt werden.
Außerdem kann die Version im SCM mit einem entsprechenden Tag markiert werden.
Im besten Fall können die mit dieser Version erstellten Artefakte als Release Candidate bezeichnet werden und nach erfolgreichen Tests direkt als Release ausgeliefert werden.

## Deploy
Täglich bis wöchentlich sollte ein Job den aktuellen Entwicklungsstand auf einer Testumgebung ausrollen, um darauf manuelle Tests durchführen zu können, Fehler zu reproduzieren oder den Arbeitsfortschritt z.B. in einem Sprint Review präsentieren zu können.
Dazu wird durch einen Job die Testumgebung (z.B. mit Docker oder Ansible) mit der zuvor gebauten aktuellen Version der Software vorbereitet oder komplett neu erstellt, dann konfiguriert und gestartet.
Zusätzlich kann ein weiterer Job eine regelmäßig nach jedem Release eine Umgebung mit der aktuell in Produktion ausgerollten Version bereitstellen, um hierauf jederzeit gemeldete Fehler nachstellen zu können und Hotfixes zu bearbeiten.

## Run Tests
Wöchentlich bis monatlich, zumindest jedoch vor jedem Release führen ein oder mehrere Jobs Integrations- und Schnittstellentests (z.B. Selenium) sowie Last- und Performance-Tests durch.
Dazu wird durch einen Job automatisiert eine Testumgebung (z.B. mit Docker oder Ansible) mit der zuvor gebauten Version vorbereitet oder komplett neu erstellt, konfiguriert und gestartet.
Dann werden die dem Test zugrundeliegenden Testdaten darauf importiert oder generiert, der Test durchgeführt und abschließend die Testergebnisse gesammelt und abgelegt.
Diese Test-Jobs können dann z.B. so konfiguriert werden, dass sie direkt nach einem erfolgreichen Build einer neuen Version ausgeführt werden.
