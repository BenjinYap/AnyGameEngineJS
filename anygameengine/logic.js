function Entity (id) {
	this.constructor = function (id) {
		this.id = id === undefined ? '' : id;
	};
	this.setDerivedClass = function (c) {
		this.derivedClass = c;
	}
	this.constructor (id);
	this.setDerivedClass ('Entity');
}

function LogicTreeNode (id) {
	var parentConstructor = this.constructor;
	parentConstructor (id);
	this.constructor = function (id) {
		parentConstructor.apply (this, [id]);
		this.nodes = [];
		this.parent = null;
	};
	this.constructor (id);
	this.setDerivedClass ('LogicTreeNode');
}

LogicTreeNode.inherits (Entity);

function LogicPointer (id, pointedID) {
	var parentConstructor = this.constructor;
	parentConstructor (id);
	this.constructor = function (id, pointedID) {
		parentConstructor.apply (this, [id]);
		this.pointedID = pointedID === undefined ? '' : pointedID;
	};
	this.constructor (id, pointedID);
	this.setDerivedClass ('LogicPointer');
}

LogicPointer.inherits (LogicTreeNode);

function LogicList (id, logics) {
	var parentConstructor = this.constructor;
	parentConstructor (id);
	this.constructor = function (id, logics) {
		parentConstructor.apply (this, [id]);
		this.nodes = logics === undefined ? [] : logics;
	};
	this.constructor (id, logics);
	this.setDerivedClass ('LogicList');
}

LogicList.inherits (LogicTreeNode);

function LogicOptionList (id, logics, text) {
	this.constructor (id, logics);
	this.setDerivedClass ('LogicOptionList');
	this.text = text === undefined ? '' : text;
}

LogicOptionList.inherits (LogicList);

function LogicOption (id, logics, text) {
	this.constructor (id, logics);
	this.setDerivedClass ('LogicOption');
	this.text = text === undefined ? '' : text;
}

LogicOption.inherits (LogicList);

function LogicText (id, text) {
	this.constructor (id);
	this.setDerivedClass ('LogicText');
	this.text = text === undefined ? '' : text;
}

LogicText.inherits (LogicTreeNode);

//all remaining logic is executed after changing zones
function LogicZoneChange (id, zoneID) {
	this.constructor (id);
	this.setDerivedClass ('LogicZoneChange');
	this.zoneID = zoneID === undefined ? '' : zoneID;
}

LogicZoneChange.inherits (LogicTreeNode);

//all logic past this point is dropped from the remaining logic when changing zones
function LogicIgnorePoint (id, ignoreNumber) {
	this.constructor (id);
	this.setDerivedClass ('LogicIgnorePoint');
	this.ignoreNumber = ignoreNumber === undefined ? 0 : ignoreNumber;
}

LogicIgnorePoint.inherits (LogicTreeNode);

function Zone (id, name, logicList) {
	this.constructor (id);
	this.setDerivedClass ('Zone');
	this.name = name === undefined ? '' : name;
	this.logicList = logicList === undefined ? new LogicList () : logicList;

}

Zone.inherits (Entity);