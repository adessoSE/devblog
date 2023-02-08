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

- Beispiele für Indikatoren aus Richtlinien
- https://environment.ec.europa.eu/strategy/biodiversity-strategy-2030_de
- https://ec.europa.eu/environment/nature/knowledge/eu2010_indicators/index_en.htm
- https://biodiversity.europa.eu/policy/eu-policies


# Harte Fakten für große Politik

## Europäische Biodiversitätsstrategie

Die Biodiversitätsstrategie 2030 wurde vor zwei Jahren von der EU-Kommission veröffentlicht.
Sie umfasst ehrgeizige Ziele zur Wiederherstellung und zum Schutz der europäischen Ökosysteme.

Zur Erfolgskontrolle hat die Europäischen Umweltagentur die sogenannten [SEBI-Indikatoren](https://ec.europa.eu/environment/nature/knowledge/eu2010_indicators/index_en.htm) entwickelt.
Indikatoren zeigen Erfolge und Misserfolge der Zielerreichung auf, indem sie empirische Daten zusammenfassen und komplexe Zustände in verständlicher Form abbilden.
SEBI steht für "Streamlining European Biodiversity Indicators" und bedeutet, dass aus dem Durcheinander international gebräuchlicher Indikatoren eine repräsentative Auswahl von 26 Indikatoren konkretisiert und für Prozesse auf europäischer Ebene nutzbar gemacht wurden.
Die SEBI-Indikatoren fließen außerdem in nationale, europäische sowie globale Strategien zur Erhaltung der Biodiversität ein.

Ein wichtiger SEBI-Indikator heißt ["Abundance and Distribution of Selected Species"](https://www.eea.europa.eu/ims/abundance-and-distribution-of-selected).
Seine Datengrundlage liefert das [Pan-European Common Bird Monitoring Scheme](https://pecbms.info/) (PECBMS).
Aus jedem EU-Staat steuert eine regionale Organisation ihre aktuellen Daten zum PECBMS bei.
In Deutschland wird das Monitoring vom Dachverband Deutscher Avifaunisten koordiniert.
Hier fließen zwei Programme in den Indikator ein:
* [Monitoring häufiger Brutvögel](http://www.dda-web.de/mhb)
* [Monitoring seltener Brutvögel](http://www.dda-web.de/msb)

## Artenvielfalt und Landschaftsqualität

Die Nachhaltigkeitsstrategie für Deutschland wurde im Jahr 2002 von der Bundesregierung beschlossen und wird seitdem regelmäßig weiterentwickelt.
Aktuell umfasst sie ein Set aus 75 Indikatoren.

Ein Schlüsselindikator für die Nachhaltigkeit von Landnutzung trägt den Namen ["Artenvielfalt und Landschaftsqualität"](https://www.bfn.de/indikator-artenvielfalt-und-landschaftsqualitaet).
Er war der erste Indikator, der bundesweit Aussagen über den Zustand von Natur und Landschaft ermöglichen sollte.
Seitdem wird er jedes Jahr aktualisiert und geht in diverse Veröffentlichungen der Bundesbehörden ein.

Woher stammt hier die Datengrundlage?
Ebenfalls aus dem Monitoring häufiger Brutvögel.

Den Zustand unterschiedlich genutzter Landschaften auf der gesamten Landesfläche zu erfassen, klingt nach ungeheuer vielen fortlaufenden Messungen.
Doch das Bundesamt für Naturschutz bedient sich einer indirekten Methode:
Der Indikator bilanziert die Veränderungen der Bestände ausgewählter Vogelarten.
Dafür wurden die Landschafts- und Lebensraumtypen in Deutschland in fünf Kategorien aufgeteilt:
Agrarland, Wälder, Siedlungen, Binnengewässer sowie Küsten und Meere.
In jedem dieser Lebensraumtypen sind bestimmte Vogelarten zu erwarten.
Steigt die Qualität der Lebensräume, drückt sich dies in wachsenden Beständen aus.
Wird hingegen eine Landschaft durch Umweltbelastungen oder nicht nachhaltige Nutzung geschädigt, so schlägt sich das schnell in schwindenden Vogelzahlen nieder.

# Beispiel: Monitoring häufiger Brutvögel

Als Beispiel für die Erfassung von Rohdaten soll hier das Monitoring häufiger Brutvögel im Detail beleuchtet werden.
Denn es liefert die Daten für mehrere Indikatoren, die sowohl von der Bundesregierung selbst genutzt als auch an die EU gemeldet werden.

Verantwortlich ist der, oben bereits erwähnte, Dachverband Deutscher Avifaunisten e.V. mit Sitz in Münster.
Dieser betreut insgesamt 2.637, je 1 km2 große Probeflächen, die vom Statistischen Bundesamt repräsentativ festgelegt wurden.

Auf jeder Probefläche zählen ehrenamtliche Helferinnen und Helfer vier Mal im Jahr die Vögel, und zwar monatlich von März bis Juni.
Die Methode ist einfach:
Eine festgelegte, rund 3 Kilometer lange Route wird langsam abgeschritten.
Dabei werden alle Individuen aller Vogelarten, die auf der Probefläche beobachtet werden, mit Art- und Verhaltenskürzel auf der Karte notiert.

Auf einer Karte, mit regennassem Klemmbrett?
Hier beginnt die Digitalisierung.

# Damals mit Papier und Bleistift

Tatsächlich wurden die Vögel bis vor wenigen Jahren mit Bleistift und Papier in die "Tageskarten" gezeichnet.
Am Schreibtisch mussten die Kürzel dann in "Artkarten" sortiert werden.


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

