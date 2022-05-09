---
layout: [post, post-xml]              # Pflichtfeld. Nicht ändern!
title:  "Internationale CRM-Projekte unter Berücksichtigung von Compliance"         # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2022-05-07 12:00              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2022-05-07 12:00             # Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author_ids: [mschulz-adesso]                       # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: [Architektur]                    # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Microsoft, Power Platform, CRM, Dynamics 365, Architektur, International, GDPR, Datenlokation, Compliance]         # Bitte auf Großschreibung achten.
---

Bei internationalen CRM-Systemen, die auf Microsoft Dynamics 365 basieren, ist es elementar, die Compliance-Anforderungen der Länder zu erfüllen. 
CRM-Systeme, die dabei auch Länder außerhalb der EU wie bspw. China, Brasilien oder die USA umfassen, müssen aus Compliance-Sicht einen "Schritt weiter gehen" verglichen mit der EU-DSGVO (GDPR), um die Anforderungen bspw. für die Datenlokation zu erfüllen.
Dabei sind verschiedene Compliance-Aspekte zu betrachten. 

In diesem Blog-Beitrag geht es um die Datenlokation und die passende Systemarchitektur, da bspw. personenbezogene Daten strengen Compliance-Anforderungen unterliegen.


# Vorgehen

In Projekten geht es hierbei um die Balance zu wahren aus 
* fachlichen Anforderungen und den daraus resultierenden Business Values,
* Anforderungen aus Compliance-Sicht bspw. Ort der primären Datenspeicherung
* Technische Machbarkeit & Rahmenbedingungen

Kommunikation und strukturiertes Vorgehen sind hierbei ein kritischer Erfolgsfaktor.

Die Balance zwischen den drei Instanzen ist hier abgebildet:

![Balance.png](/assets/images/posts/Internationale-CRM-Projekte-unter-Beruecksichtigung-von-Compliance/Balance.png)

## Best practices

Beispielhaft sind hier Empfehlungen von uns aufgelistet beim Vorgehen:

* Primär Anforderungen vom Fachbereich "verstehen" und nach dem "Warum?" fragen
* Alignment von Compliance, Fachbereich und Technik sind elementar
* Einbindung von Compliance-Experten so früh wie möglich
* Abstimmtes Konstrukt mit konkreten Anforderungen festgelegen -> "schwammige Aussage und Grauzonen vermeiden"
* Analyse der aktuellen Technologiestandes bspw. siehe "Nützliche Links"– welcher Service ist wo verfügbar?
* Integrationen bspw. mit Azure unterliegen den gleichen Anforderungen
* Kreative Lösungsarchitekturen erforderlich, jeodch sollten diese dem „KISS-Prinzip“ folgen


# Stärken der Microsoft Power Platform

Microsoft Dynamics 365 Sales und die dazugehörige Power Platform bieten u.a. beim Thema Datenlokation einzigartige Features.

Zum einen ist es möglich das D365 Sales Online (MS Cloud) und OnPremise zu betreiben.
 
Zum anderen bietet die Power Platform die Möglichkeit in ein und demselben Tenant die Datenlokation für diverse Länder zu bestimmen. Dies hat den Vorteil die Verwaltungsaufwand von mehreren Tenants elementar zu senken und u.a. sind die Lizenzen im ganzen Tenant gültig.

Als weitere Lösungsoption könnte eine Multi-Tenant-Strategie dienen, wenn erweiterte Anforderungen hinsichtlich Skalierbarkeit, Abbildung von komplexen Unternehmensstrukturen oder auch sehr starke Ausprägung von Datenschutzanforderungen gegenben sind.


In diesem Beispiel wird weiter die Single-Tenant-Strategie beschrieben, in der das Staging für ein CRM-System wie folgt aussehen könnte:

![Staging.png](/assets/images/posts/Internationale-CRM-Projekte-unter-Beruecksichtigung-von-Compliance/Staging.png)

