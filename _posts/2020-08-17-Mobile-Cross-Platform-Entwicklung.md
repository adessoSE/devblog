---
layout: [post, post-xml]
title: "Mobile Cross Platform Entwicklung"
date: 2020-08-19-09:00
modified_date: 2020-08-19-09:00
author: vincentlipschinski
categories: [Architektur]
tags: [Mobile, Cross Platform, React Native, Xamarin, Flutter, Ionic]
---

Die Entwicklung mobiler Apps für Android und iOS ist kostspielig und technisch aufwendig.
Cross-Platform-Frameworks versprechen, die mobile Anwendungsentwicklung zu vereinfachen und zu beschleunigen.

Ich habe mir vier Cross-Platform-Frameworks herausgesucht, die momentan am Markt erfolgreich sind und dabei unterschiedliche Paradigmen verwenden.

![Suchinteresse bei Google](/assets/images/posts/mobile-cross-platform-entwicklung/google_trends.png)

_[Quelle](https://trends.google.de/trends/explore?q=Ionic,Xamarin,Flutter,React%20Native)_

Im Gegensatz zum Paradigma der nativen App-Entwicklung, verfolgen die Cross-Platform-Frameworks einen Ansatz, um die App-Entwicklung unabhängig vom Betriebssystem zumachen.
Dabei gibt es wiederum verschiedene Ansätze dieses Cross-Platform-Paradigma umzusetzen. Ein Ansatz ist es, die App-Komponenten zur Laufzeit in native Komponenten zu kompilieren.
Diese Apps werden hybrid-native Apps genannt (z. B. React Native, Xamarin oder Flutter).
Weil auch die meisten mobilen Endgeräte heutzutage einen Webbrowser besitzen, gibt es auch den Ansatz, die Anwendung für den mobilen Browser so zu optimieren, dass sich die Apps für die User kaum noch von einer nativen App unterscheiden lassen.
Diese Apps werden Progressive Web Apps (PWA) genannt.
Desweiteren gibt es die sogenannten hybrid Apps, die eine WebView als Laufzeitumgebung verwenden (z. B. Apache Cordova).
Die unterschiedlichen Paradigmen werden im Folgenden, im Kontext der unterschiedlichen Frameworks, detaillierter erläutert.

# Ionic

Die Basis des Ionic-Frameworks sind HTML5, CSS, Sass und JavaScript/TypeScript.
Man kann mit Ionic sowohl PWAs als auch hyprid Apps erstellen. Es basiert auf Angular und Apache Cordova.
Letzteres ermöglicht den Zugriff auf die betriebssystemspezifischen APIs des Endgeräts.

![Apache Cordova Architektur](/assets/images/posts/mobile-cross-platform-entwicklung/cordovaapparchitecture.png)

_[Quelle](https://cordova.apache.org/static/img/guide/cordovaapparchitecture.png)_

In der obigen Abbildung ist ein Diagramm der Systemarchitektur von Apache Cordova abgebildet.
Die Web App, oben links, beinhaltet den Quellcode der App und ist als normale Website implementiert.
Hier kommt häufig das Ionic-Framework zum Einsatz.

Ein integraler Bestandteil der Cordova-Architektur sind die Cordova Plugins.
Sie stellen eine Schnittstelle zwischen Cordova – und nativer Komponenten zur Verfügung und ermöglichen so, die Kommunikation und den Zugriff auf die APIs des Endgeräts.
Dies ermöglicht es, aus dem JavaScript-Quellcode heraus, nativen Quellcode aufzurufen. Cordova bietet dazu eine Auswahl von Core Plugins an, wie beispielsweise Batterie Status, Kamera oder Kontakten.
Darüber hinaus können Plugins auch selbst entwickelt oder von Drittanbieter bezogen werden.

Durch die Verwendung einer WebView ist die Performanz möglicherweise etwas schlechter als bei der Verwendung nativer Komponenten.

# Xamarin

Xamarin wurde 2016 von Mircrosoft übernommen, blieb aber weiterhin Open Source. Xamarin-Apps werden in der Programmiersprache C# entwickelt und werden in der .NET Laufzeitumgebung ausgeführt.

![Xamarin Architektur](/assets/images/posts/mobile-cross-platform-entwicklung/xamarin_architecture.png)

_[Quelle](https://docs.microsoft.com/de-ch/xamarin/get-started/what-is-xamarin-images/xamarin-architecture.png)_

Eine Open Source Version des .NET-Frameworks namens Mono, das auf Unix-artigen Systemen (Linux, Unix, FreeBSD und macOS) lauffähig ist, bietet die Grundlage von Xamarin.
Mono übernimmt Aufgaben wie Speichermanagement, Garbage Collection und die Interoperabilität mit den Endgeräten.
Für Android und iOS gibt es jeweils spezielle Ausprägungen von Xamarin: Xamarin.iOS und Xamarin.Android.

Xamarin-Apps werden zu App Dateien kompiliert, also .apk Dateien für Android und .ipa Dateien für iOS, die sich nicht mehr von denen Unterscheiden, die mit Xcode oder Android Studio erstellt wurden.
So lässt sich, wie bei nativen Anwendungen, eine hohe Integration in das jeweilige Betriebssystem erreichen.

Durch die Verwendung nativer UI-Komponenten wird eine hohe Performanz realisiert.

# Flutter

Flutter ist Open Source, wird von Google entwickelt und wurde 2017 veröffentlicht.

![Flutter Architektur](/assets/images/posts/mobile-cross-platform-entwicklung/flutter_architektur.png)

_[Quelle](https://hackernoon.com/hn-images/1*uXUhqyod87IqP0pVXPVjhg.png)_

Außergewöhnlich bei diesem Framework ist die verwendete Programmiersprache namens Dart.
Dart ist eine objektorientierte Programmiersprache die von Google aktiv entwickelt wird.
Der Dart-Quellcode kann einerseits zu nativem Maschinencode kompiliert und andererseits zu JavaScript transpiliert werden.
Die Sprache ist stark typisiert und ähnelt syntaktisch anderen Programmiersprachen wie: Java, JavaScript oder C#.

Das Erstellen der UI erfolgt im Dart-Quellcode (UI as Code).
Die UI-Komponenten (Widgets) werden in einer hierarchischen Struktur angeordnet (Widget Tree).
Das Rendering der Widgets wird durch eine eigens entwickelte Engine, namens Skia, realisiert.
Flutter ist damit, im Gegensatz zu Frameworks, die native UI-Komponenten verwenden, in der Lage, jeden einzelnen Pixel auf dem Bildschirm direkt zu kontrollieren.
Aus diesem Grund müssen eigene UI-Komponenten verwendet werden.
Diese wurden vom Flutter-Team nachgebaut, um das typische Android - bzw. iOS Look-and-Feel zu erhalten.

Flutter liefert ein eigenes SDK, mit dem der Dart-Quellcode auf zwei verschiedene Arten kompiliert werden kann:

**JIT (Just in Time)**

- Die Dart-VM hat einen JIT-Compiler der im Development Mode verwendet wird. Es ermöglicht Hot-Reloading, was die Entwicklung komfortabler macht.

**AOT (Ahead of Time)**

- AOT-Kompilierung wird im Production Mode verwendet. Der Quellcode wird in nativen x86 bzw ARM Maschinencode kompiliert und kann dann in einer Dart-Laufzeitumgebung ausgeführt werden.

Flutter erreicht durch die Kompilierung in Maschinencode, eine hohe Performanz. Die große Anzahl vorgefertigter UI-Komponenten (Widgets) beschleunigt die Entwicklung und erleichtert es Entwicklern, das plattformtypische Look-and-Feel zu erreichen.

# React Native

React Native wurde von Facebook entwickelt, baut auf React auf und verwendet JavaScript sowie JSX als Programmiersprachen.

![React Native Architektur](/assets/images/posts/mobile-cross-platform-entwicklung/react_native_architecture.jpg)

_[Quelle](https://www.moveoapps.com/blog/wp-content/uploads/2017/07/native-appv1.jpg)_

Wie React ist auch React Native komponentenbasiert aufgebaut.
Wer also mit React vertraut ist, für denjenigen/diejenige ist das Entwickeln mit React Native keine große Umstellung, denn das Grundprinzip bei React ist dasselbe, wie bei React Native.

React benutzt das sogenannte reconciliation, wobei es sich um effiziente Algorithmen im Hintergrund handelt, die den virtuellen DOM mit dem realen DOM vergleichen.
Reconciliation ermöglicht, dass nur diejenigen Elemente des realen DOMs gerendert werden,die für die richtige Darstellung der UI notwendig sind.
Dieses Konzept wurde auf React Native übertragen, mit dem Unterschied, dass die React Native Komponenten, in native Komponenten des jeweiligen mobilen Endgeräts kompiliert werden können.
Dies wird durch die sogenannte Bridge ermöglicht, die als eine Art Vermittler, zwischen dem JavaScript-Quellcode und dem mobilen Endgerät fungiert.
Die Bridge ist kein Compiler, sondern eher ein von beiden Seiten genutzter Speicherbereich.

React Native erreicht durch die Verwendung nativer Komponenten des Endgeräts eine gute Performanz.
Es werden jedoch nur wenige vorgefertigte UI-Komponenten mitgeliefert.
Jedoch gibt es eine große Community, die sehr viele Komponenten bereitstellt.

# Fazit

Alle hier genannten Technologien haben je nach Anwendungsfall ihre Vor- und Nachteile.
Dabei solltet ihr Apps nativ entwickeln, wenn ihr die höchste Leistungsfähigkeit aus den jeweiligen Endgeräten herausholen möchtet.
Cross-Platform-Entwicklung hingegen kann sich lohnen, wenn Zeit und Kosten wichtig sind, weil die Entwicklungszeiten reduziert werden können.
Weiterhin solltet ihr dann überlegen, ob ihr ein Framework für eine hybrid oder hybrid-native App verwenden wollt.
Die hybrid-native Apps haben tendentiell eine bessere Performanz als hybrid Apps, was für die User jedoch selten wirklich spürbar ist.
PWAs haben hingegen den Vorteil, die App nicht installieren zu müssen.
