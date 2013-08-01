/**
 * === NOTE ===
 * All comment fields except @description are optional. If you don't specify them, it is up
 * to the developer to make up a good implementation. Please ensure to provide a well-defined
 * description at least.
 *
 * @description #required
 * Return the current Confluence action name as string.
 *
 * @domain
 * Confluence.
 *
 * @precondition
 * URL in the browser is [...]/[actionName].action[...]
 *
 * @param
 * URL => the current URL that is viewable in the browser's address bar
 *
 * @return
 * Confluence action name as string.
 *
 *
 */

SCANDIO.Test.getActionName = function(url) {
	var	pattern = /([^\/]+)\.action/
	,	match = url.match(pattern);

	return match && match.length && match[1];
};