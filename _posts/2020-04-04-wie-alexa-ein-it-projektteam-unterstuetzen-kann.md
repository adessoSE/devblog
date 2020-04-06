---
layout: [post, post-xml]
title: "Kollegin Alexa – Wie Sprachassistenten ein IT-Projektteam unterstützen können"
date: 2020-04-04 17:30
author: pschild
categories: [Softwareentwicklung]
tags: [Typescript, Alexa, Sprachassistent]
---

Sprachassistenten wie *Alexa* haben inzwischen den Weg in die Wohnzimmer vieler Menschen gefunden und werden so vor allem im privaten Umfeld eingesetzt.
Wie aber sehen die Entwicklungen und Einsatzmöglichkeiten im Unternehmenskontext aus? Wie lassen sich Sprachassistenten in eine bestehende Projekt-Infrastruktur integrieren? Können der Arbeitsalltag mit Hilfe von Sprachassistenten erleichtert und Mitarbeiter unterstützt werden?

Mit diesen Fragen habe ich mich im Rahmen meiner Masterarbeit beschäftigt und eine prototypische Anwendung für den Sprachassistenten Alexa entwickelt.
In den folgenden Abschnitten möchte ich euch von den Erkenntnissen meiner Arbeit berichten und euch einen Einblick in die technische Umsetzung geben.

# Der Status eines Softwareprojektes
Aufgabenfortschritt, Pipelinestatus, Codeanalysen: Der Status eines Softwareprojektes umfasst Informationen verschiedenster Quellen.
Um eine Frage wie *"Wie läuft unser Projekt eigentlich gerade?"* fundiert beantworten zu können, müssen wir Metriken und Status aus mehreren Systemen manuell abfragen und zusammentragen. Wer oft damit zu tun hat weiß, dass das viel Zeit kosten kann.  
Wenn Alexa uns die Höhe des Eiffelturms oder den neusten Chuck Norris-Witz erzählen kann, warum können wir sie nicht auch nach Informationen aus einem Softwareprojekt fragen?
Lasst uns schauen, ob und wie so etwas möglich ist.

# Konzeption der Anwendung
Für die Konzeption einer Anwendung für Sprachassistenten (im Kontext von Alexa *Skill* genannt) ist es zunächst wichtig zu ermitteln, *was* die Benutzer den Assistenten fragen und *wie* sie diese Anfragen formulieren.
Es ist also essenziell, mit den Projektbeteiligten gemeinsam Anwendungsfälle und Sprachbefehle zu erarbeiten, die ihren Vorstellungen und ihrem Sprachgebrauch entsprechen.

## Anwendungsfälle erarbeiten
Die Anwendungsfälle (im Kontext von Alexa *Intents* genannt) lassen sich auf verschiedene Weisen aufstellen.
Es eignen sich zum Beispiel Methoden wie Workshops oder Interviews, um mit den Beteiligten zu sprechen und gemeinsam Ideen zu sammeln.  
Im Rahmen meiner Masterarbeit habe ich Interviews mit mehreren Projektbeteiligten durchgeführt, die verschiedene Rollen im Projekt eingenommen und somit unterschiedliche Perspektiven vertreten haben.
Eine Konsolidierung dieser Interviews hat gezeigt, dass vor allem Informationen aus den im Projekt verwendeten Systemen wie *Jira*, *GitLab* und *SonarQube* für den Alltag der Mitarbeiter von Bedeutung sind.

## Sprachmodell aufstellen
Ausgehend von den Anwendungsfällen ist es sehr wichtig dem Sprachassistenten beizubringen, *wie* wir die Fragen nach einem solchen Fall formulieren.
Nur so kann der Sprachassistent unsere Spracheingabe verstehen und uns die passende Antwort geben.  
In meinem Fall habe ich zusammen mit den Interviewpartnern unter anderem die folgenden Sprachbefehle abgeleitet:
* *"Berechne den Aufwand für den nächsten Sprint!"*
* *"Zeige mir Informationen zum aktuellen Sprint!"*
* *"Zeige mir das Burndown Chart vom aktuellen Sprint!"*
* *"Wie viele offene Merge Requests gibt es?"*
* *"Zeige mir die SonarQube Übersicht!"*

Ergänzend dazu habe ich *Slots* verwendet, um die Sprachbefehle flexibler zu gestalten und dynamische Informationen abzufragen.
*Slots* stellen Platzhalter innerhalb eines Sprachbefehls dar und können verschiedene Werte annehmen, wie z. B. ein Datum, eine Nummer oder auch eine Liste von vorgegebenen Werten:
* *"Andere den Status von {TicketIdentifier} {TicketNumber} auf {Status}!"*
* *"Zeige mir die Pipelines von {ProjectName}!"*
* *"Wie ist die Qualität von {ProjectName}?"*

