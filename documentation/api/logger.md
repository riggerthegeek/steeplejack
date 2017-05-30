---
layout: sidebar
title: Logger
docs: true
section: /api
action_buttons: false
module: steeplejack
source: https://github.com/steeplejack-js/steeplejack/blob/master/src/lib/logger.js
ioc: steeplejack-logger
---

**Extends:** [Base](../base)

A simple logging strategy pattern

```javascript
const Logger = require('steeplejack/lib/logger');

const log = new Logger(strategy);
```

# Strategy

The `strategy` object must have a function for each of the levels in [Logger.getLogLevels()](#getloglevels) and accept
the arguments `message`, `data` and `...additional` as it's arguments. This is an example strategy that sends to
`console.log`.

```javascript
const strategy = Logger.getLogLevels()
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

# Methods

## trigger

Triggers a new call to the log strategy. If the level is not part of [Logger.getLogLevels()](#getloglevels), it will
throw an error.

### Syntax

```javascript
log.trigger(level, message, [ data = {} ], ...additional);
```

### Parameters

**level**
  String. The log level this message is at.

**message**
  String. The log message.
  
**data**
  Object. Any data associated with this message. Defaults to `{}`.
  
**...additional**
  *[]. Any additional data relevant to this log.

### Returns

_Collection_

---


# Static Methods

## trigger

Triggers a new call to the log strategy. If the level is not part of [Logger.getLogLevels()](#getloglevels), it will
throw an error.

### Syntax

```javascript
logger.trigger(level, message, [ data = {} ], ...additional);
```

### Parameters

**level**
  String. The log level this message is at.

**message**
  String. The log message.
  
**data**
  Object. Any data associated with this message. Defaults to `{}`.
  
**...additional**
  *[]. Any additional data relevant to this log.

### Returns

_Collection_

---
