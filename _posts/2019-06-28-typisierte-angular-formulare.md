---
layout: [post, post-xml]
title:  "Typisierte Forms in Angular"
date:   2019-06-28 10:25
author: no0x9d
categories: [Softwareentwicklung]
tags: [Angular, Typescript, Angular forms]
---

In fast jeder Angular Applikation wird man früher oder später Eingaben von Nutzern annehmen und verarbeiten wollen. Reactive Forms haben den Vorteil, dass die Strukturen und alle Validierungen an einem Platz definiert werden und feldübergreifende Validierungen so sehr einfach umsetzbar sind. Für den Nachteil, dass sämtliche Typinformationen über die Formulardaten verloren gehen, soll hier eine Alternative aufgezeigt werden.

# Typisierte Forms in Angular

In der aktuellen Implementierung der Reactive Forms sind keine Typinformationen über die Struktur der Daten in einer `FormGroup` mehr vorhanden. Dies kann gerade bei größeren Formularen problematisch sein.

Die Übersicht leidet und da der Zugriff auf die einzelnen Felder lediglich über Strings erfolgt, sind Änderungen der Struktur nicht refactoring-sicher. Fehler findet man dann erst durch die Ausführung von Unit-Tests oder zur Laufzeit. Die IDE kann auch keine Unterstützung wie Code-Completion anbieten.

