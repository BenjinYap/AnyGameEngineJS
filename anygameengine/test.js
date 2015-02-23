function doTest () {
	function construct(constructor, args) {
	    function F() {
	        return constructor.apply(this, args);
	    }
	    F.prototype = constructor.prototype;
	    return new F();
	}

	function test (className) {
		var args = {};

		for (var i = 1; i < arguments.length; i += 2) {
			args [arguments [i]] = arguments [i + 1];
		}

		var a = [];

		for (var prop in args) {
			a.push (args [prop]);
		}

		var obj = construct (className, a);

		var h1 = '<p>Testing ' + className.toString ().substr (0, className.toString ().indexOf ('(')).replace ('function ', '') + '</p>';
		var div = $('<pre></pre>');

		for (var prop in args) {
			if (obj [prop] instanceof Array) {
				for (var i = 0; i < args [prop].length; i++) {
					if (obj [prop][i] !== args [prop][i]) {
						$(div).append (prop + '[' + i + '] failed, expected ' + args [prop][i] + ', got ' + obj [prop][i] + '<br/>');
					}
				}
			} else if (obj [prop] !== args [prop]) {
				$(div).append (prop + ' failed, expected ' + args [prop] + ', got ' + obj [prop] + '<br/>');
			}
		}

		$('body').append (h1, div);

		return obj;
	}

	test (Entity, 'id', 123);
	test (LogicPointer, 'id', 'awd', 'pointedID', 'aaa');
	test (LogicList, 'id', 1, 'logics', [1, 2, 3]);
	test (LogicOptionList, 'id', 2, 'logics', ['awd', 2], 'text', 'hello dar');
	test (LogicOption, 'id', 2, 'logics', ['awd', 2], 'text', 'hello dar');
	test (LogicText, 'id', 123, 'text', 'hello!!!');
}

$(function () {
//	doTest ();
});
