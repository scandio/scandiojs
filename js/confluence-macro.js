window.$ = jQuery;

Scandio.confluence.macro = (function() {
   
   function disableMacro(macroNames, conditionFn) {
      if (conditionFn && !conditionFn()) return;
      
      var macroList = AJS.MacroBrowser.metadataList;
      if ($.type(macroNames) === 'string' && macroNames.indexOf(',') >= 0) {
         macroNames = macroNames.split(',');
         AJS.MacroBrowser.metadataList = jQuery.grep(macroList, function(macroObj) {
            return !$.inArray(macroObj.macroName, macroNames);
         });
      } else {
         AJS.MacroBrowser.metadataList = jQuery.grep(macroList, function(macroObj) {
            return macroObj.macroName !== macroNames;
         });
      }

      var execute = function(macroName) {
         $.each(macroNames, function(index, macroName) {
            $('#macro-insert-list li[data-macro-name="'+macroName+'"]').remove();
         });
         $.each(macroNames, function(index, macroName) {
            $('#macro-insert-list li[data-macro-name="'+macroName+'"]').remove();
         });
      };
      

      
         $.each
      }
   }
   
   return {
      disableMacro: disableMacro
   };
   
}());

Scandio.confluence.macro.disableMacro('toc')
