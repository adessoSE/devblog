---
layout: [post, post-xml]              
title:  "Passworthashing - Aber sicher!"        
date:   2021-03-01 11:00              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
author_ids: [tboettinger]                     
categories: [Softwareentwicklung]       
tags: [Security, Kryptographie, Java]      
---

Passwörter dürfen nicht im Klartext in der Datenbank gespeichert werden, daher hashen wir sie, das weiß jede Entwicklerin und jeder Entwickler. 
Die Gefahr, dass der Datenbankinhalt und somit auch Passwörter, die evtl. auch anderswo Verwendung finden, abgegriffen werden, ist einfach zu groß.
Trotzdem finden sich bei konkreten Umsetzungen häufig Fehler, sodass immer wieder Passwort Leaks öffentlich werden, die auf eine unsachgemäße Speicherung von besagten Passwörtern zurückzuführen sind. 
Um nicht selbst ein Eintrag in der Reihe der Passwort Leaks zu werden, soll dieser Blogartikel bei der Wahl des sicheren Hashverfahrens unterstützen sowie Hinweise für die richtige Parametrisierung geben.
Illustriert werden die Beispiele in Java und Spring-Security.

# Hashfunktionen
Um Passwörter in der Datenbank sicher abzuspeichern, brauchen wir eine Lösung, die einen Wert erzeugt, über den immer noch die Korrektheit des Passworts überprüft, aber aus dem das Klartextpasswort nicht zurückgewonnen werden kann. 
Sichere Hashfunktionen bieten eigentlich genau diese Eigenschaften:

* Einwegfunktion: 
Aus dem Ergebnis der Funktion lässt sich nicht mehr auf die Eingabe schließen.
* Kollisionsresistenz: Sind zwei Hashes gleich, so muss der Eingabewert auch gleich sein. 
Für verschiedene Eingaben berechnet eine sichere Hashfunktion also unterschiedliche Ergebnisse.
* (Effizienz): 
Die Überprüfung, ob das Passwort den gleichen Hash ergibt, wie abgespeichert ist, soll schnell gehen. 
Diese Eigenschaft wird uns im Folgenden allerdings Probleme bereiten.

Die Angabe, welche Hashfunktionen als sicher gelten, muss ständig überprüft werden, da mögliche angreifende Personen und Sicherheitsforschende regelmäßig Angriffe auf bekannte Verfahren untersuchen. 
Angriff heißt in diesem Zusammenhang vor allem, dass effizient Kollisionen berechnet werden können oder aus der Ausgabe die assoziierte Eingabe berechnet werden kann. 
So gelten beispielsweise MD5 und SHA-1 nicht mehr als sicher, während SHA-256 und SHA-512 Stand 2020 sicher sind.

Trotzdem ist der Einsatz dieser, als sicher geltenden Hashfunktionen allein keine sichere Technik, um Passwörter zu persistieren.
Es gibt zwei relevante Angriffe auf diese Hashes, die uns Probleme bereiten. 
Der erste Angriff ist die Wörterbuchattacke, auch Rainbow-Table Angriff genannt. 
Dabei werden für die anzugreifende Hashfunktion alle denkbaren Eingaben vorberechnet und in einem Wörterbuch bzw. effizienter in der Rainbow-Table abgespeichert. 
Werden nun die Passworthashes geleakt, können Angreifer in diesem Wörterbuch nachschauen, welches Passwort jeweils verwendet wurde.
Für die bekannten Verfahren gibt es im Netz bereits Wörterbücher, sodass wir nicht einmal ein Wörterbuch erstellen müssen.
Der zweite Angriff ist ein einfacher Brute-Force Angriff, bei dem alle Eingaben durchprobiert werden, ohne vorher eine Datenbank anzulegen.
Möglich macht das die angesprochene Effizienz der klassischen Hashfunktionen und die geringe Entropie, also die Verteilung, von nutzergenerierten Passwörtern. 
Da bspw. GPUs sehr viele Berechnungen parallel ausführen können, können mit einer Hashcat-Implementierungen bis zu 23 Mrd. SHA-256 Hashes pro Sekunde (!) durchprobiert werden.
Wir können uns also vorstellen, dass bei Brute-Forcing der meistverwendeten Passwörter in den meisten Fällen bereits in wenigen Sekunde das passende Klartextpasswort vorliegt.

