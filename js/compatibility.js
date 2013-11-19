// Compatibility module
// ---------------

// Backwards compatibility fixes for old browsers or old library versions

// Fix Array.prototype.indexOf for old browsers
if (!ArrayProto.indexOf) {
   ArrayProto.indexOf = function(needle, fromIndex) {
      return $.inArray(needle, this, fromIndex);
   };
}

// jQuery.fn.on was added in version 1.7. Its similar predecessor was "bind".
// We delegate to "bind" in old jQuery versions.
if (!$.fn.on) {
   $.fn.on = $.fn.bind;
}
