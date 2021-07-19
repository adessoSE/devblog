---
layout: [post, post-xml]              
title: "Authentifizierung über öffentliche Schlüssel mit Apache MINA"            
date: 2021-01-13 09:00
modified_date: 2021-03-08 14:50
author: ivankablar                       
categories: [Softwareentwicklung]
tags: [Java, IT-Security, Kryptographie, SSH, Apache MINA]     
---

In der Fortsetzung meines [Blog-Beitrags](https://www.adesso.de/de/news/blog/migration-von-videomitschnitten-mit-apache-mina-teil-1.jsp) werden wir die Authentifizierung über öffentliche Schlüssel mit dem Apache MINA Framework untersuchen.
Ich beginne mit einem Überblick über die für uns relevanten kryptographischen Verfahren und Methoden. 
Anschließend schauen wir uns die Implementierung der Authentifizierung über öffentliche Schlüssel in einem Prototyp und einem vom Framework abgeleiteten Konzept für die Authentifizierung an.

# Asymmetrische Verschlüsselung
Bei der asymmetrischen Verschlüsselung werden zwei sich ergänzende Schlüssel verwendet: Der private und der öffentliche Schlüssel.
Mit dem privaten Schlüssel werden Nachrichten entschlüsselt und digitale Signaturen erzeugt.
Mit dem öffentlichen Schlüssel werden Nachrichten verschlüsselt und digitale Signaturen auf ihre Authentizität überprüft.
Wie der Name schon sagt, kann der öffentliche Schlüssel öffentlich zugänglich gemacht werden. 
Theoretisch kann jeder mit dem öffentlichen Schlüssel Nachrichten verschlüsseln, da diese nur mit dem privaten Schlüssel entschlüsselt werden können. 
Maßgeblich ist hierbei, dass der private Schlüssel nicht aus dem öffentlichen Schlüssel berechnet werden kann.
Der öffentliche Schlüssel wiederum kann aus dem privaten Schlüssel berechnet werden.

# Digitale Signatur
Die digitale Signatur kann verwendet werden, um Dokumente digital und rechtssicher zu unterzeichnen sowie die Identität des Unterzeichners und die Integrität von Nachrichten zu bestätigen.
Betrachtet man einen konkreten Anwendungsfall, so einigen sich der Unterzeichner und der Prüfer zunächst auf die zu verschlüsselnde Nachricht und berechnen jeweils aus dieser einen Hashwert. 
Das Hashen macht aus einer Nachricht flexibeler Länge eine Nachricht fester Länge. Es ist grundsätzlich nicht möglich, aus dem Hashwert die ursprüngliche Nachricht zu berechnen.
Der Unterzeichner verschlüsselt den von ihm erstellten Hashwert mit seinem privaten Schlüssel (was eine Signatur der Nachricht darstellt) und schickt die Nachricht samt Signatur an den Prüfer. 
Der Prüfer validiert die Signatur, indem er den Hashwert entschlüsselt und vergleicht den erhaltenen Hashwert mit dem zuvor berechneten Hashwert.
Stimmen beide Hashwerte überein, ist die Signatur und damit die Identität des Unterzeichners sowie die Echtheit der Nachricht bestätigt.

![Prüfung der digitalen Signatur](/assets/images/posts/Authentifizierung-ueber-oeffentliche-Schluessel-mit-Apache-MINA/DigitaleSignatur.png)


# Authentifizierung über öffentliche Schlüssel
Bevor sich der Benutzer über einen öffentlichen Schlüssel am SFTP-Server authentifizieren kann, muss der öffentliche Schlüssel für den Benutzernamen auf dem SFTP-Server konfiguriert sein. 
Die Authentifizierung erfolgt dann, wie in [RFC4252](https://tools.ietf.org/html/rfc4252/) spezifiziert, über den privaten Schlüssel des Clients. 
Während des Authentifizierungsvorgangs überprüft der SFTP-Server den öffentlichen Schlüssel des Clients und die Signatur des privaten Schlüssels. 
Erst wenn beide gültig sind, hat sich der Client erfolgreich authentifiziert.

Da private Schlüssel in der Regel sehr lang sind, ist es nahezu unmöglich, sie mit "Brute-Force" Angriffen zu knacken. 
Aus diesem Grund ist die Authentifizierung über öffentliche Schlüssel sicherer als die Authentifizierung über Passwörter und sollte letzterer vorgezogen werden. 
Wichtig ist, dass der private Schlüssel immer geheim bleibt, denn andererseits wäre die Sicherheit des Verfahrens nicht mehr gegeben.

# Diffie-Hellmann-Schlüsselaustausch
Anders als vielleicht angenommen, kommen die Schlüssel, die für die Authentifizierung verwendet werden, nicht für die Verschlüsselung der Datenübertagung zum Einsatz. 
Bevor der Authentifizierungsvorgang beginnen kann, findet zwischen dem Client und dem Server der sogenannte "Diffie-Hellmann-Schlüsselaustausch" statt. 
Während der Prozedur generieren der Client und der Server Schlüsselteile, die, zusammengesetzt, einen symmetrischen Schlüssel für die Verschlüssellung der Kommunikation ergeben. 
Erst nach erfolgreicher Verschlüsselung des Kommunikationskanals kann mit dem Authentifizierungsvorgang begonnen werden.

# Prototyp
Schauen wir uns den Authentifizierungsvorgang genauer an.
Hierfür habe ich im GitHub einen Prototyp hinterlegt. 
Ihr könnt ihn unter [MINA-sftp-pub-auth](https://github.com/IvanKablar/MINA-sftp-pub-auth) herunterladen.
Zuerst werfen wir einen Blick auf die Konfiguration des SFTP-Servers und schauen uns die Konfiguration der Schlüssel an:

```java
@Component
public class SftpServerConfig {
    private SshServer sshd;
    @Value("${hostkey}")
    private String hostKey;
    private ResourceLoader resourceLoader;
    private SftpPublicKeyAuthenticator sftpPublicKeyAuthenticator;

    @Autowired
    public SftpServerConfig(ResourceLoader resourceLoader, SftpPublicKeyAuthenticator sftpPublicKeyAuthenticator) {
        this.resourceLoader = resourceLoader;
        this.sftpPublicKeyAuthenticator = sftpPublicKeyAuthenticator;
    }

    @PostConstruct
    public void init() throws IOException {
        SftpSubsystemFactory factory = new SftpSubsystemFactory.Builder().build();
        sshd = SshServer.setUpDefaultServer();
        sshd.setPort(9922);
        sshd.setKeyPairProvider(new SimpleGeneratorHostKeyProvider(new File(hostKey).toPath()));
        sshd.setPublickeyAuthenticator(sftpPublicKeyAuthenticator);
        sshd.setSubsystemFactories(Collections.singletonList(factory));
        sshd.start();
    }
    ...
}
```

Der SFTP-Server wird in der "init"-Methode konfiguriert.
Bevor der Server gestartet werden kann, muss eine Instanz des Typs "KeyPairProvider" bekannt gemacht werden. 
Die an den Konstruktor der Klasse "SimpleGeneratorHostKeyProvider" übergebene Schlüsseldatei wird für die Identifikation des Servers verwendet.
Falls Ihr den Prototyp heruntergeladen habt, ist das Erstellen der nun im Beitrag folgenden öffentlichen bzw. privaten Schlüssel optional.
Falls Ihr trotzdem Eure eigenen Schlüssel erstellen und im Prototyp konfigurieren wollt, könnt Ihr das gerne machen.
Der Schlüssel für den "SimpleGeneratorHostKeyProvider" kann folgendermaßen erstellt werden: 

```git
ssh-keygen -t rsa -m PEM
```

Die Datei kopieren wir in das Resource-Verzeichnis des Servers.
Mit dem öffentlichen Schlüssel der Datei wird der sogenannte "Fingerprint", ein kodierter SHA256 Hashwert, berechnet und dem Client beim Anmeldeversuch zugesendet. 
Der Client sollte beim Anmelden Änderungen am "Fingerprint" immer genau hinterfragen. 
Zwar ist es wahrscheinlich, dass der Server-Admin den öffentlichen Schlüssel und somit den "Fingerprint" geändert hat, aber es könnte sich auch um eine "Man-in-the-Middle Attack" handeln. 
Nach einer erfolgreichen Authentifizierung ermöglicht die Klasse "SftpSubsystemFactory" den Zugriff auf das Dateisystem des Servers. 
Die Implementierung des Interface "PublickeyAuthenticator" schauen wir uns weiter unten im Beitrag genauer an.

# Konfiguration des öffentlichen Schlüssels
Um uns am SFTP-Server authentifizieren zu können, erzeugen wir ein Schlüsselpaar, bestehend aus einem öffentlichen und einem privaten Schlüssel:

```git
ssh-keygen -t rsa -b 4096
```

Die Datei mit dem öffentlicher Schlüssel kann in ein beliebiges Verzeichnis auf dem Server kopiert werden. 
Um die Konfiguration in unserem Beispiel einfach zu halten, habe ich die Datei ebenfalls in das Resource-Verzeichnis kopiert. 
Aus diesem kann der Schlüssel beim Erstellen der Benutzerinformationen gelesen werden. 
In einer produktiven Anwendung würde wahrscheinlich ein anderes Konzept hinter der Schlüsselverwaltung stehen. 
Beispielsweise könnte der öffentliche Schlüssel in einem LDAP-Verzeichnis hinterlegt werden.

Aus organisatorischer Sicht kann es sinnvoll sein, dass der Client die Schlüssel selbst erzeugt. 
Die Datei mit dem öffentlichen Schlüssel sendet er über einen beliebigen, möglicherweise unsicheren Kanal, an den Server-Admin und den privaten Schlüssel behält er im Geheimen.

# Anmeldung
Als Nächstes versuchen wir, uns mit dem privaten Schlüssel am Server zu authentifizieren:

```git
sftp -P 9922 -i /home/ivan/id_rsa ivan@localhost  
``` 

Der private Schlüssel enthält die notwendigen Informationen für das Berechnen des öffentlichen Schlüssels. 
Der vom Client geschickte öffentliche Schlüssel kann nun mit dem für den Benutzer auf dem Server konfigurierten öffentlichen Schlüssel verglichen werden. 
Außerdem überprüft das Framework die durch den privaten Schlüssel erstellte Signatur mit dem öffentlichen Schlüssel. 
Erst, wenn der Vergleich der öffentlichen Schlüssel gelingt und die Signatur korrekt ist, hat sich der Client erfolgreich authentifiziert.

# Implementierung der Authentifizierung
Mit der Bereitstellung von Interfaces für die Authentifizierung durch das Framwork wird bei der Entwicklung die Überprüfung von zusätzlichen Authentifizierungskriterien ermöglicht, darunter auch der Vergleich der öffentlichen Schlüssel.
In unserem Beispiel implementiert die Klasse "SftpPublickeyAuthenticator" eine solche Schnittstelle. 
Die Authentifizierung beginnt mit der Überprüfung des Benutzernamens. 
Anschließend findet der Vergleich der öffentlichen Schlüssel statt. 

```java
@Override
public boolean authenticate(String username, PublicKey publicKey, ServerSession serverSession) throws AsyncAuthException {
    User user =  userService.getUser(username);
    if(user== null) {
        log.warn("Kein Benutzer mit Namen '{}' konfiguriert", username);
        return false;
    }
    return publicKeyService.isPublicKeyValid(userService.getUserKey(user), PublicKeyEntry.toString(publicKey), serverSession);
}
```

Die Methode "isPublicKeyValid" der Klasse "PublicKeyService" enthält die Logik für die Validierung und den Vergleich der öffentlichen Schlüssel. 
```java
public boolean isPublicKeyValid(String serverConfPublicKey, String clientSentPublicKey, ServerSession serverSession) {
    PublicKey clientPublicKey = null;
    PublicKey serverPublicKey = null;
    try {
        serverPublicKey = generatePublicKey(serverConfPublicKey, serverSession);
    }
    catch(IOException e) {
        log.warn("Fehler beim Dekodieren des serverseitigen Public-Keys", e);
        return false;
    }
    catch(IllegalArgumentException e) {
        log.warn("Der serverseitige Public-Key besitzt kein gültiges Format", e);
        return false;
    }
    catch(GeneralSecurityException e) {
        log.warn("Fehler beim Generieren des serverseitigen Public-Keys", e);
        return false;
    }

    try {
        clientPublicKey = generatePublicKey(clientSentPublicKey, serverSession);
    }
    catch(IOException e) {
        log.warn("Fehler beim Dekodieren des clientseitigen Public-Keys", e);
        return false;
    }
    catch(IllegalArgumentException e) {
        log.warn("Der clientseitige Public-Key besitzt kein gültiges Format", e);
        return false;
    }
    catch(GeneralSecurityException e) {
        log.warn("Fehler beim Generieren des clientseitigen Public-Keys", e);
        return false;
    }
    return compareKeys(clientPublicKey, serverPublicKey);
}
    
private PublicKey generatePublicKey(String publicKey, ServerSession serverSession) throws IOException, GeneralSecurityException {
    if(publicKey == null || publicKey.isEmpty()) {
        return null;
    }
    PublicKeyEntry publicKeyEntry = PublicKeyEntry.parsePublicKeyEntry(publicKey);
    return publicKeyEntry.resolvePublicKey(serverSession, null, PublicKeyEntryResolver.IGNORING);
}
```

Konnten beide öffentlichen Schlüssel in der Methode "generatePublicKey" fehlerfrei eingelesen werden, prüft die Methode "compareKeys", ob der auf dem Server konfigurierte öffentliche Schlüssel mit dem öffentlichen Schlüssel des Clients übereinstimmt. 
```java
private boolean compareKeys(PublicKey clientPublicKey, PublicKey serverConfigPublicKey) {
    if(!KeyUtils.compareKeys(clientPublicKey, serverConfigPublicKey)) {
        log.warn("Die Public-Keys stimmen nicht überein");
        return false;
    }
    log.info("Die Public-Keys stimmen überein");
    return true;
}
```

Stimmen die Schlüssel nicht überein, bricht die Authentifizierung an dieser Stelle ab. 
Handelt es sich um die gleichen Schlüssel, weiß der Server, dass der Client im Besitz des öffentlichen Schlüssels ist. 
Der Server überprüft nun noch die digitale Signatur der Nachricht, die der Client an den Server geschickt hat.
Ist die digitale Signatur korrekt, hat sich der Client erfolgreich authentifiziert.

# Ergebnis
Mit dem Prototyp und dem Beispiel oben haben wir die Implementierung eines Konzepts für die Authentifizierung über öffentliche Schlüssel mit dem Apache MINA Framework untersucht. 

Mir hat es Spaß gemacht den SFTP-Server zu entwickeln und ich hoffe, Euch hat mein Blog-Beitrag gefallen. Bleibt gesund und bis bald.
