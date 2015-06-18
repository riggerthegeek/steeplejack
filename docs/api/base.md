---
layout: api
title: Base
permalink: /docs/api/base/
section: docs

description: |
extends:
    name: EventEmitter
    url: https://nodejs.org/api/events.html
api:
    -
        type: method
        items:
            -
                name: clone()
                desc: |
                    Creates a clone of the object.  This will create a new instance of the same object, with the same
                    data,prototypical and static methods.  The only thing that won't be the same is the instance.
    -
        type: static
        items:
            -
                name: create([argument1] [, argument2] [, ...])
                desc: |
                    This is a factory method that behaves identically to `new`. There is no advantage or disadvantage
                    to using this over `new`, but is purely a convenience.
            -
                name: datatypes
                desc: |
                    This is the data object in the [datautils](https://github.com/riggerthegeek/datautils-js#data)
                    package
            -
                name: extend([prototype] [, static])
                desc: |
                    Extends this object.  Both arguments are optional objects.  Anything sent to the `prototype` object
                    is attach to the object's prototype (ie, it's active once you've called `new`) and anything attached
                    to `static` is attached as static methods (ie, they can be called with `Class.staticMethod`.

                    If you add a `_construct` function to the `prototype`, this will be called when you instantiate the
                    class.
            -
                name: extendsConstructor(ChildClass [, ParentClass1] [, ParentClass2] [, ...])
                desc: |
                    Returns a `boolean` if the ChildClass extends any of the ParentClasses. This does not instantiate
                    any of the classes but looks in the `super_` parameter, so should be able to be used by both Node
                    and steeplejack classes.
            -
                name: validation
                desc: |
                    This is the validation object in the [datautils](https://github.com/riggerthegeek/datautils-js#validation)
                    package

---
