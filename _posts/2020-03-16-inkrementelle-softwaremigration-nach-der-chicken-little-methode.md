---
layout: [post, post-xml]             
title:  "Inkrementelle Softwaremigration nach der Chicken-Little-Methode"
date:   2020-03-16 01:23             
author: mschick                     
categories: [Methodik]                   
tags: [Migration, Softwaremigration, Legacy Software, Maintenance]  
---

Dieser Artikel widmet sich dem Umgang mit sogenannter **Legacy Software**, also all jenen Anwendungen aber auch ganzen Softwaresystemen, deren zugrundeliegende Technologie durch den immerwährenden Fortschritt in der IT-Welt inzwischen als veraltet gilt.   

Aber wann gilt eine Software oder ein ganzes Softwaresystem überhaupt als veraltet?
Steht dann gleich eine vollständige Neuentwicklung in's Haus oder gibt es Alternativen? 
Mit welchen Risiken und Schwierigkeiten wird man bei einer Modernisierung solcher Anwendungen und Systeme konfrontiert?

Auf all diese Fragen versucht dieser Artikel eine Antwort zu liefern. 
Insbesondere soll hier die **Softwaremigration** im Allgemeinen und das *inkrementelle Vorgehen* nach der **Chicken-Little-Methode** im Speziellen, als mögliche Alternative zur Neuentwicklung vorgestellt werden. 

Zunächst erfolgt aber nochmal eine Einführung in die **Legacy Problematik**.
  
# Die Legacy Problematik

Irgendwann im Lebenszyklus eines Softwaresystems, wird der Punkt erreicht, an dem dieses als veraltet gilt und modernisiert werden muss. 
In der wissenschaftlichen Literatur findet man Definitionen, die besagen, dass die *Halbwertszeit* von Software im Schnitt fünf Jahre beträgt und im Anschluss daran  zur *Legacy Software* gehört, also veraltet ist.   

Die Gründe für das Veralten von Software und ganzen Systemen liegen hierbei auf der Hand. 
Durch die rasante Entwicklung und dem permanenten Fortschritt im IT-Bereich kommen immerzu neue Technologien auf den Markt. 
Dazu zählen beispielsweise neue Programmiersprachen oder aber auch *Frameworks*, die die aktuellen Standards der Softwaretechnik implementieren. 
Auf der anderen Seite fallen dafür veraltete Technologien weg; zumeist durch Einstellung von Entwicklung und Support. 
Neben der Software kann auch die zugrundeliegende Hardware veralten und einen Austausch erforderlich machen.
Ist die darauf betriebene Software nicht kompatibel mit der neuen Hardware, zwingt einen unter Umständen auch dieser Umstand zur Modernisierung des oftmals kompletten Systems. 

Dieser Beitrag beschäftigt sich im ersten Teil mit den Möglichkeiten zur Softwaremodernisierung mittels der *Softwaremigration*.
Dabei liegt der Fokus auf der **Chicken-Little-Methode**, einem inkrementellen Vorgehen bei der Migration, welche eine Alternative zur vollständigen Neuentwicklung bildet. 

Dazu erfolgt zunächst die theoretische Auseinandersetzung mit dem Thema **Softwaremigration**. Dabei sollen auch das Für und Wider dieser Variante mit denen, der anderen Alternativen wie namentlich dem **Weiterbetrieb**, die vollständige **Neuentwicklung** oder die **Ablösung durch Standardsoftware** gegenübergestellt werden.

Im zweiten Teil, in Form eines eigenständigen Artikels, erfolgt die praktische Demonstration der **Chicken-Little-Methode** am Beispiel einer **Frontend-Migration** einer Webanwendung. 

Beginnen wir zunächst mit den *Basics* der Softwaremigration. 
 
# Beibehalten, Neuentwickeln oder doch migrieren?
Wann ist eine Softwaremigration sinnvoll? Welche Alternativen bieten sich außerdem? Um diese Fragen beantworten zu können, muss sich zunächst mit den Vor- und Nachteilen der einzelnen Möglichkeiten auseinander gesetzt werden. 

