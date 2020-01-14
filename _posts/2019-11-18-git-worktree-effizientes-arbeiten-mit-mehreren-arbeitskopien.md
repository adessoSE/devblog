---
layout: [post, post-xml]              # Pflichtfeld. Nicht ändern!
title:  "git worktree - Effizientes Arbeiten mit mehreren Arbeitskopien"         # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2019-11-18 10:25              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
author: smsnheck                      # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: [Softwareentwicklung]                    # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [git, Versionsverwaltung]                 # Bitte auf Großschreibung achten.
---

# git worktree - Effizientes Arbeiten mit mehreren Arbeitskopien

In der heutigen Entwicklung geht kaum noch ein Weg an git vorbei. 
Einer der vielen Vorteile von git ist, dass man stets auf dem lokalen Repository arbeitet und so schnell und ohne größere Mühen einen Branch anlegen oder wechseln kann. 
In diesem Blog-Beitrag betrachten wir den nicht weit verbreiteten git-Befehl git worktree und schauen uns anhand einiger Beispiele an, wie man in der Entwicklung mit diesem git-Befehl Zeit (und vermutlich auch Nerven) einsparen kann. 


Möchte man auf einen vorhandenen Branch wechseln ist allerdings in der Regel ein sauberer Stand des Repositories vonnöten. 
Dies bedeutet in der Regel keine Änderungen an den bereits versionierten Dateien. 

Nehmen wir jetzt aber mal die folgende Situation an: man entwickelt auf dem Branch `feature/ADESSO-73`. 
Der Test für das Feature ist fertig, aber schlägt noch fehl, und die Businesslogik ist noch mit vielen `// TODO`-Kommentaren versehen. 
Dann stellt jemand ein dringendes Ticket ein, welches ein Bug an einem vorher entwickelten Feature beschreibt und die gesamte Produktion lahmlegt. 
Ein Fix muss daher so schnell wie möglich her. 


Wahrscheinlich stand jeder schon einmal vor so einer oder so einer ähnlichen Situation und hat seine eigene Art und Weise gefunden, wie er damit umgeht. 
Eine Möglichkeit ist mit dem Befehl `git stash` zu arbeiten um die lokalen Änderungen temporär zu sichern. 
Dann ist das lokale Repository "sauber" und es kann der Branch gewechselt werden, um den Fehler zu beheben. 
Nach erfolgter Fehlerbehebung kann man schlussendlich wieder auf den ursprünglichen Branch `feature/ADESSO-73` wechseln und die gesicherten Änderungen wieder mittels `git stash apply` einspielen und die ursprünglich unterbrochene Entwicklung fortführen.


Steht man häufiger vor der Herausforderung zwischen unterschiedlichen Branches zu wechseln und Dinge parallel zu entwickeln, kann dieses Vorgehen schnell unübersichtlich oder unhandlich werden. 
Außerdem können Änderungen in dem lokalen Repository mit diversen gelöschten, umbenannten und geänderten Dateien hinreichend komplex sein, so dass man lieber nichts riskieren und das lokale Repository so belassen möchte, wie sie ist. 
Zudem kann auch eine temporär gesicherte Änderung über `git stash apply` schnell auf einem falschen Branch angewendet werden, was nicht immer sofort bemerkt wird. 


In diesen Fällen kann der git-Befehl `git worktree` abhilfe schaffen. 
Mit diesem Befehl ist es möglich mehrere Arbeitskopien des lokalen Repositories zu erstellen und zu verwalten. 
Die Arbeitskopie wird hierbei lokal erstellt und hat keine eigene Kopie des Repositories. 
Bedeutet: Anstelle des sonst üblichen `.git`-Verzeichnises mit vielerlei Meta-Informationen und Branches findet man in der neu angelegten Arbeitskopie lediglich ein Verweis über eine `.git`-Datei. 
Durch diese Verbindung stehen alle Commits, Branches, Tags und so weiter beiden Arbeitskopien zur Verfügung. 
Somit ist es auch möglich alle Commits und Branches mittels `git rebase`, `git merge` oder `git cherry-pick` in die unterschiedlichen Arbeitskopien zu bringen. 

Betrachten wir nun den Befehl zum Anlegen einer neuen Arbeitskope: 
`git worktree add -b hotfix/ADESSO-4711 ../adesso-blog-4711 master` erzeugt eine neue Arbeitskopie des lokalen Repositories. 
Schauen wir uns den Befehl und Parameter einmal genauer an: 

