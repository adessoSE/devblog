---
layout: [post, post-xml]                # Pflichtfeld. Nicht ändern!
title:  "UI-Prototyping - Wie man aus Wireframe Skizzen UI-Prototypen generieren kann"         # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2020-04-27 10:00                # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2020-04-27              # Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author: vincentmathis                   # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: [Softwareentwicklung]       # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Machine Learning, Computer Vision,
UI-Prototyping]    # Optional.
---

Prototyping ist essentiell für die Entwicklung von guten User Interfaces.
Oftmals ist aber der Schritt von einer Wireframe Skizze zu einem UI-Prototyp sehr zeitaufwendig.
Wie könnte man sich also Technologien aus Computer Vision und Machine Learning zu nutze machen, um diesen Schritt zu umgehen und automatisiert Fotos von handgezeichneten Skizzen in Prototypen umwandeln?


# Das Resultat

![Eingabe und Ausgabe](/assets/images/posts/ui-prototyping-wireframe/input_output.jpg "Eingabe und Ausgabe")

_Eingabe und Resultat_

Auf der linken Seite sieht man ein Foto einer handgezeichneten Wireframe Skizze.
Auf der rechten Seite eine von der entwickelten Pipeline generierte HTML-Datei, wenn man die Skizze links als Eingabe verwendet.


# Aufbau der Pipeline

![Pipeline](/assets/images/posts/ui-prototyping-wireframe/pipeline.jpg "Pipeline")

_Aufbau der Pipeline_

