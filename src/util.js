// Utility functions
// ---------------

// Register ajax namespace on scandiojs object
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
      i           = null;

   // Register the namespace if its not existent
   for (i = 0; i < path.length; i++) {
      // Namespace not registered yet
      if (!destination[path]) { destination[ path[i] ] = {}; }

      // Sets the current pointer to module
      destination = destination[ path[i] ];
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

// Puts the breaks on a function which may be called to often
// such as scrolling or resizing callbacks.
// The function will actually be called after `release`-milliseconds elapsed
ß.util.breaks = function(on, release) {
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
ß.util.delay = function(fn, ms) {
   // Arguments are anything after `fn` and `ms`
   var args = slice.call(arguments, 2);

   // Return the result of setTimeout
   return setTimeout(function() {
         return fn.apply(null, args);
   }, ms);
};
