---
layout: [post, post-xml]              # Pflichtfeld. Nicht ändern!
title:  "Message Queues - Hinten anstellen spart Wartezeit" # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2023-07-13 10:00              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2023-06-26 11:00       # Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author_ids: [jhoppe, cjohn]            # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesen Namen geben.
categories: [Architektur]                # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Open Source, Applications, AMQP, Message Queue] # Bitte auf Großschreibung achten.
---

Serverprozesse sollen ohne Pause ihre Jobs abarbeiten, statt aufeinander zu warten.
Deswegen sprechen sie asynchron miteinander.
Jeder redet, sobald er etwas zu sagen hat und hört zu, wenn er bereit für neue Aufgaben ist.
Die Wartezeit verbringen die Nachrichten in sauber getrennten Warteschlangen.

# Message-Queuing-Systeme

Beim Message Queuing wird die Arbeit auf drei Komponenten verteilt.
Die erste Komponente, der Producer, ist für das Erstellen eines Jobs zuständig.
Die Jobbeschreibung wird dann vom Producer in eine Nachricht verpackt und an den Nachrichtenspeicher versendet.
Dieser nimmt die Nachricht entgegen und reiht sie in eine Queue ein.
Die dritte Komponente, der Consumer, holt sich dann die älteste Nachricht aus der Queue ab und führt den dort beschriebenen Job aus.
Sobald eine Nachricht erfolgreich ausgeliefert wurde, wird diese aus der Queue gelöscht.

Das Message Queuing beschreibt also ein Verfahren, mit dem das Erstellen einer Aufgabe von deren Ausführung getrennt wird - eine Entkopplung der Systeme.
Dabei wird nicht nur die Tätigkeit des Erstellens von der Verarbeitung entkoppelt, sondern auch die zeitliche Abhängigkeit der Komponenten.
Eine Nachricht kann durchaus eine längere Zeit in der Queue verweilen, bevor ein Consumer sie abholt.

In der einfachsten Variante ist das Message Queuing ein One-Way-Nachrichtensystem, das heißt, die Nachrichten fließen immer vom Producer über die Queue zum Consumer.
Das bedeutet, dass der Producer keine Rückmeldung vom Consumer erhält, ob ein Job bereits ausgeführt wurde oder überhaupt ausgeführt werden kann.
Er erhält bestenfalls eine Rückmeldung, ob die Nachricht in einer Queue eingereiht werden konnte.
Benötigt er eine Rückmeldung des Consumers, dann muss dafür eine zweite Queue als Antwortkanal eingerichtet werden.
Auf dem Antwortkanal vertauschen der Producer und der Consumer dann ihre Rollen.

Selbst wenn eine bidirektionale Kommunikation über zwei Queues eingerichtet wurde, sind Producer und Consumer vollständig voneinander entkoppelt.
Wird zum Beispiel der Producer durch eine effizientere Anwendung ersetzt, bekommt der Consumer davon nichts mit - zumindest, solange das Nachrichtenformat gleich bleibt.
Denn der Consumer holt lediglich die nächste Nachricht aus der Queue ab und verarbeitet sie.
Wer die Nachricht dort deponiert hat, ist für den Consumer unerheblich.

Ein wichtiger Vorteil des Message Queuing ist die zeitliche Entkopplung.
Angenommen der Producer erstellt die Jobs mit so hoher Geschwindigkeit, dass der Consumer nicht mehr in der Lage ist diese in angemessener Zeit zu verarbeiten.
Dann können weitere Instanzen der Consumer-Anwendung gestartet werden, welche dann gemeinsam die Jobs aus der Queue abarbeiten.
Das Gleiche funktioniert natürlich auch umgekehrt.
Ist der Producer nicht schnell genug beim Erstellen der Jobs, dann können weitere Instanzen des Producers gestartet werden, um den Consumer auszulasten.

## Message Queue (MQ) 

Das MQ-Modell, auch als Point-to-Point (P2P) bekannt, ist ein One-to-One Nachrichtensystem.
Das bedeutet aber nicht, dass eine Queue einen dedizierten Nachrichtenkanal zwischen zwei Anwendungen darstellt.
In eine Queue können beliebig viele Producer ihre Nachrichten einstellen und auf der anderen Seite können beliebig viele Consumer die Nachrichten entnehmen.
Eine Message Queue garantiert lediglich, dass jede Nachricht nur genau einmal zugestellt wird.
Welcher Producer die Nachricht eingestellt hat und welcher Consumer sie verarbeitet, ist dabei nicht vorherbestimmt.
Wird eine Nachricht an einen Consumer zugestellt, dann werden alle anderen Consumer sie nicht mehr erhalten.

