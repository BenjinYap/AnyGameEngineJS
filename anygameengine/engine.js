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

		var currentLogic = save.currentLogic;

		if (currentLogic instanceof LogicOptionList) {
			doLogicOptionList.call (this);
		} else if (currentLogic instanceof LogicText) {
			doLogicText.call (this);
		} else if (currentLogic instanceof LogicZoneChange) {
			doLogicZoneChange.call (this);
		} else if (currentLogic instanceof LogicIgnorePoint) {
			ignoreLogic.call (this);
		}
	};

	this.selectOption = function (index) {
		if (state !== ZoneEngineState.LOGIC_OPTION_LIST) {
			throw 'Bad operation. Engine is in ' + state + ' state.';
		}

		if (index < 0 || index > this.save.currentLogic.nodes.length - 1) {
			throw 'Option index out of bounds.';
		}

		state = ZoneEngineState.LOGIC_ACTION;
		this.save.currentLogic = this.save.currentLogic.nodes [index].nodes [0];
		//this.save.remainingLogic.shift ();
		//this.save.remainingLogic.unshift.apply (this.save.remainingLogic, currentLogic.nodes [index].nodes);
		this.step ();
	}

	function ignoreLogic () {
		this.save.remainingLogic.shift ();
		this.step ();
	}

	function doLogicOptionList () {
		state = ZoneEngineState.LOGIC_OPTION_LIST;
		this.fireEvent (ZoneEngineEvent.LOGIC_OPTION_LIST, this.save.currentLogic.nodes.map (function (option) {
			return option.text;
		}), this.save.currentLogic.text);
	}

	function doLogicText () {
		var text = this.save.currentLogic.text;
		this.save.currentLogic = this.save.currentLogic.getNextLogic ();
		this.fireEvent (ZoneEngineEvent.LOGIC_TEXT, text);
	}

	function doLogicZoneChange () {
		var newZoneID = this.save.currentLogic.zoneID;

		var newCurrentLogic = this.save.currentLogic.getNextLogic ().clone (null);
		var lastLogic = newCurrentLogic;
		var logic = this.save.currentLogic.getNextLogic ().getNextLogic ();

		while (true) {
			lastLogic.next = logic.clone (null);
			lastLogic.next.prev = lastLogic;
			lastLogic = lastLogic.next;

			if (logic.getNextLogic () !== null) {
				logic = logic.getNextLogic ();
			} else {
				logic = lastLogic;
				break;
			}
		}

		var zone = this.game.zones.filter (function (z) { return z.id === newZoneID; })[0];
		logic.next = zone.logicList.clone (null).nodes [0];
		logic.next.prev = logic;

		root = newCurrentLogic;
		this.save.currentLogic = newCurrentLogic;

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