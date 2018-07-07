---
layout:         [post, post-xml]              
title:          "Absichern von azure-Functions"
date:           2018-07-01 12:00
modified_date: 
author:         nilsa 
categories:     [Microsoft]
tags:           [azure, functions, security, paas]
---
Gibt es "Sicherheit" bei azure functions? Sind diese immer Öffentlich zugänglich? Können functions mit Benutzer-Autorisierung abgesichert werden? Dieser Beitrag versucht der Frage nachzugehen und eine Lösung aufzuzeigen.

# Übersicht
Eine function ist in azure leicht erstellt. Ein einfaches Beispiel liefert Microsoft schon in der [Dokumentation](https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-first-azure-function) mit. Zum aktuellen Zeitpunkt hat die Dokumentation exakt 10 Schritte, beginnend mit "Create a function app" bis abschließend mit "Test the function".
Es stellt sich die Frage, ob diese function dann auch schon "abgesichert" ist.

Eine function besteht grob aus zwei Teilen: Aus der ["Azure Function"](https://docs.microsoft.com/en-us/azure/azure-functions/) selbst und dem ["Azure App Service"](https://docs.microsoft.com/en-us/azure/app-service/) in dem die function existiert. Dies führt dazu, dass man zwei Punkte betrachten muss, wenn es um die Frage der Sicherheit geht: Zum einen den App Service und zum anderen die function. 

# Authentifizierung und Autorisierung

## Sicherheit in functions
Die Fragestellung nach der "Sicherheit der function" ist etwas verwirrend - im Grunde soll ja nicht die function abgesichert werden, sondern der Aufruf bzw. der Start der function. Functions starten immer über sogenannte Trigger, von denen die meisten Azure-Intern zu verwenden sind (z.B. Timer, Event Hub oder Blob Storage). Der für  diesen Artikel betrachtete Trigger ist daher der [HTTP oder "generic web hook"-Trigger](https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-generic-webhook-triggered-function).

Laut [Doku](https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-http-webhook#trigger---configuration) stehen drei Autorisierungsmechanismen auf Ebene des Triggers zur Verfügung:

![Die Folgenden Autorisierungen stehen zur Verfügung](../assets/images/posts/Azure-Functions-Security/function-authorization-ui.png) ![Im Tooltip gibt es auch eine kleine Erklärung](../assets/images/posts/Azure-Functions-Security/function-authorization-ui-explained.png)

 - `anonymous` - No API key is required.
 - `function` - A function-specific API key is required. This is the default value if none is provided.
 - `admin` - The master key is required.

Der HTTP-Trigger einer Funktion lässt es also zu, den Aufruf der function über einen Schlüssel (oder "key") abzusichern. Wie sieht das genau aus:

Zuerst muss der Schlüssel abgerufen werden: Dis geht über die Seite der Funktion selber:

![Anzeige von Schlüsseln in der UI](../assets/images/posts/Azure-Functions-Security/function-authorization-keys.png)

Oder über die Verwaltungsseite: 

![Anzeige von Schlüsseln in der UI](../assets/images/posts/Azure-Functions-Security/function-authorization-key-management.png)

Die Schlüssel können über zwei verschiedene Mechanismen verwendet werden. Entweder als Query-Parameter:

    https://<yourapp>.azurewebsites.net/api/<function>?code=<ApiKey>

Oder über den HTTP-Header `x-functions-key`.

Ein möglicher Zugriff kann damit auf zwei Arten geschehen:

```cs
    const string function = "https://securityexample.azurewebsites.net/api/HelloWorld";
    const string code = "Srs8ca27tCSwuyFTv0kBOwMt/WTzLXW43WNcPUYeG7L273TmQTSf0A==";

    // via get-parameter
    using (var client = new WebClient())
    {
        Console.WriteLine("Sending code via get-parameter...");
        var fullUrl = $"{function}?code={code}";
        var data = client.DownloadString(fullUrl);
        Console.WriteLine(data);
    }

    // oder via HTTP-Header
    using (var client = new WebClient())
    {
        Console.WriteLine("Sending code via HTTP-Header...");
        client.Headers.Add("x-functions-key", code);
        var data = client.DownloadString(function);
        Console.WriteLine(data);
    }
```

Auf Ebene einer mit Code erstellen function lässt sich noch eine weitere Methode finden: *User*

![User als Authorisation ist im code möglich](../assets/images/posts/Azure-Functions-Security/function-authorization-code.png)

Dieses feature ist aber - obwohl hier auswählbar - zum Zeitpunkt dieses Beitrags noch nicht verfügbar. (Der Status des features kann in einem [Github-Issue](https://github.com/Azure/azure-functions-host/issues/33) eingesehen werden.) 

Auf Ebene der Funktion ist ist also eine [Autorisierung über einen Key oder Code](https://en.wikipedia.org/wiki/Shared_secret) möglich. Eine Authentifizierung ist hier nicht möglich. 

## Sicherheit im app service

In den Einstellungen des App Service ("Plattformeinstellungen", aus sicht der function) gibt es den Punkt "Authentication/Authorization":
 
![Authentication/Authorization in den Plattformeinstellungen](../assets/images/posts/Azure-Functions-Security/platform-authentication.png)

Hier ist erkennbar, dass zumindest eine Benutzer-Authentifizierung möglich ist.
Die aktuellen anbieter für Authentifizierung sind unter anderem "Microsoft" und "Azure Active Directory" - dies ist zu unterscheiden, da für den "Microsoft"-Anbieter ein einfacher [Microsoft-Account](https://account.microsoft.com/) verwendet wird, wohingegen für Azure Active Directory eben dies (einen Account in einem Azure Active Directory) meint.  

Zusätzlich ist einstellbar, ob unauthentifizierte Zugriffe erlaubt sein sollen oder ob diese an einen der angegebenen Authentifizierungsanbieter umgeleitet werden sollen.

Den Ablauf der Authentifizierung an einem App Servive stellt die entsprechende [Doku](https://docs.microsoft.com/en-us/azure/app-service/app-service-authentication-overview#authentication-flow) gut dar. Grob vereinfacht sieht der Ablauf wie folgt aus:

1. Anmeldung : Der Benutzer Authentifiziert sich an einem Authentifizierungsanbieter. Das Ergebnis ist ein Beweis (token) des Authentifizierungs-Anbieters.
2. Validierung : Der Beweis der Authentifizierungsanbieter wird an den App Service gesendet und dort geprüft. Das Ergebnis ist ein Beweis des App Service.
3. Verwendung : Der Beweis des App Service wird für Aufrufe der function verwendet.

# Authentifizierung von Benutzern am Beispiel

Als Ausgangspunkt wird eine einfache function, wie sie z.B. in [diesem Projekt](https://github.com/nils-a/function-security-blog/blob/f912dbd8d1ed08bf839c82d0e1c70b11eb34a982/SecurityExample/SecurityExample/UserInfo.cs) definiert ist verwendet. 

Der eigentliche Aufruf einer solchen function ist in relativ simpel und folgt dem o.a. Ablauf:

1. Authentifizierung gegen den Authentifizierungsanbieter. Das Ergebnis dieses Aufrufes ist ein token des Providers.
2. Das Token des Providers wird als JSON-Objekt an den *Login*-Endpunkt des App Service gesendet. Das Ergebnis dieses Aufrufes ist ein *EasyAccess*-Token
3. Das *EasyAccess*-Token wird im HTTP-Header `X-ZUMO-AUTH` für den Aufruf der Funktion verwendet.

Im Code:
```cs
// Step 1:
var providerToken = await AuthenticateToProvider();

// Step 2:
var easyAuthToken = await AuthenticateToAzure(functionUrl, providerToken);

//
// Step3: Use the token we got from "EasyAuth" 
//
using (var client = new WebClient())
{
    client.Headers.Add("X-ZUMO-AUTH", easyAuthToken);
    var data = await client.DownloadStringTaskAsync(functionUrl);
    return data;
}
```

> **Anmerkung**
>
> Das Token, welches vom Authentifizierungsanbieter geliefert wird ist ein sog. [JWT-Token](https://en.wikipedia.org/wiki/JSON_Web_Token) dass mit geeigneten Tools (z.B. mit [jwt.io](https://jwt.io/)) dekodiert werden kann.
> Diest ist nützlich, wenn man den Authentifizierungsprozess debuggen muss.
>
> z.B: muss im Payload-Data bereich des Tokens im bereich des Identity-Providers (`idp`) der Wert übereinstimmen mit dem gewählten Anbieter für den nächsten Schritt bei dem das Token an azure übergeben wird. 

Damit dies so funktioniert müssen vorher eine Einstellung vorgenommen werden: 
 Es muss ein Authentifizierungsanbieter eingerichtet werden. Dieses beispiel verwendet den "Microsoft"-Authentifizierungsanbieter:

1. Bevor azure-Seitig der Authentifizierungsanbieter ausgewählt werden kann muss bei allen Authentifizierungsanbietern eine sog. "App" (D.h. eine Anwendung für die die Authentifizierung erfolgt) eingerichtet werden. Für den "Microsoft"-Authentifizierungsanbieter geschieht dies unter [https://apps.dev.microsoft.com/](https://apps.dev.microsoft.com/) 
	1. Für die Anwendung muss ein Anwendungsgeheimnis eingerichtet werden. Dies wird später in azure hinterlegt.
	2. Es muss eine Plattform eingerichtet werden: Web (für die Anmeldung mit der automatischen Weiterleitung). Die Umleitungs-URL für die Plattform ist anhand der [Doku](https://docs.microsoft.com/en-us/azure/app-service/app-service-authentication-overview#identity-providers) zu ermitteln: In diesem Fall ist es `https://<yourapp>.azurewebsites.net/.auth/login/microsoftaccount/callback` (Achtung: Entgegen der Doku ist die URL wirklich `.../microsoftaccount/...` und nicht `.../microsoft/...`.) 
2. Die Anwendungs-ID und -geheimnis müssen in azure für den Authentifizierungsanbieter hinterlegt werden und es muss mindestens der Bereich "wl.basic" ausgewählt werden:
   
      ![app-id und -geheimnis in azure](../assets/images/posts/Azure-Functions-Security/function-example1-appinazure.png)

Wenn dies derart eingerichtet ist, lässt sich auf Seite der function recht einfach überprüfen ob der aktuelle Request wirklich Authentifiziert ist:

```cs
var principal = ClaimsPrincipal.Current;
if(principal == null || !principal.Identity.IsAuthenticated)
{
    return req.CreateResponse(HttpStatusCode.OK, "Unauthenticated", "text/plain");
}
```

# Fazit

* Das Zusammenspiel von Authentifizierung auf Seiten des App Service und Autorisierung auf Seiten des Triggers der Function ist nicht direkt offensichtlich:
  * Autorisierung erfolgt auf Seiten des Triggers der function. Im Falle des HTTP-Trigges basiert die Autorisierung auf einem Code (Shared Secret)
  * Authentifizierung erfolgt auf Seite des App Service. Generell lässt sich einstellen, ob unauthentifizierte Anfragen zugelassen werden oder generell an einen Authentifizierungsanbieter weitergeleitet werden.
* Eine pro-Benutzer Autorisierung ist zum aktuellen Zeitpunkt nicht mit Standardfunktionen (oder [*OOTB*](https://en.wikipedia.org/wiki/Out_of_the_box_%28feature%29)) machbar.

