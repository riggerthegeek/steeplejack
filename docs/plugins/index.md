---
layout: docs
title: Plugins
permalink: /docs/plugins/
section: docs
---

{% assign docs = site.data.docs | where: "id", "plugins" %}

{% for doc in docs %}
{% for item in doc.items %}
 - [{{ item.name }}]({{ item.url | prepend: site.baseurl }})
{% endfor %}
{% endfor %}
