---
layout: [post, post-xml]              # Pflichtfeld. Nicht ändern!
title:  "Open Platform Communication" # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2023-09-08 08:00              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2023-09-08 08:00       # Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author_ids: [cjohn]                   # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesen Namen geben.
categories: [Branchen]                # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Open Platform Communication, OPC, Applications, Hardware, Prozesssteuerung] # Bitte auf Großschreibung achten.
---

Maschinen sprechen miteinander.
Sie stimmen Prozessschritte ab, nehmen Anweisungen entgegen und melden ihren Zustand.
Eine ihrer Sprachen ist Open Platform Communication.
Diese Sprache wollen wir uns in diesem Artikel näher ansehen.

# Wir müssen reden

Industriegeräte tauschen ständig Information aus.
Sie fragen nach Sensorwerten oder dem Arbeitsfortschritt.
Sie erteilen einander Aufträge und sie stoppen, sobald anderswo im Prozess ein Fehler auftritt.

Als Beispiel soll hier ein Windpark mit zwei Turbinen herhalten.
Mit ihren Sensoren überwachen die Windräder sich selbst, doch allein reparieren können sie sich natürlich nicht.

![Fallbeispiel](/assets/images/posts/open-platform-communication/windrad.png)

Deshalb müssen bevorstehender Wartungsbedarf und akute Schäden sofort an die Technikabteilung gemeldet werden.
Letztere antwortet darauf mit Steuerbefehlen, die der Windpark umsetzen muss.
Für den stabilen Netzbetrieb ist es außerdem wichtig, die aktuelle Einspeiseleistung genau zu kennen und gegebenenfalls herunterregeln zu können.

# Geschichte

