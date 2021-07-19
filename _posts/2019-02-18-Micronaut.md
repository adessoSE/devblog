---
layout:         [post, post-xml]              
title:          "Micronaut - Eine Alternative zu Spring"
date:           2019-02-18 09:00
modified_date:  2021-03-08 14:50
author:         t-buss
categories:     [Softwareentwicklung]
tags:           [Microservices, Micronaut, Java]
---
Ja, richtig gelesen, es gibt Alternativen!
Obwohl der Platzhirsch Spring sich bei Java-Anwendungen großer Beliebtheit erfreut, sollte man nicht vergessen, dass es daneben auch noch andere Frameworks gibt, die einen Blick wert sind.
In diesem Blog-Artikel soll es um Micronaut gehen, ein noch vergleichsweise junges Framework, welches jedoch einige interessante Eigenschaften hat, die es besonders im Cloud-Umfeld zu einem echten Rivalen gegenüber Spring machen.
Wir implementieren in diesem Artikel eine Anwendung einmal mit Spring Boot und einmal mit Micronaut.
Danach vergleichen wir die beiden Ansätze und schauen, wo welches Framework überlegen ist.

Entwickelt wird das [Micronaut-Framework](http://micronaut.io) von [OCI](https://objectcomputing.com/), genauer gesagt unter der Federführung von [Graeme Rocher](https://twitter.com/graemerocher), der schon das [Grails](https://grails.org/) Framework ins Leben gerufen hat.
Sowohl die Erfahrungen mit Spring als auch mit Grails sind in Micronaut eingeflossen.
Daher kommen die Paradigmen und das Programmiermodell erfahrenen Spring-Entwicklern schon von Beginn an sehr vertraut vor (mehr dazu später).
Das Framework beschreibt sich selbst als "modernes, JVM-basiertes Full Stack Framework um modulare, einfach zu testende Microservices- und Serverless-Anwendungen zu bauen".
In dieser Beschreibung liegt auch schon der wesentliche Unterschied zum Spring Framework: Es legt den Fokus auf Microservices und Serverless-Anwendungen, womit sich JVM-Frameworks aktuell noch eher schwer tun.

# Der kleine Nachteil von Spring
Java-Anwendungen kommen von Haus aus mit einigem Overhead daher.
Die JVM allein benötigt nach [offiziellen Angaben](https://www.java.com/en/download/help/sysreq.xml) bereits etwa 128Mb RAM und 124Mb Festplattenspeicher.
Für traditionelle Anwendungen ist dies voll und ganz vertretbar, bei Docker-Containern in einem Cluster oder gar als FaaS-Instanz sind solche Zahlen aber nicht mehr zeitgemäß.
Zum Vergleich: nicht-triviale Anwendungen in der Programmiersprache Go sind nach der Kompilation oftmals nur 20-30Mb groß.
Eine andere, wichtige Metrik ist die Startzeit einer Anwendung.
Durch den Laufzeit-Reflection-Ansatz von Spring sind Startzeiten jenseits der 20 Sekunden keine Seltenheit.
Auch das ist besonders für Serverless-Anwendungen nicht hinnehmbar.

# Was Micronaut unterscheidet
Micronaut geht einen anderen Weg als Spring und kann damit einige der Performance-Einbußen wett machen.
Besonders die Startzeit wird ungeheuer verringert, was Java-Entwicklern den Einstieg in die Serverless-Welt eröffnet.
Aber auch der RAM-Verbrauch sinkt.

Wie erreicht Micronaut diese Verbesserungen?
Die Antwort liegt in der Kompilation.
Spring durchsucht zur Laufzeit per Reflection den Classpath nach Beans, initialisiert diese und lädt sie dann dynamisch in den Application Context.
Dann werden die Beans dort "injected", wo sie benötigt werden.
Während das ein sehr einfacher und erprobter Ansatz ist, verlängert er jedoch die Startzeit durch diesen Overhead.
Die Startzeit leidet dabei umso mehr, je mehr Klassen die Anwendung enthält.
Micronaut hingegen verwendet "Annotation Processors", die die nötigen Informationen zur Compile-Zeit sammlen und Ahead-of-Time (AOT) die nötigen Transformationen für Dependency Injection (DI) und Aspect Oriented Programming (AOP) erledigen.
Das verkürzt die Startzeit der Anwendung, erhöht jedoch die Compile-Zeit.
Zudem fallen durch dieses Vorgehen etwaige Fehler wie eine nicht-zu-erfüllende Abhängigkeit schon zur Compile-Zeit auf.
Außerdem ist die Startzeit nicht abhängig von der Größe der Anwendung.
Einmal kompiliert ist die Startzeit dadurch relativ konstant.

Die Implikation dieses Compile-Zeit-Ansatzes ist natürlich, dass die Libraries, die zusätzlich zum Framework in die Anwendung einfließen, ebenfalls auf das Nachladen von Beans per Reflection verzichten müssen.
Das AOP-Framework AspectJ ist beispielsweise ungeeignet für Micronaut, weswegen Micronaut selbst eine AOP-Lösung bereitstellt.

Wie stark die durch das Framework erzielten Verbesserungen sind, wollen wir uns jetzt einmal in einer einfachen Anwendung anschauen.

# Die Spring-Anwendung
Als Beispiel nehmen wir eine einfache Anwendung für einen Einkaufswagen.
Den kompletten Code findet man auf [GitHub](https://github.com/t-buss/shopping-cart/tree/master/shopping-cart-spring).
Per HTTP können wir Produkte in den Einkaufswagen legen, diese abfragen oder wieder löschen.
Wir starten mit der Spring-Boot-Anwendung.
Dazu gehen wir auf [https://start.spring.io/](https://start.spring.io/) und stellen uns zusammen, was wir brauchen: Eine Java 8 Anwendung mit Gradle und Spring Boot 2.1.2.
Die Namen für Group und Artifact sind prinzipiell egal, ich wähle `com.example.myshop` und `shopping-cart`.
Als Abhängigkeiten benötigen wir lediglich das Web-Paket.

![Die Spring Initializer Konfiguration](/assets/images/posts/micronaut/spring-initializer.png "Die Spring Initializer Konfiguration")

Wir erhalten eine Archiv-Datei, die wir irgendwo auf unserem Rechner entpacken können.

## Der Code
Schreiben wir nun die Anwendung.
Wer mit Spring Boot vertraut ist, sollte mit diesem Code keine Probleme haben.
Wir beginnen mit einem Controller mit dem Namen `ShoppingCartController.java`:

```java
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
Der Service hält der Einfachheit halber alle Produkte in einer lokalen Liste.
Das POJO für ein Produkt schreiben wir in `Product.java`:
```java
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
```bash
$ ./gradlew bootRun
```

Zum Erstellen eines Produkts:
```bash
$ curl -X POST -H "Content-Type: application/json" -d '{"id": 1, "description": "Tricorder"}' http://localhost:8080/shoppingCart
```

Zum Abfragen der Liste:
```bash
$ curl http://localhost:8080/shoppingCart`
```

Zum Löschen:
```bash
$ curl -X DELETE -H "Content-Type: application/json" -d '{"id": 1}' http://localhost:8080/shoppingCart
```
Wir können eine ausführbare JAR-Datei mit folgendem Befehl generieren:
```bash
$ ./gradlew bootJar
```

## Ressourcenverbrauch
Schauen wir uns nun die nackten Zahlen an:
<table>
        <tr>
            <td></td>
            <td>Spring</td>
            <td> Micronaut</td>
        </tr>
    <tr>
        <td>Compile-Zeit</td>
        <td>1937ms</td>
        <td>?</td>
    </tr>
    <tr>
        <td>JAR-Größe</td>
        <td>15,2 MiB</td>
        <td>?</td>
    </tr>
    <tr>
        <td>Startzeit ohne JVM</td>
        <td>3,72s</td>
        <td>?</td>
    </tr>
    <tr>
        <td>Startzeit mit JVM</td>
        <td>~5s</td>
        <td>?</td>
    </tr>
    <tr>
        <td>RAM-Verbrauch</td>
        <td>289,9 MiB</td>
        <td>?</td>
    </tr>
</table>

Als Compile-Zeit nehmen wir die Zeit für den Gradle Task `bootJar` nach einem vorherigen `./gradlew clean`.
Die Startzeit beträgt laut Spring-Ausgabe 3,72 Sekunden. Die tatsächliche Startzeit enthält zusätzlich noch die Startzeit der JVM, womit wir in Summe bei etwa 5 Sekunden landen.

# Die Micronaut-Anwendung
Die vorangegangene Anwendung dient uns nun als Vergleichspunkt.
Schauen wir mal, wie sich die Micronaut-Anwendung schlägt.
Der komplette Code ist ebenfalls auf [GitHub](https://github.com/t-buss/shopping-cart/tree/master/shopping-cart-micronaut) verfügbar.
Anders als bei Spring Boot kommt Micronaut mit einem Kommandozeilen-Tool daher, welches die Erstellung von Projekten übernimmt.
Für die Installation sei auf die [offizielle Micronaut-Seite](http://micronaut.io/download.html) verwiesen.

Mit dem Tool `mn` können wir nun die Anwendung erstellen:
```bash
$ mn
```

Nun landen wir in einer Shell, wo uns einige Micronaut-spezifische Befehle zur Verfügung stehen.
Wir erstellen eine neue Anwendung im aktuellen Verzeichnis mit `create-app`.
Wenn wir dahinter noch `--features=` eingeben und ein mal auf TAB drücken, bekommen wir eine Übersicht über die zusätzlichen Features, die Micronaut mitliefert.
Darunter finden sich auch die JVM-Sprachen Groovy und Kotlin, sowie mehrere Projekte aus dem Netflix-Stack für Microservices.
Für's erste begnügen wir uns mit den Standard-Einstellungen bis auf eine "Kleinigkeit": GraalVM Native Image.
Worum es sich dabei handelt, dazu später mehr.
Wir erstellen das Projekt mit diesem Befehl:
```bash
mn> create-app --features=graal-native-image com.example.myshop.shoppingcart.shopping-cart-micronaut
```

Mit `exit` können wir die Shell verlassen, um dann in den gerade erstellten Ordner zu wechseln und dort wieder `mn` auszuführen.
Nun können wir direkt mit der Programmierung anfangen.

## Der Code
Beginnen wir wieder mit dem Controller.
Noch in der Micronaut-Shell geben wir den Befehl zur Erstellung des Controllers ein:
```bash
mn> create-controller ShoppingCart
```

Dies erstellt sowohl den Controller als auch einen dazugehörigen Test und erspart uns etwas Zeit, da wir die Dateien nicht von Hand selbst erstellen müssen.
Und da wir gerade dabei sind, erstellen wir die Service-Bean gleich mit:
```bash
mn> create-bean ShoppingCartService
```

Nun an den Code für unseren Controller:
```java
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
Tatsächlich gibt es ein [Projekt](https://github.com/micronaut-projects/micronaut-spring), welches das Ziel hat, Spring-Annotationen in Micronaut verfügbar zu machen.
Das Framework ändert jedoch einige Namen der Annotationen.
Aus `@RestController` wird `@Controller`, aus `@GetMapping` wird `@Get` usw.

Auch den Service, den wir über das Kommandozeilen-Tool erstellt haben, können wir fast genau so übernehmen.
Aus `@Service` wird hier `@Singleton`, wie wir in dem Template erkennen können, welches wir zuvor durch das Kommandozeilen-Tool erstellt haben.
Der Rest des Java-Codes bleibt hier ebenfalls gleich.

Das Produkt-POJO unterscheidet sich etwas von seinem Spring-Pendant:
```java
    ...
    public Product(@JsonProperty("id") Long id,
                   @JsonProperty("description") String description) {
        this.id = id;
        this.description = description;
    }
    ...
```
Der Konstruktor benötigt in den Argumenten die `@JsonProperty`-Annotation aus der [Jackson-Bibliothek](https://github.com/FasterXML/jackson), um eintreffende Daten im JSON-Format richtig mappen zu können.

## Befehle
Die Anwendung lässt sich mit diesem Befehl starten:
```bash
$ ./gradlew run
```

Eine ausführbare JAR-Datei erzeugen wir mit:
```bash
$ ./gradlew assemble
```

Die cURL-Befehle sind identisch mit denen der Spring-Version.

## Ressourcenverbrauch
Schauen wir uns die Zahlen der Micronaut-Lösung an und vergleichen sie direkt mit den Zahlen der Spring-Lösung:
<table>
<tr>
<td></td>
<td>Spring</td>
<td>Micronaut</td>
<td>Unterschied</td>
</tr>
<tr>
<td>Compile-Zeit</td>
<td>1937ms</td>
<td>10,5s</td>
<td><span style="color: red">  +442%  </span></td>
</tr>
<tr>
<td>JAR-Größe</td>
<td>15,2 MiB</td>
<td>11,3 MiB</td>
<td><span style="color: green">-25,6% </span></td>
</tr>
<tr>
<td>Startzeit ohne JVM</td>
<td>3,72s</td>
<td>1,39s</td>
<td><span style="color: green">-62,6% </span></td>
</tr>
<tr>
<td>Startzeit mit JVM</td>
<td>~5s</td>
<td>~3s</td>
<td><span style="color: green">-40,0% </span></td>
</tr>
<tr>
<td>RAM-Verbrauch</td>
<td>289,9 MiB</td>
<td>194,4 MiB</td>
<td><span style="color: green">-32,9% </span></td>
</tr>
</table>
Der Vergleich mit Spring zeigt die Verbesserungen von Micronaut gegenüber Spring.
Während zwar die Compile-Zeit nun signifikant länger ist, kann das Framework bei anderen Metriken mächtig punkten.
Dabei ist zu beachten, dass die Startzeit je nach Größe der Anwendung bei Spring immer länger werden wird, während die Startzeit der Micronaut-Anwendung relativ konstant bleibt.

# BONUS: GraalVM Native Image
Als wir die Micronaut-Anwendung über das Kommandozeilen-Tool erstellt haben, haben wir dabei das Feature `graal-native-image` angegeben.
Bei [GraalVM](https://www.graalvm.org/) handelt es sich um eine virtuelle Maschine mit Unterstützung für verschiedene Sprachen, die von Oracle entwickelt wird.
Dadurch erhalten wir die Möglichkeit, Code aus verschiedenen Sprachen innerhalb der gleichen Runtime laufen zu lassen.
Aber das ist nur der Anfang: GraalVM bietet die Möglichkeit, Java-Anwendungen in native Binaries kompilieren zu lassen.
Diese können dann ohne JVM oder GraalVM ausgeführt werden.
Dieser Schritt wird nur möglich, wenn die Anwendung wenig bis gar kein reflexives Nachladen benutzt (siehe [hier](https://github.com/oracle/graal/blob/master/substratevm/REFLECTION.md) für eine detailierte Erklärung).
Daher eignet sich eine Micronaut-Anwendung ausgesprochen gut für den Einsatz mit GraalVM.

Nachdem man GraalVM [installiert](https://www.graalvm.org/docs/getting-started/) hat, erhält man einen "JDK-Ersatz".
Alle Programme wie `java` und `javac` sind enthalten und verhalten sich genau wie ihr ursprüngliches Gegenstück.
Der Unterschied liegt darin, dass die Java-Programme nun in der GraalVM, nicht in der JVM ausgeführt werden.
Jedoch liefert GraalVM zusätzlich zu den normalen JDK-Programmen ein Tool, welches die Kompilierung zu einer nativen Binary vornehmen kann.

## Micronaut-Anwendung binär kompilieren
Wir wollen dieses Tool bei unserer kleinen Micronaut-Anwendung einmal ausprobieren.
Dazu installieren wir also GraalVM nach der offiziellen [Dokumentation](https://www.graalvm.org/docs/getting-started/).
Wenn alles glatt lief, sollte die Version der GraalVM nun neben der Java-Version angezeigt werden:
```sh
$ java -version
openjdk version "1.8.0_192"
OpenJDK Runtime Environment (build 1.8.0_192-20181024121959.buildslave.jdk8u-src-tar--b12)
GraalVM 1.0.0-rc11 (build 25.192-b12-jvmci-0.53, mixed mode)
```

Jetzt sollte auch das Programm `native-image` über die Kommandozeile verfügbar sein.
Die Micronaut-CLI hat uns bereits das Bash-Script `build-native-image.sh` in unserem Projektverzeichnis generiert.
Es enthält im Wesentlichen einen Gradle-Aufruf zur Generierung der JAR und den Aufruf von `native-image` mit einigen Flags, die für die Generierung der nativen Binary nötig sind.
Der Nachteil an diesem Verfahren: Es benötigt eine Menge(!) RAM.
Wer nicht genug RAM bereitstellt, für den wird der Prozess mit dem ominösen Fehler 137 enden.
16GB RAM sollten mindestens vorhanden sein.

Wem es gelungen ist, der wird belohnt: Die erzeugte Binary lässt sich bequem ohne eine JVM starten:
```bash
$ ./shopping-cart-micronaut
14:53:31.707 [main] INFO  io.micronaut.runtime.Micronaut - Startup completed in 16ms. Server Running: http://localhost:8080
```

16ms!
Eine gigantische Reduzierung der Startzeit!
Schauen wir uns die restlichen Metriken in der Tabelle an:
<table>
<tr>
<td></td>
<td>Micronaut (JVM)</td>
<td>Graal Native Image</td>
<td>Unterschied</td>
</tr>
<tr>
<td>Compile-Zeit</td>
<td>10,5s</td>
<td>2,5min = 150s</td>
<td><span style="color: red">+1428,6%</span></td>
</tr>
<tr>
<td>Executable-Größe</td>
<td>11,3 MiB</td>
<td>41,2 MiB</td>
<td><span style="color: red"> +364,6%</span></td>
</tr>
<tr>
<td>Startzeit ohne JVM</td>
<td>1,39s</td>
<td>16ms</td>
<td><span style="color: green">-98,8%</span></td>
</tr>
<tr>
<td>Startzeit mit JVM</td>
<td>~3s</td>
<td>16ms</td>
<td><span style="color: green">-99,4%</span></td>
</tr>
<tr>
<td>RAM-Verbrauch</td>
<td>194,4 MiB</td>
<td>23,5 MiB</td>
<td><span style="color: green">-87,9%</span></td>
</tr>
</table>

Die Compile-Zeit ist verständlicherweise miserabel.
Nicht nur, dass Micronaut die Beans zur Compile-Zeit auflöst.
Darüber hinaus wird der resultierende Java-Bytecode in nativen Code übersetzt.
Vorteil für Entwickler: Der Schritt muss lokal eigentlich nie ausgeführt werden.
Während man lokal auch die Java-Version zum Testen nutzen kann, führt lediglich der Build-Server den zeitfressenden Kompilierungsschritt aus.

Auch der Größenunterschied ist nicht wirklich problematisch.
Die JAR an sich ist zwar nur 11,3 MiB groß, jedoch benötigt man hierfür noch eine JRE, die noch einmal Platz verbraucht.
Die Binary kommt auch ohne eine JRE aus und kann so ausgeliefert werden.

Besonders der geringe RAM-Verbrauch zeigt, wie wertvoll der Ansatz für die Serverless-Welt sein kann, in der jedes Megabyte RAM bares Geld kostet.

## Als Docker-Image
Wer Docker installiert hat, kann sich ein Image mit dem beiliegenden Dockerfile bauen:
```bash
$ docker build -t shopping-cart:graal .
```
Das Docker-Image ist mit 52,3 MiB marginal größer als die Binary, während das kleinste Docker-Image mit einer JRE (`openjdk:8-jre-alpine`) bereits 83,1 MiB groß ist.
Wer also ein Docker-Image als Deployable Artifact ausliefert, spart über 40 MiB ein.

# Fazit
Das noch junge Framework Micronaut bietet Java-Entwicklern die Möglichkeit, schlanke und schnelle Anwendungen für die Cloud zu schreiben, ohne dabei auf das vertraute Programmiermodell von Spring zu verzichten oder gar auf eine andere Programmiersprache wie Go umsatteln zu müssen.

Sollten wir also alle Micronaut verwenden und Spring abschreiben?
Meiner Meinung nach ist es noch nicht so weit.
Bei der Entscheidung, welches Framework man für eine größere Anwendung verwenden will, kommt es nicht nur auf die Performance an.
Auch die Community und Lehrmaterialien müssen stimmig sein und da hängt Micronaut (noch) hinterher.
Bei den meisten Projekten auf GitHub handelt es sich um kleinere Beispielanwendungen wie die, die wir in diesem Artikel geschrieben haben.
Wie sich das Framework bei einer realen Anwendung verhält, ist also noch ungewiss.

Dennoch ist Micronaut einen Blick wert für kleine Anwendungen, gerade im schon so oft erwähnten Serverless-Umfeld.
Und nicht zuletzt ist Wettbewerb gut für den Markt.
Vielleicht halten ja einige Ideen der Micronaut-Entwickler Einzug ins Spring Framework.
