---
layout: [post, post-xml]                                   # Pflichtfeld. Nicht ändern!
title: "Green Deal - Weil es unsere Pflicht ist?"          # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2022-09-01 10:25                                   # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2022-09-01                                  # Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author_ids: [kenneth-may-adesso]                           # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesen Namen geben.
categories: [Softwareentwicklung]                          # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [GreenIT, Nachhaltigkeit]                            # Bitte auf Großschreibung achten.
---
Die EU will mit dem Green Deal den Klimaschutz richtig angehen.
Neben dem Vorhaben, bis 2050 keine Netto-Treibhausgase mehr auszustoßen, soll das Wachstum der Wirtschaft von der Ressourcennutzung entkoppelt werden.
Daher ist eines der Kernziele, Herstellerfirmen dazu zu verpflichten, Produkte langlebiger und reparaturfähig zu gestalten. 
Allerdings ist es nicht nur die Qualität der Hardware, die zur längeren Lebenszeit eines Produktes beiträgt; auch die Gestaltung der Software leistet ihren Teil. 
Dieser Blogpost soll daher zum einen verdeutlichen, wie Programmierung zur Lebensdauer von Produkten beiträgt; zum anderen möchte ich aber auch anschneiden, wie Programme selbst ressourcenschonend aufgebaut werden können.

## Die Ursprünge

Vom Green Deal der EU kann man halten, was man möchte.
Ziel ist es aber, dass wir uns nachhaltig weg von einer Wegwerfgesellschaft, hin zu mehr Nachhaltigkeit bewegen.
Dabei gab es in der Vergangenheit durchaus positive Ansätze wie ein Rechenzentrum mit eigenem Gezeitenkraftwerk [1], aber leider auch negative wie die Debatte um "ungeplante" Leistungseinbußen bei iPhones, je älter die Batterie wird[2].
Ich möchte nicht, dass mein Sohn in Anlehnung an Wall-E fasziniert ein Datenarchiv durchsuchen muss, um zu lernen, was Korallen oder Bäume sind. 
Die Frage ist also, was können wir in der Entwicklung dafür tun?

Der Bereich ist größer, als man auf Anhieb denkt. 
Mit diesem Beitrag möchte ich grundsätzlich für das Thema sensibilisieren. 
Ob als Consultant, der es als positives Verkaufsargument nutzen möchte oder in der Entwicklung, aus Faulheit, die eigene Software leichter wartbar zu machen. 
In diesem Beitrag kratzen wir etwas an der Oberfläche; das Thema wird aktuell von der CoP neue Technologien (LoB Insurance) bearbeitet. 
Dort könnt ihr euch gern mehr Informationen beschaffen.

## Was bedeutet Nachhaltigkeit bei Software

Was ein physisches Produkt nachhaltig macht, sollte uns allen an der ein oder anderen Stelle bereits untergekommen sein:

* Nachwachsende Ressourcen
* Erneuerbare Energien
* Wiederverwertbarkeit
* ...

Aber keines der Argumente passt auf Software. 
Wir können (im wahrsten Sinne) via Knopfdruck Software so oft vervielfältigen, wie wir das möchten. 
Seltene Erden oder CO2-intensive Transportwege sind da Fehl am Platz. 
Oder?

> Nachhaltigkeit bei Software ist, gegebene Ressourcen möglichst effizient zu nutzen.

Falsch gedacht!
In einem Artikel der Süddeutschen Zeitung werden bereits ein paar große Probleme aufgezeigt [3]. 
Demnach sorgt das Internet für ähnlich viele Treibhausgase, wie die weltweite Luftfahrt. 
In Zeiten von Corona und Home-Office wird die Zahl eher gestiegen sein.

Und wo kommt die Software ins Spiel? 
Nachhaltigkeit bei Software ist schlicht, die gegebenen Ressourcen möglichst effizient zu nutzen.

## von A wie Architektur

Damit sind wir bereits bei einem großen Punkt: 
Architektur ist das Kernelement einer jeden, guten Software. 
Es gibt zwei Grundsätze:

1. Programmiere möglichst ressourceneffizient
2. Programmiere möglichst modular

Der Artikel gibt schon den ersten Hinweis.

> manchmal hilft schon eine andere Programmiersprache

