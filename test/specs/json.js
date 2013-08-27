describe("A suite testing json module", function() {
   var jsonObject;
   var jsonString;

   beforeEach(function() {
      jsonObject = {
         ID: null,
         name: "Doe",
         firstname: "John",
         age: 25,
         hobbies: [
            "reading", "cinema",
            {
               sports: ["volley-ball", "snowboard"]
            }
         ],
         address:{}
      };
      jsonString = '{"ID":null,"name":"Doe","firstname":"John","age":25,"hobbies":["reading","cinema",{"sports":["volley-ball","snowboard"]}],"address":{}}';
   });

   it("should correctly encode json (using native if possible)", function() {
      expect(jsonObject).toEqual( ß.json.from(jsonString) );
   });

   it("should correctly decode json (using native if possible)", function() {
      expect( ß.json.from(jsonString) ).toEqual( jsonObject );
   });

   it("should correctly encode json (using fallback)", function() {
      expect(jsonObject).toEqual( ß.json.from(jsonString) );
   });

   it("should correctly decode json (using fallback)", function() {
      expect( ß.json.from(jsonString) ).toEqual( jsonObject );
   });

});