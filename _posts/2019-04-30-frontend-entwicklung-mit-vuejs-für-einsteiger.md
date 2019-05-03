---
layout: [post, post-xml]                # Pflichtfeld. Nicht ändern!
title:  "Frontend Entwicklung mit Vue.js für Einsteiger"         # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2019-04-30 10:00                # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2019-04-30               # Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author: vincentmathis                   # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: [Softwareentwicklung]       # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [JavaScript, Frontend, Vue.js]    # Optional.
---

Die Welt der Webentwicklung ist groß und im ständigen Wandel. Neue Libraries, Frameworks und Tools verschwinden genauso schnell, wie sie aufgetaucht sind. Für Einsteiger in die Webentwicklung stellt das eine Hürde da, der man sich kaum gewachsen fühlt. Ich kann nicht garantieren, dass während des Verfassens dieses Blog-Eintrags keine neuen Frontend Frameworks entstanden sind.

# Was ist überhaupt ein Frontend Framework?

![JavaScript Frameworks / Tools](/assets/images/posts/frontend-entwicklung-mit-vuejs-für-einsteiger/javascript-frameworks-tools.png "JavaScript Frameworks / Tools")

_Grunt, Gulp, Broccoli, underscore, Mustache, Handlebars, Knockout etc.: JavaScript Tools oder zufällige Einträge aus einem englischen Wörterbuch?_

Bis in die frühen 2000er hatten Browser nicht die Möglichkeiten wie heute. Komplexe Applikationen darin umzusetzen war einfach nicht praktikabel. Mit der Weiterentwicklung der Browser kamen auch Libraries wie jQuery, um die Kommunikation zwischen Server und Client zu vereinfachen. Zur ersten Welle der Frontend Frameworks zählten Backbone, Ember, Knockout und AngularJS. Aktuell sind Angular (ehemalig Angular 2), React und Vue die _big players_. Vue wurde von Evan You entwickelt, während er für Google an AngularJS Web-Apps arbeitete. Vue versucht die guten Features aus Angular und React zu vereinen - und macht dabei einen echt guten Job!

![Stack Overflow Question Trends](/assets/images/posts/frontend-entwicklung-mit-vuejs-für-einsteiger/stackoverflow-trends.png "Stack Overflow Question Trends")

_Vue steht mittlerweile auf Platz 1 der JavaScript Toplist auf GitHub mit ~137k Sternen_

