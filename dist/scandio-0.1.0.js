/*!
 * scandio.js JavaScript Library
 * http://scandio.js/
 *
 * Copyright 2013 Scandio GmbH and other contributors
 * Released under the MIT license
 */

 /*global console*/
 /*jslint browser: true*/

 // Setup the library
 // ---------------
 ;(function(root, $, window, undefined) {
  // We're strict and in strict-mode: no aruguements.callee and globally leaking vars etc
  "use strict";

  //Establish the root
  root = root || this;

  // Sets up a global set of variables
   var
      ß                  = null,
      loadedJs           = {},
      scandioHtmlClass   = 'scandio-js',
      $scandioEl         = null,
      // Previous version for `ß.noConflict`
      previousScandio    = root.ß,
      // Breaker for loop iteration
      breaker            = {},
      // Set of shorthand to object protos
      ArrayProto         = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype,
      document           = window.document,
      location           = window.location,
      events             = $('<a>'),
      modules            = { sequence: [] },
      // Console methods to be caught when not defined in browser (IE I hear you)
      consoleMethods     = ['assert', 'clear', 'count', 'dir', 'dirxml',
                          'exception', 'group', 'groupCollapsed', 'groupEnd',
                          'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
                          'timeStamp', 'trace'],
      // Log methods to be caught and routed to `ß.debug`
      logMethods         = ['error', 'warn', 'info', 'debug', 'log'],

   // All the important native methods shorthanded and used if defined in e.g. `ß.each`

      push               = ArrayProto.push,
      slice              = ArrayProto.slice,
      concat             = ArrayProto.concat,
      toString           = ObjProto.toString,
      hasOwnProperty     = ObjProto.hasOwnProperty,
      nativeForEach      = ArrayProto.forEach,
      nativeMap          = ArrayProto.map,
      nativeReduce       = ArrayProto.reduce,
      nativeReduceRight  = ArrayProto.reduceRight,
      nativeFilter       = ArrayProto.filter,
      nativeEvery        = ArrayProto.every,
      nativeSome         = ArrayProto.some,
      nativeIndexOf      = ArrayProto.indexOf,
      nativeLastIndexOf  = ArrayProto.lastIndexOf,
      nativeIsArray      = Array.isArray,
      nativeKeys         = Object.keys,
      nativeBind         = FuncProto.bind,
      nativeTrim         = String.prototype.trim,
      nativeTrimRight    = String.prototype.trimRight,
      nativeTrimLeft     = String.prototype.trimLeft,

   // Defining one self
   Scandio = function(obj) {
      // If already instance return
      if (obj instanceof Scandio) { return obj; }
      // Otherwise creates new instance
      if (!(this instanceof Scandio)) { return new Scandio(obj); }

      // for chaining
      this._wrapped = obj;
   },

   // Catches all possible console calls if they are undefined
   _catchConsole = function() {
      var
         method,
         noop     = function () {},
         methods  = logMethods.concat(consoleMethods),
         length   = methods.length,
         console  = (window.console = window.console || {});

         // Loop over all methods (log and console)
         while (length--) {
            method = methods[length];

            // Bind a noop to call if not defined
            if (!console[method]) { console[method] = noop; }
         }
   },

   _injectDom = function() {
      $(function() {
         if ( $(scandioHtmlClass).length === 0 ) {
            $scandioEl = $('<div/>', {
                class: scandioHtmlClass
            }).appendTo('body');
         }
      });
   },

   // Any call to subordinate initialization function goes here
   // *Note:* We're in pre-creation state
   _initialize = function() {
      // As the adove catching of console calls
      _catchConsole();
      _injectDom();
   };

   // Intialize
   _initialize();

   // Create yerself
   ß = root.ß = root.Scandio = Scandio;

   // Version of our library
   ß.VERSION   = '0.0.1';
// DOM functionality
// ---------------

// Register dom namespace on scandiojs object

ß.dom = {};

// Closes and secures a cache module with within its own scope
// *Note:* This function being an IIFE leaves of parameters on outer function
ß.dom.cache = (function($, ß){
   // Sets up local cache store
   var
      cache = {},

      // Handler of DOMNodeRemoved handling external node removals
      // Sorry, I didn't hack this
      nodeRemoved = function(event) {
         var label, coll, l, t = event.target;
         for (label in cache) {
            l = (coll = cache[label]).length;
            while (l--) {
               if (coll[l] === t || $.contains(t,coll[l])) {
                  delete coll[l]; --coll.length;
               }
            }
         }
      },

      // Updates complete cache or scoped to a label
      update = function(label) {
         // Passed in label is string, scoping to that label
         if (ß.isString(label)) {
            //Reset cache value at label
            if(cache[label] !== undefined) {
               cache[label] = $(cache[label].selector || '');
            }
         } else {
            // For each value in cache refresh it
            ß.util.each(cache, function($cached, label) {
               cache[label] = $($cached.selector);
            });
         }
      },

      // Gets a value from cache or loads it from DOM
      get = function(label, selector) {
         // Both label and selector passed, cache/dom reading...
         if (ß.isString(selector) && ß.isString(label)) {
            // ...either from cache or DOM
            cache[label] = cache[label] || $(selector);
         }

         // What the callee gets: a jQuery object
         return cache[label];
      };

   // Bind to node removal in DOM
   $(document).on('DOMNodeRemoved', nodeRemoved);

   // Return public functions in object literal
   return {
      get:     get,
      update:  update
   };
}(jQuery, ß));
// Debug/logging module
// ---------------

// Sets up logger object with level and log-history
ß.logger = {
   level: 5,
   logs: {},
   logDom: true
};

ß.debug = {};

// `ß.debug` will get a set of methods (*see return-statement*)
ß.debug = (function(){
   var
      console              = window.console,
      length               = logMethods.length,
      methods              = {},
      logOuterWrapperPath  = 'scandio-log',
      $loggerEl            = null,
      alertEls = {
         debug: 'info',
         error: 'danger',
         info: 'info',
         log: 'success',
         warn: 'warning'
      },
      // Closes the scope for `method and level`
      // *Note:* Due to js and its state-maintainance for closures
      // the last passed argument would otherwise win
      createLogger = function (method, level) {
         var
            logElWrapperPath     = logOuterWrapperPath + '--' + method,
            logElInnerPath       = 'alert alert-' + alertEls[method] || method,
            logElIdentifier      = '.alert.alert-' + alertEls[method] || method,
            $logEl               = [];

         // Sets up history for the log-method
         ß.logger.logs[method] = [];

         if (ß.logger.logDom === true) {
            $(function() {
               $loggerEl.append(
                  $('<div/>', {
                     class: logElWrapperPath
                  }).html(
                     $('<div />', {
                        class: logElInnerPath
                     })
                  )
               );
            });
         }

         ß.dom[method] = function() {
            var args = slice.call(arguments);

            if ($logEl.length === 0) { $logEl = $(logElIdentifier); }

            if (ß.logger.logDom && $logEl.length > 0) { $logEl.append(args.join(', ') + '<hr />'); }
         };

         // The return value's log-type gets a function
         methods[method] = function() {
            // Lets get some arguments
            var args = slice.call(arguments);

            // Only log to console if required by level
            if (ß.logger.level > level) {
               console[method].apply(console, args);
               if (ß.logger.logDom === true) { ß.dom[method].apply(ß, args); }
            }

            // but always push it to history
            ß.logger.logs[method].push(args.join(', '));
         };
      };

   if (ß.logger.logDom === true) {
      $(function() {
         $loggerEl = $('<div/>', {
            class: logOuterWrapperPath
         }).appendTo($scandioEl);
      });
   }

   // For every console-method
   while(length--) { createLogger(logMethods[length], length); }

   // Now the `ß.debug`-object gets its functions
   return methods;
})();// Utility functions
// ---------------

// Register util namespace on scandiojs object
ß.util = {};

// Nothing too fancy: shorthand to `hasOwnProperty`
ß.util.has = function(obj, key) {
   return hasOwnProperty.call(obj, key);
};

// Iterates over an `object` with an `iterator` in an optional `context`
// Falls back to nativeForEach if supported by browser (on prototpye)
ß.util.each = ß.forEach = function(obj, iterator, context) {
   var
      key   = null,
      i     = null,
      l     = null;

   // Nothing to iterate, somewhat funny eh?
   if (obj === null || obj === undefined) { return; }

   // Fall back to native foreach which is faster in newer browsers
   if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
   }

   // Passed `obj` has a length property, meaning its an array
   // and an optimized for-loop can be used.
   else if (obj.length === +obj.length) {
      // Iterate over length of `obj`
      for (i = 0, l = obj.length; i < l; i++) {
         // …call the `iterator`-function and return if its the breaker (done)
         if (iterator.call(context, obj[i], i, obj) === breaker) { return; }
      }
   }

   // Iterate over object
   else {
      // For each key in obj
      for (key in obj) {
         // Only if it hasOwnProperty
         if (ß.util.has(obj, key)) {
            // …call the `iterator`-function and return if its the breaker (done)
            if (iterator.call(context, obj[key], key, obj) === breaker) { return; }
         }
      }
   }
};

// Extends an object with all the arguments passed in other object
ß.util.extend = function(obj) {
   // `obj` is destination `arguments`-2nd parater is source
   ß.util.each(slice.call(arguments, 1), function(source) {
      // Source is set
      if (source) {
         // For every property in source
         for (var prop in source) {
            // Set it on the object without checking prior existence
            obj[prop] = source[prop];
         }
      }
   });

   return obj;
};

// Iterates over an `object` with an `iterator` in an optional `context`
// while results will only contain values if they pass the `iterator`-test
ß.util.filter = function(obj, iterator, context) {
   // What will be returned
   var results = [];
   // Nothing to iterate
   if (obj === null || obj === undefined) { return results; }

   //Fallback to native filter for performance reasons
   if (nativeFilter && obj.filter === nativeFilter)
         { return obj.filter(iterator, context); }

   // Foreach `value` with `index` and the `context` being `list`
   ß.util.each(obj, function(value, index, list) {
      // Push the value to `results` if test passes as specified in iterator
      if(iterator.call(context, value, index, list)) {
         results.push(value);
      }
   });

   return results;
};

// Accesses an obj by dot-notation allowing a default/notFound value
// *E.g.:* ß.util.dots("name.fullname", {name: {fullname: 'me'}}) returns me
ß.util.dots = function(dots, obj, notFound) {
   // Setup path and destination variables
   var
      dest   = obj,
      path   = dots.split('.'),
      i      = null;

   // Dig into the `path` an question the `obj`
   for(i = 0; i < path.length; i++) {
      // Found something on the `obj` and reset the destination
      if(obj) { dest = dest[path[i]]; }
      // Nothing found…
      else { dest = undefined; }
   }

   // Dest or notFound
   return dest || notFound;
};

// Collects all function from an object and returns an array containing them
// *E.g.:* calling it with ß.util.functions({capitalize: function() {return}, greet: 'hi'})
// would only return an array containing the `capitalize` function.
ß.util.functions = function(obj) {
   // Setup local variables
   var
      functions   = {},
      key         = null;

   // For each key in object…
   for (key in obj) {
      // …check if it is a function and push it to result
      if (ß.isFunction(obj[key])) { functions[key] = obj[key]; }
   }

   return functions;
};

// Allows for extending ß functionality by handing in an `namespace` and a object-literal
// containing the functions.
// *E.g.:* calling `ß.util.mixin('string', {capitalize: fn(string)})` makes the capitalize function
// available as in ß.string.capitalize('string').
ß.util.mixin = function(namespace, obj) {
   var
      destination = ß,
      path        = namespace.split("."),
      atModule    = null,
      i           = null;

   // Register the namespace if its not existent
   for (i = 0; i < path.length; i++) {
      // The current sub/module
      atModule = path[i];

      // Namespace not registered yet
      if (!destination[ atModule ]) {
         destination[ atModule ] = {};
      }

      // Sets the current pointer to module
      destination = destination[ atModule ];
   }

   // For each function on the passed in `obj` by name
   ß.util.each(ß.util.functions(obj), function(func, name) {
      // Defines the function on the destination module
      destination[name] = function() {
         // Merge args with wrapped object (constructor new ß(obj))
         var args = this._wrapped ? [this._wrapped] : [];
         push.apply(args, arguments);

         // The result of applying the function with ß and its args
         return func.apply(ß, args);
      };
   });
};
// Function for type-checking (no duck punching)
// ---------------

// This buils group of `is…`-typecheck functions
// For every type who's `toString` returns `[object […]]`
ß.util.each(['Array', 'Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
   // Create a function requiring an `object` as paramters
   ß['is' + name] = function(obj) {
      // Returning a boolean indicating if its type is the name
      return toString.call(obj) == '[object ' + name + ']';
   };
});

// Objects behave differently
ß.isObject = function(obj) {
   // An new object with the `obj` should be equal to itself
   // only if it is an object
   return obj === Object(obj);
};
// String functions
// ---------------

// Register string namespace on scandiojs object
ß.string = {};

// Capitalizes a given string (scandio becomes Scandio etc.)
ß.string.capitalize = function(string) {
   // First char gets upppercased every other char lowercased
   return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
};

// Lowercases a given string (ScanDiO becomes scandio)
ß.string.lower = function(string) {
   // Just everything to lowercase
   return string.toLowerCase();
};

// Cleans up the mess of a string ('  Scandio    GmbH   ' becomes 'Scandio GmbH')
ß.string.clean = function(string) {
   // Trims the mess (whitespace default) and replaces consecutive (s+) whitespaces within with one whitespace
   return ß.string.trim(string).replace(/\s+/g, ' ');
};

// Trims away the given characters around a given string (defaults to whitespace)
ß.string.trim = function(string, characters){
   // Uses nativeTrim if defined and no characters are given (not supported by native impl.)
   if (!characters && nativeTrim) {
      return nativeTrim.call(string);
   }

   // A RegExp starting at the beginning of the string, the string wrapped by the `characters`
   // replacing them around the `string`
   return String(string).replace(new RegExp('^' + characters + '+|' + characters + '+$', 'g'), '');
};

// Chops a string up `at` every position in the string `ß.string.chop('chopchop', 3) === 'cho pch op'`
ß.string.chop = function(string, at) {
   // Better make a string out of the passed in 'string'
   string = String(string);

   // Double NOT bitwise (sorta same as Math.floor())
   at = ~~at;

   // RegExp works like a UNIX expansion list, expanding around the whitespace from 1-to-at
   return at > 0 ? string.match(new RegExp('.{1,' + at + '}', 'g')) : [string];
};

// Finds a string within a string (fuzzy) e.g. `ß.string.contains('I'veADream', 'Dream') === true`
ß.string.contains = function(needle, haystack) {
   // Don't do work if no needle passed (but we've found something right!)
   if (needle === '') { return true; }
   // Empty haystack should also lead to some chilling without having found something
   if (haystack === null || haystack === undefined) { return false; }

   // Do the old trick of using `indexOf` of the haystack with the needle
   return String(haystack).indexOf(needle) !== -1;
};

// Checks if string starts with a given string
ß.string.starts = function(string, what) {
   // Wrap the passed in arguments in a String object for sanity
   string   = String(string);
   what     = String(what);

   // If the string is longer, equally long than the one it's supposed to start with
   // and if its slice from 0 to the starting string's length is the starting string
   return string.length >= what.length && string.slice(0, what.length) === what;
};

// Checks if string ends with a given string
ß.string.ends = function(string, what) {
   // Wrap the passed in arguments in a String object for sanity
   string   = String(string);
   what     = String(what);

   // If the string is longer, equally long than the one it's supposed to end with
   // and if its slice from the end to the length of its suppoed ending is equals to its ending
   return string.length >= what.length && string.slice(string.length - what.length) === what;
};

// Implodes/joins a string with a given glue
ß.string.implode = function(glue, pieces) {
   // Defaults the glue to empty string
   if (glue === null || glue === undefined) { glue = ''; }

   // Pipes call through join on pieces
   return pieces.join(glue);
};

// Explodes/splits a string with by given delimiter
// *Note:* Arguments are faked, it'll be sliced up in the function
ß.string.explode = function(string, delimiter) {
   // Wrap the passed in argument in a String object for sanity
   delimiter   = String(delimiter);
   string      = String(string);

   // Pipes passed in arguments through `split`
   return string.split(delimiter);
};// Timining functions
// ---------------

// Register timinig namespace on scandiojs object
ß.timing = {};

// Puts the breaks on a function which may be called to often
// such as scrolling or resizing callbacks.
// The function will actually be called after `release`-milliseconds elapsed
ß.timing.breaks = function(on, release) {
   // Initialize the context, arg, timeout and previous local variables
   var
      context = null,
      args = null,
      result = null,
      timeout = null,
      previous = 0,
      remaining = null,

      // Wrapper to be called if `release` has not elapsed yet
      toBeCalled = function() {
         // Timestamp of call
         previous = new Date();
         timeout = null;

         // Result being function on which brakes have been put
         result = on.apply(context, args);
      };

   // Returning a function which returns the execution's result
   return function() {
      // Where the function is in time
      var now = new Date();

      // If a previous call hasnt been made its now
      if (!previous) {
         previous = now;
      }

      // How much time remains until final execution of `on`
      remaining = release - (now - previous);

      // The function context and arguments
      context = this;
      args = arguments;

      // Time has elapsed, `on` can be called
      if (remaining <= 0) {
         // Clears all state
         clearTimeout(timeout);

         // This will break it on next call
         timeout = null;
         previous = now;
         result = on.apply(context, args);
      } else if (!timeout) {
         // Next execution round
         timeout = setTimeout(toBeCalled, remaining);
      }

      return result;
   };
};

// Delays a function execution `ms` milliseconds.
ß.timing.delay = function(fn, ms) {
   // Arguments are anything after `fn` and `ms`
   var args = slice.call(arguments, 2);

   // Return the result of setTimeout
   return setTimeout(function() {
         return fn.apply(null, args);
   }, ms);
};
// Function utilising ajax
// ---------------

// Register ajax namespace on scandiojs object
ß.ajax = {};

// Loads a in `requested` specified set of files from CDNs
// **Example:** ` ß.ajax.libs({cdnjs: [{repository: 'bacon.js', version: '0.6.8', file: 'Bacon.min.js'}]})`
// will be passed to the handler and inject the library as a `<scipt />` right after the html's head-section.
// **Callback** function for each cdn should be defined on the ß.cdns-object below.
ß.ajax.libs = function(requested) {
   // Iterate over each cdn holding multiple libs
   ß.util.each(requested, function(libs, cdn) {
      // Check if the cdn has a callback otherwise trigger warn-message
      if (ß.isFunction( ß.ajax.cdns[cdn] )) {
         // Invoke callback and…
         ß.util.each(libs, function(lib) {
            // …load the library
            ß.ajax.script(ß.ajax.cdns[cdn](lib.repository, lib.version, lib.file), lib.success || undefined);
         });
      } else {
         ß.debug.warn('CDN: ' + cdn + ' not defined in ß.ajax.cdns!');
      }
   });
};

// Object containing callback function per cdn invoked by requiring libs
// Every callback gets `repository, version and file` as parameters
ß.ajax.cdns = {
   // Callback for cdnjs called as in `ß.libs({cdnjss: [...]})`
   'cdnjs' : function(repository, version, file) {
      return "//cdnjs.cloudflare.com/ajax/libs/"+repository+"/"+version+"/"+file;
   }
};

// Loads a in `requested` specified set of files by folder
// **Example:** `ß.ajax.plugins({'scandio.js/example/scripts/': ['alert', 'log']});`
// will load alert and log from their respective folder.
// *Notes:* the extension is ommited and the path is relative to `window.location.origin`
ß.ajax.plugins = function(requested) {
   var
      url            = null,
      resultUrls     = [];

   // Each `requested`set of scripts
   ß.util.each(requested, function(scripts, folder) {
      // As script…
      ß.util.each(scripts, function(script) {
         // …and loading it by folder and script-name
         url = window.location.origin + '/' + folder + script + '.js';

         ß.ajax.script(url);

         resultUrls.push(url);
      });
   });

   return resultUrls;
};

// Loads a set of libs and plugin files based on a condition (the `when` key)
// *E.g.:* Calling ß.ajax.maybe({when: true, libs:…, plugins:…})
// The libs and plugins object literal should be used as in `ß.ajax.libs` and `ß.ajax.plugins`
ß.ajax.maybe = function(requested) {
   var
      url            = null,
      resultUrls     = [];

   // Each `requested`set of scripts
   ß.util.each(requested, function(request) {
      if (request.when) {
         if (ß.isObject( request.libs )) { ß.ajax.libs(request.libs); }
         if (ß.isObject( request.plugins )) { ß.ajax.plugins(request.plugins); }
      }
   });

   return resultUrls;
};

// Helper function responsible for loading js-script-files
// Parameters are ´url´ as fully qualified url and an optional `success` callback
ß.ajax.script = function(url, success) {
   // Create script element and set its type
   var script = document.createElement("script");
   script.type = "text/javascript";

   // Bind to readyState or register ´onload´ callback
   if (script.readyState) {
      // Callback for IE's `onreadystatechange` (I feel seesick)
      script.onreadystatechange = function(){
         if (script.readyState == "loaded" || script.readyState == "complete") {
            script.onreadystatechange = null;

            // Invoke callback if passed and type is function
            if (ß.isFunction(success)) { success(); }
         }
      };
   } else {
      // Bind `onload` callback on script element
      script.onload = function(){
         // Invoke callback if passed and type is function
         if (ß.isFunction(success)) { success(); }
      };
   }

   // Set the url
   script.src = url;

   // Append it to the head
   // *Note:* Binding it to body not possible cause it may not be parsed if `ß.libs` is
   // called in html's head-section
   document.head.appendChild(script);

   return url;
};
// Core functionality
// ---------------

// Register core namespace on scandiojs object

ß.core = {};

// Closes and secures a module by name within its own scope
// *Note:* This function being an IIFE leaves off parameters on outer function
ß.mod = ß.core.mod = ß.core.module = (function() {
   // Setting up global environment object and DOM-ready state
   var
      isDomReady  = false,
      globEnv     = {};

   // Returns a function requiring `name, module and an module environment object`
   return function(name, module, modEnv) {
      var typeError = null;

      // Validates types of parameters in requiring `string, function and object`
      if (!ß.isString(name) || !ß.isFunction(module) || (modEnv && !ß.isObject(modEnv))) {
         // Set up a crazy long eloquent error message and…
         typeError = 'Parameter mismatch in Scandio.mod - please provide (1) name as' +
            'string and a (2) module as function. (3) an modEnv object may be given to' +
            'extend the default global environment';

         // … debug it as an error
         ß.debug.error(typeError);
      }

      // Module names need to be unique
      if (modules.sequence.indexOf(name) >= 0) {
         // Otherwise error will be triggered
         typeError = 'Error: there is already a module with name "' + name + '".';

         ß.debug.error(typeError);
      }
      else {
         // If module name is unique push it to internal state variable
         modules.sequence.push(name);
      }

      // Extend global with module environment where module takes preference
      $.extend(true, globEnv, modEnv);

      // Register function on module object by calling it with scandiojs, jQuery and the global environment
      modules[name] = module.call(ß, $, globEnv, ß);

      // *Convention:* if module environment has a function called `readyFn`
      // it will be invoked on DOM-Ready
      if (modEnv && ß.isFunction(modEnv.readyFn)) {
         modEnv.readyFn(modules[name].ready);
      } else {
         // Otherwise the just load it on DOM-ready
         $(document).ready(modules[name].ready);
      }

   };

}());

// Defers function execution based on condition and delay
// *Note:* This function being an IIFE leaves off parameters on outer function
ß.wait = ß.core.wait = (function () {

   // Sets up the defered function
   var waitFn = function(params) {
      // Reads all the allowed to be passed in
      var
         // When it all started
         startTime      = new Date().getTime(),
         // for how long the whole thing may take
         duration       = params.duration || 3000,
         // for how often we check the condition
         interval       = params.interval || 100,
         // the initial delay
         initialDelay   = params.initialDelay || 10,
         // a condition function
         condition      = params.condition || function() {},
         // object containing all the callbacks (done and fail)
         callbacks      = ß.util.extend({}, params.callbacks),

         // Runs one roundtrip of execution
         execute = function() {
            // Time flew by and duration for execution exceeded
            if (new Date().getTime() - startTime > duration) {
               if (ß.isFunction(callbacks.fail)) { callbacks.fail(); }
            // The condition passed and we're good
            } else if (condition()) {
               if (ß.isFunction(callbacks.done)) { callbacks.done(); }
            // Defer execution again by interval
            } else {
               setTimeout(execute, interval);
            }
         };

      // Starts up intitial execution with delay
      setTimeout(execute, initialDelay);

      // Outer `waitFn` returns its callbacks
      return {
         done: function(fn) {
            callbacks.done = fn;
         },
         fail: function(fn) {
            callbacks.fail = fn;
         }
      };

   };

   // Sets up global return only requiring condition
   waitFn.until = function(condition) {
      waitFn({
         condition: condition
      });
   };

   return waitFn;

}());

// A small Pub/Sub implementation for global event emission/listening (Messaging pattern)
// *Note:* This function being an IIFE leaves off parameters on outer function
ß.core.messenger = ß.messenger = (function($, ß){
   // The messenger/hub is just a plain jQuery object
   var
      messenger = $({}),

      // Subscribing to messenger with namespace as in *ß.messenger.subscribe('foo.bar', fn)*
      // *Note:* First argument is event as in subscribe('foo', fn(e, arg…))!
      subscribe = function() {
         // Using $ as emitter allows namespaced events e.g. 'foo.bar' will trigger on 'foo' and 'foo.bar'
         messenger.on.apply(messenger, arguments);
      },

      // Unsubscribes in same syntax as subscribing (namespaced)
      unsubscribe = function() {
         messenger.off.apply(messenger, arguments);
      },

      // Triggers subscribed listener's function with arguements (1st is $-event)
      publish = function() {
         messenger.trigger.apply(messenger, arguments);
      };

   // Returns public functions
   return {
      subscribe: subscribe,
      unsubscribe: unsubscribe,
      publish: publish
   };
}(jQuery, ß));

// Shorthand for redirecting the browser to a new `url`
ß.redirect = ß.core.redirect = function(url) {
   location.href = url;
};
// Conflucence module
// ---------------

// Sets up confluence object
ß.confluence = {};
// Utility module for device detection
// ---------------

// Sets up device object
ß.device = {
   mobile: ["android", "webos", "iphone", "ipad", "ipod", "blackberry"],
   desktop: ["macintosh", "win", "linux"]
};

// A rudimentary function testing for mobile devices
// *Note:* The list of OSes it not complete and feature-testing might be a better option (modernizr e.g.)
ß.device.isMobile = function() {
   var
      regExp      = new RegExp(ß.device.mobile.join('|')),
      userAgent   = navigator.userAgent.toLowerCase();

   // Checks the navigator's user agent against the list of mobile devices
   return regExp.test(userAgent);
};

// A function testing for desktop devices
ß.device.isDesktop = function() {
   var
      regExp      = new RegExp(ß.device.desktop.join('|')),
      userAgent   = navigator.userAgent.toLowerCase();

   // Checks the navigator's user agent against the list of desktop devices
   return regExp.test(userAgent);
};

// A function testing for browser vendors
ß.device.isBrowser = function(vendor) {
   var
      regExp      = new RegExp(vendor.toLowerCase()),
      userAgent   = navigator.userAgent.toLowerCase();

   // Checks the navigator's user agent against the list of desktop devices
   return regExp.test(vendor);
};

// A function testing for browser vendors
ß.device.isOs = function(vendor) {
   var
      regExp      = new RegExp(vendor.toLowerCase()),
      userAgent   = navigator.userAgent.toLowerCase();

   // Checks the navigator's user agent against the list of desktop devices
   return regExp.test(vendor);
};// Utility module for responsive design
// ---------------

// Sets up responsive object
ß.responsive = {
   breakpointEl:     '.breakpoint'
};

ß.responsive.breakpoint = function(name) {
   return $( ß.responsive.breakpointEl ).html() === name;
};
// Outro, AMD and conflict resolution
// ---------------

// Tries to resolve version conflicts by restoring the previously loaded version globally
ß.noConflict = function() {
   // Retore the `previousScandio`
   root.ß = previousScandio;

   // Return yerself to continue
   return this;
};

// Support for AMD/RequireJS
// If define function deefined and its amd
if (typeof define === 'function' && define.amd) {
   // Define Scandio
   define('Scandio', function() {
      // and return the library
      return ß;
   });
}
}(this, jQuery, window, document));