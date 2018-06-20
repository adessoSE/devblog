---
layout:         [post, post-xml]
title:          "Wicked-Charts - Javascript Charts mit Wicket"
date:           2018-06-20 10:20
modified_date:
author:         maximAtanasov
categories:     [Java]
tags:           [Java, Wicket]
---

Haben Sie eine Anwendung, die das Apache Wicket Framework verwendet und Sie müssen Daten visualisieren?
Dann ist Wicked-Charts genau das Richtige für Sie. Es erlaubt Ihnen, auf einfache Weise und
mit wenig Aufwand schöne und interaktive JavaScript-Charts in Ihre Anwendung zu integrieren.
In diesem Artikel werde ich Ihnen zeigen, wie man ein einfaches Liniendiagramm konfiguriert.

## Eine kurze Einführung in Wicked-Charts

Wicked-Charts ist ein Java-Wrapper um zwei verschiedene JavaScript-Frameworks - Chart.js und Highcharts.
Zu beachten ist, dass Highcharts keine kostenlose Lizenz verwendet.
Die Bibliothek enthält Module für alle aktuellen Versionen von Apache Wicket sowie für das JSF Framework.
Die kostenlose Chart.js-Bibliothek ist jedoch nur in Wicket verfügbar.

Wenn Sie Erfahrung mit Apache Wicket haben, dann wissen Sie, dass, um ein Element zu unserer Webseite hinzuzufügen, 
benötigen wir eine in Java geschriebene Wicket-Komponente und ein zusätzliches Markup in unserem HTML, um diese Komponente zu verwenden.
Die Komponente, mit der ein Diagramm in Wicked-Charts dargestellt wird, heißt `Chart`. Der Konstruktor von
dieser Komponente benötigt einen `String` - unsere Wicket-ID für das Diagramm und ein weiteres Objekt namens `ChartConfiguration`.
Dies ist das Objekt, das wir verwenden werden, um die verschiedenen Optionen zu konfigurieren, die unsere Diagramme haben können, wie z. B.
die Art des Diagramms, die zu visualisierenden Daten und viele andere Optionen.

## Lassen Sie uns ein einfaches Liniendiagramm erstellen.

Die richtigen Gradle/Maven-Koordinaten für Wicked-Charts finden Sie im GitHub-Repository des Projekts.

Wir beginnen mit der Konfiguration des Diagramms.
Erstellen Sie ein `ChartConfiguration` Objekt.
```java
ChartConfiguration chartConfiguration = new ChartConfiguration();
```

Wir erstellen nun ein neues `Data` Objekt. Sie enthält unsere Labels und Datensätze. Wir können so viele Datensätze haben, wie wir möchten.
```java
Data data = new Data().setLabels(TextLabel.of("January", "February", "March", "April", "May", "June", "July"));
```

Wir erstellen einen Datensatz und fügen ihn unserem Datenobjekt hinzu.

```java
Dataset dataset1 = new Dataset()
    .setLabel("My First dataset")  //Ein Label für den Datensatz
    .setBackgroundColor(SimpleColor.RED) //Wir wählen eine Farbe aus dem SimpleColor Enum, dieses Enum enthält einige der am häufigsten verwendeten Farben.
    .setBorderColor(new RgbaColor(255, 100, 100, 255) //Sie können aber auch Ihre eigene Farbe mit den Klassen RgbaColor/HexColor definieren.
    .setData(IntegerValue.of(6,7,9,2,9,1,3)) //Hier setzen wir die eigentlichen Datenpunkte.
    .setFill(false);

data.setDatasets(Arrays.asList(dataset1));
chartConfiguration.setData(data);
```

Nun müssen wir die Optionen für unser Liniendiagramm erstellen.
```java
Options options = new Options()
        .setResponsive(true)
        .setTitle(new Title()
                .setDisplay(true)
                .setText("Chart.js Line Chart")) //Der Titel unseres Diagramms.
        .setTooltips(new Tooltips() //Unsere Tooltips (Diese sieht man beim Überfahren eines Datenpunktes)
                .setMode(TooltipMode.INDEX)
                .setIntersect(false))
        .setHover(new Hover()
                .setMode(HoverMode.NEAREST)
                .setIntersect(true))
        .setScales(new Scales()
                .setXAxes(new AxesScale() //Wir konfigurieren die X-Achse
                        .setDisplay(true)
                        .setScaleLabel(new ScaleLabel()
                                .setDisplay(true)
                                .setLabelString("Month")))
                .setYAxes(new AxesScale() //Und die Y-Achse
                        .setDisplay(true)
                        .setScaleLabel(new ScaleLabel()
                                .setDisplay(true)
                                .setLabelString("Value"))));
```

Dann fügen wir diese Optionen zu unserer Chart-Konfiguration hinzu.
```java
chartConfiguration.setOptions(options);
```


Alles, was wir noch tun müssen, ist, unsere Diagramm auf die Wicked Page zu setzen.
```java
Chart chart = new Chart("chart", chartConfiguration);
add(chart);
```

Und wir sind fertig - wir haben jetzt ein Liniendiagramm auf unserer Seite.
So sieht sie aus:
 
 ![](/assets/images/posts/wicked-charts/LineChart.png)

## Was Wicked-Charts noch kann


 Wicked-Charts unterstützt auch viele andere Chart-Typen und Variationen:
 
 Man könnte ein Diagramm mit Datensätzen auf mehreren Achsen haben:
 
 ![](/assets/images/posts/wicked-charts/barMultiAxis.png)
 
 Oder eine Kombination aus Balken- und Liniendiagramm:
 
 ![](/assets/images/posts/wicked-charts/comboBar.png)

Die bibliothek unterstützt auch folgedene Chart-Typen:

- Balkendiagramme
- Radardiagramme
- Streudiagramme
- Tortendiagramme
- Doughnut Diagramme
- Polargebietskarten
- Blasendiagramme

Alle diese Diagramme haben auch viele Variationen mit verschiedenen Einstellungen und Funktionen aktiviert.
Sie können z. B. gestapelte Diagramme, verschiedene Füllmodi und verschiedene Punkt- oder Linienstile haben sowie
benutzerdefinierte Funktionen einfügen.
Um herauszufinden, wie Sie diese Einstellungen in Ihrer Anwendung verwenden können, werfen Sie einen Blick auf die Wicked-Charts-Showcase-Anwendung, die
praktische Code-Samples zum Durchblättern enthält. Es kann aus dem Wicked-Charts-Repository heruntergeladen werden: 
[GitHub](https://github.com/adessoAG/wicked-charts)
