// Device detection module
// ---------------

// Sets up device object
Scandio.device = {
   mobile: ["android", "webos", "iphone", "ipad", "ipod", "blackberry"],
   desktop: ["macintosh", "win", "linux"]
};

// A rudimentary function testing for mobile devices
// *Note:* The list of OSes it not complete and feature-testing might be a better option (modernizr e.g.)
Scandio.device.isMobile = function() {
   var
      regExp      = new RegExp(Scandio.device.mobile.join('|')),
      userAgent   = navigator.userAgent.toLowerCase();

   // Checks the navigator's user agent against the list of mobile devices
   return regExp.test(userAgent);
};

// A function testing for desktop devices
Scandio.device.isDesktop = function() {
   var
      regExp      = new RegExp(Scandio.device.desktop.join('|')),
      userAgent   = navigator.userAgent.toLowerCase();

   // Checks the navigator's user agent against the list of desktop devices
   return regExp.test(userAgent);
};

// A function testing for browser vendors
Scandio.device.isBrowser = function(vendor) {
   var
      regExp      = new RegExp(vendor.toLowerCase()),
      userAgent   = navigator.userAgent.toLowerCase();

   // Checks the navigator's user agent against the list of desktop devices
   return regExp.test(userAgent);
};

// A function testing for browser vendors
Scandio.device.isOs = function(vendor) {
   var
      regExp      = new RegExp(vendor.toLowerCase()),
      userAgent   = navigator.userAgent.toLowerCase();

   // Checks the navigator's user agent against the list of desktop devices
   return regExp.test(userAgent);
};