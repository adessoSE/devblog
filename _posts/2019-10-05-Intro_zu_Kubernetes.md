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
Konkretisieren wir unser Ziel noch einmal mit den neuen Begriffen, die wir gerade kennen gelernt haben.
Das Ziel in diesem Blogpost soll es sein, einen REST-Service in einem Kubernetes Cluster bereitzustellen.
Clients im selben Cluster können eine URI aufrufen und erhalten die erwartete Antwort.
Wir programmieren eine einfache Anwendung, der den Wert einer Konfigurationsvariablen ausgibt.
Diese packen wir in einige Pods, die in unserem Cluster laufen.
Es soll sichergestellt werden, dass bei einem Absturz eines Pods automatisch ein neuer Pod gestartet wird.
Zudem soll gewährleistet werden, dass die Last auf alle aktiven Pods verteilt wird, sodass der Ausfall eines Pods von außen quasi nicht zu erkennen ist.

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
Hier lassen sich Informationen zu allen Kubernetes Ressourcen anzeigen, die aktuell auf dem Cluster ausgeführt werden.
Wir kennen bereits Services und Pods.
Auf einige anderen Arten von Ressourcen wird später noch eingegangen.

## Kotlin und Spring
Als Programmiersprache für unsere Beispielanwendung werden wir Kotlin verwenden.
Spring ist ein sehr beliebtes Framework für Webanwendungen auf Basis der JVM und eignet sich perfekt für unsere Zwecke:
Wir benötigen einen einfachen REST-Endpunkt und müssen eine Umgebungsvariable auslesen.
Beides lässt sich mit Spring relativ leicht bewerkstelligen.

## Docker
Kubernetes verwaltet Container und die beliebteste Software für Container ist Docker.
Docker an sich ist bereits ein riesiges Themengebiet, weshalb wir an dieser Stelle nicht weiter darauf eingehen können.
Soviel sei gesagt: Wir erstellen ein Docker-Image (eine Art Container-Blaupause) für unsere Spring-Anwendung und laden sie in eine Registry hoch (ich verwende GitLabs Docker Registry).
Der Cluster wird bei der Erstellung von Pods dieses Image runterladen und für die Container verwenden.

# Let's Go!
Genug der Theorie, gehen wir ans Werk.

## Die Spring Anwendung
Die Anwendung ist denkbar simpel, sodass wir uns nicht lange mit Erklärungen aufhalten.
Die interessante Stelle im Quellcode ist die Folgende:

```kotlin
@RestController
class EnvironmentVariableController {

    @Value("\${SOME_ENV_VAR}")
    lateinit var envVar: String

    @GetMapping("/getenv")
    fun getEnvironmentVariable() = this.envVar
}
```
Das Repository mit dem gesamten Quellcode ist [hier](https://gitlab.com/tbuss/sample-sck) zu finden.
Normalerweise würde an dieser Stelle jetzt die Erstellung eines Dockerfiles kommen.
Da Gitlab allerdings schlau ist und erkennt, dass es sich um ein Gradle-Projekt handelt, kann es das Dockerfile-Schreiben für uns übernehmen.
Die Anwendung wird automatisch gebaut und ein Docker-Image erstellt.
Den Link zum aktuellen Image findet man [hier](https://gitlab.com/tbuss/sample-sck/container_registry).

## Pods manuell starten und prüfen
Wir können jetzt einen oder mehrere Pods in unserem Cluster manuell erstellen.
Für die Kubernetes-Ressourcen benutzen wir deklarative YAML-Dateien.
Das hat den Vorteil, dass wir den gewünschten Status unserer Infrastruktur beschreiben können und Kubernetes sich darum kümmert, dass der Status aufrecht erhalten wird.
Die YAML-Datei für einen einfachen Pod sieht folgendermaßen aus:
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: sample-sck
spec:
  containers:
  - name: sample-sck
    image: registry.gitlab.com/tbuss/sample-sck/master:778763dd78540773aff9bc21fc3967e6ca3a0cbc
    ports:
    - containerPort: 5000
```
Um den spezifizierten Pod zu erstellen, muss man die YAML-Datei unter `sample-sck.yaml` abspeichern und den Befehl

> `kubectl create -f sample-sck.yaml` 

ausführen.
Mit `kubectl get pods` oder dem Dashboard kann man sehen, dass der Pod ausgeführt wird.
Der Pod wird also ausgeführt, aber wie lässt sich erkennen, dass alles wie erwartet funktioniert?
Die IP des Pods ist schließlich eine interne IP des Clusters, worauf man von außen keinen Zugriff hat.
Dazu kann man den Befehl

> `kubectl port-forward pod/sample-sck 8080:5000` 

verwenden.
Dadurch werden Requests an `localhost:8080` weitergeleitet an den Port 5000 des angegebenen Pods.
Wenn man also http://localhost:8080/getenv im Browser öffnet, sollte das Wort "nix" angezeigt werden, der default-Wert der Konfigurationsvariable, die wir ausgeben.
Diese Abbildung zeigt den einfachen Aufbau:

![Clients wenden ich direkt an Pod](/assets/images/posts/intro-zu-kubernetes/k8s-0.png)

## Services
Wir können noch einige Pods auf diese Weise erstellen, wobei wir jedes mal den Namen des Pods ändern müssen, was sehr umständlich ist (eine Lösung dazu gibt es später).
Die Pods haben immer noch unterschiedliche IPs.
Wir benötigen also einen Mechanismus zur Service Discovery.
Dafür gibt es in Kubernetes sogenannte *Services*.
Ein Service ist nichts anderes als ein Fixpunkt im Cluster, der die Anfragen an die damit verknüpften Pods weiterleitet.
Dabei achtet ein Service auf alle Pods, die ein bestimmtes *Label* haben, und leitet die Requests an einen dieser Pods weiter.
Labels sind ein mächtiges Werkzeug in Kubernetes.
Diese Key-Value-Paare können an alle Arten von Ressourcen angehängt werden und bieten eine flexible Möglichhkeit zur Gruppierung von Ressourcen, inklusive Pods.
Wenn wir die Pod-Definition von oben um ein Label erweitern:
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: sample-sck
  labels:
    app: sample-sck-version1
spec:
  containers:
  - name: sample-sck
    image: registry.gitlab.com/tbuss/sample-sck/master:778763dd78540773aff9bc21fc3967e6ca3a0cbc
    ports:
    - containerPort: 5000
```
können wir alle Pods als Gruppe identifizieren.
Mit diesem Wissen lässt sich leicht ein Service definieren:
```yaml
apiVersion: v1
kind: Service
metadata:
  name:  sample-sck-service
spec:
  selector:
    app:  sample-sck-version1
  ports:
  - port:  8080
    targetPort:  5000
```
Die Selector-Direktive beschreibt die Labels, die die Pods haben müssen, um von diesem Service erfasst zu werden.
Port und targetPort zeigen an, das der Service auf Port 8080 läuft und auf die Ports 5000 der Pods weiterleitet.
Diese Grafik zeigt den momentanen Aufbau:

![Service leitet an Pods weiter](/assets/images/posts/intro-zu-kubernetes/k8s-1.png)

Wir können die Funktion des Services auf die selbe Weise testen, wie die von Pods, mit dem Befehl:

> `kubectl port-forward service/sample-sck-service 8080:8080`

Auf http://localhost:8080 sollte jetzt wieder das Wort "nix" zu sehen sein.

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