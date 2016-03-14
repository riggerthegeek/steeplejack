# Fatal

This is an error that should be thrown when a fatal error has occurred. A fatal error happens when there is nothing the user can do to fix it
and requires intervention from the software team. Unlike a [Validation](./validation.md) error, you may want to hide the full reason for the
error as this could expose sensitive information about your server.

Examples of this would be when a database fails or an expected connection is not there.

```javascript
import {FatalException} from "steeplejack/exception/fatal";
```

**Extends:** [Exception](./exception.md)
