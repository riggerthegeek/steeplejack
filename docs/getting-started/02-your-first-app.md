# Your First App

Let's create a simple RESTful application using [Restify](http://restify.com).  Create a folder in your project called `/src`

## /src/config.json

    {
        "server": {
            "name": "steeplejack-example",
            "port": 3000
        }
    }

## src/app.js

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

Start up the server with `node src/app` and go to http://localhost:3000.  If it's running correctly, you ought to see:

    {
        "code": "ResourceNotFound",
        "message": "/ does not exist"
    }

**[PREVIOUS - Installing](index.md)**
**[NEXT - Configuring routes](02-your-first-app.md)**
