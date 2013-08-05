describe("A suite testing the type checking functionality", function() {
   var types;

   beforeEach(function() {
      consoleMethods = ['Array', 'Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'];
   });

   it("should correctly test on primitive types", function() {
      expect(ß.isArray([])).toBe(true);
      expect(ß.isFunction(new Function)).toBe(true);
      expect(ß.isString("")).toBe(true);
      expect(ß.isDate(new Date())).toBe(true);
      expect(ß.isRegExp(new RegExp)).toBe(true);
      expect(ß.isNumber(1)).toBe(true);
      expect(ß.isNumber(1.5)).toBe(true);
      expect(ß.isArguments(arguments)).toBe(true);
   });

   it("should not duck punch things", function() {
      expect(ß.isArray({})).toBe(false);
      expect(ß.isFunction("new Function")).toBe(false);
      expect(ß.isNumber("1")).toBe(false);
      expect(ß.isNumber("2")).not.toBe(true);
      expect(ß.isArguments([])).not.toBe(true);
   });

   it("should check the type of objects", function() {
      expect(ß.isObject({})).toBe(true);
   });
});