# Sicheres Passworthashing
Zwei Maßnahmen sollen diese Angriffe nun deutlich erschweren. 
Um das Erstellen von Wörterbüchern für Angreifende unpraktikabel zu machen, wird das Passwort mit einem öffentlichen Zufallswert, dem _Salt_, kombiniert.
Üblich ist es z.B., den Wert an den Passwort-String anzuhängen.
Um einen Wörterbuchangriff durchzuführen, müsste nun für jedes mögliche Salt ein Wörterbuch mit allen möglichen Passwörtern erstellt werden. 
Bei Verwendung eines Salts mit _n_ Bit Länge würden so 2 hoch _n_ mal mehr Wörterbücher benötigt, als ohne Verwendung eines Salts.
Dadurch wird dieser Angriff unpraktikabel.
Die Brute-Force Problematik wird behoben, indem Verfahren verwendet werden, die künstlich verlangsamt werden.
Dadurch wird ein Ausprobieren sehr viel länger dauern und somit nicht mehr effizient durchführbar sein.
Als Richtwert, wie lange das Verfahren dauern soll und kann, gilt dabei, dass eine Anmeldung an einem Backend Server 0,5 - 1 Sekunde benötigen darf.

In den folgenden Abschnitten stelle ich nun drei verschiedene Verfahren vor, die diese Gegenmaßnahmen mitbringen, und veranschauliche sie anhand eines Java-Code-Schnipsels mit dem auf Bouncy-Castle basierenden Spring-Security.

## PBKDF2
Die Passwort-Based Key Derivation Function 2 wurde im Jahr 2000 von den RSA-Laboratories im Rahmen der PKCS#5 Spezifikation veröffentlicht. 
Diese Funktion ermöglicht es uns, aus benutzergenerierten Passwörtern z.B. Schlüssel zu generieren, die für eine symmetrische Verschlüsselung dienen können. 

Sie bietet aber auch die Eigenschaften, die wir für das Passworthashing benötigen.
Um die oben genannten Angriffe zu vereiteln, wird zunächst ein zufälliges Salt generiert.
Dieses Salt wird mit einem Zähler konkateniert, anschließend wird ein Keyed-Hash Message Authentication Code (HMAC) mehrfach auf diesen String angewendet.
Ein HMAC generiert einen Hash, der mit einem Schlüssel authentifiziert ist, d.h. nur mit dem Wissen des Passworts kann der gleiche Hash berechnet werden.
Früher wurde hier SHA-1 als interne Hashfunktion verwendet, heute ist mindestens SHA-256 üblich.
Zusätzlich besitzt die Funktion einen _Iteration Count_. 
Dieser bestimmt, wie oft dieses Verfahren wiederholt wird. 
Je größer dieser wird, umso ressourcenaufwändiger ist die Ausführung und somit werden Brute-Force Angriffe schwieriger, allerdings dauert dann auch die Verifikation beim Login länger.
Die Parametrisierung macht es möglich, diesen Wert je nach Anwendungsfall bei einer Weiterentwicklung der verfügbaren Rechenleistung anzupassen. 
Der Original-RFC 2898 aus dem Jahre 2000 empfahl noch mindestens einen Iteration Count von 1.000, während aktuell das Minimum laut einer National Institute of Standards and Technology (NIST) Guideline von 2016 bei 10.000 liegt. 
Der Defaultwert in Spring-Security liegt sogar bei 185.000 Iterationen. 

In Spring-Security existiert das PBKDF2 seit Version 4.1 und wird folgendermaßen verwendet:
```java
Pbkdf2PasswordEncoder encoder = new Pbkdf2PasswordEncoder();
// erzeuge den Hash
String encoded = encoder.encode("geheim");
// validiere den Hash
boolean isValidPassword = encoder.matches("geheim", encoded);
```
Mit encode() wird im Default ein Hex-String in folgender Form erstellt:

`8d616f6522e36dff7627149c17f77ddc59efacedd22d47ffc95073f9f2159c23f27b1cc959ec7bf4`.

Dieser enthält ein 64 Bit Salt, das jedes Mal automatisch generiert wird, sowie den eigentlichen Hashwert.
Das bedeutet, wir müssen uns keine Gedanken über die Salt-Speicherung mehr machen, da es direkt mitgespeichert wird.

