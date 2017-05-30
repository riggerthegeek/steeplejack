---
layout: sidebar
title: SocketRequest
docs: true
section: /api
action_buttons: false
module: steeplejack
source: https://github.com/steeplejack-js/steeplejack/blob/master/src/lib/socket.js
ioc: steeplejack-socket
---

**Extends:** [Base](../base)

This request object is how we work with a socket, so we can have a consistent interface to work with.
 
```javascript
const SocketRequest = require('steeplejack/lib/socketRequest');

const obj = new SocketRequest(socket, socketStrategy);
```

# Methods

## broadcast

This is used to talk to the socket connect. This is emitted to the broadcast event.

### Syntax

```javascript
obj.broadcast(broadcast);
```

### Parameters

**broadcast**
  Object. Broadcasted object. 

### Returns

_SocketRequest_

---

## disconnect

Kills the socket connection

### Syntax

```javascript
obj.disconnect();
```

### Parameters

_none_

### Returns

_SocketRequest_

---

## getId

Gets the socket connection ID

### Syntax

```javascript
obj.getId();
```

### Parameters

_none_

### Returns

_string_

---

## joinChannel

Adds this socket to a given channel. This will help with broadcasting between different entities, such as when remote
controlling a device.

### Syntax

```javascript
obj.joinChannel(channel);
```

### Parameters

**channel**
  String. The channel to join.

### Returns

_SocketRequest_

---

## leaveChannel

Tells this connection to leave a particular channel.

### Syntax

```javascript
obj.leaveChannel(channel);
```

### Parameters

**channel**
  String. The channel to leave.

### Returns

_SocketRequest_

---
