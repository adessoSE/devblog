---
layout: [post, post-xml]
title:  "adesso goes Discord"
date:   2022-01-05 10:25              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
author_ids: [bolsei]
categories: [Softwareentwicklung]
tags: [Discord, Java]
---

Unter Gamern ist Discord ein schon lange verbreitets Tool, um sich beim Spielen zu unterhalten.
Aber auch außerhalb der Gamer-Community wird Discord immer häufiger genutzt, um sich mit Freunden zu unterhalten oder auch nur zu Schreiben.
Dadurch, dass Discord nicht nur als Client auf dem Computer genutzt werden kann,
sondern auch als App für Android und IOS verfügbar ist und über den Browser verwendet werden kann,
ist es ohne große Hürden möglich sich mit anderen Menschen zu verknüpfen.
Discord ermöglicht es einem auch für seine eigenen Zwecke einen Server zu erstellen, um mit seiner eigenen Community kommunizieren zu können.
Um sich die Administration von seinem eigenen Server zu vereinfachen kann man Bots nutzen.

In diesem Artikel werden die ersten Schritte aufgezeigt, um solch einen Bot in Java zu programmieren und welche weiteren Schritte nötig sind. 
Zur Erstellung und Programmieren, werden folgende Dinge benötigt:
* IDE
* Version 9+
* Maven
* Discord Account

# Den Bot im Web vorbereiten

Bevor mit der programmatischen Umsetzung begonnen werden kann, müssen zunächst einige Vorarbeiten erledigt werden.
Als erstes muss der Bot im Web erstellt werden. Dazu muss man sich zunächst auf der [Discord Seite](https://discord.com/) anmelden.
Danach kann die Seite https://discord.com/developers/applications aufgerufen werden.
Auf der Seite kann über den Button „New Application“ oben rechts eine neue Applikation erzeugt werden.
Um die so erstellte Applikation in einen Bot umzuwandeln, muss über den linken Baum in den Zweig Bot navigiert werden.
Dort kann über „Add Bot“ die Applikaton nun in einen Bot umgewandelt werden.
Nach der Umwandlung gibt es auf der Seite nun die Möglichkeit einen Token in die Zwischen Ablage zu kopieren.
Dieser Token wird später noch benötig. Die Default Einstellung von einem neu erstellten Bot ist public.
Der Bot könnte somit von jedem auf seinen Server geholt werden. Damit das nicht passiert sollte die Einstellung daher erst einmal abgestellt werden. 

# Die Entwicklung des Bots

Jetzt kann die Entwicklung der eigentlichen Bot-Implementierung beginnen. Hier für muss ein Maven Projekt angelegt werden.
Zunächst muss die pom.xml erweitert werden, damit die Abhängigkeiten zur Discord API erfolgreich eingebunden werden können. 
Da sich die Discord API nicht im Maven-Repository befindet, muss das Discord-Repository in der pom.xml aufgenommen werden:

```xml
  <repository>
    <id>dv8tion</id>
    <name>m2-dv8tion</name>
    <url>https://m2.dv8tion.net/releases</url>
  </repository>
```

Danach kann die eigentliche Dependency ergänzt werden:

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

Für die ersten Ansätze wird zunächst nur eine Klasse „BotStartUp.java“ im Package „de.adesso.discordbot“ benötigt.

Zusätzlich wird auf der package-Ebene die module-info.java benötigt. In der muss das Modul benannt werden und das Package eingetragen werden,
das von der Discord API benötigt wird. Im Anschluss daran sieht die module-info wie folgt aus:

```java
module de.adesso.discordbot { 
  requires net.dv8tion.jda;
}
```

# Das Coding beginnt

Im nächsten Abschnitt kann nun endlich die erste Zeile Code geschrieben werden.
Es wird nicht viel benötigt, damit der erste Bot läuft und funktioniert.
Als Erstes muss der Klasse BotStartUp eine Main-Methode hinzugefügt werden.
Anschließend kann die Discord API genutzt werden um den Bot zu erzeugen.
Dafür wird der  DefaultShardManagerBuilder mit der Methode createDefault(String token) bereits zur Verfügung gestellt.
Der Token, der hier als Parameter erwartet wird. Ist der Token, der zuvor von der Discord Webseite kopiert wurde.

```java
DefaultShardManagerBuilder builder = DefaultShardManagerBuilder.createDefault("Unser Token");
```

Damit der Bot nach dem Starten auch schon ein kleines Lebenszeichen von sich gibt, kann die Aktivität über die Zeile:
builder.setActivity(Activity.playing("Solitäre"));
 gesetzt werden. 

Zum Starten des Botes muss jetzt nur noch der SharedManager über die build() Methode erzeugt werden.

Die komplette Klasse mit der main-Methode sieht am Ende so aus

```java
public void main(String … args) {
  DefaultShardManagerBuilder builder = DefaultShardManagerBuilder.createDefault("Token");
  Builder.setActivity(Activity.playing("Solitäre"));
  Builder.build();
}

```

# Die ersten Lebenszeichen des Bots

Damit der Bot am Ende getestet werden kann, wird ein Server benötigt, auf dem man die Rechte hat, einen Bot hinzuzufügen.
Am einfachsten ist es einen eigenen Server für solche Tests anzulegen.

Über die Discord App lässt sich dieser ganz einfach über das Plus auf der linken Seite erledigen.
Um den programmierten Bot einem Server zu zuweisen, gibt man folgende URL in den Browser ein:

https://discord.com/oauth2/authorize?client_id=unsereClientId&scope=bot&permissions=8

Bei der 8 handelt es sich um einen Permission Integer.
Mit einem Permission Integer wird angegeben welche Rechte der Bot auf dem Server besitzt.
Die 8 steht für Administrator. Auf der Seite https://discord.com/developers/applications gibt es nach dem Auswählen des Bots
unter dem Reiter Bot ein Tool um sich den Permission Integer in Abhängigkeit der Rechte zu ermitteln.
Die client_id ist eine Eindeutige Application Id von unserer Discord Applikation. Diese findet man unter dem Reiter General Information.
Nachdem Aufruf der URL kann der Bot jetzt dem Server hinzugefügt werden.

Wenn nun die Applikation gestartet wird, autorisiert sich der Bot mit dem Token, der dem SharedManager übergeben wurde am Discord System.
Wenn keine Fehler gemachten wurden, kann man sehen, wie der Bot gemütlich eine Runde Solitäre spielt
