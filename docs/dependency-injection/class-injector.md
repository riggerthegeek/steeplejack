# Class Injector

> This uses [ES7 decorators](https://medium.com/google-developers/exploring-es7-decorators-76ecb65fb841#.1rru191h9). If you are compiling
> your application with either [TypeScript](http://www.typescriptlang.org) or [Babel](http://babeljs.io) and can support decorators, you
> should use this way of injecting dependencies.

## Examples

### An instance registered with dependencies resolved automatically

This will register an instance of this class to `dep3`, resolving `dep1` and `dep2` in the `constructor` method.

```javascript
import {Inject} from "steeplejack/decorators/inject";

@Inject({
    name: "dep3"
})
class Dep3 {

    constructor (dep1, dep2) {
        this._dep1 = dep1;
        this._dep2 = dep2;
    }

}
```

### An instance registered with dependencies resolved manually

This will register an instance of this class to `dep4`, resolving `dep1` and `dep2` in the `constructor` method. The names of the
dependencies in the constructor can be anything you like as the `deps` array in the decorator define the dependencies to use.

```javascript
import {Inject} from "steeplejack/decorators/inject";

@Inject({
    name: "dep4",
    deps: [
        "dep1",
        "dep2"
    ]
})
class Dep4 {

    constructor (myDep1, myDep2) {
        this._myDep1 = myDep1;
        this._myDep2 = myDep2;
    }

}
```

### The class constructor registered with no dependencies

Sometimes you will want to register a class but not automatically create an instance. This is useful when you're registering a
[Model](../data-models/model.md) or [Collection](../data-modules/collection.md).  This will be registered to the injector under `MyClass`
and have no external dependencies.

```javascript
import {Inject} from "steeplejack/decorators/inject";

@Inject({
    name: "MyClass",
    factory: true
})
class MyClass {

    constructor (obj) { ... }

}
```

### The class constructor registered with some dependencies

If you want a class constructor with some dependencies, you'll need to define them in the `deps` array. This will register `MySecondClass`
to the injector and it will have `MyClass` and `dep2` as dependencies. These dependencies are set as static methods on the class.

```javascript
import {Inject} from "steeplejack/decorators/inject";

@Inject({
    name: "MySecondClass",
    factory: true,
    deps: [
        "MyClass",
        "dep2"
    ]
})
class MySecondClass {

    constructor (obj) {
        MySecondClass.MyClass; // The MyClass dependency
        MySecondClass.dep2; // The dep2 dependency
        obj; // Whatever is sent through when invoking
    }

}
```
