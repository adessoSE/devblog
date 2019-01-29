---
layout:         [post, post-xml]              
title:          "Micronaut - Eine Alternative zu Spring"
date:           2019-01-29 10:28
author:         t-buss
categories:     [Softwareentwicklung]
tags:           [microservices, java, micronaut]
---
Ja, richtig gelesen, es gibt Alternativen!
Obwohl der Platzhirsch Spring sich bei Java-Anwendungen großer Beliebtheit erfreut, sollte man nicht vergessen, dass es daneben auch noch andere Frameworks gibt, die einen Blick wert sind.
In diesem Blog-Artikel soll es um Micronaut gehen, ein noch vergleichsweise junges Framework, welches jedoch einige interessante Eigenschaften hat, die es besonders im Cloud-Umfeld zu einem echten Rivalen gegenüber Spring machen.
Wir implementieren in diesem Artikel eine Anwendung einmal mit Spring Boot und einmal mit Micronaut.
Danach vergleichen wir die beiden Ansätze und schauen, wo welches Framework überlegen ist.

Das [Micronaut-Framework](http://micronaut.io) beschreibt sich selbst als "modernes, JVM-basiertes Full-Stack-Framework um modulare, einfach zu testende Microservices- und Serverless-Anwendungen zu bauen".
In dieser Beschreibung liegt auch schon der wesentliche Unterschied zum Spring Framework: Es legt den Fokus auf Microservices und Serverless-Anwendung, womit sich JVM-Frameworks aktuell noch eher schwer tun.

# Der kleine Nachteil von Spring
Java-Anwendungen kommen von Haus aus mit einigem Overhead daher.
Die JVM allein benötigt nach [offiziellen Angaben](https://www.java.com/en/download/help/sysreq.xml) bereits etwa 128Mb RAM und 124Mb Festplattenspeicher.
Für traditionelle Anwendungen ist dies voll und ganz vertretbar, bei Docker-Containern in einem Cluster oder gar als FaaS-Instanz sind solche Zahlen aber nicht mehr zeitgemäß.
Zum Vergleich: nicht-triviale Anwendungen in der Programmiersprache Go sind nach der Kompilation oftmals nur 20-30Mb groß.
Eine andere, wichtige Metrik ist die Startzeit einer Anwendung.
Durch den Reflection-Ansatz von Spring sind Startzeiten jenseits der 20 Sekunden keine Seltenheit.
Auch das ist besonders für Serverless-Anwendungen nicht hinnehmbar.

Micronaut geht einen anderen Weg als Spring und kann damit einige der Performance-Einbußen wett machen.
Besonders die Startzeit wird durch die Vermeidung von Reflection ungeheuer verringert, was Java-Entwicklern den Einstieg in die Serverless-Welt eröffnet.
Aber auch der RAM-Verbrauch sinkt.
Wie stark diese Verbesserungen sind, wollen wir uns jetzt einmal in einer einfachen Anwendung anschauen.