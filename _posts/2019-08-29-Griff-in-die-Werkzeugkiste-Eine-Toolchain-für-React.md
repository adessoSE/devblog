---
layout: [post, post-xml]              # Pflichtfeld. Nicht ändern!
title:  "Griff in die Werkzeugkiste: Eine Toolchain für React"         # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2020-01-30 10:30              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2020-01-30 10:30             # Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author: janschneider1                     # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: [Softwareentwicklung]                    # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Toolchain, React, JavaScript, Node]         # Bitte auf Großschreibung achten.
---

Eine Toolchain bringt Flexibilität und macht uns das Leben als Entwickler einfacher - In diesem Blog-Post bauen wir zusammen eine Toolchain für die beliebte Frontend-Technologie React. 
Dabei schauen wir uns an was eine Toolchain ist und wie wir sie nutzen können, um unseren Workflow mit React zu optimieren.

# Was ist React?

React ist eine JavaScript-Bibliothek, die es uns ermöglich interaktive Userinterfaces für Webanwendungen zu entwickeln.
Wir können mit React eigene UI-Komponenten mit JSX (JavaScriptXML), in einer HTML-artigen Syntax, schreiben.

Um React zu nutzen, können wir die benötigten Script-Dateien über CDN's ("Content-Delivery-Network"), welche die Dateien zur Verfügung stellen, einbinden.
Wir müssen dazu die React Bibliothek, als auch den virtuellen ReactDOM einbinden. Ebenso müssen wir Babel, einen JavaScript-Transpiler, einbinden.
Ein Transpiler übersetzt eine Sprache in eine andere Programmiersprache, dadurch können wir JSX nutzen.

```html
<!-- React und ReactDOM -->
<script src="https://unpkg.com/react@16/umd/react.development.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js" crossorigin></script>

<!-- Babel ermöglicht es JSX zu benutzen -->
<script src="https://unpkg.com/babel-standalone@6/babel.min.js"/>
```

