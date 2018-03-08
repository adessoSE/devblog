---
layout:         [post, post-xml]              
title:          "Sicherheitslücken mit dem OWASP Dependency Check erkennen"
date:           2018-03-30 12:01
modified_date: 
author:         saschagrebe 
categories:     [Java]
tags:           [OWASP, Security, Build]
---
Moderne Software basiert auf einer Vielzahl von Bibliotheken und Frameworks, die das Leben der 
Software-Entwickler einfacher machen. Es ist unmöglich die bekannten Sicherheitslücken für alle Abhängigkeiten im Blick 
zu behalten. Sogar in der OWASP Top 10 Liste der häufigsten Sicherheitsprobleme existiert ein Eintrag zur 
[Verwendung von Komponenten mit bekannten Sicherheitslücken](https://www.owasp.org/index.php/Top_10-2017_A9-Using_Components_with_Known_Vulnerabilities).
Mit dem OWASP Dependency Check lässt sich der Abgleich mit der NIST’s [National Vulnerability Database (NVD)](https://nvd.nist.gov/) 
automatisieren. In diesem Blog-Eintrag möchte ich gerne zeigen wie das funktioniert.

# Sicherheitslücken in Software
Sicherheitslücken verstecken sich nicht nur in unserer selbstgeschriebenen Software, sondern ebenfalls in den 3rd-Party 
Bibliotheken und Frameworks, die bei der Erstellung von komplexen Anwendungssystemen eingesetzt werden. In unserem 
früheren Blog-Post [Verwundbarkeitsanalyse von Softwareprodukten anhand öffentlicher Datenbanken](https://www.adesso.de/de/news/blog/verwundbarkeitsanalyse-von-softwareprodukten-anhand-oeffentlicher-datenbanken.jsp)
sind meine Kollegen Luis Alberto Benthin Sanguino und Martin März bereits auf öffentliche Datenbanken eingegangen, 
gegen die unsere Anwendungen geprüft werden können. In ihrem Post gehen sie unter anderem auf die Begriffe 
Common Platform Enumeration (CPE) und Common Vulnerabilities and Exposures (CVE) sowie die National Vulnerability 
Database (NVD) ein. In diesem Blog-Post wollen wir uns daher nicht mit den Grundlagen beschäftigen, sondern die 
automatische Prüfung gegen die NVD erläutern.

# OWASP Dependency Check
Mit dem OWASP Dependency Check kann eine Java Anwendung auf bekannte Schwachstellen in 3rd-Party Komponenten überprüft 
werden. Das Programm untersucht dazu die Gesamte Anwendung nach externen Abhängigkeiten und berechnet ihren CPE. Im Fall
von Apache Commons FileUpload ist er beispielsweise cpe:/a:apache:commons_fileupload:1.0. Mit dem CPE wird die NVD 
Datenbank nach Schwachstellen (CVEs) durchsucht.

# Integration in den Build
Der Dependency Check kann in ein Build Tool integriert oder per CMD Line verwendet werden. Im Folgenden stellen wir die 
[Verwendung mit Maven](https://jeremylong.github.io/DependencyCheck/dependency-check-maven/configuration.html) vor. 
Der CMD Line Client enthält allerdings die gleichen Funktionen.

## Maven Integration
Um den Dependency Check mit Maven zu verwenden muss das Plugin eingebunden und konfiguriert werden.

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

## Setup mit zentraler DB
Per default lädt sich das Maven Plugin die aktuelle NVD DB aus dem Internet und speichert die Daten in einer H2 Datenbank.
Gegen die H2 Datenbank werden dann die gefundenen Versionen auf Sicherheitslücken überprüft. Aus Sicherheitsgründen kann 
es im Unternehmen jedoch vorkommen, dass der CI Server keine Verbindung mit der Außenwelt herstellen darf. Das 
automatisierte herunterladen der NVD DB zum Analyse Zeitpunkt funktioniert dadurch nicht. Um die Analysen trotzdem in 
den Build integrieren zu können gibt es zwei sinnvolle Setup Möglichkeiten.

Das Maven Plugin bietet eine Option, mit der ein Mirror der NVD DB verwendet werden kann. Dazu muss natürlich im Netzwerk
des Unternehmens ein Mirror der NVD DB aufgebaut werden. Ein einfacher Apache Webserver und ein Cron Job reichen dafür
aus. Mit einem [Kommandozeilen-Werkzeug](https://github.com/stevespringett/nist-data-mirror/) können die NVD Daten 
heruntergeladen werden. Das Maven Plugin lädt die NVD Daten dann bei jeder Analyse vom Unternehmens Mirror und der CI 
Server benötigt keine direkte Verbindung zum Internet. Die URL zum Mirror muss mit den Parametern cveUrl12Modified, 
cveUrl20Modified, cveUrl12Base und cveUrl20Base konfiguriert werden.

Die Verwendung des Mirrors hat den Vorteil, dass die NVD Daten weiterhin in eine H2 DB importiert werden. Da die
Datenbank auf dem CI Server In-Memory läuft, wird die Analyse sehr schnell durchgeführt. Insbesondere bei 
Multi-Modul-Projekten wird einige Ausführungszeit im Vergleich zum zweiten Szenario eingespart. 

Das zweite Szenario sieht eine zentrale Datenbank vor. Dazu wird eine SQL Datenbank benötigt (z. B. MariaDB)
die über einen JDBC Treiber angesprochen werden kann. Für die Analyse werden dann zu jeder Abhängigkeit die 
Sicherheitslücken in der entfernten DB nachgeschlagen. Durch Netzwerklatenz und das Setup der DB kann sich die 
Ausführungszeit des OWASP Dependency Check um einige Sekunden bis Minuten verzögern. Dabei kommt es zusätzlich auf den 
Projekt-Umfang an.   

Für die Verwendung einer zentralen DB wird ein Schema benötigt, das mit dem entsprechenden 
[SQL Script](https://github.com/jeremylong/DependencyCheck/tree/master/core/src/main/resources/data) initialisiert wird.
Die OWASP Dependency Check Instanzen, die zur Analyse genutzt werden, müssen mit der Option *autoUpdate* konfiguriert
werden. Dadurch werden die Plugin Instanzen im ReadOnly-Modus gestartet und es gibt keine Probleme mit dem parallelen
Zugriff. Für das Update der DB kann das Maven Plugin oder das 
[OWASP Dependency Check CLI](https://jeremylong.github.io/DependencyCheck/dependency-check-cli/index.html) verwendet
werden.

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
            
            <!-- Einrichtung für die Verbindung mit einer Maria DB -->
            <databaseDriverName>org.mariadb.jdbc.Driver</databaseDriverName>
            <connectionString>jdbc:mariadb://my.mariadb.de/nvddb</connectionString>
            <databaseUser>owasp</databaseUser>
            <databasePassword>owasp-password</databasePassword>
        </configuration>
    </plugin>

Ein noch sehr junges Projekt in dem Zusammenhang ist 
[DependencyCheck Central Database Docker](https://github.com/jeremylong/dependencycheck-central-mysql-docker). Damit 
kann eine zentrale MySQL DB mittels Docker betrieben werden, die bereits fertig konfiguriert ist und einmal täglich
aktualisiert wird.

## Integration in Sonar
Um eine grundlegende Security Awareness zu schaffen und die Einhaltung von Vorgaben zu fördern wird ein Weg benötigt, 
mit dem die gefundenen Schwachstellen sichtbar werden. Das kann beispielsweise durch das Fehlschlagen von Builds erreicht
werden. Das Fehlschlagen des Builds ist allerdings eine sehr absolute Maßnahme und sorgt für wenig Akzeptanz bei den 
Verantwortlichen wenn der Grund ein False-Positive ist.

Das geschicktere Vorgehen ist daher die Integration in den [Sonar Server](https://www.sonarqube.org/). Dazu muss ein 
[Plugin](https://github.com/stevespringett/dependency-check-sonar-plugin)
auf dem Sonar Server installiert werden. Der Scanner, der durch das Plugin hinzugefügt wird, liest den XML Report der bei 
der Durchführung des OWASP Dependency Checks erstellt wurde ein und erzeugt aus den Findings Issues. Die Einstufung nach 
Blocker, Critical usw. erfolgt dabei nach dem Common Vulnerability Scoring System (CVSS). Die entsprechenden 
Schwellwerte können mit den Sonar Properties *sonar.dependencyCheck.severity.critical* und 
*sonar.dependencyCheck.severity.major* überschrieben werden.

## False-Positives ausschließen
Über Sonar können die potentiellen Sicherheitslücken gemonitored und als False-Positive bzw. Won't Fix markiert werden.
Unter der Zuhilfenahme von Quality Gates können Projekte mit neuen Sicherheitslücken optisch hervorgehoben werden und 
das Scheitern von Build kann ebenfalls erreicht werden.

Neben der erwähnten Möglichkeit False-Positives über Sonar auszuschließen, gibt es ebenfalls die Möglichkeit eine 
[XML-Datei zur Konfiguration](https://jeremylong.github.io/DependencyCheck/general/suppression.html) zum Analyse 
Zeitpunkt zu verwenden. Dadurch können insbesondere in umfangreichen Projekten, mit vielen Teil-Projekten bzw. 
Sub-Modulen, die auf dem gleichen Stack basieren, False-Positives effizient ausgeschlossen werden. Die einzelnen 
Teil-Projekte müssen sich dann nicht mit den Problemen des zentralen Technologie-Stacks auseinandersetzen.

# Fazit
Die allgemeine Kritik an den CVE Datenbanken kann im Blog-Post 
[Verwendung von Komponenten mit bekannten Sicherheitslücken](https://www.owasp.org/index.php/Top_10-2017_A9-Using_Components_with_Known_Vulnerabilities)
nachgelesen werden. An dieser Stelle gehe ich daher nur auf die Erkennung von bekannten Schwachstellen mit dem OWASP 
Dependency Plugin ein.

Grundsätzlich bietet das Plugin alle benötigten Funktionen und kann auch in umfangreichen Projekten zum Einsatz kommen.
Es erkennt bekannte Schwachstellen und listet sie verständlich auf. Die False-Positives kommen aus der verwendeten DB
und sind nicht durch Fehler im Plugin begründet. Generell gilt, dass der Einsatz empfohlen werden kann. Der 
Vollständigkeit halber muss erwähnt werden, dass es neben dem OWASP Plugin kommerzielle Werkzeuge gibt, die einen 
größeren Funktionsumfang bereitstellen. Auf diese Werkzeuge wird hier allerdings nicht weiter eingegangen.