Sowohl DEV, als auch UAT und PROD sind in getrennten CRM-Instanzen abgebildet (Environment/Umgebung). 
Dabei ist jeder Umgebung eine Region zugeordnet, die bestimmt, wo das CRM gehostet wird.

Die Benutzer, Lizenzen und Sicherheitsgruppen werden zentral in einem Tenant verwaltet.


Das oben abgebildete Staging kann weiter ausgebaut werden, um auch in einem Single-Tenant weitere Anforderungen des Datenschutzes zu erfüllen:

![AdvancedStaging.png](/assets/images/posts/Internationale-CRM-Projekte-unter-Beruecksichtigung-von-Compliance/AdvancedStaging.png)

# Integrations-Acrhitektur

In einigen Szenarien ist es erforderlich eine hybride Architektur für die Umgebungs-Infrastruktur und der Integration zu entwerfen, d.h. sowohl Cloud als auch OnPremise Komponenten einzusetzen.

Eine solche Architektur ist hier beispielhaft dargestellt:

![Integration.png](/assets/images/posts/Internationale-CRM-Projekte-unter-Beruecksichtigung-von-Compliance/Integration.png)

In dem hier dargestellten Diagramm werden personenbezogene Daten primär in einem Land ihrer Wahl gespeichert und gleichzeitig unter zusätzlicher Einhaltung von rechtlichen Grundlagen über länderspezifische Clouddienste in OnPremise-Systeme transferriert.

Dabei werden beispielhaft die CRM-Instanzen in verschiedenen Umgebungen gehosted. 
Die eingesetzten Microservices basierend auf Azure Functions werden ebenfalls in den dazugehörigen Ländern gehostet.

Die Tenant-Architektur ist beliebig ausbaubau, d.h. Multi-Tenants sind möglich aber auch andere hybride Integrationsmuster.

# Wo ist was verfügbar

Darüber hinaus ist es beim Entwurf einer Umgebungs-Architektur wichtig die Produktverfügbarkeit der Power Platform und die Datenspeicherungslokationen zu bestimmen.

Die Produktverfügbarkeit ist einem dynamischen Power-BI-Report jederzeit nachvollziehbar:

![Availability.png](/assets/images/posts/Internationale-CRM-Projekte-unter-Beruecksichtigung-von-Compliance/Availability.png)

Dies betrifft auch Komponenten in Azure bspw. für Integrationen zu D365.

Nützliche Links
* [D365 & Power Platform GEO](https://dynamics.microsoft.com/de-de/availability-reports/georeport/)
* [D365 & Power Platform PDF](https://aka.ms/dynamics_365_international_availability_deck) 
* [M365 Mandant Docs](https://docs.microsoft.com/de-de/microsoft-365/enterprise/o365-data-locations?view=o365-worldwide)
* [Multi-Tenant Docs](https://docs.microsoft.com/de-de/power-platform/admin/multiple-online-environments-tenants)
* [Azure GEO](https://azure.microsoft.com/de-de/global-infrastructure/geographies/#geographies)


# Fazit

Die oben gezeigten Beispiele und Erläuterungen sollen das Verständnis vermitteln, dass die Microsoft Power Platform bereits im Standard elementare Compliance-Funktionen bietet.
 Abhängig von der Komplexität des Anforderungen bedarf es im konkreten Projekteinsatz weitere von uns bewährter Lösungen.

Dabei ist es wichtig die Anforderungen zu verstehen und die Gegebenheiten der Technologien zu kennen.
Hierbei hat sich bewährt, dass sich ein kleines Kompetenzteam bildet aus:
* Compliance-Experte oder -Expertin
* Product Owner
* Solution Architekt/in

Wir bei adesso unterstützen Sie gerne bei Ihrem internationalen CRM-Vorhaben und finden mit Ihnen die beste Lösung, um die Balance zwischen Fachlichkeit/Business Value, Anforderung aus der Compliance-Sicht und der technischen Machbarkeit zu wahren.