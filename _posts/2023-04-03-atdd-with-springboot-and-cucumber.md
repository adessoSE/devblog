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

# Introduction: Getting Things Done

As a use case, I took David Allens Getting Things Done method (https://en.wikipedia.org/wiki/Getting_Things_Done):
> Getting Things Done (GTD) is a personal productivity system developed by David Allen and published in a book of the same name. 
> GTD is described as a time management system.
> Allen states "there is an inverse relationship between things on your mind and those things getting done".
> 
> The GTD method rests on the idea of moving all items of interest, relevant information, issues, tasks and projects out of one's mind by recording them externally and then breaking them into actionable work items with known time limits.
> This allows one's attention to focus on taking action on each task listed in an external record, instead of recalling them intuitively.

## First feature: Collect Thoughts

The first, very charming idea of GTD is to get everything that pops into your mind out of it into a safe place where it can be retrieved later for further processing. 
The idea is to think as little as possible about whatever came into your mind. 
It might be anything, from an item you need to put onto your grocery store list to an electric car business idea which might make you the second-richest person in the world.

The verbal description of the use-case is: 
A thought can be collected into your inbox. 
A thought is just a few words, a little text. 
At any time, it can be retrieved from the inbox.

## Defining acceptance test scenarios

Before even starting on our feature, let’s define the acceptance tests of our feature.

```
Feature: Capture Stage

  Scenario: Collect Thought
    When Thought "Send Birthday Wishes to Mike" is collected
    Then Inbox contains "Send Birthday Wishes to Mike"
```

Here, we let something magical happen! 
Instead of defining acceptance tests scenarios in the QA phase after implementing the feature, creating the acceptance happened before giving the implementation task to the developer. 
This is called “shift left” as the QA activity of defining acceptance scenarios is moved from the right (end) to the left (more in the beginning) of the process. 
This approach is very charming as it forces the requirements engineer to formulate a more concrete description of the feature and not just some rough idea presented in one or two sentences 
(no offence – this is the type of “laziness” that also developers display oftentimes).
