// DOM module
// ---------------

// Register dom namespace on scandiojs object

Scandio.dom = {};

// Closes and secures a cache module with within its own scope
// *Note:* This function being an IIFE leaves of parameters on outer function
Scandio.dom.cache = (function(jQuery, Scandio){
   // Sets up local cache store
   var
      cache = {},

      // Handler of DOMNodeRemoved handling external node removals
      // Sorry, I didn't hack this
      nodeRemoved = function(event) {
         var label, coll, l, t = event.target;
         for (label in cache) {
            l = (coll = cache[label]).length;
            while (l--) {
               if (coll[l] === t || jQuery.contains(t,coll[l])) {
                  delete coll[l]; --coll.length;
               }
            }
         }
      },

      // Updates complete cache or scoped to a label
      update = function(label) {
         // Passed in label is string, scoping to that label
         if (Scandio.isString(label)) {
            //Reset cache value at label
            if(cache[label] !== undefined) {
               cache[label] = jQuery(cache[label].selector || '');
            }
         } else {
            // For each value in cache refresh it
            Scandio.util.each(cache, function($cached, label) {
               cache[label] = jQuery($cached.selector);
            });
         }
      },

      // Gets a value from cache or loads it from DOM
      get = function(label, selector) {
         // Both label and selector passed, cache/dom reading...
         if (Scandio.isString(selector) && Scandio.isString(label)) {
            // ...either from cache or DOM
            cache[label] = cache[label] || jQuery(selector);
         }

         // What the callee gets: a jQuery object
         return cache[label];
      };

   // Bind to node removal in DOM
   jQuery(document).on('DOMNodeRemoved', nodeRemoved);

   // Return public functions in object literal
   return {
      get: get,
      update: update
   };
}(jQuery, Scandio));
