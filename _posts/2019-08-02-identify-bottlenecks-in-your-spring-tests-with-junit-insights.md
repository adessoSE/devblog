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

# How to recognize these situations