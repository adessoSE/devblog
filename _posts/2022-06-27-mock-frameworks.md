---
layout: [post, post-xml]              # Pflichtfeld. Nicht ändern!
title:  "Mocking-Frameworks im Vergleich" # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2022-06-28 11:00              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2022-06-28 11:00       # Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author_ids: [cjohn]                   # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesen Namen geben.
categories: [Softwareentwicklung]     # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Software,Entwicklung,Testing,Frameworks] # Bitte auf Großschreibung achten.
---

Ein Unit-Test soll genau das ausgewählte Stück Code testen.
Doch oft ruft die zu testende Methode externe Services oder Datenbanken auf.
Mocks können solche Abhängigkeiten durch Platzhalter ersetzen.
Die drei in der Microsoft-Welt beliebten Mocking-Frameworks Moq, NSubstitute und FakeItEasy werden hier gegenübergestellt.

# Was Mocks können

Ein Mock ersetzt Abhängigkeiten, die in der Testumgebung nicht zur Verfügung stehen, durch Platzhalter.
Er fängt Methodenaufrufe ab, ersetzt sie durch eigenen Code und füttert den Aufrufer mit Testdaten.
In der Theorie unterscheidet man Stubs, die nur feste Eingangsdaten mit festen Testdaten beantworten, von sogenannten Fakes, die tatsächlich eine alternative Logik enthalten.
Mocks sind erweiterte Stubs, die überprüfen können, ob eine abgefangene Methode alle im Testlauf erwarteten Aufrufe erhalten hat.
In der Praxis spielt diese Unterscheidung kaum eine Rolle.

Die drei hier betrachteten Frameworks sind alle in der Lage, gemockte Methoden mit einer sinnvollen Implementierung zu hinterlegen.
Im Alltag ist das zum Beispiel nützlich, um vom Testobjekt erzeugte Daten zu sammeln, die im Betrieb an eine Datenbank gesendet würden.
Ein wohlüberlegt definierter Fake kann flexibel eingesetzt werden, wenn er auf unterschiedliche Eingaben passend reagiert.

# Das Gleiche, nur anders

