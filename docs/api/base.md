# Base

The Base class is at the heart of every Steeplejack class to provide a consistent foundation. If you are still using ES5, this simplifies
prototypical inheritance with the `extend` static method.

**Extends:** [EventEmitter](https://nodejs.org/api/events.html)

## Methods

### constructor (...args: any[]) => void

If an ES5 class, it calls the `__construct` method. As ES5 doesn't really have a constructor method, the `__construct` method is a method
which mimics the behaviour. All arguments that are received are sent through to the `__construct` method.

For TypeScript/CoffeeScript/ES6, this does nothing special as the `__construct` method will not exist.

---

### clone () => any

Clones the instance of the object, returning a new instance of this object but with the same values.

---

## Static Methods

### datatypes

Returns the data parameter from the [datautils](https://github.com/riggerthegeek/datautils-js) package

---

### extend (properties: Object, staticProperties: Object) => Function

This is a polyfill for ES5. Modern compiled JavaScript languages have a `class` sugar which simplifies extending. ES5 doesn't have this
feature so this is there to simplify it.  The first object is your prototypical methods, the second being your static methods. If you provide
a `__construct` object on your prototypical methods object, this will be called when the class is invoked.

---

### validation

Returns the validation parameter from the [datautils](https://github.com/riggerthegeek/datautils-js) package

---

## Usage

### TypeScript/CoffeeScript/ES6

```javascript
class Child extends Base {

    constructor () {}

    method () {}

    static staticMethod () {}

}
```

### ES5

```javascript
var Child = Base.extend({

    __construct: function () {},

    method: function () {}

}, {

    staticMethod: function () {}

});
```
