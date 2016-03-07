# Collection

[Collection API](../api/lib/collection.md)

A collection is simply multiple models put in order. If you had defined a collection for multiple `Person` models, you might want to create
a `People` collection.  Once you have your collection object, you can have a series of methods for sorting, filtering and finding data
inside that model.  Normally, this might be done as part of your database call - however, this gives you the flexibility to do that outside
of your database if that is appropriate. You also have a `validate` method, which runs the `validate` method on each model.

At the very minimum, your collection requires a [Model](model.md) constructor.

```javascript
import {Collection} from "steeplejack/lib/collection";

class People extends Collection {

    _model () {
        return Person;
    }

}
```
