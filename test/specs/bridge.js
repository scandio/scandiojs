describe("A suite testing the bridge functionality of scandio.js", function() {

   it("should persit simple values in the DOM-store", function() {
      Scandio.bridge.set('foo', 'bar');

      expect(Scandio.bridge.get('foo')).toEqual('bar');
   });

   it("should return default values on non-defined paths", function() {
      expect(Scandio.bridge.get('foo')).toEqual('bar');

      expect(Scandio.bridge.get('foo.bar', false)).toBe(false);
   });

   it("should overwrite defined values", function() {
      expect(Scandio.bridge.get('foo')).toEqual('bar');
      Scandio.bridge.set('foo', 'barbar');

      expect(Scandio.bridge.get('foo', false)).toEqual('barbar');
   });

   it("should persit nested values in the DOM-store", function() {
      Scandio.bridge.set('foo', {});
      Scandio.bridge.set('foo.bar', [1, 2, 3]);
      Scandio.bridge.set('foo.bar2', [4, 5, 6]);

      expect(Scandio.bridge.get('foo.bar')).toEqual([1, 2, 3]);
      expect(Scandio.bridge.get('foo.bar2')).toEqual([4, 5, 6]);

      expect(Scandio.bridge.get('foo.bar')).not.toEqual([4, 5, 6]);
   });

   it("should merge existing stores into one", function() {
      var
         script            = document.createElement("script");

      script.type       = "application/x-json";
      script.className  = Scandio.bridge.identifier;

      document.head.appendChild(script);

      $('.' + Scandio.bridge.identifier).last().text(Scandio.json.to({
         yada: {
            yada: 'yada',
            foo: 20
         }
      }));

      Scandio.bridge.init();

      expect(Scandio.bridge.get('foo.bar')).toEqual([1, 2, 3]);
      expect(Scandio.bridge.get('foo.bar2')).toEqual([4, 5, 6]);

      expect(Scandio.bridge.get('yada.yada')).toEqual('yada');
      expect(Scandio.bridge.get('yada.foo')).toEqual(20);
   });

});