ß.ajax.libs({
   cdnjs: [{
      repository: 'bacon.js',
      version: '0.6.8',
      file: 'Bacon.min.js'
   }]
});

ß.ajax.plugins({
   'scandio.js/example/scripts/': ['alert', 'log']
});

ß.ajax.maybe([{
   when: ß.responsive.isMobile(),
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

ß.ajax.maybe([{
   when: !ß.responsive.isMobile(),
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