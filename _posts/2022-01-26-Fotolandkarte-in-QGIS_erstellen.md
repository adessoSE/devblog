---
layout: [post, post-xml]              # Pflichtfeld. Nicht ändern!
title:  "Mit QGIS eine Fotolandkarte erstellen" # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2022-01-26 12:00              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2022-01-26             # Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author_ids: [cjohn]                   # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesen Namen geben.
categories: [Branchen]                # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Open Source,  Applications, Gis, Geodata, Photo] # Bitte auf Großschreibung achten.
---

Dieser Artikel zeigt, wie Bilder mit Standortdaten auf einer Karte angeordnet werden.
Ohne Cookies, ohne Cloud, ohne undurchsichtige Nutzungsbedingungen wegzuklicken.
Eigentlich fast ohne Internet.
Das freie Desktop-Geoinformationssystem QGIS und ein paar Kacheln aus OpenStreetMap reichen völlig aus.

# Geodaten sind überall

Geoinformationssysteme verwalten räumliche Daten.
Im einfachsten Fall werden Dinge aus der realen Welt an den jeweiligen Orten dargestellt werden, damit User sie auswerten können.
So etwa Gebäude und Straßen in einer Stadt oder die Positionen einer Fahrzeugflotte.

Dieser Artikel demonstriert die Anzeige von Fotos am Aufnahmeort auf einer Landkarte.
Die Datenerfassung ist denkbar einfach:
Mit einem handelsüblichen Smartphone werden Orte fotografiert, dabei werden die Geokoordinaten automatisch in den Metadaten der Bilder gespeichert.

## Problematische Abhängigkeiten

Die häufigste Weiterverarbeitung zeigt die Abhängigkeit von scheinbar kostenlosen Cloud-Diensten:
Oft sendet man alle Fotos an einen Speicherdienst wie z.B. Google Drive und lässt sie als Marker auf Google Maps anzeigen.
Damit hat man nicht nur sämtliche Bilder ins Internet entlassen, man gibt die Kontrolle auch an einen Konzern ab, dessen Geschäftsbedingungen die wenigsten Menschen verstehen.

Für kritische Daten wie etwa Sicherheitsmängel auf einem Betriebsgelände oder Bilder fremder Personen ist das keine Lösung.
Darüber hinaus steht eine schnelle Internetverbindung nicht an jedem Ort jederzeit zur Verfügung.
Vielleicht wird auch eine Reduzierung von Abhängigkeiten angestrebt, um die eigene Software-Umgebung durchschaubar zu halten.

## Das Beispiel

