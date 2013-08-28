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
 ;(function(root, jQuery, window, document, undefined) {
  // We're strict and in strict-mode: no aruguements.callee and globally leaking vars etc
  "use strict";

  //Establish the root
  root = root || this;

  // Sets up a global set of variables
   var
      loadedJs           = {},
      config             = {
         scandioHtmlClass: 'scandio-js',
         scandioBridgeClass: 'scandio-js--bridge'
      },
      injectDOM          = true,
      $scandioEl         = null,
      // Previous version for `Scandio.noConflict`
      previousScandio    = root.Scandio,
      // Breaker for loop iteration
      breaker            = {},
      // Set of shorthand to object protos
      ArrayProto         = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype,
      location           = window.location,
      events             = jQuery('<a>'),
      modules            = {},
      // Console methods to be caught when not defined in browser (IE I hear you)
      consoleMethods     = ['assert', 'clear', 'count', 'dir', 'dirxml',
                          'exception', 'group', 'groupCollapsed', 'groupEnd',
                          'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
                          'timeStamp', 'trace'],
      // Log methods to be caught and routed to `Scandio.debug`
      logMethods         = ['error', 'warn', 'info', 'debug', 'log'],
      // Url hooks enabling e.g. DOM-logging
      urlHooks           = {
         domLogging:    'scandiojs--log-dom'
      },

      // All the important native methods shorthanded and used if defined in e.g. `Scandio.each`
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
         console  = ( window.console = window.console || {} );

         // Loop over all methods (log and console)
         while (length--) {
            method = methods[length];

            // Bind a noop to call if not defined
            if (!console[method]) { console[method] = noop; }
         }
   },

   _injectDom = function() {
      jQuery(function() {
         var
            script   = null;

         if ( injectDOM && jQuery(config.scandioHtmlClass).length === 0 ) {
            $scandioEl = jQuery('<div/>', {
                class: config.scandioHtmlClass
            }).appendTo('body');
         }

         if (injectDOM) {
            script            = document.createElement("script");
            script.type       = "application/x-json";
            script.id         = config.scandioBridgeClass;

            document.head.appendChild(script);
         }
      });
   },

   // Any call to subordinate initialization function goes here
   // *Note:* We're in pre-creation state
   _initialize = function() {
      // As the adove catching of console calls
      _catchConsole();

      // Inject scandio elements into DOM
      _injectDom();
   };

   // Intialize
   _initialize();

   // Create yerself
   root.Scandio = Scandio;

   // Version of our library
   Scandio.VERSION   = '0.1.0';
// DOM module
// ---------------

// Register dom namespace on scandiojs object

Scandio.dom = {};

// Closes and secures a cache module with within its own scope
// *Note:* This function being an IIFE leaves of parameters on outer function
Scandio.dom.cache = (function(jQuery, Scandio){
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
               if (coll[l] === t || jQuery.contains(t,coll[l])) {
                  delete coll[l]; --coll.length;
               }
            }
         }
      },

      // Updates complete cache or scoped to a label
      update = function(label) {
         // Passed in label is string, scoping to that label
         if (Scandio.isString(label)) {
            //Reset cache value at label
            if(cache[label] !== undefined) {
               cache[label] = jQuery(cache[label].selector || '');
            }
         } else {
            // For each value in cache refresh it
            Scandio.util.each(cache, function($cached, label) {
               cache[label] = jQuery($cached.selector);
            });
         }
      },

      // Gets a value from cache or loads it from DOM
      get = function(label, selector) {
         // Both label and selector passed, cache/dom reading...
         if (Scandio.isString(selector) && Scandio.isString(label)) {
            // ...either from cache or DOM
            cache[label] = cache[label] || jQuery(selector);
         }

         // What the callee gets: a jQuery object
         return cache[label];
      };

   // Bind to node removal in DOM
   jQuery(document).on('DOMNodeRemoved', nodeRemoved);

   // Return public functions in object literal
   return {
      get: get,
      update: update
   };
}(jQuery, Scandio));
// String module
// ---------------

