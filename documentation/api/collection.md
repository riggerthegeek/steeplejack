---
layout: sidebar
title: Collection
docs: true
section: /api
action_buttons: false
module: data
source: https://github.com/steeplejack-js/data/blob/master/src/lib/collection.js
ioc: steeplejack-collection
---

**Extends:** [Base](../base)

This is a collection of models.  Typically, this would be multiple lines/documents out of a database. You will need to 
define a model and it does the rest of it for you.

> See the [Collection](../../concepts/collection) concept section for details on how to use it.

```javascript
const { Collection } = require('@steeplejack/collection');
const UserModel = require('../model/user');

class Users extends Collection {
  _model () {
    return UserModel;
  }
}

const obj = new Users([{
  name: 'Tony Hancock',
  emailAddress: 'tony@railwaycuttings.com'
}, {
  name: 'Sid James',
  emailAddress: 'dodgysid@eastcheam.net'
}]);
```

# Methods

## add

Adds in the data to the collection

### Syntax

```javascript
obj.add(arr);
```

### Parameters

**arr**
  Object[]. Array of objects we're adding 

### Returns

_Collection_

---

## addOne

Adds one object to the collection

### Syntax

```javascript
obj.addOne(obj);
```

### Parameters

**obj**
  Object. The single object we're adding. It will convert it to an instance of the Model you have set in `_model` and
  assign a random ID to it so we can find it. 

### Returns

_Collection_

---

## each

Cycles through each model in the collection and runs the iterator function on it.

### Syntax

```javascript
obj.each(iterator, [ thisArg = null ]);
```

### Parameters

**iterator**
  Function. The function that will be applied to each model in the collection.
  
**thisArg**
  Object. The scope to apply to the iterator. Generally, you won't set this but exists for completeness.

### Returns

_Collection_

---

## eachRight

Cycles through each model in the collection backwards and runs the iterator function on it.

### Syntax

```javascript
obj.eachRight(iterator, [ thisArg = null ]);
```

### Parameters

**iterator**
  Function. The function that will be applied to each model in the collection.
  
**thisArg**
  Object. The scope to apply to the iterator. Generally, you won't set this but exists for completeness.

### Returns

_Collection_

---

## filter

