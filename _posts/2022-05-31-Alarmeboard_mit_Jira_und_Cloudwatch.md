---
layout: [post, post-xml]              
title:  "Automatisiert Jira-Tickets aus AWS-Alarmen erzeugen"         
date:   2022-04-26 10:00              
author_ids: [kaythielmann,sczubek]
categories: [Softwareentwicklung]           
tags: [DevOps, Lambda, Cloudwatch, Jira, AWS, Cloud]        
---

Im Rahmen eines Projekts, in dem eine ganze Reihe von Microservices entwickelt und betrieben werden, hat sich eine Idee entwickelt, die Bearbeitung der Alarme zu verbessern.
Basierend auf Cloudwatch-Alarmen und einem Topic im Simple Notification Service von AWS, ist bei mehreren betriebenen Microservices sowie diversen Queues und anderen Komponenten schnell eine große Menge von Alarmen konfiguriert, die auf Protokollfiltern oder Metriken der Services beruhen können.
Dabei den Überblick zu behalten, wichtige Alarme direkt zu priorisieren und die Analyse zu vereinfachen ist nicht immer einfach.
Natürlich darf nichts unter den Tisch fallen, und es sollte sichergestellt sein, dass klar ist, wer gerade welchen Alarm bearbeitet.

Mit Jira ist ein Tool gegeben, welches sowieso schon in vielen Projekten Einsatz findet. 
Wie dieses genutzt werden kann, um die Alarme und ihren Status zu visualisieren wollen wir im Folgenden beschreiben.

# Wie entstand der Bedarf an der Lösung?
DevOps ist ein Thema, welches in unterschiedlichsten Teams auf unterschiedliche Art gelebt wird. 
Mal gibt es eigene DevOps Teams, mal wird der Betrieb der Anwendung im Entwicklungsteam parallel zu deren Weiterentwicklung gehandhabt.

Aber egal wie man das Thema angeht: Am Anfang steht das Bedürfnis, direkt und automatisiert über Fehlerzustände der Systeme informiert zu werden.
Das gängige Mittel der Wahl unter AWS sind Cloudwatch-Alarme, die mit Metriken oder Protokollen verknüpft werden können.
Sobald die Alarmbedingung erfüllt ist (beispielsweise wird ein bestimmter Schwellwert gebrochen oder ein Error-Log taucht im Protokoll auf), wird eine Aktion ausgeführt.
Dies kann zum Beispiel eine Skalierungsaktion für den entsprechenden Service oder auch das Senden eines Events z.B. an ein Topic im Simple Notification Service sein.
Landen die Alarm-Events einmal in einem Topic ist es ein leichtes die Information via E-Mail an alle Entwickler zu verteilen, die darauf reagieren sollten.

# Alarme mit Terraform erzeugen und an ein Topic schicken

Als Beispiel soll uns hier ein Alarm dienen, der immer dann ein Event an ein konfigurierbares Topic sendet, wenn eine Message in einer Dead Letter Queue (kurz DLQ) gelandet ist:
```terraform
resource "aws_sns_topic" "alarm" {
  name = "MyProject-Alarme-Stage"
}

resource "aws_cloudwatch_metric_alarm" "dlq_alarm" {
   alarm_name                = "MyProject-DlqAlarm-Stage"
   comparison_operator       = "GreaterThanOrEqualToThreshold"
   evaluation_periods        = 1
   metric_name               = "ApproximateNumberOfMessagesVisible"
   namespace                 = "AWS/SQS"
   period                    = "60"
   statistic                 = "Sum"
   threshold                 = 1
   datapoints_to_alarm       = 1
   alarm_description         = "Sends an event when there are messages in the DLQ"
   dimensions = {
      "QueueName" = aws_sqs_queue.dlq.name
   }
   alarm_actions = [aws_sns_topic.alarm.arn]
}
```
Damit könnte man meinen das Thema sei durch.
Alle Entwickler, die mit ihrer E-Mail das Topic abonniert haben, wissen Bescheid.
Ziel erreicht!

Es ergeben sich aber tatsächlich mehrere Probleme, für die Abhilfe geschaffen werden kann:
1. Wer bearbeitet das Problem eigentlich konkret?
2. Wurden überhaupt alle Alarme bereits bearbeitet?
3. Wie lesbar und damit wie schnell bearbeitbar sind diese erzeugten E-Mails überhaupt?

