---
layout: [post, post-xml]
title:  "Intelligenz vererben – Mit genetischen Algorithmen künstliche neuronale Netze trainieren"
date:   2021-02-15 12:00
author: swindisch
categories: [Architektur]
tags: [Künstliche Intelligenz, KI, Maschinelles Lernen, Genetische Algorithmen]
---
Künstliche neuronale Netze werden häufig zur Bild- oder Spracherkennung, für Vorhersagen oder aber zur Erkennung von Betrugsfällen genutzt.
In bestimmten Bereichen sind die Ergebnisse sogar besser als eine menschliche Vorhersage.
Damit diese Trefferquoten erreicht werden können, müssen die Netze zuvor leider mit Unmengen von Testdaten aufwändig trainiert werden.
Falls ausreichende Testdaten nicht zur Verfügung stehen oder aber diese erst zur Laufzeit generiert werden können, bieten genetische Algorithmen eine Alternative zum Training der Netze an.

# Einleitung

Die Wörter Künstliche Intelligenz (KI) und neuronale Netze sind in aller Munde.
KI erlebte in den letzten Jahrzenten Höhen und Tiefen und befindet sich aktuell in einer seiner spannendsten Phasen.
Durch Hardware, beispielsweise Grafikkarten, die eigentlich für aufwändige 3D-Computerspiele genutzt werden, oder aber große Cloud-Rechenzentren, steht momentan unfassbar viel Rechenleistung zur Verfügung, um die komplexe Mathematik hinter den Algorithmen in überschaubarer Zeit zu berechnen.

Doch was wird unter all den Begriffen verstanden und wie werden diese eingeordnet?
Was bedeuten genetische Algorithmen und wie können sie neuronalen Netzen beim Training helfen?

Der folgende Blogpost beschreibt
* **den Aufbau und die Nutzung von künstlichen neuronalen Netzen**
* **die Grundlagen von genetischen Algorithmen**
* **wie diese das Training der neuronalen Netze unterstützen können**
* **anhand des überschaubaren Beispiels GeneticSnake die Nutzung beider Themen**


# Künstliche neuronale Netze

Unter Künstlicher Intelligenz (KI) – Artificial Intelligence (AI) – wird ein Teilgebiet der Informatik verstanden, bei dem versucht wird, menschliches Lernen und Verhalten auf Computer zu übertragen.
Damit sollen Computer eine ausreichende Intelligenz entwickeln, um eigenständige Vorhersagen bzw. eigene Entscheidungen zu treffen.
Starke künstliche Intelligenz hat das Ziel, die intellektuellen Fähigkeiten von Mensch nachzuahmen oder sogar zu übertreffen.
Aktuell sind wir noch sehr weit davon entfernt. 
Schwache künstliche Intelligenz hat das Ziel, sich auf eine konkrete Lösung zu fokussieren und hier durch Rechenpower bessere Ergebnisse zu liefern als vergleichbare menschliche Leistung.
Dazu zählen beispielsweise Bild- und Spracherkennung, Werbung oder aber auch die Krebserkennung.

Ein weiterer Bestandteil der KI ist maschinelles Lernen (Machine Learning).
Beim maschinellem Lernen wird versucht, Wissen aus Daten zu gewinnen.
Dies können bestimmte Informationen oder aber auch Muster sein.
Dazu werden mathematische Modelle entworfen und mit Unmengen von Daten trainiert, um bestimmte Ergebnisse in einer geforderten Qualität vorherzusagen.
Anhand der Trainingsdaten wird ein Modell entworfen, das am Ende Beziehungen zwischen Eingabedaten und Ergebnissen generalisiert vorhersagen kann.

Eine große Unterscheidung gibt es bei den Trainings-Daten:
* Es gibt Trainings-Daten, die bereits das richtige Ergebnis, auch Label (Klassen, Ziele) genannt, mitliefern.
Dazu gehören beispielsweise Datensätze von Millionen von Bildern, die angeben, was auf den Bildern zu sehen ist (Lebewesen, Dinge des Alltags, Zahlen oder Buchstaben).
* Es gibt Trainings-Daten, die keine Ergebnisse mitliefern, wie Kreditkarten-Transaktionen, bei denen nicht bekannt ist, ob Betrugsfälle vorhanden sind.
Hier müssen andere Modelle genutzt werden.

