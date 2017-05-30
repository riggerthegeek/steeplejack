---
layout: sidebar
title: Server
docs: true
section: /api
action_buttons: false
module: steeplejack
source: https://github.com/steeplejack-js/steeplejack/blob/master/src/lib/server.js
ioc: steeplejack-server
---

**Extends:** [Base](../base)

This is a strategy pattern for managing a server, it's routes and sockets.

```javascript
const Server = require('steeplejack/lib/server');

const obj = new Server(options, serverStrategy, socketStrategy);
```

# Server Strategy

Defines how the server is created. The interface is...

```typescript
interface ServerStrategy {
  addRoute(httpMethod: string, route: string, iterator: (request: any, response: any) => Promise<any>): void;
  close(): ServerStrategy;
  getRawServer(): http.Server;
  getServer(): any;
  outputHandler(statusCode: number, output: string, request, any, response: any): void;
  start(port: number, hostname?: string, backlog?: number): Promise<any>;
  uncaughtException(iterator: (request: any, response: any, err: any) => void): ServerStrategy;
  use(request: any, response: any, callback?: (err: any) => void): Promise<any> | void;
}
```

# Socket Strategy

Defines how the sockets work. This is optional - if you just want HTTP endpoints, there is no need to configure a 
socket. See [Socket](../socket) for details of the interface.

# Methods

## addRoute

Adds a single route to the stack. Accepts either a function or an array of functions - it always converts this to an
array of functions. 

### Syntax

```javascript
obj.addRoute(httpMethod, route, fn);
```

### Parameters

**httpMethod**
  String. The HTTP method - must be `all` or one of the methods returned from 
  [allowableHTTPMethods](#allowableHTTPMethods).

**route**
  String. The HTTP route to apply this to.
  
**fn**
  Function|Function[]. The functions to be invoked when this route is called.


### Returns

_Server_

---

## addRoutes

Takes the route object and adds to the server instance.

### Syntax

```javascript
obj.addRoutes(routes);
```

### Parameters

```typescript
interface Routes {
  [route: string]: {
    [method: string]: Function | Function [];
  };
};
```

**routes**
  Routes. This object is nested, the first level being the route, the second being the method and the value being the
  function.

### Returns

_Server_

---

## addSockets

Adds namespaces and events to the socket instance. If there's no socket server configured, it won't add anything.

### Syntax

```javascript
obj.addSockets(sockets);
```

### Parameters

```typescript
interface Sockets {
  [namespace: string]: {
    [event: string]: Function;
  }
}
```

**sockets**
  Sockets. The object is nested, the first level being the namespaces, the second being the event and the value being
  the function.

### Returns

_Server_

---

## after

The function is run after the route/socket function is invoked.

### Syntax

```javascript
obj.after(...args);
```

### Parameters

**...args**
  Any[]. Same as [use](#use).  
  
### Returns

_Server_

---

## close

Closes the server.

### Syntax

```javascript
obj.close();
```

### Parameters

_none_

### Returns

_Server_

---

## getServer

Gets the server instance from the strategy.

### Syntax

```javascript
obj.getServer();
```

### Parameters

_none_

### Returns

_Object_

---

## outputHandler

Handles the output, dispatching to the strategy so it displays the output correctly. This invokes the given function as 
a Promise and then handles what it returns. This is how the router should start going to the application tier and 
beyond.

### Syntax

```javascript
obj.outputHandler(request, response, iterator, [ logError = true ]);
```

### Parameters

**request**
  Object. This is the request object that the strategy generates.
  
**response**
  Object. This is the response object that the strategy generates.
  
**iterator**
  Function. The route function. This is wrapped in a `new Promise()` so will always as be resolved a promise.
  
**logError**
  Boolean. If we encounter an error, do we want to log that error. Defaults to `true`.

### Returns

_Promise_

---

## preSend

Similar to .use and .after, this is a hook that is called immediately before the data is sent. This is only run when 
there is a successful (2xx) response and is designed for inspecting the data object so HTTP caching can be configured.

### Syntax

```javascript
obj.preSend(iterator);
```

### Parameters

**iterator**
  Function. The function to call.
  
### Returns

_Server_

---

## routeFactory

Adds the route to the strategy and configures the output ready for use by the output handler. The tasks are run in 
order, not resolving any future ones if a previous one has failed.

### Syntax

```javascript
obj.routeFactory(request, response, tasks);
```

### Parameters

**request**
  Object. This is the request object that the strategy generates.
  
**response**
  Object. This is the response object that the strategy generates.
  
**tasks**
  Function[]. The list of functions to invoke. If the function receives 3 arguments, the third argument is expected to
  be a callback that will be resolved. Otherwise, it is treated as a promise.
  
### Returns

_Promise_

---

## start

Starts up the server, returning a promise.

### Syntax

```javascript
obj.start();
```

### Parameters

_none_
  
### Returns

_Promise_

---

## uncaughtException

Listens for uncaught exceptions. The listener receives three parameters: request, response and the errors itself.

### Syntax

```javascript
obj.uncaughtException(fn);
```

### Parameters

**fn**
  Function.

### Returns

_Server_

---

## use

Allows you to apply anything to the call. Although this will usually be a function or an array of functions, there are
no restrictions on the input.

### Syntax

```javascript
obj.use(...args);
```

### Parameters

**...args**
  Any*.

### Returns

_Server_

---

# Static Methods

## allowableHTTPMethods

The HTTP methods that can be called. There is a special 'all' type which, if called, will specify all of these methods.

### Syntax

```javascript
Server.allowableHTTPMethods();
```

### Parameters

_none_

### Returns

_String[]_

---

## parseData

Parses the data output. What it does depends upon the data sent in:
  - **Number >= 100 and < 600:** Sets the `statusCode` to that number
  - **Object with a `getData()` function:** Sets the `output` to what the `getData()` returns
  - **Set as `end`:** Sets `end` to `true`
  - **Anything else:** Sets this to the `output`

### Syntax

```javascript
Server.parseData(data);
```

### Parameters

**data**
  Any.

### Returns

```typescript
interface ParsedData {
  end: boolean;
  statusCode: Number;
  output: any;
}
```

---

## parseError

Parses the error output. What it does depends upon the data sent in:
  - **Number >= 100 and < 600:** Sets the `statusCode` to that number
  - **Object with a `hasErrors()` function**. Sets the `output` to `{ code: string; message: string; error?: any }`
  - **Object with `getHttpCode()` and `getDetail()` functions:** Sets status code to HTTP code and output to the detail
  - **Anything else:** Throw an error and let it be handled as an uncaught exception

### Syntax

```javascript
Server.parseError(err);
```

### Parameters

**data**
  Any.

### Returns

```typescript
interface ParsedError {
  statusCode: Number;
  output: any;
}
```

---