Das MQ-Modell kann als Pull- oder Pushverfahren implementiert sein.
Beim Pullverfahren ist der Consumer selbst in der Verantwortung, sich eine neue Nachricht abzuholen, sobald er freie Kapazität dafür hat.
Beim Pushverfahren registriert sich der Consumer bei der Message Queue und bekommt von dieser seine Nachrichten zugewiesen.
Auf diese Weise kann die Message Queue auch als Load Balancer fungieren, um Aufgaben gleichmäßig auf mehrere parallele Arbeitsprozesse zu verteilen.

Falls zum Zeitpunkt des Nachrichteneingangs kein Consumer verfügbar ist, bleibt die Nachricht in der Queue, bis sie an einen Consumer zugestellt werden kann.
Eine Message Queue kann immer dort eingesetzt werden, wo eine Nachricht nur genau einmal verarbeitet werden darf, wie etwa bei einer Kontobuchung.

## Publish Subscribe (Pub/Sub)

Im Publish-Subscribe-Kontext wird der Producer als Publisher und der Consumer als Subscriber bezeichnet.
Anstelle von Queues spricht man hier meist von Topics.
Ein Topic ist dabei eine Queue, die über ein Schlüsselwort, das Topic, identifiziert wird.

Wenn ein Publisher eine Nachricht veröffentlichen will, dann muss er dieser ein Topic hinzufügen.
Denn nur anhand des Topics kann das Nachrichtensystem die Nachricht in der richtigen Queue bereitstellen.
Ein Subscriber muss sich entsprechend bei dem Nachrichtensystem für ein Topic registrieren, um die dort veröffentlichten Nachrichten zu erhalten.
Jede in einem Topic eingestellte Nachricht gilt erst dann als versendet und wird gelöscht, wenn alle registrierten Subscriber sie erhalten haben.

Wenn zum Zeitpunkt des Nachrichteneingangs kein Subscriber registriert ist, dann gilt die Nachricht sofort als zugestellt und wird gelöscht.
Allerdings kann das Verhalten je nach Implementierung variieren.
So gibt es zum Beispiel auch Nachrichtensysteme, welche die Nachrichten für einen registrierten Subscriber, der seine Verbindung verloren hat, zwischenspeichern.
Sobald der Subscriber wieder online ist, werden die wartenden Nachrichten zugestellt.

Das Publish Subscribe Pattern ist ein One-to-Many- beziehungsweise Many-to-Many-Nachrichtensystem, welches garantiert, dass alle Nachrichten in der gleichen zeitlichen Reihenfolge zugestellt werden, in der sie eingegangen sind.
Es wird in der Regel für Broadcasting eingesetzt, wenn eine Nachricht an mehrere Subscriber weitergeleitet werden soll.
Dabei verarbeitet jeder Subscriber die Nachricht für seine eigenen Zwecke.
Darf eine Nachricht nur ein einziges Mal verarbeitet werden, dann ist Publish Subscribe die falsche Wahl.

Als Einsatzbeispiel wird häufig ein Aktien-Broker angeführt.
Hier könnte man eine Reihe von Publishern erstellen, welche die verschiedenen Aktienkurse überwachen und jede Änderung in einem Topic veröffentlichen.
Eine Reihe von Subscribern kann sich dann für das Topic registrieren und etwa Kursprognosen berechnen, die Kurse in einer Datenbank persistieren oder grafisch aufbereiten.

Eine zentrale Komponente bei diesem System ist der Exchange, er ist der einzige Ansprechpartner für die Publisher.
Ein Publisher sendet seine Nachrichten nämlich nicht direkt an eine Queue, sondern an den Exchange.
Der Exchange verwaltet sämtliche Queues und kennt deren Topics.
Sobald eine Nachricht eingeht, sortiert er sie in die richtigen Queue ein.

# Vorteile von Message Queuing

Messages Queues sind unter anderem dann sinnvoll, wenn eine Anwendung vorübergehend mehr Nachrichten produziert als die empfangende Anwendung verarbeiten kann.
Der Producer kann so nicht durch einen überlasteten Consumer blockiert werden.
Die Nachrichten werden einfach in der Queue zwischengespeichert, bis der Consumer frei ist.

Der Consumer kann durch den Einsatz einer Message Queue in geringem Maße entlastet werden, denn er erhält keine Push-Nachrichten des Producers mehr.
Stattdessen kann der Consumer einfach die nächste Nachricht abholen, sobald er dafür bereit ist.

