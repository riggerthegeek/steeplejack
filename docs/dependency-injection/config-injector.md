# Config Injector

Unlike the other injectors, the config injector is invoked immediately. It is a function that receives only the config object. These are
useful for creating resources that need to be configured before they can be used, such as logging objects.

## The __config object

To register a config module, it must have a `__config` object. This needs to have properties, `name` and `config`.

### name: string

This is the name with which to register the module to the dependency injector.

### config: (config: Object) => any

This is a function that receives the application config object. Whatever is returned from this function is what is set to the injector. It
is registered using the [Singleton Injector](singleton-injector.md)

## Examples

### Registering a module that needs to be invoked with config

This will register the object to the injector under the name `dep1`. The `$config` is what the main config object. The `De[` class is a
hypothetical object where we're only interesting in working with the instance.

```javascript
var name = "dep1";

var config = function ($config) {

    return new Dep($config.dep);

};

exports.__singleton = {
    name: name,
    singleton: singleton
};
```
