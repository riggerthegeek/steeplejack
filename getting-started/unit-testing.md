---
layout: docs
title: Unit Testing
permalink: /getting-started/unit-testing/
section: getting-started
---

steeplejack is entirely testing framework agnostic. Unit testing is probably the one thing that can take a good idea
and make it into a stable application.

In order to make testing easier, steeplejack comes with some helpers.  These are optional, but these are designed to
make your life easier. The thinking behind this is that you create a testable version of your app where you can retrieve
and stub modules in the dependency injector.

> The helper methods here are based upon how [AngularJS](https://docs.angularjs.org/guide/unit-testing) does it. As
> this is a server-side technology, you can decide against using these helper methods and just use `require()` to get
> to your scripts

The first thing to do is to create a test version of your application.  This is so that steeplejack knows where your
files are located and very close to what we created in `app.js` right at the start.

    var injector = steeplejack.test({
        config: {
            port: 3000
        },
        modules: [
            "!(routes)/**/*.js"
        ]
    });

> Some testing frameworks, such as [Mocha](http://mochajs.org/)'s `--require` flag, allow you to specify files that
> can load global variables for testing. It may be useful to use this to avoid declaring this command in each test file

Now that we have our injector function defined, we can access all the methods in the dependency injector.  And, because
we're in test mode, if we can to assign a module to it's name, we can wrap it in underscores (_).  Let's look at an
example.

    var $config;
    beforeEach(function () {

        injector(function (_$config_) {
            $config = _$config_;
        });

    });

    it("should ensure $config is an object", function () {
        expect($config).to.be.an("object");
    });

Let's recap what's happened here - we've taken the `$config` module out of the dependency injector by using `_$config_`
and then we've ensured it's an object (clearly, in a real test, we'd have a better test than this, but this is just an
illustration).

### Stubbing Modules

There will be times when you want to stub a module - perhaps when you're testing a
[Collection]({{ '/getting-started/models-and-collections' | prepend: site.baseurl }}), you'd want to ensure it
calls certain methods on the Model.  We can easily achieve this by passing an object with the relevant name in.

    var $collection,
        $model;
    beforeEach(function () {

        $model = sinon.spy();

        injector(function (_$collection_) {
            $collection = _$collection_;
        }, {
            "$model": function () {
                return $model;
            }
        });

    });

Inside the `$collection` in this example, it would have it's model set as `$model`.  However, by passing in a
[Sinon](http://sinonjs.org) spy, we have replaced the module that it's in the dependency injector so we can test what
it's doing with it.  You can put in as many items into this object as you want to define for this test.

<a href="{{ '/getting-started/config' | prepend: site.baseurl }}" class="prev_button">Config</a>
<a href="{{ '/getting-started/overview' | prepend: site.baseurl }}" class="next_button">Overview</a>
