---
layout:         [post, post-xml]              
title:          "GraphQL ist flexibler, das Ende von RESTful-APIs?"
date:           2019-11-15 18:00
modified_date:  2020-06-02 15:00
author:         muhannaddarraj 
categories:     [Architektur]
tags:           [RESTful-Web-Services, GraphQL]
---

Die Brücke zwischen dem Frontend und dem Backend wurde bisher in den meisten modernen Applikationen durch eine REST- Schnittstelle geschlossen, um eine Kommunikation mit der Geschäftslogik zu ermöglichen. Nun verstecken sich hinter modernen Softwaresystemen viele Daten und Funktionen und die Menge an genutzten Informationen vergrößert sich stetig. Dies beeinflusst auch die Kommunikation zwischen Client und Server und macht diese aufwändiger. Um einen flexiblen Umgang mit vielen Daten zur Verfügung zu stellen, stellt sich Facebooks GraphQL als Alternative zu REST auf.

GraphQL (Graph Query Language) ist eine Abfragesprache für APIs, wurde von Facebook 2012 entwickelt und erschien 2015, nachdem Facebook sie drei Jahre für ihre Projekte intern verwendet hat.  

# StatusQuo-API-Design nach REST 

In aktuellen Projektsituationen hat sich das API-Design nach REST mittlerweile durchgesetzt, da sich diese APIs gut aus von adesso genutzten Single-Page-Anwendungen anbinden bzw. nutzen lassen und von vielen Entwicklern verstanden werden. Dabei wird das durch REST definierte Prinzip in den wenigsten Fällen wirklich durchgehalten und hat auch ansonsten einige Nachteile.  

Das folgende Beispiel soll die weiteren Herausforderungen dieses Architekturansatzes verdeutlichen.

Stellen wir uns vor, dass der Client eine Person “Anna” ist, die zu Hause sitzt und gerne eine Pizza Margherita von einem Restaurant, sowie Waschmittel von einem Supermarkt bestellen möchte. Anna hat REST beauftragt, diese Produkte für sie zu holen. Leider kann REST nur einen Weg einschlagen, weshalb Anna zuerst nach der Pizza fragt. REST hat daraufhin alles von der Speisekarte des Restaurants an sie geliefert. Anna entnimmt ihre gewünschte Pizza und entsorgt die überschüssigen Produkte. Nachdem REST das Essen besorgt hat, macht er sich nun auf den Weg zum Supermarkt, um das von Anna geforderte Waschmittel zu beschaffen. Dabei bringt er abermals das gesamte Sortiment mit. Anna wählt das Waschmittel aus, welches sie haben möchte, und entsorgt ebenfalls alle weiteren Produkte.  

Aus Annas Erfahrung lassen sich deutlich die folgenden Nachteile von REST entnehmen:   

**Mehrere Endpunkte erforderlich:**  

Da REST nur feste Datenstrukturen zurückliefert, müssen mehrere Endpunkte angelegt werden, um die verschiedenen Daten vom Server beziehen zu können. Beispielsweise konnte Anna ihre Wünsche nicht zur selben Zeit nennen, da REST diese Wünsche aus mehreren Endpunkten nacheinander holen musste und eine parallele Abfrage nicht möglich ist. Die Endpunkte sehen wie folgt aus:
* `URL/api/restaurant `
* `URL/api/supermarkt`

**Overfetching:**   

REST gibt dem Client durch eine Abfrage viele Daten zurück, sodass der Client selber suchen und auswählen muss, welche Daten er wirklich benötigt. Daraus entsteht Redundanz durch unerwünschte Daten, welche sich auf die Bandbreite niederschlägt und Speicherplatz sowie Zeit kostet.  

**Underfetching:**  

REST kann nur einen Endpunkt gleichzeitig abfragen, die Informationen können aber über mehrere Endpunkte verteilt sein. Aus diesem Grund muss der Client manchmal mehrere Abfragen nacheinander tätigen, um alle Informationen zu erhalten. REST muss demzufolge zwei Routen durchlaufen, um Annas Wünsche zu erfüllen. Mit nur einer Abfrage, beispielsweise an den Endpunkt `/api/restaurant`,  würde Anna nur die Pizza bekommen.

