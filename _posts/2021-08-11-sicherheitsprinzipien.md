---
layout: [post, post-xml]              # Pflichtfeld. Nicht ändern!
title:  "Sicherheitsprinzipien 2go"         # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2021-08-11 10:25              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2021-08-11             # Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author: vschiller                      # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: [Softwareentwicklung]     # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [IT-Security]   # Bitte auf Großschreibung achten.
---

Software in jeder ISO/OSI Stufe abzusichern kann eine ziemlich komplexe Aufgabe und technologische Herausforderung werden, je nachdem wie viel Zeit und Kosten man investieren möchte. 
Um diese Herausforderung auf ein nicht-technologisches Niveau herunterzubrechen, werden verschiedene Sicherheitsprinzipien vorgestellt und kurz und knapp zusammengefasst.

# Secure by Design 

Die Begriffe Secure bzw. Security by Design beziehen sich darauf, dass Software von Grund auf sicher designt wird. 
Die Sicherheit einer Software sollte von Anfang an in den Entwurf mit einbezogen werden. 
Dies gilt ebenso bei Datenschutzaspekten und wird durch den Privacy by Design Begriff erweitert. 
Eine mit auf die Sicherheit abgestimmte Anwendungsarchitektur verkleinert die Angriffsfläche von Anfang an und spart zudem Kosten im Vergleich zum nachträglichen Einbau von Sicherheistaspekten. 
Bei einem Hausbau beispielsweise ist es am günstigsten und einfachsten, einbruchsichere Fenster und (Terrassen-)Türen zu Beginn einzubauen, statt sie 5 Jahre später auszuwechseln. 

# Secure Defaults

Softwareartefakte sollten mit Secure Defaults ausgeliefert werden, das bedeutet, dass die Standardeinstellungen bereits ein hohes Maß an Sicherheit gewährleisten sollten. 
Die Voreinstellungen sollten unsichere Funktionen und Schnittstellen standardmäßig deaktivieren. 
Hierauf lässt sich auch das Default-Deny-Prinzip anwenden, wobei Sicherheitsparameter immer restriktiv eingestellt werden und diese explizit gelockert werden müssen. 
Ein Beispiel wäre hier die Konfiguration eines Servers. 
Einige Server oder Geräte, die über ein Authentifizierungssystem verfügen, haben Standardbenutzernamen und -kennwörter. 
Wenn sie nicht ordnungsgemäß geändert werden, können sich alle, die die Standardkonfiguration kennen, erfolgreich authentifizieren. 
Ein Secure Default wäre in diesem Falle, dass nach erstmaligen aufsetzen das Passwort geändert werden muss. 

# Defense in Depth

Sicherheit sollte mehrschichtig implementiert werden, um ebenfalls die Angriffsfläche und Sicherheitslücken zu verkleinern.
Wenn ein Mechanismus fehlschlägt, gibt es weitere Sicherheitsmechanismen, um einen Angriff zu verhindern oder zu verzögern.
Oft wird die Analogie zur Verteidigung einer Burg gezogen: Bis eine Burg von Angreifenden erreicht werden konnte, mussten mehrere Mauern, Wälle, Gräben und weitere Verteidigungslinien überwunden werden. 
So wurde frühzeitig ein Eindringling erkannt und mehr Zeit gewonnen um sich zu Verteidigen. 
Im Bereich der IT-Sicherheit kann es sich zum einen um jede Schicht im ISO/OSI Modell handeln und zum anderen können in jeder Schicht selbst wiederum mehrschichtige Sicherheitskontrollen wie beispielsweise im Netzwerk eingebaut werden. 

# Keep it simple

