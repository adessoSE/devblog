---
layout: [post, post-xml]                                                # Pflichtfeld. Nicht ändern!
title:  "Die End to End Testautomatisierung: wie geht das denn? (Teil 3)"          # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2020-01-25 09:00                                                # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2020-01-25 09:00
author: andernach                                                       # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: [Softwareentwicklung]                                         # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Testing, Softwarequalitätssicherung, Oberflächentests]           # Optional.
---
# Code schreiben, um den Code zu generieren

Wie wir gesehen haben, entstehen komplexere UIs meistens aus weniger komplexen UI Komponenten wie z.B. Bestätigungstasten oder Eingabefeldern.
In der Praxis hat sich die Entwicklung eines Code Generators in Bezug auf die Erhöhung der Entwicklungsgeschwindigkeit bewährt.
Solch ein Code Generator lässt sich hierfür mit wenigen Handgriffen konfigurieren. 

Eine geläufige Templating Engine wie [Apache Velocity](https://velocity.apache.org/) kann hier zum Einsatz kommen.

Zur Verdeutlichung lasst und folgendes Beispiel anschauen:

•	Aus einem einfachen textuellen Input, der aus einem UI-Selektorname und UI-Selektorwert besteht:
 ```bash
usernameTextField=//*[@id="usernameTextField"]
passwordTextField=//*[@id="passwordTextField"]
loginButton=//*[@id="loginButton"]
```

•	Und eine passende Mapping zu einem Java-Object wie PageModel
```java
public class PageModel {
  public String pageName;
  public LinkedList<Element> elements;
  // getters und setters  
}
```

•	Und folgende Apache Veocity-Engine Template für das Erzeugen einer Page-Object-Klasse:

```typescript
// Generated from Code Generator
import { AbstractPage } from "../UI/AbstractPage";
export class $pageModel.pageName.concat("Page") extends AbstractPage {
#foreach ($element in $pageModel.elements)
  private $element.elementName.toString().concat("Selector") = '$element.elementSelector';
#end
#foreach ($element in $pageModel.elements)
  #set ($prefix = $element.elementName.toString().substring(0,1).toUpperCase()
       .concat($element.elementName.toString().substring(1)))
  #set ($selector = $element.elementName.toString().concat("Selector"))
  #set ($UiElement = $element.elementName.toString())

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

•	können wir die LoginPage Klasse erzeugen:

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

Weitere Klassen wie **TestData.ts** und **TestFall.ts** können auch über ein geeignetes Template erzeugt werden.
Der Vorteil eines Code Generators nebst Zeitersparnis ist, dass die generierte Klassen (TestData, TestFall, Page-Object Klasse…) einheitlich aufgebaut sind und sich ähneln.

Die Einarbeitung neuer KollegInnen wird dadurch erleichtert.
Der Entwickler kann sich auf das Wesentliche konzentrieren und die hierdurch gesparte Zeit kann in die Implementierung weiterer Funktionalitäten oder die Ausarbeitung weiterer Testfälle investiert werden. 
   
# Sind die Logausgaben aussagekräftig? wenn nicht, dann sollen sie es sein


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

Wenn dieser Abschnitt anderen Teammitgliedern weitergeben wird, dann sollten die in der Lage sein, den Abschnitt auszuführen und nachzustellen.
Ein weiterer Vorteil einer aussagekräftigen Logausgabe ist, dass bei Auffälligkeiten die Logausgabe für die Nachstellung direkt mit dem Befund in einem Ticketsystem aufgenommen werden kann.

# Die Testdokumentation ist genauso wichtig wie das Testen


Der Testdurchlauf und die Testergebnisse stellen wichtige Informationen über die Qualität der Software zur Verfügung und sollten daher in einem Test Management Tool bspw. [Spira](https://www.inflectra.com/SpiraTest/) oder [Jira](https://www.atlassian.com/de/software/jira)  archiviert werden.
Ein zu einem bestimmten Zeitpunkt wiederholter automatisierter Durchlauf lässt die Qualität der Entwicklung anhand der Akzeptanzkriterien sicherstellen und durch die Testergebnisse die Stabilität einzelner Komponenten in der Software und ggfs. die Fragilität der Automatisierung auch im Zeitverlauf überprüfen. 

In [Jira](https://www.atlassian.com/de/software/jira) oder [Spira](https://www.inflectra.com/SpiraTest/) spezifizierte und gepflegte Testfälle können mittels Testfall-Id und TestStep-Id mit dem Code verknüpft werden.
Hierfür sind bspw. Annotationen zu nutzen.
Ein Vorteil ist, dass in einem fehlgeschlagenen Testfall genau erkannt werden kann, an welcher Stelle der Testfall fehlerhaft ausgeführt wurde.
In dem folgenden Codeabschnitt wird gezeigt, wie man einen automatisierten [Selenium](https://selenium.dev/)-Testfall mit Spira in Java verknüpfen kann.
```java
@Test
@Category(SpiraTests.class)
@SpiraTestCase(testCaseId = 24397)
public void stammdatenSolltenFuerEinenBerichtigenNutzerAngezeigtWerden() {
} 
```
Mit [Xray Test Management for Jira](https://marketplace.atlassian.com/apps/1211769/xray-test-management-for-jira?hosting=cloud&tab=overview) können die Testergebnisse auch direkt in Jira als Testausführung importiert werden.
Die Testausführung kann dann zu einem Testplan zugeordnet werden.


![XRay Testausführungsansicht](/assets/images/posts/Die-End-to-End-Testautomatisierung-wie-geht-das-denn/Xray.JPG)      

Ein weiterer Vorteil der Ergebnisarchivierung über die genannten Tools ist, dass sie ein zentrales System für die Dokumentation von manuell und automatisiert ausgeführten Testfällen anbieten.
Dadurch kann das Reporting und Exportieren von Statistiken vereinfacht werden.
Dashboards und Statistiken können ebenfalls exportiert bzw. konfiguriert werden. 

# Gute Arbeit ist eine gut dokumentierte Arbeit 


Die Dokumentation ist ein wesentlicher Bestandteil der Entwicklung und ein Instrument des Wissenstransfers.
Die Dokumentation sollte in einer Wiki-Software (bspw. Confluence) gepflegt werden und immer aktualisiert werden.
Dort sollte ein Entwicklerleitfaden ausgearbeitet und die Infrastruktur beschrieben werden.
Alle relevanten Links zu Repositories, Pipeline und eventuell Team-Board sollten dort einfach zu finden sein.
Am besten wird die Dokumentation in zwei Abschnitte aufgeteilt.


Ein technischer Abschnitt für das Entwicklungsteam, wo unter anderem beschrieben wird, wie die Tests aufgebaut sind, wie einen Test geschrieben wird und was während der Entwicklung zu beachten ist. 
Ein weiterer Abschnitt sollte für den Testmanager bzw. manuelle Tester dediziert werden.
Dort wird in einer eher nicht technischen Sprache beschrieben wie z.B. Smoketests ausgeführt werden und wie die Tests mit einem bestimmten Release der Software ausgeführt werden können. 

# Zurück zum Ursprung: Von der Feinspezifikation kann viel abstrahiert werden 


Nach der Ausarbeitung der Feinspezifikation<sup>1</sup> könnte ein Tool entwickelt und angewendet werden, das daraus Storys, Akzeptanzkriterien und Akzeptanzkriterien bezogene Template-Testfälle herleitet und benötigte Tickets erstellt, die verfeinert werden können. 
Das Tool kann so aufgebaut sein, dass es immer den aktuellen Stand aus den Testergebnissen, mit den Testfällen und den Akzeptanzkriterien in den Stories abgleicht.
Dieser Abgleichung könnte einen Messwert über den umgesetzten Anforderungen anhand der Akzeptanzkriterien bereitstellen.

Zusammen mit weiteren Kennzahlen und Messwerten und unter  Einbeziehung und Gewichtung der einzelnen Bestandteile kann ein guter Überblick über den Fortschritt der Entwicklung  geschaffen werden.
Weitere gelieferte Messwerte können Hinweise auf die Fragilität einzelner Komponenten geben.
Infolgedessen können erste Release Notes für das jeweilige Release automatisch erstellt werden. 
So ein maßgeschneidertes Tool hat den Nachteil, dass es erstmal entwickelt werden muss.
 
 
# Ausblick


Wir haben gesehen, welche Vorteile ein Code Generator mit sich bringt und wie wir die Testergebnisse archivieren können.
Die Integration zwischen Testergebnissen und eines Archivierungssystem könnte auch bei Unit-Tests realisiert werden.
Die Logausgaben sind ein wichtiges Mittel für die Fehleranalyse.
Im vierten Teil meiner Blog-Serie werden wir uns andere Mitteln zur Fehleranalyse anschauen. 
Zudem werden wir sehen, wie wir mittels Benachrichtigungen Informationen kommunizieren und die Effizienz erhöhen können.  

# Glossar
 1. Die Feinspezifikation: Die genaue Bestimmung der Anforderungen des Auftraggebers an die Eigenschaften eines Systems.
