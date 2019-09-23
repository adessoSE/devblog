---
layout: [post, post-xml]
title: "Kollegin Alexa – Wie Sprachassistenten ein IT-Projektteam unterstützen können"
date: 2019-09-23 07:45
author: pschild
categories: [Softwareentwicklung]
tags: [Typescript, Alexa, Sprachassistent]
---

Aufgabenmanagement mit Jira, CI-Prozesse und Code-Verwaltung mit GitLab oder statische Codeanalysen mit SonarQube: In einem Softwareprojekt werden eine große Menge an Daten in verschiedenen Systemen erzeugt und gespeichert. Um eine Frage wie "Wie läuft unser Projekt eigentlich gerade?" fundiert beantworten zu können, müssen somit Metriken und Status aus mehreren Systemen manuell abgefragt und zusammengetragen werden. Anstatt mir die Höhe des Eiffelturms oder den neusten Chuck Norris-Witz erzählen zu lassen, könnte ich Alexa doch auch nach diesen Informationen fragen...

Alexa und Co. haben inzwischen den Weg in die Wohnzimmer vieler Menschen gefunden und werden vor allem im privaten Umfeld eingesetzt, sei es zum Abspielen von Musik oder zur Steuerung des eigenen Smart Homes. Wie aber sehen die Entwicklungen und Einsatzmöglichkeiten im Unternehmenskontext aus? Wie lassen sich Sprachassistenten in eine bestehende Projekt-Infrastruktur integrieren? Können der Arbeitsalltag mit Hilfe von Sprachassistenten erleichtert und Mitarbeiter unterstützt werden?  
Mit diesen Fragen habe ich mich im Rahmen meiner Masterarbeit beschäftigt und eine prototypische Anwendung für den Sprachassistenten Alexa entwickelt. Im Folgenden werde ich zunächst die technische Implementierung eines Anwendungsfalles dieser Anwendung beschreiben und im Anschluss daran die wichtigsten Ergebnisse meiner Arbeit zusammenfassen.

# Sprachmodell

