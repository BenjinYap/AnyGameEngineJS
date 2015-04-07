function Engine () {
	var events = {};

	this.constructor = function (game, save) {
		if (arguments.length < 2) {
			throw 'Need 2 arguments. Got ' + arguments.length + '.';
		}

		if (game instanceof Game == false) {
			throw 'Argument 1 must be Game. Got ' + typeof (game) + '.';
		}
		
		if (save instanceof Save == false) {
			throw 'Argument 2 must be Save. Got ' + typeof (save) + '.';
		}

		this.game = game;
		this.save = save;
	};

	this.addEventListener = function (event, callback) {
		if (events [event] === undefined) {
			events [event] = [];
		}

		events [event].push (callback);
	}

	this.removeEventListener = function (event, callback) {
		if (events [event] !== undefined && events [event].indexOf (callback) > -1) {
			events [event].splice (events [event].indexOf (callback), 1);

			if (events [event].length <= 0) {
				delete events [event];
			}
		}
	}

	this.fireEvent = function (event) {
		if (events [event] !== undefined) {
			for (var i = 0; i < events [event].length; i++) {
				events [event][i].apply (this, Array.prototype.slice.call (arguments, 1));
			}
		}
	};
}