Tatsache ist, dass wir hier auf ein Problem gestoßen sind.
Es gibt immer wieder Alarme, die durch die gleiche Ursache ausgelöst wurden, sodass es dazu kommen kann, dass mehrere Entwickler am gleichen Thema arbeiten, ohne das kurzfristig zu erkennen.
Gibt es mal eine größere Anzahl von Alarmen, ist das E-Mail-Postfach nicht der Ort, an dem man übersichtlich sicherstellen kann, dass alle Alarme bereits bearbeitet wurden.
Und auch die Lesbarkeit der Mails lässt zu wünschen übrig.
Es sind zwar alle notwendigen technischen Informationen enthalten, aber es beschleunigt die Bearbeitung ungemein, wenn man zum Beispiel einen Stacktrace aus den Logs direkt im Anhang findet.

# Lambdas für die Erzeugung der Jira-Tickets nutzen

Wir teilen die Aufgaben für die Erzeugung und Anreicherung der Jira-Tickets in zwei Lambdas auf.
Damit erhöhen wir sowohl die Flexibilität als auch die Ausfallsicherheit der Lösung.
Sobald die erste Lambda für das initiale Anlegen eines Jira-Tickets erfolgreich durchgelaufen ist, können wir dieses Ticket um Zusatzinformationen, deren Beschaffung dann auch langläufiger oder komplizierter sein kann, erweitern.
In unserem Fall erweitern wir die Tickets bei protokollbasierten Alarmen im zweiten Schritt um den auslösenden Log-Eintrag.
Der Ansatz an sich ist aber offen für Erweiterungen, die aus den Anforderungen anderer Projekte entstehen könnten.

## Ein Jira-Ticket anlegen

Die Cloudwatch-Alarme werden so konfiguriert, dass sie eine Nachricht in ein SNS Topic schreiben, sobald sie auslösen. 
Auf dieses SNS Topic horcht eine Lambda-Funktion, welche die Aufgabe übernimmt, auf SNS Events zu reagieren und daraus ein Jira-Ticket zu erzeugen.

Um den Workflow zu beschleunigen und zu vereinfachen, sollen die erzeugten Jira-Tickets so aufgebaut sein, dass sie möglichst viele Informationen, die für die Bearbeitung des Alarms notwendig sind, auf einen Blick liefern.
Des Weiteren sollen natürlich keine Alarme verloren gehen, beispielsweise wenn es Probleme in der Kommunikation zwischen Jira und der Lambda-Funktion gibt.
Konkret bedeutet das, dass die Lambda-Funktion folgende Anforderungen erfüllen muss:
1. Erzeugte Alarmtickets sollen einem festen Namensschema entsprechen. Hierdurch lässt sich schnell erkennen, welches Teilprojekt / welche Komponente den Alarm ausgelöst hat.
   Ein mögliches Namensschema ist hier beispielsweise: 
   *[Projekt - Teilprojekt/Komponente - Stage] Alarm-Name*
2. In der Ticketbeschreibung sollen möglichst viele Informationen enthalten sein, die bei der Bearbeitung des Alarms nützlich sind (z.B. Wann löste der Alarm aus? Was ist passiert? Was ist zu tun?)
3. Alarmtickets sollen mit einer Priorität versehen werden.
4. Alarme dürfen unter keinen Umständen verloren gehen

### Aus einem SNS-Event wird ein Ticket
Das Event, welches als Auslöser der Lambda-Funktion dient, ist wie folgt aufgebaut:

