---
layout:         [post, post-xml]              
title:          "Wie sich Business-Strategien in Software umsetzen lassen"
date:           2018-06-04 17:01
modified_date:  2021-03-08 14:50
author_ids: [ceverke] 
categories:     [Softwareentwicklung]
tags:           [BRMS, Business Rules, Geschäftsregeln, Drools, Java]
---

Als IT-Dienstleister verantwortet die adesso AG IT-Projekte von Kunden verschiedener Branchen. Dabei ist zum einen fundiertes Branchenwissen von Bedeutung, zum anderen aber auch Wissen über Softwaretechnologien, um die fachlichen Kundenanforderungen softwareseitig umzusetzen. Der heutige Blogbeitrag widmet sich der Fragestellung, wie man Business-Strategien, die in Form von Geschäftsregeln definiert werden, technologisch realisieren kann. Dabei steht insbesondere die Leichtigkeit und Wartbarkeit im Vordergrund.

# Szenario/Ausgangssituation
Als fortlaufendes Beispiel betrachten wir ein fachliches Szenario aus dem Bankensektor. Dazu nehmen wir an, dass eine fiktive Bank die Umsetzung einer Kundenverwaltungssoftware anstrebt. Zu den fachlichen Anforderungen gehört hier die Festlegung von Kontoführungsgebühren. 

Eröffnet ein Kunde ein Konto bei der Bank, so müssen in Abhängigkeit von Kundendaten und Kundenwünschen die monatlichen Gebühren, wie auch das Limit für den Dispositionskredit und die zugehörigen Zinsen festgelegt werden. Wie sich diese Werte zusammensetzen, hängt von der strategischen Ausrichtung der Bank ab. Diese wird durch das Management der Bank unter Berücksichtigung der wirtschaftlichen Lage des Finanzmarktes festgelegt. Durch die Schwankungen des Marktes ist von ständigen Änderungen auszugehen, was mit Modifikationen der Software verbunden ist. Als Beispiel gehen wir von folgender Strategie aus:

Der Basispreis für ein Girokonto liegt bei monatlich drei Euro. Hier wird angenommen, dass der Kunde seine Transaktionen per Online-Banking durchführt. Da jedoch viele, insbesondere ältere Leute, vom Online-Banking keinen Gebrauch machen, bietet die Bank an, dass auch herkömmliche Transaktionen mit Überweisungsträgern möglich sind. Durch den erhöhten Verwaltungsaufwand erhöht sich allerdings die Basisgebühr um monatlich fünf Euro. Für Gemeinschaftskonten, z.B. für Eheleute oder Partner, wird häufig eine zweite Bankkarte benötigt, die die Gebühr ebenfalls um 4,50 Euro erhöht. Auf Kundenwunsch kann auch ein Premiumkonto eingerichtet werden. Hier erhält der Kunde eine Gold-Card, die mit weiteren (für dieses Beispiel nicht relevanten) Vorteilen verbunden ist. Die Zusatzkosten für diese Gold-Card betragen monatlich 9,90 Euro. 

Das Dispolimit und die zugehörigen Zinsen hängen vom Berufsstand und vom monatlichen Einkommen ab. Handelt es sich bei dem Kunden um einen Arbeitnehmer, so beträgt das Dispolimit 10% des monatlichen Einkommens bei 10% Zinsen. Bei Rentnern hingegen werden nur 5% des monatlichen Einkommens als Dispokredit zugelassen, die Zinsen verringern sich dafür auf 6%. Da bei Studenten von einem niedrigen Einkommen auszugehen ist, wird dieser Personengruppe keine Dispomöglichkeit eingeräumt. 

Für Studenten oder junge Leute (unter 25 Jahren) halbiert sich die auf Basis der bisher genannten Strategie festgesetzte Gebühr. Da demnach Studenten unter 25 Jahren bei doppelter Anwendung einen Rabatt von 75% erhalten würden, gilt hier, dass Studenten unter 25 Jahren 40% der ursprünglichen Gebühr zahlen müssen.


# Implementierung der Strategie
Nun gilt es, diese Strategie softwaretechnisch zu realisieren. Dafür müssen wir die benötigten Eingabeparameter identifizieren. Abgesehen von trivialen Informationen wie den persönlichen Daten des Kunden sind hier insbesondere das monatliche Einkommen und die individuellen Bedürfnisse des Kunden (zweite Karte, Premiumkunde mit Gold-Card, Papierüberweisungen) von Bedeutung. Das zugehörige Datenmodell sieht für das vereinfachte Beispiel wie folgt aus: 

![Vereinfachtes Datenmodell](/assets/images/posts/drools-post-ceverke/uml_banking_demo.png)

