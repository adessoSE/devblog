---
layout: [post, post-xml]              
title:  "Die bösen regulären Ausdrücke"        
date:   2023-02-21 09:00              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2023-02-21 09:00
author_ids: [komenda]                     
categories: [Softwareentwicklung]       
tags: [Security Development, Regex]     
---

In diesem Blogpost gehen wir auf reguläre Ausdrücke (Regex) und deren Schattenseiten ein. Dabei sehen wir uns speziell an, wie ein Regex einen Denial-of-Service-Angriff auslösen kann.

# Was ist ein "Regular expression Denial-of-Service (ReDoS)" Angriff?

Ein ReDoS-Angriff ist einer von vielen verschiedenen Denial-of-Service-Angriffen. Das Hauptziel dieser Angriffe ist, dass ein Dienst nicht mehr für den Endnutzer verfügbar ist.

Bei einem Denial-of-Service-Angriff versucht ein Angreifer mit verschiedenen Techniken ein bestimmtes System oder Teile der Infrastruktur lahmzulegen. Es könnte zum Beispiel eine große Masse an Requests an einen Server geschickt werden. Dieser müsste alle gleichzeitig verarbeiten und beantworten, das würde in einer unverhältnismäßig langen Antwortzeit resultieren. Es könnte auch durchaus passieren, dass durch die Verwendung vieler Ressourcen ein Systemausfall entsteht.

ReDoS-Attacken folgen demselben Schema. Der Angreifer nutzt dabei die Funktionsweise verschiedener Regex-Engines aus. Es wird eine Eingabe konstruiert, die in der Engine einen deutlich höheren Prüfaufwand erzeugt, als es in der Regel der Fall wäre. Dadurch kann ein Systemabsturz oder -ausfall provoziert werden.

# Wie funktionieren reguläre Ausdrücke?

Bevor wir weitermachen, sollten wir uns anschauen, wie die Übereinstimmung von regulären Ausdrücken unter der Haube funktionieren - das wird uns dann helfen zu verstehen, warum gewisse reguläre Ausdrücke besonders anfällig für Angriffe sind.

Der Abgleich von Mustern regulärer Ausdrücke kann durch den Aufbau eines endlichen Zustandsautomaten (engl.: finite state machine, kurz: FSM) erfolgen. Man kann sich dies als eine abstrakte Maschine vorstellen. Es werden eine Reihe von Überprüfungen anhand der Operatoren durchgeführt und dementsprechend eine Aussage erzeugt.

Eine FSM kann sich zu jedem Zeitpunkt in genau einem Zustand befinden. Die Menge an Zuständen ist dabei endlich. Ein Übergang findet statt, wenn ein endlicher Automat von einem Zustand in einen anderen wechselt. Ein Beispiel für einen endlichen Zustandsautomaten ist ein Kaffeeautomat, der je nach Wahl des Benutzers eine bestimmte Kaffeesorte ausschenkt.

Wie bereits erwähnt, kann der Abgleich regulärer Ausdrücke durch den Aufbau einer FSM erfolgen. Reguläre Ausdrücke können auch leicht von einem endlichen Automaten in einen nicht-deterministischen Automaten umgewandelt werden, insbesondere bei Ausdrücken, bei denen es mehrere mögliche nächste Zustände für jede empfangene Eingabe gibt.

In solchen Fällen kann die Engine für reguläre Ausdrücke nach der Konvertierung mehrere Algorithmen verwenden, um die nächsten Zustände zu bestimmen. Aber konzentrieren wir uns auf die problematischsten Algorithmen:

* Die Engine probiert alle möglichen Wege aus, bis eine Übereinstimmung gefunden wird oder alle Wege ausprobiert wurden und fehlgeschlagen sind (dies wird als Backtracking bezeichnet). Dies ist problematisch, da für eine Eingabe der Länge n eine exponentielle Anzahl von Pfaden durchlaufen wird, sodass man im schlimmsten Fall eine Laufzeit von O(n)=2^n erhält.
* Die Engine versucht erneut von der nicht-deterministischen Automatisierung in die deterministische Automatisierung umzuwandeln. Dies ist problematisch, da die Umwandlung je nach Ausführungspfad exponentiell lange dauern kann