*(Das folgende Beispiel bezieht sich auf einen Cloudwatch-Metrik-Alarm. 
Grundsätzlich gibt es auch andere Formen von Alarmen (bspw. für RDS), bei denen das Message-Attribut eine leicht abweichende Form aufweist. 
Diese Alarme werden in diesem Blog nicht weiter betrachtet)*
```json
{
  "Records": [
    {
      "EventSource": "aws:sns",
      "EventVersion": "1.0",
      "EventSubscriptionArn": "arn:aws:sns:{{region}}:{{accountId}}:ExampleTopic",
      "Sns": {
        "Type": "Notification",
        "MessageId": "95df01b4-ee98-5cb9-9903-4c221d41eb5e",
        "TopicArn": "arn:aws:sns:{{region}}:{{accountId}}:ExampleTopic",
        "Subject": "ALARM: \"Cloudwatch Alarm Name\" in EU - Frankfurt",
        "Message": "siehe unten",
        "Timestamp": "1970-01-01T00:00:00.000Z",
        "SignatureVersion": "1",
        "Signature": "EXAMPLE",
        "SigningCertUrl": "EXAMPLE",
        "UnsubscribeUrl": "EXAMPLE",
        "MessageAttributes": {
          "Test": {
            "Type": "String",
            "Value": "TestString"
          },
          "TestBinary": {
            "Type": "Binary",
            "Value": "TestBinary"
          }
        }
      }
    }
  ]
}
```
Der Inhalt von Records.*.Sns.Message wurde zur besseren Lesbarkeit in einen eigenen Block extrahiert; in der Realität ist das JSON in escapter Form im Message-Feld enthalten.

```json
//Records.*.Sns.Message
{
   "AlarmName": "Cloudwatch Alarm Name",
   "AlarmDescription": "Cloudwatch Alarm Beschreibung",
   "AWSAccountId": "{{accountId}}",
   "NewStateValue": "ALARM",
   "NewStateReason": "Threshold Crossed: 1 datapoint (10.0) was greater than or equal to the threshold (1.0).",
   "StateChangeTime": "1970-01-01T00:00:00.000+0000",
   "Region": "EU - Frankfurt",
   "OldStateValue": "OK",
   "Trigger": {
      "MetricName": "ExampleMetricName",
      "Namespace": "ExampleNamespace",
      "Statistic": "SUM",
      "Unit": null,
      "Dimensions": [],
      "Period": 300,
      "EvaluationPeriods": 1,
      "ComparisonOperator": "GreaterThanOrEqualToThreshold",
      "Threshold": 1.0
   }
}
```

