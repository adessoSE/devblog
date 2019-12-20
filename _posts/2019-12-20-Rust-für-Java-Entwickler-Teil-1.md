---
layout: [post, post-xml]              # Pflichtfeld. Nicht ändern!
title:  "Rust für Java-Entwickler - Teil 1" # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2019-12-20 10:00              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2019-12-20             # Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author: kiliankrause                  # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: [Softwareentwicklung]     # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Rust, Actix-Web]               # Bitte auf Großschreibung achten.
---

Wenn wir darüber nachdenken, in welcher Sprache bzw. mit welchem Framework wir eine REST-API implementieren wollen, sind Technologien wie Java und Spring vermutlich sehr weit vorne.
Und das nicht ohne Grund.
In der Java-Welt gibt es sehr viele Frameworks und Bibliotheken, die sich bewährt haben und einen großen Funktionsumfang bieten.
In diesem Artikel wollen wir uns einen Einblick in eine andere Technologie verschaffen und eine kleine REST-API mit dem Actix-Web Framework implementieren.
Hierbei handelt es sich um ein Web-Framework für die (noch junge) Programmiersprache Rust.


# Was du mitbringen solltest

Da ich hauptsächlich das Framework - und nicht die Sprache an sich - vorstellen will, solltest du grundlegende Kenntnisse zur Sprache mitbringen.
Einen guten Einstieg hierfür bietet das Buch [The Rust Programming Language](https://doc.rust-lang.org/book/title-page.html).


# Ein neues Projekt aufsetzen

Zuerst erstellen wir uns ein neues Projekt.
Das machen wir am besten mit dem Package-Manager *Cargo*.
Dazu führen wir den Befehl ```cargo new <projekt-name> --bin``` in unserem Workspace aus.
Bevor wir beginnen können, müssen wir noch die entsprechende Actix-Dependency in der Cargo.toml angeben.

```rust
[dependencies]
actix-web = "1.0.8" // latest version
```

# Unsere REST-API

In unserer Beispielanwendung wollen wir Personen verwalten.
Dazu werden wir eine kleine und einfache REST-API zur Verfügung stellen.
Wir wollen die Möglichkeit haben, eine Person zu erstellen, zu löschen und zu modifizieren.
Außerdem wollen wir Endpoints zur Verfügung stellen, die uns alle oder auch einzelne (durch ihre ID identifizierbare) Personen liefern.
Wir werden also fünf verschiedene Endpoints implementieren müssen, die wie folgt aussehen:


* GET &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /persons   
* GET &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /persons/id
* POST &nbsp;&nbsp;&nbsp; /persons   
* PUT &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /persons/id
* DELETE /persons/id


# Request Handler

Um Requests verarbeiten zu können, müssen wir sogenannte Request Handler (im Folgenden auch durch RH abgekürzt) implementieren.
Ein RH ist eine Funktion, die Null oder mehrere Parameter entgegennimmt und einen Wert zurückgibt, der das ```Responder```-Trait implementiert.
Datentypen und -strukturen, die das ```Responder```-Trait implementieren, werden dann vom Framework zu einer HTTP-Response konvertiert.
So wird sichergestellt, dass nur Typen zurückgegeben werden, die in eine HTTP-Response konvertiert werden können.

## Ein kleiner Beispiel-Request-Handler

Um die Funktionsweise von RHs zu verstehen, werden wir uns einen kleinen Beispiel-Request-Handler erstellen.
Dazu definieren wir eine Funktion, die vorerst keinen Parameter annimmt und die einen Wert zurückliefert, der das ```Responder```-Trait implementiert.
Actix-Web bietet einige default-Implementierungen des ```Responder```-Traits für gebräuchliche Datentypen und -strukturen an.
So auch für den Datentyp ```String```.
Unser RH könnte dann so aussehen:

```Rust
fn request_handler() -> impl Responder {
    "Hello world!".to_owned()
}
```

Wir müssen nun irgendwie definieren, wo und wann diese Funktion aufgerufen werden soll.
Bevor wir das machen können, müssen wir uns einmal den ```HTTP-Server``` und die ```App``` von Actix-Web angucken.

### HttpServer und App-Instanz

Mithilfe des Frameworks sind wir in der Lage, einen HTTP-Server zu erstellen, in dem unsere Applikation läuft.
Dazu müssen wir eine neue Instanz des HttpServer-Structs erstellen und angeben, wo dieser laufen soll (IP-Adresse und Port).
Dies geben wir mit der ```bind()```-Methode an.
In dem HTTP-Server erstellen wir dann unsere App-Instanz.
Hier geben wir dann auch an, bei welchem Request unser Beispiel-RH aufgerufen werden soll.
In unserem Beispiel könnten wir z.B. einfach den Root-Pfad der URL angeben und als HTTP-Verb ```GET``` angeben.
Wir erhalten folgende main-Funktion:

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

Somit läuft unser Server auf dem localhost auf Port 8099 und der RH wird immer dann aufgerufen, wenn eine GET-Anfrage auf die Route ```/``` erfolgt.
Wir haben bereits jetzt eine vollständige Actix-Web-App erstellt und können diese ausführen.
Dazu sprechen wir einfach im Browser den localhost auf Port 8099 an und erhalten folgende Ausgabe:

![Beispiel-Request-Handler](/assets/images/posts/Rust-für-Java-Entwickler-Teil-1/beispiel-request-handler.png)

### Syntaktischer Zucker

Anstatt die Route und das HTTP-Verb über die entsprechenden Methoden zu definieren, haben wir auch die Möglichkeit, dies über Makro-Attribute zu definieren.
An dieser Stelle können wir uns diese wie Java-Annotationen vorstellen.
Für unseren Request Handler würde das dann so aussehen:

```rust
#[get("/")]
fn request_handler() -> impl Responder {
    "Hello world!".to_owned()
}
```

In unserer main-Funktion müssen wir dann nur noch die ```serivce()```-Methode der App-Instanz aufrufen, und unseren RH als Parameter übergeben:

```rust
App::new().service(request_handler)
```

Semantisch sind beide Vorgehensweisen völlig identisch.
Bei den Makro-Attributen handelt es sich also im Prinzip um syntaktischen Zucker.

Wir wissen jetzt, wie wir einen Request Handler definieren können und wie wir ihn in die App einzubinden haben.
An dieser Stelle wollen wir mit unserer kleinen REST-API beginnen und im Laufe des Artikels werden wir weitere Techniken von Actix-Web kennenlernen.
Starten wollen wir mit dem Datenmodell.

# Unser Datenmodell

Bevor wir die verschiedenen RHs für unsere Beispielanwendung implementieren, müssen wir vorerst unser Datenmodell definieren.
Dieses halten wir so schlicht wie möglich, um unnötige Komplexität zu vermeiden.
Unsere Personen-Struktur würde dann wie folgt aussehen:

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

Zunächst wollen wir unseren REST-Endpoint implementieren, der uns alle Personen liefert.
Diese sollen uns als JSON-Objekte vom Server geliefert werden.
Für die Kommunikation mittels JSON stellt uns Actix-Web eine entsprechende Struktur zur Verfügung, die wir importieren müssen.

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

Diese Funktion wird immer dann aufgerufen, wenn wir einen GET-Request auf dem ```/persons```-Pfad erhalten.
Sie liefert uns die JSON-Repräsentation eines Vektors von Personen-Instanzen.
Der Einfachheit halber wollen wir an dieser Stelle nicht mit einer Datenbank oder dem Dateisystem kommunizieren.
Wir nehmen einfach an, dass wir einen Vektor von Personen aus der Persistenzschicht geliefert bekommen.

```rust
#[get("/persons")]
pub fn get_all() -> Json<Vec<Person>> {
    // Kommunikation mit der Datenbank oder dem Dateisystem
    // Wir initialiseren uns den Vektor an dieser Stelle manuell
    let micheal = Person::new(1, "Micheal".to_owned(), 32);
    let frank = Person::new(2, "Frank".to_owned(), 28);
    let persons = vec![micheal, frank];
    Json(persons)
}
```

Unglücklicherweise kompiliert unser Code nicht.
Doch woran liegt das?
Actix-Web weiß nicht, wie aus unserer Personen-Struktur ein JSON-Objekt erzeugt werden soll.
An dieser Stelle müssen wir eine weitere Bibliothek in unser Projekt einbinden, die "serde" heißt und Serialisierung und Deserialisierung von JSON-Objekten ermöglicht.
Wir ergänzen also unsere Cargo.toml:

```rust
[dependencies]
actix-web = "1.0.8"
serde = "1.0.101"
```

Mit serde kann man auf sehr einfache Art und Weise selbst definierte Strukturen in JSON-Objekte serialisieren bzw. die entsprechenden JSON-Objekte wieder deserialisieren.
Dafür müssen wir nur unsere Personen-Struktur wie folgt erweitern:

```rust
#[derive(Serialize, Deserialize)]
struct Person {
    // ...
}
```

Serde weiß, wie es Werte vom Typ u32 und String in JSON-Objekte konvertiert.
Da unsere Personen-Struktur nur aus diesen Typen besteht, können wir das ```Serialize```- und ```Deserialize```- Trait mithilfe des ```derive```-Makros angeben.
Schon kompiliert unser Code.

Wenn wir jetzt den Endpoint ansprechen, liefert uns der Server folgende Antwort:

![GET-persons-Request](/assets/images/posts/Rust-für-Java-Entwickler-Teil-1/get-persons-request.png)

Als nächstes wollen wir unseren Endpoint für das Lesen einer Person über ihre ID implementieren.
Doch wie können wir dynamische URL-Parameter an unsere Request Handler weitergeben?
Damit beschäftigen wir uns im folgenden Abschnitt.

## Dynamische URL-Parameter

Wir wollen in unserer Beispiel-Applikation die Möglichkeit haben, eine Person über ihre ID mit einem GET-Request zu lesen.
Dafür muss uns das Framework die Möglichkeit bieten, nicht nur statische, sondern auch dynamische URLs für Request Handler zu definieren.
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

Wir erhalten jedoch einen Compilerfehler, wenn wir versuchen, das Projekt zu bauen.
Das liegt daran, dass jeder Eingabe-Parameter eines RHs das ```FromRequest```-Trait implementieren muss (was offensichtlich für den Typ u32 nicht der Fall ist).
Glücklicherweise hilft uns Actix-Web auch hier weiter.
Es bietet die Path-Struktur an, welche als Wrapper für Request-Parameter dient.
Wir müssen also nur unsere ID in einem Path wrappen:

```rust
#[get("/person/{id}")]
pub fn get(id: Path<u32>) -> Json<Person> {
}
```

Der Typ Path implementiert das ```Deref```-Trait.
Um also an den Wert (in unserem Fall  ein Wert vom Typ u32) zu gelangen, kann man einfach die Variable dereferenzieren.
Auch hier wollen wir zuerst wieder nur Dummy-Werte zurückgeben.
Wir können uns aber vorstellen, dass wir an dieser Stelle mit einer Datenbank kommunizieren, die uns eine Person mit der entsprechenden ID liefert.

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

Auch hier müssen wir wieder ```Serialize``` und ```Deserialize``` mithilfe des derive-Makros angeben, denn wir wollen ja die entsprechende Struktur als JSON-Body in einem Request angeben.
Unser RH für das Erstellen einer Person sieht dann so aus:

```rust
#[post("/persons")]
pub fn create(person: Json<NewPerson>) -> String {
    // Erstellen der Person in der Datenbank oder in einer Datei o.Ä.
}
```

Der Einfachheit halber wollen wir hier zunächst nur einen String zurückgeben.
Dieser könnte angeben, ob das Erstellen der Person erfolgreich war oder nicht.
Im Fehlerfall könnte dann eine entsprechende Fehlermeldung zurückgegeben werden.
Auf eine ausgiebige und konsistente Fehlerbehandlung gehen wir hier nicht ein.

## Modifizieren einer Person

Wenn wir eine Person modifizieren wollen, dann wollen wir entweder seinen Namen, sein Alter oder beides ändern.
Auch hier wollen wir im Request wieder die Änderungen als JSON-Body darstellen.
Also müssen wir an dieser Stelle eine neue Struktur definieren, die unseren Anforderungen gerecht wird:

```rust
#[derive(Serialize, Deserialize)]
pub struct UpdatePerson {
    pub name: Option<String>,
    pub age: Option<u32>
}
```

Der einzige Unterschied zum NewPerson-Struct ist, dass wir den Namen bzw. das Alter nicht angeben *müssen*.
Unser Request Handler könnte dann so aussehen:

```rust
#[put("/persons/{id}")]
pub fn update(id: Path<u32>, person: Json<UpdatePerson>) -> String {
    // ...
}
```

## Löschen einer Person

Beim Löschen einer Person gibt es keine neuen Funktionen oder Techniken des Frameworks, die vorzustellen wären.
Deshalb kurz und knapp - hier ist unser Request Handler:

```rust
#[delete("/persons/{id}")]
pub fn delete(id: Path<u32>) -> String {
    // ...
}
```

Wir haben nun alle Request Handler für unsere REST-API definiert.
Die Kommunikation mit einer Datenbank haben wir der Übersichtlichkeit und Einfachheit halber weggelassen.
Dazu müssten wir ein komplett neues Framework einbinden und vorstellen - das wäre ein Thema für einen weiteren Blog-Artikel.
Doch abgesehen von der Persistenzschicht fehlen uns auch andere elementare Aspekte in unserer App, wie z.B. eine konsistente und durchgehende Fehlerbehandlung sowie Unit- und Integration-Tests.
Die Behandlung dieser Themen würde allerdings den Rahmen des Artikels sprengen, weshalb ich an dieser Stelle nicht näher darauf eingehen werde.

# Fazit

In diesem Artikel haben wir gesehen, wie wir eine REST-API mit dem Actix-Web Framework implementieren können.
Dabei haben wir wichtige Funktionen des Frameworks kennengelernt: Request Handler, Routen, dynamische URL-Parameter und die Kommunikation mittels JSON.
Wenn bereits Erfahrung in der Sprache Rust vorhanden ist, wird der Einstieg in Actix-Web nicht schwerfallen.
Natürlich bietet das Framework noch einiges mehr an Funktionalität als in diesem Artikel beschrieben wurde.
Die [offizielle Dokumentation](https://actix.rs/docs/) ist der beste Ort für diejenigen, die sich noch tiefer mit dem Framework beschäftigen wollen.
Dort wird auch auf die komplette API-Dokumentation verwiesen.

Um sich auf das Wesentliche konzentrieren zu können, habe ich die Speicherung der Personen in diesem Artikel nicht implementiert.
In diesem [Github-Repository](https://github.com/KilianKrause/rest-api-with-actix) ist eine erweiterte Version des Codes zu finden, wo zumindest eine rudimentäre Kommunikation mit dem Dateisystem implementiert ist.

Ein Beispiel für eine vollständige App mit Actix-Web ist z.B. [hier](https://github.com/fairingrey/actix-realworld-example-app) zu finden.
Dort wird auch ein ORM für die Speicherung der Personen in einer Datenbank eingesetzt.
