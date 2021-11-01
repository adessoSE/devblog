---
layout: [post, post-xml]                          
title:  "Serverless Architekturen mit AWS"         
date:   2020-03-02 13:00                   
author_ids: [c-bachmann]                                  
categories: [Architektur]                        
tags: [Architektur, Serverless, FaaS, AWS, Cloud Computing]       
---

Mit Serverless Architekturen können kleinere Anwendungen schnell und kosteneffektiv umgesetzt werden. 
Die Anwendungen können kontinuierlich um weitere Services ergänzt werden und bleiben dabei jederzeit hoch skalierbar und 
kosten-effektiv. 
In diesem Beitrag zeige ich die Vor- und Nachteile von Serverless auf und demonstriere anhand von drei Beispielen wie Serverless 
Services geschickt zu Anwendungen zusammengesetzt werden können.

Serverless ist die nächste Stufe in der Entwicklung und Bereitstellung von Software nach Containern. 
Serverless kommt aus dem Cloud Computing und folgt dem Trend, den Konfigurations- und Betriebsaufwand zu reduzieren, um 
sich stattdessen mehr auf die Business Logik fokussieren zu können. 
Bei Serverless gibt es zwar immer noch Server, aber der Betrieb und die Wartung inkl. das Patchen des Betriebssystems 
ist an den Cloud Provider ausgelagert. 
	 
	 
![Fokus auf Business Logik](/assets/images/posts/serverless-architekturen-mit-aws/focus_vs_costs.png)
	 

Die Grafik veranschaulicht die Verringerung des eigenen Verwantwortungsbereichs für die Infrastruktur bei dem Einsatz von 
Serverless Services gegenüber Containern. 
Damit einher geht der steigende Fokus auf die Business Logik, wodurch eine schnellere Time-to-Market erzielt 
werden kann. 
Außerdem bringen Serverless Services Hochverfügbarkeit und nahezu endlose Skalierung mit, ohne Anpassungen an der 
Architektur vornehmen zu müssen.

