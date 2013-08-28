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
