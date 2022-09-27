---
layout:			[post, post-xml]											# Pflichtfeld. Nicht ändern!
title:			"Orchestrierung mit Nomad"                                  # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:			2022-09-30 12:00											# Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
modified_date: 	2022-09-30 12:00											# Optional. Muss angegeben werden, wenn eine bestehende Datei geändert wird.
author_ids:			[unexist]								                # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesem Namen geben.
categories: 	[Softwareentwicklung]										# Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags:			[Orchestrierung, Kubernetes, Nomad]	        # Bitte auf Großschreibung achten.
---

Orchestrierung ist in aller Munde und aus vielen Bereichen gar nicht mehr wegzudenken - doch gibt es
neben dem Platzhirschen Kubernetes eigentlich Alternativen?

Im Zuge dieses Artikels beschäftigen wir uns mit dem Job Scheduler Nomad aus dem Hause HashiCorp
und sehen uns anhand von einfachen Beispielen an welche Möglichkeiten hier geboten werden, wie ein
Deployment aussehen kann und beschäftigen uns anschließend mit fortgeschrittenen Themen wie Service
Discovery und Canary Deployments.


![image](/assets/images/posts/logging-vs-tracing/kibana_log.png)