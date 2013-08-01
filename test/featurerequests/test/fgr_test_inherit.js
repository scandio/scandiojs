TestCase('fgr_inherit.js', {
	'test inherit function exists':
	function() {
		assertFunction(SCANDIO.Test.inherit);
	}
	, 
	'test inherit with string prototype':
	function() {
		SCANDIO.Test.inherit(String, 'someFunc', function() {});
		assertFunction('someFunc function was set on string prototype', String.prototype.someFunc);
		SCANDIO.Test.inherit(String, 'someFunc', function() {});
		assertFunction('someFunc already exists and scsomeFunc was set on string prototype', String.prototype.scsomeFunc);
		SCANDIO.Test.inherit(String, 'returnFunc', function() {
			return 'abc';
		});
		assertEquals('calling the new method returns the expected result', 'abc', 'someRandomString'.returnFunc());
	}
});