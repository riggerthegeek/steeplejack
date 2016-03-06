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

Anything that matches is removed from the Collection. This is the opposite of [where](#where-properties-object--collection).

---

### find (properties: Object) => Model

Similar to the [where](#where-properties-object--collection) method, except that returns the first Model that matches. This may mean that
there are additional models that would match.

---

### findLast (properties: Object) => Model

This reverses the [find](#find-properties-object--model) method, returning the final matching Model in the collection.

---

### getAll () => ICollectionData[]

Returns the data array.

---

### getAllById (ids: string[]) => Model[]

Gets all the Models that match the given ids in the array. These will be in the
[UUID v4 format](https://en.wikipedia.org/wiki/Universally_unique_identifier#Version_4_.28random.29).

---

### getAllByKey (keys: number[]) => Model[]

Get all the Models that match the given keys in the array. These will reflect the order of the Models, starting with the _0th_.

---

### getAllByModel (models: Model[]) => Model[]

Gets all the Models that match the given Models in the array.

---

### getById (id: string) => Model

Searches through the Collection for the given ID. This will be a
[UUID v4](https://en.wikipedia.org/wiki/Universally_unique_identifier#Version_4_.28random.29).

---

### getByKey (key: number) => Model

Searches through the Collection for the key.

---

### getByModel (model: Model) => Model

Search through Collection for the Model.

---

### getCount () => Number

Counts the number of Models in the Collection

---

### getData () => Object[]

Returns the array of Models in order. This will return an array of objects.

---

### getIds () => string[]

Returns all the IDs in order.

---

### getModel () => Object

Gets the Model constructor.

---

### limit (limit: number, offset: number) => Collection

Limits in the same way as MySQL limits.  The first is the limit, which is the maximum number of items we can keep.  The second is the
offset, which is the number of items we pad.

On a collection with 5 items, `limit(2, 2)` will only keep the data at position 2 and 3, dropping 0, 1 and 4 out.

---

### reset () => boolean

Resets the collection back to it's original (empty) state.

---

### removeById (id: string) => boolean

Removes the model by the ID

---

### removeByModel (removeModel: Model) => boolean

Removes the given model

---

### sort (fn: (a: any, b: any) => number) => Collection

Sort by the given sortation function. This works in the same way as the
[Array.prototype.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) method.

---

### sortBy (properties: ISortProperty) => Collection

This sorts by a key (or keys) in the model. The params should be an object, with the key as the key and the direction as the value.  The
acceptable direction values are `"ASC"` or `"DESC"`.  This works in broadly the same way as MySQLs sorting.

---

### toDb () => Object[]

Returns the database representation of the models in order.

---

### validate () => boolean

Validates all the models in the Collection. If any of the Models have an error, it will aggregate them into one `ValidationError`

---

### where (properties: Object) => Collection

Performs a where query on the Collection.  Removes anything that doesn't meet the criteria from the Collection. This is the opposite of
[filter](#filter-properties-object--collection).

---

## Static Methods

### toModels (data: Object[]) => Collection

This converts an array of objects in the Model _data_ format - the same as returned by the [toDb](#todb---object) method. This will
return an instance of the Collection.

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
