# Validation

This is an error that should be thrown when a recoverable error has happened. Typically, this would be when a user has not provided the
correct data for a request. Unlike a [Fatal](./fatal.md) error, you may want to give the full reasons for the error as they ought to be able
to correct their payload.

Examples of this would be when a POST request doesn't have the correct HTTP body.

```javascript
import {ValidationException} from "steeplejack/exception/validation";
```

**Extends:** [Exception](./exception.md)

## Methods

### addError (key: string, value: any, message: string, additional: any = void 0) : ValidationException

Adds a new validation error. `key`, `value` and `message` are all required fields. The `additional` can be anything that is needed
to provided additional information, but it's sensible to use an object literal.

---

### getErrors () => Object

Gets all the errors that have been added using the `addError` method.

---

### hasErrors () => boolean

Have there been any errors added using the `addError` method?

---
