/**
 * === NOTE ===
 * All comment fields except @description are optional. If you don't specify them, it is up
 * to the developer to make up a good implementation. Please ensure to provide a well-defined
 * description at least.
 *
 * @description #required
 * Log all data given to the method to the console and save the content in an array on
 * the method. On the output, mark that this log was printed by Scandio.
 *
 * @domain
 * All applications.
 *
 * @precondition
 * Will only output information if console.log is supported by the browser.
 *
 * @param
 * msg: the message for output
 *
 * @return
 * Nothing.
 *
 * @postcondition
 * Message was printed in the browser's console and stored in a collection on the log method.
 *
 */

(function() {

	if (!window.log) {
		window.log = function() {
			log.history = log.history || [];
			log.history.push(arguments);
			if (this.console) {
				console.log('*** SCANDIO: ');
				console.log(Array.prototype.slice.call(arguments));
			}
		};
	}

}());