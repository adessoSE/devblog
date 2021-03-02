---
layout:         [post, post-xml]              
title:          "Systemüberwachung mit den Spring Boot Health Checks"
date:           2018-08-22 13:57
modified_date: 
author:         roland 
categories:     [Softwareentwicklung]
tags:           [Spring, Microservices, Java]
---

Bei der Entwicklung von Anwendungen in einer Microservice-Architektur  muss man mit wesentlich komplexeren 
Laufzeitumgebungen zurechtkommen als bei monolithischen Anwendungen. Im Gegensatz zu einem Monolithen
kann eine Microservice-Architektur nur in Teilen verfügbar sein. Continous Deployment einzelner Microservices
führt dazu, dass es keine einheitliche Gesamtversion des Systems mehr gibt. Irgendwie muss man sich hier
Übersicht verschaffen. Wenn das schon während der Entwicklung in den
anfangs noch nicht so stabilen Integrations- und Testsystemen gelingt, vermeidet man viel Aufwand für spätere Fehlerdiagnose.

Wir haben vor kurzem für einen großen Kunden ein Projekt in Microservice-Architektur auf Basis von Spring Boot und Docker
in Produktion gebracht. Zu Beginn der Entwicklung stellte man sich als Entwickler oft die Frage, ob 
die gerade gemachten Änderungen das System
unbrauchbar gemacht haben, oder ob das System einen teilweisen Ausfall hat, weil z.B. gerade ein anderer Service nicht 
starten will. Bei einem klassischen Monolithen kann man
sich meistens auf der Maschine mit dem Applikationsserver einloggen und sich per Kommandozeile umsehen. Bei 20
Service Instanzen (wie bei unserem Projekt), die sich auf vier virtuellen Maschinen verteilen, lässt sich so nicht 
mehr effizient arbeiten. Hier muss automatisiert werden!
 
Neben einer zentralen Logfile Aggregation ist das automatische Einsammeln des Systemzustands wichtig. 
Wir haben dafür eine relativ einfache Lösung gefunden, die ich hier kurz skizzieren möchte.

## Netzwerkmonitoring
Netzwerkmonitoringsysteme wie z.B. nagios sind die klassische Lösung, um den Gesamtzustand eines Systems abzufragen. Freie
Systeme wie nagios haben allerdings Probleme mit der dynamischen Natur einer Microservice-Architektur.
Wir setzen in unserem Projekt ein kommerzielles Netzwerkmonitoringsystem ein, das mit den dynamischen
Aspekten umgehen kann. Allerdings hängen die Lizenzkosten von der Anzahl der zu überwachenden Server ab. Bei einer 
Microservice-Architektur mit vielen Docker Container treibt dies den Preis steil nach oben, so dass nur die 
produktiven und produktionsnahen Umgebungen überwacht werden können. 

Wir wollten aber für unsere Integrations- und Entwicklungssysteme den Systemzustand schon während der Entwicklung 
erfassen. Spring Boot besitzt einen eingebauten Diagnosemechanismus, den man dazu benutzen kann.

	
## Spring Actuator Endpoints
 
