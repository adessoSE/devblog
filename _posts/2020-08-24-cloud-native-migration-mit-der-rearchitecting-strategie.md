---
layout: [post, post-xml]                          
title:  "Cloud native Migration mit der Rearchitecting Strategie"         
date:   2020-08-24 08:00                   
author: c-bachmann                                  
categories: [Architektur]                        
tags: [Architektur, Serverless, FaaS, AWS, Cloud Computing]       
---

Mit der Rearchitecting Strategie kann eine Anwendung in eine Cloud native Anwendung überführt werden, die das volle Potential der Cloud nutzt.
In diesem Beitrag zeige ich, wie die Rearchitecting Strategie kleinschrittig und iterativ angewendet werden kann, sodass auch während der Migration zu jederzeit
lauffähige und erweiterbarte Software ausgeliefert werden kann und ich zeige, warum sich der Migrationsaufwand lohnt.

In meinem vorangegangenen Blog-Beitrag habe ich [Gründe und Strategien für die Migration einer Applikation in die Cloud aufgezeigt](https://www.adesso.de/de/news/blog/gruende-und-strategien-fuer-die-migration-einer-applikation-in-die-cloud.jsp) aufgezeigt.
In diesem Beitrag zeige ich, wie die Rearchitecting Strategie angewendet werden kann, um eine Anwendung ein eine Cloud native Anwendungung zu überführen.

Bei der Migration sollte man sich schrittweise einer Cloud native Anwendung annähern, indem man die Strategien Rehosting, Replatforming und Rearchitecting nacheinander anwendet.
Erst nach Anwendung der Rearchitecting Strategie nutzt die Software das volle Potential der Cloud.
Häufig wird die Migration jedoch nach der Anwendung der Replatforming Strategie nicht fortgeführt, da der Migrationsaufwand gescheut wird. 
Dabei kann die Rearchitecting Strategie auch kleinschrittig angewendet werden. Jeder Schritt führt dabei zu einer Verbesserung hin zu einer Cloud native Anwendung.

Die Überführung zu einer Cloud nativen Anwendung führt zu einer höheren Entwicklungsproduktivität, gerade wenn die Komplexität der Software steigt und die Teamgröße wächst. 
Gleichzeitig erhöht es die Softwarequalität und verbessert die Stabilität und die Verfügbarkeit.
In diesem Beitrag zeige ich, wie die Rearchitecting Strategie iterativ und inkrementell angewendet werden kann, um eine Anwendung in eine Cloud native Anwendung zu überführen.

# Welchen Mehrwehrt bietet die Rearchitecting Strategie?

Vor der Rearchitecting Strategie sollte bereits die Rehosting und Replatforming Strategie angewendet worden sein. 
D.h. die Anwendung läuft bereits in der Cloud und einige Dienste wie die Datenbank sind bereits an den Cloud Anbieter ausgelagert worden.
Außerdem wird die Anwendung auf virtuellen Maschinen oder in einer Container Umgebung wie Kubernetes betrieben.
Trotzdem gibt es großes Optimierungspotential bei der Kosteneffizienz, der Entwicklungseffizienz und der betrieblichen Qualität, wie die folgende Grafik veranschaulicht.
 
![Kosten und Nutzen der Rearchitecting Strategie im Vergleich](/assets/images/posts/cloud-native-migration-mit-der-rearchitecting-strategie/aufwand-nutzen.png) 

Um die Möglichkeiten der Cloud wie das Pay-per-Use Preismodel, Autoscaling, Scale-to-Zero und Zero-Downtime Deployments auszunutzen, ist es notwendig, die Architektur der Anwendung zu prüfen und an die Cloud anzupassen.
Das scheint vom Aufwand her hoch und wird daher oft gescheut. 
Der Fehler liegt häufig darin, dass ein Big Bang Ansatz gewählt wird. 
Stattdessen sollte kleinschrittig und iterativ vorgegangen werden, sodass zu jederzeit funktionierende Software und neue Features ausgeliefert werden können.
Schauen wir uns im nächsten Abschnitt die Rearchitecting Strategie genauer an.

# Die Rearchitecting Migrationsstrategie im Detail

Die Rearchitecting Strategie sollte inkrementell nach den Grundprinzipien der agilen Softwareentwicklung angewendet werden. 
Das garantiert zu jeder Zeit lauffähige Software, die auch während der Cloud Migration um neue Features erweitert werden kann. 
Google nennt das Vorgehen „move-and-improve“.

Bei der Rearchitecting Strategie werden möglichst viele Komponenten und Dienste der Anwendung an den Cloud Anbieter ausgelagert, denn der Cloud Anbieter ist auf den Betrieb dieser Dienste spezialisiert. 
Dadurch reduziert sich der Wartungsaufwand für Infrastrukturkomponenten und es kann mehr Fokus auf die Weiterentwicklung des Geschäftsmodells gelegt werden.
Im folgenden Abschnitt erläutere ich die Schritte, aus denen die Rearchitecting Strategie besteht.

## Umstellung der Laufzeitumgebung
Falls noch nicht in einem vorhergehenden Schritt geschehen, sollte die Anwendung in Docker Containern betrieben werden. Docker ist ein Standard, der von allen Cloud Anbietern unterstützt wird. 
Es unterstützt die Automatisierung der Betriebsumgebung und reduziert dadurch den Betriebsaufwand. 

Die Cloud Anbieter bieten verschiedene Container Ausführungsumgebungen an. 
Es sollten die Laufzeitumgebungen gewählt werden, bei denen möglichst viel betriebliche Verantwortung an den Cloud Anbieter ausgelagert wird.
Bei diesen höherwertigen Diensten liegt das Autoscaling, Scale-to-Zero und das regelmäßige Einspielen von Sicherheitspatches im Verantwortungsbereich des Cloud Anbieters.

Die Softwareartefakte werden als Docker Images in eine Container Registry ausgeliefert, die von jedem großen Cloud Anbietern zur Verfügung gestellt wird.

Folgende Liste bietet eine Übersicht über die Container Laufzeitumgebungen der großen Cloudanbieter, aufsteigend sortiert nach der Wertigkeit:
- AWS: Elastic Kubernetes Services, Elastic Beanstalk, Elastic Container Service, Fargate
- Google: Google Kubernetes Engine, Google Cloud Run
- Azure: Azure Kubernetes Service, Azure Container Instances

## Automatisierung der Infrastruktur
Bei allen Cloud Anbietern können Infrastrukturkomponenten wie Virtuelle Maschinen, Datenspeicher, Netzwerkkomponenten und auch die zugehörigen Berechtigungen als „Infrastructure as Code“ (kurz IaC) definiert werden.
Das bedeutet, dass die Infrastruktur und zugehörige Berechtigungen als Programmcode in einem Infrastrukturtemplate definiert werden.
Wenn IaC noch nicht eingesetzt wurde, dann wird es jetzt mit der Rearchitecting Strategie eingeführt.
Jeder Cloud-Anbieter hat dazu seinen eigenen Dienst. Als unabhängiges Werkzeug hat sich jedoch [Terraform](https://www.terraform.io/) etabliert.

Durch IaC werden Änderungen an der Infrastruktur versioniert, was Nachvollziehbarkeit der Änderungen, Wiederverwendbarkeit und Rollbacks ermöglicht.
Das Infrastrukturtemplate wird mit Parametern versehen, wodurch mit einer zentralen Definition mehrere Umgebungen aufgesetzt werden können (Development, Staging, Produktion).
Mit IaC ist es auch möglich, die Entwicklungsumgebung in der Cloud automatisiert abends zu löschen und morgens um 6 Uhr automatisiert wiederaufzubauen, um Kosten zu sparen.

Die Automatisierung der Infrastruktur sorgt insgesamt für Stabilität und reduziert Fehler durch Anpassungen von Hand.

## Continuous Delivery (CD)
Um die schnellere und zuverlässigere Auslieferung der Software zu garantieren, wird Continuous Integration und Continuous Delivery eingesetzt.
Continuous Integration (CI) sorgt für den automatisierten Build, die Ausführung der Tests und die Veröffentlichung des Artefakts nach jeder Codeänderung. 
Ich gehe davon aus, dass CI bereits eingesetzt wird.

Continuous Delivery (CD) erweitert CI und sorgt dafür, dass gebaute Artefakte automatisiert in die Produktion gebracht werden können. 
Voraussetzung dafür ist eine gute Testabdeckung.
Die Automatisierung der Deployments reduziert manuelle Fehler und erhöht die Stabilität und Verfügbarkeit der Software. 
Als Werkzeuge können sowohl Cloud Dienste, als auch Build-Server von Drittanbietern wie Jenkins eingesetzt werden. 
Da der Betrieb von Build-Servern wartungsaufwändig ist, sollte man auch den Einsatz einer komplett verwalteten Continuous Delivery Pipeline des jeweiligen Cloud Anbieters in Erwägung ziehen.

## Datenbankdienst des Cloud Anbieters nutzen
Die Cloud Anbieter bieten viele Datenbanktypen als verwaltete Services an, dazu zählen nahezu alle relationalen Datenbanken und viele NoSQL Datenbanken. 
Der Umstieg auf eine vom Cloud Anbieter verwaltete Datenbank sollte bei den gängigen Datenbanktypen bereits mit der Rehosting oder der Replatforming Strategie erfolgt sein.
Die Cloud bietet aber weitere spezielle Datenbanktypen bspw. für Zeitreihen oder Buchführung. 
Im Rearchitecting Schritt wird geprüft, ob diese Dienste Komponenten innerhalb der Anwendung ablösen können.


## Statischen Webcontent auslagern
Für statischen Webcontent bieten die Cloud Anbieter ebenfalls spezialisierte und kostengünstige Services an.
Die statischen Webseiten werden dazu in einem Objektspeicher abgelegt, der als Webserver konfiguriert wird. 
Die Auslieferung der statischen Seiten lässt sich mit einem Content Delivery Network (CDN) kombinieren. 
Das sorgt für schnelle Auslieferung der Daten durch Caching nah beim Kunden. Außerdem wird der Applikationsserver dadurch entlastet.

## Datenspeicherdienste der Cloud nutzen
Die Cloud Anbieter stellen eine Vielfalt an Datenspeicherdiensten zur Verfügung. 
Neben virtuellen Festplatten und Netzwerkspeicher (NFS) gibt es den besonders günstigen Objekt- bzw. Blob-Speicher.
Mit der Rearchitecting Strategie wird das Speichern von Daten auf Festplatte oder in der Datenbank nach Möglichkeit auf den Objektspeicher migriert.

Neben dem Pay-per-Use Preismodell bietet dieser Speicher den Vorteil, dass die Kapazität unbegrenzt ist. 
Außerdem bietet der Dienst Verschlüsselung und Versionierung der Daten an.

## Cloud native Services nutzen
In diesem Schritt werden Komponenten der Anwendung durch Cloud Services ersetzt. Die Cloud Anbieter bieten teilweise hunderte Services an und das Angebot wächst stetig.
Die folgende Liste zeigt eine Auswahl der austauschbaren Dienste:
-	Queues
-	Message Bus
-	Mail- und SMS Versand
-	Caches
-	Authentisierung und Benutzerverwaltung
-	Konfigurations- und Secrets Management
-	Event Streaming Plattform
Das Ersetzen dieser Komponenten durch Cloud Services macht den Code schlanker, die Entwicklung effizienter und die Anwendung zuverlässiger.

## Logging, Monitoring und Alerting Services nutzen
Ein Logmanagement System ist essenziell für die effiziente Wartung der Anwendung und für die Sicherstellung der Qualität durch schnelle Fehlerbehebung.
Logmanagement Systeme sind entweder teuer eingekauft oder wartungsaufwändig und fehleranfällig.
Bei der Rearchitecting Strategie sollte man den Logmanagement Dienst des jeweiligen Cloud Anbieters nutzen, um diesen Problemen zu entgehen.
Das zentralisierte Logging ist die Voraussetzung für die Aktivierung von Alerts und dem Erstellen von Monitoring Dashboards, auf denen das Verhalten der Anwendung kontinuierlich überwacht werden kann.
Damit sich aus den Logmeldungen Metriken ableiten lassen und Fehler leichter diagnostizierbar sind, kann es erforderlich sein, das Logging der Anwendung zu überarbeiten.

## Die Anwendung in kleinere Module zerlegen
Die Cloud nutzt ein Pay-per-Use Modell. Deswegen ist es sinnvoll, die Anwendung in kleinere, eigenständige Komponenten aufzuteilen, denn kleinere Komponenten skalieren kosteneffektiver.
Die Anwendung sollte in Microservices aufgeteilt werden, falls noch nicht geschehen. 

Innerhalb der Microservices sollte geprüft werden, ob einzelne Funktionen der Anwendung als Serverless Functions bzw. Functions as a Service (FaaS) ausgelagert werden können.  
Dazu eignen sich besonders asynchrone oder eventbasierte Abläufe, wie Dokumenten- oder Bildverarbeitung, die schnell hoch und runter skalieren müssen und unregelmäßig verwendet werden.
Einige Programmiersprachen bzw. Frameworks wie Go, NodeJS oder Quarkus sind für FaaS deutlich besser geeignet als bspw. Java und Spring. 
Bei Letzterem sollte die Umstellung auf FaaS mit einer Umstellung der Programmiersprache einhergehen.

Die Zerlegung kann unter Anwendung des „[Strangler Fig Pattern](https://martinfowler.com/bliki/StranglerFigApplication.html)“ für evolutionäre Architekturen inkrementell erfolgen.
Die folgende Grafik veranschaulicht das Vorgehensmodell des Strangler Fig Pattern.
 
![Das Strangler Fig Pattern](/assets/images/posts/cloud-native-migration-mit-der-rearchitecting-strategie/strangler-fig-pattern.png)  

Neue Features werden als neue Module in die Anwendung integriert. Ein Dispatcher sorgt für die Verteilung der Anfragen auf die Module. 
Gemeinsam genutzte Funktionalität wird anschließend als neues Modul aus der bestehenden Anwendung herausgelöst.
Über die Zeit wird die Anwendung dadurch in kleinere Module zerlegt.
Die Zerlegung der Anwendung fördert außerdem die unabhängige Entwicklung der Teams, wodurch Features einfacher in Produktion gebracht werden können.

# Was haben wir gewonnen?

Schauen wir uns an, was wir durch die Anwendung der Rearchitecting Strategie im Vergleich zur Replatforming Strategie gewonnen haben.

## Kosteneffizienz
Durch die Rearchitecting Strategie wird das Pay-per-Use Preismodell optimal ausgenutzt. 
In Kombination mit automatischer Skalierung und Scale-to-Zero gibt es keine Über- oder Unterprovisionierung mehr.
Wenn eine Komponente nicht genutzt wird, entstehen auch keine Kosten.
Das gilt nicht nur für Computing Ressourcen, sondern auch Speicherdienste, Datenbanken und andere Cloud native Dienste. 

## Entwicklungseffizienz
Mit der Umstellung auf Cloud native Services wurde ein großer Teil der infrastrukturellen Verantwortung an den Cloud Anbieter ausgelagert, wodurch mehr Fokus auf die Weiterentwicklung der Anwendung gelegt werden kann. 
Der Aufwand für den Aufbau, die Wartung und das Patchen der Infrastruktur wurden drastisch reduziert.
Die Erweiterung der Anwendung wird vereinfacht, da die Services der Cloud Anbieter einfach untereinander verbunden werden können.

## Betriebliche Qualität
Die Infrastrukturautomatisierung ermöglicht die Versionierung und den reproduzierbaren Aufbau der Infrastruktur. 
Es verhindert Fehlkonfiguration und Sicherheitsprobleme durch manuelle Eingriffe.
Die Cloud native Services ermöglichen Zero-Downtime Deployments und Rollbacks, was die Verfügbarkeit verbessert. 
Außerdem versorgt der Cloud Anbieter die Dienste mit Sicherheitsupdates ohne Downtime.
Zero-Downtime Deployments ermöglichen es, häufiger und zu jeder Tageszeit Software in Produktion auszurollen, wodurch Features schneller ausgerollt werden können und Fehler schneller behoben werden können. 

Die Logging und Alerting Dienste der Cloud Anbieter ermöglichen die frühzeitige Erkennung von Fehlern. 
Datensicherung, Datenversionierung und Rollbacks sind einfach zu konfigurieren.
Durch die automatische Skalierung ist die Performanz der Anwendung jederzeit sichergestellt. 
Die Auslagerung der statischen Webseiten in Kombination mit dem CDN sorgt für niedrige Latenzen.


## Sicherheit
Services, die vom Cloud Anbieter betrieben werden, werden regelmäßig ohne Downtime mit Security Patches versorgt.
Datenverschlüsselung wird von Datenbanken und Datenspeicherdiensten unterstützt und kann einfach aktiviert werden.

Durch Automatisierung der Infrastruktur mit IaC werden Sicherheits- und Berechtigungsfehler in der Infrastruktur reduziert.
Zero Downtime Deployments ermöglichen darüber hinaus das schnelle Ausrollen von Sicherheitspatches.
Außerdem haben die Cloud Anbieter weitere Sicherheitsdienste im Portfolio, die sich leicht in die Anwendung integrieren lassen. 
Dazu zählen Web Application Firewalls, aber auch Werkzeuge zur statischen Codeprüfung oder Sicherheitsratgeber.

# Hat die Rearchitecting Strategie auch Nachteile?
Durch den Einsatz von Cloud native Services verstärkt sich der Vendor Lockin. 
Die Anwendung ist nach der Refactoring Strategie stärker abhängig vom jeweiligen Cloud Anbieter.

Für die lokale Entwicklung benötigt jeder Entwickler Zugriff auf die Cloud Dienste. Alternativ dazu, gibt es auch Werkzeuge, die die Cloud Umgebung lokal simulieren wie beispielsweise [Localstack](https://github.com/localstack/localstack).


# Weitere Werkzeugunterstützung 
Es gibt diverse Plugins für die Entwicklungsumgebung, die die effiziente Entwicklung, das Deployment und das Debuggen von Cloud Anwendungen ermöglichen, bspw. [AWS Toolkits](https://aws.amazon.com/de/tools/) oder [Google Code](https://cloud.google.com/code/). 
AWS bietet mit dem Well [Architected Tool](https://aws.amazon.com/de/well-architected-tool/) ein Werkzeug an, das die Architektur analysiert und Verbesserungempfehlungen ausgibt.


# Fazit
Mit der Rearchitecting Strategie habe ich gezeigt, wie eine Anwendung in eine Cloud native Anwendung überführt werden kann. 
Die Rearchitecting Strategie kann und sollte inkrementell angewendet werden, statt in einem großen mehrjährigen Projekt mit einer Big Bang Strategie.
Die Rearchitecting Strategie garantiert dabei zu jederzeit funktionierende und erweiterbare Software.
Erst mit der Rearchitecting Strategie werden die Vorteile der Cloud wie Kosteneffizienz, betriebliche Qualität und die gesteigerte Entwicklungseffizienz optimal ausgenutzt.
