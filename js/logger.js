// Debug/logging module
// ---------------

// Sets up logger object with level and log-history
ß.logger = {
   level: 5,
   logs: {},
   logDom: false
};

ß.debug = {};

// `ß.debug` will get a set of methods (*see return-statement*)
ß.debug = (function(){
   var
      console  = window.console,
      length   = logMethods.length,
      methods  = {},
      alertEls = {
         debug: 'info',
         error: 'danger',
         info: 'info',
         log: 'success',
         warn: 'warning'
      },
      // Closes the scope for `method and level`
      // *Note:* Due to js and its state-maintainance for closures
      // the last passed argument would otherwise win
      createLogger = function (method, level) {
         var
            logElWrapperPath  = 'scandio-log--' + method,
            logElInnerPath    = 'alert alert-' + alertEls[method] || method;

         // Sets up history for the log-method
         ß.logger.logs[method] = [];

         if (ß.logger.logDom === true) {
            $(function() {
               $('<div/>', {
                  class: logElWrapperPath
               }).appendTo($scandioEl).html(
                  $('<div />', {
                     class: logElInnerPath
                  })
               );
            });

            ß.dom[method] = function(msg) {
               var
                  className = ".alert-" + alertEls[method] || method,
                  $logEl = ß.dom.cache.get(logElInnerPath, className).length > 0 ?
                     ß.dom.cache.get(logElInnerPath, className) : ß.dom.cache.update(logElInnerPath);

               if (ß.logger.logDom && $logEl && $logEl.length > 0) { $logEl.append(msg + '<hr />'); }
            };
         }

         // The return value's log-type gets a function
         methods[method] = function() {
            // Lets get some arguments
            var args = slice.call(arguments);

            // Only log to console if required by level
            if (ß.logger.level > level) {
               console[method].apply(console, args);
               ß.dom[method].apply(ß, args);
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