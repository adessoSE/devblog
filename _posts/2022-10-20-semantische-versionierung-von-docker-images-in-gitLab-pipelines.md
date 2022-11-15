---
layout: [post, post-xml]              # Pflichtfeld. Nicht ändern!
title:  "Semantische Versionierung von Docker Images in GitLab CI/CD"   # Pflichtfeld. Bitte einen Titel für den Blog Post angeben.
date:   2022-10-20 10:00              # Pflichtfeld. Format "YYYY-MM-DD HH:MM". Muss für Veröffentlichung in der Vergangenheit liegen. (Für Preview egal)
author_ids: [utschenik]                   # Pflichtfeld. Es muss in der "authors.yml" einen Eintrag mit diesen Namen geben.
categories: [Softwareentwicklung]    			  # Pflichtfeld. Maximal eine der angegebenen Kategorien verwenden.
tags: [CI/CD, Docker, Git] # Bitte auf Großschreibung achten.
---
Software Versionierung ist ein praktisches Mittel um den aktuellen Entwicklungsstand festzuhalten.
Jedoch werden Software Versionen oft nur inkrementiert und bringen dadurch keinen Mehrwert.
Weil Versionierung in Regeln wiedergegeben werden kann, sollte dieser Prozess automatisiert werden.
Semantische Versionierung gibt Software Versionierung eine Struktur, die Kunden und Entwicklern wichtige Informationen liefern kann.

