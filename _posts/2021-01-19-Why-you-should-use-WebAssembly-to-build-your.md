---
layout: [post, post-xml]              
title: "Why you should not use WebAssembly to build your SPA"            
date: 2021-01-16 09:00 
author: maximilian_Lang                 
categories: [Softwareentwicklung]
tags: [JavaScript, WebAssembly, Blazor, Vue.js, Lighthouse]     
---

WebAssembly is the latest hit in web development and also has the potential to completely change the internet as we know it today, but is it already mature enough for single page applications?
In this article, two identical applications are programmed in WebAssembly and JavaScript and then compared using Google Lighthouse.

# Why you should not use WebAssembly to build your SPA


When it comes to programming on the web, JavaScript has always been the only logical choice for software developers. 
Unless you use the rather error-ridden flash player, use outdated Java applets or limit yourself to just a handful of browsers. 
By 2017, a conglomerate of all major browser manufacturers released the MVP of WebAssembly and integrated it in a few months. 
This technology is supposed to be the new sacred grail of web development and could also theoretically change everything. 
But what exactly is WebAssembly, how does it work and how does it compare to JavaScript in terms of Single Page Applications?

## A brief introduction to WebAssembly

The following but rather abstract formulation describes WebAssembly on the official web site

***WebAssembly (abbreviated wasm) is a binary instruction format for a stack-based virtual machine. wasm is designed as a portable compilation target for programming languages, enabling deployment on the web for client and server applications.".***

To better understand this, let's take a look at how native code works.

A computer is a very logical machine, but with the alphabet [1,0] it has a somewhat limited input option. 
Implementing logic with this is a rather inefficient and frustrating way of wasting ones time. 
That's why smart engineers have developed a way to make this task more enjoyable, and the birth of Assembler Code has struck. 
However, this code is still quite complicated and differentiates for each CPU architecture. 
Thus, another abstraction was developed, which are also known as today's programming languages and which are way more powerful and easier to use, than Assembler or Binary.

These programming languages will be transformed into assembler code of the underlying system and then converted to a sequence of "1" and "0". 
This conversion process, which also includes other steps such as optimization, Tree Shaking, etc., is also called compilation. 
This can take several minutes in complex programs and is therefore completely unsuitable for the web. 
Let's face it, who waits more than 5 seconds to load a website in our days.

In the world of JavaScript, we ship the uncompiled source code to the customer, and the browser always translates only the sub-area, which is currently necessary.
This results in an immediate response for the user.
The concept of interpretation can only be applied to a few other programming languages and also has many disadvantages, which is why JavaScript quickly reaches its limits.

Also the delivery of the finished assembler or binary code is not possible, because on the one hand we do not know the CPU architecture of the user and on the other hand, we would have to compile the source code into all existing and future processor architectures.

And that's where WebAssembly comes in.
WebAssembly is a virtual CPU architecture that is always the same and can be used as a compilation target. 
The compiled code is similar to a commercially available assembler code and can then be translated in near real time for the actual CPU architecture in the target system.
So in the end, we can compile our code to WebAssembly and ship the final artifact to the customer.

![WASM CPU Architecture](/assets/images/posts/Why-you-should-not-use-WebAssembly-to-build-your-spa/wasm_cpu_architecture.png)

## WebAssembly und Single Page Applications

Since WebAssembly saves us the unnecessary compilation of JavaScript in the browser and also low level languages has a higher performance than JavaScript, it would be ideal to implement single page applications in WebAssembly.

However, since WebAssembly is still in its infancy, fundamental functions such as a garbage collection or multi-threading are still missing.

Nevertheless, in recent years, Microsoft has developed a framework called Blazor, which is most advanced framework based on WebAssembly.
It is developed in C# and is like all UI frameworks component based.
In addition, it offers important functionalities such as routing, templating and dependency injection.

## Comparison of WebAssembly and JavaScript

![Blazor vs. Vue.js](/assets/images/posts/Why-you-should-not-use-WebAssembly-to-build-your-spa/WASM_VS_JS.png)

To verify that WebAssembly is really suitable for use in SPA, a direct comparison of JavaScript and WebAssembly must be made. 
For this purpose I have developed a completely identical website in Blazor, as well as in Vue.js which includes the following sections

