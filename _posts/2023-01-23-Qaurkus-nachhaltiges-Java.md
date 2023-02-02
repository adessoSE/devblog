---
layout: [post, post-xml]              # Pflichtfeld. Nicht ändern!
title:  "Quarkus: Die Revolution für nachhaltige Java-Entwicklung"         # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2023-01-23 10:25             # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2023-01-23 10:25             # Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author_ids: [andreasmaita]                 # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesen Namen geben.
categories: [Architektur]     # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Quarkus, Microservices, Java, GraalVM]   # Bitte auf Großschreibung achten.
---

In den letzten Jahren hat sich die Nachhaltigkeit zu einem wichtigen Faktor entwickelt, der in vielen Industriebereichen berücksichtigt werden muss, darunter auch bei der Softwareentwicklung. Nahezu jeder Wirtschaftszweig arbeitet heute mithilfe von Software, sodass es wichtig ist, bei deren Erstellung nachhaltige Verfahren anzuwenden.

Besonders beim Betreiben der Software spielt Nachhaltigkeit eine große Rolle. 

Dafür haben sich Cloud-Dienste als Hostinganbieter in den letzten Jahren immer mehr durchgesetzt und deren Dienste und Infrastruktur erfordern eine gewisse Menge an Ressourcen und CO₂-Emissionen. 

Im Bemühen, den Kohlendioxidausstoß zu verringern, gehen die Experten der Technologiebranche bei der Auswahl der von ihnen verwendeten Technologien mit Bedacht vor.

Eine dieser Technologien, die sowohl beim Geldsparen als auch bei der Reduktion von CO₂-Emissionen helfen können, ist Quarkus. 

Quarkus ist eine auf Kubernetes und OpenShift optimierte, kompakte und schnelle Laufzeitumgebung für Java-Anwendungen. 

Somit findet es nicht nur Anwendung in der Cloud-Infrastruktur, sondern auch in selbst gehosteten Lösungen. 

In diesem Artikel werden wir uns ansehen, wie Quarkus dazu beitragen kann, Geld zu sparen und die CO₂-Emissionen von Anwendungen zu reduzieren.

# Geringere Ressourcenanforderungen führen zu geringeren Kosten
Einer der größten Vorteile von Quarkus ist, dass es zu geringeren Ressourcenanforderungen führt als klassische Java-Webanwendungen. 

Das liegt daran, dass Quarkus einen "container-first"-Ansatz verfolgt. 

Das bedeutet, dass Quarkus-Anwendungen für niedrige Speichernutzung und schnelle Startzeit optimiert sind.

Das schafft Quarkus, indem es viele Prozesse, die bei einer klassischen Java-Anwendung zur Laufzeit gemacht werden, schon beim Bauen der Anwendung ausführt.

Zu diesen Prozessen gehört zum Beispiel das Parsen von Konfigurationen. 

In traditionellen Java-Anwendungen bleiben alle Klassen, die zur initialen Konfiguration benötigt werden, für die gesamte Laufzeit im Speicher, und das, obwohl sie ja nur ein Mal, und zwar beim Hochfahren der Applikation, genutzt werden.

Quarkus hingegen bereitet schon beim Bauen der Applikation die jeweiligen Komponenten mitsamt ihrer Konfigurationen vor. 

So müssen diese Schritte nicht zur Laufzeit durchlaufen werden. 

Dies resultiert in weniger Speichernutzung und schnelleren Startzeiten.

Mit diesen und vielen weiteren Strategien schaffen es Quarkus-Anwendungen, einen Bruchteil an Speicher und CPU-Ressourcen gegenüber des klassischen Java-Stacks zu nutzen.

Dies führt zu geringeren Kosten, insbesondere bei der Ausführung von Anwendungen in der Cloud.

Diese geringeren Ressourcenanforderungen können auch dazu beitragen, dass Quarkus-Anwendungen in Umgebungen mit beschränkten Ressourcen, z.B. auf Edge-Geräten, schneller laufen.

