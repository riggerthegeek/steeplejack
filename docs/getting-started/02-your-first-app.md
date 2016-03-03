# Your First App

> This example is written in ES6. Steeplejack v2 allows your to write in any language that compiles to JavaScript.

Let's create a simple RESTful application using [Restify](http://restify.com).  Create a folder in your project called `/src` and in it
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

## src/app.js

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

Start up the server with `node src/app` and go to http://localhost:3000.  If it's running correctly, you ought to see:

```json
{
    "code": "ResourceNotFound",
    "message": "/ does not exist"
}
```

**[PREVIOUS - Installing](index.md)**
**[NEXT - Configuring routes](02-your-first-app.md)**