- Table with 1000 entries
- To-Do Application for API Communication
- Picture list for rendering images
- Video page

The repositories for the two applications and the associated API can be found here

- [Blazor App](https://github.com/xXanth0s/wasm_comparison_blazor-app)
- [Vue.js App](https://github.com/xXanth0s/wasm_comparison_vue_app)
- [API](https://github.com/xXanth0s/wasm_comparison_api)

# Results

The final sites could be created without any problems in both frameworks and development took about the same time.

In the final comparison with Lighthouse, however, it can be seen that Blazor performs significantly worse than Vue.js.

![Lighthouse result](/assets/images/posts/Why-you-should-not-use-WebAssembly-to-build-your-spa/Lighthouse_Results.jpg)


The main reason for this is the increased package size of Blazor. 
At 13557 KB, the total volume of the WebAssembly application is 23 times that of Vue.js. 
This is most likely due to the fact that the entire .NET Framework is required to be loaded for C#.

![Size comparison](/assets/images/posts/Why-you-should-not-use-WebAssembly-to-build-your-spa/Size_Comparison.png)

This factor is particularly important in the mobile sector.
With the value "Time To Interactivity" you can see that the website always needs more than 70 seconds to load.

WebAssembly also performs worse than JavaScript in all areas. 
The only exception is First Contentful Paint. However, this is a mismeasurement of Lighthouse because it only measures when the first HTML elements are available. 
In Blazor, this happens very quickly, but this root element has no visual properties. 
When looking at the time-lapse, this mismeasurement clearly shows.

![Time-elaps of page loading](/assets/images/posts/Why-you-should-not-use-WebAssembly-to-build-your-spa/Fast_Motion.png)

The Blazor application was particularly unstable in the rendering of the table with 1000 entries. 
With just over 80% of all calls, the application has crashed. 
This phenomenon can be detected in all desktop browsers as well as on the smartphone. 
In contrast, Vue.js also needed some time to load the table, but ran completely stable.

This could be because in WebAssembly access to the DOM only works using glue code. 
For this purpose, JavaScript code is implemented between WebAssembly and the DOM, which takes over the communication of the two parties. 
Although a standard has been developed with the Reference Types, which makes this point superfluous, this does not seem to work fully yet.

All lighthouse results:


![Lighthouse Result: First Contentful Paint](/assets/images/posts/Why-you-should-not-use-WebAssembly-to-build-your-spa/First-Contentful-Paint.jpg)
![Lighthouse Result: Speed Index](/assets/images/posts/Why-you-should-not-use-WebAssembly-to-build-your-spa/Speed-Index.jpg)
![Lighthouse Result: Largest Contentful Paint](/assets/images/posts/Why-you-should-not-use-WebAssembly-to-build-your-spa/Largest-Contentful-Paint.jpg)
![Lighthouse Result: Time to Interactive](/assets/images/posts/Why-you-should-not-use-WebAssembly-to-build-your-spa/Time-to-Interactivity.jpg)
![Lighthouse Result: Total Blocking Time](/assets/images/posts/Why-you-should-not-use-WebAssembly-to-build-your-spa/Total-Blocking-Time.jpg)
![Lighthouse Result: Cumulative Layout Shift](/assets/images/posts/Why-you-should-not-use-WebAssembly-to-build-your-spa/Cumulative-Layout-Shift.jpg)

## Conclusion

WebAssembly is a great thing and offers many new possibilities. 
However, in its current version, it cannot be used for Single Plage Applications.
The biggest blemish, of course, is the endless loading time. 
No user will ever wait over a minute for a website.

The stability of complex websites also leaves something to be desired. 
Thus, no table with 1000 entries could be rendered, which is a rather weak performance. 
If the structure of a website grows over time, Blazor would be hopelessly overwhelmed with this task.

Of course, it must also be said that a .NET Framework may not be the best choice for a website.
Using Yew, a framework for SPA is currently being developed, which is completely based on RUST will have a much lower overhead than Blazor.

But wasm is also not conceived with the idea of being a concurrent to JavaScript, but to enable new areas in web development. 
Thus, WebAssembly may never be the first choice for developing single page applications. 
Other applications would be much better suited for this purpose. 
Autodesk has taken a great first step with its web implementation of AutoCAD. 
In the future, all desktop applications can migrate to the browser, creating an enormous flexibility.
