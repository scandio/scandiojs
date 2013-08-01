/**
 * === NOTE ===
 * All comment fields except @description are optional. If you don't specify them, it is up
 * to the developer to make up a good implementation. Please ensure to provide a well-defined
 * description at least.
 *
 * @description #required
 * Global properties store accessible through SCANDIO.props(...). After page load, data can
 * be stored by calling the function like SCANDIO.props(key, value). Properties can be
 * retrieved by calling the function like SCANDIO.props(key). This is similar to jQuery.fn.data,
 * except that it does not associate DOM elements with the given data. Although this functionality
 * can be achieved easily using jQuery, it makes sense to extract a similar pattern to scandio.js,
 * to ensure that no other JavaScript modules or libraries conflict with the data store.
 * Additionally, data is stored depending on the type of the data given. If the value to be stored
 * is a primitive type, it is simply stored under the given key. If the value is an object, each
 * property of the object is stored under its key in the parameter object. E.g. a storage call of
 * SCANDIO.props({ 'one':1, 'two':2 }) and a retrieval call of SCANDIO.props('one') will result in
 * the value 1 returned.
 *
 * @domain
 * All applications.
 *
 * @precondition
 * No page refreshes in between data usage. No persistent storage. jQuery can be assumed and used.
 *
 * @param
 * (a) two parameters (key, value): sets the given value for the given key, as described in @description.
 * (b) one parameter (key): gets the value for the given key
 *
 * @return
 * For @param (1) return nothing, for @param (2) return the value for the given key.
 *
 * @postcondition
 * Same as @precondition.
 *
 */

(function() {
	var propsStore = {};
	SCANDIO.Test.props = function(key, value) {
		var elem;
		if (typeof value === 'undefined') {
			return propsStore[key];
		}
		if (typeof value === 'object') {
			for (elem in value) {
				if (value.hasOwnProperty(elem)) {
					propsStore[elem] = value[elem];
				}
			}
		} else if (key && typeof value !== 'undefined') {
			propsStore[key] = value;
		} else {
			throw new TypeError('Parameter mismatch in props');
		}
	};
}());