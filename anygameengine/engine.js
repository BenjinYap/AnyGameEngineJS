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

function ZoneEngine (game, save) {
	var ZoneEngineState = new Enum (
		'TRANSITION',
		'LOGIC_ACTION',
		'LOGIC_OPTION_LIST'
	);

	var state = ZoneEngineState.LOGIC_ACTION;
	var currentLogic = null;

	this.constructor (game, save);

	this.step = function () {
		if (state !== ZoneEngineState.LOGIC_ACTION) {
			throw 'Bad operation. Engine is in ' + state + ' state.';
		}

		currentLogic = this.save.remainingLogic [0];

		if (currentLogic instanceof LogicOptionList) {
			doLogicOptionList.call (this, currentLogic);
		} else if (currentLogic instanceof LogicText) {
			doLogicText.call (this, currentLogic);
		} else if (currentLogic instanceof LogicZoneChange) {
			doLogicZoneChange.call (this, currentLogic);
		} else if (currentLogic instanceof LogicIgnorePoint) {
			ignoreLogic.call (this);
		}
	};

	this.selectOption = function (index) {
		if (state !== ZoneEngineState.LOGIC_OPTION_LIST) {
			throw 'Bad operation. Engine is in ' + state + ' state.';
		}

		if (index < 0 || index > currentLogic.nodes.length - 1) {
			throw 'Option index out of bounds.';
		}

		state = ZoneEngineState.LOGIC_ACTION;
		this.save.remainingLogic.shift ();
		this.save.remainingLogic.unshift.apply (this.save.remainingLogic, currentLogic.nodes [index].nodes);
		this.step ();
	}

	function ignoreLogic () {
		this.save.remainingLogic.shift ();
		this.step ();
	}

	function doLogicOptionList (optionList) {
		state = ZoneEngineState.LOGIC_OPTION_LIST;
		this.fireEvent (ZoneEngineEvent.LOGIC_OPTION_LIST, optionList.nodes.map (function (option) {
			return option.text;
		}), optionList.text);
	}

	function doLogicText (text) {
		this.save.remainingLogic.shift ();
		this.fireEvent (ZoneEngineEvent.LOGIC_TEXT, text.text);
	}

	function doLogicZoneChange (zoneChange) {
		this.save.remainingLogic.shift ();
		var zone = this.game.zones.filter (function (z) { return z.id === zoneChange.zoneID; })[0];
		
		for (var i = 0; i < this.save.remainingLogic.length; i++) {
			if (this.save.remainingLogic [i] instanceof LogicIgnorePoint) {
				this.save.remainingLogic.splice (i, this.save.remainingLogic.length);
				break;
			}
		}

		for (var i = 0; i < zone.logicList.nodes.length; i++) {
			this.save.remainingLogic.push (zone.logicList.nodes [i]);
		}

		this.fireEvent (ZoneEngineEvent.LOGIC_ZONE_CHANGE, zone.name);
	}
}

var ZoneEngineEvent = new Enum (
	'LOGIC_TEXT',
	'LOGIC_OPTION_LIST',
	'LOGIC_OPTION',
	'LOGIC_ZONE_CHANGE'
);

ZoneEngine.inherits (Engine);