---
layout: [post, post-xml]              # Pflichtfeld. Nicht ändern!
title:  "Wie kognitive Verzerrungen unsere IT-Sicherheit gefährden können (1/2)"         # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2021-06-18 10:00              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2021-06-18             # Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author: vschiller                       # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: [Softwareentwicklung]     # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [IT-Sicherheit, Security Awareness, Cognitive Bias]   # Bitte auf Großschreibung achten.
---

Kognitive Verzerrungen (cognitive biases) hat jeder Mensch, niemand kann sich davon freisprechen. 
Das liegt vor allem daran, dass unser Gehirn darauf ausgelegt ist, effizient zu denken und Entscheidungen zu treffen. 
Und in der Welt der IT-Sicherheit müssen viele Entscheidungen getroffen werden: Als Mensch, in der Zusammenarbeit, in der Implementierung von Software und insbesondere KI Lösungen. 

# Schnelles Denken – Langsames Denken

Unser Kopf denkt mit zwei verschiedenen Systemen. 
System eins ist unser schnelles System. 
Durch dieses System können wir intuitiv schnelle, automatisierte Entscheidungen treffen. 
So brauchen wir z.B. nicht lange darüber nachdenken, ob wir heute morgen einen Kaffee trinken wollen oder nicht, wenn wir sowieso jeden Morgen Kaffee trinken. 

Im Gegensatz hierzu gibt es System zwei. 
Dieses System ist unser langsames Denksystem. 
Wir müssen intensiver über eine Entscheidung nachdenken. 
Dabei nehmen wir viele Informationen wahr, können mehrere Faktoren in unsere schlussendliche Entscheidung mit einfließen lassen und zu einem besseren Ergebnis kommen. 
Wenn uns zum Beispiel eine längere und komplizierte Rechenaufgabe gestellt wird, müssen wir intensiver über das Ergebnis nachdenken.

System eins ist immer schneller und effektiver als System zwei. 
Wie sähe auch eine Welt aus, in der wir jeden Morgen lange über die Vor- und Nachteile eines morgendlichen Kaffees an genau diesem Morgen nachdenken würden. 
Wir wären ineffizient und langsam wie eine Schildkröte. 
Das Problem an diesen zwei Systemen ist, dass uns nicht aktiv bewusst ist mit welchem System wir gerade Entscheidungen treffen. 
Eventuell treffen wir Entscheidungen mit System eins, aufgrund von „Weil wir das schon immer so getan haben“, unserem Bauchgefühl oder unserer Intuition und hinterfragen diese nicht weiter, sondern vertrauen darauf. 
System eins ist immer schneller, als dass wir es wirklich hinterfragen könnten. 
So kommt es schnell zu Schubladendenken und zu sogenannten kognitiven Verzerrungen. 

# Kognitive Verzerrungen - Eine Auswahl

Es gibt eine ganze Reihe von kognitiven Verzerrungen, zur Übersichtlichkeit wird nur eine Auswahl vorgestellt und auf diese anschließend eingegangen:

## Ankereffekt (Anchorring effect)

Der Ankereffekt tritt ein, wenn eine Person sich auf ein spezifisches Merkmal oder eine Reihe von Informationen in einem frühen Stadium des Entscheidungsprozesses festlegt. 
Ausschlaggebend für den Entschluss ist meistens die erste Information, die ein Mensch erhält, der sogenannte Anker. 
Bei Verhandlungen kann beispielsweise der Anfangspreis der Anker sein, an dem sich die nachfolgende Verhandlung orientiert. 

## Attributionsfehler (Correspondence bias)

Der Attributionsfehler beschreibt die Zuschreibung bestimmter Charaktereigenschaften als Ursache für das Handeln von Menschen, nicht aber der situationsbedingten Ursachen. 
Wenn beispielsweise ein 86-jähriger Mensch in einen Autounfall verwickelt wird, wird sofort das Attribut Alter als Ursache für den Unfall vermutet, unabhängig davon, ob vielleicht eine dritte Person oder andere äußere Umstände wie Glatteis für den Unfall verantwortlich waren. 

## Bestätigungsfehler (Confirmation bias)

Diese kognitive Verzerrung beschreibt die menschliche Neigung, Informationen so auszuwählen und zu interpretieren, dass sie die eigenen Erwartungen, Meinungen und Überzeugungen bestätigen. Informationen hingegen, die diesem Standpunkt widersprechen, werden völlig ausgeblendet. Somit werden Informationen nach subjektiven Maßstäben gefiltert.

