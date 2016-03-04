# Config

> A litmus test for whether an app has all config correctly factored out of the code is whether the codebase could be
> made open source at any moment, without compromising any credentials.
>
> [Twelve Factor App: Config](http://12factor.net/config)

The config is designed as a single source of truth. A good [Twelve Factor App](http://12factor.net/config) allows you to override
your configuration with environment variables. The same is true of a Steeplejack application. There are two ways of overriding
your config - environment variables and command line arguments.

Any overridden config is typecast into an appropriate data type.

# Environment Variables

To use environment variables, you need to add an `env` to your initial factory.

## /src/app.js

```javascript
let app = Steeplejack.app({
    config: require("./config.json"),
    env: require("./envvars.json"),
    modules: [
        "src/!(routes)/**/*.js"
    ],
    routesDir: "src/routes"
});
```

## /src/envvars.json

```json
{
  "server": {
    "name": "APP_SERVER_NAME",
    "port": "APP_SERVER_PORT"
  }
}
```

Notice how the `envvars.json` file is the same structure as the `config.json`.  The value in the object is the name of the
environment variable.

    APP_SERVER_PORT=8080 babel-node src/app

Now you'll be able view the application on [http://localhost:8080](http://localhost:8080)

# Command Line Arguments

The command line arguments require no set up.  By using dot notation, you can put anything you want in:

    babel-node src/app server.port=7777 hello.world=foobar dev production=false

This will make the config object look like this

```json
{
    "server": {
        "name": "steeplejack-example",
        "port": 7777
    },
    "hello": {
        "world": "foobar"
    },
    "dev": true,
    "production": false
}
```

Notice how `hello.world=foobar` created an object. If it receives no value, like `dev`, it will default to `true`.

# Order of precedence

If you have both an environment variable and a command line argument for the same config item, the application will use the command
line argument.

    APP_SERVER_PORT=8080 babel-node src/app server.port=7777

The server will be run on port 7777

**[PREVIOUS - Modules](modules.md)**
