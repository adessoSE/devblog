---
layout:         [post, post-xml]              
title:          "Einführung in Kubernetes"
date:           2018-10-05 10:28
author:         t-buss
categories:     [Softwareentwicklung]
tags:           [cloud, kubernetes]
---
Die Container-Orchestrierungs-Lösung Kubernetes ist das wohlmöglich am stärksten gewachsene Open-Source-Projekt der letzten Jahre.
Alle großen Cloud-Anbieter wie Google, Amazon, Microsoft und weitere bieten heutzutage Kubernetes-Instanzen an und unzählige Firmen lagern ihre Anwendungen auf Kubernetes-gestützten Clustern in der Cloud aus.
Grund genug, sich einmal näher mit Kubernetes und Konzepten dahinter zu beschäftigen.

# Einführung in Kubernetes
In diesem Blogpost geht es um die grundlegenden Konzepte, mit denen die Container-Orchestrierung Kubernetes arbeitet.
Container-Orchestrierung bedeutet das Management von hunderten, lose gekoppelten Anwendungs-Containern, die zusammen miteinander interagieren müssen.
Unser Fokus liegt auf der Sicht eines Entwicklers, nicht eines Cluster-Operators.
Wir betrachten ein kleines Beispiel, indem wir eine triviale Spring-Boot-Anwendung in dem lokalen Kubernetes-Cluster Minikube ausführen.
Bevor wir zu dem Praxisteil kommen, klären wir erst einmal die Begrifflichkeiten.

# Cluster, Nodes und Pods
Kuberentes ist eine verteilte Anwendung, wird also auf mehreren physikalischen (oder virtuellen) Rechnern ausgeführt, die man als *Nodes* bezeichnet und die zusammen den Kubernetes *Cluster* bilden.
Mindestens ein Node nimmt dabei die Rolle des Masters ein, der den Cluster verwaltet und die Befehle des Benutzers entgegen nimmt.

Auf den Nodes laufen sogenannte *Pods*.
Sie sind die kleinste Ressource in Kubernetes.
Ein Pod führt einen oder mehrere Container aus, die zusammen als Einheit gestartet werden.
Die Wörtchen "oder mehrere" können dabei leicht zu Verwirrung führen.
In einer Microservices-Anwendung korrespondiert ein Pod zu einem Microservice, also meistens auch einem Container.
Es gibt verschiedene Fälle, in denen man gleich mehrere Container in einem Pod starten möchte.
Dies soll jedoch nicht Inhalt dieses Blogposts sein.
Da die Nodes miteinander ein virtuelles Netzwerk bilden und verbunden sind, kann es uns (als Entwickler) grundsätzlich egal sein, auf welchem Node ein Pod läuft.
Kubernetes verteilt automatisch die Pods auf solche Nodes, die im Moment weniger Last haben als die anderen.

Pods sind kurzlebig.
Sie werden erstellt, bekommen eine interne IP im virtuellen Netzwerk und führen ihre Container aus.
Wenn ein Pod beendet wird oder abstürzt, werden lokale Daten und Speicher gelöscht.
Die IP des Pods kann nun von beliebigen anderen Pods, die der Cluster startet, verwendet werden.
Es stellt sich also die Frage, wie man eine Anwendung erreichen kann, wenn die interne IP nicht als fest angenommen werden kann.
Zudem ist es für Anwendungen mit hoher Last nicht möglich, alle Anfragen von nur einer Container-Instanz abwickeln zu lassen.
Zur Skalierung müssen mehrere identische Pods gestartet werden, unter denen sich die Last aufteilt.
Diese Probleme nennt man "Service Discovery" und "Load Balancing" und sind in vielen verteilten Anwendungen präsent.
Wir wollen uns in diesem Blogpost anschauen, wie Kubernetes diese Probleme löst.

