---
layout: [post, post-xml]              # Pflichtfeld. Nicht ändern!
title:  "Das Saga-Muster als Zutat für erfolgreiche Systeme"         # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2023-08-13 10:25              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2023-08-13 10:25             # Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author_ids: [earaujo]       # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesen Namen geben.
categories: [Softwareentwicklung]     # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Microservices, Resilience, Saga]   # Bitte auf Großschreibung achten.
---
Um eine Microservicearchitektur erfolgreich umzusetzen, muss man unterschiedliche Aspekte berücksichtigen.
Dazu gehört unter anderem: Wie gehen wir mit Transaktionalität um? 
Wie soll das System reagieren, wenn mitten in einem verteilten fachlichen Vorgang ein Fehler auftritt?
In diesem Artikel schauen wir uns Lösungen für diese Problemstellung an.

# Transaktionalität in Microservicearchitekture

Stell dir vor, du versuchst, einen Kuchen zu backen.
Du nimmst alle Zutaten, mischst sie zusammen und schiebst den Teig in den Ofen.
Du stellst jedoch fest, dass du den Zucker vergessen hast.
Also nimmst du den Teig aus dem Ofen, fügst den Zucker hinzu und schiebst ihn wieder hinein.
Klingt einfach, oder?
Aber was wäre, wenn du diesen Kuchen in einem Restaurant mit 10 verschiedenen Küchenstationen backen müsstest, die jeweils von einem anderen Koch geleitet werden, und jede Station einen Arbeitsschritt ausführen müsste, um den Kuchen fertigzustellen?
Und um alles noch schwieriger zu machen, spricht auch noch jeder Koch eine andere Sprache.
Dann wird das Kuchenbacken zu einem Albtraum.

Diese Analogie steht für das Problem, mit dem die Microservicearchitektur bei der Implementierung komplexer Geschäftstransaktionen konfrontiert werden kann.
An dieser Stelle kommt das Saga-Muster ins Spiel.


# Was ist das Saga-Muster?

Das Saga-Muster ist ein Entwurfsmuster, das für die Implementierung komplexer Geschäftstransaktionen in der Microservicearchitektur verwendet wird.
Es stellt sicher, dass die Datenkonsistenz über mehrere Microservices hinweg erhalten bleibt, indem es eine große Transaktion in kleinere, überschaubare Schritte aufteilt.
Das Muster wird "Saga" genannt, weil es ähnlich funktioniert wie eine Geschichte oder eine Reise, die in kleinere Segmente unterteilt wird, von denen jedes sein eigenes Ergebnis hat, das zum Gesamtergebnis der Reise beiträgt.

# Wie funktioniert das Saga-Muster?

Bei einer Saga wird eine komplexe Transaktion in mehrere Schritte unterteilt.
Diese werden jeweils in unterschiedlichen Teiltransaktion innerhalb eines Service ausgeführt.
Am Ende jeder Transaktion wird ein Ereignis ausgelöst, das über den abgeschlossenen Prozess informiert und gleichzeitig den nächsten Schritt in der Saga bei einem anderen Service anstößt.

![image](/assets/images/posts/das-saga-muster-als-zutat-für-erfolgreiche-systeme/saga-orchestrator.png)
_Beispiel einer Saga für einen Bestellvorgang.._

Im obigen Diagramm können wir am Beispiel eines E-Commerce-Bestellvorgangs sehen, wie das Saga Pattern agiert:  
Nach Eintreten des Auslösers (_Bestellung bestätigt_), werden die Teiltransaktionen der Saga schrittweise innerhalb jedes Microservice ausgeführt.
Nachdem jeder Service seine internen Vorgänge abgeschlossen hat, wird ein Ereignis ausgelöst, das den nächsten Schritt anstößt.
Am Ende ist der Zustand des Gesamtsystems in einem neuen, konsistenten Zustand.

Bei einem Fehlschlag Mitten in der Saga werden wiederum Ereignisse in umgekehrter Richtung ausgelöst, die sogenannte "kompensierende Transaktionen" anstoßen sollen.
Diese sorgen dafür, dass bei jedem beteiligten Service die vorher vorgenommenen Schritte rückgängig gemacht werden.
Somit wird garantiert, dass die Datenkonsistenz über Microservices hinweg erhalten bleibt.

![image](/assets/images/posts/das-saga-muster-als-zutat-für-erfolgreiche-systeme/saga-orchestrator-error.png)
_Beispiel einer Saga für einen Bestellvorgang mit kompensierenden Transaktionen._

# Arten von Sagas

Bei Sagas gibt es eine Hauptunterteilung in zwei verschiedenen Arten:

## Choreografie

Choreografie-Sagas orientieren sich an unserem oben genannte Beispiel:
Die Microservices, die Teil einer Saga sind, interagieren und steuern selbstständig den gesamten Ablauf.

