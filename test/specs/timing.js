describe("A suite testing the timing functions", function() {
   describe("tests on delaying a function call for n-milliseconds", function() {
      it("should defer the execution of a function", function() {
         runs(function() {
            this.hasBeenCalled = false;
            var that = this;

            Scandio.timing.delay(function() {
               that.hasBeenCalled = true;
            }, 50);
         });

         runs(function() {
            expect(this.hasBeenCalled).toBe(false);
         });

         waits(100);

         runs(function() {
            expect(this.hasBeenCalled).toBe(true);
         });
      });
   });

   describe("tests on putting the breaks on a function call for n-milliseconds", function() {
      it("should break the execution of a function", function() {
         runs(function() {
            this.counter = 0;

            this.breakedIncrementor = Scandio.timing.breaks(function() {
               this.counter++;
            }, 42);

            this.breakedIncrementor();
            this.breakedIncrementor();

            //Not called
            expect(this.counter).toEqual(0);
         });

         waits(50);

         runs(function() {
            expect(this.counter).toEqual(1);
         });
      });

      it("should break the execution of a function with arguments", function() {
         runs(function() {
            this.counter = 0;
            var that = this;

            this.breakedIncrementor = Scandio.timing.breaks(function(to) {
               this.counter = to;
            }, 10);

            this.breakedIncrementor(10);

            //Not called
            expect(this.counter).toEqual(0);

            Scandio.timing.delay(function() {
               //Called once now
               expect(that.counter).toEqual(10);
            }, 10);
         });

         waits(10);

         runs(function() {
            expect(this.counter).toEqual(10);
         });
      });
   });
});