---
layout: api
title: Exception
permalink: /api/exception/
section: api

source: src/error/Exception.js
description: |
 This extends the native Error class.  This can be thought of as an abstract class which should be extended rather than
 one that can instantiated itself.

 In order to extend it yourself, you __MUST__ set the `type`.  This is a constant that allows you to know what error
 type it is.
extends:
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
    name: Error
api:
    -
        type: method
        items:
            -
                name: _construct([message])
                desc: |
                 Sets the error message.  If no message is set, it defaults to "UNKNOWN_ERROR" although this should be
                 considered bad practice.
    -
        type: static
        items:
            -
                name: extend([prototype] [, static])
                desc: |
                 This allows you to extend the `Exception` using `.extend`  This works in exactly the same was as the
                 [`Base.extend`](/api/base#static_extend([prototype] [, static])) method
---
