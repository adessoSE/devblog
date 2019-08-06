---
layout: [post, post-xml]
title:  "Eine gute Geschichte mit Git"
date:   2019-07-31 00:00
author: czarnecki
categories: [Softwareentwicklung]
tags: [Git]
---
Systeme zur Versionskontrolle stellen wichtige Tools zur Verwaltung von
Softwareversionen dar, aber auch zur Dokumentation der Entwicklung. Häufig wird
dabei der letzte Aspekt häufig etwas übersehen und so kommt es schnell zu
unsauberen Commit-Historien, welche es schwierig machen, herauszufinden wann
welche Änderungen gemacht wurden. Daher werden in diesem Artikel einige
Operationen vorgestellt mit denen du deine Historie aufräumen kannst.

# Historie verändern
Alle Operationen, die hier vorgestellt werden, verändern die Historie. Daher
sind sie mit Vorsicht zu verwenden, wenn du Commits bearbeitest welche bereits
veröffentlicht wurden und besonders wenn Andere ihre Arbeit darauf basiert
haben. Am sichersten ist es die Historie zu verändern, wenn sie bisher nur bei
dir lokal vorhanden ist. Außerdem kann es Sinn ergeben, die Historie zu
verändern, wenn die Arbeit an einem Branch abgeschlossen ist und er für einen
Pull Request aufgeräumt werden soll.

# Interaktiver Rebase
Für einige der folgenden Operationen wird der interaktive Rebase benötigt.
Dieser erlaubt es dir beim Aufspielen vergangener Commits auf eine neue Basis
unterschiedliche Operationen auszuführen. Diese erlauben einem unter anderem,
einen Commit zu bearbeiten, zu entfernen und mit einem anderen zu vereinen.

Um einen interaktiven Rebase zu starten wird ein Commit benötigt, auf den die
Änderungen aufgespielt werden sollen. Den kannst du bestimmen, indem du abzählst
der wievielte Commit der letzte Commit ist den du bearbeiten möchtest. Wenn du
den vorletzten Bearbeiten möchtest wäre das der zweite Commit. Damit kannst du
den Rebase über `git rebase -i HEAD~n` starten, wobei `n` beschreibt der
wievielte Commit es ist. In Wahrheit ist es jedoch nicht der Commit den du
bearbeiten möchtest, sondern der Eltern-Commit, da Git bei null anfängt. Daher
ist es nötig, dass du den Commit-Hash des Eltern-Commit nimmst, wenn du nicht
zählen kannst und den Hash direkt angeben möchtest.

Wenn du den Rebase nun startest öffnet sich die TODO-Liste in steht welche
Commits neu aufgespielt werden. Der oberste Commit ist der älteste und der
unterste der neuste. Vor den einzelnen Commits wird üblicherweise `pick` stehen.
Dies wirst nachher ändern, um andere Kommandos auszuführen. Wenn du die
TODO-Liste speicherst und schließt führt Git den Rebase aus.

# Eine Commit-Beschreibung bearbeiten
Wenn es sich um den letzten Commit handelt kannst du einfach `git commit --amend
-o` verwenden. Das `--amend` erlaubt es uns, den neuesten Commit zu bearbeiten
und Änderungen zu diesem Änderungen hinzufügen.  Durch `-o` (`--only`
ausgeschrieben) wird dafür gesorgt, dass nur die Code-Änderungen genutzt werden,
die in dem Kommando angegeben werden. Da hier keine angegeben werden, werden
keine neuen Änderungen zum Commit hinzugefügt, das `-o` kann auch weggelassen
werden wenn zuvor keine Änderungen mittels `git add` vorgemerkt wurden. Wenn das
Kommando so genutzt wird öffnet Git einen Editor mit der Commit-Beschreibung des
letzten Commits. Dieser kann frei bearbeitet werden, sodass beim schließen des
Editors ein Commit mit der neuen Beschreibung und den ursprünglichen Änderungen
erzeugt wird.

