---
layout: [post, post-xml]              # Pflichtfeld. Nicht ändern!
title:  "Zeitersparnis durch RPA, AI und der Microsoft PowerPlatform"         # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2020-10-06 10:25              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2020-10-11             # Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author: mschulz-adesso                       # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: [Microsoft]                    # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [RPA, PowerAutomate, PowerPlatform, AI, UI Flow, PowerAutomate Desktop, Teams Microsoft]         # Bitte auf Großschreibung achten.
---

Jeder kennt es, bestimmte IT-Arbeitsschritte, die sich von den Eingaben unterscheiden jedoch nicht von den Klicks - Hier gibt es ein enormes Optimierungspotential, wenn diese Tätigkeiten automatisiert werden können...bei jedem. 

Es geht mir dabei nicht nur um die Optimierung der Netto-Arbeitszeit, die häufige Tätigkeiten benötigen, sondern auch um die Switching-Zeit - also die Zeit, die uns immer wieder aus unseren Themen rausreißt und uns somit ablenkt.

Speziell „Robotic Process Automation“ (RPA) kann uns hier unterstützen und ermöglicht die automatisierte Ausführung von manuellen Eingaben.

Das perfekte und spannende Beispiel für mich sind Applikationen, die entweder keine Schnittstellen wie Konrektoren, API etc. bereitstellen oder bei denen die Schnittstellenbereitstellungen zu komplex sind. 

Die neuen technischen Möglichkeiten der Microsoft PowerPlatform ermöglichen auch PowerUsern solche UseCases schnell und einfach umzusetzen.


# Mein Szenario

Als Prozessgrundlage hat mich u.a. dieses Microsoft Tutorial inspiriert [Robotic Process Automation with Microsoft PowerAutomate, UI flows and AI Builder] (https://www.youtube.com/watch?v=NxJ2Zch7M2o), bei dem ich selbst die Umsetzung testen will. 

Hierbei haben sich die Features etwas geändert, das neue Tool PowerAutomate Desktop ist da und das möchte ich testen.


Als Beispiel-Prozess nehme ich das Freigeben von Rechnungen und die dazugehörige Pflege in eine lokale Excel-Datei, die ein ERP-System simulieren soll.


Dabei werde ich auch den AI-Builder der Microsoft PowerPlatform nutzen, um KI-gesteuert Informationen aus Dokumenten zu extrahieren.


Dieses Beispiel benötigt in der täglichen Praxis viele manuelle Schritte, die sich optimieren lassen hinsichtlich Zeitaufwand, den Fokus auf wichtigere Dinge stärkt und Fehler minimiert.


## Der gängige Prozess

In der Regel sieht der Prozess wie folgt aus:

* Mitarbeiter (MA) hat eine Rechnung

* MA schickt Rechnung per Email an FK (Führungskraft) und bittet um Freigabe -> 5 Min

* FK liest Rechnung, gibt Rechnung frei als Prosatext in der Email und sendet Email zurück -> 5 Min

* MA erhält Email und liest die Freigabe -> Zeitaufwand: 5 Min

* MA öffnet sein ERP Programm und gibt alle Daten der Rechnung ein -> Zeitaufwand: 10 Min

Investierte Nettoarbeitszeit: ca. 25 Min pro Rechnung

Switching-Zeit / Verlust des Fokus: Viel höher


## Der optimierte Prozess
* MA hat eine Rechnung

* MA schickt Rechnung per Email an Rechnungs-Mailbox -> 5 Min

* FK bekommt automatisch im Teams eine Kachel mit wesentlichen Informationen -> 0 Min

* FK sieht neue Nachricht in Teams und klickt den "Approved"-Button -> 5 Min

* Rechnung wird automatisiert im ERP System eingetragen -> 0 Min

Investierte Nettoarbeitszeit: ca. 10 Min pro Rechnung

Switching-Zeit / Verlust des Fokus: Viel niedriger, da u.a.wichtige Informationen hervorgehen werden


Prozessschritte im Detail
MA schickt Rechnung per Email an Rechnungs-Mailbox

(/assets/images/posts/Zeitersparnis-durch-RPA-und-Microsoft-PowerPlatform/Rechnungsversand.png)


FK bekommt automatisch im Teams eine Kachel mit wesentlichen Informationen

(/assets/images/posts/Zeitersparnis-durch-RPA-und-Microsoft-PowerPlatform/Teamskachel.png)

Rechnung wird automatisiert im ERP System eingetragen
Hier bietet sich ein Video definitiv besser an ;)



