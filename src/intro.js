/*!
 * scandio.js JavaScript Library
 * http://scandio.js/
 *
 * Copyright 2013 Scandio GmbH and other contributors
 * Released under the MIT license
 */

 /*global console*/
 /*jslint browser: true*/
 ;(function(root, $, window, undefined) {
  "use strict";

  var
     root               = root,
     loadedJs           = {},
     previousScandio    = root.ß,
     breaker            = {},
     ArrayProto         = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype,
     document           = window.document,
     location           = window.location,
     events             = $('<a>'),
     modules            = { sequence: [] },
     consoleMethods     = ['assert', 'clear', 'count', 'dir', 'dirxml',
                          'exception', 'group', 'groupCollapsed', 'groupEnd',
                          'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
                          'timeStamp', 'trace'],
     logMethods         = ['error', 'warn', 'info', 'debug', 'log'];

  var
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
     nativeBind         = FuncProto.bind;

  var ß = function(obj) {
     if (obj instanceof ß) { return obj; }
     if (!(this instanceof ß)) { return new ß(obj); }
     this._wrapped = obj;
  };

  var _catchConsole = function() {
     var
        method,
        noop     = function () {},
        methods  = logMethods.concat(consoleMethods),
        length   = methods.length,
        console  = (window.console = window.console || {});

        while (length--) {
           method = methods[length];

           if (!console[method]) { console[method] = noop; }
        }
  };

  var _initialize = function() {
     _catchConsole();
  };

  _initialize();

  root.ß = root.Scandio = ß;

  ß.VERSION   = '0.0.1';
