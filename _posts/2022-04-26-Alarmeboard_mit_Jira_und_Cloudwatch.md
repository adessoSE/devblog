---
layout: [post, post-xml]              
title:  "Automatisiert Jira-Tickets aus AWS-Alarmen erzeugen"         
date:   2022-04-26 10:00              
author_ids: [kaythielmann]
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
DevOps ist ein Thema, welches in unterschiedlichsten Teams, auf unterschiedliche Art gehandhabt wird. 
Mal gibt es eigene DevOps Teams, mal wird der Betrieb einer Lösung im Entwicklungsteam parallel zur Weiterentwicklung gehandhabt.

Aber egal wie man das Thema angeht, steht am Anfang das Bedürfnis danach direkt und ohne manuelle Tätigkeit über Fehlerzustände der Systeme informiert zu werden.
Das gängige Mittel der Wahl unter AWS sind Cloudwatch-Alarme, die Bedingungen an Metriken oder Protokollfilter knüpfen können.
Sobald die entsprechende Bedingung erfüllt ist, wird eine Aktion ausgeführt.
Dies kann zum Beispiel eine Skalierungsaktion für den entsprechenden Service oder auch das Senden eines Events z.B. an ein Topic im Simple Notification Service sein.
Landen die Alarm-Events einmal in einem Topic ist es ein leichtes die Information via E-Mail an alle Entwickler zu verteilen, die darauf reagieren sollten.

![Aufbau der Infrastruktur](/assets/images/posts/Alarmeboard_mit_Jira_und_Cloudwatch/Alarme_Konzept.png)

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
Ziel erreicht.

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
Jira bietet eine [REST-Schnittstelle](https://developer.atlassian.com/server/jira/platform/rest-apis/) an, die dafür genutzt werden kann, Alarme in Tickets zu gießen.

* Motivation für 2 Lambdas
* DLQ mit Alarm auf Email, um sicherzustellen, dass keine Alarme verloren gehen.

## Ticket anlegen
* Immer Fallback auf Message
* Konventionen machen das Leben einfacher

SNS-Event besteht aus Subject und Message

Nachdem wir den JSON-String, der als Message übertragen wurde, via ObjectMapper in ein Alarm-Object geparsed haben, können wir aus diesem die einzelnen Absätze für die Beschreibung des Tickets erzeugen.
```java
private static Description mapToDescription(Alarm alarm) {
    ParagraphContent description = ParagraphContent.simple(alarm.getDescription());
    ParagraphContent reason = ParagraphContent.simple(alarm.getReason());
    ParagraphContent stateChangeTime = ParagraphContent.simple(alarm.getStateChangeTime());
    ParagraphContent deepLinkToAWSConsole =
            ParagraphContent.link("AWS Cloudwatch - Alarm Deeplink", createDeeplinkToAWSConsole(alarm.getName()));
    return new Description(asList(description, reason, stateChangeTime, deepLinkToAWSConsole));
}
```
Leider liefert Amazon bis Dato keine vorgefertigten Methoden zur Erzeugung eines Links auf 

Die Anbindung der Schnittstelle für das Anlegen eines Tickets in Jira ist dank Retrofit durch einfachen Interface erledigt.
```java
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.POST;

public interface JiraAPI {
    @POST("rest/api/3/issue")
    Call<CreateIssueResponseDTO> createIssue(@Body CreateIssueDTO createIssueDTO);
}
```

## Logs als Kommentar ergänzen

# Automatisierung in Jira nutzen