## Exkurs: Was im Hintergrund passiert
Die Liste der möglichen Sprachbefehle wird Alexa statisch zur Verfügung gestellt.
Die eingesprochenen Wörter des Benutzers werden mit Hilfe von *Automatic Speech Recognition (ASR)* und *Natural Language Understanding (NLU)* analysiert und der Sprachassistent versucht, sie einem existierenden Sprachbefehl des Skills zuzuordnen.
Um die Flexibilität zu erhöhen, können wir auch mehrere alternative Sprachbefehle für einen bestimmten Intent definieren.

Findet Alexa einen passenden Befehl, wird die jeweilige Funktion der Anwendung ausgelöst und die entsprechende Anfrage verarbeitet.
In diesem Zuge können z. B. weitere Daten über externe Schnittstellen angefragt oder Berechnungen durchgeführt werden.

Jeder Intent definiert schließlich eine Antwort als Ergebnis.
Teil dieser Antwort ist der durch Alexa auszugebene Text oder auch Informationen für die visuelle Ausgabe der Antwort (bei Sprachassistenten mit Display).
Der Text wird mit Hilfe von *Text-to-Speech (TTS)* in auditive Signale umgewandelt, sodass er über einen Lautsprecher ausgegeben werden kann und der Benutzer seine Antwort erhält.

Das folgende Diagramm veranschaulicht den beschriebenen Prozess:

![Ablaufdiagramm](/assets/images/posts/wie-alexa-ein-it-projektteam-unterstuetzen-kann/ablaufdiagramm.png)

