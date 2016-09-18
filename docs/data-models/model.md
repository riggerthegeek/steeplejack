# Model

[Model API](../api/lib/model.md)

A model is a block of data. If you think of the attributes of a `Person`, you would have a first and last name, perhaps a date of birth. You
might also have optional data, like their gender or address history. Crucially, the model will have consistent data types and validation.

You are required to define a schema for your model. This describes the model, data types and validation.

> Although a widely-used (if not formally adopted) standard, JSON schema is not used by design. This is because JSON schema is designed to
> be a flat structure. In Steeplejack, we want to allow custom validation - it is not inconceivable that you will want to use a validation
> method that cannot be achieved using JSON schema. We use this by defining our own validation functions, something not possible using JSON
> schema.

Let's define a simple model. It has fource properties - `id`, `firstName`, `lastName` and `emailAddress`. The ID is an integer and the
other three are strings. If nothing is set to these elements, the default value will be `null` and there is no validation on this model. In the database, the
`lastName` is actually called `surname`.

The `emailAddress` is a required field and it also must be an email address.

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
            },
            emailAddress: {
                type: "string",
                validation: [{
                    rule: "required"
                }, {
                    rule: "email"
                }]
            }
        };

    }

}
```

## Schema definition

Your `_schema` needs to return an object. The object keys are the schema key. Each key should then have a definition object on it. Let's
first look at the full definition object:

```javascript
interface IModelDefinition {
    type: any;
    value?: any;
    column?: string;
    primaryKey?: boolean;
    validation?: IDefinitionValidation[];
    enum?: any[];
    settings?: object;
}
```

### type: any

This is a required field. If the `type` is a string, it should be one of the following:

 - array - consider using a `Collection` instance
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
is set in type. If nothing is set, it will be `null`.

### column: string

The `column` is to be used if you want to have a different key name stored in your database. Look at the [Column names](#column-names)
section for more detail

### primaryKey: boolean

Allows you to specify a primary key on a model. This would normally be a unique ID.

### validation: IDefinitionValidation[]

An array of validation functions. This is covered in [Validation](#validation);

### enum: any[]

If your type is `enum`, this allows you to set the allowed values.

### settings: Object

An object of anything you want. This allows you to store any meta information about your entry.

---

## Validation

Once you've defined your model, you might want to validate your data. The Steeplejack validation is very flexible. For the most part, you
will be able to use the provided validation functions. And, if they don't work for you, you can write your own.

```javascript
interface IDefinitionValidation {
    rule: string | ((model: Model, value: any) => boolean);
    param?: any[];
}
```

### rule: string | ((currentValue: any, model: Model) => boolean)

```javascript
    {
        "validation": [{
            "rule": "required"
        }, {
            "rule": (value) => {
                if (value !== "desired value") {
                    throw new Error("not my value");
                }
                return true;
            }
        }]
    }
```

> If you have created your model using `class`, the value of `this` will be the same as `model`. The `model` is mainly here for ES5
> usage.

At it's simplest form, you will just be passing a string through to the validation object. This wraps the
[Datautils](https://github.com/riggerthegeek/datautils-js#validation) package, so any function available in there can be passed through as
a string. For most cases, this will be enough.

If you want more control over your validation you can pass in a function. This will allow you to perform fine-grain validation. To tell that
we have passed validation, simply `return true`. To return a useful error, you should throw the error you want to be added to the stack.

> You can also `return false` to signify an error. This is not recommended as it just marks as a generic error.

#### Available string functions

The `value` gets passed in automatically. Any additional arguments must be passed into the [`param`](#param-any) array.

 - email (value: string) - checks the `value` matches an email regular expression
 - equal (value: any, match: any) - checks the `value` is the same as `match`
 - greaterThan (value: any, target: any) - checks the `value` is greater than the `target`
 - greaterThanOrEqual (value: any, target: any) - checks the `value` is greater than or equal to the `target`
 - length (value: any, length: number) - checks the length of the `value` is equal to the `length`
 - lengthBetween (value: any, minLength: number, maxLength: number) - checks the `value` is between `minLength` and `maxLength`
 - lessThan (value: any, target: any) - checks the `value` is less than the `target`
 - lessThanOrEqual (value: any, target: any) - checks the `value` is less than or equal to the `target`
 - match (value: any, key: string) - checks the `value` matches the `key` in the model
 - maxLength (value: any, length: number) - checks the length of `value` is less than `length`
 - minLength (value: any, length: number) - checks the length of `value` is more than `length`
 - regex (value: string, regex: RegExp | string) - checks the `value` matches the `regex`
 - required (value: any) - checks that `value` is not empty

### param: any[]

This is only used when you are using a function name in the `rule` that requires additional arguments, eg, used in the `equal` rule but
**<u>not</u>** used in the `email` rule.

You should pass through the same number of arguments that the `rule` requires, in the order and type that it requires it.

```json
    {
        "validation": [{
            "rule": "lengthBetween",
            "param": [
                5, 15
            ]
        }]
    }
```

If you used this object on a validation, it would ensure that the string was between 5 and 15 characters long.

---

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
    "id": 1,
    "firstName": "Test",
    "lastName": "Testington"
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
    "id": 1,
    "firstName": "Test",
    "surname": "Testington"
}
```

---
