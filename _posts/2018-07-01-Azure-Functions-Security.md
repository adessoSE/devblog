---
layout:         [post, post-xml]              
title:          "Absichern von azure-Functions"
date:           2018-07-01 12:00
modified_date: 
author:         nilsa 
categories:     [azure, paas]
tags:           [azure, functions, security]
---
Gibt es "Sicherheit" bei azure functions? Können functions mit user-login abgesichert werden? Dieser blog versucht der Frage nachzugehen...


# Übersicht
Mehrere "Functions" werden in azure in einer "Function App" erstellt (bzw. zusammengefasst). Es gibt daher einstellungen auf Ebene der Function App und auch auf Ebene der einzelnen Function. 


# Linksammlung
ACHTUNG ACHTUNG ACHTUNG ACHTUNG  
*das hier muss alles noch weg!*    
ACHTUNG ACHTUNG ACHTUNG ACHTUNG 

* https://github.com/nils-a/function-security-blog
* https://azure.microsoft.com/de-de/blog/introducing-azure-functions/
* https://blogs.msdn.microsoft.com/appserviceteam/2016/04/27/azure-functions-the-journey/
* 

# Platform-Features: Authorization/Authentication

![img](./../assets/images/posts/Azure-Functions-Security/platform-authentication.png)

todo todo todo

# Function: Authoriztion Level

## in der UI

![img](./../assets/images/posts/Azure-Functions-Security/function-authorization-ui.png)

## im Visual Studio

![img](./../assets/images/posts/Azure-Functions-Security/function-authorization-vsproj.png)


## im Code

![img](./../assets/images/posts/Azure-Functions-Security/function-authorization-code.png)

```cs
namespace Microsoft.Azure.WebJobs.Extensions.Http
{
    //
    // Summary:
    //     Enum used to specify the authorization level for http functions.
    public enum AuthorizationLevel
    {
        //
        // Summary:
        //     Allow access to anonymous requests.
        Anonymous = 0,
        //
        // Summary:
        //     Allow access to requests that include a valid authentication token
        User = 1,
        //
        // Summary:
        //     Allow access to requests that include a function key
        Function = 2,
        //
        // Summary:
        //     Allows access to requests that include a system key
        System = 3,
        //
        // Summary:
        //     Allow access to requests that include the master key
        Admin = 4
    }
}
```

todo todo todo

# Beschreibung der Punkte/Möglichkeiten

todo todo todo 

# Die alternative zu "user"

hier viel code...

todo todo todo