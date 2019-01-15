---
layout: [post, post-xml]              # Pflichtfeld. Nicht ändern!
title:  "Git-Intel - Entwicklung eines modernen GitHub-Crawlers"         # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2018-11-21 10:25              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2018-11-21             # Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author: dariobraun                    # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: [Softwareentwicklung] # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Spring, Angular, GitHub, Open Source, SPA]         # Optional.
---

Wer sich in letzter Zeit mit dem Thema Open-Source auseinandergesetzt hat, wird festgestellt haben, dass der Hype um das Konzept und die dazugehörigen Plattformen kaum nachgelassen hat. Viele große Unternehmen werden zunehmend aktiv und lassen ihre Mitarbeiter auf GitHub und Co. los, um Projekte zu entwickeln, die der Öffentlichkeit frei zur Verfügung stehen. Wir haben einen GitHub-Crawler entwickelt, der euch alle interessanten Informationen zu Organisationen auf GitHub liefert - Git-Intel!

# Andauernder Trend 'Open-Source'

Dass große, auf Profit ausgelegte Unternehmen Ressourcen aufwenden, um „freie“ Software zu entwickeln, klingt für den einen oder anderen erstmal befremdlich. Tatsächlich sind es einige der bekanntesten Tech-Giganten, die die Liste der „Top Contributors“ auf GitHub anführen.

![Statistik zu Contributions von Organisationen auf www.github.com](/assets/images/posts/gitintel/contributions.png)
 
