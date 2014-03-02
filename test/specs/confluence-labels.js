describe("A suite testing the confluence-labels module", function() {
   
   beforeEach(function() {
      var testLabels = ['label1', 'label2', 'umläutLabel'];
      $(document.body).append('<div id="labels-section">');
      $('#labels-section').append('<ul class="label-list"></ul>');
      $.each(testLabels, function(index, value) {
         $('.label-list').append('<li class="aui-label"><a href="#">'+ value +'</a></li>');
      });
   });
   
   it('Should be an object on Scandio.confluence', function() {
      expect(Scandio.confluence.labels).toEqual(jasmine.any(Object));
   });
   
   describe("Tests for hasLabel", function() {
      it("Should be a function on Scandio.confluence.labels", function() {
         expect(Scandio.confluence.labels);
      });
   });

});