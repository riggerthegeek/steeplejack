# Logger

A simple logging strategy pattern. The default error level is `error`.

```javascript
import {Logger} from "steeplejack/lib/logger";
```

**Extends:** [Base](base.md)

## Methods

### constructor (strategy: ILoggerStrategy) => void

Sets the logging strategy to use.

---

### debug (...args: any[]) => Logger

Log the message at the debug level. Any number of arguments can be passed, depending on what requires logging. At the very least, it should
be an error message.

---

### error (...args: any[]) => Logger

Log the message at the error level. Any number of arguments can be passed, depending on what requires logging. At the very least, it should
be an error message.

---

### fatal (...args: any[]) => Logger

Log the message at the fatal level. Any number of arguments can be passed, depending on what requires logging. At the very least, it should
be an error message.

---

### info (...args: any[]) => Logger

Log the message at the info level. Any number of arguments can be passed, depending on what requires logging. At the very least, it should
be an error message.

---

### trace (...args: any[]) => Logger

Log the message at the trace level. Any number of arguments can be passed, depending on what requires logging. At the very least, it should
be an error message.

---

### warn (...args: any[]) => Logger

Log the message at the warn level. Any number of arguments can be passed, depending on what requires logging. At the very least, it should
be an error message.

---

## Properties

### level => string

Setter and getter of the error level - below that level, logs are not stored. Must be one of `getLogLevel` array.

---

## Static Methods

### getLogLevels () => string[]

Defines the logging levels in priority order:

 1. fatal
 2. error
 3. warn
 4. info
 5. debug
 6. trace

---

## Usage

```javascript
class LogStrategy {
    debug (...args: any[]) {}
    error (...args: any[]) {}
    fatal (...args: any[]) {}
    info (...args: any[]) {}
    trace (...args: any[]) {}
    warn (...args: any[]) {}
}

let log = new Logger(new LogStrategy());

log.fatal("a fatal error occurred");
```