Mit mehr als 31 Mio. Entwicklern und mehr als 2.1 Mio. Organisationen stellt GitHub die wohl [größte und aktivste Open-Source-Community](https://octoverse.github.com/) dar. Es ist deshalb nicht verwunderlich, dass auch große Unternehmen vornehmlich hier anzutreffen sind. Aufgrund der Größe und Popularität eignet sich GitHub wahrscheinlich am besten als Quelle für Open-Source-Statistiken und als Ziel für das Sammeln Open-Source-spezifischer Daten.  

Auch adesso ist nicht untätig im Bereich Open-Source!
Mit 80 Mitgliedern, 11 Teams und 23 eigenen Repositories ist adesso für ein Unternehmen seiner Größe bereits gut aufgestellt.  
Die oben genannten Daten lassen sich ganz leicht auf der [GitHub-Profilseite](https://github.com/adessoag) der adesso AG einsehen. Aber wäre es nicht interessant, noch mehr Informationen bezüglich der Aktivität von Unternehmen auf GitHub einsehen zu können?

* Zu welchen großen Projekten haben Mitglieder von adesso bereits beigetragen? 
* Gibt es adessi, die beliebte GitHub-Projekte ins Leben gerufen haben?
* Welches Organisationsmitglied hat diese Woche die meisten Commits geleistet?

Zum Glück bietet GitHub eine API, die solche Informationen bereitstellt und wir haben eine Anwendung entwickelt, die sich diese API zunutze macht, um alle möglichen spannenden Daten zu sammeln und aufzubereiten – Git-Intel!

# Das Konzept

Mit Hilfe von Git-Intel können alle Informationen zu Organisationen, die auf GitHub registriert sind, visuell aufbereitet eingesehen werden.
Nutzer geben den Namen der Organisation ein, über die sie Informationen erhalten wollen, woraufhin Git-Intel Anfragen an die GitHub-API schickt und die Antworten entsprechend in seiner Datenbank speichert. Wurde die Organisation aufgrund einer früheren Abfrage bereits in der Datenbank gespeichert, werden die Ergebnisse direkt angezeigt. 

![Benutzeroberfläche der Git-Intel-Anwendung](/assets/images/posts/gitintel/gitintel1.png)
  
Die besondere Stärke von Git-Intel liegt darin, dass es die von der GitHub-API bereitgestellten Daten abfragen und so aufbereiten kann, dass relevante Informationen zu Organisationen, Mitarbeitern und Projekten übersichtlich präsentiert werden. So können beispielsweise Informationen bezüglich der Aktivitäten von Mitgliedern dargestellt oder eine Übersicht über die Beteiligungen an organisationsfremden Projekten eingesehen werden.

Die von Git-Intel gesammelten Daten umfassen Informationen zu internen und externen Repositories, Mitglieder- und Teamzahlen, zeitliche Verläufe von Aktivitäten in Form von Commits, Pull Requests und Issues, detaillierte Informationen zu Mitgliederaktivitäten und Weitere.

Zu beachten ist hierbei, dass Git-Intel nur öffentliche Daten sammelt.

# Die Funktionsweise

Die Interaktion mit Git-Intel funktioniert grundlegend wie folgt:
1.	Der Nutzer stellt eine Anfrage.
2.	Git-Intel sammelt Daten und bereitet sie auf.
3.	Die Daten werden zurück zum Nutzer gesendet.  

Der zweite Schritt unterliegt hierbei einer Fallunterscheidung:

**Fall 1 – Die angeforderten Daten befinden sich bereits in der Datenbank:**

![Ablauf einer Git-Intel-Anfrage für bereits gespeicherte Daten](/assets/images/posts/gitintel/case1.png)

Sind die vom Nutzer angeforderten Daten bereits in der Datenbank vorhanden, fragt das Back-End sie aus dieser ab und schickt sie an den Nutzer zurück.

**Fall 2 – Die angeforderten Daten befinden sich nicht in der Datenbank:**

![Ablauf einer Git-Intel-Anfrage für neue Daten](/assets/images/posts/gitintel/case2.png)
 
Sind die angeforderten Daten nicht in der Datenbank vorhanden, stellt Git-Intel eine Anfrage an die GitHub-API, nimmt die angeforderten Daten entgegen und speichert sie in der Datenbank. Bei der Anfrage prüft ein Validierungsmechanismus, ob der vom Nutzer eingegebene Name dem einer auf GitHub registrierten Organisation entspricht. Sollte dies nicht der Fall sein, wirft die API einen Fehler und der Nutzer erhält eine entsprechende Nachricht.  
Während des Datensammlungsprozesses erhält der Nutzer visuelles Feedback in Form einer Fortschrittsanzeige, welche sich an der Menge der bereits gesammelten Informationen orientiert.  

Da das Sammeln der Daten bestimmten Limitierungen durch GitHubs API unterliegt, kann dieser Prozess, je nach Datenmenge, einige Zeit in Anspruch nehmen.
Je größer die Datenmengen sind, die einer Organisation auf GitHub entsprechen, desto mehr Abfragen müssen an die GitHub-API gestellt werden. Je mehr Abfragen gestellt werden, desto mehr Antworten müssen verarbeitet werden. Logisch.  
Da die verwendete GitHub-API auf die Abfrage kleiner, sehr spezifischer Datensätze ausgelegt ist, reagiert sie sehr empfindlich, sobald man versucht, große Datenmengen abzufragen. Sendet ein Client zu viele Abfragen zu schnell hintereinander, schiebt GitHubs API ihm den ‚Spam‘-Riegel vor. Hinzu kommt, dass GitHub die Anzahl der erlaubten Anfragen pro Stunde durch ein sogenanntes "Rate Limit" einschränkt. Das Rate Limit der v4-API beträgt 5000 Punkte pro Stunde, wobei die verbrauchten Punkte pro Anfrage anhand bestimmter Faktoren berechnet werden. Grundsätzlich gilt: Eine komplexe Anfrage verbraucht mehr Punkte als eine simple Anfrage. Die Anzahl der verbleibenden **Punkte** ist somit nicht gleichzusetzen mit der Anzahl der verbleibenden **Anfragen**.  
Aus diesem Grund müssen viele Anfragen entsprechend getaktet werden, was zu erhöhten Verarbeitungszeiten führen kann. An dieser Stelle ist es wichtig, ein angenehmes Gleichgewicht zwischen der Belastung der GitHub-Schnittstelle und der User Experience zu finden. Genaueres zur GitHub-API erfahrt ihr im nächsten Abschnitt.

Damit die von Git-Intel gesammelten Daten möglichst aktuell sind, werden die Datenbankeinträge regelmäßig aktualisiert und überschrieben. 

# Die Technologien dahinter

Zum jetzigen Zeitpunkt besteht Git-Intel aus den drei Hauptkomponenten Nutzeranwendung (Front-End), Systemlogik (Back-End) und Datenbank.

Das Back-End wurde durch eine Spring-Boot-Anwendung realisiert, welche das Zentrum für die Interaktion aller Komponenten darstellt. Es kommuniziert mit der GitHub-API, verarbeitet empfangene Daten, nimmt Anfragen des Front-Ends entgegen, speichert Daten in der Datenbank ab und liest diese entsprechend eingehender Anfragen auch wieder aus.

Das Front-End ist eine SPA (Single Page Application) auf Angular-Basis. Das Framework erlaubt es eine Anwendung zu gestalten, die die erfassten Daten übersichtlich und optisch ansprechend darstellt und relevante Zusammenhänge aufschlussreich präsentiert. Features wie Routing und Tabs ermöglichen eine angenehme Navigation der Anwendung und tragen so zu einer ausgereiften User Experience bei.

Die Datenbank ist vom Typ MongoDB. Mit Hilfe der dokumentenbasierten Datenbank können Datensätze in JSON-ähnlichen Strukturen verwaltet werden, wodurch die Weitergabe der Daten zwischen den einzelnen Komponenten sehr leicht ist.

Für das Sammeln der Daten wird die neue GitHub-API, mit dem Namen „GitHub GraphQL API v4“, konsumiert. Wie der Name bereits verrät, empfängt die neue API Abfragen, die der [GraphQL-Spezifikation](https://developer.github.com/v4/#what-is-graphql) entsprechen. Abfragen dieser Art sind in Form von Graphen strukturiert. Sie sind hierarchisch aufgebaut und entsprechen in etwa der Form der JSON-Daten, die sie zurückliefern.
Eine Abfrage, die den Namen einer Organisation sowie die Namen der ersten hundert Mitglieder dieser Organisation liefert, sieht so aus:
 
```JavaScript
{
  organization(login: "adessoag") {
    name
    members(first: 100) {
      nodes {
        name
      }
    }
  }
}
```

Wer sich jetzt fragt „Warum nur die ersten hundert?“, ist gleich über den Kernaspekt von GitHubs API gestolpert. Durch die GraphQL-Spezifikation ist die API auf die Abfrage kleiner, sehr spezifischer Datensätze ausgelegt, nicht aber für die Abfrage großer Datensätze. Diese Tatsache macht die API für die Verwendung bei Git-Intel zwar nicht ideal, aber keinesfalls  unbrauchbar, weshalb wir uns entschlossen haben, einige Kompromisse einzugehen, um dieses doch sehr interessante Projekt in die Tat umzusetzen. 

# Git-Intel ausprobieren

Zum jetzigen Zeitpunkt ist Git-Intel nicht live, also auch nicht im Web zu erreichen.
Ihr habt natürlich dennoch die Möglichkeit, die Anwendung lokal zu testen und daran herumzuschrauben.

Der einfachste Weg, um auf der eigenen Maschine mit Git-Intel herumzuspielen, ist die Nutzung des Git-Intel-Docker-Builds.
Mit Hilfe von Docker könnt ihr mittels eines einzigen Kommandos das gesamte Projekt starten und nach Belieben mit der Nutzeranwendung interagieren. Eine Anleitung dazu, wie ihr Git-Intel-Docker installiert findet ihr [hier](https://github.com/adessoAG/Git-Intel-Spring).

All diejenigen, die Interesse daran haben an dem Projekt mitzuwirken, können über die entsprechenden GitHub-Repositories auf die einzelnen Anwendungen zugreifen und sich diese auf ihren Rechner kopieren. Wie ihr die einzelnen Repositories nutzen könnt, um die Anwendung lokal zu bauen, erfahrt ihr ebenfalls [hier](https://github.com/adessoAG/Git-Intel-Spring).

# Die Zukunft von Git-Intel

Git-Intel bietet eine spannende Möglichkeit, interessante Informationen zum Engagement von Organisationen in der Open-Source-Welt einzusehen.  
Entwicklungen zeigen, dass große Unternehmen immer mehr Wert auf die aktive Beteiligung in der Open-Source-Community legen, was das Gebiet auch für andere Firmen interessant machen könnte. Mit steigender Relevanz des Themas Open-Source wird es wohl auch interessant zu verfolgen, wie sich adesso auf diesem Gebiet entwickelt und im Vergleich zu anderen Unternehmen dasteht.

Die Informationen, die Git-Intel bereitstellt geben Aufschluss über die kurz- und langfristigen Entwicklungen von Unternehmen auf GitHub und geben einen spannenden Einblick in die Welt der Open-Source-Plattform aus ihrer Sicht.  
Zur Zeit befindet sich das Projekt noch vor seinem ersten Release, doch wird dieser nicht mehr lange auf sich warten lassen.  
Ihr findet das Projekt auf [GitHub](https://github.com/adessoAG/Git-Intel-Spring) und sollte euer Interesse geweckt worden sein, dann wendet euch mit Fragen und Anregungen gerne an [Frederik Schlemmer](mailto:frederik.schlemmer@adesso.de) oder mich, [Dario Braun](mailto:dario.braun@adesso.de).

Abbildungsnachweis:  
https://medium.freecodecamp.org/the-top-contributors-to-github-2017-be98ab854e87