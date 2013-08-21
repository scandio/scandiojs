// This is where to put your specs in jasmine BDD style example below
describe("Tests on string module", function() {
   it("should have mixed in the module on namespace 'string'", function() {
      expect(ß.string.custom).toBeDefined();
   });

   it("should properly capitalize strings", function() {

      expect(ß.string.custom.capitalize).toEqual(jasmine.any(Function));
      expect(ß.string.custom.capitalize("yAy")).toEqual("Yay");
   });

   it("should properly lowercase strings", function() {
      expect(ß.string.custom.lower).toEqual(jasmine.any(Function));
      expect(ß.string.custom.lower("YAy")).toEqual("yay");
   });
});