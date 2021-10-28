---
layout: [post, post-xml]              # Pflichtfeld. Nicht ändern!
title:  "adesso testing day 2021"     # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2021-10-04 15:00              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
author_ids: [stwacker]
categories: [Inside adesso]           # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Testing]                       # Optional.
---


Um es mit der Herrin Galadriel aus Tolkiens "Der Herr der Ringe" zu sagen: "Die Welt ist im Wandel." Zugegeben: das galt für die IT schon immer. Aber gerade die aktuellen Techniken und Trends stellen den Bereich Software Testing vor neue Herausforderungen. Um diesen Herausforderungen zu begegnen und das Wissen im Unternehmen aktuell und frisch zu halten, veranstaltet adesso jährlich den adesso testing day. In diesem Jahr im September fand er zum achten Mal statt. 

# adesso testing day im hybriden Format

Nachdem letztes Jahr die Corona-Pandemie zuschlug und alle Planungen kurzfristig umgestellt werden mussten, wagte adesso dieses Jahr ein hybrides Format. 
Ermutigt durch sinkende 7-Tages-Inzidenzen, hatten die teilnehmenden adessi die Wahl, entweder Online per Microsoft Teams teilzunehmen oder vor Ort in ausgewählten Geschäftsstellen den Vorträgen zu folgen. 
Dies bot zusätzlich den Vorteil, dass die Veranstaltung aufgezeichnet werden konnte und so Interessierte auch nachträglich die Möglichkeit hatten, die Vorträge offline zu verfolgen. 
Die reinen Vortragsunterlagen sind hier erfahrungsgemäß nicht immer hilfreich. 

Mit über 90 Anmeldungen konnte der Erfolg aus dem letzten Jahr erneut gesteigert werden. 
Auch die im Test so wichtige "Abdeckung" war hier beachtlich: 16 nationale und 6 internationale Standorte aus Bulgarien, Spanien, Türkei und der Schweiz waren vertreten. 
Fachlich kamen die adessi aus 10 LoBs (Lines of Business) bzw. Branchen sowie von 4 adesso-Töchtergesellschaften. 

