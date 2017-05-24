---
layout: sidebar
title: Docs
docs: true
section: /docs
order: 0
---

{% for page in site.pages %}

{% if page.docs %}
1. {{ page.title }} {{ page.path }} {{ page.twat }}
{% endif %}

{% endfor %}
