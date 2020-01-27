---
layout: [post, post-xml]                                    # Pflichtfeld. Nicht ändern!
title:  "Ein Konzept für die E2E Testautomatisierung (Teil 4)"       # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2020-01-25 09:00              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2020-01-25 09:00
author: andernach                      # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: [Branchen & People]       # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Testing, Softwarequalitätssicherung, Oberflächentests]                       # Optional.
---
# Sich auf das Wesentliche konzentrieren 

Nehmen wir folgendes Beispiel an: Ein Benutzer A mit Berechtigung BE01 ruft ein geschütztes Formular auf, das ohne die Berechtigung BE01 nicht abrufbar ist, und befüllt es mit  einem Datensatz.
Ein Benutzer B entzieht währenddessen dem Benutzer A die Berechtigung BE01.
Benutzer A bestätigt derweil seine Angaben und speichert die Änderungen.
_Ist dieser Testfall zu automatisieren?_
Es gibt hierfür zwei unterschiedliche Meinungen:
Die Einen meinen: So ein Testfall sei extreme und tritt nicht so häufig auf, deswegen solle es besser auf die Funktionalität (die Datenvalidierung im Formular) fokussiert werden, die häufiger benutzt wird.
Die anderen meinen hingegen, dass so ein Testfall manuell nachzustellen sei fast unmöglich und dieser Fall könne im Betrieb auftreten, genau deswegen sollte dieser Testfall automatisiert werden.
Die Testautomatisierung solle unteranderem Fälle testen, die manuell nicht möglich zu testen sind.
Schlussendich hängt die Automatisierung von so einem Testfall stark von der Erwartung des Auftraggebers ab.
Je nachdem, wie die Berechtigungen aufgebaut sind, und wie oft dieser Fall eintrifft, kann das von Relevanz sein.
Es sollte aber klar sein, dass das manuelle und automatisierte Testen nicht eine hundertprozentige Sicherheit gibt, dass eine Softwarelösung fehlerfrei ist. 
     

# Weitere Ergänzungsmittel für die Fehleranalyse

Die Logausgaben liefern viele Informationen und Möglichkeit zum Nachstellen, jedoch können gegebenenfalls nicht alle notwendigen Informationen über die Logausgaben bereitgestellt werden.
Bei UI-Tests kann es auch mal notwendig sein zu sehen, welches Textfeld gerade im Fokus ist.
Hierzu können mit einem Screenshot im Fehlerfall weitere hilfreiche Informationen festgehalten werden. 
Die Screenshots und die Logausgaben sind hilfreich, doch eine Videoaufnahme für den fehlgeschlagenen Testfall könnte weitere Informationen liefern und kann als weiteres Ergänzungsmittel benutzt werden.
Vor allem, wenn die Testfälle in einem Pipeline in einer virtuellen Machine oder auf einer externe Resource ausgeführt werden.
Denn dadurch könnte die Ausführung dokumentiert werden.
Textuell wird jeder Prozess in Form von Logs dokumentiert, visuell wird der Fehler in der Form von Screenshots erfasst. 
Die Heapdumps können auch ein weiteres Mittel für die Fehleranalyse sein.
Je nach Technologie können Heapdumps beim Fehlerfall erzeugt und dem Entwickler zur Verfügung gestellt werden.
Der Einsatz von den verschiedenen benannten Ergänzungsmitteln soll abgewägt werden.

# Benachrichtigung über die Ergebnisse des Testdurchlaufs

Eine Mitteilung über den Testdurchlauf und das Importieren von Ergebnissen in einem Archivierungssystem bzw. Ticketing System bietet den Teammitgliedern einen guten Überblick und kann wertvolle Zeit ersparen.
Anstatt gezielt nach solchen Informationen an verschiedenen Orten zu suchen, kann eine Mitteilung bspw. eine Statistik über durchgelaufene Testfälle mit dem Ausführungsergebnis darstellen.
Diese sollte eine Verknüpfung mit dem Testplan, der ausgeführten Pipeline und Informationen zur Testdurchführung enthalten.
Es ist beispielsweise möglich in diversen Kommunikations-Systeme wie Slack oder  Microsoft Teams Benachrichtigungen über die Testdurchführung zu verschicken, die der untenstehenden Abbildung ähneln.
![Auf einen Blick können wichtige Informationen entnommen werden](/assets/images/posts/konzept-fuer-die-e2e-testautomatisierung/notification.png) 
So kann eine Benachrichtigung aussehen.
Microsoft Teams bietet mittels Webhooks die Möglichkeit an, solche Benachrichtigungen mit einem Curl-Befehl zu verschicken.

Da die Produktentwicklung meistens schnelllebig ist und die Umsetzung der Anforderungen aufeinander aufbaut, kommt es nicht selten vor, dass Änderungen an der UI und der Logik vorgenommen werden.
Diese Schnelllebigkeit erfordert eine ständige Wartung und Anpassung der Testfälle.
Jeder Entwickler, der den Logik oder die UI angepasst hat, soll die dazugehörigen Testfälle anpassen oder neue Testfälle automatisieren.

# Testdaten zentral ablegen

Wo die Testdaten gepflegt werden, wie realitätsnah und praxisbezogen sie sind, spiegelt sich in der Qualität und der Aussagekraft der Testautomatisierung wieder.
In der Praxis ist die kontinuierliche Pflege der Testdaten meistens eine besondere Herausforderung, denn dabei werden die Testdaten wenigstens mittels einer Wikiseite und im Code instandgehalten.
Somit kann es schnell vorkommen, dass die Testdatendokumentation und die Testdaten voneinander abweichen. 
Dieses Thema ist für die Testautomatisierung von Relevanz, da die zuverlässige Ausführung der Testfälle stark von der Richtigkeit der Testdaten abhängt.
Je vielfältiger die Speicherorte der Testdaten sind, desto negativer wird es sich auf die Testqualität auswirken.   
Hierfür könnte der Testmanager ein Teammitglied mit der Pflege und der Instandhaltung der Testdaten beauftragen.
Bevorzugt wird jedoch, wenn ein Testdatenspeicherort eine Hoheit hat und eine Routine entwickelt wird, die die Testdaten zwischen verschiedenen Quellen synchronisiert.
Es werden beispielsweise die Testdaten im E2E Repository und die Wiki-Seite mit der initialen Testdaten im Backend-Repository synchronisiert. 

# Fazit und Rückblick

Ein durchdachtes Konzept für die Testautomatisierung ist ein wichtiger Bestandteil für eine flüssige Entwicklung, es ermöglicht ein schnelles Einarbeiten neuer Kolleg*Innen und kann wichtige Messwerte und Informationen über die Qualität der Software und das Erfüllen der Akzeptanzkriterien liefern.
Durch die Ausführung der Testfälle zu einem bestimmten Zeitpunkt z.B. vor Arbeitsbeginn oder vor dem Mergen auf Master kann die Software stets auf Funktionalität geprüft werden. 
Die Kosten für die Entwicklung und Wartung von E2E Test wird sich im Laufe des Projekts relativieren.


Denn der Aufwand für das manuelle Testen steigt immer linear, anderes als E2E Testing.
Die Entwicklung von E2E Tests ist am Anfang zeitaufwendiger, jedoch im Laufe des Projekts wird die Entwicklung, die Wartung und die Testpflege leichter auffallen.
Gerade in Regressionstests und testgetriebene Entwicklung ist die Automatisierung häufig wiederholte Tests zu empfehlen.
