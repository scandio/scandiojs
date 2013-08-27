// Persistent bridge module
// ---------------

// Register store namespace on scandiojs object
ß.bridge = {};
ß.bridge.className = config.scandioBridgeClass;

// IFFE setting up the store and merging all n possible 'script-tags' into one
ß.bridge.init = function() {
   // Gets all scripts and sets up the cache for merging
   var
      scripts     = $('.' + ß.bridge.className),
      tempCache   = null,
      mergeCache  = {};

   // The main script to be the merge-bucket
   ß.bridge.script = scripts.last();

   // Respects actually used script-tag having data already
   mergeCache = ß.bridge.script.text() !== "" && ß.isObject(
      tempCache = $.parseJSON(
         ß.bridge.script.text()
      )
   ) ? tempCache : mergeCache;

   // Collects each's script text and merges it into the `mergeCache` while
   // removing it afterwards
   ß.util.each(scripts.slice(0, scripts.length - 1), function(script) {
      ß.util.extend(mergeCache, ß.json.from( $(script).text() ));
      script.remove();
   });

   // Updates the merged contents to the main-script
   ß.bridge.script.text( ß.json.to(mergeCache) );

   return ß.bridge.script.length === 1;
};

// Gets a value from the script-tag
// *E.g.:* `ß.bridge.get('firms.microsoft', false)` might return a company object-literal
// or false if it is not set
ß.bridge.get = function(dots, notFound) {
   // Break early if DOM-injection is disabled
   if (injectDOM === false) { ß.debug.warn("DOM injection disabled globally, script-tag not present!"); return; }

   // Parses the data from the script (ran everytime to not run into update-read conflicts)
   var storeData = ß.json.from( ß.bridge.script.text() );

   // Gets the demanded value by dot-notation
   return ß.util.getByDots(dots, storeData, notFound);
};

// Sets a value on the script-tag
// *E.g.: `ß.bridge.set('firms.scandio, {name: 'Scandio GmbH'})` will add the scandio literal to the firms
// object. It will overwrite an existing entry and fail if `firms` it not an object but a primitive type.
ß.bridge.set = function(dots, value) {
   // Break early if DOM-injection is disabled
   if (injectDOM === false) { ß.debug.warn("DOM injection disabled globally, script-tag not present!"); return; }

   // Parses the data from the script (ran everytime to not run into update-read conflicts)
   var storeData = ß.json.from( ß.bridge.script.text() );

   // Sets the value by dot-notation on the retrieved data
   ß.util.setByDots(dots, value, storeData);
   // while setting it as strinfified JSON on the script-tag afterwards
   ß.bridge.script.text( ß.json.to(storeData) );

   // Returns the value so tmpl/views can pipe it through
   return value;
};
