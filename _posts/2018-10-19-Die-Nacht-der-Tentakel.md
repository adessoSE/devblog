---
layout:         [post, post-xml]              
title:          "Frank'n Java und die Nacht der Tentakel"
date:           2018-10-19 16:29
modified_date:  2021-03-08 14:50
author_ids: [Franknjava]
categories:     [Softwareentwicklung]
tags:           [ASM, GOTO, Spaghetti-Code, Java]
---

Wie ich in einer sturmdurchpeitschten Nacht Java hart auf die Werkbank schnallte um ihr cthulhuoide Tentakel anzunähen, auf dass sie von nun an und für immerdar in der Lage sei, echte italienische Pasta zu bereiten.<br/><br/>
Mit Java kann man keinen echten Spaghetti-Code erzeugen, oder doch?<br/>
In diesem humoristischen Artikel wird beschrieben, wie ich in einer langen Hotel-Nacht Java mit ein wenig Bytecode- Manipulation ein Zeilennummern-basiertes „GOTO“ Statement verpasst habe. 

Der unsäglich diabolische Spaß, der mir durch die Implementierung dieser vollkommen sinnfreien Spracherweiterung zuteil wurde, wurde nur noch von der Freude übertroffen, möglichst verrückte Nutzungsbeispiele zu ersinnen. Im Folgenden werden Techniken beschrieben, mit denen Java um neue Befehle erweitert werden kann, ohne dass eine eigene JVM-Sprache entwickelt werden muss. Außerdem werden zum allgemeinen Amusement eine Reihe von Beispielen gezeigt, die wohl eher in die Kategorie Evil-Practice als Bad-Practice fallen.

