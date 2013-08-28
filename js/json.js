// JSON module
// ---------------

// Sets up the json object
Scandio.json = {};

// Used to encode an object to its json-string representation
// *Note:* falls back to native `JSON.stringify` if it is defined
Scandio.json.to = Scandio.json.encode = function(obj) {
   // Falls back to native `JSON.stringify` if possible
   if ("JSON" in window) { return JSON.stringify(obj); }

   // Type, internation and progress variables
   var
      t = typeof (obj),
      n = null,
      v = null,
      json = [],
      arr = null;

   // No object at hand, toString the output
   if (t != "object" || obj === null) {
      if (t == "string") { obj = '"' + obj + '"'; }

      return String(obj);
   // Work the object
   } else {
      // Typecheck if object is an array
      arr = (obj && obj.constructor == Array);

      // For each value in object
      for (n in obj) {
         // Get its value and type
         v = obj[n];
         t = typeof(v);
         // Check if it has the property
         if (obj.hasOwnProperty(n)) {
            // Embeds strings into result
            if (t == "string") {
               v = '"' + v + '"';
            // Recursive call to itself to work nested objects
            } else if (t == "object" && v !== null) {
               v = Scandio.json.to(v);
            }
            // Push the processed output to result
            json.push((arr ? "" : '"' + n + '":') + String(v));
         }
      }
      // Wraps it with curlies or square brackets
      return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
   }
};

// Decodes an json-string into an object
// *Note:* Pipes through `jQuery.parseJSON` which basically
// does a simple RegEx-test and then returns `new Function(data)` instead of
// an `eval`.
Scandio.json.from = Scandio.json.decode = function(string) {
   return jQuery.parseJSON(string);
};