Auf einem Entwicklerlaptop mit einem Intel i9 benötigt die einmalige Ausführung ca. 700 ms, was gut zu unserer Vorbedingung von 0,5 - 1 Sekunde Ausführungszeit passt. 
Brute-Force Angriffe auf das PBKDF2 gibt es vor allem mit spezialisierter Hardware wie GPUs und FPGAs, da die verwendeten Hashfunktionen keinen großen Speicherbedarf haben. 
Das NIST empfiehlt PBKDF2 trotzdem bei Nutzung eines hohen Iteration Counts. 
Verfahren mit höherem Speicherbedarf haben allerdings den Vorteil, dass man sie mit spezialisierter Hardware nicht so einfach brute-forcen kann, da bspw. FPGAs meist nur wenig Speicher besitzen.
Diesen höheren Speicherbedarf hat z.B. Bcrypt.

## Bcrypt
Bcrypt wurde 1999 auf der Usenix Konferenz vorgestellt und wurde explizit für das Passworthashing entwickelt. 
Es nutzt die Blowfish-Verschlüsselung. 
Dies ist ein symmetrisches Verschlüsselungsverfahren mit mehreren Runden. 
Für diese Runden wird jeweils ein neuer Schlüssel abgeleitet. 
Bcrypt nutzt nun aus, dass diese Schlüsselableitung der Rundenschlüssel ressourcenintensiv ist. 
Es verschlüsselt den festen Plaintext "OrpheanBeholderScryDoubt" mit Rundenschlüsseln, die aus dem zu hashenden Passwort und dem Salt abgeleitet werden. 
Das zu hashende Passwort wird dafür vorher mit einem Salt von 128 Bit Länge konkateniert. 
Die Anzahl der Runden wird über einen Parameter _cost_ gesteuert, sodass auch hier auf eine Verbesserung der Rechenkapazität reagiert werden kann. 
Das Verfahren wird dann 2 hoch _cost_ mal wiederholt.
Zusätzlich wurde die Blowfish-Verschlüsselung so angepasst, dass mehr Speicher benötigt wird und Optimierungen auf GPU und FPGAs entsprechend schlechter anwendbar sind, was einen Vorteil gegenüber PBKDF2 darstellt.

Die Parameterempfehlung im Jahre 1999 war ein Wert zwischen 6 und 8, während heute (Stand Ende 2020) der Default-Wert 10 ist und die OWASP Foundation eine Erhöhung auf 12 empfiehlt. 
Diese einfache Parametrisierbarkeit mit klaren Empfehlungen macht Bcrypt zu einem empfehlenswerten und einfach anwendbarem Verfahren. 

Auch in Spring-Security sollte der Working-Faktor standardmäßig erhöht werden. 
Analog zu PBKDF2 wird Bcrypt dort so verwendet:
```java
BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
// erzeuge den Hash
String encoded = encoder.encode("geheim");
// validiere ein Passwort anhand des Hashes
boolean isValidPassword = encoder.matches("geheim", encoded);
```
Der String, den Bcrypt erzeugt, hat allerdings eine etwas andere Form als von PBKDF2 bekannt und sieht so aus:

`$2a$12$7Dj5dRTbzw/9YiaeJnGRrezIw4YcdoD2PTyE22xBIolQonzzPx02u`.

Der String enthält jeweils $-separiert die Version 2a des verwendeten Bcrypts, den verwendeten Working Faktor und danach Base64 kodiert das Salt und den eigentlichen Hash.
Er enthält also alles, um ein Passwort anhand des Hashes verifizieren zu können, und kann auch so in der Datenbank abgelegt werden.

Obwohl die Speichernutzung von 4KB größer ist als bei PBKDF2 ist sie immer noch verhältnismäßig gering.
Ein Nachfolger von Bcrypt nahm an der Password Hashing Competion teil.
Diesen Wettbewerb gewonnen hat allerdings Argon2.

## Argon2
Der Sieger der Password Hashing Competition aus dem Jahre 2015 war Argon2.
Das Verfahren sorgt mit einer größeren Speichernutzung durch die Bildung eines großen internen Vektors dafür, dass Brute-Force Angriffe mit spezialisierter Hardware ein geringeres Optimierungspotenzial haben. 
Intern kommt die Blake2b Hashfunktion zum Einsatz. 
Es gibt verschiedene Versionen von Argon2:
* Argon2d: Der Indexzugriff auf den internen Vektor erfolgt abhängig vom Passwort bzw. Salt und ist somit anfällig für Cache-Timing Side-Channel Angriffe.
Dabei wird anhand der Laufzeit gemessen, welche Einträge des Vektors gecacht werden konnten.
(Anwendungen in Backendservern und Kryptowährungen).
* Argon2i: der Indexzugriff erfolgt unabhängig von dem mitgegebenen Geheimnis und ist dadurch Side-Channel resistent, allerdings besser optimierbar auf spezialisierter Hardware
(Anwendungen z.B. bei Festplattenverschlüsselung).
* Argon2id: Hybride Version aus dem Jahr 2017, die weniger anfällig für Side-Channel Leakage als Argon2d und besser gegen Optimierung durch spezialisierte Hardware geschützt ist als Argon2i.

