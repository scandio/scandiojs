describe("A suite testing the DOM functions", function() {
   describe("tests on the DOM-cache", function() {
      it("should get existing objects from the DOM", function() {
          expect(ß.dom.cache.get('body', 'body').length).not.toEqual(0);
      });

      it("should return cached objects and their attributes (live)", function() {
         $('body').addClass('added-later');
         expect(ß.dom.cache.get('body').hasClass('added-later')).toBe(true);
      });

      it("should return cached objects which may differ from the DOM's", function() {
         $('body').append('<ul><li>1</li><li>2</li></ul>');
         ß.dom.cache.get('another-list', 'body > ul:last li')

         expect(ß.dom.cache.get('a-list', 'body > ul:last li').length).toEqual(2);

         $('body > ul:last').append('<li>3</li>');

         expect(ß.dom.cache.get('a-list').length).toEqual(2);
      });

      it("should allow updating all objects and single ones by label", function() {
         ß.dom.cache.update('a-list');

         expect(ß.dom.cache.get('a-list').length).toEqual(3);

         ß.dom.cache.update();

         expect(ß.dom.cache.get('a-list').length).toEqual(3);
         expect(ß.dom.cache.get('another-list').length).toEqual(3);

         $('body > ul:last').remove();
      });
   });
});