# Implementierung
Für die Entwicklung von Alexa-Skills existieren verschiedene Frameworks, unter anderem für NodeJS, Java und Python.
Die fertigen Anwendungen können z. B. auf [AWS Lambda](https://aws.amazon.com/de/lambda/) gehostet und betrieben werden.
Zusätzlich dazu muss der Skill über einen kostenlosen Amazon Developer Account und die dazugehörige Developer Console angelegt und konfiguriert werden.

Um an das Beispiel aus meiner Masterarbeit anzuknüpfen, zeige ich euch in den folgenden Code-Ausschnitten die Eckpfeiler des Alexa-Skills in NodeJS.
Für zusätzliche Unterstützung bei der Entwicklung habe ich TypeScript und die npm-Bibliothek [`alexa-app`](https://github.com/alexa-js/alexa-app) eingesetzt.  
Zur Veranschaulichung implementieren wir im Folgenden den Anwendungsfall `JiraXrayStatusIntent`, der uns den Test-Status eines bestimmten Jira-Issues anzeigt.
Den Quellcode des vollständigen Skills findet ihr auf [GitHub](https://github.com/pschild/alexa-project-assistent).

## Sprachmodell definieren
Über das Sprachmodell des Skills lassen sich innerhalb einer JSON-Datei die verschiedenen Intents definieren.  
Wir legen dazu in unserem Sprachmodell alle nötigen Informationen für den `JiraXrayStatusIntent` an.
In diesem Fall sind das der Name, die möglichen Slots und ihre Typen sowie eine Liste verschiedener Sätze zum Auslösen des Intents.
Der Skill kennt damit den Umfang unserer Sprachbefehle und weiß, welche Aktion er bei welchem Befehl ausführen muss.

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

## Grundgerüst aufstellen und Intents verarbeiten
Neben einer Installation auf *AWS Lambda* bietet die Bibliothek `alexa-app` ebenfalls die Möglichkeit, den Skill auf einem lokalen [`express`](https://expressjs.com/)-Server zu hosten.
Die Entwicklung kann somit komplett auf dem eigenen lokalen Computer stattfinden und es besteht keine Abhängigkeit zu AWS.
Die Anwendung können wir dann wie folgt initialisieren:
```typescript
const app = express();
const alexaApp = new alexa.app('customSkillName');
alexaApp.express({
    expressApp: app
});
```

Über die Methode `.intent(<NAME>, (request, response) => { ... })` können wir den Intent nun der Anwendung bekannt machen:
```typescript
// get an instance of JiraXrayStatusIntentHandler (using a DI framework)
const intentHandler: JiraXrayStatusIntentHandler = Container.get(JiraXrayStatusIntentHandler);
alexaApp.intent('JiraXrayStatusIntent', intentHandler.handle.bind(intentHandler));
```

Schließlich stellen wir den Skill über den bereits angesprochenen express-Server auf Port 4242 bereit:
```typescript
app.listen(4242, () => console.log(`Listening on port 4242`));
```

## Daten abfragen und analysieren
Die "Geschäftslogik" des Intents implementieren wir in der dazugehörigen Klasse `JiraXrayStatusIntentHandler`.
Das Herzstück dieser Klasse ist die Methode `handle`, die sowohl die Anfrage (`request`) als auch die Antwort (`response`) als Parameter entgegennimmt.
Aus dem `request` können wir z. B. die dynamischen, über Slots bereitgestellten Inhalte auslesen und verarbeiten.
Die `response` wird innerhalb der Methode mit Informationen (Sprachausgabe, anzuzeigende Informationen etc.) angereichert und schließlich zurückgegeben:

```typescript
export default class JiraXrayStatusIntentHandler implements IIntentHandler {

    @Inject
    private controller: JiraEndpointController;

    public async handle(request: alexa.request, response: alexa.response): Promise<alexa.response> {

        // parse information from given speech input
        const identifierSlotValue = elicitSlot(request, 'JiraTicketIdentifier');

        const issue: JiraIssue = await this.controller.getIssue(identifierSlotValue);

        // transform data, generate charts, ...

        return response
            .directive(buildDisplayDirective(...))
            .say(`Alles klar, hier sind die aktuellen Testergebnisse für ...`);
    }
}
```

Innerhalb der `handle`-Methode eines IntentHandlers lassen sich nicht nur eine Schnittstelle, sondern auch Daten aus mehreren Systemen anfragen, indem mehrere `EndpointController` aufgerufen werden.
Die systemübergreifenden Daten können wir im Anschluss aggregieren und darstellen:

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

Somit lässt sich beispielsweise eine Dashboard-Ansicht generieren, über die verteilte Informationen übersichtlich dargestellt werden können.
Mit einem entsprechenden Kommentar kann Alexa die wichtigsten Daten für das Projektteam zusammenfassen.

## Externe Systeme anbinden
Die Kommunikation mit den APIs von Jira, GitLab und SonarQube findet über `EndpointController` statt.
Folgender Code zeigt einen Ausschnitt des `JiraEndpointController`s, über den wir die Daten eines Issues per GET-Request anfragen:

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

## Ergebnis
Auf den Befehl "Zeige die Tests von AX-7!" antwortet uns Alexa schließlich nach einigen Sekunden: "Alles klar, hier sind die aktuellen Testergebnisse für das Ticket AX-7."
Zusätzlich zur Sprachausgabe können die entsprechenden Informationen auch visuell dargestellt werden:

![Screenshot](/assets/images/posts/wie-alexa-ein-it-projektteam-unterstuetzen-kann/screenshot.png)

# Fazit
Wir haben nun gesehen, worauf es bei der Entwicklung eines Skills für Sprachassistenten ankommt und wie sich ein Anwendungsfall implementieren lässt.
Analog zu der beschriebenen Integration des `JiraXrayStatusIntent`s lässt sich unser Skill um weitere Intents ergänzen: Alexa kann Daten aus externen Systemen über deren APIs abfragen und unser Skill kann diese anschließend aggregieren.
Die Steuerung per Spracheingabe stellt für uns dabei eine intuitive Möglichkeit dar, an Informationen aus der bestehenden Infrastruktur zu gelangen.  
Wir können also festhalten: Ja, Sprachassistenten lassen sich in eine bestehende Projekt-Infrastruktur integrieren.

Wir dürfen allerdings die Herausforderungen nicht unterschätzen, die eine Integration von Sprachassistenten mit sich bringt.
Aufgrund der spezifischen Infrastrukturen und Abläufen ist der Aufwand, Sprachassistenten für bestimmte Projekte zu individualisieren sehr hoch.
Zum Beispiel müssen die Informationen in den angefragten Systemen möglichst einheitlich gepflegt werden, damit Alexa eine vollständige Übersicht abfragen kann.
Darüber hinaus setzt der rollen- und projektspezifische Wortschatz ein umfassendes und auf das Projekt zugeschnittenes Sprachmodell voraus.
Nur so kann uns der Sprachassistent korrekt verstehen und uns die gewünschten Antworten zur Verfügung stellen.

Nicht zuletzt stellen auch die Datenschutzrichtlinien eine wesentliche Hürde für Unternehmen dar, wenn Sprachassistenten eingesetzt werden sollen.
Sowohl [Amazon](https://www.bloomberg.com/news/articles/2019-04-10/is-anyone-listening-to-you-on-alexa-a-global-team-reviews-audio) als auch [Google](https://www.vrt.be/vrtnws/en/2019/07/10/google-employees-are-eavesdropping-even-in-flemish-living-rooms/) setzen weltweit tausende Mitarbeiter ein, um über die Sprachassistenten eingesprochene Mitschnitte transkribieren und analysieren zu lassen.
Was laut den Aussagen der Hersteller zur Verbesserung der Funktionalität der Sprachassistenten beitragen soll, ist für Privatpersonen mindestens unangenehm und könnte für Unternehmen womöglich sogar geschäftsschädigend sein.

## Was bringt die Zukunft?
Die Entwicklung in der Mensch-Computer-Interaktion und die Statistiken über Sprachassistenten lassen zumindest darauf schließen, dass die natürliche Sprache in Zukunft eine zentrale Rolle dabei spielen wird, wie der Mensch mit dem Computer interagiert.
Der technologische Fortschritt, getrieben durch den Konkurrenzkampf zwischen Herstellern wie Amazon und Google, könnte dafür sorgen, dass die Sprachassistenten mit der Zeit immer intuitiver und komfortabler zu bedienen sein werden.
Was die Datenschutz-Aspekte angeht bleibt allerdings abzuwarten, ob und in welcher Form die Hersteller von Sprachassistenten zukünftig für die Sicherung der Privatsphäre sorgen werden.