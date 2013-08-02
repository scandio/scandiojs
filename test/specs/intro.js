describe("A suite testing the initialization of scandio.js", function() {
   var consoleMethods;

   beforeEach(function() {
      consoleMethods = ['assert', 'clear', 'count', 'dir', 'dirxml',
        'exception', 'group', 'groupCollapsed', 'groupEnd',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'error', 'warn', 'info', 'debug', 'log'];
   });

   it("should exist a global variable of scandio.js", function() {
      expect(ß).toEqual(jasmine.any(Function));
      expect(Scandio).toEqual(jasmine.any(Function));
   });

   it("should not trigger any errors on console methods", function() {
      for (var i=0;i < consoleMethods.length; i++) {
         expect(window.console[ consoleMethods[i] ]).toEqual(jasmine.any(Function));
      }
   });

   it("should have any version number which is a string", function() {
      expect(ß.VERSION).toEqual(jasmine.any(String));
   });
});