Dazu werden drei der Möglichkeiten, nämlich der *Weiterbrieb*, die *Neuentwicklung* und die *Softwaremigration* im einzelnen nochmal etwas detaillierter betrachtet.

## Weiterbetrieb veralteter Software
Getreu dem Motto *Never change a running system* hat man grundsätzlich die Möglichkeit, ein veraltetes Softwaresystem auch einfach weiter zu betreiben, wenn es die an das System gestellten Anforderungen noch zufriedenstellend erfüllt. 
Entscheidet man sich für diese Variante, nimmt man gleichzeitig auch die Risiken und daraus resultierenden Einschränkungen in Kauf, spart sich gleichzeitig aber auch die Kosten und Risiken die mit einer Modernisierung einhergehen würden.

Zu den angesprochenen Risiken gehören insbesondere der gesteigerte Aufwand hinsichtlich der *Wartung* und der *Erweiterung* des Systems bzw. der Software. 
Treten beispielsweise in einem Framework, dessen Entwicklung bereits eingestellt wurde, nachträglich Sicherheitslücken auf, müssen diese manuell identifiziert und behoben werden. 
Das bindet nicht nur Ressourcen und Personal sondern spiegelt sich nicht zuletzt auch in erhöhten Kosten für den Weiterbetrieb wider.   

Darüber hinaus bietet moderne Technologie häufig auch neue Möglichkeiten, die die Entwicklung neuer Features deutlich beschleunigen. 
Manchmal bedingen auch die Schnittstellen, extern angebundener Systeme das eigene System dahingehend anzupassen.
Verzichtet man hier auf die Möglichkeiten moderner Technologie, ist auch hier wieder mit erhöhten Kosten für die Weiterentwicklung des Altsystems zu rechnen.
Darüber hinaus spiegelt sich die oben beschriebene Problematik in Form von *Workarounds* wider.
Solche *Workarounds* haben die Eigenschaft, über die Zeit und mit steigender Anzahl den *Quellcode* aufzublähen. 
Die daraus resultierende, wachsende Komplexität erschwert im Anschluss die Wartbarkeit und Pflege des Projekts.  

Mit fortschreitendem Alter einer Software, gesellt sich außerdem noch eine weitere Schwierigkeit hinzu: 

Je älter eine Software ist, desto schwieriger wird es, geeignete Entwickler zu finden, die sich damit auskennen. 
Als prominentes Beispiel hierfür sei die Programmiersprache `COBOL` genannt, die in den späten 50er Jahren des letzten Jahrhunderts entstand und bis heute noch vor allem im Versicherungs- und Bankensektor eingesetzt wird. 
Damit diese Systeme weiter betrieben werden können, braucht es erfahrenes Personal. 
Angesichts der Tatsache, dass Entwickler heutzutage wohl kaum noch solch antiquierte Programmiersprachen lernen wollen ist dies ein wesentlicher Aspekt, der in die Entscheidung, ob eine Moderniserung erfolgen soll oder nicht, auf jeden Fall einfließen sollte.     

## Neuentwicklung
Eine Alternative zur Beibehaltung veralteter Software bildet die komplette Neuentwicklung des Projekts. 
Der Vorteil hierbei ist, dass man die Möglichkeit hat, sich mit einem Schlag aller Altlasten und technischen Schulden
 zu entledigen. 
 
Diese Variante ist aber nicht nur die teuerste, sondern gleichzeitig auch diejenige, die mit dem höchsten Risiko verbunden ist. 
Besonders davon betroffen ist jene Software, in welche während der Entwicklung und der anschließenden Wartung über die
Jahre einiges an Experten-Wissen eingeflossen ist. 
Häufig sind die Entwickler die bei der initialen Programmierung involviert waren nicht mehr verfügbar. 
Im schlimmsten Fall kann noch nicht mal auf eine Dokumentation zurückgegriffen werden.
In solchen Fällen droht immer der Verlust dieses Expertenwissens.
 
