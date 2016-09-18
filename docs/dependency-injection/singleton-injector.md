# Singleton Injector

The singleton is a much simpler than the other injectors. It accepts no dependencies and only returns what is set. This would normally be
a non-function value.

## The __singleton object

To register a singleton module, it must have a `__singleton` object. This needs to have properties, `name` and `singleton`.

### name: string

This is the name with which to register the module to the dependency injector.

### singleton: any

This can accept anything. There is no parsing whatsoever and is returned exactly as registered here.

## Examples

### Registering an object to the injector

This will register the object to the injector under the name `dep1`

```javascript
var name = "dep1";

var singleton = {
    hello: "world"
};

exports.__singleton = {
    name: name,
    singleton: singleton
};
```
