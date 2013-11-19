describe("A suite testing the compatibility module of scandiojs", function() {

   it("should find the correct index of an array's element", function() {
      var numbers = [1,2,3];
      var strings = ["Scandio", "rocks", "!"];

      expect(numbers.indexOf(2)).toEqual(1);
      expect(strings.indexOf("!")).toEqual(2);
   });

   it("should not find unexistent values within an array", function() {
      var numbers = [1,2,3];
      var strings = ["Scandio", "rocks", "!"];

      expect(numbers.indexOf(4)).toEqual(-1);
      expect(strings.indexOf("?")).toEqual(-1);
   });

});