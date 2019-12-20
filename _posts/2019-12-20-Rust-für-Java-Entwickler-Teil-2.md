---
layout: [post, post-xml]              # Pflichtfeld. Nicht ändern!
title:  "Rust für Java-Entwickler - Teil 2" # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2019-12-20 10:00              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2019-12-20             # Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author: kiliankrause                  # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: [Softwareentwicklung]     # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Rust, Actix-Web]               # Bitte auf Großschreibung achten.
---

Im ersten Teil dieser Serie haben wir unsere REST-API definiert und implementiert.
Dazu haben wir elementare Funktionen des Frameworks kennengelernt, z.B. Request Handler (im Folgenden durch RH abgekürzt), Routen, dynamische URL-Parameter und Serialisierung und Deserialisierung mit JSON.
In diesem Teil der Serie möchte ich auf zwei weitere wichtige Aspekte des Frameworks - und allgemein in der Softwareentwicklung - eingehen:
Fehlerbehandlung und automatisiertes Testen.
Bevor wir mit der Fehlerbehandlung starten, müssen wir eine Persistenzschicht einbauen.
Wir nehmen an, dass die Daten in einer Datei im JSON-Format gespeichert werden.


# Kommunikation mit dem Dateisystem

Wir können eine Datei ```data.json``` im Root-Verzeichnis unseres Projekts anlegen.
Dort werden wir unsere Personen-Instanzen speichern.
Dazu implementieren wir zwei Methoden (diese können wir in einer neuen Datei z.B. ```person_repository.rs``` kapseln):

```rust
fn read_values_from_file() -> Vec<Person> {
    let data = fs::read_to_string(FILE_NAME).unwrap();
    let persons: Vec<Person> = serde_json::from_str(&data).unwrap();
    persons
}

fn write_values_to_file(persons: Vec<Person>) {
    let data = serde_json::to_string(&persons).unwrap();
    fs::write(FILE_NAME, data).unwrap();
}
```

```FILE_NAME``` ist dabei so definiert:

```rust 
const FILE_NAME: &str = "data.json";
```

Der Einfachheit halber wollen wir die möglichen Fehler bei der Serialisierung und Deserialisierung bzw. beim Dateizugriff nicht weiter behandeln.
Aus diesem Grund rufen wir einfach die ```unwrap()```-Methode auf.

