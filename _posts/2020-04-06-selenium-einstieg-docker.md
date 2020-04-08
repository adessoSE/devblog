---
layout: [post, post-xml]              # Pflichtfeld. Nicht ändern!
title:  "Selenium Basics - Docker"     # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2020-04-06 09:00              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2020-04-06 09:00
author: lubbyhst                      # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: [Java]       # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Testing, Docker, Selenium, Java]                       # Optional.
---

 
In dieser Blogreihe möchte ich einen Einstieg für das Automatisierungstool Selenium vorstellen.
In dem ersten Artikel habe ich einen Überblick zu Selenium gegeben und ein Beispielprojekt vorgestellt. 
Der zweite Artikel geht nun auf die Kombination von Selenium und Docker ein.
Vorkenntinsse im Bereich Java, JUnit, Docker und Maven sind empfehlenswert. 

# Vorstellung Docker

Docker ist eine Containervirtualisierung bei der der Kernel die Existenz mehrerer isolierter User-Space-Instnazen erlaubt.
Diese werden Container genannt.
Docker besteht im wesentlichen aus drei Komponenten.
Der Docker-Client, auch Docker CLI(Command Line Interface) genannt, ist für die Interaktion mit dem Docker Daemon notwendig.
Der Client kommuniziert über eine API mit dem Docker Daemon.
Der Daemon verarbeitet die Requests des Docker Client und verwaltet die Docker-Objekte wie Container, Volumes und weiteres.
Die dritte Komponente ist die Docker Registy. 
Diese dient zur Abblage und Verteilung von Container Abbildern (Images).
Die bekannteste Registry ist sicher [Docker Hub](https://hub.docker.com)
Images sind Vorlagen um Docker-Container zu erstellen.
Sie werden häufig in Schichten angelegt, so dass ein Image auf einem anderen Image basiert. 

## Dockerfile

Ein Dockerfile enthält die Anweisungen zum Erstellen eines Docker-Image. 
Jede Anweisung in einem Dockerfile stellt dabei eine neue Schicht in dem Docker-Image dar.
Darüber hinaus können in dem Dockerfile Informationen über den Container festgelegt werden.
Z.B. welche Ports exposed werden können oder welchen Einstiegspunkt es gibt.

## Docker-Images

Docker-Images werden durch einen Docker Deamon erzeugt und nach bedarf in einer Registry abgelet.
Der übliche Weg ein Image zu erzeugen ist ein Dockerfile zu verwenden.
Ein Docker-Image besteht üblicherweise aus einem Basis Image und Mehreren Schichten von Kommandos.
Z.B. die Installation und Einrichtung einer Datenbank.
Das Fertige Image enthält dann eine vollständige Datenbank Installation mit allen notwendigen Schritten um ausgeführt werden zu können.

## Docker-Container

Ein Container ist eine ausführbare Instanz eines Docker-Images. 
Das Image bilded hier quasi die Vorlage für einen Container.
Aus einem Image können zudem beliebig viele Container erzeugt werden.
In unserem Beispiel wird so ein Container erzeugt indem ein Webbrowser gestartet werden kann.
Dieser wiederum kann durch Selenium zu Testauführung verwendet werden.

# Verwendung von Docker für Systemtests

Anhand des Basis Projektes aus dem ersten Teil dieser Blogreihe möchte ich erklären, wie Docker zum Testen einer Webanwendung verwendet werden kann.

![Basis Porjekt Struktur](/assets/images/posts/selenium-einstieg-basis-projekt/basis-projekt.png)

Dazu konzentrieren wir uns in diesem Teil lediglich auf das Modul Docker.

## Modul Docker

Das Modul ist lediglich ein Parent Modul ohne eigene Sourcen.
Es enthält die Basis pom.xml die für jedes sub modul die Grundkonfiguration vorgibt.

### docker-maven-plugin

Ein Blick in das Parent Modul zeigt die Verwendung des [docker-maven-plugin](https://dmp.fabric8.io/).
Dieses Plugin ermöglicht die Steuerung eines Docker Deamon ähnlich wie es auch mit der Docker CLI möglich ist.
Es besteht auch die Möglichkeit auf die Verwendung des Plugins zu verzichten und anstelle dessen das Maven Exec Plugin zu verwenden.
Aufgrund der besseren Übersichtlichkeit und Konfigurierbarkeit tendiere ich hier zu dem docker-maven-plugin.

### Grundkonfiguraiton

In der pom.xml findet man einige spezifische docker.* Properties.
Diese steuern das Verhalten des docker-maven-plugin. 
Eine genaue Beschreibung zu den einzelnen Properties findet man in der [Plugindokumentaion](https://dmp.fabric8.io/).
Im Plugin Management wird für das docker-maven-plugin das Phasebinding vorgenommen.
Dies bedeutet, dass die Goals [docker:build](https://dmp.fabric8.io/#docker:build) und [docker:push](https://dmp.fabric8.io/#docker:push) einer Maven Lifecycle Phase zugeordnet werden.
So werden die Docker-Images automatisch erzeugt, wenn der Befehl 
```bash 
mvn install
``` 
ausgeführt wird.

### Struktur demo-container

![Struktur_demo-container](/assets/images/posts/selenium-einstieg-docker/struktur-demo-container.png)

Das Modul demo-container enthält neben der pom.xml noch ein Dockerfile. 
Dieses wird benötigt um ein Docker-Image für die zu testende Demo Anwendung zu erstellen.

#### Dockerfile

```dockerfile
FROM openjdk:12-alpine

RUN mkdir -p /opt/app
WORKDIR /opt/app

COPY jar/demo.jar /opt/app/

VOLUME /opt/app

EXPOSE 8080
ENTRYPOINT ["java","-jar","demo.jar"]
```
Das Dockerfile beschreibt im wesentlichen wie sich unser Demoimage aufbaut.


FROM beschreibt von welchem Docker-Image wir beginnen möchten.
Hier wählen wir das freie auf http://hub.docker.com verfügbare Image openjdk mit dem Tag 12-alpine.
Dies bedeutet wir möchten die Version 12 des Open JDK mit der Betriebssystem Basis alpine.

Anschließend wird unter /opt/app/ ein Arbeitsverzeichniss erstellt in welches das Spring Boot Jar kopiert wird.
Mit EXPOSE wird bekanntgegeben unter welchem Port in diesem Image eine Anwendung zu erreichen ist.

Als letzter Schritt wird durch den ENTRYPOINT ein Befehl definiert, welcher ausgeführt werden soll wenn ein Container gestartet wird.

#### Resouce Plugin

```xml
<plugin>
    <artifactId>maven-resources-plugin</artifactId>
    <version>2.7</version>
    <executions>
        <execution>
            <id>copy-dockerfiles</id>
            <phase>prepare-package</phase>
            <goals>
                <goal>copy-resources</goal>
            </goals>
            <configuration>
                <outputDirectory>${docker.files.build.directory}</outputDirectory>
                <resources>
                    <resource>
                        <directory>${docker.files.base.directory}</directory>
                    </resource>
                </resources>
            </configuration>
        </execution>
    </executions>
</plugin>
```

Das Resources Plugin wird hier zum kopieren der Daten aus dem src Ordner verwendet.
Die Daten in den Ordner target/docker-files kopiert und dort durch das docker-maven-plugin verwendet.

#### Dependency Plugin

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-dependency-plugin</artifactId>
    <version>2.10</version>
    <executions>
        <execution>
            <id>copy demo binaries</id>
            <phase>package</phase>
            <goals>
                <goal>copy</goal>
            </goals>
            <configuration>
                <artifactItems>
                    <artifactItem>
                        <groupId>de.adesso.lubiniecki</groupId>
                        <artifactId>webapp-demo</artifactId>
                        <version>${project.version}</version>
                        <type>jar</type>
                        <overWrite>true</overWrite>
                        <outputDirectory>${docker.files.build.directory}/jar</outputDirectory>
                        <destFileName>demo.jar</destFileName>
                    </artifactItem>
                </artifactItems>
            </configuration>
        </execution>
    </executions>
</plugin>
```
Durch das dependency plugin wird das im Vorfeld erzeugte webapp-demo Artefakt aus dem Maven Repository geladen und in den target/docker-files Ordner kopiert. 
Dies ermöglicht die Dependency Funkitonalität von Maven zu verwenden und es muss kein Artefakt manuell aus einem target folder kopiert werden.
Es wäre so auch mölgich das erzeugen von Artefakten an einen vorgelagerten Prozess auszulagern und das erzeugen des Docker-Image später auszuführen.

#### Docker Maven Plugin
```xml
<configuration>
    <autoPull>${docker.autopull}</autoPull>
    <verbose>${docker.verbose}</verbose>
    <images>
        <image>
            <name>${docker.demo.image.name}</name>
            <alias>demo</alias>
            <build>
                <nocache>${docker.nocache}</nocache>
                <compression>none</compression>
                <dockerFileDir>${docker.files.build.directory}</dockerFileDir>
            </build>
            <run>
                <skip>${docker.skip}</skip>
                <network>
                    <mode>bridge</mode>
                    <alias>demo</alias>
                </network>
                <namingStrategy>alias</namingStrategy>
                <env>
                    <DBUS_SESSION_BUS_ADDRESS>/dev/null</DBUS_SESSION_BUS_ADDRESS>
                </env>
                <ports>
                    <port>${docker.demo.http.port}:8080</port>
                </ports>
                <wait>
                    <log>.*Started WebappDemoApplication.*</log>
                    <time>${docker.run.wait.timeout}</time>
                </wait>
                <log>
                    <enabled>${docker.logging}</enabled>
                    <prefix>demo:</prefix>
                    <date>DEFAULT</date>
                </log>
            </run>
        </image>
    </images>
</configuration>
```
Die Konfiguration des docker-maven-plugins ist etwas umfangreicher.
Sie enthält neben den Informationen zum erstellen </build> des Docker-Image auch die Konfiguration zum starten eines Containers </run>.
Es besteht zudem die Möglichkeit in einem Module mehrere Docker-Images zu konfigurieren.
Zur besseren Übersicht wurde hier für jeden Container ein eigenes Modul erstellt.
Als erstes wird in der Allgemeinen Konfiguration der Imagename definiert der verwendet werden soll. 
In dem </build Tag ist der Tag </dockerFileDir> der wichtigste. 
Damit wird angegeben wo das Plugin nach dem Dockerfile und allen weiteren Sourcen schauen soll.
In diesem Fall ist dies der Pfad "target/docker-files".
In dem </run> Tag werden alle Informationen angegeben die für die Ausführung eines Containers wichtig sind.
Der Imagename wurde bereits definiert.
Mit dem Tag </network> wird der Container einem definierten Netzwerk zugewiesen.
Wird dieser nicht angegeben, so wird der Container dem default Netzwerk des Docker Deamon zugewiesen.
Der Tag </namingStrategy> definiert wie der Container im Netzwerk angesprochen werden kann. 
Über </env> besteht die Möglichkeit Umgebungsvariablen für den Container zu definieren.
<ports> definiert das Mapping von Container Ports auf die Lokalen Ports des Docker Deamon.
Mit </wait> besteht die Möglichkeit auf einen Container zu warten.
In diesem Beispiel wird auf eine bestimmte Logausgabe gewartet um sicherzustellen, dass der Container vollständig gestartet ist.

All diese Parameter und weitere können in der [Dokumentation](https://dmp.fabric8.io/) des docker-maven-plugin nachgeschlagen werden.

### Struktur selenium-hub-container

![Struktur_selenium-hub-container](/assets/images/posts/selenium-einstieg-docker/struktur-selenium-hub-container.png)

Der selenium-hub-container besteht lediglich aus einer pom.xml da das verwendete Docker-Image bereits durch Selenium HQ [bereitgestellt](https://github.com/SeleniumHQ/docker-selenium) wird.

#### Docker Maven Plugin

````xml
<configuration>
    <images>
        <image>
            <name>${docker.selenium.image.name}</name>
            <alias>selenium-${selenium.browser}</alias>
            <run>
                <network>
                    <mode>bridge</mode>
                    <alias>selenium</alias>
                </network>
                <namingStrategy>alias</namingStrategy>
                <links>
                    <link>demo</link>
                </links>
                <env>
                    <DBUS_SESSION_BUS_ADDRESS>/dev/null</DBUS_SESSION_BUS_ADDRESS>
                </env>
                <ports>
                    <port>${docker.selenium.hub.port.placeholder}:4444</port>
                    <port>${docker.selenium.vnc.port.placeholder}:5900</port>
                </ports>
                <wait>
                    <log>.*Selenium Server is up and running.*</log>
                    <time>${docker.run.wait.timeout}</time>
                </wait>
                <log>
                    <enabled>${docker.logging}</enabled>
                    <prefix>SELENIUM</prefix>
                    <date>DEFAULT</date>
                </log>
            </run>
        </image>
    </images>
</configuration>
````

Auch hier wird wieder zuerst der Image Name definiert und im Anschluss die Run Konfiguration festgelegt.
Die Konfiguration ähnelt dem Demo Container sehr.
Daher werde ich nicht noch einmal auf jeden Tag eingehen.
Eine Besonderheit gibt es jedoch.

Das verwendete Image ist ein Debug Image. 
Welches einen zusätzlichen VNC Server enthält. 
Dadurch besteht die Möglichkeit die Testausführung über einen VNC Client zu beobachten oder auch zu steuern.
Der VNC Server ist über den Port 5900 erreichbar und das default Passwort lautet "secret".
In dem [Github Repository](https://github.com/SeleniumHQ/docker-selenium#debugging) von Selenium HQ wird dieser Fakt noch detailiert beschrieben.

## Zusammenspiel

Beide Container können nun durch die Systemtests verwendet werden.
Vor Beginn der Systemtests werden die Container durch den Befehl 
```bash
mvn docker:start
```
gestartet. 
Der selenium-hub-container stellt für das Testframework den benötigten Selenium-Hub inkl. Browserinstanz zur verfügung.
Der demo-container enthält die zu testende Webanwendung gegen die die Testfälle ausgeführt werden.
Nach Abschluss der Systemtests können die Container durch den Befehl
```bash
mvn docker:stop
```
heruntergefahren und entfernt werden.

## Vorteile

Gegenüber einer fest installierten Umgebung ist hier zu allererst die schnelle Installationszeit.
Durch den Fakt alles über Infrastructure as Code zu verwalten erhält man eine sehr schnelle Installationszeit da keine manuellen Eingaben notwending sind.

Dazu kommt die Versionierbarkeit. 
Angenommen eine Anwendung muss mit verschiedenen Versionsständen getestet werden.
Durch die Dockerumgebung kann man solche Fälle einfach im Code darstellen und muss keine Anpassungen an Testsystemen vornehmen.

Auch ältere Versionsstände könnnen so einfach wieder ausgecheckt und deployed werden.

Die bekannte Problematik "Works on my Machine" wird weiter verringert.

## Nachteile

Der Entwickler benötigt ein gewisses Verständnis für die eingesetzten Technologien.

Die kompatibilität zwischen Unix und Windows ist leider noch nicht sehr gut.
Daher würde ich für die Verwendung immer ein Unix empfehlen.



# Ausblick

In dem letzten Blog der Reihe möchte ich bekannte Pitfalls und Do's and Dont's ansprechen.


### Quellcode auf Github

[Quellcode](https://github.com/lubbyhst/selenium-example)