Für die Konzeption einer Anwendung für Sprachassistenten (im Kontext von Alexa *Skill* genannt) ist es zunächst wichtig zu ermitteln, *was* die Benutzer den Sprachassistenten fragen und *wie* sie diese Anfragen formulieren. Gemeinsam mit der Zielgruppe sollte ein Sprachmodell aufgestellt werden, das den Vorstellungen und dem Sprachgebrauch der späteren Benutzer entspricht.  
Der im Rahmen der Masterarbeit [entwickelte Skill](https://github.com/pschild/alexa-project-assistent) sollte beispielsweise aktuelle Informationen aus den im Projekt verwendeten Systemen wie Jira, GitLab und SonarQube anzeigen. Um die konkreten Anwendungsfälle aufzustellen und daraus das Sprachmodell abzuleiten, führte ich diverse Interviews mit verschiedenen Projektbeteiligten. Unter anderem wurden die folgenden Sprachbefehle – auch *Utterances* genannt – aufgestellt:
* *"Berechne den Aufwand für den nächsten Sprint!"*
* *"Zeige mir Informationen zum aktuellen Sprint!"*
* *"Zeige mir das Burndown Chart vom aktuellen Sprint!"*
* *"Wie viele offene Merge Requests gibt es?"*
* *"Zeige mir die SonarQube Übersicht!"*

Um die Sprachbefehle flexibler zu gestalten und dynamische Informationen abzufragen, kann ein Befehl auch sog. *Slots* enthalten. *Slots* stellen Platzhalter innerhalb eines Sprachbefehls dar und können verschiedene Werte annehmen, wie z. B. ein Datum, eine Nummer oder auch eine Liste von vorgegebenen Werten:
* *"Andere den Status von {TicketIdentifier} {TicketNumber} auf {Status}!"*
* *"Zeige mir die Pipelines von {ProjectName}!"*
* *"Wie ist die Qualität von {ProjectName}?"*

Die Liste der möglichen Sprachbefehle wird Alexa schließlich zur Verfügung gestellt. Die eingesprochenen Wörter des Benutzers werden mit Hilfe von *Automatic Speech Recognition (ASR)* und *Natural Language Understanding (NLU)* analysiert und es wird versucht, sie einem existierenden Sprachbefehl des Skills zuzuordnen. Um die Flexibilität zu erhöhen, lassen sich auch mehrere alternative Sprachbefehle für einen bestimmten Intent definieren. Wird ein passender Befehl gefunden, wird die jeweilige Funktion (*Intent*) der Anwendung ausgelöst und die entsprechende Anfrage verarbeitet. In diesem Zuge können z. B. weitere Daten über externe Schnittstellen angefragt oder Berechnungen durchgeführt werden. Jeder Intent definiert schließlich eine Antwort als Ergebnis. Teil dieser Antwort ist der durch Alexa auszugebene Text oder auch Informationen für die visuelle Ausgabe der Antwort (bei Sprachassistenten mit Display). Der Text wird mit Hilfe von *Text-to-Speech (TTS)* in auditive Signale umgewandelt, sodass er über einen Lautsprecher ausgegeben werden kann und der Benutzer seine Antwort erhält.  
Das folgende Diagramm veranschaulicht den beschriebenen Prozess:

![Ablaufdiagramm](/assets/images/posts/wie-alexa-ein-it-projektteam-unterstuetzen-kann/ablaufdiagramm.png)

# Technische Umsetzung

Für die Entwicklung von Alexa-Skills existieren verschiedene Frameworks, unter anderem für NodeJS, Java und Python. Die fertigen Anwendungen können z. B. auf [AWS Lambda](https://aws.amazon.com/de/lambda/) gehostet und betrieben werden. Zusätzlich dazu muss der Skill über einen kostenlosen Amazon Developer Account und die dazugehörige Developer Console angelegt und konfiguriert werden.

Um an das Beispiel aus meiner Masterarbeit anzuknüpfen, zeigen die folgenden Code-Ausschnitte die Eckpfeiler des Alexa-Skills in NodeJS. Für zusätzliche Unterstützung bei der Entwicklung habe ich TypeScript und die npm-Bibliothek [`alexa-app`](https://github.com/alexa-js/alexa-app) eingesetzt.  
Neben einer Installation auf *AWS Lambda* bietet `alexa-app` ebenfalls die Möglichkeit, den Skill auf einem lokalen [`express`](https://expressjs.com/)-Server zu hosten. Die Entwicklung kann somit komplett auf dem eigenen lokalen Computer stattfinden und es besteht keine Abhängigkeit zu AWS. Dieses Vorgehen habe ich im Rahmen der Masterarbeit gewählt. Die Anwendung lässt sich dann wie folgt initialisieren und über den bereits angesprochenen express-Server auf Port 4242 bereitstellen:

```typescript
const app = express();
const alexaApp = new alexa.app('customSkillName');
alexaApp.express({
    expressApp: app
});

app.listen(4242, () => console.log(`Listening on port 4242`));
```

Über das Sprachmodell des Skills lassen sich – in diesem Fall innerhalb einer JSON-Datei – die verschiedenen Intents definieren. Zur Veranschaulichung möchten wir einen Intent implementieren, der uns den Test-Status eines bestimmten Jira-Issues anzeigt.  
Wir legen dazu zunächst in unserem Sprachmodell alle nötigen Informationen zu diesem Intent an:

```json
{
    "interactionModel": {
        "languageModel": {
            ...
            "intents": [
                {
                    "name": "JiraXrayStatusIntent",
                    "slots": [
                        {
                            "name": "JiraTicketIdentifier",
                            "type": "JiraTicketIdentifier",
                            "samples": [
                                "ticket {JiraTicketIdentifier}",
                                "{JiraTicketIdentifier}"
                            ]
                        },
                        {
                            "name": "JiraTicketNumber",
                            "type": "AMAZON.NUMBER",
                            "samples": [
                                "{JiraTicketNumber}"
                            ]
                        }
                    ],
                    "samples": [
                        "zeige die tests von {JiraTicketIdentifier} {JiraTicketNumber}",
                        "zeige die xray tests von {JiraTicketIdentifier} {JiraTicketNumber}",
                        ...
                    ]
                },
                ...
            ]
        }
    }
}
```

Über die Methode `.intent(<NAME>, (request, response) => { ... })` können wir den Intent nun der Anwendung bekannt machen:

```typescript
// get an instance of ScsDashboardIntentHandler (using a DI framework)
const intentHandler: JiraXrayStatusIntentHandler = Container.get(JiraXrayStatusIntentHandler);
alexaApp.intent('JiraXrayStatusIntent', intentHandler.handle.bind(intentHandler));
```

Die Logik des Intents wird in einer dazugehörigen Klasse implementiert. Das Herzstück diese Klasse ist die Methode `handle`, die sowohl die Anfrage (`request`) als auch die Antwort (`response`) als Parameter entgegennimmt. Aus dem `request` können z. B. die dynamischen, über *Slots* bereitgestellten Inhalte ausgelesen und verarbeitet werden. Die `response` wird innerhalb der Methode mit Informationen (Sprachausgabe, anzuzeigende Informationen etc.) angereichert und schließlich zurückgegeben:

```typescript
export default class JiraXrayStatusIntentHandler implements IIntentHandler {

    @Inject
    private controller: JiraEndpointController;

    public async handle(request: alexa.request, response: alexa.response): Promise<alexa.response> {

        // parse information from given speech input
        const identifierSlot = elicitSlot(request, 'JiraTicketIdentifier');

        const issue: JiraIssue = await this.controller.getIssue(identifierSlot);

        // transform data, generate charts, ...

        return response
            .directive(buildDisplayDirective(...))
            .say(`Alles klar, hier sind die aktuellen Testergebnisse für ...`);
    }
}
```

Die Kommunikation mit den APIs von Jira, GitLab und SonarQube findet über `EndpointController` statt. Folgender Code zeigt einen Ausschnitt des `JiraEndpointController`s, in dem die Daten eines Issues per GET-Request angefragt werden:

```typescript
export class JiraEndpointController extends EndpointController {

    public async getIssue(identifier: string): Promise<JiraIssue> {
        const result = await get({
            uri: `https://<JIRA_URL>/rest/api/2/issue/${identifier}`
        });
        return plainToClass(JiraIssue, result as JiraIssue);
    }
}
```

Auf den Befehl "Zeige die Tests von AX-7!" würde Alexa schließlich nach einigen Sekunden antworten: "Alles klar, hier sind die aktuellen Testergebnisse für das Ticket AX-7." und Folgendes anzeigen:

![Screenshot](/assets/images/posts/wie-alexa-ein-it-projektteam-unterstuetzen-kann/screenshot.png)

Innerhalb der `handle`-Methode eines IntentHandlers können auch Daten aus mehreren Systemen angefragt werden, indem mehrere `EndpointController` aufgerufen werden. Die Daten lassen sich im Anschluss aggregieren und interpretieren:

```typescript
const nextRelease = await this.jiraEndpointController.getNextRelease(...);
const bugs = await this.jiraEndpointController.getBugsInSprint(...);
const qgStatus = await this.sonarQubeEndpointController.getQualityGateStatus(...);
const masterBuilds = await this.gitLabEndpointController.buildMasterBuilds(...);

