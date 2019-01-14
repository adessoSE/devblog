---
layout:         [post, post-xml]              
title:          "Echtzeitdatenverarbeitung von Ereignissen"
date:           2019-01-01 17:01
modified_date: 
author:         ceverke 
categories:     [Java]
tags:           [BRMS, Business Rules, Geschäftsregeln, Drools, Complex Event Processing]
---

Ereignisse, im Englischen als Events bezeichnet, sind Aktionen, die zur Laufzeit von Softwareanwendungen auftreten und Einfluss auf den Programmablauf von Software nehmen (können). Neben technischen Ereignissen ist es auch möglich, fachliche Aktionen als Events zu modellieren. Dieser Blogbeitrag widmet sich der Fragestellung, wie eingehende Ereignisse in Echtzeit ausgewertet werden können. Dazu wird auf die Konzepte des Complex Event Processings (CEP) zurückgegriffen, die als *Drools* *Fusion* in dem Business-Rules-Management-System *Drools* enthalten sind. Dieser Beitrag knüpft an den [Blogbeitrag vom 4. Juni 2018](https://www.adesso.de/de/technisches/githubblog/wie-sich-business-strategien-in-software-umsetzen-lassen.jsp) an und geht auch darauf ein, wie fachliche Regeln zur Laufzeit verändert und in die Anwendung integriert werden können. 

# Szenario/Ausgangssituation
Ein weiteres Beispiel aus dem Bankenwesen soll den Einsatz von Events und deren (zeitbasierte) Auswertung durch Complex Event Processing verdeutlichen. Betrachtet wird dazu ein Kreditinstitut, das zur Vorbeugung von Kreditkartenbetrug eine Software einsetzen möchte, die die Transaktionen der Benutzer überwacht und auffälliges Verhalten erkennt. Dazu erstellt die zuständige Fachabteilung des Kreditinstitutes Regeln, die auffälliges Verhalten in den Transaktionen darstellen und somit einen potentiellen Betrug erkennen. Es liegt etwa dann ein Betrugsverdacht vor, wenn zwei Transaktionen mit einer Kreditkarte von zwei verschiedenen Ländern aus innerhalb einer kurzen Zeitspanne getätigt werden. Wird eine Transaktion aus Deutschland und innerhalb von zwei Minuten eine weitere Transaktion mit selbigen Kartendaten aus einem anderen Land (z.B. USA) heraus ausgeführt, so muss von einem Betrug ausgegangen werden. Ebenfalls wird von einem Betrug ausgegangen, wenn in einer Zeitspanne von 20 Minuten mehr als fünf Transaktionen für eine Kreditkarte getätigt werden, die nicht von einem Benutzer persönlich durch PIN-Eingabe oder per Unterschrift am Point of Sale bestätigt werden. Solche Transaktionen entstehen, wenn Zahlungen nur durch Angabe der Kreditkarteninformationen (Kartennummer und Gültigkeit, Prüfziffern) erfolgen, wie etwa im eCommerce.

# Umsetzung mit Complex Event Processing
Der hier vorgestellte Lösungsansatz greift auf eine Business Rule Engine (BRE) zurück. Dazu werden die von der Fachabteilung definierten Geschäftsregeln, die Situationen eines potentiellen Betruges darstellen, für die BRE implementiert. Wird die BRE zur Laufzeit mit Kreditkartentransaktionen als Events "gefüttert", so wertet die Engine die Ereignisse anhand der Regeln aus und handelt entsprechend der Anweisungen. Eine wichtige Anforderung für die Erkennung von Kreditkartenbetrug ist die Echtzeitfähigkeit: unmittelbar bei Erfüllung einer Bedingung der Regeln soll eine Maßnahme getroffen werden, wie z.B. das Sperren der Karte. Andere Kategorien von Software, etwa eine Batchüberprüfung aller Transaktionen zu einem bestimmten, nächtlichen Zeitpunkt, sind für das voliegende Beispiel keine Alternative. 
Das sog. Complex Event Processing wird an dieser Stelle weiterhelfen, das gewünschte Ziel zu erreichen. Unter Complex Event Processing, kurz CEP, versteht man eine Sammlung von Methoden, um große Mengen von anfallenden Ereignissen in Echtzeit zu analysieren. Ziel ist es, Zusammenhänge zwischen einzelnen auftretenden Events zu finden und komplexeres Wissen abzuleiten. Im vorliegenden Szenario werden die einzelnen Transaktionen als Events dargestellt; das höhere bzw. komplexere Wissen entspricht den Betrugsverdachtsfällen, die aus den Transaktionen abgeleitet werden. Auf die genauen Algorithmen und Verfahren der Informatik, die CEP ermöglichen, soll in diesem Beitrag nicht eingegangen werden. Für interessierte Leser sei auf das [Papier von Artikies et al.](https://dl.acm.org/citation.cfm?id=3093742.3095106) verwiesen. Im weiteren Verlauf dieses Textes wird mit *Drools* *Fusion* eine Softwarekomponente vorgestellt, die CEP implementiert. 

Bereits im [ersten Blogbeitrag](https://www.adesso.de/de/technisches/githubblog/wie-sich-business-strategien-in-software-umsetzen-lassen.jsp) wurden die Grundlagen von *Drools* erwähnt. Hier wurde insbesondere Faktenwissen in die Regelengine „geworfen“, welches im Anschluss anahnd der definierten Regeln ausgewertet wurde. Verwendet man *Drools* *Fusion*, so ist das Vorgehen ähnlich. Nur wird die Regelengine nicht nur mit Fakten versorgt, sondern auch mit Events. Technischer und funktionaler Unterschied zwischen den Konzepten Events und Faktenwissen ist, dass bei Events benötigte zeitliche Informationen erfasst werden. Bei reinem Faktenwissen wird angenommen, dass alle Informationen zum Zeitpunkt der Regelausführung vorhanden sind. Die zeitliche Dimension ist hierbei außen vor gelassen.  

Über die *Drools* Rule Language (DRL) können die Geschäftsregeln definiert werden. Erweiterungen der DRL ermöglichen es, auch zeitliche Zusammenhänge über Events zu definieren, die eben durch das Complex Event Processing ausgewertet werden. Insgesamt verhalten sich die Geschäftsregeln wie für gewöhnlich:  ist die Prämisse (when-Teil der zeitbasierten Regel) erfüllt, „feuert“ die Regel und entsprechende Konklusion (then-Teil) wird ausgeführt. Das folgende Listing zeigt die Implementierung des oben beschriebenen, fachlichen Szenarios. 

```java
// Package declaration and imports

declare Transaction // (Kreditkarten-)Transaktionen als Event deklarieren
	@role (event)
end

rule "Fraud detection rule 1"
    when
        $tx: Transaction() from entry-point "MonitoringStream";
        Transaction( this != $tx, this after[0s,120s] $tx, !$tx.getExecutionLocation().equals(this.getExecutionLocation), $tx.getCreditCard() == this.getCreditCard())
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

Verwendet man *Drools* *Fusion*, um zeitliche Abhängigkeiten in Geschäftsregeln zu definieren, muss der BRE mitgeteilt werden, ob Eingaben als Faktenwissen oder als Ereignisse betrachtet werden. Dass Kreditkartentransaktionen Ereignisse repräsentieren, wird mit der  `declare`-Anweisung zu Beginn determiniert.

Im Anschluss folgen die fachlichen Regeln, die die Ereignisse, im konkreten Fall also die Transaktionen, zeitbasiert untersuchen. Ereignisse müssen über verschiedene „Kanäle“ (sog. Entry-Points) in die BRE eingefügt werden.  Wie im Listing erkennbar ist, wird hier der Entry-Point mit der Bezeichnung `MonitoringStream` verwendet. In der folgenden Zeile wird der zeitliche Zusammenhang beschrieben: gibt es nach dem Eingang der Transaktion, die in der Variable `$tx` gespeichert ist, zwischen 0 und 120 Sekunden (zwei Minuten) ein weiteres Ereignis vom Typ `Transaction` mit gleicher Kartennummer aber unterschiedlichem Ausführungsland, so liegt ein Verdacht auf Kreditkartenbetrug vor und die betroffene Kreditkarte wird unmittelbar gesperrt. Die zweite Regel handelt ähnlich: gibt es eine Transaktion `$tx` und eine Menge von fünf Ereignissen innerhalb von 0 und 1200 Sekunden (20 Minuten), wobei alle Elemente der Menge die Bedingung `Transaction(isPersonalApproved()==false, getCreditCard() == $tx.getCreditCard()` erfüllen, liegt ebenfalls Verdacht auf Kreditkartenbetrug vor.

Dieses einfache und kurze Beispiel demonstriert, dass *Drools*-Regeln definiert werden können, die zeitliche Zusammenhänge zwischen Ereignissen mit Hilfe des Complex Event Processings aufdecken. Die *Drools*-Rules-Language stellt viele weitere Konzepte zur Definition von Regeln bereit. So sind Aggregationen, wie etwa die Mittelwertbildung möglich, um z.B. auch kontinuierliche Datenströme permanent auszuwerten. Etwa können Sensordaten im Kontext des Internets der Dinge (IoT), die in regelmäßigen Abständen erfasst werden, als Ereignis angesehen werden. Die Regeln sind z.B. dann erfüllt, wenn der Mittelwert der erfassten Daten in einem Zeitfenster einen bestimmten Grenzwert überschreitet. Weitere Einsatzbereiche des Complex Event Processings sind die Überwachung von Geschäftsprozessen und Ressourcen in Unternehmen oder von Marktdaten wie Aktien- oder Rohstoffpreise. In der Wissenschaft wird die Generierung von CEP-Regeln durch Verfahren des maschinellen Lernens verfolgt. Muster zwischen Events, die für den Modellierer nicht erkennbar sind, können somit automatisiert erkannt und als Geschäftsregel dargestellt werden.  


# Continious Integration
Als Einführung in *Drools*-*Fusion* soll dieses Beispiel genügen. Weitere Möglichkeiten zeigt die zugehörige [Dokumentation](https://docs.jboss.org/*Drools*/release/7.15.0.Final/*Drools*-docs/html_single/index.html#*Drools*ComplexEventProcessingChapter) auf. Neben *Drools* *Fusion* soll ein weiteres, nützliches Feature diesen Beitrag abrunden. In der [Demo-Applikation zum ersten Beitrag ](https://github.com/ceverke/DroolsBrmsDemo) wurde die DRL-Datei mit den einfachen Regeln zur Festsetzung von Kontoführungsgebühren in die Spring-Boot-Demo-Applikation eingebunden. Die Regeln sind somit, auch wenn sie zur Laufzeit ausgetauscht werden können, sehr nah am Code platziert. Ziel in einem Unternehmen könnte es sein, dass eine spezielle Personengruppe, etwa Business Analysten, in der Lage sein wollen oder gar müssen, die Regeln zu verändern – ohne dabei lokal am Code arbeiten zu wollen. 

Um dies zu erreichen, sei *Workbench* in Verbindung mit der CI (Continious Integration) Funktion von *Drools* verwendet. Bei *Workbench* handelt es sich um eine Java-Webapplikation mit grafischer Oberfläche. Sie ermöglicht es unter anderem, *Drools*-Regelprojekte zu erstellen, zu verwalten und insbesondere auch mit Hilfe von *Maven* zu bauen und auszuliefern. Die unten stehende Abbildung zeigt einen Screenshot von *Workbench*. *Workbench* ist für verschiedene Applikationsserver verfügbar. Der wohl einfachste Start mit *Workbench* ist, sich das passende *Docker* Image zu holen und den Container zu starten. Die *Drools*-Comunity stellt eine geeignete [Anleitung](https://hub.*Docker*.com/r/jboss/*Drools*-*Workbench*/) bereit. 

Wie die *Drools*-Community kürzlich bekannt gab, wird *Workbench*, geläufig auch als KIE-*Workbench* (KIE = Knowledge is everything), in Zukunft den Namen *Business Central* tragen. 

![Erstellung von Geschäftsregeln über die grafische Benutzeroberfläche von *Workbench*](/assets/images/posts/Drools-post-ceverke2/Workbench_new.png)

*Workbench* stellt viele Möglichkeiten zur Arbeit mit Geschäftsregeln bereit. Neben dem klassischen Regeleditor aus dem Screenshot gibt es auch die Möglichkeit, die Regeln z.B. basierend auf Templates zu verwalten. Hierbei werden Regelfragmenten Sätze aus natürlicher Sprache zugeordnet und durch konfigurierbare Felder erweitert. So könnte z.B. der Satz *"Mehr als X Transaktionen innerhalb von Y Minuten"* mit der zweiten Regel assoziiert werden, wobei die Platzhalter *X* und *Y* durch den Modellierer zur Laufzeit über die GUI ergänzt werden. Mit Hilfe dieser Regeltemplates können Regeln somit auch von Benutzern verwaltet werden, die über keine oder nur geringfügige Programmierkenntnisse verfügen.

Ein wichtiges Feature von *Workbench* ist es, dass die Projekte mit *Maven* gebaut und deployt werden können. Die Regeln zur Erkennung von möglichen Kreditkartenbetrug, können also per *Workbench*  erstellt und als JAR-Artefakt ausgeliefert werden. Über das CI-Feature von *Drools* ist man in der Lage, die Regeln zur Laufzeit ein Projekt einzubinden, wie im folgenden Abschnitt demonstriert wird. 

Auf [Github ist eine Demoapplikation](https://github.com/ceverke/CreditCardDemoApplication) zu finden. Diese beinhaltet neben dem Datenmodell einen Service, der für das Einfügen der Ereignisse in die Regelengine verantwortlich ist.  Die dortige `initRuleEngine()`-Methode (siehe Listing unten) ist, wie der Name bereits ausdrückt, für die Initialisierung der Engine verantwortlich. Dabei wird mit Hilfe eines ReleaseID-Objektes auf das entsprechende *Maven*-Artefakt zurückgegriffen. Hier kann also über die *GAV*-Angaben, bestehend aus *GroupId*, *ArtefactId* und *Version*, auf das über *Workbench* erzeugte Regelprojekt zugegriffen werden. Da im Beispiel kein bestimmtes Repository konfiguriert wird, greifen die *Maven* Standards und es wird zunächst das lokale *Maven*-Repository verwendet. Wenn somit auch in *Workbench* kein bestimmtes Deployment-Repository angegeben wird, landet das Artefakt in dem lokalen Repository des *Docker* Containers, auf dem Worbench betrieben wird.

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

Die Konfiguration des `STREAM`-Modus als `EventProcessingOption` ist für die Nutzung von *Drools* *Fusion* erforderlich. Auch gibt es die Möglichkeit, für Test- und Evaluierungszwecken die zu verwendende Uhr zu tauschen, wenn das Drools Projekt auf das Complex Event Processing zurückgreift. Während für die Echtzeitanwendung entsprechend die *Real Time Clock* verwendet wird, kann mit der *Pseudo-Clock* zum Testen, zur Simulation oder zur Wiederholung einiger Szenarien die Uhr dahingehend manipuliert werden, dass Zeitabstände künstlich verkürzt werden. 

Um die [Beispielanwendung](https://github.com/ceverke/CreditCardDemoApplication) lokal zu starten, sei folgende Vorgehensweise empfohlen: zunächst muss eine Instanz von *Workbench* eingerichtet und gestartet werden. Es empfiehlt sich an dieser Stelle, wie bereits erwähnt, der Einsatz von *Docker*. Ist das *Docker*-Image geladen und der Container gestartet, muss zunächst gem. der [*Docker* Anleitung für *Workbench*](https://hub.docker.com/r/jboss/drools-workbench/) ein neuer Benutzer für den im Container enthaltenen *Wildfly*-Applikationsserver angelegt werden. Im Anschluss kann *Workbench* aufgerufen und ein neues Regelprojekt erstellt werden. Damit sich die Regeln kompilieren, bauen und deployen lassen, muss das Datenmodell als JAR aus der Entwicklungsumgebung exportiert und als Abhängigkeit in *Workbench* importiert werden. Der Build und das Deployment lassen sich vollständig über die grafische Oberfläche ausführen. Da das lokale *Maven* Repository im *Docker* Container als Ablageort für das Artefakt des *Drools*-Projektes dient, empfiehlt es sich, die Demo Applikation ebenfalls in dem *Docker* Container abzulegen und von dort zu starten, um auf das Artefakt mit den Regeln zugreifen zu können. Zur Demonstration verfügt das Demo-Projekt über einen Controller, der in regelmäßigen Abständen Events zur Regelengine sendet. Neben den zwei o.g. Regeln zur Festlegung von Betrugsverdacht gibt es weitere Regeln die festlegen, dass wenn innerhalb von 20 Minuten die PIN am Point of Sale dreimal falsch eingegeben wird, die Karte gesperrt wird. Diese Sperrung wird nach 20 Minuten, auch per CEP-Regel, wieder aufgehoben. 

# Fazit
Neben der klassischen Auswertung von reinem Faktenwissen ist *Drools* in der Lage, mit Methoden des Complex Event Processing auch Ereignisse zu verarbeiten und anhand von Regeln mit zeitlicher Dimension höheres, komplexes Wissens aus den Events abzuleiten. Damit lassen sich viele Alltagsprobleme lösen. Das Beispiel zur Erkennung von Kreditkartenbetrug ist hier nur eines von vielen, realen Szenarien. Weiterhin bietet *Drools* mit *Workbench* bzw. *Business Central* eine Webapplikation mit grafischer Oberfläche an, um Geschäftsregeln und Prozesse zu modellieren, zu verwalten und auszuliefern. Vereinfachende Features ermöglichen es, dass auch nicht programmieraffine Mitarbeiter aus Fachabteilungen in der Lage sind, an diesen Projekten mitzuarbeiten und somit aktiv Einfluss auf die fachliche Logik der Software nehmen können. Durch Continious Integration Features können diese Regeln einfach und insbesondere zur Laufzeit in Java-basierte Softwareanwendungen integriert werden. 
