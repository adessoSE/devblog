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

## Ein europäischer Indikator

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

## Ein deutscher Indikator

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

Auf jeder Probefläche zählen ehrenamtliche Helferinnen und Helfer vier Mal im Jahr die Vögel und zwar monatlich von März bis Juni.
Die Methode ist einfach:
Eine festgelegte, rund 3 Kilometer lange Route wird langsam abgeschritten.
Dabei wird jeder einzelne Vogel, der auf der Probefläche beobachtet wird, mit Art- und Verhaltenskürzel auf der Feldkarte notiert.

Auf einer echten Papierkarte an einem sperrigen Klemmbrett?
Hier beginnt die Digitalisierung.

# Damals mit Papier und Bleistift

Tatsächlich wurden die Vögel bis vor wenigen Jahren mit Bleistift und Papier in die Tageskarten gezeichnet.
Dafür gibt es allgemein gebräuchliche Abkürzungen für die 99 zu zählenden Spezies sowie einen Satz von Verhaltenssymbolen, etwa "singend" oder "Nistmaterial tragend".
Diese Codes entsprechen den Brutzeitcodes für den europäischen Brutvogelatlas - auch als "Atlascodes" bekannt - sind jedoch leichter zu merken.

Ein traditioneller Kartierdurchgang lief so ab, dass man die Tageskarte - im A3-Format - so faltete, dass sie aufs Klemmbrett passte, ohne dass man sie allzu oft wenden musste.
Damit spazierte man an einem ruhigen, sonnigen Morgen die Linie durch die Probefläche ab.
Hörte oder sah man einen Vogel, dann zeichnete man das Artkürzel auf die entsprechende Stelle und gegebenenfalls ein Verhaltenskürzel darüber.

Nach dem letzten Durchgang im Juni musste für jede beobachtete Art die Anzahl vermuteter Reviere in den Zählbogen eingetragen und das Ganze per Post eingeschickt werden.
Aus den vier Papierkarten voller Symbole mussten also sinnvoll abgegrenzte Brutreviere entstehen.

Dafür breitete man die vier gesammelten Tageskarten zu Hause aus.
Für jede beobachtete Spezies nahm man eine saubere Karte im A4-Format und markierte darin die Sichtungen der vier Tage mit unterschiedlichen Ziffern.
Beispielsweise kopierte man alle Buchfinkenpunkte von Tag 1, Tag 2, Tag 3 und Tag 4 in eine Karte, wiederholte dasselbe mit einer neuen Artkarte für alle Amselpunkte und dann für alle Spatzen, bis man so viele Artkarten am Schreibtisch ausgefüllt hatte, wie man Vogelarten im Feld entdeckt hatte.

![Eine von vier Tageskarten, zwei von vielen Artkarten](/assets/images/posts/digitale-vogelzaehlung/feldkarte.jpg)

Anschließend schaut man sich jede Artkarte genau an:
Welche Punkte sind wahrscheinlich dasselbe Individuum an unterschiedlichen Tagen?
Welches hat dort sein Revier, welches flog nur zufällig vorbei?

Die Kartieranleitung enthält eine Tabelle mit der Kernbrutzeit jeder Art an.
In diesen Monaten zählt eine Sichtung als Reviernachweis, Sichtungen außerhalb des Zeitraums gelten im Zweifel als Durchzügler und werden ignoriert.
So darf man etwa eine einzelne Bachstelze in März oder April als Revier zählen, da diese Vögel in jedem Zeitraum ortstreu sind.
Davor und danach ziehen sie umher, so dass eine Beobachtung ab Mai als Zufall verworfen wird.

Von den verbleibenden Punkten auf der Artkarte kreist man nun jeweils die ein, die räumlich beieinander, also vermutlich im selben Revier liegen.
Schließlich zählt man die Reviere durch und trägt sie in den Zählbogen sein.
Falls die Problefläche mehrere Lebensraumtypen enthält, teilt man sie auf getrennte Spalten auf.
In diesem Beispiel gibt es unter anderem Buchfinken in der Siedlung und im Industriegebiet, deshalb werden diese Reviere getrennt gezählt.

![Ausschnitt aus dem Ergebnisbogen](/assets/images/posts/digitale-vogelzaehlung/zaehlbogen.jpg)

Zu Schluss steckte man den Zählbogen und die Papierkarten in einen großen Briefumschlag und schickte alles an den DDA.

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