Eine Choreografie-Saga kann man mit einem einfachen Kochabend mit Freunden vergleichen.
Der Anzahl der Beteiligten ist überschaubar und die Schritte zur Zubereitung der Zutaten einfach.
Folglich, ist es nicht notwendig, dass eine dedizierte Person den ganzen Prozess steuert.

Bei der Choreografie kommunizieren die Microservices direkt miteinander, um die Teiltransaktionen auszuführen.
Jeder Microservice kennt seine eigenen Aufgaben und den Kontext der Transaktion.
Die Kommunikation erfolgt in der Regel asynchron über Events oder Nachrichten.
Jeder Microservice führt seine Aufgaben aus und löst die entsprechenden Events aus, um den nächsten Microservice in der Sequenz zu informieren.
Dies setzt voraus, dass sich die einzelnen Microservices koordinieren können, um den Transaktionszustand aufrechtzuerhalten.
Es besteht kein zentraler Kontrollpunkt, der die Ausführung überwacht.

Diese Art von Saga ist in der Regel einfach umzusetzen und eignet sich gut für kurzlaufenden Transaktionen mit wenigen Schritten, wo kein Tracing notwendig ist und es keinen Bedarf gibt, den Transaktionsstatus zu tracken.

Auf der anderen Seite, wird es bei einer zu großen Anzahl von beteiligten Services zunehmend schwieriger, festzustellen, wo Fehler eingetreten sind.
Gleichzeitig wird die Anzahl von Laufzeitabhängigkeiten unübersichtlicher und schwerer zu verwalten.

Für diese Herausforderung kommt die andere Art von Sagas infrage:


### Orchestrator

Bei der Saga-Orchestrierung gibt es einen zentralen Orchestrator, der die Ausführung der Teiltransaktionen steuert.
Der Orchestrator ist verantwortlich für die Koordination der beteiligten Microservices und die Verwaltung des Transaktionsstatus.
Er stellt sicher, dass die Schritte in der richtigen Reihenfolge ausgeführt werden und kann bei Bedarf Kompensationsmaßnahmen einleiten, um den vorherigen Zustand wiederherzustellen, falls ein Fehler auftritt.
Der Orchestrator fungiert als zentrale Anlaufstelle für die Transaktionssteuerung und Kommunikation zwischen den Microservices.

![image](/assets/images/posts/das-saga-muster-als-zutat-für-erfolgreiche-systeme/saga-orchestrator-f.png)  
_Beispiel einer Orchestrator-Saga für einen Bestellvorgang_.


Im obigen Diagramm können wir den schon benannte Bestellvorgang einsehen, diesmal aber als Orchestrator-Saga:
Der Hauptunterschied besteht aus dem Einsatz eines dedizierten Service, der für die Orchestrierung, das Tracking und das Tracing der notwendigen Schritte zuständig ist.

Ein wichtiger Vorteil für diese Art von Saga ist, dass zyklische Abhängigkeiten vermieden werden, da die Services während der Transaktion nicht untereinander kommunizieren, sondern nur mit dem Orchestrator.
Ein weiterer Vorteil besteht aus dem Gewinn an Übersichtlichkeit, da die Definition des gesamten Workflows an einer einzigen Stelle liegt, wo sie angepasst und getestet werden kann.

Dennoch kommen diese Vorteile mit hohen Kosten: Der Orchestrator wird ein Single Point Of Failure, d.h., wenn er nicht verfügbar oder in einem fehlerhaften Zustand ist, kann die ganze Transaktion nicht ausgeführt werden, egal wie zuverlässig die übrigen beteiligten Services sind.
Wegen der erhöhte Komplexität bei der Umsetzung und Wartung eignet sich diese Art von Saga für Geschäftstransaktionen, die viele (i.d.R mehr als 4) teilnehmende Services mit langlaufenden Schritten beinhalten, deren Status getrackt werden muss.

In unserem Küchenbeispiel ist der Orchestrator der Chefkoch, der die Küchenstationen in dem Restaurant koordiniert.
Er gibt jedem Mitarbeitenden in der notwendigen Reihenfolge Anweisungen, welche Zutaten zubereitet werden sollen.
Falls es Probleme bei einem der Schritte gibt, stellt er sicher, dass alle Beteiligten Maßnahmen einleiten, sodass am Ende die Küche in einem ordentlichen Zustand bleibt.

# Fazit

Wir haben uns das Saga-Muster und dessen Hauptmerkmale angeschaut.
Ferner haben wir uns die Hauptarten von Sagas angeschaut: Choreografie und Orchestrierung.
Jede hat Vorteile und Nachteile, die bei jedem Anwendungsfall abzuwägen sind.
Bei der Auswahl sind die Anzahl und Dauer der Arbeitsschritte sowie der Bedarf an Status-Tracking entscheidende Faktoren.

Wenn du also das nächste Mal einen Kuchen backst oder versuchst, eine komplexe, verteilte Geschäftstransaktion in einer Microservicearchitektur abzuschließen, denk an das Saga-Muster als Geheimzutat für deinen Erfolg!