Um diesen Blog-Post verfolgen zukönnen, sollten Grundkenntnise in [GitLab CI/CD](https://docs.gitlab.com/ee/ci/) und [Docker](https://docs.docker.com) vorhanden sein.

# Hölle der Abhängigkeit

Software zu versionieren ist keine revolutionäre Idee.
Nehmen wir an das Software Paket A weiterentwickelt worden ist.
Die Versionierung von Software Paket A passiert durch inkrementieren einer fortlaufenden Zahl.
Software Paket A wird mit einer neuen Version veröffentlicht und Software Paket B aktualisiert blind seine Abhängikeit zu Software Paket A.
Die Software von Paket B funktioniert nicht mehr so wie erwartet.
Die neue Version von Software Paket A enthält Änderungen, die die API grundlegend umstrukturiert hat.
Mithilfe einer semantischen Version, hätten die Entwickler von Software Paket B sehen können, das die neue Version von Software Paket A wichtige Änderungen enthielt.

# Semantische Versionierung

Eine semantische Version wird auf Grundlage von MAJOR.MINOR.PATCH gebildet.
Die einzelnen Elemente werden wie folgt erhöht:

1. MAJOR wird erhöht, wenn sich die API grundlegend verändert hat
2. MINOR wird erhöht, wenn neue Funktionalitäten eingebaut worden sind
3. PATCH wird erhöht, wenn Änderungen nur Fehler an bestehenden Funktionalitäten beheben.

Anhand dieser Struktur können wir Nutzer über die Art und den Umfang der Änderungen informieren.
Wenn man Software Abhängikeiten in seinem Projekt aktualisiert, müssen wir trotzdem verantwortungsbewusst sein und prüfen ob die Software-Pakete wie beschrieben funktionieren.

Eine neue Version von einem Software Paket zu bestimmen, können wir in einer CI-Pipeline automatisieren.
Um diesen Prozess zu automatisieren, brauchen wir eine Grundlage und ein festes Regelwerk, um festzustellen was sich seit der letzten Veröffentlichung unser Software verändert hat.

# Git Commits und Commit Conventions

Um festzuhalten welche Änderungen an der Software gemacht worden sind, benutzen wir die Commit Message von Git.
Es gibt viele Strukturen um die Commit Messages von Git zu strukturieren, ich verfolge dafür gerne die [Angular Commit Conventions](https://gist.github.com/brianclements/841ea7bffdb01346392c).
Die Angular Commit Conventions definieren strikte Regeln um die Commit Messages leserlicher zumachen.

## Angular Commit Message Convention

Der Aufbau der Message ist einfach:
```
type(scope): body
```

Es gibt per Definition folgende Commit Typen:
- build
- ci
- docs
- feat
- fix
- perf
- refactor
- style
- test

Der Scope ist optional und wird in Klammern geschrieben, dort verweise ich meist auf meine Ticketnummer aus unserem Projektmanagment-Tool.
Im Body wird eine kurze Beschreibung gemacht, was dieser Commit verändert.
Das besondere ist nun, dass wir aus den verschiedenen Typen rückschließen können, wie sich die Version verändern wird.
Zum Beispiel wird eine folgende Commit Message eine Erhöhung der Minior Version hervorrufen:
```
feat(#TICKET_NUMMER): neues feature XY erarbeitet
```

# Gitlab Pipelines für Automatisierung von veröffentlichen einer semantischen Version

Pipelines sind ein grundlegender Baustein in der Continuous Integration.
Eine Pipeline besteht aus Stages und Jobs.
Eine Stage beschreibt wann Jobs ausgeführt werden sollen, zum Beispiel bei einem Merge Request für automatische Tests oder nach einem Merge zum Hauptbranch.
Es können viele Jobs in einer Stage existieren, ein Job beschreibt was zu tun ist, zum Beispiel die Code Qualität des Branches überprüfen.
Jobs einer Stage müssen erfolgreich sein, dass heißt mit dem Exit Code 0 abschließen, so dass die Pipeline zur nächsten Stage wechseln kann oder erfolgreich enden kann.
Stages und Jobs werden in einer YAML-Datei definiert, mit dem Namen '.gitlab-ci.yaml'.

![](/assets/images/posts/semantische-versionierung-von-docker-images-in-gitlab-pipelines/pipeline-visualization.gif)

## Versioning-Stage

Um nun automatisch eine neue Version aus den Commit Messages zu erzeugen, legen wir als erstes die '.gitlab-ci.yaml' Datei an, wenn sie noch nicht existiert.
Wir werden die Versioning-Stage und einen Job für die Versioning-Stage anlegen.
Der Job braucht ein Node.js Docker-Image um den Job erfolgreich auszuführen.
Dafür muss der GitLab-Runner Zugang zur Docker Engine haben.
Um das einzurichten, verfolgt gerne dazu die GitLab-Dokumentation zum [Docker-Executor](https://docs.gitlab.com/runner/executors/docker.html)

## Versioning-Stage und build-tag Job in .gitlab-ci.yaml

Als erstes definieren wir eine neue Stage.
Der Job soll ausgeführt werden, wenn ein Commit auf den Hauptbranch geht.
Das ist der Fall nach einem Merge Request.
 
```yaml
stages:
    - versioning
```

Das 'stages'-Objekt kann eine Liste von Stages haben.
Haben wir die Stage angelegt, können wir nun Jobs für die Stage definieren.
Wir werden einmal den Job 'build-tag' anlegen.
Der Job wird wie folgt definiert und wird eine neue Version erzeugen:

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

Im Job installieren wir das NPM-Package [Semantic-Release](https://github.com/semantic-release/semantic-release) und installieren GIT im Node.js Docker-Image.
Semantic-Release nimmt uns die Arbeit ab und kümmert sich um das bestimmen der nächsten Versionsnummer.
Der Vorteil ist das Semantic-Release menschliche Emotionen aus dem Versionierungs-Prozess nimmt und klaren Regeln folgt, den Regeln der semantischen Versionierung.
Jedoch auf welche Commit-Messages Types das Package reagieren soll, um eine neue Version zu definieren, können wir selbst bestimmen.
Um Regeln festzulegen, auf welche Types Semantic-Release reagieren soll, muss im aktuellen Pfad der Ausführung eine '.releaserc.json'-Datei exisieren.
Hier einmal die [Konfigurations-Referenz zu Semantic-Release](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration).
Meine Konfiguration ist in einer Environment-Variable gespeichert '$RELEASE_RC'.
Diese Variable ist in den CI/CD-Einstellungen des Repositories gespeichert.

![](/assets/images/posts/semantische-versionierung-von-docker-images-in-gitlab-pipelines/CI-CD-Settings.png)

Außerdem braucht ihr noch eine Environment-Variable die "GITLAB_TOKEN" heißt.
Semantic-Release schaut nach dieser Variable um einen Git-Tag in eurem Repository zu veröffentlichen.
Ein Git-Tag ist eine Funktion um Punkte in einer Versionshistorie als wichtig zu kennzeichnen.

Semantic-Release analyisert nun den letzten Commit und versucht aus der Commit Message eine neue Version abzuleiten.
Je gefundenen Types des Commits, wird eine entsprechenende neue Version gebildet und als Git-Tag im Repository veröffentlicht.

## Bauen des Docker images mit neuer Versionsnummer

Um nun das Docker Image bauen zu können definieren wir nun eine neue Stage namens "deploy" und einen neuen Job mit dem Namen "build_docker_image".
Der Job soll ausgeführt werden, sobald ein neuer Git-Tag im Repository angelegt wird und der Name des Tags eine semantische Versionsnummer ist.
Der Git-Tag mit der semantischen Version sollte aus dem Schritt davor erzeugt worden sein.
Wenn kein neuer Git-Tag erzeugt wurde, hat der Type des Commits nicht gepasst oder die Commit Message Struktur wurde nicht beachtet.

Die neue Stage definieren wir wie folgt:
```yaml
stages:
    - versioning
    - deploy
```

Wir haben das "stages"-Objekt um eine weitere Stage "deploy" ergänzt.

Der neue Job in der Deploy stage laufen, soll diese Aufgaben übernehmen:
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

Folgende Variablen haben wir wieder in den CI/CD Einstellungen des Repositories gespeichert:
- CONTAINER_REGISTRY (Domain eurer Docker-Image Registry)
- CONTAINER_REGISTRY_PASSWORD (Passwort für die Registry)
- CONTAINER_REGISTRY_USER (Benutzername für die Registry)

Unser neuer Git-Tag mit unserer neuen Versionsnummer ist in der GitLab-Variable $CI_COMMIT_TAG hinterlegt.
Was besonders wichtig ist, ist die Regel wann der Job laufen soll.
Der Job darf nur ausgeführt werden, wenn die Variable $CI_COMMIT_TAG einen Wert hat und die Variable einer semantischen Version entspricht, zum Beispiel v1.2.5.

Mit diesem Git-Tag können wir nun beim build-Prozess unser neues Docker-Image kennzeichnen und in der Registry veröffentlichen.

# Fazit
Durch eine definierte Commit-Message Struktur, kann man den Prozess der Versionierung automatisieren.
Außerdem haben wir das Tool "Semantic-Release" benutzt was für uns Git-Tags anhand der Commit-Message erzeugt.
Mit dem neuen Git-Tag können wir einen Job ausführen, der für uns das Docker-Image baut.
Falls Ihr fragen habt zu der Implementierung oder euch noch Fragen geblieben sind, kontaktiert mich gerne unter [paul.schueler@adesso.de](mailto:paul.schueler@adesso.de)
