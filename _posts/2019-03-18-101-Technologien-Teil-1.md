---
layout: [post, post-xml]
title:  "101 Technologien (Teil 1) - Ein Projekt mit Kotlin, Spring Boot und Gradle aufsetzen"
date:   2019-03-18 09:00
author: zwiebelbrot
categories: [Softwareentwicklung]
tags: [101 Technologien, Kotlin, Spring Boot, Gradle]
---

Die Auswahl der Technologien ist für manch einen Entwickler eine Glaubensfrage.
Für andere wiederum ist die Suche nach der 'perfekten' Technologie so etwas wie der heilige Gral der Softwareentwicklung.
Diese Blogreihe beschäftigt sich mit 'modernen' Technologien, die sich aktuell großer Beliebtheit erfreuen.

# "Have you ever seen so many puppies?"

In dem Klassiker _101 Dalmatiner_ von Regisseur Wolfgang Reitherman tummeln sich jede Menge Hunde herum.
Ein Zeichentrickfilm über Technologien im Bereich der Softwareentwicklung würde wohl ähnlich ablaufen.
Front-End-Entwickler können ein Lied davon singen, denn gerade in diesem Bereich existieren schier unendlich viele Frameworks.
Doch auch im Back-End bewegt sich einiges.
In dieser Blogreihe schauen wir uns anhand einer Beispielanwendung fünf moderne Technologien an.
Für jede Technologie ist ein eigener Artikel geplant.
Hier eine kurze Übersicht der Themen und damit verbundenen Technologien, die uns erwarten:

- **1. Artikel:** _Initialisierung des Projektes mit Kotlin_
- **2. Artikel:** _Benutzerverwaltung mittels Keycloak_
- **3. Artikel:** _Datenbank mittels Neo4j_
- **4. Artikel:** _API mittels GraphQL_
- **5. Artikel:** _Front-End mittels Vue_

Die Beispielanwendung ist eine soziale Plattform, in der Nutzer Kurznachrichten posten und anderen Nutzern folgen können.
Doch zunächst die Anforderungen an die Beispielanwendung, damit wir die geforderten Funktionalitäten der Beispielanwendung kennen.
Der Nutzer soll...

- ... sich bei dem Dienst anmelden / abmelden.
- ... Kurznachrichten posten.
- ... eine Timeline mit allen Kurznachrichten von gefolgten Nutzern und sich selbst sehen.
- ... eine Liste mit allen verfügbaren Nutzern sehen.
- ... andere Nutzer folgen / entfolgen.

