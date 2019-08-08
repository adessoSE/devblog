Wenn du einen Pull-Request stellst, teile uns bitte deine Änderungen mit, indem du die unten angegebene Publish-Checkliste nutzt. 

# Publish Checkliste

- **Meta** (abzuhaken durch den Autor)
  - [ ] [Artikeldatei am richtigen Ort abgelegt](https://github.com/adessoAG/devblog/blob/master/examples/2017-08-10-blog-post-guide.md#dateiname-und-ablageort)
  - [ ] [Autoreninfo gepflegt](https://github.com/adessoAG/devblog/blob/master/examples/2017-08-10-blog-post-guide.md#autoren-informationen)
  - [ ] [Metadaten gepflegt:](https://github.com/adessoAG/devblog/blob/master/examples/2017-08-10-blog-post-guide.md#metadaten)
    - [ ] "title" vergeben
    - [ ] "author" angegeben
    - [ ] "categories" enthält maximal eine der Hauptkategorien (Java, Microsoft, Methodik, Architekturen, Softwareentwicklung, Business & People)
    - [ ] "tags" enthält (beliebige) passende Tags
- **Text** (abzuhaken durch den Autor)
  - [ ] [Teaser entspricht den Vorgaben](https://github.com/adessoAG/devblog/blob/master/examples/2017-08-10-blog-post-guide.md#einleitung--teaser)
  - [ ] Rechtschreibung korrigiert
  - [ ] [Bilder sind korrekt in den Artikel eingebunden](https://github.com/adessoAG/devblog/blob/master/examples/2017-08-10-blog-post-guide.md#bilder)
  - [ ] [Überschriften entsprechen den Vorgaben](https://github.com/adessoAG/devblog/blob/master/examples/2017-08-10-blog-post-guide.md#%C3%9Cberschriften)
  - [ ] Code-Snippets wurden mit [Syntax Highlighting](https://github.com/adessoAG/devblog/blob/master/examples/2017-08-10-blog-post-guide.md#syntax-highlighting) versehen
  - [ ] Der Artikel wurde in der [Vorschau](https://github.com/adessoAG/devblog/blob/master/examples/2017-08-10-blog-post-guide.md#online-preview) geprüft 
- **Review** (abzuhaken durch den Reviewer)
  - [ ] Rechtschreibung korrigiert
  - [ ] Der Artikel wurde in der [Vorschau](https://github.com/adessoAG/devblog/blob/master/examples/2017-08-10-blog-post-guide.md#online-preview) geprüft 
  - [ ] CCO wurde über neuen Artikel informiert
  - [ ] Date-Angaben 
    - [ ] stimmen im Header und im Dateinamen überein
    - [ ] stehen auf dem heutigen Tag (aber in der Vergangenheit)
- **Execute jekyll2cms: Produce XML for the CMS at blog.adesso.de** <br>
    Important: This needs to be done AFTER MERGING your blogpost into the MASTER-branch of this project.
  - [ ] Head over to the [Jekyll2cms instructions](https://github.com/adessoAG/jekyll2cms/blob/master/README.md#1-only-using-jekyll2cms-for-blogpost-conversion), execute the insctructions and check if xml was successfully generated.
  - Extra tip for docker-pros, just execute ```docker run -d --name jekyll2cms smahler/jekyll2cms:1.0.5``` for a few minutes, stop it and you're done.
  -  Congrats - you've just converted Markdown to XML - just wait for the CMS to pick it up. (Takes about 1 hour minimum). If you need to make further changes, just change your Markdown-Postfile and execute jekyll2cms again  