Wir können Software so schreiben, dass sie so ressourceneffizient wie möglich arbeitet. 
Das schaffen wir beispielsweise durch eine andere Programmiersprache. 
C, als sehr hardwarenahe Sprache, kann viel boiler-plate umgehen, birgt aber mit manueller Speicherfreigabe die Gefahr von Speicherlecks.
Java hingegen ist weit verbreitet (und verstanden) aber mit der JVM kommt immer ein Tool mit, welches den Java-Byte-Code auf die schlussendliche Hardwarearchitektur übersetzt, was zusätzliche Leistung frisst.
In diesem Vergleich ist Python eher der Trabbi unter den Sportwagen.
Was die Geschwindigkeit angeht, ist die Sprache eine Todsünde (Wink an die KI, welche gern auf Scikit-Learn setzt), aber unschlagbar beim Prototyping.

In ihrem Buch "Knigge für Softwarearchitekten" stellen Peter Hruschka und Gernot Starke (Entwickler von Arc42) diverse Wesenszüge (nicht nur) von Softwarearchitekten vor (ISBN: 978-3-86802-080-9).
Ein Anti-Pattern ist "Zu viel des Guten":
Ressourceneffizienz anzustreben ist gut, aber nicht um jeden Preis.
Der Green-Deal der EU fordert eine realistische Reparaturbasis.
Bei der Softwareerstellung muss also abgewogen werden, wo Optimierung sinnvoll ist und wann es reiner Selbstzweck wird.

**Aus der Praxis**
IDEs sind eine prima Sache.
Sie erleichtern unsere Arbeit ungemein.
Sie bieten Formatierungen, Autovervollständigungen, Syntax-highlighting und -Fehler-Erkennung.
Was eine IDE in der Regel aber ebenfalls macht, sind einfache Optimierungen der Lesbarkeit.
Bei Java beispielsweise wird bei Imports gern der `*`-Operator genutzt.
Uns als Entwickler fällt das in der Regel nicht groß auf, die Klasse wird importiert und steht zur Verfügung.
Dabei sollten wir uns fragen, ob wirklich alle Klassen dem Classloader bekannt sein sollten.

Zum Beispiel: In einem Projekt zur Speicherung und Analyse von Netzwerkverkehr sollte eine Postgres-Datenbank mit Verbindungsinformationen befüllt werden.
Allein ob ein Port als 2-Byte-unsigned-Short oder 4-Byte-Integer gespeichert wird, macht zwei Byte aus.
Bei 1,4 Milliarden Einträgen in dem Projekt sind wir bereits bei ca. 2,6 GB.
Eine Netzwerkverbindung wird aber erst über den 5-Tupel eindeutig (QuellIP, QuellPort, ZielIP, ZielPort, L4-Protokoll).
Bei einer IPv4-Adresse haben wir die Auswahl zwischen 4-Byte-Integer oder einem schlimmstenfalls 15-Byte-String.
Allein IP+Port bei Ziel und Quelladresse ergeben dann einen Unterschied von etwa 33,9 GB.
Und diese Daten waren mehrfach vorhanden.

Daher ein erstes Zwischenfazit: Die einfachste Variante, wie man Green Development betreiben kann ist KISS (Keep it simple, stupid).
Bei jeder Entscheidung sollten wir uns fragen: "Brauche ich das wirklich?".
Wenn wir das abgeschlossen haben, sollte uns der Product Owner/Stakeholder genau das gleiche Fragen.
Wenn wir es plausibel erklären können, scheint es wichtig zu sein.

## Über O wie Optimierungen

Das ganze können wir auch weiter treiben:
Wir müssen beginnen, die Grundlagen in Frage zu stellen.
Eine Java-Applikation ist durch die darunter liegende JVM sehr flexibel.
Dazu ist die Verbreitung von Java sehr groß und für die meisten Probleme gibt es daher bereits Bibliotheken, die uns in der Entwicklung unterstützen.
Demgegenüber ist Java aber unweigerlich langsamer als maschinennähere Sprachen wie Rust oder C.
Dazu kommt, dass man mit Sprachen wie C auch mehr Einfluss auf die Ressourcennutzung nehmen kann.
Wenn wir die gleiche Software also mit Java oder mit C betreiben würden, stehen die Chancen gut, dass C das Rennen in Sachen Ressourcensparsamkeit gewinnt.

Wo wir dabei sind, wir könnten auch anstelle von 32 Booleans (also 32 Byte) diese via Bitshifting in einen einzigen Integer speichern (4 Byte).
Das wird sogar sehr effektiv in der Netzwerkkommunikation genutzt.
Aber klingt das in der allgemeinen Softwareentwicklung wirklich nach einer guten Idee?

Gerade während der laufenden Entwicklung neigen wir dazu, beim testen unserer Implementation ungeduldig zu werden.
Die ewige Schleife von implementieren, kompilieren, evtl. deployen, starten etc. frisst viel Zeit.
Dabei sollten wir die Not zur Tugend machen und uns selbst optimieren.
Setzt euch mit Compileroptionen auseinander.
Die Software baut schneller und vielleicht fallen euch dann Konzepte auf, die ihr hinterfragen könnt.
Was ist eigentlich das besondere an Heap-Speicher (Java -Xmx/-Xms)? Was unterscheidet ihn von normalem Speicher und wie passt da der Stack rein (Java -Xss)?