Bereits aus der textuellen Beschreibung der Strategie können Konditionalsätze formalisiert werden. Diese haben allgemein die Struktur "WENN [Bedingung] DANN [Konklusion]", z.B. "WENN *Kunde ist Student und unter 25 Jahre alt* DANN *setze Kontoführungsgebühr auf 40% des bereits ermittelten Basiswertes*". 

Als Softwareingenieure fällt es uns nun natürlich leicht, diese Konditionalsätze in eine Programmiersprache, z.B. Java, zu gießen. Es entstehen bedingte Anweisungen (if-else), die die Kontoführungsgebühren ermitteln. Dies wäre eine plausible und herkömmliche Umsetzungsart. 

Schnell wird man sich aber bewusst, dass diese Form der Implementierung nachteilig ist. Die Implementierung liegt „irgendwo“ im Programmcode in Form von imperativen Anweisungen. Bei großen Projekten kann es schnell schwierig werden, diese Stelle zu finden, falls Änderungsbedarf besteht. Wie eingangs erwähnt, kann es schnell erforderlich sein, die Regeln aufgrund von Anpassungen an den Finanzmarkt zu ändern. Jede Änderung erfordert ebenfalls, dass die Software neu ausgeliefert werden muss. Wünschenswert ist eine Trennung zwischen der Implementierung der Strategie und dem restlichen Programmcode.

## Einsatz eines BRMS
An dieser Stelle ist ein Business Rules Management System (BRMS) nützlich, dessen Kern eine sog. Ruleengine ist. Diese Ruleengine ermöglicht es, zentral definierte Geschäftsregeln (Business Rules) in Form von Konditionalsätzen deklarativ zu definieren und im Kontext des zugrunde liegenden Systems und Datenmodells zu prüfen und anzuwenden. Die durch die Regeln getroffenen Entscheidungen sind somit einfach zu verstehen und vor allem nachvollziehbar. 

