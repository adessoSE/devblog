---
layout: [post, post-xml]              
title:  "Welcher Config-Server passt zu meinem Projekt?"         
date:   2021-10-24 10:25              
author_ids:     [kaythielmann]
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

# Spring Cloud Config Server
Ist man mit Java und dort evtl. sowieso mit Spring unterwegs, so springt einen der Spring Cloud Config Server förmlich an.
Ein Start ist in diesem Kontext schnell gemacht, denn ein einsatzfähiges Docker-Image steht bereits zur Verfügung und lässt sich leicht in bestehende Umgebungen wie z.B. AWS EKS integrieren.
Die Integration in ein springbasiertes Projekt kann vollständig transparent über einen Spring-Boot-Starter und ein wenig Konfiguration mit Hilfe einer bootstrap.properties erfolgen.
Für die initiale Befüllung des Config-Servers mit den gewünschten Properties lässt sich out-of-the-box mit einfachen Mitteln ein git Repository einbinden, welches dann auch gleich für eine Historisierung der Properties sorgt.

## Pro
Will man die vorhandenen Funktionen erweitern und z.B. Properties aus weiteren Quellen integrieren so kann man hier mit wenigen Annotationen schnell sein eigenes spring-boot-basiertes Projekt aufsetzen, in dem man sein eigener Herr ist.
Und natürlich ist man nicht darauf beschränkt hier Java-Projekte mit Spring zu versorgen.
Es stehen unter anderem auch passenden Libs für NodeJS oder Micronaut zur Verfügung.

## Contra
Am Ende bleibt der Betrieb des Service als ganz sicher nicht unlösbares aber essentielles ToDo.
Die Last auf dem Service wird dabei selten hoch sein, doch muss ein zentrales Augenmerk der Ausfallsicherheit gelten.
Ohne die passenden Umgebungsvariablen startet keine neue Umgebung. 
Jegliche Skalierung wird im schlimmsten Fall durch einen Ausfall des Config-Server verhindert.

![Aufbau der Infrastruktur](/assets/images/posts/configserver/Configserver.png)

Ein Config-Server kann eine ganze Reihe von Artefakten und auch gleichzeitig diverse Stages mit Properties versorgen.
Ändert sich aber ein Wert, so werden nur neu gestartete Instanzen diese Werte abrufen.
Geschieht dies durch Skalierungsprozesse könnte ein dauerhafter Schiefstand zwischen den Konfigurationen einzelner Instanzen entstehen.
Wer alle betroffenen Instanzen automatisch benachrichtigen und updaten will muss sich etwas einfallen lassen.
So können z.B. alle betroffenen Instanzen an einen MessageBus angeschlossen werden, an den der Config-Server entsprechende Events schickt, sobald eine Änderung eintritt.
Die Instanzen können dann die neuen Werte über ein Rolling-Update ziehen oder ihren Context on-the-fly updaten.
Aber all dies muss letztendlich selbst implementiert, betrieben und gewartet werden.

# Unleash
Steht der Fokus ehr auf Feature-Switches, soll ein sehr dynamischer Umgang mit Properties unterstützt werden oder ist AB-Testing eine Anforderung mit hoher Priorität, so kann Unleash einiges mitbringen um dies zu unterstützen.
Im Gegensatz zu anderen Lösungen liegt der Fokus hier auf dynamischen Werten, die sich zur Laufzeit, auch automatisiert einem Regelwerk folgend, ändern können. 
Es handelt sich also weniger um einen klassischen Configserver, sondern um eine Umgebung in der Feature-Switches an zur Laufzeit abgefragte Bedingungen geknüpft werden können.
Eigene Java- oder NodeJS-Lib für die Integration
Umschalten von Configswitches in der laufenden Umgebung.
AB-Testing 
Berechtigungen umsetzbar

![Aufbau der Infrastruktur](/assets/images/posts/configserver/Unleash_Aufbau.png)

##Pro

##Contra

# Consul

# AWS Systems Manager

# Fazit
