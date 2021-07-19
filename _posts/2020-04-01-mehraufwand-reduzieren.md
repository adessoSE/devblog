---
layout: [post, post-xml]              					# Pflichtfeld. Nicht ändern!
title:  "Mehraufwand reduzieren durch das Tolerant Reader Pattern"    					# Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2020-04-01 09:00             					# Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2021-03-08 14:50                         # Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author: stefanmueller                 					# Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: [Softwareentwicklung]                    					# Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Mehraufwand reduzieren, Schnittstellen, Tolerant Reader Pattern, Java]         # Bitte auf Großschreibung achten.
---

In fast jedem Softwareprojekt müssen Systeme mit anderen Systemen und deren Anwendungen kommunizieren. 
Dies erfolgt regelmäßig unter Zuhilfenahme von Schnittstellen, die in der Praxis unterschiedlich komplex ausfallen. 
Ein gängiger Weg, eine Schnittstelle anzubinden, ist die Verwendung eines Frameworks zur Generierung von Klassen.
Daneben gibt es das Tolerant Reader Pattern, dass den Mehraufwand, eine Schnittstelle anzubinden, reduzieren kann.

Die Nutzung eines Frameworks ist zeitsparend und komfortabel, weil darauf verzichtet werden kann, Klassen manuell zu erstellen.
Zudem erledigt das Framework auch das Un- / Marshalling.
Dies wirkt sich besonders bei einem großen Schema aus, da der initiale Aufwand gering ist. 
Je größer das Schema ist, desto mehr Aufwand kann gespart werden. 
Solange die Schnittstelle nicht verändert wird, funktioniert dieses Vorgehen hervorragend.
 
Leider kommt es in der Praxis aber häufig anders…
 
# Never Ending Changes 

"Die Schnittstelle ist final." - "Das ist jetzt die letzte Änderung!" - "Es wird keine weitere Änderung geben."

Diese bzw. sinngemäße Aussagen kennt sicher jeder, der schon einmal Schnittstellen angebunden hat. Doch regelmäßig kommt es anders. 
Veränderungen an einer Schnittstelle müssen im Verlauf eines Softwareprojekts häufig vorgenommen werden. 
Im ungünstigsten Fall sind sie vor einem wichtigen Ereignis, wie beispielsweise einem Release, notwendig. 
In dieser wichtigen Phase geht es in nahezu jedem Softwareprojekt hektisch zu. 
Kommen dann noch Anpassungen an Schnittstellen hinzu, führen diese möglicherweise sogar zu einer Verschiebung des Releases.

Im Allgemeinen führt häufiger Anpassungsbedarf an einer Schnittstelle zu Mehraufwand, da sich dadurch Änderungen im Schema ergeben. 
Deshalb sind Schnittstellenänderungen häufig sehr komplex, müssen aber durchgeführt werden, um die Kommunikation mit anderen Systemen weiterhin sicherzustellen.

Neben diesen essentiellen Änderungen gibt es Änderungen, die nicht zwingend notwendig sind. 
Hierbei kann es sich beispielsweise um neue Felder handeln, die zur Schnittstelle hinzugefügt wurden, jedoch für das Projekt irrelevant sind. 
Auch diese Änderungen erfordern die Aktualisierung des Schemas und die erneute Generierung der Klassen, da Schema und Klassen stets dieselbe Version aufweisen müssen. 
Durch die Aktualisierung der Klassen müssen wiederum Anpassungen am Programmcode vorgenommen werden, der diese Klassen verwendet. 
Diese scheinbar kleinen Anpassungen können schnell Schwierigkeiten bereiten, da sie zwar unnötigen Mehraufwand für das Projekt bedeuten, aber insgesamt keinen Mehrwert haben. 

Ein noch größeres Problem entsteht, wenn Schnittstellen auf unterschiedlichen Technologien basieren (bspw. JMS und SOAP/WSDL), aber dasselbe Schema verwenden. 
In diesem Fall ist es nicht möglich, dasselbe Generat zu verwenden. 
Denn obwohl der Namespace identisch ist, unterscheidet sich das Generat in der Schreibweise (case sensitive / case insensitive). 
Weiterer Aufwand entsteht, weil frameworkspezifische Klassen benötigt werden und durch die Entstehung verschiedener Generate das Mapping zweimal implementiert werden muss. 

Das Hauptproblem bei der Generierung von Programmcode für die Schnittstellenkommunikation ist die Abhängigkeit vom Schema. 
Denn jede nachträglich eintretende Änderung am Schema führt auch zu einer erneuten Generierung der Klassen und einer Anpassung des Programmcodes. 
In der Regel sollten die generierten Klassen ausschließlich vom Reader, nicht von weiteren zusätzlichen Komponenten, benötigt werden. 
Andernfalls kann eine Schemaänderung sehr aufwändig werden, da 1 bis n weitere Stellen im Programmcode angepasst werden müssen. 
Das Generat muss in jedem Fall neu erstellt werden, auch wenn die Änderung am Schema völlig irrelevant ist.

Angesichts des erheblichen Aufwands wäre es also von Vorteil, wenn man entscheiden könnte, ob eine Schnittstellenänderung relevant ist und ob das Mapping wiederverwendet werden kann. 
Eine Alternative zum oben erläuterten gängigen Verfahren bietet hier das Pattern Tolerant Reader.
 
