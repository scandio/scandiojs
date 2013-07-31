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