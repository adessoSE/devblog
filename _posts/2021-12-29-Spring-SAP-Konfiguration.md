---
layout:         [post, post-xml]              
title:          "Java und SAP in der Box"
date:           2021-12-29 12:00
author_ids:     [scarstenen]
categories:     [Softwareentwicklung]
tags:           [Java, Spring, SAP, Docker]
---

Irgendwann kommen viele Java-Projekte an den Punkt, an dem sie die schöne Welt von Mikroservices und REST-Schnittstellen verlassen und auf ein Backend-System zugreifen müssen. 
Wir wollen hier den Zugriff auf SAP betrachten. 
Besonderes Augenmerk gilt der Konfiguration und dem Build, da diese ein paar Besonderheiten aufweisen.

# Das Ziel
Ziel ist es, aus einer [Spring-Boot](https://spring.io/projects/spring-boot)-Anwendung heraus eine RFC-Schnittstelle (Remote-Function-Call-Schnittstelle) von SAP ansprechen zu können und von dort beispielsweise Vertragsinformationen auszulesen.
Das Projekt soll mit Maven gebaut und als Docker Image ausgeliefert werden können.

# Die Bibliothek
Der Zugriff auf RFC-Schnittstellen erfolgt über die SAP-eigene Bibliothek [SAP Java Connector](https://support.sap.com/en/product/connectors/jco.html), der Einfachheit halber im Folgenden *SAP JCo* genannt.
Die Bibliothek besteht aus einer jar-Datei und einem dynamisch gebundenen Anteil, der spezifisch je Betriebssystem ist. Es werden Windows, Linux, MacOS und einige weitere unterstützt.

Der *SAP JCo* ist nicht unter einer freien Lizenz verfügbar und steht Kunden nur über das SAP-Downloadportal zur Verfügung. 
Das bedeutet auch, dass *SAP JCo* nicht (bzw. nur in veralteten oder nicht offiziellen Versionen) im zentralen Maven Repository enthalten ist und während bes Build Prozesses nicht automatisch geladen werden kann.
Abhilfe schafft die Möglichkeit, lokale Bibliotheken als Abhängigkeiten in Maven zu definieren.
```xml
<dependency>
    <groupId>com.sap.conn.jco</groupId>
    <artifactId>sapjco3</artifactId>
    <version>3.0.14</version>
    <scope>system</scope>
    <systemPath>${project.basedir}/libs/sapjco3.jar</systemPath>
</dependency>
```
Was der ungewöhnliche system Scope bedeutet und warum er an dieser Stelle sogar mehr als nur eine Notlösung ist, zeigt sich, wenn das ausführbare [Artefakt gebaut](#Das Repackage Problem) werden soll.
# Die Konfiguration
*SAP JCo* wird über spezielle Properties konfiguriert, die im Detail im Interface `DestinationDataProvider` definiert sind.
Spring Boot verwendet in der Regel eine Datei namens `application.properties` oder `application.yml` zur Konfiguration.
```json
jco:
  client:
    ashost: [SAP-HOST]
    sysnr: 00
    client: 100
    user: [SAP-BENUTZER]
    passwd: [SAP-PASSWORT]
    lang: de
```
Die Klasse `SapConfigurationProperties` nutzt die [Spring Annotation](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config) `@ConfigurationProperties(prefix = "jco.client")`, um diese Konfiguration zu lesen und innerhalb der Setter in die erforderlichen Properties zu schreiben.
Die Annoation bewirkt, dass Spring beim Start der Anwendung Konfigurationswerte auf Basis ihres Namens an Properties eine Instanz.
Das Schreiben der Werte in die Instanz erfolgt über den Aufruf der entsprechenden Setter.

Da *SAP JCo* keine Beans zur Konfiguration nutzt, sondern Properties verwendet, füllen die Setter in diesem Fall eine Properties Instanz mit den Werte, die in der Folge verwendet werden können. 
```java
@Configuration
@ConfigurationProperties(prefix = "jco.client")
public class SapConfigurationProperties {

  private final Properties properties = new Properties();

  public void setAshost(String ashost) {
    this.properties.setProperty(DestinationDataProvider.JCO_ASHOST, ashost);
  }

  public void setSysnr(String sysnr) {
    this.properties.setProperty(DestinationDataProvider.JCO_SYSNR, sysnr);
  }

  public void setClient(String client) {
    this.properties.setProperty(DestinationDataProvider.JCO_CLIENT, client);
  }

  public void setUser(String user) {
    this.properties.setProperty(DestinationDataProvider.JCO_USER, user);
  }

  public void setPasswd(String passwd) {
    this.properties.setProperty(DestinationDataProvider.JCO_PASSWD, passwd);
  }

  public void setLang(String lang) {
    this.properties.setProperty(DestinationDataProvider.JCO_LANG, lang);
  }

  public Properties getProperties() {
    return properties;
  }
}

```


Der `SapDestinationProvider` stellt *SAP JCo* diese Konfiguration als ein Ziel zur Verfügung. Ein Ziel ist die Darstellung eines SAP-Systems innerhalb von *SAP JCo*.
Grundsätzlich können beliebig viele Ziele verwaltet werden. 
Das Beispiel beschränkt sich auf eines.
Da der Provider eine `@Component` ist, wird er bei Bedarf von Spring instanziiert und das Ziel somit in *SAP JCo* registriert. 
Der `InMemoryDestinationDataProvider` dient dabei der einfachen Ablage der Konfiguration im Speicher.
```java
@Component
@RequiredArgsConstructor
@Slf4j
public class SapDestinationProvider {

  private static final String DESTINATION_NAME = "Test-SAP";

  private final SapConfigurationProperties configurationProperties;

  @PostConstruct
  public void init() {
    var memoryProvider = new InMemoryDestinationDataProvider();

    // Registriert den Provider in der JCo-Umgebung.
    // Fängt IllegalStateException, wenn eine Instanz bereits registriert ist.
    try {
      Environment.registerDestinationDataProvider(memoryProvider);
    } catch (IllegalStateException providerAlreadyRegisteredException) {
      log.warn("Die Implementierung ist bereits registriert.", providerAlreadyRegisteredException);
    }

    memoryProvider.changeProperties(DESTINATION_NAME, configurationProperties.getProperties());
  }

  public JCoDestination getDestination() throws JCoException {
    return JCoDestinationManager.getDestination(DESTINATION_NAME);
  }
}
```
Jede Anwendung, die *SAP JCo* verwendet, behandelt Ziele. 
Ein Ziel stellt eine logische Adresse eines SAP-Systems dar und trennt somit die Konfiguration von der eigentlichen Anwendungslogik.

*SAP JCo* ruft die zur Laufzeit erforderlichen Parameter aus dem in der Laufzeitumgebung registrierten DestinationDataProvider ab. 
Wenn kein Provider registriert ist, verwendet *SAP JCo* eine Standardimplementierung, die die Konfiguration aus einer Properties-Datei liest. 


# Das Repackage-Problem
Das `spring-boot-maven-plugin` stellt innerhalb des Build-Prozesse ein ausführbares Archiv zusammen, das die komplette Anwendung enthält.
Durch die Direktive `<packaging>jar</packaging>` entsteht in diesem Beispiel ein `jar`-Archiv.
Einer der Schritte dieses Prozesses ist das Umbenennen der verwendeten Bibliotheken.
Der Dateiname wird um die Version ergänzt. 
So wird z.B. aus `jakarta.el.jar` in der Version 3.0.3 `jakarta.el-3.0.3.jar`.
Da der Name einer jar-Datei in der Regel keine Rollen spielt, hat die Umbenennung keine negativen Auswirkungen.

*SAP JCo* prüft jedoch, ob der Name der jar-Datei genau `sapjco3.jar` ist. 
Wenn wir oder das Spring Maven Plugin ihn ändern, führt das zu einem Fehler in der Art von 
```java
JCo initialization fails with java.lang.ExceptionInInitializerError: Illegal JCo archive "sap-jco-3.0.11.jar".
It is not allowed to rename or repackage the original archive "sapjco3.jar"
```

Die augenblickliche Lösung ist die Verwendung des Scope `system` für die Abhängigkeit. 
Augenblicklich deswegen, weil der Scope `deprecated` also als veraltet markiert ist. 
In der aktuellen Version unterstützt Maven den Scope aber noch. 
Maven geht nun davon aus, dass die entsprechende Abhängigkeit auf irgendeine Weise im classpath vorhanden ist. 
Das Spring-Boot-Plugin kennt die jar-Datei somit nicht, sie wird folglich auch nicht umbenannt.

# Was ist mit Tests?
Die Struktur, mit der auf SAP zugegriffen wird, lässt sich gut durch Mock-Objekte ersetzen.
Somit sind Test auf verschieneden Ebenen möglich.
Das folgende Beispiel abstrahiert sehr weit und testet lediglich die Antwort-Verarbeitung.
Nach diesem Vorbild lassen aich auch beliebige komplexere Test realisieren, die zum Beispiel konkrete Ein- und Ausgabeparameter oder Fehlerantworten testen.

```java
@ExtendWith(SpringExtension.class)
@SpringBootTest()
class SapVertragClientTest {

    @MockBean
    SapDestinationProvider sapDestinationProvider;

    @Autowired
    private SapVertragClient client;
    private JCoParameterList exportParameterList;

    @BeforeEach
    void init() throws JCoException {
        exportParameterList = mock(JCoParameterList.class);

        var importParameterList = mock(JCoParameterList.class);
        when(importParameterList.getStructure("IS_READ_PM_KEY")).thenReturn(mock(JCoStructure.class));

        var jCoFunction = mock(JCoFunction.class);
        when(jCoFunction.getExportParameterList()).thenReturn(exportParameterList);
        when(jCoFunction.getImportParameterList()).thenReturn(importParameterList);

        var jCoRepository = mock(JCoRepository.class);
        when(jCoRepository.getFunction("/PM0/ABT_CM_GET_CONTRACT_DATA")).thenReturn(jCoFunction);

        var jCoDestination = mock(JCoDestination.class);
        when(jCoDestination.getRepository()).thenReturn(jCoRepository);

        when(sapDestinationProvider.getDestination()).thenReturn(jCoDestination);
    }

    @Test
    void police1000_sollVertragLiefern() throws JCoException {
        when(exportParameterList.toJSON()).thenReturn("{}");

        assertEquals(Optional.of("{}"), client.leseVertrag("1000", "1000"));
    }

    @Test
    void police2000_sollKeinErgebnis() throws JCoException {
        when(exportParameterList.toJSON()).thenReturn(null);

        assertEquals(Optional.empty(), client.leseVertrag("2000", "2000"));
    }

}
```


# Docker - In die Box
Das Dockerfile Plugin von Spotify verwendet ein externes Dockerfile zur Erzeugung eines Image. 
Somit können aus dem Docker-Umfeld gewohnte Mechanismen auch innerhalb eines Maven-Build-Prozesses verwendet werden. 
```xml
<plugin>
    <groupId>com.spotify</groupId>
    <artifactId>dockerfile-maven-plugin</artifactId>
    <version>1.4.13</version>
    <executions>
        [...]
    </executions>
    <configuration>
        <repository>${docker.registry}/instanceof42/${project.name}</repository>
        <tag>1.0.0-SNAPSHOT</tag>
        <buildArgs>
            <JAR_FILE>target/${project.build.finalName}.jar</JAR_FILE>
        </buildArgs>
        <forceCreation>true</forceCreation>
        <useMavenSettingsForAuth>true</useMavenSettingsForAuth>
    </configuration>
</plugin>
```

Das Plugin erwartet das `DOCKERFILE` im selben Verzeichnis wie die `pom.xml`.
```dockerfile
FROM adoptopenjdk/openjdk13
ARG JAR_FILE
COPY ${JAR_FILE} app.jar
RUN mkdir -p /libs
COPY libs/* /libs/
ENTRYPOINT java -cp app.jar -Dloader.path=/libs/ org.springframework.boot.loader.PropertiesLauncher -Djava.security.egd=file:/dev/./urandom
EXPOSE 8080
```
Das Ergebnis des vorherigen Build wird über das BuildArgument `JAR_FILE` an das Dockerfile übergeben. 

Der Versuch, das bis hier hin entstandenen `spring-sap.jar` auszuführen, scheitert daran, dass die Klassen der *SAP-JCo*-Bibliothek nicht gefunden werden. 
Die Fehlermeldung lautet
```bash
java.lang.NoClassDefFoundError: com/sap/conn/jco/ext/DestinationDataProvider
```
oder ähnlich.

Die Zeile `COPY libs/* /libs/` übernimmt alle *SAP-JCo*-Dateien aus dem Projekt in das Docker Image. 
Der Parameter `-Dloader.path=/libs/` des `java`-Aufrufs sogt dann dafür, dass sie alle Teil des Classpath werden und die Applikation sie verwenden kann.

Die letzte Besonderheit ist der `PropertiesLauncher`, der es im Gegensatz zum häufig für Spring-Boot-Applikationen in Docker Containern verwendeten `ENTRYPOINT java -jar /app.jar` erlaubt, einen eigenen Classpath zu verwenden.

Wenn das Docker Image weiterverteilt werden soll, erlaubt es die *SAP-JCo*-Lizenz nicht, die notwendigen Dateien mit auszuliefern.
In diesem Falle ermöglicht es die starke Trennung der eigentlichen Anwendung von der Bibliothek, dieses z.B. in Form eines Volume nachträglich einzubinden.

# Das komplette Beispiel
Das komplette Beispiel steht auf [github](https://github.com/janstefan42/spring-sap) zur Verfügung.
Die eigentliche SAP-Bibliothek ist aus Lizenzgründen nicht Teil des Beispiels, wird aber ebenso wie ein SAP-System für die Funktion im Verzeichnis `/libs` des Projekts erwartet.
Ich werde hier nur die Ausschnitte darstellen, die für die Beschreibung relevant sind.

# Fazit
Das Zusammenspiel von Spring Boot mit SAP ist nicht ohne Besonderheiten.
Speziell die Verwendung des Scope `system` hinterlässt nicht das allerbeste Gefühl, ist aber für mich der beste Weg mit dem Umbenennungsverbot umzugehen.
Hat man diese Hürde aber einmal überwunden, bietet *SAP JCo* einen für Java-Entwickler gewohnten Weg, auf Daten aus SAP zuzugreifen oder sie dorthin zu übertragen.
Die Verbindung mit SAP bietet ein breites Spektrum an Funktionen, zeigt nach meinen Erfahrungen keine Probleme auch mit größeren Datenmengen und läuft sehr stabil.
