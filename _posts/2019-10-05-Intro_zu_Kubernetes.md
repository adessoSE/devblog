---
layout:         [post, post-xml]              
title:          "Einführung in Kubernetes"
date:           2018-10-05 10:28
author:         t-buss
categories:     [Softwareentwicklung]
tags:           [cloud, kubernetes]
---
Die Container-Orchestrierungs-Lösung Kubernetes ist das wohlmöglich am stärksten gewachsene Open Source Projekt der letzten Jahre.
Alle großen Cloud-Anbieter wie Google, Amazon, Microsoft und weitere bieten heutzutage Kubernetes-Instanzen an.
Grund genug, sich einmal näher mit Kubernetes und Konzepten dahinter zu beschäftigen.

# Einführung in Kubernetes
In diesem Blogpost geht es um die grundlegenden Konzepte, mit denen Kubernetes arbeitet.
Wir betrachten ein kleines Beispiel, indem wir eine triviale SpringBoot-Anwendung in einem lokalen Kubernetes-Cluster, Minikube, ausführen.
Zunächst klären wir aber einmal die Begrifflichkeiten.

# Cluster, Nodes und Pods
Kuberentes ist eine verteilte Anwendung, wird also auf mehreren physikalischen (oder virtuellen) Rechnern ausgeführt, die man als "Nodes" bezeichnet und zusammen den Kubernetes Cluster bilden.
Mindestens ein Node nimmt dabei die Rolle des Masters ein, der den Cluster managed und die Befehle des Benutzers entgegen nimmt.

Auf den Nodes laufen sogenannte "Pods".
Sie sind die kleinste Ressource in Kubernetes.
Ein Pod führt einen oder mehrere Container aus, die zusammen als Einheit gestartet werden müssen.
Die Wörtchen "oder mehrere" können dabei leicht zu Verwirrung führen.
In einer Microservices-Anwendung korrespondiert ein Pod zu einem Microservice, also meistens auch einem Container.
Es gibt verschiedene Fälle, in denen man gleich mehrere Container in einem Pod starten möchte.
Dies soll jedoch nicht Inhalt dieses Blogposts sein.

```yaml
Notizen:
- Cluster/Nodes/Master definieren (Hinweis auf Pods)
- Ziel Service für andere im Cluster unter DNS-Namen bereitstellen
- Untere Ebene Pods (stateless, können erscheinen und wieder verschwinden)
- Manuell starten ist doof -> "Deployment"
	- Als YAML-Datei, Deklarative Beschreibung der Infrastruktur "Was will - - ich haben?" anstatt "Was muss passieren?"
	- beschreibt welche Pods mit welchen Containern laufen sollen
	- beschreibt auch Image
	- beschreibt auch Anzahl (Replicas)
- Service leitet anfragen an alle Pods, die Label haben (weiß nichts von "Deployment")
- Service als Datei erstellen oder per CLI?
- Deployment nutzt intern sog. ReplicaSets
	Beispiel auf neue Version updaten -> neues ReplicaSet fährt hoch, altes fährt runter

########## TEIL 2 (?) ##########
ConfigMaps:
	- Umgebungsvariablen in Pods injizieren
	- App also so bauen, dass hauptsächlich auf Umgebungsvariablen geguckt wird
```