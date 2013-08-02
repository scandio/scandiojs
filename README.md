# [Scandiojs](http://scandio.de/) - A little bit of help

## What you need to build scandio.js

In order to build scandio.js, you need to have Node.js/npm latest and git 1.7 or later.
(Earlier versions might work OK, but are not tested and who likes to live in the past.)

For Windows you have to download and install [git](http://git-scm.com/downloads) and [Node.js](http://nodejs.org/download/).

Mac OS users should just install [Homebrew](http://mxcl.github.com/homebrew/). Once Homebrew is installed, run `brew install git` to install git, and `brew install node` to install Node.js.

Linux/BSD users should use their appropriate package managers to install git and Node.js, or build from source if you swing that way. Easy-peasy.

## Build some scandio.js

First, clone a copy of the main scandio.js git repo by running:

```bash
git clone git://github.com/scandio.js/scandiojs.git
```

Install the [grunt-cli](http://gruntjs.com/getting-started#installing-the-cli) and [bower](http://bower.io/) packages if you haven't before. These should be done as global installs:

```bash
npm install -g grunt-cli bower
```

Enter the scandio.js directory and install the Node and Bower dependencies, this time *without* specifying a global(-g) install:

```bash
cd scandiojs && npm install
```

Then, to get a complete, minified (w/ Uglify.js), linted (w/ JSHint) version of scandio.js, type the following:

```bash
grunt dist
```

The built version of scandio.js will be put in the `dist/` subdirectory, along with the minified copy and associated map file.

## Test your changes or build

This part should also be read after checking out the [CONTRIBUTING.md](https://github.com/scandio/scandiojs/blob/master/contributing.md) after you added a feature-request and you want to test your code.

In order to test your build or any changes you made you should run:

```bash
cd scandiojs

java -jar node_modules/grunt-jstestdriver/lib/jstestdriver.jar --port 9876
```

Navigate the browsers you want to test in to: `http://localhost:9876/capture` and finally run:

```bash
grunt test
```

This will fire up `JSTestDriver` and run the testsuite. You may also want to change additional test cases or featurerequests written by modifying the `jsTestDriver.conf` in the project's root-directory.