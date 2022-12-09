---
layout: [post, post-xml]              # Pflichtfeld. Nicht ändern!
title:  "GitLab Pipelines für die automatisierte Veröffentlichung einer semantischen Version"   # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2022-10-20 10:00              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
author_ids: [utschenik]                   # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesen Namen geben.
categories: [Softwareentwicklung]    			  # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [CI/CD, Docker, Git] # Bitte auf Großschreibung achten.
---
Softwareversionierung ist ein praktisches Mittel, um den aktuellen Entwicklungsstand festzuhalten.
Jedoch werden Softwareversionen oft nur inkrementiert und bringen dadurch keinen Mehrwert.
Weil Versionierung in Regeln wiedergegeben werden kann, sollten wir diesen Prozess automatisieren.
Semantische Versionierung gibt Softwareversionen eine Struktur, die allen Stakeholdern und dem Entwicklungsteam wichtige Informationen liefern kann.

Um diesen Blog-Post verfolgen zukönnen, sollten Grundkenntnise in [GitLab CI/CD](https://docs.gitlab.com/ee/ci/) und [Docker](https://docs.docker.com) vorhanden sein.

# Hölle der Abhängigkeit

Software zu versionieren ist keine revolutionäre Idee.
Nehmen wir an, dass Softwarepaket A weiterentwickelt worden ist.
Die Versionierung von Softwarepaket A passiert durch inkrementieren einer fortlaufenden Zahl.

Softwarepaket A wird mit einer neuen Version veröffentlicht und Softwarepaket B aktualisiert blind seine Abhängigkeit zu Softwarepaket A.
Dabei kann es passieren, dass die Software von Paket B nicht mehr so funktioniert wie erwartet.
Die neue Version von Softwarepaket A enthält Änderungen, die die API grundlegend umstrukturiert hat.

Mithilfe einer semantischen Version wäre bei der Entwicklung von Softwarepaket B aufgefallen, dass die neue Version von Softwarepaket A wichtige Änderungen enthielt.

# Semantische Versionierung

Eine semantische Version wird auf Grundlage von `MAJOR.MINOR.PATCH` gebildet.
Die einzelnen Elemente werden wie folgt erhöht:

1. MAJOR wird erhöht, wenn sich die API grundlegend verändert hat.
2. MINOR wird erhöht, wenn neue Funktionalitäten eingebaut worden sind.
3. PATCH wird erhöht, wenn Änderungen nur Fehler an bestehenden Funktionalitäten beheben.

Anhand dieser Struktur können wir Nutzer über die Art und den Umfang der Änderungen informieren.
Wenn wir Softwareabhängigkeiten in einem unserer Projekte aktualisieren, müssen wir trotzdem verantwortungsbewusst sein und prüfen ob die Softwarepakete wie beschrieben funktionieren.

Wir können die Bestimmung einer neuen Version von einem Softwarepaket in einer CI-Pipeline automatisieren.
Um diesen Prozess zu automatisieren, brauchen wir eine Grundlage und ein festes Regelwerk, um festzustellen was sich seit der letzten Veröffentlichung unserer Software verändert hat.

# Git Commits und Commit Conventions

Um festzuhalten, welche Änderungen an der Software gemacht worden sind, benutzen wir die Commit Messages von Git.
Es gibt viele Strukturen, um die Commit Messages von Git zu strukturieren, ich verfolge dafür gerne die [Angular Commit Conventions](https://gist.github.com/brianclements/841ea7bffdb01346392c).
Die Angular Commit Conventions definieren strikte Regeln, um die Commit Messages leserlicher zumachen.

## Angular Commit Message Convention

Der Aufbau der Message ist einfach:
```txt
type(scope): body
```

Es gibt per Definition folgende Commit-Typen:
- build
- ci
- docs
- feat
- fix
- perf
- refactor
- style
- test

Der Scope ist optional und wird in Klammern geschrieben, dort können wir auf eine Ticketnummer aus unserem Projektmanagment-Tool verweisen.
Im Body machen wir eine kurze Beschreibung, was dieser Commit verändert.
Das Besondere ist nun, dass wir aus den verschiedenen Typen rückschließen können, wie sich die Version verändern wird.
Zum Beispiel wird die folgende Commit Message eine Erhöhung der Minor-Version hervorrufen:

```txt
feat(#TICKET_NUMMER): neues feature XY erarbeitet
```

# GitLab-Pipelines zur Automatisierung der Erstellung einer semantischen Version

Pipelines sind ein grundlegender Baustein in der Continuous Integration.
Eine Pipeline besteht aus Stages und Jobs.
Eine Stage beschreibt, wann Jobs ausgeführt werden sollen, zum Beispiel bei einem Merge Request für automatische Tests oder nach einem Merge zum Hauptbranch.

Es können viele Jobs in einer Stage existieren. Ein Job enthält Code oder kann Skripte ausführen, wir könenn zum Beispiel die Codequalität des Branches überprüfen.
Jobs einer Stage müssen erfolgreich sein, das heißt, sie müssen mit dem Exit Code 0 abschließen, sodass die Pipeline zur nächsten Stage wechseln kann oder erfolgreich enden kann.

Stages und Jobs werden in einer YAML-Datei mit dem Namen `.gitlab-ci.yaml` definiert.

![Animierte Pipeline für GitLab](/assets/images/posts/semantische-versionierung-von-docker-images-in-gitlab-pipelines/pipeline-visualization.gif)

## Versioning-Stage

Um nun automatisch eine neue Version aus den Commit Messages zu erzeugen, legen wir als erstes die `.gitlab-ci.yaml-Datei` an, wenn sie noch nicht existiert.

Wir werden die `Versioning-Stage` und einen Job für die `Versioning-Stage` anlegen.
Der Job benötigt als Basis ein Node.js Docker Image.
Dafür muss der GitLab-Runner Zugang zur Docker Engine haben.

Um das einzurichten, verfolgt gerne dazu die GitLab-Dokumentation zum [Docker-Executor](https://docs.gitlab.com/runner/executors/docker.html)

## Versioning-Stage und build-tag Job in .gitlab-ci.yaml

Als erstes erstellen wir eine neue Stage und einen neuen Job, der für uns die semantische Version erstellen lassen soll.
 
```yaml
stages:
    - versioning
```

Das `stages`-Objekt kann eine Liste von Stages haben.
Haben wir die Stage angelegt, können wir nun Jobs für die Stage definieren.

Wir legen einen neuen Job `build-tag` an.
Der Job wird wie folgt definiert und wird für uns eine neue Version erzeugen:

```yaml
build-tag:
    image: node:18.10-buster-slim
    stage: versioning
    before_script:
        - apt get update && apt-get install -y --no-install-recommends git-core ca-certificates
        - npm install -g semantic-release @semantic-release/gitlab @semantic-release/git
        - echo "$RELEASE_RC" > .releaserc.json
    script:
        - semantic-release
    rules:
        - if: $CI_COMMIT_BRANCH == "main"
```

Im Job installieren wir das NPM-Package [Semantic-Release](https://github.com/semantic-release/semantic-release) und installieren Git im Node.js Docker Image.
Semantic-Release nimmt uns die Arbeit ab und kümmert sich um das Bestimmen der nächsten Versionsnummer.

Der Vorteil ist, dass Semantic-Release menschliche Emotionen aus dem Versionierungsprozess nimmt und klaren Regeln folgt, den Regeln der semantischen Versionierung.
Wir können jedoch selbst bestimmen, auf welche Commit Message Types das Package reagieren soll, um eine neue Version zu definieren.

Um Regeln festzulegen, auf welche Types Semantic-Release reagieren soll, muss im aktuellen Pfad der Ausführung eine `.releaserc.json-Datei` exisieren.
Hier seht ihr einmal die [Konfigurationsreferenz zu Semantic-Release](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration).

Meine Konfiguration ist in einer Environment-Variable `$RELEASE_RC` gespeichert.
Diese Variable ist in den CI/CD-Einstellungen des Repositories gespeichert.

![CI/CD Settings aus GitLab](/assets/images/posts/semantische-versionierung-von-docker-images-in-gitlab-pipelines/CI-CD-Settings.png)

Außerdem brauchen wir noch eine Environment-Variable, die `$GITLAB_TOKEN` heißt.
Die `$GITLAB_TOKEN`-Variable beinhaltet einen Access Token für euer Repository.
[Hier](https://docs.gitlab.com/ee/user/project/settings/project_access_tokens.html) könnt ihr nachlesen, wir ihr einen Access Token erstellen könnt.
Semantic-Release schaut nach dieser Variable, um einen Git Tag in eurem Repository zu veröffentlichen.
Ein Git Tag ist eine Funktion, um Punkte in einer Versionshistorie als wichtig zu kennzeichnen.

Semantic-Release überprüft zunächst das Git Repository auf Versions-Tags.
Semantic-Release setzt beim Bauen einer Version ein neues Git Tag, welches die Version beinhaltet.
Wurde ein entsprechendes Versions-Tag gefunden, werden nur alle Commits bis zu diesem Tag untersucht.
Für alle gefunden Commits wird dann jeweils die Commit Message untersucht.
Anhand der verwendeten Commit Message Types kann dann die Versionsnummer berechnet werden.
Die neue semantische Version wird dann als Git Tag im Repository veröffentlicht.

Wurde kein Tag gefunden, wird automatisch ein Git Tag mit der Version `v1.0.0` erzeugt.
Die initiale Version können wir Semantic-Release in der Konfiguration mitgeben.

![Workflow von Semantic-Release](/assets/images/posts/semantische-versionierung-von-docker-images-in-gitlab-pipelines/workflow-semantic-release.png)

## Anwendungsfall: Bauen des Docker Image mit neuer Versionsnummer

Damit wir nun auf Basis unseres Codes ein Docker Image bauen können, definieren wir eine neue Stage namens `deploy` und einen neuen Job mit dem Namen `build_docker_image`.
Der Job soll ausgeführt werden, sobald ein neuer Git Tag im Repository angelegt wird und der Name des Tags eine semantische Versionsnummer ist.

Der Git Tag mit der semantischen Version sollte im vorherigen Schritt erzeugt worden sein.
Wenn kein neuer Git Tag erzeugt wurde, hat der Type des Commit nicht gepasst oder die Commit Message Struktur wurde nicht beachtet.

Die neue Stage definieren wir wie folgt:
```yaml
stages:
    - versioning
    - deploy
```

Wir haben das `stages`-Objekt um eine weitere Stage `deploy` ergänzt.

Der neue Job in der Deploy-Stage soll für uns diese Aufgabe übernehmen:
```yaml
build_docker_image:
    stage: deploy
    variables:
        IMAGE_TAG: '$CONTAINER_REGISTRY/tag-name:$CI_COMMIT_TAG'
    script:
        - echo $CONTAINER_REGISTRY_PASSWORD | docker login -u $CONTAINER_REGISTRY_USER $CONTAINER_REGISTRY --password-stdin
        - docker build -t $IMAGE_TAG .
        - docker push $IMAGE_TAG
    rules:
        - if: $CI_COMMIT_TAG && $CI_COMMIT_TAG =~ /^(v[0-9]+)\.([0-9]+)\.([0-9]+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+)?$/
```

Folgende Variablen haben wir wieder in den CI/CD-Einstellungen des Repository gespeichert:
- `$CONTAINER_REGISTRY` (Domain eurer Docker Image Registry)
- `$CONTAINER_REGISTRY_PASSWORD` (Passwort für die Registry)
- `$CONTAINER_REGISTRY_USER` (Benutzername für die Registry)

Unser neuer Git Tag mit unserer neuen Versionsnummer ist in der GitLab-Variable `$CI_COMMIT_TAG` hinterlegt.
Was besonders wichtig ist, ist die Regel wann der Job laufen soll.
Der Job darf nur ausgeführt werden, wenn die Variable `$CI_COMMIT_TAG` einen Wert hat und die Variable einer semantischen Version entspricht, zum Beispiel v1.2.5.

Mit diesem Git Tag können wir nun beim build-Prozess unser neues Docker Image kennzeichnen und in der Registry veröffentlichen.

# Fazit
Durch eine definierte Commit-Message-Struktur können wir den Prozess der Versionierung automatisieren.
Außerdem haben wir das Tool Semantic-Release benutzt, was für uns Git Tags anhand der Commit Messages erzeugt.
Mit dem neu veröffentlichten Git Tag haben wir uns einen Anwendungsfall angeschaut, wo wir die neue semantische Version für das Bauen eines Docker Image benutzen.
Falls ihr Fragen zu dem Thema oder der Implementierung habt, könnt ihr mich gerne per E-Mail [paul.schueler@adesso.de](mailto:paul.schueler@adesso.de) oder Teams kontaktieren.
