---
layout: default
title: Routing
permalink: /docs/getting-started/routing/
---

So far, you should have a simple app set up that returns an HTTP 404 error.  In order to get your application to return
something useful, you'll need to add some routes.  The routing in steeplejack is file-based. That means, there's
almost no boilerplate code for you to do - just add the files and you're away.

Let's go back to `app.js` and look at the `steeplejack.app()` method.  Currently, we're just specifying the config
parameter.

    steeplejack
        .app({
            config: {
                port: 3000
            }
        });

Add in a `routeDir` parameter to tell the application where to look for route files.

    steeplejack
        .app({
            config: {
                port: 3000
            },
            routeDir: "routes"
        });

Now create a directory called `routes` in your project and then a file called `hello.js` inside that directory.  Your
project will now look something like this.

{% highlight bash %}
    .
├── app.js
├── package.json
└── routes
    └── hello.js

{% endhighlight %}

In the `hello.js` file, write the following (we'll go through what's happening shortly):

    module.exports = function ($outputHandler) {
        return {
            "/:name": {
                get: function (req, res) {
                    $outputHandler(null, {
                        hello: req.params.name
                    }, req, res);
                }
            }
        };
    };

Now, start up your server and go to [http://localhost:3000/hello/world](http://localhost:3000/hello/world) and you
should see this:

    {
        "hello": "world"
    }

Anything you put in the '/world' section of the URL is what the app says hello to.

Let's look at how the routing works in detail.  The first thing to understand is that the file name is important.  This
file is called `hello.js` and our URL starts `/hello` because of the file name.  This also looks for directory names so,
if you wanted the route `/path/to/my/route`, then you could do that by creating `route.js` in directories `/path/to/my`.

> While we're on the subject, if you wanted an endpoint on `/` then you would need to call your file `index.js` - this
> is also true in directories (you could create directories `/path/to/my/route` and have an `index.js` file in there).

Now, looking at the file contents.  The function that's being sent to `module.exports` is processed by the
[Dependency Injector]({{ '/docs/api/dependency-injection' | prepend: site.baseurl }}) and `$outputHandler` is a helper function
steeplejack creates when you want to send the final output.

The keys of object we're returning represent the URL we want to build and follow the
[Express-style](http://expressjs.com/guide/routing.html) routing rules.  In our example, the use of `:name` means that
we assign any text in that part of the URL to a parameter called `name`.

Next comes the HTTP verb - in our case, we've used `get`, but you can use any of get/post/put/delete etc in there.  Then
it just becomes your normal function like you'd get in Express/Restify.  As with these libraries, you can pass in
either a single function or an array of functions.

A more detailed look at the router can be found in the [Router]({{ '/docs/api/router' | prepend: site.baseurl }}) section.
Now we have an understanding of the routing, we can start getting the app to do something interesting.

<a href="{{ '/docs/getting-started/your-first-app' | prepend: site.baseurl }}" class="prev_button">Your First App</a>
<a href="{{ '/docs/getting-started/models-and-collections' | prepend: site.baseurl }}" class="next_button">Models and Collections</a>
