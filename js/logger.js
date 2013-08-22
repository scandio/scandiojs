// Debug/logging module
// ---------------

// Sets up logger object with level and log-history
ß.logger = {
   level: 5,
   logs: {},
   logDom: false
};

ß.logger.logDomFn = (function() {
   return ß.logger.logDom || ( window.location.href.indexOf("scandiojs-log-dom") > -1);
}());

ß.debug = {};

// `ß.debug` will get a set of methods (*see return-statement*)
ß.debug = (function(){
   var
      console              = window.console,
      length               = logMethods.length,
      methods              = {},
      logOuterWrapperPath  = 'scandio-log',
      $loggerEl            = null,
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
            logElWrapperPath     = logOuterWrapperPath + '--' + method,
            logElInnerPath       = 'alert alert-' + alertEls[method] || method,
            logElIdentifier      = '.alert.alert-' + alertEls[method] || method,
            $logEl               = [];

         // Sets up history for the log-method
         ß.logger.logs[method] = [];

         if (ß.logger.logDomFn === true) {
            $(function() {
               $loggerEl.append(
                  $('<div/>', {
                     class: logElWrapperPath
                  }).html(
                     $('<div />', {
                        class: logElInnerPath
                     })
                  )
               );
            });
         }

         ß.dom[method] = function() {
            var args = slice.call(arguments);

            if ($logEl.length === 0) { $logEl = $(logElIdentifier); }

            if (ß.logger.logDomFn && $logEl.length > 0) { $logEl.append(args.join(', ') + '<hr />'); }
         };

         // The return value's log-type gets a function
         methods[method] = function() {
            // Lets get some arguments
            var args = slice.call(arguments);

            // Only log to console if required by level
            if (ß.logger.level > level) {
               console[method].apply(console, args);
               if (ß.logger.logDomFn === true) { ß.dom[method].apply(ß, args); }
            }

            // but always push it to history
            ß.logger.logs[method].push(args.join(', '));
         };
      };

   if (ß.logger.logDomFn === true) {
      $(function() {
         $loggerEl = $('<div/>', {
            class: logOuterWrapperPath
         }).appendTo($scandioEl);
      });
   }

   // For every console-method
   while(length--) { createLogger(logMethods[length], length); }

   // Now the `ß.debug`-object gets its functions
   return methods;
})();