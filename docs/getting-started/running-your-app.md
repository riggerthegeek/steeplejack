---
layout: default
title: Running Your App
permalink: /docs/getting-started/running-your-app/
---

Now we've got the model and collection done, we can look to start wrapping things up and getting a runnable app.

### Controller

Create a folder called `/controllers` and a file called `product.js`.  This would be where we call the databases and
push the data into a model or collection.  In this example, we're stubbing out the data and pushing it to a collection
of Product models.

This controller will be known as the `$productService` to the dependency injector.

    module.exports.__factory = function $productService (Products) {
        return {
            getProducts: function (cb) {
                var arr = new Products([{
                    name: "product 1",
                    price: "24"
                }, {
                    name: "product 2",
                    price: "28.99"
                }]);

                cb(null, arr);
            }
        };
    };

### Route

Now we're going to create a new route for products.  In the `/route` folder, create a file called `product.js` and add
this to it.

    module.exports = function ($outputHandler, $productService) {
        return {
            "/": {
                get: function (req, res) {
                    $productService.getProducts(function (err, data) {
                        $outputHandler(err, data, req, res);
                    });
                }
            }
        };
    };

That has registered a GET method on `/product` which calls the the object we just registered in the controller.

### App

Finally, we need to add in the modules

<a href="{{ '/docs/getting-started/models-and-collections' | prepend: site.baseurl }}" class="prev_button">Models and Collections</a>
<a href="{{ '/docs/getting-started/config' | prepend: site.baseurl }}" class="next_button">Config</a>
