---
layout: default
title: Config and Environment Variables
permalink: /docs/getting-started/config/
---

Now we've got our skeleton app up and running, let's look at configuration.  This was one of the original reasons why
steeplejack was written was irritation at other frameworks seemingly never thinking of how the developer uses config.
Usually, the developer will have their dev machine set up with one set of config variables which then changes when the
app is deployed on the CI box, which is different from the QA and live environments.

> If you're working on a project and the configuration is the same throughout any of dev, QA or live then please
> think about the security implications of this and change them so they're unique to each environment.

The config is designed as a [single source of truth](http://en.wikipedia.org/wiki/Single_Source_of_Truth).  Any values
set in the config are registered with the [Dependency Injector]({{ '/docs/api/dependency-injection' | prepend: site.baseurl }})
under the `$config` variable.

### Environment Variables

Environment variables are a great way of changing config values.  Think about database connection parameters: in
development, your password might simply be `password` but for live you would have a long, randomly generated password.

Let's go back to our `app.js` file and fill out the config more fully (as we're only looking at the config, that's
all I'm focusing on here):

    steeplejack
        .app({
            config: {
                port: 3000,
                db: {
                    host: "localhost",
                    port: 12345,
                    username: "app",
                    password: "password"
                }
            }
        })
        .on("start", function (config) {
            console.log(config);
        });

These are our development values.  If we run `node app.js`, we get the config output to the command line.

    {
      "port": 3002,
      "db": {
        "host": "localhost",
        "port": 12345,
        "username": "app",
        "password": "password"
      }
    }

So far, so obvious. But let's say that, in live, we wanted to override that.  We can specify an env object where we put
the names of the environment variables to look for.

    steeplejack
        .app({
            config: {
                port: 3000,
                db: {
                    host: "localhost",
                    port: 12345,
                    username: "app",
                    password: "password"
                }
            },
            env: {
                db: {
                    host: "DB_HOST",
                    port: "DB_PORT",
                    username: "DB_USERNAME",
                    password: "DB_PASSWORD"
                }
            }
        });

Now run the command with environment variables set. `DB_PORT=12346 DB_PASSWORD=newpassword node app.js`, you should see
some changes.

    {
      "port": 3000,
      "db": {
        "host": "localhost",
        "port": 12346,
        "username": "app",
        "password": "newpassword"
      }
    }

See how both the port and the password have changed.  Also, see how the port is a `Number` - this is because steeplejack
typecasts where appropriate.  If it sees a numeric value, or true/false it'll change the datatype too.

### Command Line Arguments

Sometimes you might also want to see what happens when you start your application with certain parameters but don't
want to set an environment variable. When running a steeplejack app, it also listens for command line arguments too.

> It's important to note that if you have both an environment variable and a command line argument set, the argument
> will win.

There's no config involved in the application for this, just add things to the run command. Let's try out command
again `node app.js port=9999 db.password=wrongpassword`.  This gives:

    {
      "port": 9999,
      "db": {
        "host": "localhost",
        "port": 12345,
        "username": "app",
        "password": "wrongpassword"
      }
    }

Notice how we can traverse into objects by using the dot notation `db.password`.  Also, with arguments, it will add
things in if they don't exist in the config object.  And if you don't set a value, it'll set it as `true`.  Let's see
what happens when we run `node app.js port=9998 test server.logging=false`.

    {
      "port": 9998,
      "db": {
        "host": "localhost",
        "port": 12345,
        "username": "app",
        "password": "password"
      },
      "test": true,
      "server": {
        "logging": false
      }
    }

We've still overridden the `port` value and we've created a `test` boolean and a `server` object.

<a href="{{ '/docs/getting-started/running-your-app' | prepend: site.baseurl }}" class="prev_button">Running Your App</a>
