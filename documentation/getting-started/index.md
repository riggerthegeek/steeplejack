---
layout: sidebar
title: Installation
docs: true
section: /getting-started
order: 0
---

> This example app can be downloaded from [GitHub](https://github.com/steeplejack-js/example)

Create a new directory called `myapp`. In that directory, you’ll need to run the following commands:

 - Run `npm init` to set up your NodeJS project. Follow the prompts and this will also generate a package.json file for
   you. This example assumes that your main file is `app.js`.
 - Install the steeplejack dependencies:
    - `npm install steeplejack --save`
    - `npm install @steeplejack/restify restify --save` - this example uses the [Restify](http://restify.com) HTTP
      strategy

Now we have Steeplejack installed, let’s now look at creating your first app.