## Entkopplung

Der Einsatz von Message Queues entkoppelt die Anwendungen voneinander.
Somit benötigen die Producer- und die Consumer-Anwendung keinerlei Kenntnis voneinander, beide interagieren nur noch mit der Message Queue.
Dank der Entkopplung können beide Anwendungen in separaten Projekten von unterschiedlichen Teams entwickelt werden.

## Skalierbarkeit

Alle drei Komponenten (Producer, Queue, Consumer) können bei Bedarf unabhängig voneinander skaliert werden.
Zum Beispiel können, sobald sich Nachrichten in der Queue ansammeln, zusätzliche Consumer-Prozesse hochgefahren werden.

## Wartbarkeit

Durch die Entwicklung mehrerer kleiner Anwendungen, anstelle einer großen monolithischen, wird auch die Wartbarkeit erhöht.
Kleinere Projekte lassen sich erfahrungsgemäß leichter warten.

## Asynchrone Kommunikation

Die Anwendungen kommunizieren asynchron miteinander.
Dadurch wird verhindert, dass der Producer durch den Consumer blockiert wird.
Dank der Zwischenspeicherung kann der Consumer sogar offline sein, wenn die Nachricht versendet wird.

# Anwendungsgebiete

## Entkopplung von Microservices

Die folgende Abbildung zeigt, wie im Publish Subscribe Pattern mehrere Microservices über einen Message Broker kommunizieren.
Jeder Microservice konsumiert ein bestimmtes Topic, hier als Farbe dargestellt.
Ebenso schickt jeder Microservice unter seinem eigenen Topic Nachrichten an den Exchange, der sie in die Queues für das jeweilige Topic einreiht und so an die anderen Microservices schickt.

![Ein Exchange sortiert eingehende Ereignisse über seine Bindings in Queues ein, die sie reihum an ihre Consumer verteilen.](/assets/images/posts/message-queues/exchange.png)

## Temporär verfügbare Geräte

Wenn ein Microservice vorübergehend offline ist, sammeln sich seine Aufgaben in der Queue und können später abgearbeitet werden.
Das passiert zum Beispiel, wenn der Service auf einem mobilen Gerät oder in einer abgelegenen Region mit brüchiger Internetverbindung läuft, oder schlichtweg während der Docker Container im Rechenzentrum neu startet.

Hier zeigt sich der Vorteil gegenüber einer herkömmlichen Webservice-Umgebung.
Würden die Services sich direkt gegenseitig aufrufen, dann würde jeder Request an einen gerade nicht verfügbaren Service mit einem Fehler abbrechen.
Jeder einzelne Service müsste sich selbst um die Zwischenspeicherung und Wiederholung kümmern.

In einer AMQP-Umgebung hingegen kann jeder Service jederzeit jeden anderen ansprechen.
Falls ein Service nicht mit seiner Queue verbunden ist, warten die Nachrichten, bis er wieder online ist.
Dann werden alle liegen gebliebenen Aufgaben abgearbeitet.
Abgesehen von einer Verzögerung, kann der Ausfall sogar unbemerkt vorübergehen.

# Risiken und Nebenwirkungen

Vorsicht ist geboten, wenn ein Microservice nach einem Neustart auf keinen Fall veraltete Nachrichten abarbeiten darf.
Als Beispiel soll hier eine Turbine in einem Windpark dienen, die jede Minute ihren Status veröffentlicht.
Das Wartungspersonal stellt nun fest, dass die Turbine seit einer Stunde konstant dieselbe Windgeschwindigkeit meldet.
Das kann nicht sein, mit der Maschine stimmt offenbar etwas nicht.

Also senden sie einen Stoppbefehl per Message Queue.
Als dieser keinen Effekt hat, fährt ein Technikteam hinaus, schaltet das Windrad manuell ab und fährt nach der Reparatur alle Systeme wieder hoch.
Kaum läuft die Turbine wieder fehlerfrei, trifft über die Queue der Stoppbefehl ein und sie schaltet sich ab.

Für kritische Steuerungen, die eine Reaktion sofort oder gar nicht erfordern, ist eine synchrone Kopplung, beispielsweise per REST, offensichtlich besser geeignet.

## Lösungsansatz: Nachrichten mit Verfallsdatum

Mit einer Erweiterung des AMQP-Standards lässt sich die verspätete Verarbeitung eiliger Nachrichten verhindern.
In RabbitMQ heißt die Lösung TTL (time to live) und lässt sich auf eine Queue oder auf einzelne Nachrichten anwenden.