Anything that matches is removed from the collection.  This is the opposite of [where()](#where).

### Syntax

```javascript
obj.filter(properties);
```

### Parameters

**properties**
  Object. The key/value pairs that we're looking to match on the models.
  
### Returns

_Collection_

---

## find

Similar to the [where()](#where) method, except that this returns the first model that returns a match. This may mean 
that there are additional models that would match. Returns `null` if nothing found.

### Syntax

```javascript
const model = obj.find(properties);
```

### Parameters

**properties**
  Object. The key/value pairs that we're looking to match on the models.
  
### Returns

_Model_

---

## findLast

Opposite of [find()](#find) method. This performs a reverse search on the collection, finding the last matching model.
Returns `null` if nothing found.

### Syntax

```javascript
const model = obj.findLast(properties);
```

### Parameters

**properties**
  Object. The key/value pairs that we're looking to match on the models.
  
### Returns

_Model_

---

## getAll

Returns the data array.

### Syntax

```javascript
const data = obj.getAll();
```

### Parameters

_none_
  
### Returns

```typescript
interface Data {
  id: string;
  model: Model;
}[]
```

---

## getAllById

Gets all the models by matching their randomly assigned key

### Syntax

```javascript
const models = obj.getAllById(ids);
```

### Parameters

**ids**
  String[]. An array of the IDs we're looking for.
  
### Returns

_Model[]_

---

## getAllByKey

Gets all the models by matching their positional key (eg, 0, 1, 2...)

### Syntax

```javascript
const models = obj.getAllByKey(keys);
```

### Parameters

**keys**
  Number[]. An array of the keys we're looking for.
  
### Returns

_Model[]_

---

## getAllByModel

Gets all the models by matching the model instances themselves.

### Syntax

```javascript
const models = obj.getAllByModel(models);
```

### Parameters

**models**
  Models[]. An array of the models we're looking for.
  
### Returns

_Model[]_

---

## getById

Search through the collection for the model that matches the given ID. Returns `null` if nothing found.

### Syntax

```javascript
const model = obj.getById(id);
```

### Parameters

**id**
  String. The ID we're looking for.
  
### Returns

_Model_

---

## getByKey

Search through the collection for the model that matches the given positional key (eg, 0, 1, 2). Returns `null` if
nothing found.

### Syntax

```javascript
const model = obj.getByKey(key);
```

### Parameters

**key**
  Number. The key we're looking for.
  
### Returns

_Model_

---

## getByModel

Search through the collection for the model. Returns `null` if
nothing found.

### Syntax

```javascript
const mod = obj.getByModel(model);
```

### Parameters

**model**
  Model. The model we're looking for.
  
### Returns

_Model_

---

## getCount

Counts the number of items in the collection

### Syntax

```javascript
const count = obj.getCount();
```

### Parameters

_none_
  
### Returns

_Number_

---

## getData

Returns the models in order

### Syntax

```javascript
const data = obj.getData([parse = undefined]);
```

### Parameters

**parse**
  Boolean. Do we parse the model. Defaults to `undefined` so it takes the model's default behaviour.
  
### Returns

_Object[]_

---

## getIds

Gets all the IDs in order

### Syntax

```javascript
const ids = obj.getIds();
```

### Parameters

_none_
  
### Returns

_String[]_

---

## getModel

Gets the model constructor

### Syntax

```javascript
const model = obj.getModel();
```

### Parameters

_none_
  
### Returns

_Function_

---

## limit

Limits in the same way as MySQL limits. The first is the limit, which is the maximum number of items we can keep. The 
second is the offset, which is the number of items we pad.
   
On a collection with 5 items, `limit(2, 2)` will only keep the data at position 2 and 3, dropping 0, 1 and 4 out.

Setting the limit to 0 will call the [reset()](#reset) method.

### Syntax

```javascript
obj.limit(limit, [offset = 0]);
```

### Parameters

**limit**
  Number. The maximum number of items to keep in the collection.

**offset**
  Number. The start position. This defaults to 0.
  
### Returns

_Collection_

---

## removeById

Removes the model by the ID. The returned boolean tells us if the model previously existed in the collection.

### Syntax

```javascript
const removed = obj.removeById(id);
```

### Parameters

**id**
  String. The ID of the model to remove.
  
### Returns

_Boolean_

---

## removeByModel

Removes the given model from the collection. The returned boolean tells us if the model previously existed in the 
collection.

### Syntax

```javascript
const removed = obj.removeByModel(model);
```

### Parameters

**model**
  Model. The model to remove.
  
### Returns

_Boolean_

---

## reset

Resets the collection back to it's original (empty) state. The boolean returned tells if anything has been done - if
it was previously empty, it will return `false`.

### Syntax

```javascript
const changed = obj.reset();
```

### Parameters

_none_
  
### Returns

_Boolean_

---

## sort

Sort by the given sortation function. This works int he same way as the 
[Array.prototype.sort](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/sort?v=control)
method

### Syntax

```javascript
obj.sort(fn);
```

### Parameters

**fn**
  Function. The function to apply.
  
### Returns

_Collection_

---

## sortBy

This sorts by a key (or keys) in the model. The params should be an object, with the key as the key and the direction as
the value. The acceptable direction values are "ASC" or "DESC". This works in broadly the same way as MySQLs sorting.

### Syntax

```javascript
obj.sortBy(properties);
```

### Parameters

**properties**
  Object. Key/value pairs of the key and sort direction.
  
### Returns

_Collection_

---

## toDb

Returns the database representation of the models in order. Calls the [toDb](../model#todb) method

### Syntax

```javascript
const models = obj.toDb();
```

### Parameters

_none_
  
### Returns

_Object[]_

---

## validate

Validates all the models in the collection. Throws a [ValidationException](../validationexception) with the errors on it
identified by the model's ID.

### Syntax

```javascript
const valid = obj.validate();
```

### Parameters

_none_
  
### Returns

_boolean_

---

## where

Performs a where query on the collection.  Removes anything that doesn't meet the criteria from the collection.  This is
the opposite of [filter()](#filter).

### Syntax

```javascript
obj.where(properties);
```

### Parameters

**properties**
  Object. The key/value pairs that we're looking to match on the models.
  
### Returns

_Collection_

---

# Static Methods

## toModels

Creates an instance of the collection object and populates it with the result of the [Model.toModel](../model#tomodel) 
method. This can be used to convert a data store result into a collection of models.

### Syntax

```javascript
const obj = Users.toModels([data = null]);
```

### Parameters

**data**
  Object[]. The data we're converting to a collection. Each model will be created with the model's 
  [toModel](../model#tomodel) method.
  
### Returns

_Collection_

---
