---
layout: [post, post-xml]
title:  "Konvertierung einer REST API zu einer SOAP Schnittstelle mithilfe von Kong"
date:   2021-04-12 14:45
author: DanielKraft
categories: [Softwareentwicklung]
tags: [Kong, SOAP, REST, Lua]
---

Welche Möglichkeiten hat man, wenn neben einer REST API auch eine SOAP Schnittstelle zur Verfügung stehen soll?
Man könnte beide Schnittstellen getrennt voneinander implementieren.
Aber dadurch kann es passieren, dass sich die Schnittstellen unterschiedlich verhalten.
In diesem Artikel stelle ich eine weitere Methode vor wie man dieses Problem mithilfe von Kong umgehen kann.

# Motivation
Wie bereist beschrieben kann es manchmal gewollt sein, dass eine Schnittstelle über REST und SOAP erreichbar ist.
Hier stellt sich nun die Frage wie man diese Anforderung realisiert.

Eine intuitive Herangehensweise wäre es für den Service die zwei Schnittstellen getrennt zu implementieren.
Diese Lösung hat allerdings den Nachteil, dass die Schnittstellen sich durch die getrennte Implementierung unterschiedlich verhalten könnten.
Außerdem müssen bei einer Änderung des Service beide Schnittstellen verändert werden.
Damit ist zusätzlicher Arbeitsaufwand verbunden.

Um die Probleme zu vermeiden, könnte man für den Service nur eine Schnittstelle implementieren.
Zum Beispiel eine REST API, da diese heutzutage häufig verwendet wird.
Die SOAP Schnittstelle hingegen könnte man aus der REST API generieren.

# Vorstellung der Architektur
Für die Realisierung beider Schnittstellen wird eine [Kong API Gateway](https://konghq.com/kong/) Instanz mit dem Kong Plugin [soap2rest](https://github.com/adessoAG/kong-plugin-soap2rest) sowie ein REST Service benötigt.

![Architektur Skizze](/assets/images/posts/Konvertierung-einer-REST-API-zu-einer-SOAP-Schnittstelle-mithilfe-von-Kong/Architektur.png)

Die Abbildung zeigt wie die einzelnen Komponenten miteinander verknüpft sind.
Das Kong API Gateway verwaltet den Zugriff auf den REST Service.
Für den Fall, dass der Nutzer eine Anfrage über die REST Schnittstelle stellt, wird diese Anfrage an den Service weitergeleitet und bearbeitet.

Für die Verarbeitung von SOAP Anfragen wird das Kong Plugin soap2rest verwendet.
Das Plugin benötigt zur Konfiguration zwei Dateien.
Damit das Plugin die SOAP Anfragen richtig verarbeiten kann, benötigt es die WSDL der SOAP Schnittstelle.
Um die Konvertierung von SOAP zu REST Anfragen korrekt durchzuführen, wird zusätzlich die OpenAPI Spezifikation der REST API benötigt.

# Funktionsablauf des Plugins

![Funktionsablauf des Plugins](/assets/images/posts/Konvertierung-einer-REST-API-zu-einer-SOAP-Schnittstelle-mithilfe-von-Kong/Ablauf.png)

Diese Abbildung zeigt den Fall, dass der Nutzer eine Anfrage über die SOAP Schnittstelle stellt.
Sobald Kong eine Anfrage über die Route der SOAP Schnittstelle registriert, wird das Plugin soap2rest ausgeführt.
Das Plugin konvertiert die Anfrage in eine gültige REST Anfrage und sendet diese an den REST Service.
Nachdem der REST Service geantwortet hat, wird die Antwort in eine gültige SOAP Antwort übersetzt und an den Nutzer zurückgegeben.

Anhand des folgenden Beispiels lässt sich der Ablauf näher verdeutlichen.
Angenommen die nutzende Person stellt an die SOAP Schnittstelle folgende Anfrage.

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
In diesem Fall entspricht die Anfrage dem Pfad `http://localhost:8000/v2/pet/1`.

Nachdem das Plugin die generierte Anfrage an die REST API gestellt hat, bekommt es folgende Antwort:

```json
{
  "id": 1,
  "name": "doggie",
  "photoUrls": [],
  "tags": [],
  "status": "available"
}
```

Anschließend wird diese Antwort vom Plugin in gültiges XML umgewandelt und in eine SOAP Antwort eingesetzt.
Diese Antwort wird der nutzenden Person zurückgegeben.

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
Sie wird nur einmal vor der ersten Anfrage an die SOAP Schnittstelle ausgeführt, um die Schnittstelle zu konfigurieren.
Anschließend wird diese Konfiguration für Verarbeitung aller folgenden Anfragen verwendet.

Bei der Analyse der WSDL werden wichtige Merkmale der SOAP Schnittstelle ausgelesen.
Dazu gehören zum Beispiel das Auslesen der verschiedenen Operationen und ihrer zugehörigen Rückgabetypen und Faults.
Es wird besonders die Struktur der Rückgabetypen betrachtet, damit das Plugin später gültige SOAP Antworten generieren kann.

Nachdem die WSDL analysiert wurde, wird die Konfiguration des Plugins mit der OpenAPI Spezifikation der REST API vervollständigt.
Dabei werden den SOAP Operationen die passenden Pfade der REST API zugeordnet.
Außerdem wird jeder Operation die passenden Content-Types zugeordnet.
Damit die HTTP-Header bei der Weiterleitung der Anfragen an die REST API korrekt gesetzt werden können.

## Request und Response Konvertierung
Bei der Konvertierung von eingehenden SOAP Anfragen, werden diese in den meisten Fällen direkt von XML in JSON überführt.
Manchmal müssen davor aber noch andere Verarbeitungsschritte durchgeführt werden.
Zum Beispiel werden sämtliche SOAP-Header in HTTP-Header überführt.
Außerdem werden Dateiuploads in Multipart Bodys überführt und den Dateien wird mithilfe einer Mime Type Analyse der richtige Content-Type zugeordnet.

Auch bei der Konvertierung der REST Antworten werden verschiedene Zwischenschritte benötigt.
Wenn die REST API nicht den Statuscode 200 zurückgibt, wird die Antwort in eine gültiges SOAP Fault umgewandelt.

Bei der Umwandlung der Antwort in XML wird besonders darauf geachtet, dass die Reihenfolge der Attribute des Rückgabetyps mit der Reihenfolge in der WSDL übereinstimmen.
Dafür wird die automatisch generierte Konfiguration des Plugins verwendet.

# Auswirkungen auf die Verfügbarkeit


# Fazit

