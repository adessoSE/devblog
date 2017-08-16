---
layout: [post, post-xml]
title:  "Testing prismjs Syntax-Highlighter"
date:   2017-07-28 10:00
modified_date: 2017-07-31
categories: [prismjs, blog tools]
tags: [syntax highlighter, css]
author: shahin
---
Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.

## This shows an example of using prismjs syntax highlighter

### Default

```none
var _self = (typeof window !== 'undefined')
	? window   // if in browser
	: (
		(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
		? self // if in worker
		: {}   // if in node js
	);
```

### Javascript
```javascript
var _self = (typeof window !== 'undefined')
	? window   // if in browser
	: (
		(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
		? self // if in worker
		: {}   // if in node js
	);
```

### YAML
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

### HTML
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
<title>Lorem Ipsum</title>
<link rel="stylesheet" href="style.css" />
<script src="prefixfree.min.js"></script>

<script>var _gaq = [['_setAccount', 'UA-33746269-1'], ['_trackPageview']];</script>
</head>
<body>
    <h1>The Lorem to the Ipsum</h1>
    <section>
        <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
    </section>
</body>
</html>
```

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