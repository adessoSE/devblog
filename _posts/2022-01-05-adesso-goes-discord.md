---
layout: [post, post-xml]
title:  "adesso goes Discord"
date:   2022-01-05 10:25              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
author_ids: [bolsei]
categories: [Softwareentwicklung]
tags: [Discord, Java, Discord Bot]
---

Unter Gamern ist Discord ein schon lange verbreitetes Tool, um sich beim Spielen zu unterhalten.
Aber auch außerhalb der Gamer-Community wird Discord immer häufiger genutzt, um sich mit Freunden zu unterhalten oder auch nur um zu Schreiben.
Dadurch, dass Discord nicht nur als Client auf dem Computer genutzt werden kann,
sondern auch als App für Android und IOS verfügbar ist und über den Browser verwendet werden kann,
ist es ohne große Hürden möglich, sich mit anderen Menschen zu verknüpfen.

Discord ermöglicht es einem auch für seine eigenen Zwecke einen Server zu erstellen, um mit seiner eigenen Community kommunizieren zu können.
Um sich die Administration von seinem eigenen Server zu vereinfachen, kann man Bots nutzen.

In diesem Artikel möchte ich mit euch die ersten Schritte machen, um solch einen Bot in Java zu programmieren.
Und natürlich zeige ich euch auch welche weiteren Schritte nötig sind. 

Zur Erstellung und Programmieren, benötigen wir folgende Dinge:

* IDE
* Version 9+
* Maven
* Discord Account

# Den Bot im Web vorbereiten

Bevor wir mit der programmatischen Umsetzung beginnen können, müssen wir zunächst einiges vorbereiten.
Als erstes müssen wir den Bot im Web erstellen.
Dazu müssen wir uns auf der [Discord-Seite](https://discord.com/) anmelden.
Danach können wir die [Applikationsseite](https://discord.com/developers/applications) aufrufen.
Auf dieser Seite können wir über den Button "New Application" oben rechts eine neue Applikation erzeugen.
Um die so erstellte Applikation in einen Bot umzuwandeln, müssen wir über den linken Baum in den Zweig Bot navigieren.
Dort können wir über "Add Bot" die Applikation nun in einen Bot umwandeln.

Nach der Umwandlung gibt es auf der Seite die Möglichkeit einen Token zu kopieren.
Diesen sollten wir uns für später schon einmal abspeichern.

Die Default-Einstellung von einem neu erstellten Bot ist public.
Der Bot könnte somit von jedem auf seinen Server geholt werden.
Damit das nicht passiert sollten wir diese Einstellung daher erst einmal auf private stellen.

# Die Entwicklung des Bots

Jetzt können wir mit der eigentlichen Bot-Implementierung beginnen.
Hierfür müssen wir ein Maven Projekt anlegen.

Zunächst müssen wir die `pom.xml` erweitern, damit wir Abhängigkeiten zur Discord API erfolgreich einbinden können.
Da sich die Discord API nicht im Maven-Repository befindet, müssen wir das Discord-Repository in die `pom.xml` aufnehmen:

```xml
<repository>
  <id>dv8tion</id>
  <name>m2-dv8tion</name>
  <url>https://m2.dv8tion.net/releases</url>
</repository>
```

Danach können wir die eigentliche Abhängigkeit zur API ergänzen:

```xml
<dependency>
  <groupId>net.dv8tion</groupId>
  <artifactId>JDA</artifactId>
  <version>4.2.1_253</version>
  <exclusions>
    <exclusion>
      <groupId>club.minnced</groupId>
      <artifactId>opus-java</artifactId>
    </exclusion>
  </exclusions>
</dependency>
```

Für die ersten Ansäzte benötigen wir nur eine Klasse `BotStartUp.java` im Package `de.adesso.discordbot`.

Zusätzlich brauchen wir auf der `package`-Ebene die `module-info.java`.
In der müssen wir unserem Modul einen Namen geben und das Package eintragen, das wir von der Discord API benutzen wollen.
Im Anschluss daran sieht unsere `module-info.java` wie folgt aus:

```java
module de.adesso.discordbot { 
  requires net.dv8tion.jda;
}
```

# Das Coding beginnt

Im nächsten Schritt können wir nun endlich die erste Zeile Code schreiben.
Wir brauchen nicht viel, damit unser erster Bot funktioniert.
Als Erstes müssen wir die `BotStartUp` Klasse um eine `main()`-Methode erweitern.

Anschließend können wir die Discord API nutzen, um den Bot zu erzeugen.
Dafür bekommen wir den `DefaultShardManagerBuilder` mit der Methode `createDefault(String token)` zur Verfügung gestellt.
Der Token, der hier als Parameter erwartet wird, ist unser Token, den wir uns zuvor schon kopiert hatten.

```java
DefaultShardManagerBuilder builder = DefaultShardManagerBuilder.createDefault("Unser Token");
```

Damit unser Bot nach dem Starten auch schon ein kleines Lebenszeichen von sich gibt, können wir die Aktivität über folgende Zeile setzen:

```java
builder.setActivity(Activity.playing("Solitäre"));
```

Zum Starten des Botes müssen wir jetzt nur noch den SharedManager über die `build()`-Methode erzeugen lassen.

Unsere komplette Klasse mit der `main()`-Methode sieht dann so aus:

```java
package de.adesso.discordbot;

import net.dv8tion.jda.api.entities.Activity;
import net.dv8tion.jda.api.sharding.DefaultShardManagerBuilder;

public class BotStartUp {

    public void main(String … args) throws Exception {
        DefaultShardManagerBuilder builder = DefaultShardManagerBuilder.createDefault("Token");
        builder.setActivity(Activity.playing("Solitäre"));
        builder.build();
    }
}
```

# Die ersten Lebenszeichen des Bots

Damit wir unseren Bot am Ende auch testen können, benötigen wir einen Server, auf dem wir die Rechte haben einen Bot hinzuzufügen.
Am einfachsten ist es, wenn wir für den Test einen eigenen Server anlegen.

Über die Discord-App können wir das ganz einfach über das Plus auf der linken Seite erledigen.
Über die folgende URL können wir unseren programmierten Bot nun dem Server zuweisen.

[https://discord.com/oauth2/authorize?client_id=unsereClientId&scope=bot&permissions=8](https://discord.com/oauth2/authorize?client_id=unsereClientId&scope=bot&permissions=8)

Bei der 8 handelt es sich um einen Permission Integer.
Mit einem Permission Integer wird angegeben welche Rechte unser Bot auf dem Server besitzt.
Die 8 steht für Administrator.
Auf der [Applikationsseite](https://discord.com/developers/applications) gibt es nach dem Auswählen des Bots unter dem Reiter Bot ein Tool, mit dem wir uns die Permission Integer abhängig von den benötigen Rechten ermitteln lassen können.

Die `client_id` ist eine Eindeutige Application Id von unserer Discord-Applikation.
Diese finden wir unter dem Reiter "General Information".

Nach dem Aufruf der URL müssen wir nur noch bestätigen, dass der Bot unserem Server beitreten darf.

Wenn wir nun die Applikation starten, autorisiert sich unser Bot mit dem Token, den wir dem SharedManager übergeben haben, am Discord-System.
Sollten wir keine Fehler gemachten haben, können wir jetzt sehen, wie unser Bot gemütlich eine Runde Solitäre spielt.

**Quellen:**
* [maven](https://maven.apache.org/index.html)
* [Discord Documentation](https://discord.com/developers/docs/intro)
* [Java](https://www.java.com/de/)
