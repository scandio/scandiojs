/**
 * === NOTE ===
 * All comment fields except @description are optional. If you don't specify them, it is up
 * to the developer to make up a good implementation. Please ensure to provide a well-defined
 * description at least.
 *
 * @description #required
 *
 * This is the main architectural method to enhance the SCANDIO object with new modules.
 * Using this method applies the JavaScript Module Pattern which avoids interacting with
 * the global environment and ensures that every module within SCANDIO resides in its
 * own namespace.
 *
 * Calling the {@code mod} method with the arguments {@code name} and {@code modFunc} triggers the following
 * actions:
 * - a new module with the given {@code name} is registered within SCANDIO
 * - the return value of the given {@code modFunc} is stored within SCANDIO
 * - if several modules are registered by calling {@code mod}, the sequence of calls must be stored
 * - the SCANDIO framework will then call methods on the object that was returned by the submodule
 * on different predefined actions
 *
 * @domain
 * Basic architectural SCANDIO method.
 *
 * @precondition
 * None.
 *
 * @param
 * name: the name/namespace of the submodule to be registered within SCANDIO
 * module: function (i.e. closure) with all contents of the module
 *
 * @return
 * The {@code mod} method will not return anything. However, each {@code module} function given
 * as parameter to {@code mod} exposes an interface of the module by returning an object.
 * See examples for clarification.
 *
 * @postcondition
 * An object returned by the given {@code module} function is set on the {@code Mod} object.
 * This object exposes the module's interface and also enables the SCANDIO framework to interact
 * with the module.
 *
 */

(function($) {

	var	Mod = { __seq: [] }
	,	isDomReady = false
	,	domReadyFuncs = []
	,	globEnv = {}
	,	domReadyInvoke = null
	;

	SCANDIO.Test.mod = function(name, module, modEnv) {
		var mod = SCANDIO.Test.mod
		,	typeError = null
		;

		if (typeof name !== 'string' || typeof module !== 'function'
			|| modEnv && typeof modEnv !== 'object') {
			typeError = 'Parameter mismatch in SCANDIO.mod - please provide (1) name as'
				+ 'string and a (2) module as function. (3) an modEnv object may be given to'
				+ 'extend the default global environment';
		}

		if (Mod.__seq.indexOf(name) >= 0) {
			// TODO: UNCOMMENT THIS
			// typeError = 'Error: there is already a module with name "' + name + '".';
		} else {
			Mod.__seq.push(name);
		}
		if (typeError) {
			throw new TypeError(typeError);
		}

		$.extend(true, globEnv, modEnv);
		Mod[name] = module.call(SCANDIO, jQuery, globEnv, SCANDIO);

		if (Mod[name] && typeof Mod[name].ready === 'function') {
			domReadyFuncs.push(Mod[name].ready);
		}

		domReadyInvoke = function() {
			$.each(Mod.__seq, function() {
				if (Mod[index] && typeof Mod[index].ready === 'function') {
					Mod[index].ready();
				}
			});
		};

		if (typeof modEnv.readyFn === 'function') {
			modEnv.readyFn(domReadyInvoke);
		} else {
			$(document).ready(domReadyInvoke);
		}

		SCANDIO.testData.Mod = Mod;
		SCANDIO.testData.isDomReady = isDomReady;
		SCANDIO.testData.domReadyFuncs = domReadyFuncs;
	};


}(jQuery));

