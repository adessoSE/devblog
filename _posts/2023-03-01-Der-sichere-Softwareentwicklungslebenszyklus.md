---
layout: [post, post-xml]              
title:  "Der sichere Softwareentwicklungslebenszyklus"        
date:   2022-11-22 09:00              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
author_ids: [komenda]                     
categories: [Softwareentwicklung]       
tags: [Security, SDLC, SSDLC]     
---

In diesem Blogpost gehen wir auf den sicheren Softwareentwicklungslebenszyklus ein. Dabei sehen wir uns speziell an, was in den verschiedenen Phasen umgesetzt werden kann.

# Was ist der sichere Softwareentwicklungslebenszyklus?

Entwicklungsteams arbeiten bereits in einem sehr methodischen, sich wiederholenden Prozess - dem Software Development Lifecycle (SDLC) - und es besteht eine große Chance, durch eine Kombination von Bewusstsein, Aktivitäten und Arbeitsabläufen eine bessere Sicherheit in diesen Prozess einzubringen, so dass das Ergebnis eine weitaus sicherere Software wäre. Das ist der sichere SDLC (SSDLC).

# Wieso brauchen wir einen sicheren Softwareentwicklungszyklus?
Die Sicherheit spielt in jeder Phase des Softwareentwicklungszyklus (SDLC) eine Rolle und muss bei der Umsetzung einer Software im Vordergrund stehen. In diesem Artikel erfahren wir, wie wir einen sicheren SDLC (SSDLC) erstellen können, der uns hilft, Probleme in den Anforderungen zu erkennen, bevor wir diese in der Implementierung unserer Software wiederfinden.

Mit entsprechendem Aufwand können Sicherheitsprobleme in der SDLC-Pipeline bereits vor der Produktionsbereitstellung behoben werden. Dadurch kann das Risiko von Sicherheitslücken in einer Applikation verringert werden. Außerdem kann der mögliche Schaden im Risikofall reduziert werden.

Der SSDLC zielt nicht darauf ab, herkömmliche Sicherheitsprüfungen wie Penetrationstests vollständig abzuschaffen, sondern die Sicherheit in den Verantwortungsbereich der Entwickler einzubeziehen und sie zu befähigen, von Anfang an sichere Anwendungen zu entwickeln.

# Warum ist der SSDLC wichtig?

Er ist wichtig, weil die Anwendungssicherheit wichtig ist. Die Zeiten, in denen man ein Produkt in die Öffentlichkeit brachte und Fehler in späteren Patches behoben wurden, sind vorbei. Die Entwickler müssen jetzt bei jedem Schritt des Prozesses auf potenzielle Sicherheitsbedenken Rücksicht nehmen. Dies erfordert die Integration von Sicherheitsaspekten in den Entwicklungszyklus auf eine Art und Weise, die früher nicht nötig war. Da sich jeder potenziell Zugang zu unserem Quellcode verschaffen kann, müssen wir sicherstellen, dass bei der Programmierung mögliche Schwachstellen berücksichtigt werden. Ein stabiler und sicherer SDLC-Prozess ist daher von entscheidender Bedeutung, um sicherzustellen, dass die Anwendung nicht von böswilligen Benutzern angegriffen werden kann.

# Was sind die Prozesse innerhalb des SSDLC?

Der Weg zur Erstellung eines SSDLC beginnt mit einem Modell. Wir werden das in der Branche übliche 5-Stufen-Modell verwenden, das den SSDLC in 5 Phasen unterteilt:
*	Anforderung - Erfassen des Umfangs der Funktion(en) oder des Produkts.
*	Design - Technischer Entwurf der Anforderungen.
*	Entwicklung - Schreiben des Codes, der den Entwurf umsetzt.
*	Testen - Überprüfen, ob die Funktionalität wie erwartet funktioniert.
*	Bereitstellung und Wartung - Freigabe der Funktionalität und kontinuierliche Unterstützung.

Traditionelle Sicherheitstests wurden in den Schritten 4 und 5 als Aktivität vor und nach der Produktivsetzung der Software durchgeführt. Für die moderne Softwareentwicklung ist es wichtig, die Sicherheit in jeden dieser 5 Schritte einzubinden.

