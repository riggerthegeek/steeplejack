# Modules

The modules are where the main application logic will live. You have complete freedom as to how to structure your modules - a modular
structure is favoured as it's easier to spin these off into their own packages should you wish to reuse it.

```shell
src
├── modules
│   └── user
│       ├── collection
│       │   └── Users.js
│       ├── model
│       │   └── User.js
│       ├── store
│       │   └── user.js
│       └── service.js
├── resources
│   └── mongodb.js
├── routes
│   ├── hello
│   │   └── world.js
│   └── user
│       └── index.js
├── app.js
├── config.json
└── envvars.json
```

## Autoloading of files and dependency injection

To simplify your development and promote extreme testability, files in Steeplejack should be loaded automatically and your dependencies
reflectively loaded. This means you don't need to know the relative paths for files outside your module and means testing your files becomes
as easy as injecting a stubbed dependency.

To load your modules, you need to add a `modules` array to your initial factory. This accepts globbed paths.

```javascript
let app = Steeplejack.app({
    config: require("./config.json"),
    modules: [
        "src/!(routes)/**/*.js"
    ],
    routesDir: "src/routes"
});
```

**[PREVIOUS - Routing](03-routing.md)**

**[NEXT - Config](05-config.md)**
