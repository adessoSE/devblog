---
layout: [post, post-xml] # Pflichtfeld. Nicht ändern!
title: 'Reaktive Programmierung mit Spring Webflux' # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date: 2021-09-15 18:00 # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2021-09-15 18:00 # Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author_ids: [schroeerth] # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: [Softwareentwicklung] # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Java, Spring, Webflux, Reaktive Programmierung] # Bitte auf Großschreibung achten.
---

# Mono und Flux auf Serviceebene
Die Reactor-API bietet eine sehr große Anzahl an Methoden. 
Es gibt zwar eine Art [Anleitung](https://projectreactor.io/docs/core/release/reference/#which-operator), 
wann welche zu nutzen ist, die kann aber insbesondere beim Einstieg in Webflux erschlagend wirken. 
Aus diesem Grund möchten wir euch hier als kleine Starthilfe eine reduzierte Auswahl mit Codebeispielen an die Hand geben.

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
muss nicht mit den Webflux Publishern gearbeitet werden,
hier kann also die eigentliche Geschäftslogik mit gewöhnlichem Java-Code implementiert werden.

Der Operator flatMap unterscheidet sich insofern von map, als er als Rückgabewert der übergebenen Methode wieder einen Publisher erwartet.
Das ist etwa dann sinnvoll, wenn diese Methode ihrerseits wieder einen API-Call machen muss. 
In unserem Beispiel könnte ein Blogbeitrag mit den Daten des Nutzers angelegt werden.
``` Java
public Mono<BlogpostWithAuthor> saveBlogPost(BlogPost blogPost, String userId) {
    Mono<UserData> userDataMono = userClient.getUser(userId);
    Mono<BlogPostWithAuthor> savedBlogPostMono = userDataMono.flatMap(userData -> saveBlogPost(blogPost, userData));
    return savedBlogPostMono;
}

private Mono<BlogpostWithAuthor> saveBlogPost(BlogPost blogPost, UserData userData){[...]}
```

* map
* flatMap
* collectList
* zipWhen & zipWith (Unterschied herausstellen!)
* doOnNext/delayUntil (Unterschied herausstellen!)
* doOnError
* onErrorMap
* reduce/reduceWith 