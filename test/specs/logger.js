describe("A suite testing the logger functions", function() {
   var logMethods;

   beforeEach(function() {
      logMethods = ['error', 'warn', 'info', 'debug', 'log'];
   });

   it("should exist a global variable for logging", function() {
      expect(ß.debug).toEqual(jasmine.any(Object));
   });

   it("should exist a logging function for any log method", function() {
      for (var i=0;i < logMethods.length; i++) {
         expect(ß.debug[ logMethods[i] ]).toEqual(jasmine.any(Function));
      }
   });

   it("should store debug statements in the log history", function() {
      for (var i=0;i < logMethods.length; i++) {
         ß.debug[ logMethods[i] ]("Testing some debugging here");

         expect(ß.logger.logs[ logMethods[i] ]).toContain("Testing some debugging here");
      }
   });

   it("should not log below the log level but store the history", function() {
      ß.logger.level = 2;

      spyOn(console, 'info');
      spyOn(console, 'debug');
      spyOn(console, 'log');

      for (var i=0;i < logMethods.length; i++) {
         ß.debug[ logMethods[i] ]("Testing some limited debugging here");

         expect(ß.logger.logs[ logMethods[i] ]).toContain("Testing some limited debugging here");
      }

      expect(console.info).not.toHaveBeenCalled();
      expect(console.debug).not.toHaveBeenCalled();
      expect(console.log).not.toHaveBeenCalled();
   });
});