# How to contribute

Third-party additions are essential for a project like this. *Scandiojs* is open for any changes and suggestions and will try to incorporate your own ideas.
We only demand a few thing of you to get your code added to this library.

## Getting started to code

* Make sure you have a [GitHub account](https://github.com/signup/free)
* [Fork](https://github.com/scandio/scandiojs/fork) the repository on GitHub into your own account
* Create a topic branch from where you want to base your work of.
  * This is usually the master branch.
  * To quickly create a topic branch based on master: `git branch
    feature/my-addition master` then checkout the new branch with `git checkout feature/my-addition`
* Make commits of logical units.
* Check for unnecessary whitespace with `git diff --check` before committing.
* Make sure your commit messages are in the proper format.

# Write your little module or addition

We only demand that you follow a simple TDD/BDD approach before adding your features.

Have a look at the `test/featurerequests`-directory and checkout the `src`- and `test`-subdirectory. The `src`-directory will contain your feature as a mixin while its under development. You can use the `src/template.js`-file as a blueprint.

After creating your own module file (e.g. tde_string.js) from the `template.js`-file you create your own module which mixes in functions into `scandiojs`. You could also mixin functions the the global object by omitting the namespace as `null`. But beware: you can also overwrite existing functionality which might be unintended and might also break exisiting specs.

You're now ready to test your code after you created testsuite under `test/featurerequests` using the `test/template.js`-file. After adding the tests you think nessesary and letting them pass by following the intructions in the `README.md` (running *testem* with `grunt test-em` or `testem`) you should open a pull request and wait for us to check it out.

After we decided to like what you did, we'll move the code from the `featurerequest/src/tde_string.js`-file into the library and get back to you!

## Submitting Changes

* Push your changes to a topic branch in your fork of the repository.
* Submit a pull request to the repository.
* Wait for us to check our your code!