Indessen sind diese beiden Probleme mit Hilfe eines entsprechenden API-Designs gut lösbar. Hinter den REST-APIs verbirgt sich eine sehr mächtige Sprache, mit der der Client sich effizient ausdrücken kann. Den meisten Entwicklern für Webapplikationen ist diese Sprache bekannt.  

Der Client kann dabei ein Zeichen geben, das durch den Server zu interpretieren ist. Die Produkte eines Supermarkts werden in der Datenbank beispielsweise durch EAN-Codes bezeichnet. Der Client gibt der REST-API hierzu den EAN-Code des geforderten Produkts. Die REST-API reicht dem Server den Code weiter und dieser kümmert sich um die Suche nach dem gewünschten Produkt in der Datenbank. Sollte der Server die Wünsche des Clients erfüllen können, dann nimmt REST-API die Daten mit und fährt zurück zum Client. Andernfalls würde der Server REST-API eine entsprechende Fehlermeldung zurückgeben, beispielsweise, wenn dieses Produkt nicht mehr vorhanden ist. Die Suche nach möglichst effizienten Namen kann einiges bewirken und hat ein besseres API-Design zur Folge. 

Das bedeutet, dass Anna detailliert beschreiben sollte, wonach REST den Server fragen soll. Geeignete Endpunkte sehen zum Beispiel wie folgt aus:  

* `URL/api/supermarkt/produkte/{ean}`
* `URL/api/restaurant/pizza/margherita`

Mit dieser Abfrage würde Anna nur das gewünschte Produkt und die gewünschte Pizza erhalten.  
Durch dieses Design kann Over- und Underfetching vermieden werden. Doch wie würde die Bestellung geschehen, wenn Anna noch zusätzliche Produkte haben möchte? Dann müssten wir genauso wie beim Supermarkt weitere API-Aufrufe tätigen. Da die API beim Restaurant nicht auf Standards wie EAN-Codes zurückgreift, müssen wir hier schauen, wie die anderen Ressourcen identifiziert werden können. Wie wäre es aber, wenn Anna eine ganze Liste von Produkten aus verschiedenen Ressourcen hätte? Dann brauchen wir ebenfalls mehrere REST-Endpunkte. Das bedeutet, je mehr Ressourcen aus dem Backend angefordert werden, desto mehr Endpunkte sind erforderlich. Hier tritt wieder das Problem auf, dass mehrere Endpunkte erforderlich sind. 

# Die Lösung kommt mit GraphQL 

Den genannten Herausforderungen hat sich Facebook 2012 gestellt und mit GraphQL eine Spezifikation entwickelt. Rund um diese Spezifikation haben sich inzwischen einige Implementierungen und ein vollständiges Ökosystem herausgebildet, welche den Einsatz analog zu REST in aktuellen Projekten unterstützen. GraphQL zeichnet sich durch folgende Punkte aus und hebt sich dadurch von REST-APIs ab.

- Durch eine Abfrage kann der Client Daten aus unterschiedlichen Ressourcen anfordern, z.B. aus Datenbanken oder anderen GraphQL Servern. Die vom Client aufgelisteten Daten werden durch eine Abfrage aus den verschiedenen Ressourcen gesammelt, verpackt und anschließend an den Client gesendet. 
- Der Client kann sich explizit darauf festlegen, welche Daten er haben möchte, “nicht mehr und     nicht weniger”.     
- Ein Endpunkt reicht für alle Abfragen völlig aus. Es werden also keine Endpunkte für PUT,         DELETE und anderen Methoden benötigt. 
  
Diese Anpassungen ermöglichen ein API-Design, welches den Herausforderungen von REST begegnet. Im Folgenden sind noch einmal die Punkte angeführt, für die GraphQL eine Lösung bietet.

**Single Endpoint:**

GraphQL besitzt nur einen Endpunkt. Die Abfragen werden durch Queries beschrieben, sodass nur eine Query an den Endpunkt geschickt werden muss. Diese Query wird in einer speziellen Query-Sprache beschrieben, ähnlich zu SQL. Diese wird anschließend vom Server interpretiert. Zum Besipiel `URL/graphql?query=annaswuensche`. In „annaswuensche“ kann der Client alle Daten beschreiben, die er benötigt. Es ist auch möglich, alle Daten aus dem Server durch eine Abfrage zu beziehen. 

