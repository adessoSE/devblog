---
layout: [post, post-xml]
title:  "Word-Dokumente aus Templates erzeugen mit DocxStamper"
date:   2018-09-14 10:25
author: thombergs
categories: [Java]
tags: [docx, word]
---

Immer mal wieder stolpert man in Projekten über die Anforderung, Word-Dokumente programmatisch zu erzeugen.
PDF reicht in solchen Fällen oft als Dateiformat nicht aus, weil die Dokumente aus manuell erstellten
Templates erzeugt oder manuell nachbearbeitet werden. Dieser Artikel zeigt, wie man die Open Source Bibliothek
"DocxStamper" nutzen kann, um auf Basis eines Templates aus Java-Code heraus ein Word-Dokument zu erzeugen.

# DocxStamper

[DocxStamper](https://github.com/thombergs/docx-stamper) ist eine Open Source Java-Bibliothek, die das 
.docx-Format mit der Spring Expression Language (SpEL)
verknüpft. DocxStamper ist entstanden als Ergebnis von Kundenanforderungen, nachdem eine ausführliche Google-Suche keine
einfach zu benutzende Templating-Engine für .docx-Dokumente zu Tage brachte.

Die folgende Abbildung veranschaulicht die Arbeitsweise von DocxStamper.

![Funktionsweise von DocxStamper](/assets/images/posts/docxstamper/doxstamper.jpg)

Wir erstellen ein ganz normales .docx-Dokument, welches als Template dient. In diesem Template
verwenden wir SpEL-Expressions, um dynamische Inhalte zu definieren.

Im Java Code definieren wir eine Klasse, in der alle dynamischen Inhalte des Dokuments hinterlegt sind. Bei der Generierung
eines neuen Dokuments dient das Template zusammen mit dieser Kontext-Klasse als Input. Die SpEL-Expressions
werden dann gegen die Kontext-Klasse ausgewertet und das Ergebnis im neu erzeugten .docx-Dokument
ausgegeben.

Im Folgenden schauen wir uns einige Features von DocxStamper noch einmal etwas näher an. Wir gehen dabei von
der Anforderung aus, dass wir aus einer Java-Anwendung heraus einen Geschäftsbrief erzeugen möchten, der je nach
Empfänger etwas angepasst werden muss.

Um die Beispiele nachzuprogrammieren, muss die folgende Dependency im eigenen Projekt eingetragen werden (Maven-Notation):

```xml
<dependency>
    <groupId>org.wickedsource.docx-stamper</groupId>
    <artifactId>docx-stamper</artifactId>
    <version>1.3.0</version>
</dependency>
```

Die jeweils aktuellste Version kann im [Maven Central Repository](https://search.maven.org/search?q=g:org.wickedsource.docx-stamper%20AND%20a:docx-stamper&core=gav) abgerufen werden.

# Platzhalter Ersetzen

Der einfachste Anwendungsfall in so einem Brief ist das Ersetzen von Platzhaltern, zum Beispiel in der Anrede.
Die Anrede in unserem Dokument soll so aussehen:

* "Sehr geehrte Frau Müller,", wenn es sich um eine Frau handelt, oder
* "Sehr geehrter Herr Müller,", wenn es sich um einen Mann handelt.

Alle anderen Anreden klammern wir mal aus, damit das Beispiel einfach bleibt.

Um die Anrede korrekt anzuzeigen, brauchen wir zunächst Informationen über den Nachnamen des Empfängers. Das bilden wir in einer
Klasse namens `Person` ab:

```java
public class Person {

	private String name;

	// Getter und Setter
}
```

Zusätzlich erstellen wir eine Context-Klasse, die später als Input für die Dokumentenerzeugung dient und zusätzlich noch
die Anrede für die jeweilige Person enthält:

```java
public class BriefContext {

    private String anrede;

	private Person person;

	// Getter und Setter

}
```

In unserem .docx-Template können wir dann die folgende Expression verwenden, um die korrekte Anrede für einen Empfänger
zu erzeugen:

```
${anrede} ${person.name},

Hier steht der Text des Briefs ...
```

Mit dem folgenden Code können wir aus diesem Template dann ein Dokument für einen bestimmten Empfänger erzeugen:

```java
BriefContext context = new BriefContext();
Person empfaenger = new Person();
empfaenger.setName("Müller");
context.setAnrede("Sehr geehrte Frau,")
context.setPerson(empfaenger);

InputStream template = ...;  // InputStream, der auf unser Template zeigt
OutputStream out = ...;      // OutputStream, der auf das Ergebnis-Dokument zeigt
DocxStamper stamper =
  new DocxStamperConfiguration()
    .build();
stamper.stamp(template, context, out);
out.close();
```

Das Ergebnis ist ein Word-Dokument mit der Anrede "Sehr geehrte Frau Müller,".

# Bedingte Anzeige von Elementen

Man möchte die Anrede "Sehr geehrte Frau" bzw. "Sehr geehrter Herr" aber vermutlich gar nicht im Code
stehen haben. Eine Template-Engine ist schließlich dafür da solche Text-Schnipsel vom Code in das Template
zu verschieben.

Eine Möglichkeit ist es, einfach beide Ausprägungen im Template vorzusehen, und je nach Geschlecht des
Empfängers einfach nur die eine oder die andere anzuzeigen.

DocxStamper erlaubt es, Elemente im .docx-Template mit Kommentaren zu versehen, in denen ebenfalls Expressions
genutzt werden können. Um einen Paragraphen nur unter einer bestimmten Bedingung anzuzeigen, wird
die Expression-Methode `displayParagraphIf` zur Verfügung gestellt.

Vorausgesetzt, wir ergänzen das Feld `gender` in der `Person`-Klasse und befüllen es
entsprechend, können wir die Anrede auch mit dem
folgenden Template korrekt anzeigen:

![Anrede bedingt anzeigen](/assets/images/posts/docxstamper/anrede2.png)

Im Ergebnis-Dokument wird dann nur eine der beiden Anreden angezeigt und der Kommentar entfernt.

Etwas Vorsicht ist mit Anführungszeichen in den Kommentaren geboten, denn Word ersetzt Anführungszeichen automatisch
mit Zeichen, die nicht von der SpEL interpretiert werden können. Um dies zu verhindern, kopiert man diese Zeichen
einfach aus einem Texteditor in das Word-Dokument hinein.

DocxStamper bietet noch [weitere Methoden](https://github.com/thombergs/docx-stamper#conditional-display-and-repeating-of-elements)
zur Nutzung in Kommentar-Expressions an, so zum Beispiel auch zur Wiederholung
von bestimmten Elementen.

# Elemente Wiederholen

Ein weiterer häufiger Anwendungsfall einer Template-Engine ist es, Elemente zu wiederholen. Im nächsten Schritt erweitern wir unseren
Beispiel-Brief um eine Tabelle von Artikeln mit jeweils einem Preis (wie es z.B. für eine Rechnung notwendig wäre).

Um eine Liste von Artikeln anzuzeigen, benötigen wir zunächst eine Datenstruktur für Artikel:

```java
public class Article {

	private long number;

	private String name;

	private Money price;

	// Getter und Setter

}
```

Um die Artikel unserem Template zur Verfügung zu stellen, ergänzen wir die `BriefContext`-Klasse um eine Liste
von Artikeln:

```java
public class BriefContext {

	private Person person;

	private List<Article> articles;

	// Getter und Setter

}
```

Nun können wir ein `BriefContext`-Objekt mit einer Liste von Artikeln befüllen und im Template wie folgt eine
Tabelle anlegen, die einen Artikel pro Zeile auflistet:

![Tabellenzeilen wiederholen](/assets/images/posts/docxstamper/table.png)

# Datentypen Konvertieren

Im Beispiel mit der Artikelliste haben wir den selbstgebauten `Money`-Datentyp verwendet, um einen Geldbetrag
darzustellen. Platzhalter mit unbekannten Datentypen ersetzt DocxStamper standardmäßig mit dem Ergebnis
der `toString()`-Methode.

In unserem Fall möchten wir den Geldbetrag aber hübsch formatieren, so dass z.B. "47,11 €" angezeigt wird.
Um dies zu erreichen, können wir einen eigenen [TypeResolver](https://github.com/thombergs/docx-stamper#replacing-expressions-in-a-docx-template)
implementieren:

```java
public class MoneyTypeResolver extends AbstractToTextResolver<Money> {

    protected String resolveStringForObject(Money money) {
        // Money-Objekt in gewünschten String umwandeln...
    }

}
```

Diesen machen wir über die `DocxStamperConfiguration` bekannt:

```java
DocxStamper stamper = new DocxStamperConfiguration()
  .addTypeResolver(Money.class, new MoneyTypeResolver())
  .build();
```

Ist der DocxStamper so konfiguriert, werden alle `Money`-Werte entsprechend der Implementierung in `MoneyTypeResolver`
in Strings konvertiert.

# Zusammenfassung

DocxStamper ist eine Library, die grundsätzliche Templating-Features für .docx-Dokumente zur Verfügung stellt.

Sie ist konfigurierbar und erweiterbar, so dass die meisten Anforderungen an eine .docx-Template-Engine mit ihr
umgesetzt werden können.

Wenn du neugierig geworden bist, schau auf [Github](https://github.com/thombergs/docx-stamper) vorbei.

