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

Pods sind kurzlebig.
Sie werden erstellt, bekommen eine interne IP und führen ihre Container aus.
Wenn ein Pod beendet wird oder abstürzt, werden lokale Daten und Speicher gelöscht.
Die IP des Pods kann nun von beliebigen anderen Pods verwendet werden.
Es stellt sich also die Frage, wie man eine Anwendung erreichen kann, wenn die interne IP nicht als fest angenommen werden kann.
Zudem ist es für Anwendungen mit hoher Last nicht möglich, alle Anfragen von nur einer Instanz abwickeln zu lassen.
Zur Skalierung müssen mehrere Pods gestartet werden, unter denen sich die Last aufteilt.
Diese Probleme nennt man "Service Discovery" und "Load Balancing" und sind in vielen verteilten Anwendungen präsent.

# Zielsetzung
Das Ziel in diesem Blogpost soll es sein, einen REST-Service in einem Kubernetes Cluster bereitzustellen.
Clients im selben Cluster können eine URI aufrufen und erhalten die erwartete Antwort.
Es soll außerdem sichergestellt werden, dass bei einem Absturz der Anwendung automatisch eine neue Instanz gestartet wird.
Zudem soll gewährleistet werden, dass während des Ausfalls einer Instanz die Last auf andere Instanzen so verteilt wird, dass der Ausfall von außen quasi nicht zu sehen ist.

# Die Tools
Schauen wir uns die Tools an, mit denen wir unser Beispiel durchführen werden.

## Minikube
Allen voran brauchen wir einen Cluster, auf dem wir unsere Beispielanwendung laufen lassen.
Für die lokale Entwicklung eignet sich [Minikube](https://kubernetes.io/docs/setup/minikube/) sehr gut.
Es stellt einen Cluster mit nur einem Node in einer virtuellen Maschine bereit.
Dieser unterscheidet sich von einem "echten" Kubernetes Cluster nur darin, dass auf dem einen Node sowohl die Pods als auch die Master-Prozesse zur Verwaltung des Clusters laufen.
Normalerweise sind die Master-Prozesse auf designierten Nodes.

*Achtung: Obwohl V-Sphere offiziell von Minikube als Virtualisierungs-Lösung unterstütz wird, hatte ich einige Probleme, es damit zu starten.
Mit VirtualBox habe ich wesentlich bessere Erfahrungen gemacht und möchte es daher jedem ans Herz legen.*

Nachdem ein lokaler Cluster nach den Anweisungen auf der Minikube-Website installiert und gestartet wurde, können wir uns schon ein wenig in unserem Cluster umsehen.
Dazu dient das Kommandozeilentool `kubectl`.
Mit `kubectl get pods` können wir uns beispielsweise alle Pods anzeigen lassen, die gerade laufen.
Wer kein Freund von Kommandozeilentools ist, kann sich mit dem Kubernetes Dashboard weiterhelfen.
Dazu gibt man das Kommando `minikube dashboard` ein, woraufhin sich der Browser öffnet und das Dashboard anzeigt.
Hier lassen sich Informationen zu allen Kubernetes Ressourcen anzeigen, die aktuell 

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