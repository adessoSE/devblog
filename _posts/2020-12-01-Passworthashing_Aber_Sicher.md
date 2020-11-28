---
layout: [post, post-xml]              
title:  "Passworthashing - Aber sicher!"        
date:   2020-12-01 09:00              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
author: tboettinger                     
categories: [Inside adesso]       
tags: [Security, Kryptographie]      
---

Passwörter dürfen nicht im Klartext in der Datenbank gespeichert werden, daher hashen wir sie, das weiß jeder Entwickler. 
Die Gefahr, dass der Datenbankinhalt abgegriffen wird und so an Klartextpasswörter, die evtl. auch in anderen Onlinediensten Verwendung finden, gekommen werden, kann ist einfach zu groß.
Trotzdem findesn sich bei konkreten Umsetzung häufig Fehler, sodass immer wieder Passwort Leaks öffentlich werden, die auf eine unsachgemäße Speicherung von besagten Passwörtern zurückzuführen sind. 
Aus der Vergangenheit gibt es einige prominente Bespiele wie Dropbox in 2012, LinkedIn 2016 oder dem Farmville Macher Zynga 2019, deren Nutzerdaten samt schwacher Passworthashes veröffentlicht wurden. 
Selbst in diesem Jahr sind unter anderem einige geleakte Datensätze veröffentlicht worden, deren Passwörter nicht sicher per MD5 gespeichert wurden.
Um nicht selbst ein Eintrag in dieser Liste zu werden soll dieser Blogartikel bei der Wahl des sicheren Verfahrens unterstützen, sowie Hinweise für die richtige Parametrisierung geben.
Illustriert werden die Beispiele in Java mithilfe von Spring-Security.

# Hashfunktionen
Um Passwörter in der Datenbank sicher abzuspeichern brauchen wir eine Lösung, die einen Wert erzeugt, über den immer noch die Korrektheit des Passworts überprüft, aber aus dem das Klartextpasswort nicht zurückgewonnen werden kann. 
Sichere Hashfunktionen bieten eigentlich genau diese Eigenschaften:

* Einwegfunktion: 
Aus dem Ergebnis der Funktion lässt sich nicht mehr auf die Eingabe schließen.

* Kollisionsresistenz: 
Sind zwei Hashes gleich so muss der Eingabewert auch gleich sein oder andersherum, für verschiedene Eingaben berechnet eine sichere Hashfunktion unterschiedliche Ergebnisse.

* (Effizienz): 
Die Überprüfung, ob das Passwort den gleichen Hash ergibt wie abgespeichert, soll schnell gehen. 
Diese Eigenschaft wird uns im Folgenden allerdings Probleme bereiten.

Die Angabe, welche Hashfunktionen als sicher gelten, muss ständig überprüft werden, da mögliche Angreifer und Sicherheitsforscher regelmäßig Angriffe auf bekannte Verfahren untersuchen. 
Angriff heißt in diesem Zusammenhang vor allem, dass effizient Kollisionen berechnet werden können oder aus der Ausgabe die assoziierte Eingabe berechnet werden können. 
So gelten beispielsweise MD5 und SHA-1 nicht mehr als sicher, während SHA-256 und SHA-512 Stand 2020 sicher sind.

Trotzdem ist der Einsatz dieser, als sicher geltenden Hashfunktionen, allein keine sichere Technik, um Passwörter zu persistieren.
Es gibt zwei relevante Angriffe auf diese Hashes. 
Der erste Angriff ist die Wörterbuchattacke oder auch der sogenannte Rainbow-Table Angriff. 
Dabei wird für die anzugreifende Hashfunktion alle denkbaren Eingaben vorberechnet und in einem Wörterbuch bzw. effizienter in der namensgebenden Rainbow-Table abgespeichert. 
Werden nun die Hashes geleakt, kann man in diesem Wörterbuch nachschauen, welches Passwort jeweils verwendet wurde.
Der zweite Angriff ist ein einfacher Brute-Force Angriff bei dem einfach alle Eingaben durchprobiert werden.
Möglich machte das die angesprochene Effizienz der gezeigten Hashfunktionen und die geringe Entropie, also die Verteilung, von nutzergenerierten Passwörtern. 
Mit Unterstützung von spezialisierter Hardware wie GPUs gibt es z.B. Hashcat-Implementierungen, die 23 Mrd. SHA-256 Hashes pro Sekunde durchprobieren können. 
Man kann sich also vorstellen, dass, bei Brute-Forcing der meistverwendeten Passwörter, in den meisten Fällen bereits in einer Sekunde das Ergebnis da ist.