Im Folgenden werde ich die Fehlerbehandlung anhand eines Anwendungsfalls beschreiben (```GET```-Request auf ```/persons/{id}```).
Der vollständige Quellcode mit allen Anwendungsfällen unserer REST-API ist [auf Github](https://github.com/KilianKrause/rest-api-with-actix) verfügbar.

Hier ist eine Funktion, die uns die Person mit der entsprechenden ID aus der Datei liest:

```rust
pub fn get(id: u32) -> Option<Person> {
    let persons = read_values_from_file();

    persons.into_iter().find(|p| p.id() == id)
}
```

Wenn keine Person mit der ID in der Datei zu finden ist, wird ```None``` zurückgegeben.
Diese Funktion wird dann im RH aufgerufen.
Soviel zur Vorbereitung, jetzt machen wir uns an die Fehlerbehandlung!


# Fehlerbehandlung

Bisher geben unsere RHs nur die JSON-Repräsentation der Personen bzw. Strings zurück.
Das würden wir in einer echten App natürlich nicht so implementieren.
Wir brauchen eine konsistente und durchgehende Fehlerbehandlung.
In diesem Absatz werden wir unsere Request Handler deshalb etwas umbauen.

## Fehlerbehandlung mit Result

Die klassische Fehlerbehandlung in Rust wird meistens mithilfe der beiden Enums ```Result``` und ```Option``` abgewickelt.
Wir erinnern uns daran, dass der Typ des Rückgabewerts eines Request Handlers das ```Responder```-Trait implementieren muss.
Actix bietet uns glücklicherweise eine Standard-Implementierung des ```Responder```-Traits für den ```Result```-Typ an.
Wir erweitern also unsere RHs dahingehend, dass sie Werte vom Typ ```Result``` zurückgeben.
Im Falle eines Fehlers können wir so dem Benutzer eine entsprechende Fehlermeldung oder einen HTTP-Statuscode liefern.

Wir modifizieren dazu unseren Request Handler für den ```GET```-Request wie folgt:

```rust
#[get("/persons/{id}")]
pub fn get(id: Path<u32>) -> Result<Json<Person>, String> {
    match person_repository::get(*id) {
        Some(found) => Ok(Json(found)),
        None => {
            let err_msg = format!("person with id {} not found", id);
            Err(err_msg)
        }
    }
}
```

Wenn eine Person mit der ID existiert, wird diese Person als JSON zurückgegeben.
Andernfalls wird eine entsprechende Fehlermeldung an den Nutzer weitergeleitet.

Aber warum kompiliert unser Code hier nicht?
Um das zu beantworten, müssen wir uns anschauen, wie Actix-Web generell Fehler behandelt.

## Der Actix-Web-Error

Wenn unsere Request Handler Werte vom Typ ```Result``` zurückliefern, müssen die Typen, die im Falle eines Fehlers zurückgegeben werden, das ```ResponseError```-Trait implementieren.
Es exisitert aber keine Implementierung dieses Traits für den Datentyp ```String```.
Das ist der Grund, aus dem unser Code nicht kompiliert.
Glücklicherweise liefert uns Actix-Web den ```Error```-Typen für die Fehlerbehandlung.
Diese Struktur hat intern eine Referenz auf ein Objekt vom Typ ```ResponseError```.

Wir können also in unseren RHs angeben, dass im Falle eines Fehlers ein Objekt vom Typ ```Error``` zurückgegeben wird.
Dieser kann vom Framework zu einer HTTP-Response konvertiert und an den Client geschickt werden.
Wir können unsere Signatur dann wie folgt ändern - anstatt ```Json<Person>``` geben wir hier eine ```HttpResponse``` zurück, dessen Body eine Person als JSON-Objekt ist:

```rust
#[get("/persons/{id}")]
pub fn get(id: Path<u32>) -> Result<HttpResponse, Error> {
    // ...
}
```

Optimalerweise wollen wir dann hier einen HTTP-Statuscode und eine entsprechende Fehlermeldung an den Client senden.
Auch hier bietet das Framework einige Möglichkeiten.
Es gibt verschiedene Hilfsfunktionen, die einen Wert vom Typ ```Error``` zurückliefern.
Zum Beispiel gibt es die Funktion ```ErrorNotFound```, die einen beliebigen Typen entgegennimmt und daraus einen Actix-Error erstellt.
Dieser wird vom Framework dann zu einer HTTP-Response mit dem entsprechenden Fehlercode und Inhalt konvertiert.
Für unseren Request Handler sieht das wie folgt so aus:

```rust
#[get("/persons/{id}")]
pub fn get(id: Path<u32>) -> Result<HttpResponse, Error> {
    let person = person_repository::get(*id);
    match person {
        Some(found) => Ok(HttpResponse::Ok().json(found)),
        None => {
            let err_msg = format!("Person with id {} does not exist.", id);
            let json_err = json!({ "error": err_msg });
            Err(error::ErrorNotFound(json_err))
        }
    }
}
```

Wenn eine Person mit der ID existiert, wird diese als JSON zurück an den Client geschickt (mit dem Statuscode 200 - OK).
Falls die Person jedoch nicht exisiert, wird eine Http-Response mit Statuscode 404 (Not Found) generiert, und als Body enthält sie die entsprechende Fehlermeldung.
Das sieht dann wie folgt aus (die ID ist hier willkürlich gewählt - es sollte nur keine Person mit der ID in der Datei exisitieren):

![Fehler](/assets/images/posts/Rust-für-Java-Entwickler-Teil-2/error.png)

Actix bietet für die gebräuchlichsten Fehlercodes entsprechende Funktionen an.
Eine detailierte Auflistung ist [hier](https://actix.rs/actix-web/actix_web/error/index.html) zu finden.

## Eigene Fehler definieren

Falls die mitgelieferten Funktionen des Frameworks zur Fehlerbehandlung nicht ausreichen, können wir natürlich unsere eigenen Fehler-Typen definieren.
Darauf möchte ich aber an dieser Stelle nicht näher eingehen und verweise auf die [offizielle Dokumentation](https://actix.rs/docs/errors/).


# Testen

Natürlich sollte jede Anwendung gut getestet werden.
Die Sprache Rust bringt von Haus aus eine gute Integration für Tests mit.
Falls du damit noch nicht vertraut bist, kannst du gerne [hier](https://doc.rust-lang.org/book/ch11-00-testing.html) einsteigen.
Actix-Web erleichtert uns darüber hinaus das Schreiben von Unit- und Integration-Tests.
Ich möchte hier die Möglichkeiten zum Integrations-Testen näher vorstellen.

## Testumgebung

Noch einige Worte vorab, bevor wir mit dem Testen beginnen können:
Bisher speichern wir die Personen in einer Datei ```data.json```, die im Code hinterlegt ist.
Im Folgenden - also beim Schreiben der Tests - können wir der Einfachheit halber davon ausgehen, dass diese Datei eine Testdatei ist.
Wir müssen den Code also nicht vorher umbauen, um mit dem Testen starten zu können.

Wir könnten die Datei z.B. wie folgt initialisieren, um darauf dann die Tests laufen zu lassen:

![Test-Daten](/assets/images/posts/Rust-für-Java-Entwickler-Teil-2/test-data.png)

Jetzt können wir mit dem Testen beginnen!

## Integrationstests

Wir erstellen für unsere Tests einen Test-Server.
An diesen schicken wir dann unsere Requests, um das erwartete Verhalten zu überprüfen.
Das möchte ich hier anhand unseres ```GET```-Requests demonstrieren.

Zunächst erstellen wir ein Test-Modul in unserer main.rs-Datei:

```rust
#[cfg(test)]
mod tests {
    // ...
}
```

In diesem Modul können wir dann unsere Tests schreiben.
Dafür importieren wir die benötigten Dependencies:

```rust
use actix_web::dev::Service;
use actix_web::{http, test, App};
```

```actix_web::test``` ist das Test-Modul, das wir für unsere Tests benötigen.
Im ```actix_web::http```-Modul liegen die Http-Codes, ```actix_web::App``` brauchen wir zur Erstellung unserer Test-App und ```actix_web::dev::Service``` wird benötigt, um den Request an die App zu schicken und uns eine Response generieren zu lassen.

Wir schreiben einen Test, bei dem wir eine ID in dem Request mitgeben, die nicht in der Datei existiert.
Dann erwarten wir, dass wir eine 404 HTTP-Response vom Server bekommen.
In dem Test erstellen wir zunächst unsere Test-App und registrieren den Request Handler:

```rust
#[test]
fn test_returns_error() {
    let mut app = test::init_service(App::new().service(request_handler::get));
}
```

Darüber hinaus müssen wir noch unseren Test-Request definieren:

```rust
let req = test::TestRequest::get().uri("/persons/5").to_request();
```

Wir definieren einen ```GET```-Request mit der ```/persons/{id}```-URL, wobei wir als ID 5 angeben.
Da keine Person mit der ID exisiert, erwarten wir, dass der Server uns einen Fehler liefert.

Wir führen auf der Test-App den entsprechenden Request aus und speichern die Response, die wir vom Server erhalten, in einer Variablen, um darauf später testen zu können.

```rust
let resp = test::block_on(app.call(req)).unwrap();
```

Unser kompletter Test sieht letztendlich so aus:

```rust
#[test]
fn test_returns_error() {
    let mut app = test::init_service(App::new().service(request_handler::get));
    let req = test::TestRequest::get().uri("/persons/5").to_request();
    let resp = test::block_on(app.call(req)).unwrap();

    assert_eq!(resp.status(), http::StatusCode::NOT_FOUND);
}
```

Am Server wird der entsprechende Request Handler für den Pfad ```/persons/{id}``` aufgerufen.
Dieser ruft dann das Repository auf, wo in der Datei nach einer Person mit der ID 5 gesucht wird.
Da keine solche Person exisitert, wird ```None``` zurückgeliefert und der Request Handler gibt einen Actix-Error mit Fehlercode 404 (Not Found) zurück.
Auf diesen Fehlercode können wir dann wie folgt testen:

```rust
assert_eq!(resp.status(), http::StatusCode::NOT_FOUND);
```

Nun wollen wir auch den Fall prüfen, dass eine Person mit der ID exisitert.
Dann werden wir im Test erkennen, ob die ID, der Name und das Alter korrekt ist (also wie in der Testdatei).
Wir erstellen dazu wieder unsere Test-App und den Request mit einer ID, die in unserer Testdatei existiert.

```rust
#[test]
fn test_returns_success() {
    let mut app = test::init_service(App::new().service(request_handler::get));
    let req = test::TestRequest::get().uri("/persons/2").to_request();
}
```

Im test-Modul von Actix-Web gibt es eine Funktion ```read_response_json```, die uns das deserialisierte Objekt unseres Requests liefert.
Diese Funktion rufen wir wie folgt auf:

```rust
let result: person::Person = test::read_response_json(&mut app, req);
```

In der ```result```-Variable ist jetzt die Person Bob, die in der Datei die ID 2 hat.
Zum Schluss prüfen wir jetzt noch die einzelnen Attribute und erhalten unseren kompletten Test:

```rust
#[test]
fn test_returns_success() {
    let mut app = test::init_service(App::new().service(request_handler::get));
    let req = test::TestRequest::get().uri("/persons/2").to_request();

    let result: person::Person = test::read_response_json(&mut app, req);

    assert_eq!(result.id(), 2);
    assert_eq!(result.age(), 24);
    assert_eq!(result.name(), "Bob");
}
```

Diejenigen, die sich noch weiter mit den Möglichkeiten von Actix-Web zur Fehlerbehandlung auseinandersetzen wollen, können sich [hier](https://actix.rs/docs/testing/) weiter in das Thema einlesen.


# Fazit

In diesem Teil der Artikel-Serie haben wir gesehen, welche Möglichkeiten Actix-Web für die Fehlerbehandlung und das automatische Testen bietet.
Auch hier habe ich natürlich nicht die komplette Funktionspalette des Frameworks vorgestellt.
Doch wir haben einen guten Einblick in die generellen Konzepte  und Funktionsweisen bekommen.
Wer tiefer in das Framework einsteigen will, kann sich an der [offiziellen Dokumentation](https://actix.rs/docs/) orientieren.
Dort wird auch auf die komplette API-Dokumentation verwiesen.

Ein Beispiel für eine vollständige App mit Actix ist z.B. [hier](https://github.com/fairingrey/actix-realworld-example-app) zu finden.

Der in diesem Artikel entwickelte Code ist [auf Github](https://github.com/KilianKrause/rest-api-with-actix) verfügbar.
Der Code ist an einigen Stellen optimiert bzw. modifiziert worden.

## Ist Actix-Web ein Kandidat für die Entwicklung eines echten Webservices?

Meiner Meinung nach ist die Erstellung der REST-API mit Actix-Web sehr intuitiv und mir gefällt das Framework sehr gut.
Allerdings spielen bei der Entscheidung auch andere Faktoren eine Rolle, wie z.B. ORM-Software, Kommunikation mit anderen Systemen u.v.m.
Java und Spring sind in diesen Bereichen ausgereifter und Rust muss hier noch viel tun - was auch verständlich ist, denn Rust ist noch sehr jung.
Es wird auf jeden Fall interessant sein, die Entwicklung des Frameworks (und die Entwicklung von Rust in der Web-Programmierung generell) zu beobachten.
