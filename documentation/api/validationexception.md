---
layout: sidebar
title: ValidationException
docs: true
section: /api
action_buttons: false
module: core
source: https://github.com/steeplejack-js/core/blob/master/src/exception/validation/index.js
ioc: steeplejack-validation-exception
---

**Extends:** [Exception](../exception)

This is an error that can be recovered from.  Normally, this would be invalid input from the client or similar. 
Ultimately, this would return something like an HTTP 4xx error.

```javascript
const { ValidationException } = require('@steeplejack/core');

const err = new ValidationException('some message');
```

# Methods

## addError

Adds a new sub-error to this error object. This would be used, for instance, a model throws an error and you want to
provide further detail about an error, specifically the keys in the model that have failed validation.

### Syntax

```javascript
err.addError(key, value, message, [additional]);
```

### Parameters

**key**
  String. Refers to the key that is invalid.
  
**value**
  Any. The value that has failed validation
  
**message**
  String. The error message that tells why it's failed
  
**Additional**
  Any. Any further relevant detail. Optional. 

### Returns

`ValidationException` instance

---

## getErrors

Gets the errors contained in this object.

### Syntax

```javascript
err.getErrors();
```

### Parameters

_none_ 

### Returns

```typescript
interface ErrorDetail {
  message: string;
  value: any;
  additional?: any;
}[]
```

---

## hasErrors

Are there any errors set?

### Syntax

```javascript
err.hasErrors();
```

### Parameters

_none_ 

### Returns

_boolean_

---
