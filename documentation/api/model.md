---
layout: sidebar
title: Model
docs: true
section: /api
action_buttons: false
module: data
source: https://github.com/steeplejack-js/data/blob/master/src/lib/model.js
ioc: steeplejack-model
---

**Extends:** [Base](../base)

This is a piece of data. Typically, this would be a single line/document out of a database. This requires a schema to be
defined.

> See the [Model](../../concepts/model) concept section for details on how to use it. 

```javascript
const { Model } = require('@steeplejack/data');

class User extends Model {
  _schema () {
    return {
      name: {
        type: 'string',
        validation: [{
          rule: 'required'
        }]
      },
      
      emailAddress: {
        type: 'string',
        column: 'email_address',
        validation: [{
          rule: 'required'
        }, {
          rule: 'email'
        }]
      }
    };
  }
}

const obj = new User({
  name: 'Joe Bloggs',
  emailAddress: 'joe@bloggs.com'
});
```

# Methods

## get

Returns the data set to the key name

### Syntax

```javascript
const name = obj.get('name');
```

### Parameters

**key**
  String. The key you're looking for.

### Returns

_any_

---

## getColumnKeys

Gets the keys and the column name as an array of objects.

>The `key` is what what we refer to the data element in the model (eg, `emailAddress` in the above example) and the 
> `column` is what the data element is referred to in the data store (eg, `email_address`). 

### Syntax

```javascript
const name = obj.get('name');
```

### Parameters

_none_

### Returns

```typescript
interface Keys {
  column: string;
  key: string;
}[];
```

---

## getData

Returns the data that is set to this data model. This allows us to access the static property set in the child. If 
parsing the data, it will run it through any getter functions. Otherwise, it will just be the raw data.

### Syntax

```javascript
const data = obj.getData([parse = true]);
```

### Parameters

*parse*
  Boolean. Decides whether to parse the get data through the getter functions. Defaults to `true`.

### Returns

Object.

---

## getDefinition

Once the schema has been converted into a series of [Definition](../definition) objects, they will live in here.

### Syntax

```javascript
const def = obj.getDefinition(key);
```

### Parameters

*key*
  String. The key we're looking for (eg, `user` or `emailAddress`).

### Returns

[Definition](../definition) or `null`

---

## getPrimaryKey

Gets the primary key for the model.

### Syntax

```javascript
const primaryKey = obj.getPrimaryKey();
```

### Parameters

_none_

### Returns

String.

---

## getPrimaryKeyValue

Gets the value of the primary key for the model.

### Syntax

```javascript
const value = obj.getPrimaryKeyValue();
```

### Parameters

_none_

### Returns

_any_

---

## getSchema

Gets the schema of the class. This is the unparsed version, rather than converted into a Definition object.

### Syntax

```javascript
const schema = obj.getSchema();
```

### Parameters

_none_

### Returns

Object

---

## set

Sets data to the desired key. If no value is received, it will set the default value.

If there is a method called `_set<key>` (eg, if key = "item", method called `_setItem`) on the concrete class, that will
act as the setter. Otherwise, it uses simple datatype rules.

### Syntax

```javascript
obj.set(key, [value = undefined]);
```

### Parameters

**key**
  String. The key you're setting.
  
**value**
  Mixed. The value you want to set. If you don't set anything, it'll default to `undefined`.

### Returns

`Model` instance

---

## toDb

Converts the model to the database representation object (specified by the `column_name` key in the Definition). This is
an object literal.

### Syntax

```javascript
const data = obj.toData();

// The data variable would be set as:
//  {
//    "name": "Joe Bloggs",
//    "email_address": "joe@bloggs.com"
//  }
```

### Parameters

**key**
  String. The key you're setting.
  
**value**
  Mixed. The value you want to set. If you don't set anything, it'll default to `undefined`.

### Returns

`Model` instance

---

## validate

Validates the model against the validation rules. It throws a [ValidationException](../validationexception) if it 
detects a violation of the rules. If the validation succeeds, it returns `true`.

### Syntax

```javascript
const isValid = obj.validate();
```

### Parameters

_none_

### Returns

Boolean

---

## where

Give it some properties and see if the model matches those values. If the data is an object, it casts the data
to a string so that it can be matched. An empty object will always return `false`.

### Syntax

```javascript
const match = obj.where(properties);
```

### Parameters

**properties**
  Object. This does a simple value match (`==` not `===`) on the model and returns a boolean to say if it matches or 
  not.

### Returns

Boolean

---

# Static Methods

## merge

Wraps the lodash `defaultsDeep` method. This exists purely as a helper method so that any user can merge their schema
objects without having to have lodash as a dependency.

### Syntax

```javascript
const model = Base.merge(object, ...sources);
```

### Parameters

**object**
  Object. The base class of the instance that you want to extend
  
**...sources**
  Object. The additional data you want to add to the `object`.

### Returns

Object

---

## toModel

Converts an object literal to an instance of this model. This will be expecting the data in the same format that is 
returned from the `toDb()` method.
### Syntax

```javascript
const obj = Base.toModel([data = {}]);
```

### Parameters

**data**
  Object. The object literal that you want to convert into a Model instance. If you have any elements set with the
  `column_key` in the definition, you will use that as the object keys here. 
  
### Returns

Model

---
