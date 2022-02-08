---
layout: [post, post-xml]              
title:  "Rust Rocks"                  
date:   2021-11-28 14:00              
modified_date: 2021-11-28 14:00       
author_ids: [christianlunau]          
categories: [Softwareentwicklung]     
tags: [Rust, Nachhaltigkeit, Energieeffizienz, Performance]                          
---
Hin und wieder treten neue Programmiersprachen auf den Plan, die meist schnell wieder in der Bedeutungslosigkeit verschwinden.
Nur selten wird eine neue Sprache gleichermaßen von einer großen Community getragen und von globalen IT-Firmen zur Umsetzung der eigenen Kernprojekte verwendet.  
Rust ist eine solche seltene Sprache.  

# Rust Rocks!

___Nachhaltigkeit, Performance und Sicherheit.___

## Was ist Rust?

Rust ist eine Multiplattform- und [Multiparadigmen-](https://de.wikipedia.org/wiki/Programmierparadigma)Programmiersprache, die als Open Source veröffentlicht wurde und von einer großen Community aktiv weiterentwickelt wird. Die Sprache ist darauf ausgelegt, möglichst viele Aspekte für Performance und Sicherheit so anzubieten, dass diese schon zur Compile-Zeit erzielt werden und während der Laufzeit der erzeugten Applikationen nicht mehr erledigt werden müssen. Das erspart z.B. aufwendiges Speichermanagement und Aufräumen mittels Garbage-Collector-Mechanismen, was sowohl der Laufzeitperformance wie auch der Vorhersagbarkeit von Laufzeiten zugute kommt.  

Aufgrund der Struktur von Rust sind die Kosten der Sprachabstraktionen so gering wie nur möglich, wodurch eine mit C/C++ vergleichbare [Performance](https://prev.rust-lang.org/de-DE/faq.html#how-fast-is-rust) möglich wird, ohne dabei die benötigte Speichersicherheit zu vernachlässigen. So wird z.B. zur Compile-Zeit durch einen Borrow-Checking genannten Mechanismus sichergestellt, dass jederzeit(!) klar ist, welcher Variableninhalt aktuell gültig (und in-scope) ist. Stichwort Highlander-Prinzip: Es kann nur einen ([Owner eines Speicherbereichs](https://doc.rust-lang.org/1.8.0/book/references-and-borrowing.html#the-rules)) geben. Alle anderen dürfen gucken (Speicherinhalt lesen), aber nicht anfassen (Speicherinhalt verändern). Verlässt der Besitzer den Raum (geht 'out of Scope'), geht der Besitz in die Tonne (gehaltener Speicher wird automatisch freigegeben).  

Dass alles korrekt koordiniert wird, wird durch den Borrow-Checker zur Compile-Zeit sichergestellt. Ein im Hintergrund laufender Garbage-Collector zum Einsammeln der freien Speicherbereiche ist nicht erforderlich.  

Kein dauernd laufender Aufräumprozess im Hintergrund bedeutet:  
-> kein zusätzlicher Laufzeitaufwand  
-> somit geringere Anzahl ausgeführter CPU-Befehle  
-> höhere Performance und geringerer Energiebedarf.  

Zudem wird Rust-Sourcecode nativ kompiliert, was die Grundlage für die hohe Performance ist: Zur Laufzeit wird nicht mehr interpretiert oder als Bytecode durch eine Virtuelle Maschine verarbeitet. Rust-Programme sind wie Eisenoxid - nah am "Bare Metal" der Maschine, da ist nichts mehr dazwischen.

## Wer steckt dahinter?  

![Rust_Mitglieder_und_Sponsor]

Ursprünglich wurde Rust von Mozilla entwickelt, bevor die Aufsicht über die Weiterentwicklung dann an die Ende 2020 neu gegründete [Rust Foundation](https://foundation.rust-lang.org/) übergeben wurde.  
Gründungsmitlieder der Foundation sind [Microsoft](https://www.microsoft.com/de-de/), [Huawei](https://www.huawei.com/en/?ic_medium=direct&ic_source=surlent), [Google](https://www.google.com/), [Amazon/AWS](https://aws.amazon.com/de/) und [Mozilla](https://www.mozilla.org/de/).
Diese stellen auch das Board of Directors.
Dazu kommt noch [Meta (Facebook)](https://opensource.fb.com/) als Platin-Sponsor und weitere bekannte Namen wie z.B. [arm](https://www.arm.com/), [Dropbox](https://www.dropbox.com/), [Threema](https://threema.ch/de) und [Toyota-Connected](https://www.toyotaconnected.com/).  

Aber fast am Wichtigsten ist die hinter Rust stehende
___extrem positive und hilfsbereite Community!___  
Einen guten Einstieg bietet zum Beispiel die Seite [users.rust-lang.org](https://users.rust-lang.org/).

### ...und was machen die mit Rust?

- __Mozilla__: Mozilla verwendet Rust in vielen seiner Hauptapplikationen, u.A. [Servo](https://servo.org/) und [Schlüsselkomponenten von Firefox](https://medium.com/mozilla-tech/a-quantum-leap-for-the-web-a3b7174b3c12)
- __Dropbox__: Mehrere [Komponenten des Dropbox Kern-Dateispeichersystems](https://dropbox.tech/infrastructure/rewriting-the-heart-of-our-sync-engine) wurden in Rust neu geschrieben mit dem Ziel, eine höhere Effizienz im Datacenter zu erreichen. Es wird aktuell für jeglichen Dropbox-Speicher verwendet und bedient über 500 Millionen anwendende Personen.  
- __Amazon/AWS__: Amazon/AWS hat kürzlich wichtige Teile der Video-App für Prime Video [von JavaScript auf Rust + Webassembly umgestellt](https://www.amazon.science/blog/how-prime-video-updates-its-app-for-more-than-8-000-device-types). Dabei seien in ersten Tests  Geschwindigkeitssteigerungen um das 10- bis 25-fache erreicht worden. Die Bildwiederholrate nähert sich dadurch nun 60 FPS auf jedem der unterstützten Geräte.  
AWS hat Rust schon länger für performancekritische Dinge in Lambda, EC2 und S3 verwendet. Die [Firecracker VMM](https://firecracker-microvm.github.io/) ist komplett in Rust geschrieben.  
- __Google__: Google hat sein experimentelles Betriebssystem [Fuchsia](https://fuchsia.dev/fuchsia-src/development/languages/rust) zum [Teil in Rust](https://www.reddit.com/r/rust/comments/k9r3s4/fuchsia_lines_of_code_over_last_two_years_c_c_rust/) geschrieben, plant [Rust als Systemsprache für Android](https://security.googleblog.com/2021/04/rust-in-android-platform.html) einzuführen und untersucht Möglichkeiten, die Speichersicherheit in [Chrome durch Verwendung von Rust zu verbessern](https://security.googleblog.com/2021/09/an-update-on-memory-safety-in-chrome.html).
- __Microsoft__: Microsoft hat mit [Rust for Windows](https://crates.io/crates/windows) einen Rust crate veröffentlicht, der es ermöglichen soll die komplette Windows-Api aus Rust heraus zu nutzen und bietet mittlerweile selbst eine [Schulung zu Rust](https://docs.microsoft.com/en-us/learn/paths/rust-first-steps/) an. Siehe auch [Microsoft: Why Rust for safe systems programming](
https://msrc-blog.microsoft.com/2019/07/22/why-rust-for-safe-systems-programming/).
- __Meta/Facebook__: Hat seinen Source Control Backend von Python nach Rust portiert, hier ein [Video zu dem Thema](https://youtu.be/kylqq8pEgRs) von einer der Rust-Konferenzen.

Und sonst so?

Eine ganze Reihe von Firmen und Organisationen setzen mittlerweile Rust in ihren Projekten ein, hier eine Liste von [production users](https://www.rust-lang.org/production/users). Eine Weitere Aufstellung von Projekten ist von [Sylvain Kerkour hier [Rust in Production 2021](https://kerkour.com/rust-in-production-2021/) veröffentlicht worden.

An dieser Stelle noch zwei Beispiele:

- Discord: Hier werden Rust und Elixir verwendet um eine Skalierung auf  11 Million gleichzeitige Nutzer mittels Elixir NIFs (Native Implemented Functions) zu realisieren. Dabei [ermöglicht Rust eine Beschleunigung der bestehenden Elixir codebase, wobei gleichzeitig die Speichersicherheit gewährleistet wird](https://blog.discord.com/why-discord-is-switching-from-go-to-rust-a190bbca2b1f). Zusätzlich wurde der Read States Service in Rust neu geschrieben, der ursprünglich in Go implementiert worden ist. Während die Go-Version des Services zwar meist schnell genug war, kam es gelegentlich zu großen Latenz-Spitzen, welche sich auf Go’s Speichermodell und den dabei verwendeten Garbage-Collector zurückführen ließen. Um dies zu beheben hat Discord zu Rust gewechselt, das über ein einzigartiges memory allocation system verfügt, welches garbage-collection unnötig macht.  

- Rust auf dem Weg in den Linux-Kernel: Es sind bereits einige (zunächst kleine) [Teile im Linux-Kernel in Rust implementiert](https://www.golem.de/news/programmierung-rust-landet-erstmals-in-wichtigem-linux-kernel-zweig-2103-155134.html) worden, [Linus Torvalds steht dem vorsichtig-positiv](https://www.golem.de/news/programmiersprache-linus-torvalds-kann-sich-rust-im-linux-kernel-vorstellen-2007-149627.html) gegenüber.  
Das [Rust-4-Linux](https://github.com/Rust-for-Linux/linux)-Team hat mittlerweile einen Großteil der Linux-C-Api in Rust verfügbar gemacht, so dass diese für in Rust geschriebene Kernel-Mode-Programme/Module verfügbar sind.

## Worauf läuft's?

Die Rust-Build-Umgebung selbst und mit Rust erzeugte Programme laufen auf [allen relevanten Betriebssystem+CPU-Kombinationen](https://doc.rust-lang.org/nightly/rustc/platform-support.html).  

Von den Rust-Maintaineren gibt es eine in drei Tier abgestufte __Zusicherung der Lauffähigkeit__. Für die folgenden Plattformen ist die Lauffähigkeit garantiert (dies wird als 'Tier 1' bezeichnet):

- 64-bit MSVC (MS-Windows ab Version 7)
- 64-bit Linux (kernel 2.6.32+, glibc 2.11+)
- 64-bit macOS (10.7+, Lion+)
- 64-bit MinGW (Windows 7+)
- ARM64  Linux (kernel 4.2, glibc 2.17+)
- 32-bit MSVC (Windows 7+)
- 32-bit MinGW (Windows 7+)  
- 32-bit Linux (kernel 2.6.32+, glibc 2.11+)

Zu den weiteren unterstützten Plattformen zählen Kombinationen aus einer Vielzahl von CPU-Varianten wie x86/i686/AMD64, ARM, MIPS, PowerPC, RISC-V, SPARC mit Betriebssysteme wie Android, iOS, Fuchsia, Solaris, Illumos, BSD und diversen Varianten von Linux sowie ein paar Exoten.  

Tom Heimbrodt kommt 2019 in seiner Bachelorarbeit ["Evaluierung der Sprache Rust zur Programmierung von Mikrocontrollern" (PDF)](https://comsys.ovgu.de/comsys_media/thesis/finished/BSc/2019+_+Tom+Heimbrodt+_+Evaluierung+der+Sprache+Rust+zur+Programmierung+von+Mikrocontrollern-p-392.pdf) für die Universität Magdeburg zu dem Schluss, dass die Hardwareunterstützung im Mikrocontroller-Bereich schon gut, aber ausbaufähig ist. Er untersucht hier neben der generellen Lauffähigkeit vordringlich Performance und Speicherverbrauch, die oft in der Nähe der zum Vergleich herangezogenen Implementierungen als C-Applikationen liegen.  

Durch die [Unterstützung von WebAssembly/WASM](https://rustwasm.github.io/docs/book/) rückt Rust in die Nähe von JavaScript-Entwicklungen und ermöglicht die Realisierung von [höher Performanten Applikationen auch für Web-Umgebungen](https://developer.mozilla.org/en-US/docs/WebAssembly/Rust_to_wasm).  Elisabeth Schulz hat das in ihrem im Juni 2021 auf Informatik Aktuell veröffentlichten Artikel ["Serverless und doch Metal: AWS Lambda mit Rust"](https://www.informatik-aktuell.de/betrieb/virtualisierung/serverless-und-doch-metal-aws-lambda-mit-rust.html)  näher beleuchtet.

Mit Hilfe von CI-Pipelines in [GitHub](https://github.com/)-Actions, [TravisCI](https://www.travis-ci.com/), [AppVeyor](https://www.appveyor.com/) oder anderen lassen sich Builds, Tests und Deployment auch für unterschiedliche Plattformen parallel durchführen.  

## Was macht Rust besonders?

- [Memory safety](https://winfuture.de/news,124128.html): Zur Compile-Zeit durchgesetzt, zur Laufzeit ohne Performanceverluste vorhanden.
- Performance: Nahe beim erreichbaren Maximum.  
- Energieeffizienz: Durch die sparsame Nutzung der Computerresourcen (damit ist geringer CPU-Anspruch und moderater RAM-Speicherverbrauch gemeint) wird für die Ausführung von Rustprogrammen verhältnismäßig wenig Energie benötigt.
- Multiplattform: von Anfang an nicht nur portabel, sondern portiert.  
- Fehlermeldungen zur Compile-Zeit, die nicht nur Sinn ergeben, sondern hilfreich bis lehrreich sind.  
- [Cargo](https://doc.rust-lang.org/cargo/guide/index.html): Integriertes Standard Build-Tool und [Repository](https://crates.io/)-Integration.  
- Dependencies (zu Versionen von crates (Libraries)) werden ebenfalls von cargo gehandhabt.
- Durch standardisierte und einfach steuerbare Dependencies kann auf entdeckte Security Vulnerabilities in Open-Source Libraries schnell und leicht reagiert werden  
- [cargo clippy](https://dev.to/cloudx/rust-and-the-hidden-cargo-clippy-2a2e): bietet ausgefeiltes static linting  
- [cargo doc](https://doc.rust-lang.org/cargo/commands/cargo-doc.html): Automatisierte Dokumentationserstellung mittels 'Inline-comment to html-doc' im Standard mitgeliefert  

__Die Kombination von geringem Energieverbrauch, hoher Performance und gleichzeitig hoher Speichersicherheit macht Rust einzigartig.__

Insgesamt bietet Rust schon mit dem mitgelieferten Build-Tool cargo eine umfassende und moderne Programmierumgebung, deren Möglichkeiten bei anderen Programmiersprachen erst durch Ergänzung weiterer, externer Tools annähernd erreicht werden könnte.  
Mit dem Plugin [RustAnalyzer](https://marketplace.visualstudio.com/items?itemName=matklad.rust-analyzer) existiert zudem eine hervorragende Einbindung in die Visual Studio Code IDE.  

### Energieeffizienz

Heute eingesetzte Programme laufen oft und viel auf Geräten, bei denen der Energiebedarf direkt mit der Nutzbarkeitsdauer des Gerätes gekoppelt ist. Smartphones zum Beispiel bedanken sich mit längerer Akkulaufzeit für höherperformante Apps. Erst recht gilt das, je kleiner die Geräte werden, z.B. im IOT-Bereich.  

Aber auch am anderen Ende der Skala ist Energieverbrauch von Software durchaus relevant: In großen Rechenzentren ist die erzeugte und abzuführende Temperatur direkt gekoppelt mit der Last, die auf den CPUs der Maschinen liegt. Mit effizienterer Software kann nun entweder mit der selben Last mehr getan werden (mehr Kunden bedient werden) oder die Dimensionierung der Maschinen kann für dieselbe Leistung kleiner ausfallen, und somit z.B. kostbaren Strom sparen.

In Zeiten, in denen wir aktiv planen die schon sichtbaren Auswirkungen des Klimawandels zu verringern, ist Energieeffizienz __sehr relevant__.  

Dass durch höhere Performance der gelieferten Applikationen die User glücklicher werden können ist dabei ein weiterer schöner Effekt.

Durchaus vorstellbar ist zudem, dass schon bald auf Nachhaltigkeit bedachte europäische Regierungen die Energieeffizienz von industriellen Erzeugnissen (also auch Software) einfordern werden. Vielleicht in Form einer genaueren Ausarbeitung der [Energieeffizienzrichtlinie des Europaparlaments](https://www.europarl.europa.eu/factsheets/de/sheet/69/energieeffizienz) im Rahmen der [Green-IT](https://www.greenit-solution.de/europaeische-rechenzentren-sollen-bis-2030-klimaneutral-sein) Initiative.

Die Effizienz der Erstellung von Software, also die Zeit, die wir benötigen um sie korrekt lauffähig, sicher und schön zu machen, ist im Vergleich zur später anfallenden Betriebs-Laufzeit verschwindend gering. Insbesondere dann, wenn man die Zeit mit der Anzahl der Installationen/Geräte multipliziert.  
Es muss also völlig egal sein, ob zur Software-Erstellung jetzt Zeit J oder eine geringfügig längere Zeit R benötigt wird, wenn durch verbesserte Energieeffizienz und Performance dann während der Betriebszeit dauerhaft weniger Energie verbraucht wird. Da fertige Rust-Applikationen zudem noch mit hoher Wahrscheinlichkeit durch weniger Laufzeitprobleme (weil z.B. Speicherfehler vermieden werden) und angenehmere User-Experience (durch kürzere Response-Zeiten) die Menschen erfreuen, ist erst recht klar, dass wir alle davon profitieren.

Betrachtet man als Entwicklungszeit nicht die Zeit bis zur Auslieferung der ersten Version eines Produktes, sondern bis es nachprüfbar stabil und verlässlich auch 'im Feld' läuft, dann kann erwartet werden, dass diese Fertigstellungszeit in Rust eher kürzer ist als bei Projekten in solchen Programmiersprachen, die ihren Reifegrad erst zur Anwendungszeit entfalten.  

#### Studie zur Energieeffizienz von Programmiersprachen

Vor einiger Zeit hat eine Forschergruppe in Portugal (Rui Pereira
HASLab/INESC TEC, Universidade do Minho, Portugal et al.: [Energy Efficiency across Programming Languages](https://www.sciencedirect.com/science/article/abs/pii/S0167642321000022?via%3Dihub)) näher untersucht, wie es mit Ausführungsgeschwindigkeit, Speicherverbrauch, Startzeiten, Kompilierdauer und weiteren Details bei verschiedenen Programmiersprachen aussieht und im Mai 2021 dazu einen vielbeachteten Artikel veröffentlicht. Eine ältere Vorversion dieser Arbeit kann man sich [hier](https://greenlab.di.uminho.pt/wp-content/uploads/2017/09/paperSLE.pdf)) ansehen.  

Dabei wurden für alle beteiligten Sprachen jeweils möglichst effiziente Implementierungen für dieselben Algorithmen gewählt und diese auf derselben Hardware und in derselben Betriebssystemumgebung ausgeführt.  

Ende Mai 2021 hat [Christian Meesters diese Ergebnisse noch mal aufbereitet](https://scienceblogs.de/rupture-de-catenaire/2021/05/03/die-energie-effizienz-von-programmiersprachen/) und die Ergebnisse im folgenden Diagramm übersichtlich dargestellt:

![energy_efficiency_langs]  
Das Diagramm ist freundlicherweise unter der sehr freigiebigen [CC-BY SA 4.0-Lizenz](https://creativecommons.org/licenses/by-sa/4.0/deed.de) veröffentlicht.  

Zu sehen ist hier jeweils der Energieverbrauch des Test-Sets an Implementierungen, relativ normiert zu der energiesparendsten Sprache, welche C ist und die den Wert '1' erhalten hat. Die anderen Sprachen benötigen für dieselben Aufgaben dementsprechend die Y-fache Energie.  

Schaut man sich die Ergebnisse im Detail an, dann ergibt sich aus der Originalstudie, dass für diese Berechnungsaufgaben Rust etwa 3,5% mehr Energie benötigt als C und beide auch fast gleich schnell sind. Java-Applikationen benötigen ungefähr doppelt so viel Energie und Zeit wie solche in Rust. Insbesondere benötigen Lösungen in VM-basierten Sprachen und erst recht Skript-Sprachen generell ein Vielfaches der Energie und Zeit von compilerbasierten Sprachen.  

Je nach tatsächlich getestetem Algorithmus weichen in der Studie die Werte ein wenig ab, bleiben in ihrer Relation zueinander aber im Wesentlichen gleich angeordnet.  

Betrachtet man statt der zum Energieverbrauch analogen Performance die bei der Ausführung benötigten RAM-Mengen, so ist das Ergebnis ähnlich:  
Rust benötigt hier zwar 54% mehr RAM (Faktor 1,54) als die speichersparsamste Programmiersprache, welche in diesem Vergleich Pascal ist. Der Speicherbedarf der Pascal-Programme liegt sehr knapp unter denen in Go und C. Im Vergleich zum Rust-Speicherbedarf benötigt aber zum Beispiel JavaScript das 4,56-fache, Java das 6,01-fache und das Schlusslicht im Speicherverbrauch, Jruby das 19,84-fache an RAM.  

Kritisch betrachtet ist natürlich nicht jede Sprache für dieselben Zwecke gleich sinnvoll einzusetzen. So eignen sich Skriptsprachen gut für 'mal eben' zu implementierende Datenstromverarbeitungen auf Backend-Rechnern, während sich kompilierte Applikationen eher für Anwendungsfälle eignen, in denen es auf maximalen Datendurchsatz oder verlässlich-schnelle Reaktionszeiten an kommt.

Unangenehmer Weise gibt es hier eine __Korrelation zwischen der beobachteten Energieeffizienz einer Sprache und ihrer Erlernbarkeit__:  
Gerade die effizienten Sprachen sind eher schwerer zu erlernen. Während man mit Perl mal schnell was Lauffähiges hingekritzelt bekommt und in Java recht zügig Programme erzeugt werden können, die so aussehen als würden sie nicht abstürzen, ist das bei Rust anders: Beim Kompiliervorgang steht hier zum Beispiel der Speicher-Wächter (Borrow-Checker) vor der Tür und spricht ein deutliches "You shall not pass!", bis auch wirklich alle Referenzen und Speichergültigkeiten (scopes, lifetimes) korrekt behandelt sind.  
Danach hat man dann allerdings auch einigermaßen Sicherheit, dass das erzeugte Kompilat korrekt mit dem Speicher umgeht.  

### Security

__Die Log4J-Lücke, jemand betroffen?__  

Gegen Features, die explizit in eine Applikation oder Library hineinprogrammiert werden, kann auch eine noch so gute Absicherung in der verwendeten Programmiersprache nichts machen.  
Gäbe es im Rust-Ökosystem ein vergleichbar programmiertes Library-Feature, dann wäre auch hier 'die Kacke am Dampfen' gewesen.  
Schaut man sich an, wie die Rust-Community, in diesem Fall speziell die Language- und Crate-Maintainer, mit anderen Sicherheitslücken umgegangen sind, dann findet man folgendes:  

Ende 2021 gab es einen [Bug im Unicode-Handling](https://blog.rust-lang.org/2021/11/01/cve-2021-42574.html) des Rust-Compilers, der potenziell dazu hätte genutzt werden können, im Sourcecode verschleiert ineffektive Zugangsprüfungen einzuschleusen. Dabei sieht der Sourcecode für einen menschlichen Leser zunächst ok aus, der Compiler ersetzt dann aber die Prüfung einer Passwortvariablen mit einem konstanten Wert.  

Das ist nicht ganz so eine Katastrophe wie der Log4Shell-Bug, aber definitiv unschön.  

2021-07-25: wurde die Vulnerability an das zuständige Rust Team gemeldet, welches mit der Arbeit an einer Lösung begann.  
2021-09-14: dem Team wird der Termin 2021-11-01 für die Presseveröffentlichung des Problems mitgeteilt.  
Bis 2021-10-17 sind dann ALLE jemals auf dem zentralen Repository für Rust-Libraries (crates.io) veröffentlichen Sourcen auf diese Angreifbarkeit hin analysiert worden.  Insgesamt wurden dabei 5 Sourcen gefunden, die eine  dem Angriffszenario ähnelnde Unicode-Prüfung enthielten, keine davon war tatsächlich bösartig.  
2021-11-01: Das Presse-Embargo wird aufgehoben, die Angreifbarkeit veröffentlicht und das gefixte Rust 1.56.1 herausgegeben. Zum Beispiel [schreibt heise hier darüber](https://www.heise.de/news/Angreifer-koennten-Source-Code-trojanisieren-der-trotzdem-legitim-aussieht-6237686.html).

Nun ist die Angreifbarkeit hierbei anders geartet als bei Log4J: Während es bei der Java-Logging-Library reicht, einen bösartigen Text durch beliebige, fremde Software loggen zu lassen, muss bei dem Unicode-Check schon Sourcecode in ein Endprodukt eingeschleust werden. Theoretisch ist das über Open-Source-Libraries möglich, die allerdings im Falle von Rust fast ausschließlich über das crates.io-Repository angeboten werden. Wie das Rust-Team gezeigt hat, kann hier durchaus nach Sicherheitslücken gefahndet und diese können ggf. auch rechtzeitig behoben werden.  

Das ist aber nur die halbe Miete:  
Wie bekommen Anwendende denn jetzt die bereinigte Version auf ihre Rechner? Hier wird's etwas vertrackt. Anders als bei vielen gebräuchlichen Programmiersprachen werden Applikationen in Rust im Normalfall statisch gelinkt. Das bedeutet, dass man zwar einerseits der DLL-/Shared-Library-Hölle entkommt (und einige weitere Vorteile hat), andererseits aber auch, dass eine anfällige Library nicht, wie bei Log4J, mal eben durch Betreibende/Anwendende ausgetauscht werden kann. Denn es steckt ja alles in der fertig gelinkten Applikation. Hier muss also zunächst der Anbietende/Entwickelnde tätig werden und eine neue Version des Executables erstellen. Vorzugsweise, bevor die Vulnerability der verwendeten Library veröffentlicht wird...  

Einerseits können Anwendende/Betreibende bei Rust-Applikationen keine Sicherheitslücke durch Austauschen einer externen Bibliothek fixen, andererseits muss man das bei Rust auch nicht: Die Pflege der Anwendungsbinaries selbst obliegt den Anbietenden, also zum Beispiel uns - machen wir dann doch gerne.  

## Anekdote: Der Your-Code-Is-Inefficient-Error

Der folgende Screenshot zeigt eine Konsolenausgabe, wie sie der Rust-Compiler im Fehlerfall typischerweise zeigt. Man sieht einen Code-Ausschnitt, mit Zeilennummern und exakten Angaben, wo welcher Fehler auftritt, oft auch gleich angereichert mit Hinweisen zu Fehlerbehebung und Verbesserung des Codesegments:
![bubblesort_as_a_Bug]

Bitte genau hinschauen: der Compiler bemängelt hier, dass der Entwickler offensichtlich etwas sortieren will, dafür aber den bekanntermaßen ineffizienten Algorithmus 'Bubblesort' gecodet hat. Dies lehnt der Compiler mit einer Fehlermeldung ab...  

OK, das ist ein in der Rust-Community entstandener Hoax, so weit geht der Compiler dann doch nicht; Dass dieser Scherz in der Community so ausgebrütet wurde und der Screenshot nach seiner Veröffentlichung viral ging, zeigt aber auch, welchen Stellenwert hilfreiche Fehlermeldungen in der Rust-Community haben. Viele Fehlermeldungen sehen tatsächlich so ähnlich aus, haben eine treffende Genauigkeit und sind mit vergleichbar hilfreichen Informationen versehen. Zu einem gewissen Grad kann man dadurch mittels Try-and-Error das Programmieren in Rust erlernen. Das geht mit Rust besser als in wohl jeder anderen Sprache.

## Warum ist Rust für adesso interessant?

- Nachhaltigkeit und Energieeffizienz
- Hohe Performance spart auch die Zeit jedes und jeder Anwendenden
- Stabilität von Applikationen wird frühzeitiger erreicht
- Technische Qualität der Applikation steigt
- Die Gesamtzeit, bis ein stabiles Produkt entstanden ist, kann verringert werden.

## Fazit

Die Zeit, welche die Vielzahl von Anwendenden damit verbringen, auf Ergebnisse von Softwareberechnungen zu warten oder sich durch zähe Anwendungen zu schleppen, ist nicht zuletzt auch Lebenszeit, die jeder sicherlich sinnvoller als gerade mit Warten verbringen möchte.  

Insbesondere in Zeiten, in denen die zurechnungsfähige Welt das Klima retten will, ist Energieeffizienz ein wesentliches Qualitätsmerkmal von Softwareprodukten.  

Da Rusts Speichersicherheitsmethodik gerade bei langlaufenden Anwendungen zu erhöhter Stabilität und auch verlässlicheren Antwortzeitverhalten führt, kann hier ein verbessertes Verhalten der Software im Betrieb erwartet werden.

Zusammen mit einem guten Tool-Ökosystem und dem freundlich-hilfreichen Compilerverhalten wird daraus ein Gesamtpaket, dass insbesondere für die Implementierung ernsthafter Anwendungen unübertroffen ist.  

__Rust Rocks!__

## Quellen

Die meisten Quellen sind im Text jeweils direkt verlinkt.  

Hier noch ein paar gesonderte Quellangaben:

Christian Meesters (ScienceBlogs.de, 03.05.2021): [Die Energie-Effizienz von Programmiersprachen](https://scienceblogs.de/rupture-de-catenaire/2021/05/03/die-energie-effizienz-von-programmiersprachen/)  

Elisabeth Schulz (auf Informatik Aktuell, 08.06.2021): [Serverless und doch Metal: AWS Lambda mit Rust](https://www.informatik-aktuell.de/betrieb/virtualisierung/serverless-und-doch-metal-aws-lambda-mit-rust.html)

Heise.de (2020): [Warum Rust die Antwort auf miese Software und Programmierfehler ist]( https://www.heise.de/hintergrund/Entwicklung-Warum-Rust-die-Antwort-auf-miese-Software-und-Programmierfehler-ist-4879795.html)

Golem.de (2016): [Ist die neue Programmiersprache besser?](https://www.golem.de/news/rust-ist-die-neue-programmiersprache-besser-1606-121227.html)  

[rust_logo_rusty]: /assets/images/posts/Rust_Rocks/rust-logo-256x256.png "Rust-Logo groß, rostig"  

[rust_logo_black]: /assets/images/posts/Rust_Rocks/rust-logo-blk.svg "rust logo black"  

[energy_efficiency_langs]: /assets/images/posts/Rust_Rocks/Energieeffizienz_all_languages.png "Energy-Efficiency langs"  

[Rust_Mitglieder_und_Sponsor]: /assets/images/posts/Rust_Rocks/RustFoundation_Mitglieder.png "Rust Mitglieder und Sponsor"  

[bubblesort_as_a_Bug]: /assets/images/posts/Rust_Rocks/bubblesort_as_a_Bug.jpg "Bubblesort as a Bug"  