Die gesamte Beispielanwendung ist auf [GitHub](https://github.com/zwiebelbrot/keycloak-kotlin-graphql-neo4j-spring-vue-example) verfügbar.

# Initialisierung des Projekts

Ohne ein Fundament steht selbst das stabilste Haus nicht, weswegen die Beispielanwendung auf zwei bereits etablierten Technologien aufbaut, die nicht zu den oben bereits genannten Technologien zählen: [Spring Boot](https://spring.io/projects/spring-boot) und [Gradle](https://gradle.org/).
Mit diesen zwei Technologien wird uns eine Menge Arbeit erspart.
Mit ihnen können wir ohne größere Konfigurationen eine eigenständige Anwendung entwickeln und ausliefern.
Mit dem [Spring Initializr](https://start.spring.io/) können wir ein solches Projekt initialisieren.
Die Parameter können wir wie in der folgenden Abbildung auswählen.
Abhängigkeiten werden später händisch hinzugefügt, weswegen wir hier noch keine auswählen müssen.
_Group_ und _Artifact_ können wir beim Standard belassen.

![Initialisierung des Projekts mit Spring Initializr](/assets/images/posts/101-technologien/projekt.png)

Die Beispielanwendung soll in der Programmiersprache Kotlin entwickelt werden.
Kotlin ist somit die erste von den fünf modernen Technologien, die in dieser Blogreihe behandelt werden.
Bevor wir die Besonderheiten von Kotlin kennenlernen, muss jedoch die Beispielanwendung noch weiter konfiguriert werden.

Die Beispielanwendung soll aus den folgenden zwei Modulen bestehen:

- **api** - _Beinhaltet die main-Funktion und die Schnittstelle zur Außenwelt_
- **core** - _Beinhaltet die Konfiguration, Services, Entitäten, usw._

Module können wir beispielsweise in IntelliJ mittels eines Rechtsklick und dann auf _New -> Module_ hinzufügen.
Beim Hinzufügen eines Moduls müssen wir darauf achten, dass ir Kotlin anstatt Java auswählen.
Außerdem müssen wir die ArtifactId, also in unserem fall api und core, vergeben.
Es kann passieren, dass IntelliJ vergisst, die Module der settings.gradle-Datei hinzuzufügen.
Sollte dies zutreffen, müssen wir die Module nachträglich einfügen.
In jedem Fall sollte die Datei `settings.gradle` wie folgt aussehen:

```groovy
rootProject.name = 'demo'
include 'api'
include 'core'
```

Um die gewohnte Verzeichnisstruktur _src/..._ zu erhalten, können wir das src-Verzeichnis aus dem Stammverzeichnis kopieren und in beide Module einfügen.
Anschließend muss noch in beiden Modulen ein Package mit dem jeweiligen Modulnamen, also api und core, erzeugt werden.
Das src-Verzeichnis aus dem Stammverzeichnis können wir löschen.
Die Datei _DemoApplication.kt_ soll nur im api-Modul liegen, weswegen wir die Datei _DemoApplication.kt_ im core-Modul löschen können.
Außerdem können wir die Datei _application.properties_ im core-Modul löschen, da diese ebenfalls nur im api-Modul liegen soll.

Im Stammverzeichnis befindet sich die Datei `build.gradle`.
In dieser können wir die beiden Module konfigurieren.
Dafür müssen wir alle Zeilen bis auf das Closure `plugins { ... }` in das Closure `subprojects { ... }` einfügen.
Konfigurationen im Closure `subprojects { ... }` gelten für alle Module im Projekt. 
Hinter den drei Plugins (Spring Boot, Kotlin-JVM, Kotlin-Spring) im plugins-Closure müssen wir noch `apply false` hinzufügen.
Diese drei Plugins fügen wir wie im folgenden Listing in das subprojects-Closure ein, damit diese für jedes Modul angewendet werden.

```groovy
    apply plugin: 'org.springframework.boot'
    apply plugin: 'kotlin'
    apply plugin: 'kotlin-spring'
```

Außerdem können wir noch zusätzlich das Plugin `apply plugin: 'idea'` hinzufügen.
Das erleichtert das Importieren von Projekten in IntelliJ.
Im subprojects-Closure sollten nun die im Listing gezeigten Plugins aufgelistet sein.

```groovy
    apply plugin: 'org.springframework.boot'
    apply plugin: 'kotlin'
    apply plugin: 'kotlin-spring'
    apply plugin: 'idea'
    apply plugin: 'io.spring.dependency-management'
```

Zum Schluss müssen wir im api-Modul eine build.gradle-Datei hinzufügen.
Die sollte wie folgt aussehen:

```groovy
// Das Modul "core" wird als Abhängigkeit hinzugefügt
dependencies {
    implementation project(':core')
}
```

Die Konfiguration ist damit fertig.
Zumindest fast... es fehlen noch die Abhängigkeiten.
Diese kommen in den folgenden Artikeln hinzu.
Das initialisierte Projekt kann unter [hier](https://github.com/zwiebelbrot/keycloak-kotlin-graphql-neo4j-spring-vue-example/raw/master/backend/demo.zip) herunterladen werden.
Dort sind bereits alle Konfigurationen vorhanden, die in diesem Artikel vorgenommen wurden.

# Die Programmiersprache Kotlin

Zunächst ein Vergleich der Sprachen Kotlin, Java und C: [Google Trends](https://trends.google.de/trends/explore?date=today%205-y&q=Kotlin,Java,C)

Da kommt Kotlin aber nicht gut weg.
Zugegebenermaßen, der Vergleich hinkt ein wenig.
C und Java existieren bereits seit Jahrzenten.
Ein [Vergleich](https://trends.google.de/trends/explore?date=today%205-y&q=Kotlin,Groovy) mit dem direkten Konkurrenten Groovy sieht dann schon etwas anders aus.
Gerade in den Jahren 2017 und 2018 konnte Kotlin an Interesse gewinnen.

[Kotlin](https://kotlinlang.org/) wird von JetBrains entwickelt und ist eine statisch typisierte Programmiersprache.
Das heißt, es werden bereits während der Kompilierung die Typen aller Variablen festgelegt.
Mit ihr entwickelte Programme werden in Bytecode übersetzt und dieser ist in der _Java Virtual Machine_ (JVM) lauffähig.
Neben der Möglichkeit der funktionalen Programmierung bietet die Sprache Null-Sicherheit, Typinferenz, Datenklassen und vieles mehr.

## Programmieren mit Kotlin

In diesem Blogartikel kriegen wir leider nur einen kurzen Einblick in Kotlin.
Das Hauptaugenmerk dieser Blogreihe soll auf dem Präsentieren von modernen Technologien liegen.
Interessierte können mehr über Kotlin aus eines [der zahlreichen Bücher](https://kotlinlang.org/docs/books.html) erfahren.
Und vielleicht erscheinen noch weitere Blogartikel, die sich tiefergehend mit der Materie auseinandersetzen ;).
Im Folgenden schauen wir uns anhand kleinerer Beispiele einige der grundlegenden Funktionen an, die für die Beispielanwendung benötigt werden.

### Semikolon

Sie kommen in zahlreichen Programmiersprachen vor und treiben so manchen Entwickler zur Weißglut: die Semikolons.
Doch ich muss leider enttäuschen.
In Kotlin existieren Semikolons weiterhin.
Doch dank der Semikolon-Inferenz, also dem Herleiten von Semikolons anhand definierter Regeln, nimmt uns Kotlin eine potentiell nervige Fehlerquelle ab.
Dadurch muss am Ende eines Ausdrucks kein Semikolon stehen.
Zeilenumbrüche gewinnen durch die Semikolon-Inferenz jedoch an Bedeutung.
Folgendes Listing ist somit syntaktisch korrekter Kotlin-Quellcode.

```kotlin
System.out.print("Hello, ") // Es wird kein Semikolon benötigt
System.out.print("World") // Durch den Zeilenumbruch werden die Ausdrücke getrennt
```

### Variable

In Kotlin wird, ähnlich zu JavaScript, eine Variable mit den Schlüsselwörtern `val` und `var` angekündigt.
Eine veränderbare Variable wird mit dem Schlüsselwort `var` angekündigt.
Veränderbaren Variablen können beliebig oft neue Werte zugewiesen werden. 
Eine schreibgeschützte Variable wird hingegen mit dem Schlüsselwort `val` angekündigt.
Bei einer schreibgeschützten Variable ist nach einer Zuweisung Schluss.

```kotlin
val user1 = User("Sebastian")
var user2 = User("Sebastian")

user1 = User("Max") // Error
user2 = User("Max") // Funktioniert
```

Aber Vorsicht, schreibgeschützt ist nicht gleich _nicht veränderbar_.
Dazu ein kleines Beispiel:

```kotlin
class User {
    val birthYear: Int

    val age: Int {
        Calendar.getInstance().get(Calendar.YEAR) - birthYear;
    }
}
```

Die schreibgeschützte Variable `age` wird dynamisch berechnet.
Vergeht ein Jahr, so wird sich auch der Inhalt von age ändern.
Zwar kann beispielsweise nicht explizit mit `age = 18` ein neuer Wert der Variable zugewiesen werden, das bedeutet im Umkehrschluss aber nicht, dass der Wert der Variable sich nie verändert.

### Typinferenz

Neue Programmiersprachen versuchen den Entwicklern möglichst viel Schreibarbeit zu sparen, ohne die Aussagekraft des Quellcodes zu verändern.
Eine Möglichkeit kennen wir bereits: Die Semikolon-Inferenz.
In Kotlin kommt dazu noch die Typinferenz, also das Herleiten von Typen für Variablen anhand definierter Regeln.
Wie in dem folgenden Beispiel müssen wir also nicht den Typ der Variable angeben, wenn dieser klar ersichtlich ist.

```kotlin
var username = "Sebastian"
username = 123 // Error
```

So ist die Variable `username` vom Typ String.
Der Compiler bricht mit einem Error beim Zuweisen von 123 ab, da der Integer-Wert 123 nicht dem Typ String entspricht.
Denn Kotlin ist weiterhin eine statisch typisierte Programmiersprache, in der alle Typen bei der Kompilierung festgelegt werden.

### Interne Sichtbarkeit

Neben den Sichtbarkeitsmodifizierern `private`, `public` und `protected`, die in ähnlicher Form auch beispielsweise in Java vorkommen, existiert in Kotlin auch noch die Sichtbarkeit `internal`.
Elemente mit der Sichtbarkeit `internal` sind nur im eigenen Modul sichtbar, wie das folgende Beispiel verdeutlicht:

```kotlin
// Folgende Zeile befindet sich im Modul api
val user = User("Sebastian") // Compiler bricht mit Error ab

// Folgende Zeile befindet sich im Modul core
internal data class User(val username: String)
...
val user = User("Sebastian") // Funktioniert
```

### Datenklasse

Klassen, die nur dazu dienen, Daten zu halten, werden Datenklassen genannt.
Innerhalb von Kotlin können diese mit `data` markiert werden.
Der Compiler generiert für solche Klassen Funktionen wie beispielsweise `equals` und `hashCode`.
Alle Variablen innerhalb des Konstruktors werden dabei berücksichtigt.

```kotlin
// Die Datenklasse User
data class User(
    val username: String
) {
    var password: String = "123"
}

// Nur Variablen innerhalb des Konstruktors werden berücksichtigt
val user1 = User("Sebastian")
val user2 = User("Sebastian")
user1.password = "12345"
user2.password = "98765"
// Ruft die Methode equals von der Datenklasse User auf
System.out.println(user1 == user2) // true
```

### Null-Sicherheit

Jeder kennt sie, jeder liebt sie: Die _NullPointerException_.
Tony Hoare nennt die Erfindung der Null-Referenz seinen _billion-dollar mistake_ [(Quelle)](https://www.infoq.com/presentations/Null-References-The-Billion-Dollar-Mistake-Tony-Hoare).
Kotlin möchte damit brechen und bietet daher eine Null-Sicherheit.

```kotlin
var username: String = "Sebastian"
username = null // Compiler bricht mit Error ab
```

Der Compiler bricht mit einem Error ab.
Damit entfällt eine Fehlerquelle, denn so kann einer Variable nicht _aus Versehen_ `null` zugewiesen werden.
Dennoch existieren Anwendungsfälle, in denen `null` erforderlich ist.
Beispielsweise wenn wir Daten aus einer Datenbank abfragen, die eventuell nicht vorhanden sind.
Zur Verdeutlichung ein kurzer Ausflug in die Welt von Java.

```java
// Null wird zurückgegeben, da Username nicht gefunden
private String username = userRepository.getUsernameById(1L);

...

if (username.length == 0) { // NullPointerException
    ...
}
```

Der Username wird nicht gefunden und somit wird `null` von der Methode `getUsernameById` zurückgegeben, weswegen beim Abfragen der Länge des Usernamen eine `NullPointerException` geworfen wird.
Java bietet hierfür seit der Version 8 die Klasse [Optional](https://docs.oracle.com/javase/8/docs/api/java/util/Optional.html) an.
Kotlin löst die Null-Sicherheit auf einen anderen Weg.
Damit ein Typ einen null-Wert annehmen kann, wird dieser explizit mit `?` gekennzeichnet.

```kotlin
var username: String? = "Sebastian"
username = null // Funktioniert
```

Variablen mit nullable-Typen können nicht ohne Weiteres verwendet werden.

```kotlin
System.out.println(username.length) // Compiler bricht mit Error ab
```

Es existieren vier Varianten, um diese Variablen zu verwenden.
In der Beispielanwendung werden der sichere Aufruf (Safe Call) und der Elvis-Operator verwendet.
Für Entwickler, die ohne _NullPointerExceptions_ nicht leben können, existiert zusätzlich der `!!`-Operator.
Dadurch wird jeder Wert in einen null-Typ konvertiert.
Ansonsten besteht für nicht veränderbare Variablen die Möglichkeit, mittels einer if-Verzweigung auf den null-Typ zu überprüfen (Funktioniert nicht für veränderbare Variablen, da ansonsten nach der Überprüfung der Variable null zugewiesen werden könnte).

Der **Safe Call** wird mit dem `?`-Operator ausgeführt.
Dabei wird überprüft, ob der Wert nicht null ist.
Wenn dies zutrifft, wird der Wert verwendet, ansonsten wird null zurückgegeben, ohne eine _NullPointerException_ zu werfen.

```kotlin
val username: String? = null
System.out.println(username?.length) // Funktioniert, es wird null ausgegeben
```

Mit dem Elvis-Operator `?:` können wir (ähnlich einer if-Verzweigung) überprüfen, ob der Wert vom null-Typ ist und eine bestimmte Anweisung ausführen, ansonsten eine andere.

```kotlin
val username: String? = null
val length = username?.length ?: throw NotFoundException() // Exception wird geworfen

val username: String? = "123"
val length = username?.length ?: throw NotFoundException() // Der Wert 3 wird zugewiesen
``` 

# Fazit

Die vorgestellten Funktionen von Kotlin existieren in ähnlicher Form auch in anderen Programmiersprachen, denn Technologien bauen in der Regel aufeinander auf.
Java wurde beispielsweise maßgeblich von Smalltalk beeinflusst.
Doch neue Technologien ermöglichen es, immer schneller & effizienter sichere Anwendungen zu entwickeln.
_Boilerplate code_ wird vermieden und die Entwickler können sich auf das Wesentliche konzentrieren.

In diesem ersten Artikel der Blogreihe '101 Technologien' haben wir das Projekt für die Beispielanwendung initialisiert.
Außerdem haben wir die grundlegenden Funktionen von Kotlin kennengelernt, die für die nächsten Blogartikel benötigt werden.
Im nächsten Blogartikel schauen wir uns an, wie wir mittels der Technologie Keycloak die Benutzerverwaltung für die Beispielanwendung einrichten.
Bis demnächst!
