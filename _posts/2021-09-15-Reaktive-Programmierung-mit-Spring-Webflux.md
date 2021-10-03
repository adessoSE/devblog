---
layout: [post, post-xml] # Pflichtfeld. Nicht ändern!
title: 'Reaktive Programmierung mit Spring Webflux' # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date: 2021-09-15 18:00 # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2021-09-15 18:00 # Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author_ids: [schroeerth,friggej] # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: [Softwareentwicklung] # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Java, Spring, Webflux, Reaktive Programmierung] # Bitte auf Großschreibung achten.
---
# Einleitung
## Was ist reaktive Programmierung?
## Nachteile 1 Thread pro Request
## Abgrenzung zu traditioneller Programmierung & Project Reactor
## Mono und Flux
In den folgenden Kapiteln und insbesondere in den Codebeispielen wird viel die Rede von Mono und Flux sein. 
Dabei handelt es sich um die beiden zentralen APIs der Reactor-Library.
<!--
#TODO: mit den Begriffen fertigstellen, die in den vorherigen Kapiteln erklärt wurden
-->
Beide implementieren das Interface ``Publisher``

# Wie arbeite ich mit Spring Webflux?
Die Reactor-API bietet eine sehr große Anzahl an Methoden.
Es existiert zwar eine Art [Anleitung](https://projectreactor.io/docs/core/release/reference/#which-operator),
wann welche zu nutzen ist, die kann aber insbesondere beim Einstieg in Webflux erschlagend wirken.
Aus diesem Grund möchten wir euch hier als kleine Starthilfe eine reduzierte Auswahl mit Codebeispielen an die Hand geben.

Es existieren natürlich bereits einige Tutorials auf den einschlägig bekannten Webseiten, wie mit Spring Webflux gearbeitet werden kann. 
Diese beschränken sich jedoch oft auf die Kommunikation nach außen, also auf Controller, Datenbank-Repositories und Webclients, die andere Rest-APIs konsumieren.
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
Voraussetzung ist natürlich, dass der ``BlogpostService`` auch ein Mono, statt eines einfachen ``Blogpost`` zurückgibt.
Und das ist auch die Ebene, wo das Ganze unserer Meinung nach spannend wird. Wie gehe ich auf Serviceebene mit Mono und Flux um,
und wie realisiere ich Geschäftslogik, die über einfaches Weiterreichen von Daten hinausgeht? 

Darauf wird sich dieses Kapitel konzentrieren.
In den Beispielen wird lediglich mit Monos gearbeitet, fast alle genannten Methoden sind jedoch auch für Flux verfügbar.
Ausgenommen hiervon ist lediglich die Methode ``zipWhen``, die nur für Monos implementiert ist.

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
In der Methode, die innerhalb des map-Befehls aufgerufen wird (Hier `buildAbbreviatedName`),
muss nicht mit den Webflux-Publishern gearbeitet werden,
die eigentliche Geschäftslogik kann also mit gewöhnlichem Java-Code implementiert werden.

Der Operator flatMap unterscheidet sich insofern von map, als er als Rückgabewert der übergebenen Methode wieder einen Publisher erwartet.
Das ist etwa dann sinnvoll, wenn diese Methode ihrerseits wieder einen API-Call machen muss. 
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
Wir können also mit map und flatMap Ergebnisse eines Publishers umwandeln. Aber was, wenn die Daten zweier oder mehrerer Publisher kombiniert benötigt werden?
In diesem Fall können die Methoden zipWith und zipWhen genutzt werden. In folgendem Beispiel wird die Methode zipWith genutzt, 
um die Daten eines Blogposts und eines Users zu kombinieren und daraus einen ``BlogpostWithAuthor`` zu bauen.

``` Java
public Mono<BlogpostWithAuthor> getBlogpost(String blogpostId, String authorId) {
    Mono<Blogpost> blogpostMono = blogpostClient.getBlogpost(blogpostId);
    Mono<UserData> authorMono = userClient.getUser(authorId);
    Mono<Tuple2<Blogpost, UserData>> blogpostAuthorMono = blogpostMono.zipWith(authorMono);
    Mono<BlogpostWithAuthor> savedBlogpostMono = blogpostAuthorMono.map(blogpostUserTuple -> 
            buildBlogpostWithAuthor(blogpostUserTuple.getT1(), blogpostUserTuple.getT2()));
    return savedBlogpostMono;
}

private Mono<BlogpostWithAuthor> buildBlogpostWithAuthor(Blogpost blogpost, UserData userData){[...]}
```

Denkbar ist in diesem Szenario auch, dass die ``authorId`` nicht explizit mitgegeben werden muss, sondern Teil des ``Blogpost``-Objekts ist.
Dann müssten wir mit Informationen aus dem Request des Blogpost-Clients den UserClient aufrufen, um anschließend wieder mit beiden Ergebnissen
weiterzuarbeiten. Hier kommt ``zipWhen`` ins Spiel. Mit dieser Methode kann man ähnlich wie mit ``flatMap``
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

##doOnNext und delayUntil
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
<!--
#TODO: Ggf. auf Erklärung in Einleitung verweisen!
-->
Zu beachten ist hier, auch wenn sich am eigentlichen Inhalt des Monos nichts ändert, muss dennoch der Rückgabewert der ``doOnNext``-Methode
weiter verwendet werden, damit die Methode auch Teil der Ausführungssequenz wird.

Außerdem ist der Aufruf von incrementViewCount wieder asynchron. Das bedeutet, dass man nicht davon ausgehen kann, dass der Zähler
auf dem aktuellsten Stand ist, wenn getBlogpost sein Ergebnis zurückgibt. Wenn das erforderlich ist, muss statt ``doOnNext``
``delayUntil`` verwendet werden.
## onErrorMap und doOnError
Zu guter Letzt sollte auch das Error Handling nicht unerwähnt bleiben.

Wenn in der Ausführsequenz eine Methode einen Fehler wirft, gibt der Publisher ein Error-Signal anstelle des Werts aus. 
Dieses Signal wird wie normale RuntimeExceptions so lange weitergereicht, bis es irgendwo explizit behandelt wird, 
* map
* flatMap
* zipWhen & zipWith (Unterschied herausstellen!)
* doOnNext/delayUntil (Unterschied herausstellen!)
* doOnError
* onErrorMap
* reduce/reduceWith 