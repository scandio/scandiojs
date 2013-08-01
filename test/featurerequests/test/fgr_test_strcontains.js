TestCase('fgr_strcontains.js', {
	
	'test string contains function':
	function() {
		assertFunction('String.contains function exists', String.prototype.contains);
		var string = 'i love javascript'
		,	needle = 'love'
		,	needle2 = 'hate';
		assertTrue('"love" is in string', string.contains(needle));
		assertFalse('"hate" is not in string', string.contains(needle2));
	}
	,
	'test string contains case sensitive':
	function() {
		var string = 'i love javascript'
		,	needle = 'Love';
		assertFalse('"Love" is not in string if case sensitive', string.contains(needle));
		assertFalse('"Love" is not in string if case sensitive', string.contains(needle, true));
	}
	,
	'test string contains case insensitive':
	function() {
		var string = 'i love javascript'
		,	needle = 'Love';
		assertTrue('"Love" is in string if not case sensitive', string.contains(needle, false));
	}
});