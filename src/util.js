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
      key = null,
      i = null,
      l = obj.length;

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

   // Dig into the `path` an question the `objc`
   for(i = 0; i < path.length; i++) {
      // Found something on the `objc` and reset the destination
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
      functions   = [],
      key         = null;

   // For each key in object…
   for (key in obj) {
      // …check if it is a function and push it to result
      if (ß.isFunction(obj[key])) { functions.push(key); }
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
      if (!ß.path) { ß[ path[i] ] = {}; }

      // Sets the current pointer to module
      destination = destination[ path[i] ];
   }

   // For each function on the passed in `obj` by name
   ß.util.each(ß.util.functions(obj), function(name) {
      // Gets the function from the `obj` parameter
      var func = obj[name];

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