TestCase('integr_fgr_setup.js', {
	
	'test scandio.js was setup':
	function() {
		assertObject('window.SCANDIO setup', window.SCANDIO);
		assertObject('test Events object was set on SCANDIO', SCANDIO.Events);
		assertObject('test Test Object was set on SCANDIO', SCANDIO.Test);
		assertObject('test testData Object was set on SCANDIO', SCANDIO.testData);
	}
	,
	'test jQuery was found':
	function() {
		assertFunction('jQuery object in window', jQuery);
	}
	,
	'test testData contents':
	function() {
		assertObject('test SCANDIO has sandboxed document object', SCANDIO.testData.document);
		assertObject('test SCANDIO has sandboxed location object', SCANDIO.testData.location);
	}

});