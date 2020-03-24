---
layout: [post, post-xml]              # Pflichtfeld. Nicht ändern!
title:  "Griff in die Werkzeugkiste: Eine Toolchain für React"         # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2020-01-30 10:30              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2020-01-30 10:30             # Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author: janschneider1                     # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: [Softwareentwicklung]                    # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Toolchain, React, JavaScript, Node]         # Bitte auf Großschreibung achten.
---

Toolchains fördern Flexibilität und vereinfachen den Entwicklungsprozess - In diesem Blog-Post bauen wir eine Toolchain für die beliebte Frontend-Technologie React. 
Dabei schauen wir uns Komponenten einer Toolchain an und erfahren wie wir diese nutzen können, um unseren Workflow mit React zu optimieren.

# Was ist React?

React ist eine JavaScript-Bibliothek, die es uns ermöglich interaktive Userinterfaces für Webanwendungen zu entwickeln.
Wir können mit React eigene UI-Komponenten mit JSX (JavaScriptXML), in einer HTML-artigen Syntax, schreiben.

Um React zu nutzen, können wir die benötigten Script-Dateien über CDN's ("Content-Delivery-Networks") einbinden.
Content-Delivery-Networks stellen Dateien zu Verfügung, wodurch wir benötigte Bibliotheken nicht selbst herunterladen müssen.

Wir müssen die React-Bibliothek, als auch den virtuellen ReactDOM einbinden. 
Ebenso wird Babel, ein JavaScript-Transpiler, benötigt.
Babel ermöglicht es uns JSX zu nutzen, da er die Syntax von JSX in für den Browser verständliches JavaScript übersetzt.

```html
<!-- React und ReactDOM -->
<script src="https://unpkg.com/react@16/umd/react.development.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js" crossorigin></script>

<!-- Babel ermöglicht es JSX zu benutzen -->
<script src="https://unpkg.com/babel-standalone@6/babel.min.js"/>
```

