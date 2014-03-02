// Confluence label extensions
// ---------------

Scandio.confluence.labels = (function() {

   /**
    * @return {array} The labels of the current COE as array.
    */
   function getLabelsArray() {
      return $('#labels-section .aui-label > a').map(function() {
         return $(this).html();
      }).get();
   }

   /**
    * @return {string} The labels of the current COE as string, comma-separated.
    */
   function getLabelsString() {
      var ret = "";
      var array = getLabelsArray();
      if (array.length) {
         ret = array.join(',');
      }
      return ret;
   }

   /**
    * @param {string} label The label to be checked.
    * @return {boolean} Flag indicating if the current COE has the given label.
    */
   function hasLabel(label) {
      return $.inArray(label, getLabelsArray()) >= 0;
   }

   return {
      hasLabel: hasLabel,
      getLabelsArray: getLabelsArray,
      getLabelsString: getLabelsString
   };

}());