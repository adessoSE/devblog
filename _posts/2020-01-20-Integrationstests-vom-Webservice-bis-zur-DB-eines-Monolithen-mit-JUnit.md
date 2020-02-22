# Integrationstests vom Webservice bis zur DB eines Monolithen mit JUnit

In diesem Artikel geht es um automatisierte Tests, die die gesamte Kernlogik eines Monolithen von der obersten Schicht (einem Webservice) bis zur untersten Schicht (der Datenbank) durchlaufen und auf definierte Eingaben entsprechende Ausgaben erwartet werden können. 

## Die Ausgangslage

Unser Monolith sollte um eine neue (REST-)Webservice-Schnittstelle erweitert werden. Unter anderem stellt sich bei der Konzeption zwangsläufig die Frage, wie man die Schnittstelle entwicklungsbegleitend testen kann. Natürlich kommen kommen hierbei die üblichen Verdächtigen auf:

- einen rudimentären Client (evtl. mit Benutzeroberfläche) nebenher entwickeln, mit dem die einzelnen Endpoints angesprochen werden können
- etablierte Tools zur Erstellung von REST-Calls verwenden

Beide Möglichkeiten erfordern allerdings einen relativ großen Pflege Aufwand und vor allem erodieren sie schnell, wenn die Schnittstelle sich mit der Zeit ändert.

## Die Grundidee

Ich stelle einmal die These auf, dass Entwickler ungern ihre eigenen Entwicklungen testen und faul sind (behauptete zumindest mein Informatik-Lehrer, als es ums Copy-Paste-Pattern ging). Allerdings wird alles für einen Entwickler erträglicher, wenn man es "As-Code" umsetzen kann. So kann man heute Dokumentationen einer REST-Schnittstelle As-Code pflegen und auch die üblichen Unit-Tests sind gewissermaßen ein Beispiel hierfür. 

Während der Ideenfindung zum Problem der Ausgangslage wuchs schnell der Gedanke, dass wir das Testen der Schnittstelle gerne automatisieren und möglichst keinen Client bedienen wollten. Ein solcher ist oft entweder leichtgewichtig, aber unflexibel oder flexibel, aber dafür komplex.

Aus dem "As-Code" Gedanken, entsprang die Idee, ob das nicht in so leicht ausführbaren Tests wie Unit-Tests zu lösen sei. Alle möglichen Komplexitäten der Schnittstelle müssten ja nur einmal in einem solchen Test implementiert werden und wären beliebig wiederholbar ausführbar.

## Die Umsetzung



## Die Vorteile

Teilweise sind uns erst während der Entwicklung Vorteile bewusst geworden, die wir zusätzlich gewonnen hatten. Hier die wesentlichsten:

- 

## Disclaimer

Mir ist bewusst, dass JUnit ein Framework ist, welches darauf abzielt, so leichtgewichtige Tests wie nur möglich zu schreiben und das unsere Verwendung des Frameworks diesem Grundgedanken zutiefst widerspricht. An manchen Stellen mussten wir daher etwas kreativ mit den gegeben Möglichkeiten von JUnit umgehen. Wichtig ist, dass wir uns dessen bewusst sind und das wir lediglich in diesem Kontext von den Best-Practices eines üblichen Unit-Tests abweichen. Das Resultat ist zumindest in unserem Kontext jedoch über jeden Zweifel erhaben und legitimiert dazu, auch mal out-of-the-box zu denken.