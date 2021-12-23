---
layout: [post, post-xml]              
title:  "WebSockets leichtgemacht mit STOMP.js und Spring Boot"        
date:   2019-08-08 10:00                                
author_ids: [s-gbz]
categories: [Softwareentwicklung]                    
tags: [WebSockets, Angular, JavaScript, Nodejs, TypeScript, Java, Spring Boot]
---
Für Anwendungen wie Messenger, Wetterdienste oder Newsticker ist die sofortige Bereitstellung von neuen Informationen von großer Bedeutung. Request/Response-basierte Protokolle wie HTTP sind für diese Art der Informationsbereitstellung ungeeignet, da Clients immer wieder teure Anfragen stellen müssen, um festzustellen, ob neue Informationen vorhanden sind.

Das bi-direktionale Websocket-Protokoll bietet eine Lösung für dieses Problem. Dieser Artikel gibt eine praktische Einführung in Websockets mit Hilfe der Javascript-Bibliothek STOMP.js und Spring Boot.

# WebSocket
Die Lösung der Anforderung gelingt durch Einsatz der 2011 entwickelten [WebSocket](https://tools.ietf.org/html/rfc6455) Technologie.

Mittels des [Protocol Upgrade Mechanism](https://developer.mozilla.org/en-US/docs/Web/HTTP/Protocol_upgrade_mechanism) baut das  [WebSocket](https://tools.ietf.org/html/rfc6455)-Protokoll gewöhnliche HTTP Verbindungen zu bidirektionalen Kommunikationswegen aus.

# STOMP
Als Erweiterung zum WebSocket-Protokoll liefert [STOMP](https://stomp.github.io/) (Simple Text Oriented Messaging Protocol) uns Funktionalitäten, die analog zum [Beobachter-Muster](https://docs.microsoft.com/en-us/azure/architecture/patterns/publisher-subscriber) sind.

Das Beobachter-Muster ermöglicht es Informationsempfängern bestimmte Nachrichtenkanäle zu abonnieren und Meldungen **sofort zu erhalten, wenn sie bereitstehen**. Sie müssen also nicht erst nach den Informationen fragen.

Stellt man sich unsere Informationsempfänger als Zeitungsverläge vor, wäre es für sie unwirtschaftlich und mühsam ihre Journalisten ständig nach Neuigkeiten fragen zu müssen. Wenn die Journalisten sich hingegen selbst melden **sobald sie etwas zu berichten haben**, profitieren beide Parteien.

# Die Beispielanwendung
Weil das Internet genug Beispiele für Chatprogramme gesehen hat, stellt unsere exemplarische Anwendung eine Auktionsplattform dar.
Die zeitnahe Bereitstellung von Geboten ist hierbei essentiell. 

## Anwendungsfälle
Die Oberfläche der Auktionsplattform bietet Nutzern die folgenden Anwendungsfälle, die mit WebSockets behandelt werden:

- A) Auktionsartikel anzeigen
- B) Auf Auktionsartikel bieten
- C) Über Gewinner-Gebot benachrichtigen

