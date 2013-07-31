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
ß.logger = {
   level: 5,
   logs: {}
};

ß.debug = (function(){
   var
      console  = window.console,
      length   = logMethods.length,
      methods  = {};

   while(length--) {
      (function(method, level) {
         ß.logger.logs[method]   = [];

         methods[method] = function() {
            var args = slice.call(arguments);

            if(ß.logger.level >= level) {
               console[method].apply(console, args);
            }

            ß.logger.logs[method].push(args.join(', '));
         };
      })(logMethods[length], length);
   }

   return methods;
})();
ß.util = {};

ß.util.has = function(obj, key) {
   return hasOwnProperty.call(obj, key);
};

ß.util.each = ß.forEach = function(obj, iterator, context) {
   if (obj == null) { return; }

   if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
   }

   else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
         if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
   }

   else {
      for (var key in obj) {
         if (ß.util.has(obj, key)) {
            if (iterator.call(context, obj[key], key, obj) === breaker) return;
         }
      }
   }
};

ß.util.extend = function(obj) {
   ß.util.each(slice.call(arguments, 1), function(source) {
      if (source) {
         for (var prop in source) {
            obj[prop] = source[prop];
         }
      }
   });

   return obj;
};

ß.util.filter = function(obj, iterator, context) {
    var results = [];
    if (obj == null) { return results; }
    if (nativeFilter && obj.filter === nativeFilter)
         { return obj.filter(iterator, context); }

    ß.util.each(obj, function(value, index, list) {
      if(iterator.call(context, value, index, list)) {
         results.push(value);
      }
    });

    return results;
};

ß.util.dots = function(dots, object, notFound) {
    var
      destionation   = object,
      path           = dots.split('.');

    for(var i = 0; i < path.length; i++) {
        if(object) { destionation = destionation[path[i]]; }
        else { destionation = undefined; }
    }

    return destionation || notFound;
};
ß.util.each(['Array', 'Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
   ß['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
   };
});

ß.isObject = function(obj) {
   return obj === Object(obj);
};
ß.ajax = {};

ß.libs = function(requested) {
   ß.util.each(requested, function(libs, cdn) {
      if (ß.isFunction( ß.cdns[cdn] )) {
         ß.util.each(libs, function(lib) {
            ß.ajax.script(ß.cdns[cdn](lib.repository, lib.version, lib.file));
         });
      } else {
         ß.debug.warn('CDN: ' + cdn + ' not defined in ß.cdns!');
      }
   });
};

ß.cdns = {
   'cdnjs' : function(repository, version, file) {
      return "//cdnjs.cloudflare.com/ajax/libs/"+repository+"/"+version+"/"+file;
   }
};

ß.plugins = function(requested) {
   ß.util.each(requested, function(scripts, folder) {
      ß.util.each(scripts, function(script) {
         ß.ajax.script(window.location.origin + '/' + folder + script + '.js');
      });
   });
};

ß.ajax.script = function(url, done) {
   var script = document.createElement("script");
   script.type = "text/javascript";

   if (script.readyState) {
       script.onreadystatechange = function(){
           if (script.readyState == "loaded" || script.readyState == "complete") {
               script.onreadystatechange = null;

               ß.isFunction(done) && done();
           }
       };
   } else {
       script.onload = function(){
           ß.isFunction(done) && done();
       };
   }

   script.src = url;

   document.head.appendChild(script);
}
ß.mod = ß.core.mod = (function() {
   var
      isDomReady  = false,
      globEnv     = {};

   return function(name, module, modEnv) {

      if (!ß.isString(name) || !ß.isFunction(module) || (modEnv && !ß.isObject(modEnv))) {
         var typeError = 'Parameter mismatch in Scandio.mod - please provide (1) name as' +
            'string and a (2) module as function. (3) an modEnv object may be given to' +
            'extend the default global environment';

         ß.debug.error(typeError);
      }

      if (modules.sequence.indexOf(name) >= 0) {
         var typeError = 'Error: there is already a module with name "' + name + '".';

         ß.debug.error(typeError);
      }
      else {
         modules.sequence.push(name);
      }

      $.extend(true, globEnv, modEnv);
      modules[name] = module.call(ß, $, globEnv, ß);

      if (modEnv && ß.isFunction(modEnv.readyFn)) {
         modEnv.readyFn(modules[name].ready);
      } else {
         $(document).ready(modules[name].ready);
      }

   };

}());

ß.wait = ß.core.wait = (function () {

   var waitFn = function(params) {
      var startTime = new Date().getTime(),
         duration = params.duration || 3000,
         interval = params.interval || 100,
         initialDelay = params.initialDelay || 10,
         condition = params.condition || function() {},
         callbacks = {};

      var execute = function() {
         if (new Date().getTime() - startTime > duration) {
            callbacks.fail && callbacks.fail();
         } else if (condition()) {
            callbacks.done && callbacks.done();
         } else {
            setTimeout(execute, interval);
         }
      };

      setTimeout(execute, initialDelay);

      return {
         done: function(fn) {
            callbacks.done = fn;
         },
         fail: function(fn) {
            callbacks.fail = fn;
         }
      };

   };

   waitFn.until = function(condition) {
      waitFn({
         condition: condition
      });
   };

   return waitFn;

}());

ß.redirect = ß.core.redirect = function(url) {
   location.href = url;
}
ß.noConflict = function() {
   root.ß = previousScandio;

   return this;
};

if (typeof define === 'function' && define.amd) {
   define('Scandio', function() {
      return ß;
   });
}
}(this, jQuery, window, document));