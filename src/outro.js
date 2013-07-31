ß.noConflict = function() {
   root.ß = previousScandio;

   return this;
};

if (typeof define === 'function' && define.amd) {
   define('Scandio', function() {
      return ß;
   });
}
}(this, jQuery, window, document));