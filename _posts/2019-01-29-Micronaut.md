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

Das [Micronaut-Framework](http://micronaut.io) beschreibt sich selbst als "modernes, JVM-basiertes Full-Stack-Framework um modulare, einfach zu testende Microservices- und Serverless-Anwendungen zu bauen".
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

## Der Code
Schreiben wir nun die Anwendung.
Wer mit Spring Boot vertraut ist sollte mit diesem Code keine Probleme haben.
Wir beginenn mit einem Controller unter dem Namen `ShoppingCartController.java`:

```java
package com.example.myshop.shoppingcart;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController("/cart")
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
Als letztes brauchen wir noch die Configuration, die unseren Service instantiiert; `ShoppingCartConfiguration.java`:
```java
package com.example.myshop.shoppingcart;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ShoppingCartConfiguration {
    @Bean
    ShoppingCartService getShoppingCartService() {
        return new ShoppingCartService();
    }
}
```

## Befehle
Die Anwendung lässt sich mit folgendem Befehl über die Kommandozeile oder über die IDE starten:
> `$ ./gradlew bootRun`

Zum Erstellen eines Produkts:
> `$ curl -X POST -H "Content-Type: application/json" -d '{"id": 1, "description": "Tricorder"}' http://localhost:8080/cart`

Zum Abfragen der Liste:
> `$ curl http://localhost:8080/cart`

Zum Löschen:
> `$ curl -X DELETE -H "Content-Type: application/json" -d '{"id": 1}' http://localhost:8080/cart`

Wir können eine ausführbare JAR-Datei mit folgendem Befehl generieren:
> `$ ./gradlew bootJar`

## Resourcenverbrauch
Schauen wir uns nun die nackten Zahlen an:
- Die Compilezeit für `bootJar` der Anwendung (auf meinem Laptop): 1937ms
- Die Größe der JAR: 15,2 MiB
- Die Startzeit: 3,72 Sekunden (laut Spring-Ausgabe im Log. Die tatsächliche Startzeit enthält zusätlich noch die Startzeit der JVM, was in Summe in etwa 5 Sekunden resultiert)
- Belegter RAM: 289,9 MiB
