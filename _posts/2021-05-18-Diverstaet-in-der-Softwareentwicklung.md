---
layout: [post, post-xml]              # Pflichtfeld. Nicht ändern!
title:  "Diversität und die Softwareentwicklung"         # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2021-05-18 08:05              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2021-05-18 08:05             # Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author_ids: [vschiller]                       # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: [Softwareentwicklung]     # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Diversität, Qualität]   # Bitte auf Großschreibung achten.
---

Wozu benötigen wir Diversität in der Softwareentwicklung? 
Wir als IT-Dienstleister entwickeln maßgeschneiderte Software für unsere Kundinnen und Kunden und erfüllen dahingehend ihre Wünsche und Anforderungen. 
Diversität ist ein weiteres Anforderungskriterium, welches die Software verbessern und robuster machen kann und ein potenziell besseres Erlebnis für alle mit sich bringt. 
Nicht immer ist es der Sachbearbeiter oder die Sachbearbeiterin, 30 Jahre alt, ohne Beeinträchtigung, technisch fit und deutschsprachig, die die Software bedient, sondern vielleicht auch ein Mensch mit einer Sehstörung, einem Hör- oder Sprachproblem. 
Diese Merkmale beziehen sich vorwiegend auf die Barrierefreiheit, doch es gibt weitere Merkmale, die eine Software diskriminierend wirken lassen können, weil verschiedene Diversitätsmerkmale nicht betrachtet wurden. 
Wie könnte also der vermehrte Einsatz von diesen verschiedenen Merkmalen in Software in Zukunft aussehen? 

# Die Vielfalt der Diversität

Zunächst ist es wichtig, die Vielfalt der Diversität zu kennen, um die Auswirkung auf eine Software einschätzen zu können. So kann sich Diversität unter anderem aufteilen in 

* Alter und Generation
* Lebensentwürfe 
* Körperliche und geistige Fähigkeiten 
* Sexuelle Orientierung
* Geschlecht und Geschlechterrollen
* Kultur und Weltanschauung

Diese Vielfalt lässt sich durch weitere Dimensionen ergänzen und aufteilen.

![Charta der Vielfalt](/assets/images/posts/diversitaet-softwareentwicklung/Diversity-Dimensionen.png)

Doch wozu die Diversitäten der Nutzenden näher betrachten? 
Für ein besseres Erlebnis der Nutzenden, braucht man dafür Diversität? 
Softwareentwicklung entwickelt sich ständig weiter und neue Technologien rücken in den Fokus wie z.B. künstliche Intelligenz (KI). 
Wo vorher in der Softwareentwicklung in diesem Ausmaß keine unbewussten kognitiven Verzerrungen (Unconscious Bias) erkennbar waren, werden sie gerade bei KI Software deutlich. 
Unsere täglichen Helferlein wie Sprachassistenten oder Chatbots erleichtern unser aller Leben. Wenn aber eine Diversitätsdimension als Nutzende ausgeschlossen wurde, kann es schnell unangenehm werden, wie folgende Beispiele zeigen.

# Wo Diversitätsdimensionen nicht betrachtet wurden

