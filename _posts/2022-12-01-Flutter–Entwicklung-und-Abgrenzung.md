---
layout: [post, post-xml]              # Pflichtfeld. Nicht ändern!
title:  "Flutter#1–Entwicklung-und-Abgrenzung"         # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2022-12-01 09:00           # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2022-12-01 09:00             # Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author_ids: [akrieger]                 # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesen Namen geben.
categories: [Softwareentwicklung]     # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [Flutter]   # Bitte auf Großschreibung achten.
---



Flutter vs. React Native. Hybride Appentwicklung bieten hierzu eine elegante und effiziente Alternative plattformübergreifende Software zu schreiben. Flutter und React Native sind in diesem Markt zwei sehr populäre Frameworks, die man für die Cross-Platform-Entwicklung definitiv kennen sollte. Trotz technologischen Unterschiede ermöglichen beide die Erstellung von Apps für verschiedene Endgerätsysteme mit nur einer Codebasis. In diesem Artikel werden wir sowohl die Unterschiede als auch die Vor- und Nachteile beider Framework erfahren. Außerdem beschäftigen wir uns mit der Entwicklung von Flutter und deren Popularität. 


#Flutter #1 - build apps for every screen

![Alt](/assets/images/posts/Flutter#1–Entwicklung-und-Abgrenzung/FlutterLogo.png,"Flutter-Logo")

##Flutter

[Flutter] https://flutter.dev/ ist ein Open Source Framework von Google zur Entwicklung von nativen Anwendungen für verschiedene Plattformen. Mit Flutter können Anwendungen für Mobile, Web und Desktop erstellt werden.  In erster Linie wird Flutter für die Android- und iOS-Entwicklung verwendet.
2017 wurde die erste Alphaversion von Flutter veröffentlicht. Im Dezember 2018 erreichte das Framework die Version 1.0. 
Mit Flutter 2.0 wurde die Entwicklung von Web-Anwendungen möglich.
Heute, im Jahre 2022, läuft Flutter mit der Version 3.0, dabei wurde die Unterstützung für MacOS- und Linux-Desktop-Anwendungen bereitgestellt und somit ist die Veröffentlichung nun auf allen Desktop-Plattformen möglich.

![Alt](/assets/images/posts/Flutter#1–Entwicklung-und-Abgrenzung/Timeline.png "Timeline")
https://medium.com/flutter/introducing-flutter-3-5eb69151622f

##Plattform

Fluter unterstützt dabei folgende Versionen auf den Plattformen.

|**Plattform**|`          `**Version**||
| :- | :- | :- |
|Android|`          `API 19 & höher||
|iOS|`          `iOS 9 & höher||
|Linux|`          `Debian 10 & höher||
|MacOS|`          `El Capitan & höher||
|Web|`          `Chrome 84 & höher||
|Web|`          `Firefox 72.0 & höher||
|Web|`          `Safari on El Capitan & höher||
|Web|`          `Edge 1.2.0 & höher||
|Windows|`          `Windows 10 & höher||

##Flutter vs. React Native

Flutter wurde 2017 von Google vorgestellt und 2018 offiziell veröffentlicht und ist somit ein relativ neues und modernes Framework. Es basiert dabei auf der von Google entwickelten Programmiersprache Dart. Dabei steht Flutter bei der hybriden App Entwicklung in direkter Konkurrenz zu React Native.

React Native wurde 2015 von Facebook entwickelt und ist das am weitverbreitetsten Framework für die Entwicklung von hybriden Apps. Dabei basiert das Framework auf der Programmiersprache JavaScript.



![Alt](/assets/images/posts/Flutter#1–Entwicklung-und-Abgrenzung/Code.png ,"Widget-Code")
https://hybridheroes.de/blog/2019-03-29-flutter-vs-react-native/
Flutter verwendet hierbei im Code sogenannte Widget, diese werden für alle Formen, Grafiken und Animationen, wie hier z.B. Row und Text verwendet. 

React Native verwendet für die Beschreibung der UI sogenannte Tags, diese bauen dann auf den nativen Komponenten für Android und iOS auf.  

##Abgrenzung

Im Gegensatz zu anderen vergleichbaren Technologien, wie z. B. React Native hat Flutter einen neuen Ansatz. Flutter-Apps benutzen Widgets. Anders als normalerweise handelt es sich hier aber nicht um sogenannte Native-Widgets (OEM), die schon vom jeweiligen mobilen Endgerät zur Verfügung gestellt werden. Stattdessen werden diese Widgets erstellt und benötigen somit keine Brücke (Bridge) und somit werden die Leistungsprobleme der Brücke (Bridge) vermieden. 

![Alt](/assets/images/posts/Flutter#1–Entwicklung-und-Abgrenzung/Fluttervsreact.png,"Flutter vs React")
https://www.cuelogic.com/blog/flutter-vs-react-native-a-comparison-based-on-criteria


##Google Trends 

In einem Zeitraum von 2017 bis 2022 wurden die beiden Suchbegriffe „Flutter“ und „React Native“ in Deutschland miteinander verglichen.  In diesem Diagramm ist zu erkennen, dass Flutter Anfang 2019 React Native mit den Suchanfragen überholt. Zu diesem Zeitpunkt befand sich Flutter in der Version 1.5. 


![Alt](/assets/images/posts/Flutter#1–Entwicklung-und-Abgrenzung/Verlauf.png,"Google Trends") Heute im Jahr 2022 wird der Begriff React Native nur zu 30% gesucht im Vergleich zu Flutter.



Der weltweite Vergleich zeigt einen ähnlichen Trend. Der Unterschied zwischen Flutter und React Native im Jahr 2022 befindet sich auch hier bei ca. 70%.


![Alt](/assets/images/posts/Flutter#1–Entwicklung-und-Abgrenzung/Region.png,"Google Trends Regionen")




##Architektur


Flutter selbst ist in C++ geschrieben und verwendet die Dart Virtual Maschine (Dart-VM), sowie die Grafikbibliothek Skia.![Alt](/assets/images/posts/Flutter#1–Entwicklung-und-Abgrenzung/Overview.png,"Flutter Architektur")
https://freal.medium.com/flutter-for-web-mobile-apps-im-browser-a98944bf63dd
Die Architektur von Flutter besteht aus zwei wesentlichen Teilen: 

##Framework: Die meisten werden bei der Entwicklung nur mit dem Framework Kontakt haben, da es alles für die Entwicklung von User Interface bis zu Framework Foundations bereitstellt. 

##Flutter-Engine: Die Flutter Engine ist eine portable Laufzeitumgebung zum Hosten von Flutter-Anwendungen. Es implementiert die Kernbibliotheken von Flutter, einschließlich Animation und Grafik, Datei- und Netzwerk-I/O, Unterstützung für Barrierefreiheit, Plugin-Architektur und eine Dart-Laufzeit- und Kompilierungs-Toolchain. Darüber hinaus verfügt es über Schnittstellen zu plattformspezifischen [SDKs](https://en.wikipedia.org/wiki/Software_development_kit "Software-Entwicklungskit") , wie die beispielsweise von Android und iOS.

##Dart

Ein UI-Designer-Editor, wie z.B. Xcode Storyboard oder Androids Layouteditor wird von Flutter nicht angeboten. Die UI wird ähnlich zu React in Quellcode geschrieben. Hierbei wird die Programmiersprache Dart verwendet. [Dart] https://dart.dev/ ist eine hauseigene Programmiersprache von Google. Erschienen ist Sie 2013 mit der Version 1.0 und heute 2022 läuft Dart mit der Version 2.17. Dart hat den Anspruch, für die Web- und App-Entwicklung eine einfache, schnell zu erlernende und robuste Programmiersprache zu sein. Eine klare Syntax, streng typisiert, objektorientiert und viele bereits enthaltene Core-Module und ein großes [Ökosystem] https://pub.dev/ von verfügbaren Paketen tragen ebenso dazu bei. Durch die Kompilierung zu ARM- und x86-Code sind Dart-Programme auf mobilen Betriebssystemen native ausführbar. Ein Compiler Dart2js, also Dart zu JavaScript sorgt für die Konvertierung in JavaScript-Code, was Dart auch im Web zu einer Alternative machen soll.

Dart ist eine der wenigen Sprachen, die sowohl AOT als auch JIT können. Es kompiliert im Voraus (ahead of time) für mehrere Plattformen in nativen Code oder in JavaScript für Web.  Ein Just-in-Time (JIT) Compiler läuft während der Ausführung des Programms und kompiliert im laufenden Betrieb. 



##Widget
![Alt](/assets/images/posts/Flutter#1–Entwicklung-und-Abgrenzung/Settings-Widgets.png,"Settings-Image")
https://github.com/topics/ui-components?l=dart
Alles ist ein Widget. Flutter verwendet für die Beschreibung der UI sogenannte Widgets. Ein Widget bündelt Logik, Interaktion und Darstellung eines Objekts. Flutter bietet ein vorgefertigtes Bündel von Widget von Haus aus an, dies können Buttons, Textfelder, eine Liste oder eine ganze Seite sein. Widget lassen sich um zusätzliche Funktionen erweitern oder die Erstellung eigener Widgets ist möglich, die sich mit den vorhandenen nahtlos kombinieren lassen. Die Widgets werden dann im Android-Stil mit Material-Design oder im iOS-Stil mit Cupertino-Design umgewandelt.



![Alt](/assets/images/posts/Flutter#1–Entwicklung-und-Abgrenzung/Icons.png,"Widget-Baum")
https://docs.flutter.dev/development/ui/layout
Ein Beispiel für ein Widget-Baum für die drei Icons

und dessen Labels könnte dabei so aussehen: 

![Alt](/assets/images/posts/Flutter#1–Entwicklung-und-Abgrenzung/Layout.png,"Layout")
https://docs.flutter.dev/development/ui/layout

Für App-Beispiele kann die Showcase-Seite <https://flutter.dev/showcase> geöffnet werden. 

Dort sind große Unternehmen die heute schon Flutter verwenden wie z.B.: 

BMW, Google Pay, ByteDance, Dream11, eBay, iRobot, Stadia, Tencet, Toyota etc. 


##Vor- und Nachteile

Vorteile: 

- Flutter-Apps weisen normalerweise eine sehr gute Performance auf. 
- Die Bibliotheken bieten zahlreiche Elemente fürs User-Interface an.
- Das Widget-Konzept bietet vielfältige Möglichkeiten an.
- Die Hot Reload-Funktion ist ein sehr nützliches Feature.
- Die Programmiersprache Dart ist sehr leicht und angenehm zu erlernen. Durch ihre Nähe zu bekannten Sprachen, wie etwa C# oder Java.
- Alle Plattformen werden unterstützt

Nachteile:

- Beim Programmieren ist der Code sehr unübersichtlich. Der Einsatz von Widgets bewirkt, dass das Ganze vielfach verschachtelt ist.
- Die Aktualisierung von Flutter bewirkt, dass die Flutter-App aktualisiert werden muss und somit für die verschiedenen Plattformen neu hochgeladen werden muss. 

##Fazit

Flutter ist Googles neustes Cross-Plattform-Framework, das mit der Programmiersprache Dart, welches auch von Google entwickelt wird, sehr gut zusammenpasst. Meistens werden Flutter- und Dart-Major-Updates gleichzeitig veröffentlicht. 

Google hatte mit Flutter einen schwierigen Start gehabt, jedoch ist mit der Version 2.0, die im März 2021 erschienen ist, ein stetig steigendes Interesse geweckt worden. Die Release-Veröffentlichungen wurden immer kürzer, sodass nach etwa mehr als einem Jahr die Version 3.0 veröffentlicht wurde und somit alle Plattformen unterstützt werden. 

Flutter macht die Entwicklung von Apps auf mehreren Plattformen leicht. Dabei wird Flutter primär für die Entwicklung von Android und iOS-Apps verwendet. Der Platzhirsch React Native bekommt immer mehr Konkurrenz und verliert immer mehr Marktanteile. Mit der Version 2.0 existierten weit mehr als 150.000 Apps von Flutter im Play Store. 

Die Entwicklung von Desktop-Anwendungen war früher nur mit verschiedenen Programmiersprachen möglich. Flutter ermöglicht es jetzt mit einer Code-Basis auf mehreren Plattformen gleichzeitig zu veröffentlichen. Da die Unterstützung von Desktop-Anwendungen erst vor kurzem bereitgestellt wurde, muss sich Flutter hier noch beweisen.  

Die große Unterstützung von Google für Flutter wurde bei der Google I/O 2022 sehr deutlich, neben etlichen neuen Features, die es in die Version 3.0 geschafft haben, kriegen Googles Hausmarken wie z.B. Firebase immer mehr Unterstützung für die Integration. Dabei werden Packages von Google veröffentlicht, die die Services wie Authentication, Firestore Database, Realtime Database, Storage, Analytics etc. anbieten. 

Darüber hinaus besitzt Flutter auch eine große Community, die etliche Packages zur Verfügung stellt. Hierzu gehört beispielsweise das flutter_bloc-Package, das die Implementierung des BLoC (Business Logic Component)-Designmusters erleichtert.

Google hat mit Flutter einen neuen Ansatz für Multi-Plattform-Entwicklung gemacht. In der Mobile-Entwicklung hat Flutter schon einen großen Marktanteil erreicht, auf den anderen Plattformen wird sich das noch zeigen. Sowohl die Integration der Google-Services als auch die große Community unterstützten Flutter immer besser und leichter zu werden.

Ich gehe davon aus, dass Flutter immer mehr an Bedeutung in der Industrie findet,da große Unternehmen wie BMW und Toyota Flutter heute schon nutzen.

![Alt](/assets/images/posts/Flutter#1–Entwicklung-und-Abgrenzung/Popularität.png,"Examples Apps")


