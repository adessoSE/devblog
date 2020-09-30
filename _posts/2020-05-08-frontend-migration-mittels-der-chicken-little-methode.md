---
layout: [post, post-xml]             
title:  "Frontend Migration anhand der Chicken-Little-Methode in der Praxis"
date:   2020-05-08 17:00             
modified_date: 2020-05-11 12:25
author: mschick                     
categories: [Methodik]                   
tags: [Frontend, Migration, Softwaremigration, React, ReactJS, JSX, JSF, Facelets, REST]  
---

In meinem [ersten Beitrag](https://www.adesso.de/de/news/blog/inkrementelle-softwaremigration-nach-der-chicken-little-methode-4.jsp) habe ich die **Chicken-Little-Methode**, eine Vorgehensweise für die schrittweise Migration von *Legacy-Systemen*, vorgestellt.
Darauf aufbauend soll in diesem Beitrag nun demonstriert werden, wie sich diese Methode auf eine *Frontend-Migration* im Kontext einer Webanwendung anwenden lässt.
Dazu wird eine existierende Webanwendung betrachtet und gezeigt wie sich eine, auf den *Server-Side Rendering Technologien* **JSF** und **Facelets** basierende Komponente dieser Anwendung, in eine andere Technologie transformieren lässt und im Anschluss daran wieder in das Altsystem integriert wird.
Als Zieltechnologie für die Migration dient in diesem Beispiel das **Single-Page-Application**-Framework [**ReactJS**](https://reactjs.org/).

Wichtig hierbei anzumerken ist, dass der Fokus hier ganz klar auf der Beschreibung des Vorgehens liegt. Die hierbei verwendete Technologie dient lediglich der Veranschaulichung und kann beliebig ausgetauscht werden.
Daher werden hier auch Quellcode-Beispiele nur in reduzierter Form und auch nur da eingesetzt, wo sie für das Verständnis dienlich sind.

# Die Legacy Anwendung

Bei der zuvor erwähnten Webanwendung handelt es sich konkret um eine Portal-Lösung für Versicherungsmakler.
 Der jeweilige Makler hat hier die Möglichkeit, seine Mandanten und deren Stammdaten, sowie deren aktuelle Versicherungsverträge zu erfassen und zu verwalten.
Darüber hinaus besteht unter anderem die Möglichkeit, bestehende Versicherungsverträge mit Tarifen anderer oder auch des selben Versicherers zu vergleichen und neu abzuschließen.

## Technischer Hintergrund
Das Versicherungsportal basiert maßgeblich auf den Technologien *Java EE 6* sowie dem Webframework [*Seam*](http://www.seamframework.org/) in der Version 2.
Bereit gestellt wird die Anwendung auf einem **JBoss Application Server** in der *Version 5*.

Die Entwicklung von *Seam* wurde bereits im Jahr 2012 vollständig eingestellt.
Dieser Umstand führt unter anderem dazu, dass in der Weiterentwicklung des Projekts der Einsatz neuerer Technologien dadurch limitiert wird, dass die Kompatibilität zu *Seam* immer gewährleistet sein muss.
Davon betroffen sind sowohl die eingesetzte Java-Version, damit einhergehend auch der Applikationsserver, als auch schlussendlich die verwendeten *Libraries*.
Damit qualifiziert sich dieses Projekt, um im Kontext der **Softwaremigration** näher betrachtet zu werden.

Das in diesem Artikel betrachtete Beispiel entstammt einer Abschlussarbeit, die durch die *adesso SE* betreut wurde.  
Daher wurde auch die Entscheidung getroffen, eine *Frontend-Migration* durchzuführen, um die Komplexität überschaubar zu halten und gleichzeitig den Rahmen der erwähnten Arbeit nicht zu sprengen.
Schlussendlich demonstriert dieses Beispiel aber auch das breite Einsatzgebiet dieser Methode. Sie lässt sich flexibel für entweder nur eine Migrationsart (Programm-, Benutzerschnittstellen- und/oder Datenmigration) oder eine Kombination dieser einsetzen. Eine vollständige Systemmigration, die sämtliche Bereiche umfasst, ist aber auch möglich.

# Die Migration
In diesem Abschnitt erfolgt die Migration der zuvor beschriebenen Anwendung.
Da sich das Migrationsvorhaben in diesem Beispiel auf das Frontend beschränkt, reduziert sich in der Folge auch die Anzahl der durchzuführenden Migrations-Schritte der **Chicken-Little-Methode**.
So entfallen sämtliche Punkte, die sich auf die Migration der **Programme und Anwendungen** sowie der **Datenbank** beziehen.  

Übrig bleiben also nur noch die im Folgenden aufgeführten Schritte:

- **Analyse** _(Schritt 1)_ sowie die **Strukturierung** _(Schritt 2)_ des Altsystems, 
- der **Entwurf** und die **Installation der Zielumgebung** _(Schritt 3 + 6)_,
- die **Installation der benötigten Schnittstellen** _(Schritt 7)_
- sowie die abschließende **Migration und Umstellung** auf die Neuentwicklung _(Schritt 10 + 11)_.

## Analyse und Strukturierung

Im ersten Schritt gilt es eine geeignete Komponente für den ersten Durchlauf der Migration auszuwählen.
Empfohlen ist es hierbei, möglichst kleinschrittig vorzugehen, also einen in puncto Komplexität überschaubaren Bestandteil der Anwendung zu wählen.
Existieren starke Verwebungen zwischen den unterschiedlichen Schichten (wie z.B. Frontend und Programmlogik), so sind diese bereits im Vorfeld der Migration aufzulösen.

### Die Vertragsliste der Makler-Anwendung
Für den ersten Migrationsschritt des Versicherungsmakler-Portals wurde die *Vertragsliste* ausgewählt, mit Hilfe welcher sich ein Makler sämtliche (Vor-)Verträge seines jeweils ausgewählten Mandanten anzeigen lassen kann.
Die Ausgabe erfolgt dabei in tabellarischer Form und enthält pro Zeile die Details wie bspw. die Versicherungsnummer, die Vertragsart oder den jeweiligen Versicherer.
Darüber hinaus besteht für jeden Vertrag die Möglichkeit mittels eines Buttons, diesen Vertrag zu *löschen* oder zu *bearbeiten*.
Außerdem kann über einen weiteren Button unterhalb der Tabelle eine Tarif-Berechnung für sämtliche Verträge in der Tabelle angestoßen werden.

Der unten stehende, stark vereinfachte Quellcode-Auszug zeigt das grundsätzliche *JSF-Markup* der *Vertragsliste*:

```xml
<ui:define name="content">
    ...
    <rich:dataTable id="vertragsliste" var="_vertrag"
        value="#{vertragslisteController.vertragsliste}"
        rendered="#{vertragslisteController.liste.size > 0}">
        ...
        <rich:column>
            <f:facet name="header">Versicherungsart</f:facet>
            <h:outputText value="#{_vertrag.vertragsArt()}" />
        </rich:column>

        <rich:column>
            <f:facet name="header">Vers.-Nr.</f:facet>
            <h:outputText value="#{_vertrag.versicherungsNr()}" />
        </rich:column>

        <rich:column>
            <f:facet name="header">Versicherer</f:facet>
            <h:outputText value="#{_vertrag.versicherer()}" />
        </rich:column>
        ...
    </rich:dataTable>
    ...
    <h:commandButton id="berechnenButton"
        action="#{vertragslisteController.berechneVertraege()}"
        value="Berechnen" />

</ui:define>
```

#### Involvierte Java-Klassen
Aus dem oben stehenden *JSF-Template* lassen sich bereits die beteiligten *Java-Klassen* ablesen.
Die zentralen Elemente sind hierbei der Controller `VertragslisteController`, der das Datenhandling übernimmt, sowie die Entität `Vertrag`, die den jeweiligen Versicherungsvertrag repräsentiert und dessen Details bereitstellt.

## Entwurf und Entwicklung der neuen Benutzeroberfläche

Die Darstellung der *Vertragsliste* innerhalb der *React App* soll auch hier wieder in tabellarischer Form erfolgen.  

Sowohl die *Vertragsliste* als auch der *Vertrag* werden dazu jeweils als eigenständige *React Komponente* innerhalb der *React App* implementiert.
Bei einer *React Komponente* handelt es sich knapp zusammengefasst um einen wiederverwendbaren Teil einer Benutzeroberfläche, der die Funktionalität sowie die Eigenschaften der Komponente (`props`) innerhalb einer *React App* bündelt.

Weitere Details dazu finden sich [in der React-Dokumentation](https://reactjs.org/docs/components-and-props.html).

### Vertragsliste

Der folgende Quelltext zeigt den grundsätzlichen Aufbau der neuen Komponente `Vertragsliste`:
```jsx
import React from "react";

class Vertragsliste extends React.Component {

    // Initialisierung
    constructor(props) {
        super(props);

        this.state = {
            error: null,
            requestComplete: false,
            vertraege: []
        };

        this.eachVertrag = this.eachVertrag.bind(this);
        this.remove = this.remove.bind(this);
        this.calculate = this.calculate.bind(this);
    }

    // Hier erfolgt der Abruf der Vertragsliste im Altsystem
    // nachdem die Komponente der UI hinzugefügt wurde
    componentDidMount() {}

    // Vertrag im Altsystem löschen
    remove(vertragsId) {}

    // Berechnung der Tarife der i.d. Liste enthaltenen Verträge anstoßen
    calculate() {}

    // Verarbeitung der einzelnen Verträge ...
    eachVertrag(vertrag, i) {}
     // ... und anschließende Ausgabe der Vertragsliste im Frontend
         render() {}
}
```

Im *Konstruktor* erfolgt zunächst die Initialisierung des *Zustands* ([`state`](https://reactjs.org/docs/state-and-lifecycle.html)) der Vertragslisten-Komponente.

Von wesentlicher Bedeutung ist hier das zunächst leere Array `vertrage`, in welchem die, über die Schnittstelle zum Altsystem abgefragten Versicherungsverträge für die jeweilige *View* gespeichert werden.
Daneben gibt es noch zwei weitere Felder, die kennzeichnen, ob eine Anfrage an die Schnittstelle noch läuft oder erfolgreich abgeschlossen wurde (`requestComplete`).
Scheitert der *Request*, so wird der aufgetretene Fehler in `error` gespeichert, um diesen im weiteren Verlauf behandeln zu können.   
Des Weiteren erfolgt hier das [*Binding*](https://reactjs.org/docs/faq-functions.html#why-is-binding-necessary-at-all) der Methoden an den Wert `this`.  

Die initiale Abfrage der *Vertragsliste* aus dem Altsystem erfolgt später über eine noch zu implementierende Schnittstelle mittels der Methode [`componentDidMount()`](https://reactjs.org/docs/react-component.html#componentdidmount).
 Hierbei handelt es sich um eine sogenannte [*Lifecycle-Methode*](https://reactjs.org/docs/state-and-lifecycle.html#adding-lifecycle-methods-to-a-class) von *React*, die ausgeführt wird, sobald die Komponente der Benutzeroberfläche hinzugefügt wurde.

Weitere Methoden in dieser Komponente sind hier `remove()` für das Löschen von Verträgen, sowie `calculate()` zum Anstoßen der Berechnung sämtlicher Tarife.

Das *Rendering* der Liste im Frontend sowie der darin enthaltenen Verträge erfolgt in der Methode `render()` der Komponente.
Dazu wird mittels der Funktion `eachVertrag()` über die aktuelle Liste in `this.state.vertraege` iteriert.
 Dort folgt die Instantiierung der jeweiligen Vertrags-Komponenten und ihrer `props`.

```jsx
    eachVertrag(vertrag, i) {
        return (
            <Vertrag
                key={i}
                index={i}
                vertragsId={vertrag.spartenberatungId}
                href={vertrag.href}
                onRemove={this.remove}>
                <td>{vertrag.versicherungsnummer}</td>
                <td>...</td>
            </Vertrag>
        );
    }
        render() {
            const {error, requestComplete, vertraege} = this.state;
            if (error) { 
                {/*Fehlerbehandlung hier, falls Request scheitert*/}
            } else if (!requestComplete) {
                return <div>Lade Verträge...</div>
            } else {
                return (
                    <div id="vertragsliste">
                        {vertraege && vertraege.length > 0 ? (
                            <table>
                                <colgroup span="8"></colgroup>
                                <thead>{!-- Tabellenkopf -->}</thead>
                                <tbody>{vertraege.map(this.eachVertrag)}</tbody>
                            </table>
                        ) : (
                            <div>Keine Verträge gefunden</div>
                        )}

                        {vertraege && vertraege.length > 0 &&
                        <div className="actionButtons">
                            <input id="calculate"
                                   type="submit"
                                   name="calculate"
                                   value="Berechnen"
                                   onClick={this.calculate}/>
                        </div>
                        }
                    </div>
                )
            }
        }
}
```

**Randbemerkung:** Das, was im obigen Beispiel wie `HTML-Markup` anmutet ist in Wirklichkeit `JavaScript-Code` in Form von `JSX`.
Der `JSX-Code` wird durch einen *Transpiler* in *JavaScript* übersetzt.
Entworfen wurde das ganze von Facebook als Erweiterung des **ES6-Standards**.  Weitere Informationen zu `JSX` und was dahinter steckt, findet Ihr [in der React-Dokumentation](https://reactjs.org/docs/jsx-in-depth.html) und [der JSX-Spezifikation](https://facebook.github.io/jsx/).

### Die Vertragskomponente.

Das folgende Quellcodebeispiel zeigt den Aufbau der Komponente `Vertrag`.
Die Repräsentation des einzelnen Vertrags im Frontend erfolgt jeweils als Tabellenzeile in der Komponente `Vertragsliste`.  

```jsx
import React from "react";

class Vertrag extends React.Component {
    constructor(props) {
        super(props);
        this.remove = this.remove.bind(this);
    }

    remove() {
        this.props.onRemove(this.props.vertragsId);
    }

    render() {
        return (
            <tr>
                {this.props.children}
                <td>
                    <a href="#" id="edit" target="_parent">Bearbeiten</a>
                    <a href="#" id="remove"
                       onClick={e =>
                           window.confirm("Soll der Vertrag wirklich gelöscht werden?") &&
                           this.remove()
                       }>Löschen</a>
                </td>
            </tr>
        );
    }
}

export default Vertrag;
```      

Die Ausgabe der jeweiligen Tabellenzeile erfolgt in der `render()`-Methode.
Die jeweiligen Vertragsdetails wurden bei der Initialisierung der Komponente `Vertrag` innerhalb der `Vertragsliste`, in Form von `JSX` übergeben.
Auf diese kann nun über das Objekt `this.props.children` zugegriffen werden.
Daneben erfolgt hier außerdem noch die Definition der Buttons, die für das *Löschen* sowie das *Bearbeiten* des jeweiligen Vertrages verantwortlich sind.

Mit der Entwicklung der beiden Komponenten für die *Vertragsliste* und den *Vertrag* ist die neue Benutzeroberfläche fertiggestellt.

Im nächsten Schritt müssen nun noch die **Schnittstellen** im Altsystem implementiert werden, damit die hier entwickelte *React App* und das Altsystem miteinander kommunizieren können.

## Entwicklung einer REST-API als Schnittstelle zwischen Alt und Neu
Die Implementierung der Schnittstelle erfolgt in diesem Beispiel in Form einer kleinen [**REST-API**](https://de.wikipedia.org/wiki/Representational_State_Transfer). 
Die **API** soll hierbei als **Reverse Gateway** dienen, der die eingehenden **Requests** an die ursprüngliche Methode des **Vertragslisten Controller** delegiert und mögliche Rückgaben wieder an den Aufrufer weiterleitet.   

Folgende Funktionalität muss die **API** für das Beispiel der *Vertragsliste* bereitstellen: 
- Gesamtliste aller Verträge des aktuell ausgewählten Mandanten abrufen
- Berechnung der Tarife aller Verträge in der Liste anstoßen
- Einen Vertrag aus der Liste löschen 

Im Altsystem wird die **Vertragsliste** als **Ressource** im REST-Kontext angelegt. 
Dazu wird eine neue Klasse mit dem Namen `VertragslisteResource` und folgendem Inhalt erzeugt: 

```java
@Name("vertragslisteResource")
@Path("/vertragsliste")
@Produces({ "application/json", "text/json" })
public class VertragslisteResource {

    @In(create = true, required = true, value = "vertragListe")
    private VertragslisteController vertragslisteController;

    private List<Vertrag> vertragsliste;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getVertragsliste() {

        vertragsliste = vertragslisteController.getVertragsliste();
        return Response.ok(vertragsListe).build();
    }

    @POST
    public Response berechneAngebote(@QueryParam("cid") String cid) {
        try {
            vertragslisteController.berechneAngebote();
        } catch (Exception e) {
            log.error(e);
            return Response.serverError().build();
        }

        return Response.ok().build();
    }

    @DELETE
    @Path("/{vertragsId}")
    public Response removeVertrag(@PathParam("vertragsId") int vertragsId) {

        vertragslisteController.removeVertrag(vertragsId);
        return Response.noContent().build();

    }
}
```      

Für die Umsetzung wird sich der Library **RESTEasy** bedient, die den **JAX-RS**-Standard implementiert und die Definition und Konfiguration von *REST-Ressourcen* über Annotationen der *Java-Klassen* erlaubt. 

Über dem Klassennamen erfolgt zunächst die Definition der URI `/vertragsliste` per Annotation.
Darüber lässt sich die Ressource in der **REST-API** adressieren.
Daneben wird außerdem festgelegt, dass die Kommunikation via `JSON` erfolgen soll. 

Die folgende Auflistung zeigt die beteiligten **Ressourcen**, die jeweilige **URI**, die dabei verwendete **HTTP-Methode** sowie die jeweils korrespondierende **Java-Methode** auf.

* **Liste abfragen**: `GET /vertragsliste` -> `getVertragsliste()`
* **Verträge berechnen**: `POST /vertragsliste` -> `berechneAngebote()`
* **Vertrag löschen**: `DELETE /vertragsliste/{vertragsId}` -> `removeVetrag()`

Sowohl für das **Abfragen** der Liste als auch die **Berechnung** der Verträge zeichnet sich die Ressource `Vertragsliste` verantwortlich.  
Welche Aktion ausgeführt werden soll, wird maßgeblich über die beim **Request** verwendete **HTTP-Methode** bestimmt.
Die Abfrage der List erfolgt dabei mittels eines **GET-**, die Berechnung der Verträge hingegen mittels eines **POST-Requests**. 
Ein Vertrag kann mittels einem **DELETE-Request** gelöscht werden, in dem man der Basis-URI `/vertragsliste` noch die jeweilige **Vertrags-Id** als Parameter übergibt.  

### Anbindung der React App an die API
Nachdem die API erfolgreich auf Funktionalität getestet wurde, muss die **React App** noch an diese angebunden werden. 
Dies geschieht mittels der *JavaScript-API* [`fetch`](https://developer.mozilla.org/de/docs/Web/API/Fetch_API).

Für die Abfrage der Vertragsliste über die API in der Methode `componentDidMount()` sieht das folgendermaßen aus: 

```js 
componentDidMount() {
        // reset errors
        this.setState({error: null})

        fetch("https://makler.portal/api/vertragsliste")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        requestComplete: true,
                        vertraege: this.state.vertraege
                            .concat(result.vertragsliste.vertraege)
                    });
                },
                (error) => {
                    this.setState({requestComplete: true, error})
                }
            )
    }
``` 

Zunächst werden alle Fehler, die möglicherweise bei einem vorangegangenen Request aufgetreten sind, wieder zurückgesetzt. 
Anschließend wird die Vertragsliste über die **REST API** abgefragt und festgelegt, dass der **Response** als `JSON String` erwartet wird. 
Konnte der **Request** erfolgreich durchgeführt werden, so werden die zurückgegebenen Verträge im `state` der Vertragsliste innerhalb der *React App* abgelegt. 
Scheitert der **Request** hingegen, so wird dieser Fehler für die weitere Behandlung in `this.state.error` gespeichert. 

## Migration und Umstellung des Frontends

Damit die neu entwickelte Vertragsliste nun ihre Arbeit im Altsystem aufnehmen kann, wird diese im letzten Teil dieses Artikels im System integriert. 

Dazu wird zunächst sämtliches Markup des **JSF-Templates** der alten Vertragsliste entfernt. 
Stattdessen wird hier nun die neue **React App** mittels eines `Iframes` eingebettet. 
So kann sichergestellt werden, dass das unterschiedliche *Markup* und die auf beiden Seiten eingesetzten *JavaScript-Libraries* nicht in Konflikt miteinander treten. 

Iframes passen sich standardmäßig nicht der Größe ihres Inhalts an. 
Das führt zu unschönen Effekten wie beispielsweise doppelten Scrollbars, einmal für die Seite selbst und dann nochmal für den Iframe-Inhalt. 

Um diesem Problem zu begegnen und den Einsatz von Iframes für den Benutzer zu kaschieren, gibt es verschiedene *JavaScript Libraries* (wie bspw. [Seamless.js](https://github.com/travist/seamless.js) oder [IframeResizer](https://github.com/davidjbradshaw/iframe-resizer)), die diese Dynamik für Iframes nachrüsten.   

In diesem Beispiel wurde die Librarie `IframeResizer` verwendet. 
Das unten stehende Quellcode-Beispiel zeigt die Integration:

```xml
<ui:define name="content">
    <iframe id="vertragsliste-react" src="https://makler.portal/api/vertragsliste"></iframe>
    
    <script>
        // IframeResizer
        iFrameResize({ inPageLinks: true }, "#vertragsliste-react");
    </script>
</ui:define>
```

Mit diesem letzten Schritt ist die Migration der Vertragsliste abgeschlossen und kann im Altsystem nun verwendet werden.

# Zusammenfassung

Dieser Artikel hat gezeigt, wie sich die **Chicken-Little-Methode** für eine Frontend-Migration anwenden lässt. Dazu wurde das Beispiel der **Vertragsliste** für die erste Iteration dieses inkrementellen Verfahrens ausgewählt. 
Im Anschluss an die Analyse des Altsystems, wo die zu migrierenden Bestandteile und betroffenen *Java-Klassen* identifiziert wurden, erfolgte zunächst die Entwicklung dieser Vertragsliste in Form einer **React App**. 
Anschließend wurde eine Schnittstelle in Form einer **REST API** entwickelt, um die Kommunikation zwischen dem Altsystem und der migrierten Komponente herzustellen. 
Mit der Anbindung der **React App** an die Schnittstelle und dem Austausch der alten Komponente durch die neue *React App* wurde der erste Migrationsschritt erfolgreich abgeschlossen. 

Das in diesem Artikel demonstrierte Prozedere ist für jede weitere Komponente des Frontends zu wiederholen, bis das Frontend mit der letzten Komponente vollständig migriert wurde. 




