---
layout: sidebar
title: Your First App
permalink: /getting-started/your-first-app
nav: /getting-started/
prev:
  name: Installation
next:
  name: Routing
  url: routing
---

> Steeplejack allows you to write in any language that compiles to JavaScript.
>
> These examples are written for NodeJS v6 - if you are using a different version of NodeJS you will need to compile
> using [Babel](http://babeljs.io/docs/setup/#babel_cli).

Let's create a simple RESTful application using [Restify](http://restify.com). Create a folder in your project called 
`/src` and in it the following files.

### /src/config.json

```json
{
  "server": {
    "name": "steeplejack-example",
    "port": 3000
  }
}
```

### /src/app.js

```javascript
/* Import your dependencies */
const Steeplejack = require('steeplejack');
const restify = require('@steeplejack/restify');

const config = require('./config.json');

/* Bootstrap the Steeplejack app */
const app = Steeplejack.app({
  config,
  modules: [
    `${__dirname}/!(node_modules|routes)/**/*.js`,
    restify
  ],
  routesDir: `${__dirname}/routes`
});

/* Load up the server with dependencies */
app.run([
  '$config',
  'steeplejack-server',
  'steeplejack-restify'
], (config, Server, { Restify }) => {
    /* Create Restify strategy */
    const restify = new Restify();
    
    /* Create instance of Server with config loaded */
    return new Server(config.server, restify);
});

exports.default = app;
```

Start up the server with `node src/app` and go to [localhost:3000](http://localhost:3000). If it's running correctly,
you ought to see a running server, with a 404 header:

```json
{
  "code": "ResourceNotFound",
  "message": "/ does not exist"
}
```

### A word on `modules`

In the `Steeplejack.app` factory, there is a modules array. This is where you tell Steeplejack where to look for files
to automatically load into the dependency injector. It can accept [globbed](https://en.wikipedia.org/wiki/Glob_(programming))
paths as well [Plugins](/docs/plugins).
