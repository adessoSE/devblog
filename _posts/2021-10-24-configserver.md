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
Einige Möglichkeiten diese Werte zentral zu verwalten sowie deren Vor- und Nachteile möchte ich im folgenden etwas näher beleuchten.

# Motivation - Was gilt es zu beachten?
Konfiguration wächst mit dem Projekt
Limitierungen in Format und Menge je nach Plattform
Sonderzeichen wie . oder []
Länge der Keys
Anzahl der Parameter (evtl. Begrenzung Speicherplatz)
Einsatz des gleichen Artefakts in diversen Konfigurationen ermöglichen. 
Konfiguration von außen injecten ermöglicht die Anpassung von Verhalten ohne ein Deployment. 

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