## Technische Basis

In diesem konkreten Beispiel nutze ich die PowerPlatform als No-Code Plattform, um die Freigabe von Rechnungen zu erleichtern und die dazugehörige Pflege in einem ERP-System zu automatisieren.

Hierbei wird Outlook und Microsoft Teams ein Kommunikationsplattform genutzt.

Ich nutze einen normale Workflow-Engine PowerAutomate aka Flows, um die ganzen Prozessschritte auszuführen. Dabei wird die RPA Funktion über die Benutzeroberflächen-Flows ausgeführt.

PowerAutomate bietet per se Konrektoren zu Outlook und Teams, so dass ich sofort starten kann.
 


## Grundlage ist PowerAutomate aka Flow, um den Prozess zu automatisieren

Im Grunde genommen sind es zwei Schritte, die benötigt werden, um die komplette Logik auszuführen.
1. Der Trigger
2. Die Entscheidung, was unsoll passieren

(/assets/images/posts/Zeitersparnis-durch-RPA-und-Microsoft-PowerPlatform/PowerAutomate.png)


Der Trigger ist in meinem Fall der Empfang einer Email in der dedizierter Mailbox "Rechnungen". Über Standardkonnektoren zu Office365 Mailboxes war das schnell für mich gemacht.

Die Entscheidung, was passieren soll enthält jetzt spannenden Themen:

Schritte:
* Er nimmt die Anlage der empfangenen Email - in diesem Fall eine PDF
* Gibt diese an die KI-Komponente weiter
* Extrahiert automatisiert relevante Rechnungsdaten aus der PDF
* Nimmt die Daten und erstellt eine Optionsauswahl-Post in einem ausgewählten Bot-Teams-Chat
* JETZT muss die Führungskraft im Teams-Chat entscheiden - in diesem Beispiel gibt die FK die Rechnung frei
* Der Prozess geht jetzt weiter, öffnet automatisch die ERP-Seite und gibt die relevanten Daten ein

(/assets/images/posts/Zeitersparnis-durch-RPA-und-Microsoft-PowerPlatform/PowerAutomateDetail.png)


Ich möchte die spannenden Schritte des PowerAutomates jetzt näher erläutern

## Extrahiert automatisiert relevante Rechnungsdaten aus der PDF
Der AI Builder ist eine Komponente der PowerPlatform, die ich nutze, um die Rechnungen zu analysieren. 

Dabei ist stellt "Formularverarbeitung" die benötigte Funktion dar

(/assets/images/posts/Zeitersparnis-durch-RPA-und-Microsoft-PowerPlatform/AiBuilder.png)


Hierbei habe musste ich mindestens fünf Beispiel-Rechnungen erstellt und hochladen damit der AI Builder die relevanten Informationen wie Datum, Betrag etc. automatisch "erlernt".

(/assets/images/posts/Zeitersparnis-durch-RPA-und-Microsoft-PowerPlatform/AiBuilderUpload.png)

In der Vergangenheit musste ich hierfür komplexere Logiken implementieren, die ich bspw. Mit Azure Machine Learning implementiert habe.

Mit dem AI-Builder kann ich dem Modell sagen, welche Felder relevant sind auf den Rechnungen, damit es selbständig "trainieren" kann

(/assets/images/posts/Zeitersparnis-durch-RPA-und-Microsoft-PowerPlatform/AiBuilderWerte.png)