# Sicheres Passworthashing
Zwei Maßnahmen sollen diese Angriffe deutlich erschweren. 
Um das Erstellen von Wörterbüchern für Angreifer unpraktikabel zu machen, wird das Passwort mit einem öffentlichen Zufallswert, dem Salt, kombiniert.
Üblich ist es z.B. den Wert einfach an den Passwort-String anzuhängen.
Um einen Wörterbuchangriff durchzuführen, müsste es nun für jedes mögliche Salt jeweils ein Wörterbuch mit allen möglichen Passwörtern erstellt werden. 
Bei Verwendung eines Salts mit _n_-Bit Länge würden so 2 hoch _n_ verschiedene Wörterbücher benötigt.
Dadurch wird dieser Angriff unpraktikabel.
Die Brute-Force Problematik wird behoben, indem Verfahren verwendet werden, die künstlich verlangsamt werden, wodurch ein Ausprobieren sehr viel länger dauert aund ihrerseits nicht mehr effizient durchführbar ist.
Eine Anmeldung an einem Backend Server soll dabei 0,5 - 1 Sekunde dauern.

In den folgenden Abschnitten stelle ich nun drei verschiedene Verfahren vor, die diese Gegenmaßnahmen mitbringen und veranschauliche sie anhand einer Java-Implementierung mit dem auf Bouncy-Castle basierenden Spring-Security.

## PBKDF2
Die Passwort-Based Key Derivation Function 2 wurde im Jahr 2000 von den RSA-Laboratories im Rahmen der PKCS#5 Spezifikation veröffentlicht. 
Diese Funktion ermöglicht es uns aus benutzergenerierten Passwörtern z.B. Schlüssel zu generieren, die für eine symmetrische Verschlüsselung dienen können. 
Nutzergenerierte Passwörter direkt zu verwenden, birgt Risiken, da die Verteilung dieser nicht sehr groß ist. 

Sie bietet aber auch die Eigenschaften, die wir für das Passworthashing benötigen.
Um die obengenannten Angriffe zu vereiteln wird zunächst ein zufälliger Salt generiert und auf einen Zähler wird zusammen mit dem Salt ein HMAC (Keyed-Hash Message Authentication Code) mehrfach angewendet. 
Ein HMAC generiert einen Hash, der mit einem Schlüssel authentifiziert ist, d.h. nur mit dem Wissen des Passworts kann der gleiche Hash berechnet werden.
Früher wurde hier SHA-1 als interne Hashfunktion verwendet, heute ist mindestens SHA-256 üblich.
Zusätzlich besitzt die Funktion einen _Iteration Count_. 
Dieser bestimmt, wie oft dieses Verfahren wiederholt wird. 
Je größer dieser wird, umso ressourcenaufwändiger ist die Ausführung und somit werden Brute-Force Angriffe schwieriger. 
Je größer der _Iteration Count_ umso aufwändiger ist auch die Verifikation eines Passworts bei jeder Anmeldung. 
Die Parametrisierung macht es möglich diesen Wert je nach Anwendungsfall, aber auch bei einer Weiterentwicklung der verfügbaren Rechenleistung für Angreifer diesen Wert anzupassen. 
Der Original-RFC 2898 aus dem Jahre 2000 empfahl noch mindestens einen _Iteration Count_ von 1.000 während aktuell das Minimum laut einer NIST Guideline von 2016 bei 10.000 liegt. 
Der Defaultwert in Spring-Security liegt sogar bei 185.000 Iterationen. 

In Spring-Security existiert das PBKDF2 seit Version 4.1 und wird folgendermaßen verwendet:
```java
Pbkdf2PasswordEncoder encoder = new Pbkdf2PasswordEncoder();
// erzeuge den Hash
String encoded = encoder.encode("geheim");
// validiere den Hash
assert encoder.matches("geheim", encoded);
```
Dabei erzeugt es mit encode() im Default einen einen Hex-String in der Form 

