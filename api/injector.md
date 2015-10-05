---
layout: api
title: Injector
permalink: /api/injector/
section: api

source: src/library/Injector.js
description: |
 This manages the dependency injection.  The idea of dependency injection is so that, once set up, the developer doesn't
 need to concern themselves with getting the modules required.  It also means that testing is easier as you can passed
 an entirely stubbed version of the module that does what you need.
extends:
    url: /api/base/
    name: Base
api:
    -
        type: method
        items:
            -
                name: getComponent(name)
                returns: mixed
                desc: |
                 Gets the component by name. If it doesn't exist in the registry, it returns `null`.
            -
                name: getDependencies(arr)
                returns: mixed
                desc: |
                 Iterates over an array of dependencies and resolves them. Will throw an error if it doesn't exist.
            -
                name: process(target[, thisArg = null][, test = false])
                returns: object
                desc: |
                 Reflectively determine the targets dependencies and  instantiate an instance of the target with all
                 dependencies injected.

                 If it's a test, it allows modules to be specified with an underscore at the start and end.
            -
                name: register(name, constructor)
                returns: this
                desc: |
                 Register a component to be managed by the injector. Anything that returns a constructor function is a
                 valid component. Attempting to register the same component multiple times will throw an error.
            -
                name: registerSingleton(name, instance)
                returns: this
                desc: |
                 Register a singleton to be managed by the injector. Anything anything can be a single element - both
                 scalar and non-scalar values. Attempting to register the same name multiple times will throw an error.
            -
                name: replace(name, component)
                returns: this
                desc: |
                 This allows a module to be replaced with another module. It will be re-registered with the same
                 register function as what it was originally registered with.

                 This should only be used during unit testing as can cause issues for modules dependent upon what
                 you're replacing.
            -
                name: remove(name)
                returns: this
                desc: |
                 Removes a component from the lists of components
    -
        type: static
        items:
            -
                name: Parser(input[, prefix = null][, suffix = null][, flatten = true])
                returns: object
                desc: |
                 This parses an object of data into a format so we can put into the injector.  It allows a prefix and
                 suffix so we can ensure no name-clashes.  The flatten option is there so you can avoid flattening the
                 data - useful if you have an object of instances (with attached methods) rather than an object of
                 constructors functions.
---
