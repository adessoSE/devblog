---
layout: [post, post-xml]                            # Pflichtfeld. Nicht ändern!
title: "Troubleshooting open source NuGet package"  # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date: 2022-12-16 12:00                              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2022-12-16 12:00                     # Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author_ids: [vscherb]                               # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesen Namen geben.
categories: [Softwareentwicklung]                   # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [NuGet]                                       # Bitte auf Großschreibung achten.
---

For a project I decided to use the [libgit2](https://github.com/libgit2/libgit2sharp) library which, fortunately, has a port to C#.
When adding the NuGet package in the latest version `0.26.2` (release December 11, 2019) the program ran into a problem at runtime as the shared library cannot be loaded.

Let's explore the steps to find more about that error and the resulting actions to resolve that problem and continue on with the project.

First I will create a MVP to replicate the problem and explore further without the other dependencies of the project.
Then follow my process of resolving the problem and find a solution.

This happens on the machine with [Majaro x64](https://manjaro.org/) with [.Net 6](https://docs.microsoft.com/en-us/dotnet/core/whats-new/dotnet-6).