* [Bilderkennungssoftware](https://algorithmwatch.org/en/google-vision-racism/), die rassistische Entscheidungen treffen und in schwarzen Händen eher eine Waffe als ein technisches Gerät identifizieren
* [Sprachassistenten](https://www.stern.de/digital/technik/amazons--alexa---bundestags-gutachten-sieht-risiken-in-sprachassistent-8790900.html), die für Kinder Risiken bergen
* Softwarelösungen, die nicht barrierefrei und z.B. für Sehbehinderte nicht erreichbar sind
* [Automatisierte Vorselektion](https://www.heise.de/newsticker/meldung/Amazon-KI-zur-Bewerbungspruefung-benachteiligte-Frauen-4189356.html) von weiblichen Bewerbungen bei gleichen Merkmalen wie männliche Bewerbungen
* Weitere Beispiele finden sich unter: [Plattform lernender Systeme](https://www.plattform-lernende-systeme.de/publikationen-details/kuenstliche-intelligenz-und-diskriminierung-herausforderungen-und-loesungsansaetze.html?file=files/Downloads/Publikationen/AG3_Whitepaper_250619.pdf) oder unter [Algorithmwatch](https://algorithmwatch.org/de/)
 

Meist liegt der Grund bei KI-Lösungen in den Trainingsdaten.
Man darf allerdings nicht vergessen, dass die Ursache der biased Trainingsdaten Menschen sind, die diese Daten durch unbewusste Vorurteile geschaffen haben. 
Bei Softwarelösungen, die keine KI im Einsatz haben, wurden Anforderungen wie die Barrierefreiheit evtl. übersehen, nicht als Anforderung erkannt oder es wurde sich bewusst dagegen entschieden. 
Jedoch sollte die Barrierefreiheit, ähnlich wie bei der IT-Sicherheit die Anforderung der Sicherheit (der Daten) der Nutzenden, kein Luxusgut sein. 
Keiner möchte in der Presse landen, mit der Schlagzeile, dass die angebotene Software, Webseite etc. diskriminierend ist. 
Besonders in der heutigen Zeit, wo das Thema immer mehr an Bedeutung gewinnt, kommen die Fragen der Ethik und Rechte erhöht auf und werden kritischer unter die Lupe genommen als zuvor. 
So greift die KI-Strategie der Bundesregierung zusammen mit Forschungsgruppen der Gesellschaft der Informatik und der Plattform lernende Systeme das Prinzip der Gerechtigkeit (Diskriminierung, Gleichheit etc.) auf und bietet verschiedene Vorschläge zu Gegenmaßnahmen an. 
Zunächst beschreiben sie die Diversität und Vielfalt im Bereich der KI wie folgt:  

[Diversität und Vielfalt im Bereich der KI](https://www.plattform-lernende-systeme.de/files/Downloads/Publikationen/AG3_Whitepaper_EB_200831.pdf): Diversität und Vielfalt im Bereich der KI beziehen sich sowohl auf diverse Teams, bestehend aus Entwicklerinnen und Entwicklern mit unterschiedlichen Perspektiven und Erfahrungshintergründen, als auch auf die Betrachtung der Zielgruppe als heterogene Gruppe. Auch die Einbindung von Perspektiven, die möglichst breit gesellschaftliche Strukturen abbilden, ist aus Perspektive der Diversität wichtig. Für das Training von KI-Systemen muss auf eine Repräsentierung der vielfältigen gesellschaftlichen Gruppen in den Trainingsdaten geachtet werden.

Die Beschreibung bezieht sich auf die Entwicklung von KI, jedoch können einige Punkte auch auf Software ohne KI-Einsatz angewandt werden. 
Welche Möglichkeiten gibt es, damit Software diverser wird? 

## Das diverse Team

Das Wissen über die verschiedenen Diversitätsdimensionen sollte nicht nur auf eine Person begrenzt sein, sondern es wäre optimal, wenn jedes Projektmitglied sensibilisiert ist und bewusst auf diese achtet.
Im besten Fall ist das gesamte Team bereits divers aufgestellt, um verschiedene Blickwinkel auf den Softwareentwicklungsprozess legen zu können. 

Aktuell ist es leider kaum möglich, alle Diversitätsdimensionen in einem Team zusammenzustellen, dafür gibt es z.B. noch zu wenig Frauen in der Softwareentwicklung. 
Dabei hört es aber natürlich nicht auf. 
Wenn wir beispielsweise auch barrierefreie Software entwickeln möchten/müssen/wollen, wäre es ebenfalls eine Option, Menschen mit einer Sehbeeinträchtigung oder -behinderung als Testerinnen und Tester zu beschäftigen, die tagtäglich solche Barrieren überwinden müssen und somit ebenfalls Teil des Teams sind. 

## Die Diversitätsexpertin, der Diversitätsexperte

Eine andere Möglichkeit wäre es, dass eine Diversitätsexpertin oder -experte den Prozess der Softwareentwicklung begleitet. 
Dafür ist eine Diversitätsrichtlinie oder -guideline hilfreich. 
Diese kann Handlungsempfehlungen und Entscheidungsmöglichkeiten zu Beginn des Softwareentwicklungsprozesses aufzeigen. 
Zudem kann diese Fachkraft den gesamten Software Developement Lifecycle begleiten durch:

* die Identifikation und Behandlung von Diversity Aspekten in Anwendungen 
* die Etablierung von Diversity Richtlinien, Standards und Guidelines für Diversity in der Entwicklung, dem Betrieb und der Qualitätssicherung
* die Kontrolle von Einhaltung von Richtlinien
* die Unterstützung von Entwicklungsprojekten
* die Schaffung des notwendigen Diversity Bewusstseins
* Sowie die Durchführung von Programmen zur Verbesserung der Diversity in Anwendungen 

Solche Richtlinien und Guidelines können sich aus den verschiedenen Vielfältigkeitsdimensionen ableiten lassen und auch in die Anforderungen einfließen. 
Manche Fragestellungen ergeben sich bereits durch die Auftraggebenden und deren Anforderungen, andere wurden vielleicht noch gar nicht betrachtet. 
Eine Richtlinie bietet die Möglichkeit ggf. nicht bewusste Anforderungen an Diversität sichtbar zu machen.

Im Bereich der KI-Entwicklung gibt es bereits konkrete Vorschläge für Richtlinien, die der Bund gemeinsam mit der [Plattform lernender Systeme](https://www.plattform-lernende-systeme.de/files/Downloads/Publikationen/AG3_Whitepaper_EB_200831.pdf) erarbeitet hat. 

# Gute Gründe für mehr Diversität in der Softwareentwicklung 

Viele Gründe sprechen für den vermehrten Fokus auf Diversität in der Softwareentwicklung. 
Von Anfang an Diversitätsdimensionen in der Softwareentwicklung zu denken, reduziert auch Kosten, die für evtl. nachträgliche Änderungen in der Software aufkommen könnten. Eine Software nachträglich an die Barrierefreiheit anzupassen ist mit höherem Aufwand verbunden. 
Ein Projektteam so divers wie möglich zu besetzen bringt ebenfalls weitere Vorteile mit sich.
Es verbessert nicht nur die Arbeitsatmosphäre, auch steigt nachweislich die Produktivität des gesamten Teams. 
Zudem werden durch verschiede Perspektiven und breiteres Wissen sowie verschiedenen Lösungsvorschlägen ein besseres Verständnis für Zielgruppen erzielt und somit auch eine bessere Softwarelösung für die Kunden. 

Zudem werden mit dem Einsatz neuer Technologien wie KI unbewusste Vorurteile präsenter und niemand möchte wegen ethischen Verstößen mit Negativbeispielen in der Presse landen. 
Der ethische Wert des Schutzes der Privatheit und der Persönlichkeit sollte im Vordergrund stehen, daher arbeiten IT-Sicherheitsarbeitsgruppen, Recht und Ethikrat in diesem Thema zusammen. 

Zudem haben die Arbeitsgruppen lernender Systeme Umfragen in Unternehmen durchgeführt, bei denen herauskam, dass bereits heute viele Unternehmen Wert auf einen ethisch basierten Entwicklungs- und Anwendungsprozess von KI-Systemen legen. 
Besonders Transparenz, Diskriminierungsfreiheit und Vielfalt sowie Verantwortung beziehungsweise Sicherheit seien als Kategorien hervorzuheben, die die Vertretenden der befragten Unternehmen häufig als wichtige Werte nannten.
Zudem kamen viele Unternehmen zu dem Entschluss, dass die Umsetzung ethischer Werte für sie kein Wettbewerbshindernis ist, sondern vielmehr zum Verkaufsargument werden kann. 
Gleichzeitig stehe für die befragten Unternehmen außer Frage, dass für die Umsetzung ethischer Werte eine echte Notwendigkeit besteht.

# Weitere Empfehlungen

* Der Film "Coded Bias" auf Netflix 
* Das Buch "Keine Panik, ist nur Technik: Warum man auf Algorithmen super tanzen kann und wie wir ihnen den Takt vorgeben" von Kenza Ait Si Abbou
* Das Buch "Unsichtbare Frauen: Wie eine von Daten beherrschte Welt die Hälfte der Bevölkerung ignoriert" von Caroline Criado-Perez
