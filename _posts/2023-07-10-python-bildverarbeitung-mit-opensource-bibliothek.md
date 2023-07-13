---
layout: [post, post-xml]              # Pflichtfeld. Nicht ändern!
title:  "Einfache Bildverarbeitung mit Python und OpenCV Bibliothek"         # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2023-07-13 18:05              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
author_ids: [alexej_sevas]       # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesen Namen geben.
categories: [Softwareentwicklung]     # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Python, OpenCV]   # Bitte auf Großschreibung achten.
---


Python ist eine populäre Programmiersprache, die vor allem in Bereich machine learning zum Einsatz kommt.
Ein großer Vorteil von Python ist, dass es eine umfangreiche Sammlung von Open Source Bibliotheken wie z.B NumPy, TensorFlow, OpenCV gibt.
Dieser Artikel gibt Einblick auf einige Möglichkeiten der Bibliothek OpenCV.

# OpenCV Bibliothek
Ursprünglich von Intel entwickelt, ist OpenCV heute eine der am weitesten verbreiteten Bibliotheken in Bereich Computer Vision.
OpenCV bietet eine breite Palette von Funktionen und Algorithmen zur Verarbeitung und Analyse von Bildern und Videos.
Es enthält Module für grundlegende Operationen wie das Lesen und Schreiben von Bildern, das Ändern der Bildgröße,
das Zeichnen von Formen und das Anwenden von Filtern.
Darüber hinaus bietet OpenCV fortgeschrittenere Funktionen wie das Erkennen von Gesichtern, das Verfolgen von Objekten, 
das Extrahieren von Merkmalen, das Messen von Abständen und das Durchführen von Kamera-Kalibrierung.
OpenCV ist in C++ geschrieben, bietet aber auch Schnittstellen für viele andere Programmiersprachen wie Python und Java.
Dadurch ist es einfach, OpenCV in verschiedene Projekte und Anwendungen zu integrieren.

# Python Projekt mit OpenCV aufsetzen
Wir wollen eine einfache Slideshow aus mehreren Bildern mithilfe von OpenCV Bibliothek erstellen.
Diese Slideshow soll aus zwei Bilder eine Videodatei erstellen, die ähnliche Effekte verwendet wie es bei Powerpoint der Fall ist.

Um OpenCV Bibliothek verwenden zu können, müssen wir erstmal diese installieren.
Das geht zum Beispiel mit dem Paketverwaltungsprogramm für Python Pip und dem Befehl:
pip install opencv-python
Mit dem Schritt installieren wie die aktuellste Version von OpenCV, zum 10.07.2023 ist das die Version 4.8.0.74.

# Wie ein Video aus dem Bild erstellt wird
Wir werden erstmal damit anfangen, dass wir ein Bild einlesen mit OpenCV und diesen anzeigen.
Das Bild muss in diesem Fall innerhalb vom Projektverzeichnis in dem Ordner "images" liegen und "image1.jpg" heißen.
Jetzt erstellen wir ein Python Script File und nennen den zum Beispiel Slideshow.py

```python
    import cv2

    img1 = cv2.imread("images/image1.jpg", cv2.IMREAD_COLOR)
    height, width, layers = img1.shape
    video_name = 'Slideshow.mp4'
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    video = cv2.VideoWriter(video_name, fourcc, 1, (width, height))
    video.write(img1)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
```

Hier verwenden wir die Funktion cv2.imread() um das Bild einzulesen und die Funktion cv2.VideoWriter() mit dem folgenden
Parameter (const String &filename, int fourcc, double fps, Size frameSize, bool isColor=true)
um eine Videodatei mit dem Namen Slideshow.mp4 aus diesem Bild zu erstellen. Als Videocodec
wird in diesem Beispiel mp4 genommen, fps(Frame per Second) setzen wir auf 1, frameSize setzen wird auf die Breite und 
Länge von dem Bild image1 gesetzt.
Die Liste der möglichen Videocodecs findet man unter https://learn.microsoft.com/en-us/windows/win32/medfound/video-fourccs
Eine weitere Funktion von OpenCV, die wir verwenden, ist video.write(), die ein Bild zu dem Video hinzufügt.