Die Pipeline ist so aufgebaut, dass ein Foto einer Wireframe Skizzen eingeben wird.
Anschließend werden die gezeichneten UI-Element mittels Computer Vision Techniken ([OpenCV](https://opencv.org/)) aus dem Bild ausgeschnitten.
Die ausgeschnittenen UI-Elemente können dann durch ein Convolutional Neural Network (CNN) klassifiziert werden.
Aus den klassifizierten Elementen können HTML-Elemente generiert werden, die entsprechend den UI-Elementen im Eingabebild positioniert werden.


# Extrahierung der UI-Elemente aus dem Foto

Der erste Schritt ist, die gezeichneten UI-Elemente aus dem Foto der Skizze zu extrahieren.
Dafür müssen diese zu erst lokalisiert und anschließend ausgeschnitten werden.

## Segmentierung des Bildes in Vorder- und Hintergrund

Mithilfe von einem Ridge Detection Filter gefolgt von Otsu-Thresholding kann das Bild einer Wireframe Skizze einfach in Vorder- und Hintergrund segmentiert werden.
Das Bild wird dadurch in schwarz und weiß binarisiert.
Das heißt, es existieren keine Graustufen mehr: Pixel können nur noch komplett schwarz oder komplett weiß sein.
Dieser Schritt ist für den folgenden Schritt notwendig.

![Segmentation](/assets/images/posts/ui-prototyping-wireframe/segmentation.jpg "Segmentation")

_Segmentierung durch Ridge Detection Filter mit anschließendem Otsu-Thresholding_

## Lokalisierung der UI-Elemente

Die gezeichneten UI-Elemente können aus beliebig vielen separaten Strichen bestehen, daher ist die Lokalisierung dieser nicht trivial.
Um den Prozess stark zu vereinfachen kann ein UI-Element mit einem Rechteck in der Zeichnung umrandet werden.
Dadurch ist immer eindeutig, welche Striche zu einem UI-Element gehören.
Dieser Prozess ist dadurch auch komplett unabhängig davon, wie die UI-Elemente selbst aussehen.
Das heißt auch, das für diesen Prozess kein neuronales Netzwerk trainiert werden muss.

Diese Umrandungen können durch OpenCVs Konturenfindung ermittelt werden.
OpenCV gibt einem dabei die Option, nur die Konturen auf oberster Hierarchieebene in einem segmentierten Bild zu ermitteln.
Dadurch werden __nur__ die gezeichneten Umrandungen ermittelt: Die UI-Elemente innerhalb der Umrandungen werden ignoriert.

Um sicherzustellen, dass nur die Umrandungen ermittelt werden, müssen Lücken in diesen Umrandungen geschlossen werden.
Dafür kann eine Dilatation auf das Bild angewandt werden.

![Konturen](/assets/images/posts/ui-prototyping-wireframe/contours.png "Konturen")

_Ermittelte Konturen (Grün) bevor (oben) und nachdem (unten) Lücken geschlossen wurden_

## Ausschneiden der UI-Elemente

Um die lokalisierten UI-Elemente zu klassifizieren, müssen diese aus dem Eingabebild ausgeschnitten werden.
Da die Konturen kontinuierliche Kurven sind, müssen vorerst Bounding Boxes ermittelt werden, da man aus einem Pixelbild nur Rechtecke ausschneiden kann, das heißt man benötigt eine Axis Aligned Bounding Box (AABB).

![Bounding Boxes](/assets/images/posts/ui-prototyping-wireframe/bounding_boxes.png "Bounding Boxes")

_Aus den Konturen ermittelte Bounding Boxes: AABB (links), rotierte BB (rechts)_

Wie man in der Abbildung links erkennen kann, ist eine AABB nicht immer optimal.
Stattdessen sollte man eine rotierte Bounding Box ermitteln, wie in der Abbildung rechts zu sehen.
Von dieser kann der Winkel der Rotation berechnet und anschließend korrigiert werden.

## Entfernung der Umrandung

Die gezeichneten Rechtecke um jedes UI-Element diente nur der Lokalisierung der einzelnen Elemente.
Da dieser Schritt schon getan ist, werden die gezeichneten Umrandungen nicht mehr benötigt.

![Umrandung Entfernung](/assets/images/posts/ui-prototyping-wireframe/border_removal.png "Umrandung Entfernung")

_Entfernung der Umrandung_

Um diese Umrandungen zu entfernen können die zuvor ermittelten Konturen mit Weiß gefüllt werden.
Schrumpft man diese gefüllten Flächen anschließend etwas durch Erosion kann man diese Fläche als Maske auf das ursprüngliche Bild anwenden.
Dadurch wird die gezeichnete Umrandung effektiv und ohne viel Aufwand aus dem Bild entfernt.


# Klassifizieren der ausgeschnittenen UI-Elemente

Um den entsprechenden HTML Code zu generieren, müssen die extrahierten Bildausschnitte klassifiziert werden.
Dafür kann ein Convolutional Neural Network trainiert werden.

![Training Data](/assets/images/posts/ui-prototyping-wireframe/training_data.png "Training Data")

_Beispiele für gesammelte Skizzen_

Für das Training wurden individuell gezeichnete Skizzen abfotografiert, in denen 10 verschiedenen UI-Elemente (wie zum Beispiel Labels, Buttons, Images etc.) gezeichnet worden sind.
Beispiele für solche Skizzen sind in der Abbildung zu siehen.

![Extracted](/assets/images/posts/ui-prototyping-wireframe/extracted.png "Extrahiert")

_Beispiele für extrahierte Bildauschnitte aus den Skizzen_

Aus den gesammelten Fotos wurden dann mit der zuvor beschriebenen Methode die einzelnen UI-Elemente extrahiert.
Diese Bildausschnitte dienten als Trainingsdaten für das CNN.

Für das CNN wurde [fast.ai](https://github.com/fastai/fastai) verwendet.
Dieses Library erlaubt es mit nur einigen Zeilen Code ein neuronales Netzwerk zu trainieren.
Hier ist ein _minimal working example_, welches ein CNN am MNIST Datensatz trainiert:

```python
from fastai.vision import *
path = untar_data(MNIST_PATH)
data = image_data_from_folder(path)
learn = cnn_learner(data, models.resnet18, metrics=accuracy)
learn.fit(1)
```
_Wenn ihr mehr über [fast.ai](https://github.com/fastai/fastai) erfahren wollt findet ihr hier den [Einsteiger-Course](https://course.fast.ai/) und die [Dokumentation](https://docs.fast.ai/)_

![GUI](/assets/images/posts/ui-prototyping-wireframe/gui_prototype.png "GUI")

_Die Klassifizierung durch das trainierte Modell in einer GUI visualisiert_

Das trainierte Modell kann nun die lokalisierten und ausgeschnittenen UI-Elemente klassifizieren.
In der Abbildung ist das Ergebnis dieser zwei Schritte in einer GUI visualisiert.


# Generierung des Prototyps

Anhand der Klassifizierung können dann entsprechende HTML-Tags generiert werden, welche anhand der Position und Größe der Bounding Box mittels CSS positioniert werden können.
So werden beispielsweise zufällige Bilder von unsplash.com geladen.
Dabei kann die Breite und Höhe der Bounding Box als Breite und Höhe des Bildes verwendet werden: `https://source.unsplash.com/random/500x600`.

Die Resultate der HTML-Generierung repräsentieren eine Annäherung and einen echten Prototyp, sie sind jedoch bei weitem nicht perfekt.


# Fazit

Die hier präsentierte Methode konnte auf einem älteren Laptop bei einer Trainingsdauer von unter einer Stunde 99% Genauigkeit erreichen.

Wer jedoch die nötigen Ressourcen hat um ein großes Set an Trainingsdaten zu sammeln, könnte die Schritte der Extraktion mittels OpenCV umgehen und ein Object Detection Netzwerk trainieren.
Dies benötigt jedoch nicht nur weitaus mehr Trainingsdaten, die Daten benötigen zusätzlich zu den Labels auch noch Positionsinformationen pro UI-Element.
Darüber hinaus sollten die Eingaben in das Neuronale Netzwerk größer.
Dadurch ist nicht nur die Beschaffung der Trainingsdaten sondern auch der Trainingsaufwand für ein solches Netzwerk weitaus größer.


# Weitere Ressourcen

Wer sich noch etwas genauer mit diesem Thema beschäftigen möchte kann sich diese Blog Posts und wissenschaftliche Artikel durchlesen:

* [Airbnb Design - Sketching Interfaces](https://airbnb.design/sketching-interfaces/)
* [Teaching Machines to Understand User Interfaces](https://hackernoon.com/teaching-machines-to-understand-user-interfaces-5a0cdeb4d579)
* [Microsoft AI.Lab - Sketch2Code](https://arxiv.org/abs/1910.08930)
* [pix2code: Generating Code from a Graphical User Interface Screenshot](https://arxiv.org/abs/1705.07962)