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
sondern auch als App für Android und iOS verfügbar ist und über den Browser verwendet werden kann,
ist es ohne große Hürden möglich, sich mit anderen Menschen zu verknüpfen.

Discord ermöglicht es einem auch für seine eigenen Zwecke einen Server zu erstellen, um mit seiner eigenen Community kommunizieren zu können.
Um sich die Administration von seinem eigenen Server zu vereinfachen, gibt es die Möglichkeit Bots zu nutzen.

In diesem Artikel möchte ich mit euch die ersten Schritte machen, um solch einen Bot in Java zu programmieren.
Und natürlich zeige ich euch auch, welche weiteren Schritte nötig sind. 

Zur Erstellung und Programmierung benötigen wir folgende Dinge:

* IDE
* Java Version 9+
* Apache Maven
* Discord Account

# Den Bot im Web vorbereiten

Bevor wir mit der programmatischen Umsetzung beginnen können, müssen wir zunächst einiges vorbereiten.
Als erstes müssen wir den Bot im Web erstellen.
Dazu müssen wir uns auf der [Discord-Seite](https://discord.com/) anmelden und die [Applikationsseite](https://discord.com/developers/applications) aufrufen.
Auf dieser Seite können wir über den Button "New Application" oben rechts eine neue Applikation erzeugen.
Um die so erstellte Applikation in einen Bot umzuwandeln, müssen wir über den linken Baum in den Zweig Bot navigieren.
Dort können wir über "Add Bot" die Applikation nun in einen Bot umwandeln.

Nach der Umwandlung gibt es auf der Seite über einen Button "Copy" die Möglichkeit einen Token zu kopieren.
Diesen sollten wir uns für später schon einmal abspeichern.

Die Default-Einstellung von einem neu erstellten Bot ist public.
Der Bot könnte somit von jedem auf seinen Server geholt werden.
Damit das nicht passiert sollten wir diese Einstellung daher erst einmal auf private stellen.

# Die Entwicklung des Bots

Bevor wir mit der Implementierung beginnen können müssen wir ein Maven-Projekt anlegen.

Zunächst müssen wir die `pom.xml` erweitern, damit wir Abhängigkeiten zur Discord API erfolgreich einbinden können.
Da sich die Discord API nicht im zentralen Maven-Repository befindet, müssen wir das Discord-Repository in die `pom.xml` aufnehmen:

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

Für die ersten Ansäzte benötigen wir nur zwei Klassen `BotStartUp.java` und `AdessoBot.java`.
Diese packen wir beide in das Package `de.adesso.discordbot`.

Zusätzlich brauchen wir auf der `package`-Ebene die `module-info.java`.
In der müssen wir unserem Modul einen Namen geben und das Package eintragen, das wir von der Discord API benutzen wollen.
Im Anschluss daran sieht unsere `module-info.java` wie folgt aus:

```java
module de.adesso.discordbot { 
  requires net.dv8tion.jda;
}
```

# Das Coding beginnt

Jetzt können wir endlich die erste Zeile Code schreiben.
Wir brauchen nicht viel, damit unser erster Bot funktioniert.
Als Erstes erstellen wir in der Klasse `AdessoBot.java` die Methode `startBot()`.

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

Zum Starten des Bots müssen wir jetzt nur noch den ShardManager über die `build()`-Methode erzeugen lassen.

Unsere komplette Klasse sieht dann so aus:

```java
package de.adesso.discordbot;

import javax.security.auth.login.LoginException;

import net.dv8tion.jda.api.entities.Activity;
import net.dv8tion.jda.api.sharding.DefaultShardManagerBuilder;
import net.dv8tion.jda.api.sharding.ShardManager;

public class AdessoBot {

    public ShardManager startBot() throws LoginException, IllegalArgumentException {
        DefaultShardManagerBuilder builder = DefaultShardManagerBuilder.createDefault("Token");
        builder.setActivity(Activity.playing("Solitäre"));
        
        return builder.build();
    }
}
```

Um unsere Applikation jetzt noch starten zu können benötigt unsere Klasse `BotStartUp.java` nur noch eine `main()`-Methode.
In dieser erzeugen wir ein `AdessoBot`-Objeket und rufen die `startBot()`-Methode auf.

# Die ersten Lebenszeichen des Bots

Damit wir unseren Bot am Ende auch testen können, benötigen wir einen Server, auf dem wir die Rechte haben, einen Bot hinzuzufügen.
Am einfachsten ist es, wenn wir für den Test einen eigenen Server anlegen.

Über die Discord-Anwendung können wir das ganz einfach über das Plus auf der linken Seite erledigen.
Über die folgende URL können wir unseren programmierten Bot nun dem Server zuweisen.

[https://discord.com/oauth2/authorize?client_id=unsereClientId&scope=bot&permissions=8](https://discord.com/oauth2/authorize?client_id=unsereClientId&scope=bot&permissions=8)

Die `client_id` ist eine eindeutige Application Id von unserer Discord-Applikation.
Diese finden wir unter dem Reiter "General Information".

Bei der 8 handelt es sich um einen Permission Integer.
Mit einem Permission Integer wird angegeben, welche Rechte unser Bot auf dem Server besitzt.
Die 8 steht für Administrator.
Auf der [Applikationsseite](https://discord.com/developers/applications) gibt es nach dem Auswählen des Bots unter dem Reiter Bot ein Tool, mit dem wir uns die Permission Integer abhängig von den benötigen Rechten ermitteln lassen können.


Nach dem Aufruf der URL müssen wir nur noch bestätigen, dass der Bot unserem Server beitreten darf.

Wenn wir nun die Applikation starten, autorisiert sich unser Bot mit dem Token, den wir dem SharedManager übergeben haben, am Discord-System.
Sollten wir keine Fehler gemachten haben, können wir jetzt sehen, wie unser Bot gemütlich eine Runde Solitäre spielt.

# Der Bot mag auch ein Integrationstests

Natürlich ist es schön, zu sehen, dass der Bot auf unserem Discord-Server Solitäre spielt.
Zu einem guten Projekt gehören aber natürlich auch selbst geschriebene Tests.
Für den Anfang wollen wir einen kleinen Integrationstest schreiben.

Durch unseren erstellen Server können wir für diesen Test einfach das JUnit-Framework nutzen.
Zusätzlich nutzen wir auch noch AssertJ, mit diesem Framework lassen sich schöne fließende Vergleiche schreiben.

Da beide APIs nicht zum Java-Standard gehören, müssen wir als erstes die Abhängigkeiten in unsere `pom.xml` aufnehmen.

```xml
<dependency>
  <groupId>org.junit.jupiter</groupId>
  <artifactId>junit-jupiter-api</artifactId>
  <version>5.8.2</version>
  <scope>test</scope>
</dependency>
<dependency>
  <groupId>org.assertj</groupId>
  <artifactId>assertj-core</artifactId>
  <version>3.22.0</version>
  <scope>test</scope>
</dependency>
```

Jetzt erstellen wir unsere Test Klasse `AdessoBotTest.java` mit unserer Testmethode.
Der Name der Methode ist für die Ausführung des Tests nicht relevant, wir sollten trotzdem einen sprechenden Namen wählen.
Wichtig ist aber, dass wir unsere Methode mit der Annotation `@Test` versehen.
Zusätzlich können wir durch die Annotation `@DisplayName` noch einen gut leserlichen Namen vergeben.

Mit unserem Test wollen wir die folgenden Dinge prüfen:

* Der Bot ist online
* Er ist aktiv und spielt Solitäre

Damit wir diese Dinge prüfen können, müssen wir uns den `ShardManager` angucken, der vom `DefaultShardManagerBuilder` erzeugt wurde.
Vom `SharedManager` können wir uns über die `getShards()`-Methode alle Shards zurückgeben lassen, die durch `JDA`-Objekte dargestellt werden.
Für den Anfang haben wir nur einen Shard, dass heißt über ein `get(0)` bekommen wir unser `JDA`-Objekt mit dem wir unsere Tests durchführen können.

# Ist der Bot online?

Als erstes wollen wir wissen, ob unser Bot auch online ist, wenn die Methode `startBot()` aufgerufen wurde.
Für diesen Test brauchen wir den Status von unserem Shard, den wir über die Methode `getStatus()` bekommen.
Der Status wird über ein eigenes `enum` dargestellt und wir wollen prüfen, ob unser Shard den Status `CONNECTED` hat.
Dafür nutzen wir das vorher eingebunden Framework assertj, um folgenden Code zu schreiben:

```java
Status status = jda.getStatus();
assertThat(status).isEqualTo(Status.CONNECTED);
```

# Spielt der Bot Solitäre?

Nun wollen wir noch gucken, ob der Bot auch aktiv ist und wirklich Solitäre spielt.
Die Aktivität selber wird in einem `Presence`-Objekt gespeichert, wir müssen also von unserem Shard ein `Presence`-Objekt bekommen.
Das bekommen wir auch über die `getPresence()`-Methode.
Nachdem wir nun das `Presence`-Objekt haben, können wir uns die Aktivität holen und prüfen, ob sie unseren Erwartungen entspricht.

```java
Activity activity = jda.getPresence().getActivity();
assertThat(activity.getType()).isEqualTo(ActivityType.COMPETING);
assertThat(activity.getName()).isEqualTo("Solitär"));
```

# Die vollständige Test Klasse

Die neuste Version von JUnit ermöglicht es uns, alle unsere Prüfungen auszuführen ohne, dass der Test abbricht sobald eine Prüfung nicht erfolgreich ist.
Dafür können wir die Metode `assertAll(Executable...)` nutzen.
Am Ende sieht unser Test also so aus:

```java
@Test
@DisplayName("AdessoBot ist online und spielt Solitäre")
void adessoBotIsOnline() throws LoginException, IllegalArgumentException, InterruptedException {
	AdessoBot adessoBot = new AdessoBot();
	ShardManager shardManager = adessoBot.startBot();
	assertThat(shards.size()).isEqualTo(1);
	shardManager.getShards().get(0).awaitReady();
	List<JDA> shards = shardManager.getShards();
	assertThat(shards.size()).isEqualTo(1);
	JDA jda = shards.get(0);
	Status status = jda.getStatus();

	Activity activity = jda.getPresence().getActivity();

	assertAll(
		() -> assertThat(status).isEqualTo(Status.CONNECTED),
		() -> assertThat(activity.getType()).isEqualTo(ActivityType.COMPETING),
		() -> assertThat(activity.getName()).isEqualTo("Solitär"));
}
```


**Quellen:**
* [Apache Maven](https://maven.apache.org/index.html)
* [Discord Documentation](https://discord.com/developers/docs/intro)
* [Java](https://www.java.com/de/)
* [JUnit](https://junit.org/junit5/)
* [AssertJ](https://assertj.github.io/doc/)
