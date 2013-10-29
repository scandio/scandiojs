// Console methods are caught if undefined in e.g. IE

Scandio.debug.log('Log to console piped through console.log');
Scandio.debug.warn('Warn to console piped through console.warn');

// Scandio.debug.log( Scandio.logger.logs );

Scandio.debug.info('Info to console piped through console.info');

// Use debug component to log with log-levels and to store logs in logger history

Scandio.logger.level = 3;

Scandio.debug.log('Omitt console methods by log level, stored in logs anyway.');

Scandio.debug.debug('Debug to console piped through console.debug');
Scandio.debug.error('Error to console piped through console.error');

Scandio.logger.level = 5;

// Load ajax libraries from cdns by providing cdn-callbacks on Scandio.ajax.cdns-object

Scandio.ajax.libs({
   cdnjs: [{
      repository: 'bacon.js',
      version: '0.6.8',
      file: 'Bacon.min.js'
   }]
});

// Async load plugins from directories using short-handed plugins-method

Scandio.ajax.plugins({
   'scandio.js/example/scripts/': ['debug-error', 'debug-log']
});

// Load libraries/files based on condition(s) e.g. for mobile devices
// while using callbacks to init the plugin...

Scandio.ajax.maybe([{
   when: Scandio.device.isMobile(),
   libs: {
      cdnjs: [{
         repository: 'Colors.js',
         version: '1.2.1',
         file: 'colors.min.js',
         success: function() {
            Scandio.debug.info('We loaded Colors.js');
         }
      }]
   },
   plugins: {
      'scandio.js/example/scripts/': ['responsive-warn']
   }
}]);

// Load different libraries in differnt contexts

Scandio.ajax.maybe([{
   when: !Scandio.device.isMobile(),
   libs: {
      cdnjs: [{
         repository: 'Cookies.js',
         version: '0.3.1',
         file: 'cookies.min.js',
         success: function() {
            Scandio.debug.info('We loaded Cookies.js');
         }
      }]
   },
   plugins: {
      'scandio.js/example/scripts/': ['desktop-warn']
   }
}]);

// Use a wild bunch of utility functions
// checking for properties on objects

var me = {name: 'Tobias Deekens'};
Scandio.util.has(me, 'age');
Scandio.util.has(me, 'name');

// Iterate over arrays/objects using callback-itertor

var names = ['Tobias, Felix, Thomas'];
Scandio.util.each(names, function(name) {
   Scandio.debug.info(name);
});

var me = {forename: 'Tobias', surname: 'Deekens'};
Scandio.util.each(me, function(value, key) {
   Scandio.debug.info(key + ":", value);
});

// Merge objects/arrays to extend property lists

var me = {forename: 'Tobias', surname: 'Deekens'};
var me2 = {forename: 'Felix', age: 26};
var iam = {iamsmart: !true};

me = Scandio.util.extend(me2, me, iam);
Scandio.debug.info(me);

// Filter arrays/objects using callback function

var numbers = [1, 2, 3, 4, 6, 10, 13, 23, 52, 55, 2];
var even = Scandio.util.filter(numbers, function(number) {
   return number % 2 === 0;
});
Scandio.debug.info(even);

// Access everything via dot-notation providing optional default value

var me = {forename: 'Tobias', surname: 'Deekens', company: {name: 'Scandio Gmbh'}};
var street = Scandio.util.getByDots('company.street', me, 'In der Rosenau 6');
Scandio.debug.info(street);

// Extract function from objects (mostly used internally)

var Person = {
   forename: 'Tobias',
   surename: 'Deekens',
   fullname: function(forename, surname) {
      return forename + " " + surname;
   }
}
Scandio.debug.info( Scandio.util.functions(Person) );

// Extend/mixin functionality into the library at runtime
// may overwrite existing function plus it can be sub-namespaced

Scandio.util.mixin("string.custom", {
  capitalize : function(string) {
    return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
  }
});

Scandio.debug.info( Scandio.string.custom.capitalize("tobias") );

// Puts the breaks on the window scroll event callback

var scrolled = function() {
   console.log('Wow, you scrolled a webpage!');
};

