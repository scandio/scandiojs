/**
 * === NOTE ===
 * All comment fields except @description are optional. If you don't specify them, it is up
 * to the developer to make up a good implementation. Please ensure to provide a well-defined
 * description at least.
 *
 * @description #required
 * SCANDIO maintains its own onDomReady mechanism. Before jQuery's $(document).ready handler is
 * invoked, an array of functions is filled. These functions are then called when the DOM has
 * fully loaded.
 * Being dependent on the {@code mod/Mod} mechanism, {@code ready} methods set on objects returned by
 * SCANDIO submodules are invoked.
 *
 * @domain
 * All applications.
 *
 * @precondition
 * Dependent on SCANDIO's {@code mod/Mod} functionality. jQuery is assumed.
 *
 * @postcondition
 * {@code ready} methods set on objects returned by SCANDIO submodules were invoked.
 *
 */

SCANDIO.Test.domReady = function() {
	var domReadyResults = SCANDIO.testData.stubDomReadyResults
	,	domReadyFuncs = SCANDIO.testData.stubDomReadyFuncs;

	$.each(domReadyFuncs, function() {
		this();
	});
};