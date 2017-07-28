---
layout: post
title:  "Testing prismjs Syntax-Highlighter"
date:   2017-07-28 10:01:43 +0530
categories: prismjs
tags: [syntax highlighter]
---
## This shows an example of using prismjs syntax highlighter

### Default

```
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
### Java
```java
package de.adesso.persistence;

/**
 * This class creates a post object with the given fields.
 */
public class Post {

    /* The content of the post */
    private String content;

    /* The teaserHtml text of the post */
    private String teaserHtml;

    /* List of the images included in this post */
//    private List<Image> images;

    private PostMetaData postMetaData;

    public Post() {
    }

    /**
     * constructor
     * Creates also an MD5Hash hashing type.
     */
    public Post(String content) {
        this.content = content;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getTeaserHtml() {
        return teaserHtml;
    }

    public void setTeaserHtml(String teaserHtml) {
        this.teaserHtml = teaserHtml;
    }

/*    public List<Image> getImages() {
        return images;
    }

    public void setImages(List<Image> images) {
        this.images = images;
    }*/

    public PostMetaData getPostMetaData() {
        return postMetaData;
    }

    public void setPostMetaData(PostMetaData postMetaData) {
        this.postMetaData = postMetaData;
    }

    @Override
    public String toString() {
        return "Post{" +
                ", content='" + content + '\'' +
                ", teaserHtml='" + teaserHtml + '\'' +
                '}';
    }
}
```

### YAML
```yaml
layout: post
title:  "Testing prismjs Syntax-Highlighter"
date:   2017-07-28 22:01:43 +0530
categories: prismjs
tags: [syntax highlighter]
```

### HTML
```html
---
layout: default
---
<article class="post" itemscope itemtype="http://schema.org/BlogPosting">
  <div class="jumbotron">
    <div class="container">
      <h1 class="post-title-main" itemprop="name headline">{{ page.title }}</h1>
      <p class="post-meta"><time datetime="{{ page.date | date_to_xmlschema }}" itemprop="datePublished">{{ page.date | date: "%b %-d, %Y" }}</time>{% if page.author %} • <span itemprop="author" itemscope itemtype="http://schema.org/Person"><span itemprop="name">{{ page.author }}</span></span>{% endif %}</p>
      
    </div>

</div>


  <div class="post-content container" itemprop="articleBody">
    {{ content }}
  </div>

</article>

```