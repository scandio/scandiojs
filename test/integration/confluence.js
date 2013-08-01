TestCase('confluence getActionName function', {
	'test confluence object exists':
	function() {
		assertObject(SCANDIO.confluence);
	}
	
	, 'test getActionName function exists in confluence object':
	function() {
		assertFunction(SCANDIO.confluence.getActionName);
	}
	
	, 'test getActionName':
	function() {
		var fn = SCANDIO.confluence.getActionName
		, href1 = 'http://www.weirdsite.com/confluence/weirdplugin/dashboard.action?abc=something'
		, href2 = 'http://www.weirdsite.com/confluence/weirdplugin/'
		, href3 = 'http://www.weirdsite.com/confluence/weirdplugin/somethingelse/iwantout.action';

		assertEquals('action name was read properly from url #1', 'dashboard', fn(href1));
		assertNull('null is returned if url doesnt have an action', fn(href2));
		assertEquals('action name was read properly from url #2', 'iwantout', fn(href3));
	}
});