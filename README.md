# steeplejack   

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Node.js Version][node-version-image]][node-version-url]
[![Build Status][travis-image]][travis-url]
[![Gitter][gitter-image]][gitter-url]
[![Dependencies][dependencies-image]][dependencies-url]
[![Dev Dependencies][dev-dependencies-image]][dev-dependencies-url]

A NodeJS scaffolding framework.

It enables you to quickly build module applications and for new modules to be available simply with the file being
present.  It's built with [Inversion of Control](http://en.wikipedia.org/wiki/Inversion_of_control) at it's core, so
that adding new modules becomes as simple as adding the files to your project.  It also provides routing, any HTTP
strategy you care to use and powerful data models that ensures your data is correct and valid. 

# Features
 - Inversion of Control container
 - A single config object that is aware of environment variables and command line arguments
 - Data models and collections
 - File-based routing
 - Rely on Express, Restify for your HTTP layer or write your own
 - Logging via Bunyan or Log4JS or your own provider
 - Class inheritance without ever touching the `util` module
 - Enhanced errors
 - [100% code coverage](https://coveralls.io/r/riggerthegeek/steeplejack)

# Installation

You need NodeJS and NPM installed to install this.  It's [tested](https://travis-ci.org/riggerthegeek/steeplejack)
on NodeJS 0.8 and above and on io.js 1.04 and above

    npm install steeplejack

# Documentation

Full documentation can be found at [http://riggerthegeek.github.io/steeplejack](http://riggerthegeek.github.io/steeplejack)

# License

MIT License

[npm-image]: https://img.shields.io/npm/v/steeplejack.svg?style=flat
[downloads-image]: https://img.shields.io/npm/dm/steeplejack.svg?style=flat
[node-version-image]: https://img.shields.io/badge/node.js-%3E%3D_0.8-brightgreen.svg?style=flat
[travis-image]: https://img.shields.io/travis/riggerthegeek/steeplejack.svg?style=flat
[dependencies-image]: http://img.shields.io/david/riggerthegeek/steeplejack.svg?style=flat
[dev-dependencies-image]: http://img.shields.io/david/dev/riggerthegeek/steeplejack.svg?style=flat
[gitter-image]: https://badges.gitter.im/Join%20Chat.svg

[npm-url]: https://npmjs.org/package/steeplejack
[node-version-url]: http://nodejs.org/download/
[travis-url]: https://travis-ci.org/riggerthegeek/steeplejack 
[downloads-url]: https://npmjs.org/package/steeplejack
[dependencies-url]: https://david-dm.org/riggerthegeek/steeplejack
[dev-dependencies-url]: https://david-dm.org/riggerthegeek/steeplejack#info=devDependencies&view=table
[gitter-url]: https://gitter.im/riggerthegeek/steeplejack?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge
