---
layout: [post, post-xml]                                    # Pflichtfeld. Nicht ändern!
title:  "Ein Konzept für die E2E Testautomatisierung"       # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2020-01-07 09:00              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2020-01-07 09:00
author: andernach                      # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: [Branchen & People]       # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Testing, Softwarequalitätssicherung, Oberflächentests]                       # Optional.
---

Nach den allgemeinen Prinzipien des Softwaretestens sollten die Tests die Anwesenheit von Fehlern anzeigen. Keine Fehler zu finden bedeutet, dass ein brauchbares System vorliegt 1, das die Akzeptanzkriterien  erfüllt und das System zur Abnahme bereit ist.
Die Erfüllung dieser Akzeptanzkriterien sollen über den gesamten Entwicklungszeitraum wiederholt getestet.
Hierbei gibt es verschiedene eingesetzte Prüftechniken und Testverfahren wie z.B. das manuelle Testen oder auch das sogenannte End to End Testing (E2E), die die Anwesenheit von Fehlern anzeigen und die angemessene Erfüllung der Anforderungen aus einer funktionalen Sicht der Anwender sicherstellen.
Das E2E Testing bietet die Möglichkeit, dass das gesamte Softwareprodukt anhand produktionsähnliche Szenarien vom Anfang bis zum Ende automatisiert getestet wird, um sicherzustellen, dass sich der Anwendungsfluss wie erwartet verhält.
Somit ist das E2E Testautomatisierung ein benutzernahes Testvorgehen und eine sehr gute Alternative zum manuellen testen, wenn das E2E Testing adäquat umgesetzt ist.
Im Vergleich zum manuellen Testen können automatisierten E2E Tests automatisiert und wiederholt ausgeführt werden, erfordern keine geschulten Testern oder menschliches Eingreifen und lassen sich im gesamten Entwicklungsprozess des Softwareprodukts besser integrieren.

Im Folgenden werden Aspekte dargestellt, die im Rahmen der Realisierung eines umfangreichen Software-Projekts ausgearbeitet wurden.
Wir werden uns mit einer Softwarelösung beschäftigen, die aus einer Bedienoberfläche (fortan die Anwendung) und den Backendsysteme (fortan Umgebung) besteht.
Die Anwendungsentwicklung und die Umgebungsentwicklung sind wahrscheinlich voneinander losgelöst. 

#Testaufbau
Eine gut durchgedachte Struktur ist für die Entwicklung eines Tests notwendig.
Eine Struktur, die die grafische Benutzeroberfläche (UI) Darstellung, UI Logik und Testdaten voneinander trennt, erleichtert die parallele Entwicklung und macht einen Code wesentlich wartbarer, als einen Boiler Plate-Code (Die Codeabschnitte, die an vielen Stellen in mehr oder weniger unveränderter Forum benötigt werden).
Denn ein Boiler Plate-Code könnte auf Anhieb durch das Kopieren und Hinzufügen von Codeabschnitten schnelle Ergebnisse liefern, würde aber auf Dauer kostspieliger in der Wartung sein. 
Beispielhaft wird im Folgenden eine einfache Login Seite mit zwei Textfeldern für Nutzername und Passwort sowie einem Button für den Login und ein Button für die Registrierung getestet.
Die untenstehende Grafik stellt beispielhaft eine Struktur dar:
![Vorgeschlagene Struktur](/assets/images/posts/konzept-fuer-die-e2e-testautomatisierung/struktur.png)      
Die Struktur besteht im Einzelnen aus: 	
* __UI__: Die UI Darstellung wird mit Hilfe einer Abstrakten Klasse (AbstractPage) als Oberklasse realisiert, von der alle Anwendungsseiten erben.
Eine Klasse (Die Klasse für den Test der Login Seite in unserem Beispiel) besteht aus : UI Elementen (wie die Eingabefelder für den Benutzername und Password, Bestätigungstaste Login) und möglichen Interaktionen mit den Elementen (z.B. Bestätigungstaste anklicken).
Diese Interaktionen werden durch Methoden für andere Klassen ( Testschritte ) zur Verfügung gestellt. 
* __Testschritte__: Die einzelnen Testschritte werden in Klassen gegliedert.
Die Klassen interagieren mit der UI und stellen Methoden zur Verfügung, die komplette Prozesse oder Teilprozesse wie z.B. das Befüllen eines Formulars für die Eingabe von Login Daten anbieten.
Eine Testschritte-Klasse kann in unserem Beispiel die Methode (Anmelden als) anbieten.
Die zur Verfügung gestellten Methoden können dann in den Testfällen benutzt und mit Testdaten befüllt werden.
* __Testdata__: Einzelne Testdaten für die Testfälle können in gesonderten Klassen gepflegt werden.
Pro Testfall sollte eine Klasse mit Testdaten vorhanden sein.
Testdaten können voneinander erben.
Das ist sinvoll, wenn verschiedene Dialoge im Software-Produkt den gleichen Teil für die Eingabe von Adressen haben.
Hier wird eine Klasse (AbstractAddressData) mit initialen Daten erstellt, von der andere Klassen erben.
Wenn spezifische Testdaten für die Adresse gewünscht sind, dann kann die TestData-Klasse für den bestimmten Testfall die Daten überschreiben.
* __Testfälle__: Das Zusammenspiel zwischen Testdaten und Testschritten, dem Input und der Validierung des Outputs, findet in einem Testfall statt.
In diesem Ordner befinden sich die Testfälle so sortiert, wie die Anwendung die Prozesse in Einstiegspunkte (bspw. Menüs) aufteilt.
So können Testfälle für einzelne Bereiche (bspw. Stammdaten) eine Testsuite (Eine Sammlung von Testfällen die z.B. eine fachliche oder technische Gemeinsamkeit haben) bilden.
* __Utils__ : Hier sind Hilfsklassen zu finden, die z.B. die Anwendung starten und schließen.


