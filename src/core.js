// Core functionality
// ---------------

// Register core namespace on scandiojs object

ß.core = {};

// Closes and secures a module by name within its own scope
// *Note:* This function being an IIFE leaves of parameters on outer function
ß.mod = ß.core.mod = (function() {
   // Setting up global environment object and DOM-ready state
   var
      isDomReady  = false,
      globEnv     = {};

   // Returns a function requiring `name, module and an module environment object`
   return function(name, module, modEnv) {

      // Validates types of parameters in requiring `string, function and object`
      if (!ß.isString(name) || !ß.isFunction(module) || (modEnv && !ß.isObject(modEnv))) {
         // Set up a crazy long eloquent error message and…
         var typeError = 'Parameter mismatch in Scandio.mod - please provide (1) name as' +
            'string and a (2) module as function. (3) an modEnv object may be given to' +
            'extend the default global environment';

         // … debug it as an error
         ß.debug.error(typeError);
      }

      // Module names need to be unique
      if (modules.sequence.indexOf(name) >= 0) {
         // Otherwise error will be triggered
         var typeError = 'Error: there is already a module with name "' + name + '".';

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
// *Note:* This function being an IIFE leaves of parameters on outer function
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
         callbacks      = {};

      // Runs one roundtrip of execution
      var execute = function() {
         // Time flew by and duration for execution exceeded
         if (new Date().getTime() - startTime > duration) {
            ß.isFunction(callbacks.fail) && callbacks.fail();
         // The condition passed and we're good
         } else if (condition()) {
            ß.isFunction(callbacks.done) && callbacks.done();
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

// Shorthand for redirecting the browser to a new `url`
ß.redirect = ß.core.redirect = function(url) {
   location.href = url;
}