Dies kann wiederum zu geringeren Kosten für die Bereitstellung von Anwendungen in solchen Umgebungen beitragen.

# Geringere CO₂-Emissionen durch geringere Stromkosten
Neben den direkten Kosteneinsparungen kann Quarkus auch dazu beitragen, die CO2-Emissionen von Anwendungen zu reduzieren.

Die bereits beschriebenen Vorteile bei der Einsparung der Ressourcen führen dazu, dass weniger Cloud-Ressourcen für Quarkus-Anwendungen benötigt werden. 

Dies kann zu geringeren Stromkosten und damit zu geringeren CO2-Emissionen beitragen, da die Stromerzeugung in vielen Regionen noch immer hauptsächlich auf fossilen Brennstoffen basiert.

Weniger Strom zu verbrauchen, ist schon seit Jahren in aller Munde und durch den Einsatz von Quarkus können viele Java-Anwendungen dieses Vorhaben schneller erreichen. 

Besonders durch die Synergie mit GraalVM kann Quarkus durch das native Kompilieren noch einen drauflegen.

# Noch mehr Performance durch nativer Kompilierung
Quarkus ist also in der Lage, nicht nur Kosten, sondern auch CO2-Emissionen zu reduzieren. 

All diese Effekte und Vorteile kann Quarkus aber noch weiter verstärken, und zwar durch die nahtlose Integration mit GraalVM. 

Eine nativ ausführbare Java-Applikation benötigt deutlich weniger Ressourcen und und bietet deutliche Vorteile bei der Laufzeit.

GraalVM ist ein hoch performantes JDK, was nicht nur erlaubt, Java-Anwendungen mit einem Just-In-Time-Compiler zu bauen, sondern diese Anwendungen auch so zu kompilieren, dass ein nativ ausführbare Anwendung dabei entsteht.

Auf der offiziellen Webseite von Quarkus findet man zahlreiche Guides und eine reiche Dokumentation, um eine Quarkus-Applikation nativ zu kompilieren. 

Zusätzlich dazu hat Quarkus mehrere Werkzeuge zur Verfügung gestellt, um aufkommende Probleme mit der GraalVM zu umgehen.

Zum Beispiel ist es für die native Kompilierung nicht möglich, Java Reflection zu nutzen. 

Viele nützliche Java-Bibliotheken nutzen aber dieses Feature ausgiebig, darunter auch die bekannte Jackson-Bibliothek, die zum Parsen von JSON-Objekten genutzt wird. 

Quarkus kann diese Bibliotheken nutzen und trotzdem nativ kompiliert werden, indem es den genauen Einsatz solcher Reflection-lastigen Funktionen mit einem besonderen Tag markiert.

Im Internet findet man zahlreiche Vergleiche zwischen Quarkus und anderen Java-Frameworks, wo in Sachen Performance und Speicheroptimierung Quarkus deutlich vorne liegt. 

Hier ist ein sehr ausführlicher Artikel von einer bekannten Java Webseite die Quarkus mit Spring vergleicht: [https://www.baeldung.com/spring-boot-vs-quarkus](https://www.baeldung.com/spring-boot-vs-quarkus).

# Fazit
Quarkus ist ein leistungsstarkes und hoch effizientes Java-Framework, das speziell für die Entwicklung von Cloud-Native-Anwendungen in Java optimiert ist. 

Es bietet nicht nur schnellere Startzeiten und hohe Leistung, sondern kann auch dazu beitragen, Geld zu sparen und die CO2-Emissionen von Anwendungen zu reduzieren. Dieser Effekt wird noch um einen großen Faktor verstärkt, wenn es in Kombination mit GraalVM verwendet wird, um native Anwendungen zu bauen. 

Wenn du also an der Entwicklung von Microservices in Java interessiert bist und gleichzeitig die Nachhaltigkeit deiner Entwicklung verbessern möchtest, solltest du Quarkus definitiv in Betracht ziehen.