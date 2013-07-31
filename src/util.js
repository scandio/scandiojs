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