Bereits in den 1990er Jahren gründeten einige Hersteller eine Task Force, um die Steuerung von Geräten per Software zu vereinheitlichen.
Sie nannten sich [OPC Foundation](https://opcfoundation.org/about/opc-foundation/history/) und veröffentlichten einen Standard, der zunächst "OLE for Process Control" hieß.
OLE steht für "Microsoft Object Linking and Embedding", denn der erste OPC-Standard basierte vollständig auf dem Component Object Model von Windows.
Erst als der Standard sich über Prozesssteuerungen hinaus etablierte, wurde er umbenannt in "Open Platform Communication".
 
Seitdem verlor Windows in hardware-nahen Systemen an Relevanz.
Gleichzeitig entstanden flexiblere Netzwerkprotokolle, so dass heute niemand mehr DCOM in einer Systemarchitektur einplant.

Im Jahr 2006 veröffentlichte die OPC Foundation schließlich den Folgestandard Unified Architecture (UA).
Er basiert auf TCP, wobei wahlweise ein binäres oder ein XML-Protokoll eingesetzt werden kann.
Damit ist er plattformunabhängig und könnte sogar auf eingebetteten Steuergeräten laufen.

# OPC UA als gemeinsame Sprache

In einem Windpark steht üblicherweise eine Technikhütte, die alle Windräder gemeinsam mit dem Internet verbindet.
Der Windpark muss unterschiedliche Datenpunkte zur Verfügung stellen, etwa die technische Beschreibung seiner Turbinen und deren momentane Leistung.
Solche Informationen werden bei Bedarf abgefragt, im sogenannten Request-Response-Verfahren.

Warnungen bei Schäden und Ausfällen hingegen können nicht warten, bis jemand sie abruft.
Sie werden im Publish-Subscribe-Verfahren sofort an alle interessierten Gegenstellen gesendet.

Wenn Fachkräfte entscheiden, ein Windrad aus oder wieder ein zu schalten, wird ein Rückkanal benötigt, der die Steueranweisung zielsicher an die richtige Turbine zustellt.
Das heißt, jeder Knoten im Gerätenetz muss eindeutig adressierbar sein.

Diese Fälle werden von den OPC-Unterprotokollen *Direct Access* (DA) beziehungsweise *Alarms & Conditions* (AC) abgedeckt.
Es gibt zwei weitere Unterprotokolle *Historical Data Access* (HA) und *Programs* (Prog), die weniger gebräuchlich sind und hier nicht näher betrachtet werden.

## Der Adressraum

Ein OPC-Server veröffentlicht einen eigenen Adressraum, in welchem jeder noch so kleine Datenpunkt als Knoten repräsentiert ist.
Meistens wird er als Baumstruktur dargestellt.
In Wirklichkeit handelt sich allerdings um einen beliebigen Graphen, denn jeder Knoten darf mehrere Elternknoten besitzen.

Entsprechend seiner Funktion hat jeder Knoten einen Datentyp.
Zum Beispiel kapseln Attributknoten einen primitiven Wert, Ereignisknoten melden Alarme, Methodenknoten lösen Aktivitäten aus und Objektknoten fassen andere Knoten zusammen.

Der Windpark lässt sich als Ordnerknoten modellieren, der Turbinen enthält, die wiederum Attribute und Ereignisse haben.
Die Abbildung zeigt ein solches Modell im Testclient [UaExpert](https://www.unified-automation.com/products/development-tools/uaexpert.html).

![Übersicht des Demo-Servers in UaExpert](/assets/images/posts/open-platform-communication/uaExpert.png)

## Direct Access

DA bedeutet, dass der Client einen Knoten abfragt und der Server mit dessen Inhalt antwortet.
So kann der Adressraum im Request-Response-Verfahren durchsucht oder direkt ein bekannter Knoten abgefragt werden.
Als Adresse dient einfach der Pfad im Adressraum, zum Beispiel "DemoWindfarm/Name" für den sprechenden Namen des Parks.
Das löst den ersten Anwendungsfall, der Windpark stellt auf Abruf seine Selbstbeschreibung zur Verfügung.

Über den Pfad eines Attributknotens kann der Client auch dessen Wert neu setzen.
So könnte man bei "DemoWindfarm/Turbine1/MaxPower" etwa die maximale Leistung drosseln, indem man den Wert von "MaxPower" von 100 auf 50 herabsetzt.
Das kann notwendig sein, um die Netzfrequenz zu stabilisieren, wenn mehr Energie eingespeist als verbraucht wird.

Die Methoden *Stop* und *Start* kann ein Client aufrufen, um das Windrad abzuschalten und später wieder zu starten.
Damit löst DA auch den dritten Anwendungsfall, der Windpark kann ferngesteuert werden.

## Alarms & Conditions

Um Probleme sofort mitzubekommen, wird ein Publish-Subscribe-Verfahren benötigt.
Dabei meldet sich der Client einmal für Ereignisse eines Knotens an, von da an wird er über jede Zustandsänderung aktiv informiert.

In der Abbildung ist "Alarm" ein solcher Ereignisknoten. Er enthält von jeder Turbine einen Notifier.
Dieselben Notifier "T1-Error" und "T2-Error" finden sich auch unterhalb der jeweiligen Turbine.
Sie haben jeweils zwei Elternknoten - Turbine und Windpark - damit Clients wahlweise nur eine Turbine oder den ganzen Park beobachten können.
Beide Alarmereignisse sind normalerweise inaktiv. Nur wenn ein Fehlercode vorliegt, wird der Alarm aktiv.

So löst AE den zweiten Anwendungsfall, alle interessierten Clients werden im Problemfall sofort gewarnt.
Die Unterprotokolle DA und AE sind also ausreichend, um einen Windpark fernzusteuern.

# Gründe für eine Migration von OPC Classic zu UA

Obwohl OPC UA seit mehr als 15 Jahren existiert, bauen viele produktive Systeme nach wie vor auf OPC Classic auf.
Denn um die Software umzustellen, müssen alle beteiligten Geräte und Anwendungen OPC UA unterstützen.
Bei der Steuersoftware für Maschinen, die über Jahrzehnte in der Produktion oder in Kraftwerken genutzt werden, ist kaum mit tiefgreifenden Updates zu rechnen.

Andere Geräte sind systemkritisch, so dass sie nicht für ein riskantes Upgrade mehrerer Software-Komponenten abgeschaltet werden sollen.
In manchen Betrieben fehlt möglicherweise auch die Einsicht des Managements oder schlichtweg das qualifizierte Fachpersonal.

Wer zu spät mit der Umstellung beginnt, wird in Kürze jedoch vor Problemen stehen.
DCOM läuft ausschließlich auf Windows-Betriebssystemen und ist anfällig für Konfigurationsfehler.
Dabei sind brandneue Komponenten, die in den bestehenden Prozess eingebunden werden sollen, heute oft außen vor.

Dazu kommt, dass Microsoft im Jahr 2023 per automatischem Update [DCOM Hardening](https://techcommunity.microsoft.com/t5/windows-it-pro-blog/dcom-authentication-hardening-what-you-need-to-know/ba-p/3657154) verpflichtend eingeführt hat.
Die DCOM-Sicherheit abzuschalten, um sich nicht um deren Konfiguration kümmern zu müssen, ist seitdem nicht mehr möglich.
Alte OPC-Anwendungen verlassen sich eventuell darauf und müssen schlimmstenfalls umprogrammiert werden.

Eine weitere Fehlerquelle für DCOM entsteht, wenn alte Rechner auf Windows 2019 aktualisiert werden.
In einem Projekt beobachteten wir danach mysteriöse Timeouts beim Lesen von Datenpunkten.
Nur ein Downgrade auf Windows Server 2008 schien zu helfen.
Nach langer Analyse stellte sich heraus, dass alte OPC-Server Pakete senden, die größer als 1500 Byte sind.
Unter Standardeinstellungen filtern Netzwerktreiber diese "Jumbo Packets" aus, sofern man nicht ausdrücklich die Maximum Transfer Unit (MTU) vergrößert.
So verschwand ein Teil von OPC Classic schlichtweg auf Netzwerkebene.

In einem anderen Fall verschwand bei einem Update die registrierte Programm-ID eines OPC-Servers aus den Komponentendiensten.
Die DCOM-Komponente war nur noch über ihre Class-ID ansprechbar, was eine Reihe von Workarounds in den Konfigurationen aller Clients zur Folge hatte.

Bei OPC UA ist für eine Verbindung nur die TCP-Adresse des OPC-Servers nötig.
Authentifizierung ist per Zertifikat möglich, kann aber auch abgeschaltet werden.
Die Betriebssysteme sind nicht mehr relevant, OPC UA steht also nicht mal einer Abkehr von Windows im Weg.
