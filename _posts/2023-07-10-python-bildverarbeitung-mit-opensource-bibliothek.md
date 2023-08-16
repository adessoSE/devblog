---
layout: [post, post-xml]              # Pflichtfeld. Nicht ändern!
title:  "Einfache Bildverarbeitung mit Python und der OpenCV-Bibliothek"         # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2023-08-16 10:00              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
author_ids: [alexej_sevas]       # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesen Namen geben.
categories: [Softwareentwicklung]     # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Python, OpenCV]   # Bitte auf Großschreibung achten.
---


Python ist eine populäre Programmiersprache, die vor allem in Bereich Machine Learning zum Einsatz kommt.
Ein großer Vorteil von Python ist, dass es eine umfangreiche Sammlung von Open-Source-Bibliotheken wie NumPy, TensorFlow, OpenCV gibt.
Dieser Artikel gibt Einblick auf einige Möglichkeiten der Bibliothek OpenCV.

# OpenCV-Bibliothek
Ursprünglich von Intel entwickelt, ist OpenCV heute eine der am weitesten verbreiteten Bibliotheken in Bereich Computer Vision.
OpenCV bietet eine breite Palette von Funktionen und Algorithmen zur Verarbeitung und Analyse von Bildern und Videos.
Es enthält Module für grundlegende Operationen wie das Lesen und Schreiben von Bildern, das Ändern der Bildgröße,
das Zeichnen von Formen und das Anwenden von Filtern.
Darüber hinaus bietet OpenCV fortgeschrittenere Funktionen wie das Erkennen von Gesichtern, das Verfolgen von Objekten, 
das Extrahieren von Merkmalen, das Messen von Abständen und das Durchführen von Kamera-Kalibrierung.
OpenCV ist in C++ geschrieben, bietet aber auch Schnittstellen für viele andere Programmiersprachen wie Python und Java.
Dadurch ist es einfach, OpenCV in verschiedene Projekte und Anwendungen zu integrieren.

# Python-Projekt mit OpenCV aufsetzen
Wir wollen eine einfache Slideshow aus mehreren Bildern mithilfe der OpenCV-Bibliothek erstellen.
Diese Slideshow soll aus zwei Bildern eine Videodatei erstellen, die ähnliche Effekte verwendet wie es bei Powerpoint der Fall ist.

Um die OpenCV-Bibliothek verwenden zu können, müssen wir diese erstmal installieren.
Das geht zum Beispiel mit dem Paketverwaltungsprogramm für Python Pip und dem Befehl:

```powershell
pip install opencv-python
```

Mit dem Schritt installieren wie die aktuellste Version von OpenCV, zum 10.07.2023 ist das die Version 4.8.0.74.

# Wie ein Video aus dem Bild erstellt wird
Wir werden erstmal damit anfangen, dass wir ein Bild mit OpenCV einlesen und es danach anzeigen.
Das Bild muss in diesem Fall innerhalb des Projektverzeichnisses in dem Ordner "images" liegen und "image1.jpg" heißen.
Jetzt erstellen wir ein Python Script File und nennen es zum Beispiel "Slideshow.py".

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