Fehler und Probleme die schon während der Neuentwicklung oder aber erst im Anschluss an den Release auftreten, müssen nachträglich korrigiert werden. 
Neben den Auswirkungen auf den betrieblichen Geschäftsablauf, zieht dies außerdem zum Teil hohe, nicht abschätzbaren Folgekosten in der Entwicklung sowie Verschiebungen im Zeitplan nach sich. 
Handelt es sich hierbei dann auch noch um geschäftskritische Prozesse, die von der Software abgewickelt werden sollen, sind die dadurch entstehenden, wirtschaftlichen Schäden enorm.  

Aufgrund der genannten Schwierigkeiten und den, gerade bei komplexeren Anwendungssystemen häufig nicht zuverlässig abschätzbaren Umfang von Kosten und Zeit, wird diese Vorgehensweise zur Modernisierung von veralteten Systemen, wo möglich, gerne vermieden.

## Softwaremigration
Die **Softwaremigration** ist ein Vorgehen, welches es ermöglicht, ein Softwaresystem auf einen neuen Stand zu heben und dabei die oben beschriebene Problematik bei einer Neuentwicklung zu umschiffen.
Hierbei handelt es sich um eine **rein technische Transformation** einer Software bzw. eines ganzen Softwaresystems von *Technologie A* in *Technologie B*. 

Wesentlich für eine Softwaremigration ist, dass die Geschäftslogik hiervon gänzlich unberührt bleibt und 1:1 in das Neusystem übernommen wird. 
Dadurch soll gewährleistet werden, dass sich das Neusystem identisch zum Altsystem verhält und der Erfolg der Migration im Anschluss beispielsweise durch Regressions-Tests messbar wird. 

Aus diesem Grund ist es für das Gelingen des Migrationsvorhaben äußerst wichtig, dass die Migration nicht mit Refactoring-Maßnahmen oder Funktionserweiterungen vermischt wird. 
Solche Anpassungen müssen entweder vor der Migration noch am Altsystem vorgenommen und in das Neusystem übernommen werden oder aber im Anschluss an die Migration durchgeführt werden. 

Eine Softwaremigration kann sowohl das ganze Softwaresystem als auch einzelne Teile daraus, wie z.B. die **Datenhaltung**, die **Programme** und **Prozesse** oder die **Benutzeroberfläche** umfassen und erfolgt typischer Weise entweder durch eine händische **Reimplementierung**, automatische **Konvertierung** mittels dafür vorgesehener Tools oder aber durch **Kapselung** des Programmcodes. 

# Migrationsstrategien
In Wissenschaft und Forschung haben sich verschiedene Vorgehensmodelle und Strategien zur erfolgreichen Durchführung einer Softwaremigration entwickelt. 
Die Auswahl einer solchen Strategie erfolgt immer individuell und auf Basis des jeweiligen Migrationsvorhabens. 
Es gibt Strategien die ihren Fokus auf bestimmte Migrationsarten, wie z.B. die Datenmigration richten und solche, die sich bei bestimmten Softwaretypen oder ganzen Systemarchitekturen empfehlen.
Als ein weiteres Unterscheidungsmerkmal dient hier außerdem der jeweilige **Migrationsansatz**:

Es gibt darüber hinaus Strategien, die einen *inkrementellen Ansatz* verfolgen bei welchem einzelne Bestandteile separat migriert und im Anschluss daran direkt wieder im Altsystem integriert werden. 
Bei anderen Strategien hingegen erfolgt die Migration in einem Parallel-System.
Hierbei wirkt sich die Migration erst nach der vollständigen Durchführung und mit der Umstellung von Alt auf Neu aus.

# Die Chicken-Little-Methode

Bei der *Chicken-Little-Methode* handelt es sich um eine Strategie, die den *inkrementellen Migrationsansatz* verfolgt und in diesem Artikel näher betrachtet werden soll.  
Diese Strategie wurde als Alternative zur vollständigen Neuentwicklung, von *Brodie & Stonebraker* entwickelt. 

