---
layout: sidebar
title: View
docs: true
section: /api
action_buttons: false
module: steeplejack
source: https://github.com/steeplejack-js/steeplejack/blob/master/src/lib/view.js
ioc: steeplejack-view
---

**Extends:** [Base](../base)

If we need to render a route's output, this is how we tell the server strategy how to do it.

```javascript
const View = require('steeplejack/lib/view');

const obj = new View({
  data: {},
  headers: {},
  statusCode: 200,
  template: 'path/to/template'
});
```

# Methods

## getHeaders

Returns the headers object

### Syntax

```javascript
obj.getHeaders();
```

### Parameters

_none_

### Returns

_Object_

---

## getRenderData

Gets the render data

### Syntax

```javascript
obj.getRenderData();
```

### Parameters

_none_

### Returns

_Object_

---

## getStatusCode

Gets the status code

### Syntax

```javascript
obj.getStatusCode();
```

### Parameters

_none_

### Returns

_Number_

---

## getRenderTemplate

Gets the template to render

### Syntax

```javascript
obj.getRenderTemplate();
```

### Parameters

_none_

### Returns

_String_

---

# Static Methods

## render

Factory to create the View object. This is normally be the way you will use this class. 

### Syntax

```javascript
View.render(template, data, [ statusCode = null [, headers = {} ] ]);
```

### Parameters

**template**
  String. The template name to use.

**data**
  Object. The object to pass into the template.

**statusCode**
  Number. The status code to assign to the rendered page. Defaults to `null` (the server strategy will decide how to 
  handle this).

**headers**
  Object. Key/value pairs of any response headers to set.

### Returns

_String_

---