# Video mit einem 'Verblassen' Effekt
In OpenCV Bibliothek gibt es viele Möglichkeiten ein Bild zu verändern.
Zum Beispiel es ist möglich ein Bild ausblenden und ein anderes Bild anzeigen.
Dieser Effekt heißt in Powerpoint 'Verblassen'
Dafür eignet sich die Funktion addWeighted(src1,  alpha, src2, beta, gamma[, dst[, dtype]]) von OpenCV
src1 ist das erste Bild, src2 ist das zweite Bild
alpha ist der Transparenzwert für das erste Bild,
beta ist der Transparenzwert für das zweite Bild.
Gamma ist eine Konstante, die zu dem Transparenzindex beider hinzugefügt werden kann, wir setzen die auf 0.
Je kleiner alpha bzw. beta ist, desto durchsichtiger ist das entsprechende Bild, wobei die möglichen Werte sind von 0 bis 1
Schreiben wir eine Methode, die das Bild 1 schrittweise ausblendet und dafür Bild 2 einblendet.
Sehr wichtig ist, dass die beiden Bilder die gleiche Größe haben, sonst kommt die Fehlermeldung beim Ausführen des Programms.
Unser Programm sieht jetzt so aus: 

```python
import cv2

img1 = cv2.imread("images/image1.jpg", cv2.IMREAD_COLOR)
img2 = cv2.imread("images/image2.jpg", cv2.IMREAD_COLOR)

video_name = 'slideshow.mp4'
fourcc = cv2.VideoWriter_fourcc(*'mp4v')
height, width, layers = img1.shape
video = cv2.VideoWriter(video_name, fourcc, 1, (width, height))

def verblassen(img1, img2, index):
    dest = cv2.addWeighted(img2, 1 - index, img1, index , 0.0)
    return dest

images = [0, 0.5, 1]
for x in images:
    img_changed =verblassen(img1, img2, x)
    video.write(img_changed)
    cv2.waitKey(200)

cv2.destroyAllWindows()
```

Wir haben die Funktion verblassen() geschrieben, die je größer der index Parameter ist, das erste Bild verblassen lässt und
das zweite dafür sichtbarer macht. 
Das Bild, das daraus entsteht, wird zum Video hinzugefügt.
Hier setzen wir mit cv2.waitKey(200) die Verzögerung beim Wechsel der Bilder auf 200 Millisekunden um den Bilderübergang langsamer zu machen.
Die Funktion rufen wir 3 Mal, um das Ergebnis der Umwandlung der Bilder besser zu sehen.

# Video mit einem 'Blur' Effekt
Um das Bild zu blurren werden wir die Funktion cv2.blur(src, ksize[, dst[, anchor[, borderType]]]) anwenden.
Diese Funktion verwendet die Mittelwertmethode um unscharfes Bild zu erstellen.
Die nimmt als Parameter das Bild und die sogenannte Kernelgröße, je größer diese ist, desto unschärfer wird das
Bild.
Schreiben wir die Funktion die das Bild unschärfer macht.
Anschließend rufen wir die Funktion drei Mal mit jeweils größeren Parameter um die Unschärfe des Bildes

```python
def bluren(img, video, ksize):
    blurred = cv2.blur(img, (ksize))
    video.write(blurred)

kernelSizes = [(3, 3), (9, 9), (15, 15)]
for (kX, kY) in kernelSizes:
    bluren(img1, video, (kX, kY))
```

# Fazit

Wir haben gesehen, wie einfach es ist mit Python und OpenCV Bibliothek aus der Bilder ein Video zu erstellen.
Die zwei Videoeffekten, die wir mit nur ein paar Zeilen Code implementiert haben, haben außerdem gezeigt wie einfach
die Verwendung der OpenCV Bibliothek ist. Diese Bibliothek bietet noch sehr viele Möglichkeiten für die Bild und Videobearbeitung.



