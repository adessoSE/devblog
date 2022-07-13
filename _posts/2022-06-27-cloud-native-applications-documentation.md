---
layout:			[post, post-xml]											# Pflichtfeld. Nicht ändern!
title:			"Cloud-Native Applications Documentation"                   # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:			2022-06-27 12:00											# Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 	2022-06-27 12:00											# Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author_ids:			[nirumand]								                # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: 	[Architektur]		                                		# Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags:			[Documentation, Cloud-native, Antora]	                    # Bitte auf Großschreibung achten.
---

Last year, we started migrating our single-repo, multi-module code-base (160+ Backend Interfaces) from the old OSGI Framework to a new multi-repo Cloud-Native architecture with the following characteristics:

* Each Interface is hosted in a separate git repository and has its application lifecycle. 
* Interfaces are delivered as a container image for an orchestration platform to a container registry along with their matching helm deployment manifests which are delivered to a helm registry

A separate code repository allows for faster and more frequent releases but also introduces a big challenge of creating or updating configuration for the operation team due to the number of releases and variety of interfaces. 

In this article, we would like to focus on the documentation aspect of having a cloud-native architecture and share our way of documentation with the hope that it may help other teams and also benefit from the reader's recommendations.

# Old School Documentation
Before we talk about the challenges and our solution, it would be a good idea to see what we have been doing. 
We used to have various documents based on Microsoft word and some diagrams based on the application Enterprise Architect.

We had the following documents:
* __Software Architecture__: Described the overall system architecture as well as all interfaces(OSGI Bundles) specific architecture. The document was based on ms-word and saved on the git repo along with the source-code

* __Operation Manual__: Focused on the operational aspect of our applications and provided some introduction to installing the platform (Red Hat Fuse 6) and some of the main operations. This document was based on ms-word and saved on the git repo along with the source-code

* __Release Notes__: Provided the User stories implemented and also configuration updates mostly useful for the Operation team. This document was saved as ms-word and versioned on the git repo along with the source-code

* __Confluence pages__: Had all kinds of outdated information about some aspects of the applications used mostly by developers. 

In addition, each of our developers had their private how-to guides.

# Old School Documentation Delivery
Since we were working in an agile team, the documentation artifacts were tagged with the application version and saved as a PDF and delivered to the customer via E-mail or some file-sharing platform. 

As you can guess, it did bring lots of issues such as:

* We could not do a diff-check on the code repository for binary files (pdf, docx, ...)
* The Email recipient could not get the email for whatever reason and basically, some shareholders would miss the information.
* Copping configuration would also take unknown or special characters.


# Migration Project
With the new migration project, we started to migrate our complete source code to new cloud-native architecture and one of the important goals of our migration was __zero-to-hero documentation__ which should have the following qualities:

* Is single source-of-truth
* Ease of versioning
* Various versions of the same application documentation are easily accessible
* Easy to deliver and all stakeholders can access it at any time

We expect the above quality measures can:

* Allows faster and easier onboarding of new team members
* Eases maintenance of the project, hence increase in the efficiency of developers
* Better communication with our stakeholders such as Product owners, Solution architects, Operation teams, and interface consumers.

## Challenges
Changing the architecture can impose big changes on the way of working. For example concerning documentation:

* What are the documentation artifacts?
* Where do we keep documentation?
* How do we deliver documentation?
* How is it versioned?
* How can we better review artifacts before delivering?

In the following section, we talk about our solution and how we achieved the above-mentioned goal.

## Our Solution
The very first step we took to achieve our documentation goal, was to migrate from binary formats to text-based formats which solve the problem of reviewing and diff-checks. 

We used [AsciiDoc][1] for our technical writing. The reasons for our decision were:
* It is easy to learn
* It can be used by any text editor. We use [Asciidoctor][2], [Visual Studio Code][3]
* Since it is text-based, can be versioned on any version control system
* It can be published in multiple output formats
* Most importantly, allows concentrating on writing!
* There are plenty of tools to draw diagrams as text such as [plantuml][4]

Now that we have our documentation as code, we need to:

* Identify the kind of documentation artifacts we have. 
* Chose tools to build our documentation artifacts. 
* Think of a delivery method for our new documentation artifacts.

### Artifacts
In our new project we produce the following artifacts:

