---
layout: [post, post-xml]
title:  "Konvertierung einer REST-API zu einer SOAP-Schnittstelle mithilfe von Kong"
date:   2021-06-18 16:00
modified_date: 2021-06-18 16:00
author: DanielKraft
categories: [Softwareentwicklung]
tags: [Kong, SOAP, REST, Lua]
---

Welche Möglichkeiten haben wir, wenn neben einer REST-API auch eine SOAP-Schnittstelle zur Verfügung stehen soll?
In diesem Artikel wird eine Methode vorgestellt, wie man diese Anforderung mit Hilfe von Kong umsetzen kann.

# Motivation
Wie bereist beschrieben, kann es manchmal gewollt sein, dass eine Schnittstelle über REST und SOAP erreichbar ist.
Hier stellt sich nun die Frage wie man diese Anforderung realisiert.

Eine intuitive Herangehensweise wäre es, für den Service die zwei Schnittstellen getrennt zu implementieren.
Diese Lösung hat allerdings den Nachteil, dass die Schnittstellen sich durch die getrennte Implementierung unterschiedlich verhalten könnten.
Außerdem müssen bei einer Änderung des Service beide Schnittstellen verändert werden, womit zusätzlicher Arbeitsaufwand verbunden wäre.

Um diese Probleme zu vermeiden, könnten wir für den Service nur eine Schnittstelle implementieren, zum Beispiel eine REST-API, da diese heutzutage häufig verwendet wird.
Die SOAP-Schnittstelle hingegen könnten wir anschließend aus der REST-API generieren.

