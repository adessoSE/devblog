---
layout: [post, post-xml]              # Pflichtfeld. Nicht ändern!
title:  "Griff in die Werkzeugkiste: Eine Toolchain für React"         # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2019-08-29 12:30              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2019-08-29 12:30             # Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author: janschneider1                     # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: [Softwareentwicklung]                    # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [React, Toolchain, Node]         # Bitte auf Großschreibung achten.
---

React ist eine der beliebtesten Frontend-Technologien - In diesem Blog-Post erfährst du, was React ist und wie du direkt mit der React-Entwicklung anfangen kannst.
Dabei bauen wir eine kleine Toolchain für React mit verschiedenen NPM Modulen und befassen uns mit der Übersetzung, Zusammenfassung, und Verkleinerung von JavaScript-Dateien.

# Was ist React überhaupt?

React ist eine JS-Bibliothek, welche es dir ermöglich interaktive Userinterfaces für Webanwendungen zu schreiben.
Dabei lassen sich unteranderem eigene Komponenten leicht, mit Hilfe von JSX (JavaScriptXML), in einer "HTML-artigen" Syntax beschreiben.
Wenn du direkt mehr über weitere Konzepte und Funktionen von React lernen möchtest, empfehle ich dir die [React Dokumentation](https://reactjs.org/docs/hello-world.html) anzuschauen.

```jsx
class HelloWorld extends React.Component{
    render(){
        return (
            // JSX
            <div>
              <p>Hello World!</p>
            </div>
        );
    }
}

// 'HelloWorld'-Komponente wird an das HTML-Element mit ID 'app' gebunden
reactDOM.render(<HelloWorld/>, document.getElementByID('app'));
```

# Ich will React direkt ausprobieren!

Wenn du React einfach mal ausprobieren willst, kannst du React und JSX einfach über CDN's ("Content-Delivery-Network") einbinden.
Dabei bindest du einmal die React Bibliothek, als auch den ReactDOM ein. Babel ist dabei ein JavaScript-Transpiler, der uns ermöglicht JSX zu benutzen.
Ein Transpiler übersetzt dabei eine Sprache bzw. eine bestimmte Syntax in unserem Fall JSX in eine andere Programmiersprache hier JavaScript.

```html
<!-- React und ReactDOM -->
<script src="https://unpkg.com/react@16/umd/react.development.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js" crossorigin></script>

<!-- Babel ermöglicht es JSX zu benutzen -->
<script src="https://unpkg.com/babel-standalone@6/babel.min.js"/>
```

Auch kann du dir eine vollständige Anwendung auf Basis von React und Node.js direkt mit einem Commandozeilenbefehl erstellen lassen, schaue dir dafür das Project [create-react-app](https://github.com/facebook/create-react-app) an.

# Was ist eine Toolchain und wieso könnten wir eine brauchen?

Durch eine Toolchain (engl. "Werkzeugkette") ist es möglich mehrere Tools und Technologien miteinander zu verknüpfen.
Eine Toolchain **strukturiert und vereinfacht Entwicklungs- und Buildprozesse** und bietet **Flexibilität**, da sich verschiedene Prozesse und Technologien einfach "anketten" lassen.

Im Vergleich zu den oben gennante Implementierungsmethoden für React würde uns eine Toolchain folgendes ermöglichen:
- **Freie Wahl an Tools und Technologien**, sowie die Anknüpfung weiterer z.B. JavaScript-Minifizierer
- **Verkürzte Ladezeiten**, da der Client weniger Scripte anfordern muss (Verzicht auf CDN's)
- **Performancegewinn**, da Babel nicht mehr clientseitig, sondern einmalig pro Buildprozess auf dem Server durchgeführt wird

# Komm wir bauen eine Toolchain für React!

Im Folgenden wollen wir dabei eine Toolchain unter Verwendung von Node.js implementieren, welche folgende Aufgaben erledigt:

- **JavaScript Transpilierung** (JSX zu JavaScript)
- **JavaScript Bundeling** (Zusammenführen mehrerer JavaScript-Dateien)
- **JavaScript Minifizierung** (im Rahmen eines Buildprozesses)

Dabei wollen wir die Toolchain mit einem Befehl anstoßen können und mit einem weiteren einen produktionsfähigen Build erstellen.

Nachdem wir [Node.js](https://nodejs.org/en/) installiert haben und ein Projekt mit `npm init` initiert haben, kann es auch schon losgehen.
NPM ist der "Node-Package-Manager", welcher unsere Pakete verwaltet und in unserem Projektordner aufgerufen werden muss).

## Translation mit Babel

Babel ist ein JavaScript-Transpiler, welcher verschiedene JavaScript-erweiterende Syntax in abwärdskompatibeles JavaScript übersetzen kann.
So benötigen wird dies auch für JSX und den von React empfohlenen ES6 Syntax, auch bekannt als "EcmaScript 2015", welcher "Klassen-Funktionen" und "Arrow Functions" einführte.

JSX wird dabei nicht nativ von Browsern verstanden, [auch ES6 wird nicht von älteren Browserversionen unterstützt, bei unserem alten Sorgenkind Internet Explorer fehlt Support gänzlich](https://www.w3schools.com/js/js_es6.asp).

OK, nun zum Eingemachtem, zunächst müssen wir das Babel-Modul mit den Presets für React über NPM installieren:

```bash
npm install babel-cli@6 babel-preset-react-app@3
```

Nun können wir mit Hilfe der `--watch` Option einen Watcher erzeugen, welcher über einen Teil unseres Projektes "schaut" und bei erkannten Änderungen die Dateien transpiliert und im angegebenen Ordner abspeichert.
 **\<ZuBewachenerOrdner>** und **\<SpeicherOrt>** sind dabei relative Pfade, welche z.B. auf das `./src` und `./build` Verzeichnis verweisen können.

```bash
npx babel --watch <ZuBewachenerOrdner> --out-dir <SpeicherOrt> --presets react-app/prod
```

## Bundeling mit Browserify

Wäre es nicht toll, wenn wir jede React-Komponente in eine einzelne JavaScript-Datei schreiben könnten und verhindern würden einen tausendzeiligen Spaghettiecode zu erzeugen?

Browserify schafft hierbei Abhilfe und ist ein JavaScript-Bundler, welcher es ermöglicht mehrere JavaScript-Dateien mithilfe des ["require-Syntax"](http://browserify.org/) zu einer Datei zusammenzuführen.

Dafür installieren wir zunächst das Paket **Watchify**, eine Implementation von Browserify, welche einen Watcher erstellen kann, so wie wir es schon für Babel getan haben.

```bash
npm install watchify
```

Nun können wir auch hier einen Watcher erstellen, dabei sollten wir uns bei den  **\<ZuBewacheneDateien>** auf die Dateien beziehen, welche uns Babel generiert hat.

```bash
watchify <ZuBewacheneDateien> -v --dg -o <SpeicherOrt>
```

## Minifikation mit Terser

Wenn du dir nun die aus den beiden vorangegangenen Schritten erstellte JS-Datei anschaust, wird dir auffallen, dass sie zumindest prozentual in ihrer Dateigröße stark gewachsen ist.
Wir wollen daher diese Datei verkleinern, indem wir unnötige Zeilenumbrüche und Leerzeichen entfernen, sowie Variablennamen verkürzen.
Dein Code wird daher für Menschen schwer leserlich, ist für Computer allerdings weiterhin komplett verständlich und zudem nun kürzer.
Dies sollten wir vorallem bei der Auslieferung bei der Produktion behandeln, da große Dateien lange Ladezeiten hervorrufen, aber auch das Datenvolumen mobiler Nutzer belasten können.

Also installieren wir das **Terser** Paket über NPM:

```bash
npm install terser
```

Mit welchem wir unsere von Browserify zusammengefasste  **\<Zieldatei>** an einen  **\<SpeicherOrt>** ablegen können, der Speicherort kann dabei z.B. das Unterverzeichnis `./build/minified` des Projekts sein.

```bash
terser <Zieldatei> --output <Speicherort>
```

# Verkettung der einzelnen Tools (Automatisierung)

Nun automatisieren wir die obrigen drei Schritte mithilfe des Taskrunners von NPM (auch kann man Taskrunner wie Gulp oder Grunt benutzen).
Dafür benötigen wir allerdings noch das Paket **Concurrently**, welches ermöglicht mehrerer "NPM-Scripts" parallel auszuführen.

```bash
npm install concurrently
```

Um unsere geplannten Kommandos `npm run watch` und `npm run deploy` zu schreiben, editieren wir die Datei `package.json` unseres Projekts.
Ergänze dabei  **\<Transpile>**,  **\<Bundle>** und **\<Minify>** mit den Kommandos, welche wir in den einzelnen Kapiteln geschrieben haben.

```json
package.json
...

"scripts": {
  	"watch": "concurrently \"<Transpile>\" \"<Bundle>\"",
        "deploy": "<Minify>",
},

...
```

Für eine konkrete Implementierung kannst du dir mein [Showcase-Projekt](https://github.com/JanSchneider1/PipePuzzle_React) ansehen, dort findest du zudem eine [erweiterende Implementierung der Toolchain mit Gulp](https://github.com/JanSchneider1/PipePuzzle_React/blob/integrate-gulp/gulpfile.js).

# Fazit

In diesem Blog-Post haben wir eine kleine Toolchain für die React-Entwicklung erstellt.
Die Implementierung ist dabei aber nur eine von vielen und eine "gute" Toolchain ist vorallem vom eigenen Workflow abhängig.
Von daher solltest du nun motiviert sein deine eigene Toolchain zu implementieren oder z.B einzelne Elemente auszutauschen. Zum Beispiel könntest du **Webpack**
statt Browserify als Bundler oder einen anderen Minifizierer nutzten.
Auch könntest du unseren relativ minimalistischen Buildprozess, um einen CSS-Minifier wie **CSSClean** zu erweitern, oder vor dem Buildprozess noch einmal deine Tests durchlaufen lassen.
Egal für welche Tools du dich entscheidest, deine Toolchain ist nur **einen Griff in die Werkzeugkiste** entfernt!
