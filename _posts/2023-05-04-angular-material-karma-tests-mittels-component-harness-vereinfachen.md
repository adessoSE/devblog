---
layout: [post, post-xml]              # Pflichtfeld. Nicht ändern!
title:  "Angular Material Karma-Tests mittels Component Harness vereinfachen"         # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2023-05-04 10:25              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2023-05-04 10:25             # Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author_ids: [frederikschlemmer]       # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesen Namen geben.
categories: [Softwareentwicklung]     # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Angular, Karma, Unit-Testing]   # Bitte auf Großschreibung achten.
---

Das Problem ist nahezu jedem Frontend Entwickler bekannt: Ein simpler Unit-Test wird durch die Implementierungsdetails unglaublich komplex.
Dies bringt einige Nachteile mit sich, weshalb Angular seit Version 9 Component Harness zur Verfügung stellt.

# Welches Problem adressieren Component Harness?
Wie bereits erwähnt, können die Tests aufgrund der Implementierungsdetails sehr schnell unübersichtlich werden.
Dadurch geht der Grundgedanke verloren, dass ein Test das gewünschte Verhalten darstellen soll, bzw. der Aufwand den Anwendungsfall zu verstehen, steigt an.

Beispielsweise wollen wir eine Komponente implementieren, welche einen Datepicker rendert und das ausgewählte Datum in passender Formatierung anzeigt.
Der Anwendungsfall klingt trivial und wir würden erwarten, der Test besteht aus wenigen Zeilen Code oder?
Den Button zum Öffnen des Datepickers können wir mit einer ID versehen und daher im DOM problemlos auswählen.
Allerdings erhöht sich enorm die Komplexität, wenn sich der Datepicker in einem Overlay, wie es beispielsweise Angular Material macht, rendert.
Dies ist der Moment, in dem der Test sich anhand der Implementierung der Komponente orientieren muss.
Hierdurch entsteht eine Abhängigkeit zur Implementierung der Komponente, wodurch unsere Tests bei Änderungen ebenfalls Anpassungen benötigen.
Dies senkt die Wartbarkeit der Tests und benötigen eine dauerhafte Anpassung an technische Änderungen in der Komponentenbibliothek.

Dieses Problem, sowie viele Weitere, werden durch Component Harness gelöst!

# Was sind Component Harness?
Bevor wir uns anschauen, wie unsere Probleme gelöst werden, sollte zunächst die Begrifflichkeit erläutert werden.
Es handelt sich hierbei um eine Schnittstelle, welche dem Entwickler geboten wird, um der Komponente zu interagieren.
Die Aufrufe dieser Schnittstelle interagieren in der identischen Art und Weise wie ein Nutzer.
Durch diese Zwischenschicht werden die Tests von der Implementierung der Komponente entkoppelt.
Ein Component Harness ist dementsprechend eine Klasse, welche dem Entwickler ermöglicht, mittels einer API das Nutzerverhalten abzubilden.
Dadurch werden Tests weniger anfällig für Änderungen in der Implementierung und somit wartbarer.
Zusätzlich können komplexere Funktionalitäten einer Komponente im Test abstrahiert werden.

# Wie sehen unsere Unit-Tests aktuell aus?
Zunächst werfen wir ein Blick auf den aktuellen Aufbau unseres Karma-Tests.
Wie bereits angesprochen verwenden wir als Beispiel eine Datepicker-Komponente.
Zu Beginn wollen wir erstmal nur prüfen, dass unsere Komponente mit dem richtigen Titel dargestellt wird.
Hierfür benötigen wird folgenden Testcode:

```js
 it('should have a title', () => {
    init(component);

    const matLabel: HTMLElement = fixture.nativeElement.querySelector('mat-label');
    
    expect(matLabel.textContent).toBe('Archivierungsdatum');
});
```

Auf den ersten Blick kann hier erkannt werden, dass der Titel getestet wird.
Allerdings wird auf dem zweiten Blick die starke Koppelung zu der technischen Umsetzung der Komponente deutlich.
Im nächsten Test wird die Komplexität erhöht und wir prüfen eine Nutzereingabe.
Hierfür benötigen wir folgenden Testcode:

```js
 it('should have user input', () => {
    init(component);

    const input: HTMLInputElement = fixture.nativeElement.querySelector('mat-form-field').querySelector('input');
    input.value = '2021-05-27';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.getControl().value).toEqual(new Date('2021-05-27'));
});
```

An dieser Stelle wird deutlich, dass der Test aufgrund der technischen Bindung an Lesbarkeit und Verständnis verliert.
Beim nächsten Überarbeiten des Tests werden sich uns einige Fragen stellen:

