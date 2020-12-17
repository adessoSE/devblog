---
layout: [post, post-xml]              
title:  "CleanCode-Schulung in neuem Gewand"        
date:   2021-01-01 10:00                    
author: bianca-batsch                   
categories: [Softwareentwicklung]             
tags: [Qualität, CleanCode]
---

Als Berater für den Aufbau eines geeigneten Testumfeldes im Public Umfeld, wollen wir Euch in unserem mehrteiligen Erfahrungsbericht einladen, die verschiedenen Höhen und Tiefen in der Umsetzung zu begleiten.
In diesem Teil geht es weiter mit der Testautomatisierung, speziell im Bereich des GUI-Tests.

# Erfahrungen mit GUI-Oberflächentests im Public Umfeld
Wie bereits in unserem [letzten Blogbeitrag](https://www.adesso.de/de/news/blog/testautomatisierung-in-der-praxis-erfahrungen-mit-soapui-im-public-umfeld.jsp) angeteasert, handelt es sich hierbei um die Fortsetzung des gleichnamigen Blogbeitrages. 
Die beiden Blogbeiträge bilden eine zusammenhängende Serie, jedoch sind die Themeninhalte voneinander abgetrennt. 
Daher ist auch eine Einzelbetrachtung der angesprochenen Themenbereiche durchaus sinnvoll.
Im **Teil 2** des Blogs über Testautomatisierung widmen wir uns der Automation von Oberflächentests, den sogenannten GUI- bzw. UI-Tests. 
Wie bereits in **Teil 1** dargelegt, bietet die Testautomatisierung im Kontext der Qualitätssicherung großes Potential zur Steigerung der Softwarequalität. 
Trotz des hohen initialen Ressourcenaufwandes, den hohen Anforderungen an einen sensiblen Hochsicherheitsbereich und der Erstellung der technischen Infrastruktur überwiegt die im Betrieb enorm hohe Zeitersparnis und Motivation (durch Auflösung von sich wiederholenden und monotonen Tätigkeiten), sodass sich ein Return-of-Investment (ROI) eingestellt hat. 
Folglich bleibt es unser Ziel, das Thema der Testautomatisierung perspektivisch und proaktiv weiter voran zu treiben und das Portfolioelement der Testautomatisierung fachverfahrensübergreifend auszubauen. 
Eine weitere Ausbaustufe unseres Testautomatisierungsportfolios, der wir uns in diesem Blog-Eintrag widmen, sind automatisierte Oberflächentests (fortan GUI-Tests). 
Aufgrund der ersten Erfolge der automatisierten Schnittstellen-Regressionstests mit Hilfe von SoapUI Pro, wollen wir das dort gewonnene Wissen nutzen, um diesen Ansatz bei GUI-Regressionstests weiter zu verfolgen. 
Folgende Fragestellungen wollen wir beleuchten: Warum wollen wir, neben automatisierten Schnittstellentests, GUI-Tests durchführen? Warum besteht die Notwendigkeit automatisierter GUI-Tests? 
Wie lassen sich automatisierte GUI-Tests sinnvoll einsetzen und welche Probleme tauchen dabei auf? 
Können wir aus den Erfahrungen der vorangegangenen Testautomatisierung und dem dort angesprochenen 4-Phasen-Modell einen Nutzen für die Oberflächentests ziehen? Lassen sich die vorliegenden Ergebnisse der Testautomatisierung von Schnittstellen mit der Testautomatisierung von Oberflächentests sinnvoll miteinander verbinden bzw. ergänzen?

## Testautomatisierung der GUI bzw. UI
Die Anwendungen zur GUI-Automatisierung basieren primär auf Internet-/Webtechnologien und sind die Grundlage für zahlreiche Testautomatisierungstechnologien wie **Webdriver IO**, Python, Tosca, Selenium oder Ranorex. 
Diese können bei Bedarf mit anderen Tools zur (Schnittstellen-)Testautomatisierung, in unserem Fall SoapUI Pro, kombiniert werden, indem bspw. zwischen den Schnittstellen speziell angepasste Skripte ausgetauscht werden. 
Die Einbindung und Ausführung der Testskripte wurde entsprechend übergreifend durch SOAP gesteuert/orchestriert und bietet somit u. a. die Möglichkeit, den Testablauf an einem beliebigen Punkt der automatisierten GUI-Ausführung zu starten. 
Wir haben uns an dieser Stelle für das Open Source Framework Webdriver IO entschieden, welches ausschließlich den Oberflächenanteil abdeckt und ein Node.JS basiertes Testframework ist. 
Insofern ist er als Nachfolger von Selenium zu sehen. 
Doch was kann Webdriver IO eigentlich sonst noch?
Mit Hilfe von Webdriver IO lassen sich während des Testbetriebes bspw. eingelesene Testdaten in die zu testende Weboberfläche übertragen. 
Dahinter verbirgt sich der Sinn, dass die Oberfläche automatisch mit Daten befüllt wird, die an das Backend gesendet und von Web-/MicroServices verarbeitet werden können, oder dass Feldvalidierungen getestet werden kann. 
Zudem gilt seine Adaptierbarkeit als ein weiterer großer Vorteil, da so Möglichkeiten geschaffen werden, andere Werkzeuge in den Testbetrieb einzugliedern. 
In diesem Zusammenhang sei hier einmal, für tiefer Interessierte, auf die ausführliche und sehr hilfreiche [Installationsbeschreibung der Webdriver IO](https://webdriver.io/docs/gettingstarted.html) Projektseite hingewiesen.


Insofern konnten die automatisierten GUI-Tests, die in unserem Falle mit Webdriver IO entwickelt wurden, als zusätzliche Komponente unseres Regressionstestportfolios betrachtet werden. 
Die dafür benötigten Testdaten sind dabei bspw. entweder in einer Datenbank gespeichert oder, wie in unserem Fall, innerhalb einer organisierten und umfangreichen Excelliste hinterlegt. 
Diese klassische Liste enthält alle Daten und Reglements, die für die zahlreichen fachlichen und technischen Anforderungen bzw. Testszenarien relevant sind. 
Die Zusammenstellung der Daten und die Festlegung der Regelparameter hat mit Abstand die meisten Implementierungsaufwände mit sich gebracht. 
Hier liegt auch ein weiteres Problem, das mit der Kombination vieler Testszenarien einhergeht, die nutzerfreundliche Aufbereitung/Verwaltung der hinterlegten Regressionstestszenarien. 
In unserem Fall sind dies gerade noch überschaubare 354 Testszenarien, jedoch kann die Anzahl, je nach Komplexitätsgrad der zu testenden Anwendungen/Systeme, exponentiell ansteigen. 
Um die Flut an Regeln und geforderten Testabdeckungen bedienen zu können, bieten speziell angepasste (VBA-)Makros eine wertvolle Hilfestellung. 
Dies haben wir bereits umfassend nutzen dürfen, mit dem Ergebnis, dass diese Makros es den Endusern bzw. Sachbearbeitenden möglich machen, innerhalb eines vorgegebenen Testframeworks eigenständig individuelle Szenarien zu erstellen, die innerhalb der eingefassten Regelsysteme agieren. 

![Abbildung 1 Testdatenerstellung](/assets/images/posts/Testautomatisierung-in-der-Praxis/Testdatenerstellung.png)

Insofern konnte hier ein Teil der elementar benötigten Testaufwände verschoben werden, sodass der Fokus in der Testautomatisierung auf speziellere Testszenarien gelegt werden konnte. 
In diesem Zuge stieg damit auch der bereits angesprochene Komplexitätsgrad im Aufbau der Tests. 
Abhilfe kann hier **Cucumber** schaffen. 
Was? Wie? Eine Gurke?
Cucumber ist natürlich keine Gurke, sondern ein Behavior-Driven-Development-Werkzeug zur textuellen Spezifikation von Anforderungen. 
Bezogen auf unsere Projektsituation bietet es somit die Option, den Fachbereich des Kunden um eine textuelle Testanforderungsunterstützung in natürlicher Sprache zu erweitern. 
Komplexe Testfälle können nach diesem Prinzip in natürlicher Sprache präzise beschrieben werden - "Wenn Fall x eintritt dann erwarte y". 

![Abbildung 2](/assets/images/posts/Testautomatisierung-in-der-Praxis/Testfallbeschreibung.png)

Die so formulierten Testfälle können fortan im Hintergrund mit JavaScript ausprogrammiert werden. 
Mit diesem Bestreben entsteht – im besten Fall – eine Symbiose zwischen dem Fachbereich und der IT, die unterschiedlich formulierte Abstraktionen (Entwicklungs-/ Schnittstellen-/ Oberflächentests) zusammenführt und einen praktischen Einblick gewähleistet. 
Somit entfällt das Problem, dass auf der Entwicklungsseite Tests granular, auf einzelne Werte fokussiert geschrieben werden, die für nicht-Entwickelnde kryptisch erscheinen mögen und für diese Gruppe folglich nicht transparent und somit nicht ohne Weiteres editierbar sind.
Aus unserer Sicht erscheint es ratsam, die Entscheidung, wie tiefgehend GUI-Testautomatisierung erfolgen soll, projektspezifisch zu treffen, da eine mögliche Übergabe des Projektes eine enorme Einarbeitung auch abseits der projektspezifischen Charakteristika bedeutet (bspw. beim Umgang mit den verschiedenen Tools) und die Tools auf eine teils nicht zu unterschätzende, stetige Wartungsleistung angewiesen sind.
Für die zukünftige Weiterentwicklung unserer Testautomatisierungsbestrebungen schwebt uns die Integration von **Chai** vor, denn dies würde es uns erlauben, unsere 354 Testszenarien in Reports auswerten zu lassen. 
Hier sind wir allerdings derzeit noch in der Analysephase. 
Daher kommt hier die Frage auf, ob ein möglicher Implementierungsaufwand im Verhältnis zum Nutzen steht.
Chai bietet die Möglichkeit, eine Auswertung zu den durchgelaufenen Tests zu erstellen. 
Es können also nach allen Testläufen oder selbst innerhalb einzelner Läufe entsprechend aussagekräftige Reports erstellt werden, die im Hinblick auf diverse Parameter, bspw. der Gesamtanzahl von durchgeführten Tests und der Teilmenge von positiven und negativen Testergebnissen, Basis-Informationen generieren.
Dies würde entsprechend einen weiteren manuellen Aufbereitungsschritt obsolet machen. 
Dazu mehr in einem möglicherweise kommenden **Teil 3** unserer Serie zur Testautomatisierung im Public Umfeld.


# Unser Fazit
Nach Inbetriebnahme eines Release der von uns betreuten Fachanwendung traten unerwartet und für uns völlig überraschend Fehler in den Eingabemasken auf. 
Aufgrund der Kritikalität wurde das Release zurückgezogen, gefixed und ein Test aller Masken der Anwendung mit höchster Priorität angeordnet. 
Dies verursachte enormen manuellen Aufwand und eine hohen Frustration, da sich monotone Tätigkeiten häuften. 
Nach ersten Erfolgen mit Teilautomatisierungen innerhalb der GUI stellte sich eine erwartete Zeitersparnis anfangs jedoch nicht ein, da ständige Zertifikats- und Credentialswechsel mit begrenzter Gültigkeitsdauer auf den unterschiedlichen Testumgebungen auch für "stresserprobte" Consultants eine ambitionierte Aufgabe darstellten. 
Jedoch boten sich auch Überschneidungen zu vorher nicht erwarteten Bereichen, bspw. bei der Aufteilung von Testschritten, Testcases und Testsuites. 
Diese verglichen wir mit den bereits bekannten Unterteilungen aus dem agilen Kontext Tasks, Anforderungen und Epics, was die Akzeptanz der Umstellungen beschleunigte.
Insgesamt erscheint nach einer konservativen Schätzung eine **Zeitersparnis von 35%** durch den Einsatz unserer Automatisierungstätigkeiten als Durchschnittswert in unseren Projekten als realistisch. 
Darin sind bereits der Aufwand zur intensiven Einarbeitung in SoapUI, in die anderen angesprochenen Tools und die Gespräche im Zusammenhang mit der "Überzeugungsarbeit" enthalten. 
Nebenbei führten die bereitgestellten Testdatenskripte zu einer wichtigen Verkürzung des Testzyklus und unterstützen agile Methoden, da einzelne zeitkritisch geforderte Testergebnisse fokussiert gewonnen und bereitgestellt werden können. 
Als Kunden-Feedback häufte sich die Wertschätzungen der einheitlichen und nachvollziehbaren Dokumentationen. 
Begleitet werden unsere Konzepte weiterhin von einer aktiven Vorgehensweise, bspw. durch wiederholende Präsentationsangebote und erste praktische Beispielumsetzungen in unterschiedlichsten Einsatzgebieten. 
Zudem werden wir perspektivisch unser Leistungsportfolio noch weiter vertiefen – hierfür bietet sich die Ausweitung im Bereich Last- und Perfomancetests an.
Ihr braucht Unterstützung beim Thema Testautomatisierung? Kontaktiert uns gerne und wir versuchen, Euch mit Rat und Tat zur Seite zu stehen.
