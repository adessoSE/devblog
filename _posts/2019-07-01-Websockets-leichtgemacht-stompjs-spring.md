---
layout: [post, post-xml]              
title:  "WebSockets leichtgemacht mit STOMP.js und Spring Boot"        
date:   2019-07-01 10:00                                
author: s-gbz
categories: [Softwareentwicklung]                    
tags: [WebSockets, Angular, JavaScript, Nodejs, TypeScript, Java, Spring Boot]
---
### Das Problem
Perfomante Bereitstellung neuster Informationen ist ein unerlässlicher Bestandteil von Anwendungen wie beispielsweise Messengern, Wetterdiensten oder Newstickern.
Trotz des generell hohen Informationsflusses sind Aktualisierungsintervalle zwischen Client und Server jedoch nicht fest definiert und bei zeitkritischen Anwendungen somit schwer zu bestimmen.
Da REST Verben nur temporäre Verbindungen initieren, sind sie der Anforderung eines steten Informationsaustausches unzureichend.

### Die Lösung
Die Lösung der Anforderung gelingt durch Einsatz des 2011 entwickelten [WebSocket](https://tools.ietf.org/html/rfc6455) Protokolls, 
das gewöhnliche HTTP Verbindungen mittels des [Protocol Upgrade Mechanism](https://developer.mozilla.org/en-US/docs/Web/HTTP/Protocol_upgrade_mechanism) zu bidirektionalen Kommunikationswegen etabliert.
[STOMP](https://stomp.github.io/) (Simple Text Oriented Messaging Protocol) dient als Erweiterungsprotokol, das WebSockets um Funktionalitäten erweitert die unter anderem analog zum [Beobachter-Muster](https://docs.microsoft.com/en-us/azure/architecture/patterns/publisher-subscriber) sind.
So können Clients beispielsweise vom Server bereitgestellte Informationskanäle abonnieren und Benachrichtigungen erhalten sobald Aktualisierungen bereitstehen.

### Der Anwendungsfall
Weil das Internet genug Beispiele für Chatanwendungen aufweist, entwickeln wir im Rahmen des Tutorials eine originelle Auktionsplattform.
Die Umsetzung erfolgt mit den uns bekannten Frameworks wie [Angular](https://angular.io) im Frontend und Java [Spring Boot](https://spring.io) im Backend. [BETONEN DAS ANGULAR BSP. IST UND KEINE BESONDERHEIT VERFÜGT. In reinem JS und jedem anderem Framework möglich]

Auf weitergehende Erläuterung der frameworkspezifischen Implementierungsdetails wird verzichtet. Somit ist tieferes Verständnis der verwendeten Technologienfür die eigentliche Umsetzung der Socketverbindung nicht erforderlich. Der vollständige Quellcode ist im folgenden Repository zu finden:

<p align="center">
  <b><a href="https://github.com/s-gbz/WebSocketAuctionExample">https://github.com/s-gbz/WebsocketAuctionExample</a></b>
</p>

# Implementierung des Clients/ Frontend
Nach Anlegen eines neuen Angular Projekts und der Erstellung einer simplen Oberfläche, folgt die Implementierung des WebSockets.

### Vorbereitung
Da WebSockets zum HTML Standard gehören, ist das Interface in der DOM Bibliothek bereits gegeben womit mögliche Installationsschritte entfallen. 
Um auf die Annemlichkeiten von [STOMP.js](https://www.npmjs.com/package/@stomp/stompjs) zugreifen zu können, installieren wir das npm Paket inkl. der TypeScript Typisierung `@types/stompf` und der Abhängigkeit `net` für asynchrone Netzwerkaufrufe.

```bash
$ npm install stompjs @types/stompf net --save
```

Um STOMP in unserem Angularkontext verfügbar zu machen, importieren wir anschließend die Typdefinitionen.

```typescript
import * as Stomp from 'stompjs';
```

Da wir dank TypeScript objektorientiert arbeiten können, legen wir Instanzvariablen für `WebSocket` und `Stomp.Client` an, die wir im Verlauf des Programms instanziieren werden.

```typescript
  auctionItems: AuctionItem[] = [];
  webSocket: WebSocket;
  client: Stomp.Client;
```

Bei Start der Anwendung und Initialisierung der Angular Komponente, eröffnen wir dann eine WebSocket Verbindung mit dem Server. Im Anschluss werden verfügbare Auktionsartikel abgefragt.

```typescript
ngOnInit() {
  this.openWebSocketConnection();
  this.initializeAuctionItems();
}
```

### Öffnen der Verbindung 
Zunächst wird eine Singletoninstanz des WebSockets vom `httpService` bereitgestellt, um Mehrfachverbindungen des Clients zu vermeiden.
Die STOMP Instanz `this.client` ist anschließend für den Verbindungsaufbau zum Server zuständig, indem sie auf den Socket aufsetzt und `connect` aufruft.
Sobald die Verbindung initiert ist, abonniert der Client den Kanal `"/item-updates"`, um hinsichtlich Veränderungen der Auktionsgegenstände benachrichtigt zu werden und die lokale Liste der Gegenstände anzupassen.

```typescript
openWebSocketConnection() {
  this.webSocket = this.httpService.getWebSocket();

  this.client = Stomp.over(this.webSocket);

  this.client.connect({}, () => {
    this.client.subscribe("/item-updates", (item) => {
      this.insertOrUpdateItem(JSON.parse(item.body));
    });
  });
}
```

Die Singletoninstanz des WebSockets wird vom `httpService` bereitgestellt.

```typescript
getWebsocket(): WebSocket {
  return new WebSocket(environment.webSocketUrl);
}
```
   
Abhängig von der gegebenen Umgebung (Entwicklung, Produktion, ...) wird die jeweilige `webSocketUrl` des Servers im `environment.ts` ausgelesen. [Erklären wie die IPs zustandekommen?]

```typescript
export const environment = {
  production: false,
  serverUrl: "http://localhost:8080",
  webSocketUrl: "ws://localhost:8080/socket-registry"
};
```

### Schließen der Verbindung 
Nicht zu vergessen, ist das Schließen der Verbindung sobald die Komponente aus dem DOM entfernt wird.

```typescript
ngOnDestroy() {
  this.closeWebSocketConnection();
}

closeWebSocketConnection() {
  if (this.client) {
    this.webSocket.close();
    this.client.unsubscribe("/item-updates");
  }
}
```

### Versenden von Nachrichten
Sobald ein Nutzer an einer Auktion teilnimmt indem er ein Gebot abgibt, gilt es die Information in der Datenbank einzupflegen und den Preis bei allen aktiven Clients zu aktualisieren. Während der `httpService` für ersteres zuständig ist, benachrichtigt `client.send` alle Beobachter der Auktion. `"/item-updates"` ist hierbei der Kanal auf dem Nachrichten bzgl. den Auktionsgegenständen gesendet werden.

`JSON.stringify(item)` konvertiert das binäre Objekt in das portable Textformat [JSON](https://www.json.org/).   

```typescript
updateItemAndSendBid(item: AuctionItem) {
  this.httpService.updateItem(item).subscribe((success: boolean) => {
    console.log(`Update for ${item} was ${success}`);
  });

  this.client.send("/item-updates", {}, JSON.stringify(item));
}
```

# Implementierung des Servers/ Backend
Nach Fertigstellung des Spring Boot Boilerplate Codes (Objekte, Repositories und Controller), foglt die eigentliche Implementierung der WebSocket Schnittstelle.

### Vorbereitung
Die benötigten  umfassen 
Abgesehen von den datenbankbezogenen Abhängigkeiten wie `data-jpa` und `h2 `, benötigen wir insbesondere `web` und `websocket`.  

```gradle
dependencies {
	implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
	implementation 'org.springframework.boot:spring-boot-starter-web'
	implementation 'org.springframework.boot:spring-boot-starter-websocket'
	runtimeOnly('com.h2database:h2')
	testCompile group: 'com.h2database', name: 'h2', version: '1.4.199'
	testImplementation 'org.springframework.boot:spring-boot-starter-test'
}
```

Um initiale Auktionsgegenstände in unserer Datenbank aufzuweisen, fügt ein SQL Skript diese beim Start der Anwendung ein.

```sql
INSERT INTO AUCTION_ITEM (id, current_bid, top_bid, new_bid, time_left, name, description) VALUES
  (1, 0, 20, 20, 10, 'Osterhase', 'Der Plüschklassiker zu Ostern!'),
  (2, 0, 10, 10, 300, 'Rostiges Messer', 'Ein Messer das dem Zahn der Zeit nicht trotzen konnte.'),
  ...
```

### Konfiguration des WebSockets
Die `@CrossOrigin` Annotationen ermöglicht unserer WebSocket Klasse die Kommunikation mit Clients indem sie [Cross Origin Anfragen](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) akzeptiert (HIER NÖTIG?). `@Configuration` und `@EnableWebSocketMessageBroker` markieren die Klasse als zu verwendende Konfiguration für den WebSocket des Servers.

```java
@CrossOrigin
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

  // Endpoint for client registry
  @Override
  public void registerStompEndpoints(StompEndpointRegistry registry) {
    registry.addEndpoint("/socket-registry").setAllowedOrigins("*");
  }

  // Endpoint for client topic subscription
  @Override
  public void configureMessageBroker(MessageBrokerRegistry registry) {
    registry.enableSimpleBroker("/item-updates");
  }
}
```

### Endpunkt für Clientregistierung
Clients die den Endpunkt `"/socket-registry"` aufrufen, initieren eine bidirektionale Verbindung mit dem Server.
`setAllowedOrigins("*")`

```java
@Override
public void registerStompEndpoints(StompEndpointRegistry registry) {
  registry.addEndpoint("/socket-registry").setAllowedOrigins("*");
}
```

### Endpunkt für Benachrichtigungen
Die Methode `configureMessageBroker` folgt ihrer Namensgebung und bietet Möglichkeit mittels der `MessageBrokerRegistry` "MessageBroker" dt. "Nachrichtenvermittler" zu etablieren.
Diese "Nachrichtenkanäle" beziehen sich auf jeweils eine Fachlichkeit und können von Clients nach Bedarf abonniert werden.
So folgen alle Clients unseres Auktionshauses `"/item-updates"`, um über Änderungen hinsichtlich der Auktionsgegenstände benachrichtigt zu werden.

Es steht offen mehrere MessageBroker bzw. Kanäle zu registrieren.

```java
@Override
public void configureMessageBroker(MessageBrokerRegistry registry) {
  registry.enableSimpleBroker("/item-updates");
  // registry.enableSimpleBroker("/another-channel"); CHECKEN OB ES WIRKLICH SO FUNKIONIERT
}
```

# Fazit
Mit Hilfe von STOMP.js und der nativen WebSocket Implementierung konnten wir clientseitig eine flexible und leichtgewichtige Nutzerapplikation bauen. Trotz der Vorzüge in Angular und somit TypeScript zu entwickeln, ist das Prinzip auf jedes beliebige Framework und reines JavaScript übertragbar.

Mit [starter-websocket](https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-websocket) ermöglichte Spring Boot uns eine leicht zu implementierende und effektive Schnittstelle auf Serverseite.