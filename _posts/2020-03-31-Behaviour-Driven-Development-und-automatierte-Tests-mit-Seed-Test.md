---
layout: [post, post-xml]              # Pflichtfeld. Nicht ändern!
title:  "Behaviour Driven Development und automatisierte Tests mit Seed-Test"         # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2020-03-31 09:00              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2020-03-31           # Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author: dsorna                     # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: [Softwareentwicklung]                    # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Testing, Behaviour Driven Development, Cucumber, Seed-Test]         # Bitte auf Großschreibung achten.
---

Egal ob klassische oder agile Softwareentwicklung – in jedem Entwicklungsprojekt steht man irgendwann vor der Frage, wie die Software getestet werden soll. 
Dabei stößt man auf eine Fülle an Begriffen, Methoden, Ansätzen und Tools. 

Ein bewährter Ansatz ist das Test Driven Development (TDD), welches  eine vollständige Testabdeckung durch Unit-Tests und hochwertigen Code verspricht. 
Doch eine hohe Test-Coverage stellt nicht unbedingt die Funktionalität der Anwendung sicher. 
Das kann erst mit umfangreichen System- & Integrationstest und UI-Tests erreicht werden.

Die hinter TDD liegende Idee ist aus Anforderungen direkt Tests abzuleiten und erst anhand dieser Code zu schreiben. 
Die Idee lässt sich auch über Unit-Tests hinaus auf weitreichendere Tests übertragen.
Dabei kann das sog. **Behaviour Driven Development (BDD)** helfen.

### Das Problem: Costs of Translation

In einem standardisierten Requirements Engineering Prozess werden Anforderungen identifiziert, oft von Business Analysten oder anderen Mitarbeitern aus dem Fachbereich formuliert und an die Entwicklung überreicht. 
Der Entwickler muss diese fachliche Anforderung daraufhin in Code übersetzen. 
Da die Entwicklung aber ein anderes Verständnis von den jeweiligen Anforderungen hat als der Fachbereich, der die Anforderung definiert hat, kommt es in manchen Fällen zu Übersetzungsfehlern. 
Bei solchen Fehlern handelt es sich nicht um Bugs, sondern um vermeidbare Fehler im Kommunikationsprozess. 
Ein ähnlicher Übersetzungsprozess findet beim Ableiten von Tests aus Anforderungen statt.

Solche Fehler fallen oft erst auf, wenn die Funktionalität in der Anwendung landet, getestet und rückgemeldet wird. 
Abhängig davon wie viel Zeit vergeht, bis der Fehler entdeckt wird, entstehen Kosten – die sog. **Costs of Translation**. 
Ein kürzerer Entwicklungszyklus kann demnach die Costs of Translation senken.

### Anforderungen gemeinsam mit Beispielen definieren

Um Cost of Translation jedoch ganz zu vermeiden, muss bereits bei der Beschreibung der Anforderung angesetzt werden. 
Beim Behaviour Driven Development kommen die **Business-Analyse**, die **Entwicklung** und das **Qualitätsmanagement** zusammen und beschreiben gemeinsam die Anforderung. 
Die drei Parteien bauen ein gemeinsames Verständnis für das gewünschte Verhalten der Software auf. 

Um die Anforderungsbeschreibung möglichst einfach zu gestalten kann die Methode [Example Mapping](https://cucumber.io/blog/bdd/example-mapping-introduction/) herangezogen werden. 
Beispiele sind eine wunderbare Möglichkeit, um komplizierte Sachverhalte einfach darzustellen. 
Mehrere Beispiele decken dabei mögliche Fälle und Ergebnisse ab. Eine Anforderung kann mit einigen klaren Beispielen genau beschrieben werden, ohne Unklarheiten offen zu lassen. 
Die Beispiele sollten die Frage beantworten: Wie soll sich die Software bei bestimmten Eingaben und Interaktionen verhalten? 

### Automatisierung mit Cucumber

Nun stellt sich noch die Frage, ob und wie eine Automatisierung solcher Tests möglich ist. Hier hilft das Automatisierungstool **Cucumber**. 
Die Bespiele werden in **Gherkin** – eine durch Schlüsselwörter strukturierten Sprache, die nah an der natürlichen Sprache ist –  beschrieben und können damit in Schritte gegliedert und automatisiert werden. 
Den Schritten wird dann Code hinterlegt, der die entsprechende Funktionalität testet. 
Die Beispiele, oder **Szenarien** wie sie in Cucumber genannt werden, können ausgeführt werden und geben ein Testergebnis zurück. 

Der große Vorteil von Cucumber und Gherkin ist, dass Testfälle in einer beinahe natürlichen Sprache definiert werden können und damit für jeden verständlich sind. 
Die Szenarien werden in einem Editor geschrieben und können nahezu frei formuliert werden. 
Das macht es aber gleichzeitig fehleranfällig und sehr aufwändig umzusetzen, da zu jedem unterschiedlichen Schritt eine Ausführung hinterlegt werden muss.

### Seed-Test

Unsere Anwendung Seed-Test versucht genau dieses Problem zu lösen. 
Durch das Vorgeben vordefinierter Schritte wird sichergestellt, dass alle Schritte des Scenarios eine funktionierende Ausführung hinterlegt haben. 
Der Anwender kann die Tests sofort ausführen und erhält als Ergebnis einen anschaulichen Report.
Ein weiteres Ziel von Seed-Test ist, das Erstellen von Tests soweit zu vereinfachen, dass auch Anwender ohne Programmierkenntnisse Testfälle definieren können. 
Die Schritte sind so aufgebaut, dass nur noch die gewünschten Eingabe- und Ausgabewerte eingetragen werden müssen. 
Anstatt dem Nutzer ein leeres Dokument ohne Anhaltspunkte zu präsentieren, kann dieser ein Szenario Schritt für Schritt zusammenbauen.
Ein simpler Testfall mit nur vier Schritten sieht folgendermaßen aus:

![Beispiel für ein Szenario in Seed-Test](/assets/images/posts/bevaviour-driven-development-und-automatisierte-tests-mit-seed-test/scenario-screenshot.jpg)
 
Seed-Test ist eine Open Source Web-Anwendung und auf [GitHub](https://github.com/adessoAG/Seed-Test) zu finden. 
Sie wurde mit dem MEAN-Stack (MongoDB, ExpressJS, AngularJS und NodeJS) umgesetzt. 
Zur Automatisierung der Schritte werden Cucumber und Selenium eingesetzt. 
Die Szenarien sind durch eine Anbindung an ein Ticketsystem direkt mit den Anforderungen verbunden. 
Mit den bisher definierten Schritten können Webapplikationen getestet werden. 

Seed-Test gibt es über Heroku auch als [Demo-Version](https://seed-test-frontend.herokuapp.com/) zum Ausprobieren. 

Für Fragen und Feedback meldet euch gerne bei seed-test@adesso.de

### Fazit

Behaviour Driven Development (BDD) fördert die Zusammenarbeit zwischen Business-Analyse, Entwicklung und Qualitätsmanagement. 
Es versucht die Cost of Translation, die beim Übertragen von Anforderungen in Code und Testfälle entstehen, zu minimieren. 
Mit Cucumber wird die Automatisierung von Tests nach BDD möglich, bringt aber auch Probleme mit sich. 
Unsere Open Source Anwendung Seed-Test löst einige dieser Probleme und macht Cucumber und BDD für eine breitere Nutzergruppe zugänglich.