// Register string namespace on scandiojs object
Scandio.string = {};

// Capitalizes a given string (scandio becomes Scandio etc.)
Scandio.string.capitalize = function(string) {
   // First char gets upppercased every other char lowercased
   return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
};

// Lowercases a given string (ScanDiO becomes scandio)
Scandio.string.lower = function(string) {
   // Just everything to lowercase
   return string.toLowerCase();
};

// Cleans up the mess of a string ('  Scandio    GmbH   ' becomes 'Scandio GmbH')
Scandio.string.clean = function(string) {
   // Trims the mess (whitespace default) and replaces consecutive (s+) whitespaces within with one whitespace
   return Scandio.string.trim(string).replace(/\s+/g, ' ');
};

// Trims away the given characters around a given string (defaults to whitespace)
Scandio.string.trim = function(string, characters){
   // Uses nativeTrim if defined and no characters are given (not supported by native impl.)
   if (!characters && nativeTrim) {
      return nativeTrim.call(string);
   }

   // A RegExp starting at the beginning of the string, the string wrapped by the `characters`
   // replacing them around the `string`
   return String(string).replace(new RegExp('^' + characters + '+|' + characters + '+$', 'g'), '');
};

// Chops a string up `at` every position in the string `Scandio.string.chop('chopchop', 3) === 'cho pch op'`
Scandio.string.chop = function(string, at) {
   // Better make a string out of the passed in 'string'
   string = String(string);

   // Double NOT bitwise (sorta same as Math.floor())
   at = ~~at;

   // RegExp works like a UNIX expansion list, expanding around the whitespace from 1-to-at
   return at > 0 ? string.match(new RegExp('.{1,' + at + '}', 'g')) : [string];
};

// Finds a string within a string (fuzzy) e.g. `Scandio.string.contains('I'veADream', 'Dream') === true`
Scandio.string.contains = function(needle, haystack) {
   // Don't do work if no needle passed (but we've found something right!)
   if (needle === '') { return true; }
   // Empty haystack should also lead to some chilling without having found something
   if (haystack === null || haystack === undefined) { return false; }

   // Do the old trick of using `indexOf` of the haystack with the needle
   return String(haystack).indexOf(needle) !== -1;
};

// Checks if string starts with a given string
Scandio.string.starts = function(string, what) {
   // Wrap the passed in arguments in a String object for sanity
   string   = String(string);
   what     = String(what);

   // If the string is longer, equally long than the one it's supposed to start with
   // and if its slice from 0 to the starting string's length is the starting string
   return string.length >= what.length && string.slice(0, what.length) === what;
};

// Checks if string ends with a given string
Scandio.string.ends = function(string, what) {
   // Wrap the passed in arguments in a String object for sanity
   string   = String(string),
   what     = String(what);

   // If the string is longer, equally long than the one it's supposed to end with
   // and if its slice from the end to the length of its suppoed ending is equals to its ending
   return string.length >= what.length && string.slice(string.length - what.length) === what;
};

// Implodes/joins a string with a given glue
Scandio.string.implode = function(glue, pieces) {
   // Defaults the glue to empty string
   if (glue === null || glue === undefined) { glue = ''; }

   // Pipes call through join on pieces
   return pieces.join(glue);
};

// Explodes/splits a string with by given delimiter
Scandio.string.explode = function(string, delimiter) {
   // Wrap the passed in argument in a String object for sanity
   delimiter   = String(delimiter),
   string      = String(string);

   // Pipes passed in arguments through `split`
   return string.split(delimiter);
};

// Replaces a substring within a string
// E.g. `Scandio.string.replace('Scandio Gm', 'Gm', 'GmbH')` will return 'Scandio GmbH'
Scandio.string.replace = function(string, subString, replacer) {
   // Wrap the passed in argument in a String object for sanity
   string      = String(string);
   subString   = String(subString);
   replacer    = String(replacer);

   var
      regExp   = new RegExp( subString.toLowerCase(), "gi" );

   return string.replace(regExp, replacer);
};
// Debug/logging module
// ---------------