Deshalb wird hier eine Lösung gezeigt, die mit freier Software auskommt und das Internet nur zum Lesen aus [OpenStreetMap](https://www.openstreetmap.org/) nutzt.
Sämtliche Fotos, Positions- und Metadaten bleiben offline auf dem eigenen Gerät.

Als Anwendungsfall dienst hier eine Kartierung von Tierspuren in freier Landschaft.
Die Daten werden von der öffentlichen Verwaltung benötigt, um die Ausbreitung des Bibers in Niedersachsen zu verfolgen.
Nur so können Konflike mit Landnutzern oder Baumschäden an Straßen vorhergesehen werden.
Doch sie sollen keinesfalls veröffentlicht werden, weil zu befürchten ist, dass Touristen die Tiere aufscheuchen oder Landwirte sie aus Angst vor Schäden vergrämen.

Die Kartierer laufen je ein Gewässer ab und fotografieren jede Tierspur mit der Foto-App des eigenen Smartphones.
Um zurückzumelden, wo sich Biber angesiedelt haben, werden die gesammelten Fotos in eine Landkarte importiert.
Die abschließende Bewertung ist dann auf einen Blick möglich.

![Eine Foto-Landkarte offline selbst erstellen](https://github.com/adessoAG/devblog/raw/master/assets/images/posts/Fotolandkarte-in-QGIS-erstellen/qgis_screen_fake.jpg)

# Installation von QGIS

QGIS wird für die Betriebssysteme Windows, Linux, macOS und BSD angeboten sowie als mobile Feldvariante für Android.
Auf der [Download-Seite](https://www.qgis.org/de/site/forusers/download.html) können Sie zwischen Langzeit-Support und aktuellster Version wählen.
Dieser Artikel bezieht sich auf Version 3.22 für Windows.

Falls dies Ihr erstes Experiment mit QGIS ist, laden Sie den Installer herunter und akzeptieren Sie die Voreinstellungen.
QGIS wird automatisch für den üblichen Bedarf passend eingerichtet.

# Die erste Karte

Starten Sie QGIS mit einem neuen Projekt.
In der leeren, weißen Fläche, die Sie nun sehen, sind alle Punkte der Erde enthalten.
Es fehlt nur eine Landkarte, um sich zu orientieren.
Eine schlichte Basiskarte aus OpenStreetMap eignet sich als Grundlage für fast jedes Kartenprojekt.
Dafür wird im GIS-Browser unter "XYZ Tiles" mit einem Klick die OpenStreetMap-Ebene ins Projekt eingefügt.
Sie lädt keine Details über die Objekte, sie liegt nur wie ein Hintergrundbild unter der Welt.

Jetzt müssen die Fotos aus dem OSM Tracker importiert werden.
Der Vollständigkeit halber sollte man noch die Route selbst exportieren, das geht in OSM Tracker mit dem Kontextmenü "Als GPX exportieren".
Danach können Sie das Smartphone an den PC anschließen und den kompletten Ordner "/osmtracker/2022-01-23_10-21-24" auf den PC kopieren. Der Ordnername ist jeweils der Startzeitpunkt der Route.

Der kopierte Ordner enthält eine GPX-Datei und alle unterwegs gesammelten Fotos. GPX steht für „Global Positioning System Exchange Format“.
Ziehen Sie diese Datei aus dem Dateiexplorer aufs QGIS-Fenster, um den Import zu starten.
Nun entsteht unter anderem der Layer „tracks“, der den gelaufenen Weg als Linie enthält.

In der Toolbox „Verarbeitungsdialoge“ liegt unter „Vektorerzeugung“ das Werkzeug „Geogetaggte Fotos importieren“.
Per Doppelklick gestartet, fragt es nach dem Eingabeverzeichnis.
Geben Sie hier den Ordner mit den Fotos an, der restliche Dialog kann leer bleiben.
Dadurch entsteht ein Layer, das für jedes Foto einen Punkt enthält.

Die Karte ist jetzt gepunktet, doch von den Bildern ist noch nichts zu sehen.
Suchen Sie in der Layers-Toolbox die neue Ebene „Fotos“ und öffnen Sie ihre Eigenschaften.
Bei „Symbolisierung“ ist ein einfacher Marker mit einem bunten Kreis eingestellt.
Ändern Sie den Symbollayertyp in „Rasterbildmarkierung“ – der untere Dialogteil verschiebt sich und eine leere Vorschau wird eingeblendet.

Auf den ersten Blick scheint der Dialog nur feste Dateinamen für das Punktsymbol anzunehmen.
Was wir stattdessen brauchen, ist eine sogenannte „Datendefinierte Übersteuerung“.
Wie in Abbildung 2, finden Sie diese mit dem Menü ganz rechts neben dem Dateinamenfeld unter „Bearbeiten“.
Das öffnet den Ausdruckseditor.

![Symbolisierung mit Rasterbildmarkierung](https://github.com/adessoAG/devblog/raw/master/assets/images/posts/Fotolandkarte-in-QGIS-erstellen/qgis_screen_rasterbildmarkierung_ausschnitt.png)

Der gesuchte Dateiname ist ein Attribut des Fotopunkts.
Scrollen Sie also zu „Felder und Werte“ (Abbildung 3) und suchen Sie aus allen Eigenschaften der Fotos das Feld „photo“ heraus.
Es enthält den vollständigen Dateipfad des Bildes.
Außerdem stehen hier die Geokoordinaten und der Zeitstempel zur Auswahl sowie getrennte Felder für Verzeichnis und Dateinamen, die wir teils später noch benötigen werden.

Damit ist der einfache Ausdruck „photo“ auch schon vollständig.
Bestätigen Sie den Dialog, um zu den Layereigenschaften zurückzukehren.
Die Symbolgröße steht noch auf wenige Millimeter, was für den bunten Kreis angemessen war, aber nicht für ein Foto reicht.
Ändern Sie die Breite auf 25 Millimeter, übernehmen Sie alles mit dem Button „Anwenden“, atmen Sie tief durch und ... die Fotos liegen auf der Karte, genau an ihren Aufnahmeorten!
Die feine Linie des Track-Layers markiert im Hintergrund den Weg, auf dem die Orte besucht wurden.

![Der Ausdruck "photo" liefert den Inhalt des gleichnamigen Felds](https://github.com/adessoAG/devblog/raw/master/assets/images/posts/Fotolandkarte-in-QGIS-erstellen/qgis_screen_rasterbildmarkierung_detail.png)

Jetzt fehlt noch eine große Ansicht, die sich bei Klick auf ein Vorschaubild öffnet.
Solche Pop-ups heißen in QGIS Kartenhinweise und werden in den Layereigenschaften unter „Anzeigen“ konfiguriert.
Dabei darf HTML verwendet werden, die Felder aus den Punktattributen werden mit spitzer Klammer und Prozentzeichen eingefasst.
In diesem Fall soll die Detailansicht den Dateinamen ohne Pfad und darunter das Foto anzeigen.
Tippen Sie also in die große Box „HTML-Kartenhinweis“ ein:

```html
[% filename %]
<img src="file:///[% photo %]" width="500px"/>
```

Nachdem der Dialog mit OK geschlossen wurde, sind die Thumbnails interaktiv: Sobald eines per Objektauswahl aktiviert wird, springt ein Pop-up mit dem großen Bild und dem Dateinamen auf.
Welche Magie steckt dahinter? Alle Daten stammen aus den EXIT-Einträgen in den Fotos selbst. Markieren Sie mit dem Objektauswahl-Werkzeug (Abbildung 3) ein paar Fotos und klicken Sie auf „Attributtabelle öffnen“. Jetzt sehen Sie alle Eigenschaften der ausgewählten Punkte: Neben Dateipfad und Koordinaten gibt es „rotation“ für die Drehung des Smartphones bei der Aufnahme und „timestamp“ für den Aufnahmezeitpunkt. Viel Spaß beim Ausprobieren, was sich damit anstellen lässt!