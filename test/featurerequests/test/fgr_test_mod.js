TestCase('fgr_mod.js', {
	
	setUp: function() {
		SCANDIO.Test.mod('someModuleName', function($, env, SC) {
			return {
				one: 1
				, two: 'two'
			};
		});
		SCANDIO.Test.mod('someModuleName.2.1', function($) {
			return {
				three: 'three three three'
				, four: 444
			};
		});
	}
	,
	tearDown: function() {
		SCANDIO.testData.Mod = { __seq: [] };
		SCANDIO.testData.domReadyFuncs = [];
	}
	,
	'test mod method/object exists':
	function() {
		assertFunction(SCANDIO.Test.mod);
		assertObject(SCANDIO.testData.Mod);
	}
	,
	'test submodule returned object exists on mod method':
	function() {
		assertObject('someModuleName is accessible object', SCANDIO.testData.Mod.someModuleName);
		assertObject('someModuleName.2.1 is accessible object', SCANDIO.testData.Mod['someModuleName.2.1']);
	}
	,
	'test submodule register sequence is correct':
	function() {
		assertArray('array is saved in test data', SCANDIO.testData.Mod.__seq);
		assertEquals(
				'testData contains name of submodules in correct order', 
				['someModuleName', 'someModuleName.2.1'], 
				SCANDIO.testData.Mod.__seq);			
	}
	,
	'test domReady data exists':
	function() {
		assertArray('domReadyFuncs array exists', SCANDIO.testData.domReadyFuncs);
		assertBoolean('isDomReady boolean exists', SCANDIO.testData.isDomReady);
	}
	,
	'test domReadyFunc array is filled when submodule has "ready" method in returned object':
	function() {
		var testFuncs = [];
		
		SCANDIO.Test.mod('readyFunc', function($) {
			var ready = function() {
				ready.called = true;
				console.log('readyFunc!!!');
			};
			testFuncs.push(ready);
			return {
				ready: ready
			};
		});
		assertEquals('domReadyFunc array has length 1 after one ready func was returned', 1, SCANDIO.testData.domReadyFuncs.length);
		assertEquals('domReadyFunc was set', testFuncs[0], SCANDIO.testData.domReadyFuncs[0]);
		
		SCANDIO.Test.mod('readyFunc2', function($) {
			var ready = function() {
				ready.called = true;
				console.log('readyFunc2!!!');
			};
			testFuncs.push(ready);
			return {
				ready: ready
			};
		});
		assertEquals('domReadyFunc array has length 2 after two ready funcs were set', 2, SCANDIO.testData.domReadyFuncs.length);
		assertEquals('domReadyFunc was set', testFuncs[1], SCANDIO.testData.domReadyFuncs[1]);
	}
});

TestCase('fgr_mod.js-2', {
	
	setUp: function() {

	}
	,
	tearDown: function() {

	}
	,
	'test mod parameters':
	function() {
		SCANDIO.Test.mod('domReadyConfig', function($, env, S) {
			assertObject('SCANDIO object received in mod callback', S);
			assertObject('env object received in mod callback', env);
			assertFunction('jQuery object received in mod callback', $);
		});
	}
	,
	'test mod custom domreadyFunc':
	function() {
		SCANDIO.Test.mod('domReadyConfig', function($, env, S) {
			assertFunction(env.domReadyFunc);
		}, {
			domReadyFunc: function() {}
		});
	}

});