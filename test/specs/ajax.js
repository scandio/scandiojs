describe("A suite testing ajax functionality of scandio.js", function() {
   var scriptUrl = "//cdnjs.cloudflare.com/ajax/libs/bacon.js/0.6.8/Bacon.min.js";
   var temp = null;

   beforeEach(function() {
      spyOn(ß.ajax, 'script').andCallThrough();

      temp = ß.ajax.script("//cdnjs.cloudflare.com/ajax/libs/bacon.js/0.6.8/Bacon.min.js");
   });

   it("should maintain a set of callbacks for cdns", function() {
      expect(ß.ajax.cdns).toEqual(jasmine.any(Object));
   });

   it("should be able to contruct a proper url from a cdnjs", function() {
      expect(ß.ajax.cdns.cdnjs(
         'bacon.js',
         '0.6.8',
         'Bacon.min.js'
      )).toEqual(scriptUrl);
   });

   it("is should construct a script tag", function() {
      expect(ß.ajax.cdns.cdnjs(
         'bacon.js',
         '0.6.8',
         'Bacon.min.js'
      )).toEqual(scriptUrl);

      expect(ß.ajax.script).toHaveBeenCalled();

      expect(temp).toEqual(scriptUrl);
   });

   it("should construct a set of valid plugin urls", function() {
      var resultUrls = ß.ajax.plugins({
         'scandio.js/example/scripts/': ['alert', 'log']
      });

      expect(resultUrls).toMatch('scandio.js/example/scripts/alert.js');
      expect(resultUrls).toMatch('scandio.js/example/scripts/log.js');
      expect(resultUrls).not.toMatch('scandio.js/example/scripts/warn.js');
   });
});