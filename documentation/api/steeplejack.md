---
layout: sidebar
title: Steeplejack
docs: true
section: /api
action_buttons: false
module: steeplejack
source: https://github.com/steeplejack-js/steeplejack/blob/master/src/steeplejack.js
---

**Extends:** [Base](../base)

Instantiates a new instance of Steeplejack.  All the parameters are optional, but you'll struggle to make
an application without them.  However, it's not Steeplejack's job to tell you how to build your application, merely
help you do so.

Ordinarily, you'd not activate this directly and should use the [Steeplejack.app()](#app) static method.  This gives you
the ability to configure your config object with command line arguments and environment variables.
 
```javascript
const Steeplejack = require('steeplejack');

const obj = new Steeplejack({ config, logger, modules, routesDir, routesGlob })
```

# Methods

## addModule

Takes a new module and loads it into the application. The modules can be relative to the application, an absolute path 
or an instance of [Plugin](../plugin). For paths, globbed paths are recommended.

### Syntax

```javascript
obj.addModule(module);
```

### Parameters

**module**
  String | { modules: string[] }. The module to add.

### Returns

_Steeplejack_

---

## createOutputHandler

Creates the output handler.  This is registered in the IoC as value of `Steeplejack.outputHandlerName`. It returns the 
handler so it can be used during the [run](#run) phase.

### Syntax

```javascript
obj.createOutputHandler(server);
```

### Parameters

**server**
  Server. Instance of the [Server](../server)

### Returns

_handler_

---

## run

Sets up the server and runs the application. Must receive a function which configures the server instance.

### Syntax

```javascript
obj.run(deps, factory);
```

### Parameters

**deps**
  String[]. Array of dependencies to get out of the IOC container.
  
**factory**
  Function. Factory method that is used to create the instance of the [Server](../server). Whatever this function
  returns is treated as the server instance.

### Returns

_Steeplejack_

---

# Static Methods

## app

This is a factory that creates an instance of the application. Although you can create without this, this method is the 
preferred starting point.
   
### Syntax

```javascript
const app = Steeplejack.app({ config, env, logger, modules, routesDir, routesGlob });
```

### Parameters

**config**
  Object. This is a JSON object that is treated as the single source of truth for all your config needs. Stick
  in here database connection parameters, logging config and anything else you may need. This will be assigned
  to `$config` in the IoC container.

**env**
  Object. Should be the same shape as the `config` object. This is key/value pairs of environment variables which are
  then parsed into the config object.

**logger**
  String. Name of the logger in the IoC container.

**modules**
  String. This is the location of the modules that will be loaded as part of the system.  It is strongly recommended
  that you used glob values in here, so that the adding and removal of plugins becomes as simple as adding in
  the files.

**routesDir**
  String. This is the location of the routes files. In here, you can configure your routes and this will all
  be loaded automatically. Like the modules, this should be a glob pattern.

**routesGlob**
  String. This is the glob to match route files. This should only be used if your files do not match '.js'. 

### Returns

_SocketRequest_

---
