---
layout: api
title: Validation Exception
permalink: /api/validation-exception/
section: api

source: src/error/Validation/index.js
description: |
 A validation exception would be used when the user has done something wrong, such as providing invalid data to a model
 or similar.  This may then return an HTTP 400 error to suggest a bad request.  This can be thought of as a collection
 of errors - if used on a model, there may be multiple reasons why the data is invalid.  This tells you about all of
 them.
extends:
    url: /api/exception/
    name: Exception
api:
    -
        type: method
        items:
            -
                name: addError(key, value, message[, additional])
                desc: |
                  Adds a new error to the collection.  The key is the data key, the value is whatever has tried to be
                  passed across, the message explains why it was incorrect.  The additional parameter is to be used if
                  anything else is required to let the developer understand the cause of the error.
            -
                name: getErrors()
                returns: array
                desc: |
                  Returns array of the errors that have been set using the `addError` method.
            -
                name: hasErrors()
                returns: boolean
                desc: |
                  Returns `true` if any errors have been set.  Otherwise, returns `false`.

---
