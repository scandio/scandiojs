// Ajax module
// ---------------

// Register ajax namespace on scandiojs object
Scandio.ajax = {};

// Loads a in `requested` specified set of files from CDNs
// **Example:** ` Scandio.ajax.libs({cdnjs: [{repository: 'bacon.js', version: '0.6.8', file: 'Bacon.min.js'}]})`
// will be passed to the handler and inject the library as a `<scipt />` right after the html's head-section.
// **Callback** function for each cdn should be defined on the Scandio.cdns-object below.
Scandio.ajax.libs = function(requested) {
   // Iterate over each cdn holding multiple libs
   Scandio.util.each(requested, function(libs, cdn) {
      // Check if the cdn has a callback otherwise trigger warn-message
      if (Scandio.isFunction( Scandio.ajax.cdns[cdn] )) {
         // Invoke callback and…
         Scandio.util.each(libs, function(lib) {
            // …load the library
            Scandio.ajax.script(Scandio.ajax.cdns[cdn](lib.repository, lib.version, lib.file), lib.success || undefined);
         });
      } else {
         Scandio.debug.warn('CDN: ' + cdn + ' not defined in Scandio.ajax.cdns!');
      }
   });
};

// Object containing callback function per cdn invoked by requiring libs
// Every callback gets `repository, version and file` as parameters
Scandio.ajax.cdns = {
   // Callback for cdnjs called as in `Scandio.libs({cdnjss: [...]})`
   'cdnjs' : function(repository, version, file) {
      return "//cdnjs.cloudflare.com/ajax/libs/"+repository+"/"+version+"/"+file;
   }
};

// Loads a in `requested` specified set of files by folder
// **Example:** `Scandio.ajax.plugins({'scandio.js/example/scripts/': ['alert', 'log']});`
// will load alert and log from their respective folder.
// *Notes:* the extension is ommited and the path is relative to `window.location.origin`
Scandio.ajax.plugins = function(requested) {
   var
      url            = null,
      resultUrls     = [];

   // Each `requested`set of scripts
   Scandio.util.each(requested, function(scripts, folder) {
      // As script…
      Scandio.util.each(scripts, function(script) {
         // …and loading it by folder and script-name
         url = window.location.origin + '/' + folder + script + '.js';

         Scandio.ajax.script(url);

         resultUrls.push(url);
      });
   });

   return resultUrls;
};

// Loads a set of libs and plugin files based on a condition (the `when` key)
// *E.g.:* Calling Scandio.ajax.maybe({when: true, libs:…, plugins:…})
// The libs and plugins object literal should be used as in `Scandio.ajax.libs` and `Scandio.ajax.plugins`
Scandio.ajax.maybe = function(requested) {
   var
      url            = null,
      resultUrls     = [];

   // Each `requested`set of scripts
   Scandio.util.each(requested, function(request) {
      if (request.when) {
         if (Scandio.isObject( request.libs )) { Scandio.ajax.libs(request.libs); }
         if (Scandio.isObject( request.plugins )) { Scandio.ajax.plugins(request.plugins); }
      }
   });

   return resultUrls;
};

// Helper function responsible for loading js-script-files
// Parameters are ´url´ as fully qualified url and an optional `success` callback
Scandio.ajax.script = function(url, success) {
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
            if (Scandio.isFunction(success)) { success(); }
         }
      };
   } else {
      // Bind `onload` callback on script element
      script.onload = function(){
         // Invoke callback if passed and type is function
         if (Scandio.isFunction(success)) { success(); }
      };
   }

   // Set the url
   script.src = url;

   // Append it to the head
   // *Note:* Binding it to body not possible cause it may not be parsed if `Scandio.libs` is
   // called in html's head-section
   document.head.appendChild(script);

   return url;
};
