---
layout:         [post, post-xml]              
title:          "Sicherheitslücken mit dem OWASP Dependency Check erkennen"
date:           2018-03-26 12:01
modified_date:  2021-03-08 14:50
author:         saschagrebe 
categories:     [Softwareentwicklung]
tags:           [OWASP, Security, Build, Java]
---

Moderne Software-Systeme basieren auf einer Vielzahl von Bibliotheken und Frameworks, die das Leben der 
Software-Entwickler einfacher machen. In diesem Dschungel der Möglichkeiten ist es undenkbar die bekannten 
Sicherheitslücken für alle verwendeten Abhängigkeiten ohne Tool-Unterstützung im Blick zu behalten. 
In der OWASP Top 10 Liste der häufigsten Sicherheitsprobleme existiert ebenfalls ein Eintrag zur
"Verwendung von Komponenten mit bekannten Sicherheitslücken". 
Mit dem OWASP Dependency Check lässt sich der Abgleich mit der NIST’s National Vulnerability Database (NVD) 
automatisieren. In diesem Blog-Eintrag möchte ich gerne zeigen wie das funktioniert.

# Sicherheitslücken in Software
Sicherheitslücken verstecken sich nicht nur in selbstgeschriebener Software, sondern ebenfalls in den 3rd-Party 
Bibliotheken und Frameworks, die bei der Erstellung von komplexen Anwendungssystemen eingesetzt werden. Im
früheren Blog-Post [Verwundbarkeitsanalyse von Softwareprodukten anhand öffentlicher Datenbanken](https://www.adesso.de/de/news/blog/verwundbarkeitsanalyse-von-softwareprodukten-anhand-oeffentlicher-datenbanken.jsp)
sind meine Kollegen Luis Alberto Benthin Sanguino und Martin März bereits auf öffentliche Datenbanken eingegangen, 
gegen die Software im Allgemeinen geprüft werden kann. Dabei gehen sie unter anderem auf die Begriffe 
Common Platform Enumeration (CPE) und Common Vulnerabilities and Exposures (CVE) sowie die National Vulnerability 
Database (NVD) ein. Dieser Blog-Post beschäftigt sich daher nicht mit den Grundlagen, sondern erläutert die 
automatische Prüfung gegen die NVD.

# OWASP Dependency Check
Mit dem OWASP Dependency Check kann eine Java-Anwendung auf bekannte Schwachstellen in 3rd-Party Komponenten überprüft 
werden. Das Programm untersucht dazu die gesamte Anwendung nach externen Abhängigkeiten und berechnet ihren CPE. Im Fall
von Apache Commons FileUpload ist dieser beispielsweise *cpe:/a:apache:commons_fileupload:1.0*. Mit dem berechneten 
CPE wird die NVD Datenbank im Anschluss nach bekannten Schwachstellen (CVEs) durchsucht.

# Integration in den Build
Der Dependency Check kann ebenfalls in ein Build-Werkzeug integriert oder per CMD Line verwendet werden. Im Folgenden 
wird die 
[Verwendung mit Maven](https://jeremylong.github.io/DependencyCheck/dependency-check-maven/configuration.html) vorgestellt. Das
OWASP Dependency Check Plugin ist ebenfalls für weitere gängige Build-Werkzeuge und CI Server erhältlich. Ebenso enthält 
der CMD Line Client die gleichen Funktionen und kann in beliebigen Umgebungen ausgeführt werden.

## Maven Integration
Um den Dependency Check mit Maven zu verwenden muss lediglich das Plugin eingebunden und konfiguriert werden. 
Um die Analyse auszuführen muss entweder die Ausführung des Goals einer Phase hinzugefügt oder das Goal *dependency-check:check* aufgerufen werden, da
sich das Plugin nicht standardmäßig mit einer Maven-Phase registriert.

```xml
<plugin>
    <groupId>org.owasp</groupId>
    <artifactId>dependency-check-maven</artifactId>
    <version>1.3.3</version>
    <executions>
        <execution>
            <goals>
                <goal>check</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

## Setup mit zentraler Datenbank
Im Normalfall lädt sich das Maven Plugin die aktuelle NVD Datenbank aus dem Internet herunter und speichert die Daten in einer H2 Datenbank.
Gegen die H2 Datenbank werden im Anschluss die gefundenen Versionen auf Sicherheitslücken überprüft. Da die Datenbank 
auf dem CI Server In-Memory läuft, wird die Analyse sehr schnell durchgeführt. Aus Sicherheitsgründen kann 
es im Unternehmen jedoch vorkommen, dass der CI Server keine Verbindung mit der Außenwelt herstellen darf. Das 
automatisierte 
Herunterladen der NVD Datenbank zum Analysezeitpunkt funktioniert dadurch nicht. Um die Analysen trotzdem in 
den Build integrieren zu können gibt es zwei sinnvolle Setup Möglichkeiten.

Das Maven Plugin bietet eine Option, mit der ein Mirror der NVD Datenbank verwendet werden kann. Dazu muss natürlich im Netzwerk
des Unternehmens ein Mirror der NVD Datenbank aufgebaut werden. Ein einfacher Apache Webserver und ein Cron Job reichen dafür
aus. Mit einem [Kommandozeilen-Werkzeug](https://github.com/stevespringett/nist-data-mirror/) können die NVD Daten 
heruntergeladen werden. Das Maven Plugin lädt die NVD Daten nun bei jeder Analyse vom Unternehmens-Mirror und der CI 
Server benötigt keine direkte Verbindung zum Internet. Die URL zum Mirror muss mit den Parametern *cveUrl12Modified*, 
*cveUrl20Modified*, *cveUrl12Base* und *cveUrl20Base* konfiguriert werden.

Die Verwendung des Mirrors hat den Vorteil, dass die NVD Daten weiterhin in eine H2 Datenbank importiert werden. Dadurch wird
die Analyse weiterhin komplett In-Memory und damit sehr performant durchgeführt. Insbesondere bei Multi-Modul-Projekten 
wird deutlich Ausführungszeit im Vergleich zum zweiten Szenario eingespart.

Das zweite Szenario sieht eine zentrale Datenbank vor. Dazu wird eine SQL Datenbank benötigt (z. B. MariaDB)
die über einen beliebigen JDBC Treiber angesprochen werden kann. Für die Analyse werden zu jeder Abhängigkeit die 
Sicherheitslücken in der entfernten Datenbank nachgeschlagen. Durch Netzwerklatenz und das Setup der Datenbank kann sich die 
Ausführungszeit des OWASP Dependency Check um einige Sekunden bis Minuten verzögern. Dabei kommt es hauptsächlich auf
den Umfang des Projekts an.   

Für die Initialisierung der zentralen Datenbank wird ein [SQL Script](https://github.com/jeremylong/DependencyCheck/tree/master/core/src/main/resources/data)
benötigt, mit dem das zu verwendende Schema initialisiert wird. Die OWASP Dependency Check Instanzen, die zur Analyse 
genutzt werden, müssen mit der Option *autoUpdate = false* konfiguriert werden. Dadurch werden die Plugin Instanzen im 
ReadOnly-Modus gestartet und es gibt keine Probleme mit dem parallelen Zugriff. Für das Update der NVD Daten in der Datenbank 
kann das Maven Plugin oder das [OWASP Dependency Check CLI](https://jeremylong.github.io/DependencyCheck/dependency-check-cli/index.html) 
verwendet werden. Ein Automatismus um das Schema zu aktualisieren (z. B. bei einem Versionswechsel des Plugins)
existiert nicht.

```xml
<plugin>
    <groupId>org.owasp</groupId>
    <artifactId>dependency-check-maven</artifactId>
    <dependencies>
        <dependency>
            <groupId>org.mariadb.jdbc</groupId>
            <artifactId>mariadb-java-client</artifactId>
        </dependency>
    </dependencies>
    <configuration>
        <!-- Das automatische Update deaktivieren -->
        <autoUpdate>false</autoUpdate>
        
        <!-- Einrichtung für die Verbindung mit einer MariaDB -->
        <databaseDriverName>org.mariadb.jdbc.Driver</databaseDriverName>
        <connectionString>jdbc:mariadb://my.mariadb.de/nvddb</connectionString>
        <databaseUser>owasp</databaseUser>
        <databasePassword>owasp-password</databasePassword>
    </configuration>
</plugin>
```

Ein noch sehr junges Projekt in dem Zusammenhang ist 
[DependencyCheck Central Database Docker](https://github.com/jeremylong/dependencycheck-central-mysql-docker). Damit 
kann eine zentrale MySQL Datenbank mittels Docker betrieben werden, die bereits fertig konfiguriert ist und einmal täglich 
durch das OWASP Dependency Check CLI aktualisiert wird.

## Integration in Sonar
Um eine grundlegende Security Awareness bei allen Projektbeteiligten zu schaffen und die Einhaltung von Vorgaben zu 
fördern wird weiterhin ein Weg benötigt, mit dem die gefundenen Schwachstellen sichtbar werden. Standardmäßig erzeugt 
das Maven Plugin einen HTML Report, der über den CI Server veröffentlicht werden kann. Im Report werden alle Security 
Violations mit den in der NVD hinterlegten Informationen aufgelistet. Aus dem HTML Report können zusätzlich direkt Code 
Snippets für das Unterdrücken von False-Positives generiert werden. Mit dem Parameter *format* kann das Ausgabeformat 
auf die Werte XML, CSV, JSON, VULN und ALL geändert werden. Um den Report z. B. im 
[Jenkins Plugin](https://wiki.jenkins.io/display/JENKINS/OWASP+Dependency-Check+Plugin) verarbeiten zu können wird das 
XML Format benötigt.

Neben dem Reporting kann das Plugin ebenfalls den Build fehlschlagen lassen um die benötigte Aufmerksamkeit zu 
erreichen. Dies ist allerdings eine sehr absolute Maßnahme und sorgt für wenig Akzeptanz bei den Verantwortlichen, wenn 
der Grund ein False-Positive ist. Meiner Meinung nach ist die Integration in den [Sonar Server](https://www.sonarqube.org/) 
das geschicktere Vorgehen. Dazu muss das 
[OWASP Dependency Check Sonar Plugin](https://github.com/stevespringett/dependency-check-sonar-plugin) auf dem Sonar 
Server installiert werden. Der Scanner, der durch das Plugin hinzugefügt wird, liest den XML Report ein, der bei der 
Durchführung des OWASP Dependency Checks generiert wurde, und erzeugt aus den Fundstellen entsprechende Sonar Issues. 
Die Einstufung nach Blocker, Critical usw. erfolgt dabei nach dem Common Vulnerability Scoring System (CVSS) und 
konfigurierbaren Schwellwerten. Die entsprechenden Werte können mit den Sonar Properties 
*sonar.dependencyCheck.severity.critical* und *sonar.dependencyCheck.severity.major* konfiguriert werden.

## False-Positives ausschließen
Wo Licht ist, ist auch Schatten. Natürlich treten bei der Verwendung des Dependency Checks auch False-Positives auf. Dies 
liegt teilweise an der Qualität der angebundenen NVD Datenbank (siehe dazu auch 
[Verwendung von Komponenten mit bekannten Sicherheitslücken](https://www.owasp.org/index.php/Top_10-2017_A9-Using_Components_with_Known_Vulnerabilities)).
Über Sonar können die potentiellen Sicherheitslücken gemonitored und wie bei allen Sonar Issues als False-Positive bzw. 
Won't Fix markiert werden. Unter der Zuhilfenahme von Quality Gates können Projekte mit neuen Sicherheitslücken optisch 
hervorgehoben und das Scheitern des Builds kann ebenfalls erreicht werden.

Neben der erwähnten Möglichkeit False-Positives über Sonar auszuschließen, gibt es ebenfalls die Möglichkeit eine 
[XML-Datei zur Konfiguration](https://jeremylong.github.io/DependencyCheck/general/suppression.html) zum Analysezeitpunkt
zu verwenden. Die ausgeschlossenen False-Positives werden nun nicht mehr im Report aufgeführt. Mit diesem 
Mechanismus können insbesondere in umfangreichen Projekte, die auf dem 
gleichen Stack basieren, False-Positives effizient ausgeschlossen werden. Die einzelnen Teilprojekte müssen sich nun 
nicht mit den Problemen des zentralen Technologie-Stacks auseinandersetzen.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<suppressions xmlns="https://jeremylong.github.io/DependencyCheck/dependency-suppression.1.1.xsd">
    <suppress>
        <notes><![CDATA[
      file name: staxmapper-1.1.0.Final.jar
      False positive!
      ]]></notes>
        <gav regex="true">^org\.jboss:staxmapper:.*$</gav>
        <cpe>cpe:/a:apple:mac_os_x</cpe>
    </suppress>
</suppressions>
```

In diesem Beispiel wird ein False-Positive ausgeschlossen, das durch den CPE der JBoss StAX Mapper Facade gefunden wird. 
Der CPE verweist allerdings auf Mac OS X als Fundstelle für das Vulnerability und hat mit unserem JBoss Library keine 
direkte Verbindung. Daher kann das Finding ausgeschlossen werden.

# Fazit
Die allgemeine Kritik an den CVE Datenbanken kann im Blog-Post 
[Verwendung von Komponenten mit bekannten Sicherheitslücken](https://www.owasp.org/index.php/Top_10-2017_A9-Using_Components_with_Known_Vulnerabilities)
nachgelesen werden. An dieser Stelle gehe ich daher nur auf die Erkennung von bekannten Schwachstellen mit dem OWASP 
Dependency Plugin ein.

Grundsätzlich bietet das Plugin alle benötigten Funktionen und kann auch in umfangreichen Projekten zum Einsatz kommen.
Es erkennt bekannte Schwachstellen und listet sie, insbesondere mit dem Sonar Plugin, verständlich auf. Die 
False-Positives kommen aus der verwendeten NVD Datenbank und sind nicht durch Fehler im Plugin begründet. Generell gilt, dass 
der Einsatz empfohlen werden kann. Der Vollständigkeit halber muss erwähnt werden, dass es neben dem OWASP Plugin 
kommerzielle Werkzeuge gibt, die einen größeren Funktionsumfang bereitstellen. Auf diese Werkzeuge wird hier allerdings 
nicht weiter eingegangen.
