---
layout: [post, post-xml]              # Pflichtfeld. Nicht ändern!
title:  "adesso testing day 2020"     # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2020-07-08 15:00              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
author_ids: [stwacker]                      # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: [Inside adesso]       # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Testing]                       # Optional.
---


Das Coronavirus hat viele Auswirkungen - auch der adesso testing day mit seiner inzwischen siebten Auflage war betroffen. Beim adesso testing day handelt es sich um eine adesso-interne Konferenz zum Austausch zwischen allen am Thema Testing interessierten adessi – Bereichs- und Geschäftsstellenübergreifend. 


# adesso testing day als Online-Format

Der adesso testing day ist inzwischen zur festen Institution für die Testing Community der adesso geworden. 
Da neben den Fachvorträgen auch der persönliche Austausch und das Networking wichtiges Element der Veranstaltung sind, fand der testing day bisher immer als Präsenzveranstaltung in den Räumlichkeiten unseres Dortmunder Hauptsitzes statt. 
Doch mit Corona wird alles anders - auch beim testing day.
Mit bis zu 80 Teilnehmern hätten wir den Sicherheitsabstand selbst in unseren neuen Räumlichkeiten nicht einhalten können. 
Eine Absage kam für uns allerdings auch nicht in Frage - dafür war uns der testing day zu wichtig. 
Daher wurde das Format von einer Präsenzveranstaltung zu einer Teams-Konferenz umgestellt. 
Da Online-Konferenzen zum Teil deutlich anstrenger sein können als ein Präsenztermin, wurden die Vorträge auf zwei Termine aufgeteilt. 
Die sonst explizit eingebaute WarmUp-Networking-Session entfiel.

![Testing Day 2019](/assets/images/posts/adesso-testing-day-2020/adesso-testing-day-2019.jpg)


# Testen in der Produktentwicklung

Den Anfang machten zwei Vorträge rund um das Thema Testen im Kontext einer Produktentwicklung. 
adesso hat schon seit einiger Zeit Produkte und Lösungen im Angebot, so zum Beispiel mit infocus eine Lösung für Lotteriegesellschaften oder über das Tochterunternehmen eSpirit die CMS-Lösung FirstSpirit, die auch in vielen adesso-Projekten eingesetzt wird. 
Neu ist neben der adesso insurance solutions als Produkthaus für Versicherungslösungen die adesso health solutions, die ein Produkt für die gesetzlichen Krankenkassen anbietet.

Oliver Jordan stellte die adesso health solutions mit dem Produkt KVAI vor und berichtete über die im Produktkontext eingesetzten QS-Maßnahmen:

* Orientierung am Lehrplan des International Software Testing Qualification Boards
* Testaktivitäten beginnen frühestmöglich im SWE-Prozess
* Risikobasierte Testplanung 
* Hohe Verfolgbarkeit der Softwaretests
* Möglichst niedriger manueller Testaufwand 
* Fertigstellung der Testfälle vor Codeerzeugung (Idealfall)

Im Anschluss komplettierte Timo Weber das Bild durch einen Einblick in die Qualitätsoffensive der adesso insurance solutions. 
Die getroffenen Maßnahmen waren unter anderem:

* Erstellung eines Muster QS-Plans
* Besetzung eines Qualitätsmanagers
* Etablierung eines QS-Wikis
* Schulung über priorisierte QS-Maßnahmen (unter anderem über die Nutzung des Testmanagementwerkzeugs SpiraTest) 
* Etablierung eines Regeltermins zum Austausch und zum Tracking der geplanten Maßnahmen


# Testen mit KI-Unterstützung

