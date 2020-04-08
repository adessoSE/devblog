---
layout: [post, post-xml]              # Pflichtfeld. Nicht ändern!
title:  "Rust für Java-Entwickler - Teil 1" # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2020-04-07 14:00              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2020-04-07             # Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author: kiliankrause                  # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: [Softwareentwicklung]     # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Rust, Actix-Web]               # Bitte auf Großschreibung achten.
---

Wenn wir darüber nachdenken in welcher Sprache bzw. mit welchem Framework wir eine REST-API implementieren wollen, sind Technologien wie Java und Spring vermutlich sehr weit vorne.
Und das nicht ohne Grund.
In der Java-Welt gibt es sehr viele Frameworks und Bibliotheken, die sich bewährt haben und einen großen Funktionsumfang bieten.
In diesem Artikel wollen wir uns Einblick in die (noch junge) Programmiersprache Rust verschaffen und eine kleine REST-API mit dem Actix-Web Framework implementieren.


# Was du mitbringen solltest

Da ich hauptsächlich das Framework - und nicht die Sprache an sich - vorstellen will, solltest du grundlegende Kenntnisse zur Sprache mitbringen.
Einen guten Einstieg hierfür bietet das Buch [The Rust Programming Language](https://doc.rust-lang.org/book/title-page.html).

## Ein neues Projekt aufsetzen

Zuerst erstellen wir uns ein neues Projekt.
Das machen wir mit dem Package-Manager *Cargo*.
Dazu führen wir den Befehl `cargo new <projekt-name> --bin` in unserem Workspace aus.
Um Actix zu verwenden, geben wir die Dependency in der Cargo.toml (vergleichbar mit einer build.gradle oder pom.xml Datei) an.

```rust
[dependencies]
actix-web = "1.0.8" // latest version
```

# Unsere REST-API

In unserer Beispielanwendung wollen wir Personen verwalten.
Dazu werden wir eine kleine und einfache REST-API erstellen.
Wir wollen die Möglichkeit haben eine Person zu erstellen, zu löschen und zu bearbeiten.
Außerdem wollen wir Endpoints definieren, die uns alle oder auch einzelne (durch ihre ID identifizierbare) Personen liefern.
Wir werden also fünf verschiedene Endpoints implementieren müssen, die wie folgt aussehen:


* GET &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /persons   
* GET &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /persons/id
* POST &nbsp;&nbsp;&nbsp; /persons   
* PUT &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /persons/id
* DELETE /persons/id


# Request Handler

Um Anfragen an unsere API annehmen zu können, müssen wir sogenannte Request Handler (im Folgenden auch durch RH abgekürzt) implementieren.
Ein RH ist eine Funktion, die Null oder mehrere Parameter entgegennimmt und einen Wert zurückgibt, der das `Responder`-Trait implementiert.
Datentypen und -strukturen, die das `Responder`-Trait implementieren, werden dann vom Framework zu einer [HTTP-Response](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) konvertiert.
So wird sichergestellt, dass nur Typen zurückgegeben werden, die in eine HTTP-Response konvertiert werden können.

## Request-Handler Beispiel

Betrachten wir ein Request-Handler Beispiel.
Dazu definieren wir eine Funktion die vorerst keinen Parameter annimmt und die einen Wert zurückliefert, der das `Responder`-Trait implementiert.
Actix-Web bietet einige default-Implementierungen des `Responder`-Traits für gebräuchliche Datentypen und -strukturen an.
So auch für den Datentyp `String`.
Unser RH könnte dann so aussehen:

```Rust
fn request_handler() -> impl Responder {
    "Hello world!".to_owned()
}
```

Anstatt einer Referenz liefert uns `to_owned()` an dieser Stelle einen Wert vom Typ String.

Wir müssen nun definieren unter welcher Anfrage diese Funktion aufgerufen werden soll.
Bevor wir das tun, untersuchen wir zunächst den `HTTP-Server` und die `App` von Actix-Web.
`to_owned()` ist ein Rust-Feature & liefert uns an dieser Stelle den gewünschten String statt seiner Referenz.

### HttpServer und App-Instanz

Mithilfe des Frameworks sind wir in der Lage einen HTTP-Server zu erstellen in dem unsere Applikation läuft.
Dazu müssen wir eine neue Instanz des `HttpServer`-Structs erstellen und angeben wo dieser laufen soll (IP-Adresse und Port).

Dies geben wir mit der `bind()`-Methode an.
In dem HTTP-Server erstellen wir anschließend unsere App-Instanz.
Hier geben wir auch an, bei welcher Anfrage unser Beispiel-RH aufgerufen werden soll.

Für unser Beispiel könnten wir einfach den Root-Pfad der URL angeben und mit einem [GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET) abrufen.
Wir erhalten somit folgende main-Funktion:

```Rust
fn main() {
    HttpServer::new(|| {
        App::new()
          .route("/", web::get().to(request_handler))
    })
    .bind("127.0.0.1:8099")
    .unwrap()
    .run()
    .unwrap();
}
```

Unser Server läuft nun lokal auf dem Port 8099. Der RH wird immer dann aufgerufen, wenn eine GET-Anfrage auf die Route `/` erfolgt.
Wir haben jetzt bereits eine vollständige Actix-Web-App erstellt und können diese ausführen.
Dazu rufen wir im Browser den localhost auf Port 8099 auf und erhalten folgende Ausgabe:

![Beispiel-Request-Handler](/assets/images/posts/Rust-für-Java-Entwickler-Teil-1/beispiel-request-handler.png)

### Syntaktischer Zucker

Anstatt die Route und das HTTP-Verb mittels zusätzlichen Methoden zu definieren, haben wir auch die Möglichkeit sie mittels Makro-Attributen zu beschriften.
Diese können wir uns wie Java-Annotationen vorstellen.
Für unseren Request Handler würde das dann so aussehen:

```rust
#[get("/")]
fn request_handler() -> impl Responder {
    "Hello world!".to_owned()
}
```

Somit können wir uns in der main-Funktion `.route("/", web::get().to(request_handler))` sparen und können stattdessen die `serivce()`-Methode der App-Instanz aufrufen, um unseren RH als Parameter zu übergeben:

```rust
App::new().service(request_handler)
```

Semantisch sind beide Vorgehensweisen völlig identisch.
Bei den Makro-Attributen handelt es sich somit um syntaktischen Zucker der das Programmieren erleichtert.

Wir wissen jetzt wie ein Request Handler definiert und in die App eingebunden wird.
Um die REST-API sinnvoll zu verwenden, brauchen wir ein Datenmodell.

# Unser Datenmodell

Wir halten unser Datenmodell so schlicht wie möglich, um unnötige Komplexität zu vermeiden.
Unsere Personen-Struktur sieht deshalb wie folgt aus:

```rust
pub struct Person {
    id: u32,
    name: String,
    age: u32
}
```

Eine Person hat eine ID, einen Namen und ein Alter.
Wir stellen einen Konstruktor, Getter und Setter zur Verfügung:

```rust
impl Person {
    pub fn new(id: u32, name: String, age: u32) -> Self {
        Person { id, name, age }
    }

    pub fn id(&self) -> u32 {
        self.id
    }

    pub fn name(&self) -> &String {
        &self.name
    }

    pub fn age(&self) -> u32 {
        self.age
    }

    pub fn set_name(&mut self, name: String) {
        self.name = name;
    }

    pub fn set_age(&mut self, age: u32) {
        self.age = age;
    }
}
```

# Implementierung der REST-API

Zunächst implementieren wir einen REST-Endpoint der uns alle Personen bereitstellt.
Diese sollen uns als JSON-Objekte vom Server geliefert werden.
Für die Kommunikation mittels JSON bietet Actix-Web uns eine entsprechende Struktur, die wir importieren müssen.

```rust
use actix_web::web::{Json};
```

Unseren Request Handler können wir dann wie folgt definieren:

```rust
#[get("/persons")]
pub fn get_all() -> Json<Vec<Person>> {
    // ...
}
```

Diese Funktion wird immer dann aufgerufen, wenn wir einen GET-Request auf dem `/persons`-Pfad erhalten.
Sie liefert uns die JSON-Repräsentation eines Vektors von Personen-Instanzen.
Ein­fach­heits­hal­ber wollen wir an dieser Stelle nicht mit einer Datenbank oder dem Dateisystem kommunizieren.
Wir nehmen an, dass die Persistenzschicht uns einen Personen-Vektor liefert.

```rust
#[get("/persons")]
pub fn get_all() -> Json<Vec<Person>> {
    // Kommunikation mit der Datenbank oder dem Dateisystem
    // Wir initialiseren den Vektor an dieser Stelle händisch
    let micheal = Person::new(1, "Micheal".to_owned(), 32);
    let frank = Person::new(2, "Frank".to_owned(), 28);
    let persons = vec![micheal, frank];
    Json(persons)
}
```

Unglücklicherweise kompiliert unser Code jetzt nicht.
Actix-Web weiß nicht wie aus unserer Personen-Struktur ein JSON-Objekt erzeugt werden soll.
An dieser Stelle müssen wir eine weitere Bibliothek in unser Projekt einbinden, die "serde" heißt und Serialisierung und Deserialisierung von JSON-Objekten ermöglicht.
Wir ergänzen also unsere Cargo.toml:

```rust
[dependencies]
actix-web = "1.0.8"
serde = "1.0.101"
```

Mit serde kann man selbst definierte Strukturen in JSON-Objekte sehr einfach serialisieren bzw. die entsprechenden JSON-Objekte wieder deserialisieren.
Dafür müssen wir nur unsere Personen-Struktur wie folgt erweitern:

```rust
#[derive(Serialize, Deserialize)]
struct Person {
    // ...
}
```

Serde konvertiert die Werte vom Typ u32 und String nun in JSON-Objekte.
Da unsere Personen-Struktur nur aus diesen Typen besteht, können wir das `Serialize`- und `Deserialize`- Trait mithilfe des `derive`-Makros angeben.
Schon kompiliert unser Code.

Wenn wir jetzt den Endpoint ansprechen, liefert uns der Server folgende Antwort:

![GET-persons-Request](/assets/images/posts/Rust-für-Java-Entwickler-Teil-1/get-persons-request.png)


## Dynamische URL-Parameter

Als nächstes wollen wir einen Endpoint für das Lesen einer Person über ihre ID implementieren.
Dazu müssen wir dynamische URL-Parameter an unsere Request Handler weitergeben.
Die dynamischen Parameter werden in Actix-Web in geschweiften Klammern angegeben.
Die Route für unseren GET-Request mit einer Personen ID sieht also wie folgt aus:

```rust
#[get("/persons/{id}")]
```

Die angegebene ID in der URL müssen wir dem RH dann als Eingabe-Parameter übergeben.
Außerdem wollen wir die Person als JSON-Objekt geliefert bekommen:

```rust
#[get("/persons/{id}")]
pub fn get(id: u32) -> Json<Person> {
}
```

Wir erhalten jedoch einen Compilerfehler, wenn wir versuchen das Projekt zu bauen.
Das liegt daran, dass jeder Eingabe-Parameter eines RHs das `FromRequest`-Trait implementieren muss. Das ist für den Typ u32 nicht der Fall.

Glücklicherweise hilft uns Actix-Web auch hier weiter.
Es bietet eine `Path`-Struktur die als Wrapper für Request-Parameter dient.
Wir müssen unsere ID also in einem Path wrappen:

```rust
#[get("/person/{id}")]
pub fn get(id: Path<u32>) -> Json<Person> {
}
```

Der Typ Path implementiert das `Deref`-Trait.
Um also an unseren Wert vom Typ u32 zu gelangen, muss die Variable dereferenziert werden.
Auch hier wollen wir zunächst nur einen Dummy-Wert zurückgeben.

Wir können uns allerdings vorstellen, dass an dieser Stelle mit einer Datenbank kommuniziert und eine Person mit der entsprechenden ID geliefert wird.

```rust
#[get("/person/{id}")]
pub fn get(id: Path<u32>) -> Json<Person> {
    let person = Person::new(*id, "Tom".to_owned(), 38);
    Json(person)
}
```

## Erstellen einer Person

Wenn wir eine Person erstellen wollen, müssen wir den Namen und das Alter der Person in einem entsprechenden Request angeben.
Wir wollen aber keine ID explizit angeben - das ist normalerweise die Aufgabe der Datenbank.
Wir müssen also eine neue Struktur definieren, die wir hier NewPerson nennen:

```rust
#[derive(Serialize, Deserialize)]
pub struct NewPerson {
    pub name: String,
    pub age: u32
}
```

Auch hier müssen wir wieder `Serialize` und `Deserialize` mithilfe des derive-Makros verwenden, um die entsprechende Struktur als JSON-Body in einem Request anzugeben.
Unser RH für das Erstellen einer Person sieht dann so aus:

```rust
#[post("/persons")]
pub fn create(person: Json<NewPerson>) -> String {
    // Erstellen der Person in der Datenbank oder in einer Datei o.Ä.
}
```

Um es simpel zu halten, geben wir zunächst nur einen String zurück.
Dieser könnte angeben, ob das Erstellen der Person erfolgreich war oder nicht.

Im Fehlerfall könnte auch eine entsprechende Fehlermeldung geworfen werden.

## Modifizieren einer Person

Wenn wir eine Person modifizieren wollen, verändern wir entweder seinen Namen, sein Alter oder beides.
Der Request soll die Änderungen auch hier im JSON-Body tragen.
Also müssen wir an dieser Stelle eine neue Struktur definieren, die unseren Anforderungen gerecht wird:

```rust
#[derive(Serialize, Deserialize)]
pub struct UpdatePerson {
    pub name: Option<String>,
    pub age: Option<u32>
}
```

Der einzige Unterschied zur `NewPerson`-Struct ist, dass wir den Namen bzw. das Alter nicht angeben *müssen*.
Unser Request Handler könnte dann so aussehen:

```rust
#[put("/persons/{id}")]
pub fn update(id: Path<u32>, person: Json<UpdatePerson>) -> String {
    // ...
}
```

## Löschen einer Person

Das Löschen einer Person benötigt keine neuen Funktionen oder Techniken des Frameworks.
Ohne weitere Erläuterungen sieht der Request Handler wie folgt aus:

```rust
#[delete("/persons/{id}")]
pub fn delete(id: Path<u32>) -> String {
    // ...
}
```

Wir haben nun alle Request Handler für unsere REST-API definiert.

# Fazit

In diesem Artikel haben wir gelernt wie eine REST-API mit dem Actix-Web Framework implementiert werden kann.
Dabei haben wir bereits wichtige Funktionen des Frameworks verwendet: 
- Request Handler 
- Routen
- Dynamische URL-Parameter 
- Kommunikation mittels JSON

Mit ein wenig Erfahrung in Rust ist der Einstieg in das Framework nicht sehr schwer.
Die [offizielle Dokumentation](https://actix.rs/docs/) ist die beste Anlaufstelle, um tiefer einzusteigen.

Natürlich bietet das Framework noch einiges mehr an Funktionalität als in diesem Artikel beschrieben wurde.
Weitere Aspekte wie die Kommunikation mit einer Datenbank, Fehlerbehandlung und Unit- bzw. Integration-Tests behalten wir uns für weitere Blog-Artikel vor.

Als Teaser finden interessierte Leser in diesem [Github-Repository](https://github.com/KilianKrause/rest-api-with-actix) eine erweiterte Version des Codes, die eine rudimentäre Kommunikation mit dem Dateisystem implementiert.

Ein Beispiel für eine vollständige App mit Actix-Web ist z.B. [hier](https://github.com/fairingrey/actix-realworld-example-app) zu finden.
Dort wird auch ein ORM für die Speicherung der Personen in einer Datenbank eingesetzt.
