---
layout: [post, post-xml]
title:  "\"Meine Webanwendung ist sicher!\" - sicher?"
date:   2019-08-13 12:00
modified_date: 2019-08-13
author: Flo4l
categories: [Methodik]
tags: [OWASP]
---
Während ich neulich eine Projektarbeit zum Thema Sicherheit von Webanwendungen anfertigte, war ich sehr erstaunt als ich Statistiken zu diesem Thema recherchierte.
Wie hoch schätzt ihr die durchschnittliche Anzahl an Sicherheitslücken pro Anwendung?
Etwa drei, fünf oder gar zehn?
Bei solch einem wichtigem Thema wie der Sicherheit von Anwendungen, Daten und Unternehmen sollte man meinen, dass jenes Thema eine besondere Aufmerksamkeit erfährt.
Schließlich kann eine Panne in der Sicherheit von IT-Systemen sehr schnell sehr großen Schaden mit sich ziehen und daher auch sehr teuer werden.
Tatsächlich enthält die durchschnittliche Webanwendung jedoch stolze 33 Lücken, von denen sechs als kritisch gewertet werden.

Auch geht aus dem [2019 von Positive Technologies veröffentlichten Bericht](https://www.ptsecurity.com/ww-en/analytics/web-application-vulnerabilities-statistics-2019/) hervor, dass neunzehn Prozent der getesteten Anwendung derart gefährdet waren, dass Angreifer die Schwächen hätten nutzen können, um die vollständige Kontrolle über das jeweilige System zu erlangen.

# OWASP
Um dem entgegenzuwirken wurde bereits 2001 das [Open Web Application Secuity Projekt](https://www.owasp.org/index.php/Main_Page) (kurz OWASP) in die Gänge geleitet.
Die Non-Profit-Organisation hat es sich zur Aufgabe gemacht die Sicherheit von Diensten, sowie Anwendungen im World Wide Web zu verbessern und Organisationen in die Lage zu versetzen sichere und vertrauenswürdige Software zu entwickeln und zu betreiben.
Dazu bieten OWASP auf ihrer Seite viele Materialien an, welchen Interessierten die Themen näher bringen und eine reichhaltige Quelle an wertvollen Informationen darstellen.
Von OWASP stammt auch deren berühmte [Aufführung der zehn kritischsten Sicherheitslücken in Webanwendungen](https://www.owasp.org/images/9/90/OWASP_Top_10-2017_de_V1.0.pdf).

Im Folgenden werden wir ein paar der dort beschriebenen Risiken betrachten.

## SQL Injections
Starten wir direkt mit einem der kritischsten Befunde überhaupt.
[SQL Injections](https://www.owasp.org/index.php/SQL_injection)  entstehen, wenn Userinput unbehandelt in ein SQL Statement konkatiniert wird.
Dadurch ist es möglich den Input so zu wählen, dass dieser als funktionaler Code behandelt wird.
Dies kann von Angreifern ausgenutzt werden, um so die Datenbank zu enumerieren, zu manipulieren oder gar die vollständige Kontrolle über ein System zu erlangen.

Man stelle sich vor eine Funktion verwendet folgende Methode, um zu prüfen ob Anmeldedaten einem Nutzer zuzuordnen sind:

```java
public boolean isValidLogin(String username, String password) throws SQLException {
    try (Connection con = dataSource.getConnection(); 
            Statement stmt = con.createStatement()) {
        String sql = "SELECT * FROM USER WHERE username = '" + username 
                        + "' AND password = '" + password + "'";
        ResultSet rs = stmt.executeQuery(sql);
        return rs.next();
    }
}
```
Eine solche Implementierung ist tödlich, wenn sie zur Zugriffskontrolle verwendet wird.
Angenommen ein Nutzer wählt beide Eingaben so:

```a' OR 'b'='b```

Die Resultierende SQL Abfrage würde also lauten:

```sql
SELECT *
FROM USER
WHERE username = 'a' OR 'b'='b'
AND password = 'a' OR 'b'='b'
```

In diesem Fall würde jeder Datensatz selektiert und daher die Funktion `true` zurückliefern.
Die Autorisierung wäre somit umgangen.
Um zu verhindern, dass solche Eingaben Teil des Funktionalen SQL Codes werden, müssen [PreparedStatements](https://docs.oracle.com/javase/7/docs/api/java/sql/PreparedStatement.html) verwendet werden.
Durch sie werden sowohl das auszuführende Statement als auch die dort einzufügenden Variablen an das Datenbankmanagementsystem übergeben, welches die Parameter auch als solche und nicht als Teil des Statements behandelt.
Dieselbe Methode würde unter Verwendung von PreparedStatements also so aussehen:

```java
public boolean isValidLogin(String username, String password) throws SQLException {
    String sql = "SELECT * FROM USER WHERE username = ? AND password = ?";
    try (Connection con = DatabaseService.getDataSource().getConnection(); 
            PreparedStatement stmt = con.prepareStatement(sql)) {
        stmt.setString(1, username);
        stmt.setString(2, password);
        ResultSet rs = stmt.executeQuery();
        return rs.next();
    }
}
```

## Sensitive Data Exposure
Die überwiegende Mehrheit aller Anwendungen verarbeiten sensible Nutzerdaten.
Viele von Ihnen schützen diese Informationen nicht ausreichend.
Am häufigsten werden Daten durch eine fehlende oder nicht ausreichend konfigurierte Verschlüsselung gefährdet.
So besteht für Angreifer die Möglichkeit bei fehlender Verschlüsselung den Datenverkehr des Opfers über sich umzuleiten und über einen [Man-in-the-Middle-Angriff](https://de.wikipedia.org/wiki/Man-in-the-middle-Angriff) mitzulesen oder zu manipulieren.
Glücklicherweise ist heutzutage so ziemlich jede Website über [HTTPS](https://de.wikipedia.org/wiki/Hypertext_Transfer_Protocol_Secure) verschlüsselt.
Jedoch gibt es für Angreifer bei fehlender Implementierung von [HTTP Strict Transport Security](https://en.wikipedia.org/wiki/HTTP_Strict_Transport_Security) die Möglichkeit diese zu umgehen und die Daten dennoch mitzulesen.
Ferner sollte man sich darüber im Klaren sein wie es um die Sicherheit der in Projekten eingesetzten Hashing- oder Verschlüsselungsalgorithmen steht.
So werden beispielsweise Algorithmen wie DES, Triple-DES, RSA mit einer Schlüssellänge unter 1024 Bit sowie MD5 und SHA-1 [vom BSI als unsicher bezeichnet](https://www.bsi.bund.de/DE/Themen/ITGrundschutz/ITGrundschutzKataloge/Inhalt/_content/g/g04/g04035.html).

## Broken Authentication
Dass Passwörter so gewählt werden sollten, dass sie nicht einfach zu erraten sind ist den meisten wohl bekannt.
Oft verwenden Anwendungen beim Anlegen eines neuen Accounts daher auch den lobenswerten Ansatz einer Prüfung der Passwortstärke, um Nutzer nicht ins offene Messer laufen zu lassen.
Doch ein mindestens genauso guter anderer Ansatz ist es Angreifern erst gar nicht die Möglichkeit zu überlassen korrekte Kombinationen von Username und Passwort zu erraten ([Credential stuffing](https://www.owasp.org/index.php/Credential_stuffing)).
Schließlich sind fehlende Restriktionen mit 28% in dieser Kategorie die häufigste vorkommende Schwachstelle.
Gefolgt werden sie in der Statistik mit 22% von gehardcodeten Passwörtern.
So bietet es sich an die Anzahl der möglichen Anmeldeversuche zu begrenzen oder eine Verzögerung bei der Anmeldung einzusetzen.
Sofern es möglich ist sollte auch eine Mehrfaktor-Authentisierung in Betracht gezogen werden, da diese die Sicherheit maßgeblich erhöht.

## Cross-Site-Scripting
Mit einem 77 prozentigem Vorkommen sind [Cross-Site-Scriptings](https://www.owasp.org/index.php/Cross-site_Scripting_(XSS)) (kurz XSS) in Webanwendungen sehr häufig verbreitet.
Das Prinzip dieser ist es, dass Input nicht escaped oder überprüft wird, bevor er auf eine Seite geladen wird.
Dabei wird zwischen 3 Arten unterschieden, auf welche der Input auf die Seite gelangt.
Zum einen besteht die Möglichkeit, dass dieser über Request-Parameter auf die Seite reflektiert wird.
Eine andere Möglichkeit besteht darin, dass Input über ein Script auf die Seite geladen wird ohne sie neu zu laden.
Die aber wohl kritischste dieser Arten ist die persistierende Fassung.
Bei ihr kommt der Input aus einer angebundenen Datenquelle, wie beispielsweise einer relationalen Datenbank.
Ein einfaches Beispiel dafür ist der Inhalt eines Nutzerbeitrags.
Sollte die Seite anfällig gegenüber XSS sein ist es Angreifern möglich ihren eigenen HTML oder JavaScript Code auf die fremde Seite zu laden.
So können sensible Nutzerdaten ausgespäht, eigene Inhalte geladen oder gar die Systeme der Nutzer kompromittiert werden.

# Schwachstellenanalyse
Wenn ihr euch nun fragt wie es um die Sicherheit eurer bisher Entwickelten Anwendungen besteht gibt es neben einer Manuellen Analyse selbstverständlich auch einige tolle Tools, die euch auf so manche Anfälligkeit hinweisen.
So gibt es beispielsweise den Schwachstellenscanner [Arachni](https://www.arachni-scanner.com/).
Dieser testet Anwendungen im laufenden Betrieb auf verschiedenste Arten von [Code Injections](https://www.owasp.org/index.php/Code_Injection), Cross-Site-Scriptings, [Remote file inclusions](http://projects.webappsec.org/w/page/13246955/Remote%20File%20Inclusion), unsichere Cookies und viele weitere Perimeter.
Eine anderes, praktisches Tool ist der [SonarQube](https://www.sonarqube.org/).
Dieser führt statische Code Analysen durch und zeigt nicht nur mögliche Schwachstellen auf, sondern gibt auch Hinweise zur Verbesserung der allgemeinen Code Qualität.
Zwar ersetzen diese Tools keine menschlichen Experten, aber können sehr praktisch und euch eine tolle Hilfestellung sein.
Gerade wer bisher nicht so viel mit dem Security Thema in Berührung gekommen ist kann so gut erste Erfahrungen sammeln, da man gezeigt bekommt an welcher Stelle einer Anwendung es zu welchen Komplikationen kommen kann.

# Fazit
Obwohl heutzutage bekannter denn je ist welch große Rolle die Sicherheit von Anwendungen in einer Welt spielt, die dabei ist sich in den unterschiedlichsten Bereichen immer weiter zu digitalisieren, sind doch erschreckend viele Sicherheitslücken aufzufinden.
Da diese oftmals recht bekannt sind und im Gegensatz zu hochkomplizierten Exploits ein vertretbares Maß an Expertise erfordern sollten Entwickler gerade hier nicht an Ressourcen sparen.
Durch den Einsatz moderner Frameworks werden erfreulicherweise einige Angriffe von vornherein vereitelt.
Man sollte sich aber dennoch darüber im Klaren sein was genau einem das Framework abnimmt und ob es überhaupt korrekt konfiguriert ist, anstatt sich der Bequemlichkeit völlig hinzugeben.
Sich darüber bewusst zu werden an welchen Stellen Angreifer ansetzen können und wie der sichere Umgang mit ihnen aussieht ist der effektivste Weg zu einer resistenteren Anwendung.