Aus diesen Gründen kann zwischen den drei folgenden Kategorien des maschinellen Lernens unterschieden werden:
* **Un-Überwachtes Training (Unsupervised Training)** – Hier liegen keine Ergebnisse vor, die Modelle können Daten gruppieren oder Ausnahmen erkennen.
* **Überwachtes Training (Supervised Training)** – Hier liegen Ergebnisse vor, die Modelle können trainiert werden, um aus unbekannten Eingaben Ergebnisse vorherzusagen.
* **Reinforcement Learning** – Auch scherzhaft Training durch Schmerz genannt.
Hier wird anhand von Belohnungen das Handeln eines Agenten bestimmt.

Für das überwachte Lernen haben in den letzten Jahren, dank der Rechenpower aktueller Computer-Systeme, neuronale Netze verschiedenster Architekturen eine Renaissance erfahren.
Sobald ein Netz aus einer komplexeren Architektur besteht, sprechen wir von **tiefem Lernen (Deep Learning)**.

![Neuron](/assets/images/posts/Intelligenz vererben/Neuron.png)

Neuronale Netze sind der Struktur des menschlichen Gehirns nachempfunden.
Ein neuronales Netz besteht dabei aus vielen Neuronen, auch Perzeptron, genannt, die in Schichten (Layern) zusammengefasst werden.
Jedes Neuron jeder Schicht ist mit seinen Vorgängern und Nachfolgern verbunden.
Die Verbindung wird über Gewichte unterschiedlich stark ausgeprägt.
Jedes Neuron fasst alle eingehenden Verbindung zusammen und entscheidet anhand der Aktivierungsfunktion, ob es ein Ergebnis an seine Nachfolger schickt.
Dazu gibt es noch einen Schwellwert (Bias), der die Berechnung des Ergebnisses noch anpassen kann.
Neuronale Netze existieren heute in den unterschiedlichsten Architekturen und sind auf bestimmte Anwendungsfälle spezialisiert.
Sie definieren eine Beziehung zwischen Eingabedaten und dem passenden Ergebnis.
Wird beispielsweise ein unbekanntes Katzenbild an ein Bilderkennungsnetz übergeben, so sollte es vorhersagen, dass es sich um eine Katze handelt.
Grundlegend bestehen neuronale Netze aus einer Eingabe-Schicht (Input-Layer), die die Daten entgegennimmt, einer oder vielen versteckter Schichten (Hidden-Layer), in denen die "Intelligenz" stattfinden und einer Ausgabeschickt (Output-Layer) die die Vorhersage liefert.
Beispielsweise "Hund oder Katze", "Betrugsfall ja/nein" oder aber auch der morgige Aktienkurs.

![NeuronalesNetz](/assets/images/posts/Intelligenz vererben/NeuronalesNetz.png)

Das "klassische" Training eines neuronalen Netzes wird als Backpropagation bezeichnet.
Dabei wird zunächst ein neuronales Netz auf Basis einer passenden Architektur definiert, in einem Computer-System angelegt und mit zufälligen Gewichten initialisiert.
Nun wird das Netz mit tausenden, wenn nicht Millionen Daten gefüttert und für jeden Datensatz die Abweichung von errechneter Vorhersage und Trainings-Ergebnis berechnet.
Diese Schritte werden als Feed-Forward bezeichnet.
Nun wird basierend auf komplexen verschiedenen mathematischen Verfahren versucht, die Abweichung zu minimieren, indem rückwärts durch das Netz gewandert wird und dabei jedes Gewicht eines jeden Neurons minimal angepasst wird.
Beim nächsten Durchlauf werden so die Abweichungen geringer ausfallen.
Dies wird so oft wiederholt, bis eine gewünschte Genauigkeit bzw. akzeptable Abweichung erreicht wird.
Bei diesem Verfahren kann es jedoch leider passieren, dass nicht die beste Genauigkeit, sondern nur eine lokale Genauigkeit (lokales Optimum) gefunden werden kann.
Dadurch verbessert sich das neuronale Netz nicht mehr, obwohl bessere Ergebnisse berechenbar wären.

Das so trainierte neuronale Netz wird am Ende der Trainings-Phase als Modell betitelt und für die spätere Nutzung gespeichert.
Das Modell wird in einem Anwendungsfall in eine Produktionsumgebung eingebunden und für Vorhersagen unbekannter Eingabe-Daten genutzt.

# Genetische Algorithmen

Genetische Algorithmen sind ein weiterer Bereich der Informatik, der ebenfalls der Natur nachempfunden wurde.
Mit der Evolutionstheorie verstehen wir, vereinfacht beschrieben, die Entstehung und Anpassung von Lebewesen an ihre Umgebung.
Dabei versuchen aktuelle Generation die "besten" oder auch "stärksten" Gene an ihre Nachfahren zu vererben, damit diese eine größtmögliche Überlebenschance erhalten.
Beispielsweise versucht das stärkste Männchen das hübscheste Weibchen (gerne auch anders herum) zu bezirzen und sich zu vermehren, um den Fortbestand der eigenen Art zu sichern.

