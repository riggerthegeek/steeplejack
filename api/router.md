---
layout: api
title: Router
permalink: /api/router/
section: api

source: src/library/Router.js
description: |
extends:
api:
    -
        type: method
        items:
            -
                name: getRoutes()
                returns: object
                desc: Gets the set routes
            -
                name: setRoute(obj, route)
                returns:
                desc: |
                    Sets a new route
    -
        type: static
        items:
            -
                name: discoverRoutes(routeDir)
                returns: array
                desc: |
                   This is discovers the route files in the given route directory and then loads them up.  It then
                   returns an array of route functions that can be used.
            -
                name: getRouteFiles(parent)
                returns: object
                desc: |
                    Gets the route files.  Whilst it's not terribly good form to do synchronous file tasks, as this is
                    only run once and before the server starts, it's acceptable.
---
