ß.logger = {
   level: 5,
   logs: {}
};

ß.debug = (function(){
   var
      console  = window.console,
      length   = logMethods.length,
      methods  = {};

   while(length--) {
      (function(method, level) {
         ß.logger.logs[method]   = [];

         methods[method] = function() {
            var args = slice.call(arguments);

            if(ß.logger.level >= level) {
               console[method].apply(console, args);
            }

            ß.logger.logs[method].push(args.join(', '));
         };
      })(logMethods[length], length);
   }

   return methods;
})();
