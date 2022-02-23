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
Mit dem freien Desktop-Geoinformationssystem [QGIS](https://www.qgis.org) und ein paar Kacheln aus [OpenStreetMap](https://www.osm.org)
geht das ohne Cookies, ohne Cloud und ohne undurchsichtige Nutzungsbedingungen wegzuklicken.

# Geodaten sind überall

Geoinformationssysteme verwalten räumliche Daten.
Im einfachsten Fall werden Dinge aus der realen Welt an den jeweiligen Orten dargestellt, damit User sie auswerten können.
Beispiele hierfür sind Gebäude und Straßen in einer Stadt oder die Positionen einer Fahrzeugflotte.

Dieser Artikel demonstriert die Anzeige von Fotos am Aufnahmeort.
Die Datenerfassung ist denkbar einfach:
Mit einem handelsüblichen Smartphone werden Orte fotografiert, dabei werden die Geokoordinaten automatisch in den Metadaten der Bilder gespeichert.

## Problematische Abhängigkeiten

Die häufigste Weiterverarbeitung zeigt die Abhängigkeit von scheinbar kostenlosen Cloud-Diensten:
Oft sendet man alle Fotos an einen Speicherdienst wie z.B. Google Drive und lässt sie als Marker auf Google Maps anzeigen.
Damit hat man nicht nur sämtliche Bilder ins Internet entlassen, man unterwirft sich auch den Geschäftsbedingungen und macht sich abhängig von der Verfügbarkeit dieser Dienste.

Für kritische Daten wie etwa Sicherheitsmängel auf einem Betriebsgelände oder Bilder fremder Personen ist das keine Lösung.
Darüber hinaus steht eine schnelle Internetverbindung nicht an jedem Ort jederzeit zur Verfügung.
Vielleicht wird auch eine Reduzierung von Abhängigkeiten angestrebt, um die eigene Softwareumgebung durchschaubar zu halten.

## Das Beispiel

Deshalb wird hier eine Lösung gezeigt, die mit freier Software auskommt und das Internet nur zum Lesen aus OpenStreetMap nutzt.
Sämtliche Fotos, Positions- und Metadaten bleiben offline auf dem eigenen Gerät.

Als Anwendungsfall dient hier eine Kartierung von Tierspuren in freier Landschaft.
Die Daten werden von der öffentlichen Verwaltung benötigt, um die Ausbreitung des Bibers in Niedersachsen zu verfolgen.
Doch sie sollen keinesfalls veröffentlicht werden, weil zu befürchten ist, dass Sensationssuchende die Tiere aufscheuchen oder die Landwirtschaft sie aus Angst vor Schäden vergrämt.

Die Kartierenden laufen ein Gewässer ab und fotografieren jede Tierspur mit der Foto-App des eigenen Smartphones.
Um zurückzumelden, wo sich Biber angesiedelt haben, werden die gesammelten Fotos in eine Landkarte importiert.
Die abschließende Bewertung ist dann auf einen Blick möglich.

![Eine Foto-Landkarte offline selbst erstellen](/assets/images/posts/Mit-QGIS-eine-Fotolandkarte-erstellen/qgis_screen_fake.jpg)

# Vorbereitung
## Installation von QGIS

QGIS wird für die Betriebssysteme Windows, Linux, macOS und BSD angeboten sowie als mobile Feldvariante für Android.
Auf der [Downloadseite](https://www.qgis.org/de/site/forusers/download.html) können Sie zwischen einer Version mit Langzeitsupport und einer aktuellen Version wählen.
Diese Anleitung bezieht sich auf Version 3.22 für Windows.

Falls dies Ihr erstes Experiment mit QGIS ist, laden Sie den Installer herunter und akzeptieren Sie die Voreinstellungen.
QGIS wird automatisch für den üblichen Bedarf eingerichtet.

## Fotos sammeln

Aktivieren Sie Standortdaten in der Foto-App Ihres Telefons. Das ist alles, nun sind Sie gerüstet für das Sammeln von Geodaten.
Falls Sie zusätzlich den gelaufenen Weg aufzeichnen möchten, empfiehlt sich die App [OSM Tracker](https://learnosm.org/en/mobile-mapping/osmtracker/).
Sie verwendet ausschließlich die GPS-Funktion des Geräts, um offline einen Track aufzuzeichnen, in den man bei Bedarf ortsbezogene Kommentare, Sprachnotizen etc. einfügen kann.

In unserem Beispiel ziehen Sie die Wanderstiefel an und stapfen mit dem Handy durchs Gebüsch.
Jede Spur eines Bibers wird kurz fotografiert, dann verschwindet das Gerät schnell wieder in der Tasche, bevor es in den Schlamm fällt.
Und ziehen Sie den Handschuh wieder an, denn aus ökologischen Gründen wird im Winter kartiert.
Fertig?
Sicher können Sie es kaum erwarten, endlich wieder am Schreibtisch zu sitzen.

# Die erste Karte

Wählen Sie nach dem Start von QGIS "Neues leeres Projekt" aus.
In der weißen Fläche, die Sie nun sehen, sind alle Punkte der Erde enthalten.
Es fehlt nur eine Landkarte, um sich zu orientieren.
Eine schlichte Basiskarte aus OpenStreetMap eignet sich als Grundlage für fast jedes Kartenprojekt.
Dafür wird im GIS-Browser unter "XYZ Tiles" mit einem Klick die OpenStreetMap-Ebene ins Projekt eingefügt.
Sie lädt keine Details über die Objekte, sie liegt nur wie ein Hintergrundbild unter der Welt.

![Menüpunkte für den Import von OSM und Fotos](/assets/images/posts/Mit-QGIS-eine-Fotolandkarte-erstellen/qgis_menu.png)

## Fotos herunterladen

Schließen Sie das Smartphone per USB-Kabel an den PC. Im Datei-Explorer wird es wie ein Dateisystem angezeigt.
Die aktuellen Fotos können aus dem Ordner "DCIM" kopiert und in ein Verzeichnis auf der Festplatte eingefügt werden.

### Optional: Track exportieren

Falls Sie OSM Tracker verwenden, lässt sich mit dem Kontextmenü "Als GPX exportieren" die Route als XML-Datei abspeichern.
Danach können Sie den kompletten Ordner "/osmtracker/2022-01-23_10-21-24" vom Handy auf den PC kopieren. Der Ordnername ist jeweils der Startzeitpunkt der Route.

Der kopierte Ordner enthält eine GPX-Datei und alle unterwegs gesammelten Fotos. GPX steht für "Global Positioning System Exchange Format".
Ziehen Sie diese Datei aus dem Dateiexplorer aufs QGIS-Fenster, um den Import zu starten.
Nun entsteht unter anderem der Layer "tracks", der den gelaufenen Weg als Linie enthält.

## Fotos in QGIS anzeigen

In der Toolbox "Verarbeitungsdialoge" liegt unter "Vektorerzeugung" das Werkzeug "Geogetaggte Fotos importieren".
Per Doppelklick gestartet, fragt es nach dem Eingabeverzeichnis.
Geben Sie hier den Ordner mit den Fotos an, der restliche Dialog kann leer bleiben.
Dadurch entsteht ein Layer, das für jedes Foto einen Punkt enthält.

Die Karte ist jetzt gepunktet, doch von den Bildern ist noch nichts zu sehen.
Suchen Sie in der Layers-Toolbox die neue Ebene "Fotos" und öffnen Sie ihre Eigenschaften.
Bei "Symbolisierung" ist ein einfacher Marker mit einem bunten Kreis eingestellt.
Ändern Sie den Symbollayertyp in "Rasterbildmarkierung" – der untere Dialogteil verschiebt sich und eine leere Vorschau wird eingeblendet.

Auf den ersten Blick scheint der Dialog nur feste Dateinamen für das Punktsymbol anzunehmen.
Was wir stattdessen brauchen, ist eine sogenannte "datendefinierte Übersteuerung".
Wie in der Abbildung markiert, finden Sie ein Menü ganz rechts neben dem Dateinamenfeld unter "Bearbeiten".
Das öffnet den Ausdruckseditor.

![Symbolisierung mit Rasterbildmarkierung](/assets/images/posts/Mit-QGIS-eine-Fotolandkarte-erstellen/qgis_screen_rasterbildmarkierung_ausschnitt.png)

Der gesuchte Dateiname ist ein Attribut des Fotopunkts.
Scrollen Sie also zu "Felder und Werte" und suchen Sie aus allen Eigenschaften der Fotos das Feld "photo" heraus.
Es enthält den vollständigen Dateipfad des Bildes.
Außerdem stehen hier die Geokoordinaten und der Zeitstempel zur Auswahl sowie getrennte Felder für Verzeichnis und Dateinamen, die wir teils später noch benötigen werden.

Damit ist der einfache Ausdruck "photo" auch schon vollständig.
Bestätigen Sie den Dialog, um zu den Layereigenschaften zurückzukehren.
Die Symbolgröße steht noch auf wenige Millimeter, was für den bunten Kreis angemessen war, aber nicht für ein Foto reicht.
Ändern Sie die Breite auf 25 Millimeter, übernehmen Sie alles mit dem Button "Anwenden", atmen Sie tief durch und ... die Fotos liegen auf der Karte, genau an ihren Aufnahmeorten!
Die feine Linie des Track-Layers markiert im Hintergrund den Weg, auf dem die Orte besucht wurden.

![Der Ausdruck "photo" liefert den Inhalt des gleichnamigen Felds](/assets/images/posts/Mit-QGIS-eine-Fotolandkarte-erstellen/qgis_screen_rasterbildmarkierung_detail.png)

## Kartenhinweise einblenden

Jetzt fehlt noch eine große Ansicht, die sich beim Klick auf ein Vorschaubild öffnet.
Solche Pop-ups heißen in QGIS Kartenhinweise und werden in den Layereigenschaften unter "Anzeigen" konfiguriert.
Dabei darf HTML verwendet werden, die Felder aus den Punktattributen werden mit spitzer Klammer und Prozentzeichen eingefasst.
In diesem Fall soll die Detailansicht den Dateinamen ohne Pfad und darunter das Foto anzeigen.
Tippen Sie also in die große Box "HTML-Kartenhinweis" ein:

```html
[% filename %]
<img src="file:///[% photo %]" width="500px"/>
```

Nachdem der Dialog mit OK geschlossen wurde, sind die Thumbnails interaktiv:
Sobald eines per Objektauswahl aktiviert wird, springt ein Pop-up mit dem großen Bild und dem Dateinamen auf.
Welche Magie steckt dahinter?
Alle Daten stammen aus den EXIF-Einträgen in den Fotos selbst.
Natürlich hat QGIS nicht alle importiert, sondern nur die für Ort und Ausrichtung relevanten.
Markieren Sie mit dem Objektauswahl-Werkzeug ein paar Fotos und klicken Sie auf "Attributtabelle öffnen".
Jetzt sehen Sie alle Eigenschaften der ausgewählten Punkte:
Neben Dateipfad und Koordinaten gibt es "rotation" für die Drehung des Smartphones bei der Aufnahme und "timestamp" für den Aufnahmezeitpunkt.
Viel Spaß beim Ausprobieren, was sich damit anstellen lässt!

# Fazit

 QGIS ist ein umfangreiches Werkzeug, das für eine steile Lernkurve bekannt ist.
 Für einfache Anwendungsfälle wie diesen ist es aber mit wenigen Klicks einsatzbereit.
 Da offline auf eigenen Geräten gearbeitet wird, treten viele Datenschutzfragen gar nicht erst auf.
 Und nach kurzer Einarbeitung ermöglicht das volle Potenzial von QGIS komplexe Anwendungen, an die mit den bekannten Internet-Diensten kaum zu denken wäre.

 Ein Nachteil der Desktopanwendung ist, dass nur eine Person gleichzeitig an den Kartendateien arbeiten kann.
 Um eine Karte als Team zu nutzen, lohnt sich ein Blick auf den Web-Map-Service [QGIS Server](https://www.qgis.org/de/site/about/features.html#qgis-server).
