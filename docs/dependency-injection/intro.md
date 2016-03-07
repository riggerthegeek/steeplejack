# Dependency Injection

## What is dependency injection?

Dependency injection is a software design pattern that allows dependencies to be resolved automatically from the module that is consuming
them.

For more on dependency injection, read the [Wikipedia article](https://en.wikipedia.org/wiki/Dependency_injection).

## Why do we want to use dependency injection?

 - It makes your code really easily testable. If you're testing a database query, your unit tests can use stubbed data to test how your
 modules should behave when it finds some data, no data or has a connection error.
 - It encourages loose-coupling between your modules, only relying upon abstracted interfaces rather than concrete implementations.
 - As modules are automatically loaded, there is very little boilerplate.
 - It encourages code reuse. Rather than writing the same things in each application, you can spin reusable modules into external
 [Plugins](../plugins/intro.md) for use across multiple applications.

## How to register modules

First, tell the `Steeplejack.app` factory where to find your modules.

```javascript
let app = Steeplejack.app({
    modules: [
        "path/to/modules/**/*.js"
    ]
});
```

Now you've done that, you just need to define how to register your module. There are three different ways of doing this (the Class and
Factory Injector do the same job - use the Class injector if you can and these shouldn't be mixed).

 - [Class Injector](class-injector.md)
    - [Factory Injector](factory-injector.md)
 - [Singleton Injector](singleton-injector.md)
 - [Config Injector](config-injector.md)

That's it. Simple eh?

## Automatically registered depdendencies

These dependencies are always registered:

 - `$config`: this is the main config object which is resolved from the environment variable and command line arguments.
 - `$output`: the is the function that you can use to output to the web. This is defined in [Server.outputHandler](../api/lib/server.md)