Es gibt auch Serverless Lösungen für den Betrieb von Containern, beispielsweise AWS [Fargate](https://aws.amazon.com/de/fargate/). 
Bei diesen Lösungen ist man zwar nicht für den Betrieb des Servers zuständig, aber weiterhin für das Management des 
Betriebssystems und der Laufzeitumgebung, wodurch der Vorteil nicht so hoch ausfällt wie bei Serverless Services, die 
ohne Container auskommen.


# Serverless != FaaS

Serverless wurde ursprünglich im Zusammenhang mit Function-as-a-Service (FaaS) wie AWS Lambda genannt. 
Heute versteht man darunter eine neue Art in der Bereitstellung und dem Betrieb von Software, bei der man sich nicht mehr 
um Infrastrutkur und Server kümmern muss. 
Die Cloud Provider bieten eine große und stetig wachsende Vielfalt an Serverless Services an, wie Datenbanken, Cognitive 
Services oder Authentisierungs-Lösungen. 
Softwareprojekte lassen sich damit vor allem schnell und kostengünstig realisieren. 

Es gibt mehrere Vorteile von Serverless im Vergleich zu Containern, welche ich im folgenden zeigen möchte.

**Kosten**
* Durch das Pay-per-Use Modell entstehen keine Kosten für Leerlauf, je nach Service kann eine Grundgebühr erhoben werden.
* Die Wartungskosten sind niedrig, da keine Server oder Betriebssyteme gewartet werden müssen.
* Die Anwendung ist in noch kleinere Bausteine zerlegt als bei Microservices und kann dadurch noch effizienter 
skaliert werden.

**Einfachheit & Schnelligkeit**
* Bei der Entwicklung gibt es einen deutlich veringerten Overhead für den Aufbau der Infrastruktur oder den Einsatz von Frameworks .
* Serverless ist ideal für Proof-of-Concept Projekte und Rapid-Prototyping.

**Skalierbarkeit**
* Skalierbarkeit ist als Grundfunktion automatisch gegeben und Aufgabe des Cloud Providers.
* Die Architektur kann beibehalten werden, auch wenn die Last kontinuierlich steigt.
* Es besteht kein Risiko für Über- oder Unter-Provisionierung von Ressourcen.

**Sicherheit**
* Die Security Updates des darunterliegenden Betriebssystems und der Ausführungsumgebung werden vom Cloud Provider aktuell 
gehalten.

**Hochverfügbarkeit**
* Hochverfügbarkeit ist als Grundfunktion automatisch gegeben.
* Die Cloud-Provider definieren SLAs mit hoher Verfügbarkeit, bspw. AWS Lambda 99,95%.

**Effizienz**
* Die Belegung von Ressourcen bei Leerlauf wird vermieden dadurch ist global gesehen eine insgesamt bessere 
Auslastung möglich.


Die folgenden Punkte veranschaulichen die Nachteile von Serverless gegenüber Containern.

**Vendor-Lock-In**

* Einige Services lassen sich einfacher zu anderen Cloud Providern migrieren als andere, wodurch man sich vom Cloud 
Provider teilweise abhängig macht. 
In gewisser Weise hat man dieses Problem jedoch mit jedem Framework und jeder Datenbank. 

**Kaltstart**

* Das Kaltstart Problem bezieht sich auf Functions-as-a-Service und bezeichnet das Problem, dass Funktionen bei der 
ersten Ausführung relativ lange für den Start benötigen.
Dieses Problem lässt sich jedoch mit der Wahl der richtigen Programmiersprache umgehen. 

# Die wichtigsten Serverless Services bei AWS

Die folgende Liste gibt eine Kurzbeschreibung über die wichtigsten Serverless Services von AWS, welche für die folgenden Beispiele verwendet werden.

![S3](/assets/images/posts/serverless-architekturen-mit-aws/s3.png)
![Lambda](/assets/images/posts/serverless-architekturen-mit-aws/lambda.png)
![Api-Gateway](/assets/images/posts/serverless-architekturen-mit-aws/api-gateway.png)
![Cognito](/assets/images/posts/serverless-architekturen-mit-aws/cognito.png)
![DynamoDB](/assets/images/posts/serverless-architekturen-mit-aws/dynamodb.png)

* Der **[Simple Storage Service (S3)](https://aws.amazon.com/de/s3/)** ist ein Objektspeicher der standardmäßig per HTTPS angesprochen wird. 
* Mit **[Lambda](https://aws.amazon.com/de/lambda/)** lassen sich einzelne Funktionen in der Cloud ausführen, ausgelöst durch Events. Es werden viele Programmiersprachen unterstützt. 
* Das **[API-Gateway](https://aws.amazon.com/de/api-gateway/)** dient als HTTPS-Endpunkt für den Aufruf von Lambda-Funktionen. 
* **[Cognito](https://aws.amazon.com/de/cognito/)** ist ein vollständig verwalteter Benutzer- und Authentisierungsservice. Er unterstützt gängige Mechanismen wie OAuth2. 
* **[DynamoDB](https://aws.amazon.com/de/dynamodb/)** ist eine Dokumentenorientierte Datenbank.  


# Verkettung von Serverless Funktionen durch Events

Im Mittelpunkt einer Serverless Anwendung steht fast immer eine oder mehrere Serverless Funktionen. 
Serverless Funktionen sind Event-getrieben. Über Events lassen sich Serverless Services und Funktionen geschickt 
miteinander kombinieren. 

Ein kleiner Auszug aus den [möglichen Auslösern](https://docs.aws.amazon.com/lambda/latest/dg/lambda-services.html#intro-core-components-event-sources) für Lambda Funktionen:
* Ablage oder Änderung einer Datei im Objektspeicher (S3)
* Änderungen für einzelne Records in einer Datenbank (DynamoDB)
* Auslesen einer Queue ([SQS](https://aws.amazon.com/de/sqs/))
* Eingang einer E-Mail ([SES](https://aws.amazon.com/de/ses/))
* Eingang einer Nachricht auf einem Topic ([SNS](https://aws.amazon.com/de/sns/))

# Beispiele für Serverless Architekturen

Im folgenden Abschnitt möchte ich nun drei Anwendungsfälle für Serverless Architekturen mit AWS vorstellen. 

## Beispiel 1: Serverless Webanwendung

![Serverless Webanwendung](/assets/images/posts/serverless-architekturen-mit-aws/spa.png) 

Die Grafik zeigt eine Serverless Architektur für eine einfache Single-Page-Applikation mit Backend und Datenbankzugriff.

Statische Webseiten und Single-Page-Applikationen mit Angular oder React können sehr kostengünstig [auf S3 gehostet 
werden](https://docs.aws.amazon.com/de_de/AmazonS3/latest/dev/WebsiteHosting.html). 
Diese Funktion ist standardmäßig ausgeschaltet, sie kann aber im AWS Portal einfach per Konfiguration aktiviert werden.

Um Zugriffe auf die Datenbank zu authentisieren empfiehlt sich der Benutzer- und Authentisierungsservice Cognito. 
Dieser stellt auch die Login-Maske bereitstellt. Mit dem beim Login erhaltenen Token kann dann über das API Gateway, 
das als HTTPs-Endpunkt dient,  auf die Lambda Funktion und die Datenbank zugegriffen werden.

Möchte man seine eigene Domain auf die Webseite verweisen lassen, muss man zusätzlich den DNS Service [Route53](https://aws.amazon.com/de/route53/) dafür 
konfigurieren. 

Diese Lösung eignet sich besonders für Anwendungsfälle, bei denen die Weboberfläche nur selten genutzt wird, da keine 
Kosten für den kontinuierlichen Betrieb eines Servers entstehen. 


## Beispiel 2: Serverless E-Mail Server 

Folgende Grafik zeigt eine Serverless Architektur für einen Serverless E-Mail Server. 

![Serverless E-Mail Server](/assets/images/posts/serverless-architekturen-mit-aws/mailserver.png)  


Kern der Funktionalität ist der Simple E-Mail Service (SES), der sowohl E-Mails senden als auch empfangen kann. 
Eine eingehende E-Mail wird von SES empfangen und dieser leitet die Daten an eine Lambda-Funktion weiter. 
Die Lambda-Funktion ordnet der E-Mail das Postfach anhand des Empfängers zu welches in einer DynamoDB Datenbank 
gespeichert ist. 

Für den Zugriff auf das Postfach bieten sich wiederum unterschiedliche Möglichkeiten.
Die Postfach-Datenbank kann von einer Anwendung direkt angesprochen werden oder 
alternativ kann die Webanwendung aus Beispiel 1 verwendet werden. 

Gerade Mail-Server haben in der Regel eine geringe Auslastung und müssen doch ständig erreichbar sein. 
Daher ist diese Architektur sehr effizient im Ressourcenverbrauch. 
Außerdem bietet sie die Möglichkeit für E-Mail gesteuerte Workflows, was sonst nur umständlich erreicht werden kann.
 


## Beispiel 3: Datenverarbeitung von Dokumenten und Bildern

![Serverless Datenverarbeitung](/assets/images/posts/serverless-architekturen-mit-aws/textract.png)  

Die oben stehende Grafik zeigt eine Serverless Architektur für die Datenverarbeitung von Dokumenten und Bildern. 
Die Bilder und Dokumente werden auf den Objektspeicher S3 per HTTPS hochgeladen.
Das Speichern löst ein Event aus, das eine Lambda Funktion startet. 
Diese Funktion leitet die Dokumente an den Service [Textract](https://aws.amazon.com/de/textract/) weiter, der per OCR-Erkennung den Text extrahiert. 
Anschließend wird der Text in eine Elastic Search Datenbank gespeichert, die es ermöglicht die Texte zu durchsuchen.

Datenverarbeitung von Dokumenten und Bildern ist meist ressourcenintensiv. 
Hier kommen in der Regel leistungsstarke und kostenintensive Systeme zum Einsatz. 
Die Vorteile dieser Lösung sind die hohe Skalierbarkeit und Ressourcen-Effizienz.


# Fazit und Ausblick

Serverless ist eine neue Art für die Entwicklung und Bereitstellung von Software. 
Es ermöglicht eine schnellere Entwicklung durch mehr Fokus auf die Business Logik und verspricht niedrigere 
Wartungskosten wovon sowohl Auftraggeber als auch Entwickler profitieren. 
Es gibt bereits eine große Vielfalt an Serverless Services die geschickt miteinander kombiniert werden können und die 
großen Cloud Anbieter stellen regelmäßig neue Services bereit. 
Die Serverless Bewegung nimmt gerade erst Fahrt auf und ich beobachte gespannt, ob sie Container verdrängen wird.

Wer dies selbst ausprobieren möchte, kann sich einen [Einstieg zu Serverless bei AWS](https://aws.amazon.com/de/serverless/) anschauen.
[Der Beitrag zu Serverless Architekturen von Mike Roberts](https://martinfowler.com/articles/serverless.html) bietet eine weitergehende Übersicht.
