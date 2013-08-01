TestCase('window.log lib function', {
	'test window.log function exists':
	function() {
		assertFunction(window.log);
	}

	, 'test window.log function':
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


TestCase('props lib function', {

	'test props function exists':
	function() {
		assertFunction(SCANDIO.props);
	}

	, 'test props function with simple parameter':
	function() {
		var string = 'abc'
		, number = 2;
		SCANDIO.props('string', string);
		SCANDIO.props('number', number);
		assertEquals(string, SCANDIO.props('string'));
		assertEquals(number, SCANDIO.props('number'));
	}
	
	, 'test props function with object parameter':
	function() {
		var object = { string: 'abc', number: 2 };
		SCANDIO.props('object', object);
		assertEquals(object.string, SCANDIO.props('string'));
		assertEquals(object.number, SCANDIO.props('number'));
	}

});

TestCase('inherit lib function', {
	'test inherit function exists':
	function() {
		assertFunction(SCANDIO.inherit);
	}

	, 'test inherit with string prototype':
	function() {
		SCANDIO.inherit(String, 'someFunc', function() {});
		assertFunction('someFunc function was set on string prototype', String.prototype.someFunc);
		SCANDIO.inherit(String, 'someFunc', function() {});
		assertFunction('someFunc already exists and someFuncSC was set on string prototype', String.prototype.someFuncSC);
	}
});

AsyncTestCase('links lib function', {
	'test links lib function exists':
	function() {
		assertFunction(SCANDIO.links);
	}

	, 'test links with id parameter':
	function() {
		$(document.body).append('<a id="link1">').append('<a id="link2">');
		assertEquals('links appended', 2, $('#link1, #link2').length);
		SCANDIO.links({
			link1: function() {
				SCANDIO.testData.link1 = true;
			}
			, link2: function() {
				SCANDOI.testData.link2 = true;
			}
		}, 'id');
//		queue.call('Step 1: click both links', function(callbacks) {
//			callbacks.add(function() {
//				$('#link1, #link2').click();
//			});
//		})
	}
});

TestCase('lib functions type extensions', {
	'test string contains function':
	function() {
		assertFunction('String.contains function exists', String.prototype.contains);
		var string = 'i love javascript'
		, needle = 'love'
		, needle2 = 'hate';
		assertTrue('"love" is in string', string.contains(needle));
		assertFalse('"hate" is not in string', string.contains(needle2));
	}
});