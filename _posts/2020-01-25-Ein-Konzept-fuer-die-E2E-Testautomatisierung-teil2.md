---
layout: [post, post-xml]                                                # Pflichtfeld. Nicht ändern!
title:  "Ein Konzept für die E2E Testautomatisierung (Teil 2)"          # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2020-01-25 09:00                                                # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2020-01-25 09:00
author: andernach                                                       # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: [Branchen & People]                                         # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Testing, Softwarequalitätssicherung, Oberflächentests]           # Optional.
---
# Ausgangszustand der Testinfrastruktur wiederherstellen

Im Idealfall wird für die Ausführung der E2E Tests eine neu erstellte Testinfrastruktur (Eine Infrastruktur, die der Endnutzer als Softwarelösung benutzen wird; hier sind sowohl die Bedienoberfläche als auch die Backend-Systeme gemeint) aufgesetzt und die Tests laufen gegen eine möglichst eine unangetastete Umgebung (Backendsysteme).

Da das Vorgehen meistens aufgrund des Bauens der Umgebung viel Zeit in Anspruch nimmt, wird in der Praxis der Einsatz einer bereits gebauten Umgebung favorisiert, auf der eventuell mehrere Teammitglieder testen und Änderungen vornehmen können.


Dieses Vorgehen ist nicht zu empfehlen und führt meistens zu inkonsistenten Testergebnissen.
Die Testinfrastruktur, in der die automatisierten E2E Tests laufen soll für die Entwickler nicht zugängig sein. 
Vielmehr ist hier die Expertise eines DevOps-Entwicklers notwendig.


Das Aufsetzen einer Testinfrastruktur mit unangetasteten Testdaten soll nicht so viel Zeit in Anspruch nehmen (z.B. durch die Bereitstellung fertiggebauter Artefakte und Container).
Die Pipeline von E2E Tests oder anderer Routine kann somit auf Basis der bereitgestellten Artefakte eine Testinfrastruktur aufsetzen und mit unangetasteten Testdaten (Nutzer und Berechtigung, Nutzer und Nutzergruppen … usf.) aufsetzen.


Mit Hilfe von Docker könnte solche Testinfrastruktur für die Durchführung hochgefahren und nach Abschluss der Testaktivitäten heruntergefahren werden.
So wird der Ausgangzustand der Testinfrastruktur wiederholt auf identische Weise hergestellt und die gelieferten Ergebnisse gewinnen an Aussagekraft.

# Testausführung

Je nachdem, in welcher Phase sich die Produktentwicklung befindet, kann die Aussagekraft und Relevanz der gelieferten Ergebnisse der Testfälle variieren.
Nehmen wir an, dass die zu testende Anwendung (hier ist die Oberfläche einer Softwarelösung gemeint; fortan die Anwendung) und die E2E Tests in separaten Repositories gepflegt sind.
Hierfür gibt es verschiedene Überlegungen:

•	**Am Anfang der Entwicklung** können die Testfälle (fortan sind Oberflächentestfälle gemeint) in einer eigenen spezifizierten Pipeline4 losgelöst von der Pipeline der Anwendung ausgeführt werden.
So kann beispielsweise eine gewisse Anzahl von Testfällen als Smoketests (Testsuite, die die Hauptfunktionalität einer Komponente oder eines Systems abdeckt, um vor Beginn der geplanten Testausführung festzustellen, ob die Komponente oder das System ordnungsgemäß funktioniert) ausgeführt werden, die in einer nächtlichen Pipeline ausgeführt werden und bei erfolgreicher Ausführung einen anderen Pipeline-Step auslöst, der dann die restlichen Tests ausführt.

•	**Im Laufe der Entwicklung** sollte die E2E Tests-Pipeline enger mit der Anwendungspipeline verzahnt werden.
Idealerweise laufen die E2E Tests gegen die Änderungen im Anwendungsrepository nach dem [Commiten](https://git-scm.com/) und vor dem Mergen dieser Änderungen.


Auf diesem Wege  kann sichergestellt werden, dass die vorgenommene Änderung keine Regressionsfehler verursacht hat.
Da die Ausführung von automatisierten E2E Tests in der Regel länger läuft, könnte das Vorgehen durch eine Option deaktiviert werden.
Das ist besonders hilfreich, wenn ein Hotfix (wie z.B. die Änderungen an einem Menütext) gemergt und geliefert werden soll.

Es sollte zudem möglich sein, dass die E2E-Testfälle nur bei Änderungen in UI Modulen angestoßen oder allgemein mitausgeführt werden können.

![Pipeline Stages](/assets/images/posts/konzept-fuer-die-e2e-testautomatisierung/pipeline.png)      


Die Ausführung der Testfälle gegen ein bestimmtes Release, das letzte Release, den letzten Entwicklungsstand (Masterstand) oder auch gegen einen Commit kann von Vorteil sein.
Bei Letzterem könnten die vorgenommenen Änderungen zu Regressionsfehler führen, die dadurch bereits vor dem Mergen erkannt werden können.


Dies ist hilfreich vor Allem dann, wenn großflächige Änderungen oder eine Refrakturierung zentraler Komponenten vorgenommen worden sind. 
Die Ausführung findet auf einer anderen Ressource als dem Entwicklerrechner statt, sodass der Entwickler während der Laufzeit der Tests nicht behindert wird und sich anderen Aufgaben widmen kann.
Das Ausführen von Testsuites soll benutzerfreundlich sein und kein technisches Wissen erfordern.
Am benutzerfreundlichsten ist es, wenn sich in der Pipeline einzelne Testsuites zum Ausführen auswählen lassen.

# Gut benannte Ids sind für das Testing 

Wie wir im Page Object Pattern gesehen haben, könnten wir mit den Selektoren UI Elemente auswählen und mit denen interagieren.
Es gibt verschiedene Selektortypen. Lasst uns folgende Codeabschnitt anschauen:
```html
<html>
<!-- some code here. --> 
 <div id="login-Dialog" class="modal">
 
   <form class="modal-content animate" action="/action_page.php" method="post">
     <div class="imgcontainer">
       <span onclick="document.getElementById('login-Dialog').style.display='none'" class="close" title="Close Modal">&times;</span>
       <img src="img_avatar2.png" alt="Avatar" class="avatar">
     </div>
 
     <div class="container">
       <label for="uname"><b>Username</b></label>
       <input type="text" placeholder="Enter Username" name="uname" id="username-textfield"required>
 
       <label for="psw"><b>Password</b></label>
       <input type="password" placeholder="Enter Password" name="psw" required>
 
       <button type="submit">Login</button>
       <label>
         <input type="checkbox" checked="checked" name="remember"> Remember me
       </label>
     </div>
   </form>
 </div>
<!-- some code here. --> 
</html>
``` 
in diesem Codeabschnitt können wir 3 Arten der Abfragen benutzen, um UI Elemente auszuwählen und mit denen zu interagieren:


•	**Absoluter Pfad**: Wir können das *Inputfield Username* mit dem absoluten Pfad **`/html/body/div/form/div[2]/input[2]`** auszuwählen. 
Der absoluter Pfad enthält die komplete Pfad für die Positionierung eines Element im DOM Baum.


•	**Relativer Pfad**: mit der Abfrage **`//*[@id="login-Dialog"]/form/div[2]/button`** können wir die *Eingabetaste Login* auswählen.
Relative Pfade beginnen mit *//**.
Im gegensatz zu absoluten Pfaden fangen die relativen Pfaden mitten im DOM Baum an.


•	**Die XPath-Abfrage mit Id**: Die XPath-Abfrage(ist eine Abfragesprache, um Teile eines XML Dokuments zu adressieren und auszuwerten) würde so aussehen **`//*[@id="username-textfield"]`**.
Weil für das Element während der Entwicklung eine eindeutige ID gesetzt wurde, können wir anhand die in unserer Abfrage benutzen.
 
Durch das Setzen von Ids für die UI Elemente und das Vermeiden von langen absoluten und relativen Pfaden kann die Fragilität und die Brüchigkeit der E2E Tests deutlich verringert werden.
Die XPath-Abfrage mit ID ist für das Zugreifen auf UI Elementen geeigneter als die relativen und absoluten Pfaden.
Denn je kürzer ein Pfad eines Elements ist, desto zugreifbarer sind die Elemente.


Die XPath-Abfrage ist kurzer als absoluten und relativen Pfaden und dadurch weniger fragil. 
Es gibt noch weitere Möglichkeiten, um Elemente im HTML zu adressieren.
Es ist z.B. in Angular-Welt geläufig, dass man *data-id* Attibut setzt. Die XPath-Abfrage kann dann etwas so aussehen **`//*[@data-id="..."]`**. 

 
Ein Bewusstsein für die Wichtigkeit des Setzens der IDs und deren richtiger Benennung sollte im Entwicklungsteam aufgebaut werden.
Eine einheitliche Notation kann nicht nur die Codelesbarkeit und die Logiklesbarkeit erhöhen, sondern auch die Wartbarkeit und die Fehlerbehebung in E2E Tests verbessern, da die zu testenden Elemente über ihre eindeutigen Ids durch den Test besser zugreifbar sind. 

# Ausblick

Wir haben gesehen, dass der Ausgangzustand der Testlandschaft eine wichtige Voraussetzung für die Testausfhrung.
Wir haben auch gesehen, dass wir mittels XPath-Abfrage UI-Elemente adressieren und auswerten können.
Doch wie können wir aus Ids brauchbare Codeabschnitte erzeugen, um Zeit zu sparren und uns auf spannendere Aufgaben zu fokussieren.

In dritten Teil meiner Blogserie geht es spannender weiter. 
wir werfen einen Blick auf einen Code Generator auf.

Ihr möchtet mehr zum Thema Testaufbau wissen? Dann werft auch einen Blick in meinen ersten Blog-Beitrag.   
