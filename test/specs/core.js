describe("A suite testing the core module", function() {
   describe("tests on messenger (pub/sub) functionality", function() {
      var callbacks = {};

      beforeEach(function() {
         callbacks = {
            handler1: function(event, arg1, arg2) {
               console.log("foo.bar", arg1, arg2);
            },
            handler2: function(event, arg1) {
               console.log("foo", arg1);
            }
         };

         spyOn(callbacks, 'handler1');
         spyOn(callbacks, 'handler2');
      });

      it("should allow for fully qualified subscriptions", function() {
         Scandio.subscribe('foo.bar', callbacks.handler1);
         Scandio.publish('foo.bar');

         expect(callbacks.handler1).toHaveBeenCalled();
         expect(callbacks.handler2).not.toHaveBeenCalled();
      });

      it("should allow for fuzzy (unqualified) subscriptions", function() {
         Scandio.subscribe('foo', callbacks.handler2);
         Scandio.subscribe('foo.bar', callbacks.handler1);

         Scandio.publish('foo');

         expect(callbacks.handler1).toHaveBeenCalled();
         expect(callbacks.handler2).toHaveBeenCalled();
      });

      it("should allow for unsubscribing from messenger", function() {
         Scandio.subscribe('foo.bar', callbacks.handler1);
         Scandio.subscribe('foo', callbacks.handler2);

         Scandio.unsubscribe('foo.bar');
         Scandio.publish('foo');

         expect(callbacks.handler1).not.toHaveBeenCalled();
         expect(callbacks.handler2).toHaveBeenCalled();
      });
   });

   describe("tests on module definition", function() {
      it("it should allow defining a root module", function() {
         Scandio.module('scandio', function($) {
            var
               exposed = function() {
                  return log();
               },
               log = function() {
                  return true;
               };

            return {
               log: exposed
            }
         });

         expect(Scandio.modules('scandio')).toBeDefined();
         expect(Scandio.modules('scandio').log()).toBe(true);
      });

      it("it should allow defining a nested module", function() {
         Scandio.module('scandio.sub', function($) {
            var
               exposed = function() {
                  return log();
               },
               log = function() {
                  return true;
               };

            return {
               log: exposed
            }
         });

         expect(Scandio.modules('scandio.sub')).toBeDefined();
         expect(Scandio.modules('scandio.sub').log()).toBe(true);
      });

      it("it should allow defining another nested module", function() {
         Scandio.module('scandio.submore', function($) {
            var
               exposed = function() {
                  return log();
               },
               log = function() {
                  return true;
               };

            return {
               log: exposed
            }
         });

         expect(Scandio.modules('scandio.submore')).toBeDefined();
         expect(Scandio.modules('scandio.submore').log()).toBe(true);
      });
   });
});