---
layout: sidebar
title: Routing
docs: true
section: /getting-started
order: 2
---

Now you've got the server running, you need to add some HTTP routes to deal with traffic. The routing is file-based 
routing. This means that the URL is generated from the location of the file in the routing directory. For example, to 
create an endpoint at `/hello/world`, you would create a folder called `/hello` and, in it, a file called `world.js`.

> There are actually a few ways you could create this. You could create a file called `hello.js` and an endpoint 
> `/world` in the file or directories `/hello/world` and a file called `index.js`. You should nest your routing files so
> they make the most sense to you.

### /src/routes/hello/world.js

```javascript
/* Define the HTTP routes */
exports.http = () => ({
  /* This route lives on /hello/world */
  '/': {
    /* Tell it to use the GET HTTP verb */
    get: () => ({
      hello: 'world'
    })
  }
});

/* Tell the dependency injector how to treat this file */
exports.inject = {
  route: {
    export: 'http',
    deps: []
  }
};
```

There's a lot going on here which we need to understand. There are two things being exported from this file:
- `inject`: This is used throughout Steeplejack. It tells Steeplejack how this file should be loaded and any
  dependencies that are required. For more information, see the [Dependency Injection](/docs/dependency-injection)
  section
- `http`: This is where HTTP routes are stored. This should return a function (any dependencies in `deps` will be loaded
  in here in the order they're specified) and returns an object. This object describes the endpoint and the HTTP verb.
  This is a [routing](/docs/routes) function, the result that is resolved being sent to the HTTP output.
