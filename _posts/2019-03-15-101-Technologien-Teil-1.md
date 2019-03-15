---
layout: [post, post-xml]
title:  "101 Technologien - Teil 1"
date:   2019-01-25 10:00
author: rzpio
categories: [Softwareentwicklung]
tags: [Kotlin, Spring Boot, Gradle]
---

Über Geschmack lässt sich bekanntlich streiten.
Das ist wohl einer der Gründe, weswegen zig Technologien existieren.
Es sind oftmals die feinen Details, in denen sich die Technologien voneinander unterscheiden.
Diese Blogreihe behandelt _Technologien allerlei_.
"Moderne" Technologien, die sich aktuell großer Beliebtheit erfreuen.

# "Have you ever seen so many puppies?"

<!-- TODO: Titelbild hinzufügen -->

Keine Sorge, Freunde mit Hundehaarallergie, ihr könnt beruhigt sein.
In dieser Blogreihe wird es nicht um Hunde gehen.
Dennoch passt die Analogie zu dem Klassiker vom Regisseur Wolfgang Reitherman.
Es gibt eine Menge Technologien.
Und es werden immer mehr!

Doch zunächst möchte ich auch einen kleinen Überblick darüber geben, was euch in diesem und den nächsten Blogartikeln erwartet.

Wir werden zusammen aus den _Technologien allerlei_ eine Beispielanwendung entwickeln.
Für diese Blogreihe sind vier Artikel geplant, wobei jeder Artikel sich mit anderen Technologien beschäftigt.
Der Spannung halber werde ich nicht alle Technologien zu Anfang an veraten, doch folgt ein kleiner Überblick.

- **1. Artikel:** _Initialisierung des Projektes + Programmiersprache_
- **2. Artikel:** _Benutzerverwaltung_
- **3. Artikel:** _Datenbank + API_
- **4. Artikel:** _Front-End_

**Was soll das eigentlich für eine Anwendung werden?**
Eine soziale Plattform, in der Nutzer Kurznachrichten posten und andere Nutzer folgen können.
Kommt euch bekannt vor?
Sehr gut, dann ist die Beispielanwendung perfekt gewählt.
Natürlich müssen wir zuerst die Anforderungen grob festlegen.
Der Nutzer soll...

- ... sich bei dem Dienst anmelden / abmelden.
- ... Kurznachrichten posten.
- ... andere Nutzer folgen & entfolgen.
- ... eine Timeline mit allen Kurznachrichten von gefolgten Nutzern und einem selber sehen.
- ... eine Liste mit allen verfügbaren Nutzern sehen.
- ... in der Liste der verfügbaren Nutzern Nutzer folgen / entfolgen.

# Lasst die Hunde los!

