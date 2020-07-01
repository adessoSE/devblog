---
layout: [post, post-xml]                # Pflichtfeld. Nicht ändern!
title:  "UI-Prototyping - Wie man aus Wireframe Skizzen Prototypen generieren kann"         # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2020-05-12 10:00                # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2020-05-12              # Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author: vincentmathis                   # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: [Softwareentwicklung]       # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Machine Learning, Computer Vision,
UI-Prototyping]    # Optional.
---

Prototyping ist essenziell für die Entwicklung von guten User-Interfaces.
Oftmals ist aber der Schritt von einer Wireframe-Skizze zu einem UI-Prototyp sehr zeitaufwändig.
In diesem Blog-Post möchte ich einen Ansatz vorstellen, mit dem man diesen Schritt mithilfe von Computer Vision und Machine Learning verkürzen kann.


# Das Resultat

![Eingabe und Ausgabe](/assets/images/posts/ui-prototyping-wireframe/input_output.jpg "Eingabe und Ausgabe")

_Eingabe und Resultat_

![Handgezeichnete Skizze und entsprechender fertige UI-Prototyp](/assets/images/posts/ui-prototyping-wireframe/input_output.jpg "Eingabe und Ausgabe")

_Handgezeichnete Skizze und entsprechender fertige UI-Prototyp_

Auf der linken Seite sieht man ein Foto einer handgezeichneten Wireframe-Skizze.
Oben in der Skizze wurde eine Navigation-Bar gezeichnet, in der Mitte ein Grid von Bildern mit Paragraphen daneben und unten ein Pagination-Element.
Auf der rechten Seite sieht man eine Website, die in etwa der Skizze entspricht.
Diese Website wurde mithilfe von Komponenten des Bootstrap CSS-Frameworks erstellt.


# Verwendete Technologien

Um diesen Schritt zu automatisieren wurden hauptsächlich diese drei Bibliotheken verwendet:

