// Eesponsive design module
// ---------------

// Sets up responsive object
Scandio.responsive = {
   breakpointEl:     '.breakpoint'
};

Scandio.responsive.breakpoint = function(name) {
   return $( Scandio.responsive.breakpointEl ).html() === name;
};