Genetische Algorithmen basieren auf diesen Ansätzen und dienen der Optimierung von statistischen bzw. mathematischen Modellen.
Durch die Selektion der besten Ergebnisse und deren zufälliger Kombination und Mutation können im Laufe der Zeit sehr gute Vorhersagen getroffen werden.
Der genutzte Zufall umgeht hiermit das Problem der lokalen Optima aus dem Backpropagation-Algorithmus der neuronalen Netze.

## Bestandteile Genetischer Algorithmen

### Genetik

Der Begriff Genetik ist hier sehr abstrakt zu sehen.
Als Gene werden Daten bezeichnet, die verwendet werden, um die Generationen in jeder Evolution zu verbessern.
Das können Größe und Gewicht sein oder aber Eigenschaften, die das Verhalten definieren.
Bei GeneticSnake werden die Gewichte des neuronalen Netzes als Gene benutzt.

### Individuum

Ein Individuum stellt einen eigenständigen Teilnehmer dar, der durch seine Genetik und sein Handeln, seine Fähigkeit unter Beweis stellen muss.
Bei GeneticSnake stellt jeder Schlange ein Individuum dar.
Die Schlange definiert sich aus der Position auf dem Spielfeld, der Länge des Körpers und einem eigenen neuronalen Netz.

### Population

Eine Population ist eine Menge von Individuen.
Jedes einzelne erhält seine eigene Ausprägung der Genetik.
Bei GeneticSnake besteht die Population aus mehreren hundert Schlangen, die jeweils auf einem eigenen Spielfeld aktiv sind.

### Generation

Eine Generation stellt die Population zu einem bestimmten Zeitpunk dar.
In einer Generation werden Handlungen solange ausgeführt, bis ein bestimmter Schwellwert erreicht wurde, oder die aktuelle Population "verstorben" ist.
Bei GeneticSnake besteht die Handlung aus dem jeweils nächsten Schritt im Spielfeld.
Es gibt keinen Schwellwert, die Generation läuft solange, bis die Population vollständig "verstorben" ist.

### Evaluation

Bei der Evaluation wird bestimmt, wie gut sich das Individuum an seine Umgebung angepasst hat.
In der Informatik wird anhand einer Fitness-Funktion bestimmt, welches Individuum aus der aktuellen Generation das "beste" war, welche eine gute Leistung geliefert haben und welche versagt haben.
Bei GeneticSnake stellt die Fitness-Funktion eine kleine mathematische Formel dar, die sich aus der Anzahl der Gesamtschritte, Schritte seit dem letzten Apfel und Abstand zum Apfel berechnet.

### Selektion

Bei der Selektion wird ein bestimmter Prozentsatz der aktuellen Generation bestimmt, der zu den schlechtesten gehört und damit aussortiert wird.
Dies kann ein fester Prozentsatz oder aber eine prozentualer Abstand zu den Besten der Generation sein.
Dadurch wird Platz für neue Generationen geschaffen.
Bei GeneticSnake wird in jedem Durchlauf aktuell die Hälfte der schlechtesten Schlangen aussortiert (50% Aussortierung).

### Evolution

Die Evolution stellt die Veränderung der Genetik einer Generation dar.
Dabei gibt es verschiedene Ansätze.
* Der beste der aktuellen Generation wird mit allen anderen gekreuzt.
Was in der Natur (Bulle mir seiner Herde) gut funktioniert, führt in der abstrakten Welt der Informatik zu oft zu technischen Klonen, die das Training massiv negativ beeinflussen.
* Bei der Parthenogenese pflanzt sich das Individuum selbst ohne Partner mit leicht veränderter Struktur fort.
Dies führt auch oft zu technischen Klonen.
* Die besten der aktuellen Generation kreuzen sich nach einem gewichteten Zufallsprinzip untereinander solange, bis die Population für die nächste Generation wieder vollständig ist, auch Kreuzung (Crossover) genannt.
Bei der Kreuzung werden die Gene beider Elternpaare nach mathematischen Methoden vermischt und führen so zu einer veränderten Genetik für das neue Individuum.
Bei jedem so neu erzeugten Individuum besteht eine kleine Wahrscheinlichkeit einer Mutation.
Dabei werden einzelne Gene minimal verändert.
Dies kann bei manchen Mutanten zu einem besseren Ergebnis führen.