// Sets up logger object with level and log-history
Scandio.logger = {
   level: 5,
   logs: {},
   logDom: false
};

// Define default logger callback if no custom callback defined
Scandio.logger.logDomFn = Scandio.logger.logDomFn || (function() {
   return Scandio.logger.logDom || ( window.location.href.indexOf(urlHooks.domLogging) > -1);
}());

Scandio.debug = {};

// `Scandio.debug` will get a set of methods (*see return-statement*)
Scandio.debug = (function() {
   var
      // Shorthands, DOM-element mappings and caching variables
      console              = window.console,
      length               = logMethods.length,
      methods              = {},
      logOuterWrapperPath  = 'scandio-log',
      logElType            = '<div />',
      $loggerEl            = null,
      alertEls = {
         debug:   'info',
         error:   'danger',
         info:    'info',
         log:     'success',
         warn:    'warning'
      },
      // Pretty prints a log message stringifying objects and arrays as JSON
      logMessage           = function(args) {
         var
            response    = [];

         // Each arguement processed separately
         Scandio.util.each(args, function(arg) {
            // If it is an object || array stringify its value
            if ( (Scandio.isObject(arg) || Scandio.isArray(arg) ) ) {
               response.push( Scandio.json.to(arg) );
            } else {
               // otherwise toString it
               response.push(arg);
            }
         });

         return response.join(' ,');
      },
      // Closes the scope for `method and level`
      // *Note:* Due to js and its state-maintainance for closures
      // the last passed argument would otherwise win
      createLogger = function (method, level) {
         // DOM-Element names and cache variable
         var
            logElWrapperPath     = logOuterWrapperPath + '--' + method,
            logElInnerPath       = 'alert alert-' + alertEls[method] || method,
            logElIdentifier      = '.' + Scandio.string.replace(logElInnerPath, ' ', '.'),
            $logEl               = [];

         // Sets up history for the log-method
         Scandio.logger.logs[method] = [];

         // Creates the logger-els only if logDomFn is truthy
         if (Scandio.logger.logDomFn === true) {
            jQuery(function() {
               // Maintaines state and creates the logger els
               $loggerEl.append(
                  jQuery(logElType, {
                     class: logElWrapperPath
                  }).html(
                     jQuery(logElType, {
                        class: logElInnerPath
                     })
                  )
               );

               $logEl = jQuery(logElIdentifier);

               Scandio.util.each(Scandio.logger.logs[method], function(log) {
                  $logEl.prepend(log + '<hr />');
               });
            });
         }

         // Registers function on DOM-Module for logging with method-name
         Scandio.dom[method] = function() {
            var args = slice.call(arguments);

            // Query DOM only if nessesary (cache)
            if ($logEl.length === 0) { $logEl = jQuery(logElIdentifier); }

            // Only log to DOM if possible and wanted
            if (Scandio.logger.logDomFn && $logEl.length > 0) { $logEl.prepend(logMessage(args) + '<hr />'); }
         };

         // The return value's log-type gets a function
         methods[method] = function() {
            // Lets get some arguments
            var args = slice.call(arguments);

            // Only log to console if required by level
            if (Scandio.logger.level > level) {
               // Calls the native console method
               console[method].apply(console, args);

               // Logs to DOM (function itself decides if intended)
               Scandio.dom[method].apply(Scandio, args);
            }

            // but always push it to history
            Scandio.logger.logs[method].push( logMessage(args) );
         };
      };

   // Sets up the outer wrapper for DOM logging
   if (Scandio.logger.logDomFn === true) {
      jQuery(function() {
         $loggerEl = jQuery(logElType, {
            class: logOuterWrapperPath
         }).appendTo($scandioEl);
      });
   }

   // For every console-method
   while(length--) { createLogger(logMethods[length], length); }

   // Now the `Scandio.debug`-object gets its functions
   return methods;
})();
// Utility module
// ---------------