## Vorgehen bei älteren Commits
Wenn du die Commit-Beschreibung eines älteren Commits bearbeiten möchtest dann
muss dafür ein interaktiver Rebase genutzt werden. Du startest ihn mit `git rebase -i <Commit>`.
In der TODO-Liste ersetzt du, vor den Commits die du
ändern willst, `pick` durch `reword`.  Wenn du den Editor nun schließt geht Git
sequenziell von oben nach unten die Commits durch und spielt diese auf die neue
Basis auf. Sobald es auf einen deiner Commits mit `reword` trifft, stoppt der
Rebase dort und es wird ein Editor mit der Commit-Beschreibung des Commit bei
dem gestoppt wurde geöffnet. Diese kannst du wie jede andere Commit-Beschreibung
bearbeiten. Wenn du fertig bist wie üblich speichern und schließen und der
Rebase wird fortgeführt.

## Übersicht

``` git
# Letzten Commit bearbeiten
git commit --amend -o
# Beschreibung im Editor bearbeiten

# Beliebigen Commit bearbeiten
git rebase -i <Commit>
# reword vor Commits schreiben
# Beschreibung im Editor bearbeiten
```

# Änderungen zu einem Commit hinzufügen/entfernen
## Hinzufügen von Änderungen
Wenn du zum letzten Commit weitere Änderungen hinzufügen möchtest, musst du
diese zunächst durchführen und per `git add` zur Staging-Area hinzufügen. Wenn du damit
fertig bist, kannst du die Änderungen mittels `git commit --amend` zum letzten
Commit hinzufügen. Dies öffnet einen Editor mit der Commit-Beschreibung des
vorherigen Commit welche du frei bearbeiten kannst.  Nachdem du den Editor
verlassen hast wird ein neuer Commit erstellt welcher aus dem alten Commit und
den neuen Änderungen besteht.

## Entfernen von Änderungen
Wenn du die Änderungen nicht behalten willst kannst du sie wie gerade beschrieben entfernen
und sie über `git commit --amend` "hinzufügen".

Wenn du sie behalten möchtest dann kannst du dies erreichen im dem du die
Änderungen die du nicht im Commit haben möchtest mit `git reset HEAD^ <Änderungen>`
zurücksetzt. Damit wird der Stand von `<Änderungen>` vor dem
jetzigen Commit (`HEAD^`) in die Staging-Area geholt und die Änderungen, die du im
letzten Commit gemacht hast, befinden sich im Arbeitsverzeichnis. Jetzt kannst du
wieder über `git commit --amend` einen Commit erstellen, der deine Änderungen
nicht mehr enthält.  Wenn du mit der oberen Methode alle Änderungen entfernen
willst wird Git dich warnen, dass du damit einen leeren Commit erzeugen würdest
und stattdessen `git reset HEAD^` verwenden sollst. Dies setzt `HEAD` wieder auf
den Eltern-Commit des momentan `HEAD`.

## Vorgehen bei älteren Commits
Für einen älteren Commit darfst du wieder einen interaktiven Rebase
starten. Dieses Mal jedoch ersetzt du `pick` durch `edit`. Wenn Git während des
Aufspielens auf einen deiner Commits mit `edit` stößt, landest du in einem normal
nutzbaren Terminal. `HEAD` zeigt nun auf den Commit, den du bearbeiten
möchtest. Das heißt du kannst alle zuvor beschriebenen Operationen durchführen,
da sich das System jetzt so verhält, als wäre der zu bearbeitende Commit der neueste. Wenn du mit deinen Änderungen
zufrieden bist kannst du `git rebase --continue` ausführen und der Rebase wird
fortgeführt. Wenn du Änderungen aus einem älteren Commit entfernst und die
Änderung beibehältst, kann der Rebase zunächst nicht fortgeführt werden, da du
noch Änderungen in deinem Arbeitsverzeichnis hast. Um das Problem zu umgehen
kannst du mit `git stash` die Änderungen sicher zur Seite legen.

## Übersicht

``` git
# Zum letzten Commit hinzufügen

# Änderungen machen und zur Staging-Area hinzufügen
git commit --amend

# Änderungen zum letzten Commit entfernen, ohne beibehalten

# Änderungen entfernen und zur Staging-Area hinzufügen
git commit --amend

# Änderungen beibehalten
git reset HEAD^ <Änderungen>
git commit --amend

# Älteren Commit bearbeiten
git rebase -i <Commit>
# Vorgehen als wäre es der letzte Commit
```

