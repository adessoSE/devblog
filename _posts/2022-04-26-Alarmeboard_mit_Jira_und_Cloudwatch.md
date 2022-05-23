---
layout: [post, post-xml]              
title:  "Automatisiert Jira-Tickets aus AWS-Alarmen erzeugen"         
date:   2022-04-26 10:00              
author_ids: [kaythielmann,sczubek]
categories: [Softwareentwicklung]           
tags: [DevOps, Lambda, Cloudwatch, Jira, AWS, Cloud]        
---

Im Rahmen eines Projekts, in dem eine ganze Reihe von Microservices entwickelt und betrieben werden, hat sich eine Idee entwickelt die Bearbeitung der Alarme zu verbessern.
Basierend auf Cloudwatch-Alarmen und einem Topic im Simple Notification Service von AWS, ist bei mehreren betriebenen Microservices sowie diversen Queues und anderen Komponenten schnell eine große Menge von Alarmen konfiguriert, die auf Protokollfiltern oder Metriken der Services beruhen können.
Dabei den Überblick zu behalten, wichtige Alarme direkt zu priorisieren und die Analyse zu vereinfachen ist nicht immer einfach.
Natürlich darf nichts unter den Tisch fallen und es sollte sichergestellt sein, dass klar ist, wer gerade welchen Alarm bearbeitet.

Mit Jira ist ein Tool gegeben, welches sowieso schon in vielen Projekten Einsatz findet. 
Wie dieses genutzt werden kann um die Alarme und ihren Status zu visualisieren will ich im Folgenden beschreiben.

# Wie entstand der Bedarf an der Lösung?
DevOps ist ein Thema, welches in unterschiedlichsten Teams, auf unterschiedliche Art gelebt wird. 
Mal gibt es eigene DevOps Teams, mal wird der Betrieb einer Lösung im Entwicklungsteam parallel zur Weiterentwicklung gehandhabt.

Aber egal wie man das Thema angeht, steht am Anfang das Bedürfnis danach direkt und ohne manuelle Tätigkeit über Fehlerzustände der Systeme informiert zu werden.
Das gängige Mittel der Wahl unter AWS sind Cloudwatch-Alarme, die Bedingungen an Metriken oder Protokollfilter knüpfen können.
Sobald die entsprechende Bedingung erfüllt ist, wird eine Aktion ausgeführt.
Dies kann zum Beispiel eine Skalierungsaktion für den entsprechenden Service oder auch das Senden eines Events z.B. an ein Topic im Simple Notification Service sein.
Landen die Alarm-Events einmal in einem Topic ist es ein leichtes die Information via E-Mail an alle Entwickler zu verteilen, die darauf reagieren sollten.

# Alarme mit Terraform erzeugen und an ein Topic schicken

