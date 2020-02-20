---
layout: [post, post-xml]                          
title:  "Serverless Architekturen mit AWS"         
date:   2020-02-20 10:25                           
modified_date: 2020-02-20 10:25                   
author: cbachmann                                  
categories: [Architekturen]                        
tags: [Architektur, Serverless, FaaS, AWS, Cloud Computing]       
---
Mit Serverless Architekturen können kleinere Anwendungen schnell und kosteneffektiv umgesetzt werden. 
Die Anwendungen können kontinuierlich um weitere Services ergänzt werden und bleiben dabei jederzeit hoch skalierbar und 
kosten-effektiv. 
In diesem Beitrag zeige ich die Vor- und Nachteile von Serverless auf und zeige anhand von drei Beispielen wie Serverless 
Services geschickt zu Anwendungen zusammengesetzt werden können.

Serverless ist die nächste Stufe in der Entwicklung und Bereitstellung von Software nach Containern. 
Serverless kommt aus dem Cloud Computing und folgt dem Trend, den Konfigurations- und Betriebsaufwand zu reduzieren, um 
sich stattdessen mehr auf die Business Logik fokussieren zu können. 
	 
	 
![Grafik 1: Verantwortungsbereiche bei der Infrastruktur](/assets/images/posts/serverless-architekturen-mit-aws/verantwortung.png)  ![Grafik 2: Weniger Konfigurationsaufwand führt zu höherem Fokus auf Business Logik](/assets/images/posts/serverless-architekturen-mit-aws/focus_vs_costs.png)
	 

Bei Serverless gibt es zwar immer noch Server, aber der Betrieb und die Wartung inkl. das Patchen des Betriebssystems 
ist an den Cloud Provider ausgelagert. 
Grafik 1 veranschaulicht die Verringerung des eigenen Verwantwortungsbereichs für die Infrastruktur bei dem Einsatz von 
Serverless Services gegenüber Containern. 
Damit einher geht der steigende Fokus auf die Business Logik (Grafik 2), wodurch eine schnellere Time-to-Market erzielt 
werden kann. 
Außerdem bringen Serverless Services Hochverfügbarkeit und nahezu endlose Skalierung mit, ohne Anpassungen an der 
Architektur vornehmen zu müssen.

Es gibt auch Serverless Lösungen für den Betrieb von Containern (Bspw. AWS Fargate). B
ei diesen Lösungen ist man zwar nicht für den Betrieb des Servers zuständig, aber weiterhin für das Management des 
Betriebssystems und der Laufzeitumgebung, wodurch der Vorteil nicht so hoch ausfällt wie bei Serverless Services, die 
ohne Container auskommen.


# Serverless != FaaS

Serverless wurde ursprünglich im Zusammenhang mit Function-as-a-Service (FaaS) wie AWS Lambda genannt. 
Heute versteht man darunter eine neue Art in der Bereitstellung und dem Betrieb von Software, bei der man sich nicht mehr 
um Infrastrutkur und Server kümmern muss. 
Die Cloud Provider bieten eine große und stetig wachsende Vielfalt an Serverless Services an, wie Datenbanken, Cognitive 
Services oder Authentisierungs-Lösungen. 
Softwareprojekte lassen sich damit vor allem schnell und kostengünstig realisieren. 

Die Vorteile von Serverless im Vergleich zu Containern:

**Kosten**
-	Pay-per-Use Modell. Es entstehen keine Kosten für Leerlauf (Je nach Service wird eine Grundgebühr erhoben)
-	Niedrigere Wartungskosten, da keine Server oder Betriebssyteme gewartet werden müssen
-	Die Anwendung ist in noch kleinere Bausteine zerlegt als bspw. bei Microservices, dadurch kann noch effizienter 
skaliert werden


**Einfachheit & Schnelligkeit**

-	Fokus auf Businesslogik statt auf Infrastruktur oder Frameworks
-	Ideal für Proof-of-Concept und Rapid-Prototyping

**Skalierbarkeit**
-	Als Grundfunktion automatisch gegeben und Aufgabe des Cloud Providers
-	Die Architektur kann beibehalten werden, auch wenn die Last kontinuierlich steigt
-	Es besteht kein Risiko für Über- oder Unter-Provisionierung von Ressourcen

**Sicherheit**
-	Security Updates des darunterliegenden Betriebssystems und der Ausführungsumgebung werden vom Cloud Provider aktuell 
gehalten

**Hochverfügbarkeit**
-	Als Grundfunktion automatisch gegeben
-	Cloud-Provider definieren SLAs mit hoher Verfügbarkeit, bspw. AWS Lambda 99,95%

**Effizienz**
-	Die Belegung von Ressourcen bei Leerlauf wird vermieden dadurch ist global gesehen eine insgesamt bessere 
Auslastung möglich


# Nachteile gegenüber Containern

**Vendor-Lock-In**

Einige Services lassen sich einfacher zu anderen Cloud Providern migrieren als andere, wodurch man sich vom Cloud 
Provider teilweise abhängig macht. 
In gewisser Weise hat man dieses Problem jedoch mit jedem Framework und jeder Datenbank. 

**Kaltstart**

Das Kaltstart Problem bezieht sich auf Functions-as-a-Service und bezeichnet das Problem, dass Funktionen bei der 
ersten Ausführung relativ lange für den Start benötigen.
Dieses Problem lässt sich jedoch mit der Wahl der richtigen Programmiersprache umgehen. 