## Technologien
Die Clientoberfläche wird mit [Angular](https://angular.io) entwickelt, während Java und [Spring Boot](https://spring.io) die Serverlogik tragen.

Angular ist ein populäres, von Google geführtes, Open Source Framework zur Entwicklung von Webanwendungen.
Es überzeugt durch eine umfangreich abgedeckte [Feature-Landschaft](https://angular.io/features) und Unterstützung von [TypeScript](https://www.typescriptlang.org/).
Die Umsetzung eines WebSocket-Clients ist allerdings nicht an Angular gebunden und kann auch mit reinem JavaScript durchgeführt werden. 

Den Server implementieren wir mit Spring Boot, einem Java Framework, das eine schnelle und entwicklerfreundliche Umsetzung von Java-basierten Anwendungen ermöglicht.

Der vollständige Quellcode der Beispielanwendung ist [auf GitHub zu finden](https://github.com/s-gbz/WebSocketAuctionExample).

# Implementierung des Angular-Clients

Wir nutzen [Angular CLI](https://cli.angular.io/) um ein Grundgerüst für ein Angular-Projekt zu erhalten. Alternativ
kann das [Beispielprojekt](https://github.com/s-gbz/WebSocketAuctionExample) heruntergeladen werden. 

## STOMP einbinden
Um STOMP verwenden zu können, binden wir [STOMP.js](https://www.npmjs.com/package/@stomp/stompjs) in unser Angular-Projekt ein.
Wir installieren die Bibliothek mit dem [Node Paketmanager](https://nodejs.org/de):

```bash
$ npm install stompjs @types/stompf net --save
```

Neben der Hauptbibliothek installieren wir dabei auch die TypeScript Typisierung `@types/stompf` und die Abhängigkeit `net` für asynchrone Netzwerkaufrufe.

Nach der Installation importieren wir die Library in unsere Angular-Komponente:

```typescript
// src/app/auction-view/auction-view.component.ts
import * as Stomp from 'stompjs';
...

export class AuctionViewComponent implements OnInit, OnDestroy {
  ...
}
```

Vor der Klassendefinition importieren wir in `AuctionViewComponent` den gesamten Inhalt von `stompjs` in den Namespace `Stomp`.

Anschließend legen wir Klassenvariablen für `WebSocket` und `Stomp.Client` an, die wir später zur Verwaltung von WebSocket-Verbindungen benötigen:

```typescript
...
// src/app/auction-view/auction-view.component.ts
export class AuctionViewComponent implements OnInit, OnDestroy {

  webSocket: WebSocket;
  client: Stomp.Client;
  auctionItems: AuctionItem[] = [];
  ...
}
```

`auctionItems` ist hierbei die Liste der Auktionsgegenstände auf die wir bieten können.
Wir möchten diese Liste mit dem Server sowie unseren Mitbietern synchron halten.

## WebSocket-Verbindung öffnen 

Im `HttpService` stellen wir eine [Singletoninstanz](https://angular.io/guide/singleton-services) der `WebSocket`-Klasse
zur Verfügung: 

```typescript
// src/app/http.service.ts
// imports ...

export class HttpService {

  getWebSocket(): WebSocket {
    return new WebSocket("ws://localhost:8080/socket-registry");
  }
  ...
}
```
In der gesamten Angular-Anwendung steht somit nur *ein* WebSocket zur Verfügung.
Wir verwenden dieses gängige Entwurfsmuster, um Mehrfachverbindungen des Clients zu vermeiden.
Die WebSocket-URL zeigt auf eine STOMP-Socket-Registry, die vom Server bereitgestellt wird, um eine Verbindung zu
initiieren.

Zum Öffnen der Verbindung stellen wir in unserer Komponente die Methode `openWebSocketConnection()` zur
Verfügung:

```typescript
// src/app/auction-view/auction-view.component.ts
...
openWebSocketConnection() {
  this.webSocket = this.httpService.getWebSocket();

  this.client = Stomp.over(this.webSocket);

  this.client.connect({}, () => {
    this.client.subscribe("/update-items", (item) => {
      this.insertOrUpdateItem(JSON.parse(item.body));
    });
  });
}
...
```

Über die WebSocket-Verbindung legen wir mit `Stomp.over()` eine STOMP-Verbindung an, um die Vorteile des Beobachter-Musters 
nutzen zu können.

Wir abonnieren den Endpunkt `/update-items`, der uns über neue Gebote informiert.
Bei neuen Geboten aktualisiert die Methode `insertOrUpdateItem()` unsere lokale Liste von Auktionsgegenständen.

Damit die Verbindung direkt beim Start der Anwendung hergestellt wird, initiieren wir sie in
der `ngOnInit()` Methode der Angular-Komponente: 

```typescript
// src/app/auction-view/auction-view.component.ts
...
ngOnInit() {
  this.openWebSocketConnection();
  this.initializeAuctionItems();
}
...
```

Mit `initializeAuctionItems()` fragen wir alle verfügbaren Auktionsartikel vom Server ab, womit wir die lokale Liste 
`auctionItems` initialisieren.
Dies ist nur einmal erforderlich, da uns weitere Änderungen über die WebSocket-Verbindung mitgeteilt werden.

## WebSocket-Verbindung schließen

Um unnötige Verbindungen zu vermeiden, schließen wir sie, sobald der Nutzer die Anwendung verlässt:

```typescript
// src/app/auction-view/auction-view.component.ts
...
ngOnDestroy() {
  this.closeWebSocketConnection();
}

closeWebSocketConnection() {
  if (this.client) {
    this.webSocket.close();
    this.client.unsubscribe("/update-items");
  }
}
...
```

Um Fehler zu vermeiden, prüfen wir mit `if (this.client)`, ob bereits eine STOMP Verbindung besteht.
Falls ja, schließen wir sie mittels `this.webSocket.close()` und kündigen mit `this.client.unsubscribe("/update-items")` das Abonnement. 

## Nachrichten versenden

Nachdem wir Use Case A abgedeckt haben und unsere Anwendung nun Auktionsgegenstände anzeigen kann, gilt es mit den Fällen B und C fortzufahren.
Diese umfassen die Abgabe eines Gebot und das Ersteigern von Gegenständen.
Die hierbei grundlegende Funktion ist das Benachrichtigen der Abonnenten, dass der Preis eines Artikels gestiegen ist.

```typescript
// src/app/auction-view/auction-view.component.ts
...
updateItemAndSendBid(item: AuctionItem) {
  this.httpService.updateItem(item).subscribe((success: boolean) => {
    console.log(`Update for ${item} was ${success}`);
  });

  this.client.send("/update-items", {}, JSON.stringify(item));
}
...
```

Zunächst aktualisieren wir die Datenbank des Servers indem unser `httpService` die `updateItem(item)` Methode aufruft und eine [POST Anfrage](https://www.w3schools.com/tags/ref_httpmethods.asp) mit dem neuen Preis des Artikels versendet.
Der anschließende Callback von `subscribe` teilt uns zu Demonstrationszwecken den Erfolg der Operation in der Konsole mit.

`this.client.send` benachrichtigt alle Beobachter der Auktion, dass eine Änderung bereitsteht.
`/update-items` ist hierbei der Kanal auf dem Nachrichten über die Auktionsgegenstände ausgetauscht werden.
Wir verwenden `JSON.stringify(item)` um unser Objekt in das portable Textformat [JSON](https://www.json.org/) zu konvertieren.

Jeder Artikel verfügt über eine individuell festgelegte Auktionszeit, die bei jedem Gebot kurzzeitig verlängert wird.
Nach Ablauf dieser Zeitperiode wird der Höchstbietende hinsichtlich seiner Ersteigerung informiert (Anwendungsfall C).
Die Umsetzung dessen basiert auf gewöhnlicher Vergleichslogik, weshalb wir sie nicht weiter betrachten.

# Implementierung des Servers

Nachdem unser Client bereit ist, können wir nun die serverseitige WebSocket-Schnittstelle implementieren.

## WebSocket-Dependency einbinden
Wir nutzen [Gradle](https://docs.gradle.org/current/userguide/what_is_gradle.html), um unsere Abhängigkeiten aufzulösen. Die Datei `build.gradle` umfasst dabei die Auflistung dieser:

```groovy
// build.gradle
...
dependencies {
	implementation 'org.springframework.boot:spring-boot-starter-websocket'
  ...
}
```

Für die Anbdinung der WebSockets ist `spring-boot-starter-websocket` hierbei besonders relevant.
Die vollständige `build.gradle` Datei ist auf [GitHub](https://github.com/s-gbz/WebSocketAuctionExample) verfügbar.

## WebSocket konfigurieren
Dank `spring-boot-starter-websocket` haben wir eine fertige WebSocket Bibliothek, die nur noch konfiguriert werden muss:

```java
@CrossOrigin
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/socket-registry").setAllowedOrigins("*");
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/update-items");
    }
}
```

Mit der `@Configuration`-Annotation erzeugen wir eine neue Spring-Konfigurationsklasse.
Durch die Annotation `@EnableWebSocketMessageBroker` aktivieren wir die WebSocket-Features.

Zusätzlich implementieren wir die Methoden der Klasse `WebSocketMessageBrokerConfigurer`, um Endpunkte für die Clients zur Verfügung zu stellen.

`/socket-registry` dient Clients als Endpunkt zur Initiierung von WebSocket-Verbindungen (siehe oben). 
`setAllowedOrigins("*")` ermöglicht dem Server die Kommunikation mit Clients beliebigen Ursprungs, da mittels `*` alle Anfragen akzeptiert werden.
Im Produktionsbetrieb sollten wir [Cross-Origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) Anfragen nicht erlauben und die Erreichbarkeit unserer Applikation auf einen Hostnamen begrenzen.

Mit `item-updates` stellen wir einen Endpunkt, der mittels STOMP abonniert werden kann, um Informationen über die Auktionsgegenstände zu verteilen.

# Fazit
Mit Hilfe von STOMP.js und der nativen WebSocket Implementierung konnten wir clientseitig eine flexible und leichtgewichtige Nutzerapplikation bauen.
Trotz der Vorzüge in Angular und somit TypeScript zu entwickeln, ist das Prinzip auf jedes beliebige Framework und reines JavaScript übertragbar.

Mit Spring Boot und dem [WebSocket Starter](https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-websocket) konnten wir mit wenig Aufwand eine WebSocket-Schnittstelle auf Serverseite realisieren.
