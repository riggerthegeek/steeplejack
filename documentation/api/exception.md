---
layout: sidebar
title: Exception
docs: true
section: /api
action_buttons: false
module: core
source: https://github.com/steeplejack-js/core/blob/master/src/exception/index.js
ioc: steeplejack-exception
---

**Extends:** [Error](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Error)

This is the main error object for the library. It is an extension of the global Error object and can be extended 
infinitely. This is an abstract class and can't be instantiated directly - it must be extended.

The Error class is difficult to extend so it's written in native JS so we can control how it's extended. It's written
in ES5-friendly code to maximise compatibility.

You will need to define a `type`. This helps you understand the error type when debugging it.

```javascript
const { Exception } = require('@steeplejack/core');

class ChildException extends Exception {
    get type () {
        return 'TYPE';
    }
}

const err = new ChildException();
```

# Methods

## getDetail

Decides what to display if this error bubbles-up to the surface

### Syntax

```javascript
const detail = err.getDetail()
```

### Parameters

_none_

### Returns

```typescript
interface ErrorDetail {
 type: string;
 message: string;
}
```

---


## getHttpCode

This is the HTTP status code if this error bubbles-up to the output.

### Syntax

```javascript
const code = err.getHttpCode()
```

### Parameters

_none_

### Returns

Number

---
