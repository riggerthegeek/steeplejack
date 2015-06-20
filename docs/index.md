---
layout: docs
title: Documentation
permalink: /docs/
section: docs
---

{% assign docs = site.data.docs | where: "id", "docs" %}

{% for doc in docs %}
{% for item in doc.items %}
 - [{{ item.name }}]({{ item.url | prepend: site.baseurl }})
{% endfor %}
{% endfor %}
