// Function utilising ajax
// ---------------

// Register ajax namespace on scandiojs object
ß.ajax = {};

// Loads a in `requested` specified set of files from CDNs
// **Example:** ` cdnjs: [{repository: 'bacon.js', version: '0.6.8', file: 'Bacon.min.js'}]`
// Will *load* and inject the ´bacon.js´ library as a `<scipt />` right after the html's head-section.
// **Callback** function for each cdn should be defined on the ß.cdns-object below.
ß.libs = ß.ajax.libs = function(requested) {
   // Iterate over each cdn holding multiple libs
   ß.util.each(requested, function(libs, cdn) {
      // Check if the cdn has a callback otherwise trigger warn-message
      if (ß.isFunction( ß.cdns[cdn] )) {
         // Invoke callback and…
         ß.util.each(libs, function(lib) {
            // …load the library
            ß.ajax.script(ß.cdns[cdn](lib.repository, lib.version, lib.file));
         });
      } else {
         ß.debug.warn('CDN: ' + cdn + ' not defined in ß.cdns!');
      }
   });
};

// Object containing callback function per cdn invoked by requiring libs
// Every callback gets `repository, version and file` as parameters
ß.cdns = ß.ajax.cdns = {
   // Callback for cdnjs called as in `ß.libs({cdnjss: [...]})`
   'cdnjs' : function(repository, version, file) {
      return "//cdnjs.cloudflare.com/ajax/libs/"+repository+"/"+version+"/"+file;
   }
};

// Loads a in `requested` specified set of files by folder
// **Example:** `ß.plugins({'scandio.js/example/scripts/': ['alert', 'log']});`
// will load alert and log from their respective folder.
// *Notes:* the extension is ommited and the path is relative to `window.location.origin`
ß.plugins = ß.ajax.plugins = function(requested) {
   var
      url            = null,
      resultUrls     = [];

   // Each `requested`set of scripts
   ß.util.each(requested, function(scripts, folder) {
      // As script…
      ß.util.each(scripts, function(script) {
         // …and loading it by folder and script-name
         url = window.location.origin + '/' + folder + script + '.js';

         ß.ajax.script(url);

         resultUrls.push(url);
      });
   });

   return resultUrls;
};

// Helper function responsible for loading js-script-files
// Parameters are ´url´ as fully qualified url and an optional ´done´ callback
ß.ajax.script = function(url, done) {
   // Create script element and set its type
   var script = document.createElement("script");
   script.type = "text/javascript";

   // Bind to readyState or register ´onload´ callback
   if (script.readyState) {
      // Callback for IE's `onreadystatechange` (I feel seesick)
      script.onreadystatechange = function(){
         if (script.readyState == "loaded" || script.readyState == "complete") {
            script.onreadystatechange = null;

            // Invoke callback if passed and type is function
            if (ß.isFunction(done)) { done(); }
         }
      };
   } else {
      // Bind `onload` callback on script element
      script.onload = function(){
         // Invoke callback if passed and type is function
         if (ß.isFunction(done)) { done(); }
      };
   }

   // Set the url
   script.src = url;

   // Append it to the head
   // *Note:* Binding it to body not possible cause it may not be parsed if `ß.libs` is
   // called in html's head-section
   document.head.appendChild(script);

   return url;
};
