---
layout: default
title: Your First App
permalink: /docs/getting-started/your-first-app/
---

Creating a basic steeplejack app is simple.

    var steeplejack = require("steeplejack");
    var Restify = require("steeplejack-restify");

    steeplejack
        .app({
            config: {
                port: 3000
            }
        })
        .run(function ($config) {

            return new Restify({
                port: $config.port // Port 3000
            });

        })
        .on("start", function (config) {
            console.log("Server started on port " + config.port);
        });

Let's look at what's happening here.

1. First we require steeplejack and the HTTP strategy library (in this case, Restify).
2. Once we've done that, we create an application using the `steeplejack.app()` factory with a config object in.
3. Next, is the `run` phase where we configure how our server is going to work.  This function is processed by the
   Dependency Injector so you can get any item in here registered to the dependency injector; in this example, we just
   want the `$config`. See the [Dependency Injection]({{ '/docs/api/dependency-injection' | prepend: site.baseurl }})
   section for further information (eg, why it must be `$config` and not `config`) on this.
4. Finally, listen for when the server is running.  The `start` event receives the `config` object so you can output it.

If you go to your terminal and run `node app.js`, you should see:

{% highlight bash %}

    Server started on port 3000

{% endhighlight %}

Now, if you view [http://localhost:3000](http://localhost:3000) in a browser, you should see:

    {
        "code": "ResourceNotFound",
        "message": "/ does not exist"
    }

That means that you have a working server, but that it cannot find an endpoint to go to.  As we've not set any up yet,
this is correct and we've got our first server up an running.  The next job is to get some routes in there.

<a href="{{ '/docs/getting-started' | prepend: site.baseurl }}" class="prev_button">Installation</a>
<a href="{{ '/docs/getting-started/routing' | prepend: site.baseurl }}" class="next_button">Routing</a>