Verfahren der künstlichen Intelligenz sind in aller Munde - nicht erst mit der Vision eines selbstfahrenden Autos. 
Auch adesso bietet mit der gestarteten [KI-Kampagne](https://ki.adesso.de/de/) bereits diverse Dienstleistungen rund um das Thema KI. 
Für den Test stellt sich die Herausforderung, wie ein sich ständig veränderndes, weil selbstlernendes System getestet werden soll. 
Hiermit beschäftigt sich bereits eine Arbeitsgruppe der Testing Community. 
Aber auch der umgekehrte Ansatz ist interessant: wie kann der Softwaretest durch KI-Methoden unterstützt werden? 
Die Firma [eggplant](https://www.eggplantsoftware.com/) bietet mit ihren Produkten entsprechende Ansätze über die Antony Edwards (COO eggplant) und Max Gerrard (VP Global Technical Services eggplant) in Ihrem Vortrag "Eggplant – Intro to applying Artificial Intelligence (AI) and Machine Learning to automate QA to help support a new culture of working, to deliver DevOps at scale and optimize your customer’s User' Experiences (UX)" berichteten.


# PITQM

Nachdem bereits im letzten Jahr über die Möglichkeiten zur Etablierung kontinuierlicher QM-Prozessverbesserung diskutiert wurde, berichteten Kolja Dütsch und Kirsten Strack vom Stand der Dinge. 
Rund um das Thema PITQM - angelehnt an das von adesso gerne eingesetzte Vorgehensmodell [PITPM - Pragmatisches IT-Projektmanagement](https://pitpm.net/) - hat sich seit dem letzten testing day eine Projektgruppe gebildet, die sich um die Einführung und Weiterentwicklung dieses Themas kümmert.

![PITQM](/assets/images/posts/adesso-testing-day-2020/pitqm.jpg)


# Viele Themen rund um das Thema Testautomatisierung

Insgesamt gab es beim diesjährigen testing day einen deutlichen Schwerpunkt rund um das Thema Testwerkzeuge im allgemeinen bzw. Testautomatisierung im besonderen. 
Auch die Einführung der Zertifizierung zum ISTQB Test Automation Engineer zeigt das große Interesse und auch den großen Bedarf an KnowHow in diesem Bereich. 

## Einsatz bestehender Werkzeuge

Tobias Schmitz zeigte in seinem Vortrag, wie ein modelbasierter Test einer mobilen Anwendung mit Tricentis Tosca aussehen kann. 
Dass man im Gegensatz zur landläufigen Meinung doch nicht auf ewig bei dem einmal eingeführten Testwerkzeug bleiben muss, zeigte der Vortrag von Christian Heinrich und Esien Novruzov. 
Sie berichteten über einen Wechsel von Protractor zu Cypress.io, um endlich stabile Ende-zu-Ende Tests zu erreichen. 
Den vielen Vorteilen (unter anderem Video-Aufnahmen der Tests, Möglichkeiten zur Zeitreise und Mocking des Backends) standen nur wenige Nachteile gegenüber (zum Beispiel Cross Origin Probleme im Chrome Browser, keine Unterstützung von Iframes und fehlende Unterstützung des Browser-Tab-Wechsels).

## Eigenentwicklungen

Einem anderen Problem widmete sich die Projektgruppe Seed-Test. 
Innerhalb eines Projektes besteht oft das Problem, dass sich der Fachbereich mit der Domäne auskennt während das technische KnowHow bei Entwicklern zu finden ist. 
Als Lösung wurde teilweise versucht, den Fachbereich zu befähigen, Software selber entwickeln zu können - meist mit geringem Erfolg, weil mit zu viel Aufwand verbunden. 
Eine andere Lösung ist, beide Teams näher zusammenzubringen, wie es agile Modelle gerne vorführen. 
Dies bringt sicherlich viele Vorteile, löst aber das Grundproblem leider nicht. 
Auch im Bereich der Testautomatisierung existiert das gleiche Problem: aufgrund speziellem KnowHows liefert Team A die fachlichen Testfälle und Team B automatisiert diese mit einem speziellen Framework. 
Über den Ansatz, dies zu verbessern, berichteten Felix Sommer und Daniel Sorna. 
Sie stellten das Projekt Seed-Test vor, das Behaviour-Driven-Development mit der Sprache Gherkin mit einem Selenium-gesteuerten Record-And-Play-Mechnismus verbindet. 
Über dieses Projekt wurde hier bereits [in einem Blog-Artikel](https://www.adesso.de/de/news/blog/behaviour-driven-development-und-automatisierte-tests-mit-seed-test.jsp) berichtet. 
Das Projekt wurde mittlerweile als Open-Source-Projekt auf [GitHub](https://github.com/adessoAG/Seed-Test) veröffentlicht.

![Testing Day 2019](/assets/images/posts/adesso-testing-day-2020/seed-test.jpg)


# Die Qual der Wahl oder die Wahl der Qual - wie finde ich eine passende Testmanagementunterstützung

Neben der konkreten Arbeit mit einem Werkzeug stellt sich oft die Frage, welches Werkzeug für eine konkrete Aufgabe bzw. für ein bestehendes Projekt am besten geeignet ist. 
Während noch vor einigen Jahren die Suche nach einem speziellen Werkzeug eher ergebnislos blieb, hat man heute vielfach eher die Qual der Wahl. 
Michael Menz berichtete von einer adesso Studie zu verbreiteten Testmanagementwerkzeugen für einen Kunden und gab so den Teilnehmern des adesso testing days ein Hilfsmittel an die Hand, um zukünftig selber schnell eine Auswahl von Werkzeugen treffen zu können.


# Gelungene Veranstaltung - trotz Corona

Der kurzfristig auf ein Online-Format umgestellte adesso testing day 2020 zeigte mit über 70 Teilnehmern das konstant große Interesse am Thema Testing, an der Qualität der Vorträge und die große Kompetenz der adesso in diesem Bereich. 
Dieses Jahr waren bereits 8 Gesellschaften aus 6 Ländern vertreten. 
Nichtsdestotrotz freue ich mich, alle Kollegen im nächsten Jahr wieder persönlich vor Ort begrüssen zu dürfen.
Bis zum nächsten Jahr - bleibt gesund!
