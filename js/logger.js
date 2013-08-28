// Debug/logging module
// ---------------

// Sets up logger object with level and log-history
Scandio.logger = {
   level: 5,
   logs: {},
   logDom: false
};

// Define default logger callback if no custom callback defined
Scandio.logger.logDomFn = Scandio.logger.logDomFn || (function() {
   return Scandio.logger.logDom || ( window.location.href.indexOf(urlHooks.domLogging) > -1);
}());

Scandio.debug = {};

// `Scandio.debug` will get a set of methods (*see return-statement*)
Scandio.debug = (function() {
   var
      // Shorthands, DOM-element mappings and caching variables
      console              = window.console,
      length               = logMethods.length,
      methods              = {},
      logOuterWrapperPath  = 'scandio-log',
      logElType            = '<div />',
      $loggerEl            = null,
      alertEls = {
         debug:   'info',
         error:   'danger',
         info:    'info',
         log:     'success',
         warn:    'warning'
      },
      // Pretty prints a log message stringifying objects and arrays as JSON
      logMessage           = function(args) {
         var
            response    = [];

         // Each arguement processed separately
         Scandio.util.each(args, function(arg) {
            // If it is an object || array stringify its value
            if ( (Scandio.isObject(arg) || Scandio.isArray(arg) ) ) {
               response.push( Scandio.json.to(arg) );
            } else {
               // otherwise toString it
               response.push(arg);
            }
         });

         return response.join(' ,');
      },
      // Closes the scope for `method and level`
      // *Note:* Due to js and its state-maintainance for closures
      // the last passed argument would otherwise win
      createLogger = function (method, level) {
         // DOM-Element names and cache variable
         var
            logElWrapperPath     = logOuterWrapperPath + '--' + method,
            logElInnerPath       = 'alert alert-' + alertEls[method] || method,
            logElIdentifier      = '.' + Scandio.string.replace(logElInnerPath, ' ', '.'),
            $logEl               = [];

         // Sets up history for the log-method
         Scandio.logger.logs[method] = [];

         // Creates the logger-els only if logDomFn is truthy
         if (Scandio.logger.logDomFn === true) {
            jQuery(function() {
               // Maintaines state and creates the logger els
               $loggerEl.append(
                  jQuery(logElType, {
                     class: logElWrapperPath
                  }).html(
                     jQuery(logElType, {
                        class: logElInnerPath
                     })
                  )
               );

               $logEl = jQuery(logElIdentifier);

               Scandio.util.each(Scandio.logger.logs[method], function(log) {
                  $logEl.prepend(log + '<hr />');
               });
            });
         }

         // Registers function on DOM-Module for logging with method-name
         Scandio.dom[method] = function() {
            var args = slice.call(arguments);

            // Query DOM only if nessesary (cache)
            if ($logEl.length === 0) { $logEl = jQuery(logElIdentifier); }

            // Only log to DOM if possible and wanted
            if (Scandio.logger.logDomFn && $logEl.length > 0) { $logEl.prepend(logMessage(args) + '<hr />'); }
         };

         // The return value's log-type gets a function
         methods[method] = function() {
            // Lets get some arguments
            var args = slice.call(arguments);

            // Only log to console if required by level
            if (Scandio.logger.level > level) {
               // Calls the native console method
               console[method].apply(console, args);

               // Logs to DOM (function itself decides if intended)
               Scandio.dom[method].apply(Scandio, args);
            }

            // but always push it to history
            Scandio.logger.logs[method].push( logMessage(args) );
         };
      };

   // Sets up the outer wrapper for DOM logging
   if (Scandio.logger.logDomFn === true) {
      jQuery(function() {
         $loggerEl = jQuery(logElType, {
            class: logOuterWrapperPath
         }).appendTo($scandioEl);
      });
   }

   // For every console-method
   while(length--) { createLogger(logMethods[length], length); }

   // Now the `Scandio.debug`-object gets its functions
   return methods;
})();
