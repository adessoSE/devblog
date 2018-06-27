---
layout:         [post, post-xml]
title:          "Wicked-Charts - Javascript Charts mit Wicket"
date:           2018-06-20 10:20
modified_date:
author:         maximAtanasov
categories:     [Java]
tags:           [Java, Wicket]
---

Bei der Entwicklung einer Anwendung mit dem Apache Wicket Framework stellt das Visualisieren verschiedener Daten mit klassischen Methoden eine große Herausforderung dar. Die Verwendung von Wicked-Charts ermöglicht es schöne und interaktive JavaScript-Charts in eine entsprechende Anwendung zu integrieren. In diesem Artikel wird dazu beispielhaft gezeigt, wie ein einfaches Liniendiagramm konfiguriert wird.

## Eine kurze Einführung in Wicked-Charts

Wicked-Charts ist ein Java-Wrapper für die beiden JavaScript Frameworks Chart.js und Highcharts.
Zu beachten ist, dass Highcharts keine kostenlose Lizenz verwendet.
Die Bibliothek enthält Module für alle aktuellen Versionen von Apache Wicket sowie für das JSF Framework.
Die kostenlose Chart.js-Bibliothek ist jedoch nur in Wicket verfügbar.

Für das Erstellen und Verwenden eines Elements auf einer Webseite mit Wicket wird neben 
dem entsprechenden HTML-Element noch die in Java geschriebene Wicket-Komponente benötigt.
Die Komponente, mit der ein Diagramm in Wicked-Charts dargestellt wird, heißt `Chart`. Der Konstruktor von
dieser Komponente benötigt einen `String` - der Wicket-ID für das Diagramm und ein weiteres Objekt namens `ChartConfiguration`.
Dies ist das Objekt, das verwendet wird, um die verschiedenen Optionen von einem Diagramm zu konfigurieren, wie z. B.
die Art des Diagramms und die zu visualisierenden Daten.

## Erstellung eines einfachen Liniendiagramms

Die richtigen Gradle/Maven-Koordinaten für Wicked-Charts sind im GitHub-Repository des Projekts zu finden: 
[GitHub](https://github.com/adessoAG/wicked-charts) 

Konfigurieren des Diagramms.
Es wird erst ein `ChartConfiguration` Objekt benötigt.
```java
ChartConfiguration chartConfiguration = new ChartConfiguration();
chartConfiguration.setType(ChartType.LINE);
```

Außerdem wird ein Data-Objekt benötigt, welches die Labels (Achsenbeschriftungen) und Datensätze enthält.
```java
Data data = new Data().setLabels(TextLabel.of("January", "February", "March", "April", "May", "June", "July"));
```

Das Datenobjekt braucht auch einen Datensatz
```java
Dataset dataset1 = new Dataset()
    .setLabel("My first dataset")  //Ein Label für den Datensatz
    .setBackgroundColor(SimpleColor.BLUE) //Es eine Farbe aus dem SimpleColor Enum gewählt werden. Dieses Enum enthält einige der am häufigsten verwendeten Farben.
    .setBorderColor(new RgbaColor(54, 162, 235, 255)) //Es kann auch eine eigene Farbe mit den Klassen RgbaColor/HexColor definiert werden.
    .setData(IntegerValue.of(6,7,9,2,9,1,3)) //Hier werden die eigentlichen Datenpunkte gesetzt.
    .setFill(false);

data.setDatasets(Arrays.asList(dataset1));
chartConfiguration.setData(data);
```

Nun müssen die Optionen für das Liniendiagramm erstellen werden.
```java
Options options = new Options()
        .setResponsive(true)
        .setTitle(new Title()
                .setDisplay(true)
                .setText("Chart.js Line Chart")) //Der Titel des Diagramms.
        .setTooltips(new Tooltips() //Tooltips werden erstellt (Diese werden beim Überfahren eines Datenpunktes angezeigt)
                .setMode(TooltipMode.INDEX)
                .setIntersect(false))
        .setHover(new Hover()
                .setMode(HoverMode.NEAREST)
                .setIntersect(true))
        .setScales(new Scales()
                .setXAxes(new AxesScale() //Konfigurieren der X-Achse
                        .setDisplay(true)
                        .setScaleLabel(new ScaleLabel()
                                .setDisplay(true)
                                .setLabelString("Month")))
                .setYAxes(new AxesScale() //Und die Y-Achse
                        .setTicks(new Ticks()
                                .setMax(10) //Die Achse zeigt nur Werte im Bereich 0-10
                                .setMin(0))
                        .setDisplay(true)
                        .setScaleLabel(new ScaleLabel()
                                .setDisplay(true)
                                .setLabelString("Value"))));

chartConfiguration.setOptions(options);
```

Das Diagramm muss noch auf die Wicked Page gesetzt werden.
```java
Chart chart = new Chart("chart", chartConfiguration);
add(chart);
```

Das HTML für das Diagramm sieht so aus:

```html
<div style="width: 75%">
    <canvas wicket:id="chart"></canvas>
</div>
```
Das Diagramm sollte so aussehen:

 ![](/assets/images/posts/wicked-charts/LineChart.png)

Eine Wicket-Anwedung, die dieses minimales Beispiel umsetzt ist hier zu finden: [GitHub](https://github.com/maximAtanasov/wicked-charts-example) 

## Was Wicked-Charts noch kann

Neben Liniendiagrammen unterstützt Wicked-Charts auch viele weitere Diagrammtypen und Variationen, wie beispielsweise die folgenden:
 
 Ein Diagramm mit Datensätzen auf mehreren Achsen
 
 ![](/assets/images/posts/wicked-charts/barMultiAxis.png)
 
 Oder eine Kombination aus Balken- und Liniendiagramm:
 
 ![](/assets/images/posts/wicked-charts/comboBar.png)

Die bibliothek unterstützt auch folgedene Diagrammtypen:

- Balkendiagramme
- Radardiagramme
- Streudiagramme
- Tortendiagramme
- Doughnut Diagramme
- Polargebietskarten
- Blasendiagramme

Alle diese Diagramme haben auch viele Variationen mit verschiedenen Einstellungen und Funktionen.
Es können z. B. gestapelte Diagramme, verschiedene Füllmodi und verschiedene Punkt- oder Linienstile, sowie
benutzerdefinierte Funktionen eingefügt werden.

Die Wicked-Charts-Showcase Anwendung enthält praktische Code-Samples zum Durchblättern und kann aus dem Wicked-Charts-Repository heruntergeladen oder [hier](https://wicked-charts-showcase.appspot.com) angesehen werden. 