Nach dem Training stehen mir die extrahierten Felder in meinem PowerAutomate zur Verfügung. Hier zu erkennen in der Teamchat-Nachricht "Meldung"

(/assets/images/posts/Zeitersparnis-durch-RPA-und-Microsoft-PowerPlatform/PowerAutomateWerte.png


## Automatisierte Eingabe von Daten durch RPA
Um Eingaben ermöglichen zu automatisieren, muss ich vorab die Eingabe "recorden", damit der Benutzeroberflächen Flow diese Schritte automatisieren kann. Hierbei werden ein paar kostenlose Tools von Microsoft und Selenium benötigt.

(/assets/images/posts/Zeitersparnis-durch-RPA-und-Microsoft-PowerPlatform/RPAEinrichtung.png)


In den nächsten Schritte sage ich dem Benutzeroberflächen Flow in welcher Form ich die Eingaben "recorden" möchte:

(/assets/images/posts/Zeitersparnis-durch-RPA-und-Microsoft-PowerPlatform/RPARecorder.png)

Ich nutze die Vorschauversion vom PowerAutomate Desktop. Als Alternative könnte ich die Selenium-IDE nutzen, die ein Open-Source-Tool ist, mit dem ich Interaktionen auf Websites aufzeichnen und wiedergeben kann. Dieses Tool wird auch oft bei Tests genutzt.


PowerAutomate Desktop bietet mir eine Vielzahl von Operation u.a. das Recordern von WebSeiten von Desktop-Applikationen. In meinem Fall möchte ich, dass automatisch eine Excel geöffnet wird und die "Input"-Variablen aus meinen Rechnungen automatisch eingetragen werden:

(/assets/images/posts/Zeitersparnis-durch-RPA-und-Microsoft-PowerPlatform/PADFlow.png)


Die Einbindung des Benutzeroberflächen Flow erfolgt im eigentlichen PowerAutomate

(/assets/images/posts/Zeitersparnis-durch-RPA-und-Microsoft-PowerPlatform/PowerAutomateUiFlow.png)




Bilder können es schlecht beweisen, aber es hat funktioniert ;)

Rechnung kommt beim MA an...

(/assets/images/posts/Zeitersparnis-durch-RPA-und-Microsoft-PowerPlatform/Vorher.png)

MA verschickt Rechnung an Postfach...und dann wird automatisch die lokale Applikationen mit den Daten aus dem Rechnungsdokument gefüllt.

(/assets/images/posts/Zeitersparnis-durch-RPA-und-Microsoft-PowerPlatform/Nachher.png)



# Fazit

Ich halte die Microsoft PowerPlatform seit Tag eins für eine sehr mächtige Entwicklungsumgebung, die auch Nicht-Entwickler die Möglichkeit gibt neue Lösungen zu kreieren. 

KI, Workflows, Maschinelles Lernen waren früher nicht ohne eine hohe Komplexität oder Code-Kenntnisse möglich. 

Das oben gezeigte Beispiel stellt einfach und klar dar, das der Business-Value im Vordergrund steht und nicht die Technologien dahinter.

Herausforderungen auf die ich bewusst in diesem Blog nicht eingegangen bin und die mir in meiner täglichen Arbeit begegnen, um den Businessvalue hervorzuheben, sind u.a.:
* Authentifizierung und Autorisierung, u.a. wird bspw. Das OnPremise Datagateway benötigt
* Lizenzierung bei der Nutzung von PowerAutomate und RPA
* Deutsche Übersetzung sind teilweise gewöhnungsbedürftig "UI Flow" vs "Benutzeroberflächen Flow"
* Teilweise noch die ein oder andere Schwierigkeit bspw. Exceptions bei ein paar PowerAutomate Desktop Funktionen


Ein ganz wichtiger Faktor noch, es hat mir wieder Spaß gemacht einfach mit der PowerPlatform ein neues Szenario durchzuspielen.
