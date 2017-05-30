---
layout: sidebar
title: Router
docs: true
section: /api
action_buttons: false
module: steeplejack
source: https://github.com/steeplejack-js/steeplejack/blob/master/src/lib/router.js
ioc: steeplejack-router
---

**Extends:** [Base](../base)

This manages the loading and using of routes and sockets.

> This is the API definition. It's likely to be more useful to look at the [Routes](../../concepts/routes) concepts to
> understand how to work with this in Steeplejack.

```javascript
const Router = require('steeplejack/lib/router');

const router = new Router(routes, middleware);
```

# Methods

## addMiddleware

Adds common middleware functions to the routes 

### Syntax

```javascript
router.addMiddleware(middlewares);
```

### Parameters

```typescript
interface Middleware {
  (request: any, response: any, callback?: (err?: any) => void): Promise<any> | void;
}

interface Middlewares {
  [route: string]: Middleware[];
};
```

**middlewares**
  Middlewares. An object of the middleware functions to add. It can return a `Promise` or resolve the `callback`
  function. 

### Returns

_Router_

---

## addRoute

Adds in a new route to the instance.

### Syntax

```javascript
router.addRoute(route, [ parent = undefined ]);
```

### Parameters

**routes**
  Route. The nested route object. If it detects further objects, it will call this method again with the `parent` set.

### Returns

_Router_

---

# Static Methods

## discoverRoutes

This discovers the route files in the given route directory and then loads them up. It then returns an object of route
functions that can be used.

### Syntax

```javascript
Router.discoverRoutes(files);
```

### Parameters

```typescript
interface File {
  name: string;
  path: string;
}
```

**files**
  File[]. Array of the files. This is returned by the [getFileList](#getfilelist) method.

### Returns

_Object_

---

## getFileList

Finds all the files in the route directory that matches the glob. These are sorted alphabetically, with a file called
`index.*` put last to ensure no collisions in the routing. 

### Syntax

```javascript
Router.getFileList(routeDir, routeGlob);
```

### Parameters

**routeDir**
  String. The directory to look for routes.
  
**routeGlob**
  String. The glob to apply on that directory

### Returns

```typescript
interface File {
  name: string;
  path: string;
}[]
```

---

## parseModule

Parses the route/socket so that it returns a factory function and injector dependencies. If there is no factory function
registered, it returns `null`.

### Syntax

```javascript
Router.render(type, route);
```

### Parameters

**type**
  String. The type we're looking for. Currently, only `route` and `socket` are supported.

**route**
  Object. The contents of the file.

### Returns

```typescript
interface ParsedRoute {
  factory: Function;
  deps: string[];
  middleware: Function[];
}[];
```

---
