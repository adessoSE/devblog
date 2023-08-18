---
layout: [post, post-xml]              # Pflichtfeld. Nicht ändern!
title:  "API Spezifikationen mit OpenAPI Style Validator prüfen"         # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2023-06-23 11:35              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2023-06-23 11:35             # Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author_ids: [claudioaltamura]       # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesen Namen geben.
categories: [Softwareentwicklung]     # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [API, OPENAPI, JAVA]   # Bitte auf Großschreibung achten.
---

APIs und deren Spezifikationen sind dann verständlicher, wenn diese Beschreibungen, Beispiele und Namenskonventionen nutzen.
Genau hier hilft der OpenAPI Style Validator.
Das Tool kann als Bibliothek im Java-Code oder mithilfe eines Maven-Plug-ins in einer CI/CD-Pipeline genutzt werden.

# Das Problem mit API-Beschreibungen
Häufig sind Spezifikationen nicht klar und präzise. So fehlen neben aussagekräftigen Beschreibungen eben auch Beispiele, die den Einsatz verdeutlichen. 
Hier kann der OpenAPI Style Validator [1] helfen, genau solche Schwächen in OpenAPI-Spezifikationen zu finden. 
Mit definierten Regeln wird beschrieben, wie Elemente einer API-Spezifikation auszusehen haben.
So kann das Werkzeug automatisiert Spezifikationen prüfen. 
Bei einer Nutzung in einer Build-Pipeline können sogar Regelverstöße zum Build Break führen.

# Vollständige Beschreibungen 
Für die nähere Erläuterung der Vorteile, die der OpenAPI Validator mitbringt, nehmen wir das beliebte Petstore-Beispiel [2]. 

Eine OpenAPI-Beschreibung beginnt ja bekanntlich mit dem Info-Objekt und den dazugehörigen Contact- und License-Objekten (siehe Listing 1). 
An dieser Stelle finden wir oft schon die ersten Regelverstöße. 
Beim Info-Object wird der Titel und die Beschreibung vernachlässigt, Kontakt- oder Lizenzinformationen fehlen meistens komplett.

```json
{
    "info": {
        "version": "1.0.0",
        "title": "Swagger Petstore",
        "description": "A sample API that uses a petstore as an example to demonstrate features in the OpenAPI 3.0 specification",
        "termsOfService": "http://swagger.io/terms/",
        "contact": {
            "name": "Swagger API Team",
            "email": "apiteam@swagger.io",
            "url": "http://swagger.io"
        },
        "license": {
            "name": "Apache 2.0",
            "url": "https://www.apache.org/licenses/LICENSE-2.0.html"
        }
    }
…
}
```
Listing 1: Info Object

Aber die meisten Regelverstöße sind auf Ebene der Path bzw. Operation Objects. 
Diese Objekte hängen unter dem Paths Object. 
Das Paths-Objekt beinhaltet alle Pfade zu den existieren Endpunkten (Path Items). Ein einzelner Path (z.B. /pets GET)
enthält dann die Operationen, also den erlaubten Methoden.


```json
{
…
"/pets/{id}": {
        "get": {
            "description": "Returns a user based on a single ID, if the user does not have access to the pet",
            "operationId": "find pet by id",
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "ID of pet to fetch",
                    "required": true,
                    "schema": {
                        "type": "integer",
                        "format": "int64"
                    }
                }
            ],
     …
        }
    }
…
}
```
Listing 2: Das Operation Object GET

Das Tool kann hier erkennen, ob bestimmte Properties existieren und gefüllt sind. 
Im Listing 2 fehlz z.B. das Property „summary“. 
Dafür ist eine "description" vorhanden.

