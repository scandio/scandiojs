/**
 * === NOTE ===
 * All comment fields except @description are optional. If you don't specify them, it is up
 * to the developer to make up a good implementation. Please ensure to provide a well-defined
 * description at least.
 *
 * @description #required
 * Safely inherit another object (prototypal inheritance), without overwriting functionality
 * that might have been set previously under the same name.
 * If a given function already exists on the given prototype, rename the function with a prefix
 * of "sc" for Scandio. For example, inheriting the String.prototype with a "contains" method
 * is a risk since other libraries might depend on their own function. If a "contains" function
 * already exists, the function will be renamed to "sccontains". In this case, a console.log
 * must inform the developer.
 *
 * @domain
 * All applications.
 *
 * @precondition
 * Depends on the window.log function defined by Scandio.
 *
 * @param
 * objectToInherit: the object to inherit, e.g. String
 * funcName: the name of the new method to inherit the object
 * func: the new method to inherit the object
 *
 * @return
 * Nothing.
 *
 * @postcondition
 * The new method can be called on any object that inherits from the object given Object.
 * For example after calling SCANDIO.inherit(String, 'contains', function(needle) {})
 * 'contains' can be called on all strings like 'abc'.contains('a')
 *
 */

SCANDIO.Test.inherit = function(objectToInherit, funcName, func) {
	var newFuncName = 'sc' + funcName;
	if (typeof objectToInherit.prototype[funcName] === 'undefined') {
		objectToInherit.prototype[funcName] = func;
		log('object was inherited with function ' + funcName);
	} else {
		objectToInherit.prototype[newFuncName] = func;
		log('object already has a function "' + funcName +
			'". Function name was changed to ' + newFuncName);
	}
};