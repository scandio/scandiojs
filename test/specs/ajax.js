describe("A suite testing ajax functionality of scandio.js", function() {
   var scriptUrl = "//cdnjs.cloudflare.com/ajax/libs/bacon.js/0.6.8/Bacon.min.js";
   var temp = null;

   beforeEach(function() {
      spyOn(Scandio.ajax, 'script').andCallThrough();

      temp = Scandio.ajax.script("//cdnjs.cloudflare.com/ajax/libs/bacon.js/0.6.8/Bacon.min.js");
   });

   it("should maintain a set of callbacks for cdns", function() {
      expect(Scandio.ajax.cdns).toEqual(jasmine.any(Object));
   });

   it("should be able to contruct a proper url from a cdnjs", function() {
      expect(Scandio.ajax.cdns.cdnjs(
         'bacon.js',
         '0.6.8',
         'Bacon.min.js'
      )).toEqual(scriptUrl);
   });

   it("is should construct a script tag", function() {
      expect(Scandio.ajax.cdns.cdnjs(
         'bacon.js',
         '0.6.8',
         'Bacon.min.js'
      )).toEqual(scriptUrl);

      expect(Scandio.ajax.script).toHaveBeenCalled();

      expect(temp).toEqual(scriptUrl);
   });

   it("should construct a set of valid plugin urls", function() {
      var resultUrls = Scandio.ajax.plugins({
         'scandio.js/example/scripts/': ['debug-error', 'debug-log']
      });

      expect(resultUrls).toMatch('scandio.js/example/scripts/debug-error.js');
      expect(resultUrls).toMatch('scandio.js/example/scripts/debug-log.js');
      expect(resultUrls).not.toMatch('scandio.js/example/scripts/debug-warn.js');
   });
});