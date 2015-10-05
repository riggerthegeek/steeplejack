---
layout: api
title: Logger
permalink: /api/logger/
section: api

source: src/library/Logger.js
description: |
    A strategy pattern that presents a consistent interface for the Logger class.  Individual logger types
    (eg, [Bunyan](https://github.com/trentm/node-bunyan), [Log4JS](https://github.com/nomiddlename/log4js-node))
    should extend this.
extends:
    url: /api/base/
    name: Base
api:
    -
        type: method
        items:
            -
                name: setLevel(level)
                desc: |
                    Sets the log level to one of fatal, error, warn, info, debug or trace. If a log message is found
                    that is below this level, it won't be recorded. Defaults to "error".
            -
                name: fatal(message)
                returns: object
                desc: |
                    Dispatches to the `_trigger` method in the strategy, with the values `6` and the message to be
                    handled by the strategy.
            -
                name: error(message)
                returns: object
                desc: |
                    Dispatches to the `_trigger` method in the strategy, with the values `5` and the message to be
                    handled by the strategy.
            -
                name: warn(message)
                returns: object
                desc: |
                    Dispatches to the `_trigger` method in the strategy, with the values `4` and the message to be
                    handled by the strategy.
            -
                name: info(message)
                returns: object
                desc: |
                    Dispatches to the `_trigger` method in the strategy, with the values `3` and the message to be
                    handled by the strategy.
            -
                name: debug(message)
                returns: object
                desc: |
                    Dispatches to the `_trigger` method in the strategy, with the values `2` and the message to be
                    handled by the strategy.
            -
                name: trace(message)
                returns: object
                desc: |
                    Dispatches to the `_trigger` method in the strategy, with the values `1` and the message to be
                    handled by the strategy.
---
