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
Templates erzeugt werden oder manuell nachbearbeitet werden. Dieser Artikel zeigt, wie man die Open Source Bibliothek
"DocxStamper" nutzen kann, um auf Basis eines Templates aus Java-Code heraus ein Word-Dokument zu erzeugen.

# DocxStamper

DocxStamper ist eine Open Source Java-Bibliothek, die das .docx-Format mit der Spring Expression Language (SpEL)
verknüpft.

Die folgende Abbildung veranschaulicht die Arbeitsweise von DocxStamper.

TODO: Abbildung

Wir erstellen ein ganz normales .docx-Dokument, welches als Template dient. In diesem Template
verwenden wir SpEL-Expressions, um dynamische Inhalte zu definieren.

Im Java Code definieren wir eine Klasse, in der alle dynamischen Inhalte des Dokuments hinterlegt sind. Bei der Generierung
eines neuen Dokuments dient das Template zusammen mit dieser Kontext-Klasse als Input. Die SpEL-Expressions
werden dann gegen die Kontext-Klasse ausgewertet und das Ergebnis im neu erzeugten .docx-Dokument
ausgegeben.

Im Folgenden schauen wir uns einige Features von DocxStamper noch einmal etwas näher an. Wir gehen dabei von
der Anforderung aus, dass wir aus eine Java-Anwendung heraus einen Geschäftsbrief erzeugen möchten, der je nach
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

Der einfachste Anwendungsfall in so einem Brief ist das Ersetzen von Platzhaltern, z.B. in der Anrede.
Die Anrede in unserem Dokument soll so aussehen:

* "Sehr geehrte Frau Müller,", wenn es sich um eine Frau handelt, oder
* "Sehr geehrter Herr Müller,", wenn es sich um einen Mann handelt.

Alle anderen Anreden klammern wir mal aus, damit das Beispiel einfach bleibt.

Um die Anrede korrekt anzuzeigen, brauchen wir Informationen über das Geschlecht und den Nachnamen des Empfängers. Das bilden wir in einer
Klasse namens `Person` ab:

```java
public class Person {

	private String name;

	// Getter und Setter
}
```

Zusätzlich erstellen wir eine Context-Klasse, die später als Input für die Dokumentenerzeugung dient:

```java
public class BriefContext {

    private String anrede;

	private Person person;

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
context.setAnrede("Sehr geehrte Frau,")
Person empfaenger = new Person();
empfaenger.setName("Müller");

InputStream template = ...;  // InputStream, der auf unser Template zeigt
OutputStream out = ...;      // OutputStream, der auf das Ergebnis-Dokument zeigt
DocxStamper stamper =
  new DocxStamperConfiguration()
    .build();
stamper.stamp(template, context, out);
out.close();
```

Das Ergebnis ist ein Word-Dokument, das die Anrede "Sehr geehrte Frau Müller," beinhaltet.

# Bedingte Anzeige von Elementen

Man möchte die Anrede "Sehr geehrte Frau" bzw. "Sehr geehrter Herr" aber vermutlich gar nicht im Code
stehen haben. Eine Template-Engine ist schließlich dafür da, solche Text-Schnipsel vom Code in das Template
zu verschieben.

Eine Möglichkeit ist es, einfach beide Ausprägungen im Template vorzusehen, und je nach Geschlecht des
Empfängers einfach nur die eine oder die andere anzuzeigen.

DocxStamper erlaubt es, Elemente im .docx-Template mit Kommentaren zu versehen, in denen ebenfalls Expressions
genutzt werden können. Um einen Paragraphen nur unter einer bestimmten Bedingung anzuzeigen, wird
die Methode `displayParagraphIf` zur Verfügung gestellt.

Vorausgesetzt, wir ergänzen das Feld `gender` in der `Person`-Klasse und befüllen es
entpsrechend, können wir die Anrede auch mit dem
folgenden Template korrekt anzeigen:

![Anrede bedingt anzeigen](/assets/images/posts/docxstamper/anrede2.png)

Im Ergebnis-Dokument wird dann nur eine der beiden Anreden angezeigt und der Kommentar entfernt.

DocxStamper bietet noch weitere Methoden zur Nutzung in Kommentar-Expressions an, so zum Beispiel auch zur Wiederholung
von bestimmten Elementen.

# Elemente Wiederholen

Möchten wir z.B. eine Tabelle mit dynamischem Inhalt anzeigen, können wir Tabellenzeilen mit Hilfe der Methode
`repeatTableRow` wiederholen.



# Fazit