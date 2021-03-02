---
layout:         [post, post-xml]              
title:          "Echtzeitdatenverarbeitung von Eventströmen"
date:           2019-03-01 09:30
modified_date:  2019-03-01 09:30
author:         ceverke 
categories:     [Softwareentwicklung]
tags:           [BRMS, Business Rules, Geschäftsregeln, Drools, Complex Event Processing, Java]
---

Ereignisse, im Englischen als Events bezeichnet, dienen im Software Engineering zur Steuerung des Programmablaufes von Software und werden durch Aktionen ausgelöst oder lösen selbst Aktionen aus. Neben technischen Events ist es auch möglich, fachliche Aktionen aus Events zu herzuleiten. In diesem Blogbeitrag widmen wir uns der Fragestellung, wie eingehende Events in Echtzeit ausgewertet werden können. Dazu greifen wir auf die Konzepte des Complex Event Processings (CEP) zurück, die als *Drools* *Fusion* in dem Business-Rules-Management-System *Drools* enthalten sind. Ein Beispiel aus der Banking-Branche zeigt ein mögliches und realistisches Szenario, in dem die hier vorgestellten Konzepte, Ideen und Technologien Anwendung finden könnten. 

# Szenario/Ausgangssituation
Dieser Beitrag knüpft an den [Blogbeitrag vom 4. Juni 2018](https://www.adesso.de/de/technisches/githubblog/wie-sich-business-strategien-in-software-umsetzen-lassen.jsp) an. Wir betrachten dazu ein fiktives Kreditinstitut, das zur Vorbeugung von Kreditkartenbetrug eine Software einsetzen möchte, die die Transaktionen der Benutzer überwacht und auffälliges Verhalten erkennt. Dazu erstellt die zuständige Fachabteilung des Kreditinstitutes Regeln, die auffälliges Verhalten in den Transaktionen darstellen und somit einen potentiellen Betrug erkennen. 

Es liegt etwa dann ein Betrugsverdacht vor, wenn zwei Transaktionen mit einer Kreditkarte von zwei verschiedenen Ländern aus innerhalb einer kurzen Zeitspanne gestartet werden. Wird eine Transaktion aus Deutschland und innerhalb von zwei Minuten eine weitere Transaktion mit selbigen Kartendaten aus einem anderen Land (z.B. USA) heraus ausgeführt, so muss von einem Betrug ausgegangen werden. Ebenfalls wird von einem Betrug ausgegangen, wenn in einer Zeitspanne von 20 Minuten mehr als fünf Transaktionen für eine Kreditkarte getätigt werden, die nicht von einem Benutzer persönlich durch PIN-Eingabe oder per Unterschrift am Point of Sale bestätigt werden. Solche Transaktionen entstehen, wenn Zahlungen nur durch Angabe der Kreditkarteninformationen (Kartennummer und Gültigkeit, Prüfziffern) erfolgen, wie etwa im eCommerce.

# Umsetzung mit Complex Event Processing
Wir werden einen Lösungsansatz vorstellen, der auf eine Business Rule Engine (BRE) zurückgreift. Dazu werden die von der Fachabteilung definierten Geschäftsregeln, die die Situationen eines potentiellen Betruges darstellen, für die BRE implementiert. Wird die BRE zur Laufzeit mit Kreditkartentransaktionen als Events "gefüttert", so wertet die Engine diese anhand der Regeln aus und handelt entsprechend der Anweisungen. Eine wichtige Anforderung für die Erkennung von Kreditkartenbetrug ist die Echtzeitfähigkeit: unmittelbar bei Erfüllung einer Bedingung der Regeln wollen wir eine Maßnahme treffen, wie z.B. das Sperren der Karte. Andere Kategorien von Software, etwa eine Batchüberprüfung aller Transaktionen zu einem bestimmten, nächtlichen Zeitpunkt, sind für das voliegende Beispiel keine Alternative. 

Das sog. Complex Event Processing wird uns an dieser Stelle weiterhelfen, das gewünschte Ziel zu erreichen. Unter Complex Event Processing verstehen wir eine Sammlung von Methoden, um große Mengen von anfallenden Events in Echtzeit zu analysieren. Ziel ist es, Zusammenhänge zwischen einzelnen auftretenden Events zu finden und komplexeres Wissen abzuleiten. Im vorliegenden Szenario könnten wir beispielseise die einzelnen Transaktionen als Events darstellen; das höhere bzw. komplexere Wissen entspricht den Betrugsverdachtsfällen, die durch das CEP aus den Transaktionen abgeleitet werden. Auf die genauen Algorithmen und Verfahren der Informatik, die CEP ermöglichen, gehen wir in diesedm Beitrag nicht ein. Für interessierte Leser sei auf das [Papier von Artikies et al.](https://dl.acm.org/citation.cfm?id=3093742.3095106) verwiesen. Im weiteren Verlauf dieses Textes lernen wir mit *Drools* *Fusion* eine Softwarekomponente vorgestellt, die CEP implementiert. 

Bereits im [ersten Blogbeitrag](https://www.adesso.de/de/technisches/githubblog/wie-sich-business-strategien-in-software-umsetzen-lassen.jsp) haben wir die Grundlagen von *Drools* kennengelernt. Hier haben wir insbesondere Faktenwissen in die Regelengine „geworfen“, welches im Anschluss anhand der definierten Regeln ausgewertet wurde. Verwenden wir *Drools* *Fusion*, so ist das Vorgehen ähnlich. Nur wird die Regelengine nicht nur mit Fakten versorgt, sondern auch mit Events. Technischer und funktionaler Unterschied zwischen den Konzepten Events und Faktenwissen ist, dass bei Events benötigte zeitliche Informationen erfasst werden. Bei reinem Faktenwissen nehmen wir an, dass alle Informationen zum Zeitpunkt der Regelausführung vorhanden sind. Die zeitliche Dimension ist hierbei außen vor gelassen.  

Über die *Drools* Rule Language (DRL) können wir die Geschäftsregeln definieren. Erweiterungen der DRL ermöglichen es, auch zeitliche Zusammenhänge über Events zu abzubilden, die eben durch das Complex Event Processing ausgewertet werden. Insgesamt verhalten sich die Geschäftsregeln wie gewohnt: ist die Prämisse (`when`-Teil der zeitbasierten Regel) erfüllt, „feuert“ die Regel und die entsprechende Konklusion (`then`-Teil) wird ausgeführt. Das folgende Listing zeigt die Implementierung des oben beschriebenen, fachlichen Szenarios. 

```java
// Package declaration and imports

declare Transaction // (Kreditkarten-)Transaktionen als Event deklarieren
	@role (event)
end

rule "Fraud detection rule 1"
    when
        $tx: Transaction() from entry-point "MonitoringStream";
        Transaction(this != $tx, this after[0s,120s] $tx, !$tx.getExecutionLocation().equals(this.getExecutionLocation), 
					$tx.getCreditCard() == this.getCreditCard())
        from entry-point "MonitoringStream";
    then
        System.out.println("Fraud suspected by rule 1. Two transactions from two different countries in a short time");
        $tx.getCreditCard().setActive(false);
end

rule "Fraud detection rule 2"
    when
        $tx: Transaction() from entry-point "MonitoringStream";
        $collection : ArrayList(size==5)  from collect (
				Transaction(isPersonalApproved()==false, getCreditCard() == $tx.getCreditCard())  over window:time( 1200s )  
				from entry-point "MonitoringStream"
		) 
		eval ($collection.get($collection.size()-1).equals($tx));
    then
        System.out.println("Fraud suspected by rule 2. Too many not approved transactions within 20 minutes");
        $tx.getCreditCard().setActive(false);
end
```

Verwenden wir *Drools* *Fusion*, um zeitliche Abhängigkeiten in Geschäftsregeln zu definieren, so müssen wir der BRE mitteilen, ob Eingaben als Faktenwissen oder als Events betrachtet werden sollen. Dass Kreditkartentransaktionen Events repräsentieren, wird mit der  `declare`-Anweisung zu Beginn determiniert.

Im Anschluss folgen die fachlichen Regeln, die die Events, im konkreten Fall also die Transaktionen, zeitbasiert untersuchen. Events müssen über verschiedene „Kanäle“ (sog. Entry-Points) in die BRE eingefügt werden. Wie im Listing erkennbar ist, verwenden wir hier den Entry-Point mit der Bezeichnung `MonitoringStream`. Die darauffolgende Zeile beschreibt den zeitlichen Zusammenhang: gibt es nach dem Eingang der Transaktion, die in der Variable `$tx` gespeichert ist, zwischen 0 und 120 Sekunden (zwei Minuten) ein weiteres Event vom Typ `Transaction` mit gleicher Kartennummer aber unterschiedlichem Ausführungsland, so liegt ein Verdacht auf Kreditkartenbetrug vor und die betroffene Kreditkarte wird unmittelbar gesperrt. Die zweite Regel handelt ähnlich: gibt es eine Transaktion `$tx` und eine Menge von fünf Events innerhalb von 0 und 1200 Sekunden (20 Minuten), wobei alle Elemente der Menge die Bedingung `Transaction(isPersonalApproved()==false, getCreditCard() == $tx.getCreditCard()` erfüllen, liegt ebenfalls Verdacht auf Kreditkartenbetrug vor.

Dieses einfache und kurze Beispiel demonstriert, dass wir *Drools*-Regeln definieren können, die zeitliche Zusammenhänge zwischen Events mit Hilfe des Complex Event Processings aufdecken. Die *Drools*-Rules-Language stellt viele weitere Konzepte zur Definition von Regeln bereit. So sind Aggregationen, wie etwa die Mittelwertbildung möglich, um z.B. auch kontinuierliche Datenströme permanent auszuwerten. Etwa könnten wir hiermit Sensordaten im Kontext des Internets der Dinge (IoT),die in regelmäßigen Abständen erfasst werden, als Event ansehen. Die Regeln sind z.B. dann erfüllt, wenn der Mittelwert der erfassten Daten in einem Zeitfenster einen bestimmten Grenzwert überschreitet. Weitere Einsatzbereiche des Complex Event Processings sind die Überwachung von Geschäftsprozessen und Ressourcen in Unternehmen oder von Marktdaten wie Aktien- oder Rohstoffpreisen. In der Wissenschaft wird die Generierung von CEP-Regeln durch Verfahren des maschinellen Lernens verfolgt. Muster zwischen Events, die für uns Modellierer nicht erkennbar sind, können wir somit automatisiert erkennen und als Geschäftsregel darstellen.  


# Continuous Integration
Als Einführung in *Drools*-*Fusion* soll uns dieses Beispiel genügen. Weitere Möglichkeiten zeigt die zugehörige [Dokumentation](https://docs.jboss.org/drools/release/7.16.0.Final/drools-docs/html_single/index.html#DroolsComplexEventProcessingChapter) auf. Neben *Drools* *Fusion* soll ein weiteres, nützliches Feature diesen Beitrag abrunden. In der [Demo-Applikation zum ersten Beitrag ](https://github.com/ceverke/DroolsBrmsDemo) haben wir die DRL-Datei mit den einfachen Regeln zur Festsetzung von Kontoführungsgebühren in die Spring-Boot-Demo-Applikation eingebunden. Die Regeln sind somit, auch wenn sie zur Laufzeit ausgetauscht werden können, sehr nah am Code platziert. Unser Ziel in einem Unternehmen könnte es sein, eine Personengruppe wie Business Analysten zu befähigen, die Regeln zu verändern - und das, ohne dabei lokal am Code arbeiten zu müssen.

Um dies zu erreichen, verwenden wir *Workbench* in Verbindung mit der Continuous Integration Funktion von *Drools*. Bei *Workbench* handelt es sich um eine Java-Webapplikation mit grafischer Oberfläche. Sie ermöglicht es uns unter anderem, *Drools*-Regelprojekte zu erstellen, zu verwalten und insbesondere auch mit Hilfe von *Maven* zu bauen und auszuliefern. *Workbench* ist für verschiedene Applikationsserver verfügbar. Ein guter Start mit *Workbench* ist, wenn wir uns das passende Docker Image holen und den Container starten. Die Drools-Comunity stellt uns eine geeignete [Anleitung](https://hub.docker.com/r/jboss/drools-workbench/) bereit, anhand der wir innerhalb weniger Minuten Workbench lokal auf unseren Maschinen hochfahren können 

Wie die *Drools*-Community kürzlich bekannt gab, wird *Workbench*, geläufig auch als KIE-*Workbench* (KIE = Knowledge is everything), in Zukunft den Namen *Business Central* tragen. 

*Workbench* stellt viele Möglichkeiten zur Arbeit mit Geschäftsregeln bereit. Neben dem klassischen Regeleditor aus dem Screenshot gibt es auch die Möglichkeit, Regeln z.B. basierend auf Templates zu verwalten. Hierbei werden Regelfragmenten Sätze aus natürlicher Sprache zugeordnet und durch konfigurierbare Felder erweitert. So könnten wir z.B. den Satz *"Mehr als X Transaktionen innerhalb von Y Minuten"* mit der zweiten Regel assoziieren, wobei die Platzhalter *X* und *Y* durch den Modellierer zur Laufzeit über die GUI ergänzt werden. Mit Hilfe dieser Regeltemplates können Regeln somit auch von Benutzern verwaltet werden, die über keine oder nur geringfügige Programmierkenntnisse verfügen.

Ein wichtiges Feature von *Workbench* ist es, dass die Projekte mit *Maven* gebaut und deployt werden können. Wir können die Regeln zur Erkennung von möglichem Kreditkartenbetrug also per *Workbench* erstellen und als JAR-Artefakt auslieern. Über das CI-Feature von *Drools* sind wir in der Lage, die Regeln zur Laufzeit in ein Projekt einzubinden. Das wollen wir uns folgenden Abschnitt anschauen und demonstrieren. 

Auf [Github ist eine Demoapplikation](https://github.com/ceverke/CreditCardDemoApplication) zu finden. Diese beinhaltet neben dem Datenmodell einen Service, der für das Einfügen der Events in die Regelengine verantwortlich ist.  Die dortige `initRuleEngine()`-Methode (siehe Listing unten) ist, wie der Name bereits ausdrückt, für die Initialisierung der Engine verantwortlich. Dabei greifen wir mit Hilfe eines ReleaseID-Objektes auf das entsprechende *Maven*-Artefakt zurzurück. Geben wir also die *GAV*-Informationen, bestehend aus *GroupId*, *ArtefactId* und *Version* an, so können wir auf das über *Workbench* erzeugte Regelprojekt zugreifen. Da wir im Beispiel kein bestimmtes Repository konfigurieren, greifen die *Maven* Standards und es wird zunächst das lokale *Maven*-Repository verwendet. Wenn somit auch in *Workbench* kein bestimmtes Deployment-Repository angegeben wird, landet das Artefakt in dem lokalen Repository des *Docker* Containers, auf dem wir Workbench betreiben.

```java
public void initRuleEngine() {
	LOGGER.info("Starting KIE Session...");

	KieServices kieService = KieServices.Factory.get();

	ReleaseId releaseId = kieService.newReleaseId(GROUPID, ARTIFACTID, VERSION); // Definition z.B. über PROPERTIES-Datei
	LOGGER.info("Reading rules from *Maven* repository: GroupId: " + GROUPID + ", ArtifactId: " + ARTIFACTID
			+ ", Version " + VERSION);

	KieContainer kieContainer = kieService.newKieContainer(releaseId, this.getClass().getClassLoader());
	KieScanner kieScanner = kieService.newKieScanner(kieContainer);
	kieScanner.start(1000L);

	KieBaseConfiguration kieBaseConfig = kieService.newKieBaseConfiguration();
	kieBaseConfig.setOption(EventProcessingOption.STREAM);

	KieBase kBase = kieContainer.newKieBase(kieBaseConfig);
	try {
		kieSession = kBase.newKieSession();
		LOGGER.info("Starting KIE-Session");
		startSession();
		LOGGER.info("Session started");
	} catch (Exception exception) {
		LOGGER.info("Session could not be started");
		exception.printStackTrace();
	}
}

public void startSession() {
	//...
}

```

Die Konfiguration des `STREAM`-Modus als `EventProcessingOption` ist für die Nutzung von *Drools* *Fusion* erforderlich. Auch gibt es die Möglichkeit, für Test- und Evaluierungszwecke die zu verwendende Uhr zu tauschen, wenn das Drools Projekt auf das Complex Event Processing zurückgreift. Während wir für die Echtzeitanwendung entsprechend die *Real Time Clock* verwenden, können wir mit der *Pseudo-Clock* zum Testen, zur Simulation oder zur Wiederholung einiger Szenarien die Uhr dahingehend manipulieren, dass Zeitabstände künstlich verkürzt werden. 

Um die [Beispielanwendung](https://github.com/ceverke/CreditCardDemoApplication) lokal zu starten, sei folgende Vorgehensweise empfohlen: zunächst müssen wir eine Instanz von *Workbench* einrichten und starten. Es empfiehlt sich an dieser Stelle, wie bereits erwähnt, der Einsatz von *Docker*. Ist das *Docker*-Image geladen und der Container gestartet, so müssen wir zunächst gemäß der [*Docker* Anleitung für *Workbench*](https://hub.docker.com/r/jboss/drools-workbench/) einen neuen Benutzer für den im Container enthaltenen *Wildfly*-Applikationsserver anlegen. Im Anschluss können wir *Workbench* aufrufen und und ein neues Regelprojekt erstellen. Damit sich die Regeln kompilieren, bauen und deployen lassen, müssen wir das Datenmodell als JAR aus der Entwicklungsumgebung exportieren und als Abhängigkeit in *Workbench* wiederum importiertieren. Der Buildprozess und das Deployment lassen sich vollständig über die grafische Oberfläche ausführen. Da das lokale *Maven* Repository im *Docker* Container als Ablageort für das Artefakt des *Drools*-Projektes dient, empfiehlt es sich, die Demo Applikation ebenfalls in dem *Docker* Container abzulegen und von dort zu starten, um auf das Artefakt mit den Regeln zugreifen zu können. 

Zur Demonstration verfügt das Demo-Projekt über einen Controller, der in regelmäßigen Abständen Events zur Regelengine sendet. Neben den zwei o.g. Regeln zur Festlegung von Betrugsverdacht gibt es weitere Regeln die festlegen, dass wenn innerhalb von 20 Minuten die PIN am Point of Sale dreimal falsch eingegeben wird, die Karte gesperrt wird. Diese Sperrung wird nach 20 Minuten, auch per CEP-Regel, wieder aufgehoben. 

# Fazit
Neben der klassischen Auswertung von reinem Faktenwissen sind wir mit *Drools* in der Lage, mit Methoden des Complex Event Processing auch Events zu verarbeiten und anhand von Regeln mit zeitlicher Dimension höheres, komplexes Wissens aus den Events abzuleiten. Damit lassen sich viele Alltagsprobleme lösen. Das Beispiel zur Erkennung von Kreditkartenbetrug ist hier nur eines von vielen, realen Szenarien. 

Weiterhin bietet *Drools* mit *Workbench* bzw. *Business Central* eine Webapplikation mit grafischer Oberfläche an, um Geschäftsregeln und Prozesse zu modellieren, zu verwalten und auszuliefern. Vereinfachende Features ermöglichen es, dass auch nicht programmieraffine Mitarbeiter aus Fachabteilungen in der Lage sind, an diesen Projekten mitzuarbeiten und somit aktiv Einfluss auf die fachliche Logik der Software nehmen können. Durch Continuous Integration Features können wir diese Regeln einfach und insbesondere zur Laufzeit in Java-basierte Softwareanwendungen integrieren. 