Wartet eine Nachricht in Queue A bis deren TTL abgelaufen ist, dann gilt sie für Queue A als tot.
Das heißt, sie wird nicht mehr ausgeliefert und bestätigt, sondern bei nächster Gelegenheit vom Server gelöscht.
Falls dieselbe Nachricht auch in einer anderen Queue B wartet, gilt dort eventuell eine andere TTL, so dass die Nachricht in Queue B am Leben bleibt.

Zum Beispiel wird ein Stoppbefehl für Teile eines Maschinenparks vom Absender an den Exchange geschickt und von diesem parallel in die Queues zweier Maschinen A und B gelegt.
Beide Maschinen sind noch jeweils 15 Sekunden beschäftigt, bis sie auf den neuen Befehl reagieren.
Queue A hat eine TTL von 20 Sekunden, Maschine A erhält den Befehl und stoppt.
Queue B hat eine TTL von nur 10 Sekunden, Maschine B verpasst also den Befehl und das Personal bekommt zeitnah eine Fehlermeldung.

Allerdings ist TTL nicht im AMQP-Standard enthalten, sondern ein spezielles Feature der Implementierung RabbitMQ.
Im Folgenden wird RabbitMQ mit seinen Zusatzfunktionen genauer vorstellt.

# RabbitMQ