# Die Anforderungsphase

Das Schlüsselkonzept besteht hier darin, den Ton anzugeben und die Sicherheitsaspekte des kommenden Produkts oder Produktmerkmals zu definieren. Dies ist eine wichtige Gelegenheit, eine "Sicherheit zuerst"-Mentalität zu fördern und das Bewusstsein der Entwickler zu schärfen.

Ein Beispiel: Es wird ein neuer Benachrichtigungsdienst entwickelt, der die Kunden über wichtige Ereignisse informieren soll. Zu den Sicherheitsanforderungen sollte beispielsweise die Trennung von Benutzern gehören, damit eine Benachrichtigung nie den "falschen" Empfänger erreicht. Werden die Benachrichtigungen auch sensible Daten enthalten? Wenn ja, führt dies zu einer Reihe von Bedenken hinsichtlich Sicherheit und Datenschutz, die berücksichtigt werden müssen.

Das Ziel in dieser Phase sollte sein, ein Bedrohungsmodell (Threat Model) zu erstellen, das während des gesamten Entwicklungszyklus des Produkts oder der Funktion verwendet wird. Dieses Modell sollte auf bewährten Sicherheitspraktiken beruhen, z. B. dem von OWASP definierten Modell.

Das Bedrohungsmodell sollte die Grundlage für eigene Anforderungsbesprechungen sein. Ein empfehlenswerter erster Schritt ist die Planung einer solchen Anforderungsbesprechung unter Verwendung eines generischen Bedrohungsmodells als Vorlage. Definiere in dieser Sitzung die Prinzipien und Leitfäden, die während der Entwicklung und des Testens verwendet werden sollen - was ist wichtig für die Sicherheit? Welches sind die besten Sicherheitsverfahren? Außerdem sollten alle Sicherheitskomponenten festgelegt werden, die im Rahmen des Entwicklungszyklus implementiert werden sollten.

# Die Designphase

In der Regel erstellen die Entwicklungsteams den technischen Entwurf einer Funktion. In unserem Beispiel des Benachrichtigungsdienstes könnte es sich um einen neuen Microservice, eine Message Queue, eine Datenbank zur Speicherung nicht zugestellter Benachrichtigungen oder ähnliches handeln. In dieser Phase müssen wir überprüfen, ob der Sicherheitsentwurf das in der Anforderungsphase erstellte Bedrohungsmodell berücksichtigt.

Hier werden die Sicherheitsmechanismen innerhalb des Entwurfs definiert. Zu den wichtigsten Schritten gehören:
*	Überprüfen der Sicherheitsanforderungen.
*	Durch Brainstorming Schwachstellen und mögliche Designfehler aufdecken. In die Denkweise eines Angreifers hineinversetzen, um Schwachstellen zu finden.
*	Bewerten der verschiedenen Risiken mithilfe von Bedrohungsmodellierungstechniken - geordnet nach dem Gefährdungsgrad und der Wahrscheinlichkeit des Risikos.

Hier ist wichtig, dass die Priorisierung der jeweiligen Aufgaben an das Entwicklungsteam kommuniziert werden. Es muss ersichtlich sein, welche Aufgaben definitiv umgesetzt werden müssen oder welche auch anhand der Wahrscheinlichkeit erst zu einem späteren Zeitpunkt entwickelt werden können.

# Die Entwicklungsphase

