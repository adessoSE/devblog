---
layout:         [post, post-xml]              
title:          "Logaggregation in verteilten Systemen mit Loki"
date:           2022-03-20 16:00
modified_date:  2022-03-20 16:00
author_ids:     [hesch] 
categories:     [Softwareentwicklung]
tags:           [Logging, Microservices, Architektur]
---

Gerade in verteilten Systemen ist es bei wachsender Zahl von Komponenten schwierieg, den Überblick über alle Logs zu behalten.
Daher ist ein Logaggregationsdienst für Transparenz und Fehleranalyse in solchen Systemen sehr hilfreich.
Dieser sammelt die Logs von allen möglichen Services und Systemen an einer zentralen Stelle.
Dieser Artikel beschreibt wie der Logaggregationsdienst Loki mit allen notwendigen Komponenten aufgesetzt werden kann und in ein bestehendes System aus Microservices eingebunden werden kann.

# Logaggregation
In verteilten Systemen fallen Logs an vielen unterschiedlichen Stellen an.
Jeder Microservice sowie jeder Server und jeder Dienst auf diesen Servern bietet seine eigenen Logausgaben.
Diese Logausgaben an zentraler Stelle zusammenzufassen, ist die Aufgabe der Logaggregation.
Dazu gibt es verschiedene Systeme, die eingesetzt werden könnnen.
Wohl am bekanntesten ist der Technologiestack von Elastic mit Elasticsearch, Logstash und Kibana oder als alternative Graylog.
Wer kein großes ressourcenfressendes System aufsetzen möchte, kann auf Loki setzen.
Ende 2019 wurde dieser Dienst von GrafanaLabs veröffentlicht und ist damit gegenüber den Alternativen relativ neu.
Loki hat dabei gegenüber den anderen Technologien den Vorteil leichtgewichtiger zu sein.
Außerdem lässt es sich einfacher in bestehende Grafana-Installationen integrieren.
Zudem können Anfragen an die Logdatenbank in Loki durch eine eigens entwickelte LogQL-Sprache umgesetzt werden.
Durch die Integration von Loki in Grafana sind damit auch Analysen möglich, die Fachdaten oder Performancedaten von Prometheus in Zusammenhang mit den Logdaten setzen.

# Der Loki-Grafana Stack
Der Loki-Grafana-Stack besteht hauptsächlich aus drei Diensten: Promtail, Loki und Grafana.
Promtail ist hier dafür zuständig, die Logs aus verschiedenen Quellen zu sammeln und an Loki weiterzuleiten.
Loki ist die eigentliche Logdatenbank und implementiert auch die LogQL.
Grafana kennen einige vielleicht auch aus anderen Kontexten und ist die grafische Oberfläche zur Darstellung von Diagrammen.
Es wird häufig als Tool zum erstellen von fachlichen und technischen Dashboards genutzt.
Loki kann aber auch sehr leicht in Grafana eingebunden werden.
Der komplette Grafana-Loki-Stack ist auf Containerisierung ausgelegt, darum werde ich in diesem Artikel das Aufsetzen von dem Stack mit Docker zeigen.

## Promtail
Schauen wir uns zunächst Promtail an.
Hier ist ein einfaches Beispiel für eine docker-compose Konfiguration, um Promtail zu starten:
```yaml
version: '3.8'
servces:
  promtail:
    image: grafana/promtail:2.4.2
    networks:
      - plg
    ports:
      - 9080:9080
    volumes:
      - ./promtail.yml:/etc/promtail/config.yml:ro
      - /var/log/:/var/log/:ro
```
Wir ordnen Promtail zunächst dem plg-Netzwerk hinzu, damit die Kommunikation unter den Services funktioniert.
Die Portfreigabe ist nützlich für den eingebauten Webserver, in der wir die Konfiguration und gefundenen Dienste sehen können.
Der Port muss für die fehlerfreie Funktion nicht unbedingt freigegeben werden und kann in Produktivsystemen auch sicherheitshalber abgeschaltet werden.
Unter der Portfreigabe sehen wir noch zwei Volumen.
Das erste Volumen mounted unsere Konfigurationsdatei in den Container.
Das zweite gibt hier zum ausprobieren einfach einmal die Systemlogdateien an Promtail weiter.
In der Praxis würden wir hier natürlich die Logdateien unserer Services weitergeben und überwachen.