## Straußeneffekt (Ostrich Effekt)

Der Straußeneffekt ist eine kognitive Verzerrung, die die natürliche Tendenz einer Person darstellt, Situationen zu vermeiden, die sie als negativ wahrnimmt. 
Die Voreingenommenheit ist nach dem Mythos benannt, dass Strauße ihren Kopf in den Sand stecken, wenn sie Gefahr wittern.
Dies ist zwar sachlich nicht korrekt, aber dennoch sehr relevant für das menschliche Verhalten.

## Dunning Kruger Effekt (Overconfidence Bias)

Der Dunning Kruger Effekt ist eine Form der Selbstüberschätzung, dabei beschreibt er die Tendenz von wenig kompetenten Menschen, das eigene Können zu überschätzen und die Kompetenz anderer zu unterschätzen. 
Gleichzeitig unterschätzen kompetente Menschen ihre Fähigkeiten. 
Beispielsweise glauben die meisten Menschen besser im Auto fahren zu sein als andere, oder als Fußballfan kompetenter zu sein als das Trainerteam oder das Management des Vereins. 

## Verfügbarkeitsheuristik bzw. -verzerrung

Nach der Verfügbarkeitsheuristik bemessen Menschen die Wahrscheinlichkeit für den Eintritt eines Ereignisses danach, wie oft sie in jüngerer Vergangenheit ähnliche Ereignisse wahrgenommen haben. 
Je häufiger eine Person auf bestimmte Informationen trifft, desto eher bleiben diese im Gedächtnis. 
So kann sich also die bloße Verfügbarkeit von Informationen auf die individuelle Einschätzung der Eintrittswahrscheinlichkeit eines Ereignisses auswirken.

## Framing Effekt

Der Framing Effekt bedeutet, dass unterschiedliche Formulierungen einer gleichen Information das Verhalten des Empfängers unterschiedlich beeinflussen kann. 
Das Glas kann entweder halb voll oder halb leer sein, die Tatsache bleibt die gleiche, nur die Formulierung begünstigt eine positive oder negative Sichtweise.

## Verzerrungsblindheit (Bias blind spot)

Der Bias Blind Spot ist der gravierendste aller kognitiver Verzerrungen. 
Gemeint ist damit eine Selbsttäuschung aufgrund der Annahme, dass kognitive Verzerrungen zwar existieren, aber nur alle anderen Menschen davon betroffen sind. 
Man glaubt, selbst eine Ausnahme zu sein und von diesen Effekten unberührt zu bleiben. 
Die eigenen Einschätzungen werden als objektiv beurteilet und man glaubt, weniger als andere von solchen Verzerrungen betroffen zu sein. 
Gleichzeitig werden jedoch bei anderen Menschen solche Verhaltenseffekte erkannt. 


# Der Mensch, also wir alle sind manipulierbar 

Kognitive Verzerrungen können insbesondere durch Social Engineers ausgenutzt werden. 
Social Engineering beschreibt dabei eine Technik menschliche Eigenschaften, insbesondere kognitive Verzerrungen systematisch auszunutzen und zu manipulieren, sodass das Zielobjekt bereitwillig Aktionen ausführt, die sie normalerweise nicht vornehmen würde oder dürfte. Dabei kann es sich um die Herausgabe von Informationen, aber auch die Installation von Schadsoftware, oder das Tür aufhalten in das Firmengebäude handeln.

