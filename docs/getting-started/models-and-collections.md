---
layout: default
title: Models and Collections
permalink: /docs/getting-started/models-and-collections/
---

### What are models and collections?

A model can be thought of as a piece of information.  At it's simplest form, think of a product in a shop - it will
have a product id, a title, a price and other things.  Well, that is a data model.  One of the criticisms of JavaScript
as a language is that, being dynamically typed, you can end up in all sorts of problems.  The famous example being that
`2 == '2'` returns `true`.  When working with data, you want to ensure that all your data types are correct as well as
the values.  A steeplejack model solves this by enforcing a data type, [typecasting](http://en.wikipedia.org/wiki/Type_conversion)
where appropriate and using a default value where not.

> If the above example is news to you, please ensure that you always use triple equals so that it checks both the value
> and the data type.  `2 == '2'` might be `true`, but `2 === '2'` is `false`.  This makes your software more robust.
> [JSHint](http://jshint.com/docs/options/#eqeqeq) provides a good overview of this and a way of identifying places
> double equals are used.

Create a new directory in your app call `/models` and in it a file called `Product.js`.  In that file, write this:

    var steeplejack = require("steeplejack");

    module.exports.__factory = function Product () {

        return steeplejack.Model.extend({
            definition: {
                id: {
                    type: "string"
                },
                name: {
                    type: "string"
                },
                price: {
                    type: "float",
                    value: 0
                }
            }
        });

    };

Let's take a look at what's going on here, firstly the `steeplejack.Model.extend()` bit.  This is creating a new model
definition. This model has three parameters:

 - **id**: this is a string and the unique identifier for your product (most likely, provided by your database).  The
   default value is `null`.
 - **name**: another string with a default value of `null`. This would be the product name.
 - **price**. A floating point number with a value of `0`. Although JavaScript only has the `Number()` type, steeplejack
   is able to differentiate between integers and floats (in production software, be careful about using floating points
   like this as it can be inaccurate, but this is an example - try adding `0.1 + 0.2` if you don't believe me).

This is just scratching the surface. There's much more in the [Models]({{ '/docs/getting-started/routing' | prepend: site.baseurl }})
section.

Now let's go back and look at the way we've declared the function on the third line
`module.exports.__factory = function Product () { }`.  The `module.exports` bit should familiar to any NodeJS developer
as the way we export functions from a file.  The rest is all down to how the
[Dependency Injection]({{ '/docs/api/dependency-injection' | prepend: site.baseurl }}) in steeplejack works.  Put
simply, it takes away the need to `require` a file and traverse through directories to find it.

The API docs cover everything in that, but there are two things you need to know to understand

<a href="{{ '/docs/getting-started/routing' | prepend: site.baseurl }}" class="prev_button">Routing</a>
<a href="{{ '/docs/getting-started/models-and-collections' | prepend: site.baseurl }}" class="next_button">Modules</a>
