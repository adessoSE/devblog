---
layout: [post, post-xml]              # Pflichtfeld. Nicht ändern!
title:  "Digitalisierung im Monitoring von Tierarten" # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2023-02-03 11:00              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2023-02-03 11:00             # Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author_ids: [cjohn]                   # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesen Namen geben.
categories: [Branchen]                # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Open Source, Applications] # Bitte auf Großschreibung achten.
---

Hier kommt der Teaser hin, ohne Links, ohne Bilder

# Harte Fakten für Indikatoren

....

## An die EU zu melden

- Beispiele für Indikatoren aus Richtlinien
- https://www.bfn.de/indikator-artenvielfalt-und-landschaftsqualitaet

Ein Schlüsselindikator für die Nachhaltigkeit von Landnutzung trägt den Namen "Artenvielfalt und Landschaftsqualität".
Er wurde im Rahmen der Nationalen Nachhaltigkeitsstrategie entwickelt und in die Nationale Strategie zur biologischen Vielfalt übernommen.
Im Veröffentlichungsjahr 2002 war er der erste Indikator, der bundesweit Aussagen über den Zustand von Natur und Landschaft ermöglichen sollte.
Seitdem wird der Indikator jedes Jahr aktualisiert und geht in diverse Veröffentlichungen der Bundesbehörden ein.

Woher stammt eigentlich die Datengrundlage?
Den Zustand unterschiedlich genutzter Landschaften auf der gesamten Landesfläche zu erfassen, klingt nach ungeheuer vielen Messungen, die fortlaufend wiederholt werden.
Hier behilft sich das Bundesamt für Naturschutz mit einer indirekten Methode:
Der Indikator bilanziert die Veränderungen der Bestände ausgewählter Vogelarten.
Dafür wurden die Landschafts- und Lebensraumtypen in Deutschland in fünf Kategorien aufgeteilt:

* Agrarland
* Wälder
* Siedlungen
* Binnengewässer
* Küsten und Meere

In jedem dieser Lebensraumtypen sind bestimmte Vogelarten zu erwarten.
Steigt die Qualität der Lebensräume, drückt sich dies in wachsenden Beständen aus.
Wird hingegen eine Landschaft durch Umweltbelastungen oder nicht nachhaltige Nutzung geschädigt, so schlägt sich das schnell in schwindenden Vogelzahlen nieder.

## Beteiligte Institutionen

- das Bundesamt für Naturschutz sammelt Indikatoren
- Ehrenamtliche Organisationen liefern die Datengrundlage
- Beispiele für regelmäßige Veröffentlichungen

...

# Damals mit Papier und Bleistift

- Feldkarten mit festen Abkürzungen und Codes
- Händisches Kopieren in Artkarten, einkreisen der Reviere
- Zählen der Reviere, Einsenden des Meldebogens

# Erste Teilautomatisierung 2021

- Erfassung mit NaturaList
- Export als GeoJson für IT-Affine, PowerPoint-Artkarten für Normal-User
- Split nach Species, Symbolisierung nach Datum und Atlascode, Einkreisen der Reviere
- Zählen der Reviere, Einsenden des Meldebogens wie bisher

...

# Zweite Teilautomatisierung 2021

- Übernahme des Datenbestands nach DigiBird
- Automatische Revierabgrenzung mit AutoTerri geplant
- Manuelle Revierabgrenzung nur noch zur Prüfung vorgesehen -> doch nötig geworden

# Vorschau 2022

- Erfassung mit NaturaList soll einzige verbleibende Aufgabe der ehrenamtlichen Kartierenden sein
- Revierabgrenzung mit AutoTerri und dmait die eigentliche Zählung wird vollautomatisch im Hintergrund ablaufen

# Fazit

- Digitalisierung nimmt den Ehrenamtlichen die meist unbeliebte Schreibtischarbeit ab
- Die Erfassug im Gelände nach Sicht und Gehör hat viele Fans, die Aufgabe wird nun sogar noch attraktiver
- Die akustische Erfassung lässt sich voraussichtlich mittelfristig automatisieren, die optische erweist sich als schwierig

