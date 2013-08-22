// DOM functionality
// ---------------

// Register dom namespace on scandiojs object

ß.dom = {};

// Closes and secures a cache module with within its own scope
// *Note:* This function being an IIFE leaves of parameters on outer function
ß.dom.cache = (function($, ß){
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
               if (coll[l] === t || $.contains(t,coll[l])) {
                  delete coll[l]; --coll.length;
               }
            }
         }
      },

      // Updates complete cache or scoped to a label
      update = function(label) {
         // Passed in label is string, scoping to that label
         if (ß.isString(label)) {
            //Reset cache value at label
            if(cache[label] !== undefined) {
               cache[label] = $(cache[label].selector || '');
            }
         } else {
            // For each value in cache refresh it
            ß.util.each(cache, function($cached, label) {
               cache[label] = $($cached.selector);
            });
         }
      },

      // Gets a value from cache or loads it from DOM
      get = function(label, selector) {
         // Both label and selector passed, cache/dom reading...
         if (ß.isString(selector) && ß.isString(label)) {
            // ...either from cache or DOM
            cache[label] = cache[label] || $(selector);
         }

         // What the callee gets: a jQuery object
         return cache[label];
      };

   // Bind to node removal in DOM
   $(document).on('DOMNodeRemoved', nodeRemoved);

   // Return public functions in object literal
   return {
      get:     get,
      update:  update
   };
}(jQuery, ß));
