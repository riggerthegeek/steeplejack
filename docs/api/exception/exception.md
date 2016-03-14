# Exception

This is the main error object for the library. It is an extension of the JavaScript Error object. If you are still using ES5, this simplifies
prototypical inheritance with the `extend` static method.

This is an [abstract class](https://en.wikipedia.org/wiki/Abstract_type), meaning it cannot be instantiated directly - this only applies to
TypeScript applications, but still should be extended in all other versions of JavaScript.

```javascript
import {Exception} from "steeplejack/exception";
```

**Extends:** [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

## Methods

### constructor (message: any = null, ...args: any[]) => void

If an ES5 class, it calls the `__construct` method. As ES5 doesn't really have a constructor method, the `__construct` method is a method
which mimics the behaviour. All arguments that are received are sent through to the `__construct` method.

If the `message` is an instance of `Error` class then it uses it's `message` and `stack`. If not, then it will use the message string and
generate an error stack.

---

## Properties

### message => string

The human-readable description of the error message. Defaults to "UNKNOWN_ERROR".

---

### type => string

Allows a description of the type when extending this class. This is a required value.

---

## Static Methods

### extend (properties: Object, staticProperties: Object) => Function

This is a polyfill for ES5. Modern compiled JavaScript languages have a `class` sugar which simplifies extending. ES5 doesn't have this
feature so this is there to simplify it.  The first object is your prototypical methods, the second being your static methods. If you provide
a `__construct` object on your prototypical methods object, this will be called when the class is invoked.

---
