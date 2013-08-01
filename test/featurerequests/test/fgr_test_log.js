TestCase('fgr_log.js', {
	'test window.log function exists':
	function() {
		assertFunction(window.log);
	}
	,
	'test window.log function':
	function() {
		var expected = 'log test', lastIndex;
		log(expected);
		lastIndex = log.history.length - 1;
		assertTrue(lastIndex >= 0);
		assertObject(window.console);
		assertFunction(log);
		assertArray(log.history);
		assertNotUndefined(log.history.length);
		assertTrue(log.history.length > 0);
		assertEquals(expected, log.history[lastIndex][0]);
	}
});