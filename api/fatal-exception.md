---
layout: api
title: Fatal Exception
permalink: /api/fatal-exception/
section: api

source: src/error/Fatal.js
description: |
 A fatal exception should be used when something has gone wrong that cannot be recovered from by the user.  Normally,
 this would be something like a database has failed or a service is unavailable.

 This is exactly the same as the Exception, save for the `type` which is set to `Fatal`.
extends:
    url: /api/exception/
    name: Exception
---