# Vorstellung der Architektur
Für die Realisierung beider Schnittstellen wird ein [Kong API Gateway](https://konghq.com/kong/) mit dem Kong Plugin [soap2rest](https://github.com/adessoAG/kong-plugin-soap2rest) sowie ein REST-Service benötigt.

![Architektur Skizze](/assets/images/posts/Konvertierung-einer-REST-API-zu-einer-SOAP-Schnittstelle-mithilfe-von-Kong/Architektur.png)

Die Abbildung zeigt, wie die einzelnen Komponenten miteinander verknüpft sind.
Das Kong API Gateway verwaltet den Zugriff auf den REST-Service.
Für den Fall, dass wir eine Anfrage über die REST-Schnittstelle stellen, wird diese Anfrage an den Service weitergeleitet und bearbeitet.

Für die Verarbeitung von SOAP-Anfragen wird das Kong Plugin soap2rest verwendet.
Das Plugin benötigt zur Konfiguration zwei Dateien.
Damit das Plugin die SOAP-Anfragen richtig verarbeiten kann, benötigt es die WSDL der SOAP-Schnittstelle.
Und um die Konvertierung von SOAP zu REST Anfragen korrekt durchzuführen, wird zusätzlich die OpenAPI-Spezifikation der REST-API benötigt.

# Funktionsablauf des Plugins
![Funktionsablauf des Plugins](/assets/images/posts/Konvertierung-einer-REST-API-zu-einer-SOAP-Schnittstelle-mithilfe-von-Kong/Ablauf.png)

Diese Abbildung zeigt den Fall, dass eine Anfrage über die SOAP-Schnittstelle gestellt wird.
Sobald Kong eine Anfrage über die Route der SOAP-Schnittstelle registriert, wird das Plugin soap2rest ausgeführt.
Das Plugin konvertiert die Anfrage in eine gültige REST-Anfrage und sendet diese an den REST-Service.
Nachdem der REST-Service geantwortet hat, wird die Antwort in eine gültige SOAP-Antwort übersetzt und zurückgegeben.

Anhand des folgenden Beispiels lässt sich der Ablauf näher verdeutlichen.
Angenommen, folgende Anfrage wird an die SOAP-Schnittstelle gestellt.

```xml
<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope
    xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:tns="http://www.w3.org/2001/XMLSchema">
    <soap:Body>
        <tns:GetPetByPetid_InputMessage>
            <tns:petId>1</tns:petId>
        </tns:GetPetByPetid_InputMessage>
    </soap:Body>
</soap:Envelope>
```

Aus dieser Anfrage lassen sich verschiedene Informationen ableiten.
Zum einen wird mit dieser Anfrage die SOAP-Action `GetPetByPetid` ausgeführt.
Zusätzlich beinhaltet die Anfrage den Parameter `petId` mit dem Wert `1`.
Anhand dieser Informationen kann die Anfrage der passenden REST Anfrage zugeordnet werden.
In diesem Fall entspricht die Anfrage dem Pfad `/pet/1`.

Nachdem das Plugin die generierte Anfrage an die REST-API gestellt hat, bekommt es folgende Antwort:

```json
{
  "id": 1,
  "name": "doggie",
  "photoUrls": [],
  "tags": [],
  "status": "available"
}
```

Anschließend wird diese Antwort vom Plugin in gültiges XML umgewandelt und in eine SOAP-Antwort eingesetzt, welche anschließend zurückgegeben wird.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope
  xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:tns="http://www.w3.org/2001/XMLSchema">
  <soap:Body>
    <tns:GetPetByPetid_OutputMessage>
        <tns:Pet>
            <tns:id>1</tns:id>
            <tns:name>doggie</tns:name>
            <tns:photoUrls></tns:photoUrls>
            <tns:tags></tns:tags>
            <tns:status>available</tns:status>
        </tns:Pet>
    </tns:GetPetByPetid_OutputMessage>
  </soap:Body>
</soap:Envelope>
```

# Besonderheiten des Kong Plugins soap2rest
## Analyse der Schnittstellen-Spezifikationen
Die Analyse der WSDL und der OpenAPI ist ein wichtiger Bestandteil des Plugins.
Sie wird nur einmal vor der ersten Anfrage an die SOAP-Schnittstelle ausgeführt, um die Schnittstelle zu konfigurieren.
Dadurch verzögert sich die Antwort der ersten Anfrage im Durchschnitt um 200 Millisekunden.
Anschließend wird diese Konfiguration für die Verarbeitung aller folgenden Anfragen verwendet.

Bei der Analyse der WSDL werden wichtige Merkmale der SOAP-Schnittstelle ausgelesen.
Dazu gehören zum Beispiel das Auslesen der verschiedenen Operationen und ihrer zugehörigen Rückgabetypen und Faults.
Es wird besonders die Struktur der Rückgabetypen betrachtet, damit das Plugin später gültige SOAP-Antworten generieren kann.

Nachdem die WSDL analysiert wurde, wird die Konfiguration des Plugins mit der OpenAPI-Spezifikation der REST-API vervollständigt.
Dabei werden den SOAP-Operationen die passenden Pfade der REST-API automatisiert zugeordnet.
Außerdem werden jeder Operation die passenden Content-Types zugeordnet, damit die HTTP-Header bei der Weiterleitung der Anfragen an die REST-API korrekt gesetzt werden können.

## Request und Response Konvertierung
Bei der Konvertierung von eingehenden SOAP-Anfragen, werden diese in den meisten Fällen direkt von XML in JSON überführt.
Manchmal müssen davor aber noch andere Verarbeitungsschritte durchgeführt werden.
Zum Beispiel werden sämtliche SOAP-Header in HTTP-Header überführt.
Außerdem werden Dateiuploads in Multipart Bodys überführt und den Dateien wird mit Hilfe einer Mime Type Analyse der richtige Content-Type zugeordnet.

Auch bei der Konvertierung der REST-Antworten werden verschiedene Zwischenschritte benötigt.
Wenn die REST-API nicht den Statuscode 200 zurückgibt, wird die Antwort in ein gültiges SOAP-Fault umgewandelt.

Bei der Umwandlung der Antwort in XML wird besonders darauf geachtet, dass die Reihenfolge der Attribute des Rückgabetyps mit der Reihenfolge in der WSDL übereinstimmen.
Dafür wird die automatisch generierte Konfiguration des Plugins verwendet.

# Auswirkungen auf die Verfügbarkeit
Damit der Einsatz des Plugins sich lohnt, sollte die Verfügbarkeit der Schnittstelle nicht unter dem Einsatz des Plugins leiden.
Um die Auswirkungen des Plugins auf die Verfügbarkeit der Schnittstelle zu testen, wurde ein Performance- und ein Lasttest vorgenommen.

## Durchführung eines Performancetests
Der Performancetest besteht aus vier verschiedenen Anfragen, welche jeweils 10-mal wiederholt wurden.
Zwei der vier Anfragen liefern nur einen HTTP Status Code von 200 und 300 zurück.
Die dritte Anfrage sendet mit einem HTTP POST ein kleines JSON Objekt an die Schnittstelle.
Und die vierte Anfrage versucht die Grenzen der Schnittstelle auszuloten, indem eine Datei an die Schnittstelle gesendet wird.

Die nachfolgende Grafik zeigt links die Ergebnisse des Performancetests auf die REST-API und rechts die Ergebnisse der SOAP-Schnittstelle.

![Vergleich der Anfragezeiten](/assets/images/posts/Konvertierung-einer-REST-API-zu-einer-SOAP-Schnittstelle-mithilfe-von-Kong/Performancetest.png)

Im direkten Vergleich fällt auf, dass die Performance nur beim Senden von Dateien leidet.
Die Performance aller andern Anfragen verändert sich nur geringfügig.

Der Anstieg der Antwortzeit ist darauf zurückzuführen, dass bei SOAP-Anfragen deutlich mehr Daten an die Schnittstelle gesendet werden müssen.

## Durchführung eines Lasttests
Im Gegensatz zum Performancetest wurden die vier Anfragen 250-mal parallel ausgeführt.
Um ein aussagekräftiges Ergebnis zu erhalten wurde dieser 10-mal wiederholt.

Die folgende Grafik zeigt die Ergebnisse des Lasttests.

![Lasttest](/assets/images/posts/Konvertierung-einer-REST-API-zu-einer-SOAP-Schnittstelle-mithilfe-von-Kong/Lasttest.png)

Auf den ersten Blick fällt auf, dass die SOAP-Schnittstelle bei vielen parallelen Anfragen längere Antwortzeiten aufweist, als die REST-API.
Vor allem das Senden von Dateien führt zu einem deutlichen Anstieg der Antwortzeit.
Der Kommunikationsaufwand in Verbindung mit den vielen gleichzeitigen Anfragen auf die Schnittstelle ist für die langsamere Antwortzeit verantwortlich.

# Fazit
Zusammenfassend lässt sich sagen, dass die Nutzung dieses Kong Plugins den Vorteil hat, dass nicht beide Schnittstellen implementiert werden müssen.
Ein Nachteil ist die zusätzliche Wartezeit auf die Antwort der Schnittstelle, da sich hinter jeder SOAP-Anfrage eine Anfrage auf die REST-API verbirgt.
Diese Verzögerung kann allerdings vernachlässigt werden, da erst bei vielen parallelen Anfragen ein deutlich längere Wartezeit entsteht.
Im Großen und Ganzen überwiegen die Vorteile des Plugins die Nachteile.
