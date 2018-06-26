---
layout:         [post, post-xml]              
title:          "Open Source im Blick halten mit GitStalker"
date:           2018-06-26 15:00
modified_date: 
author:         s-gbz 
categories:     [Architektur]
tags:           [Open-Source, Github, Angular, Java]
---

# Einleitung
Immer mehr Unternehmen finden Mehrwert im Open-Source-Konzept und beteiligen sich aktiv an freien Projekten auf GitHub.
So beschäftigten im Jahr 2017 allein Google und Microsoft mehr als 2000 Mitarbeiter, die aktiv Beiträge zu knapp 2000 Repositories geleistet haben. 

Da nicht alle Unternehmen so viel investieren wie Google, ist es wichtig verfügbare "Open Source Zeit" sinnvoll zu gestalten und Überblick zu halten:  
- Welche Projekte werden tatsächlich genutzt? 
- An welchen Projekten wird am meisten gearbeitet?
- Wo tragen Mitarbeiter bei? 

Allerdings fällt dieser Überblick mit steigender Mitgliederzahl zunehmend schwerer. Entwickelt vom adesso eigenen Open Source Team, soll der GitStalker wertvollen Einblick in die Aktivitäten und Trends Eurer Organisationen geben.

# Funktion und Ziele
Die Besonderheit des GitStalkers ist, dass er mit der GitHub API kommuniziert und somit Informationen bereit stellt, die von außen nicht ersichtlich sind.

![Ablauf abstrakt](/assets/images/posts/os-im-blick-gitstalker/GitStalker-Ablauf-Abstrakt.png)

...

# Use Cases

Betrachten wir nun einige Use Cases die das tägliche Stalken vereinfachen sollen.

## Mitgliederaktivität und Wachstum ermitteln
Hat man seine Zielorganisation via der Suchleiste aufgerufen, erscheint zunächst das Dashboard, welches schnelle Übersicht aller Eckdaten bietet. 

...

![Gitstalker Home zu Dashboard](/assets/images/posts/os-im-blick-gitstalker/GitStalker-home-to-dash.gif)

...

Zurück beim Dashboard betrachten wir nun die Graphen:
- Mitgliederwachstum
- Commits innerhalb eigener Repositories
- Pull Requests in externen Repositories

...

Alle Daten beziehen sich auf die letzten sieben Tage.

![Gitstalker Dashboard zum Graph](/assets/images/posts/os-im-blick-gitstalker/GitStalker-dash-to-graph.gif)


## Nutzeraktivitäten in externen Repositories
Um zu erfahren in welchen Repositories unsere Mitglieder Pull Requests gestellt haben, navigieren wir zu *External Repositories*.

![Gitstalker Dashboard zu externen Repositories](/assets/images/posts/os-im-blick-gitstalker/GitStalker-dash-to-extRepos.gif)

...

## Vergleiche durch Tabs

Möchte man beispielsweise Teams oder Organisationen vergleichen, ist dies innerhalb der Anwendung durch öffnen eines neuen Tabs möglich.   

![Gitstalker Teamvergleich](/assets/images/posts/os-im-blick-gitstalker/GitStalker-team-vergleich.gif)
...

# Ausblick

Wir haben gelernt mit dem GitStalker umzugehen und tiefere Einsichten in Organisationen zu finden. Jetzt seid Ihr dran! Teilt Eure Einblicke in den Kommentaren und neue Ideen oder Probleme [hier auf GitHub](https://github.com/adessoAG/GitStalkerBootstrapUI).
