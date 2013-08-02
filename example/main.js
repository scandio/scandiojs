ß.libs({
   cdnjs: [{
      repository: 'bacon.js',
      version: '0.6.8',
      file: 'Bacon.min.js'
   }]
});

ß.plugins({
   'scandio.js/example/scripts/': ['alert', 'log']
});

ß.util.mixin('string', {
  capitalize : function(string) {
    return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
  }
});

ß.debug.log(ß.string.capitalize('noooh'));