![GraphQL und RESTful APIs](/assets/images/posts/GraphQL-ist-flexibler,-das-Ende-von-RESTful-APIs/APIs.PNG)

**Kein Overfetching und Underfetching:**

Wie bereits beschrieben, legt der Client genau fest, welche Daten er anfordern möchte. Es werden anschließend nur genau jene Daten an ihn zurückgeliefert, nicht mehr und nicht weniger. Daher entsteht kein Over- oder Underfetching von unnötigen Informationen. 

**GraphQL als Wrapper:**

Ein weiteres wichtiges Feature von GraphQL ist, dass GraphQL als Wrapper von unterschiedlichen Ressourcen angelegt werden kann. Dies ist insebsondere von Vorteil, wenn Informationen auf verschiedene Server verteilt sind, beispielsweise bei Datenbanksystemen.

![GraphQL als Wrapper](/assets/images/posts/GraphQL-ist-flexibler,-das-Ende-von-RESTful-APIs/Wrapper.PNG)

**Übersichtlich:**

Der Client muss in den zurückgelieferten Daten nicht nach seinen Anforderungen suchen, da er lediglich die von ihm verlangten Daten erhält.

## Es ist nicht alles Gold was glänzt

Kein Medikament ist frei von Nebenwirkungen. Selbiges lässt sich auch auf Technologien übertragen. 
Nicht jede Technologie ist für jede Herausforderung im Projekt geeignet und es liegt am Software Engineer die geeignete Lösung zu finden. 
GraphQL kam zwar mit vielen guten Lösungsansätzen für bekannte Probleme von REST Web Services, bringt jedoch gleichzeitig neue Herausforderungen mit sich.  

# Wo hat GraphQL seine Schwächen? 

**Kompliziert:**

Der Client genießt die Freiheit, während der Server den gesamten Aufwand auf seinen Schultern zu tragen hat. Auf Grund der Flexibilität, die dem Client angeboten wird, steckt viel Aufwand in der Verarbeitung auf Seiten des Backends. Darüber hinaus ist es herausfordernd mit GraphQL anzufangen. Die Definition einer RESTful-API ist erheblich einfacher und den meisten Entwicklern bekannt, sodass viel Aufwand und Zeit gespart werden kann. 

**Komplexität im Caching:**

Ein sehr wichtiges Feature, welches sowohl dem Client als auch dem Server große Flexibilität bietet, ist das HTTP-Caching. Ermittelte Ergebnisse auf Anfragen des Clients können temporär gehalten werden, um schnellere Responses zu ermöglichen. GraphQL kann von den Möglichkeiten des HTTP-Cachings allerdings nicht profitieren, da alle Anfragen über nur einen Endpunkt bedient werden. Der Vorteil von GraphQL (Single Endpoint) wird hier zum Nachteil, da die in der URL enthaltenen Query-Anfragen nicht eindeutig sind. Der Server weiß daher nicht, welche Daten der Client zuvor angefordert hat. Demzufolge ist ein Caching in GraphQL nur schwierig zu implementieren. Lösungen bieten Tools wie DataLoader, um das Caching in GraphQL zu vereinfachen. Demgegenüber ist dieses Feature bei REST deutlich einfacher einzusetzen.

**Anfragen können ertrinken:**  

In der Graphentheorie ist ein Baum ein spezieller Typ eines Graphen. Ebenso kann eine Query als Baum dargestellt werden. GraphQL beschränkt die Tiefe eines Baumes nicht, womit der Client Freiheiten gewinnt. Daraus ergibt sich aber auf der anderen Seite auch, dass über eine Abfrage riesige Mengen von Daten eines Zweiges geladen werden können, bis ein Blatt erreicht wird. Demzufolge wird der Server mit vielen Daten belastet und die Verarbeitung einer Anfrage verlängert sich. Diese Anfragen könnten auch zu einem Serverausfall führen. Verschiedene Endpunkte in RESTful-APIs haben also nicht nur Nachteile, sondern auch viele Vorteile. Eine komplizierte Anfrage kann mit den RESTful-Endpunkten problemlos und einfach implementiert werden, denn ein Endpunkt liefert feste Datenstrukturen zurück, sodass ein Entwickler die Menge der Daten beschränken und den Server schützen kann.   

