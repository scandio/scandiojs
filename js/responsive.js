// Eesponsive design module
// ---------------

// Sets up responsive object
Scandio.responsive = {
   breakpointEl:     '.breakpoint'
};

Scandio.responsive.breakpoint = function(name) {
   return jQuery( Scandio.responsive.breakpointEl ).html() === name;
};
