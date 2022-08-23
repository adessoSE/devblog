---
layout: [post, post-xml]              # Pflichtfeld. Nicht ändern!
title:  "Schmuckes Java - Project Amber und das Pattern Matching"         # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2022-07-19 13:00              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
author_ids: [mboegers]                 # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesen Namen geben.
categories: [Softwareentwicklung]     # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Java, OpenJDK, Project Amber]   # Bitte auf Großschreibung achten.
---
Funktionale Programmierung (FP) wird als ein schlanker und eleganter Weg angesehen, Software zu implementieren.
Pattern Matching ist ein integraler Baustein von FP, mit dem die Programmlogik definiert wird.
Die Einführung von Pattern Matching in Java ist eines der Ziele von Project Amber.

Bei Pattern Matching ermöglichten die zugrunde liegenden Summen- und Produktdatentypen Aussagen über die möglichen Ausprägungen und den Aufbau von Objekten.
Project Amber hat mit Sealed Classes und Records Summen- bzw. Produktdatentypen in Java eingeführt.
Somit wurde der Grundstein für Pattern Matching in Java gelegt.
In meinem [letzten Beitrag](https://www.adesso.de/de/news/blog/schmuckes-java-records-und-sealed-classes.jsp) habe ich die Veränderungen an Javas Typsystem beleuchtet und in diesem Beitrag werde ich den Stand von Pattern Matching in Java beleuchten.

# JEP 394 - Pattern Matching for instanceof
Wir alle haben schon einmal mit dem `instanceof`-Operator gearbeitet.
Dieser Operator prüft, ob das Objekt von einem bestimmten Typ ist.
Häufig wird dieser Operator mit einem Typcast und einem Objektzugriff kombiniert.
```java
return o instanceof String ? ((String)o).lenght() : 0;
```
Hier wird geprüft, ob `o` ein Objekt vom Typ String ist, `o` zum Typ `String` gecastet und dann auf die Methode `String#lenght()` zugegriffen.
Bei solchen Ausdrücken passiert es schnell, dass bei einem kleinen Refactoring eine Anpassung des Cast vergessen wird.
Dies führt zu einer unangenehmen `CalssCastException` zum Ausführungszeitpunkt.
Damit dies nicht mehr passiert, wurde mit [JEP 394](https://openjdk.org/jeps/394) das Typ-Pattern als erstes Pattern in Java 16 eingeführt.
Mit diesem Pattern ist es möglich, für Instanzen zu prüfen, ob sie von einem bestimmten Typ sind und diese danach typsicher zu verwenden.
Das Beispiel oben lässt sich mit Typ-Patterns folgendermaßen umformulieren:
```java
return o instanceof String s ? s.lenght() : 0;
```
Diese kompaktere Schreibweise hat neben den offensichtlichen auch noch einige subtilere aber umso schwergewichtigere Effekte.
Syntaktisch fällt auf, dass der Zieldatentyp nicht mehr doppelt angeben werden muss.
Der Cast wird automatisch durchgeführt und die neue Variable ist im positiven bzw. im "matched" Zweig der Anweisung definiert.
Zur Kompilierzeit können nun fehlerhafte Casts erkannt und als Kompilierfehler gemeldet werden.
Dadurch wird der Ausdruck semantisch einfacher zu verstehen und zu refaktorieren.

Komplex wird es, wenn das Pattern noch logisch mit `&&`, `||` oder `!` verknüpft wird. 
In diesem Fällen muss immer überlegt werden, "Welcher Zweig matched?", denn nur in diesem Zweig sind die Variablen aus dem Pattern definiert.
```java
return !(o instanceof String s) ? "Not Matched" : "Matched: " + s;
```
In diesem sehr einfachen Beispiel wird das Pattern negiert.
Dadurch "matched" das Pattern nur für den `else`-Zweig, also ist `s` auch nur hier definiert.
Eine noch größere Wirkung entfaltet dieses Pattern in Verbindung mit dem `switch` Statement bzw. der `switch` Expression.

# JEP 427 - Pattern Matching for switch
In einem vorherigen Beitrag habe ich `switch` als Expression eingeführt, in diesem Abschnitt können Expression und Statement austauschbar verwendet werden.
Mit [JEP 427](https://openjdk.org/jeps/427) befindet sich in Java 19 das Pattern Matching für `switch` in der dritten Previewphase, es können sich also noch Änderungen ergeben.
In diesem Schritt werden Patterns als Case-Labels für `switch` ermöglicht.
```java
switch (o) {
  case Triangle t -> System.out.println("Triangle");
  case Square s -> System.out.println("Square");
  default -> System.out.println("Something");
}
```
In dieser `switch` Expression wird der Datentyp des Objektes `o` mithilfe des Typ-Patterns aus [JEP 394](# JEP 394 - Pattern Matching for instanceof) geprüft.
Im Beispiel oben wird unterschieden, ob es sich um ein Dreieck oder ein Quadrat handelt.
Da es noch weitere mögliche Typen für `o` geben kann, muss ein `default`-Zweig eingeführt werden.
Durch die Kombination mit einer [Sealed-Hirachie](todo link zum letzten post) ist es möglich, dem Compiler auch diese Information mitzuteilen, sodass ein `default`-Zweig überflüssig wird.

Syntaktisch werden die Typ-Patterns als Case-Labels in einem `switch` verwendet und können mit sogenannten Guards zu Guarded Patterns kombiniert werden.
```java
switch (s) {
  case Triangle t when t.calculateArea() > 100 ->
    System.out.println("Large");
  case Triangle t -> System.out.println("Small");
  default -> System.out.println("Non-triangle");
}
```
Guarded-Patterns bestehen aus einem beliebigen Pattern und einem booleschen Ausdruck (Guard), getrennt durch ein `when`.
Der Zweig wird nur dann ausgewählt, wenn das Pattern "matched" und der Guard zu `true` evaluiert wird.
Im obigen Beispiel werden mittels eines Guarded Patterns die beiden Fälle große und kleine Dreiecke unterschieden.

Doch was passiert, wenn wir die Reihenfolge der Zweige für die großen und kleinen Dreiecke vertauschen?
Um dies zu lösen, wurde die Semantik der Pattern Dominance eingeführt.
Ein Pattern _a_ dominiert ein anders Pattern _b_, wenn alle Objekte, die _b_ "matched" auch von _a_ "gematched" werden, aber nicht umgekehrt.
Für unser Beispiel gilt:
1. `Triangle t when t.calculateArea() > 100` "matched" nur große Dreiecke
2. `Triangle t` "matched" alle Dreiecke

Also der zweite Zweig dominiert den ersten.
Sollten wir die Zweige vertauschen, wird das Guarded Pattern als unreachable Code erkannt und führt zu einem Kompilierfehler.
Eine umfassende Abhandlung zu dem Thema "Dominance of pattern labels" findet sich in der [JEP 427](https://openjdk.org/jeps/427) im Punkt 1b.
Doch Pattern Matching besteht aus mehr als eleganten Typchecks!

# JEP 405 - Record Patterns ~~and Array Patterns~~
Neben Prüfungen auf Datentypen gehört auch die Dekonstruktion von Objekten zum Umfang des Pattern Matching.
Mit [JEP 405](https://openjdk.org/jeps/405) hat das erste Deconstruction Pattern seinen ersten Previewauftritt in Java 19, Änderungen oder neue Patterns sind also möglich.
Als erstes Pattern wurde das Record Pattern ausgewählt, das ebenfalls im Titel enthaltene Array Pattern wurde auf eine zukünftige Version verschoben.
Deconstruction ist die komplementäre Operation zum Konstruktor, darum wundert es auch nicht, dass die Syntax sehr ähnlich ist.
```java
switch (o) {
    case Point(int x,var y) -> x+y;
    default -> 0;
}
```
In diesem Beispiel wird geprüft, ob `o` ein Punkt ist, wenn ja, werden die beiden Record-Komponenten extrahiert und lokalen Variablen zugewiesen.
Die neuen Variablen sind nun im "matched" Zweig verfügbar, eine Referenz auf den Punkt ist nicht verfügbar.
Records können weitere Records enthalten und es ist auch möglich, Record Patterns beliebig zu verschachteln.
Leider müssen in der aktuellen Version immer alle Komponenten extrahiert werden, in der [JEP 405](https://openjdk.org/jeps/405) wird aber der Plan skizziert, ein _Do-Not-Care_-Pattern einzuführen.
Mit diesem Pattern wäre es möglich, wie in Scala oder Kotlin Komponenten zu ignorieren.

# Zusammenfassung
In diesem Beitrag habe ich gezeigt, mit welchen großen Schritten Project Amber dem Ziel "Pattern Matching for Java" entgegeneilt.
Wir werden in der Zukunft noch viele weitere Patterns für Arrays, Generics und beliebige Klassen kennenlernen.
Über diese neuen Patterns und gefundene Best Practices werde ich an dieser Stelle berichten.