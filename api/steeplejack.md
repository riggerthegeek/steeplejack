---
layout: api
title: steeplejack
permalink: /api/steeplejack/
section: api

source: src/steeplejack.js
description: |
extends:
api:
    -
        type: method
        items:
            -
                name: _construct([config][, modules][, routeDir])
                desc: |
                    Instantiates a new instance of steeplejack.  All the parameters are optional, but you'll struggle
                    to make an application without them.  However, it's not steeplejack's job to tell you how to build
                    your application, merely help you do so.

                    Ordinarily, you'd not activate this directly and should use the steeplejack.app() static method.
                    This gives you the ability to configure your config object with command line arguments and
                    environment variables.

                    **config** - this is a JSON object that is treated as the single source of truth for all your
                    config needs.  Stick in here database connection parameters, logging config and anything else you
                    may need.  This will be assigned to `$config` in the IOC container

                    **modules** - this is the location of the modules that will be loaded as part of the system.  It is
                    strongly recommended that you used glob values in here, so that the adding and removal of plugins
                    becomes as simple as adding in the files.

                    **routeDir** - this is the location of the routes file.  In here, you can configure your routes
                    and this will all be loaded automatically.
            -
                name: addModule(module)
                desc: |
                    Takes an array of modules (or a single module) and loads it to the application.  The modules should
                    be in a relative path to the application.

                    It also accepts globbed paths.
            -
                name: createOutputHandler(server)
                returns: function
                desc: |
                    Creates the output handler.  This is available publicly in case a user wishes to register it at a
                    different point during the run phase.
            -
                name: getInjector()
                returns: object
                desc: Returns the instance of the injector
            -
                name: getModules()
                returns: array
                desc: Get the modules registered
            -
                name: registerConfig(module, modulePath)
                returns: this
                desc: This is to register config modules
            -
                name: registerConstant(module)
                returns: this
                desc: |
                    This registers whatever is sent as to the IOC controller.  Although it can be used for any  data
                    type, it is designed to be used for app-wide configuration parameters.

                    It is certainly not designed with using to store functions (although it will work, you should use
                    either the factory or the singleton for that).
            -
                name: registerFactory(module, modulePath)
                returns: this
                desc: |
                    Registers a factory method to the application. A factory is a function.  This is where you would
                    store a "class" that is instantiated later on.

                    Models and collections would typically be stored inside a factory as they create something (an
                    instance of the class) when they are called.
            -
                name: registerModules()
                returns: this
                desc: |
                    Takes the modules registered to the application and  calls the register module function on each.
            -
                name: registerSingleton(module, modulePath)
                returns: this
                desc: |
                    Registers a singleton method to the application. A singleton will typically be something that has
                    already been instantiated or it may be just a JSON object.
            -
                name: run(server)
                returns: this
                desc: Sets up the server and runs the application
            -
                name: setRoutes(routes)
                returns: this
                desc: Sets the routes to use
    -
        type: static
        items:
            -
                name: app(options)
                returns: object
                desc: |
                 Hello
            -
                name: Base
                returns: function
                desc: |
                 The [Base](/api/base) module
            -
                name: Collection
                returns: function
                desc: |
                 The [Collection](/api/collection) module
            -
                name: Exceptions
                returns: object
                desc: |
                 Returns an object with the three [Exception](/api/exception) modules
            -
                name: Injector
                returns: function
                desc: |
                 The [Injector](/api/injector) module
            -
                name: Logger
                returns: function
                desc: |
                 The [Logger](/api/logger) module
            -
                name: Router
                returns: function
                desc: |
                 The [Router](/api/router) module
            -
                name: Server
                returns: function
                desc: |
                 The [Server](/api/server) module
            -
                name: test(options)
                returns: function
                desc: |
                 Hello
---
