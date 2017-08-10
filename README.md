# adesso AG devblog
This repository is the main place to write blog posts that are intended to be published on the adesso AG's blog [https://blog.adesso.de](https://blog.adesso.de).

# How it works
## Preparation
If this is your first time writing a blog post for the adesso AG blog site, first you need to add your author information within the [authors.yml](_data/authors.yml) file located in `_data/authors.yml`. This is required because Jekyll will take your author information from that file and use them when generating HTML files from the post files.

Please add your information accordingly to the end of the list inside authors.yml. Here is an example on how the author information should be formatted:

```
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
### Filename convention 
Post files are markdown files. Hence the file extension is *.markdown. The name of the post file mus start with the actual date (format: YYYY-MM-DD) followed by the title of the blog post. Each word should be separated by a dash '-'.

A valid filename looks like this: 2017-08-10-title-of-the-post.markdown

### Writing the blog post
All post files are markdown files and are located inside the `_posts` directory.

A typical post looks like this:
```
---
# layout is required. Don't change.
layout: [post, post-xml]
# title is required.
title:  "adesso AG Blog Post Example"
# date is required. If possible, also provide a time. e.g. 2017-08-10 10:25:00.
date:   2017-08-10 10:25:00 
# If you are modifying an existing post, provide a date for it.
modified_date:
# author must be your name used in the _data/authors.yml file.
author: jondoe
# Categories are written inside square brackets '[cat1, cat2]' and are separated by comma.
# add at least one category name.
categories: [Technologie]
# Tags are written inside square brackets '[cat1, cat2]' and are separated by comma.
# tags are optional, but help to narrow down the subject of the blog post
tags: [Digitalisierung, Banken]
---
## A Post Example

You’ll find this post in the `_posts` directory.

To add new posts, simply add a file in the `_posts` directory that follows the convention `YYYY-MM-DD-name-of-post.markdown` and includes the necessary front matter. Take a look at the source for this post to get an idea about how it works.
```

Everything in between the first and second `---` are part of the YAML Front Matter, and everything after the second `---` will be rendered with Markdown and show up as “Content.”

### Markdown Cheat Sheet
[Need help with Markdown? Click here.](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)

#### *More description coming soon...*