* **Macro-Architecture**: This document gives a big picture of the Project. All interfaces should follow the design/constraints specified in this document. The sections that are the same as all other interfaces will be explained in this document to avoid redundant work. If any interface requires a deviation of design, it will be documented in the interface-specific architecture document. This document is based on the arc42 Template.

* **Overall-Operation-Manual**: Provides guides about overall infrastructure/platform requirements and settings. It also provides a general debugging guide and references.

* **Release-Notes**: Is produced for each interface and release 

* **Interface-Architecture**: Provides interface-specific architecture documentation. It follows the Macro-Architecture and provides additional information if required.

* **Operation-Manual**: Guide how to configure the interface and describe technical properties. This document is produced for each interface separately.

* **Developer Guide**: Provides all the required information on how to develop, extend and run the interface. It provides information such as how to run mock systems, configuration, and anything that helps not to rely on the original developer for the tricks to run. Any team member which has never seen this code should be able to at least build and run the interface by reading this document.

In addition to the above documents, there are other documents such as the functional requirements of the interface.

The Macro-Architecture and Overall-Operation-Manual are saved separately in their git repositories. 
The rest of the documents are interface-specific and are saved along with the source code and are versioned the same as the application version.

To solve the problem with versioning documents we commit to plain-text languages such as [Asciidoc][1] and [Markdown][5].

### Building
Now that we have our document as a source, we can apply whatever transformation and formatting we want. 

**The challenge**: The source code is scattered in lots of git repositories and we need to combine them with the least effort using some kind of engine which we call `doc-centralizer`(see below).

![alt text](/assets/images/posts/cloud-native-applications-documentation/centrazlized-documentation-flow.png "Building Documentation with doc-centralizer")

We do not need to reinvent the wheel. It already exists and is perfectly documented! 

#### Antora
[Antora][6] is a multi-repository documentation site generator for tech writers who writing in `AsciiDoc`. 
The configuration of Antora for generating the final output is done in a declarative manifest called `anotra-playbook.yml`.
In this playbook, we enter the source-code repository URL and branches that should be included in the documentation. 

Our documentation is built based on various components. For example, Interface-Architecture, Interface Operation Manual etc.
Each of these components could have various versions. For example, different releases branches. 

To understand better, we can look into the documentation of [Camel](https://camel.apache.org/manual/index.html) framework.

![alt text](/assets/images/posts/cloud-native-applications-documentation/camel-documentation-example.png "Camel Framework Documentation")

In the above example, we can click and switch to the following components:

* User Manual
* Camel Components
* Camel K
* Camel Kafka Connector

Also, We can choose a specific version of a component. For example, we can click on version `2.x` under `Camel components` to see the documentation. This is especially useful for readers to fast-switch and compare various versions.

*__Note__: discussing Antora is not the focus of this article and can be best learned by its website.*

### Delivery
We use Anotra in a pipeline to fetch all the documentation and combine them into a static website. Once we have our website we can serve it using any webserver anywhere!

We chose to deliver our documentation as a container image to a container registry which can be run easily on any container platform such as Kubernetes or Openshift. 

The build and delivery process is automated and uses something like the below to build a container image:

```dockerfile
FROM docker.io/antora/antora:3.0.1 as builder

RUN npm i asciidoctor.js asciidoctor-plantuml

COPY . /antora/

RUN antora generate --stacktrace antora-playbook.yml

FROM registry.access.redhat.com/ubi8/httpd-24

COPY --from=builder /antora/doc-output/ /var/www/html/r
```

The provided `dockerfile` is just one simple example of how to build the container. Depending on the requirements, we can also use other webservers such as `Nginx` or enable authentication and authorization which are not the focus of this article.

# Our Recommendation:
* Team culture is an essential factor to create useful and productive documentation. Build a team culture to commit to detailed documentation and enforce it on the Definition-Of-Done list or any review processes. 

* Use text-based documentation. It allows focusing on writing and documentation. The learning curve might be slow at first but it solves many problems in the long run.

* Version documentation along the source code. 
* Less confluence (or similar) pages.

[1]: https://asciidoc.org/
[2]: https://asciidoctor.org/
[3]: https://code.visualstudio.com/
[4]: https://plantuml.com/
[5]: https://en.wikipedia.org/wiki/Markdown
[6]: https://antora.org/