# Verkettung von Serverless Funktionen durch Events

Im Mittelpunkt einer Serverless Anwendung steht fast immer eine oder mehrere Serverless Funktionen. 
Serverless Funktionen sind Event-getrieben. Über Events lassen sich Serverless Services und Funktionen geschickt 
miteinander kombinieren. 
Ein kleiner Auszug aus den möglichen Auslösern für Lambda Funktionen:
-	Ablage oder Änderung einer Datei im Objektspeicher (S3)
-	Änderungen für einzelne Records in einer Datenbank (DynamoDB)
-	Auslesen einer Queue (SQS)
-	Eingang einer E-Mail (SES)
-	Eingang einer Nachricht auf einem Topic (SNS)

# Beispiele für Serverless Architekturen

Im Folgenden Abschnitt möchte ich nun drei Anwendungsfälle für Serverless Architekturen mit AWS vorstellen. 

## Beispiel 1: Serverless Webanwendung

![Grafik 3: Serverless Architektur für eine Single-Page-Applikation mit Datenbankzugriff](/assets/images/posts/serverless-architekturen-mit-aws/spa.png) 



Grafik 3 zeigt eine Serverless Architektur für eine einfache Single-Page-Applikation mit Backend und Datenbankzugriff.

Statische Webseiten und Single-Page-Applikationen mit Angular oder React können sehr kostengünstig auf S3 gehostet 
werden. 
Diese Funktion kann man einfach per Konfiguration aktivieren.

Um Zugriffe auf die Datenbank zu authentisieren empfiehlt sich der Benutzer- und Authentisierungsservice Cognito. 
Dieser stellt auch die Login-Maske bereitstellt. Mit dem beim Login erhaltenen Token kann dann über das API Gateway, 
das als HTTPs-Endpunkt dient,  auf die Lambda Funktion und die Datenbank zugegriffen werden.

Möchte man seine eigene Domain auf die Webseite verweisen lassen, muss man zusätzlich den DNS Service Route53 dafür 
konfigurieren. 

Diese Lösung eignet sich besonders für Anwendungsfälle, bei denen die Weboberfläche nur selten genutzt wird, da keine 
Kosten für den kontinuierlichen Betrieb eines Servers entstehen. 


## Beispiel 2: Serverless E-Mail Server 

![Grafik 4: Serverless E-Mail Server](/assets/images/posts/serverless-architekturen-mit-aws/mailserver.png)  



Grafik 4 zeigt eine Serverless Architektur für einen Serverless E-Mail Server. 
Kern der Funktionalität ist der Simple E-Mail Service (SES), der sowohl E-Mails senden als auch empfangen kann. 
Eine eingehende E-Mail wird von SES empfangen und dieser leitet die Daten an eine Lambda-Funktion weiter. 
Die Lambda-Funktion ordnet der E-Mail das Postfach anhand des Empfängers zu welches in einer DynamoDB Datenbank 
gespeichert ist.

Gerade Mail-Server haben in der Regel eine geringe Auslastung und müssen doch ständig erreichbar sein. 
Daher ist diese Architektur sehr effizient im Ressourcenverbrauch. 
Außerdem bietet sie die Möglichkeit für E-Mail gesteuerte Workflows, was sonst nur umständlich erreicht werden kann.
 


## Beispiel 3: Datenverarbeitung von Dokumenten und Bildern

![Grafik 5: Serverless Architektur für die Datenverarbeitung von Dokumenten und Bildern](/assets/images/posts/serverless-architekturen-mit-aws/textract.png)  


Grafik 5 zeigt eine Serverless Architektur für die Datenverarbeitung von Dokumenten und Bildern. 
Die Bilder und Dokumente werden auf den Objektspeicher S3 per HTTPs hochgeladen.
Das Speichern löst ein Event aus, das eine Lambda Funktion startet. 
Diese Funktion leitet die Dokumente an den Service Textract weiter, der per OCR-Erkennung den Text extrahiert. 
Anschließend wird der Text in eine Elastic Search Datenbank gespeichert, die es ermöglicht die Texte zu durchsuchen.

Datenverarbeitung von Dokumenten und Bildern ist in der Regel ressourcenintensiv. 
Hier kommen in der Regel leistungsstarke und kostenintensive Systeme zum Einsatz. 
Die Vorteile dieser Lösung sind die hohe Skalierbarkeit und Ressourcen-Effizienz.


# Fazit und Ausblick

Serverless ist eine neue Philosophie für die Entwicklung und Bereitstellung von Software. 
Es ermöglicht eine schnellere Entwicklung durch mehr Fokus auf die Business Logik und verspricht niedrigere 
Wartungskosten wovon sowohl Auftraggeber als auch Entwickler profitieren. 
Es gibt bereits eine große Vielfalt an Serverless Services die geschickt miteinander kombiniert werden können und die 
großen Cloud Anbieter stellen regelmäßig neue Services bereit. 
Die Serverless Bewegung nimmt gerade erst Fahrt auf und es wird spannend zu beobachten, ob sie Container verdrängen wird.


# Weiterführende Links

[https://aws.amazon.com/de/serverless/](https://aws.amazon.com/de/serverless/)
[https://martinfowler.com/articles/serverless.html](https://martinfowler.com/articles/serverless.html)
