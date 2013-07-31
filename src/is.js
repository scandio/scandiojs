ß.util.each(['Array', 'Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
   ß['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
   };
});

ß.isObject = function(obj) {
   return obj === Object(obj);
};
