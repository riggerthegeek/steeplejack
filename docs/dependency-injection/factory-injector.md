# Factory Injector

The factory injector can be thought of as the legacy version of the [Class Injector](class-injector.md). If you're using a version of
JavaScript that can support [ES7 decorators](https://medium.com/google-developers/exploring-es7-decorators-76ecb65fb841#.1rru191h9) - eg, Babel
and TypeScript - you should use the Class Injector instead.

## The __factory object

To define a module as a factory, it must have a `__factory` object exported.  This needs to have two properties, `name` and `factory`. If
you are familiar with Angular's V1 dependency injector, then it works largely the same as that.

### name: string

This is the name with which to register the module to the dependency injector.

### factory: function | []

This can accept either a function, or an array. There are no constraints as to what can be returned. Whatever is returned will be what is
resolved when that dependency is called.

#### function

If a simple function is passed in to the `factory` then any arguments will be resolved as dependencies by the injector.  If a dependency
doesn't exist, it will throw an error.

#### array

If an array is passed in, then the final item must be an object. All other elements must be a string as these will be what is searched for
in the dependency injector.

## Examples

### A function registered to factory

This will return an object with a function on `method1`. It will have access to two dependencies: `dep1` and `dep2`. This dependency can be
accessed by requiring `dep3`.

```javascript
var name = "dep3";

function factory (dep1, dep2) {

    return {
        method1: function () { ... }
    };

}

exports.__factory = {
    name: name,
    factory: factory
};
```

### An array registered to factory

This will return a function. The will have access to two dependencies from the injector, `dep1` and `dep2` but will be assigned to the
variables `myDep1` and `myDep2`.

```javascript
var name = "dep4";

function factory (myDep1, myDep2) {

    return function () { ... };

}

exports.__factory = {
    name: name,
    factory: factory
};
```
