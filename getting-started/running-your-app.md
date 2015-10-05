---
layout: docs
title: Running Your App
permalink: /getting-started/running-your-app/
section: getting-started
---

Now we've got the model and collection done, we can look to start wrapping things up and getting a runnable app.

### Controller

Create a folder called `/controllers` and a file called `product.js`.  This would be where we call the databases and
push the data into a model or collection.  In this example, we're stubbing out the data and pushing it to a collection
of Product models.

This controller will be known as the `$productService` to the dependency injector.

    module.exports.__factory = function $productService (Products) {
        return {
            getProducts: function () {
                var arr = new Products([{
                    name: "product 1",
                    price: "24"
                }, {
                    name: "product 2",
                    price: "28.99"
                }]);

                return arr;
            }
        };
    };

> Due the way Promises work, we don't need to worry about return a callback.  Anything can be returned from this method
> and it'll work correctly - a value, a Promise (if connecting to a database) or even throw an error.

### Route

Now we're going to create a new route for products.  In the `/route` folder, create a file called `product.js` and add
this to it.

    module.exports = function ($outputHandler, $productService) {
        return {
            "/": {
                get: function (req, res) {
                    $outputHandler(function () {
                        return $productService.getProducts();
                    }, req, res);
                }
            }
        };
    };

That has registered a GET method on `/product` which calls the the object we just registered in the controller.

### App

Finally, we need to add in the module paths for steeplejack to load up.  In your `app.js`, you need to add in a `modules`
section to the factory method.

    steeplejack
        .app({
            config: {
                port: 3000
            },
            modules: [
                 "!(routes)/**/*.js"
            ],
            routeDir: "routes"
        });

> Like the `routeDir` path, the `modules` detect if it's an absolute path or a relative path - relative paths are
> prepended with the result of `process.cwd()`.

The modules accept an array.  As you can [glob](https://en.wikipedia.org/wiki/Glob_%28programming%29) these files, I'd
suggest doing something like this that requires as few entries as possible.  In this example, it includes every file
ending in `.js`, except those in the `routes` folder.  By writing a catch-all, you don't need to add to this every time
you add a new file.

### Running

Now you've got an application that is ready to run.  In your console, type

    node app.js

Now, when you got to [http://localhost:3000/product](http://localhost:3000/product) you should see the following

    [
        {
            "id": null,
            "name": "product 1",
            "price": 24
        },
        {
            "id": null,
            "name": "product 2",
            "price": 28.99
        }
    ]

Congratulations, you've got your first steeplejack app running.

<a href="{{ '/getting-started/models-and-collections' | prepend: site.baseurl }}" class="prev_button">Models and Collections</a>
<a href="{{ '/getting-started/config' | prepend: site.baseurl }}" class="next_button">Config</a>