*Der Sourcecode ist auf [GitHub](https://github.com/Franknjava/TheNightOfTheTentacles) verfügbar.*

![Frank'n Java und die Nacht der Tentakel](/assets/images/posts/Die-Nacht-der-Tentakel/Title.png)

Wie Stahlbolzen trommelte der Regen gegen die Scheiben meiner Kemenate, während flirrende Blitze gellend durch die Nacht zuckten, wie die spastischen Tentakel längst vergessener kosmischer Wesen. Schmatzend klatschte die Dunkelheit in meine Gedanken. Ruhelos schritt ich in meiner Hotelburg auf und ab, und mein Geist begann zu wandern.

Ich dachte an den jungen Adepten, der mir bei der Betrachtung eines gewachsenen Sourcery Codes von etwa 100 Zeilen, mit drei Verzweigungen und einer Switch-Anweisung fröhlich den Namen einer italienischen Pasta Sorte entgegenschmetterte: "Uuh, Spaghetti-Code". Oh, die Unwissenheit der Jugend. Ist es doch mit modernen Sprachen kaum noch möglich, den Kontrollfluss dermaßen verworren zu gestalten, dass selbst ein Riesenkrake vor Neid erblassen würde.

Nein! Dies war nur mit den großen Alten möglich, deren cthuloide Tentakel die Programmlogik in ein Zerrbild des Wahnsinns verwandelten. Wir brauchten damals keinen Code Obfuscator. Nein, unser Code war obfuscated by design. Diesem Adepten würde ich zeigen, wie man italienischen Nudel-Code zubereitet. 

Aber halt, war Java nicht viel zu unschuldig und rein für solch schmutzige Spielereien? Nicht doch, ich wusste genau, dass auch in ihrem Innern das Böse schlummert. Also schnallte ich sie hart auf die Werkbank und zückte mein Messer. Heute Nacht würde ich eine cthuloide Unaussprechlichkeit erschaffen und Morgen ..., naja ihr wisst schon: Muhahahaha!!!

# Labor-Tagebuch

## Prolog
Wie mäandernde Unaussprechlichkeiten wälzen sich die Fragen des Tages durch meinen kranken Geist.

- Was ist Spaghetti-Code überhaupt?
- Kann man ihn mit Java erzeugen?
- Welche Werkzeuge werden dafür benötigt?
- Und woher bekommen wir diese?

### Was ist Spaghetti-Code überhaupt?

>Spaghetti-Code ist ein abwertender Begriff für Software-Quellcode, der verworrene Kontrollstrukturen aufweist.<br/>
*-[Wikipedia](https://de.wikipedia.org/wiki/Spaghetticode)-*

### Kann man ihn mit Java erzeugen?

- Nur durch verworrene möglicherweise rekursive Methodenaufrufe
- Innerhalb einer Methode ist der Kontrollfluss immer linear
- Ausnahme: Schleifen!
  - Auch hier  herrschen klare Strukturen vor
  - Die meiste Verwirrung läßt sich mit „break“, „continue“ und benannten Sprungmarken stiften

Am Ende ist das doch alles Kinderkram.

### Welche Werkzeuge werden dafür benötigt?

Für *echten* Spaghetti-Code wird unbedingt ein **GOTO**-Statement benötigt.

Dieses ist in Java nicht vorhanden ...

... oder doch?

### Und woher bekommen wir diese?

In Java ist **goto** bereits ein reserviertes Schlüsselwort. Dieses wurde aber wohl kaum reserviert um es in ferner (oder naher) Zunkunft als Sprachelement einzuführen. Wahrscheinlicher ist, dass die Sprachentwickler es zum Schutz der Menschheit vor wahnsinnigen Programmierern weggesperrt haben. Wir lassen uns davon nicht abhalten, schreiben unser **GOTO** kurzerhand groß und verwenden sinistre Bytecode-Manipulation als Mittel der Wahl.

## Nacht I - Ingredienzien

<!-- #BOX#
Ziel ist es Java um ein GOTO Statement zu erweitern. Es soll explizit keine neue VM Sprache entwickelt werden, sondern eine Erweiterung, die in jeder Java Anwendung verwendet werden kann.
-->
<img align="right" src="/assets/images/posts/Die-Nacht-der-Tentakel/explanationBox001.png"/>

Frisch an's Werk. Bevor ich anfange muss ich mir noch die richtigen Zutaten aus den Archiven besorgen - also hinunter in die Katakomben. Ich streife an den endlosen Reihen feinsäuberlich katalogisierter Formaldehyd-Präparate entlang: 1940, 1950, 1960, ah, 1964 Dartmouth, Kemeny und Kurtz, BASIC, GOTO. Das ist der Stoff aus dem Tentakel sind. Ich klemme mir das Präparat unter den Arm. Auf dem Weg zurück in's Labor mache ich noch einen kurzen Abstecher: 1985, AmigaBASIC. Hier packe ich noch schnell ein LABEL Präparat ein.

<!-- #BOX#
	Der Tentakel hat folgende Funktionen:
	<ul>
		<li class="boxed">GOTO: springt wahlweise zu einer angegebenen Zeilennummer oder benannten Sprungmarke. Beides kann sowohl statisch als auch dynamisch angegeben werden.</li>
     <li class="boxed">LABEL: definiert eine benannte Sprungmarke. Aus technischen Gründen kann dies nur statisch erfolgen.</li>
     <li class="boxed">LINE: liefert die aktuelle Zeilennummer. Dadurch sind relative Sprungziele realisierbar.</li>
	</ul>
-->
<img align="left" src="/assets/images/posts/Die-Nacht-der-Tentakel/explanationBox002.png"/>

Das Labor sieht aus wie nach einem Massaker - Ectoplasma überall. Ich habe aus den Zutaten einen Tentakel nach meinen Vorstellungen erschaffen: schlicht, funktional und bösartig. Ich liebe ihn jetzt schon. 
Bin von den Formaldehyddämpfen leicht benebelt. Lasse es für heute gut sein. Morgen ist auch noch eine Nacht. Ich glaube, ich kann fliegen.

<br/><br/>
## Nacht II - Tentakel

<!-- #BOX# 
Ich glaube, Default-Implementierungen wurden nur aus einem einzigen Grund eingeführt. Ohne Default-Implementierungen hätte man es niemals geschafft, die Streaming API effektiv einzuführen. Multiple Vererbung, die durch die Default API ermöglicht wird, war eigentlich immer ein klares NO-GO im Java Konzept.
-->
<img align="right" src="/assets/images/posts/Die-Nacht-der-Tentakel/explanationBox003.png"/>

Konnte doch nicht fliegen. Habe es zum Glück noch rechtzeitig gemerkt.

Weiter geht's. Heute werde ich die Tentakel an meinem Versuchsobjekt befestigen. Habe verschiedene Befestigungsmöglichkeiten evaluiert. Glücklicherweise bekam Java zum achten Geburtstag einen formidablen Knochenleim in Form von Default-Implementierungen für Schnittstellen geschenkt. Eigentlich ein eher schmutziges Geschenk. Ich jedenfalls möchte einer achtjährigen nicht erklären müssen wie multiple Vererbung funktioniert. Aber, genau das was ich brauche.

Damit keine Anwendungen unkontrolliert um sich schlagen bevor ich die Tentakel mit ihren Innereien verbunden habe, versetze ich die Default-Implementierung der Tentakel in den Ausnahmezustand. Die GOTO Statements werde ich wohl groß schreiben müssen, da "goto" ein reserviertes Schlüsselwort in Java ist. Na egal, da schreibe ich gleich alle groß.

```Java
public interface Tentacle {

    default void GOTO(int line) {
        throw new UnsupportedOperationException(
        "Method should have been replaced by instrumentation: GOTO " + line);
    }

    default void GOTO(String label) {
        throw new UnsupportedOperationException(
        "Method should have been replaced by instrumentation: GOTO " + label);
    }

    default void LABEL(String label) {
        throw new UnsupportedOperationException(
        "Method should have been replaced by instrumentation: LABEL " + label);
    }

    default int LINE() {
        throw new UnsupportedOperationException(
        "Method should have been replaced by instrumentation");
    }
}
```

## Nacht III - Seek ...

Ah, endlich, nun geht es an's Eingemachte. Um die Tentakel mit unseligem Leben zu füllen, muss ich diese zunächst in den Bytecode Gedärmen meiner Anwendung wieder finden. Werfen wir doch einmal das ein oder andere Auge auf die Eingeweide eines GOTO statements.
Während der Java Code eher als graue Maus daherkommt ...

```Java
GOTO(f(x++));
```

... eröffnet uns der dazugehörige Bytecode doch seine ganze Schönheit.

```Bytecode
3    3:aload_0
4    4:iload_1
5    5:iinc            1  1
6    8:invokespecial   #112 <Method int f(int)>
7   11:invokevirtual   #114 <Method void GOTO(int)>
```

Ist es nicht wundervoll? Ein GOTO Tentakel, der mit dem Rückgabewert einer Funktion befüllt wird, welche eine ***int*** Variable übergeben bekommt, die nach der Übergabe inkrementiert wird. 

>„Ich werde euch sagen, wie ihr es anstellen müsst“, sagte in diesem Moment Pater Kilian, und ich glaubte, verrückt zu werden. Was für ein perfides Spiel trieb Asmodis hier?<br/>
*-John Sinclair-*

<!-- #BOX#
Zwei Informationen sind für die spätere Ersetzung des Methodenaufrufs relevant: 
<ul>
<li class="boxed">Die Übereinstimmung mit der jeweiligen Methodensignatur</li>
<li class="boxed">Ob dem Aufruf statische oder dynamische Werte übergeben werden</li>
</ul>
Die Art der Übergabeparameter (statisch/dynamisch) hat später einen wesentlichen Einfluss auf das Mapping der Sprungziele (Zeilennummern/Label) auf die tatsächlichen Adressen im Bytecode.
-->
<img align="left" src="/assets/images/posts/Die-Nacht-der-Tentakel/explanationBox004.png"/>

Schnell bereite ich ein okkultes Ritual vor und beschwöre **ASM**odis herauf. Mit seiner Hilfe wird es mir gelingen in allen Klassen, die meine Tentakel implementieren, jene sinistren Methoden zu erspähen, die mit Hilfe meiner Tentakel Kommandos zu Ruhm und Ehre gereichen. Glücklicherweise ist Java okkult-, äh ..., objekt-orientiert. Ich lasse die Kommandos sich einfach selbst im Bytecode erkennen. Einigen meiner Saugnapf-bewehrten Freunde werden wohl besonders wild und dynamisch um sich schlagen. Diesen werde ich später noch besondere Aufmerksamkeit widmen, wenn ich ihnen morgen neues und fremdartiges Gewebe implantiere. Hehehe!!!

```Java
public class StaticLineNumberGotoCommand extends StaticGotoCommand {

    private static final String METHOD    = "GOTO";
    private static final String SIGNATURE = AsmUtil.getMethodSignature(
                                                Tentacle.class, 
                                                METHOD, 
                                                int.class
                                            );

    @Override
    public boolean doesInstructionFit(
        AbstractInsnNode ain, 
        FrameTable frameTable, 
        Stack<AbstractInsnNode> instructionStack
    ) {
        return AsmUtil.isMethodSignatureMatching(ain, METHOD, SIGNATURE)
                && AsmUtil.areParameterValuesStatic(
                       AsmUtil.getParamStack(instructionStack, frameTable));
    }
}
```

## Nacht IV - ... and destroy

So, das Messer gezückt und die Gedärme entblößt. Nachdem ich die Entzündungsherde lokalisiert habe, werde ich diese nun durch mein beliales Gezücht von Wucherungen ersetzen. 

<!-- #BOX#
Der Byte-Code, der den Parameter des GOTO Statements ermittelt, muss erhalten bleiben. Eingefügt wird schließlich ein TABLESWITCH, da die Sprungziele (Zeilennummern oder Label) auf tatsächliche Adressen im Byte-Code übersetzt werden müssen. Dies muss zur Laufzeit geschehen, da das Sprungziel dynamisch sein kann.
Sollte das angegebene Sprungziel gar nicht erreichbar sein, wird eine IllegalArgumentException geworfen.
-->
<img align="right" src="/assets/images/posts/Die-Nacht-der-Tentakel/explanationBox005.png"/>


Die Wurzel der Tentakel ist schnell angenäht. Aber wie gehe ich mit dem perfiden Ziel derselben um? Zuerst muss ich wohl die Ermittlung der Ursprünglichen Ziele erhalten. Aber wo befinden sich diese im Gewirr der Gedärme? Ich befürchte ich werde nicht umhinkommen detaillierte Aufzeichnungen anzufertigen, die ich bei jedem Sprung heranziehen kann um die Zieladresse zu ermitteln. Ach, da hätte ich doch fast noch etwas vergessen. Was tue ich nur, wenn der Tentakel über das Ziel hinaus schießt? Hm, wie meine Großmutter schon immer sagte: "Keine Gnade mit dem Gewürm!" Dann gibt's eben auf die Finger!

```Bytecode
 2    2:aload_0
 3    3:iload_1
 4    4:iinc            1  1
 5    7:invokespecial   #109 <Method int f(int)>
 6   10:tableswitch     62 92: default 148
                        62 0
                        63 2
                        64 158
                        65 326
                        66 490
                        67 654
                        68 818
                        69 982
                        …
 7  148:new             #111 <Class IllegalArgumentException>
 8  151:dup
 9  152:ldc1            #113 <String "Illegal jump target!">
10  154:invokespecial   #114 <Method void IllegalArgumentException(String)>
11  157:athrow
```

### Die Tabellen des Känguruhs

Vielleicht sollte ich mir die Übersetzung der Tentakelziele in Gedärmkoordinaten noch einmal genauer anschauen. Offensichtlich gibt es hier verschiedene Anforderungen:

- Sprungziele sind
  - Zeilennummern
  - Zeilen mit LABEL Statements
- Sprungziele werden auf Bytecode Adressen abgebildet
- Statische Sprungziele können zum Kompilierungszeitpunkt aufgelöst werden
- Dynamische Sprungziele müssen zur Laufzeit aufgelöst werden

Ich denke das Beste wird sein für jede Methode eine Tabelle anzulegen, die alle Zeilennummern und Labels in Byte-Code Adressen übersetzt. Die kann ich dann für alle GOTOs der Methode wiederverwenden.

### Little Stack Map Frames of Horror

Hat sich eigentlich irgend jemand schon einmal Gedanken darüber gemacht, warum einem als größenwahnsinniges Verbrechergenie ständig Steine in den Weg gelegt werden? Gerade hat man den perfekten Plan entwickelt die Weltherrschaft an sich zu reißen: Bämmm! Benötigt man für den Kauf von U-Booten auf einmal hoch komplexe technische Expertisen, schwierig zu fälschende Dokumente und was weiß ich nicht noch alles.

<!-- #BOX#
Stack Map Frames sind
<p>
<ul>
<li class="boxed">Teil des Bytecode Verifikationsprozesses seit Java 7</li>
<li class="boxed">Voraussetzung für schnelle „one pass“ Verifikation</li>
<li class="boxed">In der JVM Spec auf 200 Seiten PROLOG Code beschrieben</li>
-->
<img align="left" src="/assets/images/posts/Die-Nacht-der-Tentakel/explanationBox006.png"/>

Vielleicht habt ihr euch schon gefragt warum ich ein Monster wie **ASM**odis beschwöre. Hätte ich den Byte-Code nicht einfach so an die Gedärme pappen können? Stack Map Frames sind der Stein, den das große Oracle mir hier in den Weg geworfen hat. Ohne nimmt die JVM den Byte-Code seit Java 8 nicht mehr an. Und glaubt mir, die Dinger will keiner selbst berechnen. Es sei denn, ihr seid Freunde maßloser Selbstkasteiung und genießt es euch durch **ZWEIHUNDERT** Seiten PROLOG Code zu arbeiten. Dann doch lieber der gute alte **ASM**odis, der macht das für uns gleich mit.

Nun aber endlich rein damit. Mit Gefühl zwischen die Organe gepresst. "Oh, ah, ja, jetzt!" Bleibt mir nur zu sagen: "Operation gelungen ..."

```Java
public abstract class StaticGotoCommand implements Command {

    @Override
    public void injectInstructions(
        MethodNode mn, 
        MethodInsnNode min, 
        JumpTable jumpTable, 
        FrameTable frameTable, 
        Stack<AbstractInsnNode> instructionStack
    ) {
        Stack<AbstractInsnNode> paramStack = AsmUtil.removeCurrentMethodCall(
                                                 instructionStack, frameTable);
        Object target = AsmUtil.getStaticParameterValues(paramStack).get(0);
        LabelNode label = jumpTable.get(target);
        instructionStack.push(new JumpInsnNode(Opcodes.GOTO, label));
    }
}
```

## Nacht V - Es lebt ...

Das Ende ist in Sicht. Als Sahnehäubchen werde ich noch ein paar Werkzeuge schmieden, mit denen meine buckligen Helfer in Zukunft die Tentakel für mich implantieren können. Man will sich ja nicht selbst die Hände schmutzig machen.

### Der Java Agent

<!-- #BOX#
Der Java Agent ist vor allem für den Einsatz in IDEs sinnvoll, da er die Byte-Code Manipulationen zur Laufzeit on-the-fly vornimmt.
-->
<img align="right" src="/assets/images/posts/Die-Nacht-der-Tentakel/explanationBox007.png"/>

Wer liebt sie nicht - geheime Agenten: Unauffällig, intrigant und effizient. Mit Hilfe eines Agenten können die Tentakel einfach ohne Betäubung in das lebende Objekt eingepflanzt werden. Ich werde dem Agenten den Auftrag erteilen jede Art Kreatur (Äh, Klasse) in ein weltenverschlingendes Monster zu transformieren. Auf diese Art und Weise wird mir niemand entkommen.

```Java
public class Agent {

    public static void agentmain(String agentArgs, Instrumentation instrumentation) 
        throws Throwable {
        instrumentation.addTransformer(
            (loader, className, classBeingRedefined, protectionDomain, classfileBuffer) -> {
                return TentacleHandler.transform(classfileBuffer);
            }
        );
    }

    public static void premain(String agentArgs, Instrumentation instrumentation) 
        throws Throwable {
        instrumentation.addTransformer(
            (loader, className, classBeingRedefined, protectionDomain, classfileBuffer) -> {
                return TentacleHandler.transform(classfileBuffer);
            }
        );
    }
}
```

### Postcompiler

<!-- #BOX#
Der Postcompiler ist die flexibelste Lösung. Eine einfache Java Klasse mit "main" Methode. Auf diese Weise können bereits kompilierte Klassen instrumentiert werden.
-->
<img align="left" src="/assets/images/posts/Die-Nacht-der-Tentakel/explanationBox008.png"/>

So sehr ich die Agenten in ihrer subversiven Art auch verehre, so erscheint es mir doch sinnvoll eine einfach zu bedienende Massenvernichtungswaffe zu entwickeln. Mehr etwas für das alltägliche Armageddon. Einfach ein Ziel wählen, feuern, zurücklehnen und genießen. Dieses Baby ist wirklich das Schweizer Armeemesser der cthuloiden Transformation. Egal in welcher Umgebung man sein persönliches Imperium des Bösen auch aufbaut, dieses Ding wird immer funktionieren.

```Java
public class PostCompiler {

    public static void main(String[] args) throws Exception {
        Arrays.asList(args).stream().parallel().forEach(PostCompiler::walkFileTree);
    }

    private static void walkFileTree(String root) {
        try {
            Files.walkFileTree(
                FileSystems.getDefault().getPath(root), new SimpleFileVisitor<Path>() {
                @Override
                public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) 
                    throws IOException {
                    return transform(file);
                }
            });
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private static final FileVisitResult transform(Path file) throws IOException {
        String name = file.toFile().getName();
        if (name.endsWith(".class")) {
            byte[] code = Files.readAllBytes(file);
            code = TentacleHandler.transform(code);
            Files.write(file, code, StandardOpenOption.CREATE, 
                StandardOpenOption.WRITE, StandardOpenOption.TRUNCATE_EXISTING);
            log.info("File transformed: " + file.getFileName() + " ["+code.length+" Bytes]");
        }
        return FileVisitResult.CONTINUE;
    }
}
```

### Maven Plugin

<!-- #BOX#
Der Einfachheit halber wrappen wir den Postcompiler nochmal in ein Maven Plugin. Dann können die Projekte Out-Of-The-Box mit Maven gebaut werden. Da das Plugin in keinem offiziellen Maven Repository existiert, muss es zunächst lokal gebaut werden.
-->
<img align="right" src="/assets/images/posts/Die-Nacht-der-Tentakel/explanationBox009.png"/>

Na, da mach ich es mir doch am Ende nochmal ein bißchen gemütlich. Der fünffache Espresso ist gekocht. Und ich statte meinen Postcompiler mit einer angemessenen Portion Mojo aus. Schließlich wollen wir ja nicht nur die Weltherrschaft durch cthuloiden Wahnsinn an uns reißen. Am Ende wollen wir dabei ja auch noch groovy dastehen. Und dabei hat eine ordentliche Portion Mojo schon immer geholfen.

```Java
public class MavenMojo extends AbstractMojo {

    @Parameter(defaultValue = "${project.build.outputDirectory}")
    private String outDir;

    @Override
    public void execute() throws MojoExecutionException, MojoFailureException {
        try {
            PostCompiler.main(new String[] { outDir });
        } catch (Exception e) {
            throw new MojoExecutionException("Unable to postcompile classes!", e);
        }
    }
}
```

## Nacht VI - Girls just wanna have fun

>Ich erinnere mich, wie Nyarlathotep in meine Stadt kam - die große, die alte, die schreckliche Stadt der ungezählten Verbrechen. Mein Freund hatte mir von ihm und der zwingenden Faszination und der Verlockung seiner Offenbarungen erzählt, und ich lechzte sehnsüchtig danach, seine größten Geheimnisse zu erkunden.<br/>
*-H.P. Lovecraft-*

### Hallo Weltherrschaft

Nun endlich meine Aspiranten der dunklen Künste wollen wir an's Werk schreiten, die Kreatur entfesseln und "Hallo" zu einer neuen, schrecklichen Welt sagen. Doch was wäre ein Plan, die Weltherrschaft an uns zu reissen, ohne eine okkulte, congeniale Weltformel, wie diese: 

![Weltformel des Bösen](/assets/images/posts/Die-Nacht-der-Tentakel/Formula.png)

Oh, aber ein Bild sagt mehr als tausend Zahlen. Schauet und staunet, wie sich ihre Schönheit offenbart, wenn wir uns die Mühe machen sie zu zeichnen. Kann man nicht geradezu sehen, wie sich die Tentakel längst vergessener Wesen aus dem Sumpf der Ewigkeit erheben? 

![Böse Schwingungen](/assets/images/posts/Die-Nacht-der-Tentakel/Graph.png)

In Programmcode gegossen sieht das ganze schon etwas nüchterner aus. Irgendwann muss ich mir mal einen Compiler bauen, der direkt meine Tafelbilder lesen und verarbeiten kann. Aber das ist wohl eher etwas für einen anderen Abend.

```Java
    private int f(int x) {
        BigDecimal bdx = BigDecimal.valueOf(x);
        return
          new BigDecimal("3882585.9999999999999999999999999999999999999999999428041500738804169558").add(
          new BigDecimal("-13924656.4417784999508650067271685255263125770596491290784190807657213985").multiply(bdx).add(
          new BigDecimal("21911753.7906848008661323700257934238607847764429053656464644755079084635").multiply(bdx.pow(2)).add(
          new BigDecimal("-20431557.1480175881632850584705648900385806312451289053940550122434691334").multiply(bdx.pow(3)).add(
          new BigDecimal("12805928.0712479169456490666407381631482967923977073778555199667826433437").multiply(bdx.pow(4)).add(
          new BigDecimal("-5786302.5736901255121124233486527331940740969069648297726896823031531123").multiply(bdx.pow(5)).add(
          new BigDecimal("1970216.8031444216891207010557219776710041951941180334365262054046968069").multiply(bdx.pow(6)).add(
          new BigDecimal("-521020.3150340978019731058690984224983833057515205145917489591281885714").multiply(bdx.pow(7)).add(
          new BigDecimal("109325.7790737148087029494871695537970278319092741952332626776990531654").multiply(bdx.pow(8)).add(
          new BigDecimal("-18485.7598691805509824970213292208757061364771115332626248471240648853").multiply(bdx.pow(9)).add(
          new BigDecimal("2547.0184654220933798685681331743871986306408635010038993327230203763").multiply(bdx.pow(10)).add(
          new BigDecimal("-288.1773474149205888338394317895171734649912752429376808632004400079").multiply(bdx.pow(11)).add(
          new BigDecimal("26.9044914545886665956306642266772671347520366813819955914903342987").multiply(bdx.pow(12)).add(
          new BigDecimal("-2.0772777563094335563971712716657757899095436729269752833151570127").multiply(bdx.pow(13)).add(
          new BigDecimal("0.1325915060575035453859797383214980706652272397912153505363193353").multiply(bdx.pow(14)).add(
          new BigDecimal("-0.0069748393881003940303026449830850603505344414053572995706673487").multiply(bdx.pow(15)).add(
          new BigDecimal("0.0003004706295151882787657262056075079226726716998545716723235452").multiply(bdx.pow(16)).add(
          new BigDecimal("-0.0000104910616768058352588255084232899227209708603912369093288079").multiply(bdx.pow(17)).add(
          new BigDecimal("2.922180839781618519039413323052704731302096173970639100287E-7").multiply(bdx.pow(18)).add(
          new BigDecimal("-6.3397953726983011360288370290985155427791914918707764810E-9").multiply(bdx.pow(19)).add(
          new BigDecimal("1.032371471693202930640509094026086701432776618319665065E-10").multiply(bdx.pow(20)).add(
          new BigDecimal("-1.1869163382463228067486665012744970394046918743865921E-12").multiply(bdx.pow(21)).add(
          new BigDecimal("8.5895958618189259318454021124897891143799198477536E-15").multiply(bdx.pow(22)).add(
          new BigDecimal("-2.94244742173568999517857600189463592362070872284E-17").multiply(bdx.pow(23)))))))))))))))))))))))))
          .setScale(0, RoundingMode.HALF_UP).intValue();
    }
```

<!-- #BOX#
Tatsächlich gibt es hier ein Problem mit frühen Java 1.8 Versionen. Spätere Versionen (z.B. 1.8.0_171) haben kein Problem mehr damit.
-->
<img align="left" src="/assets/images/posts/Die-Nacht-der-Tentakel/explanationBox010.png"/>

Verdammt, ich hätte nicht gedacht, dass meine Formel so böse ist. Bei dem Versuch sie zu kompilieren dachte ich zunächst mein Compiler wäre kaputt. Anscheinend blieb er während des Kompiliervorgangs einfach stehen. Nach etwas zehn Minuten meldete er sich dann doch noch. Äußerst skurril. Ich polier das Ding mal auf den neuesten Stand. Ah, da läuft's doch gleich wie geschmiert.

Nun aber endlich los. Sagen wir der Welt: "Hallo".

```Java
61    private void sayHello() {
62        int x = 1;
63        GOTO(f(x++));
64        System.out.print((char)(LINE()/2)); GOTO(f(x++));
65        System.out.print((char) LINE()); GOTO(f(x++));
66        System.out.print((char) LINE()); GOTO(f(x++));
67        System.out.print((char) LINE()); GOTO(f(x++));
68        System.out.print((char) LINE()); GOTO(f(x++));
69        System.out.print((char) LINE()); GOTO(f(x++));
70        System.out.print((char) LINE()); GOTO(f(x++));
71        System.out.print((char) LINE()); GOTO(f(x++));
72        System.out.print((char) LINE()); GOTO(f(x++));
73        System.out.print((char) LINE()); GOTO(f(x++));
74        System.out.print((char) LINE()); GOTO(f(x++));
75        System.out.print((char) LINE()); GOTO(f(x++));
76        System.out.print((char) LINE()); GOTO(f(x++));
77        System.out.print((char) LINE()); GOTO(f(x++));
78        System.out.print((char) LINE()); GOTO(f(x++));
79        System.out.print((char) LINE()); GOTO(f(x++));
80        System.out.print((char) LINE()); GOTO(f(x++));
81        System.out.print((char) LINE()); GOTO(f(x++));
82        System.out.print((char) LINE()); GOTO(f(x++));
83        System.out.print((char) LINE()); GOTO(f(x++));
84        System.out.print((char) LINE()); GOTO(f(x++));
85        System.out.print((char) LINE()); GOTO(f(x++));
86        System.out.print((char) LINE()); GOTO(f(x++));
87        System.out.print((char) LINE()); GOTO(f(x++));
88        System.out.print((char) LINE()); GOTO(f(x++));
89        System.out.print((char) LINE()); GOTO(f(x++));
90        System.out.print((char) LINE()); GOTO(f(x++));
91        System.out.print((char)(LINE()/9)); GOTO(f(x++));
92        return;
93    }
```

Na, was mag dieses kleine Stück Software wohl ausgeben?

### Die allwissende Müllhalde

Bevor ich mich den wahren Problemen der Menschheit widme, sollte ich meine Forschung noch pseudowissenschaftlich untermauern. Sehen wir uns also die Literatur zum Thema "Spaghetti-Code" an.

Die Allwissende Müllhalde, auch Wikipedia genannt, stellt drei Beispiele für Spaghetti-Code heraus. Diese sind ausnahmslos in BASIC verfasst. Damit mein Javacode diesem ähnlicher wird, füge ich die Methoden "PRINT", "INPUT" und "CLS" hinzu.

Abgetippt, kompiliert, getestet und ja, die folgenden drei Beispiele verhalten sich wie auf Wikipedia vorausgesagt. Ich würde sagen: "Mission accomplished".

#### Beispiel 1

```Java
19      private void spaghetti() {
20  /* 10*/ int i = 0;
21  /* 20*/ i = i + 1;
22  /* 30*/ PRINT(i + " squared = " + i * i);
23  /* 40*/ if (i >= 10) GOTO(25);
24  /* 50*/ GOTO(21);
25  /* 60*/ PRINT("Program Fully Completed.");
26  /* 70*/ return;
27      }
```

#### Beispiel 2

```Java
24      private void spaghetti() throws IOException {
25          int i, sel$;
26  /* 10*/ CLS();
27  /* 20*/ i = 0;
28  /* 30*/ i = i + 1;
29  /* 40*/ PRINT(i + " squared = " + i * i);
30  /* 50*/ if (i >= 10) GOTO(32);
31  /* 60*/ GOTO(28);
32  /* 70*/ PRINT("Program Fully Completed.");
33  /* 80*/ sel$ = INPUT("Do it Again (j): ");
34  /* 90*/ if (sel$ == 106) GOTO(26); // char 106 is 'j'
35  /*100*/ return;
36      }
```

#### Beispiel 3

```Java
22      private void spaghetti() {
23  /* 10*/ for (int ia = 1; ia <= 10; ia++) {
24  /* 20*/     if (ia == 5) {
25  /* 30*/         for (int ib = 1; ib <= 10; ib++) {
26  /* 40*/             PRINT("LOOP:" + ia + " SUB LOOP:" + ib);
27  /* 50*/             if (ib == 8) GOTO(30);
28  /* 60*/         }
29  /* 70*/     }
30  /* 80*/     PRINT("SUB LOOP:" + ia + " END");
31  /* 90*/ }
32  /*100*/ return;
33      }
```

### Richtig böse Späße

Die bisherigen Beispiele waren ja eher handzahm. Als nächstes möchte ich einmal wirklich böse Dinge ausprobieren. In dem folgenden Beispiel springe ich direkt in einen Schleifenblock und überspringe dabei eine Variablendeklaration. Dadurch kommt der interne Variablenstack durcheinander. Lustigerweise stört das die Programmausführung kaum, so dass ich tatsächlich unerwartete Ergebnisse erzielen konnte.

```Java
16    private void doBadThings() {
17        int j = 0;
18        GOTO(24);
19        do {
20            int x = 42;
21            PRINT("%d: %d", LINE(), ++x);
22        } while (j++ < 1);
23        GOTO(27);
24        int i = 666;
25        PRINT("%d: %d", LINE(), i);
26        GOTO(21);
27        PRINT("%d: %d", LINE(), i);
28    }
```

Hier seien noch einmal die Sprungvorgänge bildlich erläutert.

<img align="left" width="450px" alt="Gehupft wie gesprungen" src="/assets/images/posts/Die-Nacht-der-Tentakel/Code.png"/>

Die Ausführung des Programms führt zu folgender Ausgabe:

```Text
25: 666
21: 667
21: 43
27: 43
```

Diese wirkt auf den ersten Blick seltsam. Die erste Ausgabe aus Zeile 25 ist noch naheliegend. Die zweite aus Zeile 21 macht jedoch schon stutzig. Im Sourceode wird "++x" ausgegeben. Tatsächlich erscheint hier aber der Wert von "++i". Danach erscheint als dritte Ausgabe schließlich doch der Wert von "++x" aus Zeile 22. In der letzten Ausgabe aus Zeile 27 erscheint dann der Wert von "x" anstelle des im Sourcecodes angegebenen "i".

Was passiert hier wirklich?

```Text
17: Variable "j" vom Typ "int" wird mit Wert "0" auf Position 0 des Stacks gelegt
18: Sprung nach 24
24: Variable "i" vom Typ "int" wird mit Wert "666" auf Position 1 des Stacks gelegt 
25: Variable von Position 1 des Stacks wird ausgegeben (i)
26: Sprung nach 21
21: Variable von Position 1 des Stacks wird um eins erhöht und ausgegeben (++i)
22: Variable von Position 0 des Stacks wird um eins erhöht und erfolgreich verglichen, 
      anschließend Sprung nach 20
20: Variable "x" vom Typ "int" wird mit Wert "42" auf Position 2 des Stacks gelegt
21: Variable von Position 2 des Stacks wird um eins erhöht und ausgegeben (++x)
22: Variable von Position 0 des Stacks wird um eins erhöht und nicht erfolgreich verglichen, 
      anschließend weiter bei 23
23: Sprung nach 27
27: Variable von Position 2 des Stacks wird ausgegeben (x)
```

## Nacht VII - GOTO world domination

Aber nun hinfort mit den arkanen Theorien. Beschäftigen wir uns mit einem Problem, dass wohl jeder kennt, der seine Schergen in die Welt hinaus sendet um das Böse zu verbreiten: "Das Problem des reisenden Schergen", oder für unsere angloamerikanischen Freunde: "The traveling henchman problem".
Fassen wir das Problem kurz zusammen:

- Starte an einem beliebigen Ort
- Besuche alle Orte
- Besuche keinen Ort mehr als einmal

Zur Verdeutlichung und als Beispiel nehmen wir die folgenden Orte und Reiseverbindungen an.

![Schwärmt aus meine Kultisten](/assets/images/posts/Die-Nacht-der-Tentakel/HenchmenMap.png)

In diesem Kontext erscheint ein GOTO Statement ja geradezu als Domänen spezifische Sprache. Bilden wir also unsere Orte und möglichen Wege auf entsprechenden Programmcode ab.

```Java
    private void calculateRoutes() {
        locationCount = 5;
        
        GOTO(any.oneOf("Lissabon", "Paris", "London", "Rom", "Erlangen"));
        
        LABEL("Lissabon"); GOTO(any.oneOf("Paris"));
        LABEL("Paris"   ); GOTO(any.oneOf("Lissabon", "Rom", "Erlangen"));
        LABEL("London"  ); GOTO(any.oneOf("Lissabon", "Paris"));
        LABEL("Rom"     ); GOTO(any.oneOf("Paris", "London"));
        LABEL("Erlangen"); GOTO(any.oneOf("Lissabon", "London"));

        LABEL("FINISHED"); printValidRoutes();
    }
```

Unser Scherge läuft im wahrsten Sinne des Wortes durch den Programmcode. Näher an der Domäne kann man sich kaum bewegen. Hinzu kommt, dass die Implementierung dank "any.oneOf" nahezu nichtdeterministisch wirkt. Moment, "Was bitte ist 'any.oneOf'?", werdet ihr fragen. Ist P gleich NP? Habe ich den Nobelpreis gewonnen? Leider muss ich an dieser Stelle einräumen: "Mitnichten".

Ich gebe zu, hier ein klein wenig gemogelt zu haben. "any" ist eine Instanz des "NondeterministicProblemHelper". Dessen Methode "oneOf" liefert immer ein Element der möglichen Ergebnismenge für den nächsten Schritt zurück und wacht darüber, ob bereits ein valides Ergebnis erreicht wurde oder überhaupt noch erreicht werden kann. Ist das Ergebnis valide, wird es direkt der Liste der Ergebnisse hinzugefügt, so dass diese am Ende nur ausgegeben werden müssen.

Eine "echte" nicht deterministische Lösung hingegen würde das richtige Ergebnis einfach raten bzw. aufgrund zum Beispiel einer Quantenverschränkung wissen.

Schauen wir uns nun das Ergebnis an. Auf dass meine Schergen und Handlanger das Böse in meinem Sinne in die Welt tragen mögen.

```Text
Welcome evil master,

your sinister henchmen may travel one of the following routes:

Your henchman may travel from Erlangen via London, Lissabon and Paris to Rom.
Your henchman may travel from Erlangen via Lissabon, Paris and Rom to London.
Your henchman may travel from Rom via London, Paris and Erlangen to Lissabon.
Your henchman may travel from Rom via London, Lissabon and Paris to Erlangen.
Your henchman may travel from Rom via Paris, Erlangen and London to Lissabon.

I hope this satisfies your needs, your Evilness
```

## Epilog

Nun meine verwegenen Freunde des Wahnsinns welche unausprechlichen Manifestationen der großen Alten werde ich wohl als nächstes herauf beschwören?

Wie wäre es vielleicht mit etwas *Inline-Assembler*, Muhahahaha!!!

>Noch während er dies sagte, sprang er aus dem Kabinenfenster auf die Eisscholle, die nahe dem Schiff lag. Schon bald wurde er von den Wellen davon getragen und verschwand in der Dunkelheit.<br/>
*-Mary Shelley-*

One more thing ...

... sollte ich jemals einen Architekturreview eines eurer Projekte machen und auf ein GOTO Statement in eurem Java Code stoßen, werde ich persönlich eure Gedärme neu verdrahten.

In diesem Sinne

Frank Meyfarth
*(Software Architect, adesso AG)*

---
*Der Sourcecode ist auf [GitHub](https://github.com/FranknJava/TheNightOfTheTentacles) verfügbar.*

*Für weitere Späße siehe auch Prof. Volker Claus' Vortrag [GOING GOING GONE](https://microcontroller.com/New_ARM_C_Compiler_Statements_-_Jokes.htm)*

