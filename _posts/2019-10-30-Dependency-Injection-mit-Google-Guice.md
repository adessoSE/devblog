---
layout: [post, post-xml]              # Pflichtfeld. Nicht ändern!
title:  "Dependency Injection mit Google Guice"     # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2019-10-30 16:00              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2019-11-3             # Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author: frenzel                    # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: [Softwareentwicklung] # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Java,Dependency Injection,Google Guice]         # Optional.
---

# Einleitung

Den meisten Java Entwicklern ist das Spring Framework bekannt.
Cloud-Anwendungen, REST Schnittstellen sind nur zwei der vielen Anwendungsmöglichkeiten.
Ein im Kern des Frameworks verankertes Feature ist die sogenannte Dependency Injection.
Es unterstützt bei der Entwicklung, indem es das Auflösen und Bereitstellen von Abhängigkeiten in Softwarekomponenten übernimmt.
Dieses Feature bietet jedoch nicht nur Spring.
Ein Framework, das sich ausschließlich darauf fokussiert, ist Google Guice.
Dabei handelt es sich um ein leichtgewichtiges Open-Source-Framework zur Nutzung von Dependency Injection in Java ab Version 6.
In diesem Beitrag wird Guice vorgestellt und auf einige Unterschiede in der Nutzung zu Spring eingegangen.


# Dependency Injection 
Dependency Injection (Kurz DI) ist ein Entwurfsmuster (engl. Design Pattern), das bei der Lösung eines wiederkehrenden Problems in der Softwareentwicklung unterstützt.

DI übernimmt das Auflösen von Abhängigkeiten für Objekte.
Normalerweise verwaltet jedes Objekte selbst seine Abhängigkeiten zu weiteren Objekten oder Ressourcen.
Mit Hilfe von DI wird die Aufgabe der Objektverwaltung an eine zentrale Komponenten übertragen.

Benötigt ein Objekt `A` das Objekt `B`, liegt es in der Verantwortung von `A`, `B` zu verwalten. 
Auf den ersten Blick handelt es sich dabei um einen überschaubaren Anwendungsfall.
Ergänzen wir dem Objekt `B` aber noch Abhängigkeiten zu `C` und `D` und `C` wiederum auch eine Abhängigkeit zu `D`, so steigt die Komplexität in der Software und die Abhängigkeiten der Komponenten untereinander nehmen zu. 
Wie kann dieses Problem auf einfache Art für den Entwickler gelöst werden?

![Object Graph](/assets/images/posts/dependency-injection-mit-google-guice/object-graph.png "Darstellung eines Objekt Graphen der Abhängigkeiten von A")  
_Darstellung eines Objektgraphen der Abhängigkeiten von `A`._

Hier kann Dependency Injection eingesetzt werden.  
Eine zentrale Komponente löst vorhandene Abhängigkeiten auf, um diese dem Objekte bereitzustellen (injizieren).
In unserem Fall bedeutet dies also, dass `A` nicht das Verwalten von `B` übernehmen muss und weiter auch nicht `B` seine Abhängigkeiten zu `C` und `D`.

