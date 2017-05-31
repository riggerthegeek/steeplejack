---
layout: sidebar
title: Dependency Injection
docs: true
section: /concepts
action_buttons: false
---

> Dependency injection is a technique whereby one object supplies the dependencies of another object.

Dependency injection is used by Steeplejack as a way of loosely-coupling our modules. By _loose-coupling_, we mean that
we **NEVER** rely upon a concrete implementation of an object, but on an abstract version of it. In other words, we
design an object's interface and rely upon that. This enables us to get far higher levels of testability on our 
software - typically, with a Steeplejack application, we should be aiming for 100% unit test coverage. 

## Abstract vs Concrete Objects

- An abstract object is an object where the interface is declared, but that an instance of it has not been created.
- A concrete object is the specific object we are referring to.

In many languages ([TypeScript](https://www.typescriptlang.org/docs/handbook/interfaces.html),
[PHP](https://secure.php.net/manual/en/language.oop5.interfaces.php), 
[Java](http://tutorials.jenkov.com/java/interfaces.html)), there exists the concept of an object interface. We do not
have this in JavaScript. However, we can still talk about the concept of an object interface.

Consider the following:

```javascript
function someFn (obj) {
  if (obj instanceof SomeClass) {
    return obj.method();
  } else {
    return false;
  }
}
```

Imagine testing this piece of code. We would have to ensure that the `obj` variable we entered was an instance of the
`SomeClass` function - depending upon our code, this may or may not be possible (it almost certainly won't be).

Now compare with this...

```javascript
function someFn (obj) {
  if (_.isFunction (obj.method)) {
    return obj.method();
  } else {
    return false;
  }
}
```

The `someFn` method has exactly the same input and output, but we're not forcing the `obj` to be an instance of 
anything - it could even be a Plain Old JavaScript Object. This makes our code far more testable.

# The Steeplejack Injector

In a Steeplejack application, we tell it where to look for modules andall our files get loaded automatically at 
run-time. In this example, we tell it that we want to load up every file ending `.js`, except those in the 
`node_modules` and `routes` folder. 

```javascript
const app = Steeplejack.app({
  modules: [
    `${__dirname}/!(node_modules|routes)/**/*.js`
  ]
});
```

This has now bootstrapped the Steeplejack application. Now we can look at creating a file to be injected. For a file to
be injected into the container, it requires two things to be exported from the file - the `inject` object and the
exported property (by default, this is on `exports.default`).

## Inject

```typescript
interface Inject {
  name: string;
  deps?: string[];
  exportable?: string;
  type?: string;
}
```

The `inject` object tells Steeplejack how to treat this file.

- **name:** This is the only required property. This exists to assign a unique name for this file in the container. This
  is so we can use it as a dependency elsewhere.
- **deps:** This is an array of dependencies that we wish to load into the factory. These will be loaded in order.
- **exportable:** The property to look for that will be loaded into the injector. By default, this is `default` (this
  means your property will be on `exports.default`).
- **type:** Either `factory` (default) or `instance`. If you use `factory`, this will treat the exportable property as
  a function with the `deps` loaded in order. If you use `instance`, whatever is exported will be put into the injector
  as is. **There is no way of injecting dependencies in here** and should be used sparingly for injecting object
  literals.
  
## Exportable

Typically, this will be a factory function with the dependencies loaded as the arguments.

```javascript
exports.default = (UserModel, userStore) => ({

  createUser (input) {
    const user = new UserModel(input);
    
    user.validate();
    
    return userStore.save(user)
      .then(result => {
        user.set('id', result.id);

        return user;
      });
  }
  
});

exports.inject = {
  name: 'userService',
  deps: [
    'UserModel',
    'userStore'
  ]
};
```

This is an example of a `userService` module with a single `createUser` method. It has two dependencies, `UserModel`
and `userStore`, which validate then save the user to our database.

## Testing

Testing this module is now really easy. Using a stubbing framework (if you're new to this, [Sinon](http://sinonjs.org)
is a good starting point), we can check that the `inject` and `default` properties behave as expected.

```javascript
const service = require('/path/to/userService');

describe('userService modules', function() {
  describe('#inject', function() {
    it('should define the injector', function () {
      expect(service.inject).to.be.eql({
        name: 'userService',
        deps: [ 'UserModel', 'userStore' ]
      });
    });    
  });
  
  describe('#createUser', function () {
    it('should save the user', function () {
      const userInst = {
        set: sinon.spy(),
        validate: sinon.spy()        
      };
      const UserModel = sinon.stub().returns(userInst);
      
      const userStore = {
        save: sinon.stub().resolves({ id: 'someId' }),
      };
      
      return service.default(UserModel, userStore)
        .createUser('userInput')
        .then(result => {
          expect(result).to.be.equal(userInst);
          
          expect(UserModel).to.be.calledOnce
            .calledWithNew
            .calledWithExactly('userInput');
          
          /* Add in further calledWith checks below */
        });
    });
  });
});
```

## Naming Convention

There are no rules on what you should name your dependencies. However, a good convention is:
- For modules that can be used throughout the application, begin with a `$` - eg, `$config`
- For classes, start with a capital letter - eg, `UserModel`
- For anything else, start with a lowercase letter - eg, `userService`  

## Resources

  - [Dependency injection](https://en.wikipedia.org/wiki/Dependency_injection)
  - [Design by contract](https://en.wikipedia.org/wiki/Design_by_contract)
  - [Inversion of control](https://en.wikipedia.org/wiki/Inversion_of_control)
  - [Liskov Substitution Principle](https://en.wikipedia.org/wiki/Liskov_substitution_principle)