[RabbitMQ](https://www.rabbitmq.com/) ist eine freie Implementierung des Advanced Message Queueing Protocol.
Die Software kann auf dem eigenen Server installiert werden, in den meisten Fällen reicht sogar das fertig mitgelieferte Docker Image aus.

Der aus dem Standard-Image gestartete Docker Container gibt zwei Ports frei:
Auf Port 5672 ist der AMPQ-Server erreichbar, auf 15672 läuft die Verwaltungsoberfläche.
Hier lassen sich Exchanges, Bindings und Queues von Hand einrichten.

Manche Client Libraries wie etwa EasyNetQ übernehmen die Konfiguration automatisch.
In diesem Fall kann man in der Verwaltungsoberfläche sehen, ob alles korrekt eingestellt ist.

## Queues

Besonders praktisch ist die Queues-Ansicht.
Dort können die Nachrichten in einer Queue nicht nur eingesehen, sondern auch gelöscht und einzelne Nachrichten manuell eingeschoben werden.
Beim Testen einer Consumer-Anwendung wird man diesen Dialog am häufigsten benutzen.

![RabbitMQ Queues](/assets/images/posts/message-queues/rabbitmq-queues.png)

Üblicherweise legt eine Consumer-Anwendung ihre Queues selbst an.
Sofern nichts anderes eingestellt wurde, existiert die Queue dann, bis der Message Broker neu gestartet wird.
Andernfalls kann die Queue auch permanent sein, das heißt, sie überlebt einen Neustart von RabbitMQ.
Auch das Gegenteil ist möglich, dafür gibt es zwei Arten temporärer Queues.
Auto-delete Queues verschwinden, nachdem sich der letzte Consumer abgemeldet hat.
Exklusive Queues sind mit genau einem Consumer verbunden und verschwinden, sobald dieser sich abmeldet.

## Exchanges

Die Exchanges-Ansicht listet alle Exchanges auf und ermöglicht es, neue Exchanges von Hand anzulegen.
Je nach verwendeter Client Library ist das nur selten nötig.
So legt etwa EasyNetQ alle benötigten Exchanges und Queues automatisch an.

![RabbitMQ Exchanges](/assets/images/posts/message-queues/rabbitmq-exchanges.png)

Bei der manuellen Konfiguration ist die Auswahl eines passenden Exchange-Typs wichtig.
* Ein *Direct Exchange* routet die eigehenden Nachrichten anhand ihres *Routing Key* in eine festgelegte Queue.
* Ein *Topic Exchange* verwendet ebenfalls den *Routing Key*, schickt die Nachrichten jedoch nicht an nur eine Queue, sondern an alle, deren Suchmuster zum *Key* passt.
* Ein *Fanout-Exchange* schickt eine Nachricht parallel in mehrere Queues, ohne sie zu filtern.
* Ein *Header Exchange* ermöglicht komplexes Routing anhand mehrerer Attribute im Header der Nachricht.


## Bestätigung

Normalerweise gilt eine Nachricht als angekommen, wenn sie vom Broker an den Empfänger ausgeliefert wurde.
Wenn der Empfänger die Verarbeitung mit einem Fehler abbricht, ist die Nachricht bereits aus der Queue gelöscht.

RabbitMQ gibt dem Empfänger eine Chance, die erfolgreiche Verarbeitung zu bestätigen.
Erst danach wird die Nachricht aus der Queue entfernt.
Im Fehlerfall weist der Empfänger die Nachricht zurück, woraufhin sie erneut in die Queue eingereiht wird.
Alternativ kann ein Exchange als "toter Briefkasten" (Dead Letter Exchange) eingerichtet werden, der fehlerhafte Nachrichten zur Prüfung weiterleitet.

## Dead Letter Exchanges

Manchmal können Nachrichten nicht zugestellt werden.
Häufige Ursachen sind eine abgelaufene time-to-live oder ein Verarbeitungsfehler auf Empfängerseite.
Manchmal hat auch die Queue eine Größenbeschränkung und läuft über.
Für solche Fälle kann man vorab einen DLX (Dead Letter Exchange) deklarieren, der verlorene Nachrichten auffängt.

## Priorität

Mehrere Konsumenten, die von derselben Queue beliefert werden, können unterschiedliche Prioritäten besitzen.
Die weniger wichtigen Konsumenten sollen nur bedient werden, wenn der Wichtigste ausgefallen ist.

In RabbitMQ ist es möglich, jedem Empfänger beim Start eine Priorität mitzugeben.
Eine Queue beliefert dann nicht mehr alle ihre Konsumenten reihum, sondern nur noch die mit der höchsten Priorität.
Erst wenn alle wichtigsten Konsumenten blockiert sind, werden Nachrichten reihum an die Zweitwichtigsten ausgeliefert.

# Apache Qpid

Auch das Open-Source-Projekt [Qpid](https://qpid.apache.org/) bietet APIs und Broker, um AMQP in die eigene Software zu integrieren.
Der Einstieg in Qpid lohnt jedoch nur in sehr speziellen Anwendungsfeldern, in denen die Features anderer Message Broker nicht ausreichen.

Im Gegensatz zu RabbitMQ, stehen dort drei unterschiedliche Broker zur Auswahl.
Für reine Java-Umgebungen ist "Broker-J" interessant.
Die native Implementierung heißt "Qpid C++ Broker".
Wo Skalierbarkeit zählt, sollte der hochperformante "Dispatch Router" gewählt werden.

Mit der Library [Qpid Proton](https://qpid.apache.org/proton/index.html) lassen sich nicht nur Clients entwickeln.
Sie unterstützt auch die Entwicklung eines eigenen Brokers, falls das nötig sein sollte.
So flexibel Qpid im Endeffekt ist, so steil ist allerdings auch die Lernkurve vor dem ersten lauffähigen System.

# Apache ActiveMQ

[ActiveMQ](https://activemq.apache.org/) ist ein Java-basierter Broker.
Passende Client-Bibliotheken sind für diverse Plattformen verfügbar.
Bemerkenswert ist das API "Apache.NMS.AMQP" mit seinem Anspruch, alle mit AMQP 1.0 kompatiblen Messaging-Systeme zu unterstützen.
Ein um den ActiveMQ-Broker herum entwickeltes Softwaresystem lässt sich so im Prinzip an jeden anderen Broker andocken.

# Weitere AMQP-Varianten

## Solace PubSub+

[PubSub+](https://solace.com/products/event-broker/software/) vom Hersteller Solace ist nicht Open Source.
Auf 10.000 Nachrichten pro Sekunde gedrosselt, darf die Software kostenlos genutzt werden.
Die Enterprise Edition verspricht Support und ungebremste Performance.

## Azure Service Bus

Der [Azure Service Bus](https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-amqp-protocol-guide) ist ein Cloud basierter Broker.
Das heißt, eine Installation in einer Test-VM oder im eigenen Rechenzentrum ist nicht möglich.
Deshalb eignet er sich nur für Anwendungen, die sich ohnehin auf die Azure-Plattform verlassen.

# Fazit

AMQP ist eine beliebte Möglichkeit, Microservices voneinander zu entkoppeln.
Je nach Anwendungsfall stehen freie, proprietäre sowie auf eine Cloud-Plattform spezialisierte Broker zur Verfügung.

Nicht umsonst ist RabbitMQ einer der beliebtesten Broker.
Er ist leicht zu handhaben und kann sogar als Docker Container auf jedem Developer Notebook laufen.
Dank einer wachsenden Community um RabbitMQ gibt es Bibliotheken für viele unterschiedliche Programmiersprachen.
Bei proprietären Lösungen hingegen ist man auf die Schnittstelle des Herstellers angewiesen.