$(window).scroll(
   // Only actually call the callback every second
   Scandio.timing.breaks(scrolled, 1000)
);

// Delays the fn-exeuction for specified milliseconds

var logIt = function(here) {
   console.log("I've been delayed!" + here);
};

// Pass some additional arguments
Scandio.timing.delay(logIt, 1000, " With some arguments!");

// Safe typchecking on primitive types

Scandio.isString("tobias");
Scandio.isArray([]);
Scandio.isNumber(1);
Scandio.isFunction(function() {});

// Use some helper-functions for responsive development

Scandio.debug.info( Scandio.device.isMobile() );
Scandio.debug.info( Scandio.responsive.breakpoint('tablet') );

// configure the component yourself

Scandio.responsive.mobile        = ["mac"],
Scandio.responsive.breakpointEl  = '.hidden-breakpoint-el';

Scandio.debug.info( Scandio.device.isMobile() );
Scandio.debug.info( Scandio.responsive.breakpoint('tablet') );

//Scandio.noConflict();

// Defer function execution for duration for interval based on condition

Scandio.wait({
   duration: 3000,
   interval: 1000,
   initialDelay: 10,
   condition: function() {
      return true;
   },
   callbacks: {
      done: function() {
         Scandio.debug.info('We made it!');
      },
      fail: function() {
         Scandio.debug.error('We failed so badly!');
      }
   }
});

// Register your custom modules

Scandio.module('scandio.plugin', function($, globEnv) {
   var
      init = function() {
         Scandio.debug.info('Module got initialized');

         log();
      },
      log = function() {
         Scandio.debug.log('Module doing some work');
      };

   return {
      ready: init
   }
}, {
   readyFn: $
});

// Returns all plugins under scandio namespace

Scandio.modules('scandio');

// Using the internal pub/sub implementation

Scandio.subscribe('foo.bar', function(event, arg1, arg2) {
   console.log("foo.bar", arg1, arg2);
});

Scandio.subscribe('foo', function(event, arg1) {
   console.log("foo", arg1);
});

Scandio.publish('foo', 'Couple ', 'it loosly!');
Scandio.publish('foo.bar', 'Bind to qualified namespace!');

Scandio.unsubscribe('foo.bar');
Scandio.publish('foo', 'Couple ', 'it loosly!');

// Query and DOM and cache results

Scandio.dom.cache.get('forms', 'body forms'); // returns jQuery-object

Scandio.dom.cache.get('forms'); // Does not re-query the DOM

Scandio.dom.cache.update('forms'); // Updates cache for single label

Scandio.dom.cache.update() // Updates complete cache

// Using the string module and its helper functions

// Easy capitalization or transforming a string to lowercase
Scandio.debug.log(Scandio.string.capitalize("yAy yay yay"));
Scandio.debug.log(Scandio.string.lower("yAy"));

// Clean up the mess around it eventually by 'triming' or 'cleaning'
Scandio.debug.log("A messy '    Scandio GmbH    ' get cleaned up: " + Scandio.string.clean("    Scandio GmbH    "));
Scandio.debug.log("One might aswell just trim '    Scandio     GmbH    ' it to: " + Scandio.string.trim("    Scandio     GmbH    "));

// Chop it up into 'n-parts'
Scandio.debug.log("For whatever reason you can chop up the lovely 'Scandio GmbH' into: " + Scandio.string.chop("Scandio GmbH", 2));

// Search in a string
Scandio.debug.log("Yes, it's a 'GmbH. It's in the name 'Scandio GmbH'" + Scandio.string.contains("GmbH", "Scandio GmbH"));

// Check for starts/ends-with substring of a string
Scandio.debug.log("The name 'Scandio GmbH' starts with 'Scandio'? " + Scandio.string.starts("Scandio GmbH", "Scandio"));
Scandio.debug.log("and ends with 'GmbH'? " + Scandio.string.ends("GmbH", "GmbH"));

// Implde and explode strings/arrays
Scandio.debug.log("If you ever want to explode the company you get: " + Scandio.string.explode("Scandio GmbH", " "));
Scandio.debug.log("but please put it together again, would you: " + Scandio.string.implode("", ["Sc", "an", "dio", " Gmb", "H"]));