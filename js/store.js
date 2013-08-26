// Persistent store module
// ---------------

// Register store namespace on scandiojs object
ß.store = {};

// IFFE setting up the store and merging all n possible 'script-tags' into one
ß.store.init = function() {
   // Gets all scripts and sets up the cache for merging
   var
      scripts     = $('.' + scandioStoreClass),
      mergeCache  = {};

   // The main script to be the merge-bucket
   ß.store.script = scripts.last();

   // Collects each's script text and merges it into the `mergeCache` while
   // removing it afterwards
   ß.util.each(scripts.slice(0, scripts.length - 2), function(script) {
      ß.util.extend(mergeCache, $.parseJSON( script.text() ));
      script.remove();
   });

   // Updates the merged contents to the main-script
   ß.store.script.text( JSON.stringify(mergeCache) );

   return true;
};

// Gets a value from the script-tag
// *E.g.:* `ß.store.get('firms.microsoft', false)` might return a company object-literal
// or false if it is not set
ß.store.get = function(dots, notFound) {
   // Break early if DOM-injection is disabled
   if (injectDOM === false) { ß.debug.warn("DOM injection disabled globally, script-tag not present!"); return; }

   // Parses the data from the script (ran everytime to not run into update-read conflicts)
   var storeData = $.parseJSON( ß.store.script.text() );

   // Gets the demanded value by dot-notation
   return ß.util.getByDots(dots, storeData, notFound);
};

// Sets a value on the script-tag
// *E.g.: `ß.store.set('firms.scandio, {name: 'Scandio GmbH'})` will add the scandio literal to the firms
// object. It will overwrite an existing entry and fail if `firms` it not an object but a primitive type.
ß.store.set = function(dots, value) {
   // Break early if DOM-injection is disabled
   if (injectDOM === false) { ß.debug.warn("DOM injection disabled globally, script-tag not present!"); return; }

   // Parses the data from the script (ran everytime to not run into update-read conflicts)
   var storeData = $.parseJSON( ß.store.script.text() );

   // Sets the value by dot-notation on the retrieved data
   ß.util.setByDots(dots, value, storeData);
   // while setting it as strinfified JSON on the script-tag afterwards
   ß.store.script.text( JSON.stringify(storeData) );

   // Returns the value so tmpl/views can pipe it through
   return value;
};
