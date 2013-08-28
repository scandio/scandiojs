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
