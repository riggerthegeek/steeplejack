# Collection

A Collection is simply a series of [Model instances](model.md) - if a Model is a single object of data then a Collection is an array of
those object. If you were to define a `Person` model to represent one person, then the Collection may be called `People` to represent
many `Person` Models. At the very minimum, you must define the Model (see [Usage](#usage)) the Collection is using. You can also add any
number of additional methods to your Collections.

This is an [abstract class](https://en.wikipedia.org/wiki/Abstract_type), meaning it cannot be instantiated directly - this only applies to
TypeScript applications, but still should be extended in all other versions of JavaScript.

```javascript
import {Collection} from "steeplejack/lib/collection";
```

**Extends:** [Base](base.md)

## Methods

### constructor (data: Object[]) => void

Creates a new instance of the collection. All data gets sent to the [add](#add-data-object--collection) method.

---

### add (data: Object[]) => Collection

Adds each object in the array to the collection. Dispatches to the [addOne](#addone-data-object--collection) method.

---

### addOne (data: Object) => Collection

Adds a single data object to the collection. If it's already an instance of the Model defined in the protected `_model` method, it will just
add it. If not, it will create an instance of the Model with the data object sent to it.

---

### each (iterator: Function, thisArg: Object) => Collection

Cycles through each model in the collection and runs the iterator function on it. The `thisArg` is for ES5 compatibility, which sets the
scope of the iterator function. The order starts with the _0th_ model and ends with the last.

```javascript
obj.each((model, id, collection) => {
    console.log(model);
});
// 'model' is the instance of the Model that we're iterating through
// 'id' is the position in the collection, starting from 0
// 'collection' is the instance of the collection (identical to 'obj' in this example)
```

---

### eachRight (iterator: Function, thisArg: Object) => Collection

Identical to [each](#each-iterator-function-thisarg-object--collection) method, except that it starts with the last model and ends with the
_0th_.

---

### filter (properties: Object) => Collection

---

### find (properties: Object) => Model

---

### findLast (properties: Object) => Model

---

### getAll () => ICollectionData[]

---

### getAllById (ids: string[]) => Model[]

---

### getAllByKey (keys: number[]) => Model[]

---

### getAllByModel (models: Model[]) => Model[]

---

### getById (id: string) => Model

---

### getByKey (key: number) => Model

---

### getByModel (model: Model) => Model

---

### getCount () => Number

---

### getData () => Model[]

---

### getIds () => string[]

---

### getModel () => Object

---

### limit (limit: number, offset: number) => Collection

---

### reset () => boolean

---

### removeById (id: string) => boolean

---

### removeByModel (removeModel: Model) => boolean

---

### sort (fn: (a: any, b: any) => number) => Collection

---

### sortBy (properties: ISortProperty) => Collection

---

### toDb () => Object[]

---

### validate () => boolean

---

### where (properties: Object) => Collection

---

## Static Methods

### toModels (data: Object[]) => Collection

This converts an array of objects in the Model _data_ format - the same as returned by the [toDb]() method. This will return an instance
of the Collection.

---

## Usage

```javascript
class Person extends Model { ... } // See the Model docs for how to define this

class People extends Collection {
    _model () {
        // Return the Person constructor
        return Person;
    }
}

let obj = new People([{
    firstName: "John",
    lastName: "Smith"
}]);

console.log(obj.getData()); // [{ "firstName": "John", "lastName": "Smith" }]
```
