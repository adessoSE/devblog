---
layout:         [post, post-xml]              
title:          "E2E-Tests vom Webservice bis zur DB eines Monolithen mit JUnit"
date:           2021-03-19 15:00
author_ids: [thorbolo]
categories:     [Softwareentwicklung]
tags:           [Java, Test, JUnit, E2E-Tests, Webservice, Monolith]
---



In diesem Artikel geht es um automatisierte, in die CI-Pipeline integrierbare Tests, die die gesamte Geschäftslogik eines Monolithen von der obersten Schicht (einem Webservice) bis zur untersten Schicht (der Datenbank) abdecken können.
Dieser Artikel richtet sich an Projektleiter, Architekten oder interessierte Entwickler, die sich bei der Entwicklung eines Webservice (oder danach) fragen, wie man diesen dauerhaft testen und qualitätssichern kann.

# Die Ausgangslage

Der Monolith in meinem aktuellen Projekt sollte um eine neue (REST-)Webservice-Schnittstelle erweitert werden.
Unter anderem stellt sich bei der Konzeption zwangsläufig die Frage, wie man die Schnittstelle entwicklungsbegleitend testen kann. 
Natürlich kommen hierbei die üblichen Verdächtigen auf:

- einen rudimentären Client (evtl. mit Benutzeroberfläche) nebenher entwickeln, mit dem die einzelnen Endpoints angesprochen werden können
- etablierte Tools zur Erstellung von REST-Calls verwenden

Beide Möglichkeiten erfordern allerdings einen relativ großen Pflegeaufwand und vor allem erodieren sie schnell, wenn die Schnittstelle sich mit der Zeit ändert.

# Die Grundidee

Ich stelle einmal die These auf, dass Entwickler ungern ihre eigenen Entwicklungen testen und faul sind (behauptete zumindest mein Informatik-Lehrer, als es ums Copy-Paste-Pattern ging).
Allerdings wird alles für einen Entwickler erträglicher, wenn man es "As-Code" umsetzen kann.
So kann man heute Dokumentationen einer REST-Schnittstelle As-Code pflegen und auch die üblichen Unit-Tests sind gewissermaßen ein Beispiel hierfür. 
Während der Ideenfindung zum Problem der Ausgangslage wuchs schnell der Gedanke, dass wir das Testen der Schnittstelle gerne automatisieren und möglichst keinen Client bedienen wollten.
Ein solcher ist oft entweder leichtgewichtig, aber unflexibel oder flexibel, aber dafür komplex.
Aus dem "As-Code" Gedanken entsprang die Idee, ob das nicht in leicht ausführbaren Tests wie Unit-Tests zu lösen sei.
Alle möglichen Komplexitäten der Schnittstelle müssten ja nur einmal in einem solchen Test implementiert werden und wären beliebig wiederholbar ausführbar.

# Die Umsetzung

In diesem Artikel beschreibe ich die Umsetzung nur sehr grob, um den Rahmen nicht zu sprengen.
Die E2E-Tests sind in JUnit inklusive der üblichen Erweiterungen für Spring und Mockito umgesetzt. 
In einer abstrakten Testklasse, von welcher alle E2E-Tests erben, wird der gesamte Monolith über seine einzelnen Springkontexte hochgefahren.
Weniger relevante Randsysteme sind mit Mocks ersetzt worden. 
Die Datenbank wird mit dem Framework *TestContainers* zur Laufzeit aus einer Docker-Registry bezogen und das Schema der Anwendung über die Flyway-Migrationsskripte aus dem produktiven Code erzeugt.
Dieser Schritt wird für jeden Testdurchlauf neu erledigt und ist recht zeitintensiv.
Alternativ kann ein eigener Dockercontainer mit einer fertig eingerichteten Datenbank erzeugt und in einer Registry abgelegt werden, welcher anstelle der leeren Standard-Container geladen wird.
Mithilfe des *REST assured*-Frameworks wird schließlich ein REST-Client erzeugt, der die REST-Endpunkte des Webservice anspricht und direkt Assertions für die Responses mitbringt.
Zahlreiche weitere anwendungsspezifische Konfigurationen werden mit den Hausmitteln von JUnit eingerichtet, sodass am Anfang eines jeden JUnit-Tests eine fertige Laufzeitumgebung des Monolithen und ein REST-Client zur Verfügung stehen.
Von hier an ist das Implementieren der Tests kaum mehr als ein üblicher JUnit-Test.