# Genetisches Training der Neuronalen Netze

Was wird unter dem genetischen Training der neuronalen Netze verstanden?

Die Gewichte eines neuronalen Netzes werden als Gene definiert.
Dabei werden die einzelnen Gewichte eines Neurons einer jeden Schicht wie eine langgezogene DNA-Kette aneinander gereiht.
Jedes Individuum erhält ein eigenes neuronales Netz mit einer eigenen DNA-Kette.
Bei einer Population von 500 Individuen sind das 500 neuronale Netze.
Diese DNA-Kette wird als Genetik bezeichnet und mit dem oben beschriebenen Verfahren verbessert.
Falls es weitere wichtige Eigenschaften gibt, die in der Evolution genutzt werden sollen, werden diese ebenfalls an die Genetik gehangen.
Das bedeutet, dass nach jeder Generation die DNA-Kette von zwei Eltern aus den neuronalen Netzen gelesen, zu einer neuen DNA-Kette für den Nachfolger gekreuzt und diesem im Anschluss wieder in das neuronale Netz geladen wird.
Das alles passiert eher zufällig.
Dem System werden keine konkreten Hinweise oder Spielzüge mitgegeben.
Auch gibt es keine vorher definierten Regeln.
Einzig und allein die ständige Veränderung der Gene führt im Laufe der Zeit zu einem neuronalen Netz, das sich besser zurechtfindet als die Vorgänger.

# GeneticSnake

GenetikSnake ist ein guter Anwendungsfall der als Beispiel für unsere beschriebenen Ansätze genutzt werden kann.
Anstatt im Vorfeld tausende Spiele aufzuzeichnen und damit ein klassisches neuronales Netz zu trainieren, wird das Netz beim Spielen ununterbrochen mit Daten versorgt und kann sich durch die Genetik langsam verbessern.

![GeneticSnake](/assets/images/posts/Intelligenz vererben/GeneticSnake.png)

GenetikSnake basiert auf dem recht einfachen Spiel Snake.
Die Welt besteht aus einem Raster bestehend aus Quadraten.
In diesem Raster lebt eine Schlange, die sich ununterbrochen fortbewegt.
Dabei kann sie sich nur in die vier Himmelsrichtungen bewegen.
Nach und nach tauchen in der Welt Äpfel auf.
Frisst die Schlange einen dieser Äpfel, erhält sie einen Punkt und neue Lebensenergie.
Dabei wächst ihr Körper um eine Einheit, sie wird länger.
Berührt die Schlange den Rand, stirbt sie.
Frisst sie sich selbst stirbt sie.

Ziel ist es nun, solange es möglich ist, die Schlange zu bewegen ohne das sie stirbt.
Das Spiel ist theoretisch gewonnen, wenn die Schlange so groß geworden ist, dass sie das gesamte Spielfeld einnimmt.

Ein Spieler kann nun die Schlange beispielsweise mit der Tastatur steuern, die Richtung bestimmten und Punkte sammeln.

Das Ziel unserer Anwendung ist es, eine KI zu erschaffen, die das Spiel ohne menschlichen Einfluss selbständig spielt.
Dazu wird ein neuronales Netz modelliert, das als Eingabe die sichtbare Umgebung der Schlange zum Rand, zum Apfel und zum eigenen Körper bekommt.
Als Ergebnis sagt uns das Netz in welche Richtung sich die Schlange bewegen soll.

Mittlerweile gibt es viele Frameworks und Bibliotheken am Markt, die jahrelange Praxiserfahrungen sammeln konnten und extrem auf Laufzeit optimiert wurden.
Gerade für die Programmiersprache Python gibt es mit Keras/Tensorflow (Google) und PyTorch (Facebook) zwei Systeme, mit denen der Anwender schnelle Erfolge erzielen kann.
Für ein Grundlegendes Verständnis der eingesetzten Algorithmen, wird aber bei GeneticSnake auf diese Hilfe verzichtet.
Für die Anwendung wurde ein eigenes neuronales Netz entwickelt, dass den FeedForward-Teil für die Vorhersage anbietet.
Die genetischen Algorithmen sind ebenfalls handgeschrieben, damit hier jeder Veränderung des Codes getestet werden kann.

