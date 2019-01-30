---
layout:         [post, post-xml]              
title:          "Micronaut - Eine Alternative zu Spring"
date:           2019-01-29 10:28
author:         t-buss
categories:     [Softwareentwicklung]
tags:           [microservices, java, micronaut]
---
Ja, richtig gelesen, es gibt Alternativen!
Obwohl der Platzhirsch Spring sich bei Java-Anwendungen großer Beliebtheit erfreut, sollte man nicht vergessen, dass es daneben auch noch andere Frameworks gibt, die einen Blick wert sind.
In diesem Blog-Artikel soll es um Micronaut gehen, ein noch vergleichsweise junges Framework, welches jedoch einige interessante Eigenschaften hat, die es besonders im Cloud-Umfeld zu einem echten Rivalen gegenüber Spring machen.
Wir implementieren in diesem Artikel eine Anwendung einmal mit Spring Boot und einmal mit Micronaut.
Danach vergleichen wir die beiden Ansätze und schauen, wo welches Framework überlegen ist.

Entwickelt wird das [Micronaut-Framework](http://micronaut.io) von [OCI](https://objectcomputing.com/), genauer gesagt unter der Federführung von Graeme Rocher, der schon das Grails Framework ins Leben gerufen hat.
Sowohl die Erfahrungen mit Grails als auch mit Spring sind in Micronaut eingeflossen.
Das Framework beschreibt sich selbst als "modernes, JVM-basiertes Full-Stack-Framework um modulare, einfach zu testende Microservices- und Serverless-Anwendungen zu bauen".
In dieser Beschreibung liegt auch schon der wesentliche Unterschied zum Spring Framework: Es legt den Fokus auf Microservices und Serverless-Anwendung, womit sich JVM-Frameworks aktuell noch eher schwer tun.

# Der kleine Nachteil von Spring
Java-Anwendungen kommen von Haus aus mit einigem Overhead daher.
Die JVM allein benötigt nach [offiziellen Angaben](https://www.java.com/en/download/help/sysreq.xml) bereits etwa 128Mb RAM und 124Mb Festplattenspeicher.
Für traditionelle Anwendungen ist dies voll und ganz vertretbar, bei Docker-Containern in einem Cluster oder gar als FaaS-Instanz sind solche Zahlen aber nicht mehr zeitgemäß.
Zum Vergleich: nicht-triviale Anwendungen in der Programmiersprache Go sind nach der Kompilation oftmals nur 20-30Mb groß.
Eine andere, wichtige Metrik ist die Startzeit einer Anwendung.
Durch den Reflection-Ansatz von Spring sind Startzeiten jenseits der 20 Sekunden keine Seltenheit.
Auch das ist besonders für Serverless-Anwendungen nicht hinnehmbar.

Micronaut geht einen anderen Weg als Spring und kann damit einige der Performance-Einbußen wett machen.
Besonders die Startzeit wird durch die Vermeidung von Reflection ungeheuer verringert, was Java-Entwicklern den Einstieg in die Serverless-Welt eröffnet.
Aber auch der RAM-Verbrauch sinkt.
Wie stark diese Verbesserungen sind, wollen wir uns jetzt einmal in einer einfachen Anwendung anschauen.

# Die Spring-Anwendung
Als Beispiel nehmen wir eine einfache Anwendung für einen Einkaufswagen.
Per HTTP können wir Produkte in den Einkaufswagen ablegen oder wieder löschen.
Wir starten mit der Spring-Boot-Anwendung.
Dazu gehen wir auf [https://start.spring.io/](https://start.spring.io/) und stellen uns zusammen, was wir brauchen: Eine Java 8 Anwendung mit Gradle und Spring Boot 2.1.2.
Die Namen für Group und Artifact sind prinzipiell egal, ich wähle `com.example.myshop` und `shopping-cart`:

![Die Spring Initializer Konfiguration](/assets/images/posts/micronaut/spring-initializer.png "Die Spring Initializer Konfiguration")

Wir erhalten eine Archiv-Datei, die wir irgendwo auf unserem Rechner entpacken können.

## Der Code
Schreiben wir nun die Anwendung.
Wer mit Spring Boot vertraut ist sollte mit diesem Code keine Probleme haben.
Wir beginenn mit einem Controller unter dem Namen `ShoppingCartController.java`:

```java
package com.example.myshop.shoppingcart;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController("/shoppingCart")
public class ShoppingCartController {

    private final ShoppingCartService shoppingCartService;

    public ShoppingCartController(ShoppingCartService shoppingCartService) {
        this.shoppingCartService = shoppingCartService;
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return shoppingCartService.getAllProducts();
    }

    @PostMapping
    public void addProduct(@RequestBody Product product) {
        shoppingCartService.addProduct(product);
    }

    @DeleteMapping
    public Optional<Product> deleteProduct(@RequestBody Product product) {
        return shoppingCartService.deleteProduct(product);
    }
}
```

Als nächstes erstellen wir den Service unter `ShoppingCartService.java`:
```java
package com.example.myshop.shoppingcart;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ShoppingCartService {

    private final ArrayList<Product> products = new ArrayList<>();

    public List<Product> getAllProducts() {
        return products;
    }

    public void addProduct(Product product) {
        products.add(product);
    }

    public Optional<Product> deleteProduct(Product product) {
        Optional<Product> result = products.stream()
                .filter(p -> p.getId().equals(product.getId()))
                .findFirst();
        result.ifPresent(products::remove);
        return result;
    }
}
```
Der Service hält der Einfachheit halber die Liste der Produkte einfach in einer lokalen Liste.
Das POJO für ein Produkt schreiben wir in `Product.java`:
```java
package com.example.myshop.shoppingcart;

public class Product {

    private final Long id;
    private final String description;

    public Product(Long id, String description) {
        this.id = id;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public String getDescription() {
        return description;
    }
}
```

## Befehle
Die Anwendung lässt sich mit folgendem Befehl über die Kommandozeile oder über die IDE starten:
> `$ ./gradlew bootRun`

Zum Erstellen eines Produkts:
> `$ curl -X POST -H "Content-Type: application/json" -d '{"id": 1, "description": "Tricorder"}' http://localhost:8080/shoppingCart`

Zum Abfragen der Liste:
> `$ curl http://localhost:8080/shoppingCart`

Zum Löschen:
> `$ curl -X DELETE -H "Content-Type: application/json" -d '{"id": 1}' http://localhost:8080/shoppingCart`

Wir können eine ausführbare JAR-Datei mit folgendem Befehl generieren:
> `$ ./gradlew bootJar`

## Resourcenverbrauch
Schauen wir uns nun die nackten Zahlen an:
|               | Spring    | Micronaut |
| ------------- | --------  | --------- |
| Compile-Zeit  | 1937ms    | ?         |
| JAR-Größe     | 15,2 MiB  | ?         |
| Startzeit     | ~5s       | ?         |
| RAM-Verbrauch | 289,9 MiB | ?         |

Als Compile-Zeit nehmen wir die Zeit für den Gradle Task `bootJar` nach einem vorherigen `./gradlew clean`.
Die Startzeit beträgt laut Spring-Ausgabe 3,72 Sekunden. Die tatsächliche Startzeit enthält zusätlich noch die Startzeit der JVM, was in Summe in etwa 5 Sekunden resultiert.

# Die Micronaut-Anwendung
Die vorangegangene Anwendung dient uns nun als Vergleichspunkt.
Schauen wir mal, wie sich die Micronaut-Anwendung schlägt.
Anders als bei Spring Boot kommt Micronaut mit einem Kommandozeilen-Tool daher, welches die Erstellung von Projekten übernimmt.
Für die Installation sei auf die offizielle Micronaut-Seite verwiesen: http://micronaut.io/download.html.

Mit dem Tool `mn` können wir nun die Anwendung erstellen:
> `$ mn`

Nun landen wir in einer Shell, wo uns einige Micronaut-spezifische Befehle zur Verfügung stehen (dazu später mehr).
Wir erstellen eine neue Anwendung im aktuellen Verzeichnis mit `create-app`.
Wenn wir dahinter noch `--features=` eingeben und ein mal auf TAB drücken, bekommen wir eine Übersicht über die zusätzlichen Features, die Micronaut mitliefert.
Darunter finden sich auch die JVM-Sprachen Groovy und Kotlin, sowie mehrere Projekte aus dem Netflix-Stack für Microservices.
Für's erste begnügen wir uns mit den Standard-Einstellungen bis auf eine "Kleinigkeit": GraalVM Native Image.
Worum es sich dabei handelt, dazu später mehr.
Wir erstellen das Projekt mit diesem Befehl:
> `mn> create-app --features=graal-native-image com.example.myshop.shoppingcart.shopping-cart-micronaut` 

Mit `exit` können wir die Shell verlassen, um dann in den just erstellten Ordner zu welchseln und dort wieder `mn` auszuführen.
Nun können wir direkt mit der Programmierung anfangen.

## Der Code
Beginnen wir wieder mit dem Controller.
Noch in der Micronaut-Shell geben wir den Befehl zur Erstellung des Controllers ein:
> `mn> create-controller ShoppingCart`

Dies erstellt sowohl den Controller als auch einen dazugehörigen Test und erspart uns etwas Zeit, da wir die Dateien nicht von Hand selbst erstellen müssen.
Und da wir gerade dabei sind erstellen wir die Service-Bean gleich mit:
> `mn> create-bean ShoppingCartService`

Nun an den Code für unseren Controller:
```java
package com.example.myshop.shoppingcart;

import io.micronaut.http.annotation.*;

import java.util.List;
import java.util.Optional;

@Controller("/shoppingCart")
public class ShoppingCartController {

    private final ShoppingCartService shoppingCartService;

    public ShoppingCartController(ShoppingCartService shoppingCartService) {
        this.shoppingCartService = shoppingCartService;
    }

    @Get
    public List<Product> getAllProducts() {
        return shoppingCartService.getAllProducts();
    }

    @Post
    public void addProduct(@Body Product product) {
        shoppingCartService.addProduct(product);
    }

    @Delete
    public Optional<Product> deleteProduct(@Body Product product) {
        return shoppingCartService.deleteProduct(product);
    }
}
```
Kommt einem sehr bekannt vor!
Micronaut will den Entwicklern kein neues Programmiermodell aufzwingen, weshalb der "reine" Java-Code identisch mit dem der Spring-Lösung ist.
Es ändert jedoch einige Namen der Annotationen.
Aus `@RestController` wird `@Controller`, aus `@GetMapping` wird `@Get` usw.
Auch den Service, den wir über das Kommandozeilen-Tool erstellt haben, können wir fast genau so übernehmen.
Aus `@Service` wird hier `@Singleton`, wie wir Template erkennen können, welches wir zuvor durch das Kommandozeilen-Tool erstellt haben.
Der Rest des Java-Codes bleibt hier ebenfalls gleich.

Das Produkt-POJO unterscheidet sich etwas von seinem Spring-Pendant:
```java
    ...
    public Product(@JsonProperty("id") Long id, @JsonProperty("description") String description) {
        this.id = id;
        this.description = description;
    }
    ...
```
Der Konstruktor benötigt in den Argumenten die `@JsonProperty`-Annotation, um eintreffende Daten im JSON-Format richtig mappen zu können.

## Befehle
Die Anwendung lässt sich mit diesem Befehl starten:
> `$ ./gradlew run`

Eine ausführbare JAR-Datei erzeugen wir mit:
> `$ ./gradlew assemble`

Die cURL-Befehle sind identisch mit denen der Spring-Version.

## Resourcenverbrauch
Schauen wir uns die Zahlen der Micronaut-Lösung an und vergleichen sie direkt mit den Zahlen der Spring-Lösung:
|                    | Spring    | Micronaut | Unterschied |
| -------------      | --------  | --------- | ----------- |
| Compile-Zeit       | 1937ms    | 10,5s     | <span style="color: red">  +442%  </span>|
| JAR-Größe          | 15,2 MiB  | 11,3 MiB  | <span style="color: green">-25,6% </span>|
| Startzeit ohne JVM | 3,72s     | 1,39s     | <span style="color: green">-62,6% </span>|
| Startzeit mit JVM  | ~5s       | ~3s       | <span style="color: green">-40,0% </span>|
| RAM-Verbrauch      | 289,9 MiB | 194,4 MiB | <span style="color: green">-32,9% </span>|

# Vergleich
