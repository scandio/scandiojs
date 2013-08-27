// Console methods are caught if undefined in e.g. IE

ß.debug.log('Log to console piped through console.log');
ß.debug.warn('Warn to console piped through console.warn');

// ß.debug.log( ß.logger.logs );

ß.debug.info('Info to console piped through console.info');

// Use debug component to log with log-levels and to store logs in logger history

ß.logger.level = 3;

ß.debug.log('Omitt console methods by log level, stored in logs anyway.');

ß.debug.debug('Debug to console piped through console.debug');
ß.debug.error('Error to console piped through console.error');

ß.logger.level = 5;

// Load ajax libraries from cdns by providing cdn-callbacks on ß.ajax.cdns-object

ß.ajax.libs({
   cdnjs: [{
      repository: 'bacon.js',
      version: '0.6.8',
      file: 'Bacon.min.js'
   }]
});

// Async load plugins from directories using short-handed plugins-method

ß.ajax.plugins({
   'scandio.js/example/scripts/': ['debug-error', 'debug-log']
});

// Load libraries/files based on condition(s) e.g. for mobile devices
// while using callbacks to init the plugin...

ß.ajax.maybe([{
   when: ß.device.isMobile(),
   libs: {
      cdnjs: [{
         repository: 'Colors.js',
         version: '1.2.1',
         file: 'colors.min.js',
         success: function() {
            ß.debug.info('We loaded Colors.js');
         }
      }]
   },
   plugins: {
      'scandio.js/example/scripts/': ['responsive-warn']
   }
}]);

// Load different libraries in differnt contexts

