describe("A suite testing the store functionality of scandio.js", function() {

   it("should persit simple values in the DOM-store", function() {
      ß.store.set('foo', 'bar');

      expect(ß.store.get('foo')).toEqual('bar');
   });

   it("should return default values on non-defined paths", function() {
      expect(ß.store.get('foo')).toEqual('bar');

      expect(ß.store.get('foo.bar', false)).toBe(false);
   });

   it("should overwrite defined values", function() {
      expect(ß.store.get('foo')).toEqual('bar');
      ß.store.set('foo', 'barbar');

      expect(ß.store.get('foo', false)).toEqual('barbar');
   });

   it("should persit nested values in the DOM-store", function() {
      ß.store.set('foo', {});
      ß.store.set('foo.bar', [1, 2, 3]);
      ß.store.set('foo.bar2', [4, 5, 6]);

      expect(ß.store.get('foo.bar')).toEqual([1, 2, 3]);
      expect(ß.store.get('foo.bar2')).toEqual([4, 5, 6]);

      expect(ß.store.get('foo.bar')).not.toEqual([4, 5, 6]);
   });

   it("should merge existing stores into one", function() {
      var
         script            = document.createElement("script");

      script.type       = "application/x-json";
      script.className  = $('.scandio-js--store').last().attr('class');

      document.head.appendChild(script);

      $('.scandio-js--store').last().text(JSON.stringify({
         yada: {
            yada: 'yada',
            foo: 20
         }
      }));

      ß.store.init();

      expect(ß.store.get('foo.bar')).toEqual([1, 2, 3]);
      expect(ß.store.get('foo.bar2')).toEqual([4, 5, 6]);

      expect(ß.store.get('yada.yada')).toEqual('yada');
      expect(ß.store.get('yada.foo')).toEqual(20);
   });

});