Hier verwenden wir die Funktion `cv2.imread()`, um das Bild einzulesen, und die Funktion `cv2.VideoWriter()` mit dem folgenden
Parameter `(const String &filename, int fourcc, double fps, Size frameSize, bool isColor=true)`,
um eine Videodatei mit dem Namen "Slideshow.mp4" aus diesem Bild zu erstellen. Als Videocodec
wird in diesem Beispiel "mp4" genommen, die fps (Frames per Second) setzen wir auf 1, frameSize setzen wird auf die Breite und 
Länge von dem Bild "image1".
Die Liste der möglichen Videocodecs findet man unter [https://learn.microsoft.com/en-us/windows/win32/medfound/video-fourccs](https://learn.microsoft.com/en-us/windows/win32/medfound/video-fourccs).
Eine weitere Funktion von OpenCV, die wir verwenden, ist `video.write()`, die ein Bild zu dem Video hinzufügt.

# Video mit einem "Verblassen"-Effekt
In der OpenCV-Bibliothek gibt es viele Möglichkeiten, ein Bild zu verändern.
Zum Beispiel es ist möglich, ein Bild auszublenden und ein anderes Bild anzuzeigen.
Dieser Effekt heißt in Powerpoint "Verblassen".
Dafür eignet sich die Funktion `addWeighted(src1, alpha, src2, beta, gamma[, dst[, dtype]])` von OpenCV.
`src1` ist das erste Bild, `src2` ist das zweite Bild.
`alpha` ist der Transparenzwert für das erste Bild,
`beta` ist der Transparenzwert für das zweite Bild.
`gamma` ist eine Konstante, die zu dem Transparenzindex beider Bilder hinzugefügt werden kann, wir setzen sie auf 0.
Je kleiner `alpha` bzw. `beta` ist, desto durchsichtiger ist das entsprechende Bild, wobei die möglichen Werte von 0 bis 1 liegen.
Als nächstes schreiben wir eine Methode, die das erste Bild schrittweise ausblendet und dafür das zweite Bild einblendet.
Sehr wichtig ist, dass die beiden Bilder die gleiche Größe haben, sonst kommt eine Fehlermeldung beim Ausführen des Programms.
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

steps = [0, 0.5, 1]
for step in steps:
    img_changed = verblassen(img1, img2, step)
    video.write(img_changed)
    cv2.waitKey(200)

cv2.destroyAllWindows()
```

Wir haben die Funktion `verblassen()` geschrieben, die je größer der `index`-Parameter ist, das erste Bild verblassen lässt und
das zweite dafür sichtbarer macht. 
Das Bild, das daraus entsteht, wird zum Video hinzugefügt.
Hier setzen wir mit `cv2.waitKey(200)` die Verzögerung beim Wechsel der Bilder auf 200 Millisekunden, um den Bilderübergang langsamer zu machen.
Die Funktion rufen wir 3 Mal auf, um das Ergebnis der Umwandlung der Bilder besser zu sehen.

![VerblassenEffekt](/assets/images/posts/python-bildverarbeitung/verblassenEffekt.gif)

# Video mit einem "Blur"-Effekt
Um das Bild zu blurren, werden wir die Funktion `cv2.blur(src, ksize[, dst[, anchor[, borderType]]])` verwenden.
Die `blur()`-Funktion ermöglicht es, ein Bild zu verwischen oder zu glätten. Sie wird verwendet, um störende Details zu reduzieren oder Rauschen zu entfernen, indem die Pixelwerte im Bild verwischt werden.
Die Funktion `blur()` akzeptiert zwei Parameter: das Eingangsbild `(src)` und die Größe des Kernel-Fensters `(ksize)`, das angibt, wie stark das Bild verwischt werden soll.
Als nächstes schreiben wir die Funktion, die das Bild unschärfer macht.
Anschließend rufen wir die Funktion drei Mal mit jeweils größeren Parameter auf, um die Schärfe des Bildes zu reduzieren und so einen "Blur"-Effekt zu erreichen.

```python
def bluren(img, video, ksize):
    blurred = cv2.blur(img, (ksize))
    video.write(blurred)

kernelSizes = [(3, 3), (6, 6), (9, 9)]
for (kX, kY) in kernelSizes:
    bluren(img1, video, (kX, kY))
```

![BlurEffekt](/assets/images/posts/python-bildverarbeitung/blurEffekt.gif)

# Fazit

Wir haben gesehen, wie einfach es mit Python und der OpenCV-Bibliothek ist, aus mehreren Bildern ein Video zu erstellen.
Ebenfalls haben wir zwei Videoeffekte mit nur ein paar Zeilen Code implementiert.
Die OpenCV-Bibliothek bietet neben den gezeigten Funktionen noch sehr viele weitere Möglichkeiten für die Bild- und Videobearbeitung.
