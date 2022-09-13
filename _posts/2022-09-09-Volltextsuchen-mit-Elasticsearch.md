---
layout: [post, post-xml]                      # Pflichtfeld. Nicht ändern!
title:  "Volltextsuchen mit Elasticsearch"    # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2022-09-09 12:00                      # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2022-09-09 12:00               # Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author_ids: [sypste]                          # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesen Namen geben.
categories: [Softwareentwicklung]             # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Open Source, REST, Elasticsearch]      # Bitte auf Großschreibung achten.
---

<!-- Teaser Text -->
In diesem Artikel entwickeln wir mit wenigen Mitteln eine performante und feature-reiche Volltextsuche.
In diesem Beitrag zeige ich euch, wie ihr auf Basis der Open-Source-Software Elasticsearch textbasierte Daten speichert, indiziert und für menschliche User einfach durchsuchbar gestalten könnt.
Dazu deployen wir eine Instanz des Webservices Elasticsearch, indizieren Beispieldaten und entwickeln mithilfe der Bordmittel von Elasticsearch eine an beliebiger Stelle wiederverwendbare Suche.
Dazu benötigt ihr lediglich einen Browser und einen GitHub-Account:
Den gesamten Code findet ihr in [GitHub](https://github.com/sypste/elasticsearch-demo) und ihr könnt alles schnell bei [GitPod](https://gitpod.io/) deployen und ausprobieren[^1].

[^1]: Dazu einfach das Template-Repo nutzen, um ein persönliches Repo zu erstellen, den Link zum Repo benutzen, um über das GitPod-Dashboard einen Workspace zu erstellen und anschließend zu öffnen. Das Setup wird für euch automatisch ausgeführt und die Code-Beispiele funktionieren out-of-the-box.

# Volltextsuchen mit Elasticsearch

<!-- Motivieren -->
Jedes Mal, wenn ich meinen Browser öffne, sehe ich als Erstes eine Suchmaschine meiner Wahl.
Und das mit gutem Grund:
Immerhin ist das Internet sehr groß und die Informationen, die ich alltäglich brauche, sind in der Regel nicht alleine auf den wenigen Seiten zu finden, deren URLs ich selbständig ansteuern kann.
Stattdessen verlasse ich mich auf Suchmaschinen, um für meine Fragen relevante Ergebnisse zu finden.
Dabei bedienen sich moderne Search Engines vielerlei Strategien und Algorithmen:
Vom einfachen Zählen einiger Schlüsselwörter im Quelltext statischer Seiten über die Gewichtung der Verlinkungen zu anderen Online-Ressourcen bis hin zu KI-gestützten Methoden, um beispielsweise anhand meines bisherigen Nutzerverhaltens häufig benutzte Seiten höher zu bewerten.
All das, um mir innerhalb weniger Millisekunden ausreichend zufriedenstellende Suchergebnisse liefern zu können, sodass ich auch beim nächsten Mal wieder die gleiche Suchmaske öffne[^2].

Nun ist es allerdings nicht in jedem Fall erforderlich, mit Kanonen auf Spatzen zu schießen und KI-gestützte Verfahren einzuführen, wo clevere Algorithmen und Datenhaltung ausreichen.
In diesem Bereich spielt Elasticsearch seine Stärken aus, da die Speicherung großer Datenmengen von strukturiertem und unstrukturiertem Text durch die Verwendung des Inverted Index-Konzept gelöst wird:
Neu zu hinterlegender Text wird in der Ingest-Phase nach konfigurierten Prinzipien analysiert, um in der Query-Phase die zu Sucheingaben passenden Ergebnisse direkt bereitstellen zu können.
Standardmäßig werden Texte/Strings sowohl als Typ `text` als auch als `keyword` indiziert.
Texte werden in Token umwandelt und je zugehöriger Document ID hinterlegt, was in allgemeinen Anwendungsfällen und für Aggregationen gut funktioniert.
Die Standard-Features stoßen jedoch an Grenzen, sobald Tippfehler, ein Google-ähnliches Suchgefühl oder eine domänenspezifische Normalisierung ins Spiel kommen.
Bei der Umsetzung dieser Anforderung hilfreiche Features schauen wir uns nach und nach an.

[^2]: Das Geschäftsmodell der Firmen, die ihre Suchmaschinen kostenlos zur Verfügung stellen, ist nicht Gegenstand dieses Beitrags.

## Analytische Features

Um einen Anwendungsfall für Volltextsuchen zu adressieren, der Typos toleriert, sprachlich normiert und eine Google-like Auto-completion verwendet, bietet Elasticsearch eine Reihe von Instrumenten, die einzeln oder in Kombination verwendet werden können, um Funktionsanfragen zu erfüllen und die Genauigkeit der Suchergebnisse zu verbessern.
Als Beispiel betrachten wir einen Fall, in dem ein User statt "Michael" einen Dreher einbaut und stattdessen nach "Micheal" sucht.
Wir werden als nächstes einige Funktionen untersuchen.

### Ngrams

Ngramme sind ein bekanntes Konzept in der Linguistik und der natürlichen Sprachverarbeitung (NLP).
Die Idee besteht darin, einzelne Wörter in eine Anzahl von Buchstabentoken mit einer definierten Minimal- und Maximallänge, z. B. 2 und 3, aufzuteilen.
Ein Wort, wie z. B. Länge, würde dann in Token mit einer maximalen Länge von drei aufgeteilt werden:

['lä', 'län', 'äng', 'nge', 'ge']

Allerdings werden die Ergebnisse sicherlich noch nicht das sein, was wir wollen.
Ngramm-Tokenizer ergeben nichts anderes, als Wörter in Token aufzuspalten, also sollten wir nicht überrascht sein, dass die Ergebnisse etwas zufällig erscheinen.
Schauen wir uns einmal die von "Micheal" abgeleiteten Ngramme an:

['mi', 'mic', 'ic', 'ich', 'ch', 'che', 'he', 'hea', 'ea', 'eal', 'al']

Obwohl einige Ngramme auch in der Tokenisierung von "Michael" auftauchen würden, gibt es nichts Besonderes an ihnen - eine Suche mit Elasticsearch wird einfach die Dokumente mit den meisten Übereinstimmungen in der Tokenliste liefern.
Im Allgemeinen braucht es ein wenig Test, Versuch und Irrtum, um die besten Minimal- und Maximalwerte für die Ngrammlänge zu finden (je länger, desto spezifischer die Treffer, aber weniger fehlertolerant).

### Search-as-you-type

Die ["Search-as-you-type"-Funktionalität](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-as-you-type.html) nutzt Ngramme auf eine etwas andere Art und Weise als bisher gezeigt.
Anstatt das gesamte Wort für die Tokenisierung zu betrachten, liegt der Fokus auf dem Anfang der Wörter, um eine schnelle Suchfunktion zu bieten, die Ergebnisse liefert, während der Benutzer die ersten Buchstaben eingibt.

    input = 'micheal'

    for i in range(2, len(input)):
        response = client.search(index='logstash-articles', size=100, query={
            "multi_match": {
                "query": input[:i],
                "type": "bool_prefix",
                "fields": [
                    "title.search_as_you_type",
                    "title.search_as_you_type._2gram",
                    "title.search_as_you_type._3gram",
                    "title.search_as_you_type._index_prefix"
                ]
            }},
            source=['title'],
        ).body
        print(f"Input "{input[:i]}" yields a total {response['hits']['total']['value']} results with titles {[r['_source']['title'] for r in response['hits']['hits']]}")

Während des Tippens wird die Ergebnismenge bereits eingegrenzt und sie könnte schon verwendet werden, um Benutzer zum gewünschten Suchergebnis zu leiten.

    Input "mi" yields a total 33 results with titles ['1974 United States Senate election in Missouri', '103 Mile Lake', 'Peter Milliman', 'Micropterix lambesiella', 'Middle nasal concha', 'Middletown, Indiana', 'Diving at the 2018 European Aquatics Championships – Mixed 3 m springboard synchro', 'Spring Fork, Missouri', '1968–69 Midland Football League', '1922 Minneapolis Marines season', 'Federico Millacet', 'Federal Ministry of Health (Germany)', 'Grand Haven, Michigan', 'Smock mill, Wolin', 'Kendriya Vidyalaya 9th Mile', '246th Mixed Brigade', 'Micellar solubilization', 'Michael Jordan', 'Mike Gallagher (political commentator)', 'Stephen V. R. Trowbridge (Michigan legislator)', 'The Dazzling Miss Davison', 'Ministry Trax! Box', 'Highway 25 Bridge (Minnesota)', 'Michael Paul Fleischer', 'Mikhail Makagonov', 'Mildred Ratcliffe', 'Jefferson County School District (Mississippi)', 'Michiyoshi', 'Midnattsrocken', 'Miguel Tavares (footballer)', 'Palfrey, West Midlands', 'John Miles (fl. 1404)', 'Marion, Mississippi']
    Input "mic" yields a total 7 results with titles ['Micropterix lambesiella', 'Grand Haven, Michigan', 'Micellar solubilization', 'Michael Jordan', 'Stephen V. R. Trowbridge (Michigan legislator)', 'Michael Paul Fleischer', 'Michiyoshi']
    Input "mich" yields a total 5 results with titles ['Grand Haven, Michigan', 'Michael Jordan', 'Stephen V. R. Trowbridge (Michigan legislator)', 'Michael Paul Fleischer', 'Michiyoshi']
    Input "miche" yields a total 0 results with titles []

Mit dieser Funktion werden Tippfehler zwar nicht behoben, aber bei aufmerksamer Eingabe des Nutzers eventuell vermieden oder eine schnellere Korrektur ermöglicht.

### Phonetische Analyse

Da es sich bei Elasticsearch um ein Open-Source-Projekt handelt, ist es nicht verwunderlich, dass Erweiterungen auf dem Projekt aufbauen, um Anwendungsfälle zu lösen.
Erweiterungen für Elasticsearch können die Form von [Plugins](https://www.elastic.co/guide/en/elasticsearch/plugins/current/intro.html) annehmen, die relativ einfach zu installieren sind.
Hier werfen wir einen Blick auf das Plugin für die phonetische Analyse, das es uns ermöglicht, phonetische Repräsentationen von Eingabetoken zu erhalten.

    client.indices.put_settings(
        index='logstash-articles',
        settings={
            'analysis': {
                'analyzer': {
                    'phonetic_analyzer': {
                        'tokenizer': 'standard',
                        'filter': [
                            'lowercase',
                            'beider_morse'
                        ]
                    }
                },
                'filter': {
                    'beider_morse': {
                        'type': 'phonetic',
                        'encoder': 'beider_morse',
                        'replace': False
                    }
                }
            }
        }
    )

Nachdem ein Analyzer definiert wurde, der den phonetischen Tokenfilter verwendet, kann natürliche Sprache in eine phonetische Repräsentation gebracht werden.
Diese ist abhängig vom gewählten Algorithmus und der Ausgangssprache, kann aber auch von Elastisearch geraten werden.
Um den Analyzer zu testen, vergleichen wir die Token, die jeweils aus der Analyse von "Michael" und "Micheal" hervorgehen.

    michael_phonetic_tokens = [t['token'] for t in client.indices.analyze(
        index='logstash-articles',
        text=['michael'],
        analyzer='phonetic_analyzer'
    ).body['tokens']]
    print('"Michael" yields:', michael_phonetic_tokens)
    "Michael" yields: ['mQxYl', 'mQxail', 'mQxoil', 'mitsDl', 'mitsail', 'mitsoil', 'mixDl', 'mixYl', 'mixail', 'mixoil']

    micheal_phonetic_tokens = [t['token'] for t in client.indices.analyze(
        index='logstash-articles',
        text=['micheal'],
        analyzer='phonetic_analyzer'
    ).body['tokens']]
    print('"Micheal" yields:', micheal_phonetic_tokens)
    "Micheal" yields: ['mDxDl', 'mDxal', 'mDxil', 'mQxDl', 'mQxal', 'mQxil', 'miDl', 'mikDl', 'mikal', 'mikial', 'mikil', 'mikiol', 'misDl', 'misal', 'misil', 'mitsDl', 'mitsal', 'mitsil', 'mixDl', 'mixal', 'mixial', 'mixil', 'mixiol']

    print('Overlap:', [t for t in michael_phonetic_tokens if t in micheal_phonetic_tokens])
    Overlap: ['mitsDl', 'mixDl']

Zufälligerweise können wir bereits feststellen, dass es eine Überschneidung in der phonetischen Darstellung zwischen "Michael" und "Micheal" gibt.
In diesem Fall würde die phonetische Umwandlung ausreichen, um den Tippfehler aus der Nutzereingabe zu beheben.
So sollten wir bereits einige Ergebnisse erhalten, die für eine Testnutzerbasis einigermaßen akzeptabel sein könnten.
Bisher haben wir uns jedoch darauf konzentriert, gute Datentypen zu finden, um die Daten, die wir abfragen wollen, vorzubereiten.
Die Abfragetypen, die wir bisher untersucht haben, sind jedoch recht einfach und nutzen die Query DSL von Elasticsearch nicht aus.

### Fuzziness

Fuzziness ist ein recht einfaches Konzept, das in vielen Arten von Abfragen, die in der [Elasticsearch Query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html) definiert sind, verfügbar ist.
Angewandt auf unser früheres Beispiel löst es das Problem, indem es die gesuchten Abfragebegriffe auf ähnliche Token erweitert, z. B. durch Ändern oder Entfernen eines Zeichens oder durch Vertauschen benachbarter Zeichen.

    client.search(index='logstash-articles', query={
        'match': {
            'title': {
                'query': 'micheal',
                'fuzziness': 1,
                'fuzzy_transpositions': True
            }
        }}
    ).body

Ein Nachteil von Fuzzy-Abfragen, auch wenn sie verlockend sind, sind ihre relativ hohen Rechenkosten, die die Ausführungszeit von Abfragen in größeren Datensätzen beeinträchtigen können und die Größe der Ergebnismenge erhöhen[^3].

[^3]: Siehe [Präzisions- und Recall-Problem](https://en.wikipedia.org/wiki/Precision_and_recall).

### Zusammengesetzte Abfragen

Es ist an der Zeit, mehrere Abfragen zu einer komplexeren Abfrage zusammenzufassen, die eine feinere Kontrolle über unsere Ergebnismenge und ihre Reihenfolge ermöglicht.
Ein sehr beliebter Typ dafür ist die boolesche Abfrage, die genau das tut, was der Name vermuten lässt:
Er kombiniert mehrere Abfragen zu einem booleschen Konstrukt (also _und_, _oder_, und _nicht_).

Jede boolesche Abfrage besteht aus bis zu vier Teilen:

    "bool": {
        "must": {}, // definieren, wie ein Ergebnis aussehen _muss_
        "filter": {}, // festlegen, wie ein Ergebnis aussehen _muss_ - aber keine positiven Ergebnisse bewerten (daher schneller und für die Zwischenspeicherung geeignet)
        "should": {}, // festlegen, wie ein Ergebnis aussehen _soll_ - wenn mehrere Abfragen definiert sind, reicht es aus, wenn eine übereinstimmt (es sei denn, das Minimum wird überschrieben)
        "must_not": {} // definieren, wie ein Ergebnis _nicht_ aussehen darf
    }

`must` und `filter` bilden also den _und_-Teil einer booleschen Abfrage, `should` den _oder_ und `must_not` den _nicht_-Teil ab.
Nun wenden wir diesen mehrschichtigen Ansatz bei unserer Abfrage an:

- Zunächst filtern wir nach allen Artikeln, die Ngramme enthalten, die mit dem Suchbegriff in einem der relevanten Felder, die wir bisher untersucht haben, in Verbindung stehen. Dies reduziert die Anzahl der Dokumente, die Elasticsearch während der Scoring-Phase berücksichtigen muss, und beschleunigt die Ausführungszeit der Abfrage, während keine in Frage kommenden Dokumente verworfen werden;
- Zweitens legen wir einen Basis-Score für alle Dokumente fest, die eine Fuzzy-Transposition des Suchbegriffs in denselben Feldern enthalten. Da wir die Anzahl der Kandidaten bereits reduziert haben, können wir uns einen ziemlich gierigen Ansatz mit einem erlaubten Bearbeitungsabstand von 2 leisten;
- Anschließend werden die Dokumente höher bewertet, die mit einer oder beiden übereinstimmenden Suchanfragen übereinstimmen, entweder mit einer phonetischen Äquivalenz oder einer direkten lexikalischen Übereinstimmung.

    client.search(index='logstash-articles', query={
        'bool': {
            'filter': [
                {
                    "multi_match": {
                        "query": "micheal",
                        'fields': [
                            'title.ngram',
                            'summary.ngram',
                            'content.ngram'
                        ]
                    }
                }
            ],
            'must': [
                {
                    "multi_match": {
                        "query": "micheal",
                        'fuzziness': 2,
                        'fuzzy_transpositions': True,
                        'fields': [
                            'title',
                            'summary',
                            'content'
                        ]
                    }
                }
            ],
            'should': [
                {
                    'match': {
                        'title.phonetic': {
                            'query': 'micheal'
                        }
                    }
                },
                {
                    'match': {
                        'title': {
                            'query': 'micheal'
                        }
                    }
                }
            ]
        }},
        highlight={'fields': {'title': {}, 'summary': {}, 'content': {}}},
        source=['title'],
    ).body

Jetzt haben wir eine Abfrage, die sich mehrere Textanalysefunktionen zunutze macht, bis zu einem gewissen Grad tolerant gegenüber Tippfehlern ist und mehrere relevante Felder durchsucht.
Um die Benutzerfreundlichkeit durch Vorschläge während der Eingabe zu verbessern, könnten wir die vorher verwendeten `search_as_you_type`-Felder weiter einbeziehen.

## Development & Advanced Features

Obwohl wir jetzt einen guten Ausgangspunkt haben, haben wir nur ein wenig an der Oberfläche der in Elasticsearch enthaltenen Textanalysetools gekratzt.
Um die Sache abzurunden, werfen wir einen kurzen Blick auf einige weitere Funktionen, die wir nutzen können, um unsere Queries nach und nach besser zu gestalten.

### Regression & Testing

Wie bereits erwähnt, bietet die Abfrage-DSL von Elasticsearch verschiedene Möglichkeiten, das Design der Abfrage an die Erwartungen des Benutzers anzupassen.
Um zu testen, ob eine angepasste Abfrage die erwarteten Ergebnisse liefert oder nicht, ist es eine gute Idee, eine Test-Suite zu erstellen, z.B. mit der [Ranking Evaluation API](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-rank-eval.html):
Damit können eine Reihe von Dokumenten definiert werden, die in Abhängigkeit von der Abfrage und ihren Parametern in der Suchergebnisliste erscheinen sollen oder nicht erscheinen sollen.
Dies ist besonders nützlich, wenn wir im ständigen Gespräch mit unseren Testern sind und unser Abfragedesign weiterentwickeln, aber auch das beibehalten wollen, was bisher gut funktioniert hat.

    POST logstash-articles/_rank_eval
    {
    "requests": [
        {
        "id": "micheal_query",
        "request": { // the request to be tested
        "query": { "match": { "title.phonetic": "micheal" } }
        },
        "ratings": [
            { "_index": "logstash-articles", "_id": "https://en.wikipedia.org/wiki/Michael_Jordan", "rating": 3 },
            { "_index": "logstash-articles", "_id": "https://en.wikipedia.org/wiki/Michael_Paul_Fleischer", "rating": 1 },
            { "_index": "logstash-articles", "_id": "https://en.wikipedia.org/wiki/Scheldeprijs", "rating": 0 }
            ]
        },
        {
        "id": "michael_query",
        "request": {
            "query": { "match": { "title": "michael" } }
        },
        "ratings": [
            { "_index": "logstash-articles", "_id": "https://en.wikipedia.org/wiki/Michael_Jordan", "rating": 3 }
            ]
        }
        ],
        "metric": {
        "precision": {
            "k": 20,
            "relevant_rating_threshold": 1,
            "ignore_unlabeled": false
        }
        }
    }

### Runtime fields

Eine weitere sehr nützliche Funktion für Entwicklungszwecke sind [`runtime_fields`](https://www.elastic.co/guide/en/elasticsearch/reference/current/runtime.html).
Normalerweise sollten die Felder eines Indexes, wie wir es bisher getan haben, vor der Aufnahme von Daten deklariert werden, d.h. bevor irgendwelche Daten in Elasticsearch geladen werden.
Alternativ können Felder zu einem bestehenden Index hinzugefügt werden, der dann aktualisiert wird, um die definierte Analyse an den Dokumenten durchzuführen, bis zu der das Feld nicht nutzbar ist.
`runtime_fields` erlauben einen anderen Ansatz: Der Wert des Feldes wird während der Laufzeit bestimmt, d.h. wenn die Daten bereits abgefragt oder analysiert werden.
Der Wert des `runtime_fields` kann durch Bereitstellung eines Skripts über die Such-API oder durch manuelles Hinzufügen über Kibana festgelegt werden.

    GET logstash-articles/_search
    {
        "runtime_mappings": {
            "#links": {
                "type": "long",
                "script": "emit(doc['links.keyword'].length);"
            }
        },
        "query": {
            "range": {
                "#links": {
                    "gte": 1000
                }
            }
        },
        "_source": ["title"]
    }

`runtime_fields` sind während der Entwicklung oder für Randanwendungen nützlich.
Sobald feststeht, dass ein Feld für den betrachteten Anwendungsfall nützlich ist, ist zu entscheiden, ob die Funktionalität während der Laufzeit gekapselt beibehalten oder in eine dauerhaftere gespeicherte Lösung umgewandelt werden soll - beides hat Vor- und Nachteile, zum einen hinsichtlich Speicherung, zum anderen hinsichtlich Ausführungsgeschwindigkeit.

### NLP

Zum Abschluss etwas Ausgefalleneres.
Wie bereits erwähnt, sind auch Plugins und Erweiterungen ein Teil des Elastic-Stacks.
[OpenNLP](https://opennlp.apache.org/) ist ein auf maschinellem Lernen (ML) basierendes Framework für die Verarbeitung von natürlichem Text und kann für verschiedene Aufgaben verwendet werden, unter anderem für die Erkennung von benannten Entitäten (NER).
Elasticsearch kann so konfiguriert werden, dass trainierte ML-Modelle geladen werden, um eine Analyse des eingelesenen Textes durchzuführen.
Dazu müssen zunächst das [Plugin](https://github.com/spinscale/elasticsearch-ingest-opennlp) und die erforderlichen ML-Modelle in Elasticsearch geladen werden, um anschließend eine Ingest-Pipeline zu definieren, die zu indizierenden Text um die gewünschten Annotationen erweitert.

    client.ingest.put_pipeline(
        id='opennlp-pipeline',
        processors=[
        {
          "opennlp" : {
            "field" : "text",
            "annotated_text_field" : "annotated_text"
          }
        }
      ]
    )

Die Einrichtungsschritte werden im oben genannten Gitpod-Workspace zur Verfügung gestellt, und die NER-Modelle können mit dem beschriebenen Code ausprobiert werden.
Hier als Beispiel die Liste der im Wikipedia-Artikel zu Michael Jordan erkannten Personen:

    'Condor', 'Sandro Miller', 'Marv Albert', 'Chris Mullin', 'Simon', 'Michael', 'Karl Malone', 'Jason Kidd', 'Story', 'Bryant', 'Harper San Francisco', 'Charles Oakley', 'Mark Vancil', 'Mike', 'James R . Jordan Sr .', 'Bob Knight', 'Russell Westbrook', 'Minor League Baseball', 'Ed Bradley', 'Jordan', 'John R . Wooden', 'Daniel Green', 'Ben', 'Rodman', 'Kobe Bryant', 'With Scottie Pippen', 'Ron Harper', 'Rod Strickland', 'After Jordan', 'Nick Anderson', "Shaquille O ' Neal", 'Stu Inman', 'Jordan Brand', 'Brand', 'Marcus', 'Sam Perkins', 'Wade', 'Babe Ruth', 'Rip " Hamilton', 'David L .', 'Kwame Brown', 'Jerry West', 'Jordan "', 'Abe Pollin', 'James Harden', 'Dean Smith', 'Abdul - Jabbar', 'Steve Alford', 'Jordan Rules', 'Derek Jeter', 'Richard Esquinas', 'Michael Jordan Celebrity Invitational', 'Bugs Bunny', 'Victoria', 'Jason Hehir', 'Travis Scott', 'David Steward', 'Larry Hughes', 'Johnson', 'James', 'David Thompson', 'George Shinn', 'Barack Obama', 'Jerry Reinsdorf', 'Dan Devine', 'Bob', 'Roy S . Johnson', 'Larry Martin Demery', 'Clyde Drexler', 'Knafel', 'David', 'Michael Jordan', 'Jordan Motorsports', 'Robert L . Johnson', 'Muhammad Ali', 'Citing Bowie', 'Spike Lee', 'Lee', 'Charles Barkley', 'Walter Iooss', 'Phil Jackson', 'Don Nelson', 'Gary Payton', 'Jason Whitlock', 'Ron Shelton', 'Larry Bird', 'Kevin Garnett', 'Vince Carter', 'Horace Grant', 'Michael Jackson', 'Russell', 'Clyde "', 'Daniel Sundheim', 'Isiah Thomas', 'George Floyd', 'Scottie Pippen', 'Mitchell', 'W . W . Norton', 'Sam Bowie', 'Kareem Abdul - Jabbar', 'Allen Iverson', 'Robert F . Smith', 'Sportswriter Wright Thompson', 'Larry Jordan', 'Patrick Ewing', 'James Jordan', 'Steve Kerr', 'George Postolos', 'Dwyane Wade', 'Thompson', 'LeBron James', 'Magic Johnson', 'Toni Kukoč', 'David Stern', 'Michael Jordan Career Retrospective', 'Irving J .', 'Malone', 'Brown', 'Sam Vincent', 'Doug Brady', 'Jordan Drive', 'Jack Hartman', 'Justin Jordan', 'Jasmine', 'Grant Hill', 'Adam Morrison', 'Dunk Contest', 'Glen Rice', 'Jerry Stackhouse', 'Mario Lemieux', 'Wayne Gretzky', 'Loyola Academy', 'Bryon Russell', 'John Paxson', 'Deloris', 'Penny Hardaway', 'James R . Jordan Jr .', 'Bill Russell', 'Bobby Simmons', 'Family Clinics', 'His', 'Willis Reed', 'Broadcaster Al Michaels', 'Despite Jordan', 'John Salmons', 'Luka Dončić', 'Gatorade', 'Subsequently', 'James Worthy', 'Mike "', 'Andrei S', 'Walter Davis', 'Doug Collins', 'Julius Erving . Larry Bird', 'David Falk', 'Doug Colling', 'Porter', 'Jeffrey', 'Walter', 'Jeffrey Jordan OLY', 'Roland', 'Dennis Rodman', 'Doc Rivers', 'Oprah Winfrey'

## Fazit

In diesem Artikel wurde gezeigt, wie auf Basis weniger Mittel eine Suchheuristik auf der Basis von Textanalyse und Query DSL innerhalb von Elasticsearch erfolgen kann.
Eingaben können mithilfe von Ngrammen und phonetischer Transformation fehlertoleranter gestaltet werden, sowie bereits während der Nutzereingabe (also unvollständiger Suchparameter) Vorschläge für Suchtreffer geliefert werden.
Mit Fuzzy Search und der Verbindung der erarbeiteten Suchheuristiken werden die erarbeiteten Suchheuristiken kombiniert, um eine mehrschichtige Suche zu designen, die sowohl schnell als auch fehlertolerant ist.
