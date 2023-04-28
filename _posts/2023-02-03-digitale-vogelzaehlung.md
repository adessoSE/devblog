---
layout: [post, post-xml]              # Pflichtfeld. Nicht ändern!
title:  "Digitalisierung im Umwelt-Monitoring" # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2023-04-28 08:00              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2023-04-28 08:00             # Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author_ids: [cjohn]                   # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesen Namen geben.
categories: [Branchen]                # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Open Source, Applications, Umwelt, Politik, Monitoring] # Bitte auf Großschreibung achten.
---

Politik und Verwaltung sind auf kompakte Informationen angewiesen.
Ist die Wirklichkeit zu komplex, so wird sie auf vergleichbare Zahlen, sogenannte Indikatoren, reduziert.
Dieser Artikel beleuchtet für zwei Indikatoren den Digitalisierungsprozess bei der Gewinnung von Rohdaten im Gelände.

# Harte Fakten für große Politik

Um qualifizierte Entscheidungen zu treffen und den Erfolg von Maßnahmen zu bewerten, sind sowohl die Politik als auch die öffentliche Verwaltung auf kompakte Informationen angewiesen.
Komplexe Zustände müssen zu griffigen Zahlen eingedampft werden.
Dafür wird eine Vielzahl von Indikatoren regelmäßig aktualisiert.
Indikatoren fassen empirische Daten zusammen und bilden die Wirklichkeit in verständlicher Form ab.
Sie sind unerlässlich, um Erfolge und Misserfolge der Zielerreichung aufzuzeigen.

Dieser Artikel stellt die Datengrundlage zweier typischer Indikatoren vor.
Einer wird auf EU-Ebene eingesetzt, der andere ist seit 20 Jahren in Deutschland geläufig.
Statt um Ergebnisse, soll es hier um die Frage gehen, wie ganz unten am Beginn der Verarbeitungskette die rohen Datenpunkte entstehen.

![Komplexe Ökosysteme in griffigen Zahlen zusammengefasst](/assets/images/posts/digitale-vogelzaehlung/startbild.png "Komplexe Ökosysteme in griffigen Zahlen zusammengefasst")

## Ein europäischer Indikator

Die Biodiversitätsstrategie 2030 wurde vor zwei Jahren von der EU-Kommission veröffentlicht.
Sie umfasst ehrgeizige Ziele zur Wiederherstellung und zum Schutz der europäischen Ökosysteme.