Die weit verbreiteten Frameworks [Moq](https://github.com/moq), [NSubstitute](https://nsubstitute.github.io) und [FakeItEasy](https://fakeiteasy.github.io) stellen sich hier dem Vergleich.
Alle davon verwenden intern [DynamicProxy](http://www.castleproject.org/projects/dynamicproxy/) aus dem Castle Project, um von der zu testenden Schnittstelle oder Klasse eine Proxyklasse abzuleiten.
Damit unterliegen alle den gleichen Grenzen:
DynamicProxy erzeugt Proxy-Objekte für Interfaces oder Klassen, indem es eine neue Klasse davon ableitet.

Ein Proxy für eine konkrete Klasse kann naturgemäß nur die virtuellen Methoden abfangen.
Von statischen oder versiegelten Klassen ist kein Proxy ableitbar, sie können also nicht gemockt werden.
Generell empfiehlt sich, nur auf Interface-Ebene zu testen.
Denn ein Mock für eine Klasse ruft zumindest einen echten Konstruktor auf, bei nicht abgefangenen Methoden gegebenenfalls auch deren originale Implementierung, was beim Überbrücken von Schreibzugriffen durchaus Schäden hinterlassen kann.

## Gemeinsamkeiten

Alle Frameworks werden als NuGet-Paket installiert.
Das Grundprinzip ist immer gleich:
In der Proxy-Klasse werden für jede einzelne Methode die Rückgabewerte festgelegt.
Das kann eine Konstante sein, ein Wert pro erwartete Argument-Kombination oder auch eine Ersatzimplementierung.

Anschließend kann überprüft werden, ob ein erwarteter Aufruf im Testlauf stattgefunden hat.
Leider sieht kein Framework eine direkte Abfragemöglichkeit vor.
Stattdessen werfen sie bei fehlgeschlagener Verifikation eine jeweils frameworkspezifische Exception.

## Analyzer

Damit unzulässige Tests früh auffallen, bieten NSubstitute und FakeItEasy einen Roslyn-Analyzer an.
Beide überprüfen die Unit-Tests auf das Überschreiben eines nicht-virtuellen Members sowie auf den Bezug auf Argumente außerhalb des für die Methode spezifizierten Bereichs.
Der Analyzer von FakeItEasy macht mit seinen nur fünf Prüfregeln zwar einen rudimentären Eindruck gegenüber dem NSubstitute-Analyzer mit 24 Regeln.
Aber praktisch dürfte der Nutzen ohnehin gering sein, schließlich fallen Fehler bei der ersten Testausführung sofort auf.

## Besonderheiten von Moq

Moq ist der Klassiker unter den Mocking-Frameworks, sein Name steht für "Mock you".
Ein Alleinstellungsmerkmal zeichnet ihn aus:
Beim Testaufbau werden unterschiedliche "syntaktische Geschmacksrichtungen" unterstützt.
So lässt sich, wie gewohnt, jede Funktion einzeln mit `mock.Setup().Returns()` ersetzen.
Alternativ kann der komplette Mock auch in einem großen LINQ-Ausdruck definiert werden, was bei Fakes mit eigener Logik allerdings auf Kosten der Lesbarkeit geschieht.

Bei etwas umfangreicheren Interfaces oder wiederholten Methodenaufrufen geht die Performance von Moq leider schnell in die Knie.
Auch daran zeigt sich, dass Moq sein Spezialgebiet bei kurzen Wegwerf-Mocks hat, die wenige Methoden mit Konstanten überschreiben und die nach ein paar Aufrufen verworfen werden.

## Besonderheiten von NSubstitute

NSubstitute verwendet Extensions, um den Testaufbau lesbar zu halten.
Solange der Mock streng als solcher definiert wird, behält der Testcode die schlichte Struktur `myObj.MyMethod().Returns()`.
Die Eleganz endet, sobald Funktionsargumente in der Fake-Logik benutzt werden sollen.
Denn diese werden in einem `CallInfo`-Objekt verpackt übergeben und sind zunächst alle vom Typ Object.

Um eine Klasse statt einer Schnittstelle zu ersetzen, müssen bei NSubstitute - genauso wie bei Moq - alle Konstruktor-Parameter angegeben werden.
Sollten sie in der Testumgebung nicht zur Verfügung stehen, muss auch hier für jeden Parameter vorher ein Substitut erzeugt werden.
Zu beachten sind auch die Warnungen in der Dokumentation, dass man im Regelfall nur Schnittstellen substituieren soll und nur im Ausnahmefall eine Klasse.

Vom Konstruktor abgesehen, ruft NSubstitute die echte Implementierung einer substituierten Klasse nie auf.
Das heißt, `Substitute.For<T>()` erzeugt immer einen strikten Fake.
Wo das nicht gewünscht ist, muss ausdrücklich mit `Substitute.ForPartsOf<T>()` ein partielles Substitut erzeugt werden.

## Besonderheiten von FakeItEasy

FakeItEasy hat das Ziel, besonders leicht verständlich zu sein.
Die Trennung von Stubs, Mocks, Fakes wurde verworfen, alles ist hier ein Fake.
Etwas gewöhnungsbedürftig ist die allgegenwärtige Klasse `A`, eine Anlehnung an natürliche Sprache.
Man erzeugt `A.Fake` und dafür `A.CallTo` mit Argumenten `A<T>`.

Wenn mit einer Klasse statt einer Schnittstelle gearbeitet wird, muss auch FakeItEasy den echten Konstruktor mit allen geforderten Parametern aufrufen.
Dafür erzeugt das Framework sogenannte Dummies:
Für jeden nicht angegebenen Konstruktorparameter wird automatisch ein Objekt eingesetzt, das den passenden Typ hat und nichts tut.
Auf das Konzept der Dummies kann überall zurückgegriffen werden, wo ein Objekt eines bestimmten Typs benötigt wird, dessen Verhalten egal ist.
Mit `A.CollectionOfDummy<T>(count)` kann sogar eine Liste mit untätigen Fakes gefüllt werden.

Ob die echte Implementierung einer virtuellen Methode aufgerufen wird, kann bei der Konfiguration mit der Option `Strict` festgelegt werden.
Ein strikter Mock ruft nur Basismethoden auf, die ausdrücklich mit `CallsBaseMethods` freigegeben wurden.

## Performance

In der täglichen Arbeit fällt auf, dass Moq bei umfangreichen Tests langsamer wird.
Das Ausmaß des Performance-Einbruchs lässt sich mit einem einfachen Lasttest abschätzen:

* Ein Interface hat 50 Methoden, jede nimmt einen `int` an und gibt einen zurück.
* Ein Unit-Test erstellt einen Fake für das Interface mit 50 identischen Methoden, die den Parameter wieder ausgeben, dann ruft er jede dieser Methoden 100 Mal auf.
* Eine Stopwatch schreibt die Millisekunden für den Aufbau und jeden einzelnen Call mit.

![Zeit pro Call](/assets/images/posts/mock-frameworks/mock-frameworks.png)

Bei allen Durchläufen stieg die Dauer pro Call mit der Anzahl vorheriger Calls an.
Die Abbildung veranschaulicht die Verläufe pro Framework.
Bei NSubstitute zeigt die Dauer pro Call einer konstanter Steigungsfaktor von harmlosen 0,008.
FakeItEasy pendelt sich nach einer Aufwärmzeit bei einem Steigungsfaktor von 0,01 ein.
Moq hingegen tanzt aus der Reihe:
Bei sehr wenigen Calls arbeitet das Framework noch so zügig wie NSubstitute, ab ca. 1000 Methodenaufrufen eskaliert die Zeit pro Call jedoch.
Dies zeigt sich in einer Steigerung der Aufrufzeit um den Faktor 0,03.
Das heißt, die Performance skaliert über längere Unit-Tests dreimal schlechter als die anderer Mocking-Frameworks.

# Beispiele

Um die theoretischen Betrachtungen abzurunden, folgt hier für jedes Framework ein kurzes Beispiel.
Darin wird jeweils dieselbe Schnittstelle `IAddressBook` so gemockt, dass die Suche ein zur Eingabe passendes Ergebnis simuliert, ohne dass ein echtes Adressbuch verfügbar sein muss.
Anschließend werden die erwarteten Aufrufe verifiziert.

## Listing 1: Moq

```csharp
public void Moq_AddressBook_Should_Find_Person()
{
  var addressBook = new Mock<IAddressBook>();
  var setup = mock.Setup(
              x => x.FindPerson(It.IsAny<string>(), It.IsAny<int?>()))
              .Returns((string name, int? age) =>
                new Person {
                    Name = name,
                    Age = age });
  var testResult = addressBook.Object.FindPerson("Kay", 42);
  mock.Verify(x => x.FindPerson("Kay", 42));
}
```

## Lising 2: NSubstitute

```csharp
public void NSubstitute_AddressBook_Should_Find_Person()
{
  var addressBook = Substitute.For<IAddressBook>();
  addressBook.FindPerson(Arg.Any<string>(), Arg.Any<int?>())
             .Returns(callInfo => 
               new Person {
                 Name = callInfo.ArgAt<string>(0),
                 Age = callInfo.ArgAt<int?>(1) });
  var testResult = addressBook.FindPerson("Kay", 42);
  addressBook.Received().FindPerson("Kay", 42);
}
```

## Listing 3: FakeItEasy

```csharp
public void FakeItEasy_AddressBook_Should_Find_Person()
{

  var addressBook = A.Fake<IAddressBook>();
  A.CallTo(() => addressBook.FindPerson(A<string>.Ignored, A<int?>.Ignored))
                .ReturnsLazily((string name, int? age) =>
                  new Person {
                    Name = name,
                    Age = age });
  var testResult = addressBook.FindPerson("Kay", 42);
  A.CallTo(() => addressBook.FindPerson("Kay", 42)).MustHaveHappened();
}
```

# Fazit

Insgesamt macht NSubstitute den solidesten Eindruck.
Alle häufig benötigten Features sind vorhanden, der Testaufbau über Extensions ergibt leicht lesbaren Code.
Zur Laufzeit überzeugt die Geschwindigkeit.

Bei FakeItEasy wird der Testaufbau dadurch unleserlich, dass jede Zeile mit "A.CallTo" beginnt.
Im Gegenzug ist der Zugriff auf Funktionsargumente schöner gelöst.
Ein Spezialgebiet von FakeItEasy ist die gute Unterstützung von Fakes konkreter Klassen.
Wenn teils Originalcode getestet werden soll, sind die Dummies eine große Hilfe.

Der Einsatz von Moq erscheint nur in Projekten sinnvoll, in denen jeder Mock nach einem sehr kurzen Test verworfen wird.
Darauf ist auch die alternative LINQ-Syntax abgestimmt:
Kurze Stubs lassen sich damit kompakt definieren.
Da Moq zu den ältesten Mocking-Frameworks gehört, wird es in vielen Legacy-Projekten eingesetzt.
Bei der Überarbeitung alter Tests lohnt sich gegebenenfalls der Austausch gegen ein moderneres Framework.