---
layout:			[post, post-xml]											# Pflichtfeld. Nicht ändern!
title:			"Specification by Example"	# Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:			2021-10-17 12:00											# Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 	2021-10-17 12:00											# Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author_ids:			[unexist]												    # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: 	[Softwareentwicklung]										# Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags:			[Testing, BDD, Cucumber, FitNesse, Concordion]				# Bitte auf Großschreibung achten.
---

**Knowledge Sharing** ist eines der Kernprobleme unserer Branche und zentraler Bestandteil vieler moderner Methodiken
der Softwareentwicklung.
**Specifications by Example** als Vorgehen kann hierbei unterstützen und bietet einen Rahmen, um eine gemeinsame
Wissensbasis zu schaffen, Randfälle durch Tests im Vorfeld zu beschreiben und als Ergebnis eine lebende Spezifikation
zu erstellen.

# Specification by Example

In diesem Artikel beschäftigen wir uns zuerst mit der Grundidee von Akzeptanztests, ihrer unterstützenden Funktion
und der Idee der lebenden Spezifikation.
Anschließend untersuchen wir drei Tools und sehen anhand von einfachen Beispielen, wie man sie in der Praxis einsetzen
kann und sprechen über ihre Vorzüge und Schwächen.

Was genau sind also Akzeptanztests?

## Akzeptanztests

Wenn wir [Wikipedia][14] dazu befragen bekommen wir eine sehr allgemeine Antwort:
Akzeptanztests sind demnach also Abnahmetests, die vom Benutzer oder von einem entsprechenden Fachexperten durchgeführt
werden **nachdem** die Software erstellt wurde und dienen zur Überprüfung, ob eine Software ordnungsgemäß funktioniert
und zur Vermeidung von Regression.

Wie das bei allgemeinen Antworten so üblich ist, findet man auch hier interessante Lücken:
**Wer schreibt diese Tests und vor allem wann?**

Wenn man sich Projekte ansieht, ist die Erwartung, sowohl in Teamstrukturen nach [Conway][4] als auch bei
cross-funktionalen Teams, dass diese Art von Tests vom Testteam geschrieben und durchgeführt werden.
Und das erfolgt entweder parallel zur Entwicklung oder in irgendeinem nachgelagerten Prozess.

Findet hierbei jetzt irgendein Austausch statt?

## Knowledge Sharing

In der Praxis findet dabei dann allenfalls irgendeine Form der Kommunikation statt, sobald Probleme auftreten und
etwas nicht wie erwartet funktioniert, eine Fehlerklasse gänzlich übersehen wurde oder aufgrund der konkreten Umsetzung
neue Fehlerfälle entstehen.

Hier wäre es jetzt von Vorteil, wenn man die Sicht beider Gruppen einfängt:
Das Entwicklungsteam betrachtet die Software von seiner technischen Seite und versucht, alle ihm bekannten Probleme im
Vorfeld zu berücksichtigen und zu verhindern.
Das Testteam nutzt seine Kenntnis des Produktes, Erfahrungen allgemein beim Testen von Software und natürlich
Testheuristiken, um Fehler aufzuspüren.

Wie so oft in unserer Branche ist Kommunikation der Schlüssel für dieses Problem:
Setzen sich beide Teams gemeinsam an einen Tisch, um im Vorfeld über mögliche Probleme zu sprechen, könnten
aufwändige Nacharbeiten begrenzt und die Abläufe beschleunigt werden.

## Three Amigos

**Three Amigos** oder **Specification Workshop** ist ein Format, um genau dieses Vorgehen zu ermöglichen:
Wenn ein neues Feature geplant wird, kommen der beauftragende **Stakeholder**, ein Verantwortlicher aus dem
**Entwicklungsteam** und ein Verantwortlicher aus dem **Testteam** zusammen und besprechen, *was* und vor allem *wie*
dies umgesetzt werden soll und wie später überprüft werden kann, dass die Aufgabe abgeschlossen wurde.

Hierbei ist dieses Format vollkommen offen, mögliche Ergebnisse können einfache Notizen (beispielsweise an der
Userstory im agilen Feld) oder komplette Tabellen mit konkreten Randbedingungen sein.
Wichtigstes Element hier ist die Kommunikation und das im Gespräch entstehende gemeinsame Verständnis der Aufgabe der
Beteiligten.

Im nächsten Teil sehen wir uns drei verschiedene Tools an, die hierbei unterstützen können und von denen ein wenig
die weiteren Schritte abhängen.

# Tools

Die nächsten Beispiele zeigen anhand eines konkreten Testfalls an einer einfachen Todo-App (auf Basis von
[Quarkus][12]) wie Todo-Einträge erzeugt und die hier vorgestellten Tools verwendet werden können.

