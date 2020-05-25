---
layout: [post, post-xml]                          
title:  "Gründe und Strategien für die Migration einer Applikation in die Cloud"         
date:   2020-05-25 13:00                   
author: c-bachmann                                  
categories: [Architektur]                        
tags: [Architektur, Serverless, FaaS, AWS, Cloud Computing]       
---

In Deutschland setzen nur 22% der Unternehmen Cloud Services ein. 
Damit befindet sich Deutschland im europäischen Vergleich im hinteren Drittel. 
Der Einsatz von Cloud Computing findet oft durch den Einsatz in Neuentwicklungen Einzug in die Unternehmen. 
In meinem Blogbeitrag möchte ich aufzeigen, dass sich der Aufwand für die Migration einer bestehenden Anwendung in die Cloud lohnt. 

Das Ziel der agilen Softwareentwicklung ist es hochwertige, stets nutzbare Software zu liefern, die kontinuierlich erweitert werden kann. 
Auf die Bereitstellung der Infrastruktur und den Betrieb der Software entfällt dabei notwendigerweise ein großer Anteil des Aufwands.
Durch die Migration einer Anwendung in die Cloud kann der Aufwand für die Infrastruktur weiter in den Hintergrund und die Fokussierung auf die 
Geschäftslogik weiter in den Vordergrund gerückt werden. 
Die bessere Änderbarkeit der Software kann für das Geschäftsmodell einen Wettbewerbsvorteil darstellen.
Egal ob es bekannte Probleme in der bestehenden Anwendung gibt oder nicht, die Möglichkeiten der Cloud bieten ein großes Verbesserungspotential für bestehende Anwendungen. 
In diesem Blogbeitrag zeige ich die Argumente auf, die für den Umzug einer bestehenden Anwendung in die Cloud sprechen und ich zeige die möglichen Migrationspfade in die Cloud.  
Die Beispiele in diesem Beitrag beziehen sich auf die [AWS Cloud](https://aws.amazon.com/de/). 
Zu nahezu allen Diensten findet man ein entsprechendes Pendant bei [Microsoft Azure](http://azure.microsoft.com/) oder in der [Google Cloud](http://cloud.google.com/).

# Gründe für die Migration in die Cloud

Die folgende Grafik zeigt einen Überblick über die wichtigsten Gründe, die sich in Kostenreduktion und Unterstützung der Geschäftsstrategie gruppieren lassen. 
Die einzelnen Argumente stelle ich im folgenden Abschnitt genauer vor.

![Gründe für die Migration einer Anwendung in die Cloud](/assets/images/posts/gruende-und-strategien-fuer-cloud-migration/gruende.png) 

## Kostenreduktion

Der Aufwand für den Betrieb und die Wartung der Infrastruktur wird oft nicht bemessen und dadurch unterschätzt. 
Eine Kostenaufstellung und ein Vergleich mit der Cloud zeigen meist auf, dass sich eine Migration lohnt. 
In der Cloud entfallen die Kosten und der Aufwand für die Anschaffung und für die Inbetriebnahme von Hardwarekomponenten. 
Außerdem lassen sich in der Cloud die Kosten, die durch Überprovisierung entstehen, reduzieren, da die Cloud Skalierung und ein Pay-per-Use Preismodell bietet.
Bei Datenspeichern in der Cloud gibt es eine Vielfalt an [Speicherklassen](https://aws.amazon.com/de/s3/storage-classes/). 
Durch die gezielte Auswahl der passenden Speicherklasse, lassen sich Kosten einsparen. 
Insbesondere Speicherklassen für Langzeitarchivierung und mit seltenem Zugriff sind sehr kostengünstig.

## Skalierbarkeit

Eine selbst betriebene Infrastruktur wird in der Regel mit einer fixen Kapazität für die Spitzenlast provisioniert, die nur selten ausgereizt wird.  
Dadurch entsteht eine Überprovisionierung von Ressourcen, wie die folgende Grafik verdeutlicht.

![Vermeidung von Überprovisionierung in der Cloud](/assets/images/posts/gruende-und-strategien-fuer-cloud-migration/provisionierung.png) 

Werden die Kapazitätsgrenzen erreicht, muss erst Hardware zugekauft und in Betrieb genommen werden, was eine mehr oder weniger lange Vorlaufzeit erfordert. 
In der Cloud betriebene Software hingegen lässt sich jederzeit horizontal oder vertikal skalieren und kann leicht für automatische Skalierung konfiguriert werden. 
Probleme mit vollgelaufenem Festplattenspeicher können in der Cloud eliminiert werden. Dazu gibt es Speicherdienste mit Pay-per-Use Modell und unbegrenzter Kapazität.

## Verfügbarkeit

Die Cloud Anbieter sichern eine [hohe Verfügbarkeit](https://aws.amazon.com/de/compute/sla/) ihrer Dienste von 99,99% oder höher vertraglich zu, welche mit eigener Infrastruktur nicht erreicht werden kann. 
Darüber hinaus ist es in der Cloud einfach, die Anwendung auf mehrere Rechenzentren zu verteilen und [automatisches Failover](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-failover-types.html) zu konfigurieren.


## Sicherheit

Bei dem Betrieb einer Software ist es notwendig, kontinuierlich auf bekannt gewordene Sicherheitslücken zu reagieren. 
Zu den betroffenen Ebenen können das Betriebssystem, die Laufzeitumgebung sowie die verwendeten Bibliotheken innerhalb der Anwendung zählen.
Stützt man sich ganz auf [Serverless Services](https://aws.amazon.com/de/serverless/), kann man sich darauf verlassen, dass der Cloud Anbieter sich kontinuierlich um die 
Einspielung von Sicherheitspatches für das Betriebssystem und Laufzeitumgebungen kümmert. 
Darüber hinaus lässt sich die Sicherheit durch Automatisierung der Infrastruktur erhöhen (Stichwort „[Infrastructure as Code](https://aws.amazon.com/de/cloudformation/)“, kurz IaC). 
Bei IaC wird jeder Teil der Infrastruktur durch ein Script beschrieben. 
In diesem Dokument stehen u.a. die benötigen Services, Instanzen, Festplatten sowie Virtuelle (Sub-)Netze und deren Routing. 
Durch automatisiertes Aufsetzen der Infrastruktur werden menschliche Fehler reduziert. 
Für Webanwendungen in der Cloud stehen Services zum [DDoS-Schutz](https://aws.amazon.com/de/shield/) und [Web Application Firewalls](https://aws.amazon.com/de/waf/) jederzeit auf Abruf bereit.

Das zweithäufigste Sicherheitsproblem laut [OWASP Top 10 für Webanwendungen](https://owasp.org/www-project-top-ten/) ist die mangelnde Umsetzung bei der Authentisierung („Broken Authentication“). 
Die Cloud Anbieter bieten dazu Authentisierungsdienste an ([Cognito](https://aws.amazon.com/de/cognito/)), die einfach zu integrieren sind und mit denen sich dieses Risiko verringern lässt.
Außerdem stehen Services für das sichere Verwalten von Sicherheitsschlüsseln ([KMS](https://aws.amazon.com/de/kms/)) und die sichere Verwendung von Passwörtern innerhalb der Anwendung bereit ([Secrets Manager](https://aws.amazon.com/de/secrets-manager/)). Verschlüsselung bei der Übertragung ist bei allen Services Standard und [Verschlüsselung für persistente Daten](https://docs.aws.amazon.com/de_de/AmazonS3/latest/dev/serv-side-encryption.html) kann leicht aktiviert werden.

## Agilität und Erweiterbarkeit

Der Betrieb der Anwendung in der Cloud und der Einsatz von Cloud nativen Services fördert die Agilität, da Änderungen an der technischen Infrastruktur 
schnell umsetzbar sind. Dadurch rücken die fachlichen Anforderungen weiter in den Vordergrund, was die Entwicklungsgeschwindigkeit erhöht.

## Internationale Expansion

Die Cloud Anbieter betreiben Rechenzentren, die auf der ganzen Welt verteilt sind. 
Mit dem Betrieb einer Anwendung in der Cloud ist es einfach, sie international zu expandieren und an mehreren Standorten zu betreiben. 
Das ermöglicht niedrige Zugriffszeiten für Kunden auf der ganzen Welt. 
Viele Cloud Services darunter auch Datenbanken unterstützen [globale Datenreplikation](https://aws.amazon.com/de/dynamodb/global-tables/). 

## Datensicherung

Datenbanken und Speicherdienste in der Cloud bieten die Möglichkeit für automatische Datensicherungen sowie [Point-in-Time Recovery](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/PointInTimeRecovery_Howitworks.html). 
Von Festplatten kann jederzeit ein [Snapshot erstellt](https://docs.aws.amazon.com/de_de/AWSEC2/latest/UserGuide/ebs-creating-snapshot.html) werden, oder ein alter Snapshot eingespielt werden.




# Migrationsstrategien: Die 6 R‘s

Die folgende Grafik zeigt die 6 Strategien für die Migration einer Anwendung in die Cloud, auch die 6 R’s genannt, mit unterschiedlichem Grad der Cloudintegration.

![Migrationsstrategien und Cloud Integration Grad](/assets/images/posts/gruende-und-strategien-fuer-cloud-migration/grad-adoption.png)  
 
Die Strategien schließen sich dabei nicht gegenseitig aus. 
Es ist durchaus empfehlenswert, kleinschrittiger vorzugehen und die Strategien aufeinander aufbauend anzuwenden. 
Im folgenden Abschnitt gehe ich nun detaillierter auf die 6 bekannten Cloud Migrationsstrategien ein.


## Rehosting / Lift-and-Shift

Die Rehosting Strategie stellt den ersten Schritt für die Migration einer Anwendung in die Cloud dar.
Die Strategie hat zum Ziel, die Anwendung in die Cloud zu überführen, ohne Anpassungen an der Architektur vorzunehmen. 
Bei diesem Integrationsschritt werden noch keine höherwertigen Cloud Services eingesetzt. 
Die Migration stützt sich auf den Computing Dienst [EC2](https://aws.amazon.com/de/ec2/) und [EBS](https://aws.amazon.com/de/ebs/) als Blockspeicher.
Virtuelle Maschinen werden in die Cloud „kopiert“. 
Dazu gibt es bei AWS das Werkzeug [VM-Import](https://aws.amazon.com/ec2/vm-import/), dass den Import bspw. einer VMWare oder Microsoft Hyper-V VM automatisiert.
In diesem Schritt wird normalerweise noch keine automatische Skalierung konfiguriert. 
Gab es vorher einen redundanten Betrieb und einen Loadbalancer, so wird diese Konfiguration mit in die Cloud überführt.

Der Vorteil dieser Strategie ist, dass sie als Einstieg leicht anzuwenden ist und durch Werkzeugunterstützung größtenteils automatisiert werden kann. 
Die Anwendung der weiteren Migrationsschritte ist deutlich einfacher, wenn die Anwendung bereits in der Cloud betrieben wird.
Außerdem können häufig allein durch den Wechsel in die Cloud rund 25% oder mehr bei den Betriebskosten eingespart werden 
([Fallstudie 1](https://aws.amazon.com/de/solutions/case-studies/ge-oil-gas/), 
[Fallstudie 2](https://www.youtube.com/watch?v=xS8Ha0Q6_CY&feature=youtu.be)).


## Replatforming

Bei der Replatforming Strategie geht es darum, einzelne Komponenten der Anwendung in die Cloud auszulagen ohne dabei die Architektur zu überarbeiten. 
Komponenten, die zuvor selbst verwaltet wurden, können durch Cloud verwaltete Services ersetzt werden. 
Typische Dienste dazu sind Datenbanken ([RDS](https://aws.amazon.com/de/rds/), [DynamoDB](https://aws.amazon.com/de/dynamodb/)), 
Queues ([SQS](https://aws.amazon.com/de/sqs/)) und Speicherdienste ([S3](https://aws.amazon.com/de/s3/)).
Der Betrieb der Anwendung kann in diesem Schritt durch den Einsatz von Diensten, die sich auf Container Technologien stützen, weiter automatisiert werden. 
Zu diesen Diensten zählen [ECS](https://aws.amazon.com/de/ecs/) und [Elastic Beanstalk](https://aws.amazon.com/de/elasticbeanstalk/) für Docker Container 
sowie [EKS](https://aws.amazon.com/de/eks/) für Kubernetes.

Die wesentlichen Vorteile nach Anwendung dieser Strategie sind der geringere Wartungsaufwand für den Betrieb sowie die höhere Skalierbarkeit und die höhere Zuverlässigkeit.
Für die Anwendung dieser Strategie muss die Anwendung nicht zwingend in der Cloud betrieben werden. 
Für die Vermeidung zu großer Latenzen ist es jedoch sinnvoll.


## Repurchasing

Die Repurchasing Strategie hat zum Ziel, von einer zuvor selbst betriebenen Software auf ein Cloud Produkt umzusteigen. 
Beispielsweise von einem selbst betriebenen Ticketsystem oder WIKI zu einem Software-as-a-Service Produkt.
Durch die Anwendung dieser Strategie entfällt der Wartungsaufwand für das Patchen und Skalieren der Software.
Die Migration der Bestandsdaten vom alten in das neue Produkt kann unterschiedlich großen Aufwand bedeuten. 
Handelt es sich um das gleiche Produkt oder den gleichen Hersteller wird der Import i.d.R durch Werkzeuge unterstützt.

## Refactoring / Rearchitecting

Bei der Refactoring Strategie wird nun auch die Architektur der Anwendung betrachtet und ggf. angepasst, um das volle Potential der Cloud zu nutzen.
Ziel ist es, sich überall auf Cloud Services zu stützen, wo es möglich ist. 
Im Idealfall kommen dabei Serverless Services zum Einsatz, die den höchsten Grad an Skalierung bei gleichzeitig niedrigstem Betriebsaufwand bieten.
Für die Skalierbarkeit sollte geprüft werden, ob es sinnvoll ist, die Anwendung in Microservices zu zerlegen.  
Einzelne Funktionen, die selten aufgerufen werden oder extrem schnell skalieren müssen, sollten als Serverless Functions ([Lambda](https://aws.amazon.com/de/lambda/)) ausgelagert werden.
Die Authentisierung kann nun auf den Cloud Service Cognito umgestellt werden. 
Statische Webseiten sollten aus der Anwendung herausgelöst werden und auf dem Speicherdienst [S3 gehostet](https://docs.aws.amazon.com/de_de/AmazonS3/latest/dev/WebsiteHosting.html) werden.
Falls noch nicht geschehen, sollte der Betrieb nun auf Container-Dienste wie ECS für Docker Container oder EKS für Kubernetes, 
optional mit der Serverless Unterstützung von [Fargate](https://aws.amazon.com/de/fargate/), umgestellt werden. 
Ebenfalls sollte die Infrastruktur nun automatisiert über Infrastructure-as-Code Werkezeuge wie [AWS CloudFormation](https://aws.amazon.com/de/cloudformation/) oder 
[Terraform](https://www.terraform.io/) ausgerollt werden.

Die Umsetzung der Strategie erfordert im Vergleich den höchsten Aufwand.
Nach der Durchführung ist die Anwendung eine Cloud native Anwendung, die das Geschäftsmodell und die kontinuierliche Weiterentwicklung bestmöglich unterstützt.

## Retain

Steht den Migrationskosten kein erhöhter Nutzen gegenüber, ist es legitim, keine Migration durchzuführen. 
Das schließt nicht aus, dass die Strategie regelmäßig überprüft und angepasst werden kann.

## Retire

Stellt man bei der Analyse fest, dass die Anwendung kaum noch genutzt wird, kann es sinnvoll sein sie einzustellen, um die Wartungs- und Betriebskosten einzusparen.


# Fazit und Ausblick

Cloud Computing ist zwar kein neues Thema mehr, dennoch wird das Potential von vielen Unternehmen noch nicht genutzt.
Durch die Migration einer Anwendung in die Cloud kann der Fokus auf die Geschäftslogik erhöht, Probleme mit der Infrastruktur reduziert und Kosten beim Betrieb gesenkt werden. Die Zeiten von endlichem Speicherplatz und begrenzter Rechenkapazität sind dank Cloud Computing vorbei.
Für die Migration einer Anwendung in die Cloud habe ich 6 mögliche Strategien vorgestellt, die aufeinander folgend angewendet werden können. 
Hat man sich für den Weg in die Cloud entschieden, bietet sich die Rehosting Strategie als erster Migrationsschritt an. 
Durch die aufeinanderfolgende Anwendung der Replatforming und der Refactoring Strategie kann die Cloud Integration kontinuierlich erhöht werden, um das ganze Potential der Cloud zu nutzen.
In einem folgenden Beitrag werde ich die konkrete Migration einer exemplarischen Webanwendung hin zu einer Cloud nativen Anwendung auf der AWS Plattform vorstellen, unter Anwendung der Refactoring Strategie.