* Warum müssen wir an dieser Stelle ein Mat-Form-Field suchen und nicht einen Mat-Datepicker?
* Weswegen müssen wir nach dem Setzen des Wertes ein Event feuern?

Dies sind nur einige dieser Fragen.
Dabei sollte der Test nur **drei** Schritte beinhalten:

1. Das Suchen des Datepickers
2. Die Nutzereingabe des Datums 
3. Die anschließende Prüfung des Wertes vom Datepicker

Dies erreichen wir durch die Umstellung auf Component Harness.

# Die Umstellung der Tests auf Component Harness
Die beiden vorherigen Tests sollen nun auf Component Harness umgestellt werden.
Wir beginnen ebenfalls zunächst mit dem einfachen Testfall, welcher nur den Titel prüft.
Durch die Umstellung erhalten wir folgenden Testcode:

```js
 it('should have a title', async () => {
    init(component);

    const matFormField: MatFormFieldHarness = await loader.getHarness(MatFormFieldHarness);

    expect(await matFormField.getLabel()).toEqual('Archivierungsdatum');
});
```

Es wird deutlich, dass in diesem Fall tatsächlich das Feld des Datepickers gesucht wird.
Auf diesem Feld kann anschließend das Label geprüft werden.
Der Vorteil hierdurch ist, dass wird nicht mehr wissen müssen, dass der Titel als Mat-Label gerendert wird.
Des Weiteren ist dieser Test deutlich robuster, da er von der technischen Umsetzung entkoppelt ist.
Falls sich der Titel in der Zukunft nicht mehr als Mat-Label darstellt, würde dieser Test weiterhin funktionieren.

Noch deutlicher wird der Mehrwert bei dem zweiten Testfall.
Dieser soll eine Nutzereingabe bei dem Datepicker prüfen.
Ohne den Einsatz von Component Harness waren viele technische Vorkenntnisse und Funktionalitäten notwendig.
Diese fallen durch die Umstellung vollständig weg:

```js
 it('should have user input', async () => {
    init(component);

    const matDatePicker: MatDatepickerInputHarness = await loader.getHarness(MatDatepickerInputHarness);
    await matDatePicker.setValue('2021-05-27');

    expect(await matDatePicker.getValue()).toEqual('2021-05-27');
});
```

Die Komplexität, welche durch den Testaufbau hinzukam, ist vollständig weggefallen.
Bei einer erneuten Einarbeitung sollten wir keine Probleme haben, diesen Test zu verstehen und mögliche Anpassungen vorzunehmen.
Wie müssten wir den Test anpassen, wenn es mehrere Datepicker geben würde?
Beispielsweise könnten wir den gesetzten Placeholder in dem jeweiligen Datepicker als Referenz nutzen.

```js
    await loader.getHarness(MatDatepickerInputHarness.with({ placeholder: 'Geburtsdatum' }));
```

Dadurch erhalten wir nur den Datepicker mit dem Placeholder "Geburtsdatum".

# Fazit

Nach der Gegenüberstellung von einem Karma-Test mit und ohne Angular Component Harness sehen wir uns nun die Vor- und Nachteile an.
Folgende Punkte können als Vorteil genannt werden:

* Deutlich lesbarer und wartbarer Testcode
* Vereinfachung der Erstellung von robusten Tests
* High-Level-API zur Interaktion und Abfrage von Komponenten
* Verbesserte Unterstützung von asynchronen Interaktionen

Letzteres ist allerdings ein größeres Thema, weshalb wir uns dies hier nicht im Detail ansehen.

Neben den Vorteilen haben Angular Component Harness auch Nachteile:

* Zusätzliche Einrichtung und Konfiguration
* Mögliche Verlangsamung durch die Abstraktionsebene
* Höhere Komplexität im Vergleich zum direktem Zugriff

Die letzten beiden Nachteile kommen nur in seltenen Einsatzszenarien vor.
Die Verlangsamung ist abhängig von der Anzahl, sowie der Komplexität der Tests.
In den meisten Fällen sollte diese kaum bis gar nicht messbar sein.
Des Weiteren sollte sich die Komplexität nicht erhöhen, wenn alle Komponenten eine Component-Harness-Unterstützung besitzen.
Der Nachteil entsteht, wenn eine Mischung von traditionellem Vorgehen und Component Harness vorliegt.


In diesem Artikel haben wir gesehen, dass Angular Component Harness ein großes Potenzial zur Vereinfachung von Testcode haben.
Trotzdem sollte ihr Einsatz evaluiert werden, damit der zusätzliche Einrichtungs- und Konfigurationsaufwand nicht zu hoch ist.
Weitere Informationen und Beispiele findet ihr unter [Angular Material](https://material.angular.io/cdk/test-harnesses/overview#component-test-harnesses).



