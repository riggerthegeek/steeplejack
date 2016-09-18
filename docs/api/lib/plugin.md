# Plugin

Manages the registration and use of a steeplejack plugin.  This is so that whole sections of code, written in Steeplejack-friendly syntax,
can be exported as a separate package and reused. These will be imported into the [Steeplejack](../steeplejack.md) modules in the `app` factory.

Isn't [DRY code](https://en.wikipedia.org/wiki/Don't_repeat_yourself) marvellous?

```javascript
import {Plugin} from "steeplejack/lib/plugin";
```

**Extends:** [Base](base.md)

## Methods

### constructor (files: any[] = null) => void

---

### modules => any[]

Parameter where the files for this module are stored. This can be anything, but will usually be the resolved files that have been called by
`require`

---
