---
layout: api
title: Collection
permalink: /api/collection/
section: api

source: src/library/Collection.js
description: |
    A collection is a series of Models put together so that they can be useful.

    To create a collection, you must specify the Model that you are using as a minimum.

        var MyCollection = steeplejack.Collection.extend({
            model: MyModel
        });

    Additional methods can be added in as usual

        var MyCollection = steeplejack.Collection.extend({
            model: MyModel,

            myMethod: function () {
                ...
            }
        }, {
            myStaticMethod: function () {
                ...
            }
        );

extends:
    url: /api/base/
    name: Base
api:
    -
        type: method
        items:
            -
                name: add (data)
                returns: this
                desc: Adds in the model to the collection
            -
                name: each(iterator[, thisArg])
                returns: object
                desc: Assigns `forEach` to `each`
            -
                name: eachRight(iterator[, thisArg])
                returns: object
                desc: Assigns `forEachRight` to `eachRight`
            -
                name: filter(props)
                returns: this
                desc: Anything that matches is removed from the collection.  This is the opposite of `where()`.
            -
                name: find(props)
                returns: object|null
                desc: |
                    Similar to the where method, except that this returns the first model that returns a match. This
                    may mean that there are additional things that would match.
            -
                name: findLast(props)
                returns: object|null
                desc: |
                    Opposite of find method.  This performs a reverse search on the collection, finding the last
                    matching model.
            -
                name: forEach(iterator[, thisArg])
                returns: this
                desc: |
                    This is fundamentally a copy of the [Lodash forEach](https://lodash.com/docs#forEach) method.  It
                    allows us to cycle through each model in the collection.
            -
                name: forEachRight(iterator[, thisArg])
                returns: this
                desc: Similar to forEach method, but does it in the opposite order
            -
                name: getAll()
                returns: array
                desc: Gets everything
            -
                name: getCount()
                returns: number
                desc: Counts the number of items in the collection
            -
                name: getKeys()
                returns: array
                desc: Gets the IDs of the models
            -
                name: get(id[, getUUID = false])
                returns: array|object|string|null
                desc: |
                    Gets the specific model from the collection.  If you pass in an array of IDs, it will return all
                    matching models.  If you specify the `getUUID` it will return the UUID key only
            -
                name: limit(limit[, offset = 0])
                returns: this
                desc: |
                    Limits in the same way as MySQL limits.  The first is the limit, which is the maximum number of
                    items we can keep.  The second is the offset, which is the number of items we pad.

                    On a collection with 5 items, limit(2, 2) will only keep the data at position 2 and 3, dropping
                    0, 1 and 4 out.
            -
                name: remove(model)
                returns: boolean|array
                desc: |
                    Removes the specific model or models from the collection.  You can pass in either a number, an
                    object, a string or an array of those things.
            -
                name: reset()
                returns: boolean
                desc: Resets the collection back to it's original (empty) setting
            -
                name: sort(fn)
                returns: this
                desc: |
                    Sort by the given sortation function.  This works in the same way as the
                    [Array.prototype.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) method
            -
                name: sortBy(params, order)
                returns: this
                desc: |
                    This sorts by a key (or keys) in the model. The params parameter can be either a string or an
                    object of strings.  The param object should specify the search key as the object key and then
                    either "ASC" or "DESC" as the value.

                    The order parameter is only set if the first argument is a string.  Like a SQL database, this
                    should be either "ASC" or "DESC".
            -
                name: toData()
                returns: array
                desc: Converts the whole collection into array of objects that are the result of `model.toData()`
            -
                name: toJSON()
                returns: array
                desc: Converts the whole collection into a JSON array.
            -
                name: validate()
                returns: boolean
                desc: |
                    Validates all the models in the collection.  The object throw is an object literal of errors from
                    each of the models.
            -
                name: where(props)
                returns: this
                desc: |
                    Performs a where query on the collection.  Removes anything that doesn't meet the criteria from
                    the collection.  This is the opposite of filter().
    -
        type: static
        items:
            -
                name: toModels(data)
                returns: object
                desc: |
                    Creates an instance of the collection object and populates it with the `model.toModel` method. This
                    can be used to convert a data store result into a collection of models.
---