# Verwendung
Zunächst muss Guice dem Java Projekt als Abhängigkeit hinzugefügt werden. Über [Maven Repository](https://mvnrepository.com/artifact/com.google.inject/guice) oder [github](https://github.com/google/guice) kann die aktuellste Version 4.2.2 von Guice heruntergeladen werden.

Das Herzstück von Guice sind konfigurierbare Module, welche festlegen, wie Abhängigkeiten durch das Framework aufzulösen sind.
So beispielsweise ob immer die gleiche Instanz eines Typs programmweit bereitgestellt werden soll und somit nur ein Objekt von diesem Typ existiert (Singleton-Pattern).

Die Konfiguration selbst wird ausschließlich in Java Code durchgeführt.
Dazu muss das Interface `Module` implementiert werden. 
Alternativ kann auch von der abstrakten Klasse `AbstractModule` geerbt werden.
In beiden Fällen ist die Methode `configure` zu implementieren.

```java
public class HotelModule extends AbstractModule {
  @Override 
  protected void configure() {
    // Konfiguration
  }
}
```
Das `HotelModule` kann so eingesetzt werden, trotz der Tatsache, dass die `configure` Methode leer implementiert ist. 

Als nächstes wird von einem Beispielservice `ReservationService` ausgegangen, der Abhängigkeiten besitzt.
```java
public class ReservationService {
    private final BookingService bookingService;

    @Inject
    public ReservationService(BookingService bookingService) {
        this.bookingService = bookingService;
    }
}
```
Um eine funktionsfähige Instanz des `ReservationService` zu erhalten, wird der `BookingService` zur Konstruktion benötigt. 
Damit wie im Beispielcode dargestellt, dem `ReservationService` in den Konstruktor (Constructor Injection) Objekte injiziert werden können (z.B. `BookingService`), ist es erforderlich, diesen mit `@Inject` zu annotieren. 
Alternativ kann die Injection auch an Setter-Methoden oder Feldern erfolgen.
In diesen Fällen ist ebenfalls die `@Inject` Annotation notwendig. 
Durch die zur Laufzeit ausgewertete Annotation weiß Guice, dass an dieser Stelle Abhängigkeiten bereitzustellen sind.
Andernfalls ist der `ReservationService` nicht lauffähig.  

Die `@Inject` Annotation ist Bestandteil der Bibliothek.
Guice implementiert jedoch auch die JSR-330 Spezifikation, die Annotationen für DI beschreibt und somit auch die Möglichkeit bietet, diese mit der Bibliothek zu verwenden.
Eine tabellarische Übersicht der Guice Äquivalente zu den in JSR-330 Definierten, kann in der [Dokumentation](https://github.com/google/guice/wiki/JSR330) eingesehen werden.
In der Dokumentation wird als Best Practice empfohlen, die in der Spezifikation definierten Annotation einzusetzen anstatt der in Guice definierten.

Für den `ReservationService` wird daher die `@Inject` Annotation aus der JSR-330 Spezifikation genutzt.
Es gilt jedoch darauf zu achten, dass einige zusätzliche Einschränkungen beim Injizieren mit dieser Annotation gelten (siehe [Dokumentation](https://github.com/google/guice/wiki/JSR330)).
Diese treffen in unserem Beispiel jedoch nicht zu und können daher vernachlässigt werden.

Mit dem `HotelModule` wurde eine Konfiguration definiert und mit dem `ReservationService` ein Service, dessen Bereitstellung Guice übernehmen soll.
Damit das Erstellen des `ReservationService` durch die Bibliothek übernommen wird, ist ein `Injector` notwendig. 
Dieser wird per Aufruf der statischen Methode `Guice.createInjector` erzeugt. 

Mit dem `Injector` können jetzt Objekte bereitgestellt werden, bei denen das Framework die Verwaltung der Abhängigkeiten übernimmt.
Die übliche Routine, Objekte mittels Keyword `new` zu instanziieren, entfällt somit.
```java
 public static void main(String[] args) {
    Injector injector = Guice.createInjector(new HotelModule());

    ReservationService reservationService = injector.getInstance(ReservationService.class);
  }
``` 
Beim Erstellen des Injectors können beliebig weitere Module als Argument angegeben werden, um durch Komposition den `Injector` zu konfigurieren. 
Letztlich übernimmt der `Injector` die Aufgabe den Objektgraph anhand der übergebenen Konfigurationen zu erzeugen. 
Aus diesem Graph geht dann hervor, welche Abhängigkeiten notwendig sind, um ein Objekt lauffähig bereitzustellen.  

Je nach Szenario soll zwischen zwei Implementierungen `BookingServiceImpl` und `BookingServiceImplMock` für den `BookingService` unterschieden werden.
Dazu wird der `BookingService` in ein Interface überführt, das durch die zwei genannten Services implementiert wird. 

```java
interface BookingService {
    // Methoden
}
```

```java
public class BookingServiceImpl implements BookingService {
    // Methoden
}
```
```java
public class BookingServiceImplMock implements BookingService {
    // Methoden
}
```
Mit der Trennung zwischen Implementierung und API ist eine Anpassung an der Konfiguration im Modul notwendig. 
Da der `BookingService` jetzt ein Interface ist, fehlt dem Injector die Information, welche Implementierung konkret bereitzustellen ist. 
Es kommt zu einem  Laufzeitfehler:
```java
No implementation for de.adesso.blog.guice_example.BookingService was bound.
  while locating de.adesso.blog.guice_example.BookingService
    for parameter 0 at de.adesso.blog.guice_example.ReservationService.<init>(ReservationService.java:10)
  while locating de.adesso.blog.guice_example.ReservationService
```
An dieser Stelle kommt das sogenannte Binding zum Einsatz.
Der Entwickler erhält die Möglichkeit, einen Typ an eine Klasse oder Instanz zu koppeln.
In unserem Beispiel soll für das Interface `BookingService` die Implementierung `BookingServiceImpl` verwendet werden.

```java
public class HotelModule extends AbstractModule {
  @Override 
  protected void configure() {
    Bindings.bind(BookingService.class).to(BookingServiceImpl.class);
    // weitere Konfigurationen
  }
}
```
Durch diese Anpassung am `HotelModule`, gibt der `Injector` beim Bereitstellen eines Objektes des Typs `BookingService` eine Instanz von `BookingServiceImpl` zurück.   
Dabei ist zu beachten, dass immer eine neue Instanz des Services zur Verfügung gestellt wird.
Um programmweit innerhalb von Guice immer die gleiche Instanz des `BookingServiceImpl` zu nutzen, reicht es, die Klasse mit `@Singleton` zu annotieren.
Damit geht allerdings einher, dass die Klasse threadsicher (engl. threadsafe) sein muss.
Ein Hilfestellung bei der Wahl des richtigen Scopes, kann der Dokumentation unter [Scopes](https://github.com/google/guice/wiki/Scopes#choosing-a-scope) entnommen werden.
 ```java
@Singleton
public class BookingServiceImpl implements BookingService {
    // Methoden
}
```
Das Binden an eine konkrete Klasse ist nur eine der Funktionen, die das Framework bietet.
Weitere Möglichkeiten sind das Binden an eine konkrete, in der Konfiguration selbst erzeugte, Instanz oder den Konstruktor.
Für genauere Informationen zum Thema [Binding](https://github.com/google/guice/wiki/Bindings) bietet der Users Guide hilfe.

# Unterschiedliche Nutzung von DI zu Spring
Im Vergleich zum Spring Framework ist der Funktionsumfang von Google Guice als gering zu beurteilen.
Das liegt allerdings am Fokus der Programmbibliotheken. 
Während Guice ausschließlich zur Nutzung von DI verwendet werden kann, bietet Spring mit seinem Ecosystem deutlich mehr Funktionalitäten. 
Trotz der Tatsache, dass beide Frameworks für DI eingesetzt werden können, gibt es Unterschiede in der Nutzung.

Sowohl in Guice als auch Spring wird konfiguriert, wie Objekte durch DI aufzulösen sind.
Das im Implementierungsbeispiel gezeigte Modul, kommt in der Spring-Welt der `@Configuration` Annotation an einer Klasse nahe, in denen Beans deklariert werden.
Google's Framework bietet gleiche Funktionalitäten, dabei handelt es sich aber nicht um Beans.
Der Begriff findet in Guice nicht statt, dementsprechend wird auch nicht die `@Bean` Annotation verwendet.  
So sind Factory-Methoden zum definieren von Beans in Guice nicht möglich.
Stattdessen kann `@Provides` eingesetzt werden.
 ```java
// Methode in einer Module-Klasse
@Provides
SomeService provideSomeService() {
    SomeService service = new SomeService();
    service.setApi("135-key");
    return service;
}
```
Wird eine Instanz des Typs `SomeService` benötigt, wird diese Methode ausgeführt und der Rückgabewert verwendet.
Für welchen Typ diese Methode zuständig ist, wird über den Rückgabetyp definiert.

Während bei Spring der Default Scope für Objekte Singleton ist, wird bei Guice immer eine neue Instanz erzeugt.
Dies bedeutet, dass bei jeder Injektion eine neue Instanz der Klasse zum Einsatz kommt.
In Spring entspricht dieses Verhalten dem Scope Prototype.
Wie am `BookingServiceImpl` gezeigt, kann der Scope aber geändert werden.
Innerhalb eines Modules kann per Binding oder Provider der Scope konfiguriert werden, wie auch per Definition an der betroffenen Klasse selbst.

# Einsatzszenario
In diesem Fall wird davon ausgegangen, dass bisher im Projekt kein Framework zur Verwendung von DI eingesetzt wird.
Wie exemplarisch dargestellt, ist der Einsatz von DI schnell und einfach mit Guice möglich, ähnlich wie bei Spring.
Der klare Fokus von Guice auf DI ist eine der Stärken der Bibliothek.

Es beschränkt sich nur auf einen Aspekt, während Spring's Funktionsspektrum deutlich größer ausfällt. 
Dieser Unterschied spiegelt sich in der Größe der beiden Bibliotheken wieder. 
Während Spring Core und Spring Context (Version 5.1.9) gemeinsam 2.3 MB schwer sind, so kommt Guice (Version 4.2.2) lediglich auf 826 KB. 
Es kann im Projekt durchaus vorkommen, dass die Speichergröße sowie die Speichernutzung der Bibliothek Auswahlkriterien darstellen.
So auch in dem Projekt, in dem ich zum ersten mal mit Guice entwickelte. 

Anhand eines Proof of Concept (Kurz PoC) haben wir uns im Projekt für Google Guice anstatt Spring entschieden, obwohl das Know-how zu letzterem im Projektteam deutlich ausgeprägter war.
Als Teil von Fat-Clients war unsere Aufgabe, Formulare aus mehreren Komponenten zu entwickeln.
In diesen Clients wurde zu diesem Zeitpunkt auch kein Spring eingesetzt, weshalb diese Bibliothek ebenfalls als mögliche Option gehandelt wurde. 
Neben der einfachen Einführung von Guice in die bestehenden Clients war letztlich auch die Speichergröße und -nutzung der Bibliothek einer der ausschlaggebenden Punkte. 
Im weiteren Projektverlauf hat sich unsere Entscheidung bewährt, sodass wir in den Fat-Clients nun Dependency Injection nutzen können.

# Fazit
Guice ist ein leichtgewichtiges Framework, um DI einzusetzen.
Wir haben an dem Beispiel gesehen, wie eine Konfiguration angelegt und anschließend genutzt werden kann.
Weitere Informationen und Dokumentationen zu Guice sind auf der [Github Projektseite](https://github.com/google/guice) verfügbar.

Mir persönlich hat der Einsatz von Guice ein besseres Verständnis von Dependency Injection vermittelt. 
Da sich Guice nur darauf konzentriert, entfällt viel "Magie", wie man es aus dem Spring-Framework kennt.
Durch die einfache Lernkurve und den unkomplizierten Einsatz stellt Guice für uns eine gute Alternative zu Spring dar, wenn man lediglich Dependency Injection benötigt.
