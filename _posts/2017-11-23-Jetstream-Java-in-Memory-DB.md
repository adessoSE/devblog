---
layout:         [post, post-xml]              
title:          "Jetstream - Eine In-Memory DB für Microservices?"
date:           2017-11-23 18:00
modified_date: 
author:         silasmahler 
categories:     [Java, Datenbanken]
tags:           [in-Memory-DB, Performance, Storage-Engine]
---

Schaut man sich heutzutage um, so stellt man fest, dass die Anzahl an Datenbanken mittlerweile wirklich umfangreich geworden ist. Zu den klassischen Vertretern wie MySQL oder Oracle gesellen sich Graphendatenbanken wie Neo4J, das dokumentenbasierte MongoDB und viele andere - quasi ein buntes Potpourri an Möglichkeiten.

Doch was muss man bei jeder dieser Datenbanken in der Regel machen bevor man Daten speichern kann? \
Richtig! - Man muss das Objektschema aus Java ins entsprechende Format der jeweiligen Datenbank mappen.

Hier kommt [Jetstream](http://www.jetstream.one/index.html) ins Spiel.

## Doch was ist Jetstream?

Jetstream ist eine sogenannte "in Memory Database", d.h. sie läuft ausschließlich im RAM der JVM. \
Das macht sie extrem performant. \
Die Entwickler sprechen von einer Geschwindigkeit, die klassische SQL-Queries um das bis zu 1.000.000-fache übersteigt. Dieser Umstand wird durch den JiT (Just in Time Compiler der JVM) zusätzlich bis um den Faktor 10-100 verstärkt.

## Doch gar keine echte in Memory Datenbank?

Ok, streng genommen ist Jetstream eigentlich gar keine "in Memory DB" wie das Marketingteam von xDev gerne wirbt. Es handelt sich genau genommen um eine "Storage-Engine" für den gesamten Objektgraphen. \
Diese liest den gesamten Objektgraphen aus dem RAM und speichert ihn in einer einfachen Datei auf der Festplatte. Nur wenn der RAM nicht ausreichen sollte, werden restliche Dateien von der Festplatte nachgelesen. \

Ja, richtig gehört. Keine Tabellen, keine Schemata, keine Abfragen! \
Ein konsistentes Objektmodell im Code und in der DB.

## Was muss ich denn nun tun um mit Jetstream Daten zu speichern?

Eigentlich nur:
```java
JetstreamDB.instance().storeRequired(myData);
``` 
und die Daten sind wegpersistiert. Fast zumindest. \
Aber gehen wir dies Schritt für Schritt an.


### 1. Jetstream ins Projekt einbinden

Jetstream kann aktuell mittels Maven-Dependency ins Projekt eingebunden werden. Zukünftig soll jedoch auch die ca. 2,5 MB große Bibliothek verfügbar sein. Diese kann man sich aktuell nämlich nur händisch vom Maven-Repo herunterladen. 

```xml
<repository>
        <id>jetstream-releases</id>
         <url>http://maven.jetstream.one/repository/maven-releases/</url>
         <releases>
        <enabled>true</enabled>
    </releases>
    <snapshots>
        <enabled>false</enabled>
    </snapshots>
</repository>
<repository>
    <id>jetstream-snapshots</id>
    <url>http://maven.jetstream.one/repository/maven-snapshots/</url>
    <releases>
        <enabled>false</enabled>
    </releases>
    <snapshots>
        <enabled>true</enabled>
    </snapshots>
</repository>

<dependency>
    <groupId>one.jetstream</groupId>
    <artifactId>jetstream-one-core</artifactId>
    <version>0.8.0</version>
</dependency>
```


### 2. Die Jetstreaminstanz erstellen

Die Jetstreaminstanz nimm als RootData das Objekt entgegen, welches die Grundlage der gesamten Datanbank bildet. Jede Jetstreaminstanz verfügt über genau ein Root-Objekt. 

```java
public class JetstreamDB extends JetstreamInstance<RootData> {
    private static JetstreamDB instance;
 
    private JetstreamDB() {
    }
 
    public static JetstreamDB instance() {
        if (null == instance) {
            instance = new JetstreamDB();
        }
        return instance;
    }
 
    @Override
    protected RootData createDefaultRoot() {
        return super.createDefaultRoot();
    }
 
    @Override
    protected String createStorageDirectoryName() {
        return "storage_name";
    }
}
```

### 3. RootData

Da das Root-Objekt die gesamte Datenbank repräsentiert, muss es alle zu persisitierenden Objekte enthalten. Die Struktur des Objektgraphen ist dabei absolut egal. Hier die Kundenliste als Beispiel. 

```java
public class RootData {
 
    private final List<Customer> customers = new ArrayList<>();
 
    public List<Customer> getCustomers() {
        return this.customers;
    }
}
```
### 4. POJOs Only

Wichtig ist nur, dass alle Objekte die im Objektbaum unter dem Rootobjekt hängen POJOs sind.

```java
public class Customer {
 
    private String firstname;
    private String lastname;
    private String mail;
    private Integer age;
    private Boolean active;
     
    //Todo: Generate GETTER and SETTER 
}
```

```java
final Customer customer = new Customer();
customer.setFirstname("John");
customer.setLastname("Doe");
customer.setMail("john.doe@xdev-software.com");
customer.setAge(30);
customer.setActive(true);
 
final List<Customer> customersList = JetstreamDB.instance().root().getCustomers();
customersList.add(customer);
```

### 5. Fast geschafft

Nun können wir jederzeit super einfach unsere gesamten Daten speichern. 
```java
JetstreamDB.instance().storeRequired(myData);
``` 

# Zusammenfassung

Abschließend betrachtet lässt sich über Jetstream noch nicht sonderlich viel sagen, aber die Idee ist ziemlich cool. Die Entwicklung befindet sich noch im Anfangsstadium und es gibt bis quasi noch keine Dokumentation außerhalb des hier gezeigten Initialbeispiels. Wie Refactoring des Objektgraphen behandelt wird, wurde auf der JCon 2017 vom Entwickler noch nicht genau erklärt, aber als Feature in Version 1.0.0 versprochen. \
Jetstream möchte dem Entwickler die volle Kontrolle geben, man muss sich als Entwickler aber auch entscheiden, ob man dafür auf einiges an gewohntem Komfort verzichtet. \
Vor dem Hintergrund von Cloud Computing, Microservices und Co. wird Jetstream in Zukunft jedoch sicherlich noch sehr interessant sein.

# Beispiel-Projekte
Unter [Jetstream-Pages](https://xdev-software.atlassian.net/wiki/spaces/JET/pages) ist diese Beispielanleitung nochmals zu finden. Da Jetstream erst seit ein paar Tagen verfügbar ist, wird es wahrscheinlich noch zu einigen Änderungen kommen.
