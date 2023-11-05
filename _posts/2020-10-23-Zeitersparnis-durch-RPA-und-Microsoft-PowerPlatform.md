---
layout: [post, post-xml]              # Pflichtfeld. Nicht ändern!
title:  "Zeitersparnis durch RPA, AI und der Microsoft Power Platform"         # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2020-10-23 12:00              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2020-11-12 12:00             # Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author: mschulz-adesso                       # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: [Microsoft]                    # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [RPA, Power Automate, Power Platform, KI, UI Flow, Power Automate Desktop, AI Builder, Switch-Zeit, Teams, Microsoft]         # Bitte auf Großschreibung achten.
---

Jeder kennt es, bestimmte IT-Arbeitsschritte, die sich von den Eingaben, aber nicht von den Klicks unterscheiden.
Hier gibt es für jeden durch Automatisierung dieser Tätigkeiten ein enormes Optimierungspotential.
Es geht mir dabei nicht nur um die Optimierung der Netto-Arbeitszeit, die häufige Tätigkeiten benötigen, sondern auch um die Switch-Zeit - also die Zeit, die uns immer wieder aus unseren Themen rausreißt und uns somit ablenkt.
"Robotic Process Automation" (RPA) kann uns hier unterstützen und ermöglicht die automatisierte Ausführung von manuellen Eingaben.

Das perfekte und spannende Beispiel für mich sind Applikationen, die entweder keine Schnittstellen wie Konnektoren, API(s) etc. bereitstellen oder bei denen die Schnittstellenbereitstellungen zu komplex sind. 
Die neuen technischen Möglichkeiten der Microsoft Power Platform ermöglichen auch Power-Usern solche UseCases schnell und einfach umzusetzen.


# Mein Szenario

Als Prozessgrundlage hat mich u.a. dieses Microsoft Tutorial inspiriert [Robotic Process Automation with Microsoft Power Automate, UI flows and AI Builder](https://www.youtube.com/watch?v=NxJ2Zch7M2o), bei dem ich selbst die Umsetzung testen will. 
Hierbei haben sich die Features etwas geändert, das neue Tool Power Automate Desktop ist da und das möchte ich testen.

Als Beispiel-Prozess nehme ich das Freigeben von Rechnungen und die dazugehörige Pflege in einer lokale Excel-Datei, die ein lokales System wie bspw. ein ERP simulieren soll.
Dabei werde ich auch den AI Builder der Microsoft Power Platform nutzen, um KI-gesteuert Informationen aus Dokumenten zu extrahieren.
Dieses Beispiel benötigt in der täglichen Praxis viele manuelle Schritte, die Zeit kosten und zudem fehleranfällig sind.

## Der gängige Prozess

In der Regel sieht der Prozess wie folgt aus:

1. Mitarbeiter (MA) hat eine Rechnung
2. MA schickt Rechnung per E-Mail an Führungskraft (FK) und bittet um Freigabe -> 5 Min
3. FK liest Rechnung, gibt Rechnung in der E-Mail als Prosatext frei und sendet E-Mail zurück -> 5 Min
4. MA erhält E-Mail und liest die Freigabe -> Zeitaufwand: 5 Min
5. MA öffnet sein ERP Programm und gibt alle Daten der Rechnung ein -> Zeitaufwand: 10 Min

**Investierte Nettoarbeitszeit:** ca. 25 Min pro Rechnung

**Switch-Zeit / Verlust des Fokus:** Viel höher

## Der optimierte Prozess

1. MA hat eine Rechnung
2. MA schickt Rechnung per E-Mail an Rechnungs-Mailbox -> 5 Min
3. FK bekommt automatisch im Teams eine Kachel mit wesentlichen Informationen -> 0 Min
4. FK sieht neue Nachricht in Teams und klickt den "Approved"-Button -> 5 Min
5. Rechnung wird automatisiert im ERP System eingetragen -> 0 Min

**Investierte Nettoarbeitszeit:** ca. 10 Min pro Rechnung

**Switch-Zeit / Verlust des Fokus:** Viel niedriger, da u.a. wichtige Informationen hervorgehoben werden

### Prozessschritte im Detail

* MA schickt Rechnung per E-Mail an Rechnungs-Mailbox

![Rechnungsversand.png](/assets/images/posts/Zeitersparnis-durch-RPA-und-Microsoft-PowerPlatform/Rechnungsversand.png)

* FK bekommt automatisch im Teams eine Kachel mit wesentlichen Informationen

![Teamskachel.png](/assets/images/posts/Zeitersparnis-durch-RPA-und-Microsoft-PowerPlatform/Teamskachel.png)

* Rechnung wird automatisiert im ERP System eingetragen

Vorher:

![Vorher.png](/assets/images/posts/Zeitersparnis-durch-RPA-und-Microsoft-PowerPlatform/Vorher.png)

Nachher:

![Nachher.png](/assets/images/posts/Zeitersparnis-durch-RPA-und-Microsoft-PowerPlatform/Nachher.png)

Bilder können es schlecht beweisen, aber es funktioniert. ;)

