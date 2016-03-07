# Data Models

The data model exists to logically define data in a consistent way. One of the most powerful features of JavaScript is the duck-typing.
However, this can be problematic when it comes to your business logic - sometimes, you need to know the data type of a variable. Therefore,
the model is to sensibly coerce data.

Another feature missing in JavaScript that is present in most other languages is that it doesn't differentiate between integers and
floating point numbers. The Steeplejack models are able to overcome this.

You could use tools like [Mongoose](http://mongoosejs.com) as your data modeller, however there's a couple of reasons why you might not want
to. Mongoose is logically connected to a MongoDB - using the Steeplejack models do not imply any database connection. This means that the
model won't need to change if you change the data store.

Also, there may not be 1:1 parity between what's stored in your database and what you want in your business logic. This easily maps the
object name names across between the two representations.

 - [Model](model.md)
 - [Collection](collection.md)
