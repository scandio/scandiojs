// JSON module
// ---------------

// Sets up the json object
ß.json = {};

ß.json.to = ß.json.encode = function(obj) {
   if ("JSON" in window) {
      return JSON.stringify(obj);
   }

   var
      t = typeof (obj),
      n,
      v,
      json = [],
      arr = null;

   if (t != "object" || obj === null) {
      if (t == "string") { obj = '"' + obj + '"'; }

      return String(obj);
   } else {
      arr = (obj && obj.constructor == Array);

      for (n in obj) {
         v = obj[n];
         t = typeof(v);
         if (obj.hasOwnProperty(n)) {
            if (t == "string") {
               v = '"' + v + '"';
            } else if (t == "object" && v !== null){
               v = jQuery.stringify(v);
            }

            json.push((arr ? "" : '"' + n + '":') + String(v));
         }
      }

      return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
   }
};

ß.json.from = ß.json.decode = function(string) {
   return $.parseJSON(string);
};
