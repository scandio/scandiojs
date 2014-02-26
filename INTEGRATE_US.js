// BEGIN: add a function hasLabel to AJS.Labels

(function($) {
   
   function hasLabel(label) {
      var labelsArray = $('#labels-section .aui-label > a').map(function() {
         return $(this).html();
      });
      console.log(labelsArray);
   }
   
   


}(jQuery))

$('#labels-section .aui-label > a').map(function() {
   
});
   
// END