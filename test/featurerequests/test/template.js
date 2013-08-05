// This is where to put your specs in jasmine BDD style example below
describe("tests on string module", function() {
   it("should have mixed in the module on namespace 'string'", function() {
      console.log(ß.string);

      expect(ß.string).toBeDefined();
   });

   it("should properly capitalize strings", function() {

      expect(ß.string.capitalize).toEqual(jasmine.any(Function));
      expect(ß.string.capitalize("yAy")).toEqual("Yay");
   });

   it("should properly lowercase strings", function() {
      expect(ß.string.lower).toEqual(jasmine.any(Function));
      expect(ß.string.lower("YAy")).toEqual("yay");
   });
});