// transform data, generate charts, ...

return response
    .directive(buildDashboardDirective(...))
    .say(`Noch ${daysLeft} Tage bis zum nächsten Release. Die letzten Master-Builds sind in Ordnung, allerdings gibt es noch ${bugCount} bekannte Fehler, um die ihr euch kümmern solltet...`);
```

Somit lässt sich beispielsweise eine Dashboard-Ansicht generieren, über die verteilte Informationen übersichtlich dargestellt werden können. Mit einem entsprechenden Kommentar kann Alexa die wichtigsten Daten für das Projektteam zusammenfassen.

Der Quellcode des vollständigen Skills meiner Masterarbeit ist auf [GitHub](https://github.com/pschild/alexa-project-assistent) zu finden.

# Fazit & Ausblick

Anhand des Prototypen, den ich im Rahmen meiner Masterarbeit entwickelt habe, konnte ich zeigen, dass die Unterstützung eines IT-Projektteams durch einen Sprachassistenten möglich ist. Durch die Möglichkeit der Spracheingabe stellt der Sprachassistent eine intuitive Erweiterung für die bestehende Infrastruktur dar – in diesem Falle für die Systeme Jira, GitLab und SonarQube. Die entsprechenden Schnittstellen vorausgesetzt, können auch weitere Systeme problemlos angebunden werden.

Neben diesen positiven Erkenntnissen existieren jedoch auch Herausforderungen bei der Integration von Sprachassistenten in einen Unternehmenskontext.  
Der Aufwand, Sprachassistenten für Unternehmen zu individualisieren, ist aufgrund der spezifischen Infrastrukturen und Abläufen noch sehr hoch. Zum einen setzt die zuverlässige Funktionsweise des Sprachassistenten ein hohes Maß an Qualität bei der manuellen Pflege der Informationen in den Systemen voraus, z. B. sollten alle Jira-Aufgaben mit einheitlichen Attributen gepflegt werden. Zum anderen stellt gerade im beruflichen Umfeld der rollen- und branchenspezifische Wortschatz bei der Konzeption des Sprachmodells eine besondere Herausforderung dar.  
Nach heutigem Stand der Technik ist die Verwendung von Sprachassistenten häufig eine Gratwanderung: Wenn der Assistent den Benutzer korrekt versteht und eine sinnvolle Antwort zur Verfügung stellt, lässt sich von einer deutlichen Vereinfachung und Unterstützung bei einer bestimmten Aufgabe sprechen. Falls der Benutzer nicht oder gar falsch verstanden wird, kann das zum einen Frustration auslösen und zum anderen dafür sorgen, dass ungewollte Aktionen durchgeführt werden und letztlich ein Mehraufwand entsteht.  
Auch die Datenschutzrichtlinien stellen eine wesentliche Hürde für Unternehmen dar, wenn Sprachassistenten eingesetzt werden sollen. Sowohl [Amazon](https://www.bloomberg.com/news/articles/2019-04-10/is-anyone-listening-to-you-on-alexa-a-global-team-reviews-audio) als auch [Google](https://www.vrt.be/vrtnws/en/2019/07/10/google-employees-are-eavesdropping-even-in-flemish-living-rooms/) setzen weltweit tausende Mitarbeiter ein, um über die Smart Speaker eingesprochene Mitschnitte transkribieren und analysieren zu lassen. Was laut den Aussagen der Hersteller zur Verbesserung der Funktionalität der Sprachassistenten beitragen soll, ist für Privatpersonen mindestens unangenehm und könnte für Unternehmen womöglich sogar geschäftsschädigend sein.  
Den Datenschutz-Aspekten sind sich die Hersteller der Sprachassistenten bewusst, allerdings bleibt abzuwarten, ob und in welcher Form sie zukünftig für die Sicherung der Privatsphäre sorgen werden.

Die Entwicklung in der Mensch-Computer-Interaktion und die Statistiken über Sprachassistenten bzw. Smart Speaker lassen zumindest darauf schließen, dass die natürliche Sprache in Zukunft eine zentrale Rolle dabei spielen wird, wie der Mensch mit dem Computer interagiert. Der technologische Fortschritt, getrieben durch den Konkurrenzkampf zwischen Herstellern wie Amazon und Google, könnte dafür sorgen, dass die Sprachassistenten in den nächsten Jahren noch natürlicher, intuitiver und komfortabler zu bedienen sein werden.