Die Todo-App selbst bietet eine einfache REST-Schnittstelle, über die sie u.a. Daten entgegennimmt und in-memory
persistiert.

Sämtliche Beispiele können im folgenden Repository eingesehen werden:

<https://github.com/unexist/showcase-acceptance-testing-quarkus>

## Cucumber

### Einleitung

Als erstes Tool wollen wir uns [Cucumber][5] ansehen, welches vermutlich das bekannteste zum Thema
[Behavior-Driven Development][1] (kurz **BDD**) ist.
[Cucumber][5] verwendet ein leicht verständliches [given-when-then][16]-Format (ursprünglich von [Dan North][6]
entwickelt) namens [Gherkin][9], um strukturierte Testfälle zu schreiben und sukzessive eine
[Domain-Specific Language][7] für die Fachdomäne zu entwickeln.

Hierbei ist die Ähnlichkeit zwischen [given-when-then][16] und dem von [Connextra][3] geprägten Format kein Zufall:
Die Grundidee hier ist, es soll so einfach wie möglich sein, die eine Form in die andere zu übertragen.

[Gherkin][9] selbst bietet [zahlreiche Möglichkeiten][18] und ist alleine dadurch schon einen eigenen Blogpost wert,
daher beschränken wir uns hier auf die verwendeten Grundbefehle.
Im folgenden Beispiel kann man schön sehen wie ein Testfall (oder **Feature**) aufgebaut ist:

### Beispiel

```gherkin
Feature: Create a todo
  Create various todo entries to test the endpoint.

  Scenario Outline: Create a todo with title and description and check the id.
    Given I create a todo with the title "<title>"
    And the description "<description>"
    Then its id should be <id>

    Examples:
      | title  | description  | id |
      | title1 | description1 | 1  |
      | title2 | description2 | 2  |
```

Im oberen Teil wird zunächst der allgemeine Testfall beschrieben und anschließend in einem konkreten Szenario noch
einmal eingegrenzt.
Darauf folgt die Beschreibung des eigentlichen Szenarios samt Tabelle mit Beispielen, welche jetzt definierte
Randbedingungen aus einem vorherigen **Specification Workshop** sein könnten.
Hierbei wird bewusst auf natürliche Sprache gesetzt und es stehen Bindings für [weitere Sprachen][17] zur Verfügung.

Nachdem die Features und Szenarien definiert wurden muss noch der entsprechende _Glue Code_ in Form von **Stepfiles**
ergänzt werden, einen Auszug daraus sehen wir uns hier an:

```java
public class TodoSteps {
    @Given("I create a todo with the title {string}")
    public void given_set_title(String title) {
        this.todoBase.setTitle(title);
    }

    @And("the description {string}")
    public void and_set_description(String description) {
        this.todoBase.setDescription(description);
    }
}
```

Hier bieten die [Java Bindings][10] hilfreiche Annotationen, mit denen ein Matching über reguläre Ausdrücke leicht von
der Hand geht.

Nach einem Testdurchlauf sieht man dann u.a. folgende Ausgabe:

```gherkin
Scenario Outline: Create a todo with title and description and check the id. # src/test/resources/features/todo.feature:11
  Given I create a todo with the title "title1"                              # dev.unexist.showcase.todo.domain.todo.TodoSteps.given_set_title(java.lang.String)
  And the description "description1"                                         # dev.unexist.showcase.todo.domain.todo.TodoSteps.and_set_description(java.lang.String)
  Then its id should be 1                                                    # dev.unexist.showcase.todo.domain.todo.TodoSteps.then_get_id(int)
```

Neben dieser reinen Textausgabe beim Build bietet [Cucumber][5] die Möglichkeit, mittels [externer Tools][15]
weitere Reports zu erzeugen oder **optional** einen Standardreport über <https://reports.cucumber.io> online einzusehen:

![image](/assets/images/posts/specification-by-example/cucumber-shell.png)

![image](/assets/images/posts/specification-by-example/cucumber-report-online.png)

### Zusammenfassung

1. Testfälle werden in [Cucumber][5] in natürlicher Sprache geschrieben.
2. Es können Tabellen verwendet werden, um Testdaten für die Szenarien bereitzustellen.
3. Abseits der Textausgabe eines Builds können weitere Reports gesondert erstellt werden.

Als nächstes Tool sehen wir uns [FitNesse][8] an, welches einen etwas anderen Weg geht.

## FitNesse

### Einleitung

Beim vorherigen Tool haben wir gesehen, wie mittels Tabellen und einer [Domain-Specific Language][7] Szenarien
beschrieben und durch Reporting Ergebnisse auch für die Businessseite aufbereitet werden können.