Alle Varianten bieten drei verschiedene Möglichkeiten zur Parameterisierung: 

* Arbeitsspeicher _m_: der zu nutzende Arbeitsspeicher (in KB)
* Parallelität _p_: Anzahl der parallel nutzbaren Threads
* Iterationen _t_: beeinflusst die Berechnungszeit

Das Originalpaper stellt keine konkrete Empfehlung für diese Parameter vor. 
Alle Parameterwerte sollen so hoch wie möglich gewählt werden. 
 
Die Standardparameter von Argon2id (das einzige Argon2 Verfahren in Spring-Security) sorgen allerdings auf dem Entwicklerlaptop nur für eine Laufzeit von 80 ms.
Daher habe ich den Parameter _t_ so stark erhöht, dass eine Laufzeit von ungefähr 0,5 Sekunden erreicht wird (gewählte Parametrisierung: _m_ = 4096, _p_ = 1, _t_ = 90).
Damit liegt es mit den gewählten Parametern im Mittelfeld, was die Laufzeit angeht (PBKDF2: 700 ms, Bcrypt: 200 ms).
Ein Hinweis noch zu dem Parallelisierungsparameter _p_.
Da die Bouncy-Castle Implementierung die Parallelisierung aktuell nicht ausnutzt, lohnt es sich nicht, diesen Parameter bei Spring-Security hochzusetzen.

Die Verwendung in Spring-Security funktioniert analog zu den anderen beiden Verfahren für ein 32 Byte Hash zusammen mit einem 16 Byte Salt:
```java
Argon2PasswordEncoder encoder = new Argon2PasswordEncoder(16, 32, 1, 4_096, 90);
// Erzeugen den Hash
String encoded = encoder.encode("geheim");
// validiere eine Passwort mithilfe des Hashes
boolean isValidPassword = encoder.matches("geheim", encoded);
```
Der Hash des Passworts beinhaltet, wie bei Bcrypt, die Parameter, das Salt, die Argon2-Version und den Hash an sich:

`
$argon2id$v=19$m=4096,t=90,p=1$AGyqya19qixSfWIXiCNkWg$eqvMYr17qyvvOHeksMc0WNN7jgwphxt0ugiCzbxusVk
`

Den erhöhten Sicherheitslevel erreichen wir durch den größeren Ressourcenaufwand, da Brute-Force Angriffe durch den erhöhten Speicheraufwand erschwert werden. 
Seit 2020 empfiehlt das Bundesamt für Sicherheit in der Informationstechnik (BSI) Argon2id als Passworthashingmechanismus (verweist aber zur Parametrisierung weiter an "Experten").

# Fazit
Mit "einfach mal hashen" ist es bei der Persistierung von Passwörtern nicht getan. 
Brute-Force und Wörterbuchangriffe sind effektive Angriffe gegen diese Hashes. 
Durch den Einsatz eines Salts zusammen mit einer künstlichen Verlangsamung des verwendeten Hashverfahrens lassen sich diese Angriffe vereiteln.
Per Spring-Security lässt sich jedes der drei vorgestellten Verfahren einfach und schnell umsetzen.
Die Implementierungen lösen dabei meistens auch schon die Frage nach der Salt- und Parameterspeicherung. 
Eine zusätzliche Versionierung, z.B. in einer extra Spalte in der der Datenbank, ist allerdings sinnvoll, um veraltete Hashes schneller zu finden.
Zusammenfassend lässt sich zu den Verfahren sagen: 
* PBKDF2 wird aktuell noch vom NIST als sicher genug eingestuft, hat allerdings eine sehr geringe Speichernutzung, die es anfällig für Brute-force Angriffe macht. 
* Bcrypts Parametrisierung ist einfach und relativ sicher.  
* Argon2 ist durch seine anspruchsvolle Parametrisierbarkeit auch im Hinblick auf die Speicherauslastung das aktuell vom BSI empfohlene Verfahren.