Die Einbindung der Sicherheit in die Programmierung bedeutet, dass Entwickler sicheren Code schreiben, Sicherheitsrisiken während der Programmierung beseitigen und dies tun, bevor sie ihre endgültige Version für weitere Tests und den Einsatz vorlegen. Dazu müssen mehrere Dinge berücksichtigt werden:
*	Awareness und Security Mindset - Schulung und Ausbildung würden die Messlatte deutlich höher legen. Es gibt viele Menschen, die mit Codeänderungen interagieren. Eine kontinuierliche Schulung und Aufklärung kann dazu führen, dass Anti-Patterns und Gefahren wie Datenbereinigung, Kommunikationsverschlüsselung und anderes erkannt werden. OWASP stellt viele nützliche Schulungsressourcen zur Verfügung und als erster Schritt ist das Verständnis der OWASP Top 10(Link) ein Muss.
Eine Schulung, die wir gerne auch ausführen ist eine Secure-Coding-Schulung, die auf Basis der OWASP Top 10 aufbaut und ein Mix zwischen Theorie, Praxis und Security-Mindset ist.
*	Code-Scanning - es gibt eine Vielzahl von Codeanalysescannern, die Probleme bereits während des Programmierens aufspüren können. Dazu gehören SAST-Tools und SCA-Tools, diese scannen den eigenen Code oder überprüfen die angebundenen Bibliotheken. Für viele Infrastrukturdeklarationssprachen gibt es einen speziellen Scannertyp namens "Infrastructure-as-Code"-Scanner, kurz IaC-Scanner, der unsichere Konfigurationen aufspüren kann. Es ist wichtig, dass die verwendeten Technologien mit den verfügbaren Scannern abgleichen.
*	Aufbau eines wiederholbaren Prozesses - Erstelle einen operativen Prozess, der beide oben genannten Punkte umsetzt. Lasse die Entwickler die Sicherheitsscan-Tools ausführen, bevor sie ihren Code einreichen, und plane regelmäßige Auffrischungsschulungen für bewährte Sicherheitsmethoden ein. 
Eine mögliche Option für die Integration von Scans in den Prozess sind Quellcode-Verwaltungssysteme (wie Git), die "Pull Requests" verwenden. Hier könnte man bei einem Pull Request einen obligatorischen SAST-Scan ausführen, der die neusten Änderungen vor der Zusammenführung des Quellcodes überprüft. Bei einem negativen Ergebnis kann das jedoch durch speziell benannte Personen überschrieben werden, da dies vielleicht im Anwendungsfall benötigt wird.

# Die Testphase

Diese Phase ist ein wenig verzwickt. Ein echter agiler SDLC bedeutet, dass es keinen linearen Prozess gibt, bei dem alles stehen bleibt und nur noch getestet wird. Die meisten Teams bauen heute eine Art CI/CD-Pipeline auf, in der kontinuierliche Integration stattfindet und die Software ständig getestet wird.

Bei diesem Modell gibt es eine Reihe von Tests, die in mehreren Phasen durchgeführt werden. Einige während der Programmierung, einige nach jeder Codeübermittlung, einige nachts und einige in der Live-Produktionsumgebung.

In der Anforderungsphase muss festgelegt werden, wo die Sicherheitstests durchgeführt werden sollen. Wir haben bereits Tests während der Entwicklungsphase erwähnt. Es ist jedoch möglich, zusätzliche Tests vor der Bereitstellung einzuführen - dies hängt von der Release-Strategie ab.

Zusammenfassend kann man sagen, dass zwei Bereiche für diese Phase wichtig sind:

*	Entscheide auf Grundlage der Release-Strategie, welche Tests gebraucht werden und wo sie benötigt werden.
*	Implementiere diese Tests, vorzugsweise auf automatisierte Weise, damit die Entwickler so schnell wie möglich ein Feedback erhalten.

# Bereitstellung und Wartung

In dieser Phase geht es vor allem darum, einen Reaktionsplan zu haben und den Angriffen einen Schritt voraus zu sein. Es müssen Prozesse entwickelt werden, die es ermöglichen, A) bei Bekanntwerden eines neuen externen Risikos alarmiert zu werden und B) über neue Sicherheitsangriffe, Trends und Lösungen auf dem Laufenden zu bleiben.