Zur Erfolgskontrolle hat die Europäischen Umweltagentur die sogenannten [SEBI-Indikatoren](https://ec.europa.eu/environment/nature/knowledge/eu2010_indicators/index_en.htm) entwickelt.
SEBI steht für "Streamlining European Biodiversity Indicators" und bedeutet, dass aus dem Durcheinander international gebräuchlicher Indikatoren eine repräsentative Auswahl von 26 Indikatoren konkretisiert und für Prozesse auf europäischer Ebene nutzbar gemacht wurden.
Die SEBI-Indikatoren fließen außerdem in nationale, europäische sowie globale Strategien zur Erhaltung der Biodiversität ein.

Einer der SEBI-Indikatoren heißt ["Abundance and Distribution of Selected Species"](https://www.eea.europa.eu/ims/abundance-and-distribution-of-selected).
Seine Datengrundlage liefert das [Pan-European Common Bird Monitoring Scheme](https://pecbms.info/) (PECBMS).
Aus jedem EU-Staat steuert eine regionale Organisation ihre aktuellen Daten zum PECBMS bei.
In Deutschland wird das Monitoring vom Dachverband Deutscher Avifaunisten (DDA) koordiniert.
Hier fließen zwei Programme in den Indikator ein:
* [Monitoring häufiger Brutvögel](http://www.dda-web.de/mhb)
* [Monitoring seltener Brutvögel](http://www.dda-web.de/msb)

## Ein deutscher Indikator

Die Nachhaltigkeitsstrategie für Deutschland wurde im Jahr 2002 von der Bundesregierung beschlossen und wird seitdem regelmäßig weiterentwickelt.
Aktuell umfasst sie ein Set aus 75 Indikatoren.

Ein Schlüsselindikator für die Nachhaltigkeit von Landnutzung trägt den Namen ["Artenvielfalt und Landschaftsqualität"](https://www.bfn.de/indikator-artenvielfalt-und-landschaftsqualitaet).
Er war der erste Indikator, der bundesweit Aussagen über den Zustand von Natur und Landschaft ermöglichen sollte.
Seitdem wird er jedes Jahr aktualisiert und geht in diverse Veröffentlichungen der Bundesbehörden ein.

Den Zustand unterschiedlich genutzter Landschaften auf der gesamten Landesfläche zu erfassen, klingt nach ungeheuer vielen fortlaufenden Messungen.
Doch das Bundesamt für Naturschutz bedient sich einer indirekten Methode:
Der Indikator bilanziert die Veränderungen der Bestände ausgewählter Vogelarten.
Die Daten dafür stammen wiederum aus dem Monitoring häufiger Brutvögel.

Dafür wurden die Landschafts- und Lebensraumtypen in Deutschland in fünf Kategorien eingeteilt:
Agrarland, Wälder, Siedlungen, Binnengewässer sowie Küsten und Meere.
In jedem dieser Lebensraumtypen sind bestimmte Vogelarten zu erwarten.
Steigt die Qualität der Lebensräume, drückt sich dies in wachsenden Beständen aus.
Wird hingegen eine Landschaft durch Umweltbelastungen oder nicht nachhaltige Nutzung geschädigt, so schlägt sich das schnell in schwindenden Vögeln nieder.

# Monitoring häufiger Brutvögel

Als Beispiel für die Erfassung von Rohdaten soll hier das Monitoring häufiger Brutvögel, meistens kurz als MhB bezeichnet, im Detail beleuchtet werden.
Denn es liefert die Daten für Indikatoren, die sowohl von der Bundesregierung selbst genutzt als auch an die EU gemeldet werden.

Verantwortlich ist der, oben bereits erwähnte, Dachverband Deutscher Avifaunisten e.V. mit Sitz in Münster.
Dieser betreut insgesamt 2.637, je einen Quadratkilometer große Probeflächen, die vom Statistischen Bundesamt repräsentativ festgelegt wurden.

Auf jeder Probefläche zählen ehrenamtliche Helferinnen und Helfer vier Mal im Jahr die Vögel und zwar monatlich von März bis Juni.
Die Methode heißt Linienkartierung:
Eine festgelegte, rund 3 Kilometer lange Route wird langsam abgeschritten.
Dabei wird jeder einzelne auf der Probefläche erkannte Vogel mit Art- und Verhaltenskürzel auf der Feldkarte notiert.

Im Anschluss an die Kartiersaison werden aus den vier Feldkarten die mutmaßlichen Brutreviere der einzelnen Vogelpärchen ermittelt.
An den DDA eingeschickt wird letzten Endes eine Excel-Tabelle mit den Anzahlen der Reviere pro Vogelart und Landschaftstyp.
Der Weg von den Feldkarten zur fertigen Tabelle wurde über die letzten Jahre schrittweise digitalisiert.

# Damals mit Papier und Bleistift

Tatsächlich wurden die Vögel bis vor wenigen Jahren mit Bleistift und Papier in die Tageskarten gezeichnet.
Dafür lernte man Abkürzungen für die 99 zu zählenden Spezies auswendig sowie einen Satz von Verhaltenssymbolen, etwa "singend" oder "Nistmaterial tragend".
Letztere entsprechen den Brutzeitcodes für den europäischen Brutvogelatlas - auch als "Atlascodes" bekannt - sind jedoch leichter zu merken.

Ein traditioneller Kartierdurchgang lief so ab, dass Sie die Tageskarte so falteten, dass sie aufs Klemmbrett passte.
Damit spazierten Sie an einem ruhigen, sonnigen Morgen die Linie durch die Probefläche ab.
Hörten oder sahen Sie einen Vogel, dann zeichneten Sie das Artkürzel auf die entsprechende Stelle und gegebenenfalls ein Verhaltenskürzel darüber.

Nach dem letzten Durchgang im Juni musste für jede beobachtete Art die Anzahl vermuteter Reviere in den Zählbogen eingetragen und das Ganze per Post eingeschickt werden.
Aus den vier Papierkarten voller Symbole mussten also sinnvoll abgegrenzte Brutreviere entstehen.

Dafür breiteten Sie die vier gesammelten Tageskarten zu Hause aus.
Für jede beobachtete Spezies nahmen Sie eine saubere Karte im A4-Format und markierten darin die Sichtungen der vier Tage mit unterschiedlichen Ziffern.
Beispielsweise kopierten Sie alle Buchfinkenpunkte von Tag 1, Tag 2, Tag 3 und Tag 4 in eine Karte, wiederholten dasselbe mit einer neuen Artkarte für alle Amselpunkte und dann für alle Spatzen, bis Sie so viele Artkarten am Schreibtisch ausgefüllt hatten, wie Sie Vogelarten im Feld entdeckt hatten.

![Eine von vier Tageskarten, zwei von vielen Artkarten](/assets/images/posts/digitale-vogelzaehlung/feldkarte.jpg "Eine von vier Tageskarten, zwei von vielen Artkarten")

Anschließend schauten Sie sich jede Artkarte genau an:
Welche Punkte sind wahrscheinlich dasselbe Individuum an unterschiedlichen Tagen?
Welches hat dort sein Revier, welches flog nur zufällig vorbei?

Die Kartieranleitung enthält eine Tabelle mit der Kernbrutzeit jeder Art an.
In diesen Monaten zählt eine Sichtung als Reviernachweis, Sichtungen außerhalb des Zeitraums gelten im Zweifel als Durchzügler und werden ignoriert.
So darf man etwa eine einzelne Bachstelze in März oder April als Revier zählen, da diese Vögel in dem Zeitraum ortstreu sind.
Davor und danach ziehen sie umher, so dass eine Beobachtung ab Mai als Zufall verworfen wird.

Von den verbleibenden Punkten auf der Artkarte kreisten Sie nun jeweils die ein, die räumlich beieinander, also vermutlich im selben Revier lagen.
Schließlich zählten Sie die Reviere durch und trugen das Ergebnis in den Zählbogen ein.
Falls Ihre Probefläche mehrere Lebensraumtypen enthält, teilten Sie diese auf getrennte Spalten auf.
In diesem Beispiel gibt es unter anderem Buchfinken in der Siedlung und im Industriegebiet, deshalb werden diese Reviere getrennt gezählt.

![Ausschnitt aus dem Ergebnisbogen](/assets/images/posts/digitale-vogelzaehlung/zaehlbogen.png "Ausschnitt aus dem Ergebnisbogen")

Zu Schluss steckten Sie den Zählbogen und die Papierkarten in einen großen Briefumschlag und schickten alles an den DDA.

# Erste Teilautomatisierung 2020

Die größte Systembremse war offensichtlich das Papier.
Es musste durchs Feld getragen, mit der Post verschickt und immer wieder von Hand beschriftet werden.
Und das, während viele Birdwatcher ihre Zufallsbeobachtungen seit über 15 Jahren digital meldeten.
So lange schon ist das - ebenfalls vom DDA betriebene - [Meldeportal Ornitho](https://www.ornitho.de/) verfügbar.

Laut seinen eigenen Grundsätzen soll Ornitho
* einen aktuellen Überblick über das avifaunistische Geschehen geben sowie
* avifaunistische Daten an einem Ort bündeln und in geprüfter Form für wissenschaftliche Auswertungen bereitstellen.

Tausende Melderinnen und Melder sammeln dort ihre Beobachtungen, eine geografische Suche ist vorhanden und zur schnellen Erfassung im Gelände hat sich die App [NaturaList](https://www.ornitho.de/index.php?m_id=20033) etabliert.

Nichts lag da näher, als das Meldesystem, das ohnehin auf vielen Birder-Telefonen installiert ist, auch fürs Monitoring einzusetzen.
Das normale Frontend war aber nur eingeschränkt geeignet, unter anderem erforderte das MhB drei große Änderungen:

* Normalerweise ordnet Ornitho jede Zufallsbeobachtung einer Rasterfläche zu. Fürs MhB müssen stattdessen exakte GPS-Koordinaten erfasst werden.
* NaturaList bietet eine Fülle von Detailfeldern an, um eine Beobachtung zu spezifizieren. Für das schnelle Wegklicken von Atlascodes absolut aller gehörten Vögel ist das zu kompliziert.
* Um die Datenqualität sicherzustellen, muss die Beobachtungsliste auf die Probefläche beschränkt, der User gewissermaßen per GPS auf einer Route "eingesperrt" werden.

Im Forschungsprojekt "Beschleunigung des Datenflusses im Vogelmonitoring" - gefördert von Bundesumweltministerium - konnte im Jahr 2019 ein MhB-Plugin für NaturaList entwickelt werden.
Seitdem sieht jeder User, für den eine Probefläche auf Ornitho hinterlegt ist, den zusätzlichen Menüpunkt "MhB - Beobachtungsliste live im Feld".
Dahinter verbirgt sich eine ganz neue Oberfläche.

![Erfassung eines Vogels im Gelände](/assets/images/posts/digitale-vogelzaehlung/naturalist-karte.jpg "Erfassung eines Vogels im Gelände")

Die Erfassung ist auf die eigene Probefläche beschränkt.
Darin ist die abzulaufende Zähllinie eingezeichnet, im Screenshot ist das die orange Linie.
In diesem Beispiel entdecken Sie von der Bahnhofsbrücke aus eine Krähe mit Zweigen im Schnabel auf dem Dach des Kiosks.
Also schieben Sie den roten Cursor auf den genauen Beobachtungsort, hier das kleine Haus.
Dann wischen Sie den Bildschirm zu Seite, so dass die Artensuche erscheint.
Dort wählen Sie die Rabenkrähe aus und drücken das Verhaltenssymbol "Nistmaterial tragend", schon ist die Beobachtung gespeichert und die Tour geht weiter.
Am Ende des Rundgangs speichern Sie die Liste direkt auf Ornitho.

## Revierabgrenzung am Bildschirm

Wenn draußen der Sommer beginnt und alle Kartierrunden abgeschlossen sind, beginnt das Warten auf einen verregneten Sonntagnachmittag.
Denn aus den gesammelten Datenpunkten müssen Sie noch die Reviere herausarbeiten.
Das läuft jetzt schnell und bequem ab, egal wie viel Erfahrung Sie mit Geodaten haben.

Alle Kartierenden kennen sich mit Vögeln aus, jedoch nur wenige mit Computern.
Da alle ehrenamtlich arbeiten und zu nichts verpflichtet sind, kann man sie auch nicht zwingen, sich in ein neues Programm einzuarbeiten.
Deshalb bietet Ornitho fertige Artkarten als Powerpoint-Folien an.
Laden Sie die Präsentation Ihrer Datenpunkte herunter, öffnen Sie die Datei - schon können Sie Reviere einkreisen wie früher auf den Papierbögen.
Allerdings lässt die Auflösung zu wünschen übrig und die Arbeit mit Powerpoint kann etwas unbequem sein.

## Spaß mit QGIS

Versierte "Birdnerds" dürfen die selbst erfassten Rohdaten auch auf angenehmere Art verarbeiten.
Zuerst laden Sie Ihre MhB-Daten im Format GeoJSON von Ornitho herunter und öffnen die Datei im Open-Source-Programm [QGIS](https://qgis.org/de/site/).
Für einen besseren Überblick legen Sie dann am besten ein OpenStreetMap-Layer darunter.
Jetzt sehen Sie alle Beobachtungen aus allen vier Durchgängen als chaotische Punktwolke über Ihrer Probefläche.

Was Sie brauchen, sind die klassischen Artkarten: eine Ebene pro Spezies, auf der die Punkte mit Monat und Atlascode markiert sind.
Dafür bereiten Sie zuerst die Markierungen vor, indem Sie in den Ebeneneigenschaften unter "Beschriftungen" eine regelbasierte Beschriftung hinzufügen.
Diese erhält als Wert einen regulären Ausdruck, der den Monat aus dem Datumsfeld herauspickt (siehe Abbildung), und zusätzlich den Atlascode.

Für noch bessere Übersicht können die Punkte noch nach Monat eingefärbt werden.
Klicken Sie dafür unter "Symbolisierung" auf "gewählte Regel verfeinern" und dann auf "Kategorien hinzufügen".
Der reguläre Ausdruck, nach dem klassifiziert werden soll, ist wieder der für den Monat im Feld 'date'.
Für weitere Tricks mit der Symbolisierung in QGIS sei auch der Artikel [Mit QGIS eine Fotolandkarte erstellen](https://www.adesso.de/de/news/blog/mit-qgis-eine-fotolandkarte-erstellen.jsp) empfohlen.

![Ebenenstile für Symbolisierung (links) und Beschriftung (rechts)](/assets/images/posts/digitale-vogelzaehlung/layer-settings.png "Ebenenstile für Symbolisierung (links) und Beschriftung (rechts)")

Das Auftrennen in Artkarten, früher ein halber Tag am Schreibtisch, kostet jetzt nur wenige Klicks.
Suchen Sie bei den Vektorwerkzeugen nach "Vektorlayer teilen" und wählen Sie im Dialog dieses Werkzeugs das Schlüsselfeld "species_name" aus.
Schon erzeugt QGIS sauber getrennte Shapefiles pro Vogelart.

Die Einstellungen für die Markierungen können Sie mit "Stil kopieren" auf alle neuen Ebenen gleichzeitig übertragen, fertig sind alle Artkarten.
Nun können Sie alle Ebenen außer OpenStreetMap erstmal ausblenden.
Um in Ruhe die Reviere zu zählen, blenden Sie eine Spezies nach der anderen ein.

# Zweite Teilautomatisierung 2022

Developer wissen, dass eine App niemals die ganze Zielgruppe erreicht.
Immer wird es einige Smartphones geben, auf denen sie nicht läuft.
Immer wird es einige User geben, die sie nicht mögen.

Beim Vogelmonitoring gibt es außerdem einen gewissen Gewohnheitsfaktor.
Das MhB startete offiziell im Jahr 2004 als Anschlussprogramm an das seit 1989 durchgeführte Monitoring häufiger Vogelarten.
Ehrenamtliche, die seit 20 oder sogar 30 Jahren auf Papier kartieren, sehen nicht unbedingt die Notwendigkeit einer Digitalisierung.
Bei Frost oder unerwartetem Nieselregen halten Bleistift und Klemmbrett mehr aus, als Finger und Telefon.
Und wer zum ersten Mal den Stromverbrauch von GPS erlebt, kehrt dankend zur analogen Methode zurück, sobald im Feld der Akku leer ist.

## DigiBird digitalisiert Papierkarten

Seit letztem Jahr gibt es die neue Web-Anwendung DigiBird.
Dort können Tageskarten auf Papier nachträglich digitalisiert werden.
Dafür werden sie zunächst eingescannt und dem Ornitho-Account des oder der Kartierenden zugeordnet.
Anschließend können die Kopfdaten und Punkte in einem Web-Editor abgetippt werden.
Der Editor ähnelt dem Erfassungsdialog aus NaturaList, mit etwas Fingerspitzengefühl kann dieselbe Datenqualität erreicht werden.

Die Anmeldung an DigiBird erfolgt per Single-Sign-on über Ornitho, daher ist es kein Problem, alle Datenpunkte automatisch im Hintergrund zu synchronisieren.
Falls Sie digital kartiert haben, sehen Sie in DigiBird Ihre fertigen Karten.
Haben Sie Papierkarten eingescannt, dann sehen Sie dort die Scans und die selbst nachträglich digitalisierten Karten.

Das beste Feature ist der unscheinbare Button "Artkarten":
Die nach Vogelart getrennten und nach Monat eingefärbten Karten, die Sie letztes Jahr noch in QGIS oder Office bearbeiten mussten, werden fertig auf OpenStreetMap angezeigt.
Falls die Reviere nicht offensichtlich sind - im folgenden Bild müssen 54 Amseln entwirrt werden - können Sie hineinzoomen und den sichtbaren Ausschnitt in ein beliebiges Grafikprogramm importieren.

![Nach Spezies getrennte Karten in DigiBird](/assets/images/posts/digitale-vogelzaehlung/digibird-artkarten.png "Nach Spezies getrennte Karten in DigiBird")

# Dritte Teilautomatisierung 2023

Warum müssen Sie eigentlich die Reviere von Hand zählen?
Alle dafür nötigen Informationen liegen maschinenlesbar vor:

* die digitalen Artkarten
* die Tabelle der Reviergrößen jeder Spezies
* die Tabelle der Kernbrutzeiten jeder Spezies

Das Feature AutoTerri soll ab 2023 die letzten Hausaufgaben in DigiBird überflüssig machen.

## AutoTerri zieht Grenzen

AutoTerri ist ein Algorithmus, der von der Schweizerischen Vogelwarte entwickelt wurde.
Er berechnet zunächst die geografische Distanz zwischen allen Beobachtungspunkten in der Artkarte.
Dann prüft er nahe beieinander liegende Punkte auf Details wie Verhaltenscodes und Geschlecht.
Kompatible Punkte, die zum selben Revier gehören könnten, werden gruppiert.

Aus der geografischen Lage der Gruppen und den bekannten Revieransprüchen der Spezies im jeweiligen Landschaftsraum wird dann eine Revierdistanz berechnet.
Für Vogelarten mit ausgeprägtem Revierverhalten können so zuverlässige Reviergrenzen berechnet werden.
Vorsicht ist noch geboten bei Koloniebrütern, wie etwa einer Hecke voller Spatzen, oder Wasservögeln, die sich einen See teilen.

Den Ehrenamtlichen bleibt dann nur noch zu tun, was sie ohnehin am liebsten mögen:
Sie gehen durchs Gelände und kartieren Vögel mit der NaturaList-App.
Sobald alle vier Listen an Ornitho gesendet sind, läuft die Verarbeitung automatisch durch.

Natürlich werden die selbst gesammelten Datenpunkte weiterhin in Ornitho und DigiBird angezeigt.
Eine Auswertung ist zwar nicht mehr notwendig, aber dennoch erwünscht.
Denn jedes Revier, bei dem ein Birdwatcher zu einem anderen Schluss kommt als AutoTerri, ist wichtig für die Feinjustierung des Algorithmus.
Im Idealfall sollen über mehrere Jahre hinweg Vergleiche zwischen AutoTerri und menschlicher Einschätzung berechnet werden.
Wie viele Ehrenamtliche noch freiwillig die Arbeit eines Computers machen, muss jedoch die Zeit zeigen.

# Ausblick

Die Digitalisierung überlässt den Ehrenamtlichen die schönen Tätigkeiten und nimmt ihnen die unbeliebte Schreibtischarbeit ab.
Vor vier Jahren mussten MhB-Kartierende noch ähnlich viel Zeit am Schreibtisch wie auf der Probefläche verbringen.
Davon bleibt nur die Erfassung nach Sicht und Gehör im Gelände übrig, die Auswertung soll ab diesem Jahr vollständig automatisch ablaufen.

Dadurch wird auch der Datenfluss beschleunigt, Kopierfehler entfallen und es wird kiloweise Papier gespart.
Darüber hinaus wird es deutlich leichter, Ehrenamtliche für Kartierarbeiten zu gewinnen.

Für die Zukunft zeichnet sich jedoch ein Mangel an Artenkenntnis in der Gesellschaft ab.
In Lebensräumen mit viel Blickschutz, wie Siedlungen oder Wäldern, erfolgt die Kartierung größtenteils nach Gehör.
Doch die Anzahl der Leute, die zuverlässig einen Ruf oder ein Gesangsfragment einer Vogelart zuordnen können, sinkt scheinbar.
Insofern könnte es mittelfristig nötig werden, junge Kartierende digital zu unterstützen.

Für die Erkennung von Vogelstimmen gibt es bereits halbwegs brauchbare Programme auf Basis künstlicher Intelligenz.
Was den Einsatz im MhB betrifft, sind BirdNet und Co. noch viel zu ungenau.
Sollte sich sie Erkennungsrate verbessern, wäre es durchaus denkbar, Freiwillige mit mittelmäßiger Artenkenntnis teilnehmen zu lassen.

# Fazit

Politische Entscheidungen werden auf Basis von Daten getroffen, die jedes Jahr neu von tausenden Ehrenamtlichen zusammengetragen werden.
Ohne deren kostenlose Expertise wäre ein Überblick über europaweite Umweltdaten kaum möglich.
Die Digitalisierung von Auswertungen spart ihnen viel Arbeit und motiviert zum Mithelfen.
Gleichzeitig steigt die Genauigkeit und damit Aussagekraft der Indikatoren.

Nebenbei spiegelt das Monitoring auch die Bedeutung von Vögeln in den Kulturen wider.
Denn die Zählungen des Pan-European Common Bird Monitoring Scheme (PECBMS) werden in ganz Europa von Freiwilligen durchgeführt.
Allerdings sind in Großbritannien 2800 Fieldworkers am Monitoring beteiligt, in Deutschland 1300 und in Italien nur 200.

