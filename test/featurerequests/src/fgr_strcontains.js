/**
 * === NOTE ===
 * All comment fields except @description are optional. If you don't specify them, it is up
 * to the developer to make up a good implementation. Please ensure to provide a well-defined
 * description at least.
 *
 * @description #required
 * Returns true if a string contains a given substring. The method must be available on all
 * strings, either by the given name or with a prefix to avoid naming collisions.
 *
 * @domain
 * All applications. The method must be available on all strings.
 *
 * @precondition
 * Depends on the SCANDIO.inherit method.
 *
 * @param
 * needle: the substring to be checked for
 *
 * @return
 * True if the string on which the method is called contains a given substring, false otherwise.
 *
 */

SCANDIO.Test.inherit(String, 'contains', function(needle, caseSensitive) {
	if (caseSensitive === false) {
		return this.toLowerCase().indexOf(needle.toLowerCase()) >= 0;
	} else {
		return this.indexOf(needle) >= 0;
	}
});