*	Such nach externen Risiken - Verfahren wie Penetrationstests sind wichtig. Diese decken Risiken auf, die möglicherweise durch alle bisherigen Sicherheitsschleusen geschlüpft sind. Die sollten regelmäßig durchgeführt werden, um die Chance zu erhöhen, sie zu finden.
*	Umgang mit Warnmeldungen - einige Tools versorgen uns mit Bedrohungsinformationen, die aus neuen Enthüllungen stammen. Die log4shell-Schwachstelle war beispielsweise bereits in der Produktion vorhanden, aber sobald die Schwachstelle vollständig erkannt wurde, alarmierten die SCA-Tools ihre Benutzer und Sicherheitsteams, um die anfälligen Komponenten schnell zu blockieren und zu entfernen. Wir müssen davon ausgehen, dass auch in unseren Anwendungen "0-Day"-Schwachstellen lauern, die jeden Moment entdeckt werden könnten.
*	Bleib auf dem Laufenden über Sicherheitstrends und -technologien - Es ist ein ständiges Wettrüsten zwischen Sicherheitsexperten und Cyber-Kriminellen. Die Sicherheits-Community veröffentlicht neue Bedrohungsmodelle und es gibt ständige Innovationen bei den Sicherheitswerkzeugen und -techniken.

# Die Vorteile eines SSDLC

Secure SDLC ist das ultimative Beispiel für eine so genannte "shift-left"-Initiative, die darauf abzielt, Sicherheitsprüfungen so früh wie möglich in den SDLC zu integrieren.

Darüber hinaus werden bei SSDLC die Sicherheitsmaßnahmen im Kern vom Entwicklungsteam selbst geleitet. So können die Probleme von den Experten behoben werden, die die Software geschrieben haben, und nicht von einem anderen Team, das die Fehler nachträglich behebt. Dies ermöglicht es den Entwicklern, die Verantwortung für die Gesamtqualität ihrer Anwendungen zu übernehmen, was dazu führt, dass sicherere Anwendungen in der Produktion eingesetzt werden.

Der zusätzliche Aufwand für Sicherheitstests im Rahmen des SDLC-Prozesses mag zwar nach viel Arbeit und hohen Kosten für die Erstellung klingen, doch heute wird der größte Teil davon automatisiert. Dies gilt insbesondere für den Entwicklungsbetrieb oder DevOps. Die sichere SDLC-Umgebung erfordert eine häufige Zusammenarbeit zwischen DevOps und den Entwicklern, die die Funktionalität der Anwendung implementieren, und diese Zusammenarbeit muss in den SDLC selbst integriert werden.

Durch die Behebung dieser Probleme in einem frühen Stadium des Prozesses können Entwicklungsteams die Gesamtbetriebskosten ihrer Anwendungen senken. Die späte Entdeckung von Problemen im SDLC kann zu einem 100-fachen Anstieg der Entwicklungskosten führen, die für die Behebung dieser Probleme erforderlich sind, wie in der nachstehenden Grafik dargestellt.

![image](/assets/images/posts/ssdlc/softwaredefectcost.png)
*IBM System Science Institute: Relative Cost of Fixing Defects, 2010*

Wie im Bild dargestellt, ermöglicht die Umstellung auf einen sicheren SDLC den Entwicklungsteams eine schnellere Erstellung sicherer Anwendungen und kann daher für Unternehmen eine lohnende Investition sein.

# Auf dem Weg in eine sicherere Zukunft

Herkömmliche Verfahren zum Testen auf Schwachstellen in der Produktion reichen nicht mehr aus, um die Anwendungen zu sichern. Mit der Entwicklung der Softwarebranche haben sich auch die Arten von Angriffen weiterentwickelt. Um eine sichere Anwendung bereitzustellen und zu warten, muss jeder Schritt des Anwendungsentwicklungsprozesses gesichert werden. Das bedeutet, dass bereits in der Phase der Anforderungserfassung Fragen zum Sicherheitsverhalten gestellt werden müssen. Außerdem müssen die Teamkultur und die Projektmethoden an eine sicherheitsorientierte Denkweise angepasst werden. Automatische Überprüfungen müssen im Deployment-Prozess implementiert und viele andere Methoden ergänzt werden, die zusammen einen sicheren SDLC-Prozess ergeben.

SSDLC ermöglicht es, Sicherheitsrisiken nach links zu verlagern (shift left approach), indem der Ursprung von Sicherheitsproblemen in der Anforderungsphase angegangen werden, anstatt von der Wartungsphase aus zurückgehen zu müssen. Wenn man sich in jeder Phase der Entwicklung auf die Sicherheit konzentrieren, kann man sich sicher sein, dass die Anwendung im Ergebnis viel sicherer ist.