* Der Code für das neuronale Netz ist auf [GitHub](https://github.com/swindisch/ArtificialNeuralNetwork) verfügbar.*

Damit die Anwendung dennoch überschaubar und verständlich bleibt, wurde die Anwendung als native Java-Anwendung mit einer simplen Swing-Oberfläche (Fat-Client) entwickelt.
Dabei werden aus Performance-Gründen nur die ersten 20 Spielfelder angezeigt, während im Hintergrund der Rest berechnet wird.

* Der Code für GeneticSnake ist auf [GitHub](https://github.com/swindisch/GeneticSnake) verfügbar.*

Nachdem die Anwendung erstellt und die Algorithmen definiert wurden, lehnen wir uns zurück und schauen dem Treiben entspannt zu?
Leider ist dies nicht so einfach.
Wenn nicht exakt definiert wird, was eine gute Generation ausmacht, ist kaum eine Verbesserung zu erkennen.
Wenn Beispielsweise nur die Schritte gezählt würden, sind Schlangen, die unendlich im Kreis rennen, die besten.
Die Schlangen bekommen als Eingabe nur das mit, was sie sehen und kennen.
Das sind die Entfernungen zum Rand, zum Apfel und zum eigenen Körper sowie die Richtung aus der sie kommen und ihre Lebensenergie.
Sie erhalten keine Spielregeln und Hinweise, was eine Sinnvolle Aktion wäre.
Das muss alles selbst erlernt werden, bis dass das neuronales Netz sinnvoll entscheiden kann, wohin es gehen soll.
Im Laufe der Evolutionen und Generationen passen sich die Netze immer besser dem Spiel an und generalisieren ihr Handeln.
Dies bedeutet, dass ein gut trainiertes Netz auch in einer anderen Umgebung funktionieren kann.
Beispielsweise könnte die beste Schlange auch in einem Raster von 50x500 Kästchen überleben, obwohl sie nur in 10x10 trainiert wurde.

In vielen KI-Projekten ist die Post-Modell Phase einer der längsten Phasen.
Hier werden Hyperparameter angepasst und Kleinigkeiten immer wieder verbessert.
Im Anschluss wird die Simulation immer und immer wieder getestet.
Nach etlichen Versuchen und Rückschlägen wurde für GeneticSnake eine Netz-Architektur samt passender genetischer Algorithmen gefunden, so dass Verbesserungen erkennbar waren. Nach einigen Minuten und ca. 3000 Generationen mit jeweils 100 Schlangen wurden bereits 60 und mehr Äpfel in einem Durchlauf gefressen!

# Fazit

Mit dem Beispiel von GeneticSnake wird gezeigt, dass mit der geschickten Auswahl von Umgebungsdaten als Eingabewerte für das neuronale Netz und Genen, die dem neuronalen Netz als Gewichte dienen, in kürzester Zeit bemerkenswerte Ergebnisse erzielt werden können.
Während beim "klassischen" Training neuronaler Netze ganze Bildschirm-Szenen als lange Eingabevektoren in komplexe Netze genutzt werden, und diese dann stundenlang rechnen und trainieren, reichen hier 30 Eingabewerte aus.
Auf der anderen Seite muss aber im Vorfeld und bei der Entwicklung der Algorithmen und des Modells genau überlegt werden, welche Informationen bereitgestellt werden müssen, damit sich die Gene und damit das neuronale Netz verbessert.
Dazu gehört auch die Fitness-Funktion, die angibt, welche die "beste" Schlange der aktuellen Generation ist.
Diese experimentierfreudige Phase hat einiges an Zeit beansprucht, bis ein erster Erfolg erkennbar war.

# Ausblick

GeneticSnake befindet sich gerade in der Post-Modell Phase.
Dies bedeutet, dass der grundlegende Algorithmus und das gewählte Modell Erfolge erzielen, aber durch die Optimierung des Sourcecode die Geschwindigkeit der Anwendung erhöht und beim sogenannten Hyperparameter-Tuning die Lernerfolge des Models verbessert werden können.
Von einem neuronalen Netz, das das Spiel vollständig durchspielt ist GeneticSnake noch ein wenig entfernt.
So ein Training kann viele weitere Stunden erfordern.

Bei adesso wird seit 2020 das Studentenprojekt "KI-Plattform" realisiert.
Die KI-Plattform stellt Benutzern unterschiedliche Anwendungsfälle der KI in einer benutzerfreundlichen, nicht technischen Web-Anwendung dar.
Neben der Erkennung von Bildern, der Analyse von Betrugsfällen und dem Auswertung von Satellitenbildern wird aktuell das Thema Genetik mit einem recht komplexen Anwendungsfall umgesetzt.
Eine moderne Web-Repräsentation von GeneticSnake wird sicherlich in dem Projekt noch Platz finden.
