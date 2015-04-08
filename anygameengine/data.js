function Save () {
	this.name = '';
	this.currentZoneID = '';
	this.currentLogic = null;
	this.customVars = [];
}

function Game () {
	this.name = '';
	this.author = '';
	this.description = '';
	this.zones = [];
	this.startingZoneID = '';
	this.customVars = [];

	this.getFreshSave = function () {
		var save = new Save ();
		save.startingZoneID = this.startingZoneID;
		save.currentZoneID = this.startingZoneID;
		var zone = this.zones.filter (function (z) { return z.id === this.startingZoneID; }, this)[0];
		save.currentLogic = zone.logicList.clone (null).nodes [0];
		return save;
	};
}

var root;

Game.fromSerialized = function (string) {
	var gameNode = parseXML (string).documentElement;
	var game = new Game ();
	loadGeneral ();
	loadZones ();
	loadCustomVars ();

	function loadGeneral () {
		game.name = gameNode.getAttribute ('name');
		game.author = gameNode.getAttribute ('author');
		game.description = gameNode.getAttribute ('description');
		game.startingZoneID = gameNode.getAttribute ('startingZoneID');
	}

	function loadZones () {
		var zonesNode = gameNode.getElementsByTagName ('Zones')[0];
		removeTextNodes (zonesNode);

		for (var i = 0; i < zonesNode.childNodes.length; i++) {
			var z = zonesNode.childNodes [i];
			var zone = new Zone ();
			zone.id = z.getAttribute ('id');
			zone.name = z.getAttribute ('name');
			zone.logicList = new LogicList ();
			zone.logicList.parent = null;
			zone.logicList.nodes = [];
			removeTextNodes (z);

			for (var j = 0; j < z.childNodes.length; j++) {
				zone.logicList.nodes.push (createLogic (zone.logicList, z.childNodes [j]));

				if (j > 0) {
					zone.logicList.nodes [j].prev = zone.logicList.nodes [j - 1];
					zone.logicList.nodes [j - 1].next = zone.logicList.nodes [j];
				}
			}

			game.zones.push (zone);
		}



		function createLogic (parent, node) {
			removeTextNodes (node);
			var logic = new window [node.nodeName] ();
			logic.parent = parent;
			logic.prev = null;
			logic.next = null;
			logic.nodes = [];
			var attrs = node.attributes;

			for (var i = 0; i < attrs.length; i++) {
				logic [attrs [i].name] = attrs [i].value;
			}

			//if (/List/.test (node.nodeName) || node.nodeName === 'LogicOption') {
				for (var i = 0; i < node.childNodes.length; i++) {
					logic.nodes.push (createLogic (logic, node.childNodes [i]));

					if (i > 0) {
						logic.nodes [i].prev = logic.nodes [i - 1];
						logic.nodes [i - 1].next = logic.nodes [i];
					}
				}
			//}

			logic.verify ();
			return logic;
		}
	}

	function loadCustomVars () {
		var customVarsNode = gameNode.getElementsByTagName ('CustomVars')[0];
		removeTextNodes (customVarsNode);

		for (var i = 0; i < customVarsNode.childNodes.length; i++) {
			var v = customVarsNode.childNodes [i];
			var customVar = new window [v.nodeName] (v.getAttribute ('name'), v.getAttribute ('type'));

			if (customVar instanceof CustomVarArray) {
				var temp = v.getAttribute ('values');
				customVar.values = temp.length <= 0 ? [] : temp.split (',');
			} else {
				customVar.value = v.getAttribute ('value');
			}

			customVar.verify ();
		}
	}

	return game;
};

