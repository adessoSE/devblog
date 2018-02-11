---
layout:         [post, post-xml]              
title:          "Sicherheitslücken mit dem OWASP Dependency Check erkennen"
date:           2018-03-30 12:01
modified_date: 
author:         saschagrebe 
categories:     [Java]
tags:           [OWASP, Security, Build]
---
Moderne Software basiert auf einer Vielzahl von unterschiedlichen Bibliotheken und Frameworks, die das Leben der 
Software-Entwickler einfacher machen. Es ist unmöglich die bekannten Sicherheitslücken für alle Abhängigkeiten im Blick 
zu behalten. Sogar in der OWASP Top 10 Liste der häufigsten Sicherheitsprobleme existiert ein Eintrag zur 
[Verwendung von Komponenten mit bekannten Sicherheitslücken](https://www.owasp.org/index.php/Top_10-2017_A9-Using_Components_with_Known_Vulnerabilities).
Mit dem OWASP Dependency Check lässt sich der Abgleich mit der NIST’s [National Vulnerability Database (NVD)](https://nvd.nist.gov/) 
automatisieren. In diesem Blog-Einträg möchte ich gerne zeigen wie das funktioniert.

# Sicherheitslücken in Software
- Hintergrund: Vulnerability Scanning
- NVD DB
- Referenz auf anderne Blog-Post

# Integration in den Build

## Maven Integration
- Check per CMD-Line oder per Maven

## Setup mit zentraler DB
- Unterschiedliche Integrations-Szenarien: lokale H2 DB, NVD Mirror, zentrale SQL DB

## Integration in Sonar
- Integration mit Sonar

## False-Positices ausschließen

# Fazit
- Kritik: False-Positives, Änderungen an bestehenden Valunerabilities schleppend
