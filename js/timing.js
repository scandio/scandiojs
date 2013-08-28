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
