---
layout: [post, post-xml]
title: "Aller Anfang ist schwer: Ansätze für Green Software-Engineering"         # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date: 2021-11-26 09:25
author_ids: [gaboratarithnea]   
categories: [Softwareentwicklung]  
tags: [Green Software, Kotlin, Microframeworks] 
---

Im Jahr 2021 muss man niemandem mehr erklären, dass alle Bereiche der Gesellschaft und Wirtschaft Verantwortung für eine nachhaltige Nutzung unserer Ressourcen tragen.
Das gilt auch für die Entwicklung von Software.
In diesem Beitrag werden einige Ansätze dazu für den Entwicklungsalltag bei Java-basierten Serveranwendungen gezeigt, die auf einen möglichst sparsamen Umgang mit Ressourcen abzielen.

# Effiziente Algorithmen verwenden

Die gute Nachricht zuerst: Für uns in der Informatik ist Effizienz eines der wichtigsten Themen, mit dem wir uns seit dem Studium beschäftigt haben.
Wir sind also gut darin ausgebildet, effiziente Lösungen für Probleme zu erkennen und anzuwenden.
Die schlechte Nachricht: Die Komplexität der Softwareentwicklung ist mittlerweile so groß, dass es nicht immer einfach ist, alle Auswirkungen zu erkennen und zu überblicken, insbesondere bei der Verwendung von Bibliotheken ([siehe das Log-Beispiel](https://logging.apache.org/log4j/2.x/performance.html)).
Eine gute Strategie ist aus meiner Sicht, sich möglichst viel auszutauschen und das auch "institutionalisiert", also über Code Reviews, Pair und Mob Programming, den Besuch von Vorträgen etc.

Klar, Merge Sort ist schneller als Bubble Sort. Im Alltag spielt das Schreiben von Sortieralgorithmen sicherlich eine untergeordnete Rolle, trotzdem schreiben wir viel Code, der mal effizient und mal weniger effizient ist. In der Regel gibt es leistungsstarke Standardbibliotheken von Java selbst, Apache oder Guava, die uns Standardaufgaben abnehmen und effizient arbeiten.

Ansonsten sollte man gerade bei Operationen auf Mengen und Listen frühzeitig auf starke Filter setzen und so Operationen auf Objekten vermeiden, die später sowieso weggeworfen werden:

```kotlin
fun List<Product>.filterActiveProductsAndMapImages(): List<Product> {
    this.map { it.mapImageFormat() }.filter { it.isActive }
}
``` 
Im Prinzip sind diese Techniken längst bekannt und effizient zu entwickeln war schon wichtig, bevor Green Software-Engineering wichtig wurde.

Aber selbst effiziente Algorithmen sollten nicht unnötig oft laufen. 
In Zeiten von replizierten Microservices sollten "teure" Aufgaben nicht einfach von jeder Instanz ausgeführt werden, wenn das auch eine Instanz erledigen kann. 
Im Kubernetes-Umfeld bieten sich dafür beispielsweise [Jobs](https://kubernetes.io/docs/concepts/workloads/controllers/job/ an.

# CPU-Last minimieren

Möglicherweise nicht ganz so klar ist der zweite Punkt.
Die CPU-Auslastung von Webanwendungen hängt in der Regel von den zu bearbeitenden Requests ab.
Je häufiger und aufwändiger diese Requests sind, desto höher ist die CPU-Auslastung. 
Wenn gerade keine Requests ankommen, sollte die Auslastung nahe 0 sein.
Neben Requests gegen die Webanwendung werden eventuell auch CRON-Jobs ausgeführt, die dann ebenfalls eine Auslastung generieren.

Wir sollten einen kurzen Blick auf die benötigte Rechenleistung zur Beantwortung von Requests werfen.
Beim Austausch von Objekten zwischen Client und Webanwendung ist dabei unter anderem die Serialisierung und Deserialisierung dieser Objekte interessant, da angeblich große Unterschiede zwischen verschiedenen Frameworks und Protokollen existieren (siehe [Vergleich von Gson, Jackson und Moshi](https://www.ericthecoder.com/2020/10/13/benchmarking-gson-vs-jackson-vs-moshi-2020/) und [Vergleich von Jackson für Kotlin und Kotlinx Serialization](https://www.ericthecoder.com/2020/11/23/benchmarking-kotlin-json-parsers-jackson-kotlin-and-kotlinx-serialization/)).
So sind textbasierte Protokolle an sich wohl relativ langsam im Vergleich zu binären Protokollen und das populäre Jackson-Framework gilt auch nicht als CPU-freundlich (siehe Alternativen wie gson oder kotlinx).

Weiterhin sollte man auf effiziente Datenbank- oder Datenquellenanbindungen achten. 
Das betrifft sowohl die Speicherung als auch den Zugriff auf die Daten.
Auch beim Zugriff auf Daten spielen Serialisierungs- und Deserialisierungsfragen eine wichtige Rolle. Ebenso von Bedeutung kann das Caching von Daten sein.
Das wird zwar den Speicherverbrauch erhöhen, senkt aber die CPU-Auslastung, wenn eine kluge Strategie gewählt wurde.

Microframeworks erfordern in unterschiedlichen Szenarien (Start, Leerlauf, beim Beantworten von Requests) weniger CPU-Kapazitäten als herkömmliche Webframeworks (siehe [Review of Microservices Frameworks](https://dzone.com/articles/not-only-spring-boot-a-review-of-alternatives)).

# Netzwerk-Last minimieren

Request gegen eine Webanwendung bedeuten in der Regel, dass Daten über das Internet versendet werden und das sollte möglichst selten und knapp passieren.
Die Bedeutung von binären Protokollen für den Austausch wurden bereits kurz angedeutet.
Der Fokus sollte aber darauf liegen, jeden Request kritisch zu beurteilen.
Es sollten nur die Daten an den Client gesendet werden, die dieser auch tatsächlich benötigt.
Wenn andere Dienste angebunden werden, sollte natürlich auch die Webanwendung nur die Daten anfragen und erhalten, die sie tatsächlich benötigt.

Das klingt alles sehr schön und dürfte so weit auch klar sein. In der Praxis gestaltet sich das aber häufig schwierig, da andere Dienste vielleicht viele Daten senden, die für unsere Use Cases gar nicht relevant sind und wir keinen Einfluss auf die entsprechende API haben.
Eine Alternative, die sich ab und an bietet, ist die Nutzung von GraphQL.
Hier können explizit die Daten angefragt werden, die auch benötigt werden, und man erspart sich eventuell sogar aufwändiges Mapping.

adesso arbeitet bei vielen eCommercetools-Projekten mit commercetools zusammen, die eine solche GraphQL anbieten. Hier kurz der Vergleich, wie viele Daten gespart werden können, wenn man eine Kategorie mit GraphQL anfordert (damit der Beitrag nicht unnötig lang wird, die REST-Variante hat über 80 Zeilen):
## Anfrage

```graphql
{
  categories(where: "slug(de-DE = \"accessoires-test\")") {
      results {
          id
          slug(locale: "de-DE")
          name(locale: "de-DE")
          description(locale: "de-DE")
          parent {
              slug(locale: "de-DE")
          }
      }
      total
   }    
}
```


## Antwort
````json
{
  "data": {
  "categories": {
  "results": [{
      "id": "099f7ea3-6ae6-4a6e-a2dd-6489169887c8",
      "slug": "accessoires-test",
      "name": "accessoires-test",
      "description": null,
      "parent": {
        "slug": "adesso-shop"
      }
    }],
    "total": 1
  }
  }
}
````

Bei binären Daten wie Bildern sieht es im Prinzip ähnlich aus.
Diese sollten effizient mit einer angepassten Auflösung und Qualität heruntergeladen werden.
Hier bieten sich Content Delivery Networks an, die diese Aufgabe gut erledigen.

# Skalierbarkeit

Skalierbarkeit wird häufig unter dem Aspekt betrachtet, dass hohe Zugriffszahlen auftreten, die sonst unüblich sind.
In der Regel gibt man sich aber ansonsten damit zufrieden, dass die Anwendung angemessen schnell reagiert.
Im Sinne von Green Software-Engineering muss Skalierbarkeit aber auch in die andere Richtung betrachtet werden.
Man sollte sich (auch aus Kostengründen) die Frage stellen, ob zwei Instanzen eines Microservice wirklich nötig sind, wenn gerade niemand auf diesen zugreift?
Reicht dann eine Instanz oder gar keine?

Das Thema Skalierbarkeit wurde in vielerlei Hinsicht durch das Aufkommen von Kubernetes (für die breite Masse) gelöst.
Dabei kann man ganz trivial eine Mindest- und eine Höchstzahl an Pods (Instanzen) pro Service definieren, die dann automatisch skalieren.
Entscheidend für die Technologie ist allerdings die Startzeit eines Microservice und da sind die auf "klassischen" Webframeworks basierenden Anwendungen leider recht langsam.
Bei diesen Technologien ist mit einer Startzeit von über zehn Sekunden zu rechnen, in vielen Fällen sogar deutlich mehr (die Nutzung von GraalVM mit Spring Boot ermöglicht ebenfalls kurze Startzeiten, siehe [Running Spring Boot apps as GraalVM Native Images](https://blog.codecentric.de/en/2020/05/spring-boot-graalvm/))). 
Das ist nicht wirklich kompatibel mit dem Skalierungsgedanken. 
Natürlich spricht immer noch viel für den Einsatz von Spring Boot u.ä., bei diesem Aspekt sind aber andere Frameworks wie Quarkus, Micronaut und Ktor überlegen (siehe [Review of Microservices Frameworks](https://dzone.com/articles/not-only-spring-boot-a-review-of-alternatives)).

# Caching

Webanwendungen verbrauchen z.B. dann viel Speicher, wenn sie Daten cachen müssen. Caching ist prinzipiell aber zu empfehlen, da dadurch gleiche Berechnungen, Datenbank- oder API-Anfragen nicht ständig wiederholt werden müssen. Caching, das sich über mehrere Instanzen eines Microservice erstreckt, ist hier der beste Weg und würde noch stärker vermeiden (insbesondere bei Skalierungen), dass Berechnungen mehrfach durchgeführt werden.

Ansonsten ist anzumerken, dass Microframeworks wie Quarkus und Ktor im Speicherverbrauch deutlich günstiger sind als beispielsweise der Platzhirsch Spring Boot.

# Reaktiv entwickeln

In die Java-Community zog vor ein paar Jahren die nicht-blockierende Entwicklung ein.
Der Grund hierfür war, dass andere Technologiefamilien wie NodeJS bei der Verarbeitung von Requests eine bessere Performance zeigten, was vor allem am nicht-blockierenden Ansatz lag ([Ein aktueller Beitrag dazu ist hier zu sehen](https://da-14.com/blog/nodejs-vs-java-backend-language-large-software-development)).
Gleichzeitig benötigen asynchrone Frameworks mehr Speicher und die "Organisation" der nicht-blockierenden Prozesse gilt als aufwändig und damit nicht als ressourcenschonend.
Zudem hängt der Nutzen stark von der Länge einer Blockade eines Threads ab ([5 Aspekte reativer Programmierung](https://javapro.io/5-aspekte-reaktive-programmierung/)).

Trotzdem sollte man auch im Java- oder JVM-Umfeld reaktiv entwickeln, da dadurch deutlich schnellere Antwortzeiten möglich sind (siehe z.B. [hier](https://dzone.com/articles/spring-boot-20-webflux-reactive-performance-test)) und das dann in der Regel auch Ressourcen spart (weniger Rechenzeit, weniger Speichernutzung, wenige Wartezeit für den Client).

Ein großer Nachteil reaktiver Programmierung in Java ist allerdings das Schreiben und die Lesbarkeit des Codes.
Viel Code wird mit Funktionen beschrieben, die häufig schwer verständlich sind und leicht den Blick auf das Wesentliche, also die Geschäftslogik, versperren. [Der Empfehlung dieses Autors](https://nexocode.com/blog/posts/reactive-streams-vs-coroutines/) kann ich mir anschließen, Kotlin Coroutines wirken deutlich einfacher als die gängigen Java-Bibliotheken.

# Zusammenfassung

Technologieauswahl und Programmierung spielen für den ökologischen Fußabdruck einer Webanwendung eine wichtige Rolle.
Anhand von Beispielen haben wir gesehen, wie wir Ressourcen sparen können, indem wir auf Microframeworks, moderne Serialisierungsbibliotheken, skalierbare Architekturen, reaktive Entwicklung und GraphQL setzen.
Sicherlich ist die Liste längst nicht vollständig und es sprechen weiterhin gute Gründe für Spring Boot, Jackson und REST-APIs.
