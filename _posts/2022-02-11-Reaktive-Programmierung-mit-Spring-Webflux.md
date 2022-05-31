---
layout: [post, post-xml] # Pflichtfeld. Nicht ändern!
title: 'Reaktive Programmierung mit Spring Webflux' # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date: 2022-02-11 18:00 # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2022-02-11 18:00 # Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author_ids: [schroeerth,friggej] # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: [Softwareentwicklung] # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Java, Spring, Webflux, Reaktive Programmierung] # Bitte auf Großschreibung achten.
---

In diesem Blogbeitrag wollen wir euch eine kurze Übersicht zu Spring Webflux geben.
Zusätzlich gibt der Beitrag eine kleine Starthilfe mit einer Auswahl an Codebeispielen, damit ihr erfolgreich im Projekt durchstarten könnt.

>In Wikipedia ist reaktive Programmierung wie folgt beschrieben:
Bei der Datenverarbeitung ist reaktive Programmierung ein Programmierparadigma, das sich an Datenflüssen orientiert.
Das zugrunde liegende Ausführungsmodell propagiert Änderungen in den Datenflüssen automatisch.

Seit Version 5 unterstützt das Spring-Framework reaktive Programmierung und bietet reaktive Implementierungen für Webanwendungen, 
Datenbankzugriffe, Security und streambasierte Datenverarbeitung.

Klassische Programmiermodelle wie z.B. in Spring MVC nutzen für jeden Request jeweils einen Thread und belegen ihn 
so lange, bis die aktuelle Aufgabe abgeschlossen ist, und geben ihn dann wieder frei.
Muss während der Codeverarbeitung z.B. eine Datenbank oder ein entferntes System angesprochen werden, wobei eine langsame Antwortzeit erwartet werden kann, muss der Thread lange blockieren.
Um die Antwortbereitschaft aufrecht zu halten, wird oft ein größerer Threadpool vorgehalten.
Je nach Szenario kann ein Java Thread auch schnell mal 1MB Speicher allokieren, was gerade in Cloudumgebungen schnell mit erhöhten Kosten einhergeht. 

## Project Reactor
Das Spring-Framework nutzt das Open-Source-Projekt Reactor als Basis für die Umsetzung der reaktiven Programmierung.
Reactor ist eine nicht blockierende (non-blocking) reaktive Open-Source-Programmiergrundlage für die Java Virtual Machine, welche auf der Reactive-Streams-Spezifikation basiert.
Es setzt direkt auf den funktionalen APIs von Java 8 auf und nutzt konsequent CompletableFuture, Stream und Duration.
Zusätzlich unterstützt Reactor mit dem reactor-netty-Projekt eine nicht blockierende Interprozesskommunikation, welche eine Backpressure-fähige Netzwerkengine für HTTP bietet.
Die Reactive-Streams-Spezifikation sieht eine gewisse Standardisierung für die JVM aber auch Javascript vor und basiert auf folgenden Interfaces:

_**Subscriber:**_ Der _Subscriber_ abonniert einen _Publisher_ und wird mittels Callbacks über Neuerungen informiert

_**Subscription:**_ Die _Subscription_ beschreibt die Beziehung zwischen _Subscriber_ und _Publisher_

_**Publisher:**_ Der _Publisher_ ist verantwortlich für die Veröffentlichung von Daten an die angemeldeten _Subscriber_

_**Processor:**_ Ein _Processor_ transformiert Elemente, die zwischen _Publisher_ und _Subscriber_ übertragen werden

![image of reactive streams interfaces](/assets/images/posts/reaktive-programmierung-mit-spring-webflux/reactivestream.png)

Das Projekt Reactor bietet zwei Implementierungen des Interface _Publisher_ an, _Mono_ und _Flux_, welche in den folgenden Beispielen oft genutzt werden.
_Flux_ ist dabei als asynchrone Abfolge von 0-N Elementen und Mono als 0-1 Element implementiert.

