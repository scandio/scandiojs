// Debug/logging module
// ---------------

// Sets up logger object with level and log-history
ß.logger = {
   level: 5,
   logs: {}
};

// `ß.debug` will get a set of methods (*see return-statement*)
ß.debug = (function(){
   var
      console  = window.console,
      length   = logMethods.length,
      methods  = {},
      // Closes the scope for `method and level`
      // *Note:* Due to js and its state-maintainance for closures
      // the last passed argument would otherwise win
      createLogger = function (method, level) {
         // Sets up history for the log-method
         ß.logger.logs[method] = [];

         // The return value's log-type gets a function
         methods[method] = function() {
            // Lets get some arguments
            var args = slice.call(arguments);

            // Only log to console if required by level
            if(ß.logger.level > level) {
               console[method].apply(console, args);
            }

            // but always push it to history
            ß.logger.logs[method].push(args.join(', '));
         };
      };

   // For every console-method
   while(length--) { createLogger(logMethods[length], length); }

   // Now the `ß.debug`-object gets its functions
   return methods;
})();