Bei genauerer Betrachtung des Events stellen wir fest, dass insbesondere die Felder "AlarmName", "AlarmDescription", "NewStateReason" sowie "StateChangeTime" interessant sind.
Wenn der Cloudwatch-Alarmname dem gewünschten Namensschema der Jira-Alarmtickets entspricht, so kann dieser genauso übernommen werden. 
Andernfalls muss dieser in das gewünschte Format übertragen werden. 
Konventionen unterstützen bei diesem Schritt sehr.
Zudem ist es hilfreich, in den Cloudwatch-Alarmnamen die betroffene Stage aufzunehmen. 
Diese Stage-Information kann anschließend verwendet werden, um dem Ticket eine Priorität zuzuordnen (Prod-Alarme können so bspw. höher priorisiert werden als Dev-Alarme. 
Mehr dazu unter [Automatisierung in Jira nutzen](#automatisierung-in-jira-nutzen))

Aus den Feldern "AlarmDescription", "NewStateReason" und "StateChangeTime" lässt sich eine aussagekräftige Ticket-Beschreibung zusammensetzen. 

Werden weitere Informationen über die Alarm-Schwellwerte benötigt, so kann die Beschreibung um Informationen aus dem "Trigger"-Objekt angereichert werden. 
Sind mehrere AWS Accounts im Einsatz oder ist das Projekt in mehreren Regionen deployed, so sind auch die Felder "AWSAccountId" und "Region" besonders interessant.

Bei der Bearbeitung eines Alarmtickets kann es hilfreich sein, zu sehen, ob der Vorfall weiterhin anhält oder in der Vergangenheit schon einmal aufgetreten ist. 
Diese Informationen lassen sich sehr schnell direkt in der AWS-Konsole ablesen – ein Link zu dem Cloudwatch-Alarm kann auf einfache Weise zur Ticketbeschreibung hinzugefügt werden, da dieser folgendes Format besitzt:
`https://<AWS-REGION>.console.aws.amazon.com/cloudwatch/deeplink.js?region=<AWS-REGION>#alarmsV2:alarm/<ALARM-NAME>`

Nachdem das SNS Event in einen Ticketnamen und eine aussagekräftige Beschreibung überführt wurde, kann die [Jira-REST-API](https://developer.atlassian.com/server/jira/platform/rest-apis/) (insbesondere [POST /rest/api/3/issue](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-post)) verwendet werden, um ein Jira-Ticket anzulegen.

### Was passiert im Fehlerfall?
Was passiert, wenn Jira nicht erreichbar ist? 
Wir wollen auf keinen Fall, dass ein Alarm ausgelöst wird, wir aber nicht über diesen informiert werden. 
Zum Glück bietet AWS hierfür eine einfache Lösungsmöglichkeit an: 
Es ist möglich, eine Dead Letter Queue (DLQ) für eine Lambda-Funktion zu konfigurieren. 
Kann ein SNS Event nicht erfolgreich verarbeitet werden, so wird die Lambda-Funktion für eine konfigurierbare Anzahl an Versuchen mit demselben Event neu ausgelöst. 
Ist auch dies nicht erfolgreich, so wird das Event in die DLQ geschrieben. 
Für diese DLQ kann wiederum eine E-Mail-Benachrichtigung angelegt werden, sodass wir eine zuverlässige Fallback-Möglichkeit haben, um über Alarme informiert zu werden.

## Logs als Kommentar ergänzen
Nachdem das Alarmticket angelegt wurde, kann dieses um weitere Informationen angereichert werden, welche nicht im Alarm Event selbst enthalten sind.
Für die schnelle Fehleranalyse ist es beispielsweise sehr hilfreich, die Logs, welche von der Anwendung geschrieben wurden, als der Alarm ausgelöst wurde, bereits am Ticket selbst zu sehen und diese nicht erst selbst aus dem Log System heraussuchen zu müssen.

Im Folgenden schauen wir uns an, wie wir die entsprechenden Logs aus Cloudwatch auslesen und als Kommentar an das Alarmticket anhängen können.

Mithilfe des Amazon SDKs können wir auf einfache Art und Weise Logs aus einer Log-Gruppe auslesen.
Hierfür müssen wir lediglich den Namen der Log-Gruppe sowie das anzuwendende Filtermuster angeben. 
Optional können wir auch den Zeitraum angeben, in dem gesucht werden soll.
Die Informationen zu dem Zeitraum sowie den Namen der Log-Gruppe erhalten wir direkt aus dem auslösenden SNS Event (siehe [vorheriger Abschnitt](#aus-einem-sns-event-wird-ein-ticket)).
Das Filtermuster müssen wir zunächst mithilfe einer weiteren SDK-Funktion (describeMetricFilters) ermitteln.

Eine naive Implementierung könnte wie folgt aussehen (eine korrekte Fehlerbehandlung und die sichere Ermittlung des Filter Patterns wurde für eine bessere Lesbarkeit ausgelassen):
```java
import software.amazon.awssdk.services.cloudwatchlogs.CloudWatchLogsClient;
import software.amazon.awssdk.services.cloudwatchlogs.model.DescribeMetricFiltersResponse;
import software.amazon.awssdk.services.cloudwatchlogs.model.FilterLogEventsRequest;
import software.amazon.awssdk.services.cloudwatchlogs.model.FilteredLogEvent;

public List<FilteredLogEvent> retrieveLogsFor(String logGroupName,
                                              String metricName, 
                                              String metricNamespace,
                                              long searchStartTimeInMs,
                                              long searchEndTimeInMs) {
   final CloudWatchLogsClient cloudwatchClient = CloudWatchLogsClient.builder().build();
   final DescribeMetricFiltersResponse metricFilters =
                       cloudwatchClient.describeMetricFilters(metricName, metricNamespace, searchStartTimeInMs);
   final String filterPattern = metricFilters.metricFilters().get(0).filterPattern();
   final FilterLogEventsRequest filterLogEventsRequest = FilterLogEventsRequest.builder()
           .logGroupName(logGroupName))
           .filterPattern(filterPattern);
           .startTime(searchStartTimeInMs)
           .endTime(searchEndTimeInMs)
           .build();
   return cloudwatchClient.filterLogEvents(filterLogEventsRequest).events();
}
```

### Stolpersteine
Auch wenn sich mithilfe des oben gezeigten Code-Ausschnitts die entsprechenden Logs zu einem Alarm finden lassen, so gibt es einige Stolpersteine, auf die man spätestens im Produktiveinsatz stößt.

**Stolperstein 1: Die Logs sind nicht in der Antwort enthalten**
Es kann vorkommen, dass in der Antwort von `cloudwatchClient#filterLogEvents(FilterLogEventsRequest)`  keine Logs enthalten sind.
Zum einen kann dies passieren, wenn für die Anfrage tatsächlich keine passenden Log-Einträge gefunden werden, viel wahrscheinlicher ist aber der Fall, wenn zu viele Log-Einträge in dem angegebenen Zeitraum durchsucht werden müssen.

Betrachten wir einmal folgenden Fall: Wir suchen nach einem ERROR Log innerhalb der letzten 60 Minuten.
In diesem Zeitraum werden von der Anwendung 1000 Logs geschrieben. 
Der gesuchte Log-Eintrag wurde vor einer Minute geschrieben.

Die Log-Einträge werden in der richtigen zeitlichen Reihenfolge gesucht. 
Dies bedeutet, dass zunächst die Einträge gefunden werden, die 60 Minuten zurückliegen, dann die, welche 59 Minuten zurückliegen, etc.
Der obige Aufruf durchsucht nur eine bestimmte Anzahl an Log-Einträgen.
Wird hierbei nicht der geforderte Suchzeitraum komplett abgedeckt, ist in der Antwort ein "Next-Token" enthalten, welches für weitere Anfragen verwendet werden kann.
Das bedeutet, dass wir die "filterLogEvents"-Anfrage so oft wiederholen müssen, bis in der Antwort kein "Next-Token" enthalten ist, um sicherzustellen, dass wirklich alle Logs des angeforderten Zeitraums durchsucht wurden:
```java
FilterLogEventsResponse response = cloudwatchClient.filterLogEvents(filterLogEventsRequest);
List<FilteredLogEvent> foundLogs = new ArrayList<>();
while(response.nextToken() != null) {
    response = cloudwatchClient.filterLogEvents(filterLogEventsRequest, response.nextToken());
    foundLogs.addAll(response.events());
}
```

**Stolperstein 2: Die Suche der Logeinträge kann lange dauern**
Wenn die zu durchsuchende Cloudwatch Log-Gruppe viele Log-Einträge beinhaltet oder der Suchzeitraum sehr groß ist, kann die Suche der Log-Einträge sehr lange dauern.
Es ist wichtig, diese Tatsache zu berücksichtigen.
Wird die Anwendung als AWS Lambda Funktion bereitgestellt, so besitzt sie eine maximale Laufzeit von 15 Minuten.
Das kann unter Umständen nicht ausreichen, um alle Log-Einträge zu durchsuchen.
In der Anwendung müssen wir daher dafür sorgen, dass die Suche rechtzeitig beendet wird.
Eine Möglichkeit ist etwa, die Abbruchbedingung der obigen while-Schleife so zu erweitern, dass sie die verbleibende Zeit der Lambda-Funktion mit berücksichtigt.
Diese Information bekommen wir aus dem "Context"-Objekt, welches der Lambda-Funktion beim Auslösen übergeben wird.
Um einen einzelnen Suchvorgang zu beschleunigen, können wir zudem die maximale Anzahl der durchsuchten Log-Einträge pro Abfrage begrenzen:
```java
import com.amazonaws.services.lambda.runtime.Context;
// ...
final FilterLogEventsRequest filterLogEventsRequest = FilterLogEventsRequest.builder()
        .limit(25) // durchsuchte Einträge begrenzen
        // weitere Konfigurationen (siehe oben)
        .build();
        do {
        // Logs suchen (siehe oben)
        } while(response.nextToken() != null && context.getRemainingTimeInMillis() > TimeUnit.MINUTES.toMillis(1L)); // rechtzeitig abbrechen
```

**Stolperstein 3: Ratelimits**
Werden zu viele Suchabfragen in zu kurzer Zeit gestellt kann das Ratelimit der Cloudwatch API überschritten werden.
In diesem Fall wird eine `CloudwatchLogException` bei dem Aufruf von `cloudwatchClient#filterLogEvents(FilterLogEventsRequest)` geworfen.
Kommt es zu einer solchen Exception können wir diese einfach fangen und die Suchanfrage nach einer kurzen Pause erneut absetzen.

### Erzeugen des Kommentars
Nachdem wir alle passenden Logs gefunden haben, können wir diese als Kommentar an das Jira-Alarmticket anhängen.
Hierbei greifen wir abermals auf die [Jira-REST-API](https://developer.atlassian.com/server/jira/platform/rest-apis/) ([POST /rest/api/3/issue/{issueIdOrKey}/comment](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-comments/#api-rest-api-3-issue-issueidorkey-comment-post)) zurück.
Die benötigte Ticketnummer (Pfadvariable "issueIdOrKey") bekommen wir als Rückgabe, nachdem wir das Ticket angelegt haben (siehe [Aus einem SNS Event wird ein Ticket](#aus-einem-sns-event-wird-ein-ticket)).
Für eine bessere Lesbarkeit der Log-Einträge innerhalb des Jira-Kommentars bietet es sich an, diese als Code-Block darzustellen.
Damit alle Log-Einträge innerhalb desselben Code-Blocks angezeigt werden, müssen sie `\n`-separiert im Text-Attribut angegeben werden.

Ein Aufruf der Jira API für zwei Log-Einträge könnte also wie folgt aussehen:
```json
{
    "body": {
        "type": "doc",
        "version": 1,
        "content": [
            {
                "type": "codeBlock",
                "content": [
                    {
                        "type": "text",
                        "text": "Logeintrag 1\\nLogEintrag 2"
                    }
                ]
            }
        ]
    }
}
```
## Zusammenspiel der Komponenten
Wenn wir die hier erstellten Komponenten zusammen betrachten, ergibt sich folgendes Gesamtbild der technischen Infrastruktur:

![Aufbau der technischen Infrastruktur](/assets/images/posts/Alarmeboard_mit_Jira_und_Cloudwatch/Alarme_Konzept.png)
Eine nahezu beliebige Anzahl von Alarmen können auf Basis von Metriken oder Protokollfiltern definiert werden und senden ihre Events an ein SNS Topic ("Create Ticket").
Dieses stößt unsere erste Lambda an, die dafür zuständig ist das Ticket im Jira initial anzulegen.
Sobald dies erfolgreich erledigt wurde, kann das Event an ein weiteres SNS Topic ("Add Logs") weitergeleitet werden.
Die dadurch ausgelöste Lambda-Funktion ergänzt das Ticket um die Logs, die zu dem Alarm geführt haben.
Dazu wird auf die Logs in Cloudwatch anhand der Parameter aus dem Event zugegriffen.
Sollte es an einer beliebigen Stelle innerhalb dieses Prozesses zu einem Fehler kommen, sind beide Lambdas durch eine DLQ abgesichert, sodass keine Daten verloren gehen können.
Wenn zum Beispiel Jira kurzfristig nicht erreichbar war, können die Events aus der DLQ später wieder eingespielt werden.

Die benötigten Komponenten aus dem Werkzeugkasten von AWS sind somit sehr überschaubar.
Auch, wenn Alarme aus viele Projekte daran angeschlossen werden, skaliert diese Lösung problemlos mit.

### Kosten
Mit diesem Gesamtbild vor Augen kommen wir schnell auf die Frage, ob das nicht ein bisschen teuer werden könnte.
Denn am Ende soll sich die Investition ja auch wieder lohnen. 
Dabei spielen zwei Faktoren eine wesentliche Rolle.
Zum einen müssen wir betrachten wie viele Alarme bearbeitet werden müssen und wie stark das Team dadurch gebunden wird.
Damit ist hier ein Faktor gegeben, den jedes Projekt für sich selbst beantworten muss.
Aber die laufenden Kosten können wir hier zumindest grob überschlagen:
* Lambdas verursachen nur zur Laufzeit kosten.
  Selbst wenn wir hier deutlich überzogene 1.000 Aufrufe mit 15.000 ms Laufzeit und 512MB Speicher veranschlagen, kommen wir ohne Berücksichtigung des Freetiers auf gerade einem 0,12 USD Kosten pro Monat.
* Für SNS und SQS gilt ähnliches.
  Wenn man hier den Freetier von 1.000.000 Notifications pro Monat bei SNS und SQS verlässt, entstehen pro Request nur 0.0000005 USD an Kosten.
  Das sollte bei der Summe der erwarteten Alarme nie einen nennenswerten Betrag ergeben.
* Alarm-Metriken verursachen Kosten. 
  Diese sollten aber nicht dieser Lösung angerechnet werde, da sie in den zu überwachenden Projekten sowieso bereits benötigt werden.

Am Ende können wir sagen, dass die laufenden Kosten für die hier verwendeten Komponenten selbst jenseits des Freetiers zu vernachlässigen sind.

# Automatisierung in Jira nutzen
Für die Bearbeitung von Alarmen in Jira bietet sich ein Kanban Board an.
Für das Board lassen sich Automatisierungen einrichten, die die Arbeit mit den Alarmtickets weiter erleichtern.
Folgende Ideen lassen sich mit wenigen Klicks umsetzen:

**Erinnerung an Tickets, die nach 24 Stunden noch nicht bearbeitet wurden**

Hierfür lassen wir eine Automatisierung geplant jede Stunde eine Suche ausführen, die nach allen Tickets sucht, die in unserem Alarme-Board länger als 24 Stunden im Status "New" geblieben sind.
Das kann als JQL folgendermaßen aussehen:
```jql
createdDate <= -1d  AND statuscategory = "New" AND project = "Alarme"
```
Dabei ist es möglich die Bedingung der Regel auf Tickets einzuschränken, die seit dem letzten Lauf dazugekommen sind.

Über den Then-Part der Regel lässt sich dann eine E-Mail auslösen, die an einen Verteiler gerichtet werden kann und direkt auf die noch zu bearbeitenden Tickets referenziert:
```html
Bitte den Alarm bearbeiten: <a href="https://myproject.atlassian.net/browse/{{issue.key}}">{{issue.key}}</a>
```

**Projektbezogene Zuweisung von Tickets**

In einigen Fällen mag es sinnvoll sein, dass bestimmte Tickets immer bei einem bestimmten Entwickler landen sollen.
Über den Trigger "Vorgang erstellt", bekommt Jira mit, wenn ein neues Ticket angelegt wird.
Damit lassen sich dann wieder Bedingungen verknüpfen.
Zum Beispiel kann das Feld "Stichwort", in welches wir unter dem technischen Namen "subject" in der Lambda den Projektnamen geschrieben haben, nach einem bestimmten Wert durchsucht werden.
Wird das Projekt gefunden, so können wir den Vorgang einem Entwickler zuweisen und sogar direkt in den Status "In Progress" verschieben.

**Weitere Ideen**
* Ähnlich wie die Erinnerung nach 24 Stunden ließe sich auch eine Erinnerung einrichten, wenn ein Ticket über einen bestimmten Zeitraum keine Updates mehr erfährt.
* In Ausnahmefällen wäre es denkbar bestimmte Alarme automatisiert zu ignorieren.
  Wenn zum Beispiel ein System noch nicht produktiv genutzt wird, weil benötigte Rahmenbedingungen noch nicht gegeben sind, aber die Alarme schon aktiviert wurden, können die Tickets mit einem Kommentar versehen und nach "Done" verschoben werden. 

# Fazit
Alarme schnell und gründlich zu bearbeiten ist notwendig, aber keineswegs die Lieblingsbeschäftigung vieler Entwickler.
Dieses notwendige Übel zu vereinfachen und dabei noch ein kleines Projekt aufzusetzen, das seinen eigenen technischen Reiz mitbringt, dürfte die Motivation an dieser Stelle bereits verbessern.
Die Übersichtlichkeit und mögliche Automatisierung in Jira, ist eine in vielen Projekten bereits gerne genutzte Selbstverständlichkeit geworden, die hier um ein neues Anwendungsfeld erweitert wird.
Die laufenden Kosten sind marginal.

Am Ende muss der Aufwand, den ein Team in die Bearbeitung von Alarmen steckt, gegen den Aufwand der Entwicklung dieser Lambdas und deren Infrastruktur abgewogen werden.
Für uns hat es sich trotz einer überschaubaren Anzahl von Alarmen als äußerst lohnend erwiesen.
