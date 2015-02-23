function Save () {
	this.name = '';
	this.currentZoneID = '';
	this.remainingLogic = [];
}

function Game () {
	this.name = '';
	this.author = '';
	this.description = '';
	this.zones = [];
	this.startingZoneID = '';

	this.getFreshSave = function () {
		var save = new Save ();
		save.startingZoneID = this.startingZoneID;
		var zone = this.zones.filter (function (z) { ;return z.id === this.startingZoneID; }, this)[0];
		
		for (var i = 0; i < zone.logicList.logics.length; i++) {
			save.remainingLogic.push (zone.logicList.logics [i]);
		}

		return save;
	};
}

Game.fromSerialized = function (string) {
	var obj = JSON.parse (string);
	var game = new Game ();
	game.name = obj.name;
	game.author = obj.author;
	game.description = obj.description;
	game.startingZoneID = obj.startingZoneID;

	for (var i = 0; i < obj.zones.length; i++) {
		var z = obj.zones [i];
		var zone = new Zone (z.id, z.name, createLogic (z.logicList));
		game.zones.push (zone);
	}

	function createLogic (obj) {
		var logic = new window [obj.type] ();
		
		for (var prop in obj) {
			logic [prop] = obj [prop];
		}

		if (/List/.test (obj.type) || obj.type === 'LogicOption') {
			logic.logics = [];

			for (var i = 0; i < obj.logics.length; i++) {
				logic.logics.push (createLogic (obj.logics [i]));
			}
		}

		return logic;
	}

	return game;
};