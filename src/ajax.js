ß.ajax = {};

ß.libs = function(requested) {
   ß.util.each(requested, function(libs, cdn) {
      if (ß.isFunction( ß.cdns[cdn] )) {
         ß.util.each(libs, function(lib) {
            ß.ajax.script(ß.cdns[cdn](lib.repository, lib.version, lib.file));
         });
      } else {
         ß.debug.warn('CDN: ' + cdn + ' not defined in ß.cdns!');
      }
   });
};

ß.cdns = {
   'cdnjs' : function(repository, version, file) {
      return "//cdnjs.cloudflare.com/ajax/libs/"+repository+"/"+version+"/"+file;
   }
};

ß.plugins = function(requested) {
   ß.util.each(requested, function(scripts, folder) {
      ß.util.each(scripts, function(script) {
         ß.ajax.script(window.location.origin + '/' + folder + script + '.js');
      });
   });
};

ß.ajax.script = function(url, done) {
   var script = document.createElement("script");
   script.type = "text/javascript";

   if (script.readyState) {
       script.onreadystatechange = function(){
           if (script.readyState == "loaded" || script.readyState == "complete") {
               script.onreadystatechange = null;

               ß.isFunction(done) && done();
           }
       };
   } else {
       script.onload = function(){
           ß.isFunction(done) && done();
       };
   }

   script.src = url;

   document.head.appendChild(script);
}
