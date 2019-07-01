---
layout: [post, post-xml]              
title:  "Websockets bei Client-Server Anwendungen"        
date:   2019-07-01 10:00              
modified_date:                        
author: s-gbz
categories: [Java]                    
tags: [Websockets, Java, Angular, Spring, Nodejs]
---
Perfomante Bereitstellung neuster Informationen ist ein unerlässlicher Bestandteil von Anwendungen wie beispielsweise Messengern, Wetterdiensten oder Newstickern.
Trotz des generell hohen Informationsflusses sind Aktualisierungsintervalle zwischen Client und Server jedoch nicht fest definiert und bei zeitkritischen Anwendungen somit schwer zu bestimmen.
Da REST Verben nur temporäre Verbindungen initieren, sind sie der Anforderung eines steten Informationsaustausches ungenügend.

# Die Lösung: WebSockets
Die Lösung der Anforderung gelingt durch Einsatz des 2011 entwickelten [WebSocket](https://tools.ietf.org/html/rfc6455) Protokolls.
Analog zum [Beobachter-Muster](https://docs.microsoft.com/en-us/azure/architecture/patterns/publisher-subscriber) abonnieren Clients vom Server bereitgestellte Informationskanäle und erhalten Benachrichtigungen sobald Aktualisierungen bereitstehen.
Gewöhnliche HTTP Verbindungen werden mittels des [Protocol Upgrade Mechanism](https://developer.mozilla.org/en-US/docs/Web/HTTP/Protocol_upgrade_mechanism) somit zu bidirektionalen Kommunikationswegen etabliert.

