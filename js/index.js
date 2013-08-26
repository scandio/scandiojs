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
 ;(function(root, $, window, undefined) {
  // We're strict and in strict-mode: no aruguements.callee and globally leaking vars etc
  "use strict";

  //Establish the root
  root = root || this;

  // Sets up a global set of variables
   var
      ß                  = null,
      loadedJs           = {},
      scandioHtmlClass   = 'scandio-js',
      $scandioEl         = null,
      // Previous version for `ß.noConflict`
      previousScandio    = root.ß,
      // Breaker for loop iteration
      breaker            = {},
      // Set of shorthand to object protos
      ArrayProto         = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype,
      document           = window.document,
      location           = window.location,
      events             = $('<a>'),
      modules            = { sequence: [] },
      // Console methods to be caught when not defined in browser (IE I hear you)
      consoleMethods     = ['assert', 'clear', 'count', 'dir', 'dirxml',
                          'exception', 'group', 'groupCollapsed', 'groupEnd',
                          'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
                          'timeStamp', 'trace'],
      // Log methods to be caught and routed to `ß.debug`
      logMethods         = ['error', 'warn', 'info', 'debug', 'log'],
      // Url hooks enabling e.g. DOM-logging
      urlHooks           = {
         domLogging:    'scandiojs--log-dom'
      },

      // All the important native methods shorthanded and used if defined in e.g. `ß.each`
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
         console  = (window.console = window.console || {});

         // Loop over all methods (log and console)
         while (length--) {
            method = methods[length];

            // Bind a noop to call if not defined
            if (!console[method]) { console[method] = noop; }
         }
   },

   _injectDom = function() {
      $(function() {
         if ( $(scandioHtmlClass).length === 0 ) {
            $scandioEl = $('<div/>', {
                class: scandioHtmlClass
            }).appendTo('body');
         }
      });
   },

   // Any call to subordinate initialization function goes here
   // *Note:* We're in pre-creation state
   _initialize = function() {
      // As the adove catching of console calls
      _catchConsole();
      _injectDom();
   };

   // Intialize
   _initialize();

   // Create yerself
   ß = root.ß = root.Scandio = Scandio;

   // Version of our library
   ß.VERSION   = '0.0.1';
