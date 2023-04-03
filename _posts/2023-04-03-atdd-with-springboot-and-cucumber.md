
---
layout: [post, post-xml]                            # Pflichtfeld. Nicht ändern!
title:  "ATDD on Spring Boot with Cucumber"         # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2023-04-03 14:41                            # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen.
author_ids: [thalheim]                              # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesen Namen geben.
categories: [Softwareentwicklung]                   # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Spring Boot, Java, Cucumber, JUnit, ATDD]    # Bitte auf Großschreibung achten.
---

Developers know unit tests fairly well, even more integrative approaches like @SpringBootTest.
But many lack a clear design/development/test strategy and stick to their favorite programming language.
Acceptance Test Driven Design (ATDD) is a structured approach to design your tests and program outside in, keeping the focus on the larger function blocks instead of individual classes (e.g. test behavior, not classes).
This approach may benefit from abstracting the acceptance tests to a non-programming language like cucumber, allowing even non-programmers to write test scenarios which will eventually be executed automatically.
This article demonstrates this with a small testcase and a fully functional, little Spring Boot/Java project.