1. [OpenCV](https://opencv.org/): Eine Library für Computer Vision Techniken, hauptsächlich gemacht für die digitale Bildverarbeitung und die Erkennung von Objekten in Bildern.
2. [fastai](https://www.fast.ai/): Eine Library, die Machine Learning und vor allem Deep Learning einfach zugänglich machen soll.
3. [yattag](https://www.yattag.org/): Eine Library zur Generierung von HTML-Code.

# Aufbau der Pipeline

![Pipeline](/assets/images/posts/ui-prototyping-wireframe/pipeline.jpg "Pipeline")

_Aufbau der Programm-Pipeline visualisiert_

Die Pipeline ist so aufgebaut, dass ein Foto einer Wireframe-Skizze eingeben wird.
Aus einem Foto einer Wireframe-Skizze werden die gezeichneten UI-Elemente mittels Computer Vision Techniken ausgeschnitten.
Dafür werden verschiedene Verfahren und Funktion von [OpenCV](https://opencv.org/) verwendet, um die gezeichneten Linien von dem Hintergrund zu separieren.

Die ausgeschnittenen UI-Elemente werden dann durch ein Convolutional Neural Network (CNN) klassifiziert.
CNNs sind spezielle neuronale Netzwerke aus dem Machine-Learning-Bereich, welche besonders gut bei der Erkennung von Objekten in einem Bild sind.
Sie basieren auf bestimmte Prinzipien und Erkenntnissen über den visuellen Kortex von Lebewesen.
[fastai](https://www.fast.ai/) bietet einfache Lösungen, um ein solches CNN zu trainieren und zu verwenden.

Aus den klassifizierten Elementen können mithilfe von [yattag](https://www.yattag.org/) HTML-Elemente generiert werden, die entsprechend den UI-Elementen in der Skizze positioniert werden.


# Extrahierung der UI-Elemente aus dem Foto

Der erste Schritt ist, die gezeichneten UI-Elemente aus dem Foto der Skizze zu extrahieren.
Dafür müssen diese zuerst lokalisiert und anschließend ausgeschnitten werden.

## Segmentierung des Bildes in Vorder- und Hintergrund

Mit Hilfe von einem Ridge-Detection-Filter gefolgt von Otsu-Thresholding kann das Bild einer Wireframe-Skizze einfach in Vorder- und Hintergrund segmentiert werden.
Das Bild wird dadurch in schwarz und weiß binarisiert.
Das heißt, es existieren keine Graustufen mehr: Pixel können nur noch komplett schwarz oder komplett weiß sein.
Dieser Schritt ist für den folgenden Schritt notwendig.

![Segmentation](/assets/images/posts/ui-prototyping-wireframe/segmentation.jpg "Segmentation")

_Segmentierung durch Ridge-Detection-Filter mit anschließendem Otsu-Thresholding_

## Lokalisierung der UI-Elemente

Die gezeichneten UI-Elemente können aus beliebig vielen separaten Strichen bestehen, daher ist die Lokalisierung dieser nicht trivial.
Um den Prozess stark zu vereinfachen, kann ein UI-Element mit einem Rechteck in der Zeichnung umrandet werden.
Dadurch ist immer eindeutig, welche Striche zu einem UI-Element gehören.
Dieser Prozess ist dadurch auch komplett unabhängig davon, wie die UI-Elemente selbst aussehen.
Das heißt, dass für diesen Prozess kein neuronales Netzwerk trainiert werden muss.

Diese Umrandungen können durch [OpenCVs Konturenfindung](https://docs.opencv.org/4.3.0/d3/dc0/group__imgproc__shape.html#gadf1ad6a0b82947fa1fe3c3d497f260e0) ermittelt werden.
Mit dem Parameter `RETR_EXTERNAL` werden nur die Konturen auf oberster Hierarchieebene in einem segmentierten Bild gefunden.
Diese Konturen entsprechen __nur__ den äußeren gezeichneten Umrandungen: Die UI-Elemente innerhalb der Umrandungen werden ignoriert.

Um sicherzustellen, dass nur die Umrandungen ermittelt werden, müssen Lücken in diesen Umrandungen geschlossen werden.
Dafür kann eine morphologische Transformation (in diesem Fall Dilatation) auf das Bild angewandt werden.

![Konturen](/assets/images/posts/ui-prototyping-wireframe/contours.png "Konturen")

_Die gefundenen Konturen sind in Grün markiert. In der oberen Reihe ist eine Lücke in der Umrandung, es werden fälschlicherweise Konturen innerhalb der Umrandung gefunden. In der unteren Reihe wurde die Dilatation angewandt, es wurde nur die gezeichnete Umrandung als Kontur gefunden._

## Ausschneiden der UI-Elemente

Um die lokalisierten UI-Elemente zu klassifizieren, müssen diese aus dem Eingabebild ausgeschnitten werden.
Da die Konturen kontinuierliche Kurven sind, müssen vorerst Bounding Boxes ermittelt werden, da man aus einem Pixelbild nur Rechtecke ausschneiden kann.
Da Rastergrafiken keine Rotation aufweisen können, müssten eigentlich Axis Aligned Bounding Boxes (AABBs) berechnet werden.

![Bounding Boxes](/assets/images/posts/ui-prototyping-wireframe/bounding_boxes.png "Bounding Boxes")

_Aus den Konturen ermittelte Bounding Boxes: AABB (links), rotierte BB (rechts)_

Wie man in der Abbildung links jedoch erkennen kann, ist eine AABB nicht immer optimal.
Stattdessen kann man eine rotierte Bounding Box ermitteln, wie in der Abbildung rechts zu sehen.
Von dieser kann der Winkel der Rotation berechnet und anschließend kann der Bildausschnitt in entgegengesetzter Richtung um diesen Winkel rotiert werden.
Dadurch wird die rotierte BB wieder zu einer AABB, die man aus dem Bild ausschneiden kann.


## Entfernung der Umrandung

Die gezeichneten Rechtecke um jedes UI-Element dienen nur der Lokalisierung der einzelnen Elemente.
Nach der Lokalisierung werden die gezeichneten Umrandungen nicht mehr benötigt.

![Umrandung Entfernung](/assets/images/posts/ui-prototyping-wireframe/border_removal.png "Umrandung Entfernung")

_Entfernung der Umrandung_

Um diese Umrandungen zu entfernen, können die zuvor ermittelten Konturen mit Weiß gefüllt werden.
Schrumpft man anschließend diese gefüllten Flächen durch Erosion, kann man diese Fläche als Maske auf das ursprüngliche Bild anwenden.
Dadurch wird die gezeichnete Umrandung effektiv und ohne viel Aufwand aus dem Bild entfernt.


# Klassifizieren der ausgeschnittenen UI-Elemente

Um den entsprechenden HTML-Code zu generieren, müssen die extrahierten Bildausschnitte klassifiziert werden.
Dafür kann ein Convolutional Neural Network (CNN) trainiert werden.

![Training Data](/assets/images/posts/ui-prototyping-wireframe/training_data.png "Training Data")

_Beispiele für gesammelte Skizzen_

Für das Training wurden individuell gezeichnete Skizzen abfotografiert, in denen 10 verschiedenen UI-Elemente (wie zum Beispiel Labels, Buttons, Images etc.) gezeichnet worden sind.
Beispiele für solche Skizzen sind in der obigen Abbildung zu sehen.

![Extracted](/assets/images/posts/ui-prototyping-wireframe/extracted.png "Extrahiert")

_Beispiele für extrahierte Bildausschnitte aus den Skizzen_

Aus den gesammelten Fotos wurden dann mit der zuvor beschriebenen Methode die einzelnen UI-Elemente extrahiert.
Diese Bildausschnitte dienten als Trainingsdaten für das CNN.

Für das CNN wurde [fast.ai](https://github.com/fastai/fastai) verwendet.
Dieses Library erlaubt es mit nur einigen Zeilen Code ein neuronales Netzwerk zu trainieren.
Hier ist ein _minimal working example_, welches ein CNN am MNIST Datensatz (Sammlung von handgezeichneten Ziffern des Modified National Institute of Standards and Technology) trainiert:

```python
from fastai.vision import *
path = untar_data(MNIST_PATH)
data = image_data_from_folder(path)
learn = cnn_learner(data, models.resnet18, metrics=accuracy)
learn.fit(1)
```
_Wenn ihr mehr über [fast.ai](https://github.com/fastai/fastai) erfahren wollt, findet ihr hier den [Einsteiger-Kurs](https://course.fast.ai/) und die [Dokumentation](https://docs.fast.ai/)._

![GUI](/assets/images/posts/ui-prototyping-wireframe/gui_prototype.png "GUI")

_Die Klassifizierung durch das trainierte Modell in einer GUI visualisiert_

Das trainierte Modell kann nun die lokalisierten und ausgeschnittenen UI-Elemente klassifizieren.
In der Abbildung ist das Ergebnis dieser zwei Schritte in einer GUI visualisiert.


# Generierung des Prototyps

Anhand der Klassifizierung können dann entsprechende HTML-Tags generiert werden, welche anhand der Position und Größe der Bounding Box mittels CSS positioniert werden können.
Die HTML-Tags können dann mit Platzhalter-Inhalten wie _Lorem Ipsum_ Text oder zufälligen Bilder von [unsplash.com](http://unsplash.com) versehen werden.
Dabei kann beispielsweise die Breite und Höhe der ermittelten Bounding Box als Breite und Höhe des Bildes verwendet werden: `https://source.unsplash.com/random/500x600`.

Die Resultate der HTML-Generierung repräsentieren eine Annäherung and einen echten Prototyp, sie sind jedoch bei weitem nicht perfekt.


# Fazit

Die hier präsentierte Methode konnte auf einem ca. fünf Jahre alten Laptop 99% Genauigkeit erreichen, bei einer Trainingsdauer von unter einer Stunde.
Der Nachteil dieser Methode ist jedoch, dass die benötigten Umrandungen um jedes UI-Element nicht intuitiv für Wireframe-Skizzen sind.

Wer jedoch die nötigen Ressourcen hat, um ein großes Set an Trainingsdaten zu sammeln, könnte die Schritte der Extraktion mittels OpenCV umgehen und ein Object-Detection-Netzwerk trainieren.
Dies benötigt jedoch nicht nur weitaus mehr Trainingsdaten, die Daten benötigen zusätzlich zu den Labels auch noch Positionsinformationen für jedes UI-Element im Bild.
Darüber hinaus müssten die Eingabebilder in das Object-Detection-Netzwerk größer sein, damit genügend Details erhalten bleiben.
Dadurch ist nicht nur die Beschaffung der Trainingsdaten, sondern auch der Trainingsaufwand für ein solches Netzwerk weitaus größer.


# Weitere Ressourcen

__Den kompletten Source Code für das Projekt findet ihr [hier](https://github.com/vincentmathis/wireframe2html).__

Wer sich noch etwas genauer mit diesem Thema beschäftigen möchte, kann sich diese Blog-Posts und wissenschaftlichen Artikel durchlesen:

* [Airbnb Design - Sketching Interfaces](https://airbnb.design/sketching-interfaces/)
* [Teaching Machines to Understand User Interfaces](https://hackernoon.com/teaching-machines-to-understand-user-interfaces-5a0cdeb4d579)
* [Microsoft AI.Lab - Sketch2Code](https://arxiv.org/abs/1910.08930)
* [pix2code: Generating Code from a Graphical User Interface Screenshot](https://arxiv.org/abs/1705.07962)
