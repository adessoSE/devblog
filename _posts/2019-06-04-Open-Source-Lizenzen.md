---
layout:         [post, post-xml]              
title:          "Open-Source-Lizenzen und was ich damit machen darf"
date:           2019-06-04 09:30
modified_date:  2019-06-04 09:30
author:         jo2
categories:     [Softwareentwicklung]
tags:           [Open Source, Lizenzen]
---

Auf GitHub, GitLab und ähnlichen Plattformen zur Veröffentlichung von Source-Code wird in nahezu jedem Repository auf eine Lizenz hingewiesen. Aber um Open-Source-Code zu verwenden brauche ich doch keine Lizenzgebühren zahlen und darf den Code verwenden wie ich möchte, oder? Leider nein. Zwischen den einzelnen Lizenzen gibt es einige Unterschiede. Dieser Blogpost soll dabei helfen, die richtige Lizenz für das eigene Projekt zu finden und Projekte von Anderen richtig zu verwenden.

# Lizenzmodelle
Open-Source-Software ist nicht gleich Open-Source-Software. Das merkt man schon, wenn man sich die [Liste der von der Open-Source-Initiative anerkannten Lizenzen](https://opensource.org/licenses/alphabetical) anschaut. Nach momentanem Stand sind dort 82 Lizenzen aufgeführt. Im Folgenden wird ein kurzer Überblick über die gebräuchlichsten Lizenzen gegeben. Disclaimer: Dieser Blogeintrag soll lediglich eine Übersicht über die gebräuchlichsten Lizenzmodelle geben und ist nicht als Rechtsberatung anzusehen. Die hier aufgeführten Informationen stammen von der [Open Source Initiative](https://opensource.org/).

## GNU General Public License version 2 (GPLv2) 
Die GPL ist die am häufigsten verwendete Lizenz und wird beispielsweise von Linux verwendet. Sie erlaubt sowohl private als auch kommerzielle Nutzung. Auch Verarbeitung und Veränderung des ursprünglichen Werks ist erlaubt. Allerdings gibt es hier einige Einschränkungen.

Der Source-Code muss zusammen mit der Lizenztext, bzw. einem Verweis darauf und dem Urheberschutzvermerk weitergegeben werden. Wenn an dem Source-Code Änderungen vorgenommen werden, muss eindeutig kenntlich gemacht werden, wann welche Änderungen vorgenommen wurden.
 
Ein Projekt, das Code verwendet, der unter der GPL steht, oder von solchem Code abgeleitet ist, muss ebenfalls unter der GPL veröffentlicht werden. Eine Ausnahme hierfür bilden Teile des Codes, die eindeutig unabhängig vom Code unter der GPL sind. Werden sie einzeln, und nicht als ganze Arbeit veröffentlicht, gilt die GPL nicht für das ganze Projekt. Durch die Zusammenfassung von Code unter der GPL und Code nicht unter der GPL auf eienm Verteilungsmedium ist die Unabhängigkeit des Codes, der nicht unter der GPL ist, weiterhin gewährleistet. Eine kommerzielle Nutzung des Werkes ist möglich, allerdings müssen dabei die Bedingungen der GPL eingehalten werden.

Mit der Veränderung oder Verteilung des Codes unter der GPL erfolgt eine automatische Zustimmung zu den Bedingunge dieser Lizenz. Auch das Herunterladen von Code zählt bereits als Vervielfältigung, da eine Kopie erstellt wird, die auf dem lokalen Gerät gespeichert wird. Bei Verstößen gegen diese Lizenz erlischen alle Rechte, die diese Lizenz im Bezug auf den betreffenden Code gewährt. 

Die Lizenz bietet keine Garantien. Sollte bei der Verwendung eines Programms unter dieser Lizenz ein Schaden entstehen, so trägt der Verwender den Schaden. Es dürfen nur Gebühren erhoben werden, wenn der Code zusammen mit Dienstleistungen angeboten wird oder zur Kostendeckung für die Herstellung von physikalischen Kopien.

### Unterschiede in der GPLv3
- Anti-Circumvation-Laws: Kein von der GPLv3 abgedecktes Werk soll dazu führen, dass Rechtsansprüche wie in [Artikel 11 der WIPO copyright treaty](https://www.wipo.int/treaties/en/text.jsp?file_id=295166#P87_12240) oder ähnlichen Gesetzen fällig wird.
- Es wurden Regelungen zum Digital Rights Management eingefügt, die verhindern sollen, dass GPL-Software nicht mehr beliebig verändert werden kann um technische Schutzmaßnahmen wie einen kopierschutz zu umgehen.
- Es ist nicht notwendig, die GPLv3 für das alleinige Besitzen einer Kopie, beispielsweise das Herunterladen, des unter der GPLv3 stehenden Werkes zu akzeptieren. Das Bearbeiten oder weitere Verteilen erfordert aber das Akzeptieren der Lizenz.
- Es ist möglich, auf eigene Beiträge in einem Werk unter der GPLv3 Patentansprüche geltend zu machen. In Deutschland ist die Patentierung von Software allerdings nur schwer möglich.
- Eine Kombination mit anderen Lizenzen, zum Beispiel der Apache License, ist möglich.

## GNU Lesser General Public License version 2.1 (LGPLv2.1)
Die LGPL ist der GPL sehr ähnlich. Sie unterscheiden sich allerdings in einem Aspekt. Die LGPL konzentriert sich auf Programmbibliotheken. Sie besagt, dass Code, welcher mit einer Programmbibliothek unter der LGPL arbeitet, nicht unter der LGPL veröffentlicht werden muss. Werden allerdings Code und Bibliothek zu einer ausführbaren Datei zusammengefasst, enthält diese ausführbare Datei die Bibliothek oder einen Teil davon und muss unter der LGPL veröffentlicht werden.

Eine Ausnahme hierzu besteht, wenn offensichtlich darauf hingewiesen wird, dass die Bibliothek unter der LGPL verwendet wurde. Dann muss der Code nicht unter der LGPL veröffentlicht werden, sondern es reicht, wenn Modifizierungen und Reverse-Engineering erlaubt sind und der Source-Code hierfür bereitgestellt wird.

Auch diese Lizenz gewährt keine Garantieansprüche.

### Unterschiede in der LGPLv3
- Es ist möglich, auf eigene Beiträge in einem Werk unter der GPLv3 Patentansprüche geltend zu machen. In Deutschland ist die Patentierung von Software allerdings nur schwer möglich.

## MIT License
Neben der GPL wird mit am häufigsten die MIT-Lizenz verwendet. Diese stammt, wie der Name schon sagt, vom Massachusetts Institute of Technology. Sie ist sehr kurz gehalten und gestattet alle das Werk betreffende Aktionen. Jedoch muss bei der Verwendung oder der Verteilung dieses Werks sowohl der Lizenztext als auch der Urheberrechtsvermerk mit verteilt werden. Ebenfalls schließt sie den Anspruch auf Garantie und Haftung aus.

Der Lizenztext kann [hier](https://opensource.org/licenses/MIT) eingesehen werden.

## Mozilla Public License (MPL)
Die MPL wird beispielsweise von Mozilla für den Firefox und zugehörige Plugins verwendet. Sie erlaubt die Nutzung, Veränderung, Ausführung und Verteilung des Source-Codes unter der MPL einzeln, in einer modifizierten Version oder als Teil eines anderen Projekts. Darüber hinaus gestattet sie jedem Mitwirkenden, seine Beiträge im Rahmen seiner Patentansprüche zu Verkaufen oder zu Übertragen. Sie bietet wie die anderen Lizenzen auch keine Garantieen.

Auch dies ist an einige Bedingungen geknüpft. Code unter dieser Lizenz muss unter dieser Lizenz weitergegeben werden. Eine Einschränkung der durch die MPL gewährten Rechte ist nicht erlaubt. Dabei muss auch auf den Lizenztext hingewiesen werden. Wird Code unter der MPL in einer ausführbaren Version weitergegeben, muss der Source Code und die ausführbare Datei unter der MPL oder einer Sublizenz veröffentlicht werden. Projekte, die Code unter der MPL verwenden, dürfen unter einer beliebigen Lizenz veröffentlicht werden, solange die Bedingungen für den unter der MPL stehenden Teil erfüllt sind.

Es ist erlaubt, Gebühren für Garantieen und Servicedienstleistungen zu erheben. Dies darf aber nur für eigene Bestandteile des Codes gemacht werden. Es muss klar sein, dass Bestandteile von anderen Mitwirkenden nicht darunter fallen. Darüber hinaus muss jedem Mitwirkenden ein durch diese angebotenen Garantieen oder Servicedienstleistungen entstandener Schaden erstattet werden.

Ist es durch Höhere Gewalt, beispielsweise Gerichturteile oder lokal geltende Gesetze, nicht möglich, Teile der Bedingungen der MPL zu erfüllen, müssen die gegebenen Einschränkungen und der Code, den sie betreffen, kenntlich gemacht werden.

Die unter dieser Lizenz gewährten Rechte erlischen automatisch, wenn man den Bedingungen der MPL nicht nachkommt. Sie können aber erneut temporär gewährt werden, wenn man die Bedinungen nachträglich erfüllt. Diese Rechte werden permanent gültig, wenn der Geschädigte dies erlaubt oder er die Rechte nicht innerhalb von 60 Tagen entzieht.

## Apache License
Die Apache License wird beispielsweise von Android, Spring und Docker verwendet und gewährt ebenfalls keine Garantieansprüche.

Jeder Mitwirkende an der Software erteilt mit der Verwendung der Apache License Rechte zur weltweiten und kostenlosen Nutzung, Verteilung, Bearbeitung und Ausführung. Selbiges gilt auch für Teile, auf die ein Patentanspruch geltend gemacht werden kann. Sollte es aber zu Patentstreitigkeiten mit dem Vorwurf, dass das Werk oder ein in das Werk eingebundener Beitrag eine Patentverletzung darstellt, kommen, erlischen alle im Rahmen dieses Werkes erteilten Patentlizenzen mit Einreichen der Klage.

Bei der Verteilung eines Werkes unter der Apache License muss der Lizenztext der Apache License mitgeliefert werden. Darüber hinaus müssen alle Hinweise auf Urheber-, Marken- und Patentrecht sowie Namensnennungshinweise erhalten bleiben. Außerdem muss kenntlich gemacht werden, wer Veränderungen an Teilen des Werks vorgenommen hat.

Änderungen an einem Werk unter der Apache License müssen nicht zwangsläufig unter der Apache License veröffentlicht werden, allerdings müssen die Rechte und Pflichten der dann verwendeten Lizenz mit denen aus der Apache License übereinstimmen. Dies muss eindeutig kenntlich gemacht werden. Geschieht dies nicht, gilt die Apache License.

## Eclipse Public License (EPL)
Die Eclipse Public License wird von der Eclipse Foundation herausgegeben und ist die Standard-Lizenz unter der die Projekte der Eclipse Foundation veröffentlicht werden.

Handelt es sich bei dem veröffentlichten Werk um ein ausführbares Programm, so muss bei der Veröffentlichung auch ein Hinweis mitgeliefert werden, dass der Source-Code unter der EPL steht und wie eine Kopie des Source-Codes erhalten werden kann. 

Das Werk darf auch unter einer anderen Lizenz weiterveröffentlicht werden, wenn diese zweite Lizenz die durch die EPL gewährten Rechte und Pflichten nicht einschränkt. Des Weiteren dürfen Mitwirkende keine Hinweise auf Urheberschaft, Patente, Garantiegewährleistungen oder Haftungsbeschränkungen aus dem Code entfernt werden.

Werke unter der EPL dürfen auch in kommerziellen Produkten verwendet werden, wenn dadurch keine Verpflichtungen für andere Mitwirkende entstehen können. Die ursprünglichen Mitwirkenden sind dabei für alle entstehenden Schäden zu entschädigen.

Auch diese Lizenz gewährt keine Garantieansprüche.

## European Union Public License (EUPL)
Die von der EU herausgegebene EUPL ist eine an europäisches Recht angepasste Version der GPLv2 und ist in allen 22 Sprachen der Mitgliedsstaaten der EU erhältlich.

Die EUPL erlaubt die Nutzung, Vervielfältigung, Veränderung, Verteilung, Vermietung und Unterlizensierung eines Werks. Dies Gilt auch für unter Patent stehende Teile des Werks. Die Veröffentlichung eines ausführbaren Programms erfordert auch immer die Beilage des Source-Code.

Bei Veränderungen in einem Werk unter der EUPL dürfen Informationen zu Urheberschaft, Patenten oder Garantien nicht entfernt werden. Die Weiterveröffentlichung kann auch unter einer späteren Version der EUPL geschehen, wenn das Werk nicht explizit unter einer Version veröffentlicht wurde, selbiges gilt auch für eine Veröffentlichung unter anderen Lizenzen.

Eine Besonderheit ist, dass jede Rechtsstreitigkeit, an der eine Partei aus einem EU-Mitgliedsland beteiligt ist, der Zustädnigkeit der Europäischen Gerichtshofs unterliegt. Alle anderen Rechtsstreitigkeiten unterliegen der Zuständigkeit der Gerichte des Landes, in dem der Lizenzgeber wohnt oder er sein Hauptgeschäft betreibt.

Auch diese Lizenz gewährt keine Garantieansprüche.
