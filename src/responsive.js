// Utility module for responsive
// ---------------

// Sets up responsive object
ß.responsive = {
   mobile:           ["android", "webos", "iphone", "ipad", "ipod", "blackberry"],
   breakpointEl:     '.breakpoint'
};

// A rudimentary function testing for mobile devices
// *Note:* The list of OSes it not complete and feature-testing might be a better option (modernizr e.g.)
ß.responsive.isMobile = function() {
   var
      regExp      = new RegExp(ß.responsive.mobile.join('|')),
      userAgent   = navigator.userAgent.toLowerCase();

   // Checks the navigator's user agent against the list of mobile devices
   return regExp.test(userAgent);
};

ß.responsive.breakpoint = function(name) {
   return $( ß.responsive.breakpointEl ).html() === name;
};
