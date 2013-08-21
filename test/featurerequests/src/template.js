/**
 * === NOTE ===
 * All comment fields except @description are optional. If you don't specify them, it is up
 * to the developer to make up a good implementation. Please ensure to provide a well-defined
 * description at least.
 *
 * @description #required
 * [ What do you want your method to do? ]
 *
 * @domain
 * [ Does your method apply to a specific domain? (e.g. Confluence, jQuery plugin, etc.) ]
 *
 * @precondition
 * [ Does your method require any specific preconditions? Does it only run within a specific
 *   environment? (e.g. some Scandio functions are specifically intended for the Confluence
 *   environment around the AJS JavaScript object ]
 *
 * @param
 * [ Does your method expect any parameters given? Do you prefer these parameters given as
 *   a single object? ]
 *
 * @return
 * [ Do you want your method return anything? Or does it solely work on given data? ]
 *
 * @postcondition
 * [ What conditions do you expect after your method has completed? ]
 *
 */

(function() {
   // Mixing in overwrites existing functionality
   // plus it can be namespaced to an existing module's sub-namespace
	ß.util.mixin("string.custom", {
      capitalize: function(string) {
         return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
      },
      lower: function(string) {
         return string.toLowerCase();
      },
      onlyFunctions: "You cannot mixin variables, they might affect the Scandiojs in unintended ways"
   });

}());