* der Befehl `worktree add` leitet die Anlage einer neuen Arbeitskopie ein. 
* durch den Parameter `-b hotfix/ADESSO-4711` wird der Branch `hotfix/ADESSO-4711` in der neuen Arbeitskope angelegt. 
* das Ziel der neuen Arbeitskopie wird im darauffolgenden Parameter als relativer oder absoluter Pfad angegeben. In unserem Falle wird neben dem aktuellen Verzeichnis das Verzeichnis `adesso-blog-4711` für die Arbeitskopie angelegt. 
* zuletzt wird die Commit-ID beziehungsweise der Branch angegeben, von dem der neu anzulegende Branch und die zu erstellende Arbeitskopie abzweigen soll. 


Um die Anlage der Arbeitskopie zu verifizieren kann der Befehl `git worktree list` ausgeführt werden. 
Dieser zeigt alle vorhandenen Arbeitskopien an: 

```bash
$ git worktree list
C:/Privat/adesso-blog                         79a5b86223 [feature/ADESSO-73]
C:/Privat/adesso-blog-4711                    e7708ab6aa [hotfix/ADESSO-4711]
C:/Privat/adesso-blog-master                  f875acdb99 [master]
```

Im lokalen Repository (`C/Privat/adesso-blog`) wird im `.git` Verzeichnis das Unterverzeichnis `worktrees` angelegt, welches die Referenzen auf alle vorhandenen Worktrees beinhaltet:

```bash
/c/Privat/adesso-blog/.git/worktrees/adesso-4711
$ ls -al
total 7492
drwxr-xr-x 1 heckmann 1049089       0 Nov 26 09:21 ./
drwxr-xr-x 1 heckmann 1049089       0 Nov 19 15:11 ../
-rw-r--r-- 1 heckmann 1049089       6 Nov 19 15:11 commondir
-rw-r--r-- 1 heckmann 1049089      36 Nov 19 15:11 gitdir
-rw-r--r-- 1 heckmann 1049089      53 Nov 26 09:21 HEAD
-rw-r--r-- 1 heckmann 1049089 7661823 Nov 26 09:21 index
drwxr-xr-x 1 heckmann 1049089       0 Nov 19 15:12 logs/
-rw-r--r-- 1 heckmann 1049089      41 Nov 19 15:12 ORIG_HEAD
```

Nach erfolger Anlage einer neuen Arbeitskopie kann man mittels `cd ../adesso-blog-4711` in die neue Arbeitskopie wechseln, dort die anstehende Arbeit erledigen und mit den bekannten Befehlen einchecken und pushen. 


Nach erledigter Arbeit kann die Arbeitskopie aus dem lokalen Repository über `git worktree remove adesso-blog-4711` (seit git Version 2.17) wieder entfernt werden. 
Für git Versionen < 2.17 muss die Arbeitskopie über das Betriebssystem gelöscht werden und anschließend müssen in dem lokalen Repository mittels `git worktree prune` Verweise auf die Arbeitskopien bereinigt werden. 

Alternativ ist es möglich die angelegte Arbeitskopie für diverse andere parallel anstehende Arbeiten zu verwenden. 
In der Arbeitskopie kann man arbeiten wie in einem normalen, lokalen Repository, was auch bedeutet, dass man in der Arbeitskopie den ursprünglich ausgecheckten Branch wechseln kann und somit die Arbeitskopie für andere Entwicklungen oder Fehlerbehebungen weiterverwenden kann.


## Fazit
Ich empfinde den `git worktree`-Befehl als Erleichterung bei der parallelen Arbeit mit unterschiedlichen Branches. 
Auch wenn es nicht täglich vorkommt, dass auf unterschiedlichen Branches gleichzeitig etwas entwickeln werden muss, kann es bei diesen Anwendungsfällen eine Erleichterung sein. 
Es entsteht weniger Mehraufwand beim Branchwechsel, da die bis dahin umgesetzte und gegebenenfalls noch nicht fertige Arbeit nicht gesichert und später wieder zurückgespielt werden muss. 

Dedizierte Arbeitskopien können sich auch in Codereivews als hilfreich herausstellen. 
Wenn sich beispielsweise durch Wartezeit des lokalen Builds vom Feature-Branch Kapazitäten für ein Code-Review ergeben, kann man eine separate Arbetskopie verwenden um Code-Reviews durchzuführen. 
So können kleinere Review-Änderungen direkt und parallel zu der eigentlichen Feature-Entwicklung durchgeführt werden. 
