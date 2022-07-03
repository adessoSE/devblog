---
layout: [post, post-xml]                      # Pflichtfeld. Nicht ändern!
title:  "Volltextsuchen mit Elasticsearch"    # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2022-03-31 20:00                      # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2022-03-31 20:00               # Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author_ids: [sypste]                          # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesen Namen geben.
categories: [Softwareentwicklung]             # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Open Source, REST, Elasticsearch]      # Bitte auf Großschreibung achten.
---

<!-- Teaser Text -->
In diesem Artikel entwickeln wir mit wenigen Mitteln eine performante und feature-reiche Volltextsuche.
In diesem Beitrag zeige ich euch, wie ihr auf Basis der Open-Source-Software Elasticsearch textbasierte Daten speichert, indiziert und für menschliche User einfach durchsuchbar gestalten könnt.
Dazu deployen wir eine Instanz des Webservices Elasticsearch, indizieren Beispieldaten und entwickeln mithilfe der Bordmittel von Elasticsearch eine an beliebiger Stelle wiederverwendbare Suche.
Dazu benötigt ihr lediglich einen Browser und einen GitHub-Account:
Den gesamten Code findet ihr in [GitHub](https://github.com/sypste/elasticsearch-demo) und ihr könnt alles schnell bei [GitPod](https://gitpod.io/) deployen und ausprobieren[^1].

[^1]: Dazu einfach das Template-Repo nutzen, um ein persönliches Repo zu erstellen, den Link zum Repo benutzen, um über das GitPod-Dashboard einen Workspace zu erstellen und anschließend zu öffnen.

# Volltextsuchen mit Elasticsearch

<!-- Motivieren -->
Jedes Mal, wenn ich meinen Browser öffne, sehe ich als Erstes eine Suchmaschine meiner Wahl.
Und das mit gutem Grund:
Immerhin ist das Internet sehr groß und die Informationen, die ich alltäglich brauche, sind in der Regel nicht alleine auf den wenigen Seiten zu finden, deren URLs ich selbständig ansteuern kann.
Stattdessen verlasse ich mich auf Suchmaschinen, um für meine Fragen relevante Ergebnisse zu finden.
Dabei bedienen sich moderne Search Engines vielerlei Strategien und Algorithmen:
Vom einfachen Zählen einiger Schlüsselwörter im Quelltext statischer Seiten über die Gewichtung der Verlinkungen zu anderen Online-Ressourcen bis hin zu KI-gestützten Methoden, um beispielsweise anhand meines bisherigen Nutzerverhaltens häufig benutzte Seiten höher zu bewerten.
All das, um mir innerhalb weniger Millisekunden ausreichend zufriedenstellende Suchergebnisse liefern zu können, sodass ich auch beim nächsten Mal wieder die gleiche Suchmaske öffne[^2].

Nun ist es allerdings nicht in jedem Fall erforderlich, mit Kanonen auf Spatzen zu schießen und KI-gestützte Verfahren einzuführen, wo clevere Algorithmen und Datenhaltung ausreichen.
In diesem Bereich spielt Elasticsearch seine Stärken aus, da die Speicherung großer Datenmengen von strukturiertem und unstrukturiertem Text durch die Verwendung des Inverted Index-Konzept gelöst wird:
Neu zu hinterlegender Text wird in der Ingest-Phase nach konfigurierten Prinzipien analysiert, um in der Query-Phase die zu Sucheingaben passenden Ergebnisse direkt bereitstellen zu können.

[^2]: Das Geschäftsmodell der Firmen, die ihre Suchmaschinen kostenlos zur Verfügung stellen, ist nicht Gegenstand dieses Beitrags.

## 

## 
