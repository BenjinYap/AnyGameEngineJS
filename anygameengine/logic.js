function Entity (id) {
	this.constructor = function (id) {
		this.id = id === undefined ? '' : id;
	};
	this.constructor (id);
}

function LogicPointer (id, pointedID) {
	var parentConstructor = this.constructor;
	parentConstructor (id);
	this.constructor = function (id, pointedID) {
		parentConstructor.apply (this, [id]);
		this.pointedID = pointedID === undefined ? '' : pointedID;
	};
	this.constructor (id, pointedID);
}

LogicPointer.inherits (Entity);

function LogicList (id, logics) {
	var parentConstructor = this.constructor;
	parentConstructor (id);
	this.constructor = function (id, logics) {
		parentConstructor.apply (this, [id]);
		this.logics = logics === undefined ? [] : logics;
	};
	this.constructor (id, logics);
}

LogicList.inherits (Entity);

function LogicOptionList (id, logics, text) {
	this.constructor (id, logics);
	this.text = text === undefined ? '' : text;
}

LogicOptionList.inherits (LogicList);

function LogicOption (id, logics, text) {
	this.constructor (id, logics);
	this.text = text === undefined ? '' : text;
}

LogicOption.inherits (LogicList);

function LogicText (id, text) {
	this.constructor (id);
	this.text = text === undefined ? '' : text;
}

LogicText.inherits (Entity);

function LogicZoneChange (id, zoneID) {
	this.constructor (id);
	this.zoneID = zoneID === undefined ? '' : zoneID;
}

LogicZoneChange.inherits (Entity);

function LogicPushIgnore (id, ignoreNumber) {
	this.constructor (id);
	this.ignoreNumber = ignoreNumber === undefined ? 0 : ignoreNumber;
}

LogicPushIgnore.inherits (Entity);

function Zone (id, name, logicList) {
	this.constructor (id);
	this.name = name === undefined ? '' : name;
	this.logicList = logicList === undefined ? new LogicList () : logicList;

}

Zone.inherits (Entity);

//should add some kind of engine action queue and a general step function