Als Beispiel soll hier ein Alarm dienen, der immer dann ein Event an ein konfigurierbares Topic sendet, wenn eine Message in einer Dead Letter Queue gelandet ist:
```terraform
resource "aws_cloudwatch_metric_alarm" "dlq_alarm" {
  for_each                  = aws_sqs_queue.dlq
  alarm_name                = each.value.name
  comparison_operator       = "GreaterThanOrEqualToThreshold"
  evaluation_periods        = 1
  metric_name               = "ApproximateNumberOfMessagesVisible"
  namespace                 = "AWS/SQS"
  period                    = "60"
  statistic                 = "Sum"
  threshold                 = "1"
  ok_actions                = []
  insufficient_data_actions = []
  datapoints_to_alarm       = 1
  alarm_description         = "This Alarm triggers when there are messages, which could not be published"
  dimensions = {
    "QueueName" = each.value.name
  }
  alarm_actions = [var.alarmTopicSns]
  tags          = var.tags
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
Es gibt immer wieder Alarme, die mehrfach auslösen, sodass es dazu kommen kann, dass mehrere Entwickler am gleichen Alarm arbeiten, ohne das kurzfristig zu erkennen.
Gibt es mal eine größere Anzahl von Alarmen, ist das E-Mail-Postfach nicht der Ort, an dem man übersichtlich sicherstellen kann, dass alle Alarme bereits bearbeitet wurden.
Und auch die Lesbarkeit der Mails lässt zu wünschen übrig.
Es sind zwar alle notwendigen technischen Informationen enthalten, aber es beschleunigt die Bearbeitung ungemein, wenn man zum Beispiel einen Stacktrace aus den Logs direkt im Anhang findet.

# Lambdas für die Erzeugung der Jira-Tickets nutzen

> ### Outline
> Jira bietet eine [REST-Schnittstelle](https://developer.atlassian.com/server/jira/platform/rest-apis/) an, die dafür genutzt werden kann, Alarme in Tickets zu gießen.
> * Motivation für 2 Lambdas

## Ein Jira-Ticket anlegen

Die Cloudwatch-Alarme werden so konfiguriert, dass sie eine Nachricht in ein SNS-Topic schreiben, sobald sie auslösen. 
Auf dieses SNS-Topic horcht eine Lambda-Funktion, welche die Aufgabe übernimmt, auf SNS-Events zu reagieren und daraus ein Jira-Ticket zu erzeugen.

Um den Workflow zu beschleunigen und zu vereinfachen, sollen die erzeugten Jira-Tickets so aufgebaut sein, dass sie möglichst viele Informationen auf einen Blick liefern, die für die Bearbeitung des Alarms notwendig sind.
Des Weiteren sollen natürlich keine Alarme verloren gehen, beispielsweise wenn es Probleme in der Kommunikation zwischen Jira und der Lambda-Funktion gibt.
Konkret bedeutet das, dass die Lambda-Funktion folgende Anforderungen erfüllen muss:
1. Erzeugte Alarm-Tickets sollen einem festen Namensschema entsprechen. Ein mögliches Namensschema ist hier beispielsweise: 
   *[Projekt - Teilprojekt/Komponente - Stage] Alarm-Name*
2. In der Ticket-Beschreibung sollen möglichst viele Informationen enthalten sein, die bei der Bearbeitung des Alarms nützlich sind (z.b. wann löste der Alarm aus?, was ist passiert?, was ist zutun?)
3. Alarm-Tickets sollen mit einer Priorität versehen werden.
4. Alarme dürfen unter keinen Umständen verloren gehen

### Aus einem SNS-Event wird ein Ticket
Das Event, welches als Auslöser der Lambda-Funktion dient, ist wie folgt aufgebaut:

*(Der Inhalt von Records.\*.Sns.Message wurde zur besseren Lesbarkeit in einen eigenen Block extrahiert; in der Realität ist das JSON in escapter Form im Message-Feld enthalten)*

*(Das folgende Beispiel bezieht sich auf einen Cloudwatch-Metrik-Alarm. Grundsätzlich gibt es auch andere Formen von Alarmen (bspw. für RDS), bei denen das Message-Attribut eine leicht abweichende Form aufweist. Diese Alarme werden in diesem Blog nicht weiter betrachtet)*
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

Bei genauerer Betrachtung des Events stellen wir fest, dass insbesondere die Felder "AlarmName", "AlarmDescription", "NewStateReason" sowie "StateChangeTime" besonders interessant sind.
Wenn der Cloudwatch Alarm Name dem gewünschten Namensschema der Jira-Alarm-Tickets entsprechen, so kann dieser genau so übernommen werden. Andernfalls muss dieser in das gewünschte Format übertragen werden. 
Konventionen unterstützen bei diesem Schritt sehr.
Zudem ist es hilfreich, in den Cloudwatch-Alarm-Namen die betroffene Stage aufzunehmen. 
Diese Stage-Information kann anschließend verwendet werden, um dem Ticket eine Priorität zuzuordnen (Prod-Alarme können so bspw. höher priorisiert werden als Dev-Alarme. 
Mehr dazu unter [Automatisierung in Jira nutzen](#automatisierung-in-jira-nutzen)) 

Aus den Feldern "AlarmDescription", "NewStateReason" und "StateChangeTime" lässt sich eine aussagekräftige Ticket-Beschreibung zusammensetzen. 

Werden weitere Informationen über die Alarm-Schwellwerte benötigt, so kann die Beschreibung um Informationen aus dem "Trigger"-Objekt angereichert werden. 
Sind mehrere AWS-Accounts im Einsatz oder ist das Projekt in mehreren Regionen deployed, so sind auch die Felder "AWSAccountId" und "Region" besonders interessant.

Bei der Bearbeitung eines Alarm-Tickets kann es hilfreich sein, zu sehen, ob der Vorfall weiterhin anhält oder in der Vergangenheit schon einmal aufgetreten ist. 
Diese Informationen lassen sich sehr schnell direkt in der AWS-Konsole ablesen – ein Link zu dem Cloudwatch-Alarm kann auf einfache Weise zur Ticket-Beschreibung hinzugefügt werden, da dieser folgendes Format besitzt:
`https://<AWS-REGION>.console.aws.amazon.com/cloudwatch/deeplink.js?region=<AWS-REGION>#alarmsV2:alarm/<ALARM-NAME>`

