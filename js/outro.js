// Outro, AMD and conflict resolution
// ---------------

// Global DOM-Ready which shall be used whenever possible
// Logger does not use it cause it heavily relies on variable hoisting
jQuery(function() {
   Scandio.bridge.init();
});

// Tries to resolve version conflicts by restoring the previously loaded version globally
Scandio.noConflict = function() {
   // Retore the `previousScandio`
   root.Scandio = previousScandio;

   // Return yerself to continue
   return this;
};

// Support for AMD/RequireJS
// If define function deefined and its amd
if (typeof define === 'function' && define.amd) {
   // Define Scandio
   define('Scandio', function() {
      // and return the library
      return Scandio;
   });
}
}(this, jQuery, window, document, undefined));