Nächster interessanter Abschnitt in Reviews sind im Allgemeinen die Datentypen.
Datentypen sind in der OpenAPI-Spezifikation als Schema-Objekte definiert, die dann in Requests oder Responses referenziert werden
(z.B. $ref": "#/components/schemas/NewPet).
So prüft der Validator bei Schema Objekten, ob alle Schema-Properties vorhanden und nicht leer sind.

Wenn wir uns aus dem Petstore-Beispiel NewPet im Listing 3 anschauen, dann fällt auf, dass keine Beschreibungen und Beispiele vorhanden sind. Descriptions und Examples sind meiner Meinung nach ein zentrales Element, um API-Dokumentationen verständlicher zu machen und APIs zu erlernen.

```json
{
…
"NewPet": {
        "type": "object",
        "required": [
            "name"
        ],
        "properties": {
            "name": {
                "type": "string"
            },
            "tag": {
                "type": "string"
            }
        }
    },
…
}
```
Listing 3: Das Schema Object NewPet

# Namenskonventionen
Schauen wir uns nun die Konventionen an. 
Namenskonventionen sind meines Erachtens bei API-Richtlinien ebenfalls ein wichtiger Bestandteil. 
Denn mit solchen Richtlinien soll die Zusammenarbeit, Stabilität und Erweiterungen von APIs gewährleistet werden.

OpenAPI Style Validator unterstützt eine Reihe von verschiedenen Namenskonventionen, die wir für Pfade, Parameter, Header oder Properties verwenden können. 
Ich rede hier z.B. von underscore_Case, camelCase oder Kebab-Case.
Über Optionen wie
- pathNamingConvention,
- parameterNamingConvention,
- pathParamNamingConvention,
- queryParamNamingConvention,

können wir bestimmen, wie beispielweise ein Path auszusehen hat. Unter [1] sind alle Optionen genannt.

# Aufruf
Für Maven kann ein Plug-in konfiguriert werden:

```xml
…
<plugin>
    <groupId>org.openapitools.openapistylevalidator</groupId>
    <artifactId>openapi-style-validator-maven-plugin</artifactId>
    <version>1.9</version>
    <configuration>
        <inputFile>petstore-expanded.json</inputFile>
        <validateOperationTag>false</validateOperationTag>
    </configuration>
    <dependencies>
        <dependency>
            <groupId>org.openapitools.empoa</groupId>
            <artifactId>empoa-swagger-core</artifactId>
            <version>2.1.0</version>
            <exclusions>
                <exclusion>
                    <groupId>io.swagger.core.v3</groupId>
                    <artifactId>swagger-models</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
    </dependencies>
</plugin>
…
```
Listing 4: Konfiguration des Maven Plugins in der pom.xml

Jede Option kann als Parameter unter <configuration> als XML-Tag hinzugefügt werden. Stellen wir uns folgenden hypothetischen Fall vor. Wir haben eine kleine OpenAPI-Beschreibungen und möchte hier auf den Operation Tag verzichten. Dann können wir, wie in Listing 4 gezeigt, die Validierung mit der Option "validateOperationTag" und  "false" als Content ausschalten. Schließlich kann der Validator mit folgendem Befehl ausgeführt werden:

```
mvn openapi-style-validator:validate
```

Mit dieer Konfiguration erhalten wir für das Petstore-Beispiel ein schön demonstratives Prüfergebnis, das aufgrund von Regelverstößen zum Build Break führt: 

```
[INFO] --- openapi-style-validator:1.9:validate (default-cli) @ openapi-style-validator-example ---
[INFO] Validating spec: petstore-expanded.json
[ERROR] OpenAPI Specification does not meet the requirements. Issues:

[ERROR]         *ERROR* in Operation GET /pets 'summary' -> This field should be present and not empty
[ERROR]         *ERROR* in Operation POST /pets 'summary' -> This field should be present and not empty
[ERROR]         *ERROR* in Operation GET /pets/{id} 'summary' -> This field should be present and not empty
[ERROR]         *ERROR* in Operation DELETE /pets/{id} 'summary' -> This field should be present and not empty
[ERROR]         *ERROR* in Model 'NewPet', property 'name', field 'example' -> This field should be present and not empty
[ERROR]         *ERROR* in Model 'NewPet', property 'name', field 'description' -> This field should be present and not empty
[ERROR]         *ERROR* in Model 'NewPet', property 'tag', field 'example' -> This field should be present and not empty
[ERROR]         *ERROR* in Model 'NewPet', property 'tag', field 'description' -> This field should be present and not empty
[ERROR]         *ERROR* in Model 'Error', property 'code', field 'example' -> This field should be present and not empty
[ERROR]         *ERROR* in Model 'Error', property 'code', field 'description' -> This field should be present and not empty
[ERROR]         *ERROR* in Model 'Error', property 'message', field 'example' -> This field should be present and not empty
[ERROR]         *ERROR* in Model 'Error', property 'message', field 'description' -> This field should be present and not empty
[INFO] ------------------------------------------------------------------------
[INFO] BUILD FAILURE
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  2.067 s
```

# Fazit
Der OpenAPI Style Validator findet unvollständige Beschreibungen und inkonsistente Nutzung von Namenskonventionen. 
Das Werkzeug ist eine Hilfe bei der Umsetzung von API-Richtlinien. Mit definierten Regeln kann API-Spezifikationen ein einheitliches "Look and Feel" gegeben werden.

# Quellen
[1] OpenAPI Style Validator https://github.com/OpenAPITools/openapi-style-validator

[2] Petstore-Beispiel https://github.com/OAI/OpenAPI-Specification/blob/main/examples/v3.0/petstore-expanded.json

[3] OpenAPI Style Validator Maven Plugin https://central.sonatype.com/artifact/org.openapitools.openapistylevalidator/openapi-style-validator-maven-plugin/1.8