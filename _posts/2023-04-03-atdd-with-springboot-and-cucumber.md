---
layout: [post, post-xml]                            # Pflichtfeld. Nicht ändern!
title:  "ATDD on Spring Boot with Cucumber"         # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2023-05-11 10:00                            # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen.
author_ids: [thalheim]                              # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesen Namen geben.
categories: [Softwareentwicklung]                   # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Spring Boot, Java, Cucumber, JUnit, ATDD]    # Bitte auf Großschreibung achten.
---

Developers know unit tests fairly well, even more integrative approaches like `@SpringBootTest`.
But many lack a clear design/development/test strategy and stick to their favorite programming language.
Acceptance Test Driven Design (ATDD) is a structured approach to design your tests and program outside in, keeping the focus on the larger function blocks instead of individual classes (e.g. test behavior, not classes).
This approach may benefit from abstracting the acceptance tests to a non-programming language like cucumber, allowing even non-programmers to write test scenarios which will eventually be executed automatically.
This article demonstrates this with a small testcase and a fully functional, little Spring Boot/Java project.

# Introduction: Getting Things Done

As a use case, I took David Allens Getting Things Done method ([Wikipedia](https://en.wikipedia.org/wiki/Getting_Things_Done)):
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

Before even starting on our feature, let's define the acceptance tests of our feature:
```gherkin
Feature: Capture Stage

  Scenario: Collect Thought
    When Thought "Send Birthday Wishes to Mike" is collected
    Then Inbox contains "Send Birthday Wishes to Mike"
```
_[src/test/resources/features/collect-thought.feature](https://github.com/bjoern-thalheim/cucumber_demo/blob/master/src/test/resources/features/collect-thought.feature)_

Here, we let something magical happen! 
Instead of defining acceptance tests scenarios in the QA phase after implementing the feature, creating the acceptance happened before giving the implementation task to the developer. 
This is called "shift left" as the QA activity of defining acceptance scenarios is moved from the right (end) to the left (more in the beginning) of the process. 
This approach is very charming as it forces the requirements engineer to formulate a more concrete description of the feature and not just some rough idea presented in one or two sentences 
(no offence – this is the type of "laziness" that also developers display oftentimes).

# Setting Things Up

We now do something fairly standard: we start a Java/Maven project and let IntelliJ generate the initial `pom.xml` for us. 
In the process, we will add a few dependencies for an in-memory DB for testing and cucumber into the [pom.xml](https://github.com/bjoern-thalheim/cucumber_demo/blob/master/pom.xml):
```xml
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

Because I want to start a Spring Boot project and I'm a fan of Lombok, I add the following dependencies and the Spring Boot Starter parent relation to the [pom.xml](https://github.com/bjoern-thalheim/cucumber_demo/blob/master/pom.xml):
```xml
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
* We want the application to start up with an external database (on my local machine, I let a PostgreSQL DB run in Docker)
* We want a simple ´@SpringBootTest` to start up with an embedded H2 DB.

Long story short, several things need to be made for this.
The [pom.xml](https://github.com/bjoern-thalheim/cucumber_demo/blob/master/pom.xml) needs a few more dependencies:
```xml
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

We need to configure a datasource which will be used in normal operations of our application in the [src/main/resources/application.yml](https://github.com/bjoern-thalheim/cucumber_demo/blob/master/src/main/resources/application.yml):
```yml
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
The PostgreSQL DB can be easily started with `docker run --name postgres-db -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres` and the DB and user simply created with `CREATE DATABASE ...` and `CREATE USER ...`.

We need to configure an alternative datasource which will be used when unit testing our application in the [src/test/resources/application.yml](https://github.com/bjoern-thalheim/cucumber_demo/blob/master/src/test/resources/application.yml):
```yml
spring.datasource:
  driver-class-name: org.h2.Driver
  url: jdbc:h2:mem:db;DB_CLOSE_DELAY=-1
  username: sa
  password: sa
```

> _Remarks on clarity from the start_
> 
> This is a little off topic, but particularly important.
> Many projects fail to set up their codebase as early as possible for this type of test (integrative component test with an embedded database).
> I suggest, you set this up as early as possible, before starting to write a single line of productive code in your project.
> It provides clean test possibilities for all developers during the development of the project.

## Add and configure the Cucumber Maven dependency

In order to run the test specification, we need a few dependencies in the [pom.xml](https://github.com/bjoern-thalheim/cucumber_demo/blob/master/pom.xml):
```xml
<dependency>
   <groupId>io.cucumber</groupId>
   <artifactId>cucumber-java</artifactId>
   <version>6.11.0</version>
</dependency>
<dependency>
   <groupId>io.cucumber</groupId>
   <artifactId>cucumber-spring</artifactId>
   <version>6.11.0</version>
</dependency>
<dependency>
   <groupId>io.cucumber</groupId>
   <artifactId>cucumber-junit</artifactId>
   <version>6.11.0</version>
</dependency>
```

Now, we can add the acceptance test we have already defined above into our codebase in [src/test/resources/features/collect-thought.feature](https://github.com/bjoern-thalheim/cucumber_demo/blob/master/src/test/resources/features/collect-thought.feature):
```gherkin
Feature: Capture Stage

  Scenario: Collect Thought
    When Thought "Send Birthday Wishes to Mike" is collected
    Then Inbox contains "Send Birthday Wishes to Mike"
```

## Making the cucumber test specification run

To make Maven run this specification, we need some boilerplate code.

First, a test class which points to the cucumber test specifications:
```java
@RunWith(Cucumber.class)
@CucumberOptions(features = {"src/test/resources/features"})
public class CucumberTest {
}
```
_[src/test/java/de/adesso/thalheim/gtd/CucumberTest.java](https://github.com/bjoern-thalheim/cucumber_demo/blob/master/src/test/java/de/adesso/thalheim/gtd/CucumberTest.java)_

Also, a Cucumber Context needs to be provided, we use the `@SpringBootTest` for that:
```java
@CucumberContextConfiguration
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
class CucumberSpringBootDemoApplicationTest {
```
_[src/test/java/de/adesso/thalheim/gtd/CucumberSpringBootDemoApplicationTest.java](https://github.com/bjoern-thalheim/cucumber_demo/blob/master/src/test/java/de/adesso/thalheim/gtd/CucumberSpringBootDemoApplicationTest.java)_

You will need the `RANDOM` port to not interfere with your regular running local instance of this service.

Now, if we let Maven run, during the test run an error will pop up that the glue code is missing. 
So, let's add that:
```java
public class CaptureStepDefinitions {

    @When("Thought {string} is collected")
    public void thoughtIsCollected(String thought) {
        Assert.fail("Implement me!");
    }

    @Then("Inbox contains {string}")
    public void inboxContains(String thought) {
        Assert.fail("Implement me!");
    }
}
```
_[src/test/java/de/adesso/thalheim/gtd/CaptureStepDefinitions.java](https://github.com/bjoern-thalheim/cucumber_demo/blob/master/src/test/java/de/adesso/thalheim/gtd/CaptureStepDefinitions.java)_

Now, our test specification fails. _But it does not fail for the correct reason._ 
So, let's implement the glue code in [src/test/java/de/adesso/thalheim/gtd/CaptureStepDefinitions.java](https://github.com/bjoern-thalheim/cucumber_demo/blob/master/src/test/java/de/adesso/thalheim/gtd/CaptureStepDefinitions.java):
```java
    @Value(value = "${local.server.port}")
    private int port;
    
    @When("Thought {string} is collected")
    public void thoughtIsCollected(String thought) throws IOException {
        // given
        HttpPost post = new HttpPost("http://localhost:%d/gtd/inbox".formatted(port));
        post.setEntity(new StringEntity(thought));
        // when
        HttpResponse postResponse = HttpClientBuilder.create().build().execute(post);
        // then
        Assertions.assertThat(postResponse.getStatusLine().getStatusCode()).isEqualTo(200);
    }
```

Now, the test defines that we need a `POST` endpoint which is exposed in the context path `gtd/thoughts`.
It should return an http status code 200.

While I was at it I added the AssertJ Core Library to the Maven dependencies. 
`assertThat(...)...` sounds more like BDD than standard JUnit assert statements.

If you now run the Cucumber tests or Maven build, the test execution will fail, because no REST controller offers a proper endpoint. 
Now we have a test which fails for the right reason:
```log
[ERROR] Collect Thought  Time elapsed: 0.248 s  <<< ERROR!
org.apache.http.conn.HttpHostConnectException: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect
Caused by: java.net.ConnectException: Connection refused: connect
```
The reason our test fails is because there is no REST endpoint listining where we expect it.

This means we can finally write production code:
```java
@RestController
@RequestMapping("gtd/inbox")
@Slf4j
public class InboxController {
    @PostMapping
    public void collect(@RequestBody String thought) {
        // TODO: implement me!
        log.debug("Received " + thought);
    }
}
```
_[src/main/java/de/adesso/thalheim/gtd/controller/InboxController.java](https://github.com/bjoern-thalheim/cucumber_demo/blob/master/src/main/java/de/adesso/thalheim/gtd/controller/InboxController.java)_

Now, the acceptance test fails again as there is no glue code for the when-clause in the cucumber scenario. 
Let's write this glue code in [src/test/java/de/adesso/thalheim/gtd/CaptureStepDefinitions.java](https://github.com/bjoern-thalheim/cucumber_demo/blob/master/src/test/java/de/adesso/thalheim/gtd/CaptureStepDefinitions.java):
```java
    @Value(value = "${local.server.port}")
    private int port;

    @Then("Inbox contains {string}")
    public void inboxContains(String thought) throws IOException {
        // given
        HttpUriRequest get = new HttpGet("http://localhost:%d/gtd/inbox".formatted(port));
        // when
        CloseableHttpResponse response = HttpClientBuilder.create().build().execute(get);
        // then
        String entity = EntityUtils.toString(response.getEntity());
        assertThat(StringUtils.strip(entity)).isEqualTo("[{\"description\":\"%s\"}]".formatted(thought));
    }
```


> _Note on the level of abstraction_
> 
> Here you can see, I kept the glue code and therefore the acceptance test on an abstraction level above the concrete interface.
> Of course, one could have just `@Inject` the REST controller and use plain Java for testing, which would have made things easier.
> But it would have made the test more concrete than necessary, thereby binding the test to implementation details.

Now, we can write a method for the GET endpoint.
It should return a list of classes containing exactly one field named "description".
We need to implement the controller, so let's write this in normal TDD style with a test case first:
```java
@ExtendWith(MockitoExtension.class)
class InboxControllerTest {

    @InjectMocks
    InboxController controller;

    @Mock
    ThoughtRepository repository;

    @Captor
    ArgumentCaptor<Thought> thoughtArgumentCaptor;

    @Test
    public void testPutThoughtIntoRepository() throws UnsupportedEncodingException {
        // given
        String thoughtDescription = "foiaxöniso";
        // when
        controller.collect(thoughtDescription);
        // then
        verify(repository).save(thoughtArgumentCaptor.capture());
        assertThat(thoughtArgumentCaptor.getValue().getDescription()).isEqualTo(thoughtDescription);
    }

    @Test
    public void testGetAllThoughts() {
        // given
        String thoughtDescription = "foiaxöniso";
        Thought thought = new Thought(UUID.randomUUID(), thoughtDescription);
        when(repository.findAll()).thenReturn(Set.of(thought));
        // when
        List<Thought> thoughts = controller.get();
        // then
        assertThat(thoughts).hasSize(1);
        assertThat(thoughts.iterator().next()).isEqualTo(thought);
    }
}
```
_[src/test/java/de/adesso/thalheim/gtd/controller/InboxControllerTest.java](https://github.com/bjoern-thalheim/cucumber_demo/blob/master/src/test/java/de/adesso/thalheim/gtd/controller/InboxControllerTest.java)_

Now we can finish writing the Controller, Entity, Repository etc. 

```java
@RestController
@RequestMapping("gtd/inbox")
@Slf4j
public class InboxController {

    @Inject
    private ThoughtRepository thoughtRepository;

    @PostMapping
    public void collect(@RequestBody String thought) {
        log.debug("Received " + thought);
        Thought theThought = new Thought(UUID.randomUUID(), thought);
        thoughtRepository.save(theThought);
    }

    @GetMapping
    public List<Thought> get() {
        Iterable<Thought> all = thoughtRepository.findAll();
        return StreamSupport.stream(all.spliterator(), false).toList();
    }
}
```
_[src/main/java/de/adesso/thalheim/gtd/controller/InboxController.java](https://github.com/bjoern-thalheim/cucumber_demo/blob/master/src/main/java/de/adesso/thalheim/gtd/controller/InboxController.java)_

```java
@RequiredArgsConstructor
@AllArgsConstructor
@Entity
public class Thought {

    @Id
    private UUID id;

    @Getter
    private String description;

}
```
_[src/main/java/de/adesso/thalheim/gtd/controller/Thought.java](https://github.com/bjoern-thalheim/cucumber_demo/blob/master/src/main/java/de/adesso/thalheim/gtd/controller/Thought.java)_

```java
public interface ThoughtRepository extends CrudRepository<Thought, UUID> {}
```
_[src/main/java/de/adesso/thalheim/gtd/repository/ThoughtRepository.java](https://github.com/bjoern-thalheim/cucumber_demo/blob/master/src/main/java/de/adesso/thalheim/gtd/repository/ThoughtRepository.java)_

Of course, you would never expose an `@Entity` as the result type of a REST call.
But for demonstration purposes, we're fine here.

That's it. We have driven a small feature implementation by writing an acceptance test scenario and glue code to test the behavior of a part of our application first in Cucumber.

# Wrapping it up

I have said I would do ATTD here. 
This means I first created a failing acceptance test, and then implemented only interfaces. 
And when I got further, I used normal unit tests to finish the internals of my implementation. 
The acceptance tests form an outer, the unit tests an inner loop of the implementation process.

Writing Cucumber scenarios first has the big advantage of forcing your requirements engineer to make requirements as clear as possible.

Before writing a single line of productive code, I took the time and made sure that in this dummy project the execution of unit tests, `@SpringBootTest`, and Cucumber tests were possible.

I have kept the acceptance tests free of implementation details which are not relevant to them, hence raising refactoring safety. I would try to do the same with regular `@SpringBootTests`.

If you like, you can see all code [in this repository](https://github.com/bjoern-thalheim/cucumber_demo).
