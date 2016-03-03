# Routing

Now you've got the server running, you need to add some HTTP routes to deal with traffic.  The routing is file-based routing. This
means that the URL is generated from the location of the file in the routing directory.  For example, to create an endpoint at
`/hello/world`, you would create a folder called `/hello` and, in it, a file called `world.js`.

> There are actually a few ways you could create this.  You could create a file called `hello.js` and an endpoint `/world` in the file
> or directories `/hello/world` and a file called `index.js`. You should nest your routing files so they make the most sense to you.
