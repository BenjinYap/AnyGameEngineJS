Function.prototype.inherits = function (className) {
	this.prototype = new className ();
}

function Enum () {
	for (var i = 0; i < arguments.length; i++) {
		this [arguments [i]] = arguments [i];
	}
}