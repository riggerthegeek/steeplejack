# Model

[Model API](../api/lib/model.md)

A model is a block of data. If you think of the attributes of a `Person`, you would have a first and last name, perhaps a date of birth. You
might also have optional data, like their gender or address history. Crucially, the model will have consistent data types and validation.

You are required to define a schema for your model. This describes the model, data types and validation.

> Although a widely-used (if not formally adopted) standard, JSON schema is not used by design. This is because JSON schema is designed to
> be a flat structure. In Steeplejack, we want to allow custom validation - it is not inconceivable that you will want to use a validation
> method that cannot be achieved using JSON schema.

Let's define a simple model. It has three properties - `id`, `firstName` and `lastName`. The ID is an integer and the other two are strings.
If nothing is set to these elements, the default value will be `null` and there is no validation on this model.

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
                type: "string"
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
    column?: any;
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
 - enum - this requires the [enum]() array
 - float
 - integer
 - mixed
 - object - consider using an instance of Model instance
 - string
 
### enum: any[]

## Validation