// Register util namespace on scandiojs object
Scandio.util = {};

// Nothing too fancy: shorthand to `hasOwnProperty`
Scandio.util.has = function(obj, key) {
   return hasOwnProperty.call(obj, key);
};

// Iterates over an `object` with an `iterator` in an optional `context`
// Falls back to nativeForEach if supported by browser (on prototpye)
Scandio.util.each = Scandio.forEach = function(obj, iterator, context) {
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
         if (Scandio.util.has(obj, key)) {
            // …call the `iterator`-function and return if its the breaker (done)
            if (iterator.call(context, obj[key], key, obj) === breaker) { return; }
         }
      }
   }
};

// Extends an object with all the arguments passed in other objects
Scandio.util.extend = function(obj) {
   // `obj` is destination `arguments`-2nd parater is source
   Scandio.util.each(slice.call(arguments, 1), function(source) {
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
Scandio.util.filter = function(obj, iterator, context) {
   // What will be returned
   var results = [];
   // Nothing to iterate
   if (obj === null || obj === undefined) { return results; }

   //Fallback to native filter for performance reasons
   if (nativeFilter && obj.filter === nativeFilter)
         { return obj.filter(iterator, context); }

   // Foreach `value` with `index` and the `context` being `list`
   Scandio.util.each(obj, function(value, index, list) {
      // Push the value to `results` if test passes as specified in iterator
      if(iterator.call(context, value, index, list)) {
         results.push(value);
      }
   });

   return results;
};

// Accesses an obj by dot-notation allowing a default/notFound value
// *E.g.:* Scandio.util.getByDots("name.fullname", {name: {fullname: 'me'}}) returns me
Scandio.util.getByDots = function(dots, obj, notFound) {
   // Setup path and destination variables
   var
      dest   = obj,
      path   = dots.split('.'),
      i      = null;

   // Dig into the `path` an question the `obj`
   for(i = 0; i < path.length; i++) {
      // Found something on the `obj` and reset the destination
      if ( dest[path[i]] ) { dest = dest[path[i]]; }
      // Nothing found…
      else {
         dest = undefined;
         break;
      }
   }

   // Dest or notFound
   return dest || notFound;
};

// Sets an obj by dot-notation
// *E.g.:* Scandio.util.setByDots("name.firstname", "doop", {name: {fullname: 'me'}}) returns me
Scandio.util.setByDots = function(dots, value, obj) {
   // Split string by dots
   var
      path  = dots.split("."),
      key   = null;

   // Moves in on the path
   while (path.length > 1) {
      // Gets the latest key
      key = path.shift();

      // Creates empty object if not found
      if (!Scandio.isObject(obj)) { obj = {}; }
      if (!(key in obj)) { obj[key] = {}; }

      // Sets the nesting to next deeper key
      obj = obj[key];
   }

   // Returns the result of setting the value
   return obj[ path[0] ] = value;
};

// Collects all function from an object and returns an array containing them
// *E.g.:* calling it with Scandio.util.functions({capitalize: function() {return}, greet: 'hi'})
// would only return an array containing the `capitalize` function.
Scandio.util.functions = function(obj) {
   // Setup local variables
   var
      functions   = {},
      key         = null;

   // For each key in object…
   for (key in obj) {
      // …check if it is a function and push it to result
      if (Scandio.isFunction(obj[key])) { functions[key] = obj[key]; }
   }

   return functions;
};

// Allows for extending Scandio. functionality by handing in an `namespace` and a object-literal
// containing the functions.
// *E.g.:* calling `Scandio.util.mixin('string', {capitalize: fn(string)})` makes the capitalize function
// available as in Scandio.string.capitalize('string').
Scandio.util.mixin = function(namespace, obj) {
   var
      destination = Scandio,
      path        = namespace !== null ? namespace.split(".") : [],
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
   Scandio.util.each(Scandio.util.functions(obj), function(func, name) {
      // Defines the function on the destination module
      destination[name] = function() {
         // Merge args with wrapped object (constructor new Scandio.(obj))
         var args = this._wrapped ? [this._wrapped] : [];
         push.apply(args, arguments);

         // The result of applying the function with Scandio. and its args
         return func.apply(Scandio, args);
      };
   });
};
// Type checking module
// ---------------

// This buils group of `is…`-typecheck functions
// For every type who's `toString` returns `[object […]]`
Scandio.util.each(['Array', 'Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
   // Create a function requiring an `object` as paramters
   Scandio['is' + name] = function(obj) {
      // Returning a boolean indicating if its type is the name
      return toString.call(obj) == '[object ' + name + ']';
   };
});

// Objects behave differently
Scandio.isObject = function(obj) {
   // An new object with the `obj` should be equal to itself
   // only if it is an object
   return obj === Object(obj);
};
// JSON module
// ---------------

// Sets up the json object
Scandio.json = {};

// Used to encode an object to its json-string representation
// *Note:* falls back to native `JSON.stringify` if it is defined
Scandio.json.to = Scandio.json.encode = function(obj) {
   // Falls back to native `JSON.stringify` if possible
   if ("JSON" in window) { return JSON.stringify(obj); }

   // Type, internation and progress variables
   var
      t = typeof (obj),
      n = null,
      v = null,
      json = [],
      arr = null;

   // No object at hand, toString the output
   if (t != "object" || obj === null) {
      if (t == "string") { obj = '"' + obj + '"'; }

      return String(obj);
   // Work the object
   } else {
      // Typecheck if object is an array
      arr = (obj && obj.constructor == Array);

      // For each value in object
      for (n in obj) {
         // Get its value and type
         v = obj[n];
         t = typeof(v);
         // Check if it has the property
         if (obj.hasOwnProperty(n)) {
            // Embeds strings into result
            if (t == "string") {
               v = '"' + v + '"';
            // Recursive call to itself to work nested objects
            } else if (t == "object" && v !== null) {
               v = Scandio.json.to(v);
            }
            // Push the processed output to result
            json.push((arr ? "" : '"' + n + '":') + String(v));
         }
      }
      // Wraps it with curlies or square brackets
      return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
   }
};

// Decodes an json-string into an object
// *Note:* Pipes through `jQuery.parseJSON` which basically
// does a simple RegEx-test and then returns `new Function(data)` instead of
// an `eval`.
Scandio.json.from = Scandio.json.decode = function(string) {
   return jQuery.parseJSON(string);
};
// Persistent bridge module
// ---------------

// Register store namespace on scandiojs object
Scandio.bridge = {};
Scandio.bridge.identifier = config.scandioBridgeClass;

// IFFE setting up the store and merging all n possible 'script-tags' into one
Scandio.bridge.init = function() {
   // Gets all scripts and sets up the cache for merging
   var
      scripts     = jQuery('.' + Scandio.bridge.identifier),
      tempCache   = null,
      mergeCache  = {};

   // The main script to be the merge-bucket
   Scandio.bridge.script = jQuery('head #' + Scandio.bridge.identifier);

   // Respects actually used script-tag having data already
   mergeCache = Scandio.bridge.script.text() !== "" && Scandio.isObject(
      tempCache = Scandio.json.from(
         Scandio.bridge.script.text()
      )
   ) ? tempCache : mergeCache;

   // Collects each's script text and merges it into the `mergeCache` while
   // removing it afterwards
   Scandio.util.each(scripts, function(script) {
      var $script    = jQuery(script);

      Scandio.util.extend(mergeCache, Scandio.json.from( $script.text() ));

      $script.remove();
   });

   // Updates the merged contents to the main-script
   Scandio.bridge.script.text( Scandio.json.to(mergeCache) );

   return Scandio.bridge.script.length === 1;
};

// Gets a value from the script-tag
// *E.g.:* `Scandio.bridge.get('firms.microsoft', false)` might return a company object-literal
// or false if it is not set
Scandio.bridge.get = function(dots, notFound) {
   // Break early if DOM-injection is disabled
   if (injectDOM === false) { Scandio.debug.warn("DOM injection disabled globally, script-tag not present!"); return; }

   // Parses the data from the script (ran everytime to not run into update-read conflicts)
   var storeData = Scandio.json.from( Scandio.bridge.script.text() );

   // Gets the demanded value by dot-notation
   return Scandio.util.getByDots(dots, storeData, notFound);
};

// Sets a value on the script-tag
// *E.g.: `Scandio.bridge.set('firms.scandio, {name: 'Scandio GmbH'})` will add the scandio literal to the firms
// object. It will overwrite an existing entry and fail if `firms` it not an object but a primitive type.
Scandio.bridge.set = function(dots, value) {
   // Break early if DOM-injection is disabled
   if (injectDOM === false) { Scandio.debug.warn("DOM injection disabled globally, script-tag not present!"); return; }

   // Parses the data from the script (ran everytime to not run into update-read conflicts)
   var storeData = Scandio.json.from( Scandio.bridge.script.text() );

   // Sets the value by dot-notation on the retrieved data
   Scandio.util.setByDots(dots, value, storeData);
   // while setting it as strinfified JSON on the script-tag afterwards
   Scandio.bridge.script.text( Scandio.json.to(storeData) );

   // Returns the value so tmpl/views can pipe it through
   return value;
};
// Timining module
// ---------------

// Register timinig namespace on scandiojs object
Scandio.timing = {};

// Puts the breaks on a function which may be called to often
// such as scrolling or resizing callbacks.
// The function will actually be called after `release`-milliseconds elapsed
Scandio.timing.breaks = function(on, release) {
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
Scandio.timing.delay = function(fn, ms) {
   // Arguments are anything after `fn` and `ms`
   var args = slice.call(arguments, 2);

   // Return the result of setTimeout
   return setTimeout(function() {
      return fn.apply(null, args);
   }, ms);
};
// Ajax module
// ---------------

// Register ajax namespace on scandiojs object
Scandio.ajax = {};

// Loads a in `requested` specified set of files from CDNs
// **Example:** ` Scandio.ajax.libs({cdnjs: [{repository: 'bacon.js', version: '0.6.8', file: 'Bacon.min.js'}]})`
// will be passed to the handler and inject the library as a `<scipt />` right after the html's head-section.
// **Callback** function for each cdn should be defined on the Scandio.cdns-object below.
Scandio.ajax.libs = function(requested) {
   // Iterate over each cdn holding multiple libs
   Scandio.util.each(requested, function(libs, cdn) {
      // Check if the cdn has a callback otherwise trigger warn-message
      if (Scandio.isFunction( Scandio.ajax.cdns[cdn] )) {
         // Invoke callback and…
         Scandio.util.each(libs, function(lib) {
            // …load the library
            Scandio.ajax.script(Scandio.ajax.cdns[cdn](lib.repository, lib.version, lib.file), lib.success || undefined);
         });
      } else {
         Scandio.debug.warn('CDN: ' + cdn + ' not defined in Scandio.ajax.cdns!');
      }
   });
};

// Object containing callback function per cdn invoked by requiring libs
// Every callback gets `repository, version and file` as parameters
Scandio.ajax.cdns = {
   // Callback for cdnjs called as in `Scandio.libs({cdnjss: [...]})`
   'cdnjs' : function(repository, version, file) {
      return "//cdnjs.cloudflare.com/ajax/libs/"+repository+"/"+version+"/"+file;
   }
};

// Loads a in `requested` specified set of files by folder
// **Example:** `Scandio.ajax.plugins({'scandio.js/example/scripts/': ['alert', 'log']});`
// will load alert and log from their respective folder.
// *Notes:* the extension is ommited and the path is relative to `window.location.origin`
Scandio.ajax.plugins = function(requested) {
   var
      url            = null,
      resultUrls     = [];

   // Each `requested`set of scripts
   Scandio.util.each(requested, function(scripts, folder) {
      // As script…
      Scandio.util.each(scripts, function(script) {
         // …and loading it by folder and script-name
         url = window.location.origin + '/' + folder + script + '.js';

         Scandio.ajax.script(url);

         resultUrls.push(url);
      });
   });

   return resultUrls;
};

// Loads a set of libs and plugin files based on a condition (the `when` key)
// *E.g.:* Calling Scandio.ajax.maybe({when: true, libs:…, plugins:…})
// The libs and plugins object literal should be used as in `Scandio.ajax.libs` and `Scandio.ajax.plugins`
Scandio.ajax.maybe = function(requested) {
   var
      url            = null,
      resultUrls     = [];

   // Each `requested`set of scripts
   Scandio.util.each(requested, function(request) {
      if (request.when) {
         if (Scandio.isObject( request.libs )) { Scandio.ajax.libs(request.libs); }
         if (Scandio.isObject( request.plugins )) { Scandio.ajax.plugins(request.plugins); }
      }
   });

   return resultUrls;
};

// Helper function responsible for loading js-script-files
// Parameters are ´url´ as fully qualified url and an optional `success` callback
Scandio.ajax.script = function(url, success) {
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
            if (Scandio.isFunction(success)) { success(); }
         }
      };
   } else {
      // Bind `onload` callback on script element
      script.onload = function(){
         // Invoke callback if passed and type is function
         if (Scandio.isFunction(success)) { success(); }
      };
   }

   // Set the url
   script.src = url;

   // Append it to the head
   // *Note:* Binding it to body not possible cause it may not be parsed if `Scandio.libs` is
   // called in html's head-section
   document.head.appendChild(script);

   return url;
};
// Core module
// ---------------

// Closes and secures a module with namespace within its own scope
// *Note:* This function being an IIFE leaves off parameters on outer function
Scandio.mod = Scandio.module = (function() {
   // Setting up global environment object and DOM-ready state
   var
      isDomReady  = false,
      globEnv     = {};

   // Returns a function requiring `namespace, module and an module environment object`
   return function(namespace, module, modEnv) {
      var
         typeError      = null,
         invokedModule  = null;

      namespace = Scandio.string.clean(
         Scandio.string.lower(namespace)
      );

      // Validates types of parameters in requiring `string, function and object`
      if (!Scandio.isString(namespace) || !Scandio.isFunction(module) || (modEnv && !Scandio.isObject(modEnv))) {
         // Set up a crazy long eloquent error message and…
         typeError = 'Parameter mismatch in Scandio.mod - please provide (1) namespace as' +
            'string and a (2) module as function. (3) an modEnv object may be given to' +
            'extend the default global environment';

         // … debug it as an error
         Scandio.debug.error(typeError);
      }

      // Module names need to be unique
      if (Scandio.util.getByDots(namespace, modules, true) !== true) {
         // Otherwise error will be triggered
         typeError = 'Error: there is already a module with namespace "' + namespace + '".';

         Scandio.debug.error(typeError);
      }
      else {
         // Extend global with module environment where module takes preference
         jQuery.extend(true, globEnv, modEnv);
         // If module namespace is unique push it to internal state variable
         invokedModule = Scandio.util.setByDots(namespace, module.call(Scandio, $, globEnv, Scandio), modules);
      }

      // *Convention:* if module environment has a function called `readyFn`
      // it will be invoked on DOM-Ready
      if (modEnv && Scandio.isFunction(modEnv.readyFn)) {
         modEnv.readyFn(invokedModule.ready);
      } else {
         // Otherwise the just load it on DOM-ready
         jQuery(document).ready(invokedModule.ready);
      }
   };
}());

// Returns a registered module by passing in a qualifier string (may be dot-notation)
// *Note:* Handing over a not fully qualifying string returns an object with hashes for submodules.
Scandio.modules = function(namespace) {
   namespace = Scandio.string.clean(
      Scandio.string.lower(namespace)
   );

   return Scandio.util.getByDots(namespace, modules, false);
};

// Defers function execution based on condition and delay
// *Note:* This function being an IIFE leaves off parameters on outer function
Scandio.wait = (function () {

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
         callbacks      = Scandio.util.extend({}, params.callbacks),

         // Runs one roundtrip of execution
         execute = function() {
            // Time flew by and duration for execution exceeded
            if (new Date().getTime() - startTime > duration) {
               if (Scandio.isFunction(callbacks.fail)) { callbacks.fail(); }
            // The condition passed and we're good
            } else if (condition()) {
               if (Scandio.isFunction(callbacks.done)) { callbacks.done(); }
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
Scandio.util.mixin(null, (function(jQuery, Scandio) {
   // The messenger/hub is just a plain jQuery object
   var
      messenger = jQuery({}),

      // Subscribing to messenger with namespace as in *Scandio.messenger.subscribe('foo.bar', fn)*
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
}(jQuery, Scandio)));

// Shorthand for redirecting the browser to a new `url`
Scandio.redirect = function(url) {
   location.href = url;
};
// Conflucence module
// ---------------

// Sets up confluence object
Scandio.confluence = {};
// Device detection module
// ---------------

// Sets up device object
Scandio.device = {
   mobile: ["android", "webos", "iphone", "ipad", "ipod", "blackberry"],
   desktop: ["macintosh", "win", "linux"]
};

// A rudimentary function testing for mobile devices
// *Note:* The list of OSes it not complete and feature-testing might be a better option (modernizr e.g.)
Scandio.device.isMobile = function() {
   var
      regExp      = new RegExp(Scandio.device.mobile.join('|')),
      userAgent   = navigator.userAgent.toLowerCase();

   // Checks the navigator's user agent against the list of mobile devices
   return regExp.test(userAgent);
};

// A function testing for desktop devices
Scandio.device.isDesktop = function() {
   var
      regExp      = new RegExp(Scandio.device.desktop.join('|')),
      userAgent   = navigator.userAgent.toLowerCase();

   // Checks the navigator's user agent against the list of desktop devices
   return regExp.test(userAgent);
};

// A function testing for browser vendors
Scandio.device.isBrowser = function(vendor) {
   var
      regExp      = new RegExp(vendor.toLowerCase()),
      userAgent   = navigator.userAgent.toLowerCase();

   // Checks the navigator's user agent against the list of desktop devices
   return regExp.test(userAgent);
};

// A function testing for browser vendors
Scandio.device.isOs = function(vendor) {
   var
      regExp      = new RegExp(vendor.toLowerCase()),
      userAgent   = navigator.userAgent.toLowerCase();

   // Checks the navigator's user agent against the list of desktop devices
   return regExp.test(userAgent);
};// Eesponsive design module
// ---------------

// Sets up responsive object
Scandio.responsive = {
   breakpointEl:     '.breakpoint'
};

Scandio.responsive.breakpoint = function(name) {
   return jQuery( Scandio.responsive.breakpointEl ).html() === name;
};
// Outro, AMD and conflict resolution
// ---------------

// Global DOM-Ready which shall be used whenever possible
// Logger does not use it cause it heavily relies on variable hoisting
jQuery(function() {
   Scandio.bridge.init();
});

// Tries to resolve version conflicts by restoring the previously loaded version globally
Scandio.noConflict = function() {
   // Retore the `previousScandio`
   root.Scandio = previousScandio;

   // Return yerself to continue
   return this;
};

// Support for AMD/RequireJS
// If define function deefined and its amd
if (typeof define === 'function' && define.amd) {
   // Define Scandio
   define('Scandio', function() {
      // and return the library
      return Scandio;
   });
}
}(this, jQuery, window, document, undefined));