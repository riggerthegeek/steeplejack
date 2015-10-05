---
layout: api
title: Base
permalink: /api/base/
section: api

source: src/library/Base.js
description: |
    This is the steeplejack Base object, which most other steeplejack classes extend.  This contains methods that are
    useful to all higher-level classes, just as extension and cloning.
extends:
    name: EventEmitter
    url: https://nodejs.org/api/events.html
api:
    -
        type: method
        items:
            -
                name: clone()
                returns: object
                desc: |
                    Creates a clone of the object.  This will create a new instance of the same object, with the same
                    data, prototypical and static methods.  The only thing that won't be the same is the instance.
    -
        type: static
        items:
            -
                name: create([argument1] [, argument2] [, ...])
                returns: object
                desc: |
                    This is a factory method that behaves identically to `new`. There is no advantage or disadvantage
                    to using this over `new`, but is purely a convenience method for people who prefer `.create()`.
            -
                name: datatypes
                returns: object
                desc: |
                    This exposes the methods from the `.data` section of the
                    [datautils](https://github.com/riggerthegeek/datautils-js#data)
                    package
            -
                name: extend([prototype] [, static])
                returns: function
                desc: |
                    Extends this object.  Both arguments are optional objects.  Anything sent to the `prototype` object
                    is attach to the object's prototype (ie, it's active once you've called `new`) and anything attached
                    to `static` is attached as static methods (ie, they can be called with `Class.staticMethod`.

                    If you add a `_construct` function to the `prototype`, this will be called when you instantiate the
                    class.  This can receive zero or more arguments.


                        var Child = Base.extend({
                            _construct: function (param1, param2) {
                                 this.param1 = param1;
                                 this.param2 = param2
                            },
                            getParam1: function () {
                                return this.param1;
                            }
                        }, {
                            staticMethod: function () {
                                return 'method';
                            }
                        });

                        var obj = new Child('param1', 'param2');

                        obj.getParam1(); // 'param1'

                        Child.staticMethod(); // 'method'

                    See [Inheritance Docs]({{ '/api/inheritance' | prepend: site.baseurl }}) for more details

                    Any method that begins with `_` is considered to be a private method and is hidden when you output
                    the object. However, it is still callable.

                        console.log(obj1); // object without '_private'

                        obj1._private(); // 'shhh'
            -
                name: extendsConstructor(ChildClass [, ParentClass1] [, ParentClass2] [, ...])
                returns: boolean
                desc: |
                    Returns a `boolean` if the ChildClass extends any of the ParentClasses. This does not instantiate
                    any of the classes but looks in the `super_` parameter, so should be able to be used by both Node
                    and steeplejack classes.

                        var Child = Base.extend();
                        var Grandchild = Child.extend();

                        Base.extendsConstructor(Child, Base); // true

                        Base.extendsConstructor(Child, function () { }, Base); // true

                        Base.extendsConstructor(Child, Child); // true

                        Base.extendsConstructor(Grandchild, require('events').EventEmitter); // true

                        Base.extendsConstructor(Base, Error); // false
            -
                name: validation
                returns: object
                desc: |
                    This exposes the methods from the `.validation` section of the
                    [datautils](https://github.com/riggerthegeek/datautils-js#validation)
                    package

---
