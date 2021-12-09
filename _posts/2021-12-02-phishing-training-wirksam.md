---
layout: [post, post-xml]              # Pflichtfeld. Nicht ändern!
title:  "Wie erfolgreich können Phishing Simulationen sein?"         # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2021-12-03 10:25              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 2021-12-08             # Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author_ids: [vschiller]                 # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesen Namen geben.
categories: [Methodik]     # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [IT-Security, Security Awareness]   # Bitte auf Großschreibung achten.
---

Es war einmal der Bundestaghack und dieser begann mit einer Phishing-E-Mail. 
So kann man es aktuell in dem sechsteiligen Podcast "Der Mann in Merkels Rechner“ hören.  
Phishing ist eine Kunst der Manipulation, die sowohl technisches als auch menschliches Wissen erfordert. 

Um Phishing-Angriffe mittels technischer Maßnahmen abzuwehren, werden E-Mail-Filter oder andere technische Tools wie Sandboxing eingesetzt. 
Eine [Studie](https://www.academia.edu/download/66627615/Phinding_Phish_An_Evaluation_of_Anti-Phi20210423-2819-1wgo0j5.pdf) zeigte jedoch, dass mit zehn getesteten Anti-Phishing-Tools nur 90 % aller Phishing-Seiten korrekt erkannt wurden. 
Die meisten Tools erkannten sogar weniger als 50 %. 

# Technik vs. Mensch 

Wenn technische Maßnahmen also nicht ausreichen, müssen menschliche Maßnahmen greifen. 
Zumal technische Lösungen oft bereits erkannte Phishing-E-Mails, -Server, -Webseiten etc. herausfiltern. 
Es gibt jedoch immer eine Zeitspanne, in der ein neuer Server, eine neue Website oder eine andere neue Angriffstechnik ausprobiert wird, die von der technischen Lösung noch nicht erkannt werden. 
Bei einem Phishing-Angriff ist die entscheidende erste Interaktion nach dem Öffnen der E-Mail der Klick auf einen vermeintlichen Link oder Anhang. 
Wenn also eine E-Mail nicht durch technische Maßnahmen daran gehindert wird, vom Empfangenden abgerufen zu werden, liegt es am Empfangenden, richtig zu handeln. 
Der Klick auf den Link oder Anhang ist die erste notwendige Aktion des Opfers für einen erfolgreichen Phishing-Betrug.
Opfer eines Phishing-Angriffs zu werden, ist in Deutschland nicht unwahrscheinlich. 
Phishing-Angriffe sind auch im Cybercrime Report des [Bundeskriminalamtes](https://www.bka.de/SharedDocs/Downloads/DE/Publikationen/JahresberichteUndLagebilder/Cybercrime/cybercrimeBundeslagebild2020.html;jsessionid=E6BA6ABCD9436276B64F2339DA6397DB.live2302?nn=28110) ein großes Thema: Phishing "ist und bleibt DIE (größte) Bedrohung für Unternehmen und öffentliche Einrichtungen". 
Darüber hinaus zeigt eine Cybersicherheitsumfrage des [BSI](https://www.allianz-fuer-cybersicherheit.de/SharedDocs/Downloads/Webs/ACS/DE/cyber-sicherheits-umfrage_2018.pdf;jsessionid=1D7473A66363C86AA7287EE9D1F63B7E.internet471?__blob=publicationFile&v=1), dass im Jahr 2018 43 % der befragten Großunternehmen von Cybersicherheitsvorfällen betroffen waren, wobei mehr als die Hälfte der Angriffe erfolgreich waren. 
Von den gemeldeten Sicherheitsvorfällen wurde mehr als die Hälfte durch Malware eingeschleust, wobei 90 % davon als Anhang oder Link in einer E-Mail verbreitet wurden. 
In dem Report wird weiter beschrieben, dass in der Hälfte der erfolgreich abgewehrten Fälle technische Maßnahmen eine Infektion verhindern konnten, in den anderen Fällen soll das Bewusstsein der Mitarbeitenden der Erfolgsfaktor gewesen sein. 
Um genau dieses Bewusstsein zu erlangen und die menschliche Firewall zu aktivieren, können Unternehmen heute simulierte Phishing-Schulungen durchführen.

# Simuliertes Phishing-Training

Simuliertes Phishing-Training ist eine Form der Schulung zur Sensibilisierung der Nutzenden für Phishing-Angriffe. 
Ein solches Training soll die Aufmerksamkeit für Sicherheit erhöhen und die Anfälligkeit für Phishing-Angriffe verringern.
Das Training wird durch den Versand von simulierten Phishing-E-Mails realisiert. 
Diese sind mit einem vorbereiteten Link oder Anhang versehen. 
Reagiert die Person auf den Link oder Anhang, können diese (anonymisierten) Daten gesammelt und ausgewertet werden. 
Im besten Fall wird die Person nach dem Anklicken eines präparierten Links oder Anhangs sofort über den Fehler informiert und es wird direkt Schulungsmaterial zur Verfügung gestellt.
Die simulierten Phishing-E-Mails, die verschickt werden, können unterschiedliche Formen annehmen, so dass sie personalisiert werden können, der Absender oder die Absenderin kann irreführend sein oder es können unterschiedliche Kontexte geschaffen werden. 
Auf diese Weise lassen sich unterschiedliche Schwierigkeitsgrade und Trainingseffekte erzielen.

# Simuliertes Phishing-Training in Studien

Diese Form des Phishing-Trainings wurde unter verschiedenen Aspekten untersucht. 
Entweder wurden nur die simulierten Phishing-E-Mails ohne jegliche Aufklärung oder Training verschickt oder weitere Aufklärungen und Schulungen (sowohl online als auch präsent) fanden statt. 
Im besten Fall wurde ein simuliertes Phishing-Training wiederholt, um den Trainingseffekt messen zu können. 
Da ein solches zweiphasiges Experiment in der Realität schwierig durchzuführen ist, gibt es in diesem Bereich nur wenige Studien. 
Zweiphasige Experimente sind schwer zu messen, da es immer eine Fluktuation der Mitarbeitenden gibt und somit immer nur ein Teil der Mitarbeitenden beim ersten oder nur beim zweiten simulierten Phishing-Training teilnehmen können und das Ergebnis so verzerrt werden kann. 
Zudem sind die Phasen, in denen das Phishing-Training durchgeführt wird, meist mehrere Wochen oder Monate lang. 
Somit gibt es nur wenige Studien, die in der Praxis durchgeführt wurden, und wenn, dann handelte es sich meistens um einphasige Experimente.
Beispiele für zweiphasige Studien sind die Studien von [West-Point-Kadetten](https://www.learntechlib.org/p/103686/) und dem [New York State Office](https://www.wsj.com/articles/SB112424042313615131). 
Sowohl in West Point als auch im New York State Office wurde in der ersten Phase untersucht, ob und wie gut die Probanden die Phishing-Angriffe erkennen.
Im zweiten Teil wurden die West-Point-Kadetten im Präsenztraining geschult und anschließend erneut getestet. 
Im New Yorker State Office hingegen wurden die Betroffenen online geschult. 
Das Ergebnis beider Studien war, dass die Probanden ihre Fähigkeit, Phishing-E-Mails zu erkennen, nach dem Training verbesserten und die Klickraten sanken. 

Eine weitere Studie untersuchte ein eingebettetes Trainingssystem namens [PhishGuru](https://dl.acm.org/doi/abs/10.1145/1240624.1240760) ebenfalls in der [realen Welt](https://ieeexplore.ieee.org/abstract/document/4696970/?casa_token=MbmjgEZ5B3UAAAAA:GJDyN4efJgnNc-WybNJ3t9Xikvp3GdGCVbcpl7N4mPC5VODp7PC-v7N_UggnFKnmJr8QX_7WkBP0). 
PhishGuru ist ein System, das Phishing-E-Mails an zuvor registrierte Benutzer versendet und Lernmaterial bereitstellt, wenn die Benutzenden auf solche Phishing-Trainings-E-Mails reagieren. 
Das Schulungsmaterial ist als Comic dargestellt und erklärt die Definition von Phishing und die Form der Angriffe.
Die Kurzzeitstudie wurde innerhalb von acht Tagen mit 311 Teilnehmern in einem portugiesischen Unternehmen durchgeführt. 
Untersucht wurde, ob [Spear-Phishing](https://www.computerweekly.com/de/definition/Spear-Phishing) oder allgemeines Phishing besser geeignet ist, um Phishing zu erkennen und persönliche Informationen nicht weiterzugeben.
Ein Ergebnis der Studie war, dass das eingebettete Training effektiv zu sein scheint, aber die Klickraten deutlich niedriger waren als bei Studien, die im universitären Umfeld durchgeführt wurden: 
Zu Beginn und vor der Schulung gaben 79 % der Personen im Labor ihre Daten weiter, nachdem sie auf eine Phishing-E-Mail geklickt hatten, verglichen mit 41 % in der realen Welt.
Nach der Schulung gaben 35 % im Labor und nur 13 % in der realen Welt ihre Daten weiter, nachdem sie auf eine Phishing-E-Mail geklickt hatten.
Ein weiteres Ergebnis der Studie war, dass auch die nicht geschulten Personen ihre Ergebnisse verbessern konnten, was die Forschenden auf die Tatsache zurückführten, dass sich die Mitarbeitenden über die Schulung austauschten. 
Daraus wurde gefolgert, dass ein solches Training auch für Personen wirksam sein kann, die nicht direkt an dem Training teilnehmen. 
Eine weitere Schlussfolgerung war, dass es auch kaum einen Unterschied zwischen dem Lernen mit dem Spear-Phishing-Material und dem generischen Phishing-Material gab.

Eine andere einphasige [Studie](https://ieeexplore.ieee.org/abstract/document/6585241/?casa_token=gR_MTQC_7wUAAAAA:dmXsUP0cQSNsv1BMate9-Un15g2hYut02b847gVLlndOJ4RoWt08Pj8HxhPtpklT7QpjHR2cHFyj) untersucht ebenfalls Spear-Phishing-E-Mails und die Wirksamkeit von eingebetteten Schulungen in der Praxis. 
Auch hier war die Hypothese, dass nach einem Phishing-Training die Anzahl der gemeldeten verdächtigen realen E-Mails steigt. 
Die Anzahl der Teilnehmenden an dieser Studie betrug 1359.
Es wurden mehrere E-Mails vorbereitet, einige davon mit kleinen Fehlern, sodass die Probanden die Phishing-E-Mails erkennen konnten, wenn sie (mehr) aufpassten. 
Das Ergebnis war, dass das eingebettete Training nicht wirksam war. 
Die Forschenden vermuteten jedoch, dass die Schulungswebsite nicht gut gestaltet war, da die Teilnehmenden angaben, dass sie die Website so seltsam fanden, dass sie sie sofort wegklickten. 
Bei dieser Studie handelte es sich um die größte jemals durchgeführte Studie unter realen Bedingungen.

Interessant ist nicht nur die Wirkung von Phishing (-Trainings) über E-Mail, sondern auch über andere Nachrichtendienste.
So nutzte eine andere einphasige [Studie](https://link.springer.com/chapter/10.1007/978-3-319-70278-0_39) Social-Media-Plattformen, um simulierte Phishing-Nachrichten zu versenden. 
In dieser Studie wurde die Auswirkungen der Wahl der Plattform auf die Klickraten, über die die Phishing-E-Mails versendet wurden, untersucht. 
Zum Vergleich wurden die Phishing-Nachrichten auch per E-Mail verschickt. 
Tatsächlich waren die Klickraten von Phishing-Nachrichten, die über soziale Medien verschickt wurden, deutlich höher: 
Die Klickraten für die E-Mails lagen bei 20 %, während die Klickraten für die Nachricht über Facebook bei 42,5 % lagen. 
Dies war eine der wenigen Studien, die in Deutschland mit 1200 Universitätsstudierenden durchgeführt wurde.

# Phishing-Training bei adesso 

Auch bei adesso wurde 2019 eine einphasige Phishing-Studie durchgeführt. 
Hierfür wurden vier Phishing-E-Mails in verschiedenen Schwierigkeitsstufen versendet. 
Die Klickrate (die anonym ausgewertet wurde) über alle Trainings-Phishing-E-Mails betrug am Ende des Training 26,4%. 
Besonders bemerkenswert war, dass am Ende des ersten Tages die Klickrate der schwierigsten Trainings-Phishing-E-Mail bei 52,6% lag. 
Wer mehr über die über die Zahlen, Daten und Fakten dieses Trainings erfahren möchte, kann sich den dazugehörigen [Blog-Beitrag](https://www.adesso.ch/de_ch/news/blog/phishing-kampagne-bei-adesso.jsp) durchlesen.

# Fazit

Verschiedene Studien haben die Wirksamkeit von simulierten Phishing-Trainings untersucht, in jeder war das Phishing erfolgreich. 
Zudem lassen sich aus den Studien weitere Schlussfolgerungen ziehen:

* Durch simuliertes Phishing-Training mit eingebetteten Schulungsmaterial lassen sich die Klickraten reduzieren 
* Allein der Austausch über das Training scheint die Security Awareness ebenfalls zu erhöhen
* Geeignetes Schulungsmaterial erhöht die Akzeptanz und den Trainingseffekt einer solchen Maßnahme

Es scheint aber auch Grenzen des simulierten Phishing-Trainings zu geben. 
Ein Training über acht Tage ist zunächst ein guter kurzer Trainingseffekt. 
Jedoch war ein weiteres Ergebnis der zweiphasigen Studien, dass es weiterhin Personen gab, die sowohl im ersten Durchlauf, als auch im zweiten Durchlauf auf eine simulierte Phishing-E-Mail reinfielen. 
Der Trainingseffekt lässt nach einer gewissen Zeit nach, da die Betroffenheit auf eine Trainings-Phishing-E-Mail reingefallen zu sein nicht mehr präsent ist und das Phishing-Training kein prägendes negatives Ereignis ist, als wenn man tatsächlich Opfer eines echten Phishing-Betrugs geworden ist. 
Interviewte Teilnehmende, die einen realen Phishing-Betrug im näheren Umkreis hatten bestätigten diesen Effekt.
Um den Trainingseffekt über alle Mitarbeitenden trotzdem konstant hoch zu halten, macht es Sinn, variierende Phishing-Simulationen kontinuierlich über einen langen Zeitraum durchzuführen und als festen Bestandteil der Security Awareness im Unternehmen zu etablieren. 
Dabei sollten wenige Trainings-Phishing-E-Mails über einen langen Zeitraum versendet werden, um einerseits die Mitarbeitenden in ihrem Arbeitsalltag nicht zu stören, andererseits ihren Trainingseffekt zu erhalten oder bei neuen Mitarbeitenden neu aufzubauen. 
Phishing-E-Mails als Training zu versenden, scheint bisher eine gute Möglichkeit, doch scheint auch die Nutzung von Social-Media-Plattformen ein großes Einfallstor für Phishing darzustellen. 
Dies gilt insbesondere, wenn diese auch auf Betriebsgeräten wie auf dem Firmenhandy oder Firmenlaptop genutzt werden. 
Hierüber lässt sich jedoch kaum ein simuliertes Phishing-Training für Mitarbeitende ohne ihr Einverständnis durchführen, da dies ein herbleicher Eingriff in die Privatsphäre darstellen würde. 
Wenn jedoch die Sensibilität gegenüber Phishing-E-Mails steigt, bleibt die Hoffnung, dass sie auch gegenüber Phishing Nachrichten über andere Nachrichtendienste steigt. 