## Die Tools

- TestContainers (DB)
  - https://www.testcontainers.org
  - Erzeugung leerer Datenbanken verschiedener Hersteller zur Laufzeit. Voraussetzung ist eine erreichbare Docker-Registry für die Testlaufzeitumgebung
- Flyway (DB-Schema Migration)
  - https://flywaydb.org/
  - Framework zur Verwaltung von Datenbankmigrationen.
- Springboot
  - Konfigurieren der Springkontexte des Monolithen und zum Hochfahren der Laufzeitumgebung für die Tests
- REST assured (REST-Client)
  - http://rest-assured.io
  - Erzeugen von REST-Calls As-Code

## Der Ablauf

Da die Tests mit JUnit implementiert werden, ist der Ablauf anhand des Livecycles eines JUnit-Tests zu beschreiben. Diese Gliederung stellt nur eine sehr grobe Beschreibung, da die Details den Rahmen sprengen würden. 

- **@BeforeClass**
  - Konfigurationen und das Herstellen von Bedingungen, die vor dem Hochfahren der Anwendung bestehen müssen. Beispiele: Das Setzen von Umgebungsvariablen und das Hochfahren der Datenbank mit TestContainers

- **@SpringbootApplication und @Configuration**
  - Eine Konfigurationsklasse, mit diesen Annotationen, in der alle Springkontexte des Monolithen hochgefahren werden. Hier können auch beliebige Komponenten gemockt werden.
- **@Before**
  - Bedingungen, die erst nach dem Hochfahren des Monolithen erfüllt werden können, aber vor den Tests geschaffen sein müssen.
- **@Test** - es empfiehlt sich Tests mit ein paar Regeln nach given-when-then zu unterteilen
  - //given: Herstellen aller fachlichen Testvorbedingungen. Dafür werden sehr wahrscheinlich bereits fachliche Schritte durchgeführt, die in anderen Tests ebenfalls verwendet werden. Es empfiehlt sich daher, diese fachlichen Schritte jeweils in Services und einzelne Methoden auszulagern, sodass Sie wiederverwendet können. Dadurch steigt nebenbei die Lesbarkeit deutlich, da anhand der Mthodenaufrufe der fachlichen Kontext später leichter aus dem Code hervorgeht.
  - //when: Ein einziger REST-Call mit REST assured der den tatsächlich durchzuführenden fachlichen Testfall darstellt.
  - //then: Assertions auf dem Response-Objekt des REST-Calls oder die Prüfung von Nachbedingungen im System, die nicht anhand der Response ersichtlich sind.

# Die Vorteile

- Die E2E-Tests laufen vollkommen automatisiert
- Ausführung der Tests in der CI-Pipeline und damit frühzeitige Erkennung von Fehlern in der Geschäftslogik des Monolithen
- "As-Code" erleichtert Entwicklern das Schreiben fachlicher Testszenarien
- Tests erodieren nicht, da sie bei Änderungen direkt mit angepasst werden müssen (spätestens, wenn die nächste Ausführung fehlschlägt)
- Once-Written-Never-Forgotten; Testszenarien müssen nur einmalig als Test implementiert werden und werden bei jeder zukünftigen Ausführung abgetestet

# Die Kehrseite

Mir ist bewusst, dass JUnit ein Framework ist, welches darauf abzielt, so leichtgewichtige Tests wie nur möglich zu schreiben und dass unsere Verwendung des Frameworks diesem Grundgedanken zutiefst widerspricht.
An manchen Stellen mussten wir daher etwas kreativ mit den gegebenen Möglichkeiten von JUnit umgehen. Wichtig ist, dass wir uns dessen bewusst sind und dass wir lediglich in diesem Kontext von den Best-Practices eines üblichen Unit-Tests abweichen.
Das Resultat ist allerdings, zumindest in unserem Kontext, über jeden Zweifel erhaben und legitimiert dazu, auch mal out-of-the-box zu denken.
Bei Fragen zu technischen Details stehe ich euch gerne zur Verfügung: thorben.schiller@adesso.de
