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

# Setting Things Up

We do now something fairly standard: we start a Java/Maven project and let IntelliJ generate the initial.pom.xml for us. In the process, we will add a few dependencies for an in-memory DB for testing or cucumber.

```
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>de.adesso.thalheim.gtd</groupId>
    <artifactId>cucumber_demo</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

</project>
```

Because I want to start a Spring Boot project and I'm a fan of Lombok, I add the following dependencies and add the Spring Boot Starter parent relation:
```
	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>2.5.4</version>
		<relativePath /> <!-- lookup parent from repository -->
	</parent>
...
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
            <scope>provided</scope>
        </dependency>
    </dependencies>
```

After doing that, we want to achieve the following two targets:
* We want the Application to start up with an external database (on my local machine, I let a PostgreSQL DB run in Docker)
* We want a simple @SpringBootTest to start up with an embedded H2 DB.

Long story short, several things needed to be made for this.
The pom.xml needed a few more dependencies:
```
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>test</scope>
        </dependency>
```

We need to configure a datasource which will be used in normal operations of our application:
```
spring.jpa:
  database: POSTGRESQL
  hibernate.ddl-auto: create-drop
  show-sql: true

spring.datasource:
  driverClassName: org.postgresql.Driver
  url: jdbc:postgresql://localhost:5432/mydb
  username: foo
  password: bar
```

In case you wondered: 
The PostgreSQL DB can be easily started with "docker run --name postgres-db -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres" and the DB and user simply created with "CREATE DATABASE ..." and "CREATE USER ...".

We need to configure an alternative datasource which will be used when unittesting our application.
```
spring.datasource:
  driver-class-name=org.h2.Driver
  url=jdbc:h2:mem:db;DB_CLOSE_DELAY=-1
  username=sa
  password=sa
```

## Remarks on clarity from the start

This is a little off topic, but very important.
Many projects fail to set up their codebase as early as possible for this type of test (integrative component test with an embedded database).
I suggest, you set this up as early as possible, before starting to write a single line of productive code in your project.
It provides clean test possibilities for all developers during the development of the project.
