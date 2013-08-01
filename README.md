# [Scandiojs](http://scandio.de/) - A little bit of help

## What you need to build scandiojs

In order to build scandiojs, you need to have Node.js/npm latest and git 1.7 or later.
(Earlier versions might work OK, but are not tested and who likes to live in the past.)

For Windows you have to download and install [git](http://git-scm.com/downloads) and [Node.js](http://nodejs.org/download/).

Mac OS users should just install [Homebrew](http://mxcl.github.com/homebrew/). Once Homebrew is installed, run `brew install git` to install git, and `brew install node` to install Node.js.

Linux/BSD users should use their appropriate package managers to install git and Node.js, or build from source if you swing that way. Easy-peasy.

## Build some scandiojs

First, clone a copy of the main scandiojs git repo by running:

```bash
git clone git://github.com/scandiojs/scandiojs.git
```

Install the [grunt-cli](http://gruntjs.com/getting-started#installing-the-cli) and [bower](http://bower.io/) packages if you haven't before. These should be done as global installs:

```bash
npm install -g grunt-cli bower
```

Enter the scandiojs directory and install the Node and Bower dependencies, this time *without* specifying a global(-g) install:

```bash
cd scandiojs && npm install
```

Then, to get a complete, minified (w/ Uglify.js), linted (w/ JSHint) version of scandiojs, type the following:

```bash
grunt dist
```

The built version of scandiojs will be put in the `dist/` subdirectory, along with the minified copy and associated map file.