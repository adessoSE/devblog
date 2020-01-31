---
layout: [post, post-xml]
title:  "\"Meine Webanwendung ist sicher!\" - sicher?"
date:   2019-08-13 12:00
modified_date: 2019-08-13
author: Flo4l
categories: [Softwareentwicklung, Java]
tags: [Security, OWASP]
---
Bei einem solch wichtigem Thema wie der Sicherheit von Webanwendungen, Daten und Unternehmen sollte man meinen, dass jenes Thema eine besondere Aufmerksamkeit erfährt.
Schließlich kann eine Panne in der Sicherheit von IT-Systemen sehr schnell sehr großen Schaden mit sich ziehen und daher auch sehr teuer werden.
Tatsächlich enthält die durchschnittliche Webanwendung jedoch stolze 33 Lücken von denen sechs als kritisch gewertet werden.

In diesem Artikel werden wir uns ein paar der verbreitesten Sicherheitslücken ansehen. Dabei werden wir auch einen kleinen Blick auf damit in Zusammenhang stehenden SQL und Java Code werfern.

Aus dem 2019 von Positive Technologies veröffentlichten [Bericht](https://www.ptsecurity.com/ww-en/analytics/web-application-vulnerabilities-statistics-2019/) zum Thema Schwachstellen von Webanwendungen geht ebenfalls hervor, dass 19% der getesteten Anwendungen derart gefährdet waren, dass Angreifer die vollständige Kontrolle über das jeweilige System hätten erlangen können.

# OWASP
Um dem entgegenzuwirken wurde 2001 das [Open Web Application Security Project](https://www.owasp.org/index.php/Main_Page) (kurz OWASP) gegründet.
Das Ziel der Non-Profit-Organisation ist Sicherheit im Internet zu fördern indem Wissen verbreitet wird.
Dazu bietet OWASP viele Materialien an, die eine reichhaltige Quelle an wertvollen Informationen darstellen.
OWASP ist zudem Verfasser der verbreiteten [Aufführung der zehn kritischsten Sicherheitslücken in Webanwendungen](https://www.owasp.org/images/9/90/OWASP_Top_10-2017_de_V1.0.pdf).

Im Folgenden werden wir ein paar der dort beschriebenen Schwachtellen betrachten.

## SQL Injections

[SQL Injections](https://www.owasp.org/index.php/SQL_injection) zählen zu den kritischsten Sicherheitsproblemen. Sie entstehen wenn Nutzereingaben ungeprüft in SQL Statements eingesetzt werden.
Dies kann von Angreifern ausgenutzt werden, um die Datenbank auszulesen, zu manipulieren oder gar die vollständige Kontrolle über ein System zu erlangen.

Man stelle sich eine Methode vor die prüft ob Anmeldedaten einem Nutzer zugeordnet sind:

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
Zweck der Funktion ist es einen User zu finden, auf welchen sowohl der Username, als auch das Passwort passen.
Wenn ein Datensatz zurückgegeben wird, stimmen die Daten mit denen des Users überein und die Funktion liefert `true` zurück.

Eine solche Implementierung ist jedoch geschäftsgefährdent, wenn sie in einer öffentlich erreichbaren Anwendung verwendet wird.
Wenn wir den Code genauer betrachten sehen wir, dass an dieser Stelle das auszuführende SQL-Statement zusammengesetzt wird:

```java
String sql = "SELECT * FROM USER WHERE username = '" + username 
                        + "' AND password = '" + password + "'";
```

Angenommen ein Nutzer trägt `a' OR 'b'='b` in beide Eingabefelder ein, sieht die Resultierende SQL Abfrage wie folgt aus.

```sql
SELECT *
FROM USER
WHERE username = 'a' OR 'b'='b'
AND password = 'a' OR 'b'='b'
```

In diesem Fall würden die Eingaben das SQL Statement so abändern, dass eigener SQL Code ausgeführt wird.
Da `'b' = 'b'` wahr ist, wäre die Bedingung somit immer erfüllt.
Die Autorisierung wird somit umgangen, da die Menge aller legitimer Nutzer zurückgereicht wird.

Um zu verhindern, dass solche Eingaben Teil des funktionalen SQL Codes werden, müssen [PreparedStatements](https://docs.oracle.com/javase/7/docs/api/java/sql/PreparedStatement.html) verwendet werden.
Durch sie werden das auszuführende SQL-Statement als auch die dort einzufügenden Variablen separat an das Datenbankmanagementsystem übergeben.
Die vorherige Methode würde unter Verwendung von PreparedStatements so aussehen:

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

An den Stellen an denen zuvor die Eingaben eingefügt wurden, stehen nun Fragezeichen.
Diese zeigen dem Datenbankmanagementsystem an welchen Stellen die Werte eingefügt werden sollen.

```java
String sql = "SELECT * FROM USER WHERE username = ? AND password = ?";
```

Um nun Werte zu übergeben, lassen sich die Set-Methoden des PreparedStatement-Objekts nutzen. Diesen übergeben wir erst den Index, an welchen der Wert gesetzt werden soll und anschließend den Wert selbst.
Dabei müssen wir unbedingt beachten, dass der Index bei `1` anfängt!

```java
stmt.setString(1, username);
stmt.setString(2, password);
```

## Sensitive Data Exposure
Die überwiegende Mehrheit aller Anwendungen verarbeitet sensible Nutzerdaten.
Viele von Ihnen schützen diese Informationen nicht ausreichend.
Am häufigsten werden Daten durch eine fehlende oder nicht ausreichend konfigurierte Verschlüsselung gefährdet.
So besteht für Angreifer die Möglichkeit den Datenverkehr eines Opfers mittels eines [Man-in-the-Middle-Angriffs](https://www.owasp.org/index.php/Man-in-the-middle_attack) über sich umzuleiten und bei fehlender Verschlüsselung mitzulesen oder zu manipulieren.
Glücklicherweise unterstützt heutzutage so ziemlich jede Website [HTTPS](https://tools.ietf.org/html/rfc2818), wodurch die Kommunikation zu solchen Seiten über [TLS](https://tools.ietf.org/html/rfc5246) verschlüsselt wird.
Jedoch gibt es für Angreifer bei fehlender Implementierung von [HTTP Strict Transport Security](https://tools.ietf.org/html/rfc6797) die Möglichkeit diese zu umgehen und die Daten trotzdem mitzulesen.

Zudem sollte man sich darüber im Klaren sein welche Hashing- oder Verschlüsselungsalgorithmen in den eigenen Projekten zum Einsatz kommen.
So werden beispielsweise Algorithmen wie DES, Triple-DES, RSA mit einer Schlüssellänge unter 1024 Bit sowie MD5 und SHA-1 [vom BSI als unsicher bezeichnet](https://www.bsi.bund.de/DE/Themen/ITGrundschutz/ITGrundschutzKataloge/Inhalt/_content/g/g04/g04035.html).

## Broken Authentication
Als [Broken Authentication](https://www.owasp.org/index.php/Top_10-2017_A2-Broken_Authentication) werden alle möglichen Schwächen bezeichnet, die es Angreifern einfacher machen sich unerlaubt an einem System anzumelden.
Bedingt durch schwache Passwörter, kann die Angreifbarkeit der Anwendung auch auf Nutzer selbst zurückzuführen sein.
Oft verwenden Anwendungen beim Anlegen eines neuen Accounts daher auch den lobenswerten Ansatz einer Prüfung der Passwortstärke, um Nutzer nicht ins offene Messer laufen zu lassen.
Doch ein mindestens genauso guter anderer Ansatz ist es Angreifern erst gar nicht die Möglichkeit zu überlassen korrekte Kombinationen von Username und Passwort zu erraten ([Credential stuffing](https://www.owasp.org/index.php/Credential_stuffing)).
Schließlich sind fehlende Restriktionen mit 28% in dieser Kategorie die häufigste vorkommende Schwachstelle.
Gefolgt werden sie in der Statistik mit 22% von fest einprogrammierten Passwörtern.
So bietet es sich an die Anzahl der möglichen Anmeldeversuche zu begrenzen oder eine Verzögerung bei der Anmeldung einzusetzen.
Sofern es möglich ist sollte auch eine Mehrfaktor-Authentisierung in Betracht gezogen werden, da diese die Sicherheit maßgeblich erhöht.

## Cross-Site-Scripting
Mit 77% Vorkommen ist das [Cross-Site-Scripting](https://www.owasp.org/index.php/Cross-site_Scripting_(XSS)) (kurz XSS) ein weit verbreitetes Risiko in Webanwendungen.
Durch sie können Angreifer ihren eigenen HTML, CSS oder JavaScript Code in eine Fremde Webseite einbetten.
Damit lassen sich in der Regel zwar keine Systeme übernehmen, jedoch können so Accountzugänge oder andere sensible Informationen gestohlen werden.

Das Prinzip dieser ist es, dass Eingaben nicht oder überprüft oder unschädlich gemacht werden, bevor sie auf eine Seite geladen werden.
Cross-Site-Scripting-Angriffe lassen sich grob in zwei Arten einteilen.
Zum einen besteht die Möglichkeit, dass Eingaben über Request-Parameter direkt auf die Seite reflektiert werden. So könnte bei einer Suche beispielsweise erläutert werden, wonach gesucht wurde:

![Reflected XSS - Angreifbare Seite](/assets/images/posts/Meine-App-ist-sicher-sicher/reflected_xss_1.png)

Sollte diese Eingabe nicht abgesichert werden, könnten wir an dieser Stelle unser eigenes Skript einsetzen.

![Reflected XSS - Eigenes Skript wird ausgeführt](/assets/images/posts/Meine-App-ist-sicher-sicher/reflected_xss_2.png)

Angreifer könnten dies nutzen um gezielt Links mit vorgegebenen GET Parametern an ihre Opfer zu senden. Zudem könnten sie die Linkse vorher über URL Shortener verkürzen um die Parameter zu verschleiern.

Kritischer ist jedoch die persistierende Fassung.
Bei ihr kommen die Einagen aus einer angebundenen Datenquelle, wie beispielsweise einer Datenbank.
Ein einfaches Beispiel dafür ist der Inhalt eines Nutzerbeitrags auf einer Social-Media Seite.
So könnte ein Nutzer ein Skript in seinem Beitrag unterbringen.
Dieser würde im schlechtesten Fall unüberprüft gespeichert und bei anderen Nutzern ungeprüft im Feed geladen werden.
So würde das Skript vom Browser des Opfers beim Laden des infizierten Beitrags ohne dessen wissen ausgeführt werden.
Im Gegensatz zu den anderen Fassungen, bei denen die Angriffe eher gezielt erfolgen, wird hier potentiell eine größere Menge von Nutzern betroffen.

# Schwachstellenanalyse der eigenen Anwendung
Wollt ihr die Sicherheit eurer eigenen Anwendungen untersuchen, gibt es neben der manuellen Analyse selbstverständlich auch Tools, die euch dabei unterstützen.
Besispielsweise testet [Arachni](https://www.arachni-scanner.com/) Anwendungen im laufenden Betrieb auf [Code Injections](https://www.owasp.org/index.php/Code_Injection), Cross-Site-Scriptings und viele weitere Probleme.

Der [SonarQube](https://www.sonarqube.org/) führt statische Code Analysen durch und zeigt neben Hinweisen zur Verbesserung der allgemeinen Code Qualität zudem mögliche Schwachstellen im Code auf.
Auch wenn diese Tools keine menschlichen Experten ersetzen, bieten sie eine tolle Hilfestellung zur Vermeidung von bekannten Lücken.

Neben diesen beiden Tools besteht die Möglichkeit in einem professionellen Rahmen properitäre Software zur Schwachstellenanalyse zu verwenden.
So verwenden wir bei adesso beispielsweise den [Xanitizer](https://www.rigs-it.com/xanitizer/).
Dieser testet sowohl den Quellcode einer Java Webanwendung als auch eine aktive Instanz dieser Anwendung.
Im Gegensatz zu den meisten anderen Tools auf diesem Gebiet ist der Xanitizer genauer, da er eine erheblich geringere Menge an False Positives auführt.

# Fazit
Obwohl bekannt ist welch große Rolle die Sicherheit von Anwendungen in einer Welt spielt, die dabei ist sich in den unterschiedlichsten Bereichen immer weiter zu digitalisieren, sind jedoch im Durchschnitt erschreckend viele Sicherheitslücken in ihnen aufzufinden.

Da diese oftmals recht bekannt sind und im Gegensatz zu hochkomplizierten Exploits ein vertretbares Maß an Expertise erfordern, sollten Entwickler gerade hier nicht an Ressourcen sparen.
Besonders der Einsatz moderner Frameworks ermöglicht Entwicklern viele Angriffe frühzeitig zu vermeiden.
Trotz gegebener Bequemlichkeiten gilt selbstständiges Denken hier stets als höchste Tugend.
Sich bewusst zu werden an welchen Stellen Angreifer ansetzen können, ist der erste Schritt zu einer sichereren Anwendung.
