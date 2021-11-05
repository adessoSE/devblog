---
layout: [post, post-xml]              
title:  "Welcher Config-Server passt zu meinem Projekt?"         
date:   2021-10-24 10:25              
author_ids:     [kaythielmann]
categories: [Softwareentwicklung]           
tags: [Java, AWS, Cloud, Springboot, Config-Server]        
---

Konfigurationen für Artefakte von außen zu injecten ist lang bewährte Praxis und wird in vielen Softwareprojekten so gelebt.
Seien es Feature-Switches, stage-spezifische Einstellungen oder andere Werte, deren Ausprägungen stetigen Anpassungen unterworfen sein können, alle sollten am Ende gut nachvollziehbar und sicher abgelegt sein.
Dabei können verteilte Systeme aber auch bereits einzelne Artefakte im Laufe ihrer Entwicklung eine schwer überschaubare Anzahl von Umgebungsvariablen benötigen.
Einige Möglichkeiten, diese Werte zentral zu verwalten, sowie deren Vor- und Nachteile, möchte ich im Folgenden etwas näher betrachten.

# Motivation - Was gilt es zu beachten?
Nicht nur, dass die Anzahl der Konfigurationswerte in einem Projekt, sei es nun verteilt oder monolithisch, mit der Zeit stetig wachsen kann, auch die gespeicherten Werte an sich können unterschiedliche Anforderungen an ein Projekt stellen.
Ist die Konfiguration beispielsweise in einem git Repository mit hinterlegt, so erschlägt man damit bereits Anforderungen an die Historisierung.
Es gibt aber auch verschiedenste schützenswerte Einstellungen, die natürlich nicht mit dem Code im Repository landen dürfen.
Diese sollten gerade für eine Produktivumgebung nicht für jeden einsehbar sein.
Darüber hinaus erhöht es die Sicherheit diese regelmäßig auszutauschen.

