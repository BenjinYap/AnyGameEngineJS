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
var root;
Game.fromSerialized = function (string) {
	var gameNode = parseXML (string).documentElement;
	var game = new Game ();
	game.name = gameNode.getAttribute ('name');
	game.author = gameNode.getAttribute ('author');
	game.description = gameNode.getAttribute ('description');
	game.startingZoneID = gameNode.getAttribute ('startingZoneID');

	var zonesNode = gameNode.getElementsByTagName ('Zones')[0];
	removeTextNodes (zonesNode);

	for (var i = 0; i < zonesNode.childNodes.length; i++) {
		var z = zonesNode.childNodes [i];
		var zone = new Zone (z.getAttribute ('id'), z.getAttribute ('name'), new LogicList ());
		removeTextNodes (z);

		for (var j = 0; j < z.childNodes.length; j++) {
			zone.logicList.logics.push (createLogic (z.childNodes [i]));
		}

		game.zones.push (zone);
	}

	function createLogic (node) {
		removeTextNodes (node);
		var logic = new window [node.nodeName] ();
		var attrs = node.attributes;

		for (var i = 0; i < attrs.length; i++) {
			logic [attrs [i].name] = attrs [i].value;
		}

		if (/List/.test (node.nodeName) || node.nodeName === 'LogicOption') {
			logic.logics = [];

			for (var i = 0; i < node.childNodes.length; i++) {
				logic.logics.push (createLogic (node.childNodes [i]));
			}
		}

		return logic;
	}

	return game;
};

