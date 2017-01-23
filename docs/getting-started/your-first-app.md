# Your First App

> Steeplejack v2 allows you to write in any language that compiles to JavaScript.
>
> This example is written in ES6 and will require transpiling with [Babel](http://babeljs.io/docs/setup/#babel_cli). It will require
> the [ES2015](https://babeljs.io/docs/plugins/preset-es2015) preset and the
> [Legacy Transform Decorators](https://www.npmjs.com/package/babel-plugin-transform-decorators-legacy) plugin to be configured.

Let's create a simple RESTful application using [Restify](http://restify.com). Create a folder in your project called `/src` and in it
the following files.

## /src/config.json

```json
{
    "server": {
        "name": "steeplejack-example",
        "port": 3000
    }
}
```

## src/app.es6

```javascript
/* Import your dependencies */
import {Steeplejack} from "steeplejack";
import {Server} from "steeplejack/lib/server";
import {Restify} from "steeplejack-restify";

/* Create and configure the steeplejack app */
let app = Steeplejack.app({
    config: require("./config.json"),
    routesDir: "src/routes"
});

/* Configure the server strategy */
app.run($config => {

    /* Configure the Restify strategy */
    let restify = new Restify({
        name: $config.server.name
    });

    /* Create the server instance */
    let server = new Server($config.server, restify);

    /* Configure the server */
    server
        .bodyParser()
        .gzipResponse();

    return server;

});

/* Export the instance */
export {app};
```

Start up the server with `babel-node src/app` and go to [http://localhost:3000](http://localhost:3000). If it's running correctly, you ought
to see:

```json
{
    "code": "ResourceNotFound",
    "message": "/ does not exist"
}
```

**[PREVIOUS - Installation](index.md)**

**[NEXT - Routing](routing.md)**