# Wie arbeite ich mit Spring Webflux?
Die Reactor API bietet eine sehr große Anzahl an Methoden.
Es existiert zwar eine Art [Anleitung](https://projectreactor.io/docs/core/release/reference/#which-operator),
die kann aber insbesondere beim Einstieg in Webflux erschlagend wirken.


Es existieren bereits viele Tutorials auf den üblichen Webseiten, wie mit Spring Webflux gearbeitet werden kann. 
Diese beschränken sich jedoch oft auf die Kommunikation nach außen, also auf Controller, Datenbank-Repositories und Webclients, die andere REST APIs konsumieren.
Unserer Erfahrung nach ist das aber eher der unproblematischere Teil, da hier ein Großteil der Arbeit bereits damit getan ist,
die jeweils relevanten Dependencies mit Spring Webflux zu ersetzen und die Methodensignaturen entsprechend anzupassen. Die Umstellung
einer Controller-Methode könnte etwa so aussehen:

``` Java
//Spring Web MVC
@GetMapping("/{id}")
private Blogpost getBlogpostById(@PathVariable String id) {
    return blogpostService.findBlogpostById(id);
}
---
//Spring Webflux
@GetMapping("/{id}")
private Mono<Blogpost> getBlogpostById(@PathVariable String id) {
    return blogpostService.findBlogpostById(id);
}
```
In diesem Fall registriert sich der Rest-Controller automatisch als Subscriber auf die jeweilige Service-Methode,
und schreibt das Ergebnis wie gewohnt in den Body der Response des HTTP-Requests.
Voraussetzung ist natürlich, dass der ``BlogpostService`` auch ein Mono, statt eines einfachen ``Blogpost`` zurückgibt.
Und das ist auch die Ebene, wo das Ganze unserer Meinung nach spannend wird. Wie gehe ich auf Serviceebene mit Mono und Flux um,
und wie realisiere ich Geschäftslogik, die über einfaches Weiterreichen von Daten hinausgeht? 

Darauf konzentriert sich dieser Abschnitt.
In den Beispielen wird lediglich mit Monos gearbeitet, fast alle genannten Methoden sind jedoch auch für Flux verfügbar.
Ausgenommen hiervon ist die Methode ``zipWhen``, die nur für Monos implementiert ist.

## map und flatMap
Diese Methoden werden allen, die schon mit Java Streams oder funktionalen Programmiersprachen gearbeitet haben, bekannt vorkommen.
Sie sollten immer dann genutzt werden, wenn man das Ergebnis eines Monos oder Fluxes weiter verarbeiten möchte.
Angenommen, ich habe in einem Request die Daten eines Nutzers in einer API abgefragt, brauche im Folgenden aber nur das Kürzel,
das aus Vor- und Nachname gebildet werden kann.
``` Java
public Mono<String> getAbbreviatedName(String userId) {
    Mono<UserData> userDataMono = userClient.getUser(userId);
    Mono<String> abbreviatedNameMono = userDataMono.map(userData -> buildAbbreviatedName(userData));
    return abbreviatedNameMono;
}

private String buildAbbreviatedName(UserData userData){[...]}
```
In der Methode, die innerhalb des `map`-Befehls aufgerufen wird (hier `buildAbbreviatedName`),
muss nicht mit den Webflux-Publishern gearbeitet werden,
die eigentliche Geschäftslogik kann also mit gewöhnlichem Java-Code implementiert werden.

Der Operator `flatMap` unterscheidet sich insofern von `map`, als dass er als Rückgabewert der übergebenen Methode wieder einen Publisher erwartet.
Das ist etwa dann sinnvoll, wenn diese Methode ihrerseits wieder einen API-Aufruf absetzen muss. 
In unserem Beispiel könnte ein Blogbeitrag mit den Daten des Nutzers angelegt werden.
``` Java
public Mono<BlogpostWithAuthor> saveBlogpost(Blogpost blogpost, String userId) {
    Mono<UserData> userDataMono = userClient.getUser(userId);
    Mono<BlogpostWithAuthor> savedBlogpostMono = userDataMono.flatMap(userData -> saveBlogpost(blogpost, userData));
    return savedBlogpostMono;
}

private Mono<BlogpostWithAuthor> saveBlogpost(Blogpost blogpost, UserData userData){[...]}
```
## zipWhen und zipWith
Wir können also mit `map` und `flatMap` Ergebnisse eines Publishers umwandeln. Aber was, wenn die Daten zweier oder mehrerer Publisher kombiniert benötigt werden?
In diesem Fall können die Methoden `zipWith` und `zipWhen` genutzt werden. In folgendem Beispiel wird die Methode `zipWith` genutzt, 
um die Daten eines Blogposts und eines Users zu kombinieren und daraus einen ``BlogpostWithAuthor`` zu bauen.

``` Java
public Mono<BlogpostWithAuthor> getBlogpost(String blogpostId, String authorId) {
    Mono<Blogpost> blogpostMono = blogpostClient.getBlogpost(blogpostId);
    Mono<UserData> authorMono = userClient.getUser(authorId);
    Mono<Tuple2<Blogpost, UserData>> blogpostAuthorMono = blogpostMono.zipWith(authorMono);
    Mono<BlogpostWithAuthor> result = blogpostAuthorMono.map(blogpostUserTuple -> 
            buildBlogpostWithAuthor(blogpostUserTuple.getT1(), blogpostUserTuple.getT2()));
    return result;
}

private BlogpostWithAuthor buildBlogpostWithAuthor(Blogpost blogpost, UserData userData){[...]}
```

Denkbar ist in diesem Szenario auch, dass die ``authorId`` nicht explizit mitgegeben werden muss, sondern Teil des ``Blogpost``-Objekts ist.
Dann müssten wir mit Informationen aus der Response des `BlogpostClients` den `UserClient` aufrufen, um anschließend wieder mit beiden Ergebnissen
weiterzuarbeiten. Hier kommt ``zipWhen`` ins Spiel. Mit dieser Methode kann man, ähnlich wie mit ``flatMap``,
das Ergebnis eines Publishers transformieren, mit dem Unterschied, dass man anschließend wieder ein Tuple2 mit dem
ursprünglichen und dem transformierten Ergebnis erhält.

``` Java
public Mono<BlogpostWithAuthor> getBlogpost(String blogpostId) {
    Mono<Blogpost> blogpostMono = blogpostClient.getBlogpost(blogpostId);
    Mono<Tuple2<Blogpost, UserData>> blogpostAuthorMono = blogpostMono.zipWhen(blogpost -> 
            userClient.getUser(blogpost.getAuthorId()));
    Mono<BlogpostWithAuthor> savedBlogpostMono = blogpostAuthorMono.map(blogpostUserTuple -> 
            buildBlogpostWithAuthor(blogpostUserTuple.getT1(), blogpostUserTuple.getT2));
    return savedBlogpostMono;
}

private Mono<BlogpostWithAuthor> buildBlogpostWithAuthor(Blogpost blogpost, UserData userData){[...]}
```

## doOnNext und delayUntil
Die bislang vorgestellten Methoden sind alle primär dazu gedacht, die Werte eines Publishers in irgendeiner Weise zu 
transformieren.
Es gibt aber auch Methoden, mit denen Seiteneffekte ausgeführt werden können, die den Wert des Publishers allerdings nicht beeinflussen.
Wir könnten beispielsweise in einer Methode ``getBlogpost`` zusätzlich einen Zähler erhöhen, wie oft der Post abgerufen wurde.

``` Java
public Mono<Blogpost> getBlogpost(String blogpostId) {
    Mono<Blogpost> blogpostMono = blogpostClient.getBlogpost(blogpostId);
    return blogpostMono.doOnNext(blogpost -> incrementViewCount(blogpost));
}

private Mono<Integer> incrementViewCount(Blogpost blogpost){[...]}
```
Zu beachten ist hier, auch wenn sich am eigentlichen Inhalt des Monos nichts ändert, muss dennoch der Rückgabewert der ``doOnNext``-Methode
weiter verwendet werden, damit die Methode auch Teil der Ausführungssequenz wird.

Außerdem ist der Aufruf von `incrementViewCount` wieder asynchron. Das bedeutet, dass man nicht davon ausgehen kann, dass der Zähler
auf dem aktuellsten Stand ist, wenn `getBlogpost` sein Ergebnis zurückgibt. Wenn das erforderlich ist, muss statt ``doOnNext``
``delayUntil`` verwendet werden.
## onErrorMap, onErrorReturn und doOnError
Zu guter Letzt sollte auch das Error Handling nicht unerwähnt bleiben.
Wenn in der Ausführungssequenz eine Methode einen Fehler wirft, gibt der Publisher ein Error-Signal anstelle des Werts aus. 
Dieses Signal wird wie eine normale `RuntimeException` so lange an die nächsten Subscriber weitergereicht, bis es irgendwo explizit behandelt wird.

Mit ``onErrorMap`` kann eine Exception abgefangen und eine andere Exception geworfen werden.
Über ``onErrorReturn`` kann beim Autreten einer Exception ein Standardwert zurückgegeben werden, 
``onErrorResume ``ruft einen alternativen Publisher auf. 
Jeder dieser Methoden kann außerdem die Klasse der zu behandelnden Exception übergeben werden, um einzuschränken, welche Exceptions behandelt werden soll.

Wenn in der Kürzelmethode aus dem ersten Beispiel des Kapitels einfach der Standard-String "Unbekannt" zurückgegeben werden soll, 
wenn kein Nutzer mit der gegebenen ID existiert, könnte die Implementierung so aussehen:

``` Java
public Mono<String> getAbbreviatedName(String userId) {
    Mono<UserData> userDataMono = userClient.getUser(userId);
    Mono<String> abbreviatedNameMono = userDataMono.map(userData -> buildAbbreviatedName(userData));
    return abbreviatedNameMono.onErrorReturn(UserNotFoundException.class, "Unbekannt");
}

private String buildAbbreviatedName(UserData userData){[...]}
```
#Fazit
Mithilfe dieser 9 Methoden solltet ihr für den Start in die Programmierung mit Spring Webflux gerüstet sein.
Wenn ihr Anwendungsfälle habt, die hier nicht abgedeckt wurden, können wir euch die bereits eingangs im letzten Kapitel
erwähnte [Operatorenübersicht](https://projectreactor.io/docs/core/release/reference/#which-operator) aus dem 
Project-Reactor-Handbuch empfehlen.

Mit ein wenig Einarbeitungszeit wird euch die reaktive Programmierung immer leichter und intuitiver von der Hand gehen, allerdings lässt sich auch nicht verneinen,
dass sie zu teils komplizierterem und schlechter lesbarem Code führt.
Daher sollte man sich vor Beginn eines Projekts gründlich überlegen, ob die Vorteile, die Spring Webflux mit sich bringt,
diese zusätzliche Komplexität aufwiegen.