Da sich Typescript in diesem Bereich stark weiterentwickelt hat, haben wir als Lösung in einem aktuellen Projekt eine Typisierung auf die Form-Klassen des Angular Projekt aufgesetzt und als Open Source Paket `ngx-strongly-typed-forms` über [npm](https://www.npmjs.com/package/ngx-strongly-typed-forms) veröffentlicht.

# Besipiel-Anwendung

Als Beispiel für die Integration dient die von Angular verwendete finale Version der reactive Form Demo. Hier handelt es sich um ein keines Beispiel, in dem man zu einem Helden den Namen, Adressen und seine Superpower pflegen kann. Dabei wurde die `HeroDetailComponent` auf typisierte Formulare mit `ngx-strongly-typed-forms` umgestellt.

Das Repository mit dem vollständigen Code befindet sich auf [Github](https://github.com/no0x9d/typed-reactive-forms-example). Bei [stackblitz.com](https://stackblitz.com/github/no0x9d/typed-reactive-forms-example) kann man direkt im Browser eine lauffähige Version betrachten und ausprobieren.

Schauen wir uns einmal die anfangs erwähnten Nachteile am Beispiel an:

```typescript
export class HeroDetailComponent implements OnChanges {
  heroForm: FormGroup;
  /* ... */
  createForm() {
    this.heroForm = this.fb.group({
      name: '',
      secretLairs: this.fb.array([]),
      power: '',
      sidekick: ''
    });
  }
  get secretLairs(): FormArray {
    return this.heroForm.get('secretLairs') as FormArray;
  };
}
```

Möchte man nun auf die Adressen im Feld *secretLairs* zugreifen, verwendet man z.B. den Aufruf `this.heroForm.get('secretLairs').value`. Dies hat zwei große Nachteile.

Zum einen wird für den Zugriff ein Magic String für den Feldnamen verwendet, der womöglich noch an mehreren Stellen in der Applikation auftritt. Will man nun ein Feld umbenennen und übersieht ein Vorkommen des Feldnamens, dann tritt erst zur Laufzeit ein Fehler auf.

Weiterhin ist der Rückgabewert des oberen Ausdrucks `any` und muss erst zu `Address[]` gecastet werden. Ändert sich nun die Struktur, in dem man z.B. ein eigenes Interface `SecretLair` definiert, muss auch der Cast angepasst werden. Dies wird nicht vom Typescript Compiler abgesichert.

Will man ansonsten wissen, welche Felder im `heroForm` existieren, so muss man die hier gezeigte Definition im Code finden und analysieren. Dabei kann das Form gegebenenfalls an anderen Stellen dynamisch um weitere Felder erweitert worden sein.
Alle diese Nachteile wollen wir durch die typisierten Formulare umgehen.

# Typisierte Forms einbauen

Die Integration in ein vorhandenes Projekt ist denkbar einfach. Das Paket selber ist über die Paketverwaltung npm verfügbar und wird mit folgendem Befehl installiert:

```sh
npm install ngx-strongly-typed-forms
```

Soll zusätzlich der typisierte `FormBuilder` genutzt werden, so muss noch das Modul `NgxStronglyTypedFormsModule` im `AppModule` importiert werden:

```typescript
import { NgxStronglyTypedFormsModule } from 'ngx-strongly-typed-forms';

@NgModule({
  /* ... */
  imports: [ /* ..., */ NgxStronglyTypedFormsModule ], // <-- provides FormBuilder
})
export class AppModule { }
```

Um das Formular nun typisieren zu können muss ein Interface für das Modell der verwalteten Daten erzeugt werden:

```typescript
interface HeroFormModel {
  name: string;
  secretLairs: Address[];
  power: string;
  sidekick: string;
}
```
Für die finale Umstellung  muss der Import der Klassen `FormGroup`, `FormControl` und `FormArray` von `@angular/forms` auf `ngx-strongly-typed-forms` geändert werden. Diese sind API-kompatibel zu den Klassen aus dem Angular Projekt. Nach Einfügen der Typen des neu erstellten `HeroFormModel` erfolgt jeglicher Zugriff nun typisiert:

```typescript
// import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { FormArray, FormBuilder, FormGroup } from 'ngx-strongly-typed-forms';

export class HeroDetailComponent implements OnChanges {
  heroForm: FormGroup<HeroFormModel>;
  /* ... */
  createForm() {
    this.heroForm = this.fb.group<HeroFormModel>({
      name: '',
      secretLairs: this.fb.array<Address>([]),
      power: '',
      sidekick: ''
    });
  }
  get secretLairs(): FormArray<Address> {
    return this.heroForm.get('secretLairs') as FormArray<Address>;
  }
}
```

Wie man sieht ist die Umstellung ohne großen Aufwand machbar. Auch der Zugriff auf den Wert von `secretLairs` erfolgt noch genau so wie vorher. Der Unterschied ist hier allerdings eine Prüfung durch den Typescript Compiler und auch weitere Unterstützung beim Entwickeln wie z.B. Code Completion.

```typescript
    this.heroForm.get('secretLairs') as FormArray<Address>;
    // OK

    this.heroForm.get('secret-lairs') as FormArray<Address>; // nicht existentes Feld
    // Compile Error TS2345: Argument of type '"secret-lairs"' is not assignable to parameter of type '["name" | "secretLairs" | "power" | "sidekick", "toString" | "concat" | "indexOf" | "lastIndexOf"...'.

    this.heroForm.get('secretLairs') as FormArray<string>; // Falscher Datentyp
    // Compile Error TS2322: Type 'FormArray<string>' is not assignable to type 'FormArray<Address>'.
```
![Code Completion](/assets/images/posts/typisierte-angular-formulare/code-completion.png)

# Eigene Validator-Funktionen

Die Umsetzung von eigenen Validator-Funktionen ist ebenfalls typisiert möglich.  Diese können über den `FormBuilder` oder direkt mit den Unterklassen von `AbstractControl` benutzt werden. Sollte nun ein Validator verwendet werden, dessen Modell nicht mit `Validator` kompatibel ist, so wird dieses direkt vom Typescript-Compiler mit einer passenden Fehlermeldung abgefangen:

```typescript
function nameIncludesPowerValidator(control: AbstractControl<HeroFormModel>) {
  const {name, power} = control.value;
  if (name && power && !name.match(new RegExp(power, "i")) {
    return {nameValidation: "Name does not contain Power"};
  }
  return null;
}

/* ... Und eingebunden in das heroForm */
createForm() {
  this.heroForm = this.fb.group<HeroFormModel>({
    name: '',
    secretLairs: this.fb.array<Address>([]),
    power: '',
    sidekick: ''
  }, {validator: nameIncludesPowerValidator });
}
```
## Fazit
Wir verwenden typisierte Forms im aktuellen Projekt schon seit mehreren Monaten und es hat sich als Erleichterung im Entwickleralltag herausgestellt, die auch keinen großer Mehraufwand bedeutet. Das Typensystem von Typescript ist mittlerweile mächtig genug, um die Entwickler zu unterstützen und mit dem Compiler eine zusätzliche Schicht Sicherheit einzuziehen.
Angular selbst bietet einem leider nicht von Hause aus diese Möglichkeiten an und eine Umsetzung ist aktuell auch noch nicht in Sicht (s. [Issue #13721](https://github.com/angular/angular/issues/13721) und [Pull Request #20040](https://github.com/angular/angular/pull/20040)). Bis dies irgendwann unterstützt wird kann auf [`ngx-strongly-typed-forms`](https://www.npmjs.com/package/ngx-strongly-typed-forms) zurückgegriffen werden.