Als konkretes Beispiel in diesem Beitrag diskutieren wir die Umsetzung der genannten Strategie mit Hilfe des Businessrules-Managementsystem (BRMS) Drools. Bei Drools handelt es sich um die Community-Version der kommerziellen Lösung „Red Hat Decision Manager“, die bis Anfang 2018 noch unter dem Namen „Red Hat JBoss BRMS“ geführt wurde. Der Sourcecode des Beispielprojekts steht auf [GitHub](https://github.com/ceverke/DroolsBrmsDemo) zur Verfügung.

Wird in einem Projekt ein Buildmanagement Tool, wie z.B. Apache Maven oder Gradle, eingesetzt, so lässt sich Drools durch Hinzufügen der benötigten Abhängigkeiten schnell in ein Java-Projekt integrieren. Die Regeln selbst werden in einer DRL-Datei im Ressource-Verzeichnis des Projektes gespeichert, dazu später mehr. Eine Datei namens kmodule.xml definiert die Struktur der Regeln, damit eine hohe Anzahl von Geschäftsregeln innerhalb einer Softwareanwendung verwaltet werden kann. Strukturiert werden die Regeln in Modules, Bases und Sessions. Sessions stellen die kleinste Einheit der Strukturierung dar und können je nach Bedarf aus der Anwendung erzeugt werden. In einer Base (kbase) wird das Paket definiert, in dem die Regeln enthalten sind. Die Definition der kmodule.xml sieht für unsere Beispielanwendung wie folgt aus

```xml
<kmodule xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns="http://jboss.org/kie/6.0.0/kmodule">

	<kbase name="bankAccountRules" eventProcessingMode="stream"
		packages="de.adesso.blog.businessrules">
		<ksession name="accountCostDefinitionSession" default="true" type="stateless"/>
	</kbase>
</kmodule>
```

Die Basis (kbase) mit dem Namen bankAccountRules beinhaltet also die Regeln, die im Paket de.adesso.blog.businessrules enthalten sind. In dieser Basis ist eine Session enthalten (eine Default-Session vom Typ „stateless“). Eine Stateless-Session ist immer dann hilfreich, wenn  die auszuführenden Regeln einmalig etwas berechnen, validieren oder filtern und das Ergebnis zurückgegeben wird. Eine Stateful-Session hingegen behält nach dem Treffen von Entscheidungen die gewonnenen Ergebnisse über eine bestimmte Zeit gespeichert und lässt diese in Folgeberechnungen miteinfließen. Dieser Session-Typ ist insbesondere beim Complex Event Processing hilfreich, das noch in einem weiteren Blogbeitrag behandelt wird. Die `kmodule.xml` lässt sich sehr umfangreich und individuell für jedes Projekt konfigurieren. Details können auf [drools.org](http://drools.org) nachgelesen werden.


## Definition der Regeln in Drools
Der wohl spannendste Teil ist die Definition der Geschäftsregeln. Dies geschieht in Drools mit der sog. Drools Rules Language. Die folgende Auswahl an Regeln zeigt exemplarisch die Umsetzung der definierten Logik. Die vollständige Implementierung aller Regeln ist unter [diesem Link einsehbar](https://github.com/ceverke/DroolsBrmsDemo/blob/master/BrmsDemo/src/main/resources/de.adesso.blog.businessrules/sample.drl).

```java
package de.adesso.blog.businessrules;

import de.adesso.blog.model.*;

import de.adesso.blog.model.*;

rule "1. Default account maintenance charge: 3.0 Euro per month"
	when
		$customer : PrivateCustomer(bankAccount==null) 
	then
		BankAccount $bankAccount = new BankAccount();
		$bankAccount.setCostPerMonth(3.0);
		$customer.setBankAccount($bankAccount);
		insert($customer);
end

rule "1.a Customer needs non online transferals; additional charge 5.0 Euro per month"
	when
		$customer : PrivateCustomer(nonOnlineTransferals) 
	then
		BankAccount $bankAccount = $customer.getBankAccount();
		$bankAccount.setCostPerMonth($bankAccount.getCostPerMonth() + 5.0);
		$customer.setBankAccount($bankAccount);
		insert($customer);
end

// [full rule set implementation ==> see GitHub]


rule "3.a + 3b  Students or persons under 25 yrs (but not both) only pay half of the calculated fee"
	when
		$customer : PrivateCustomer((jobState==JobState.STUDENT || calculateAge()<25) && !(
		jobState==JobState.STUDENT && calculateAge()<25)) 
	then
		BankAccount $bankAccount = $customer.getBankAccount();
		$bankAccount.setCostPerMonth($bankAccount.getCostPerMonth()/2);
		$customer.setBankAccount($bankAccount);
		insert($customer);
end

rule "3.c Persons under 25 yrs. that are students pay 40% of the calculated fee"
	when
		$customer : PrivateCustomer(calculateAge()<25 && jobState==JobState.STUDENT) 
	then
		BankAccount $bankAccount = $customer.getBankAccount();
		$bankAccount.setCostPerMonth($bankAccount.getCostPerMonth()*0.4);
		$customer.setBankAccount($bankAccount);
		insert($customer);
end
```

Die definierten Regeln sind dahingehend vollständig, dass sie die gesamte Strategie des fiktiven Beispiels umsetzen. Zeile 1 definiert das Package, in dem die Regeln enthalten sind. Der import-Befehl in Zeile 3 importiert das Datenmodell, das bereits in obiger Abbildung dargestellt ist. Dieser Import ist erforderlich, da schließlich die fehlenden Werte für das zum Kunden in Relation stehende Konto ermittelt werden sollen. Die Annahme ist, dass es sich um einen Neukunden handelt und somit beim Aufruf der Regeln das zugehörige Konto auf null gesetzt ist. Auf dieser Annahme wird auch die erste Regel aktiv. Diese wird ausgeführt (dies wird auch als „feuern“ einer Regel bezeichnet), wenn in die Session ein Objekt vom Typ PrivateCustomer eingeführt wird, dessen Wert für das zugehörige Konto auf null gesetzt ist. 

Die Bedingungen, die für das eingefügte Objekt überprüft werden, werden in den runden Klammern angegeben, daher auch der Ausdruck `$customer : PrivateCustomer(bankAccount==null)`. Alle verwendeten Variablen, die nicht mit einem `$` beginnen, beziehen sich auf das entsprechende Objekt oder auf ein zugehöriges Attribut (wie z.B. `bankAccount`). Voraussetzung ist also, dass das Attribut `bankAccount` im Objekt `PrivateCustomer` vorhanden ist – andernfalls kommt es beim Build-Prozess der Applikation zu einem Kompilierfehler. 

Variablen mit dem Präfix `$` werden hingegen innerhalb der Regeln verwendet. Wird also eine Instanz vom Typ PrivateCustomer mit `bankAccount==null` eingefügt, so referenziert `$customer` diese Instanz und kann sie im then-Teil modifizieren. Der then-Teil erstellt nun ein neues Objekt vom Typ `BankAccount`, referenziert dieses über die Variable `$bankAccount`, setzt die Kontoführungsgebühr gemäß der Strategie auf drei Euro und setzt das neue Konto in Relation zu dem `PrivateCustomer`. Damit auch alle weiteren Regeln Anwendung finden, muss das modifizierte Objekt wieder neu in die Session eingefügt werden. Dies macht der letzte Befehl im then-Teil der Regel.

Das Prinzip wird so immer fortgesetzt. Da nun das Attribut `bankAccount` der gerade modifizierten Instanz der Klasse `PrivateCustomer` nicht mehr den Wert null besitzt und die Instanz neu in die Session eingeführt wurde, werden nach und nach die Prämissen der anderen Regeln erfüllt und somit die weiteren Werte nach und nach determiniert. 

Bei der Definition ist natürlich eine präzise Formulierung von besonderer Bedeutung. Wie der genannten Strategie zu entnehmen ist, bekommen Studenten und Personen unter 25 Jahren eine Ermäßigung von 50% auf die Gebühren. Eine unachtsame Implementierung könnte jedoch dazu führen, wenn Regel 3a+3b das logische ODER statt dem exklusiven ODER implementiert wird.  In einem solchen Fall bekämen Studenten, die unter 25 Jahre alt sind, zunächst 50% Rabatt und in Regel 3c erneut 60% Ermäßigung, was aber nicht der definierten Strategie entspricht. 

## Anbindung an die Anwendung

Das kleine Beispiel verdeutlicht, wie wir Strategien deklarativ definieren und vom eigentlichen (imperativen) Sourcecode trennen können. Nun stellt sich noch die Frage, wie die Regelengine aus der bestehenden Anwendung aufgerufen wird. 

In der bereits vorgestellten `kmodule.xml` wird die Struktur aus Basen und Sessions deklarativ festgelegt. Zur Laufzeit wird nun aus dem Programmcode heraus an entsprechender Stelle über das Factory-Muster eine neue `KieSession` erzeugt.  Im Anschluss kann das Faktenwissen in diese Session eingefügt werden. Die folgende Methode zeigt eine derartige Implementierung. 

```java
private PrivateCustomer calculateAccountConditions(PrivateCustomer privateCustomer) {
    KieServices kieService = KieServices.Factory.get();
    KieContainer kieContainer = kieService.getKieClasspathContainer(getClass()
            .getClassLoader());

    try {
        kieSession = kieContainer.getKieBase(bankAccountRulesBase).newKieSession();
        kieSession.insert(privateCustomer);
        kieSession.fireAllRules();
    } catch (Exception anyException) {
        throw new RuntimeException("Drools session could not be instantiated");
    }
    return privateCustomer;
}
```

Über eine Servicefunktion von Drools wird zunächst ein Container erzeugt, der die Basis, referenziert durch `bankAccountRulesBase`, enthält. Auf diesem Container wird die neue Session erzeugt, die mit dem insert-Befehl mit Objekten des Modells „gefüttert“ werden kann. Die Variable `bankAccountRules` enthält den Namen der Basis, die erzeugt werden soll – in unserem Fall ist mit `bankAccountRules` in der `kmodule.xml` nur eine Basis definiert worden. 

Das Einfügen von (neuen) Fakten bewirkt noch nicht, dass die Regeln unmittelbar ausgeführt werden. Grundsätzlich ist denkbar, dass noch an weiteren Stellen Instanzen in die Session eingefügt werden und die Regeln erst dann feuern sollen, wenn das vollständige Wissen vorliegt. Im vorliegenden Beispiel ist dieses Szenario nicht gegeben, sodass mit `fireAllRules` die Ruleengine direkt aktiv werden kann. Nach erfolgreicher Ausführung der Regeln ist das übergebene Objekt vom Typ `PrivateCustomer` entsprechend der genannten Strategie modifiziert worden und kann weiter verarbeitet werden.


# Wie geht es weiter?
Dieser kurze Blogbeitrag führt anhand eines einfachen Beispiels in die Vorzüge des Geschäftsregelmanagements ein. Der Sourcecode der Demoapplikation steht auf [Github](https://github.com/ceverke/DroolsBrmsDemo).

In einem noch folgenden Blogbeitrag werden Möglichkeiten erörtert, wie Geschäftsregeln auch über eine grafische Oberfläche verwaltet werden können und Änderungen zur Laufzeit wirksam werden, ohne dass eine Neuauslieferung erforderlich wird. Weiterhin werden Möglichkeiten vorgestellt, so dass auch Nicht-Programmierer Regeln modifizieren können.  Mit Drools-Fusion liegt eine Komponente in Drools vor, die das sogenannte "Complex Event Processing" ermöglicht. Auch auf diese nützliche Funktion wird dann eingegangen und die vorhandene Demoapplikation um die Erkennung von Kreditkartenbetrug erweitert. 