Übergeben wir die Konfiguration in Form von Umgebungsvariablen, ergeben sich je nach ausführender Plattform weitere technische Limitierungen in Bezug auf Format und Menge.
So darf z.B. in einer [AWS-EC2-Umgebung](https://docs.aws.amazon.com/de_de/elasticbeanstalk/latest/dg/environments-cfg-softwaresettings.html?icmpid=docs_elasticbeanstalk_console) der Key einer Umgebungsvariable nur die Symbole ```_ . : / + \ - @``` enthalten, wobei durch die gewählte Plattform noch weitere Einschränkungen möglich sind.
Auch für die Länge der Keys und Values gelten hier Einschränkungen, genauso wie für die Gesamtgröße aller Umgebungseigenschaften.

Zu guter Letzt sollte für alle Umgebungsvariablen klar sein, wann und wie oft sie eigentlich gelesen werden müssen.
Reicht es mir, wenn der Wert zum Zeitpunkt des Starts einer Umgebung initial übergeben wird oder ist es evtl. notwendig, sogar während der Laufzeit einen Wert anpassen zu können?

Verschiedene dieser Anforderungen werden durch unterschiedliche Systeme für die Speicherung von Konfigurationen unterschiedlich gut unterstützt.
Neben dem Funktionsumfang unterscheiden sich die Systeme auch stark im Aufwand für Betrieb und Integration in vorhandene Projekte.

# Spring Cloud Config Server
Ist man mit Java und dort evtl. sogar mit Spring unterwegs, so springt einen der Spring Cloud Config Server förmlich an.
Ein Start ist in diesem Kontext schnell gemacht, denn ein einsatzfähiges Docker Image steht bereits zur Verfügung und lässt sich leicht in bestehende Umgebungen wie beispielsweise AWS EKS integrieren.
Die Integration in ein springbasiertes Projekt kann vollständig transparent über einen Spring Boot Starter und ein wenig Konfiguration mit Hilfe einer bootstrap.properties erfolgen.
Für die initiale Befüllung des Config Servers mit den gewünschten Properties lässt sich out-of-the-box mit einfachen Mitteln ein git Repository einbinden, welches dann auch gleich für eine Historisierung der Properties sorgt.

## Pro
Um die vorhandenen Funktionen zu erweitern und z.B. Properties aus weiteren Quellen zu integrieren können wir hier mit wenigen Annotationen schnell ein eigenes spring-boot-basiertes Projekt aufsetzen, in dem wir unser eigener Herr sind.
Und natürlich sind wir nicht darauf beschränkt hier nur springbasierte Java-Projekte mit Konfigurationen zu versorgen.
Es stehen unter anderem auch passenden Libs für NodeJS oder Micronaut zur Verfügung.

## Contra
Am Ende bleibt der Betrieb des Service als ganz sicher nicht unlösbares, aber essentielles ToDo.
Die Last auf dem Service wird dabei selten hoch sein, doch muss ein zentrales Augenmerk der Ausfallsicherheit gelten.
Ohne die passenden Umgebungsvariablen startet keine neue Umgebung. 
Jegliche Skalierung wird im schlimmsten Fall durch einen Ausfall des Config-Servers verhindert.
Aber das gilt letztendlich natürlich für alle Lösungen, die wir selbst betreiben wollen.

![Aufbau der Infrastruktur](/assets/images/posts/configserver/Configserver.png)

Ein Config-Server kann eine ganze Reihe von Artefakten und auch gleichzeitig diverse Stages mit Properties versorgen.
Ändert sich aber ein Wert, so werden nur neu gestartete Instanzen diese Werte auch abrufen.
Geschieht dies durch Skalierungsprozesse könnte ein dauerhafter Schiefstand zwischen den Konfigurationen einzelner Instanzen eines Clusters entstehen.
Wer alle betroffenen Instanzen automatisch benachrichtigen und updaten will muss sich etwas einfallen lassen.
So können z.B. alle betroffenen Instanzen an einen MessageBus angeschlossen werden, an den der Config-Server entsprechende Events schickt, sobald eine Änderung eintritt.
Die Instanzen können dann die neuen Werte über ein Rolling-Update ziehen oder ihren Context on-the-fly updaten.
Aber all dies muss letztendlich selbst implementiert, betrieben und gewartet werden.

# Unleash
Steht der Fokus ehr auf Feature-Switches, soll ein sehr dynamischer Umgang mit Properties unterstützt werden oder ist AB-Testing eine Anforderung mit hoher Priorität, so kann Unleash einiges mitbringen, um dies zu unterstützen.
Im Gegensatz zu anderen Lösungen liegt der Fokus hier auf dynamischen Werten, die sich zur Laufzeit, auch automatisiert einem Regelwerk folgend, ändern können. 
Es handelt sich also weniger um einen klassischen Config-Server, sondern um eine Umgebung in der Feature-Switches an zur Laufzeit abgefragte Bedingungen geknüpft werden können.
Die Anbindung von Unleash erfolgt über einen der zahlreichen Client-SDKs, die für diverse Programmiersprachen zur Verfügung stehen.

![Aufbau der Infrastruktur](/assets/images/posts/configserver/Unleash_Aufbau.png)

## Pro
Der große Vorteil von Unleash ist die Möglichkeit bei jedem einzelnen Durchlauf einer Codestelle, die von einer ausgelagerten Variablen abhängt, neu entscheiden zu können, was passieren soll.
Dabei liegt die Logik für die Bedingungen, die eine Variable beeinflussen, in Unleash und können dort kurzfristig angepasst werden.
Dafür steht auch eine GUI zur Verfügung.
So lassen sich z.B. Szenarien für ein AB-Testing, ein automatisiertes zeitgesteuertes Umschalten von Featuren oder sogar Berechtigungen von Usern dynamisch steuern.

## Contra
In ein vorhandenes System lässt sich Unleash allerdings logischer Weise nicht ganz so einfach integrieren, wie es z.B. mit einem Spring Cloud Config Server der Fall wäre.
Wir müssen jede Stelle im Code identifizieren, die von einer Variablen abhängig ist und dort ein Request an Unleash über den SDK auszulösen. 
Bei einer Software, die schon länger im Betrieb ist, kann sich hier also einiges an Aufwand verstecken.
Der Betrieb von Unleash gestaltet sich in einem Aspekt auch etwas aufwändiger.
Da eine erhöhte Last auf einem Client hier in der Regel eine im gleichen Verhältnis steigende Last bei Unleash verursacht, muss Unleash so eingerichtet werden, dass es mit den Lastspitzen mithalten kann.
Hier muss also nicht nur die Ausfallsicherheit, sondern auch die Performance im Betrieb der Komponente betrachtet werden.

# Consul
Consul aus dem Hause Hashicorp ist eigentlich weit mehr als nur ein Config-Server.
Der als Speicher für Umgebungsvariablen dienende KV-Store ist am Ende nur "eine" der Kernkomponenten.
Hat man über diese hinaus weitere Anforderungen im Projekt, kann Consul sehr interessant werden.
So unterstützt Consul durch seine Serviceregistry wenn selbst gemanagte Loadbalancern im Projekt eingesetzt werden müssen, die sich ohne einen solchen Service sonst schnell zu einem Single-Point-Of-Failure entwickeln können.
Des Weiteren lässt sich hier eine schöne Integration weiterer Tools aus dem Hause Hashicorp erwarten.
So lässt sich Vault einsetzen, um Passwörter sicher zu speichern und zu verwalten.
Quasi selbstverständlich ist die Möglichkeit Consul mit Hilfe von Terraform zu managen.
Um Consul zu betreiben ist zum Beispiel ein Deployment in Kubernetes via Helm vorgesehen.

## Pro
In Consul sind die gespeicherten Keys und Objects bezüglich ihrer Zeichen nicht limitiert.
Die Integration in ein vorhandenes Sping-Boot-Projekt erfolgt auch hier nahezu vollständig transparent über spring-cloud-starter und bootstrap.properties.
Aber auch mit Micronaut und NodeJS sollte es keine Probleme geben.
Consul bietet uns zusätzlich eine Pflege-Oberfläche an, mit der viele Einstellungen schnell und einfach zu erledigen sind.
Wer noch eine Funktion vermisst oder eine vorhandene anpassen will, dem bietet die Erweiterbarkeit über Go Templates eine Option.

## Contra
Auch in diesem Fall ist es denkbar das System selbst zu betreiben und man sollte sich analog zu den anderen Systemen Gedanken zu den Themen Ausfallsicherheit, Performance aber auch Authentifizierung machen.
Denn die Pflegeoberfläche sollte natürlich sehr gut abgesichert sein, um jeglichen Missbrauch zu unterbinden.
Wer keine über die Speicherung von Umgebungsvariablen hinausgehenden Anforderungen hat, der bekommt hier weit mehr geliefert als er bräuchte und könnte sich auch schmalere Lösungen angucken.

# AWS Systems Manager
Wenn die eigene Software bereits in der Cloud läuft, ist es natürlich interessant zu gucken was vom jeweiligen Cloud-Provider bereits angeboten wird.
Am Beispiel von AWS wäre dies der Parameter Store als Teil des AWS Systems Managers.
Umgebungsvariablen werden hier in einer Baumstruktur abgelegt, die es ermöglicht diverse Projekte mit ihren jeweiligen Stages in Teilbäumen zu verwalten, welche dann einzeln abgefragt werden können.
So könnte ein Pfad in der Form ```<projektname>/<stage>/db/url``` die Daten für die Connection-URL zu einer Datenbank enthalten.

![Aufbau der Infrastruktur](/assets/images/posts/configserver/AWS-ParameterStore.png)

## Pro
Ein Vorteil gegenüber selbst gehosteten Lösungen ist die vorbereitete Integration in andere von AWS angebotene Services, wie ECS, EC2, Lambda, Cloudformation, CodeBuild oder CodeDeploy.
Darüber hinaus lässt sich aber auch hier ein beliebiges Sping-Boot-Projekt über einen Starter und eine zugehörige bootstrap.properties transparent anbinden.
Automatisierungen bzw. Runbooks ermöglichen es uns zum Beispiel den Betrieb abzusichern.
So können wir hier entsprechende EC2-Instanzen automatisiert einen Reboot durchführen lassen, wenn Änderungen der gespeicherten Werte vorliegen.
Validierung können wir nutzen, um sicherzustellen, dass die Anforderungen für den Start und Betrieb einer angeschlossenen Applikationen immer erfüllt sind.
Die Parameter sind im Parameter Store versioniert.
Dadurch wird es uns möglich ohne weiteren Aufwand auf alte Stände zurückzurollen oder für Fehleranalysen zu bestimmen, welche Konfiguration zum fraglichen Zeitpunkt genutzt wurde.
Dass der Service nicht selbst gehostet, skaliert oder abgesichert werden muss, vereinfacht den initialen Aufbau.
Natürlich sind damit dann aber Kosten für uns verbunden, die mit dem Betrieb eigener Instanzen einer anderen Lösung abgleichen werden sollten.
Im Parameter Store von AWS lassen sich Passwörter oder andere schützenswerte Properties auch entsprechend verschlüsselt ablegen.

## Contra
Ganz ohne Abstriche geht es aber auch hier nicht. 
So gibt es Einschränkungen der Keys auf Buchstaben, Ziffern und die Symbole ```. - _ ```.
Eine direkte Unterstützung von Elastic Beanstalk wird von AWS auch nicht angeboten.
Nur über die Nutzung eines [Scripts](https://github.com/wobondar/ssm-dotenv) für die Manipulation der Daten in den ebextensions soll dies dennoch machbar sein.

# Fazit
Einen Config Server für ein bestimmtes Projekt an dieser Stelle allgemein zu empfehlen ist in Anbetracht unterschiedlicher Anforderungen sowie dem jeweils nötigen Einsatz von Zeit und Geld gar nicht möglich.
Hier sei nur die Empfehlung ausgesprochen, sich mit den Fragen auseinander zu setzen, was mein Projekt für Anforderungen mitbringt und welcher Aufwand für Integration und Betrieb vom Team gestemmt werden kann.
Gerade der Betrieb sowie die gut vorbereitete Integration machen es interessant sich die Lösungen von Cloud-Providern wie AWS trotz der damit verbundenen laufenden Kosten genau anzugucken.
Aber spezielle Anforderungen wie dynamische Feature-Switches oder der Bedarf an einem Service-Mesh rechtfertigen den Einsatz von Unleash oder Consul trotz höherer Aufwände bei Integration und Betrieb am Ende eventuell dennoch.
