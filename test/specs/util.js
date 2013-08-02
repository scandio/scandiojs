describe("A suite testing the initialization of scandio.js", function() {
   var obj = null;
   var temp = null;

   beforeEach(function() {
      temp = null;
      obj = {
         str: 'string',
         some: 1,
         func: function() {
           return 'string';
         },
         arr: [2, 4, 13]
      };
   });

   describe("tests on object properties", function() {
      it("should return correctly check on object props", function() {
          expect(ß.util.has(obj, 'str')).toBe(true);
          expect(ß.util.has(obj, 'some')).toBe(true);
          expect(ß.util.has(obj, 'func')).toBe(true);
      });

      it("should not assume unexistent props on an object", function() {
          expect(ß.util.has(obj, 'str2')).toBe(false);
          expect(ß.util.has(obj, 'func2')).toBe(false);
      });
   });

   describe("tests on object iteration with each", function() {
      it("give a proper value and iteration count", function() {
         ß.util.each([1, 2, 3], function(num, i) {
            expect(num).toEqual(i + 1);
         });
      });

      it("should iterate properly over object-hashes not the prototype", function() {
         obj = { one : 1, two : 2, three : 3 };
         obj.constructor.prototype.four = 4;
         temp = [];

         ß.util.each(obj, function(value, key) {
            temp.push(key);
         });

         expect(temp.join(", ")).toEqual('one, two, three');
      });

      it("should handle null props", function() {
         temp = 42;

         ß.util.each(null, function(value, key) {
            temp = value;
         });

         expect(temp).toEqual(42);
      });
   });

   describe("tests on filtering objects", function() {
      it("should filter values of an object", function() {
         temp = ß.util.filter(obj, function(prop) {
            return prop === 1;
         });

         expect(temp).toContain(1);
         expect(temp).not.toContain('string');
      });

      it("should filter values of an array", function() {
         temp = ß.util.filter(obj.arr, function(num) {
            return num % 2 == 0;
         });

         expect(temp).toContain(2);
         expect(temp).toContain(4);
         expect(temp).not.toContain(13);
      });
   });

   describe("tests on mixing in another module", function() {
      it("should mixin function of a passed object", function() {
         ß.util.mixin('string', {
           capitalize : function(string) {
             return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
           }
         });

         expect(ß.string).toBeDefined();
         expect(ß.string.capitalize('yay')).toEqual('Yay');
      });

      it("should not mixin anything except an function", function() {
         ß.util.mixin('string', {
           lowercase : function(string) {
             return string.toLowerCase();
           },
           another : 'maybe is around'
         });

         expect(ß.string).toBeDefined();
         expect(ß.string.another).not.toBeDefined();

         expect(ß.string.lowercase).toEqual(jasmine.any(Function));
         expect(ß.string.lowercase('Yay')).toEqual('yay');
      });
   });

   describe("tests on getting functions of an object", function() {
      it("should only return functions", function() {
         temp = ß.util.functions(obj);

         ß.util.each(temp, function(value, key) {
            expect(value).toEqual(jasmine.any(Function));
         });
      });
   });
});