Mehr über die Funktionen und Konzepte von React kannst du in dir in der [React Dokumentation](https://reactjs.org/docs/hello-world.html) ansehen
oder dir mit dem Projekt [create-react-app](https://github.com/facebook/create-react-app) direkt eine vollständige Anwendung generieren lassen.

# Was ist eine Toolchain und wieso könnten wir eine brauchen?

Durch eine Toolchain (engl. "Werkzeugkette") ist es möglich mehrere Tools und Technologien miteinander zu verknüpfen.
Eine Toolchain **strukturiert und vereinfacht Entwicklungs- und Buildprozesse**. Sie bietet **Flexibilität** da sich die verschiedenen Prozesse und Technologien beliebig verketten lassen.

React sowie wie oben über CDN's zu nutzen ist einfach, aber die Implementierung einer Toolchain verschafft uns folgende Vorteile:
- **Freie Wahl an Tools und Technologien**, sowie die Anknüpfung weiterer z.B. JavaScript-Minifizierer
- **Verkürzte Ladezeiten**, da der Client weniger Scripte anfordern muss (Verzicht auf CDN's)
- **Performancegewinn**, da Babel nicht mehr clientseitig, sondern einmalig pro Buildprozess auf dem Server durchgeführt werden kann

# Komm wir bauen eine Toolchain für React!

Im Folgenden bauen wir eine Toolchain, 
die du in meinem [Showcase-Projekt](https://github.com/JanSchneider1/PipePuzzle_React) in Action sehen kannst. Dabei soll die zu entwickelne Toolchain folgende Aufgaben erledigen:

- **JSX Transpilierung** (JSX zu nativen JavaScript)
- **JavaScript Bundeling** (Zusammenführung mehrerer JavaScript-Dateien)
- **JavaScript Minifizierung** (Reduzierung der Dateigröße im Rahmen eines Buildprozesses)

Dabei wollen wir die Toolchain über die Kommandozeile bedienen und mit einem Befehl einen produktionsfähigen Build erstellen können.

Nachdem wir [Node.js](https://nodejs.org/en/) installiert haben und ein Projekt in einem Ordner mit dem Befehl `npm init` initiert haben, kann es auch schon losgehen.
NPM ist der "Node-Package-Manager", welcher unsere Abhängigkeiten zu anderen Technologien verwaltet, über dem wir im Folgendem unsere Pakete installieren werden.

## Translation mit Babel

Babel ist ein JavaScript-Transpiler, welcher verschiedene JavaScript-erweiterende Syntax in abwärdskompatibeles JavaScript übersetzen kann.
Da wir JSX nutzen wollen müssen wir die Dateien in natives JavaScript übersetzen, da JSX nicht nativ von Browsern verstanden wird. 
Auch empfielt React den ES6 ("EcmaScript 2015") Syntax zu verwenden, welcher JavaScript um praktische Funktionen wie "Klassen-Funktionen" oder "Arrow Functions" erweitert.
Da auch ES6 (noch) [nicht von allen Browser-Versionen nativ unterstützt](https://www.w3schools.com/js/js_es6.asp) wird, wollen wir auch das zu nativen JavaScript übersetzen.

Um Babel nutzen zu können müssen wir das Babel-Modul mit den Presets für React über NPM installieren:

```bash
npm install babel-cli@6 babel-preset-react-app@3
```

Nun können wir mit Hilfe der `--watch` Option einen Watcher erzeugen, welcher über einen Teil unseres Projektes "schaut" und bei erkannten Änderungen die Dateien transpiliert und im angegebenen Ordner abspeichert.
 **\<ZuBewachenderOrdner>** und **\<SpeicherOrt>** sind dabei relative Pfade, welche auf z.B. `./src` und `./build` Verzeichnis verweisen können. Mithilfe der `--presets` Option
 müssen wir nur das installierte Preset angeben und Babel nicht weiter konfigurieren.

```bash
npx babel --watch <ZuBewachenderOrdner> --out-dir <SpeicherOrt> --presets react-app/prod
```

## Bundeling mit Browserify

Wäre es nicht toll, wenn wir jede React-Komponente in eine einzelne JavaScript-Datei schreiben könnten und verhindern würden einen tausendzeiligen Spaghettiecode zu erzeugen?

Browserify schafft hierbei Abhilfe und ist ein JavaScript-Bundler, der es ermöglicht mehrere JavaScript-Dateien mithilfe des ["require-Syntax"](http://browserify.org/) zu einer Datei zusammenzuführen.

Dafür installieren wir zunächst das Paket **Watchify**, eine Erweiterung von Browserify, die einen Watcher erstellen kann, so wie wir es schon für Babel getan haben.

```bash
npm install watchify
```

Nun können wir auch hier einen Watcher erstellen, dabei sollten wir uns bei den  **\<ZuBewachendeDateien>** auf die Dateien beziehen, die uns Babel generiert hat.

```bash
watchify <ZuBewachendeDateien> -v --dg -o <SpeicherOrt>
```

## Minifikation mit Terser

Wenn wir die oben definierten Befehle ausgeführt haben und uns die von Browserify generierte JavaScript-Datei anschauen, fällt uns auf, dass sie in ihrere Dateigröße
zumindest prozentual stark gewachsen ist, was zum einen daraus resultiert, dass wir nun nur eine große Datei haben, allerdings auch an den ganzen Polyfills (abwärdskompatibler Code)
liegt.

Von daher wollen wir diese Datei nun durch einen Minifizierer verkleinern, indem wir unnötige Zeilenumbrüche und Leerzeichen entfernen, sowie Variablennamen verkürzen.
Unser Code wird dadurch für Menschen schwerer leserlich, allerdings bleibt er für den Computer weiterhin verständlich und ist weitaus kürzer.
Dies sollten wir vorallem bei der Auslieferung bei der Produktion behandeln, da große Dateien lange Ladezeiten hervorrufen, aber auch das Datenvolumen mobiler Nutzer belasten können.

Also installieren wir den JavaScript-Minifizierer [**Terser**](https://github.com/terser/terser) über NPM:

```bash
npm install terser
```

Mit Terser können wir unsere von Browserify zusammengefasste  **\<Zieldatei>** an einen  **\<SpeicherOrt>** ablegen, 
der Speicherort kann dabei z.B. das Unterverzeichnis `./build/minified` des Projekts sein.

```bash
terser <Zieldatei> --output <Speicherort>
```

# Verkettung der einzelnen Tools (Automatisierung)

Nun automatisieren wir die obrigen drei Schritte mithilfe des Package-Runner NPX, welcher in der Lage ist die Befehle auszuführen und glücklicherweise schon mit NPM installiert wurde.
Allerdings benötigen wir noch das Paket [**Concurrently**](https://www.npmjs.com/package/concurrently), welches ermöglicht mehrerer "NPM-Scripts" parallel auszuführen, das Paket können wir gewohnt wieder über NPM installieren.

```bash
npm install concurrently
```

Um unsere geplannten Kommandos `npm run watch` und `npm run deploy` zu schreiben, editieren wir die Datei `package.json` unseres Projekts.
Wir müssen jetzt nur noch  **\<Transpile>**,  **\<Bundle>** und **\<Minify>** mit den Kommandos, die wir in den einzelnen Kapiteln geschrieben haben, austauschen.
Nun müssen wir nur noch einmalig den Befehl `npm run watch` und `npm run deploy` ausführen um unser Projekt automatisch aktualisieren zu lassen oder uns einen Build erzeugen zu lassen.

```json
package.json
...

"scripts": {
  "watch": "concurrently \"<Transpile>\" \"<Bundle>\"",
  "deploy": "<Minify>",
},

...
```

Wir haben in unserem Beispiel den Package-Runner NPX benutzt, da er mit NPM "mitgeliefert" wird. Alternativ können
wir auch Task-Runner wie [Gulp](https://gulpjs.com) oder [Grunt](https://gruntjs.com) nutzen, die etwas mehr Konfigurationsaufwand benötigen allerdings auch weit mehr Funktionalität bieten.

# Fazit

In diesem Blog-Post haben wir eine kleine Toolchain entwickelt, die JSX und ES6 zu nativen JavaScript transpiliert,
einzelne JavaScript-Dateien zusammenfügt und diese durch einen zusätzlichen Befehl verkleinert.

Die Implementierung ist dabei aber nur eine von vielen und eine "gute" Toolchain ist immer vom eigenen Workflow abhängig.
Wenn du nun motiviert bist deine eigene Toolchain zu entwickeln kannst du leicht einzelne Elemente austauschen oder Neue hinzufügen.
Zum Beispiel können wir [**Webpack**](https://webpack.js.org) statt Browserify als Bundler nutzen 
oder wir erweitern unseren relativ minimalistischen Buildprozess, um einen CSS-Minifier wie [**clean-css**](https://github.com/jakubpawlowicz/clean-css) und lassen vor unseren Buildprozess noch einmal alle Tests durchlaufen!
Egal für welche Tools du dich entscheidest, deine Toolchain ist nur **einen Griff in die Werkzeugkiste** entfernt!