## Technische Basis

In diesem konkreten Beispiel nutze ich die Power Platform als No-Code Plattform, um die Freigabe von Rechnungen zu erleichtern und die dazugehörige Pflege in einem ERP-System zu automatisieren.

Hierbei wird Outlook und Microsoft Teams als Kommunikationsplattform genutzt.

Ich nutze die Workflow-Engine Power Automate aka Flows, um die Prozessschritte auszuführen.
Dabei wird die RPA Funktion über den Power Automate Typ "Benutzeroberflächen Flow" ausgeführt.
Power Automate bietet per se Konrektoren zu Outlook und Teams, sodass ich sofort starten kann.
 
### Grundlage ist Power Automate aka Flow, um den Prozess zu automatisieren

Im Grunde genommen sind es zwei Schritte, die benötigt werden, um die komplette Logik auszuführen.
1. Der Trigger
2. Die Entscheidung, was dann passieren soll

![PowerAutomate.png](/assets/images/posts/Zeitersparnis-durch-RPA-und-Microsoft-PowerPlatform/PowerAutomate.png)

Der Trigger ist in meinem Fall der Empfang einer E-Mail in der dedizierten Mailbox "Rechnungen". 
Über Standardkonnektoren zu Office365 Mailboxes war das schnell für mich gemacht.

Die Entscheidung, was passieren soll, enthält die eigentlich spannende Logik:

* Power Automate benutzt die Anlage der empfangenen E-Mail - in diesem Fall eine PDF
* Weitergabe des PDF an die KI-KI-Komponente
* Automatische Extraktion relevanter Rechnungsdaten aus der PDF
* Erstellen eines Optionsauswahl-Post in einem ausgewählten Bot-Teams-Chat
* Jetzt muss die Führungskraft im Teams-Chat entscheiden - in diesem Beispiel gibt die FK die Rechnung frei
* Der Prozess geht jetzt weiter, öffnet automatisch die ERP (Excel) Applikation und gibt die relevanten Daten ein

![PowerAutomateDetail.png](/assets/images/posts/Zeitersparnis-durch-RPA-und-Microsoft-PowerPlatform/PowerAutomateDetail.png)

Ich möchte die spannenden Schritte des Power Automates jetzt näher erläutern.

### Automatisierte Extraktion relevanter Rechnungsdaten aus der PDF

Der AI Builder ist eine Komponente der Power Platform, die ich nutze, um die Rechnungen zu analysieren. 

Dabei stellt "Formularverarbeitung" die benötigte Funktion dar.

![AiBuilder.png](/assets/images/posts/Zeitersparnis-durch-RPA-und-Microsoft-PowerPlatform/AiBuilder.png)

Hierbei habe ich fünf Beispiel-Rechnungen erstellt und hochgeladen damit der AI Builder die relevanten Informationen wie Datum, Betrag etc. automatisch "erlernt".

Der AI Builder benötigt mindestens fünf Dokumentbeispiele, um zu trainieren.

![AiBuilderUpload.png](/assets/images/posts/Zeitersparnis-durch-RPA-und-Microsoft-PowerPlatform/AiBuilderUpload.png)

In der Vergangenheit musste ich hierfür komplexere Logiken implementieren, die ich bspw. mit Azure Machine Learning implementiert habe.

