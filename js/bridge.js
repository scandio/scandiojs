// Persistent bridge module
// ---------------

// Register store namespace on scandiojs object
Scandio.bridge = {};
Scandio.bridge.identifier = config.scandioBridgeClass;

// IFFE setting up the store and merging all n possible 'script-tags' into one
Scandio.bridge.init = function() {
   // Gets all scripts and sets up the cache for merging
   var
      scripts     = jQuery('.' + Scandio.bridge.identifier),
      tempCache   = null,
      mergeCache  = {};

   // The main script to be the merge-bucket
   Scandio.bridge.script = jQuery('head #' + Scandio.bridge.identifier);

   // Respects actually used script-tag having data already
   mergeCache = Scandio.bridge.script.text() !== "" && Scandio.isObject(
      tempCache = Scandio.json.from(
         Scandio.bridge.script.text()
      )
   ) ? tempCache : mergeCache;

   // Collects each's script text and merges it into the `mergeCache` while
   // removing it afterwards
   Scandio.util.each(scripts, function(script) {
      var $script    = jQuery(script);

      Scandio.util.extend(mergeCache, Scandio.json.from( $script.text() ));

      $script.remove();
   });

   // Updates the merged contents to the main-script
   Scandio.bridge.script.text( Scandio.json.to(mergeCache) );

   return Scandio.bridge.script.length === 1;
};

// Gets a value from the script-tag
// *E.g.:* `Scandio.bridge.get('firms.microsoft', false)` might return a company object-literal
// or false if it is not set
Scandio.bridge.get = function(dots, notFound) {
   // Break early if DOM-injection is disabled
   if (injectDOM === false) { Scandio.debug.warn("DOM injection disabled globally, script-tag not present!"); return; }

   // Parses the data from the script (ran everytime to not run into update-read conflicts)
   var storeData = Scandio.json.from( Scandio.bridge.script.text() );

   // Gets the demanded value by dot-notation
   return Scandio.util.getByDots(dots, storeData, notFound);
};

// Sets a value on the script-tag
// *E.g.: `Scandio.bridge.set('firms.scandio, {name: 'Scandio GmbH'})` will add the scandio literal to the firms
// object. It will overwrite an existing entry and fail if `firms` it not an object but a primitive type.
Scandio.bridge.set = function(dots, value) {
   // Break early if DOM-injection is disabled
   if (injectDOM === false) { Scandio.debug.warn("DOM injection disabled globally, script-tag not present!"); return; }

   // Parses the data from the script (ran everytime to not run into update-read conflicts)
   var storeData = Scandio.json.from( Scandio.bridge.script.text() );

   // Sets the value by dot-notation on the retrieved data
   Scandio.util.setByDots(dots, value, storeData);
   // while setting it as strinfified JSON on the script-tag afterwards
   Scandio.bridge.script.text( Scandio.json.to(storeData) );

   // Returns the value so tmpl/views can pipe it through
   return value;
};
