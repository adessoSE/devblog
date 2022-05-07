---
layout: [post, post-xml]              # Pflichtfeld. Nicht ändern!
title:  "Internationale CRM-Projekte unter Berücksichtigung von Compliance"         # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2022-05-07 12:00              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2022-05-07 12:00             # Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author_ids: [mschulz-adesso]                       # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: [Microsoft]                    # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Microsoft, Power Platform, CRM, Dynamics 365, Architektur, International, Compliance]         # Bitte auf Großschreibung achten.
---

Bei internationalen CRM-Systemen, die auf Microsoft Dynamics 365 basieren, ist es elementar die Compliance-Anforderungen der Länder zu erfüllen. 
CRM-Systeme, die dabei auch Länder außerhalb der EU wie bspw. China, Brasilien & USA umfassen, müssen aus Compliance-Sicht einen Schritt weitergehen bzw. anders verglichen mit DSGVO (GDPR), um die Anforderungen bspw. für die Datenlokation zu erfüllen.

Dabei sind verschiedene Compliance-Aspekte zu betrachten. 
In diesem Blog-Beitrag geht es beispielhaft um die Speicherung von personenbezogenen Daten bzw. den dazugehörigen Speicherort, da diese strengen Compliance-Anforderungen unterliegen.


# Vorgehen

Dies ist weder ein ausschließliches Compliance-Thema noch ist nur rein technisch zu betrachten.
In Projekten geht es hierbei auch die Balance zu wahren aus 
* fachlichen Anforderungen und den daraus resultierenden Business Value
* Anforderungen aus Compliance-Sicht bspw. Ort der primären Datenspeicherung
* Technische Machbarkeit & Rahmenbedingungen

Kommunikation und strukturiertes Vorgehen ist hierbei ein kritischer Erfolgsfaktor.

Die Balance zwischen den drei Instanzen ist hier abgebildet:
![Balance.png](/assets/images/posts/Internationale-CRM-Projekte-unter-Berücksichtigung-von-Compliance/Balance.png)

# Stärken der Microsoft Power Platform

Microsoft Dynamics 365 Sales und die dazugehörige Power Platform bieten hierbei einzigartige Features.

Zum einen ist es möglich das D365 Sales Online (MS Cloud) und OnPremise zu betreiben.
 
Zum anderen bietet die Power Platform die Möglichkeit in ein und demselben Tenant die Datenlokation für diverse Länder zu bestimmen. Dies hat den Vorteil die Verwaltungsaufwand von mehreren Tenants elementar zu senken und u.a. sind die Lizenzen im ganzen Tenant gültig.

Ein CRM-System könnte bei einem Staging wie folgt aussehen:
![Staging.png](/assets/images/posts/Internationale-CRM-Projekte-unter-Berücksichtigung-von-Compliance/Staging.png)

Sowohl DEV, als auch UAT und PROD sind in getrennten CRM-Instanzen abgebildet (Environment/Umgebung). 
Dabei ist jeder Umgebung eine Region zugeordnet, die bestimmt, wo die das CRM gehostet wird.

Die Benutzer, Lizenzen und Sicherheitsgruppen werden zentral in einem Tenant verwaltet.

# Integrations-Acrhitektur

In einigen Szenarien ist es erforderlich eine hybride Architektur für die Umgebungs-Infrastruktur und der Integration zu entwerfen, d.h. sowohl Cloud als auch OnPremise Komponenten einzusetzen.

Eine solche Architektur ist hier beispielhaft dargestellt:
![Integration.png](/assets/images/posts/Internationale-CRM-Projekte-unter-Berücksichtigung-von-Compliance/Integration.png)

In dem hier dargestellten Diagramm werden personenbezogene Daten primär in einem Land ihrer Wahl gespeichert und gleichzeitig unter zusätzlicher Einhaltung von rechtlichen Grundlagen über länderspezifische Clouddienste in OnPremise-Systeme transferriert.

Dabei werden beispielhaft die CRM-Instanzen in verschiedenen Umgebungen gehosted. 
Die eingesetzten Microservices basierend auf Azure Functions werden ebenfalls in den dazugehörigen Ländern gehostet.

Die Tenant-Architektur ist beliebig ausbaubau, d.h. Multi-Tenants sind möglich aber auch andere hybride Integrationsmuster.


# Wo ist was verfügbar

Darüber hinaus ist es beim Entwurf einer Umgebungs-Architektur wichtig die Produktverfügbarkeit der Power Platform und die Datenspeicherungslokationen zu bestimmen, eine passende technischen Grundgerüst zu kreieren.

Die Produktverfügbarkeit ist einem dynamischen Power-BI-Report jederzeit nachvollziehbar:
![Availability.png](/assets/images/posts/Internationale-CRM-Projekte-unter-Berücksichtigung-von-Compliance/Availability.png)

Dies betrifft auch Komponenten in Azure bspw. für Integrationen zu D365.

# Fazit

Die oben gezeigten Beispiele und Erläuterungen sollen das Verständnis vermitteln, dass die Microsoft Power Platform bereits im Standard elementare Compliance-Funktionen bietet.
 Abhängig von der Komplexität des Anforderungen bedarf es im konkreten Projekteinsatz weiterer von uns bewährter Lösungen.

Dabei ist es wichtig die Anforderungen zu verstehen und die Gegebenheiten der Technologien zu kennen.
Hierbei hat sich bewährt, dass sich ein kleines Kompetenzteam bildet aus:
* Compliance-Experte/in
* Product Owner
* Solution Architekt/in

Wir bei adesso unterstützen Sie gerne bei ihrem internationalen CRM-Vorhaben und finden mit Ihnen die beste Lösung, um die Balance zwischen Fachlichkeit/Business Value, Anforderung aus der Compliance-Sicht und technische Machbarkeit zu wahren.