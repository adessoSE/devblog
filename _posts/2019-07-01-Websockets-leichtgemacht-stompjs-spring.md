---
layout: [post, post-xml]              
title:  "WebSockets leichtgemacht mit STOMP.js und Spring"        
date:   2019-07-01 10:00                                
author: s-gbz
categories: [Softwareentwicklung]                    
tags: [Websockets, Java, Angular, Spring, Nodejs]
---
# WebSockets? - Das wie und warum
Perfomante Bereitstellung neuster Informationen ist ein unerlässlicher Bestandteil von Anwendungen wie beispielsweise Messengern, Wetterdiensten oder Newstickern.
Trotz des generell hohen Informationsflusses sind Aktualisierungsintervalle zwischen Client und Server jedoch nicht fest definiert und bei zeitkritischen Anwendungen somit schwer zu bestimmen.
Da REST Verben nur temporäre Verbindungen initieren, sind sie der Anforderung eines steten Informationsaustausches ungenügend.

## Die Lösung: WebSockets + STOMP.js
Die Lösung der Anforderung gelingt durch Einsatz des 2011 entwickelten [WebSocket](https://tools.ietf.org/html/rfc6455) Protokolls, 
das gewöhnliche HTTP Verbindungen mittels des [Protocol Upgrade Mechanism](https://developer.mozilla.org/en-US/docs/Web/HTTP/Protocol_upgrade_mechanism) zu bidirektionalen Kommunikationswegen etabliert.
[STOMP](https://stomp.github.io/) (Simple Text Oriented Messaging Protocol) dient als Erweiterungsprotokol das WebSockets um Funktionalitäten erweitert die unter anderem analog zum [Beobachter-Muster](https://docs.microsoft.com/en-us/azure/architecture/patterns/publisher-subscriber) sind.
So können Clients beispielsweise vom Server bereitgestellte Informationskanäle abonnieren und Benachrichtigungen erhalten sobald Aktualisierungen bereitstehen.

## Unser Anwendungsfall: Auktionsplattform "AuctionBay"
Weil das Internet genug Beispiele für Chatanwendungen aufweist, entwickeln wir im Rahmen des Tutorials eine originelle Auktionsplattform.
Die Umsetzung erfolgt mit uns bekannten Frameworks wie "Angular" im Frontend und Java "Spring Boot" im Backend.
Tieferes Verständnis der verwendeten Technologien ist für die eigene Umsetzung nicht erforderlich, aber von Vorteil.

# Clientimplementierung mittels STOMP.js
Bei Erstellung der Komponente öffnen wir eine neue WebSocket Verbindung in dem wir eine Objekt mittels der nativen API erstellen.


```typescript
openWebsocketConnection() {
    this.websocket = this.httpService.getWebsocket();

    this.client = Stomp.over(this.websocket);

    this.client.connect({}, () => {
      this.client.subscribe("/update-items", (message) => {
        this.insertOrUpdateItem(JSON.parse(message.body));
      });
    });
  }
```

Unser httpService liefert eine Singletoninstanz des WebSockets.
```typescript
  getWebsocket(): WebSocket {
    return new WebSocket(environment.webSocketUrl);
  }
```

Abhängig von der gegebenen Umgebung (Entwicklung, Produktion, ...) wird die jeweilige webSocketUrl des Servers im `environment.ts` bereitgestellt.
```typescript
export const environment = {
  production: false,
  serverUrl: "http://10.212.13.98:8080",
  webSocketUrl: "ws://10.212.13.98:8080/socket-registry"
};
```

# Serverimplementierung mittels Spring Boot WebSocket
- Es gilt ein POJO für die zu ersteigernden Gegenstände anzulegen. 

```java
@Entity
public class AuctionItem {

    @Id
    @GeneratedValue
    private long id;
    private int currentBid;
    private int topBid;
    private int newBid;
    private long timeLeft;
    private String name;
    private String description;

    // .. Getter & Setter
}
```

# Fazit
Gute diese.