ß.ajax.maybe([{
   when: !ß.device.isMobile(),
   libs: {
      cdnjs: [{
         repository: 'Cookies.js',
         version: '0.3.1',
         file: 'cookies.min.js',
         success: function() {
            ß.debug.info('We loaded Cookies.js');
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
ß.util.has(me, 'age');
ß.util.has(me, 'name');

// Iterate over arrays/objects using callback-itertor

var names = ['Tobias, Felix, Thomas'];
ß.util.each(names, function(name) {
   ß.debug.info(name);
});

var me = {forename: 'Tobias', surname: 'Deekens'};
ß.util.each(me, function(value, key) {
   ß.debug.info(key + ":", value);
});

// Merge objects/arrays to extend property lists

var me = {forename: 'Tobias', surname: 'Deekens'};
var me2 = {forename: 'Felix', age: 26};
var iam = {iamsmart: !true};

me = ß.util.extend(me2, me, iam);
ß.debug.info(me);

// Filter arrays/objects using callback function

var numbers = [1, 2, 3, 4, 6, 10, 13, 23, 52, 55, 2];
var even = ß.util.filter(numbers, function(number) {
   return number % 2 === 0;
});
ß.debug.info(even);

// Access everything via dot-notation providing optional default value

var me = {forename: 'Tobias', surname: 'Deekens', company: {name: 'Scandio Gmbh'}};
var street = ß.util.getByDots('company.street', me, 'In der Rosenau 6');
ß.debug.info(street);

// Extract function from objects (mostly used internally)

var Person = {
   forename: 'Tobias',
   surename: 'Deekens',
   fullname: function(forename, surname) {
      return forename + " " + surname;
   }
}
ß.debug.info( ß.util.functions(Person) );

// Extend/mixin functionality into the library at runtime
// may overwrite existing function plus it can be sub-namespaced

ß.util.mixin("string.custom", {
  capitalize : function(string) {
    return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
  }
});

ß.debug.info( ß.string.custom.capitalize("tobias") );

// Puts the breaks on the window scroll event callback

var scrolled = function() {
   console.log('Wow, you scrolled a webpage!');
};

$(window).scroll(
   // Only actually call the callback every second
   ß.timing.breaks(scrolled, 1000)
);

// Delays the fn-exeuction for specified milliseconds

var logIt = function(here) {
   console.log("I've been delayed!" + here);
};

// Pass some additional arguments
ß.timing.delay(logIt, 1000, " With some arguments!");

// Safe typchecking on primitive types

ß.isString("tobias");
ß.isArray([]);
ß.isNumber(1);
ß.isFunction(function() {});

// Use some helper-functions for responsive development

ß.debug.info( ß.device.isMobile() );
ß.debug.info( ß.responsive.breakpoint('tablet') );

// configure the component yourself

ß.responsive.mobile        = ["mac"],
ß.responsive.breakpointEl  = '.hidden-breakpoint-el';

ß.debug.info( ß.device.isMobile() );
ß.debug.info( ß.responsive.breakpoint('tablet') );

//ß.noConflict();

// Defer function execution for duration for interval based on condition

ß.wait({
   duration: 3000,
   interval: 1000,
   initialDelay: 10,
   condition: function() {
      return true;
   },
   callbacks: {
      done: function() {
         ß.debug.info('We made it!');
      },
      fail: function() {
         ß.debug.error('We failed so badly!');
      }
   }
});

// Register your custom modules

ß.module('scandio.plugin', function($, globEnv) {
   var
      init = function() {
         ß.debug.info('Module got initialized');

         log();
      },
      log = function() {
         ß.debug.log('Module doing some work');
      };

   return {
      ready: init
   }
}, {
   readyFn: $
});

// Returns all plugins under scandio namespace

ß.modules('scandio');

// Using the internal pub/sub implementation

ß.subscribe('foo.bar', function(event, arg1, arg2) {
   console.log("foo.bar", arg1, arg2);
});

ß.subscribe('foo', function(event, arg1) {
   console.log("foo", arg1);
});

ß.publish('foo', 'Couple ', 'it loosly!');
ß.publish('foo.bar', 'Bind to qualified namespace!');

ß.unsubscribe('foo.bar');
ß.publish('foo', 'Couple ', 'it loosly!');

// Query and DOM and cache results

ß.dom.cache.get('forms', 'body forms'); // returns jQuery-object

ß.dom.cache.get('forms'); // Does not re-query the DOM

ß.dom.cache.update('forms'); // Updates cache for single label

ß.dom.cache.update() // Updates complete cache

// Using the string module and its helper functions

// Easy capitalization or transforming a string to lowercase
ß.debug.log(ß.string.capitalize("yAy yay yay"));
ß.debug.log(ß.string.lower("yAy"));

// Clean up the mess around it eventually by 'triming' or 'cleaning'
ß.debug.log("A messy '    Scandio GmbH    ' get cleaned up: " + ß.string.clean("    Scandio GmbH    "));
ß.debug.log("One might aswell just trim '    Scandio     GmbH    ' it to: " + ß.string.trim("    Scandio     GmbH    "));

// Chop it up into 'n-parts'
ß.debug.log("For whatever reason you can chop up the lovely 'Scandio GmbH' into: " + ß.string.chop("Scandio GmbH", 2));

// Search in a string
ß.debug.log("Yes, it's a 'GmbH. It's in the name 'Scandio GmbH'" + ß.string.contains("GmbH", "Scandio GmbH"));

// Check for starts/ends-with substring of a string
ß.debug.log("The name 'Scandio GmbH' starts with 'Scandio'? " + ß.string.starts("Scandio GmbH", "Scandio"));
ß.debug.log("and ends with 'GmbH'? " + ß.string.ends("GmbH", "GmbH"));

// Implde and explode strings/arrays
ß.debug.log("If you ever want to explode the company you get: " + ß.string.explode("Scandio GmbH", " "));
ß.debug.log("but please put it together again, would you: " + ß.string.implode("", ["Sc", "an", "dio", " Gmb", "H"]));

// Persist values in special script tag for later retrival (php-bridge)

$(function() {
   ß.bridge.set('firms.cool', 'Scandio GmbH');
   ß.debug.log( ß.bridge.get('firms.cool', 'Not found') );
   ß.debug.log( ß.bridge.get('firms.uncool', 'Not found') );
});