`8d616f6522e36dff7627149c17f77ddc59efacedd22d47ffc95073f9f2159c23f27b1cc959ec7bf4`.

Dieser enthält einen Hex-codiert einen 64-Bit Salt, der automatisch jedes Mal generiert wird, sowie den eigentlichen Hash.
Brute-Force Angriffe auf das PBKDF2 gibt es vor allem mit spezialisierter Hardware wie GPUs und FPGAs, da die verwendeten Hashfunktionen keinen großen Speicherbedarf haben. 
Das National Institute of Standards and Technology empfiehlt PBKDF2 trotzdem bei Nutzung eines hohen Iteration Counts. 
Gerade im Bereich von Speichernutzung und Konfigurierbarkeit gibt es allerdings bessere Verfahren. 
Diesen höheren Speicherbedarf hat z.B. Bcrypt.

## Bcrypt
Bcrypt wurde 1999 auf der Usenix Konferenz vorgestellt und wurde explizit für das Passworthashing entwickelt. Es nutzt die Blowfish-Verschlüsselung. 
Dies ist ein symmetrisches Verschlüsselungsverfahren mit mehreren Runden. 
Für diese Runden wird jeweils ein neuer Schlüssel abgeleitet. 
Bcrypt nutzt nun aus, dass diese Schlüsselableitung der Rundenschlüssel ressourcenintensiv ist. 
Es verschlüsselt einen festen Plaintext „OrpheanBeholderScryDoubt“ mit Rundenschlüsseln, die aus dem zu hashenden Passwort abgeleitet werden. 
Das zu hashende Passwort wird dafür vorher mit einem Salt von 128-Bit Länge konkateniert. 
Die Anzahl der Runden wird über einen Parameter _cost_ gesteuert, sodass auch hier auf eine Verbesserung der Rechenkapazität reagiert werden kann. 
Das Verfahren wird dann 2 hoch _cost_ mal wiederholt. 
Zusätzlich wurde die Blowfish-Verschlüsselung so angepasst, dass mehr Speicher benötigt wird und Optimierungen auf GPU und FPGAs schlechter anwendbar sind, was einen Vorteil gegenüber PBKDF2 darstellt.

Die Parameterempfehlung im Jahre 1999 war ein Wert zwischen 6 und 8, während heute (Stand Ende 2020) der Default-Wert 10 ist und die OWASP Foundation eine Erhöhung auf 12 empfiehlt. 
Diese einfache Parametrisierbarkeit macht Bcrypt zu einem empfehlenswerten und einfach anwendbaren Verfahren. 

Auch in Spring-Security sollte der Working-Faktor standardmäßig erhöht werden. 
Analog zu PBKDF2 wird Bcrypt dort so verwendet:
```java
BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
// erzeuge den Hash
String encoded = encoder.encode(secret);
// validiere ein Passwort anhand des Hashes
assert encoder.matches("geheim", encoded);
```
Der String den das Bcrypt erzeugt hat allerdings eine etwas andere Form als von PBKDF2 bekannt und sieht so aus:

`
$2a$12$7Dj5dRTbzw/9YiaeJnGRrezIw4YcdoD2PTyE22xBIolQonzzPx02u
`.

Der String enthält jeweils $-separiert die Version 2a des verwendeten Bcrypt, den verwendeten Working Faktor und danach Base64 kodiert den Salt und den eigentlichen Hash.
Er enthält also alles, um ein Passwort auf anhand des Hashes verifizieren zu können und kann auch so in der Datenbank abgelegt werden.

Obwohl die Speichernutzung von 4KB größer ist als bei PBKDF2 ist sie immer noch verhältnismäßig gering.
Eine potentiell größere Speichernutzung, sowie anspruchsvollere Parametrisierung und damit einhergehenden größeren Mächtigkeit bieten die Verfahren basierend auf Argon2.