Nachdem das SNS-Event in einen Ticket-Name und eine aussagekräftige Beschreibung überführt wurde, kann die [Jira-REST-API](https://developer.atlassian.com/server/jira/platform/rest-apis/) (inbesondere [POST /rest/api/3/issue](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-post)) verwendet werden, um ein Jira-Ticket anzulegen.

### Was passiert im Fehlerfall?
Was passiert, wenn Jira nicht erreichbar ist? 
Wir wollen auf keinen Fall, dass ein Alarm ausgelöst wird, aber wir nicht über diesen informiert werden. 
Zum Glück bietet AWS hierfür eine einfache Lösungsmöglichkeit an: 
Es ist möglich, eine Dead-Letter-Queue (DLQ) für eine Lambda-Funktion zu konfigurieren. 
Kann ein SNS-Event nicht erfolgreich verarbeitet werden, so wird die Lambda-Funktion für eine konfigurierbare Anzahl an Versuchen mit demselben Event neu ausgelöst. 
Ist auch dies nicht erfolgreich, so wird das Event in die DLQ geschrieben. 
Für diese DLQ kann wiederum eine E-Mail-Benachrichtigung gelegt werden, sodass wir eine zuverlässige Fallback-Möglichkeit haben, um über Alarme informiert zu werden.

## Logs als Kommentar ergänzen
Nachdem das Alarm-Ticket angelegt wurde, kann dieses um weitere Informationen angereichert werden, welche nicht im Alarm-Event selbst enthalten sind.
Für die schnelle Fehleranalyse ist es beispielsweise sehr hilfreich, die Logs, welche von der Anwendung geschrieben wurden, als der Alarm ausgelöst wurde, bereits am Ticket selbst zu sehen und diese nicht erst selbst aus dem Log-System heraussuchen zu müssen.

Im Folgenden schauen wir uns an, wie wir die entsprechenden Logs aus Cloudwatch auslesen und als Kommentar an das Alarm-Ticket anhängen können.

Mithilfe des Amazon SDKs können wir auf einfache Art und Weise Logs aus einer Log-Gruppe auslesen.
Hierfür müssen wir lediglich den Namen der Log-Gruppe sowie das anzuwendende Filter-Muster angeben. 
Optional können wir auch den Zeitraum angeben, in dem gesucht werden soll.
Die Informationen zu dem Zeitraum sowie den Namen der Log-Gruppe erhalten wir direkt aus dem auslösenden SNS-Event (siehe [vorheriger Abschnitt](#aus-einem-sns-event-wird-ein-ticket)).
Das Filter-Muster müssen wir zunächst mithilfe einer weiteren SDK-Funktion (describeMetricFilters) ermitteln.

Eine naive Implementierung könnte wie folgt aussehen (eine korrekte Fehlerbehandlung und die sichere Ermittlung des Filter-Patterns wurde für eine bessere Lesbarkeit ausgelassen):
```java
public List<FilteredLogEvent> retrieveLogsFor(String logGroupName,
                                              String metricName, 
                                              String metricNamespace,
                                              long searchStartTimeInMs,
                                              long searchEndTimeInMs) {
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
> ### Todo für diesen Abschnitt:
> 1. Stolpersteine (Rate-Limit, lange Suchzeit)
> 2. Anlegen des Kommentars mittels JIRA API [POST /rest/api/3/issue/{issueIdOrKey}/comment](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-comments/#api-rest-api-3-issue-issueidorkey-comment-post)

## Zusammenspiel der Komponenten

![Aufbau der Infrastruktur](/assets/images/posts/Alarmeboard_mit_Jira_und_Cloudwatch/Alarme_Konzept.png)

### Kosten

# Automatisierung in Jira nutzen

# Alternativen

## AWS eigenes Tool

## Was von Jira

# Fazit