# Tolerant Reader Pattern
Der Einsatz des Tolerant Reader Pattern ist hilfreich bei der Reduzierung des Mehraufwands, indem so tolerant wie möglich von der Schnittstelle gelesen wird: nämlich ausschließlich die Informationen, die auch tatsächlich benötigt werden. 
Alle weiteren Informationen werden schlicht ignoriert. Ist die Information irrelevant, ist auch keine Anpassung erforderlich. 

Folgendes Beispiel soll die Vorteile des Tolerant Reader Patterns verdeutlichen.
In einem Softwareprojekt gibt es eine Schnittstelle mit 100 Feldern, aber lediglich 5 dieser Felder werden tatsächlich benötigt. 
Bei Einsatz des Tolerant Reader Pattern muss der Reader folglich nur 
5 Felder einlesen, die anderen 95 werden ignoriert und nicht implementiert. 
Dadurch ergibt sich eine erhebliche Zeitersparnis, die vermeintlich auch durch die Verwendung eines Generats entsteht.
 
# In der Praxis
Vergleicht man die Verwendung eines Generats und des Tolerant Reader Patterns miteinander, ergeben sich einige Unterschiede:

Bei der initialen Aufsetzung kann die Implementierung des Generats schneller sein, als die des Patterns. 
Denn die initiale Generierung von 100 Feldern erfolgt in einem kürzeren Zeitraum, als die händische Implementierung. 
Allerdings wird die Zeitersparnis, die durch die Nutzung eines Generats entsteht immer geringer, je geringer die Anzahl der Felder ist. 
Denn jede Änderung am Schema erfordert immer ein neues Generat. Beim Pattern hingegen muss nur auf relevante Änderungen reagiert werden und ggf. ist keine Anpassung erforderlich. 

Das Mapping muss sowohl beim Generat als auch beim Pattern implementiert werden. 
Das Mapping  kann jedoch bei Schnittstellen, die auf unterschiedlichen Technologien basieren, bei der Verwendung des Patterns wiederverwendet werden, da keine Unterscheidung aufgrund der Generierung entsteht.

In unserem aktuellen Projekt haben wir uns für die Nutzung des Tolerant Reader Patterns entschieden und somit auf die Generierung verzichtet. 
Die Schnittstellen verwenden XML und der Reader nimmt XPATH zur Hilfe, um den Inhalt einzulesen. 
Durch die Verwendung des Tolerant Reader Patterns wird nur die Anzahl von X-Pfaden definiert, wie auch Felder von der Schnittstelle benötigt werden, alle anderen Felder werden ignoriert und nicht definiert. 
Der Reader liest die Felder tolerant, das heißt, es werden ausschließlich die einlesbaren Felder eingelesen. 
Kann ein Feld nicht eingelesen werden, führt dies zu einem leeren Ergebnis. 
Durch die Verwendung des Tolerant Reader Patterns verringert sich der Mehraufwand, der bei einer Schnittstellenänderung zwangsläufig entsteht, auf ein Minimum.

Bei jeder Schnittstellenänderung werden Felder hinzugefügt, gelöscht oder vorhandene Felder verändert. 
Wird der Schnittstelle ein weiteres Feld hinzugefügt, führt dies zunächst dazu, dass dieses Feld nicht eingelesen werden kann. 
Denn der Reader liest ausschließlich die bekannten Informationen bzw. Felder. 
Im Fall der Löschung eines Feldes, kann der Reader das Feld ebenfalls nicht mehr einlesen und das Ergebnis ist leer. 
Da der Reader beim Einsatz des Tolerant Reader Patterns tolerant ist, kann die Funktion durchgeführt werden und lediglich das Ergebnis ist leer. 
Die einzige Herausforderung besteht darin, den Programmcode so robust zu implementieren, dass er mit einem leeren Ergebnis umgehen kann. 
Die Anpassung des Readers kann anschließend erfolgen. 
Im Fall von Schnittstellenänderungen sollte zunächst geprüft werden, ob es sich um relevante Änderungen handelt. 
Handelt es sich um eine relevante Änderung, muss lediglich eine minimale Anpassung im Reader erfolgen, die bestehende Implementierung bleibt dabei unangetastet. 
Handelt es sich hingegen um eine irrelevante Änderung, ist keine Anpassung notwendig.
 
# Fazit	

In der Praxis bietet der Einsatz des Tolerant Reader Patterns und des geschilderten Vorgehens also viele Vorteile. 
Lediglich durch das initiale Aufsetzen entsteht ein geringer Mehraufwand. 
Die Verwendung ist also in Hinblick auf den erforderlichen Mehraufwand bei Schnittstellenänderungen in jedem Fall eine Überlegung wert. 

In unserem Projekt hat sich dieses Pattern in jeglicher Hinsicht bewährt. 
Denn durch den Verzicht auf ein Generat konnten wir selbst entscheiden, ob Änderungen der Schnittstelle relevant sind. 
Die Änderungen, die nicht relevant waren, konnten getrost ignoriert werden. 
So behielten wir stets die Kontrolle und konnten unnötigen Mehraufwand vermeiden bzw. auf ein Minimum reduzieren. 