Mit dem AI Builder kann ich dem Modell sagen, welche Felder einer Rechnung relevant sind, damit es selbständig "trainieren" kann.

![AiBuilderWerte.png](/assets/images/posts/Zeitersparnis-durch-RPA-und-Microsoft-PowerPlatform/AiBuilderWerte.png)

Nach dem Training stehen mir die extrahierten Felder in meinem Power Automate zur Verfügung. Hier zu erkennen in der Teamchat-Nachricht "Meldung".

![PowerAutomateWerte.png](/assets/images/posts/Zeitersparnis-durch-RPA-und-Microsoft-PowerPlatform/PowerAutomateWerte.png)

### Automatisierte Eingabe von Daten durch RPA
Um Eingaben zu automatisieren, muss ich vorab die Eingabe "recorden", damit der Benutzeroberflächen Flow diese Schritte automatisieren kann.
Hierfür werden ein paar kostenlose Tools von Microsoft und Selenium benötigt.

![RPAEinrichtung.png](/assets/images/posts/Zeitersparnis-durch-RPA-und-Microsoft-PowerPlatform/RPAEinrichtung.png)

In den nächsten Schritten sage ich dem Benutzeroberflächen Flow in welcher Form ich die Eingaben "recorden" möchte.

![RPARecorder.png](/assets/images/posts/Zeitersparnis-durch-RPA-und-Microsoft-PowerPlatform/RPARecorder.png)

Ich nutze die Vorschauversion vom Power Automate Desktop, da dieses Tool für mich neu ist und viel verspricht.  

Als Alternative könnte ich die Selenium-IDE nutzen, die ein Open-Source-Tool ist, mit dem ich Interaktionen auf Websites aufzeichnen und wiedergeben kann. 
Dieses Tool wird auch oft bei Tests genutzt.

Power Automate Desktop bietet mir eine Vielzahl von Operationen, u.a. das Recorden von Webseiten oder Desktop-Applikationen. 

In meinem Fall möchte ich, dass automatisch eine Excel geöffnet wird und die "Input"-Variablen aus meinen Rechnungen automatisch eingetragen werden.

![PADFlow.png](/assets/images/posts/Zeitersparnis-durch-RPA-und-Microsoft-PowerPlatform/PADFlow.png)

### Letzter Schritt - Die Einbindung des Benutzeroberflächen Flow erfolgt im eigentlichen Power Automate.

Wichtig hierbei ist, dass eine Verbindung zwischen dem Power Automate und dem lokalen System / Excel hergestellt werden kann. Dies realisiere ich sehr schnell mit dem Microsoft OnPremise Data Gateway.

![PowerAutomateUiFlow.png](/assets/images/posts/Zeitersparnis-durch-RPA-und-Microsoft-PowerPlatform/PowerAutomateUiFlow.png)

# Fazit

Ich halte die Microsoft Power Platform seit Tag eins für eine sehr mächtige Entwicklungsumgebung, die auch Nicht-Entwicklern (aka Power-Usern aka Citizen Developer) die Möglichkeit gibt, neue Lösungen zu kreieren. 
KI, Workflows, RPA oder maschinelles Lernen waren früher nicht ohne eine hohe Komplexität oder Code-Kenntnisse möglich. 

Das oben gezeigte Beispiel stellt dabei einfach und klar dar, dass der Business-Value im Vordergrund steht und nicht die Technologien dahinter.

Herausforderungen, auf die ich bewusst in diesem Blog nicht eingegangen bin, um besonders den Business-Value hervorzuheben, sind u.a.:

* Authentifizierung und Autorisierung, u.a. wird bspw. das OnPremise Data Gateway benötigt
* Lizenzierung für die Nutzung von Power Automate und RPA
* Deutsche Übersetzung sind teilweise gewöhnungsbedürftig "UI Flow" vs "Benutzeroberflächen Flow"
* Teilweise noch die ein oder andere Schwierigkeit bspw. Fehlerbehandlung bei den Funktionen von Power Automate Desktop 

Ein ganz wichtiger Faktor noch zum Schluss: es hat mir wieder Spaß gemacht einfach mit der Power Platform ein neues Szenario durchzuspielen.
