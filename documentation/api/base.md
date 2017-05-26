---
layout: sidebar
title: Base
docs: true
section: /api
action_buttons: false
module: core
source: https://github.com/steeplejack-js/core/blob/master/src/lib/base.js
ioc: steeplejack-base
---

**Extends:** [EventEmitter](https://nodejs.org/api/events.html)

The Base class exists to provide a consistent foundation for Steeplejack. All Steeplejack classes extend this method 

```javascript
const { Base } = require('@steeplejack/core');

const obj = new Base();
```

# Methods

## clone

Clones the instance of the object, returning a new instance of this object but with the same values.

### Syntax

```javascript
const clone = obj.clone()
```

### Parameters

_none_

### Returns

Base object. All the values will be the same as `obj` but it will not be identical (ie, `==` would be `true`, but
`===` would be `false`).

---

# Static Properties

## datatypes

Returns the data parameter from the [datautils](https://github.com/riggerthegeek/datautils-js) package

### Syntax

```javascript
const data = Base.datatypes;
```

### Parameters

_none_

### Returns

Object

---

## validation

Returns the validation parameter from the [datautils](https://github.com/riggerthegeek/datautils-js) package

### Syntax

```javascript
const validation = Base.validation;
```

### Parameters

_none_

### Returns

Object

---
