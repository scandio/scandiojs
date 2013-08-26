// Eesponsive design module
// ---------------

// Sets up responsive object
ß.responsive = {
   breakpointEl:     '.breakpoint'
};

ß.responsive.breakpoint = function(name) {
   return $( ß.responsive.breakpointEl ).html() === name;
};
