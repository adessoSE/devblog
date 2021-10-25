---
layout: [post, post-xml]              
title:  "Welcher Config-Server passt zu meinem Projekt?"         
date:   2021-10-24 10:25              
author_ids:     [kaythielmann]                  # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: [Softwareentwicklung]           
tags: [Java, AWS, Cloud, Springboot, Config-Server]        
---

Konfigurationen für Artefakte von außen zu injecten ist lang bewährte Praxis und wird in vielen Softwareprojekten so gelebt.
Seien es Feature-Switches, stage-spezifische Einstellungen oder andere Werte, deren Ausprägungen stetigen Anpassungen unterworfen sein können, alle sollten am Ende gut nachvollziehbar und sicher abgelegt sein.
Dabei können verteilte Systeme aber auch bereits einzelne Artefakte im Laufe ihrer Entwicklung eine schwer überschaubare Anzahl von Umgebungsvariablen benötigen.
Einige Möglichkeiten diese Werte zentral zu verwalten, sowie deren Vor- und Nachteile, möchte ich im folgenden etwas näher betrachten.

# Motivation - Was gilt es zu beachten?
Nicht nur, dass die Anzahl der Konfigurationswerte in einem Projekt, sei es nun verteilt oder monolithisch, mit der Zeit stetig wachsen kann, auch die gespeicherten Werte an sich können unterschiedliche Anforderungen an ein Projekt stellen.
Ist die Konfiguration beispielsweise in einem git-Repository mit hinterlegt, so erschlägt man damit bereits Anforderungen an die Historisierung.
Es gibt aber auch verschiedenste schützenswerte Einstellungen, die natürlich nicht mit dem Code im Repository landen dürfen.
Diese sollten gerade für eine Produktivumgebung nicht für jeden einsehbar sein.
Darüber hinaus erhöht es die Sicherheit diese regelmäßig auszutauschen.

Übergibt man die Konfiguration in Form von Umgebungsvariablen ergeben sich je nach ausführender Plattform weitere technische Limitierungen in Bezug auf Format und Menge.
So darf z.B. in einer [AWS EC2 Umgebung](https://docs.aws.amazon.com/de_de/elasticbeanstalk/latest/dg/environments-cfg-softwaresettings.html?icmpid=docs_elasticbeanstalk_console) der Key einer Umgebungsvariable nur die Symbole ```_ . : / + \ - @``` enthalten, wobei durch die gewählte Platform noch weitere Einschränkungen möglich sind.
Auch für die Länge der Keys und Values gelten hier Einschränkungen, genauso wie für die Gesamtgröße aller Umgebungseigenschaften.

Zu guter letzt sollte für alle Umgebungsvariablen klar sein, wann und wie oft sie eigentlich gelesen werden müssen.
Reicht es einen Wert zum Zeitpunkt des Starts einer Umgebung initial zu übergeben oder ist es evtl. notwendig sogar während der Laufzeit einen Wert anpassen zu können?

Verschiedene dieser Anforderungen werden durch unterschiedliche Systeme für die Speicherung von Konfigurationen unterschiedlich gut unterstützt.
Neben dem Funktionsumfang unterscheiden sich die Systeme auch im Aufwand für Betrieb und Integration in vorhandene Projekte.

# Spring Cloud
Als konfigurierbares Docker Image verfügbar.
Leicht selbst zu implementieren und zu erweitern.
Kann gut in EKS betrieben werden.
Integration transparent durch Spring-Boot-Starter und bootstrap.properties
Properties im git-Repository möglich für mehrere Projekte und Stages, letztendlich einfach ein Verzeichnis.

## Pro
Als eigenes Projekt vollumfänglich individualisierbar.
Nahezu vollständig transparent integrierbar über spring-cloud-starter und bootstrap.properties
Konfigurierbares Docker-Image vorhanden
Lokaler betrieb via Docker möglich
Auch Client für Micronaut und NodeJS möglich.

## Contra
Betrieb im EKS kostet erstmal diverse IPs.
Keine hohe Performance nötig, aber sehr hohe Ausfallsicherheit!
Evtl. Wechselwirkungen durch neue Abhängigkeiten in pom.xml

# Unleash

# Consul

# AWS Systems Manager

# Fazit
