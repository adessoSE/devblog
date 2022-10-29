---
layout: [post, post-xml]              # Pflichtfeld. Nicht ändern!
title:  "Mulesoft for Java Developers"    # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2022-10-26 10:27              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2022-10-26 10:27      # Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author_ids: [thorst]                   # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesen Namen geben.
categories: [Softwareentwicklung]                # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Java, MuleSoft] # Bitte auf Großschreibung achten.
---

Als Entwickler kommt man irgendwann an dem Punkt an, bei den man alte Systeme in neuere Software integrieren muss. 
Wie wahrscheinlich jeder, habe ich damit mehr oder weniger gute Erfahrungen gemacht und bin auf viele Probleme gestoßen. 
So sind die Protokolle der „betagten“ Software und die entsprechenden Datenaustausch Formate oft schwer handelbar, kompliziert und mit vielen Fragezeichen versehen. 
Diese Fragezeichen führen nicht oft zu weiteren Verzögerungen in der Migration und zu weiteren Frusterlebnissen. 
Um diese Verzögerungen auf ein Minimum reduzieren zu können, nutzen Wir in unserem Alltag sehr oft die Lösung von Salesforce - die Integrationsplattform Mulesoft. 
Vor allem für mich als erfahrenden Java Entwickler fiel der Umstieg in dieses Universum sehr leicht. Wieso das so ist möchte Ich euch in diesem Blog Beitrag gerne näher erläutern.

# Das kommt mir doch nicht unbekannt vor

Als mich mein damaliger Vorgesetzter, nach einem längeren Java Projekt, fragte ob ich mich mit MuleSoft beschäftigen möchte ging es mir so wie euch wahrscheinlich jetzt auch. 
„Was ist MuleSoft und wieso sollte ich mir das überhaupt näher ansehen?“ War die erste Frage die sich mir daraufhin stellte. 
Nach ein wenig Recherche und ein „bisschen ausprobieren und rumspielen“, habe ich mir vorgenommen die Chance, etwas neues zu lernen, zu nutzen und mir das Ganze weiter anzuschauen. 
 
Nach einer etwas längeren Zertifizierungsphase für den Developer bin ich  selbst seit 2021 im MuleSoft Kontext unterwegs. 
Und vieles kam mir bereits von Java bekannt vor - auch wenn ich teilweise früher eher schlechte Erfahrungen damit sammeln durfte und damit jetzt leben muss :-)

# Ein paar wichtige MuleSoft Grundlagen für Java Entwickler 

Grundsätzlich werden mit MuleSoft Java HTTP REST APIs geschrieben. 
MuleSoft selbst basiert auf Java und nutzt den JDK Compiler für sämtliche Operationen und Funktionalitäten aus. 
Das hat den Vorteil, dass es prinzipiell auf jedem System lauffähig ist und auf einem bereits existierenden, ausgereiften Ökosystem basiert. 
Leute wie Ich, die bereits mit diesem Ökosystem vertraut sind, werden sich dadurch auch leichter in der MuleSoft Welt zurechtfinden. 
Dennoch bringt auch MuleSoft seine Eigenheiten mit, die man besonders als Java Entwickler kennen sollte. 
Allen voran die Programmiersprache DataWeave. 
Diese ist eine reine Transformations Skript Sprache. 
Wenn ich als Entwickler an den Punkt komme, dass viele Systeme miteinander sprechen sollen, werde ich die Daten immer entsprechend transformieren müssen. 
Prinzipiell basiert sonst vieles auf den WYSIWYG Prinzip, aber hier darf man dann ein wenig programmieren :-) 
 
Ein einfaches Beispiel wäre folgendes: 
 