Hier sehen wir einmal die in den Container gemountete Konfigurationsdatei von Promtail:
```yaml
server:
  http_listen_port: 9080
  grpc_listen_port: 0

positions:
  filename: /tmp/positions.yaml

clients:
  - url: http://loki:3100/loki/api/v1/push

scrape_configs:
- job_name: system
  static_configs:
  - targets:
      - localhost
    labels:
      job: varlogs
      __path__: /var/log/*.log
```
Der Server-Block konfiguriert den Webserver und gibt die Weboberfläche auf Port 9080 frei.
Der `positions`-Block konfiguriert eine Datei, in der gespeichert wird, wie weit Promtail in den Logdateien schon gelesen hat.
Beim Neustarten von Promtail, geht diese Information sonst verloren und Logeinträge erscheinen doppelt.
Normalerweise sollte diese Datei auch in einem Dockervolumen liegen, aber für unser Testbeispiel liegt die Datei einfach im Container.
Unter `cients` wird die Loki-Instanz konifiguriert, welche Promtail verwenden soll.
In unserem Beispiel verwenden wir `loki` als Hostnamen, da dieser über Docker so aufgelöst wird.
Der `scrape_configs`-Block gibt nun die tatsächlichen Dateien an, die Promtail überwachen soll.
Wir verwenden eine sehr einfache `scrape_config`, die nur unsere gemounteten Logs überwacht.
Es gibt hier auch noch andere Konfigurationsoptionen, die dynamisch neue Logquellen aufdecken können.

Eine weitere Möglichkeit Logs in Loki einzuliefern ist das Loki-Docker-Plugin, welches sich als Loggingtreiber in Docker einbindet und so die Logs an Loki weiterleitet.
Die Installation des Plugins ist einfach über den folgenden Befehl möglich:
```bash
docker plugin install grafana/loki-docker-driver:latest --alias loki --grant-all-permissions
```
Danach kann der Loggingtreiber in der docker-compose Datei durch einen logging-Block folgendermaßen eingebunden und konfiguriert werden:
```yaml
services:
  example-service:
    logging:
      driver: loki
      options:
	loki-url: "http://loki:3100/loki/api/v1/push"
```
Für Microservices ist das Plugin sehr praktisch, weil dadurch keine Anpassung in den Services selbst geschehen muss, damit die Logs in Loki gesammelt werden können.

