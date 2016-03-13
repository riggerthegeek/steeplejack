# Routing

Now you've got the server running, you need to add some HTTP routes to deal with traffic. The routing is file-based routing. This
means that the URL is generated from the location of the file in the routing directory. For example, to create an endpoint at
`/hello/world`, you would create a folder called `/hello` and, in it, a file called `world.js`.

> There are actually a few ways you could create this. You could create a file called `hello.js` and an endpoint `/world` in the file
> or directories `/hello/world` and a file called `index.js`. You should nest your routing files so they make the most sense to you.

## /src/routes/hello/world.js

```javascript
export let route = () => {
    return {
        "/": {
            get: (req, res) => {
                return {
                    hello: "world"
                };
            }
        }
    };
};
```

Right, there's a lot going on here which we need to understand. To specify an HTTP route, the file should export a function on
`exports.route`. This function returns an object of all the endpoints, in this case an HTTP GET on `/`.

Once we are at the HTTP verb, this is just an ordinary [Restify routing](http://restify.com/#routing) function. The only difference is
that, unlike in Restify, this is parsed as a [Promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise).
Whatever this function resolves is sent to the HTTP output, in this case `{"hello":"world"}`.

**[PREVIOUS - Your First App](your-first-app.md)**

**[NEXT - Modules](modules.md)**
