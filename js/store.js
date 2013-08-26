// Persistent store module
// ---------------

// Register store namespace on scandiojs object
ß.store = {};

ß.store.init = (function() {
   if (injectDOM === false) { return; }

   var
      script     = document.createElement("script");

   script.type    = "application/x-json";
   script.id      = "scandio-js--store";

   ß.store.script = $(script);
   ß.store.script.text('{}');

   document.head.appendChild(script);

   ß.store.script = $(script);
})();

ß.store.get = function(dots, notFound) {
   if (injectDOM === false) { ß.debug.warn("DOM injection disabled globally, script-tag not present!"); return; }

   var storeData = $.parseJSON( ß.store.script.text() );

   return ß.util.getByDots(dots, storeData, notFound);
};

ß.store.set = function(dots, value) {
   if (injectDOM === false) { ß.debug.warn("DOM injection disabled globally, script-tag not present!"); return; }

   var storeData = $.parseJSON( ß.store.script.text() );

   ß.util.setByDots(dots, value, storeData);

   ß.store.script.text( JSON.stringify(storeData) );

   return value;
};
