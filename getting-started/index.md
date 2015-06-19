---
layout: docs
title: Installation
permalink: /getting-started/
section: getting-started
---

> This example app can be downloaded from [GitHub](https://github.com/riggerthegeek/steeplejack-example)

Create a new directory `myapp`. In that directory, you'll need to run the following commands:

- Run `npm init` to set up your NodeJS project. Follow the prompts and this will also generate a package.json file for
  you.  This example assumes that your main file is `app.js`.
- Install the steeplejack dependencies:
    - `npm install steeplejack --save`
    - `npm install steeplejack-restify --save`: this example uses Restify, but there are other
       [HTTP strategies]({{ '/plugins/http-strategies' | prepend: site.baseurl }}) available

That's all you need to create a basic steeplejack server.  Let's now look at creating your first app.

<a href="{{ '/getting-started/your-first-app' | prepend: site.baseurl }}" class="next_button">Your First App</a>