Dieses Prinzip gilt natürlich nicht nur im Bereich der IT-Sicherheit. 
Jedoch sollten gerade sicherheitsrelevant Schnittstellen nicht zu komplex gestaltet werden, sodass keine Fehlbedienung oder -interpretation möglich ist. 
Eine Validierungsfunktion, die beispielsweise aus komplexen regulären Ausdrücken aufgebaut wurde, birgt hohe Risiken und Möglichkeiten zur Fehlinterpretation und sollten wenn möglich vermieden werden. 
Manche sicherheitsrelevanten APIs benötigen eine komplexe Parametrisierung die nicht jede entwickelnde Person, ohne ein Kryptoexperte zu sein, auf Anhieb versteht und sicher implementiert. 
Besser ist es auf Standardbibliotheken zu setzen, die bereits Secure Defaults einsetzen. 
So erhöht sich die Wartbarkeit und lässt sich leichter für das ganze Team verstehen, insbesondere wenn genau die Entwickelnden das Team verlassen, die diese Funktionen implementiert haben. 

# Mistrust before trust

Das Misstrauensprinzip zielt darauf ab, jeglichen Schnittstellen eher zu Misstrauen als zu Vertrauen. 
So sollten zum Beispiel alle vom Client erhaltenen Daten stets misstraut werden, da sie durch einen Man in the Middle Angriff hätten manipuliert werden können. 
Eine Steigerung ist das Zero Trust Modell, bei dem das Prinzip nicht nur lautet niemandem zu Vertrauen, sondern auch jeder Anwendungszugriff authentifiziert werden muss.

# Positives Sicherheitsmodell

Beim positiven Sicherheitsmodell stellt sich die Frage: Was kann erlaubt werden, statt was muss ich verbieten. 
Prinzipiell baut dieses Prinzip darauf auf, dass zunächst einmal alles verboten wird und nur das explizit Erlaubte zugelassen wird. 
Beim umgekehrten Fall, dem „was-muss-ich-alles-verbieten-Fall“ kann es passieren, dass nicht alle Negativfälle betrachtet werden, da sie eventuell auch gar nicht alle bekannt sind. 
So ist das Whitelisting, dem Blacklisting vorzuziehen. 
Das positive Sicherheitsmodell baut auf dem Misstrauensprinzip auf und erlaubt anschließend geprüfte Vertrauensbeziehungen. 

# Ursachenbehebungsprinzip

Falls es doch zu einem Sicherheitsvorfall kommen sollte, sollte immer die Ursache behoben werden. 
Kommt es beispielsweise zu einem Angriff, so kann ein Workaround den Angreifer kurzfristig blockieren, bzw. blacklisten. 
Dies sollte allerdings nur temporär geschehen und die Ursache, wie es zu dem Angriff kommen konnte, behoben werden, um weitere Angriffe zu vermeiden.  

# Konsistente Sicherheit 

Die Sicherheit eines Systems sollte konsistent gestaltet werden, da das Sicherheitsniveau durch die schwächste Teilkomponente bestimmt wird. 
Sicherheit sollte also ganzheitlich, sowie in jeder Teilkomponente betrachtet und designt werden. 
Dafür müssen die Teilkomponenten bekannt sein. 
Bei einem Systementwurf scheinen diese Komponente zunächst sichtbar. 
Bei dem Burgbau mit all seinen Sicherheitswallen und Burggraben ebenfalls. Und trotzdem kann durch menschliche Manipulation ein Trojanisches Pferd alle Sicherheitsmechanismen umgehen. 
Die Teilkomponente Mensch wurde in diesem Fall außer Acht gelassen. 
Daher ist das sichtbar machen von Teilkomponenten, die nicht offensichtlich zum System gehören äußerst wichtig, um konsistente Sicherheit zu gewährleisten. 

# Verwende ausgereifte Sicherheit

Dieses Sicherheitsprinzip zielt vor allem auf kryptografische Umsetzungen ab. 
Wo möglich, sollten keine eigenständig kreierten kryptografisches Verfahren oder ein eigener Algorithmus implementiert werden. 
Nicht nur aufgrund des Keep-it-Simples Prinzips, sondern auch weil bewährte Implementierung und Bibliotheken ausgereift sind, stets gepflegt und ständig getestet werden. 
Bei einem kleinen Implementierungsfehler eines eigenen Verschlüsselungsalgorithmus, kann dieser schon massive Auswirkung auf die Sicherheit haben. 

