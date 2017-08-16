# adesso AG devblog
This repository is the main place to write blog posts that are intended to be published on the adesso AG's blog [https://blog.adesso.de](https://blog.adesso.de).

# How it works
We use Jekyll to transform blog posts written in Markdown syntax to specific XML files. These files are grabbed and processed by adessos CMS System and finally published on adessos blog. 

## What is Jekyll you ask? 
Jekyll says:

> Jekyll is a simple, blog-aware, static site generator. It takes a template directory containing raw text files in various formats, runs it through a converter (like Markdown) and our Liquid renderer, and spits out a complete, ready-to-publish static website suitable for serving with your favorite web server. [...]

([Jekyll](https://jekyllrb.com/docs/home/))

# Get started with blog posts for adesso AG
## Preparation
If this is your first time writing a blog post for the adesso AG blog site, first you need to add your author information within the [authors.yml](_data/authors.yml) file located in `_data/authors.yml`. This is required because Jekyll will take your author information from that file and use them when generating HTML files from the post files.

Please add your information accordingly to the end of the list inside authors.yml. Here is an example on how the author information should be formatted:

```yaml
johndoe:
  first_name: John
  last_name: Doe
  github_username: jondoe
  email: johndoe@email.com
  bio: "A short description/biography about the author."
  avatar_url: /assets/images/avatars/jondoe.png
  github: https://github.com/johndoe
```
To ensure the uniqueness of an authors name, we recommend using your github username as the root key name of the list (`johndoe:`). 

Also note that the indentations under `johndoe:` are important for Jekylls building process. The indentations are done with **two whitespaces** (press the space bar two times).

You may also add a profile picture inside the `assets/images/avatars` directory.

Required author data are: **first_name, last_name, github_username**

## Guidelines

### About Post Files
All post files are markdown files and are located inside the `_posts` directory.

#### Here is an example of a post:
```
---
# layout is required. DO NOT CHANGE.
layout: [post, post-xml]
# title is required. Add the title of your post.
title:  "adesso AG Blog Post Example"
# date is required. If possible, also provide a time. e.g. 2017-08-10 10:25.
date:   2017-08-10 10:25 
# If you are modifying an existing post, provide a date for it.
modified_date:
# author must be your name used in the _data/authors.yml file.
author: jondoe
# Categories are written inside square brackets '[cat1, cat2]' and are separated by commas.
# add at least one category name.
categories: [Technologie]
# Tags are written inside square brackets '[tag1, tag2]' and are separated by commas.
# tags are optional, but help to narrow down the subject of the blog post
tags: [Digitalisierung, Banken]
---
You’ll find this post in the `_posts` directory.

To add new posts, simply add a file in the `_posts` directory that follows the convention `YYYY-MM-DD-name-of-post.markdown` and includes the necessary front matter. Take a look at the source for this post to get an idea about how it works.
```

Everything in between the first and second `---` are part of the YAML Front Matter, and everything after the second `---` will be rendered with Markdown and show up as “Content.”

### Naming convention of post files 
Post files are markdown files. Hence the following file extensions are accepted: **markdown,mkdown,mkdn,mkd,md**. The name of the post file must start with the current date (format: **YYYY-MM-DD**) followed by the title of the blog post. Each word should be separated by a dash `-`.

A valid filename looks like this: **2017-08-10-title-of-the-post.markdown** or **2017-08-10-title-of-the-post.md**

### Writing a new blog post
#### The easy way

1. On the master branch of this repository, click on the `_posts` directory to get to the area where the post files are.
2. click on "Create new file". An Editor will show up where you can write your post.

![Create new file](/assets/images/how_to_write_a_post/01_create_new_file.PNG)

3. In the input field above the editor, provide a file name. **You must name your file according to the naming convention mentioned above.**

![Name your file](/assets/images/how_to_write_a_post/02_name_your_file.PNG)

4. Copy and paste the Front Matter from the post example above and replace the field values with your data.
   * You can also copy/paste the whole post example including the post content.

![Front Matter and post content](/assets/images/how_to_write_a_post/03_post_content.PNG)

5. Start writing your post content. Use the [markdown syntax (Link to CheatSheet)](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) to format your content. 

6. When you are done writing your post and want to publish it, you need to **create a pull request**.
   
   6.1 **Propose new file**

   To create a pull request, first you must "propose new file". For that, go to the bottom of the page. You will find an area with text fields for proposing a new file. Give a name and a description for the file (Or leave it as is. It will then take the default value as shown.) and click on the button **Propose new file**. 

   ![Propose new file](/assets/images/how_to_write_a_post/04_propose_new_file.PNG)

   6.2 **Create pull request** 

   Github will then direct you to a site for creating a "Pull Request". If you have not forked this project yet, Github will automatically fork this repository in your Github account and create a branch named like "patch-1" that contains your new file or your file changes.

   Then, you can click on the button "Create pull request". 

   ![Pull request](/assets/images/how_to_write_a_post/05_pull_request.PNG)

   An area with text fields will show up where you can add a message for the pull request. But you can leave the defaults as generated by Github. Click on the Button "Create pull request" to finish the request process.

   ![Pull request](/assets/images/how_to_write_a_post/06_open_pull_request.PNG)

   The admins of the devblog repository will get a message notifying that there are changes that need a review. After they have reviewed and accepted your changes, you can view your post shortly after on adessos blog site [https://blog.adesso.de](https://blog.adesso.de)

### Syntax Highlighting
adessos CMS uses `prismjs` for its syntax highlighting. Note that depending on which prismjs theme is used by the CMS, the output, that the below examples show, could look different.

    Inline `code` has `back-ticks around` it.

Inline `code` has `back-ticks around` it.



Code blocks are surrounded by a line of three back-ticks `````. The first three back-ticks are followed by the language name. If no language is indicated, use **none** as the language name.

#### Some code block examples

##### None (no highlighting)

    ```none
    var _self = (typeof window !== 'undefined')
      ? window   // if in browser
      : (
        (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
        ? self // if in worker
        : {}   // if in node js
      );
    ```

**Output:**

![language-none](/assets/images/how_to_write_a_post/syntax_highlighting/language-none.PNG)

##### Javascript

    ```javascript
    var _self = (typeof window !== 'undefined')
      ? window   // if in browser
      : (
        (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
        ? self // if in worker
        : {}   // if in node js
      );
    ```

**Output:**

![language-javascript](/assets/images/how_to_write_a_post/syntax_highlighting/language-javascript.PNG)

##### YAML

    ```yaml
    # An employee record
    name: John Doe
    job: Developer
    skill: Elite
    employed: True
    foods:
        - Apple
        - Orange
        - Strawberry
        - Mango
    languages:
        java: Elite
        python: Elite
        pascal: Lame
    ```

**Output:**

![language-yaml](/assets/images/how_to_write_a_post/syntax_highlighting/language-yaml.PNG)

##### HTML

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>

    <script>
        // Just a lil’ script to show off that inline JS gets highlighted
        window.console && console.log('foo');
    </script>
    <meta charset="utf-8" />
    <link rel="shortcut icon" href="favicon.png" />
    <title>Prism</title>
    <link rel="stylesheet" href="style.css" />
    <link rel="stylesheet" href="themes/prism.css" data-noprefix />
    <script src="prefixfree.min.js"></script>

    <script>var _gaq = [['_setAccount', 'UA-33746269-1'], ['_trackPageview']];</script>
    <script src="https://www.google-analytics.com/ga.js" async></script>
    </head>
    <body>
    <h1>Lorem to the Ipsum</h1>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur tempus tempor turpis, in hendrerit arcu gravida a. Morbi fringilla porttitor sem, ac fermentum est elementum ac. In mollis libero et nisl placerat, quis tempus leo eleifend. Duis quis scelerisque nibh. Nulla in elementum urna, nec hendrerit leo. Donec ac sem risus. Donec venenatis magna nec orci iaculis vehicula. Nullam a magna nisl.</p>
    </body>
    </html>
    ```

**Output:**

![language-html](/assets/images/how_to_write_a_post/syntax_highlighting/language-html.PNG)

### Adding Line Numbers
If you also want to show line numbers, you can add `{: .line-numbers}` after the second back-ticks ` ``` ` in a new line, as shown below:

### Javascript *with line numbers*
    ```javascript
    var _self = (typeof window !== 'undefined')
      ? window   // if in browser
      : (
        (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
        ? self // if in worker
        : {}   // if in node js
      );
    ```
    {: .line-numbers}

**Output:**

![line-numbers](/assets/images/how_to_write_a_post/syntax_highlighting/line-numbers.PNG)

#### Markdown CheatSheet
[Need help with Markdown? Click here.](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)
