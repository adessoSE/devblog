---
layout: [post, post-xml] # Pflichtfeld. Nicht ändern!
title: "Schmuckes Java - Records und Sealed Classes" # Pflichtfeld. Bitte einen Titel für den Blog-Post angeben.
date: 2022-08-18 10:00 # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen.(Für Preview egal)
author_ids: [mboegers] # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesen Namen geben.
categories: [Softwareentwicklung] # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Java, OpenJDK, Project Amber] # Bitte auf Großschreibung achten.
---
Javas Sprachfeatures gelten als verbose und unhandlich.
Das OpenJDK Project Amber greift diese Schwächen von Java mit Erweiterungen des Typsystems an.
Records und Sealed Classes wurden als Antwort gefunden.

In meinem letzten [Beitrag](https://www.adesso.de/de/news/blog/schmuckes-java-syntactic-sugar-von-project-amber.jsp)
habe ich erklärt, welches Ziel Project Amber hat und wie der JEP-Prozess funktioniert.
Anschließend habe ich gezeigt wie der Syntactic Sugar von Project Amber verwendet wird.
In diesem Beitrag werde ich die Anpassungen am Java Typsystem betrachten.

## JEP 459: Records
Mit den sogenannten _Record Classes_ führt Project Amber eine neue Art von Klassen ein.
Record Classes basieren auf dem Konstrukt Named-Tuple.
Tupel sind in der Mathematik Wertepaare, deren Identität durch die Werte der Komponenten definiert wird.
Bei Named-Tuple haben die Komponenten Namen und können über diese zugegriffen werden.
Umformuliert bedeuten diese Eigenschaften:
+ kein versteckter State
+ Tupel sind immutable denn, wird eine Tupelkomponente verändert, ist es ein neues Tupel
+ die Gleichheit ist immer gleich bestimmbar
+ der Zugriff auf Komponenten ist immer gleich

Die Motivation, mit [JEP 459](https://openjdk.java.net/jeps/459) Record Classes in Java einzuführen, lässt sich im Motto
"It's all about the data, data and nothing but the data" erkennen.
Dies Motto spiegelt sich in der Syntax der Record Classes wider.
´´´java
record Range(int low, int high) { /* ... */ }
´´´
Die Definition einer Record Class besteht aus dem neuen Keyword `record`, gefolgt vom Namen und der Rekordkomponenten
in runden Klammern.
Zwischen den runden Klammern werden die Komponenten des Records angegeben, hier sind alle Datentypen inklusive Generics
erlaubt.
Die Syntax erinnert an einen Konstruktor, denn der Focus soll bewusst auf die Daten gelenkt werden.
Für jede der Komponenten wird je ein `private final`-Feld und eine Zugriffsmethode mit demselben Namen erzeugt.
Es werden auch die Methoden `equals` und `hashCode` entsprechend der Definition der Identität von Named-Tuple erzeugt.
Abschließend wird auch noch eine `toString`-Methode erzeugt.
Die Lombok-Fans in der Java-Community werden erkennen, die so entstandenen Klasse ist ähnlich zu der `@Value` Annotation
von Lombok.
Das ist korrekt und noch interessanter ist: jede mit `@Value` annotierte Klasse kann direkt durch eine Record Class
ersetzt werden.

Wie alle Klassen in Java erhalten auf Record Classes einen Default-Konstruktor.
Jedoch anders als normalerweise ist dies nicht der parameterlose Konstruktor, sondern der Conical-Konstruktor.
Die Signature des Conical-Konstruktors entspricht der Record-Definition, er bekommt also alle Komponenten übergeben.
Um die Definition einer Record Class kompakt zu halten und dennoch Werteprüfungen zu ermöglichen, wurde der
Compact-Conical-Konstruktor eingeführt.
```java
record Range(int low, int high) {
    Range { // 1
        if (low > high)
           throw new IllegalArgumentException(/*...*/);
    }
    Range(int length) { // 2
        this(0, length);
    }
}
```
Der Compact-Conical-Konstruktor (1) wird definiert durch den Klassennamen und wird direkt von geschweiften Klammen
gefolgt und ist immer `public`.
In seinem Scope sind Parameter definiert, welche dieselben Namen wie die Komponenten tragen, mit ihnen können
Validierungen durchgeführt werden.
Implizit werden nach der Abarbeitung des Konstruktor die Parameter den entsprechenden Feldern zugewiesen.
Es können beliebige weitere Konstruktoren erzeugt werden, am Ende der Aufrufkette muss aber der Conical-Konstruktor
aufgerufen werden.

Da Record Classes "auch nur" Java-Klassen sind, ist auch Vererbung und Overwriting erlaubt.
```java
record Range(int low, int high) implements Compareable<Range> { // 1
    public int compareTo(Range other){
        return Integer.compare(
            high() - low(),
            other.high() - other.low());
    }
    public int low() {return Math.abs(low); } // 2
}
```

Die Record Class Range implementiert das Comparable-Interface (1), dadurch wird die öffentliche
Schnittstelle um `public int compareTo(Range other)` erweitert.
Eine Erweiterung einer Klasse mit `extends` ist für Record Classes nicht erlaubt, da `protected` Member eingeführt
werden können.
Protected Member oder Methoden untergraben die Transparenz von Record.
Alle generierten Methoden können überschrieben und beliebige weitere Methoden definiert werden.

Durch ihre Immutability und Transparenz eignen sich Records gut, um Value Objects aus dem [Domain Driven
Design](https://www.adesso.de/de/news/blog/architekturanalyse-sowie-refactoring-auf-basis-von-tactical-domain-driven-design.jsp)
umzusetzen.
Aus als [Hibernate Custom Query Result](https://www.baeldung.com/hibernate-query-to-custom-class) sind Records
bereits einsetzbar.
Viele berühmte Java-Bibliotheken wie JSON-B arbeiten darauf hin, Records so schnell wie möglich zu unterstützten, um
die Nutzung von Records zu ermöglichen.
Die zweite Neuerung am Typsystem von Java sind doe Sealed Classes

## JEP 409: Sealed Classes
Mit [JEP 409](https://openjdk.java.net/jeps/409) hat Project Amber Sealed Classes in Java 17 eingeführt.
Das Konzept von `sealed` ist auch schon in anderen objektorientierten Sprachen integriert und dient dazu, während der Entwicklung mehr Kontrolle über die Vererbung zu geben.
In Java gab es schon immer die Möglichkeit mit `final` zu verhindern, dass eine Klasse erweitert wird.
War eine Klasse nicht als `final` markiert, konnte noch mit der Sichtbarkeit gearbeitet werden, um zu beeinflussen wie
eine Bibliothek erweitert werden kann.
Dieses Konzept ist aber weder für den Compiler noch für andere Teams besonders durchsichtig.
Mit der Semantik hinter Sealed Classes besteht nun die Möglichkeit, eindeutig klarzustellen, wie die
Vererbung gedacht ist.
Dazu gibt es jetzt zwischen "Niemand darf mich erweitern" mit `final` und "Alle dürfen mich erweitern" eine neue
Abstufung mit `sealed`.
```java
sealed interface Shape { }
```
Das neue Keyword `sealed` kann der Definition einer Klasse oder eines Interfaces vorangestellt werden und mit
`abstact` kombiniert werden.
Das so definierte Interface Shape ist nun verschlossen und es muss zum Zeitpunkt des Kompilierens klar sein, welche
Implementationen es gibt.
Es gibt zwei Möglichkeiten, zu erlauben, ein verschlossenes Interface bzw. Klasse zu erweitern.
+ Die erweiternden Klassen befinden sich in derselben Compile-Unit wie im Beispiel `Corndered` und `Weirdo`.
+ Die erweiternden Klassen werden explizit hinter dem `permits` Keyword angegeben wie im Beispiel von `Rectangle` und
`Square`.
```java
sealed interface Shape {
sealed interface Cornered extends Shape
    permits Rectangle, Square {}
    non-sealed class Weirdo implements Shape {}
}
final class Rectangle implements Shape.Cornered {}
record Square(int h, int l) implements Shape.Cornered {}
```
Eine sher wichtige Forderung an Sealed Class Hierarchies ist die nach der Seal-Propagation.
Mit Propagation ist gemeint, dass in jede Klasse bzw. jedem Interface, welches eine Sealed Class erweitert, angegeben
werden muss, wie die Hierarchie sich fortsetzt.
Möglich ist hierbei:
+ _die Hierarchy endet hier_ dabei wird die Klasse als `final` markiert wie im Beispiel die Klasse `Reactangle`
+ _die Hierarchy geht verschlossen weiter_ die Klasse wird als sealed markiert und muss ebenfalls Aussagen, welche
Klassen erlaubt sind wie im Beispiel das Interface `Cornered`
+ _die Hierarchy geht beliebig weiter_ die Klasse wird mit dem neuen Keyword `non-sealed` markiert wie im Beispiel
die Klasse `Weirdo`.
Es ist nun wieder erlaubt, beliebige Erweiterungen zu implementieren

Einen erstmal offensichtlichen Fall stellt das Record `Square` dar.
Die Klasse `Square` ist ein Record und ist nach [JEP 459](#jep-459-records) implizite `final`.
Aus diesem Grund ist die Hierarchy abgeschlossen.

## Zusammenfassung
Record und Sealed Classes bieten uns neue Möglichkeiten an, unsere Domänenmodelle zu implementieren.
Die Umsetzungen werden dadurch klarer und eindeutiger.
Zusätzlich sparen wir uns noch viel Boilerplate Code bzw. eine Dependency auf Lombok.
Ihr wares Potenzial zeigen Record und Sealed Classes aber erst durch die Einführung von Pattern Matching in Java.
Dieses dritte Thema von Project Amber werde ich in dem nächsten Beitrag dieser Reihe behandeln.
