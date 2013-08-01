TestCase('fgr_props.js', {
	'test props function exists':
	function() {
		assertFunction(SCANDIO.Test.props);
	}
	,
	'test props function with simple parameter':
	function() {
		var string = 'abc'
		,	number = 2;
		SCANDIO.Test.props('string', string);
		SCANDIO.Test.props('number', number);
		assertEquals(string, SCANDIO.Test.props('string'));
		assertEquals(number, SCANDIO.Test.props('number'));
	}
	,
	'test props function with object parameter':
	function() {
		var object = { string: 'abc', number: 2 }
		,	object2 = {
			a: { 'one':1 }
			, b: { 'two': 2 }
		};
		SCANDIO.Test.props('object', object);
		SCANDIO.Test.props('object2', object2);
		assertEquals(object.string, SCANDIO.Test.props('string'));
		assertEquals(object.number, SCANDIO.Test.props('number'));
		assertEquals(object2.a, SCANDIO.Test.props('a'));
		assertEquals(object2.b, SCANDIO.Test.props('b'));
	}
	,
	'test props between function calls #1':
	function() {
		SCANDIO.Test.props('greatString', 'greatString');
	}
	,
	'test props between function calls #2':
	function() {
		assertEquals('greatString', SCANDIO.Test.props('greatString'));
	}
});