Zunächst müssen wir das Projekt für die Beispielanwendung initialisieren.
In den letzten Jahren hat sich ein Technologie-Stack etabliert, den auch wir nutzen wollen.
Dieser besteht aus zwei Technologien ... um die es in dieser Blogreihe nicht primär geht.
Aber ohne ein Fundament steht selbst das stabilste Haus nicht.
Wir werden _Spring Boot_ und Gradle.
Das Projekt kann mit dem wundervollen _Spring Initializr_ [[1]](#quellen) initialisiert werden.
Mit dem _Spring Initializr_ können wir ganz einfach unser Spring Boot-Projekt initialisieren, so wie auf der folgenden Abbildung.

<!-- TODO: Bild updaten mit Spring Boot 2.1.2 -->
![Spring Initializr](/assets/images/posts/101-Technologien/springInitializr.png)

**Kotlin?**
Aus Gewohnheit werden einige mit Sicherheit _with Java_ ausgewählt haben.
Keine Sorge, mir ist das auch passiert.
Aber in diesem Blogartikel soll es primär um Kotlin gehen.

Vorerst zurück zum Spring Initializr.
Wir wählen die aktuellste stabile Version von Spring Boot (2.1.2) und als _Build Management Tool_ Gradle.
Fehlen noch die Abhängigkeiten, wovon wir zum jetzigen Zeitpunkt nur **Web** und **Security** benötigen.
Group und Artifact können wir auf com.example und demo belassen.
Jetzt noch herunterladen, entpacken und in der Entwicklungsumgebung der Wahl (ich verwende IntelliJ) öffnen.
Mit dem Gradle-Task **bootRun** können wir die Anwendung bereits starten.

<!-- TODO: Bild mit Erklärung für Module hinzufügen -->
Unsere Beispielanwendung soll aus zwei Modulen bestehen.

- **api** - _Beinhaltet die main-Funktion und die Schnittstelle zur Außenwelt_
- **core** - _Beinhaltet die Konfiguration, Services, Entitäten, usw._

<!-- TODO: GIF für das Erstellen von einem Modul hinzufügen -->
Dafür müssen wir in unserem Projekt die Module anlegen.
In IntelliJ kann ein Modul über einen Rechtsklick aufs Projekt und dann _New -> Module_ hinzugefügt werden.
Nicht vergessen Kotlin (Java) auszuwählen und anschließend die ArtifactId, in unserem Fall also api und core, zu vergeben.

Gradle erstellt beim Anlegen eines Moduls eine build.gradle-Datei.
Den Inhalt dieser Dateien können wir zunächst in beiden Modulen löschen.
Beim Erstellen der Module kann es passieren, dass IntelliJ vergisst, die Module zu der settings.gradle hinzuzufügen.
Sollte dies zutreffen, müssen die Module nachträglich eingefügt werden.
In jedem Fall sollte die Datei wie folgt aussehen.

```groovy
rootProject.name = 'demo'
include 'api'
include 'core'
```

Aktuell befindet sich bis auf die build.gradle-Datei nichts in den Modulen.
Um dies zu ändern kopieren wir das src-Verzeichnis aus dem Stammverzeichnis und fügen es in beide Module ein.
Die Packages müssen noch um den jeweiligen Modulnamen erweitert werden.
Anschließend können wir das src-Verzeichnis im Stammverzeichnis löschen.

Im Stammverzeichnis selbst befindet sich ebenfalls eine build.gradle-Datei.
Innerhalb dieser sollen die zwei Module konfiguriert werden.
Dafür müssen alle Zeilen bis auf das Closure `buildscript { ... }` in das Closure `subproject { ... }` eingefügt werden.
Das Closure `subproject { ... }` gilt für alle Subprojekte, also Module in unserem Fall.

Damit die Referenzen zwischen den Modulen und Abhängigkeiten korrekt aufgelöst werden, muss die Zeile `apply plugin: 'org.springframework.boot'` entfernt und die folgenden Zeilen hinzugefügt werden. Ansonsten hagelt es _ReferenceUnkown_-Errors.

```groovy
dependencyManagement {
    imports {
        mavenBom("org.springframework.boot:spring-boot-dependencies:${springBootVersion}")
    }
}
```

Wir wollen Kotlin in der Version 1.3.11 verwenden.
Dazu muss die Version in der build.gradle geändert werden.
Aktuell kommt Gradle deswegen noch ein wenig durcheinander, weswegen wir zusätzlich eine gradle.properties-Datei benötigen.
In dieser muss ebenfalls die Kotlin-Version spezifiert werden.

```groovy
kotlin.version=1.3.11
```

Zum Schluss muss nur noch die build.gradle-Datei im api-Modul wie folgt angepasst werden.

```groovy
// Run-Task
apply plugin: 'application' 

// Main-Klasse
// Für eine Kotlin-Klasse wird ein "Kt" angehängt
mainClassName = 'com.example.demo.api.DemoApplicationKt'

// Das Modul "core" wird als Abhängigkeit
dependencies {
    implementation project(':core')
}
```

Das war es auch vorerst mit der Konfiguration.
Jetzt können wir uns endlich mit Kotlin befassen.

# Sitz, Pongo!

Beginnen wir mit einem Vergleich: [Google Trends](https://trends.google.de/trends/explore?date=today%205-y&q=Kotlin,Java,C%2B%2B)

Da kommt Kotlin aber nicht gut weg.
Zugegebenermaßen, der Vergleich hinkt ein wenig.
C++ und Java existieren bereits seit Jahrzenten.
Gerade Java hat sich mit der Zeit vermutlich auch zu **der** ersten Sprache eines herangehenden Entwicklers hervorgetan.
Ein [Vergleich](https://trends.google.de/trends/explore?date=today%205-y&q=Kotlin,Groovy) mit dem direkten Konkurrenten Groovy sieht dann schon etwas anders aus.
Kotlin konnte gerade im Jahre 2017 und 2018 an Interesse gewinnen.

Doch was ist Kotlin eigentlich?
Kotlin [[3]](#quellen) wird von JetBrains entwickelt.
Sie ist eine statisch typisierte Programmiersprache.
Das heißt, es werden bereits während der Kompilierung die Typen aller Variablen festgelegt.
Mit ihr entwickelte Programme werden in Bytecode übersetzt und dieser ist in der _Java Virtual Machine_ (JVM) lauffähig.
Neben der Möglichkeit der funktionalen Programmierung bietet die Sprache Null-Sicherheit, Typinferenz, Datenklassen und vieles mehr.
Einige dieser Funktionen wollen wir uns in diesem ersten Blogartikel der Blogreihe _101 Technologien_ anschauen.

## Programmieren mit Kotlin

In diesem Blogartikel werden wir uns nur die grundlegenden Funktionen, die wir in den nächsten Blogartikeln verwenden, von Kotlin anschauen.
In den nächsten Blogartikeln werden wir dann konkret an der Beispielanwendung entwickeln.

Dies hier ist leider nur ein kurzer Einblick in die Programmiersprache.
Doch wir haben noch viel vor uns.
Es erwarten uns noch weitere, spannende Technologien.

Wer Interesse hat, kann eines [dieser](https://kotlinlang.org/docs/books.html) zahlreichen Bücher auswählen, um einen tieferen Einblick in Kotlin gewährt zu bekommen.
Außerdem gibt es [hier](https://kotlinlang.org/docs/reference/) eine ausführliche Referenz zu Kotlin.
Und vielleicht erscheinen noch weitere Blogartikel, die sich tiefergehend mit der Materie auseinandersetzen ;).

### Semikolon

Semikolons werden nicht benötigt, denn Kotlin bietet uns Semikolon-Inferenz.
So ist folgender Codeschnipsel syntaktisch korrekt.

```kotlin
System.out.println("Hello World")
```

### Variable

Eine schreibgeschützte Variable wird mit dem Schlüsselwort `val` und eine veränderbare Variable mit dem Schlüsselwort `var` bezeichnet.

```kotlin
val user1 = User("Sebastian")
var user2 = User("Sebastian")

user1 = User("Max") // Error
user2 = User("Max") // Funktioniert
```

Eigentlich sollte das Wort **schreibgeschützt** hervorgehoben werden.
Denn eine schreibgeschützte Variable bedeutet nicht, dass diese sich nicht ändern kann.
Dazu ein kleines Beispiel.

```kotlin
class User {
    val birthYear: Int

    val age: Int {
        Calendar.getInstance().get(Calendar.YEAR) - birthYear;
    }
}
```

Vergeht ein Jahr, so wird sich auch der Inhalt von age ändern.

### Typinferenz

Kotlin ist statisch typisiert, nimmt uns aber die Arbeit ab, jeden Typen exakt anzugeben.

```kotlin
var username = "Sebastian"
username = 123 // Error
```

So ist die Variable username vom Typ String.
Der Compiler bricht mit einem Error beim Zuweisen von 123 ab, da der Integer-Wert 123 nicht dem Typ String entspricht.

### Interne Sichtbarkeit

Kotlin bietet uns mit dem Modifier `internal` die Möglichkeit, Elemente nur im eigenem Modul verfügbar zu machen.

```kotlin
// Folgende Zeile befindet sich im Modul api
val user = User("Sebastian") // Compiler bricht mit Error ab

// Folgende Zeile befindet sich im Modul core
internal data class User(val username: String)
```

Selbiges gilt für Eigenschaften, Funktionen, usw.

### Datenklasse

Klassen, die nur dazu dienen, Daten zu halten, werden Datenklassen genannt.
Innerhalb von Kotlin können diese mit `data` markiert werden.
Der Compiler generiert für solche Klassen Funktionen wie equals, hashCode und toString (zusätzlich noch componentN und copy, diese interessieren uns vorerst nicht).
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
System.out.println(user1 == user2) // true
```

### Null-Sicherheit

Jeder kennt sie, jeder liebt sie: Die `NullPointerException`.
Kotlin möchte damit brechen und bietet uns daher eine Null-Sicherheit.

```kotlin
var username: String = "Sebastian"
username = null // Compiler bricht mit Error ab
```

Der Compiler bricht mit einem Error ab.
Damit entfällt eine Fehlerquelle, denn so kann einer Variable nicht _ausversehen_ null zugewiesen werden.
Dennoch existieren Anwendungsfälle, in denen null erforderlich ist.
Beispielsweise wenn wir Daten aus einer Datenbank abfragen, die eventuell nicht vorhanden sind.
Ein kurzer Ausflug in die Welt von Java.

```java
// Null wird zurückgegeben, da Username nicht gefunden
private String username = userRepository.getUsernameById(1L);

...

if (username.length == 0) { // NullPointerException
    ...
}
```

Der Username kann gefunden, weswegen beim Abfragen der Länge eine NullPointerException geworfen wird.
Java bietet mittlerweile hierfür die Klasse [Optional](https://docs.oracle.com/javase/8/docs/api/java/util/Optional.html).
Damit ein Typ einen null-Wert annehmen kann, muss dieser mit `?` explizit gekennzeichnet werden.

```kotlin
var username: String? = "Sebastian"
username = null // Funktioniert
```

Variablen mit nullable-Typen können nicht ohne Weiteres verwendet werden.

```kotlin
System.out.println(username.length) // Compiler bricht mit Error ab
```

Es existieren vier Varianten, um diese Variablen zu verwenden, wovon wir in der Beispielanwendung zwei nutzen.
Wir nutzen den sicheren Aufruf (Safe Call) und den Evlis-Operator.
Für Entwickler, die ohne NullPointerExceptions nicht leben können, existiert der `!!`-Operator.
Dadurch wird jeder Wert in einen null-Typ konvertiert.
Ansonsten besteht für nicht veränderbare Variablen die Möglichkeit, mittels einer if-Verzweigung auf den null-Typ zu überprüfen (Funktioniert nicht für veränderbare Variablen, da ansonsten nach der Überprüfung null zugewiesen werden könnte).

Der **Safe Call** kann mit dem `.?`-Operatoren ausgeführt werden.

```kotlin
val username: String? = null
System.out.println(username?.length) // Funktioniert, es wird null ausgegeben
```

Mit dem Elvis-Operator **?:** können wir (ähnlich einer if-Verzweigung) überprüfen, ob der Wert vom null-Typ ist und eine Anweisung ausführen, ansonsten eine andere.

```kotlin
val username: String? = null
val length = username?.length ?: throw NotFoundException() // Exception wird geworfen

val username: String? = "123"
val length = username?.length ?: throw NotFoundException() // Der Wert 3 wird zugewiesen
``` 

# Fazit

In diesem Blogartikel haben wir grob die Anforderungen für die Beispielanwendung, die wir in den nächsten Blogartikeln entwickeln werden, erhoben.
Wir haben das Projekt initialisiert und konfiguriert.
Anschließend haben wir kurz die Programmiersprache Kotlin kennengelernt.
Wir haben uns einige Funktionen von Kotlin angeschaut.

Damit können wir uns im nächsten Artikel direkt in die Entwicklung werfen.