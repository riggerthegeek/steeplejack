---
layout: sidebar
title: Socket
docs: true
section: /api
action_buttons: false
module: steeplejack
source: https://github.com/steeplejack-js/steeplejack/blob/master/src/lib/socket.js
ioc: steeplejack-socket
---

**Extends:** [Base](../base)

Socket strategy. This adds socket capability to a server.

```javascript
const Socket = require('steeplejack/lib/socket');

const obj = new Socket(socketStrategy);
```

```typescript
interface SocketStrategy {
    broadcast(request: SocketRequest, broadcast: SocketBroadcast): void;
    connect(nameSpace: string, middleware: Function[]): SocketStrategy;
    createSocket(server: http.Server): void;
    disconnect(socketConnection: any): void;
    getSocketId(socketConnection: any): string;
    joinChannel(socketConnection: any, channel: string): void;
    leaveChannel(socketConnection: any, channel: string): void;
    listen(socketConnection, any, event: string, iterator: Function): void;
}
```

# Methods

## listen

Makes the socket server listen for socket connections.

### Syntax

```javascript
obj.listen(request, event, socketFn);
```

### Parameters

**request**
  SocketRequest. Instance of the [SocketRequest](../socketrequest)

**event**
  String. The event to listen for.
  
**socketFn**
  Function. The function to be invoked when called. This is converted to a promise.


### Returns

_undefined_

---

## namespace

Adds a new namespace to the socket server. This is synonymous with an HTTP route.

### Syntax

```javascript
obj.namespace(namespace, events);
```

### Parameters

**namespace**
  String. The namespace we're connecting on.
  
**events**
  Object. The functions to apply. If there are any keys that match the results of `Socket.connectFlag` or 
  `Socket.middlewareFlag` these are applied either on connection or as middleware for every event.

### Returns

_Socket_

---