*Chicken-Little* ist übrigens der Name einer Figur aus dem gleichnamigen [Kurzfilm von Walt Disney](https://en.wikipedia.org/wiki/Chicken_Little_(1943_film)), der während des Zweiten Weltkrieges entstand und einen Angsthasen charakterisiert. 
Die Namenswahl dieser Methode soll unterstreichen, dass das kleinteilige Vorgehen mit dieser Methode, die Risiken und Probleme gegenüber einer Neuentwicklung deutlich reduziert.
 
Bei der *Chicken-Little-Methode* werden Teile eines Softwaresystems isoliert migriert und im Anschluss daran direkt wieder im Altsystem über *Schnittstellen* integriert. 

Die *Chicken-Little-Methode* ist flexibel anwendbar und kann sowohl für vollständige **Systemmigrationen** als auch einzelne Teilbereiche (**Daten-**, **Programm-** und **Benutzeroberflächen-Migrationen**) verwendet werden. 

Bei **Systemmigrationen** ist vor der Migration noch festzulegen, ob die Datenbank als erstes (**Database first**) oder im letzten Schritt (**Database last**) migriert werden soll. 
Diese Entscheidung beeinflusst unter anderem die zu entwickelnden Schnittstellen im System. 
Im ersten Fall sind sog. **Forwared Gateways** zu entwickeln, die das Altsystem an die migrierte Datenbank anbinden.  
Im Gegensatz dazu managen **Reverse Gateways** den Zugriff auf die Datenbank über das Altsystem.
Jeder Durchgang der Migration besteht dabei aus insgesamt elf Schritten.
Diese können in beliebiger Reihenfolge durchgeführt oder aber auch komplett ausgelassen werden, wenn diese für das aktuelle Migrationsvorhaben überflüssig sind. 

In **Schritt 1** erfolgt zunächst eine Analyse des Altsystems und darauf basierend die Auswahl von geeigneten Migrations-Kandidaten.
Hierbei sollte beachtet werden, dass diese keine starken Abhängigkeiten zu den restlichen System-Bestandteilen aufweisen. 
Diese müssen ansonsten vorab, in **Schritt 2**, aufgelöst werden. 
In dieser Phase werden außerdem Entscheidungen darüber getroffen, ob, und wenn ja, in welcher Form *Gateways* zu entwickeln sind. 

In den **Schritten 3-5** erfolgt der **Entwurf der Zielanwendung**. 
Dabei werden die *Benutzeroberflächen*, *Anwendungen und Programme* sowie die *Datenhaltung* separat betrachtet.
Die Installation der notwendigen *Gateways* erfolgt im **Schritt 6**. 

In den **Schritten 7-10** erfolgt die eigentliche Migration der einzelnen Bestandteile in die Zielumgebung bevor im abschließenden **Schritt 11** die Integration der Migration im Altsystem vorgenommen und damit *scharf geschaltet* wird.

Mit der nächsten zu migrierenden Komponente, wird das oben beschriebene Prozedere erneut durchgelaufen, bis schlussendlich die Migration mit der letzten Migration vollständig abgeschlossen ist. 

Die nachfolgende Tabelle gibt nochmals einen Überblick über die jeweils zu durchlaufenden Schritte: 

Schritt                                   | Beschreibung
------------------------------------------|--------------------------------
| 1.  **Altsystem Analyse**               | In diesem Schritt werden einzelne, für die Migration geeignete Komponenten ausgemacht
| 2.  **Strukturierung des Altsystems**   | Ggf. vorhandene Abhängigkeiten zu anderen Komponenten werden hier vor der Migration aufgelöst.
| 3.  **Entwurf der Ziel-Interfaces**     | Entwurf der Benutzerschnittstellen sowie Definition notwendiger Gateways
| 4.  **Entwurf der Ziel-Anwendungen**    | Übernahme oder Reimplementierung der Funktionalitäten 
| 5.  **Entwurf der Ziel-Datenbank**      | In diesem Schritt erfolgen Anpassungen an der Datenbank
| 6.  **Installation d. Zielumgebung**    | Installation der Ziel- und Entwicklungsumgebung
| 7.  **Gateway Installation**            | Implementierung der benötigten Gateways
| 8.  **Migration der Datenbank**         | Installation und anschließende Migration der Daten in die neue Zieldatenbank
| 9.  **Migration der Anwendungen**       | Einzelne Programme und Anwendungen werden in der Zielumgebung implementiert
| 10. **Migration der Benutzerobflächen** | Migration der Benutzeroberfläche
| 11. **Umstellung auf Neusystem**        |  Umstellung auf die migrierten Bestandsteile
   
Ein Vorteil der sich aus der **Chicken-Little-Methode** ergibt ist, dass Fehler in der Migration, durch die direkte Verwendung im System, frühzeitiger erkannt und behoben werden können. 
Schlägt die Migration in einem Teilschritt fehl, so ist lediglich dieser Teilschritt zu wiederholen, was, verglichen mit der Neuentwicklung, deutlich weniger Kosten und Zeitverlust nach sich zieht und auch die Gefahr von negativen Auswirkungen im Altsystem auf ein überschaubares Maß reduziert und dadurch insgesamt kontrollierbarer macht. 

# Zusammenfassung
Die **Chicken-Little-Methode** bietet eine gute Alternative zur Neuentwicklung von veralteter Software und ganzen Software-Systemen. 
Durch das kleinteilige Vorgehen während der Migration, bleiben die Kosten und Risiken zu jeder Zeit überschaubar und beherrschbar.  
Da von jedem Migrations-Schritt immer nur eine kleine Anzahl von Komponenten betroffen sind, sind die Auswirkungen bei einem Fehlschlag der Migration gering.
In einem solchen Fall ist dann lediglich der betroffene Migrationsschritt zu wiederholen. 

Darüber hinaus bietet die direkte Integration der migrierten Komponenten ins Altsystem die Möglichkeit, mögliche Probleme die so während der Planung des Migrationsvorhaben noch nicht bekannt waren, vorzeitig zu erkennen und im weiteren Verlauf zu behandeln. 
Bei der *vollständigen Neuentwicklung* hingegen, wäre die Gefahr groß, dass sich solche Probleme und Fehler erst nach dem Release auswirken bzw. bekannt werden und wie bereits erwähnt, in der Folge aufwändig behoben werden müssen.

Ein Kritikpunkt, der in Verbindung von **Software-Migration** und der **Chicken-Little-Methode** am häufigsten geäußert wird, ist der *Mehraufwand in der Entwicklung*, der durch die zu implementierenden Schnittstellen für die Kommunikation von Alt- und Neusystem entsteht.  
Um dem zu begegnen, gibt es Migrationsstrategien wie bspw. die [**Butterfly Methode**](https://ieeexplore.ieee.org/document/622311), die ebenfalls einen inkrementellen Ansatz verfolgt aber auf die Entwicklung von Gateways verzichtet.
Anstatt migrierte Komponenten direkt wieder in das Altsystem zu integrieren, erfolgt hier die Entwicklung in einem *Parallel-System*.  
Nach der vollständigen Migration wird das Altsystem deaktiviert und auf das Neusystem umgeschaltet.

Trotz der Kritik o.g. Kritik ist die **Chicken-Little-Methode** ein geeignetes Mittel für eine sichere Modernisierung eines Altsystems oder einzelnen Teilen davon. 

Spätestens wenn es darum geht, eine **monolithische Architektur** in eine **verteilte Architektur** zu überführen, kann sich die o.g. genannte Kritik auch zu einer Stärke entwickeln, da hierbei von Natur aus schon Schnittstellen notwendig werden. 

In einem weiteren Artikel werde ich das Vorgehen nach der **Chicken-Little-Methode** und dessen flexible Anpassung an die verschiedenen Migrationsarten am praktischen Beispiel einer Webanwendung demonstrieren. 
Dabei wird es sich im Speziellen um eine **Frontend-Migration** handeln bei der die gegenwärtig eingesetzten **Server-Side-Rendering**-Technologien durch solche des **Client-Side-Renderings** migriert werden sollen.



 

 
 








 