Als dritten Pfeiler der Optimierung gibt es noch das Softwaredesign.
Monolithen sind in der Regel effizienter im 1:1 Betrieb aber schlechter skalierbar.
Im Sinne einer schnelleren Entwicklung, leichteren Wartbarkeit und vereinfachten Austauschbarkeit von Bausteinen sind Microservices zu bevorzugen.
Zur Optimierung gehört genauso, alte, gewachsene Strukturen zu überdenken und zu reformieren.

1. Probleme identifizieren
2. Lösungen finden/diskutieren
3. In Tickets verfassen
4. in das Product-Backlog einpriorisieren

## bis Z wie Zielorientiert

Wie weit treibt man das jetzt? Schlussendlich sind die Anforderungen maßgeblich.
Wenn wir zeitkritische Systeme haben, beispielsweise bei Airbags in Autos, wäre es bestenfalls ungünstig, wenn Java mit einer NullPointerException um die Ecke kommt.
Wenn wir einen schnellen Prototyp brauchen, ist Ada vermutlich eine eher schlechte Wahl.
Aber zeitkritisch ist nicht gleich zeitkritisch.
Wenn ein schneller Prototyp her muss, dann ist eine bereits bekannte Technologie besser als eine zwar effizientere, wo allerdings noch eine Lernkurve dazu kommt.

Im Sinne des Green-Deals werden wir nicht alle unser neues Auto verschrotten lassen um auf Elektro zu wechseln.
Mein Auto hat jetzt 75.000km auf dem Tacho und wird vermutlich noch ein paar 10.000km schaffen.
Der Wandel kommt nicht von jetzt auf gleich.
Niemand muss seine bisherige Arbeit vollständig umkrempeln.
Aber wenn man die ein oder andere Entscheidung hinterfragt, ist schon viel getan.

Vielleicht kommt man am Ende sogar zu dem Punkt, dass eine Single-Page-Application zwar seinen Charm hat, der CO2-Abdruck sich mit der Datenübertragung und fehlendem Cache aber erhöht.

## TL;DR

Detailiertes Wissen über die Funktionsweise von Computern gehört zum Grundwissen in der Entwicklung.
Der Unterschied zwischen Heap und Stack oder die Berechnung von Laufzeitkomplexitäten müssen nicht im Detail verfügbar aber zumindest ein Begriff sein.
Wenn ihr euren Code etwas grüner gestalten wollt, fängt alles bei euch an.

* Nutzt einen Asterisk-Import nur, wenn es wirklich sinnvoll ist.
* Überlegt, welche Datentypen ihr für die Variable braucht.
* Denkt ein zweites Mal über verschachtelte Schleifen nach.
* Hinterfragt die eingesetzten Technologien.
* Nutzt Variablennamen, die auch euer Team versteht.

Aber am wichtigsten: denkt an das Gesamtbild.
Es nützt nichts, die Programmiersprache zu wechseln, wenn nur eine Person im Team sie versteht.
Es könnte mehr Schaden verursachen, usize (bspw. Rust) zu nutzen und eigentlich einen u64 zu benötigen.
Ein Monolith spart Fesplattenplatz und vereinfacht das Deployment auf Kosten der Wartbarkeit.
Event-Driven-Design ist super für die asynchrone Bearbeitung von Vorgängen aber sorgt bei synchroner Verarbeitung für unnötigen Overhead.

An die Consultants unter euch - eine grüne Entwicklung wird nicht den großen Unterschied in Verhandlungen machen.
Aber bereits vorausschauend mit einwerfen zu können, dass wir entsprechend der Green-Deal-Vorgaben der EU auch für den Kunden 
eine Nachhaltigkeit über Software schaffen, verdeutlicht einmal mehr, dass wir über den Tellerrand schauen.
Ihr habt Blut geleckt? Wir werden künftig weitere Posts bezüglich Green Development veröffentlichen.
Seid gespannt...

## Links

1. https://www.com-magazin.de/news/cloud/in-schottland-gezeitenbetriebenes-rechenzentrum-entstehen-1760516.html
2. https://www.geekbench.com/blog/2017/12/iphone-performance-and-battery-age/
3. https://www.sueddeutsche.de/digital/klimawandel-internet-1.4756251
4. https://docs.spring.io/spring-boot/docs/1.5.16.RELEASE/reference/html/using-boot-devtools.html