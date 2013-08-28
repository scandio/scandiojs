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
