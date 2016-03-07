# Model

[Model API](../api/lib/model.md)

A model is a block of data. If you think of the attributes of a `Person`, you would have a first and last name, perhaps a date of birth. You
might also have optional data, like their gender or address history. Crucially, the model will have consistent data types and validation.

You are required to define a schema for your model. This describes the model, data types and validation.

> Although a widely-used (if not formally adopted) standard, JSON schema is not used by design. This is because JSON schema is designed to
> be a flat structure. In Steeplejack, we want to allow custom validation - it is not inconceivable that you will want to use a validation
> method that cannot be achieved using JSON schema.

Let's define a simple model. It has three properties - `id`, `firstName` and `lastName`. The ID is an integer and the other two are strings.
If nothing is set to these elements, the default value will be `null` and there is no validation on this model. In the database, the
`lastName` is actually called `surname`.

```javascript
import {Model} from "steeplejack/lib/model";

class Person extends Model {

    _schema () {

        return {
            id: {
                type: "integer"
            },
            firstName: {
                type: "string"
            },
            lastName: {
                type: "string",
                column: "surname"
            }
        };

    }

}
```

## Schema definition

Let's first look at the full definition object

```javascript
IModelDefinition {
    type: any;
    value: any;
    column?: string;
    primaryKey?: boolean;
    validation?: Function[];
    enum?: any[];
    settings?: any;
}
```

### type: any

This is a required field. If the `type` is a string, it should be one of the following:

 - array - consider using an instance of Collection instance
 - boolean
 - date
 - enum - this requires the [enum](#enum-any) array
 - float
 - integer
 - mixed
 - object - consider using an instance of Model instance
 - string

You can also set a Collection or Model constructor. This means that you can nest your data - if your model needed to have a collection of
Address models, you could simply set that Collection to your type.

### value: any

This is the default value. If no value is set, it will use this. Importantly, this can be whatever data type you want, regardless of what
is set in type.

### column: string



### enum: any[]

## Validation

## Column names

In our example `Person` model, we want to use `lastName` in our application. However, the data is stored under `surname` in the database.
Although perhaps a contrived example, there will be many times when your data model and your database will diverge.

When you use the constructor, this will receive an object that is in the same shape as the model.

```javascript
let obj1 = new Person({
    id: 1,
    firstName: "Test",
    lastName: "Testington"
});
```

If you want to convert that back into a plain object in this shape, you need the `getData()` method.

```javascript
obj1.getData();
```

```json
{
    id: 1,
    firstName: "Test",
    lastName: "Testington"
}
```

Now, converting to the data representation. To create an instance from the database version, use the `toModel()` static method.

```javascript
let obj2 = Person.toModel({
    id: 1,
    firstName: "Test",
    surname: "Testington"
});
```

The values of `obj1` and `obj2` will be the same. To get the database representation from the instance, use the `toDb` method.

```javascript
obj2.toDb();
```

```json
{
    id: 1,
    firstName: "Test",
    surname: "Testington"
}
```
