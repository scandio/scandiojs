TestCase('fgr_domready.js', {
	setUp: function() {
		// Store stub results of calls to the functions in the domReadyFuncs array.
		SCANDIO.testData.stubDomReadyResults = [];

		// Stub array for testing purposes. In reality, this would be filled with functions
		// given as 'ready' functions on submodule return-objects.
		SCANDIO.testData.stubDomReadyFuncs = [
			function() {
				SCANDIO.testData.stubDomReadyResults.push('1 was called');
			}
			, function() {
				SCANDIO.testData.stubDomReadyResults.push('2 was called');
			}
			, function() {
				SCANDIO.testData.stubDomReadyResults.push('3 was called');
			}
		];
	}
	,
	'test function exists':
	function() {
		var results = SCANDIO.testData.stubDomReadyResults
		,	funcs = SCANDIO.testData.stubDomReadyFuncs;
		SCANDIO.Test.domReady();
		assertEquals('with 3 domReady funcs, results array has length 3 after these functions were called', 3, results.length);
		assertEquals('domReady func 1', '1 was called', results[0]);
		assertEquals('domReady func 2', '2 was called', results[1]);
		assertEquals('domReady func 3', '3 was called', results[2]);
	}
});