Eine weitere Alternative Logs an Loki zu schicken ist beispielsweise der (loki-logback-appender)[https://github.com/loki4j/loki-logback-appender], der in die Logging-Konfiguration der einzelnen Microservices eingebunden wird und dann selbstständig Logs zu Loki schickt.

## Loki

Im Grunde genommen, ist Loki eine Datenbank, die Logzeilen abspeichert und einen sehr schlanken Index für diese anlegt.
Der Index wird nur über die Labels generiert, die an Loki weitergetragen werden Bspw. Log-Level oder loggender Service.
Loki hat grundlegend zwei Modi in denen es ausgeführt werden kann.
Zum einen kann Loki als einzelner Server oder im Microservice-Modus laufen.
Dazu kann man in jeder Konfigurationsdatei angeben, welche Komponenten von Loki geladen werden sollen.
Hier beschränken wir uns aber erstmal auf die einfache Variante, in der wir nur einen Server haben.

Kommen wir jetzt zum eigentlichen Herzstück der Loki Konfiguration.
Wie auch Promtail wird Loki als Docker Container gestartet und per docker-compose konfiguriert.
```yaml
services:
 loki:
    image: grafana/loki:2.4.1
    hostname: loki
    networks:
      - plg
    ports:
      - 3100:3100
    volumes:
      - ./loki-data/:/loki
      - ./loki.yml:/etc/loki/local-config.yaml
```

Die docker-compose Datei für Loki sieht sehr ähnlich aus, wie die von Promtail.
Der Container wird in das gleiche Netzwerk `plg` hinzugefügt für die Kommunikation und dem Container wird der Hostname "loki" gegeben.
Dadurch funktioniert die Namensauflösung, damit die URLs von promtail funktionieren.
Loki läuft auf Port 3100.
Der Port wird hier freigegeben, damit auch von außen Zugriff besteht.
In Produktivsystemen muss dieser Port aber auch nicht nach außen freigegeben werden und sollte es auch nicht, solange wir wie hier keine Authentifizierung eingerichtet haben.
Loki benötigt als Volumen einmal einen Ort für die Daten und die Konfigurationsdatei.
Diese schauen wir uns im nachfolgenden an:

```yaml
auth_enabled: false

server:
  http_listen_port: 3100

common:
  path_prefix: /loki
  storage:
    filesystem:
      chunks_directory: /loki/chunks
      rules_directory: /loki/rules
  replication_factor: 1
  ring:
    instance_addr: localhost
    kvstore:
      store: inmemory

schema_config:
  configs:
    - from: 2022-01-01
      store: boltdb-shipper
      object_store: filesystem
      schema: v11
      index:
        prefix: index_
        period: 24h
```

Für unser Beispiel deaktivieren wir zunächst die Authentifizierung und setzen den Port.
Der `common`-Abschnitt konfiguriert Optionen, die für alle Komponenten von Loki gelten sollen.
Der `path_prefix` definiert den Präfix, der vor den Aufruf-URLs steht.
Danach wird der `storage` konfiguriert.
In unserem Fall einfach das Dateiensystem.
Hier können auch Cloud-Speicher wie S3, Google Cloud Storage oder Azure verwendet werden.
Der `replication_factor` gibt an, wie oft wir unsere Logdaten speichern wollen.
Als nächstes konfigurieren wir den `ring` ein Key-Value-Store, der von Loki intern zur Synchronisation der Instanzen verwendet wird.
Da wir nur eine Instanz haben, reicht ein Key-Value-Store im Speicher von Loki selbst.

Der nächste große Block ist die `schema_config`.
Hier wird definiert, wie der Index gespeichert wird.
Zunächst ist zu sehen, dass mehrere Configs möglich sind.
In Loki wird das verwendet, um Migrationen zu neuen Konfigurationen zu ermöglichen.
Sollten wir irgendwann eine andere Konfiguration für den Index oder Object-Store wählen wollen, können wir einfach eine neue Konfiguration hinzufügen.
Durch das `from`-Feld kann dann angegeben werden, ab wann die neue Konfiguration gilt.

Normalerweise braucht Loki eine NoSQL-Datenbank, um den Index zu speichern.
Boltdb ist eine Alternative, die auf dem Dateiensystem funktioniert, ähnlich wie SQLite in der SQL Welt.
Für große Deployments von Loki wäre beispielsweise Cassandra zu bevorzugen, aber für unser Setup reicht Boltdb.
Der `index`-Block gibt noch an, wie der Präfix für index Tabellen sein soll und wann eine neue Tabelle angefangen wird.

## Grafana

Als letztes benötigen wir noch Grafana, um eine grafische Oberfläche für unsere Logs zu haben.
Grafana benötigt, wie die anderen Dienste auch, ein Volumen für die Datenbank und eine Portfreigabe.
Für den Zugriff auf Loki ist es im gleichen Netzwerk, wie der Loki-Container.
Die Grafana-Konfiguration muss in unserem Beispiel nicht angepasst werden.
Also können wir mit folgender docker-compose Datei einfach Grafana starten:

```yaml
version: '3.8'
services:
  grafana:
    image: grafana/grafana:8.2.6
    hostname: grafana
    networks:
      - plg
    ports:
      - 3000:3000
    volumes:
      - ./grafana-db:/var/lib/grafana
```

Nachdem Grafana aufgesetzt ist, muss noch Loki als Data source hinzugefügt werden.
Dazu einfach unter `Configuration>Data sources>Add Data source` Loki auswählen.
In der Konfigurationsmaske muss unter `HTTP>URL` `loki:3100` eingetragen werden.
Damit sollte Loki soweit eingerichtet sein.
Unter Explore kann man nun Loki auswählen, um sich die Logs anzuschauen:
![Loki Oberfläche in Grafana](/assets/images/posts/logaggregation-loki/grafana-explore-loki.png)
Hier sehen wir eine Anzeige, um LogQL-Queries auszuführen und können die Oberfläche verwenden, um unsere Service-Logs zu analysieren.
Wir können hier also unsere LogQL-Queries schreiben und unsere Logs analysieren.
Ich empfehle mit diesem Testsetup einfach mal ein wenig rumzuspielen und selbst ein paar Queries zu schreiben.