Gerade bei dem rasanten Wachstum von adesso ist eine Vernetzung der im Testbereich tätigen adessi besonders wichtig, damit das Rad nicht überall neu erfunden werden muss. 
Diese Vernetzung explizit zu fördern, ist auch eins der Ziele des adesso testing days. 
Neben einer expliziten Networking-Session im Speeddating-Format hatten die Teilnehmer die Möglichkeit, sich vor und nach dem Event untereinander und mit den Referentinnen und Referenten in [GatherTown](https://gather.town) auszutauschen.

![Come together in GatherTown](/assets/images/posts/adesso-testing-day-2021/GatherTown.png)

Aufgrund des Live-Online-Formats wurde die Veranstaltung wie bereits letztes Jahr auf zwei halbe Tage aufgeteilt. 
Der erste Teil widmete sich Themen rund um das Testmanagement; der zweite Teil fokussierte die mehr technischen Themen, hier insbesondere die Testautomatisierung.

# Testmanagement im Fokus des ersten Teils

Noch vor wenigen Jahren hatte man als Testmanager das Problem nur wenig passende Tools zu finden. 
Für Spezialaufgaben fand sich oft kein Tool, das einem die notwendige Funktionalität lieferte. 
Dieser Zustand hat sich in den letzten Jahren deutlich gedreht. 
Inzwischen hat man als Testmanager eher die Qual der Wahl bei oft unübersehbarem Werkzeugfeld. 
Hier hilft oft ein Erfahrungsbericht von Kollegen bzw. eine kurze Demonstration der Arbeit mit einem Tool. 
Oft bekommt man so schnell einen Eindruck, ob ein bestimmtes Werkzeug für die Arbeit im konkreten Projekt eine Option darstellt oder nicht. 
Nicht umsonst stellt Attraktivität in der ISO 9126 bzw. Ästhetik in der ISO 25010 ein Qualitätsmerkmal guter Software dar. 
Natürlich darf das Bauchgefühl hier nicht allein entscheiden. 
Viel zu oft erlebt man in angeblich objektiven Werkzeugauswahlen, dass dann doch "zufällig" das Lieblingswerkzeug gewinnt. 

In diesem Rahmen stellte Angelo Yao das Werkzeug [Codebeamer](https://codebeamer.com) und seinen Einsatz im konkreten Projekt vor.

## Externer Vortrag von Micro Focus zu ALM Octane
 
Beim adesso testing day ist es inzwischen zur guten Gewohnheit geworden, einen Blick über den (adesso-) Tellerrand zu werfen und externe Referenten in das Programm zu integrieren. 
Hier sind bereits gute Kooperationen und Partnerschaften entstanden. 
Dieses Jahr konnten wir Micro Focus mit einem guten Vortrag zu [ALM Octane](https://www.microfocus.com/de-de/products/alm-octane/overview) gewinnen. 
Neben einem Vergleich zu anderen populären Testmanagementtools konnten wir auch durch eine Live Demo einen guten Einblick gewinnen. 
Vielen Dank an dieser Stelle an Dirk Hedderich und Jonathan Rhymer.

## PITQM - das Projekt als System betrachten

Aus Fehlern lernen will jeder. 
Dies begann bereits in den 1950er Jahren mit Kaizen bzw. dem kontinuierlichen Verbesserungsprozess und schlägt sich heutzutage im Testbereich in sogenannten Lessons Learned-Workshops in der Aktivität "Testabschluss" des Testprozesses nach [ISTQB](https://www.istqb.org/) wieder. 
Oft beschränkt sich dieser Prozess allerdings darauf, explizit Maßnahmen gegen besonders schlecht bzw. schiefgelaufene Dinge aufzusetzen bzw. gut gelungene Praktiken zu fördern und zu verbreiten.

Bei adesso hat sich seit einigen Jahren eine Projektgruppe gebildet, die diesen Verbesserungsprozess umfassender betrachtet. 
Kernstück ist die Auffassung das Projekt als System zu begreifen, dessen Qualitätsprozesse individuell auf den jeweiligen Kontext zugeschnitten werden müssen. 
Christoph Ostertag berichtete im Rahmen des testing days vom Stand der Dinge. 
Das Modell "PITQM" (Pragmatisches IT-Qualitätsmanagement - angelehnt an das von adesso gerne eingesetzte Vorgehensmodell [PITPM - Pragmatisches IT-Projektmanagement](https://pitpm.net/)) besteht mittlerweile aus den Bausteinen

* Projektrisikoanalyse mit dem adesso-spezifischen Qualitytree,
* Anpassung der Qualitätsprozesse für das jeweilige Projekt und
* Feedback an die PITQM-Community.

![PITQM](/assets/images/posts/adesso-testing-day-2021/pitqm-bicycle.png)

Im Gegensatz dem Lessons-Learned am Ende eines Projektes steht hier der PITQM-Workshop zu Beginn eines Projektes. 
Bereits seit dem Foundation Level von ISTQB wissen wir, dass Testen kontextabhängig ist (sieben Grundsätze des Testens). 
Dies berücksichtigen wir in der Priorisierung der zu behandelnden Qualitätsmerkmale und der Testplanung. 
PITQM geht allerdings noch einen Schritt weiter: hier werden auch die Qualitätsprozesse auf das jeweilige Projekt zugeschnitten.

## Developer Experience mit praktischem Nebeneffekt

Ende-zu-Ende Testautomatisierung mit [cypress](https://www.cypress.io/) - das ist nicht neu; adesso setzt dieses Werkzeug - neben einigen anderen - erfolgreich in vielen Projekten ein. 
Auch Schulungen werden hierzu angeboten, wie üblich von adessi für adessi. 
Tobias Struckmeier zeigte hier den Stand der Dinge und demonstrierte, dass cypress auch für Entwickler, und nicht nur für Tester einen Blick wert ist. 

Dazu führte Tobias noch einen praktischen Nebeneffekt vor: durch die Durchführung von Anwendungsfallbasierten Tests lassen sich durch zusätzlich eingebaute Kommandos an den relevanten Stellen Screenshots erzeugen, die dann für eine immer aktuelle Benutzerdokumentation verwendet werden können. 
Möchte man dieses Konzept noch weitertreiben, dann könnten entsprechende cypress-"Tests" zur Erzeugung der Screenshots in die Seiten eingebettet werden (falls die Nutzerdokumentation in Form einer Wiki-Seite angelegt wird).

Ein entsprechender "Test" sieht dann z.B. so aus

````markdowb

## Main feature

User can enter several todos, and they are added to the list.

![Added three todos](./images/todos.png)

<detailds style="display:none">
<!-- fiddle Adding todos -->
```js
cy.visit('/')
cy.get('.new-todo')
  .type('write in Markdown{enter}')
  .type('code in JavaScript{enter}')
  .type('test in Cypress{enter}')
cy.get('.to-list li').should('have.length', 3)
cy.screenshot('todos')
``` 

<!--- fiddle-end -->
</details>
````

# Technisches Testen im Fokus des zweiten Teils

Im Fokus des zweiten Teils des adesso testing days standen technische Test-Themen wie Securitytests und Testautomatisierung.

## Was macht eigentlich ein Pen-Tester?

Ein Wunsch aus der adesso testing-Community zum adesso testing day war, einmal etwas zum Thema Security-Testing zu hören. 
Da kam es gerade recht, dass adesso vor kurzem ein Competence Center aufgebaut hatte, dass sich genau mit dem Thema beschäftigt.

Marvin Gerlach berichtet über die allgemeine Vorgehensweise und den Alltag eines Pentesters. 
Wir erfuhren etwas über das allgemeine Portfolio des neuen CC IT-Security, beispielsweise

* Sicherheit im Software Development Lifecycle (SDLC)​,
* Threat-Modelling​,
* Entwicklertrainings,​
* Sicherheitskonzepte​,
* Statische und dynamische Codeanalysen​ sowie Code Reviews​,
* SecDevOps​ und
* Segmentation Test (nach PCI DSS)​.

Dann gab es eine kleine Einführung in das Vorgehen beim Pen-Testing. 
Marvin erklärte die verschiedenen Arten von Pentestern (Black Hat, Grey Hat und White Hat) und Pentests (Black Box, Grey Box, White Box) und differenzierte mehrere Typen von Pentests (z.B. Network / Wireless Penetration Testing and Exploitation​, Web Application / Application Penetration Testing and Exploitation​ und Physical Penetration Testing​). 
Dann folgte die Methodik eines Pentesters ausgehend von einem Kickoff über den sich wiederholenden Zyklus Reconnaissance, Enumeration und Exploitation gefolgt von der Dokumentation, einem Retest und einer Abschlusspräsentation.

Jetzt haben wir endlich ein professionelles Team im Securitybereich und durch den testing day wissen wir auch, wen wir bei Bedarf ansprechen können. 
Zum Glück behalten die Kollegen ihr Wissen nicht für sich, sondern bieten für adesso zugeschnittene Trainings an, ganz wie es bei adesso üblich ist.

## Dos and Don'ts bei der Automatisierbarkeit von Webanwendungen

Julian Loschelders beschäftigt sich schon lange mit der Testautomatisierung, insbesondere im Bereich der Webapplikationen. 
In diesem Bereich gibt es immer wieder Hindernisse bei der Testbarkeit, die am besten schon während der Entwicklung berücksichtigt werden sollten. 
Seine Erfahrungen hat er mit uns in seinem Vortrag zu "Dos and Don'ts bei der Automatisierbarkeit von Webanwendungen" geteilt.

Der große Vorteil: dies war nur der Auftakt. 
Andere sind aufgefordert ihr Wissen beizusteuern. 
Julian sammelt und konsolidiert die Punkte. 
Ich bin gespannt was für ein spannendes Tool sich in Zukunft daraus entwickelt.

## Kreativer Einsatz von UFT

Nach der ganzen Theorie war es schön auch die Anwendung eines Testautomatisierungswerkzeugs in der Praxis bzw. in einem konkreten Projekt zu sehen. 
Marco Bormann und Pablo Salvans berichteten von dem Einsatz von [UFT - Unified Functional Testing](https://www.microfocus.com/de-de/products/uft-one/overview) für das Schweizer Wirtschaftsministerium. 
Marco und Pablo beschrieben zunächst die klassische Nutzung von UFT nach Handbuch und zeigten die Schwächen dieses Ansatzes auf. 
Anschließend lieferten die beiden auch gleich eine alternative Anwendung: die Nutzung von UFT wie Selenium.
Dabei werden die folgenden Ansätze genutzt:

* Libraries mit xpath-Daten für Objekte, statt Repositories​
* Libraries zum Bearbeiten der Webseiten statt Actions​
* Datasheets als Datenbanken aufbauen​

## Gamification zur Sicherstellung der Softwarequalität

Aufgrund der engen Anbindung von adesso an diverse Hochschulen, entstehen bei adesso auch pro Jahr viele Bachelor- und Masterabschlussarbeiten - auch im Test- und QS-Bereich. 
Daher ist es inzwischen neben dem Engagement von externen Referenten eine weitere gute Tradition auf dem adesso testing day geworden, über diese Arbeiten zu berichten und die Ergebnisse vorzustellen. 
In diesem Jahr stellte Stefanie Schwilski ihre Masterarbeit "Entwicklung und Evaluation einer Anwendung zur Sicherstellung von Softwarequalität unter Verwendung von Gamification" vor. 
Der Trick lag hier im Vergleich eines Projektes bzw. eines Produkts mit einem virtuellen Freizeitpark a la Rollercoaster Tycoon. 
Qualitätsrelevante Ereignisse im Projekt wurden von Stefanie entsprechenden Vorfällen im Freizeitpark zugeordnet. 
Zum Beispiel könnten Code Smells oder fehlende Ästhetik auf herumliegenden Müll oder braune Pflanzen gemappt werden. 
Stefanie schlug vor etablierte Tools wie zum Beispiel SonarQube entsprechend zu erweitern und so einen Gamification-Ansatz zu nutzen, um die Qualität durch eine erhöhte Motivation der Projektmitarbeiter zu sichern. 
Ein guter und neuer Vorschlag als Abschlussvortrag, der uns an der einen oder anderen Stelle schmunzeln ließ.

# Gelungene hybride Veranstaltung

Auch wenn die Organisation des adesso testing days neben den Projekttätigkeiten immer wieder eine Herausforderung darstellt, so freut man sich doch immer wieder über eine gelungene Veranstaltung.

Corona hat viele Ansätze nur beschleunigt. 
So scheint das hybride Format für den adesso testing day das passende Format zu sein, um die Möglichkeit des persönlichen Austausches mit den Vorteilen geringerer Reisetätigkeit und damit geringerer Reisekosten und Umweltbelastungen zu kombinieren.

Ich freue mich schon auf den nächsten adesso testing day zum 25-jährigen Jubiläum von adesso mit vielen Kollegen vor Ort und noch einmal so vielen im Online-Chat. 
Bis zum nächsten Jahr - bleibt gesund!