Ein Werkzeug eines Social Engineers sind Spear Phishing E-Mails. 
Ein Angreifer verschickt eine in den Kontext des Zielobjekt passende E-Mail und hofft, dass die Person die angehängte Datei herunterlädt oder auf den Link in der E-Mail klickt. 
Bei wirklich sehr gut gemachten Phishing E-Mails kann anschließend der Confirmation Bias wirken. 
Ich erwarte evtl. eine ähnliche E-Mail und klicke schnell auf den Link oder die Datei und denke gar nicht länger nach, ob es eine Phishing E-Mail hätte sein können oder nicht. 
Oftmals wird das Verhalten diesbezüglich nicht hinterfragt, weil man denkt, dass man auf eine Phishing E-Mail niemals hereinfallen würde (Overconfidence Bias), oder auch weil es in der Vergangenheit noch nicht passiert ist (Verfügbarkeitsheuristik) und die Wahrscheinlichkeit dementsprechend unterschätzt wird. 
Wie erfolgreich jedoch Spear Phishing bzw. eine Phishing Kampagne sein kann, könnt ihr in meinen vergangenen [Blog Beitrag](https://www.adesso.de/de/news/blog/phishing-kampagne-bei-adesso.jsp) nachlesen. 

Ein weiteres Beispiel sind DeepFakes. 
Die Bezeichnung Deepfake ist aus der Verschmelzung der Begriffe Deep Learning und Fake entstanden und bezeichnet mediale Inhalte (Video, Audio, Fotos), die authentisch wirken, aber mit Hilfe von Künstlicher Intelligenz, beziehungsweise Deep Learning, verändert wurden. 
Ein berühmtes Beispiel dafür ist ein Video von Barack Obama, das mithilfe dieser Technik erstellt wurde. 
Das Problem ist, dass DeepFakes sehr gut gemacht sind und man glauben könnte, dass die Person diese Aussagen wirklich tätigen könnte. 
Oder ist es unwahrscheinlich, dass Barack Obama Donald Trump als [Idioten](https://www.youtube.com/watch?v=cQ54GDm1eL0) bezeichnet? 
Der Confirmation Bias könnte uns genau das zunächst glauben lassen. 
Wenn nun gezielt FakeNews mithilfe solcher Videos verbreitet und nicht hinterfragt werden, können diese FakeNews unsere Meinung oder Haltung beeinflussen. 
Dies kann so weit führen, dass Meinungen radikalisiert werden können und eine Situation wie bei [Pizzagate](https://www.sueddeutsche.de/politik/neuer-us-praesident-wie-trumps-team-fake-news-streut-1.3283617) entsteht.

Jedoch braucht es dafür nicht nur DeepFakes und Fake News oder Social Engineering. 
Auch heutzutage können unsere Daten verwendet werden, um uns gezielt durch Confirmation bias und Framing in eine gewollte Richtung zu drängen. 
Dies geschah bereits durch Cambridge Analytica bei der US-Präsidentschaftswahl 2016, um ein bestimmtes Wahlverhalten zu fördern und bescherte Facebook seinen bis dato größten [Skandal](https://www.sueddeutsche.de/digital/cambridge-analytica-facebook-brittany-kaiser-1.4747594).

Doch noch einmal zurück zu den Social Engineers und ihre neuen Möglichkeiten durch den Einsatz von Künstlicher Intelligenz.
Wenn DeepFakes immer besser werden und auch in Echtzeit erstellt und verwendet werden können, können sie auch in Online Meetings Tool eingesetzt werden. 
So könnte es sein, dass ein Mietglied des Vorstandes durchklingelt und schnelle Informationen oder Tätigkeiten verlangt.
Wieder muss der betroffene Mensch schnell reagieren und eine Entscheidung treffen. 
Und je glaubhafter die Situation, umso eher besteht die Gefahr auf den Social Engineer hereinzufallen und seinen Forderungen nachzugehen. 
Dies kann somit auf die IT-Sicherheit verschiedenster Unternehmen (ohne entsprechende Gegenmaßnahme) treffen, daher stuft das BSI in ihrem [Lagebericht](https://www.bsi.bund.de/DE/Service-Navi/Publikationen/Lagebericht/lagebericht_node.html) und die [BaFin Cybercrime Perspektive](https://www.bafin.de/SharedDocs/Downloads/DE/BaFinPerspektiven/2020/bp_20-1_cybersicherheit.pdf?__blob=publicationFile&v=5 ) DeepFakes als ein großes Sicherheitsrisiko für die Zukunft ein. 

Im zweiten Teil dieses Artikels wird vermehrt auf die Auswirkung solcher kognitiven Verzerrungen in der Zusammenarbeit und Implementierung in der Softwareentwicklung eingegangen. 
Außerdem wird darauf eingegangen, was getan werden kann, dass die Wahrnehmungen des Menschen nicht zur Sicherheitslücke werden. 

Wer in der Zwischenzeit mehr über unsere Denksysteme, dem sei das Buch „Schnelles Denken, langsames Denken“ von Daniel Kahnemann empfohlen.

Weitere Informationen zu DeepFakes gibt es in den Videos von [Leschs Kosmos](https://www.zdf.de/wissen/leschs-kosmos/deepfakes-der-manipulation-ausgeliefert-100.html) und im Youtube Video von [funk](https://www.youtube.com/watch?v=EFR1XYZXhdU) zu sehen. 

Wie Manipulation in den sozialen Netzwerken eingesetzt werden kann, zeigt zudem die Dokumentation „The Social Dilemma“ von Netflix.