Mit den Spring Boot Actuator Endpoints (siehe 
[Spring Boot Actuator Dokumentation](https://docs.spring.io/spring-boot/docs/2.0.4.RELEASE/reference/htmlsingle/#production-ready)) 
bietet Spring Boot
eine REST-API an, mit der sich zahlreiche Informationen einer Spring Boot Applikation abfragen lassen. Es lassen
sich z.B. 
- Alle Konfigurationswerte
- Die letzten HTTP-Requests
- Mapping der REST-Endpunkte

und vieles mehr abfragen.
Unsere Lösung basiert auf den Endpunkten `health` und `info`.  


### Der Health Endpunkt
Der `/health` Endpunkt liefert Informationen zum Gesundheitszustand eines Microservice. Standardmäßig liefert Spring 
Boot Basisinformationen zum Festplattenplatz und zu benutzten Datenbanken sowie JMS-Servern. Man kann aber sehr einfach neue 
Checks hinzufügen, indem man Spring-Komponenten schreibt, die das `HealthIndicator` Interface implementieren. Die Methode
`health()` liefert dann ein Statusobjekt mit dem Ergebnis des Checks zurück.
Das folgende Beispiel prüft, ob sich ein externer REST-Service erreichen lässt:
	
```java	
    @Component
    public class UICHealthIndicator implements HealthIndicator {
    
        // Client für UIC REST-Aufrufe
        private final UicClient uicClient;
    
        @Autowired
        public UICHealthIndicator(UicClient uicClient) {
            this.uicClient = uicClient;
        }
    
        @Override
        public Health health() {
            try {
                // UIC gibt seinen Status über den REST-Endpunkt /systemInfo Preis
                Systeminformation result = uicClient.systemInfo();
                return Health.up()
                        .withDetail("version", result.getVersion())
                        .withDetail("server", result.getServer())
                        .build();
            } catch (Exception e) { 
                return Health.down().withDetail("reason", e.getMessage()).build();
            }
        }
    }
```
Wenn man möchte (und man sollte!), kann man für jede externe Abhängigkeit eines Microservice einen Test schreiben.
 Wir haben z.B. folgendes geprüft:
- Funktionsfähigkeit von benutzten REST- oder Web-Services
- Erreichbarkeit sonstiger externer URLs
- Überprüfung von gemounteten Dateisystemen. Man kann hier prüfen, ob die erwarteten Dateien und Verzeichnisse tatsächlich 
vorhanden sind und ob die Zugriffsrechte stimmen.
- Versionsstand der Datenbank. Im Falle von Liquibase kann man mit einer Datenbankquery über die Tabelle `databasechangelog` 
den Namen und den Status des zuletzt ausgeführten Datenbankskripts abfragen.

### Der Info Endpunkt
Der Info Endpunkt (`/info`) gibt alle Konfigurationswerte mit dem Präfix `info`. zurück. Mit ihm lassen sich sehr
 gut Informationen aus dem Buildprozess (z.B. die Versionsnummer 
und das Builddatum) verfügbar machen. Wenn man Maven verwendet und die Variablenersetzung für Properties-Dateien
 einschaltet, führen ein Einträge wie z.B.:

```properties
            info.build.artifact=@project.artifactId@
            info.build.version=@project.version@
            info.build.timestamp=@build.time@
            
```
dazu, dass später der Info Endpunkt den Namen des Maven-Moduls, die aktuelle Versionsnummer
 und den Zeitpunkt des Builds zurückliefert:

```json	
    {
        "build": {
            "timestamp": "2018-08-08T14:30:40.284+0000",
            "version": "1.9.0",
            "artifact": "signing-portal-backend"
        }
    }
```

### Sicherheit
In produktiven Systemen darf man nicht vergessen, die Actuator Endpoints abzusichern. Das heißt, es sollten in der
Konfiguration als Default alle Endpunkte abgeschaltet werden und nur die wirklich benötigten explizit eingeschaltet
werden. Über Spring Security muss dann der Zugriff auf die freigeschalteten Endpunkte abgesichert werden.

	
## Übersicht schaffen
Mit den `/health` und `/info` Endpunkten kann man jetzt jeden einzelnen Microservice abfragen
 und erhält jeweils eine Antwort im JSON-Format. Besser ist es natürlich, 
wenn man einen Endpunkt hat, der die Health- und Info-Daten aller Microservices
 abfragt und zusammenfasst. Wir haben dazu einen eigenen REST-Endpunkt 
implementiert, der die Namen und Zugangsdaten (URL, Zugangsdaten) 
aller Microservices aus einer Konfigurationsdatei liest und dann bei einem Aufruf 
der Reihe nach abarbeitet. Aus den einzelnen JSON-Antworten erstellt dieser neue
 Health-Aggregator-Endpunkt eine aggregierte Gesamtantwort im JSON Format. Wir haben dann noch
eine Webseite zur Verfügung gestellt, die diese Gesamtantwort optisch ansprechend darstellt.
Bei der Implementierung eines solchen Aggregator-Service sollte man versuchen,
 dass in einem Cluster jede einzelne Instanz eines Service abgefragt wird. Es hängt dabei
von der Docker-Laufzeitumgebung und den verwendeten Loadbalancern ab, wie man die 
einzelnen Instanzen adressieren kann. In unserem Fall verwendet die Laufzeitumgebung
ein DNS basiertes Verteilungsverfahren. Das heißt, der Aggregator fragt nicht nur die erste IP-Adresse
 zu einem Hostnamen ab, sondern alle.
Wenn man den REST-Endpunkt als Unterklasse von 
`org.springframework.boot.actuate.endpoint.AbstractEndpoint` implementiert, wird er als Spring Boot Actuator 
Endpunkt registriert. Das bedeutet, dass die Spring Boot Konfigurationseinstellungen 
für Actuator Endpunkte (Authentisierung, Autorisierung, Ein- und Ausschalten) auch
für den selbst geschriebenen Endpunkt gelten.
Bei uns sieht das Endergebnis als Webseite so aus:

![Health Seite](/assets/images/posts/Systemueberwachung-mit-Spring-Boot-HealthChecks/health.png)

Für jeden einzelnen Knoten lassen sich die Details im JSON-Format anzeigen:

![Health Details](/assets/images/posts/Systemueberwachung-mit-Spring-Boot-HealthChecks/health_detail.png) 

## In der praktischen Anwendung
In der Praxis ist die Health-Übersichtsseite immer die erste Anlaufstelle, 
wenn man den Systemzustand abfragen möchte. Die 
Seiten der einzelnen Systeme lassen sich blitzschnell über Browser-Bookmarks
 ansprechen. Im Gegensatz dazu brauche ich in der Weboberfläche 
des Buildservers sieben Klicks (keine Bookmarks möglich) und für die reguläre
 Systemüberwachung muss ich erst eine Desktop-Applikation
starten und mich dort anmelden.

Bei einem Deployment lässt sich über die
 Health-Seite am schnellsten prüfen, ob die neue 
Version deployed wurde (Builddatum und Versionsnummer) und ob 
der neue Service betriebsbereit ist. Erst wenn in der 
Health-Seite etwas nicht stimmt, wendet man sich Spezialwerkzeugen zu. 
Da die Health-Seite einfach aufgebaut ist, kann man sie auch Product Ownern 
oder Testern an die Hand geben. Das
Entwicklungsteam muss dann deutlich weniger Fragen zum Systemzustand
 beantworten. Wenn ein externer Testservice nicht 
zur Verfügung steht kann das jetzt jeder selbst abfragen.  

Gerade am Anfang des Projekts, wenn sowohl die eigene Software als auch
 die Infrastruktur (Containermanagement, Loadbalancer, 
Firewalls, etc.) noch nicht stabil sind, hilft eine solche Seite bei
 der schnellen Problemanalyse.
 
 