# Entkopple Sicherheitslogik

Da sich die Sicherheitsstandards fortlaufend anpassen, sollte die Sicherheitslogik an einer zentralen Stelle gepflegt werden.
So kann sichergestellt werden, dass bei einer Anpassung eines kryptographischen Algorithmus, die Anpassung an jeder genutzten Stelle konsistent erfolgt und nicht an einer Stelle übersehen wird.  
Die Wartung des Codes ist handhabbarer und lässt sich dadurch leichter in andere Projekte mit einbinden. 
Zudem kann die Sicherheitslogik separat auf die Sicherheit hin überprüft werden und unautorisierte Änderungen können eher vermieden werden. 

# Who am I?

Wer den Film „Who am I“ nicht gesehen hat, dem sei der Film an dieser Stelle empfohlen. Wie zuvor beschrieben ist es besser auf ein Misstrauensprinzip zu setzen und eher als Standard alles zu verbieten und nur (authentifizierte) Ausnahmen zu erlauben. 
Trotzdem ist es wichtig sich Gedanken über potenzielle Angreifende zu machen, ihre Taktiken zu verstehen und am eigenen System zu testen. 
Dieses Prinzip sollte ergänzend eingesetzt werden, um zu verifizieren, dass die eingesetzten Sicherheitsmaßnahmen ausreichend sind. 
Eine Möglichkeit dies strukturiert und von Anfang am im Softwareentwicklungsprozess zu betrachten und umzusetzen sind Evil User Storys. 
Pentesting bietet eine weitere Möglichkeit.

# Kein Versteckspiel

Als Basis dieses Sicherheitsprinzip dient das Kerckhoffssche Prinzip aus der Kryptographie, welches besagt, dass die Sicherheit eines Verschlüsselungsverfahrens nicht auf der Geheimhaltung des verwendeten Algorithmus, sondern auf die Geheimhaltung des Schlüssels beruhen darf. 
Übersetzt soll es bedeuten, dass die Sicherheit nicht auf der Geheimhaltung der getroffenen Sicherheitsmaßnahmen im Entwurf und der eingesetzten Algorithmen beruhen darf (Security by Obscurity). 
Wer auf Security by Obscurity setzt, erzeugt ein falsches Gefühl von Sicherheit. 
Natürlich ist es besser, wenn eine potenziell angreifende Person so wenig wie möglich weiß, jedoch darf die Sicherheit nicht allein auf das Verstecken von Sicherheitsmaßnahmen beruhen. 
Die Sicherheit einer Anwendung sollte einem Angriff auch standhalten, wenn die Sicherheitsmaßnahmen offengelegt wären.
Dementsprechend gilt es die Sicherheitsmaßnahmen auszuwählen und zu konfigurieren. 

# Make Security Usable and Friendly

Die Sicherheit einer Anwendung hängt nicht nur von den technisch getroffenen Sicherheitsmaßnahmen ab, sondern auch, ob eine nutzende Person mit ihnen umgehen oder sie umgehen kann. 
Viele Nutzenden klicken Zertifikatsfehler weg oder vergeben öfter das gleiche Passwort oder schreiben es sich irgendwo auf.
Komplizierter wird es, wenn man sich plötzlich mit Zertifikaten anmelden muss. 
Wer seine Steuererklärung online abgibt kennt den Prozess. 
Weniger technisch affine Menschen kommen häufig zu dem Punkt, dass dieser Vorgang zu kompliziert erscheint und sie jedes Jahr aufs Neue ihr Zertifikat suchen, dieses wiederrum unsicher abgespeichert ist und zudem keine psychologische Akzeptanz gegenüber diesen Maßnahmen herrscht. 
Daher sollte Sicherheit auch für die Benutzenden stets nutzvoll, verifizier- und nachvollziehbar erscheinen. 

