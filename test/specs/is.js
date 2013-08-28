describe("A suite testing the type checking functionality", function() {
   var types;

   beforeEach(function() {
      consoleMethods = ['Array', 'Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'];
   });

   it("should correctly test on primitive types", function() {
      expect(Scandio.isArray([])).toBe(true);
      expect(Scandio.isFunction(new Function)).toBe(true);
      expect(Scandio.isString("")).toBe(true);
      expect(Scandio.isDate(new Date())).toBe(true);
      expect(Scandio.isRegExp(new RegExp)).toBe(true);
      expect(Scandio.isNumber(1)).toBe(true);
      expect(Scandio.isNumber(1.5)).toBe(true);
      expect(Scandio.isArguments(arguments)).toBe(true);
   });

   it("should not duck punch things", function() {
      expect(Scandio.isArray({})).toBe(false);
      expect(Scandio.isFunction("new Function")).toBe(false);
      expect(Scandio.isNumber("1")).toBe(false);
      expect(Scandio.isNumber("2")).not.toBe(true);
      expect(Scandio.isArguments([])).not.toBe(true);
   });

   it("should check the type of objects", function() {
      expect(Scandio.isObject({})).toBe(true);
   });
});