Ein Regex Denial-of-Service tritt also auf, wenn einer dieser beiden Algorithmen auf einen bestimmten regulären Ausdruck angewendet wird. Ein böswilliger Benutzer kann dies ausnutzen und eine dieser beiden Bedingungen auslösen, was zu der schlimmsten Laufzeitkomplexität der Engine für regüläre Ausdrücke führt.

# Welche Arten von regulären Ausdrücken sind anfällig für DoS-Angriffe?

Schauen wir uns ein Beispiel für einen regulären Ausdruck an, der anfällig für einen DoS-Angriff ist. Für die Laufzeitanalyse eines Befehles verwenden wir das CLI-Tool namens [gnomon](https://github.com/paypal/gnomon).

Starte die Konsole deiner Wahl und installiere es:

~~~~shell
npm install -g gnomon
~~~~

Nehmen wir an, wir haben ein Muster, `/^(\w+\s?)*$/`, das eine Gruppe von Wörtern mit einem optionalen Leerzeichen nach jedem Wort enthält. Die Quantoren `^` und `$` schauen auf die Wörter am Anfang und am Ende der Zeile.

Nun versuchen wir es mit einer Gruppe von Wörtern ohne Sonderzeichen:

~~~~shell
node -p "/^(\w+\s?)*$/.test('Nur valide Character')" | gnomon
~~~~

Wir sehen, dass die Wörter passen und es 0,0058 Sekunden gedauert hat, diesen regulären Ausdruck auf dem Terminal auszuführen.

Versuchen wir nun, einen Satz mit einem Sonderzeichen am Ende des letzten Wortes zu bilden:

~~~~shell
node -p "/^(\w+\s?)*$/.test('Invalide Character!')" | gnomon
~~~~

Wie erwartet, wurde false zurückgegeben und die Ausführung des regulären Ausdrucks dauerte etwa 0,0061 Sekunden.

Perfekt, alles funktioniert einwandfrei. Das Problem ist jedoch, dass es sehr lange dauern kann, bis die Regex-Engine den regulären Ausdruck für einen viel längeren Satz mit Sonderzeichen ausführt.

Sehen wir uns das mal in Aktion an. Führ das Folgende im Terminal aus:

~~~~shell
node -p "/^(\w+\s?)*$/.test('Ein langer Satz mit invaliden Zeichen, dessen Abgleich so viel Zeit in Anspruch nimmt, dass die CPU-Auslastung moeglicherweise drastisch ansteigt!!!')" | gnomon
~~~~

Du solltest kein Ergebnis von diesem Befehl erwarten… 
Wenn wir unseren Task-Manager öffnen, können wir sehen, dass der betreffende Prozess einen enorm hohen CPU-Anteil für die Ausführung dieses regulären Ausdrucks verwendet. Im Grunde sollten wir einen starken Anstieg der gesamten aktuellen CPU-Auslastung feststellen.

Wie du also siehst, kann ein Angreifer ein scheinbar einfaches Regex-Muster ausnutzen, um unser System dazu zu bringen, mehr Ressourcen als erwartet zu verbrauchen. Längere Eingaben können also dazu führen, dass unser System hängt oder abstürzt.

Schauen wir uns einmal genauer an, warum das so ist:

* Die Hauptursache für dieses Problem ist eine in Regex-Engines verfügbare Funktion namens Backtracking. Die Engine geht zunächst die Eingabe durch und versucht, den in Klammern enthaltenen Inhalt `\w+\s?` zu überprüfen
* Da der Quantor `+` gierig ist, versucht er, so viele gültige Wörter wie möglich zu finden, und gibt daher zurück:
`Ein langer Satz mit invaliden Zeichen, dessen Abgleich so viel Zeit in Anspruch nimmt, dass die CPU-Auslastung moeglicherweise drastisch ansteigt`
* Der Stern-Quantor `(\w+\s?)*` kann dann angewendet werden, aber es gibt keine gültigen Wörter mehr in der Eingabe, so dass er nichts zurückgibt
* Aufgrund des `$`-Quantors in unserem Muster versucht die Regex-Engine, das Ende der Eingabe zu finden. Dort haben wir ein ungültiges Wort, `ansteigt!!!`, also gibt es keine Übereinstimmung
* Die Maschine geht einen Schritt zurück zur vorherigen Position und versucht, einen anderen Weg einzuschlagen, in der Hoffnung, eine Übereinstimmung zu finden. Der Quantor `+` verringert also die Anzahl der Wiederholungen, geht um ein Wort zurück und versucht, den Rest der Eingabe abzugleichen - in diesem Fall `Ein langer Satz mit invaliden Zeichen, dessen Abgleich so viel Zeit in Anspruch nimmt, dass die CPU-Auslastung moeglicherweise drastisch`
* Die Suchmaschine setzt dann ihre Suche ab der folgenden Position fort: der Stern-Quantor kann erneut angewendet werden und entspricht dem Wort `drastisch`. Erinnerst du dich? Wir haben den `$`-Quantor; die Maschine benutzt ihn, aber er scheitert wieder an `ansteigt!!!`

Die Regex-Engine geht wieder zurück und verringert die Anzahl der Wiederholungen, bis alle möglichen Pfade erforscht sind. Wir erwarten, dass die Suche nach regulären Ausdrücken eine Laufzeit von O(n) benötigt, wobei n die Länge der Eingabezeichenfolge angibt.

In den meisten Fällen mag dies zutreffen. Doch in einigen Fällen - wie in dem gerade betrachteten Fall - muss die Regex-Engine möglicherweise eine exponentielle Anzahl von Pfaden durch die Eingabezeichenfolge nehmen, um eine Übereinstimmung zu finden.

Im Falle einer Eingabe mit einer Größe von etwa 125 Zeichen ergibt sich also eine Situation, in der die Maschine eine exponentielle Anzahl von Pfaden nimmt. Etwa 2^125 verschiedene Pfade, was etwa 4,2535296e+37 verschiedene Kombinationen ergibt, weil ein ungültiges Wort an einer bestimmten Stelle vorkam. Dies führt in der Regel zu einem so genannten katastrophalen Backtracking. Die Ausführung solcher regulären Ausdrücke erfordert eine enorme Menge an Zeit und Ressourcen.

Abschließend werden wir uns verschiedene Möglichkeiten ansehen, wie wir unsere Muster gegen solche Probleme schützen können.

# So kannst du dich gegen einen Angriff schützen

## Reduziere die Anzahl der Kombinationen

Ein Ansatz besteht darin, die Anzahl der von den Regex-Engines durchgeführten Kombinationen zu verringern. Es gibt mehrere Möglichkeit, dies zu tun:

* Vermeide verschachtelte Quantoren - z. B. `(a+)*`
* Vermeide ORs mit sich überschneidenden Klauseln - z. B. `(b|b)*`

Je nach Engine können einige reguläre Ausdrücke, die mit verschachtelten Quantoren und überlappenden Klauseln geschrieben wurden, schnell ausgeführt werden, aber es gibt keine Garantie. Es ist sicherer, vorsichtig zu sein.

## Kontrolliere das Backtracking

Ein anderer Ansatz besteht darin, das Backtracking zu kontrollieren. Auch wenn Backtracking die Konstruktion komplexer und leistungsfähiger regulärer Ausdrücke ermöglicht, kann der letztendliche Nutzen irrelevant sein, insbesondere im Vergleich zu der schlechten Leistung in Fällen wie den zuvor untersuchten.

Glücklicherweise können wir bestimmte Funktionen nutzen, um Backtracking entweder einzuschränken oder zu unterdrücken und trotzdem leistungsfähige reguläre Ausdrücke zu erstellen. Schauen wir uns zwei davon an: atomare Gruppen und Lookahead.

### Atomare Gruppen

Eine atomare Gruppe verwendet die `?>`-Syntax, um das Backtracking in den Ausdruck zu unterdrücken. Sobald eine Übereinstimmung gefunden wurde, lässt sie nicht zu, dass andere Teile zurückverfolgt werden, selbst wenn dies bedeutet, dass die Möglichkeit einer erfolgreichen Übereinstimmung besteht.

Diese Methode zur Unterdrückung der Rückverfolgung trägt zur Verbesserung der Leistung bei der Verwendung verschachtelter Quantoren bei. Leider wird diese Funktion nicht von allen Regex-Engines implementiert und ist vor allem in JavaScript/Node.js nicht verfügbar.

Schauen wir uns eine andere Funktion an, mit der wir etwas Ähnliches tun können und die in JavaScript/Node.js verfügbar ist.

### Lookahead

Anhand des Beispiels, das wir zuvor gesehen haben, möchten wir, dass unser Quantor nicht zurückverfolgt wird, da ein Backtracking in den meisten Fällen zu schwerwiegenden Problemen führen kann, wie wir zuvor gesehen haben. Um dies zu erzwingen, können wir eine Funktion namens Lookahead nutzen.

Bei der Verwendung von Lookahead-Assertions verwenden wir die Syntax `?=` - z. B. heißt es bei einem Muster `A(?=B)` einfach: "Suche nach A, aber gehe nur weiter, wenn es von B gefolgt wird." Das ist wichtig, weil wir so feststellen können, ob der Ausdruck mit den nächsten Zeichen übereinstimmen kann, ohne dass wir zurückgehen oder weitergehen müssen.

In diesem Fall möchten wir so viele Wörter wie möglich abgleichen, ohne zurückzugehen. Wir können das Muster so umschreiben, dass es Wörter von `\w+` bis `(?=(\w+))\1` enthält. Das mag auf den ersten Blick etwas unintuitiv erscheinen, aber lasst uns das aufschlüsseln.

In unserem umgeschriebenen Muster `(?=(\w+))\1` weisen wir die Suchmaschine an, nach dem längsten Wort an der aktuellen Position zu suchen. Das Muster in den inneren Klammern, `(\w+)`, weist die Maschine an, sich den Inhalt zu merken, und wir können `\1` verwenden, um später darauf zu verweisen.

Damit ist unser Problem gelöst, denn wir können die Lookahead-Funktion verwenden, um das Wort `w+` als Ganzes zu finden und es mit dem Muster `\1` zu referenzieren. Im Wesentlichen können wir einen possessiven `+`-Quantor implementieren, der auf das ganze Wort und nicht auf einige Teile passen muss.

In unserem ersten Beispiel erfasst das angegebene Muster die Wörter, aber wenn es auf ein ungültiges Wort stößt, zwingt es der `+`-Quantor dazu, zurückzugehen, bis es erfolgreich ist oder nicht. In unserem umgeschriebenen Beispiel haben wir Lookahead verwendet, um ein gültiges Wort zu finden, das als Ganzes abgeglichen und mit `\1` in das Muster aufgenommen wird.

Lass uns dieses neue Muster zusammen mit unseren vorherigen Quantoren laufen und wir schauen, ob wir das gleiche Problem haben:

~~~~shell
node -p "/^((?=(\w+))\1\s?)*$/.test('Ein langer Satz mit invaliden Zeichen, der aber nicht zu einem drastischen Anstieg der CPU-Auslastung fuehrt!!!')" | gnomon
~~~~

Voila! Wir sehen, dass der reguläre Ausdruck ausgeführt wird und wir sofort eine Ausgabe erhalten; es dauerte etwa 0,0052 Sekunden, um ein Ergebnis zu erhalten.

# Zusammenfassung

In diesem Blogeintrag haben wir gelernt, wie wir verhindern, dass reguläre Ausdrücke für Denial-of-Service-Angriffe verwendet werden können. Wir haben uns eingehend mit der Funktionsweise des Abgleichs regulärer Ausdrücke befasst, um zu verstehen, warum und wie dieses Problem überhaupt auftritt. Anschließend haben wir uns ein Beispiel für ein reguläres Ausdrucksmuster mit einer solchen Schwachstelle angesehen und gezeigt, wie man Schlupflöcher blockieren kann, die Angreifer ausnutzen können.
