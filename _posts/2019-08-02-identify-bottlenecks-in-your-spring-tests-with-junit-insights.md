---
layout: [post, post-xml]              # Pflichtfeld. Nicht ändern!
title:  "Identify bottlenecks in your Spring Tests with JUnit Insights"         # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2019-08-02 10:25              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
author: florianluediger               # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: [Java]                    # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Spring, JUnit]                 # Bitte auf Großschreibung achten.
---

When developing a large software project, a low execution time of Unit Tests is crucial to guarantee a fast and efficient progression of the project.
This is especially true when utilizing continuous integration to automatically check code quality and correctness.
JUnit Insights helps you to identify the reasons behind long execution times of some of your software tests so you can optimize them easily.

# Why do my Spring tests take so long?

Whenever you are writing Unit Tests that require features provided by the annotations `@SpringBootTest`, `@DataJPATest`, `@WebMVCTest` or similar, a Spring Application Context will be created to provide the environment these tests need to run.

This Application Context bundles the complete Bean Configuration of the application which forms the foundation for the Dependency Injection mechanism.
The Bean Configuration contains the information about dependencies between all components of the application.
Usually this configuration is defined when starting the application and it remains unchanged throughout the runtime.

However, when writing autonomous Unit Tests for your application there are situations where you want to create multiple independent Application Contexts for different test cases.
On one hand this can lead to very simple and autonomous test cases that are robust against side effects caused by other test cases altering the Application Context.
On the other hand this requires many different Application Contexts that take a long time to start up which slows down your test execution significantly.

# Situations that require a fresh Application Context

The following list represents an incomplete list of some examples for situations which lead to the creation of a new Application Context during the execution of your Unit Tests.

## `@DirtiesContext` annotation

## Nested test classes

## Custom properties for Spring Boot Test

## Different profiles

## Web MVC Test for one Controller

# How to recognize these situations