[FitNesse][8] geht hierbei einen anderen Weg und bietet ebenfalls wie [Cucumber][5] datengestützte Tests
an, allerdings werden diese in einer eigenen [Wikiengine][13] angezeigt und können auch dort direkt im Browser
ausgeführt werden:

![image](/assets/images/posts/specification-by-example/fitnesse_wiki_before.png)

Natürlich ist es auch möglich, diese Tests _headless_ ohne Browser in einer Pipeline auszuführen:

```shell
$ java -jar lib/fitnesse.jar -c "FrontPage?suite&suiteFilter=MustBeGreen&format=text"
```

Uns sollte der Testfall ja mittlerweile vertraut sein, daher springen wir direkt zum Beispiel.

### Beispiel

Der Quelltext der Wikiseite sieht dann so aus:

```asc
!1 Create a todo

----
!contents -R2 -g -p -f -h

|import|
|dev.unexist.showcase.todo.domain.todo|

Create various todo entries to test the endpoint.

!|Todo Endpoint Fitnesse Fixture |
| title   | description   | id?  |
| title1  | description1  | 1    |
| title2  | description2  | 2    |
```

Hier wird neben Befehlen für die Wahl der Testengine und Formatierung der Inhalte, die wir jetzt außen vor lassen,
zunächst der Pfad für die Imports festgelegt und anschließend werden wie auch bei [Cucumber][5] die Testdaten
tabellarisch aufgeführt.

```java
public class TodoEndpointFitnesseFixture {
    private TodoBase todoBase;
    private RequestSpecification requestSpec;

    public void setTitle(String title) {
        this.todoBase.setTitle(title);
    }

    public int id() {
        String location = given(this.requestSpec)
            .when()
                .body(this.todoBase)
                .post("/todo")
            .then()
                .statusCode(201)
            .and()
                .extract().header("location");

        return Integer.parseInt(location.substring(location.lastIndexOf("/") + 1));
    }
}
```

[FitNesse][8] greift im Testlauf direkt auf die Methoden des **Fixtures** zu:
Somit wird aus der Spalte **title** ein Aufruf des Getters `getTitle` und analog dazu sorgt die Spalte **id** für
einen Aufruf des Setters `id`.

Im Browser selbst kann dann mittels Klick auf **Test** der Test gestartet werden und die Elemente der Seite werden
je nach Testergebnis dann farblich hervorgehoben:

![image](/assets/images/posts/specification-by-example/fitnesse_wiki_after.png)

### Zusammenfassung

1. [FitNesse][8] verwendet ein eigenes Wiki für die Testfälle und bietet die Möglichkeit, diese auch direkt dort
auszuführen.
2. Wie auch bei [Cucumber][5] werden Tabellen eingesetzt, um Testdaten für die Szenarien bereitzustellen.
3. Eine Übersicht über Testläufe kann direkt im Wiki erfolgen und bietet so eine einfache Möglichkeit für die
Businessseite, den Status einzusehen.

Und zuletzt widmen wir uns jetzt [Concordion][2], welches [Markdown][11] einsetzt, um Testfälle und Reports zu
erzeugen.

## Concordion

### Einleitung

Im Grunde sehen wir hier bekanntes Vorgehen, wie auch bei den Vorgängern ist es bei [Concordion][2] möglich, Tests
in einem Dokument zu beschreiben und Daten in Form von Tabellen zu hinterlegen.
Der erwähnenswerte Unterschied hier ist, es wird [Markdown][11] als _Glue Code_ eingesetzt, um die Verbindung zwischen
Testfall und **Fixture** herzustellen.

Das ganze ist einfacher gezeigt als erklärt, daher springen wir direkt zum Beispiel.

### Beispiel

```markdown
# Create a todo

This is an example specification, that demonstrates how to facilitate markdown
and [Concordion](https://concordion.org) fixtures.

### [Simple example](- "simple_example")

A todo is [created](- "#result = create(#title, #description)") with the simple
title **[test](- "#title")** and the matching description
**[test](- "#description")** and [saved](- "#result = save(#result)") as ID
[1](- "?=#result.getId").
```

Auf den ersten Blick mag einen das jetzt erschlagen, allerdings findet man sich mit ein wenig [Markdown][11]-Kenntnis
schnell zu recht.
Der interessante Teil ist hierbei die Verwendung von Links:

- Mittels `#title` können in [Concordion][2] Variablen gesetzt werden, in diesem Fall die Variable `title`.
- Verwendet man dabei ein Gleichheitszeichen wie bei `#result = #title`, erzeugt man eine Zuweisung.
- Lässt man alles davon weg wie bei `create`, wird diese Methode des **Fixtures** aufgerufen.
- Und beginnt man mit einem Fragezeichen wie bei `?=#result`, wird ein _AssertEquals_ aufgerufen.

