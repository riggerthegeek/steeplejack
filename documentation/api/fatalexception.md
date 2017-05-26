---
layout: sidebar
title: FatalException
docs: true
section: /api
action_buttons: false
module: core
source: https://github.com/steeplejack-js/core/blob/master/src/exception/fatal.js
ioc: steeplejack-fatal-exception
---

**Extends:** [Exception](../exception)

This is an error that cannot be recovered from. This is likely to be either when a datastore cannot respond or 
similar. Ultimately, this would return an HTTP 5xx error (or equivalent).

```javascript
const { FatalException } = require('@steeplejack/core');

const err = new FatalException('some message');
```
