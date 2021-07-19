---
layout: [post, post-xml]              # Pflichtfeld. Nicht ändern!
title:  "Identify Bottlenecks in your Spring Tests with JUnit Insights"         # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2019-08-20 09:00             # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2021-03-08 14:50
author: florianluediger               # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: [Softwareentwicklung]                    # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Spring, JUnit, Testing, Java]        # Bitte auf Großschreibung achten.
---

When developing a large software project, a low execution time of unit tests is crucial to guarantee a fast and efficient progression of the project.
This is especially true when using continuous integration to automatically check your code quality and correctness.
[JUnit Insights](https://github.com/adessoag/junit-insights) helps you to identify the reasons behind long execution times of some of your software tests so you can optimize them easily.

# Why do my Spring tests take so long?

Whenever you are writing unit tests that require features provided by the annotations [`@SpringBootTest`](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/test/context/SpringBootTest.html), [`@DataJpaTest`](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/test/autoconfigure/orm/jpa/DataJpaTest.html), [`@WebMvcTest`](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/test/autoconfigure/web/servlet/WebMvcTest.html) or similar, a [Spring ApplicationContext](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/context/ApplicationContext.html) will be created to provide the environment these tests need to run.

This ApplicationContext bundles the complete bean configuration of the application, which forms the foundation for the dependency injection mechanism.
The bean configuration contains all information about dependencies between all components of your application.
Usually this configuration is defined when starting the application and it remains unchanged throughout the runtime.

However, when writing isolated unit tests for your application, there are situations where you want to create multiple independent ApplicationContext for different test cases.
On one hand, this can lead to very simple test cases that are invulnerable to side effects caused by other test cases altering the ApplicationContext.
On the other hand, this requires many different ApplicationContext that take a long time to start up, slowing down your test execution significantly.

# Situations that require a fresh ApplicationContext

The following is an incomplete list of situations which lead to the creation of a new ApplicationContext during the execution of your unit tests.

You can find a complete project containing all these scenarios with the necessary surrounding code [on GitHub](https://github.com/florianluediger/ContextRefreshesInSpringTest).

## Explicit invalidation of a context

First of all, you can of course explicitly invalidate an ApplicationContext so a new one has to be created for the following test cases.
This makes sense when you modify the ApplicationContext within a test method, which could influence the outcome of other test cases.
This would mean that the unit tests are not independent anymore, which is a dangerous anti pattern.

In the following example, the test methods modify the state of a singleton bean so the annotation [`@DirtiesContext`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/test/annotation/DirtiesContext.html) is needed to force the test runner to create a new ApplicationContext afterwards:

```java
@SpringBootTest
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
For example, these profiles can define which implementation of a Bean is used in different contexts.
In our example, you can define a different instance of the `FruitManager` Bean for the `dev` environment by labeling the Bean class with the [`@Profile("dev")`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/context/annotation/Profile.html) annotation and the test class with the [`@ActiveProfiles("dev")`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/test/context/ActiveProfiles.html) annotation:

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

If this test is run together with the test from the last section, a new ApplicationContext will be created for both tests.

## Custom properties

When testing your application, sometimes it makes sense to overwrite properties previously defined in the `application.properties` file.
The configured properties are part of the ApplicationContext which means that changing them requires a refresh.
You can overwrite properties inside the parameters of the [`@SpringBootTest`](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/test/context/SpringBootTest.html) annotation as demonstrated in this example.

```java
@SpringBootTest(properties = {"fruit.name=Melon"})
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
To achieve this, we have to specify the tested controller as a parameter of the [`@WebMvcTest`](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/test/autoconfigure/web/servlet/WebMvcTest.html) annotation.
If we had not done this in this example, Spring would complain about a missing instance of the `FruitManager` bean.
Although this bean is not even used in this test class, the test runner tries to create the whole ApplicationContext which fails because it can't find any actual or mocked instance of the `FruitManager` bean.

```java
@WebMvcTest(VegetableController.class)
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

Even if you are aware of the fact that situations like these require a refresh of the ApplicationContext, finding them in a large collection of software tests can be very hard.
The reason for this is that the text runner typically does not give you much information about when or where a new ApplicationContext is started.
The only metric that you can often see is the time that each test class took to finish.
This alone often just leads to confusion about why some test classes take more time to finish than others.

To solve this problem you can use the JUnit 5 extension [JUnit Insights](https://github.com/adessoag/junit-insights).
This plugin measures the time for setup, execution and teardown for each test method in each test class.
It also counts how often Spring Contexts were created throughout the test execution and how long this takes each time.
With this data, it creates a nice looking report that visualizes the information.
You can see a snippet of a finished report in the screenshot below.

![JUnit Insights report example](https://github.com/adessoAG/junit-insights/raw/master/images/screen1.png)

In this report, you can clearly see where Spring ApplicationContexts are created and how long that takes.
Based on this information, you can dive into your code, identify the reasons for the Context refreshes and possibly optimize your test execution by eliminating them.
This way your test execution time decreases, your continuous integration pipelines will give you faster feedback about software errors and your developers will get happier.

To make using this extension as easy as possible, it is available via a [JCenter repository](https://bintray.com/adesso/junit-insights/junit-insights) and it can be configured inside your Gradle or Maven configuration files.
For more information on how to use the plugin and how the inner workings function, check out the [GitHub repository](https://github.com/adessoag/junit-insights).
