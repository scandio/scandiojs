// This is where to put your specs in jasmine BDD style example below
describe("Tests on string module", function() {
   it("should have mixed in the module on namespace 'string.custom'", function() {
      expect(Scandio.string.custom).toBeDefined();
   });

   it("should properly capitalize strings", function() {
      expect(Scandio.string.custom.capitalize).toEqual(jasmine.any(Function));
      expect(Scandio.string.custom.capitalize("yAy")).toEqual("Yay");
   });

   it("should properly lowercase strings", function() {
      expect(Scandio.string.custom.lower).toEqual(jasmine.any(Function));
      expect(Scandio.string.custom.lower("YAy")).toEqual("yay");
   });
});