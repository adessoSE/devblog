---
layout: [post, post-xml]
title: "Produktiver mit Firebase"
date: 2020-09-05 18:00
author: daklassen
categories: [Softwareentwicklung]
tags: [Angular, Firebase, Cloud Hosting]
---

Während sich Googles Frontend Framework Angular mittlerweile deutlich etabliert hat, begegne ich Googles "Backend Lösung" Firebase eher selten im Projektalltag.
Meiner Meinung nach bietet die Firebase Plattform allerdings ein enormes Potential, vor allem, weil sie dem Entwickler viele Aspekte abnimmt.
Wie fast immer kommen sämtliche Vorteile aber auch mit entsprechenden Nachteilen, weshalb eine Evaluation für den konkreten Anwendungsfall notwendig ist.

In diesem Beitrag möchte ich von meinen Erfahrungen mit der Plattform berichten, indem ich meine Migration auf Firebase im Rahmen eines Hobbyprojektes erläutere.
Zum besseren Verständnis sind Grundkenntnisse über Angular und Keycloak vorausgesetzt.

# Status quo

Jeder, der schon einmal alleine oder in einem Team eine komplette Webapplikation entwickelt und betrieben hat, weiß, mit welchem Aufwand Entwicklung und Betrieb zusammenhängen.
Innerhalb eines Hobbyprojektes war ich persönlich etwas genervt von all den Hürden, die mit dem Betrieb einer Anwendung zusammenhängen.
Stattdessen wollte ich lieber mehr Zeit in die eigentliche Entwicklung stecken.

Das Backend hatte ich mit Spring Boot und einer SQL-Datenbank aufgesetzt, das Frontend mit Angular und die Authentifizierung und Autorisierung über Keycloak.
Gehostet habe ich diese vier Hauptkomponenten auf einem kleinen Raspberry Pi in meinem Heimnetzwerk.
Schnell ist mir aufgefallen, dass ich mehr Zeit mit dem Aufsetzen und Instandhalten meiner kleinen Infrastruktur verbracht habe, als mit der eigentlichen Entwicklung von Funktionen für den Benutzer.

Außerdem wollte ich die Anwendung in Zukunft auch gerne irgendwann öffentlich schalten, was nochmal zusätzlichen Aufwand bedeutet hätte, weil ich mir verstärkt Gedanken um Sicherheit, Verfügbarkeit oder Skalierbarkeit hätte machen müssen.
Ich hätte also beispielweise darauf achten müssen, die Version meiner Keycloak Instanz möglichst aktuell zu halten oder einen Mechanismus zu entwickeln, der automatisch die Anzahl meiner Spring Boot Instanzen hochfährt, sobald das Backend mit der aktuellen Last überfordert ist.

# Firebase für mehr Produktivität

Da ich zu dieser Zeit bereits auf Firebase gestoßen war, hatte ich mich kurzerhand entschlossen, meine Anwendung auf diese Plattform zu migrieren, mit der Hoffnung, mehr Zeit für die Entwicklung der eigentlichen Funktionen zu haben.

Firebase lässt sich schwer in wenigen Sätzen zusammenfassen, da es (typisch für eine Plattform) eine ganze Reihe sehr unterschiedlicher Produkte bereitstellt.
Im Wesentlichen geht es aber darum, die komplette Infrastruktur für eine Anwendung zur Verfügung zu stellen, die automatisch mit der Menge der Benutzer skaliert.