Frameworks abstrahieren die Interaktion mit dem Browser und dem DOM (um mit Vue anzufangen, müsst ihr nicht einmal wissen, was genau das Document-Object-Model eigentlich ist). Statt Elemente aus dem DOM zu referenzieren, um sie anschließend zu manipulieren, definiert man sie [deklarativ](https://de.wikipedia.org/wiki/Deklarative_Programmierung) auf einer höheren Abstraktionsebene. Oder einfacher ausgedrückt: Man gibt von vornherein an wie die Elemente aussehen sollten und überlässt die Arbeit Vue.

Mit einem bisschen Grundwissen zu HTML, CSS und JavaScript kann man ohne viel Aufwand loslegen:

```html
<html>
    <body>
        <div id="app">
            {{ "{{ message " }}}}
        </div>
        <script src="https://unpkg.com/vue"></script>
        <script>
            var app = new Vue({
                el: '#app',
                data: {
                    message: 'Du hast diese Seite am ' + new Date().toLocaleString() + ' geladen.'
                }
            })
        </script>
    </body>
</html>
```

__Ergebnis:__
```
Du hast diese Seite am 2019.04.23, 09:22:17 geladen.
```
_Beispiel auf [JSFiddle](https://jsfiddle.net/oj5veb9x/) anschauen._

Mit `new Vue()` wird eine neue Vue Instanz erzeugt, `el: '#app'` definiert das `<div id="app">` Element als den Einstiegspunkt für Vue.

Die doppelten geschweiften Klammern kennzeichnen _text interpolation_ (auch "Mustache" Syntax genannt). Der `{{ "{{ message " }}}}` Bereich innerhalb des `div` Elements wird mit dem Inhalt der `message` Variablen im `data` Objekt ersetzt. Auch wenn sich der Wert der Variablen ändert (z.B. in dem ihr `app.message = 'Hallo'` in die Entwicklerkonsole des Browsers eingebt).

Das war doch gar nicht so schwer, oder? Das Tolle an Vue ist, dass Vues Prinzipen diese Einfachheit auch in größeren Projekten beibehält.


# Was sind die Kernprinzipien von Vue?

Laut Vues Website lauten diese:

> __1. Approachable:__ Already know HTML, CSS and JavaScript? Read the guide and start building things in no time!

Wie schon erwähnt reichen Grundkenntnisse in HTML und JavaScript aus, um mit Vue loszulegen. Außerdem hat Vue eine ausgesprochen gute Dokumentation und Guides. Alles, was man über Vue wissen muss findet man dort mit Beispielen erklärt (Links findet ihr am Ende des Artikels). 

>__2. Versatile:__ An incrementally adoptable ecosystem that scales between a library and a full-featured framework.

Andere Frameworks benötigen meist eine komplette Neugestaltung einer bestehenden Web-App, Vue hingegen ist progressiv: Mit einem einfachen `script` Tag und Dreizeiler ist man schon startbereit, ohne jemals irgendwas von webpack, Babel oder npm gehört haben zu müssen. Das bedeutet Vue kann schrittweise in bestehende Projekte integriert werden. Die _core library_ kann alleinstehend oder in Verbindung mit Vues offiziellen begleitenden Libraries für _global state management_ (vuex) und _routing_ (vue-router) verwendet werden.

>__3. Performant:__ 20KB min+gzip Runtime, Blazing Fast Virtual DOM, Minimal Optimization Efforts

Wer Erfahrung mit React hat, dem wird auffallen, dass Vue sich genauso ein virtual DOM zunutze macht, reactive ist und zusammensetzbare Komponenten anbietet. Außerdem werden bei React genauso unterstützende Libraries angeboten, diese werden jedoch nicht wie bei Vue vom core Team gepflegt und sind daher fragmentierter.

Wenn Vue doch so ähnlich zu React ist, warum sollte man überhaupt das neuere Vue in Betracht ziehen? Vue unterscheidet sich in folgenden Punkten zu React:

In React ist alles reines JavaScript. Man hat dadurch zwar ein klassisches Programmiererlebnis (man kann temporäre Variablen verwenden und hat einen typischen Kontrollfluss), wie man es aus Programmiersprachen üblicherweise kennt, muss aber HTML und CSS in den JavaScript Code einbetten:

```javascript
const message = 'Du hast diese Seite am ' + new Date().toLocaleString() + ' geladen.';
const element = <div>{message}</div>;

ReactDOM.render(
    element,
    document.getElementById('root')
);
``` 
_Das gleiche Beispiel wie oben in React umgesetzt._

Der Wert von `element` ist hier weder String noch um HTML, sondern JSX: eine Syntaxerweiterung für JavaScript. Auch wenn es ähnlich aussieht, unterscheidet es sich von HTML. Das bedeutet: neue Entwickler oder Designer können nicht ohne Weiteres damit arbeiten. Außerdem resultiert aus dieser Verwobenheit eher unübersichtlicher und gegebenenfalls auch schlecht wartbarer Code.

Zwar kann man Vue auch mit JSX verwenden aber Vues Stärke liegt in dem weitaus simpleren Templating System. Vue Komponenten können in HTML Template (`<template>`), JavaScript (`<script>`) und CSS (`<style>`) unterteilt werden. Da gültiges HTML auch gleichzeitig gültiges Vue Template ist, kann man Vue ohne große Änderungen in bestehende HTML Websites einbauen. Dass man diese Aufteilung in einer einzelnen `.vue` Datei halten kann, macht den Entwicklungsprozess übersichtlich und ermöglicht unkompliziertes komponentenspezifisches Styling:

```html
<template>
    <div id="app">
        {{ "{{ message " }}}}
    </div>
</template>

<script>
export default {
    el: '#app',
    data() {
        return {
            message: 'Hello World!'
        }
    }
}
</script>

<style scoped>
#app {
    font-family: Helvetica, Arial, sans-serif;
    text-align: center;
    color: #2c3e50;
}
</style>
```
_Ein ausführliches Beispiel zu den sogenannten Single File Components findet ihr am Ende dieses Artikels._


_Wer besonders aufgepasst hat, dem ist aufgefallen, dass `data` im ersten Beispiel ein Objekt war, in diesem aber eine Funktion. Im ersten Beispiel wurde mit `new Vue(...)` eine einzelne __Vue Instanz__ erzeugt: in diesem Fall ist es okay `data` als einfaches Objekt zu definieren. In diesem Beispiel handelt es sich um eine __Vue Komponente__ (die unter Umständen mehr als einmal instanziiert wird). Um zu verhindern, dass das `data` Objekt zwischen verschiedenen Instanzen geteilt wird, verwendet man innerhalb Komponenten eine Funktion._

Grundsätzlich unterscheidet sich die Performance von Vue.js und React nur geringfügig, Vue implementiert sein virtual DOM allerdings mit einer Art automatischer Abhängigkeitsverwaltung. Das bedeutet: Vue weiß, welche Komponenten von einer Zustandsänderung betroffen sind und rendert nur diese neu.

Im Fall von React hingegen löst eine Zustandsänderung ein rerendering aller Kind-Elemente einer Komponente aus. Das lässt sich zwar verhindern, muss aber für alle Komponenten manuell gemacht werden.

Vue hat daher minimalen Optimierungsaufwand und liefert etwas bessere Performance out of the box.

Mit React Native hat man jedoch noch einen Vorteil gegenüber Vue, wenn es um iOS und Android Entwicklung geht. Vues Antwort (Weex) auf React Native ist momentan noch in aktiver Entwicklung.

Ein letzter Punkt, der nicht zu missachten ist: Vue ist unabhängig, es wird durch Spenden und die Community unterstützt. Das bedeutet, dass es nicht durch die Agenda einer Firma wie Google (Angular) oder Facebook (React) gelenkt wird.


# Wie funktioniert Vue?

Ein grundgelegenes Konzept von Vue sind die sogenannten _directives_. Diese beginnen mit dem `v-` Prefix. Der Wert eines _directives_ (und auch innerhalb `{{ "{{ ... " }}}}`) muss eine einzelne JavaScript Expression sein.

```html
<img v-bind:src="'/assets/images/' + filename" />
```
_Was genau `v-bind` tut, erfahrt ihr später in diesem Artikel_

Ein Ausdruck wie dieser wäre zwar möglich, sollte aber vermieden werden, um Logik von Template getrennt zu lassen. Stattdessen sollten _computed properties_ verwendet werden:

```javascript
var app = new Vue({ 
    el: '#app',
    data: {
        filename: 'logo.png'
    },
    computed: {
        imageSrc() {
            return '/assets/images/' + this.filename
        }
    }
});
```

Computed properties können genauso verwendet werden wie gewöhnliche properties:
```html
<img v-bind:src="imageSrc" />
```

Aber zurück zu den _directives_, wofür sind sie gut und wie verwendet man sie?

## Bedingtes Rendern

Mit `v-if` setzt man _conditinal rendering_ um. Vue ist _reactive_: ändert sich der Wert von `visible` wird ein _rerendering_ der HTML Struktur ausgelöst.

```html
<div id="app">
    <span v-if="visible">Dieses HTML Element wird nur gerendert, wenn visible true ist</span>
    <span v-else>Ansonsten wird dieses Element gerendert</span>
</div>
```
```javascript
var app = new Vue({ 
    el: '#app',
    data: {
        visible: false
    }
});
```
__Ergebnis:__
```
Ansonsten wird dieses Element gerendert
```
_Beispiel auf [JSFiddle](https://jsfiddle.net/a3fkrxvg/) anschauen._

Natürlich gibt es zu dem `v-if` _directive_ auch die entsprechenden `v-else` und `v-else-if` _directives_, wie man sie aus den meisten Programmiersprachen kennt.


## Listen Rendern

Schleifen können innerhalb eines Templates mit `v-for` realisiert werden. Die Syntax ist vergleichbar mit JavaScripts `for...of` statement:
```html
<div id="app">
    <ol>
        <li v-for="item in items">
            {{ "{{ item.text " }}}}
        </li>
    </ol>
</div>
```
```javascript
var app = new Vue({
    el: '#app',
    data: {
        items: [
            { text: 'Das ist ein Listenelement' },
            { text: 'Das ist ein anderes' },
            { text: 'Und noch eins' }
        ]
    }
})
```
__Ergebnis:__
```
1. Das ist ein Listenelement
2. Das ist ein anderes
3. Und noch eins
```
_Beispiel auf [JSFiddle](https://jsfiddle.net/bx2w57y9/) anschauen._


Alternativ kann man auch folgende Syntax verwenden, um Zugriff auf den aktuellen Index zu bekommen:
`v-for="(item, index) in items"`. 

Außerdem kann `v-for` nicht nur über Arrays, sondern auch über JavaScript Objekte iterieren. Entweder iteriert man nur über die Attribute:
```html
<li v-for="value in object">
    {{ "{{ value " }}}}
</li>
```
oder über _key value_ -Paare:
```html
<li v-for="(value, key) in object">
    {{ "{{ key " }}}}: {{ "{{ value " }}}}
</li>
```


## Zwei-Wege Bindung

Die Inhalte des Templates an Variablen aus dem Model binden ist mit _directives_ und `{{ "{{ ... " }}}}` einfach. Aber was, wenn man Bindung in die andere Richtung erreichen möchte? Zum Beispiel, wenn der Wert einer Variablen den eines `input` Tags annehmen soll?

Das `v-model` _directive_ macht _bidirectional binding_ einfach. Tippt der User etwas in das `<input>` Feld ein, wird der Inhalt an die `message` Variable übertragen und die Änderung wiederum löst ein erneutes rendering des `<p>` Tags aus:
```html
<div id="app">
    <p>{{ "{{ message " }}}}</p>
    <input v-model="message">
</div>
```
```javascript
var app = new Vue({
    el: '#app',
    data: {
        message: 'User-Eingabe mit Vue'
    }
})
```

Seht euch das Beispiel auf [JSFiddle](https://jsfiddle.net/wbv0ec2j/) an und tippt etwas in das Eingabefeld.


## Directive Argumente

Einige _directives_ können Argumente annehmen, diese werden mit einem Doppelpunkt gekennzeichnet. Zum Beispiel `v-bind`, mit dem man gewöhnliche HTML Attribute an das Model binden kann. Der Wert des `href` Attributes ist an die `url` Variable gebunden und ändert sich dynamisch:
```html
<div id="app">
    <a v-bind:href="url"> Ein Link </a>
</div>
```
```javascript
new Vue({
    el: "#app",
    data: {
        url: 'https://vuejs.org/'
    }
})
```
_Beispiel auf [JSFiddle](https://jsfiddle.net/qLjxfbep/) anschauen._


Ein weiteres Beispiel ist `v-on`, welches auf DOM Events hört:
```html
<div id="app">
    <p v-on:click="doSomething"> Klick mich </p>
</div>
```
```javascript
new Vue({
    el: "#app",
    methods: {
        doSomething() {
            alert("Hallo")
        }
    }
})
```
_Beispiel auf [JSFiddle](https://jsfiddle.net/nctvzs85/) anschauen._

Klickt der User also auf diesen Link, wird die `doSomething` Methode aufgerufen. Methoden sind bei Vue innerhalb des `methods` Objektes anzulegen, damit sie vom Template aus verwendbar sind.

Da `v-bind` und `v-on` sehr häufig auftreten können sie abgekürzt werden: 
`v-bind:class="..."` ist equivalent zu `:class="..."`. Das gleiche gilt für
`v-on:click="..."` und `@click="..."`.


# Was sind Vue Komponenten?

Es ist typisch für Vue Apps in einem Baum von verschachtelten Komponenten organisiert zu sein. Komponenten sind wiederverwendbare Vue Instanzen.

```javascript
Vue.component('blog-post', {
    props: ['title'],
    template: '<h3>{{ "{{ title " }}}}</h3>'
})

...

new Vue(
    ...
)
```

```html
<blog-post title="Eine Überschrift" />
<blog-post title="Eine weitere Überschrift" />
<blog-post title="Und noch eine Überschrift" />
```

Komponenten können Properties (`props`) besitzen. Das ermöglicht es, Werte an Kind-Komponenten zu übergeben, wie hier mit `title="..."`.

Globale Komponenten werden mit `Vue.component(...)` registriert und können in allen Vue-Instanzen verwendet werden, die nach der Regristrierung mit `new Vue(...)` instanziiert werden. Um komplexere Strukturen aufzubauen, kann man eine Komponente aber auch in einer `.vue` Datei anlegen, um sie anschließend an anderer Stelle als lokale Komponente zu importieren.

Hier ist das gleiche Beispiel der Blog Post Komponente umgesetzt mit lokalen Komponenten in `.vue` Dateien:

__BlogPost.vue__
```html
<template>
    <div class="blogpost">
        <h1>{{ "{{ title " }}}}</h1>
        <p>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
        </p>
    </div>
</template>

<script>
export default {
    name: 'BlogPost',
    props: {
        title: {
            type: String,
            required: true
        }
    }
}
</script>

<style scoped>
h1 {
    font-weight: normal;
    color: #42b983;
}

.blogpost {
    margin: 60px;
    width: 600px;
}
</style>
```

In dieser Komponente wurde innerhalb des `<script>` Tags (Der JavaScript-Teil der Vue-Komponente) ein Property `title` vom Typ `String` definiert, welches `required` ist. Dieses Property wird in dem `<template>` Bereich innerhalb eines `<h1>` Tag angezeigt. Darunter ist noch ein `<p>` Tag mit einem Platzhalter-Text.

Der `<style>` Tag ist `scoped` und wird deshalb nur auf diese Komponente angewendet.

Die BlogPost-Komponente wird hier in der App-Komponente verwendet:

__App.vue__
```html
<template>
    <div id="app">
        <BlogPost 
            v-for="post in posts"
            v-bind:title="post.title"
            v-bind:key="post.id"
        />
    </div>
</template>

<script>
import BlogPost from './components/BlogPost'

export default {
    name: 'App',
    components: {
        BlogPost
    },
    data() {
      return {
        posts: [
            { id: 1, title: 'Eine Überschrift'},
            { id: 2, title: 'Eine weitere Überschrift'},
            { id: 3, title: 'Und noch eine Überschrift'}
        ]
      }
    }
}
</script>

<style>
#app {
    font-family: Helvetica, Arial, sans-serif;
}
</style>
```

In dieser Komponente wird die BlogPost-Komponente mit `import BlogPost from './components/BlogPost'` importiert und kann anschließend im Template mit `<BlogPost ...>` verwendet werden.

In `data` ist hier beispielsweise ein Array aus JavaScript Objekten mit den Titeln der Blog Posts (`posts`) angelegt worden, typischerweise würden diese Daten aber von einem Server asynchron via (REST) API geladen werden.

Weil hier mehrere BlogPosts angezeigt werden sollen, wird über das `posts` Array mit `v-for="post in posts"` iteriert. Dadurch wird für jedes Objekt in `posts` eine BlogPost-Komponente erzeugt.

Da in der BlogPost-Komponente das Property `title` als `required` definiert wurde, muss dieses mit `v-bind:title="post.title"` an die Komponente übergeben werden.

Darüber hinaus wird noch die `id` mit `v-bind:key="post.id"` übergeben, damit Vue in der Lage ist die Komponenten-Instanzen eindeutig zu identifizieren.

__Ergebnis:__

![Vue Komponenten Beispiel](/assets/images/posts/frontend-entwicklung-mit-vuejs-für-einsteiger/vue-components-example.png "Vue Komponenten Beispiel")

_Falls das etwas zu schnell ging, kann man dieses Beispiel auf [codesandbox.io](https://codesandbox.io/s/8xp35z1r70?fontsize=14&module=%2Fsrc%2FApp.vue) – einem online Code Editor – genauer anschauen._

Vues Komponenten-System macht es sehr einfach, komplexe Strukturen aufzubauen und zu pflegen. Man könnte die BlogPost-Komponente ohne Probleme erweitern. Beispielsweise mit einer BlogPostContent-Komponente anstelle des Lorem ipsum Platzhalters.


# Sollte ich Vue für mein nächstes Projekt verwenden?

Vue macht Spaß, ist einsteigerfreundlich und performant. Aber wie immer gilt:
"whatever does the job". Es wird immer Fälle geben, in denen andere Frameworks überlegen sein werden oder es einfachere Lösungen gibt. Ich kann euch Vue trotzdem nahelegen, vor allem wenn ihr ohne viel Aufwand Prototypen entwerfen wollt oder Einsteiger in die Web-Entwicklung seid.

Falls ich euer Interesse geweckt habe, könnt ihr hier weiterlesen:

1. Guide & Documentation: [vuejs.org](https://vuejs.org/v2/guide/)

2. Commandline Interface zum einfachen Anlegen von neuen Projekten: [Vue CLI](https://cli.vuejs.org/guide/)

3. Vue Devtools: [Chrome](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) / [Firefox](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

4. Offizielle Liste mit Ressourcen, Guides, Libraries, Komponeten etc: [awesome-vue](https://github.com/vuejs/awesome-vue)

5. VS Code Extension: [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur)