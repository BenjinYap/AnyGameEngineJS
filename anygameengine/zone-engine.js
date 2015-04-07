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

		//logic flows
		if (currentLogic instanceof LogicOptionList) {
			doLogicOptionList.call (this);
		} else if (currentLogic instanceof LogicIgnorePoint) {
			doLogicIgnorePoint.call (this);
		} else if (currentLogic instanceof LogicBackUpOptionList) {
			doLogicBackUpOptionList.call (this);
		} else if (currentLogic instanceof LogicLoop) {
			doLogicLoop.call (this);
		} else if (currentLogic instanceof LogicLoopContinue) {
			doLogicLoopContinue.call (this);
		} else if (currentLogic instanceof LogicLoopBreak) {
			doLogicLoopBreak.call (this);
		}
		//logic actions
		  else if (currentLogic instanceof LogicText) {
			doLogicText.call (this);
		} else if (currentLogic instanceof LogicZoneChange) {
			doLogicZoneChange.call (this);
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

	function doLogicIgnorePoint () {
		console.log ('ignored');
		this.save.currentLogic = this.save.currentLogic.getNextLogic ();
		this.step ();
	}

	function doLogicOptionList () {
		state = ZoneEngineState.LOGIC_OPTION_LIST;
		this.fireEvent (ZoneEngineEvent.LOGIC_OPTION_LIST, this.save.currentLogic.nodes.map (function (option) {
			return option.text;
		}), this.save.currentLogic.text);
	}

	function doLogicBackUpOptionList () {
		var times = this.save.currentLogic.times;
		var logic = this.save.currentLogic;

		for (var i = 0; i < times; i++) {
			while (true) {
				if (logic.parent === null) {
					throw 'bad happened';
				}

				logic = logic.parent;

				if (logic instanceof LogicOptionList) {
					break;
				}
			}
		}

		this.save.currentLogic = logic;
		this.step ();
	}

	function doLogicLoop () {
		var loop = this.save.currentLogic;
		var repeat = loop.repeat;
		var count = loop.count === undefined ? 0 : loop.count;
		loop.count = count;

		if (count < repeat) {
			loop.count++;
			this.save.currentLogic = loop.nodes [0];
		} else {
			loop.count = 0;
			this.save.currentLogic = loop.getNextLogic ();
		}

		this.step ();
	}

	function doLogicLoopContinue () {
		this.save.currentLogic = this.save.currentLogic.getParentByType (LogicLoop);
		this.step ();
	}

	function doLogicLoopBreak () {
		var loop = this.save.currentLogic.getParentByType (LogicLoop);
		loop.count = 0;
		this.save.currentLogic = loop.getNextLogic ();
		this.step ();
	}

	function doLogicText () {
		var text = this.save.currentLogic.text;
		this.save.currentLogic = this.save.currentLogic.getNextLogic ();
		this.fireEvent (ZoneEngineEvent.LOGIC_TEXT, text);
	}

	function doLogicZoneChange () {
		//get the zone to change to
		var newZoneID = this.save.currentLogic.zoneID;
		var zone = this.game.zones.filter (function (z) { return z.id === newZoneID; })[0];

		//get the logic after the logiczonechange
		var nextLogic = this.save.currentLogic.getNextLogic ();

		//if there is no logic after the logiczonechange or the next logic is an ignore
		if (nextLogic === null || nextLogic instanceof LogicIgnorePoint) {
			//set the new current logic to the first logic of the new zone
			this.save.currentLogic = zone.logicList.clone (null).nodes [0];
		} else {  //if there is logic after the logiczonechange
			//the first logic in the new chain
			var newCurrentLogic = nextLogic.clone (null);

			//reference to the previous logic in the new chain
			var prevLogicNew = newCurrentLogic;

			//reference to the previous logic in the old chain
			var prevLogic = nextLogic;

			while (true) {
				//get the next logic in the old chain
				var nextLogic = prevLogic.getNextLogic ();

				//stop if there's nothing or it's an ignore
				if (nextLogic === null || nextLogic instanceof LogicIgnorePoint) {
					break;
				}

				//clone the old chain into the new chain
				prevLogicNew.next = nextLogic.clone (null);
				prevLogicNew.next.prev = prevLogicNew;

				//reset the old and new references
				prevLogicNew = prevLogicNew.next;
				prevLogic = nextLogic;
			}

			//clone the new zone into the new chain
			prevLogicNew.next = zone.logicList.clone (null).nodes [0];
			prevLogicNew.next.prev = prevLogicNew;

			//finally set the new logic
			this.save.currentLogic = newCurrentLogic;
		}

		root = this.save.currentLogic;

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