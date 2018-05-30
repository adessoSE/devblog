---
layout:         [post, post-xml]              
title: "Monitoring für Microservices - Eine Bridge für Eureka und Prometheus"
date: 2018-02-14 17:45
modified_date:
author: silasmahler
categories: [Softwareentwicklung]
tags: [Monitoring, Prometheus, Eureka, Bridge, JVM, Kotlin, Spring, Microservices]
---

Monitoring in komplexen Microservicearchitekturen gehört zu den wichtigen Anforderungen, um nachhaltig  Fehler zu erkennen und frühzeitig zu beseitigen. In den dynamischen Umgebungen müssen Services automatisch hinzu- oder abgeschaltet werden und diese Änderungen dem Monitoring-Server bekanntgegeben werden. Im folgenden Artikel wird eine Lösung vorgestellt die auf dem Spring Cloud Framework aufsetzt und mit Neflix Eureka und Prometheus ein Monitoring ermöglicht.


# Prometheus

## Was ist das?
[Prometheus](https://www.prometheus.io/) ist ein Open Source Projekt, dass ursprünglich bei [SoundCloud](https://soundcloud.com/) als Lösung für Monitoring und Alerting entwickelt wurde. Seit 2012 befindet sich Prometheus in der Hand der Community und wird unabhängig gewartet und weiterentwickelt. Um dies zu unterstreichen ist Prometheus 2016 als zweites Projekt nach Kubernetes der [Cloud Nativ Computing Foundation](https://www.cncf.io/) angegliedert worden.

## Was tut es?

Prometheus besitzt verschiedene Features, um Metriken abzufragen und sie darzustellen. Es gibt Unterstützung für multi-dimensionale Datenstrukturen, die in dynamischen Architekturen wie denen der Microservices genutzt werden. Allgemein lassen sich numerische Zeitserien sehr gut mit Prometheus verarbeiten und darstellen.

## Was kann man mit den Metriken machen?

Die so gesammelten Daten können mit einer eigenen Abfragesprache der PromQL (Prometheus Query Language) an den persönlichen Bedarf angepasst und ausgewertet werden. Auf Basis der Auswertung können dann beispielsweise Benachrichtigungen (Alerts) eingerichtet werden, sobald ein bestimmtes Muster erkannt wird.

## Grafana

Um die Daten von Prometheus weiter auszuwerten und nicht im Interface von Prometheus anzeigen zu müssen, empfiehlt sich eine Plattform wie [Grafana](https://grafana.com/). Hier können die Daten grafisch aufbereitet und in verschiedenen Formaten bereitgestellt werden. Auf dem Metrics Dashboard von Grafana können dann mit dem Graph Editor genau die benötigten Informationen hervorgehoben werden.

Unter https://grafana.com/ kann man mit der Oberfläche von Grafana spielen.

## Wo bekommt es seine Daten her ? 
Prometheus kann Daten aus verschiedenen Quellen beziehen.


# Netflix Eureka

## Was ist das?

[Netflix Eureka](https://github.com/Netflix/eureka) ist eine Service Registry, die ursprünglich für den Einsatz in der AWS (Amazon Web Services) Cloud entwickelt wurde, um dort Service Discovery durchzuführen. Mittlerweile ist Netflix Eureka Teil von *Spring Cloud Netflix*, einem Framework, das speziell Bibliotheken für die Entwicklung verteilter Microservicearchitekturen bereitstellt.

## Was tut es?

Die Hauptaufgabe einer Service Discovery ist das bereitstellen von Statusinformationen von und für die Services einer Microservicelandschaft. Hierzu zählt beispielsweise, ob eine Service-Instanz gerade verfügbar ist. Mit Hilfe der informationen einer Service Discovery können die Service-Instanzen untereinander kommunizieren oder es kann Loadbalancing stattfinden.  Die Interprozesskommunikation muss mit der dynamischen Veränderung innerhalb der Systemlandschaft automatisiert Schritt halten und genau das leistet die Service Discovery.

## 

# Bridge

Obwohl Prometheus für sehr viele Services eine [Unterstützung](https://prometheus.io/docs/instrumenting/exporters/) bietet, um automatisch Metriken der angebundenen Services zu erhalten, fehlt diese Funktion für Netflix Eureka bisher. (siehe [Github](https://github.com/prometheus/prometheus/pull/3369 ))



## Welches Problem löst die Bridge? 

Sobald sich innerhalb einer Microservicelandschaft dynamisch Services hinzu- oder abschalten muss diese Änderung für Prometheus bekannt werden.

## Warum haben wir sie gebaut? 

Die Eureka-Prometheus-Bridge ist aus einem Kundenprojekt entstanden. Dort wird Netflix Eurka in einer Microservicelandschaft zusammen mit vielen anderen Services eingesetzt. Um Prometheus mit Eureka nutzen zu können, muss die Information über die verfügbaren Services für Prometheus im richtigen Format bereitgestellt werden.

Dazu fragt die Brige die REST-Schnittstelle von Eureka an und konvertiert das erhaltene JSON in eine Konfigurationsdatei für Prometheus. Sobald Prometheus diese einliest, können die aktuell verfügbaren Services überwacht werden, sodass Metriken und Analysen ermöglicht werden.

-- Hier Bsp. Konfigurationsdatei mit Targets?




# Anwendungsbeispiel
Um die Bridge zu verwenden, muss zunächst eine Microservicelandschaft gestartet sein, sodass die Bridge und somit auch Prometheus mit Informationen versorgt werden.

## Klassischer Anwendungsstart

Eine Möglichkeit dazu ist es die Komponenten der Spring Cloud Netflix, in diesem Falle den Eureka-Server manuell zu starten, nachdem man die Komponente integriert hat.



## Wie kann man die Bridge (ohne Docker) verwenden? 

## Link auf Beispiel-Projekt mit fertigen Docker-Images.

Sie finden die Anwendung auf [Github](https://github.com/adessoAG/eureka-prometheus-bridge).

