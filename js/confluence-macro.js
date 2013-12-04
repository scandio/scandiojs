// Confluence macro utils
// ---------------

Scandio.confluence.macro = (function() {
   
   /**
    * Disable the macros defined as macroNames in the current Confluence editor.
    * If a function is given as second parameter, the macros are only disabled if
    * the return value of the function is true.
    * @param {String|Array} macroNames String or array of macro names. Can look like:
    *    1) 'macroName'
    *    2) 'macroName1,macroName2,macroName3'
    *    3) ['macroName1', 'macroName2', 'macroName3']
    */
   function disableMacro(macroNames, conditionFn) {
      if (conditionFn && !conditionFn()) return;

      var macroList = AJS.MacroBrowser.metadataList;
      if ($.type(macroNames) === 'string' && macroNames.indexOf(',') >= 0) {
         macroNames = macroNames.split(',');
         AJS.MacroBrowser.metadataList = jQuery.grep(macroList, function(macroObj) {
            return $.inArray(macroObj.macroName, macroNames) < 0;
         });
      } else {
         AJS.MacroBrowser.metadataList = jQuery.grep(macroList, function(macroObj) {
            return macroObj.macroName !== macroNames;
         });
      }
   }
   
   return {
      disableMacro: disableMacro
   };
   
}());