Die einzelnen Konzepte und Funktionen von React kannst du in der [React-Dokumentation](https://reactjs.org/docs/hello-world.html) nachlesen
oder dir mit dem Projekt [create-react-app](https://github.com/facebook/create-react-app) direkt eine vollständige Anwendung generieren lassen.

# Was ist eine Toolchain und wofür sind sie gut?

Durch eine Toolchain (engl. für "Werkzeugkette") ist es möglich mehrere Tools und Technologien miteinander zu verknüpfen.

Eine Toolchain **strukturiert** und **vereinfacht Entwicklungs- und Buildprozesse** und bietet **Flexibilität**, da sich verschiedene Prozesse und Technologien einfach "anketten" oder austauschen lassen.

Wir können React wie oben beschrieben über CDN's nutzen. 
Allerdings würde uns die Implementierung einer Toolchain und der Verzicht auf CDN's folgende Vorteile bieten:
- **Freie Wahl an Tools und Technologien**
- **Verkürzte Ladezeiten**, da der Client keine Dateien mehr über CDN's anfordern muss
- **Performancegewinn**, da Babel nicht mehr clientseitig, sondern einmalig pro Buildprozess auf dem Server durchgeführt werden kann

# Komm wir bauen eine Toolchain für React!

Im Folgenden implementieren wir eine Toolchain unter der Verwendung von Node.js. 
Die fertige Toolchain kannst du in meinem [Showcase-Projekt](https://github.com/JanSchneider1/PipePuzzle_React) in Aktion sehen. 
Unsere Toolchain soll folgende Aufgaben erledigen:

- **JSX-Transpilierung** (Übersetzung von JSX zu nativen JavaScript)
- **JavaScript-Bundeling** (Zusammenführen mehrerer JavaScript-Dateien)
- **JavaScript-Minifizierung** (Reduzierung der Dateigröße im Rahmen eines Buildprozesses)

Dabei wollen wir die Toolchain über die Commandozeile bedienen können und mit einem Befehl einen produktionsfähigen Build erstellen.

Nachdem wir [Node.js](https://nodejs.org/en/) installiert haben und ein Projekt in einem Ordner mit dem Befehl `npm init` initiert haben, kann es auch schon losgehen.

NPM steht dabei für "Node-Package-Manager" und wir werden ihn benutzen um diverse Pakete zu installieren.

## JSX-Transpilierung mit Babel

Babel ist ein JavaScript-Transpiler, der verschiedene JavaScript-erweiterende Syntax wie JSX in abwärdskompatibeles JavaScript übersetzt.

Um React mit JSX zu nutzen, müssen wir die Dateien in natives JavaScript zurückführen, da JSX nicht nativ von Browsern verstanden wird. 

Auch empfielt React die ES6 ("EcmaScript 2015") Syntax zu verwenden, die JavaScript um praktische Funktionen wie "Klassen-Funktionen" oder "Arrow Functions" erweitert.
Da ES6 (noch) [nicht von allen Browser-Versionen nativ unterstützt](https://www.w3schools.com/js/js_es6.asp) wird, wollen wir auch das in natives JavaScript übersetzen.

Um Babel nutzen zu können müssen wir das Babel-Modul mit den Presets für React über NPM installieren:

```bash
npm install babel-cli@6 babel-preset-react-app@3
```

```bash
npx babel --watch <ZuBewachenderOrdner> --out-dir <SpeicherOrdner> --presets react-app/prod
```

Wir können mit der `--watch` Option einen Watcher erzeugen, welcher über einen Teil unseres Projektes "schaut" und bei erkannten Änderungen die Dateien transpiliert und im angegebenen Ordner abspeichert.
 **\<ZuBewachenderOrdner>** und **\<SpeicherOrdner>** sind dabei relative Pfade, welche auf z.B. `./src` und `./build` Verzeichnis verweisen können. Mithilfe der `--presets` Option
 müssen wir nur das installierte Preset angeben und Babel nicht weiter konfigurieren.

## Bundeling mit Browserify

Es wäre toll, wenn wir jede React-Komponente in eine eigene JavaScript-Datei schreiben könnten.
Dadurch würden wir verhindern einen tausendzeiligen Spaghettiecode zu erzeugen.

Browserify ist ein JavaScript-Bundler, der es ermöglicht mehrere JavaScript-Dateien mithilfe der ["require-Syntax"](http://browserify.org/) zu einer Datei zusammenzuführen.

```bash
npm install watchify
```

Dafür installieren wir das Paket **Watchify**, eine Erweiterung von Browserify.
Watchify kann wie Babel einen Watcher erstellen, der auf Veränderungen in unserem Projekt reagiert.

```bash
watchify <ZuBewachendeDateien> -v --dg -o <SpeicherOrt>
```

Nach der Installation können wir auch hier einen Watcher erstellen. 
**\<ZuBewachendeDateien>** bezieht sich auf die von Babel generierten Dateien.


## Minifikation mit Terser

Sollten wir uns nun die von Browserify generierte JavaScript-Datei anschauen fällt auf, dass ihre Dateigröße zugenommen hat.
 
Natürlich resultiert dies zum einen daraus, dass wir nun nur eine große Datei haben.
Zum anderen sind die [Polyfills](https://developer.mozilla.org/en-US/docs/Glossary/Polyfill), sprich der von Babel erzeugte abwärdskompatible JavaScript-Code, für das Dateiwachstum verantwortlich.

Deshalb verkleinern wir die Datei mit einem JavaScript-Minifizierer indem wir unnötige Zeilenumbrüche und Leerzeichen entfernen, sowie Variablennamen verkürzen.
Unser Code bleibt daher für den Computer vollkommen verständlich, auch wenn er für uns Menschen nur schwer leserlich wird.
Wir sollten daher diesen Schritt nur bei der Auslieferung der Software behandeln, da gerade große Dateien lange Ladezeiten hervorrufen, aber auch das Datenvolumen mobiler Nutzer belasten können.

Wir installieren den JavaScript-Minifizierer [**Terser**](https://github.com/terser/terser) über NPM:

```bash
npm install terser
```

```bash
terser <Zieldatei> --output <Speicherort>
```

Mit Terser können wir unsere von Browserify zusammengefasste  **\<Zieldatei>** an einen  **\<SpeicherOrt>** ablegen.
Der Speicherort kann dabei z.B. das Unterverzeichnis `./build/minified` des Projekts sein.

# Verkettung der einzelnen Tools

Nun automatisieren wir die obigen drei Schritte mithilfe des Package-Runners NPX, welcher in der Lage ist die Befehle auszuführen und bereits mit NPM installiert wurde.
Allerdings benötigen wir noch das Paket [**Concurrently**](https://www.npmjs.com/package/concurrently), welches ermöglicht mehrerer "NPM-Scripts" parallel auszuführen.
Das Paket können wir gewohnt wieder über NPM installieren.

```bash
npm install concurrently
```

Um unsere geplanten Kommandos `npm run watch` und `npm run deploy` zu definieren, bearbeiten wir die `package.json` in unserem Projekt.
Wir müssen jetzt nur noch  **\<Transpile>**,  **\<Bundle>** und **\<Minify>** mit den Kommandos, die wir in den einzelnen Kapiteln geschrieben haben, austauschen.

```json
package.json
...

"scripts": {
  "watch": "concurrently \"<Transpile>\" \"<Bundle>\"",
  "deploy": "<Minify>",
},

...
```

Nun können wir unsere Befehle `npm run watch` und `npm run deploy` ausführen um unser Projekt automatisch auf Änderungen zu aktualisieren und einen Build erzeugen.

Wir haben in unserem Beispiel den Package-Runner NPX benutzt, da er mit NPM "mitgeliefert" wird. Alternativ können
wir auch Task-Runner wie [Gulp](https://gulpjs.com) oder [Grunt](https://gruntjs.com) nutzen. 
Diese benötigen etwas mehr Konfigurationsaufwand, bieten allerdings auch ein weiteres Maß an Funktionalität.

# Fazit

In diesem Blog-Post haben wir eine kleine Toolchain entwickelt, die JSX und ES6 zu nativen JavaScript transpiliert,
einzelne JavaScript-Dateien zusammenfügt und diese durch einen zusätzlichen Befehl verkleinert.

Diese Implementierung ist dabei nur eine von Vielen. 
Eine "gute" Toolchain ist letztlich vom eigenen Workflow abhängig.
Mit der von uns entwickelten Toolchain ist es einfach einzelne Elemente auszutauschen oder sie um Andere zu erweitern.

Zum Beispiel können wir:
- [**Webpack**](https://webpack.js.org) statt Browserify als Bundler nutzen
- Unseren Buildprozess um einen CSS-Minifier wie [**clean-css**](https://github.com/jakubpawlowicz/clean-css) erweitern
- Vor unseren Buildprozess noch einmal alle Tests ausführen

Egal für welche Tools wir uns entscheiden, unsere Toolchain ist nur **einen Griff in die Werkzeugkiste** entfernt!
