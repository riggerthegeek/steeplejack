# Steeplejack

[![Gitter][gitter-image]][gitter-url]
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Node.js Version][node-version-image]][node-version-url]
[![Build Status][travis-image]][travis-url]
[![Code Quality][quality-image]][quality-url]
[![Dependencies][dependencies-image]][dependencies-url]
[![Dev Depedencies][dev-dependencies-image]][dev-dependencies-url]

An easy way of making a [Twelve Factor App](http://12factor.net) in NodeJS

## What is Steeplejack?

The goal of this project is to write reusable applications, using reusable components in whatever flavour of JavaScript
you want.

When creating a new project, you need to set up the same things over and over again - your data models and collections,
your dependency injection, your HTTP server, your routing and your logging. With Steeplejack, this is all there by
default allowing you to get straight into your coding.

This is not a framework, it is scaffolding for modules. It doesn't tell you how to write your software, it just lets you do
it. You can use [Express](http://expressjs.com) or [Restify](http://restify.com) as your HTTP strategy or even one of your
own. So long as it satisfies the strategy, it doesn't care.

Almost every application will require some form of data storage. It's likely there will be some form of user management
too. In the most part, these will be the same across all your projects. So, write these as plugins and use them across
multiple projects rather than write it afresh each time.

## What makes the Twelve Factor App so great?

Pick any of the following reasons:

 - makes your software more robust
 - makes your software truly scalable
 - you can give true long-term support for your software
 - happier developers

Steeplejack adds to this by:

 - allowing you to reuse your code in the form of plugins
 - being stupidly easy to set up a new server
 - things needed in every piece of software - error logging, data modelling and routing - are provided out-of-the-box

## Config

> A litmus test for whether an app has all config correctly factored out of the code is whether the codebase could be
> made open source at any moment, without compromising any credentials.
>
> [Twelve Factor App: Config](http://12factor.net/config)

A lot of developers still specify all the different config environments in their config file. That was great when we
wrote PHP and there were only three instances; dev, test and live. The power of NodeJS comes from it's scalability - how
scalable is it going to be if, every time the operations guy wants to add a new server at 2am, you need to get out of
bed and add in a new environment in your config file?

Get rid of all the environments out of your config file and just have one (the development one, so you don't have to dig
around each time you download from the repo). For all other deployments of your software, use environment variables.
Then it's the deployer's responsibility to put in the right config and you can stay in bed.

Steeplejack offers a single config file that can be overwritten by either environment variables or command line
arguments. The application then has one single source of truth with your config and it's your choice how to specify the
deployment config.

## Data Modelling

The Twelve Factor App is all about loose coupling to your attached resources. You might start by using
[MongoDB](https://www.mongodb.org/), but there will be a time when that isn't the best solution. If you're using something like
[Mongoose](http://mongoosejs.com/), you are tied-in to MongoDB regardless.

The data modelling in Steeplejack is all about the data - it doesn't care where you store it, if indeed anywhere. The
data is designed to be used by your application and stored in a way you decide. If your model doesn't match your data
store exactly, no problem. There is a loose link between the model and the storage.

When you're dealing with lots of models, you can create a collection. Maybe you get your data from multiple sources
and want to sort it in the application. Steeplejack allows you to write a simple method to do that.

# Why's it called 'Steeplejack'?

When I started thinking about a scaffolding project, I was watching a [Fred Dibnah](http://www.freddibnahheritagecentre.com) documentary.
Fred was a great enthusiast of beautiful engineering. It struck me as a great metaphor for what I was trying to achieve. By trade, Fred
was a steeplejack, so the name is a little nod to him.

[![Fred Dibnah](https://img.youtube.com/vi/3R3-YwDZrzg/0.jpg)](https://www.youtube.com/watch?v=3R3-YwDZrzg)

# License

MIT License

[npm-image]: https://img.shields.io/npm/v/steeplejack.svg?style=flat
[downloads-image]: https://img.shields.io/npm/dm/steeplejack.svg?style=flat
[node-version-image]: https://img.shields.io/badge/node.js-%3E%3D_0.10-brightgreen.svg?style=flat
[travis-image]: https://img.shields.io/travis/riggerthegeek/steeplejack.svg?style=flat
[dependencies-image]: https://img.shields.io/david/riggerthegeek/steeplejack.svg?style=flat
[dev-dependencies-image]: https://img.shields.io/david/dev/riggerthegeek/steeplejack.svg?style=flat
[gitter-image]: https://img.shields.io/badge/GITTER-JOIN%20CHAT%20%E2%86%92-1DCE73.svg?style=flat
[quality-image]: https://www.bithound.io/github/riggerthegeek/steeplejack/badges/score.svg


[npm-url]: https://npmjs.org/package/steeplejack
[node-version-url]: http://nodejs.org/download/
[travis-url]: https://travis-ci.org/riggerthegeek/steeplejack
[downloads-url]: https://npmjs.org/package/steeplejack
[dependencies-url]: https://david-dm.org/riggerthegeek/steeplejack
[dev-dependencies-url]: https://david-dm.org/riggerthegeek/steeplejack#info=devDependencies&view=table
[gitter-url]: https://gitter.im/riggerthegeek/steeplejack?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge
[quality-url]: https://www.bithound.io/github/riggerthegeek/steeplejack