#Teststruktur an die Object Orientierte Programmierung anlehnen
Die Einführung von OOP Konzepten, insbesondere Klassen, Vererbung und Polymorphie, erhöht nicht nur die Wiederverwendbarkeit, sondern auch die Wartbarkeit und die Lesbarkeit des Testfall-Codes.
Durch die Umsetzung dieser Denkweise kann der Entwickler im Allgemeinen die Testfälle effizienter automatisieren und der Testmanager die Aufgaben auf die Entwickler besser parallelisieren. 

Die Umsetzung von  Page-Object Pattern (Ein Page-Objekt Klasse umschließt eine HTML-Seite mit einer anwendungsspezifischen API, sodass es mit den UI-Elementen interagiert werden kann, ohne direkt den HTML-Code zu benutzen) ist empfehlenswert.
Diese Page-Object Klasse enthält:
•	Eine passende Benennung für das UI-Element.
•	Dessen Pfaden (Die Positionierung eines UI Elements im Verhältnis zu anderen DOM Elementen).
•	oder Selektoren (jedes UI Elements hat eigene Merkmale, die es von anderen UI Elementen hervorhebt. In diesem Artikel sind Abfrage gemeint, die das Element auswählen lässt).

Wir werden im Teil (#Gut benannte Ids sind für das Testing) uns mehr damit beschäftigen.

Die investierte Zeit der Modulierung und Benutzung von Page-Object Pattern lohnt sich spätestens dann, wenn eine UI Änderung stattfindet oder bestimmte zentrale Datensätze angepasst werden sollen.
Anstatt auf verschiedenen Stellen eine Anpassung vorzunehmen, genügt meistens die Änderung an einer Stelle.
Die Anwendung nützlicher Werkzeuge wie Entwurfsmusters bietet erprobte Lösungen für wiederkehrende Probleme.
Beispielsweise durch das Benutzen von Fluent Interface können die Testdaten als Objekte einer geeigneten Methode als ein Parameter anstatt viele Parameter übergeben werden.
Das erhöht die Codelesbarkeit.

Andere Dateien wie TestData.ts und TestFall.ts können auch über ein geeignetes Template erzeugt werden.
Der Vorteil eines Generators nebst Zeitersparnis ist, dass die generierte Klassen (TestData, TestFall, Page-Object Klasse…) einheitlich aufgebaut sind und sich ähneln.
Die Einarbeitung neuer KollegInnen wird dadurch erleichtert.
Der Entwickler kann sich auf das Wesentliche konzentrieren und die hierdurch gesparte Zeit kann in die Implementierung weiterer Funktionalitäten oder die Ausarbeitung weiterer Testfälle investiert werden. 

#Testautomatisierung: wer sind die Akteure und was ist zu Automatisieren?
Sowohl der Hauptstrang eines Prozesses einer umgesetzten Anforderung, als auch die Abweichungen, sollten getestet werden. 
Durch den Austausch zwischen dem Product Owner, dem Testmanager und dem Entwicklungsteam wird entschieden, was für ein Testtyp sich am besten für die Umsetzungsüberprüfung einer Anforderung eignet. 
Ein Happy Path Testfall (Das einfachste Szenario, in welcher ein Codeabschnitt funktionieren soll, ohne dass Ausnahmen oder Fehlerzustände eintreten)6 sollte jedoch auch als ein E2E Test automatisiert werden.
Durch die Abnahme der Story werden wahrscheinlich Verhaltensabweichungen gefunden.
Wenn sich solche als Fehler erweisen und diese behoben worden sind, kann die Beseitigung des Fehlers durch einen E2E Testfall geprüft werden. 

#Ausgangszustand der Testinfrastruktur wiederherstellen
Im Idealfall wird für die Ausführung der E2E Tests eine neu erstellte Testinfrastruktur (Eine Infrastruktur, die der Endnutzer als Softwarelösung benutzen wird; hier sind sowohl die Bedienoberfläche als auch die Backend-Systeme gemeint) aufgesetzt und die Tests laufen gegen eine möglichst eine unangetastete Umgebung (Backendsysteme).
Da das Vorgehen meistens aufgrund des Bauens der Umgebung viel Zeit in Anspruch nimmt, wird in der Praxis der Einsatz einer bereits gebauten Umgebung favorisiert, auf der eventuell mehrere Teammitglieder testen und Änderungen vornehmen können.
Dieses Vorgehen ist nicht zu empfehlen und führt meistens zu inkonsistenten Testergebnissen.
Die Testinfrastruktur, in der die automatisierten E2E Tests laufen soll für die Entwickler nicht zugängig sein. 
Vielmehr ist hier die Expertise eines DevOps-Entwicklers notwendig.
Das Aufsetzen einer Testinfrastruktur mit unangetasteten Testdaten soll nicht so viel Zeit in Anspruch nehmen (z.B. durch die Bereitstellung fertiggebauter Artefakte und Container).
Die Pipeline von E2E Tests oder anderer Routine kann somit auf Basis der bereitgestellten Artefakte eine Testinfrastruktur aufsetzen und mit unangetasteten Testdaten (Nutzer und Berechtigung, Nutzer und Nutzergruppen … usf.) aufsetzen.
Mit Hilfe von Docker könnte solche Testinfrastruktur für die Durchführung hochgefahren und nach Abschluss der Testaktivitäten heruntergefahren werden.
So wird der Ausgangzustand der Testinfrastruktur wiederholt auf identische Weise hergestellt und die gelieferten Ergebnisse gewinnen an Aussagekraft.

#Testausführung
Je nachdem, in welcher Phase sich die Produktentwicklung befindet, kann die Aussagekraft und Relevanz der gelieferten Ergebnisse der Testfälle variieren.
Nehmen wir an, dass die zu testende Anwendung (hier ist die Oberfläche einer Softwarelösung gemeint; fortan die Anwendung) und die E2E Tests in separaten Repositories gepflegt sind.
Hierfür gibt es verschiedene Überlegungen:

•	Am Anfang der Entwicklung können die Testfälle (fortan sind Oberflächentestfälle gemeint) in einer eigenen spezifizierten Pipeline4 losgelöst von der Pipeline der Anwendung ausgeführt werden.
So kann beispielsweise eine gewisse Anzahl von Testfällen als Smoketests (Testsuite, die die Hauptfunktionalität einer Komponente oder eines Systems abdeckt, um vor Beginn der geplanten Testausführung festzustellen, ob die Komponente oder das System ordnungsgemäß funktioniert)5 ausgeführt werden, die in einer nächtlichen Pipeline ausgeführt werden und bei erfolgreicher Ausführung einen anderen Pipeline-Step auslöst, der dann die restlichen Tests ausführt.

•	Im Laufe der Entwicklung sollte die E2E Tests-Pipeline enger mit der Anwendungspipeline verzahnt werden.
Idealerweise laufen die E2E Tests gegen die Änderungen im Anwendungsrepository nach dem Commiten und vor dem Mergen dieser Änderungen.
Auf diesem Wege  kann sichergestellt werden, dass die vorgenommene Änderung keine Regressionsfehler verursacht hat.
Da die Ausführung von automatisierten E2E Tests in der Regel länger läuft, könnte das Vorgehen durch eine Option deaktiviert werden.
Das ist besonders hilfreich, wenn ein Hotfix (wie z.B. die Änderungen an einem Menütext) gemergt und geliefert werden soll.

Es sollte zudem möglich sein, dass die E2E-Testfälle nur bei Änderungen in UI Modulen angestoßen oder allgemein mitausgeführt werden können.

![Pipeline Stages](/assets/images/posts/konzept-fuer-die-e2e-testautomatisierung/pipeline.png)      


Die Ausführung der Testfälle gegen ein bestimmtes Release3, das letzte Release, den letzten Entwicklungsstand (Masterstand) oder auch gegen einen Commit kann von Vorteil sein.
Bei Letzterem könnten die vorgenommenen Änderungen zu Regressionsfehler führen, die dadurch bereits vor dem Mergen erkannt werden können.
Dies ist hilfreich vor Allem dann, wenn großflächige Änderungen oder eine Refrakturierung zentraler Komponenten vorgenommen worden sind. 
Die Ausführung findet auf einer anderen Ressource als dem Entwicklerrechner statt, sodass der Entwickler während der Laufzeit der Tests nicht behindert wird und sich anderen Aufgaben widmen kann.
Das Ausführen von Testsuites soll benutzerfreundlich sein und kein technisches Wissen erfordern.
Am benutzerfreundlichsten ist es, wenn sich in der Pipeline einzelne Testsuites zum Ausführen auswählen lassen.

#Gut benannte Ids sind für das Testing 
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
•	**Absoluter Pfad**: Wir können das *Inputfield Username* mit dem absoluten Pfad **/html/body/div/form/div[2]/input[2]** auszuwählen. 
Der absoluter Pfad enthält die komplete Pfad für die Positionierung eines Element im DOM Baum.
•	**Relativer Pfad**: mit der Abfrage **//*[@id="login-Dialog"]/form/div[2]/button** können wir die *Eingabetaste Login* auswählen.
Relative Pfade beginnen mit *//**.
Im gegensatz zu absoluten Pfaden fangen die relativen Pfaden mitten im DOM Baum an.
•	**Die XPath-Abfrage mit Id**: Die XPath-Abfrage(ist eine Abfragesprache, um Teile eines XML Dokuments zu adressieren und auszuwerten) würde so aussehen **//*[@id="username-textfield"]**.
Weil für das Element während der Entwicklung eine eindeutige ID gesetzt wurde, können wir anhand die in unserer Abfrage benutzen.
 
Durch das Setzen von Ids für die UI Elemente und das Vermeiden von langen absoluten und relativen Pfaden kann die Fragilität und die Brüchigkeit der E2E Tests deutlich verringert werden.
Die XPath-Abfrage mit ID ist für das Zugreifen auf UI Elementen geeigneter als die relativen und absoluten Pfaden.
Denn je kürzer ein Pfad eines Elements ist, desto zugreifbarer sind die Elemente.
Die XPath-Abfrage ist kurzer als absoluten und relativen Pfaden und dadurch weniger fragil. 
Es gibt noch weitere Möglichkeiten, um Elemente im HTML zu adressieren.
Es ist z.B. in Angular-Welt geläufig, dass man *data-id* Attibut setzt. Die XPath-Abfrage kann dann etwas so aussehen *//*[@data-id="..."]*. 
 
Ein Bewusstsein für die Wichtigkeit des Setzens der IDs und deren richtiger Benennung sollte im Entwicklungsteam aufgebaut werden.
Eine einheitliche Notation kann nicht nur die Codelesbarkeit und die Logiklesbarkeit erhöhen, sondern auch die Wartbarkeit und die Fehlerbehebung in E2E Tests verbessern, da die zu testenden Elemente über ihre eindeutigen Ids durch den Test besser zugreifbar sind. 

#Code Generator
Wie wir gesehen haben, entstehen Komplexere UIs meistens aus weniger komplexen UI Komponenten wie z.B. Bestätigungstasten oder Eingabefeldern.
In der Praxis hat sich die Entwicklung eines Code Generators in Bezug auf die Erhöhung der Entwicklungsgeschwindigkeit bewährt.
Solch ein Code Generator lässt sich hierfür mit wenigen Handgriffen konfigurieren. 

Eine geläufige Templating Engine wie Apache Velocity kann hier zum Einsatz kommen.
lasst und folgendes beispiel anschauen:
1. Aus einen einfachen textuellen Input, der aus einen UI-Selektorname und UI-Selektorwert besteht:
 ```bash
usernameTextField=//*[@id="usernameTextField"]
passwordTextField=//*[@id="passwordTextField"]
loginButton=//*[@id="loginButton"]
```
2. Und folgende Apache Veocity-Engine Template für das Erzeugen einer Page-Object-Klasse:
```java
// Generated from Code Generator
import { AbstractPage } from "../UI/AbstractPage";
export class $classModel.className.concat("Page") extends AbstractPage {
#foreach ($element in $classModel.elements)
  private $element.elementName.toString().concat("Selector") = '$element.elementSelector';
#end
#foreach ($element in $classModel.elements)
  #set ($prefix = $element.elementName.toString().substring(0,1).toUpperCase().concat($element.elementName.toString().substring(1)))
  #set ($selector=$element.elementName.toString().concat("Selector"))
  #set ($UiElement=$element.elementName.toString())

  #if ($UiElement.endsWith("Button"))
public async click$prefix (){
    await this.click(this.$selector)
}
  #elseif($UiElement.endsWith("TextField"))
public async setValueOf$prefix (value:string){
    await this.setValue(this.$selector, value);
}
  #else
public async getValueOf$prefix (){
    return await this.getValue(this.$selector);
}
  #end
#end
}
```

3. können wir die LoginPage Klasse erzeugen:
```typescript
import { AbstractPage } from "../UI/AbstractPage";
 export class LoginPage extends AbstractPage {
 // Generated from Code Generator
   private usernameTextFieldSelector = '//*[@id="usernameTextField"]';
   private passwordTextFieldSelector = '//*[@id="passwordTextField"]';
   private loginButtonSelector = '//*[@id="loginButton"]';
 
   public async setValueOfUsernameTextField(value: string) {
     await this.setValue(this.usernameTextFieldSelector, value);
   }
 
   public async getValueOfUsernameTextField() {
     return await this.getValue(this.usernameTextFieldSelector);
   }
 
   public async setValueOfPasswordTextField(value: string) {
     await this.setValue(this.passwordTextFieldSelector, value);
   }
 
   public async getValueOfPasswordTextField() {
     return await this.getValue(this.passwordTextFieldSelector);
   }
  
   public async clickLoginButton() {
     await this.click(this.loginButtonSelector)
   }
 
   public async isEnabeledLoginButton() {
     return await this.isEnabled(this.loginButtonSelector);
   }
 }
```
weitere Klassen wie *TestData.ts* 
#Aussagekräftige Logausgabe
Mit Hilfe von Logs lässt sich genau nachvollziehen,  mit welchen Elementen während der Ausführung interagiert und mit welchen Testdaten ein Prozess ausgeführt wurde.
Ein gutes Log könnte so aussehen. 
```bash
Running tests against client_1_35_0
Running Smoketests
Test case: aktive Nutzer kann sich anmelden
Client wird gestartet fuer max_mustermann
   Call method:  waitForExist("//*[@id=\"username\"]")
   Call method:  setValue("//*[@id=\"username\"]","max_mustermann")
   Call method:  waitForExist("//*[@id=\"password\"]")
   Call method:  setValue("//*[@id=\"password\"]","adesso")
   Call method:  waitForExist("//*[@id=\"login-button\"]")
   Call method:  click("//*[@id=\"login-button\"]")
```

Abbildung 7 So kann eine gute Logausgabe aussehen
Wenn dieser Abschnitt anderen Teammitgliedern weitergeben wird, dann sollten die in der Lage sein, den Abschnitt auszuführen und nachzustellen.
Ein weiterer Vorteil einer aussagekräftigen Logausgabe ist, dass bei Auffälligkeiten die Logausgabe für die Nachstellung direkt mit dem Befund in einem Ticketsystem aufgenommen werden kann.

Testdokumentation und Aufgabenverwaltung
Der Testdurchlauf und die Testergebnisse stellen wichtige Informationen über die Qualität der Software zur Verfügung und sollten daher in einem Test Management Tool bspw. Spira7 oder Jira8  archiviert werden.
Ein zu einem bestimmten Zeitpunkt wiederholter automatisierter Durchlauf lässt die Qualität der Entwicklung anhand der Akzeptanzkriterien sicherstellen  und durch die Testergebnisse die Stabilität einzelner Komponenten in der Software und ggfs. die Fragilität der Automatisierung auch im Zeitverlauf überprüfen. 

In Jira oder Spira spezifizierte und gepflegte Testfälle können mittels Testfall-Id und TestStep-Id mit dem Code verknüpft werden.
Hierfür sind bspw. Annotationen zu nutzen.
Ein Vorteil ist, dass in einem fehlgeschlagenen Testfall genau erkannt werden kann, an welcher Stelle der Testfall fehlerhaft ausgeführt wurde.
Im dem folgenden Codeabschnitt wird gezeigt, wie man einen automatisierten Selenium-Testfall (Testautomatisierungsframework) mit Spira (Testmanagementsystem) in Java verknüpfen kann.
```java
@Test
@Category(SpiraTests.class)
@SpiraTestCase(testCaseId = 24397)
public void stammdatenSolltenFuerEinenBerichtigenNutzerAngezeigtWerden() {
} 
```

Ein weiterer Vorteil der Ergebnisarchivierung über genannte Tools ist, dass sie ein zentrales System für die Dokumentation von manuell und automatisiert ausgeführten Testfällen anbieten.
Dadurch kann das Reporting und Exportieren von Statistiken vereinfacht werden.
Dashboards und Statistiken können ebenfalls exportiert bzw. konfiguriert werden. 

#Gute Arbeit ist eine gut dokumentierte Arbeit 
Die Dokumentation ist ein wesentlicher Bestandteil der Entwicklung und ein Instrument des Wissenstransfers.
Die Dokumentation sollte in einer Wiki-Software (bspw. Confluence) gepflegt werden und immer aktualisiert werden.
Dort sollte ein Entwicklerleitfaden ausgearbeitet und die Infrastruktur beschrieben werden.
Alle relevanten Links zu Repositories, Pipeline und eventuell Team-Board sollten dort einfach zu finden sein.
Am besten wird die Dokumentation in zwei Abschnitte aufgeteilt.
Ein technischer Abschnitt für das Entwicklungsteam, wo unter anderem beschrieben wird, wie die Tests aufgebaut sind, wie einen Test geschrieben wird und was während der Entwicklung zu beachten ist. 
Ein weiterer Abschnitt soll für den Testmanager bzw. manuelle Tester dediziert werden.
Dort wird in einer eher nicht technischen Sprache beschrieben wie z.B. Smoketests ausgeführt werden und wie die Tests mit einem bestimmten Release der Software ausgeführt werden können. 

#Zurück zum Ursprung: Von der Feinspezifikation kann viel abstrahiert werden 
Nach der Ausarbeitung der Feinspezifikation (im Vertragsrecht die genaue Bestimmung der Anforderungen des Auftraggebers an die Eigenschaften eines Systems) könnte ein Tool entwickelt und angewendet werden, die daraus Storys, Akzeptanzkriterien und Akzeptanzkriterien bezogene Template-Testfälle herleitet und benötigte Tickets erstellt, die verfeinert werden können. 
Das Tool kann so aufgebaut sein, dass sie immer den aktuellen Stand aus den Testergebnissen, mit den Testfällen und den Akzeptanzkriterien in den Stories abgleicht.
Dieser Abgleichung könnte kann einen Messwert über den umgesetzten Anforderungen anhand der Akzeptanzkriterien bereitstellen.
Zusammen mit weiteren Kennzahlen und Messwerten und unter  Einbeziehung und Gewichtung der einzelnen Bestandteile kann ein guter Überblick über den Fortschritt der Entwicklung  geschaffen werden.
Weitere gelieferte Messwerte können Hinweise auf die Fragilität einzelner Komponenten geben.
Infolgedessen können erste Release Notes für das jeweilige Release automatisch erstellt werden. 
So ein maßgeschneidertes Tool hat den Nachteil, dass es erstmal entwickelt werden soll.
 
#Sich auf das Wesentliche konzentrieren 
Nehmen wir folgendes Beispiel an: Ein Benutzer A mit Berechtigung BE01 ruft ein geschütztes Formular auf, das ohne die Berechtigung BE01 nicht abrufbar ist, und befüllt es mit  einem Datensatz.
Ein Benutzer B entzieht währenddessen dem Benutzer A die Berechtigung BE01.
Benutzer A bestätigt derweil seine Angaben und speichert die Änderungen.
_Ist dieser Testfall zu automatisieren?_
Es gibt hierfür zwei unterschiedliche Meinungen:
Die Einen meinen: So ein Testfall sei extreme und tritt nicht so häufig auf, deswegen solle es besser auf die Funktionalität (die Datenvalidierung im Formular) fokussiert werden, die häufiger benutzt wird.
Die anderen meinen hingegen, dass so ein Testfall manuell nachzustellen sei fast unmöglich und dieser Fall könne im Betrieb auftreten, genau deswegen sollte dieser Testfall automatisiert werden.
Die Testautomatisierung solle unteranderem Fälle testen, die manuell nicht möglich zu testen sind.
Schlussendich hängt die Automatisierung von so einem Testfall stark von der Erwartung des Auftraggebers ab.
Je nachdem, wie die Berechtigungen aufgebaut sind, und wie oft dieser Fall eintrifft, kann das von Relevanz sein.
Es sollte aber klar sein, dass das manuelle und automatisierte Testen nicht eine hundertprozentige Sicherheit gibt, dass eine Softwarelösung fehlerfrei ist. 
     

#Weitere Ergänzungsmittel für die Fehleranalyse
Die Logausgaben liefern viele Informationen und Möglichkeit zum Nachstellen, jedoch können gegebenenfalls nicht alle notwendigen Informationen über die Logausgaben bereitgestellt werden.
Bei UI-Tests kann es auch mal notwendig sein zu sehen, welches Textfeld gerade im Fokus ist.
Hierzu können mit einem Screenshot im Fehlerfall weitere hilfreiche Informationen festgehalten werden. 
Die Screenshots und die Logausgaben sind hilfreich, doch eine Videoaufnahme für den fehlgeschlagenen Testfall könnte weitere Informationen liefern und kann als weiteres Ergänzungsmittel benutzt werden.
Vor allem, wenn die Testfälle in einem Pipeline in einer virtuellen Machine oder auf einer externe Resource ausgeführt werden.
Denn dadurch könnte die Ausführung dokumentiert werden.
Textuell wird jeder Prozess in Form von Logs dokumentiert, visuell wird der Fehler in der Form von Screenshots erfasst. 
Die Heapdumps können auch ein weiteres Mittel für die Fehleranalyse sein.
Je nach Technologie können Heapdumps beim Fehlerfall erzeugt und dem Entwickler zur Verfügung gestellt werden.
Der Einsatz von den verschiedenen benannten Ergänzungsmitteln soll abgewägt werden.

#Benachrichtigung über die Ergebnisse des Testdurchlaufs
Eine Mitteilung über den Testdurchlauf und das Importieren von Ergebnissen in einem Archivierungssystem bzw. Ticketing System bietet den Teammitgliedern einen guten Überblick und kann wertvolle Zeit ersparen.
Anstatt gezielt nach solchen Informationen an verschiedenen Orten zu suchen, kann eine Mitteilung bspw. eine Statistik über durchgelaufene Testfälle mit dem Ausführungsergebnis darstellen.
Diese sollte eine Verknüpfung mit dem Testplan, der ausgeführten Pipeline und Informationen zur Testdurchführung enthalten.
Es ist beispielsweise möglich in diversen Kommunikations-Systeme wie Slack oder  Microsoft Teams Benachrichtigungen über die Testdurchführung zu verschicken, die der untenstehenden Abbildung ähneln.
![Auf einen Blick können wichtige Informationen entnommen werden](/assets/images/posts/konzept-fuer-die-e2e-testautomatisierung/notification.png) 
So kann eine Benachrichtigung aussehen.
Microsoft Teams bietet mittels Webhooks die Möglichkeit an, solche Benachrichtigungen mit einem Curl-Befehl zu verschicken.

Da die Produktentwicklung meistens schnelllebig ist und die Umsetzung der Anforderungen aufeinander aufbaut, kommt es nicht selten vor, dass Änderungen an der UI und der Logik vorgenommen werden.
Diese Schnelllebigkeit erfordert eine ständige Wartung und Anpassung der Testfälle.
Jeder Entwickler, der den Logik oder die UI angepasst hat, soll die dazugehörigen Testfälle anpassen oder neue Testfälle automatisieren.

#Testdaten zentral ablegen
Wo die Testdaten gepflegt werden, wie realitätsnah und praxisbezogen sie sind, spiegelt sich in der Qualität und der Aussagekraft der Testautomatisierung wieder.
In der Praxis ist die kontinuierliche Pflege der Testdaten meistens eine besondere Herausforderung, denn dabei werden die Testdaten wenigstens mittels einer Wikiseite und im Code instandgehalten.
Somit kann es schnell vorkommen, dass die Testdatendokumentation und die Testdaten voneinander abweichen. 
Dieses Thema ist für die Testautomatisierung von Relevanz, da die zuverlässige Ausführung der Testfälle stark von der Richtigkeit der Testdaten abhängt.
Je vielfältiger die Speicherorte der Testdaten sind, desto negativer wird es sich auf die Testqualität auswirken.   
Hierfür könnte der Testmanager ein Teammitglied mit der Pflege und der Instandhaltung der Testdaten beauftragen.
Bevorzugt wird jedoch, wenn ein Testdatenspeicherort eine Hoheit hat und eine Routine entwickelt wird, die die Testdaten zwischen verschiedenen Quellen synchronisiert.
Es werden beispielsweise die Testdaten im E2E Repository und die Wiki-Seite mit der initialen Testdaten im Backend-Repository synchronisiert. 

#Fazit und Rückblick
Ein durchdachtes Konzept für die Testautomatisierung ist ein wichtiger Bestandteil für eine flüssige Entwicklung, es ermöglicht ein schnelles Einarbeiten neuer Kolleg*Innen und kann wichtige Messwerte und Informationen über die Qualität der Software und das Erfüllen der Akzeptanzkriterien liefern.
Durch die Ausführung der Testfälle zu einem bestimmten Zeitpunkt z.B. vor Arbeitsbeginn oder vor dem Mergen auf Master kann die Software stets auf Funktionalität geprüft werden. 
Die Kosten für die Entwicklung und Wartung von E2E Test wird sich im Laufe des Projekts relativieren.
Denn der Aufwand für das manuelle Testen steigt immer linear, anderes als E2E Testing.
Die Entwicklung von E2E Tests ist am Anfang zeitaufwendiger, jedoch im Laufe des Projekts wird die Entwicklung, die Wartung und die Testpflege leichter auffallen.
Gerade in Regressionstests und testgetriebene Entwicklung ist die Automatisierung häufig wiederholte Tests zu empfehlen.
Referenzen und Literatur
1, 5	Basiswissen Softwaretest , Spillner und LinZ
2	https://velocity.apache.org/
3	https://git-scm.com/
4	Siehe Kontinuierliche Integration
6 	https://de.wikipedia.org/wiki/Testpfad
7	https://www.inflectra.com/SpiraTest/
8	https://www.atlassian.com/de/software/jira

