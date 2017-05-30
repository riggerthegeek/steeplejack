---
layout: sidebar
title: Plugin
docs: true
section: /api
action_buttons: false
module: steeplejack
source: https://github.com/steeplejack-js/steeplejack/blob/master/src/lib/plugin.js
ioc: steeplejack-plugin
---

**Extends:** [Base](../base)

Manages the registration and use of a Steeplejack plugin. This is so that whole sections of code, written in 
Steeplejack-friendly syntax, can be exported as a separate package and reused.

Isn't DRY code marvellous?

> The files added to the Plugin should export the same definition as all files, as specified in the
> [Dependency Injection](../../concepts/dependency-injection) section.

```javascript
const Plugin = require('steeplejack/lib/plugin');

const plugin = new Plugin([
  file1,
  file2
]);
```

# Properties

## modules

The modules set to the Plugin. Once added to an instance, you will not be able to remove a file from the list.

### Syntax

```javascript
plugin.modules = [{ ... }]

const modules = plugin.modules;
```

### Parameters

_none_

### Returns

_Object[]_

---