**Workaround, um eine Datei hochzuladen:**

Eine Datei mittels GraphQL hochzuladen, ist nicht auf direktem Wege möglich, wie es beispielsweise bei RESTful-APIs der Fall ist. Die “Mutations” in GraphQL können Dateien nicht interpretieren, weshalb Entwickler die Datei zuerst in Base64 konvertieren und die Enkodierung der Mutation-Anfrage übergeben müssen. Alternativ kann die Datei mittels RESTful-API hochgeladen werden und GraphQL als Wrapper benutzen, um die URL der Mutation-Anfrage übergeben zu können. Es sind weitere Lösungsansätze bekannt, doch in den meisten Fällen ist dieser Prozess komplizierter und aufwändiger umsetzbar als über RESTful-APIs.  

Wie bereits gesehen, gibt es mit GraphQL auch einige Herausforderungen, die Facebook allerdings mittlerweile mit neuen Lösungsansätzen zu beheben versucht. Diese erhöhen die Komplexität der Implementierung. Eine mächtige, fehlerfreie und saubere Graph-API zu erreichen erfordert Know-How und Aufwand.  

# GraphQL löst RESTful-APIs nicht ab

Wenn wir uns das "Richardson Maturity Model" von Leonard Richardson anschauen, stellen wir fest, dass GraphQL sich nur mit REST-APIs mit Level 2 aus dem beschriebenen Modell vergleichen lässt und sich vom echten REST-Konzept distanziert. Das heißt, wir können erst über eine "vollständige" REST-API sprechen, wenn diese den höchsten Reifegrad, nämlich Level 3, erreicht hat. Fakt ist aber leider, dass viele Entwickler nicht die "vollständige" REST-API benutzen, sondern die REST-API auf Level 2. Daher ist es wichtig, das Konzept von REST nicht herabzumindern.

![Richardson Maturity Model](/assets/images/posts/GraphQL-ist-flexibler,-das-Ende-von-RESTful-APIs/Richardson-Maturity-Model.PNG)

Welche der beiden Technologien nun die Bessere ist, lässt sich nicht final besiegeln. Auf Grund der negativen und positiven Aspekte, welchen beiden anhaften, lässt sich die Entscheidung nur sehr individuell und auf Basis der Projektsituation treffen. GraphQL ist aufgrund der Flexibilität im Umgang mit großen Datenmengen deutlich besser geeignet als RESTful-APIs, wenn die Applikation mit Massendaten arbeitet und diese aus verschiedenen Ressourcen bezieht. Für kleine Applikationen wird GraphQL hingegen beinahe zum Overkill für die Applikation. In diesem Fall sollten RESTful-APIs eingesetzt werden, um unnötige Komplexität von GraphQL zu vermeiden. Ebenso wie bereits im Absatz “Anfragen können ertrinken” beschrieben, übertrifft REST im Falle komplizierter Anfragen GraphQL, da mittels REST-APIs sowohl die Perfomance, als auch die Serverauslastung solcher Anfragen einfacher sicherzustellen sind, während man mit GraphQL schnell den Überblick verlieren kann und dabei Serverausfälle durch eine schlechte Umsetzung auftreten können. 

# Ein Ausblick – Symbiose beider Ansätze

Da die meisten modernen Applikationen bereits mit REST entwickelt wurden, kann eine Kombination von GraphQL und RESTful-APIs sinnvoll sein. In diesem Fall ist die Umsetzung der RESTful-APIs nach GraphQL nicht notwendig, um von einigen GraphQL-Vorteilen zu profitieren. 

![GraphQL als Gateway](/assets/images/posts/GraphQL-ist-flexibler,-das-Ende-von-RESTful-APIs/Gateway.PNG)

Wir haben gesehen, dass GraphQL Daten aus verschiedenen Ressourcen abrufen kann. Dies können wir uns zu Nutze machen, indem wir GraphQL als Gateway verwenden, um bereits vorhandene REST-Endpunkte aufzurufen und Informationen anzufordern. Der Client kann damit von der Flexibilität von GraphQL profitieren, ohne REST in GraphQL umsetzen zu müssen. 
