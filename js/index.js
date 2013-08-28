/*!
 * scandio.js JavaScript Library
 * http://scandio.js/
 *
 * Copyright 2013 Scandio GmbH and other contributors
 * Released under the MIT license
 */

 /*global console*/
 /*jslint browser: true*/

 // Setup the library
 // ---------------
 ;(function(root, jQuery, window, document, undefined) {
  // We're strict and in strict-mode: no aruguements.callee and globally leaking vars etc
  "use strict";

  //Establish the root
  root = root || this;

  // Sets up a global set of variables
   var
      loadedJs           = {},
      config             = {
         scandioHtmlClass: 'scandio-js',
         scandioBridgeClass: 'scandio-js--bridge'
      },
      injectDOM          = true,
      $scandioEl         = null,
      // Previous version for `Scandio.noConflict`
      previousScandio    = root.Scandio,
      // Breaker for loop iteration
      breaker            = {},
      // Set of shorthand to object protos
      ArrayProto         = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype,
      location           = window.location,
      events             = jQuery('<a>'),
      modules            = {},
      // Console methods to be caught when not defined in browser (IE I hear you)
      consoleMethods     = ['assert', 'clear', 'count', 'dir', 'dirxml',
                          'exception', 'group', 'groupCollapsed', 'groupEnd',
                          'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
                          'timeStamp', 'trace'],
      // Log methods to be caught and routed to `Scandio.debug`
      logMethods         = ['error', 'warn', 'info', 'debug', 'log'],
      // Url hooks enabling e.g. DOM-logging
      urlHooks           = {
         domLogging:    'scandiojs--log-dom'
      },

      // All the important native methods shorthanded and used if defined in e.g. `Scandio.each`
      push               = ArrayProto.push,
      slice              = ArrayProto.slice,
      concat             = ArrayProto.concat,
      toString           = ObjProto.toString,
      hasOwnProperty     = ObjProto.hasOwnProperty,
      nativeForEach      = ArrayProto.forEach,
      nativeMap          = ArrayProto.map,
      nativeReduce       = ArrayProto.reduce,
      nativeReduceRight  = ArrayProto.reduceRight,
      nativeFilter       = ArrayProto.filter,
      nativeEvery        = ArrayProto.every,
      nativeSome         = ArrayProto.some,
      nativeIndexOf      = ArrayProto.indexOf,
      nativeLastIndexOf  = ArrayProto.lastIndexOf,
      nativeIsArray      = Array.isArray,
      nativeKeys         = Object.keys,
      nativeBind         = FuncProto.bind,
      nativeTrim         = String.prototype.trim,
      nativeTrimRight    = String.prototype.trimRight,
      nativeTrimLeft     = String.prototype.trimLeft,

   // Defining one self
   Scandio = function(obj) {
      // If already instance return
      if (obj instanceof Scandio) { return obj; }
      // Otherwise creates new instance
      if (!(this instanceof Scandio)) { return new Scandio(obj); }

      // for chaining
      this._wrapped = obj;
   },

   // Catches all possible console calls if they are undefined
   _catchConsole = function() {
      var
         method,
         noop     = function () {},
         methods  = logMethods.concat(consoleMethods),
         length   = methods.length,
         console  = ( window.console = window.console || {} );

         // Loop over all methods (log and console)
         while (length--) {
            method = methods[length];

            // Bind a noop to call if not defined
            if (!console[method]) { console[method] = noop; }
         }
   },

   _injectDom = function() {
      jQuery(function() {
         var
            script   = null;

         if ( injectDOM && jQuery(config.scandioHtmlClass).length === 0 ) {
            $scandioEl = jQuery('<div/>', {
                class: config.scandioHtmlClass
            }).appendTo('body');
         }

         if (injectDOM) {
            script            = document.createElement("script");
            script.type       = "application/x-json";
            script.id         = config.scandioBridgeClass;

            document.head.appendChild(script);
         }
      });
   },

   // Any call to subordinate initialization function goes here
   // *Note:* We're in pre-creation state
   _initialize = function() {
      // As the adove catching of console calls
      _catchConsole();

      // Inject scandio elements into DOM
      _injectDom();
   };

   // Intialize
   _initialize();

   // Create yerself
   root.Scandio = Scandio;

   // Version of our library
   Scandio.VERSION   = '0.1.0';