%dw 2.0 
output application/json 
--- 
{ 
"data": vars.invalidItems map(value, index) -> ({ 
"attributes": { 
"data": write(value.ExistingAccountWithDifferentDataSet, "application/json"), 
"category": "dataConflict", 
"sourceId": value.ExistingAccountWithDifferentDataSet.existingAccount.salesforceId 
} 
}) 
 
In diesem leite ich mit „%dw 2.0“ ein, dass ich DataWeave nutzen möchte. 
Was prinzipiell keine Pflicht ist wenn man keine DataWeave Funktionen nutzen möchte. 
So macht es beispielsweise bei statischen Daten Sinn auf DataWeave zu verzichten. 
Ich lege dann den Output auf JSON fest - standardmäßig wird es ansonsten, wenn ich es nicht angebe, ein Java Objekt. 
Mit den drei Strichen geht es dann aber erst so richtig los. 
Ich greife nun ich auf eine Variable zu, die ich vorab definiert habe und die ein Array beinhaltet. 
Wie in einer „for-each“ Schleife iteriere ich dabei, mit Hilfe der Dataweave Funktion „map“, durch alle Elemente und baue mir eine neue JSON Struktur auf. 

![Flow Example](https://github.com/adessoAG/devblog/raw/master/assets/images/Mulesoft_for_Java_Developers/mulesoftJava_01.jpg)
 
Bis auf die Implementierung von JUnit Tests oder eigenen Modulen, wird man eher selten auf den Genuss kommen Java Quellcode implementieren zu dürfen. Das übernimmt der Compiler zum Schluss für einen. 
 
 
 
Grundsätzlich gibt es in Mulesoft auch keine klassischen Objekt Klassen. Daraus ableitend auch keine Objekte und kaum Java Quelltext. 
Und jede Mulesoft Anwendung besteht aus Flow Konfigurationen die, die einzelnen Abläufe definieren und aufrufbar machen. 
Diese Definitionen werden in xml Dateien abgelegt. Alles beginnt und endet beim HTTP API Kit Router, der die Client Anfragen entgegennimmt und diese an die entsprechenden Ressourcen weiterschickt. 
Bis dieser von Ihnen eine Rückmeldung bekommt und an den Client zurück gibt. 
 
![RAML Example](https://github.com/adessoAG/devblog/raw/master/assets/images/Mulesoft_for_Java_Developers/mulesoftJava_02.jpg)
 
Die Kommunikationsspezifikation zwischen Client und Server Anwendung wird dabei, ganz klassisch, über RAML oder OpenAPI Definitionen festgelegt und zentral auf der „Anypoint Plattform“ bekannt gegeben. 

# Die Java Basis, die auf den ersten Blick auffällt 

![Anypoint Studio](https://github.com/adessoAG/devblog/raw/master/assets/images/Mulesoft_for_Java_Developers/mulesoftJava_03.jpg)

MuleSoft  selbst bringt eine eigene Entwicklungsumgebung mit. Das sogenannte „Anypoint Studio“. 
Wenn man die optischen Ähnlichkeiten ausser Acht lässt und sich die Info dieser Software anschaut wird man mit „Eclipse“ eine, für Java Entwickler geläufige, Open Source Entwicklungsumgebung entdecken. 
Mit vielen Anpassungen an Board. 
So bringt das MuleSoft Universum viele Plugins, Bausteine (sogenannte Flow Komponenten) und eine eigene Runtime Server Komponente mit, die über eigene Konfigurationen automatisch eingebunden werden. 
 
![Java Folders](https://github.com/adessoAG/devblog/raw/master/assets/images/Mulesoft_for_Java_Developers/mulesoftJava_04.jpg)
 
Schaut man sich nur die Projektstruktur vom Source Code an, würde man sofort ein normales Java Projekt vermuten. 
In den „main“ Paketen finden die eigentlichen Operationen und deren Ressourcen ihren Platz. 
In den test Paketen liegen die jeweiligen MUnit Tests. 
 
![Mule Main Folder](https://github.com/adessoAG/devblog/raw/master/assets/images/Mulesoft_for_Java_Developers/mulesoftJava_05.jpg)
 
Wenn man sich die Main Struktur genauer anschaut, wird man dort xml Dateien finden. 
Dort werden die einzelnen Flows und deren Elemente konfiguriert hinterlegt. 
 
![XML Config example](https://github.com/adessoAG/devblog/raw/master/assets/images/Mulesoft_for_Java_Developers/mulesoftJava_06.jpg)
 
In dem vorliegenden Beispiel wird, neben einem Error Handling, der Flow „blog-example-console“ definiert. 
Die Bezeichnet müssen dabei über das ganze Projekt eindeutig sein. 
In diesem Flow lauscht ein HTTP Listener auf den Pfad „/console/*“ und gibt, im Erfolgsfall, vorher definierte Response Header zurück - im Fehlerfall den Status Code 500 und zusätzlich den gesendeten Payload (Response Body). 
 
![Global config](https://github.com/adessoAG/devblog/raw/master/assets/images/Mulesoft_for_Java_Developers/mulesoftJava_07.jpg)
 
Wir kennen bereits von Java die globalen Variablen, die natürlich am besten statisch in einer Klasse definiert werden und von überall nutzbar sind. 
So ein „Konstrukt“ kennt auch MuleSoft und lässt einem globale Konfigurationselemente definieren. 
In dem vorliegenden Beispiel wurde der HTTP Listener (Connector der eingehende Anfragen von außen annimmt) und der ApiKit Router definiert. 

# Der Unterbau der alles zusammen hält 

![Maven config](https://github.com/adessoAG/devblog/raw/master/assets/images/Mulesoft_for_Java_Developers/mulesoftJava_08.jpg)

Weiterhin erkennt das geschulte Auge eine Maven POM Datei. 
Auch MuleSoft stellt das, ein oder andere, Repository selbst zur Verfügung. 
Teilweise sind diese, wie beispielsweise das Nexus Repository,  lizenzpflichtig. 
Auch hier werden grundsätzlich alle Dependencies mit ihren jeweiligen Versionen definiert. 
Viele davon, wie der HTTP Connector oder der APIKit Router, werden standardmäßig bei der Neu Anlage eines Projektes eingetragen. 
Auch erkennt man beim letzten Eintrag die Einbindung einer API Referenz - in dem Fall handelt es sich um die eigene API Definition. 
Dies repräsentiert ein ganz typisches Implementierungsszenario - die API wird im API Designer entworfen, im Exchange bekannt gemacht und von dessen Repository Eintrag direkt in Maven eingebunden. 
Mit Hilfe dieser Information kann die Anwendung ihre REST Endpoint Flows aufbauen und kennt damit die jeweiligen Definitionen aller Endpunkte. 
 
![Logging](https://github.com/adessoAG/devblog/raw/master/assets/images/Mulesoft_for_Java_Developers/mulesoftJava_09.jpg)
 
Ein nicht ganz unwichtiger Punkt ist das Thema Logs. 
Auch hier können wir auf ein bekanntes und beliebtes Java Framework zurückgreifen. 
Der Dateiname verrät es natürlich bereits - es handelt sich in dem Fall um Log4J in der Version 2. In der Konfigurationsdatei definiert man dann, wie gewohnt, seine eigenen Logger. Und ja, auch MuleSoft hatte mit der, im letzten Jahr auftretenden globalen Sicherheitslücke, zu kämpfen - aber auch hier helfen Versions Updates:-) 

![Propertie Configs](https://github.com/adessoAG/devblog/raw/master/assets/images/Mulesoft_for_Java_Developers/mulesoftJava_10.jpg)

Spätestens seit Spring Boot beliebt und bekannt, ist es auch in Mulesoft möglich eigene Stage Properties und eine „common“ Property Datei zu definieren. 
In dieser werden die globalen und spezifischen Properties eingetragen. Diese können daraufhin wie folgt eingebunden werden: 

![Propertie Binding example](https://github.com/adessoAG/devblog/raw/master/assets/images/Mulesoft_for_Java_Developers/mulesoftJava_11.jpg)
 
In dem Fall wird eine HTTP Connector Konfiguration soweit vordefiniert, dass sie dynamisch, je nach hinterlegter Stage, auf die host und Port Informationen zugreifen kann. 
Genauso kann aber auch unter Dataweave auf die Property Konfiguration zugegriffen werden. 
Hier macht man aber typischerweise von der „p“ DataWeave Funktion Gebrauch: 

![Propertie Binding DataWeave example](https://github.com/adessoAG/devblog/raw/master/assets/images/Mulesoft_for_Java_Developers/mulesoftJava_12.jpg)

Hier wurde beispielsweise im JSON Zweig „headers“ ==> „client_id“ die property „p.service.client.id“ dynamisch aufgerufen. 
Das Secure Flag davor kennzeichnet einen verschlüsselten Wert, der erst von Dataweave entschlüsselt werden muss. 
 
Über einen Schlüssel wird der entsprechende Wert entschlüsselt. 
Dieser kann beispielsweise extern ausgelesen oder über einen Start Parameter mitgegeben werden. 
Bei diesen ganzen Verfahren können auch die, aus Java allseits bekannten und beliebten, KeyStores und TrustStores eingesetzt und eingebunden werden. 

# Auch bei MuleSoft gibt es einen Frühling 

<?xml version="1.0" encoding="UTF-8"?> 
 
<mule xmlns:db="http://www.mulesoft.org/schema/mule/db" 
     xmlns:spring="http://www.mulesoft.org/schema/mule/spring" 
     xmlns="http://www.mulesoft.org/schema/mule/core" 
     xmlns:doc="http://www.mulesoft.org/schema/mule/documentation" 
     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
     xsi:schemaLocation="http://www.mulesoft.org/schema/mule/core 
http://www.mulesoft.org/schema/mule/core/current/mule.xsd 
http://www.mulesoft.org/schema/mule/spring 
http://www.mulesoft.org/schema/mule/spring/current/mule-spring.xsd 
http://www.mulesoft.org/schema/mule/db 
http://www.mulesoft.org/schema/mule/db/current/mule-db.xsd"> 
 
<spring:config name="springConfig" files="beans.xml" /> 
 
<db:config name="derbyConfig" doc:name="Database Config"  > 
<db:derby-connection database="datasource" create="true" /> 
</db:config> 
</mule> 
 
Im Java Umfeld ist das Spring Framework in aller Munde und mittlerweile, spätestens durch Spring Boot, zum Standard geworden. 
Die dazugehörigen Spring Beans können natürlich auch in MuleSoft selbst definiert werden. Neben der ersichtlichen Datenbank Konfiguration können auch Authentifizierungsprovider und Filter definiert werden. 

# Die Sache mit den JUnit Tests 

![JUnit example](https://github.com/adessoAG/devblog/raw/master/assets/images/Mulesoft_for_Java_Developers/mulesoftJava_13.jpg)

Neben der Möglichkeit Tests, mit Hilfe der hauseigenen Munit Technologie, zu zeichnen oder zeichnen zu lassen gibt es auch mit MuleSoft die Möglichkeit Junit Tests zu schreiben. Man kann nun auch mit seinem gesamten Java Wissen glänzen :-) 
 
In dem vorliegenden Beispiel wird dabei ein Flow mit dem Bezeichnet „myFlow“ gestartet und vorher ein SQL Select gemockt. 
In dem Fall wird das Result mit dem vordefinierten Ergebnis „815-OA“ gefüllt und am Ende über ein Assert geprüft. 

# Fazit - oder wieso brauche ich MuleSoft nun? 

Wie wir nun sehen können, kann MuleSoft uns vieles bieten was wir auch schon von Java kennen. 
Teilweise geliebt, teilweise akzeptiert haben wir ein großes Sammelsurium von Tools und Technologien gleich an Board und müssen uns beispielweise nicht mehr mit der Implementierung von Connectoren zu den einzelnen Systemen auseinandersetzen. 
 - oder deren komplizierte Struktur in Gänze begreifen. 
Es nimmt uns bei der Integration von anderen Systemen als Middleware und Rest API Lösung viel ab. 
Das merke ich auch - und gerade - in meinen jetzigen Java Projekt, bei dem die Entwicklung der Connectoren Stunden/Tage und nicht Minuten in Anspruch nimmt.
Sicherlich muss man auch festhalten das es für „Hardcore Entwickler“ in der Regel zu limitiert ist und die hauseigene Script Sprache „Dataweave“ eher wie ein missglückter Versuch , auch diese Gruppe abzudecken, wirkt. 
Ein „Test-Driven“ Ansatz ist auch praktisch unmöglich zu realisieren und MuleSoft selber weiß auch das Testing nicht gerade ihre Parade- Disziplin ist. 
Wenn man aber über diese Nachteile hinweg sieht, integrieren möchte und bereits Salesforce im Projektkontext einsetzt lohnt sich der Blick Richtung MuleSoft auf jeden Fall. 
Der Umstieg ist relativ unkompliziert und es lohnt sich am Ende für alle. 
Auch ein technisch eher unbegabter Kunde wird eure Flows verstehen. Ihr müsst euch in eurem Projekt nicht mit Integrationen herum rumschlagen, sondern könnt euch ganz auf die Implementierung der Business Logik konzentrieren. 
Und schlussendlich könnt Ihr im geliebten Java Umfeld bleiben - Lets give it a try :-) 
