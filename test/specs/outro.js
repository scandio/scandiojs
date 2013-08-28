describe("A suite testing the outro", function() {
   it("should have a conflict resolution function", function() {
      expect(Scandio.noConflict).toEqual(jasmine.any(Function));
   });
});