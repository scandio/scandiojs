describe("A suite testing the timing functions", function() {
   describe("tests on delaying a function call for n-milliseconds", function() {
      beforeEach(function(done) {
         var that = this;
         this.hasBeenCalled = false;

         Scandio.timing.delay(function() {
            that.hasBeenCalled = true;

            done();
         }, 50);
      });

      it("should defer the execution of a function", function() {
         expect(this.hasBeenCalled).toBe(true);
      });
   });

   describe("tests on putting the breaks on a function call for n-milliseconds without args", function() {
      beforeEach(function(done) {
         this.counter = 0;

         this.breakedIncrementor = Scandio.timing.breaks(function() {
            this.counter++;

            done();
         }, 42);

         this.breakedIncrementor();
         this.breakedIncrementor();

         //Not called
         expect(this.counter).toEqual(0);
      });

      it("should defer the execution of a function", function() {
         expect(this.counter).toEqual(1);
      });
   });

   describe("tests on putting the breaks on a function call for n-milliseconds with args", function() {
      beforeEach(function(done) {
         this.counter = 0;
         var that = this;

         this.breakedIncrementor = Scandio.timing.breaks(function(to) {
            this.counter = to;

            done();
         }, 10);

         this.breakedIncrementor(10);

         //Not called
         expect(this.counter).toEqual(0);

         Scandio.timing.delay(function() {
            //Called once now
            expect(that.counter).toEqual(10);
         }, 10);
      });

      it("should defer the execution of a function", function() {
         expect(this.counter).toEqual(10);
      });
   });
});