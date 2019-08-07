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

A complete project containing all these scenarios with the necessary surrounding code [can be found on GitHub](https://github.com/florianluediger/ContextRefreshesInSpringTest).

## Explicit invalidation of a context

First of all, you can of course explicitly invalidate an Application Context so a new one has to be created for the following test cases.
This makes sense when you change the Application Context within a test method which could influence the outcome of other test cases.
This would mean that the unit tests are not independent anymore which is a dangerous anti pattern.

In the following example, the test methods modify the state of a singleton bean so the annotation `@DirtiesContext` is needed to force the test runner to create a new Application Context afterwards.

```java
@SpringBootTest
@ExtendWith(SpringExtension.class)
class FruitManagerTest {

    @Autowired
    FruitManager fruitManager;

    @Test
    @DirtiesContext
    void changeDefaultToBananaTest() {
        Assertions.assertEquals("Apple",fruitManager.getCurrentSeasonalFruit());
        fruitManager.setCurrentSeasonalFruit("Banana");
        Assertions.assertEquals("Banana", fruitManager.getCurrentSeasonalFruit());
    }

    @Test
    @DirtiesContext
    void changeDefaultToMelonTest() {
        Assertions.assertEquals("Apple", fruitManager.getCurrentSeasonalFruit());
        fruitManager.setCurrentSeasonalFruit("Melon");
        Assertions.assertEquals("Melon", fruitManager.getCurrentSeasonalFruit());
    }
}
```

[Link to JUnit Insights Report](https://florianluediger.github.io/ContextRefreshesInSpringTest/JUnit%20Insights%20reports/JUnit%20Insights%20Report%20-%20Explicit%20invalidation%20of%20a%20context.html)

## Individual test profiles

You can define different profiles for the execution of your Spring Boot application.
For example these profiles can define which implementation of a Bean is used in different contexts.
In our example, you can define a different instance of the `FruitManager` Bean for the `dev` environment by labeling the Bean class with the `@Profile("dev")` annotation and the test class with the `@ActiveProfiles("dev")` annotation.

```java
@Component
@Profile("dev")
public class FruitManagerDev implements FruitManager {

    private String currentSeasonalFruit = "Melon";

    public String getCurrentSeasonalFruit() {
        return currentSeasonalFruit;
    }

    public void setCurrentSeasonalFruit(String currentSeasonalFruit) {
        this.currentSeasonalFruit = currentSeasonalFruit;
    }

}
```

```java
@SpringBootTest
@ExtendWith(SpringExtension.class)
@ActiveProfiles("dev")
class FruitManagerDevTest {

    @Autowired
    FruitManager fruitManager;

    @Test
    void checkDefaultValueTest() {
        Assertions.assertEquals("Melon", fruitManager.getCurrentSeasonalFruit());
    }
}
```

[Link to JUnit Insights Report](https://florianluediger.github.io/ContextRefreshesInSpringTest/JUnit%20Insights%20reports/JUnit%20Insights%20Report%20-%20Individual%20test%20profiles.html)

## Custom properties

When testing your application, sometimes it makes sense to overwrite properties previously defined in the `application.properties` file.
The configured properties are part of the Application Context which means that changing these requires a refresh.
You can overwrite properties inside the parameters of the `@SpringBootTest` annotation as demonstrated in this example.

```java
@SpringBootTest(properties = {"fruit.name=Melon"})
@ExtendWith(SpringExtension.class)
class FruitManagerMelonTest {

    @Autowired
    FruitManager fruitManager;

    @Test
    void checkDefaultValueTest() {
        Assertions.assertEquals("Melon", fruitManager.getCurrentSeasonalFruit());
    }
}
```

[Link to JUnit Insights Report](https://florianluediger.github.io/ContextRefreshesInSpringTest/JUnit%20Insights%20reports/JUnit%20Insights%20Report%20-%20Custom%20properties.html)

## Web MVC Test for single Controller

To guarantee that your unit tests are as independent from each other as possible, you should construct your web endpoint tests in a way that isolates functional groups.
In our example this means that the test class for validating the `VegetableController` class should have nothing to do with other controllers like the `FruitController`.
To achieve this we have to specify the tested controller as a parameter of the `@WebMVCTest` annotation.
If we had not done this in this example, Spring would complain about a missing instance of the `FruitManager` Bean.
Although this Bean is not even used in this test class, the test runner tries to create the complete Application Context which fails because it can't find any real or mock instance of the `FruitManager` Bean.

```java
@WebMvcTest(VegetableController.class)
@ExtendWith(SpringExtension.class)
class VegetableControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Test
    void getSeasonalVegetableTest() throws Exception {

        String result = mockMvc.perform(get("/vegetable/seasonal"))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        Assertions.assertEquals("Potato", result);
    }
}
```

[Link to JUnit Insights Report](https://florianluediger.github.io/ContextRefreshesInSpringTest/JUnit%20Insights%20reports/JUnit%20Insights%20Report%20-%20Web%20MVC%20Test%20for%20single%20Controller.html)

# How to recognize these situations

Even if you are aware of the fact that situations like these require a refresh of the Application Context, finding them in a large collection of software tests can be very hard.
The reason for this is that the text runner typically does not give you much information about when or where a new Application Context is started.
The only metric that you can often see is the time that each test class took to finish.
This alone often times just leads to confusion about why some test classes take more time to finish than others.

To solve this problem you can use the JUnit 5 extension [JUnit Insights](https://github.com/adessoag/junit-insights).
This plugin measures the time for setup, execution and teardown for each test method in each test class.
It also counts how often Spring Contexts were created throughout the test execution and how long this takes each time.
With this data, it creates a nice looking report that visualizes the information.
You can see a snippet of a finished report in the screenshot below.

![JUnit Insights report example](https://github.com/adessoAG/junit-insights/raw/master/images/screen1.png)

In this report, you can clearly see where Spring Contexts are created and how long that takes.
Based on this information, you can dive into your code, identify the reasons for the Context refreshes and possibly optimize your test execution by eliminating them.
This way your test execution time decreases, your continuous integration pipelines will give you faster feedback about software errors and your developers will get happier.

To make using this extension as easy as possible, it is available via a [JCenter repository](https://bintray.com/adesso/junit-insights/junit-insights) and it can be configured inside your Gradle or Maven configuration files.
For more information on how to use the plugin and how the inner workings function, check out the [GitHub repository](https://github.com/adessoag/junit-insights).