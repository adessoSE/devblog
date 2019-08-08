---
layout: [post, post-xml]
title:  "Alte Geschichte neu schreiben"
data: 2019-08-98
modified_data: 2019-08-98
author: czarnecki
categories: [Softwareentwicklung]
tags: [Git]
---
Systeme zur Versionskontrolle sind nicht nur wichtig für die Verwaltung von
Softwareversionen, sondern auch zur Dokumentation der Entwicklung. Häufig wird
dabei der Dokumentations-Aspekt übersehen und so kommt es schnell zu
einer unsauberen Commit-Historie, die es schwierig macht, herauszufinden wann
welche Änderungen vorgenommen wurden. In diesem Artikel werden einige
Operationen vorgestellt mit denen du deine Historie aufräumen kannst.

Wenn du die Beispiele selber ausprobieren möchtest kannst du das Beispielrepo
auf [GitHub](https://github.com/czarnecki/git_blog_post_example) finden. Auf dem
"after" Branch siehst du wie es nachher aussehen sollte.  Mit `git log` und `git
status` kannst du den Status des Branch nach jeder Operation prüfen.

# Historie verändern
Alle Operationen, die hier vorgestellt werden, verändern die Historie. Daher
sind sie mit Vorsicht zu verwenden, wenn du Commits bearbeitest die bereits
veröffentlicht wurden, insbesondere wenn die Arbeit anderer Entwickler darauf basiert.
Am sichersten ist es die Historie zu verändern, wenn sie bisher nur bei
dir lokal vorhanden ist. Außerdem kann es Sinn ergeben, die Historie zu
verändern, wenn die Arbeit an einem Branch abgeschlossen ist und er für einen
Pull Request aufgeräumt werden soll.

# Eine Commit-Beschreibung bearbeiten
Wenn es sich um den letzten Commit handelt kannst du einfach `git commit --amend -o`
verwenden. Das `--amend` erlaubt es uns, den neuesten Commit zu bearbeiten
und Änderungen zu diesem Änderungen hinzufügen.  Mit `-o` (ausgeschrieben `--only`)
sorgen wir dafür, dass nur die Code-Änderungen genutzt werden,
die in dem Kommando angegeben werden. Das `-o` kann auch weggelassen
werden wenn zuvor keine Änderungen mittels `git add` vorgemerkt wurden. Wenn das
Kommando so genutzt wird öffnet Git einen Editor mit der Commit-Beschreibung des
letzten Commits. Dieser kann frei bearbeitet werden, sodass beim Schließen des
Editors ein Commit mit der neuen Beschreibung und den ursprünglichen Änderungen
erzeugt wird.

## Vorgehen bei älteren Commits
Wenn du die Commit-Beschreibung eines älteren Commits bearbeiten möchtest dann
ist ein interaktiver Rebase notwendig.

Der interaktive Rebase erlaubt es dir beim Aufspielen vergangener Commits auf
eine neue Basis unterschiedliche Operationen auszuführen. Diese erlauben einem
unter anderem, einen Commit zu bearbeiten, zu entfernen, mit einem anderen zu
vereinen und die Commit-Beschreibung zu ändern.

Um einen interaktiven Rebase durchzuführen, benötigen wir einen Commit, auf dem
die Änderungen aufsetzen sollen. Damit du nicht immer nach den Commit-Hashes
suchen musst, kannst du beispielsweise Kurzformen wie `HEAD~1` verwenden.
Führst du nun `git rebase -i HEAD~1` aus, wird nur der neuste Commit angepasst
und auf seinen Eltern-Commit neu aufgesetzt. Bevor die Commits neu aufgespielt
werden, wird eine TODO-Liste geöffnet. In dieser sind die Commits vom ältesten
zum neuesten aufgelistet und du kannst die Operationen, die ausgeführt werden
sollen, bestimmen.

Um die Commit-Beschreibung zu ändern musst du nun vor dem passenden Commit
`pick` durch `reword` ersetzen.  Wenn du den Editor nun schließt geht Git
sequenziell von oben nach unten die Commits durch und spielt diese auf die neue
Basis auf. Sobald es auf einen deiner Commits mit `reword` trifft, stoppt der
Rebase dort und es wird ein Editor mit der Commit-Beschreibung des Commit bei
dem gestoppt wurde geöffnet. Diese kannst du wie jede andere Commit-Beschreibung
bearbeiten. Wenn du fertig bist, kannst du wie üblich Speichern und Schließen und der
Rebase wird fortgeführt.

## Beispiel

``` git
# Letzter Commit
git commit --amend -o -m "Garnish plate with lemon_juice and parsley"

# Beliebigen Commit bearbeiten
git rebase -i HEAD~9
# Vor "add water" pick zu reword ändern (erste Zeile)
# Beschreibung im Editor zu "Add 1l_water" bearbeiten
```

# Änderungen zu einem Commit hinzufügen/entfernen
## Hinzufügen von Änderungen
Wenn du zum letzten Commit weitere Änderungen hinzufügen möchtest, musst du
diese zunächst durchführen und per `git add` zur Staging-Area hinzufügen. Wenn
du dies getan hast, kannst du die Änderungen mittels `git commit --amend` zum
letzten Commit hinzufügen. Dies öffnet einen Editor mit der Commit-Beschreibung
des vorherigen Commit welche du frei bearbeiten kannst. Nachdem du den Editor
verlassen hast wird ein neuer Commit erstellt welcher aus dem alten Commit und
den neuen Änderungen besteht.

## Entfernen von Änderungen
Wenn du die Änderungen nicht behalten willst kannst du sie wie gerade beschrieben entfernen
und sie über `git commit --amend` "hinzufügen".

Wenn du sie behalten möchtest dann kannst du dies erreichen im dem du die
Änderungen die du nicht im Commit haben möchtest mit `git reset HEAD^ <Datei>`
zurücksetzt. Damit wird der Stand von `<Datei>` vor dem jetzigen Commit
(`HEAD^`) in die Staging-Area geholt und die Änderungen, die du im letzten
Commit gemacht hast, befinden sich im Arbeitsverzeichnis. Jetzt kannst du wieder
über `git commit --amend` einen Commit erstellen, der deine Änderungen nicht
mehr enthält.  Wenn du mit der oberen Methode alle Änderungen entfernen willst
wird Git dich warnen, dass du damit einen leeren Commit erzeugen würdest und
stattdessen `git reset HEAD^` verwenden sollst. Dies setzt `HEAD` wieder auf den
Eltern-Commit des momentan `HEAD`.

## Vorgehen bei älteren Commits
Für einen älteren Commit darfst du wieder einen interaktiven Rebase
starten. Dieses Mal jedoch ersetzt du `pick` durch `edit`. Wenn Git während des
Aufspielens auf einen deiner Commits mit `edit` stößt, landest du in einem
normal nutzbaren Terminal. `HEAD` zeigt nun auf den Commit, den du bearbeiten
möchtest. Das heißt du kannst alle zuvor beschriebenen Operationen durchführen,
da sich das System jetzt so verhält, als wäre der zu bearbeitende Commit der
neueste. Wenn du mit deinen Änderungen zufrieden bist kannst du `git rebase --continue`
ausführen und der Rebase wird fortgeführt. Wenn du Änderungen aus
einem älteren Commit entfernst und die Änderung beibehältst, kann der Rebase
zunächst nicht fortgeführt werden, da du noch Änderungen in deinem
Arbeitsverzeichnis hast. Um das Problem zu umgehen kannst du mit `git stash` die
Änderungen sicher zur Seite legen.

## Beispiele

``` git
# Zum letzten Commit hinzufügen

echo "sliced" > plate/chilli_pepper
git add plate/chilli_pepper
git commit --amend -m "Garnish plate with lemon juice, parsley and chilli pepper"

# Änderungen zum letzten Commit entfernen, ohne beibehalten

# Änderungen entfernen und zur Staging-Area hinzufügen
rm plate/parsley
git add plate/parsley
git commit --amend -m "Garnish plate with lemon juice and chilli pepper"

# Älteren Commit bearbeiten
# In älterem Commit ändern
git rebase -i HEAD~6
# Vor "Add garlic to pan" pick zu edit ändern
echo "sliced" > pan/garlic
git add pan/garlic
git commit --amend
git rebase --continue

# Aus älterem Commit entfernen und beibehalten
git rebase -i HEAD~7
# Vor "Add 3g_olive_oil to medium-low heat pan" pick zu edit ändern (erste Zeile)
git reset HEAD^ pan/5g_butter
git commit --amend
git rebase --continue
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
Wenn du bereits im Voraus weißt, dass du einen Commit mit einem anderen vereinen
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
git rebase -i HEAD~5
# Vor "Add pinch_pepper to pan" pick zu squash ändern
# Erste Beschreibung zu "Add pinch_salt and pinch_pepper to pan" ändern
# Zweite Beschreibung entfernen

# Automatisch squash/fixup
git add pan/5g_butter
git commit --squash=HEAD~5

git rebase -i --autosquash HEAD~7
# Editor schließen
# Erste Beschreibung zu "Add 3g_olive_oil and 5g_butter to medium-low head pan"
# Zweite Beschreibung entfernen
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

git add plate/chilli_pepper
git commit -m "Garnish plate with chilli_pepper"

git add plate/lemon_juice
git commit -m "Garnish plate with lemon_juice"

# Alten Commit aufteilen
git rebase -i HEAD~8
# Vor "Add 10g_salt and 250g_spaghetti" pick zu edit ändern

git reset HEAD^

git add pot/10g_salt
git commit -m "Add 10g_salt to pot"

git add pot/250g_spaghetti
git commit -m "Add 250g_spaghetti to pot"

git rebase --continue
```

# Die Historie und du
Die Git-Historie ist ein praktisches Tool zur Dokumentation der Entwicklung
eines Projektes. Je nachdem wie sie gepflegt wird erlaubt sie einem schnell
herauszufinden wann etwas gemacht wurde oder auch wie jemand bei der
Entwicklung vorgegangen ist und was tatsächlich getan wurde. Git bietet
jedenfalls einige Operationen um es einem möglich zu machen, eine aufgeräumte
Historie zu haben.
