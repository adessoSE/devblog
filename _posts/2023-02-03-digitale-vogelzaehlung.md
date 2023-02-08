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


- Beispiele für Indikatoren aus Richtlinien
- https://www.bfn.de/indikator-artenvielfalt-und-landschaftsqualitaet
- https://environment.ec.europa.eu/strategy/biodiversity-strategy-2030_de
- https://ec.europa.eu/environment/nature/knowledge/eu2010_indicators/index_en.htm
- https://biodiversity.europa.eu/policy/eu-policies

Die Biodiversitätsstrategie 2030 wurde am 20. Mai 2020 von der EU-Kommission veröffentlicht und beinhaltet ambitionierte Ziele, z.B. in den Bereichen Schutzgebiete und Ökosystem Restauration.

Zur Erfolgskontrolle hat die Europäischen Umweltagentur (EEA) die sogenannten [SEBI-Indikatoren](https://ec.europa.eu/environment/nature/knowledge/eu2010_indicators/index_en.htm) entwickelt.
SEBI steht für "Streamlining European 2010 Biodiversity Indicators" und bedeutet, dass aus dem Durcheinander international gebräuchlicher Indikatoren eine repräsentative Auswahl von 26 Indikatoren konkretisiert und für Prozesse auf europäischer Ebene nutzbar gemacht wurden.
Die SEBI-Indikatoren fließen in nationale, europäische und auch globale Strategien zur Erhaltung der Biodiversität ein.

Ein wichtiger Indikator heißt ["Abundance and Distribution of Selected Species"](https://www.eea.europa.eu/ims/abundance-and-distribution-of-selected).
Seine Datengrundlage liefert das [Pan-European Common Bird Monitoring Scheme](https://pecbms.info/) (PECBMS).
In jedem EU-Staat ist eine regionale Organisation für die Datenerfassung zuständig.
Das Monitoring in Deutschland wird vom Dachverband Deutscher Avifaunisten koordiniert.
Zwei Programme fließen in den Indikator ein:
* [Monitoring häufiger Brutvögel](http://www.dda-web.de/mhb)
* [Monitoring seltener Brutvögel](http://www.dda-web.de/msb)

Die Nachhaltigkeitsstrategie für Deutschland wurde im Jahr 2002 von der Bundesregierung beschlossen und wird seitdem regelmäßig weiterentwickelt.
Sie enthält ein Set aus 75 Schlüsselindikatoren, unter anderem den Indikator "Artenvielfalt und Landschaftsqualität".

Folgende Indikatoren werden für die Berichterstattung zur Nationalen Strategie zur biologischen Vielfalt genutzt.
- Artenvielfalt und Landschaftsqualität
- Siedlungs- und Verkehrsfläche
- Landschaftszerschneidung
- Stickstoffüberschuss in der Landwirtschaft
- Ökologischer Landbau
- Nachhaltige Forstwirtschaft




Indikatoren fassen empirische Daten zusammen, um komplexe Zustände in verständlicher Form abzubilden.
Im Kontext des Naturschutzes stammen die Daten aus Monitoring-Programmen.
Sie zeigen Erfolge und Misserfolge bei der Erreichung zuvor festgelegter Ziele auf und dienen der Politikberatung sowie der Information der Öffentlichkeit.

Damit schafft sie die Grundlage für die nationale Umsetzung der UN-Agenda 2030.

## An die EU zu melden

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

