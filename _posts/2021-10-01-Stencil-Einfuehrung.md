---
layout:			[post, post-xml]											# Pflichtfeld. Nicht ändern!
title:			"Stencil - Einführung in den wiederverwendbaren Web-Components-Compiler"	# Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:			2021-10-01 08:00											# Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 	2021-10-14 10:00											# Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author_ids:	    [parideis]												    # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: 	[Softwareentwicklung]										# Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags:			[JavaScript, Stencil, WebComponents]				# Bitte auf Großschreibung achten.
---


In diesem Artikel werfen wir gemeinsam einen Blick auf Stencil und vergleichen, welche Vorteile diese Compiler-Lösung zu den gängigen Laufzeit-JavaScript-Frameworks bietet. 
Anschließend werden wir eine Stencil-Umgebung aufsetzen und eine passende Komponente erstellen. Stencil stammt aus dem Hause Ionic und auch große Unternehmen wie Apple, Amazon und Microsoft nutzen Stencil in ihren Produkten.  
Dieser Artikel richtet sich an alle, die schon erste Erfahrungen mit JavaScript-Frameworks wie Angular und Vue oder der Bibliothek React gemacht haben.

# Einführung in Stencil

Mit Stencil lassen sich plattformunabhängige Web-Components generieren, die in allen [gängigen Frameworks eingebunden](https://stenciljs.com/docs/overview) werden können, sowie in allen [aktuellen Browsern](https://stenciljs.com/docs/browser-support) laufen.

Somit bietet Stencil eine neue Herangehensweise an eine beliebte Idee: die Erstellung schneller und funktionsreicher Anwendungen im Browser. Dabei machen wir uns bei der Entwicklung die Vorteile wichtiger neuer Funktionen zu Nutzen, die nativ im Browser zur Verfügung stehen (z.B. [Custom Elements v1](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Custom_Elements)). 
Hierdurch können wir weitaus weniger Code ausliefern und schnellere Anwendungen erstellen, die mit allen Frameworks kompatibel sind. 
Custom Elements sind ein Bestandteil von der [Web-Components Definition](https://developer.mozilla.org/de/docs/Web/Web_Components).

Die gängigen Frameworks wie Angular oder Bibliotheken wie React brauchen, anders als Stencil, zusätzliches clientseitiges JavaScript, welches im Browser heruntergeladen und geparst werden muss, damit die Applikation funktioniert. 
Das wird deutlich beim konkreten Vergleich, wie viel Code (nur minified) benötigt wird, um eine Webkomponente zu liefern.

![Stencil im Vergleich zu Angular, React und Vue](/assets/images/posts/Stencil-Einfuehrung/stencil-vergleich.png)

Mit Stencil hat die Komponente nur 12,75kb Speicherplatz gekostet. 
Die React Lösung ist mit 128kb zehnmal so groß, wie die Stencil-Komponente, die Komponente von Angular 11 Elements ist mit 176kb sogar noch deutlich größer.
Vue kommt auf ungefähr 75kb und ist fast sechs mal so groß wie die Webkomponente, die mit Stencil generiert wurde.

Obwohl Stencil eine viel kleinere Paketgröße hat, verzichtet Stencil nicht auf die beliebten Funktionen, die wir als EntwicklerInnen von den Frameworks gewöhnt sind. 
Diese Funktionen werden wir im nächsten Abschnitt erläutern.

## Funktionen von Stencil

Im folgenden Abschnitt werden wir uns die einzelnen Funktionalitäten, die Stencil bietet, anschauen.

Der **virtuelle DOM** ist, ähnlich wie bei React und Vue, eine Abbildung des tatsächlichen DOM, worüber eine schnellere Veränderung möglich ist. 
Durch **asynchrones Rendering** wird außerdem eine Möglichkeit geboten, einen Platzhalter anzuzeigen, bis die Komponente eingebunden werden kann. 
Diese Funktion ist stark angelehnt an der Implementation von React-"Fiber". 
Stencil bietet des weiteren ein **reaktives Data-Binding** an, sodass die Daten zwischen der Komponente und dem DOM reaktiv miteinander verbunden werden. 
Durch TypeScript wird JavaScript mit Typen erweitert. 

Ein weiteres aus React bekanntes Feature ist **JSX**, welches eine XML-artige Syntax anbietet, die JavaScript-Code erstellt und von Typescript unterstützt wird.  
Die statische Seitengenerierung (**SSG**) bezeichnet das Erstellen und Rendern der Komponenten und Routen zur Bauzeit, welches auch als Prerendering bekannt ist.  
Durch **Lazy-Loading** ist es darüber hinaus auch möglich, die Komponenten bei Gebrauch dynamisch zur Laufzeit nachzuladen.



# Die erste Komponente erstellen

Im kommenden Codebeispiel lernen wir, wie wir mit Stencil eine Komponente erstellen können. 
Dabei werden wir gezielt nur auf ein kleines Stück der API und Funktionalitäten blicken.

Stencil in Version 2.6 erfordert NodeJS in der LTS-Version 14.17.3 und npm in der Version 6 oder höher. [https://stenciljs.com/docs/getting-started](https://stenciljs.com/docs/getting-started)

Mit folgendem Befehl können wir aus einer von drei Startvorlagen auswählen:

```bash
npm init stencil 
```

Wir wählen für das Beispiel die *component* Vorlage aus:

![Stencil CLI: Starter auswählen](/assets/images/posts/Stencil-Einfuehrung/stencil-cli-1.png)

Nachdem wir den Projektnamen mit *Enter* und *Y* bestätigt haben, generiert uns Stencil das Projekt und wir erhalten folgenden Überblick:

![Stencil CLI: Überblick über die verfügbaren Befehle](/assets/images/posts/Stencil-Einfuehrung/stencil-cli-2.png)


Als nächstes gehen wir in unser soeben generiertes Projekt und erstellen unsere erste Komponente:
```bash
cd <Projektname>
npm run generate
```

Bei den Namen der Komponenten muss ein Bindestrich vorhanden sein. 
Das geht aus den Webkomponenten-Spezifikationen heraus, damit der Browser es als Custom Element erkennt. 
Für unser Beispiel brauchen wir die zusätzlichen Dateien nicht, deswegen werden wir mit *a* alle Optionen abschalten und mit *Enter* bestätigen.

![Stencil CLI: Erste Komponente Generieren](/assets/images/posts/Stencil-Einfuehrung/stencil-cli-3.png)

## Die Komponente nutzen

Im Ordner **/src/components/** sollte sich nun die generierte (hallo-welt im Beispiel) Komponente befinden. 
Nun werden wir die Komponente verwenden, indem wir in der **src/index.html** Datei in der Zeile 14, wo zurzeit noch die Vorlage-Komponente *my-component* steht, mit unserer hallo-welt ersetzen: 

```html
<!DOCTYPE html>
<html dir="ltr" lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0">
  <title>Stencil Component Starter</title>

  <script type="module" src="/build/hallo.esm.js"></script>
  <script nomodule src="/build/hallo.js"></script>

</head>
<body>

  <hallo-welt></hallo-welt> <!-- 👈 Zeile 14 --> 

</body>
</html>

 ```

Wir können mit dem Befehl *npm start* das Projekt starten und der Browser sollte automatisch [http://localhost:3333/](http://localhost:3333/) aufrufen:

```bash
npm start
```

Nun sehen wir, wie unser Projekt zum ersten Mal gebaut wird:

![Stencil im Browser: Unser erster Build läuft](/assets/images/posts/Stencil-Einfuehrung/stencil-browser-1.png)

Danach gibt es nichts zu sehen, da uns unsere Komponente noch gar nichts anzeigt. 
Dies können wir ändern, indem wir in der HTML-Datei zwischen den <hallo-welt> Tags einen Inhalt schreiben, wie z.B. einen Titel: 

```html
<hallo-welt><h1>Willkommen</h1></hallo-welt>
```

Sobald wir die Datei speichern, baut Stencil die Komponente neu und aktualisiert dann den Browser:

![Stencil im Browser: Unsere Komponente Zeigt was an](/assets/images/posts/Stencil-Einfuehrung/stencil-browser-2.png)

Werfen wir nun einen Blick in die **hallo-welt.tsx** Datei. 
In der render()-Funktion wird die Ausgabe definiert, die bei uns ein slot enthält:

```html
<!--- hallo-welt.tsx Zeile 12--->
<slot></slot>
```
Ein slot ist ein Platzhalter bei dem die Kinderkomponenten eingebunden werden. 
Was in unserem Fall das h1-Element mit dem Inhalt "Willkommen" ist.

```javascript
import { Component, ComponentInterface, Host, h } from '@stencil/core';

@Component({
  tag: 'hallo-welt',
  shadow: true,
})
export class HalloWelt implements ComponentInterface {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
```

## Die Komponente soll einen Namen ausgeben

Als nächstes wollen wir, dass die Komponente uns mit einem Namen begrüßt, welchen wir als Attribut mitgeben. Dafür setzen wir in der Klasse **HalloWelt** einen *@Prop()*-Dekorator und vergeben den Namen **name** mit **string** als Typen. 
Zusätzlich müssen wir *Prop* noch in der import Deklaration von Stencil hinzufügen. 
Damit der Name auch angezeigt wird, fügen wir einen Paragraphen in der render()-Funktion unter dem **slot** ein, der mit *{this.name}* den Wert der Eigenschaft ausliest.

![Stencil Code: Property Name mit den Typen String hinzufügen und auslesen](/assets/images/posts/Stencil-Einfuehrung/stencil-code-2.png)

Zum Schluss müssen wir im HTML unserem Custom Element noch das Attribut *name* hinzufügen und dessen Wert setzen:

```html
<hallo-welt name="Anna">><h1>Willkommen</h1></hallo-welt>
```

Im Browser sollte nun folgende Begrüßung angezeigt werden: 
![Stencil im Browser: Unser Komponente begrüßt uns mit den übergeben Namen](/assets/images/posts/Stencil-Einfuehrung/stencil-browser-3.png)

# Die Komponente testen
Wir können die Funktionalität der Komponente mit Unit-Tests und Ende-zu-Ende-Tests (E2E-Tests) nachprüfen und validieren. 
Beide Testarten verwenden Jest. 
Die Browserumgebung für die E2E-Tests wird mit Hilfe von Puppeteer bereitgestellt. 

Außerdem bietet die Stencil CLI einen Befehl **stencil test** an.
Mit den optionalen Parametern  “—spec” oder “—e2e” kann angegeben werden, welche der beiden Testarten genutzt werden soll. 
Mit dem Parameter “—watchAll” werden die Tests automatisch erneut durchgeführt, sobald sich die Testdateien geändert haben.

Unser **npm test** Befehl, um Unit-Tests und E2E-Tests laufen zu lassen, könnte so aussehen:

```json
"scripts": {
    "test": "stencil test --spec --e2e",
    "test.watch": "stencil test --spec --e2e --watchAll",
}
```
## Tests schreiben
Zuerst wollen wir testen, ob die Komponente ohne mitgegebene Werte funktioniert.
In der Unit-Test-Datei **hallo-welt.spec.tsx** können wir das folgendermaßen machen:

```javascript
// Unit-Test:hallo-welt.spec.tsx
import { newSpecPage } from "@stencil/core/testing";
import { HalloWelt } from "./hallo-welt";

describe("testing-compo", () => {
  it("renders", async () => {
    const page = await newSpecPage({
      components: [HalloWelt],
      html: `<hallo-welt></hallo-welt>`,
    });
    expect(page.root).toEqualHtml(`
      <hallo-welt>
        <mock:shadow-root>
          <slot></slot>
          <p>
            Hallo
          </p>
        </mock:shadow-root>
      </hallo-welt>
    `);
  });
}
```

Die E2E-Tests schreiben wir in einer separaten Datei **hallo-welt.e2e.ts**: 
```javascript
// E2E:hallo-welt.e2e.ts
import { newE2EPage } from "@stencil/core/testing";

describe("hallo-welt", () => {
  it("renders", async () => {
    const page = await newE2EPage();
    await page.setContent("<hallo-welt></hallo-welt>");

    const element = await page.find("hallo-welt");
    expect(element).toHaveClass("hydrated");
  });

});
```

Daraufhin wollen wir testen, ob die Komponente den angegebenen Namen aus dem mitgegebenen Attribut ausliest und korrekt verwendet:


```javascript
// Unit-Test:hallo-welt.spec.tsx

  it("uses the given prop", async () => {
    const page = await newSpecPage({
      components: [HalloWelt],
      html: `<hallo-welt name="Anna"></hallo-welt>`,
    });
    expect(page.root).toEqualHtml(`
      <hallo-welt name="Anna">
        <mock:shadow-root>
          <slot></slot>
          <p>
            Hallo Anna
          </p>
        </mock:shadow-root>
      </hallo-welt>
    `);
  });
```
Mit dem "durchdringenden"  Selektor ``>>>`` kann nach einem Objekt innerhalb des Shadow-root einer Komponente gesucht werden.
So können wir nach den Paragraphen suchen und testen, ob der ausgegebene Text den Erwartungen entspricht. 

```javascript
// E2E:hallo-welt.e2e.ts

  it("can greet with the given name", async () => {
    const page = await newE2EPage();
    await page.setContent("<hallo-welt name='Anna'></hallo-welt>");

    const element = await page.find("hallo-welt >>> p");
    expect(element).toEqualText("Hallo Anna");
  });
```

Anschließend testen wir, ob die Kindkomponente korrekt eingebunden wird. 
Da wir in der Komponente *shadow* auf *true* gesetzt haben, befindet sich die Kindkomponente nicht direkt im Slot der ``<hallo-welt>`` Komponente, sondern nur ein Verweis darauf. 
Deswegen erwarten wir unser Kindelement (hier h1) unterhalb vom schließenden Shadow-Root:

```javascript
// Unit-Test:hallo-welt.spec.tsx

  it("uses the given slot", async () => {
    const page = await newSpecPage({
      components: [HalloWelt],
      html: `<hallo-welt><h1>Willkommen</h1></hallo-welt>`,
    });
    expect(page.root).toEqualHtml(`
      <hallo-welt>
        <mock:shadow-root>
          <slot></slot>
          <p>
            Hallo
          </p>
        </mock:shadow-root>
        <h1>Willkommen</h1>
      </hallo-welt>
    `);
  });
```

```javascript
// E2E:hallo-welt.e2e.ts

  it("can find the given child component", async () => {
    const page = await newE2EPage();
    await page.setContent(
      "<hallo-welt name='Anna'><h1>Willkommen</h1>hallo-welt>"
    );
    const child = await page.find("hallo-welt > h1");
    expect(child).toEqualHtml(`<h1>Willkommen</h1>`);
  });
```

Zum Schluss testen wir die Kombination aus dem mitgegebenen Namen und der Kindkomponente:
```javascript
// Unit-Test:hallo-welt.spec.tsx

  it("uses the given prop and slot ", async () => {
    const page = await newSpecPage({
      components: [HalloWelt],
      html: `<hallo-welt name="Anna"><h1>Willkommen</h1></hallo-welt>`,
    });
    expect(page.root).toEqualHtml(`
      <hallo-welt name="Anna">
        <mock:shadow-root>
          <slot></slot>
          <p>
            Hallo Anna
          </p>
        </mock:shadow-root>
        <h1>Willkommen</h1>
      </hallo-welt>
    `);
  });
```

```javascript
// E2E:hallo-welt.e2e.ts

  it("can find the given name and child component", async () => {
    const page = await newE2EPage();
    await page.setContent(
      "<hallo-welt name='Anna'><h1>Willkommen</h1>hallo-welt>"
    );

    const paragraph = await page.find("hallo-welt >>> p");
    expect(paragraph).toEqualText("Hallo Anna");

    const child = await page.find("hallo-welt > h1");
    expect(child).toEqualHtml(`<h1>Willkommen</h1>`);
  });
```
# Zusammenfassung

Im Vergleich zur direkten Verwendung von Custom Elements bietet Stencil zusätzliche APIs, die den Entwicklungsprozess beschleunigen. 
Im Gegensatz zu den beliebten JavaScript-Frameworks werden keine zusätzlichen Codelasten zur Laufzeit eingebunden, da reine Webkomponenten zur Kompilierzeit generiert werden, die nativ vom Browser genutzt werden können. 
Durch die breite Browserkompatibilität und die Möglichkeit, in die beliebten Frameworks integriert zu werden, bietet sich Stencil als Tool an, um Design-Systeme bzw. Komponentenbibliotheken zu entwickeln.

# Quellen
[Codebeispiel: https://github.com/parideis/stencil-hallo-welt ](https://github.com/parideis/stencil-hallo-welt)

[https://stenciljs.com/](https://stenciljs.com/ )

[https://github.com/ionic-team/stencil](https://github.com/ionic-team/stencil )

[Vergleich von Codierungsstil, Paketgröße und Leistung](https://webcomponents.dev/blog/all-the-ways-to-make-a-web-component/)
