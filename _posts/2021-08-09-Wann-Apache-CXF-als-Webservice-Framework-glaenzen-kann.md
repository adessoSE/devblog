---
layout:         [post, post-xml]              
title:          "Wann Apache CXF als Webservice-Framework glänzen kann"
date:           2021-08-09 15:00
author:         thorbolo
categories:     [Softwareentwicklung]
tags:           [Java, Apache CXF, Webservice]
---

Apaches CXF Framework bietet für die Webservice-Schnittstellenentwicklung entscheidende Vorteile gegenüber den Konkurrenten (z.B. Spring MVC), wenn sowohl Client- als auch Serverseite in eigener Hand liegen. 
Jedoch steht es sich anfänglich selbst dabei im Weg in deren Genuss zu kommen. 
In diesem Blogpost wird ein einfaches Beispiel vorgestellt, welches verdeutlichen soll, wie simpel und wartungsfreundlich (interne) Schnittstellen mit CXF im Idealfall umgesetzt werden können.
Leider ist die Welt selten ideal, womit bei CXF dann die Unannehmlichkeiten beginnen.   

# Apache CXF auf einem Bierdeckel
CXFs Unique Selling Point ist es, REST- und/oder SOAP-Webservices nahezu vollständig als Java-Code zu definieren zu können, ohne sich Gedanken über die technischen Details der Kommunikationswege machen zu müssen.
Konkret reicht es aus, ein Java Interface zu spezifizieren, welches die Serverseite implementiert und die Clientseite es verwendet.
Im Code unterscheidet sich die Verwendung dadurch nicht von einem ganz normalen Service.
Die Kommunikationswege zwischen der Verwendung im Client und dem Empfang im Server werden dabei vollständig von CXF weggekapselt.  

# Das ideale Szenario
Die Vorteile von CXF kommen besonders bei der Entwicklung interner Webservice-Schnittstellen zur Geltung.
Das schließt zum einen ein, dass Client- und Serverseite in der eigenen Hand liegen und andern, dass keine externen Clients den Webservice verwenden.
Es wird vorausgesetzt, dass auf beiden Seiten Apache CXF verwendet wird, es sich also um Java Ökosysteme handelt.
Ein diskussionswürdiger (aber für CXF perfekter) Umstand ist, wenn Client- und Servercode in der gleichen Codebase, bzw. im gleichen Repository, entwickelt werden. 
Hierdurch erzwingen Änderungen an der Schnittstelle bereits zur Compilezeit die Anpassungen von Client- und Servercode.
Ob dieser Umstand nur für den Einsatz von CXF herbeigeführt werden sollte, muss kritisch abgewogen werden. 
Bei getrennten Repositories sind aber auch Mechanismen in den CI- und Build-Prozessen möglich, die frühzeitig Änderungen propagieren.
Es gibt jedoch Systeme, bei denen diese Gegebenheiten bereits aus der Vergangenheit feststehen.

# The Good
Unter den beschriebenen Voraussetzungen kann die Webservice-Schnittstelle genau so einfach entwickelt werden, wie jedes andere Java-Interface.
Bei einer gewählten Implementierung mit **Jax-WS**, also **SOAP** als Grundlage der Kommunikation, beinhaltet das Java-Interface keinen weiteren Code.
Bei einer gewählten Implementierung mit **Jax-RS**, also **REST** als Grundlage der Kommunikation, sind noch einfache Annotationen an am Interface notwendig, die sich jedoch sehr in Grenzen halten.

## Beispiel 
Das folgende Beispiel zeigt eine einfache Definition eines Jax-RS Interface, der serverseitigen Implementierung und die clientseitige Verwendung.
Dabei besticht CXF durch seine Einfachheit, dass trotz einer technischen Schnittstelle, die über HTTP kommuniziert, kaum bis keine zusätzliche Komplexität aufweist.
Aufgrund der Natur der Java-Interfaces und der gemeinsamen Codebase sind Änderungen an der Schnittstelle immer bereits zur Compilezeit auf Server- und Clientseite umzusetzen.
Dadurch werden Laufzeitfehler durch unterschiedliche Schnittstellenversionen ausgeschlossen.
Dieser Vorteil kommt besonders in der frühen Phase einer Entwicklung zur Geltung, da sich Schnittstellen in dieser Zeit besonders häufig ändern.

Das Beispiel soll veranschaulichen, wie einfach eine Schnittstelle mit einem fertig konfigurierten CXF zu gestalten ist, daher wird folgend auf Code-Beispiele für die Konfiguration der Client- und Serverseite verzichtet.
Dafür sind im Internet ausreichend Beispiele zu finden (im Gegensatz zu allem anderen was CXF angeht, dazu später mehr).

### Interface
Das gemeinsame Interface wird bei der Implementierung mit Jax-RS mit den Java-EE REST-Endpoint-Annotationen angereichert.
Diese sind im Java SDK enthalten. 
Bei der Verwendung von Jax-WS wären diese nicht notwendig und würden das Interface weiter vereinfachen.

```java
@WebService
public interface IHelloWorld {

    @GET
    @Path("/sayHello")
    @Produces(MediaType.APPLICATION_JSON)
    HelloMessage sayHello() throws NotInRightMoodException;

    @POST
    @Path("/setMood")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    Result setMood(Mood mood);
}
```

### Serverseitige Implementierung
Die serverseitige Implementierung unterscheidet sich in keiner Weise von der Implementierung eines typischen Interface. 

```java
public class HelloWorldWebservice implements IHelloWorld{

    private Mood myMood;
    
    @Override
    public HelloMessage sayHello() throws NotInRightMoodException {
        if(myMood.isRight()){
            return new HelloMessage("hello!");
        }
        throw new NotInRightMoodException();
    }

    @Override
    public Result setMood(Mood mood) {
        return new Result(myMood = mood);
    }
}
```

Zur Konfiguration des Webservice wird folgende Dependency benötigt:
```xml
<dependency>
    <groupId>org.apache.cxf</groupId>
    <artifactId>cxf-rt-frontend-jaxrs</artifactId>
</dependency>
```

Auf die Details der Konfiguration wird wie oben erläutert verzichtet.


### Clientseitige Verwendung
Der Webservice kann clientseitig wie ein gewöhnlicher Service verwendet werden.
Im Code unterscheidet er sich in der Handhabung in keiner Weise. 

```java
public class HelloWorldClient {

    private final IHelloWorld helloWorldWebservice;

    public HelloWorldClient(IHelloWorld helloWorldWebservice) {
        this.helloWorldWebservice = helloWorldWebservice;
    }

    public HelloMessage sayHello() {
        try{
            return helloWorldWebservice.sayHello();
        }catch (NotInRightMoodException e){
            LOGGER.error("'Hello World'-Service is not in the right mood to say hello", e);
        }
    }

    public Result setGoodMood() {
        return helloWorldWebservice.setMood(new Mood("good"));
    }
}
```

Zur Konfiguration des Client wird folgende Dependency benötigt:
```xml
<dependency>
    <groupId>org.apache.cxf</groupId>
    <artifactId>cxf-rt-rs-client</artifactId>
</dependency>
```

Auf die Details der Konfiguration wird wie oben erläutert verzichtet.

# The Bad and the Ugly
Grundsätzlich kann CXF alles, was andere Webservice-Frameworks auch können und die Integration mit Spring ist ebenfalls gegeben, sodass die Endpoints und Webservice-Clients in den Kontexten initialisiert werden können.
Spezialfälle sind über gegebene Mechanismen umsetzbar und bieten reichlich Flexibilität.
Was ist dann also faul?

Kurzgesagt: die Dokumentation und mangelnde (gute) Beispiele im Internet.

Wer CXF einsetzen und aufsetzen möchte, findet sich schnell auf der öffentlichen Seite von [CXF](https://cxf.apache.org/) wieder und wird erschlagen von Informationen, das Gesuchte gehört allerdings oft nicht dazu.
Eine derart unübersichtliche Dokumentation ist heutzutage einfach nicht zeitgemäß und demotiviert schnell, wenn man von den Dokumentationen von Spring und allen seinen Frameworks verwöhnt ist.

Auch das weitere Googlen bringt weit weniger befriedigende Ergebnisse, als man es von anderen Frameworks kennt.
Dadurch fällt die Einarbeitung in CXF schwerfälliger aus und man kommt schnell zu dem Gedanken, ob ein anderes Framework nicht doch die bessere Wahl wäre.

Dabei muss man auch im Blick haben, dass man selbst nicht der einzige bleiben wird, der sich durch den Lernprozess quälen muss.
Nachfolgende Entwicklungsteams, die irgendwann weitere Konfigurationen am CXF-Setup vornehmen müssen, werden es ebenfalls schwerer haben.

# Fazit
CXF ist zurecht nicht das beliebteste Webservice-Framework. 
Es gibt jedoch Szenarien, in denen es seine Stärken voll ausspielen kann. 
In diesen Fällen sollte man den anfänglichen Mehraufwand gegen die deutlichen Vorteile aufwiegen und seinen Einsatz ernsthaft erwägen.
Wer CXF eine Chance gibt, kann mit einer sehr leicht wartbaren Schnittstelle belohnt werden. 