# Zielsetzung
Konkretisieren wir unser Ziel noch einmal mit den neuen Begriffen, die wir gerade kennen gelernt haben.
Das Ziel in diesem Blogpost soll es sein, einen REST-Service in einem Kubernetes-Cluster bereitzustellen.
Clients im selben Cluster können eine URI aufrufen und erhalten die erwartete Antwort.
Wir programmieren eine einfache Anwendung, die den Wert einer Konfigurationsvariablen ausgibt.
Diese packen wir in einige Pods, die in unserem Cluster laufen.
Es soll sichergestellt werden, dass bei einem Absturz eines Pods automatisch ein neuer Pod gestartet wird.
Zudem soll gewährleistet werden, dass die Last auf alle aktiven Pods verteilt wird, sodass der Ausfall eines Pods von außen quasi nicht zu erkennen ist.
Zuletzt wollen wir noch ein Update der Anwendung durchführen.

# Die Tools
Schauen wir uns die Tools an, mit denen wir unser Beispiel durchführen werden.

## Minikube
Allen voran brauchen wir einen Cluster, auf dem wir unsere Beispielanwendung laufen lassen.
Für die lokale Entwicklung eignet sich [Minikube](https://kubernetes.io/docs/setup/minikube/) sehr gut.
Es stellt einen Cluster mit nur einem Node in einer virtuellen Maschine bereit.
Dieser unterscheidet sich von einem "echten" Kubernetes Cluster unter anderem darin, dass auf dem einen Node sowohl die Pods als auch die Master-Prozesse zur Verwaltung des Clusters laufen.
Normalerweise sind die Master-Prozesse auf designierten Nodes, um für Ausfallsicherheit zu sorgen.

*Achtung: Obwohl V-Sphere offiziell von Minikube als Virtualisierungs-Lösung unterstütz wird, hatte ich einige Probleme, es damit zu starten.
Mit VirtualBox habe ich wesentlich bessere Erfahrungen gemacht und möchte es daher jedem ans Herz legen.*

Nachdem ein lokaler Cluster nach den Anweisungen auf der Minikube-Website installiert und mit `minikube start` gestartet wurde, können wir uns schon ein wenig in unserem Cluster umsehen.
Dazu dient das Kommandozeilentool `kubectl`, dass bei der Installation von Minikube mit installiert wird.
Mit `kubectl get pods` können wir uns beispielsweise alle Pods anzeigen lassen, die gerade laufen.
Wer kein Freund von Kommandozeilentools ist, kann sich mit dem Kubernetes Dashboard weiterhelfen.
Dazu gibt man das Kommando `minikube dashboard` ein, woraufhin sich der Browser öffnet und das Dashboard anzeigt.
Hier lassen sich Informationen zu allen Kubernetes Ressourcen anzeigen, die aktuell auf dem Cluster ausgeführt werden.
Wir kennen bereits Nodes und Pods.
Auf einige andere Arten von Ressourcen wird später noch eingegangen.

## Kotlin und Spring
Als Programmiersprache für unsere Beispielanwendung werden wir Kotlin verwenden.
Kotlin ist eine moderne Programmiersprache für die JVM und alle coolen Kinder benutzen sie, also machen wir das auch!
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
Normalerweise müssten wir an dieser Stelle jetzt ein Dockerfile erstellen.
Da Gitlab allerdings schlau ist und erkennt, dass es sich um ein Gradle-Projekt handelt, kann es das für uns übernehmen.
Die Anwendung wird automatisch gebaut, ein Docker-Image erstellt und selbiges in die Registry hochgeladen.
Den Link zum aktuellen Image findet man [hier](https://gitlab.com/tbuss/sample-sck/container_registry).

## Pods manuell starten und prüfen
Wir können jetzt einen oder mehrere Pods in unserem Cluster manuell erstellen.
Für alle Kubernetes-Ressourcen benutzen wir deklarative YAML-Dateien.
Kubernetes liest den gewünschten Status aus den Dateien aus und kümmert sich für uns darum, dass dieser Status aufrecht erhalten wird.
Einfach ausgedrückt: "Was will ich haben?" anstatt "Was muss passieren?".
Erstellen wir uns einen neuen Ordner außerhalb unseres Code-Repositories.
Manche Teams speichern die Kubernetes-Konfiguration ihrer Anwendung innerhalb des gleichen Git-Repositories, aber ich persönlich finde eine strikte Trennung zwischen Anwendungscode und Deployment eleganter.
Wir wählen als Ordnernamen "sample-sck-minikube", also eine Kombination aus Anwendungsnamen und Deployment-Umgebung.
Darin erstellen wir die Datei `sample-sck-pod-1.yaml` für einen einfachen Pod.
Die YAML-Datei dafür sieht folgendermaßen aus:
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: sample-sck-pod-1
spec:
  containers:
  - name: sample-sck
    image: registry.gitlab.com/tbuss/sample-sck/master:778763dd78540773aff9bc21fc3967e6ca3a0cbc
    ports:
    - containerPort: 5000
    env:
      - name: SOME_ENV_VAR
        value: Foo
```
Die YAML-Dateien in Kubernetes beginnen immer mit Meta-Informationen über die API, die benutzt wird und mit der Art von Ressource, die erstellt werden soll.
Auch ein Name wird angegeben.
Danach folgt die Spezifizierung des Pods, wo wir nicht nur das Image und den Namen angeben, sondern auch den Port der Anwendung (den müssen wir vorher wissen!) und die Umgebungsvariable, die wir nachher ausgeben möchten.

Um den spezifizierten Pod zu erstellen, muss man den Befehl

> `kubectl create -f sample-sck-pod-1.yaml` 

ausführen.
Alternativ kann man auch im Dashboard rechts oben auf "Create" klicken und die Datei dort hochladen.
Mit `kubectl get pods` oder dem Dashboard kann man sehen, dass der Pod ausgeführt wird.

Der Pod läuft also, aber wie lässt sich erkennen, dass alles wie erwartet funktioniert?
Die IP des Pods ist schließlich eine interne IP des Clusters, worauf man von außen keinen Zugriff hat.
Dazu kann man den Befehl

> `kubectl port-forward sample-sck-pod-1 8080:5000` 

verwenden.
Dadurch werden Requests an `localhost:8080` weitergeleitet an den Port 5000 des angegebenen Pods.
Wenn man also `http://localhost:8080/getenv` im Browser öffnet, sollte das Wort "Foo" angezeigt werden, den Wert der Umgebungsvariable, die wir in der Definition des Pods angebenen haben.
Abbildung 1 zeigt den einfachen Aufbau:

![Clients wenden ich direkt an Pod](/assets/images/posts/intro-zu-kubernetes/k8s-0.png "Abbildung 1")

Wenn wir den Pods wieder löschen wollen, geht das mit
> `kubectl delete pod sample-sck-pod-1`

oder über das Dashboard.

## Services
Wir können noch einige Pods auf diese Weise erstellen.
Dazu kopieren wir die Datei mit dem neuen Namen "sample-sck-pod-2.yaml".
Innerhalb der Konfiguration machen wir zwei Änderungen:
Wir ändern den Namen des Pods auf `sample-sck-pod-2`, da der vorherige Name ja schon von dem anderen Pod belegt ist.
Wir werden später einen Mechanismus kennen lernen, der uns diese Umbenennung bei der Erstellung vieler Pods abnimmt.
Außerdem ändern wir den Wert der Umgebungsvariablen auf `Bar`, damit wir sehen können, welchen Pod wir erreicht haben.
Mit
>`kubectl create -f sample-sck-pod-2.yaml`

wird der neue Pod erstellt.
Die Pods haben immer noch unterschiedliche IPs.
Daher kann ein Client unserer Anwendung nicht zu einem zentralen Punkt im Cluster navigieren und dort die Anwendung aufrufen.
Wir benötigen also einen Mechanismus zur Service Discovery.
Dafür gibt es in Kubernetes sogenannte *Services*.
Ein Service ist nichts anderes als ein Fixpunkt im Cluster, der die Anfragen an die damit verknüpften Pods weiterleitet.
Dabei berücksichtigt ein Service alle Pods, die ein bestimmtes *Label* haben, und leitet die Requests an einen dieser Pods weiter.
Labels sind ein mächtiges Werkzeug in Kubernetes.
Diese Key-Value-Paare können an alle Arten von Ressourcen angehängt werden und bieten eine flexible Möglichhkeit zur Gruppierung von Ressourcen, inklusive Pods.
Wenn wir die Pod-Definition in den beiden Dateien um das Label `app: sample-sck` erweitern, können wir alle Pods als Gruppe identifizieren:
```yaml
  ...
metadata:
  name: sample-sck-pod-1 # oder 2
  labels:
    app: sample-sck
  ...
```
Mit diesem Wissen lässt sich ein Service definieren.
Als Dateinamen verwenden wir `sample-sck-service.yaml`.
```yaml
apiVersion: v1
kind: Service
metadata:
  name:  sample-sck-service
spec:
  selector:
    app:  sample-sck
  type: NodePort
  ports:
  - port:  8080
    targetPort:  5000
```
Die Selector-Direktive beschreibt die Labels, die die Pods haben müssen, um von diesem Service berücksichtigt zu werden.
Der Typ `NodePort` zeigt an, dass Kubernetes für diesen Service auf jedem Node (bei Minikube nur der eine) einen Port öffnen soll, über den man den Service ansprechen kann.
In einem "richtigen" Kubernetes-Cluster hätten wir auch noch andere Möglichkeiten, den Service öffentlich zugänglich zu machen.
Port und targetPort zeigen an, das der Service auf Port 8080 läuft und auf die Ports 5000 der Pods weiterleitet.
Diese Grafik zeigt den momentanen Aufbau:

![Service leitet an Pods weiter](/assets/images/posts/intro-zu-kubernetes/k8s-1.png)

Speichern wir die Datei ab und erstellen den Service mit
> `kubectl create -f sample-sck-service.yaml`

oder über "Create" im Dashboard.

Wir können die Funktion des Services leider nicht auf die selbe Weise testen, wie die Funktion eines Pods.
Es lässt sich zwar ein Port-Forwarding auf einen Service einrichten, jedoch wird dabei implizit ein einzelner Pod ausgewählt, an den "geforwarded" wird.
Sollte dieser Pod ausfallen, wird der Service nicht automatisch an einen anderen Pod weiterleiten und der Vorteil unseres Services ist dahin.
Glücklicherweise können wir über Minikube schnell an die URL kommen, über die wir den Service erreichen:
> `$ minikube service sample-sck-service --url`<br>
> `http://192.168.99.100:31862`

Unter dieser Adresse plus Pfad `/getenv` sollte jetzt "Foo" oder "Bar" zu sehen sein.
Wenn wir nun ein paar mal die URL des Service aufrufen, wird manchmal der eine, manchmal der andere Wert angezeigt (eventuell muss man die URL SEHR oft aufrufen).
Wir können auch beobachten, was passiert, wenn ein Pod entfernt wird:
> `kubectl delete pod -f sample-sck-pod-1.yaml`

Der Service leitet die Anfragen an den verbleibenden Pod weiter, ohne, dass zwischenzeitlich ein Ausfall zu vermerken ist.
Unser Service funktioniert also.

## Deployments
Bisher haben wir Pods immer nur manuell erstellt.
Das dies auf Dauer zu mühselig wird, kann man sich denken.
Wir können auf diese Weise nicht automatisch Pods starten und müssen ständig den Namen ändern.
Um diese Probleme zu lösen gibt es *Deployments*.
Mit Deployments geben wir einerseits eine "Schablone" für unsere Pods an (wie bei der manuellen Definition von Pods) und andererseits die gewünschte Anzahl der Pods.

Erstellen wir eine Deployment-Konfiguration unter dem Namen `sample-sck-deployment.yaml`:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sample-sck-deployment
spec:
  replicas: 4
  selector:
    matchLabels:
      app: sample-sck
  template:
    metadata:
      labels:
        app: sample-sck
    spec:
      containers:
      - name: sample-sck
        image: registry.gitlab.com/tbuss/sample-sck/master:778763dd78540773aff9bc21fc3967e6ca3a0cbc
        ports:
          - containerPort: 5000
```
Der größte Teil der Definition sollte uns schon bekannt vorkommen und selbsterklärend sein.
Wir beschreiben die gewünschte Anzahl mit `replicas`; hier sind es zehn.
Mit `selector` legen wir fest, wie das Deployment "seine" Pods erkennt.
Die Labels im Selector sollten denen im Template gleichen.

Bevor wir das Deployment erstellen, sollten wir sicherstellen, dass keine Pods mit desem Label in unserem Cluster laufen, da dies zu unerwünschten Seiteneffekten führen könnte.
> `kubectl delete -f sample-sck-pod-1.yaml -f sample-sck-pod-2.yaml`

Jetzt erstellen wir das Deployment:
> `kubectl create -f sample-sck-deployment.yaml`

Mit `kubectl get pods` oder im Dashboard unter "Pods" kann man sehen, dass die gewünschten Pods automatisch erstellt wurden.
Der Name der jeweiligen Pods ergibt sich aus dem Namen, der im Deployment im Template angegeben wurde, einem Hash für das Deployment und einem Hash für den Container selbst.
Hier ist der momentane Status als Grafik (die IP des Services muss natürlich angepasst werden; siehe oben bei Services):
![Deployment kümmert sich um Pods](/assets/images/posts/intro-zu-kubernetes/k8s-2.png)

Wenn nun ein Pod abstürzt (oder wir ihn manuell löschen) können wir sehen, wie über das Deployment ein neuer Pod erstellt wird, um den Platz des alten einzunehmen.
Das Deployment arbeit also genau so, wie es soll.

# Update ausführen
Wenn wir im Dashboard auf "Workloads" gehen, dann sehen wir die Ressourcen, die durch das Deployment erstellt wurden.
Darunter sind nicht nur das Deployment, sondern auch die Pods und ein sogenanntes *ReplicaSet*.
ReplicaSets werden intern von Deployments genutzt, um die gewünschte Anzahl der Pods zu einem Deployment sicherzustellen.
Dieses Konzept ist von Bedeutung, wenn es um das Updaten von einem Deployment geht und dies wollen wir uns jetzt einmal anschauen.

## Szenario
Nehmen wir an, wir haben ein neue Version unserer Anwendung entwickelt.
Das dazugehörige Docker-Image haben wir bereits in eine Registry hochgeladen.
Nun wollen wir die Pods in unserem Cluster aktualisieren, und zwar ohne zwischenzeitlich offline zu sein.

## Update durch Kommandozeile
Wir haben zwei Möglichkeiten, dieses Szenario durchzuführen:
Wir können das Image direkt mit einem Befehl von der Kommandozeile setzen oder die YAML-Datei ändern und die Änderungen anschließend anwenden.
Sehen wir uns zunächst das Updaten über die Kommandozeile an.
Kubectl bietet den Befehl `kubectl set` an, um Änderungen an bestehenden Ressourcen anzuwenden, auch Container-Images.
Bevor wir den Befehl eingeben, können wir mit
> `watch kubectl get replicasets`

beobachten, wie das Update durchgeführt wird (auf Windows gibt es das Programm `watch` leider nicht; dann einfach nur oft hintereinander `kubectl get replicasets` ausführen).
Es sollte nur ein ReplicaSet für unser Deployment angezeigt werden.

Nun führen wir in einem anderen Terminal den Befehl zum Update aus:
> `kubectl set image deployment sample-sck-deployment sample-sck=registry.gitlab.com/tbuss/sample-sck/master:2af15466e456f7112b8b1b557d75be4dbab78df3`

Wir geben dabei die Aktion und das Deployment an und spezifizieren für den Container `sample-sck` das neue Image.

Jetzt können wir im ersten Terminal das Update-Verfahren beobachten:
Ein zweites ReplicaSet wird für das Deployment erstellt.
Die Spalten DESIRED, CURRENT und READY geben die Anzahl und Status der Pods an, die von diesem ReplicaSet verwaltet werden.

Den Status während eines Updates zeigt diese Grafik:

![Mehrere ReplicaSets](/assets/images/posts/intro-zu-kubernetes/k8s-3.png)

Nach und nach werden neue Pods durch das zweite ReplicaSet gestartet.
Parallel dazu werden Pods aus dem alten ReplicaSet heruntergefahren.
Die Geschwindigkeit und Anzahl der Pods innerhalb dieses Vorgangs kann durch Parameter innerhalb der Deployment-Konfigurationsdatei angepasst werden, aber wir begnügen uns in diesem Falle mit den default-Werten.
Irgendwann sind alle Pods des alten ReplicaSets gelöscht und die des neuen ReplicaSets gestartet.
Unser Update war erfolgreich.

Mit `kubectl rollout undo deployment sample-sck-deployment` kann man das Update wieder rückgängig machen.
Das ist sehr praktisch, wenn man bemerkt, dass ein Fehler vorliegt und man auf einen alten Stand zurückkehren möchte.
Führen wir den Befehl einmal aus, damit wir im Folgenden auch das Update per Konfigurationsdatei testen können.

## Update durch Datei
Die zweite Möglichkeit, das Szenario durchzuführen, ist über die YAML-Konfigurationsdateien.
Dazu bearbeiten wir die Datei `sample-sck-deployment.yaml` und tragen das neue Image im `template` ein:
```yaml
    ...

      containers:
      - name: sample-sck
        image: registry.gitlab.com/tbuss/sample-sck/master:2af15466e456f7112b8b1b557d75be4dbab78df3

    ...
```
Wieder können wir mit `watch kubectl get replicasets` den Fortschritt des Updates verfolgen, während es ausgeführt wird.
Geben wir jetzt in einem anderen Terminal den Befehl zum Update:
> `kubectl apply -f sample-sck-deployment.yaml`

Genau wie bei dem Update per Kommandozeile wird ein zweites ReplicaSet erstellt und übernimmt nach und nach die Last des Ursprünglichen.
Auch hier hat also das Update geklappt.
Jedoch haben wir bei dem Befehl `kubectl apply ...` eine Warnung bekommen:
>`Warning: kubectl apply should be used on resource created by either kubectl create --save-config or kubectl apply`

Der Hintergrund ist, dass Kubernetes bei dem Befehl `kubectl create ...` einige Standardwerte annimmt, welche sich je nach Version ändern können.
Wenn wir die Änderungen an einer Datei mit `kubectl apply` anwenden, weiß Kubernetes nicht mehr, was wir in der alten Konfiguration explizit angegeben haben und was als "Default" angenommen wurde.
Mit dem Flag `--save-config` speichert Kubernetes unsere Konfiguration so ab, dass es diese Unterscheidung machen kann.

# Fazit
In diesem Blogpost haben wir die grundlegenden Konzepte von Kubernetes kennen gelernt.
Wir haben erfahren, was Pods sind, wie Services die Anfragen an Pods weiterleiten und wie Deployments die Anzahl der gewünschten Pods aufrecht erhalten.
Zudem haben wir gesehen, wie wir Updates durchführen können und Kubernetes diese umsetzt.

Dies war natürlich nur ein kleiner Einstieg in die riesige Welt von Kubernetes.
In kommenden Blogposts werden wir weitere Konzepte und Techniken kennen lernen, um Applikationen in Kubernetes zu verwalten.
