---
layout: [post, post-xml]              # Pflichtfeld. Nicht ändern!
title:  "Schmuckes Java - Syntactic Sugar von Project Amber"         # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2022-05-30 13:00              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
author_ids: [mboegers]                 # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesen Namen geben.
categories: [Softwareentwicklung]     # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Java, OpenJDK, Project Amber]   # Bitte auf Großschreibung achten.
---
Javas Sprachfeatures gelten als gealtert und benötigt viel Boilerplate-Code.
Das OpenJDK Project Amber greift diese Schwächen von Java u.a. mit Syntactic Sugar an. 

Langer Quellcode und Workarounds senken die Lesbarkeit, Verständlichkeit und nicht zuletzt die Produktivität während der Entwicklung mit Java.
Mit auf den ersten Blick unbedeutend wirkenden Erweiterungen modernisiert Project Amber die Sprache Java und verbessert die Produktivität in der Entwicklung.
In diesem Blogbeitrag zeige ich euch den Syntactic Sugar, den Project Amber mitbringt, und möchte euch motivieren, diesen auszuprobieren.
In weiteren Beiträgen werden wir noch die anderen Änderungen beleuchten.

# Was ist ein OpenJDK Project?
OpenJDK ist eine Community von Entwicklerinnen und Entwicklern aus dem Open-Source-Bereich, die sich mit der Weiterentwicklung der Java-Plattform beschäftigen.
Die OpenJDK-Community besteht aus ständigen [Gruppen](https://openjdk.java.net/groups/), die sich jeweils um einen eigenen Themenbereich, beispielsweise den Compiler, kümmern.
Neben den Gruppen gibt es noch [Projekte](https://openjdk.java.net/projects/), deren Ziel es ist, eigene Artefakte beizusteuern, und die von mindestens einer Gruppe gefördert werden.
Diese Artefakte können Tools, Dokumentationen oder Sprachfeatures sein und werden über **J**DK **E**nhancement **P**roposals (JEP) umgesetzt.
Der Prozess, den ein JEP dabei durchläuft, könnt ihr auf der OpenJDK-Seite unter [JEP-1](https://openjdk.java.net/jeps/1) nachlesen.
Bevor wir uns die einzelnen JEPs von Project Amber genauer ansehen, lasst uns noch kurz einen Blick auf die Zielsetzung von Project Amber werfen.

# Was macht Project Amber?
[Project Amber](https://openjdk.java.net/projects/amber/) wurde von Brian Goetz und Gavin Bierman ca. Mitte 2017 initiiert.
Seitdem arbeitet das Project Amber daran, kleine und Produktivität steigernde Java Sprachfeatures zu erforschen und zu implementieren.
Das durch die Compiler Group geförderte Vorhaben nutzt hierbei einen mehrstufigen Preview-Prozess.
Dieser Prozess soll verhindern, dass Sprachfeatures übernommen werden, welche nicht die Anforderungen der Community befriedigt.
Einige dieser _Preview-Features_ werden wir in den nächsten Blogeinträg sehen.
Nicolai Parlog hat einen sehr guten [Artikel](https://nipafx.dev/enable-preview-language-features/) dazu verfasst, in dem er zeigt, wie Preview-Features auch mit Buildtools genutzt werden kann.

Im Folgenden werden wir uns die einzelnen JEPs ansehen, dabei orientieren wir uns an einer inhaltlichen Gruppierung und nicht an der zeitlichen Reihenfolge nach Erscheinen der JEPs.

# Was Project Amber geliefert hat
Die bisherigen JEPs des Project Amber lassen sich grob in drei Gruppen aufteilen:
1. _Syntactic Sugar_, um die Entwicklung angenehmer zu gestalten
2. _Erweiterung am Java Typ System_, um mit algebraischen Datentypen die Grundlage für Pattern Matching zu legen
3. _Pattern Matching für Java_, um Java um ein mächtiges Werkzeug aus der funktionalen Programmierung zu erweitern

In diesem Teil kümmern wir und um den Syntactic Sugar, den uns das Project Amber liefert.

# Syntactic Sugar für Java
In der Gruppe Syntactic Sugar habe ich die JEPs zusammengefasst, welche als Ziel haben, die kognitive Last während der Entwicklung zu verringern.
Neben der automatischen Typinferenz für lokale Variablen finden wir in dieser Gruppe auch noch mehrzeilige Strings und eine neue Art der `switch`-Anweisung.

## JEP-286: Local-Variable Type Inference
Bei der lokalen Typinferenz wird der Compiler durch das Keyword `var` angewiesen, den Typ von lokalen Variablen automatisch zu bestimmen.
Das Keyword `var` kann nur in Verbindung mit einer direkten Zuweisung verwendet werden und es kann mit dem `final` Keyword kombiniert werden.
Im Übrigen ist `var` das erste konditionale Keyword und ist nur im Rahmen der Variablendefinition geschützt.
Als Name von Variablen, Methoden oder Klassen ist es zulässig.
Seid [JEP-286](https://openjdk.java.net/jeps/286) und dem finalen Stand von Java 10 ist es nicht mehr notwendig, Typinformationen zu doppeln oder komplexe generische Typen auszuschreiben.
```java
// repeated information
List<String> lineList = new ArrayList<String>();
// no duplications
var lines = new ArrayList<String>();
final var readLines = lines.size();
```

## JEP 323: Local-Variable Syntax for Lambda Parameters
Mit [JEP-323](https://openjdk.java.net/jeps/323) in Java 11 ist es möglich, das Keyword `var` auch bei der Definition von Lambda-Parametern zu verwenden.
Damit ist die Syntax von Lambdas angeglichen worden und es ist möglich, Lambda-Parameter mit Annotationen zu versehen.
```java
BiConsumer<String>, String> safeSink = (@Nonnull var x, final var y) -> x.accept(y);
```

## JEP 378: Text Blocks
Bei der Verwendung von mehrzeiligen Strings geht es meistens darum, die Lesbarkeit im Sourcecode sowie bei der Verwendung zu verbessern.
Vor Java 15 und [JEP-378](https://openjdk.java.net/jeps/378) waren formatierte mehrzeilige Strings nur unter Verwendung von vielen `+`, `\n` und `\t` möglich.
Seit Java 15 und JEP-378 beginnt und endet ein Textblock mit `"""` sowie einem Zeilenumbruch.
```java
String helloWorldResponse = """
    <html>
        <body>
            <p>Hello, world</p>
        </body>
    </html>""";
```
Die Einrückung des Blocks wird dabei nicht in das Ergebnis übernommen.
Jim Laskey und Stuart Marks haben mit dem [Programmer's Guide to Textblocks](https://openjdk.java.net/projects/amber/guides/text-blocks-guide) eine genaue Beschreibung veröffentlicht.

## JEP 361: Switch Expressions
Die `switch`-Anweisung hat in ihrer Geschichte einige Verbesserungen erlebt, es gibt aber auch berechtigte Kritik.
Neben der leicht zu übersehenden Fall-Through-Semantik und der unhandlichen Fehlerbehandlung ist es auch nicht möglich, dass die `switch`-Anweisung einen Wert zurückgibt.
Seid Java 14 und dem [JEP-361](https://openjdk.java.net/jeps/361) löst switch _on steroids_ diese Kritik in Luft auf.
```java
int j = switch (day) {// enum Days {MONDAY, …}
  case MONDAY, null -> 0;
  case TUESDAY -> 1;
  default -> {
    int k = day.toString().length();
    yield k;
  }
};
```
In dem Listing sehen wir alle Änderungen in einem Codeblock, wir gehen sie aber einzeln durch:
+ Die **`switch`-Anweisung** liefert einen Wert zurück, welcher in `j` gespeichert wird. Bei einzeiligen `case`-Blöcken kann der Wert einfach ausgeschrieben werden, bei mehrzeiligen Blöcken muss das Keyword `yield` verwendet werden.
+ Auf die **Fall-Through-Semantik** wird mit `->` verzichtet. Hier können mit Komma getrennt eine Liste von Case Labels angegeben werden, um mehrere Zweige zu gruppieren.
+ Die **Fehlerbehandlung** kann explizit geschehen, da `null` jetzt ein legales Case Label ist. Wird der case `null` nicht explizite behandelt, so verhält sich die `switch`-Anweisung wie gewohnt.
+ Es müssen alle möglichen Cases abgedeckt oder default verwendet werden. Dies funktioniert auch für die neuen Sealed Classes.

## Pläne für die Zukunft
Anhand von Entwürfen und JEPs, die noch keine Zielversion haben, lässt sich erahnen, auf welche Neuerungen wir in Zukunft hoffen können.

### JEP-302: Lambda Leftovers
[JEP-302: Lambda Leftovers](https://openjdk.java.net/jeps/302) soll die Benutzbarkeit von Lambdas verbessen, indem nicht genutzte Parameter nicht definiert werden müssen und Lambda-Parameter keine lokalen Variablen mehr überschreiben können.
Im Listing unten wird der zweite Parameter nicht verwendet und mit `_` als ungenutzt markiert.
Die lokale Variable `String key` wird nicht durch den Lambda-Parameter `Integer key` überschrieben.
```java
String key = "Not shadowed"
BiFunction<Integer, String, String> bliss = (key,_) -> String.valueOf(key);
```
### JEP draft: Concise Method Bodies
Mit [Concise Method Bodies](https://openjdk.java.net/jeps/8209434) soll die Schreibweise für einzeilige Methoden vereinfacht werden.
Dadurch sollen Klassen mit vielen einfachen Methoden besser lesbar gemacht werden.
Dieses JEP ist noch ein Entwurf und es ist nicht sicher, ob diese Änderung jemals Teil der Sprache Java wird.
```java
class IntegerValue {
    final Integer value;
    String toString() = value::toString;
    Integer add(int i) -> Integer.valueOf(value + i);
}
```

### JEP draft: String Templates
[String Templates](https://openjdk.java.net/jeps/8273943) sollen Java um String Templates erweitern.
Durch eine Änderung in der Syntax von Strings sollen lokal sichtbare Variablen in Strings eingebunden werden können.
Für dieses JEP ist noch nicht klar, ob und wie dieses Feature in Java integriert werden soll.

# Zusammenfassung
Wir haben gesehen, welche neuen Sprachkonstrukte Project Amber eingebracht hat.
Alle diese Konstrukte tragen zum _neuen Java_ bei und vereinfachen die Arbeit mit der Sprache.
Die Aussichten auf die noch kommenden JEP lässt auf eine sehr moderne Sprache Java hoffen.
In den nächsten Teilen werden wir uns den Erweiterungen am Java Type System und dem Pattern Matching für Java widmen.
