# [Scandiojs](http://scandio.de/) - A little bit of help

[![Build Status](https://travis-ci.org/scandio/scandiojs.png?branch=master)](https://travis-ci.org/scandio/scandiojs)

## You only want to use scandiojs

*Scandiojs* is registered as a bower component. In a project with bower setup running `bower install scandiojs --save` will install *scandiojs* and put it as a dependency into your project's `bower.json`.

For a project without bower just navigate to the `dist` directory and pick the latest [development](https://github.com/scandio/scandiojs/blob/master/dist/scandio.js) or [production](https://github.com/scandio/scandiojs/blob/master/dist/scandio.min.js) version.
You might aswell pick up the [sourcemap](https://github.com/scandio/scandiojs/blob/master/dist/scandio.min.map) file if you're on a recent browser and familiar with sourcemaps.

*Note:* If you're intend on using the DOM-Logging functionality, you should also pick up the [css-file](https://github.com/scandio/scandiojs/blob/master/dist/scandio.css) to get some styling.

## Diving into scandiojs

You can check out some examples after cloning *scandiojs* by looking at the `/example` directory. The `index.html` shows and executes every function call the `index.js` which currently covers almost every function available in *scandiojs*.

Furthermore, you can check out the *annotated source* residing in the `/docs` directory. It's automatically generated during the build process (`Gruntfile.js`) by [Docco](http://jashkenas.github.io/docco/).

Lastly, if you just want to checkout the latest version of the documented source code, just dig into [scandio.js](https://github.com/scandio/scandiojs/blob/master/dist/scandio.js) file.

## Extending scandiojs

You can easily extend *scandiojs* so it more suits your own needs using the `ß.util.mixin-fn`. The [test/featurerequest/src/template.js](https://github.com/scandio/scandiojs/blob/master/test/featurerequests/src/template.js) contains an example for this. Testing your code is also fairly easy and already setup. Just have a look at the [test/featurerequest/test/template.js](https://github.com/scandio/scandiojs/blob/master/test/featurerequests/test/template.js).

For further information please refer to the [CONTRIBUTING.md](https://github.com/scandio/scandiojs/blob/master/CONTRIBUTING.md).

## What you need to build scandiojs

In order to build *scandiojs*, you need to have *Node.js* (~0.10.x) and *npm* (~1.3.x) and *git* ~1.7.
(Earlier versions might work OK, but are not tested and who likes to live in the past.)

For *Windows* you have to download and install [git](http://git-scm.com/downloads) and [Node.js](http://nodejs.org/download/).

Mac OS users should just install [Homebrew](http://mxcl.github.com/homebrew/). Once *Homebrew* is installed, run `brew install git` to install *git*, `brew install node` for *Node.js* and `brew install npm` for *npm*.

Linux/BSD users should use their appropriate package managers to install *git* and *Node.js*, or build from source if you swing that way. Easy-peasy.

## Build your own version of scandiojs

First, clone a copy of the main *scandiojs* git repo by running:

```bash
git clone git://github.com/scandio/scandiojs.git
```

Install the [grunt-cli](http://gruntjs.com/getting-started#installing-the-cli) and [bower](http://bower.io/) packages if you haven't before. These should be done as global installs:

```bash
npm install -g grunt-cli bower
```

Enter the *scandiojs* directory and install the *Node.js* and *Bower* dependencies, this time *without* specifying a global-option (-g) install:

```bash
cd scandiojs && npm install
```

Then, to get a complete, minified (w/ Uglify.js), linted (w/ JSHint) version of *scandiojs*, type the following:

*Note:* All builds are always available in the `dist` folder. You might also want to pump up the version number in the `package.json` before you build your own version to not overwrite previous ones.

```bash
grunt dist
```

As already mentioned, the built version of *scandiojs* will be compiled into in the `dist/` subdirectory, along with the minified copy and associated sourcemap-file.

## Test your changes or build

You can also refer to the [CONTRIBUTING.md](https://github.com/scandio/scandiojs/blob/master/CONTRIBUTING.md) for more detailed information which is helpful after you added a feature-request and you want to test your code.

In order to test your build or any changes you made you should run:

```bash
cd scandiojs
```

You should test your code using [testem](https://github.com/airportyh/testem): just type (if testem is not installed `npm install testem -g`):

```bash
grunt test-em
```

will spin-up a *testem* server running tests in Safari, Chrome and Firefox.

You can also manually spin-up `testem` and run the testsuite by navigating to the URL given by the *testem*-runner.