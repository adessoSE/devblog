---
layout: [post, post-xml]              
title:  "Automatisiert Jira-Tickets aus AWS-Alarmen erzeugen"         
date:   2022-01-28 10:00              
author_ids:     [kaythielmann]
categories: [Architektur]           
tags: [Lambda, Cloudwatch, Jira, AWS, Cloud]        
---

Im Rahmen eines Projekts, in dem eine ganze Reihe von Microservices entwickelt und betrieben werden, hat sich eine Idee entwickelt die Bearbeitung der Alarme zu verbessern.
Basierend auf Cloudwatch-Alarmen und einem Topic im Simple Notification Service von AWS, ist bei mehreren betriebenen Microservices sowie diversen Queues und anderen Komponenten schnell eine große Menge von Alarmen konfiguriert, die auf Protokollfiltern oder Metriken der Services beruhen können.
Dabei den Überblick zu behalten, wichtige Alarme direkt zu priorisieren und die Analyse zu vereinfachen ist nicht immer einfach.
Natürlich darf nichts unter den Tisch fallen und es sollte sichergestellt sein, dass klar ist, wer gerade welchen Alarm bearbeitet.

Mit Jira ist ein Tool gegeben, welches sowieso schon in vielen Projekten eingesetzt wird. 
Wie dieses eingesetzt werden kann um die Alarme und ihren Status zu visualisieren will ich im Folgenden beschreiben.


# Wie entstand der Bedarf an der Lösung?