# Mehrere Commits vereinen
## Manuell
Das Vereinen von zwei oder mehr Commits benötigt wieder einen interaktiven
Rebase. In der TODO-Datei kannst du nun vor Commits, die mit dem vorherigen
(nach oben) vereinigt werden sollen, `squash` oder `fixup` schreiben. Bei
Commits die du mit `squash` oder `s` markiert hast, hält Git an und erlaubt es
dir die neue Commit-Beschreibung zu bearbeiten. Für die neue Commit-Beschreibung
reiht Git einfach alle Commit-Beschreibungen aneinander. Bei Commits, die du mit
`fixup` oder `f` markiert hast, wird die Commit-Beschreibung verworfen und nur
die des Commit verwendet, in den vereint wird. Allerdings musst du hier darauf
achten, dass du den obersten Commit in der TODO-Datei nicht zum Vereinen
markierst, da du ansonsten eine Fehler-Meldung bekommst und die anderen Commits
"verlierst".  Falls dir das passieren sollte ist es am einfachsten den Rebase
mit `git rebase --abort` abzubrechen und ihn neu durchzuführen. Nachdem du die
Commits, die du vereinen möchtest, ausgewählt hast wird der Rebase durchgeführt.

## Automatisch
Wenn du bereits im voraus weißt, dass du einen Commit mit einem anderen vereinen
willst, kann Git dir das Leben etwas einfacher machen. Nachdem du deine
Änderungen gemacht und zur Staging-Area hinzugefügt hast, kannst du mit
`git commit --fixup=<Commit>` oder `git commit --squash=<Commit>` den Commit zum
automatischen Vereinen markieren. Dies erstellt einen Commit der mit `squash!`
bzw. `fixup!` beginnt, gefolgt vom Header der Commit-Beschreibung von
`<Commit>`. Zusätzlich erlaubt `--squash` es noch die Commit-Beschreibung zu
bearbeiten, wobei der Header nicht bearbeitet werden sollte. Wenn du nun einen
Rebase oder interaktiven Rebase mit der Option `--autosquash` ausführst wird Git
die passenden Commits vereinen, bzw.  beim interaktiven Rebase ordnet es die
Commits in der nötigen Reihenfolge an und markiert sie automatisch mit `squash`
und `fixup`.

## Übersicht

``` git
# Manuell squash/fixup
git rebase -i <Commit>
# In TODO-Liste Commits mit `squahs/fixup` markieren
# Wenn nötig Commit-Beschreibungen bearbeiten

# Automatisch squash/fixup
git commit (--fixup | --squash) <Commit>

git rebase [-i] <Commit>
```

# Commit aufteilen
Wenn der Commit den du aufteilen möchtest der letzte Commit ist kannst du über
`git reset HEAD^` deine Änderungen zurücksetzen, ohne sie zu löschen. Der Reset
setzt den momentanen `HEAD` auf den angegeben Stand zurück. Wenn keine weiteren
Optionen gegeben werden setzt Git mit der Option `--mixed` zurück. Dadurch wird
die Staging-Area zurückgesetzt, aber die Änderungen befinden sich noch im
Arbeitsverzeichnis. Hier kannst du nun die Änderungen auf mehrere Commits
aufteilen.

## Vorgehen bei älteren Commits
Bei älteren Commits ist es wieder nötig einen interaktiven Rebase durchzuführen.
In der TODO-Datei musst du die Commits die du aufteilen möchtest mit `edit`
markieren. Wenn der Rebase bei dem Commit ankommt den du bearbeiten willst
kannst du so vorgehen als wäre es der letzte Commit, da `HEAD` jetzt auf den
Commit zeigt.

``` git
# Letzten Commit aufteilen
git reset HEAD^
# Teil-Änderungen hinzufügen und Commit erstellen

# Alten Commit aufteilen
git rebase -i <Commit>
# vorgehen als wäre es der letzte Commit
```

# Die Historie und du
Die Git-Historie ist ein praktisches Tool zur Dokumentation der Entwicklung
eines Projektes. Je nachdem wie sie gepflegt wird erlaubt sie einem schnell
herrauszufinden wann etwas gemacht wurde oder auch wie jemand bei der
Entwicklung vorgegangen ist und was tatsächlich getan wurde. Git bietet
jedenfalls einige Operationen um es einem möglich zu machen, eine aufgeräumte Historie
zu haben.