## Argon2
Als Sieger der Password Hashing Competition von 2015 ging Argon2 hervor. Das Verfahren sorgt mit einer größeren Speichernutzung durch die Bildung eines großen internen Vektors dafür, dass durch spezialisierte Hardware kein Vorteil für Brute-Force Angriffen mehr besteht. Intern kommt die Blake2b Hashfunktion zum Einsatz. Es gibt verschiedene Versionen von Argon2:
* Argon2d: Der Indexzugriff auf den internen Vektor erfolgt abhängig vom Passwort und Salt und so anfällig für Cache-Timing Side-Channel Angriffe. 
(Anwendungen in Backendservern und Kryptowährungen).
* Argon2i: der Indexzugriff erfolgt unabhängig von dem eingegebenen Geheimnis und ist dadurch Side-Channel resistent, allerdings besser optimierbar auf spezialisierter Hardware
(Anwendungen z.B. bei Festplattenverschlüsselung).
* Argon2id: Hybride Version aus dem Jahr 2017, die weniger anfällig für Side-Channel Leakage als Argon2d ist und besser geschützt gegen Optimierung durch spezialisierte Hardware ist als Argon2i.

Parametrisieren lassen sich alle Varianten in drei verschiedene Ausprägungen. 

* Arbeitsspeicher _m_: der zu nutzende Arbeitsspeicher (in KB)
* Parallelität _p_: Anzahl der parallel nutzbaren Threads
* Iterationen _t_: beeinflusst die Berechnungszeit

Das Originalpaper stellt keine konkrete Empfehlung für Parameter vor. 
Alle Parameterwerte sollen so hoch wie möglich gewählt werden. 
 
Die Standardparameter von Argon2id (das einzige Argon2 Verfahren in Spring-Security) sorgen allerdings auf meinem Entwicklerlaptop nur für eine Laufzeit von 80 ms.
Daher habe ich den Paramter _t_ so stark erhöht, dass ca. 0,5 Sekunden Laufzeit erreicht wird (gewählte Parametrisierung: _m_ = 4096, _p_ = 2, _t_=90).
Damit liegt es mit den gewählten Parametern im Mittelfeld, was die Laufzeit angeht (PBKDF2: 600 ms, Bcrypt: 200 ms).

Die Verwendung in Spring-Security funktioniert analog zu den anderen beiden Verfahren für ein 32 byte Hash zusammen mit einem 16 Byte Salt:
```java
Argon2PasswordEncoder encoder = new Argon2PasswordEncoder(16, 32, 1, 4_096, 90);
// Erzeugen den Hash
String encoded = encoder.encode(secret);
// validiere eine Passwort mithilfe des Hashes
assert encoder.matches("geheim", encoded);
```
Der Hash des Passwort beinhaltet wie bei Bcrypt die Parameter, sowie den Salt, die Argon2-Version und den Hash an sich:

`
$argon2id$v=19$m=4096,t=90,p=2$AGyqya19qixSfWIXiCNkWg$eqvMYr17qyvvOHeksMc0WNN7jgwphxt0ugiCzbxusVk
`

Den erhöhten Sicherheitslevel erreichen wir durch den größeren Ressourcenaufwand, da Brute-Force Angriffe durch den erhöhten Speicheraufwand erschwert werden. 
Seit 2020 empfiehlt das Bundesamt für Sicherheit in der Informationstechnik (BSI) Argon2id als Passworthashingmechanismus (verweist aber zur Parametrisierung weiter an "Experten").

# Fazit
Mit einfach mal hashen ist es bei der Persistierung von Passwörtern nicht getan. 
Brute-Force und Wörterbuchangriffe sind einfach zu starke Attacken auf diese Hashes. 
Durch den Einsatz eines Salts und einer künstlichen Verlangsamung des verwendeten Hashverfahrens lassen sich diese Angriffe verteidigen.
Per Spring-Security lässt sich jedes der drei vorgestellten Verfahren einfach und schnell umsetzen.
Die Implementierungen lösen dabei meistens auch schon die Frage nach der Salt- und die Parameterspeicherung. 
Eine zusätzliche Versionierung, z.B. in einer extra Spalte, in der der Datenbank ist allerdings sinnvoll, um veraltete Hashes schneller zu finden.
Zusammenfassend lässt sich zu den Verfahren sagen: 
* PBKDF2 wird aktuell noch vom NIST als sicher genug empfohlen hat allerdings eine sehr geringe Speichernutzung. 
* Bcrypts Parametrisierung ist simpel und 
* Argon2 ist durch seine anspruchsvolle Parametrisierbarkeit auch im Hinblick auf die Speicherauslastung das aktuell vom BSI empfohlene Verfahren.
