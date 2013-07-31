ß.mod = ß.core.mod = (function() {
   var
      isDomReady  = false,
      globEnv     = {};

   return function(name, module, modEnv) {

      if (!ß.isString(name) || !ß.isFunction(module) || (modEnv && !ß.isObject(modEnv))) {
         var typeError = 'Parameter mismatch in Scandio.mod - please provide (1) name as' +
            'string and a (2) module as function. (3) an modEnv object may be given to' +
            'extend the default global environment';

         ß.debug.error(typeError);
      }

      if (modules.sequence.indexOf(name) >= 0) {
         var typeError = 'Error: there is already a module with name "' + name + '".';

         ß.debug.error(typeError);
      }
      else {
         modules.sequence.push(name);
      }

      $.extend(true, globEnv, modEnv);
      modules[name] = module.call(ß, $, globEnv, ß);

      if (modEnv && ß.isFunction(modEnv.readyFn)) {
         modEnv.readyFn(modules[name].ready);
      } else {
         $(document).ready(modules[name].ready);
      }

   };

}());

ß.wait = ß.core.wait = (function () {

   var waitFn = function(params) {
      var startTime = new Date().getTime(),
         duration = params.duration || 3000,
         interval = params.interval || 100,
         initialDelay = params.initialDelay || 10,
         condition = params.condition || function() {},
         callbacks = {};

      var execute = function() {
         if (new Date().getTime() - startTime > duration) {
            callbacks.fail && callbacks.fail();
         } else if (condition()) {
            callbacks.done && callbacks.done();
         } else {
            setTimeout(execute, interval);
         }
      };

      setTimeout(execute, initialDelay);

      return {
         done: function(fn) {
            callbacks.done = fn;
         },
         fail: function(fn) {
            callbacks.fail = fn;
         }
      };

   };

   waitFn.until = function(condition) {
      waitFn({
         condition: condition
      });
   };

   return waitFn;

}());

ß.redirect = ß.core.redirect = function(url) {
   location.href = url;
}
