---
layout: [post, post-xml]              # Pflichtfeld. Nicht ändern!
title:  "Blog Post Anleitung"         # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2017-08-10 10:25              # Pflichtfeld. Format "YYYY-MM-DD HH:MM".
modified_date: 2017-08-18             # Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author: johndoe                       # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: [Java, Microsoft, Methodik, Architektur, Softwareentwicklung, HR, Branchen] # Pflichtfeld. Mindestens eine der angegebenen Kategorien verwenden.
tags: [Spring, Microservices]         # Optional.
---

Wenn du das hier liest, bist du vermutlich daran interessiert einen Blog Post für den
adesso Blog zu schreiben. Wir haben versucht, den Prozess der Veröffentlichung eines Blog Posts
möglichst Entwickler-freundlich zu gestalten, indem wir Blog Posts wie Source Code behandeln.
Diese Anleitung beschreibt, was dafür zu tun ist. Es sollte aber nahe an dem sein, was du aus
deiner Erfahrung als Softwareentwickler bereits kennst :).

Sollte es noch fragen geben, kannst du dich an den Verteiler [devblog@adesso.de](mailto:devblog@adesso.de)
wenden.

# Einen Blog Post erstellen

Um loszulegen, erstelle einen Fork des [devblog](https://github.com/adessoAG/devblog) Repositories
und checke ihn lokal aus. Dann kannst du lokal einen Blog Post erstellen und ihn später als
Pull Request einreichen. Solltest du mit dem Pull Request Vorgehen nicht vertraut sein,
kannst du es im Abschnitt "GitHub Fork & Pull Prozess" weiter unten nachlesen.

Blog Posts werden im [Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)
Format erstellt. Du kannst dich an der Datei orientieren, in der diese Anleitung steht. Am besten
nimmst du die vorliegende Datei einfach als Template (wenn du dir diese Datei in der Github 
Weboberfläche anschaust, musst du vorher auf den "Raw"-Button klicken, um den Quelltext zu sehen).
Im folgenden sind einige Aspekte des Formats aber auch nochmal beschrieben.

## Dateiname und Ablageort

Alle Blog Posts müssen im Ordner `_posts` abgelegt werden und dem Namensschema
`YYYY-MM-DD-titel-des-blog-posts.md` folgen.

## Autoren-Informationen

Wenn du deinen ersten Blog Post schreibst, musst du in der Datei `_data/authors.yml` einen Eintrag
mit deinen Informationen wie im folgenden Codebeispiel hinterlegen. Als key nimmst du am besten
deinen GitHub Benutzernamen.

```yaml
johndoe:
  first_name: John
  last_name: Doe
  github_username: johndoe
  email: johndoe@email.com
  bio: "2-3 Sätze als Kurzbiographie, die als Beschreibung unter deinen Blog-Posts erscheinen."
  avatar_url: /assets/images/avatars/johndoe.png
  github: https://github.com/johndoe
```

## Metadaten

Jede Blog Post Markdown-Datei beginnt mit einem kurzen Abschnitt, in dem einige Metadaten enthalten
sind. Dieser Abschnitt ist mit `---` vom eigentlichen Inhalt getrennt und ist als YAML formatiert.
Hier sind einige Pflichtfelder auszufüllen. Schau dir einfach den Header dieser Datei als Beispiel
an.

## Teaser

Der erste Absatz (also alles bis zur ersten Leerzeile in der Markdown-Datei) wird als Teaser übernommen. Der erste Absatz
sollte also höchstens ein paar Sätze und keine Überschriften beinhalten.

## Überschriften

Es können bis zu 3 Überschriften-Ebenen genutzt werden:

```markdown
# Erste Ebene

## Zweite Ebene

### Dritte Ebene
```

## Syntax Highlighting

Markdown unterstützt Syntax-Highlighting. Für die Darstellung im Blog wird [PrismJS](http://prismjs.com/#languages-list)
eingesetzt, so dass du alle von PrismJS unterstützten Sprachen verwenden kannst. Beispiel für Java-Code:

```java
public class HelloWorld {
  public static final main(String[] args){
      System.out.println("Hello World");
  }
}
```

## Bilder

Um ein Bild zu verwenden, lege die Bild-Datei im Ordner `assets/images/posts/titel-deines-blog-posts` ab und
verlinke sie dann in der Markdown-Datei wie in diesem Beispiel:

![Logo der adesso AG](https://github.com/adessoAG/devblog/raw/master/assets/images/blog-post-guide/logo.png)

**Hinweis:** im Gegensatz zum Beispiel-Bild oben muss der Pfad zum Bild in einem Blog Post erst bei "assets" beginnen,
müsste also so aussehen: "assets/images/blog-post-guide/logo.png". Zur Veranschaulichung wurde im Beispiel der
absolute Pfad angegeben.

# GitHub Fork & Pull Workflow

Solltest du noch nicht mit Pull Requests und dem GitHub-Workflow vertraut sein, hilft dir die folgende
Anleitung weiter.

Um Änderungen am Source Code vorzunehmen, erzeugst du zunächst einen Fork dieses Repositories
über den "Fork"-Button in der GitHub Weboberfläche. Diesen Fork checkst du lokal aus (`git clone`) und machst
die Änderungen am Source Code. Die geänderten Dateien checkst du dann wieder in den Fork ein (`git commit` + `git push`).
Navigierst du im Browser in der GitHub Weboberfläche dann zu deinem Fork, wird dir ein Button angeboten, mit dem du einen Pull
Request erstellen kannst.

Die Änderungen in deinem Pull Request werden dann von einem Entwickler/Architekten-Kollegen gereviewed (wer das zentral macht
wird noch geklärt). Ggf. werden Korrekturwünsche als Kommentare
im Pull Request ergänzt, die du dann vornehmen und ebenfalls auf den Fork pushen kannst. Letztendlich
wird der Pull Request dann vom Reviewer in den Haupt-Branch gemergt und dann automatisch veröffentlicht.

**Hinweis:** die automatische Veröffentlichung auf dem adesso Blog startet vermutlich erst Ende September / Anfang Oktober. Bis
dahin könnt ihr aber gerne schon Blog Posts per Pull Request einreichen. Wir klären dann, ob sie schon vorher nach dem alten 
Verfahren veröffentlicht werden.

Detailliertere Informationen zu diesem Workflow sind hier zu finden:

* [GitHub Help](https://help.github.com/articles/about-pull-requests/)
* [GitHub Fork & Pull](https://reflectoring.io/github-fork-and-pull/)

# Technischer Hintergrund

Wenn dich interessiert, wie die Blog Posts aus einer Markdown-Datei im adesso Blog landen, kannst
du dir das Projekt [jekyll2cms](https://github.com/adessoAG/jekyll2cms) anschauen. Diese Anwendung
liest das Blog-Repository regelmäßig aus, prüft es auf Änderungen, transformiert die Markdown-Dateien
in ein XML-Format und legt diese XML wieder ab. Die XML-Dateien werden dann von einem Job im adesso
CMS ausgelesen und in den Blog integriert.