Um Firebase zu nutzen, muss man sich im ersten Schritt über die [Firebase Konsole](https://console.firebase.google.com/) mit einem Google Account einloggen und dort ein neues Projekt anlegen.
Anschließend landet man auf einer sehr übersichtlich gestalteten Admin-Oberfläche.

Für meine Anwendung hat die Migration Anpassungen in allen vier oben genannten Hauptkomponenten bedeutet.
Im Folgenden möchte ich grob auf diese Anpassungen eingehen, um so den Unterschied zwischen einer klassischen Java Enterprise Lösung und Firebase exemplarisch darzustellen und um einige Produkte von Firebase dabei vorzustellen.

# Von Keycloak zu Firebase Authentication

Als erstes habe ich mich um die Authentifizierung und Autorisierung gekümmert.
Wie bereits erwähnt, hatte ich in der bestehenden Lösung eine eigene Keycloak Instanz installiert und konfiguriert.
Der Umzug auf Firebase Authentication hat für mich bedeutet, dass ich mich im Gegensatz zu vorher nur noch im Angular Code um die Anbindung an den Authentication Service kümmern musste, da mein Backend demnächst auch in Firebase liegen würde.
Dazu musste ich zunächst die offiziellen Bibliotheken für Firebase und Angular Fire installieren:

```console
npm install firebase @angular/fire --save
```

Um mich nicht um Dinge wie Benutzerregistrierung oder Password-Verwaltung kümmern zu müssen, hatte meine Anwendung bereits mit Keycloak nur die Möglichkeit, sich über einen bestehenden Google Account einzuloggen.
Auch nach der Migration sollte dies zunächst der einzige Weg für einen Login sein. 
Als Vorbereitung habe ich in der Firebase Konsole Google als möglichen Anbieter aktiviert.

Der folgende Code-Ausschnitt zeigt meinen _AuthService_, der im Prinzip nur Methoden des importierten _AngularFireAuth_ Service aufruft.
Mit diesen wenigen Zeilen war schon der Großteil der Anbindung erledigt.

```typescript
...
import { AngularFireAuth } from '@angular/fire/auth';
import { User, auth } from 'firebase';

@Injectable()
export class AuthService {
  constructor(public afAuth: AngularFireAuth) {}

  getCurrentUser(): Observable<User> {
    return this.afAuth.user;
  }

  doGoogleLogin(): Promise<UserCredential> {
    const provider = new auth.GoogleAuthProvider();
    provider.addScope("profile");
    provider.addScope("email");
    return this.afAuth.auth.signInWithPopup(provider);
  }

  doLogout(): Promise<void> {
    return this.afAuth.auth.signOut();
  }
}
```

Mithilfe der _getCurrentUser()_ Methode konnte ich in meinem _AuthGuard_ sehr einfach überprüfen, ob der aktuelle Benutzer eingeloggt war und entsprechend auf die gewünschte Seite weiterleiten bzw. zurück auf die Hauptseite verweisen:

```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.getCurrentUser().pipe(
      map((user: User) => !!user),
      tap((isAuthenticated) => {
        if (!isAuthenticated) {
          this.router.navigateByUrl("/home");
        }
      })
    );
  }
}
```

Verglichen mit der Anbindung an Keycloak war die Anbindung an Firebase Authentication um einiges schneller und leichter implementiert.
Auf der anderen Seite muss man aber auch erwähnen, dass ich dadurch viele Funktionen bzw. Möglichkeiten verloren habe, die einem Lösungen wie Keycloak bieten.
Dazu gehören beispielsweise die Möglichkeit, die Benutzer über einen eigenen Identity Provider zu authentifizieren oder eine eigene Zwei-Faktor-Authentisierung zu erstellen.
Falls jedoch, wie in meinem Fall, auf diese Dinge verzichtet werden kann, spart man sich die potentiell mit Sicherheitsrisiken behaftete Implementierung dieser Funktionen.

# Von Spring Boot + SQL-Datenbank zu Cloud Firestore

Nachdem Keycloak nun ersetzt war, musste ich mir im nächsten Schritt überlegen, wie ich mein Spring Boot Backend und die dazugehörige SQL-Datenbank in die Firebase Cloud migriere.

Da mein Backend hauptsächlich CRUD-Operationen durchgeführt hat und zusätzlich mithilfe von Keycloak Autorisierungen prüfte, ließ es sich sehr einfach Migrieren.
Denn Firebase stellt mit der Cloud Firestore eine NoSQL-Datenbank bereit, die man direkt aus dem Client ansteuern kann.
Ich konnte mir also die ganze Schicht zwischen Frontend und Datenbank einsparen und habe stattdessen direkt aus Angular heraus auf die Firebase Datenbank zugegriffen.

Generell bietet Firebase dem Entwickler zwei verschiedene Datenbanken an.
Es gibt da zum einen die sogenannte Echtzeitdatenbank und zum anderen den Cloud Firestore.
Beide unterstützen Echtzeit-Datensynchronisierungen, sind Cloud-basiert und lassen sich direkt vom Client aus ansprechen.
Der wesentliche Unterschied liegt dabei im Datenmodel, denn während die Echtzeitdatenbank die Daten in einem großen JSON-Baum abspeichert, werden die Daten in der Cloud Firestore in Dokumenten gespeichert, die hierarchisch in Sammlungen sortiert sind.

Um aus meiner Anwendung heraus die Cloud Firestore Datenbank anzusprechen, musste ich wieder die Firebase Konsole starten, dort die Datenbank initial einrichten und entsprechende Sammlungen und Dokumente anlegen.
Darüber hinaus musste ich Autorisierungsregeln in einer speziell dafür entwickelten Syntax definieren.
Eine der Regeln war zum Beispiel, dass Benutzer nur Dokumente laden dürfen, deren Autor-ID der ID des aktuellen Benutzers entspricht.

Anschließend konnte ich damit beginnen, aus dem Client heraus Queries auf den Cloud Firestore zu feuern.
Der folgende Code zeigt exemplarisch das Laden der Rezepte eines Benutzers:

```typescript

// Recipe service

...
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable() 
export class RecipeService { 

  constructor(private firestore: AngularFirestore) {}

  getUsersRecipes(user: User): Observable<RecipeDTO[]> {
    return this.firestore
      .collection<RecipeDTO>('recipes', ref => ref.where('author.id', '==', user.id))
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(action => {
            const data = action.payload.doc.data();
            const id = action.payload.doc.id;
            return { id, ...data } as RecipeDTO;
          })
        )
      );
  }
}
```

Besonders zu erwähnen ist, dass man über das Observable _snapshotChanges()_ nicht nur die Rezepte zum Zeitpunkt den initialen Ladens bekommt, sondern auch jedes Update in Echtzeit.
Das bedeutet, dass selbst wenn ich über die Google Konsole Daten in der Datenbank verändere, diese in Echtzeit direkt an alle Benutzer propagiert werden, die sich in diesem Fall gerade das Rezept anschauen.

Auch auf Seiten der Datenbank werden komplexe und teure Funktionen angeboten.
Nachteilig ist, dass sich komplexere Strukturen nicht so einfach modellieren lassen und man bei der Modellierung schnell Fehler machen kann, die zu sehr teuren Queries führen.
Und da man bei Firebase quasi pro Abfrage bezahlt, ist "teuer" hier im wahrsten Sinne des Wortes zu verstehen.

# Hosting des Frontends

Der letzte und einfachste Teil der Migration war der Umzug des Hostings des Frontends auf Firebase.
Dazu stellt Firebase eine CLI zu Verfügung, die einem das Deployment denkbar einfach macht.
Man führt folgenden Befehl aus, um das Frontend auf Firebase zu deployen:

```console
firebase deploy --token $FIREBASE_TOKEN --non-interactive
```

Das _FIREBASE_TOKEN_ ist hier eine Umgebungsvariable für das Autorisierungstoken.
Anschließend lässt sich die Webapplikation aus der ganzen Welt über eine generierte URL erreichen.

# Zusammenfassung

Zusammenfassend hat meine Migration gezeigt, dass Firebase hält was es verspricht, wenn es darum geht, dem Entwickler eine Plattform mit mächtigen Produkten zur Verfügung zu stellen.
Mithilfe dieser Produkte kann man sich bei der Entwicklung einer Webapplikation auf die eigentliche Businesslogik bzw. die eigentlichen Benutzerfunktionen konzentrieren.

In meiner Beschreibung bin ich nicht auf alle Produkte von Firebase eingegangen.
Interessant wäre da besonders die Betrachtung der Cloud Functions, die quasi das klassische Backend ablösen.
Darüber hinaus stellt Firebase auch eine ganze Reihe an Produkten zur Qualitätssicherung und Analyse bereit.
Als Beispiel ist hier die [Leistungsüberwachung](https://firebase.google.com/products/performance?hl=de) zu nennen, die einen guten Einblick in die Performance Details der App liefert.
Insgesamt ist Firebase also ein valider Kandidat für euer nächstes Projekt - auch wenn es "nur" ein Hobbyprojekt ist.
