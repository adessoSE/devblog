---
layout:         [post, post-xml]
title:          "Wicked Charts - JavaScript Charts mit Apache Wicket"
date:           2018-07-16 08:50
modified_date:  2021-03-08 14:50
author_ids: [maximAtanasov]
categories:     [Softwareentwicklung]
tags:           [Java, Wicket]
---

Bei der Entwicklung einer Anwendung mit einem serverseitigen Webframework stellt die 
benutzerfreundliche und interaktive Visualisierung von Daten eine Herausforderung dar. 
Die Verwendung von Wicked Charts - einer bei adesso entwickelten Open Source Java-Bibliothek - ermöglicht es, schöne und interaktive JavaScript-Charts in eine serverseitige Webanwendung zu integrieren. 
In diesem Artikel wird dazu beispielhaft gezeigt, wie ein einfaches Liniendiagramm konfiguriert wird.

## Wofür brauchen wir Wicked Charts?

Bei der Entwicklung einer serverseitigen Webanwendung möchten wir eigentlich die volle Kontrolle über die UI-Komponenten
im serverseitigen Code haben - ansonsten müssen wir neben dem serverseitigen Framework noch ein clientseitiges JavaScript Framework einsetzen. Die Java-Library Wicked Charts ermöglicht es, Diagramme im Java-Code zu konfigurieren und sie mit Daten zu versorgen,
ohne JavaScript-Code zu schreiben oder die Besonderheiten der jeweiligen JavaScript-Bibliothek im Detail zu kennen. 
Dies ermöglicht eine ungestreute Codebasis, die leichter zu lesen, verstehen und modifizieren ist.

## Überblick über Wicked Charts

[Wicked Charts](https://github.com/adessoAG/wicked-charts) ist ein Java-Wrapper für die beiden JavaScript Bibliotheken [Chart.js](http://www.chartjs.org/) und [Highcharts](https://www.highcharts.com/).
Es wurde ursprünglich als Wrapper für die Highcharts Bibliothek entwickelt 
und wegen dem Lizenzmodell von Highcharts auch um Chart.js erweitert, und unterstützt die meisten Features der JavaScript-Bibliotheken
Die Bibliothek enthält Module für alle aktuellen Versionen von Apache Wicket sowie für das JSF Framework. Darüberhinaus kann der Java-Wrapper auch direkt genutzt werden, um JavaScript-Charts aus anderen serverseitige Webframeworks heraus zu erzeugen.

## Wicked Charts am Beispiel: Ein Liniendiagramm

Als anschauliches Beispiel erstellen wir im Folgenden ein Liniendiagramm mit Wicked Charts.

### Einbindung über Maven
Zunächst müssen wir Wicked Charts in unsere Anwendung einbinden. Dies sind die dazu notwendigen Maven-Koordinaten:

```xml
<dependency>
  <groupId>de.adesso.wicked-charts</groupId>
  <artifactId>wicked-charts-wicket7</artifactId>
  <version>3.0.0</version>
  <type>pom</type>
</dependency>
```

Eine Wicket-Anwedung, die folgendes minimales Beispiel umsetzt ist hier zu finden: [GitHub](https://github.com/maximAtanasov/wicked-charts-example). 

Zum Starten der Anwendung einfach `./gradlew bootRun` im Hauptverzeichnis ausführen und dann die URL `localhost:8080` in einem Browser öffnen.

### Konfiguration des Diagramms

Der hier beschriebene Java Code zur Konfiguration des Diagramms ist in der Datei `Homepage.java` Datei in der Beispiel-Anwendung zu finden.

Zur Konfiguration eines Charts.js - Diagramms erzeugen wir ein Objekt der Klasse `ChartConfiguration` wie folgt:

```java
ChartConfiguration chartConfiguration = new ChartConfiguration();
chartConfiguration.setType(ChartType.LINE);
```

Die Achsenbeschriftungen und Datensätze geben wir über ein `Data`-Objekt mit:

```java
Data data = new Data().setLabels(TextLabel.of("January", "February", "March", "April", "May", "June", "July"));
```

Die eigentlichen Datensätze geben wir mit, indem wir ein `Dataset` erzeugen:

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

Damit das Diagramm auch so aussieht, wie wir es uns vorstellen, können wir über ein `Options`-Objekt noch jede Menge Einstellungen definieren, die das Look & Feel beeinflussen:

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

### Einbindung des Diagramms in eine Wicket-Komponente

Die `ChartConfiguration` definiert nun die Daten und das Aussehen unseres Diagramms und soll nun in einer Wicket-Webanwendung dargestellt werden. Hierzu nutzen wir die von Wicked Charts bereitgestellte `Chart`-Komponente, die wir in der Seite `Homepage.java` mittels `add()` hinzufügen:

```java
Chart chart = new Chart("chart", chartConfiguration);
add(chart);
```

Das HTML für die Homepage-Seite befindet sich in der Datei `Homepage.html` und sieht so aus:

```html
<div style="width: 75%">
    <canvas wicket:id="chart"></canvas>
</div>
```

### Das fertige Diagramm

Das oben konfigurierte Diagramm sollte in der laufenden Webanwendung dann so aussehen:

 ![](/assets/images/posts/wicked-charts/LineChart.png)

## Was Wicked Charts noch kann

Was die Konfiguration von Diagrammen angeht unterstützt Wicked Charts fast alle Features, die auch von den JavaScript-Bibliotheken angeboten werden. So können zum Beispiel mehrere Y-Achsen definiert werden, wie in diesem Beispiel:
 
 ![](/assets/images/posts/wicked-charts/barMultiAxis.png)
 
 Oder wir können verschiedene Diagrammtypen kombinieren, wie hier z.B. ein Balken- und ein Liniendiagramm:
 
 ![](/assets/images/posts/wicked-charts/comboBar.png)

Die Diagramme haben auch viele Variationen mit verschiedenen Einstellungen und Funktionen.
Es können z. B. gestapelte Diagramme, verschiedene Füllmodi und verschiedene Punkt- oder Linienstile, sowie
benutzerdefinierte Funktionen eingefügt werden.

Die Bibliothek unterstützt auch folgedene Diagrammtypen:

- Balkendiagramme
- Radardiagramme
- Streudiagramme
- Tortendiagramme
- Doughnut Diagramme
- Polargebietskarten
- Blasendiagramme

## Was Wicked Charts nicht kann

Wicked Charts bietet eine Java-Abstraktion über JavaScript-Frameworks. Wie bei jeder Abstraktion geht dabei etwas verloren. So unterstützt Wicked Charts z.B. Funktionen zu begrenzt, die eine Client-Server-Interaktion erfordern. Für die Darstellung statischer Daten mit einigen clientseitigen Interaktions-Features bietet Wicked Charts aber eine gute Möglichkeit.

## Showcase

Die Wicked Charts Showcase Anwendung enthält praktische Code-Samples zum Durchblättern und kann aus dem Wicked Charts-Repository heruntergeladen oder [hier](https://wicked-charts-showcase.appspot.com) angesehen werden. 
