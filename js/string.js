// String module
// ---------------

// Register string namespace on scandiojs object
Scandio.string = {};

// Capitalizes a given string (scandio becomes Scandio etc.)
Scandio.string.capitalize = function(string) {
   // First char gets upppercased every other char lowercased
   return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
};

// Lowercases a given string (ScanDiO becomes scandio)
Scandio.string.lower = function(string) {
   // Just everything to lowercase
   return string.toLowerCase();
};

// Cleans up the mess of a string ('  Scandio    GmbH   ' becomes 'Scandio GmbH')
Scandio.string.clean = function(string) {
   // Trims the mess (whitespace default) and replaces consecutive (s+) whitespaces within with one whitespace
   return Scandio.string.trim(string).replace(/\s+/g, ' ');
};

// Trims away the given characters around a given string (defaults to whitespace)
Scandio.string.trim = function(string, characters){
   // Uses nativeTrim if defined and no characters are given (not supported by native impl.)
   if (!characters && nativeTrim) {
      return nativeTrim.call(string);
   }

   // A RegExp starting at the beginning of the string, the string wrapped by the `characters`
   // replacing them around the `string`
   return String(string).replace(new RegExp('^' + characters + '+|' + characters + '+$', 'g'), '');
};

// Chops a string up `at` every position in the string `Scandio.string.chop('chopchop', 3) === 'cho pch op'`
Scandio.string.chop = function(string, at) {
   // Better make a string out of the passed in 'string'
   string = String(string);

   // Double NOT bitwise (sorta same as Math.floor())
   at = ~~at;

   // RegExp works like a UNIX expansion list, expanding around the whitespace from 1-to-at
   return at > 0 ? string.match(new RegExp('.{1,' + at + '}', 'g')) : [string];
};

// Finds a string within a string (fuzzy) e.g. `Scandio.string.contains('I'veADream', 'Dream') === true`
Scandio.string.contains = function(needle, haystack) {
   // Don't do work if no needle passed (but we've found something right!)
   if (needle === '') { return true; }
   // Empty haystack should also lead to some chilling without having found something
   if (haystack === null || haystack === undefined) { return false; }

   // Do the old trick of using `indexOf` of the haystack with the needle
   return String(haystack).indexOf(needle) !== -1;
};

// Checks if string starts with a given string
Scandio.string.starts = function(string, what) {
   // Wrap the passed in arguments in a String object for sanity
   string   = String(string);
   what     = String(what);

   // If the string is longer, equally long than the one it's supposed to start with
   // and if its slice from 0 to the starting string's length is the starting string
   return string.length >= what.length && string.slice(0, what.length) === what;
};

// Checks if string ends with a given string
Scandio.string.ends = function(string, what) {
   // Wrap the passed in arguments in a String object for sanity
   string   = String(string),
   what     = String(what);

   // If the string is longer, equally long than the one it's supposed to end with
   // and if its slice from the end to the length of its suppoed ending is equals to its ending
   return string.length >= what.length && string.slice(string.length - what.length) === what;
};

// Implodes/joins a string with a given glue
Scandio.string.implode = function(glue, pieces) {
   // Defaults the glue to empty string
   if (glue === null || glue === undefined) { glue = ''; }

   // Pipes call through join on pieces
   return pieces.join(glue);
};

// Explodes/splits a string with by given delimiter
Scandio.string.explode = function(string, delimiter) {
   // Wrap the passed in argument in a String object for sanity
   delimiter   = String(delimiter),
   string      = String(string);

   // Pipes passed in arguments through `split`
   return string.split(delimiter);
};

// Replaces a substring within a string
// E.g. `Scandio.string.replace('Scandio Gm', 'Gm', 'GmbH')` will return 'Scandio GmbH'
Scandio.string.replace = function(string, subString, replacer) {
   // Wrap the passed in argument in a String object for sanity
   string      = String(string);
   subString   = String(subString);
   replacer    = String(replacer);

   var
      regExp   = new RegExp( subString.toLowerCase(), "gi" );

   return string.replace(regExp, replacer);
};