Im obigen Beispiel nutzen wir wieder den ersten Testfall und wollen lediglich ein Todo mit **title** und
**description** angelegen, dies sieht im **Fixture** dann so aus:

```java
@RunWith(ConcordionRunner.class)
public class TodoConcordionFixture {
    public TodoBase create(final String title, final String description) {
        TodoBase base = new Todo();

        base.setTitle(title);
        base.setDescription(description);

        return base;
    }
}
```

Startet man den Testlauf, wird ein Report erzeugt, der in etwa so aussieht:

![image](/assets/images/posts/specification-by-example/concordion_simple_test.png)

Jetzt sind die ganzen _inline_ Links relativ komplex und werden schnell unübersichtlich, daher ist es ebenfalls
möglich die alternative Schreibweise von Links in [Markdown][11] zu verwenden:

```markdown
### [Simple example with different notation](- "simple_example_modified")

A todo is [created][createdCmd] with the simple title **[test](- "#title")** and
the matching description **[test](- "#description")** and [saved][savedCmd]
as ID [1](- "?=#result.getId").

[createdCmd]: - "#result = create(#title, #description)"
[savedCmd]: - "#result = save(#result)"
```

![image](/assets/images/posts/specification-by-example/concordion_simple_test_modified.png)

Und abschließend dazu sind natürlich ebenfalls Tabellen in [Concordion][2] möglich:

```markdown
### [Simple table example](- "simple_table")

This example creates todos based on table values:

| [createAndSave][][Title][title] | [Description][description] | [ID][id] |
| ------------------------------- | -------------------------- | -------- |
| title1                          | description1               | 3        |
| title2                          | description2               | 4        |

[createAndSave]: - "#result = createAndSave(#title,#description)"
[title]: - "#title"
[description]: - "#description"
[id]: - "?=#result.getId"
```

Hierbei müssen dann auch lediglich die Spaltennamen mit der Logik versehen werden, sodass die Tabellen selbst
relativ übersichtlich bleiben:

![image](/assets/images/posts/specification-by-example/concordion_table_test.png)

### Zusammenfassung

1. Hier ist der wesentliche Unterschied die Form, in der die Testfälle geschrieben werden.
2. Neben Tabellen können hier auch einzelne Werte direkt eingesetzt und im Testszenario flexibel verwendet werden.
3. Die Ausgabe des Testlaufs ist die generierte Seite, die mittels [Markdown][11] beschrieben wurde.

# Fazit

Die Grundidee bei **Specification by Example** ist, ein Dokument zu erzeugen, welches neben reinen Testdaten auch
Kontext und wichtige Randbedingungen liefert und bei Änderungen gepflegt bzw. überarbeitet wird.
Diese _lebende_ Dokumentation kann dann Testpläne und auch Tickets überdauern, sodass auch später noch verständlich
ist, worum es dabei geht.

Ein weiterer wichtiger Aspekt ist der Austausch der beteiligten Rollen, die im Rahmen dieser Workshops zusammenkommen
und im **Vorfeld** ein gemeinsames Verständnis schaffen.
Die im Artikel vorgestellten Tools können zusätzlich dabei unterstützen und sowohl Ergebnisse als auch Dokumentation
der Testläufe aufbereiten, sodass sie den richtigen Personen zielgruppengerecht zur Verfügung gestellt werden können.

[1]: https://en.wikipedia.org/wiki/Behavior-driven_development
[2]: https://concordion.org/
[3]: https://www.oreilly.com/library/view/user-experience-mapping/9781787123502/92d21fe3-a741-49ff-8200-25abf18c98d0.xhtml
[4]: https://en.wikipedia.org/wiki/Conway%27s_law
[5]: https://cucumber.io
[6]: https://dannorth.net/
[7]: https://en.wikipedia.org/wiki/Domain-specific_language
[8]: http://fitnesse.org/
[9]: https://cucumber.io/docs/gherkin/
[10]: https://cucumber.io/docs/installation/java/
[11]: https://daringfireball.net/projects/markdown/syntax
[12]: https://quarkus.io/
[13]: https://en.wikipedia.org/wiki/Wiki_software
[14]: https://en.wikipedia.org/wiki/Acceptance_testing
[15]: https://cucumber.io/docs/cucumber/reporting/
[16]: https://en.wikipedia.org/wiki/Given-When-Then
[17]: https://cucumber.io/docs/gherkin/languages/
[18]: https://cucumber.io/docs/gherkin/reference