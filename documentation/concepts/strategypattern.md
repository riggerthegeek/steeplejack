---
layout: sidebar
title: Strategy Pattern
docs: true
section: /concepts
action_buttons: false
---

In software engineering, design patterns are used in object-oriented programming to address common problems. Steeplejack
makes heavy use of the strategy pattern in particular as a way of defining common concepts (routing, logging etc)
without restricting you to a particular library.

# What is the Strategy Pattern?

The strategy pattern is a way of defining family of algorithms, encapsulating that algorithm and making the algorithm
interchangeable within that family.

Now let's answer same question using the [Logger](../../api/logger) as an example of this. Steeplejack wants to send log
messages, but it neither knows nor cares how the logger will end up consuming it - if it did, it would either have to
know about the interface of **EVERY** logger available, or it would be restricted to using just one type of logger.
Neither of these are desirable.

The Steeplejack Logger class therefore expects a strategy to be declared when an instance is created and only interacts
with that instance in a common way.

Let's look at two different strategies.

## Console Strategy

First, a console strategy. Every time this is called, it outputs the log as an object to `console.log`.

```javascript
const consoleStrategy = Logger.getLogLevels()
  .reduce((result, level) => {
    result[level] = (message, data, ...additional) => console.log({
      level,
      message,
      data,
      additional,
    });

    return result;
  }, {});
```

## Bunyan Strategy

Next, a [Bunyan](https://github.com/trentm/node-bunyan) strategy. This will send warn, error and fatal logs to a file.

```javascript
const bunyan = require('bunyan');

const bunyanLogger = bunyan.createLogger({
  name: 'my-app',
  streams: [{
    level: 'warn',
    path: '/var/log/my-app.log'
  }]
})

const bunyanStrategy = Logger.getLogLevels()
  .reduce((result, level) => {
    result[type] = (...args) => bunyanLogger[level](...args);
  
    return result;
  }, {});
```

Now we have two different strategy objects. They both have the same interface (a function on `fatal`, `error`, `warn`,
`info`, `debug` and `trace` that accepts `message`, `data` and `...additional`), but they do completely different
things. In other words, we have encapsulated the algorithm behind an interface. From a functionality perspective, it
makes no difference which strategy we create our Logger class with. The only difference is how our messages are logged.

If we wanted a simple logger we could choose:

```javascript
const logger = new Logger(consoleStrategy);
```

Or if we wanted a more complete logging solution, we could choose:

```javascript
const logger = new Logger(bunyanStrategy);
```

The strategy pattern gives us complete flexibility.

## Resources

  - [DoFactory](http://www.dofactory.com/javascript/strategy-design-pattern)
  - [The Gang of Four's Book](https://www.amazon.co.uk/Design-patterns-elements-reusable-object-oriented-x/dp/0201633612)
  - [Wikipedia](https://en.wikipedia.org/wiki/Strategy_pattern)
