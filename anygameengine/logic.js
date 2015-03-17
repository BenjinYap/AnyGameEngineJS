function Entity () {
	
}

function LogicTreeNode () {
	
}

LogicTreeNode.inherits (Entity);

function LogicPointer () {
	
}

LogicPointer.inherits (LogicTreeNode);

function LogicList () {
	
}

LogicList.inherits (LogicTreeNode);

function LogicOptionList () {
	
}

LogicOptionList.inherits (LogicList);

function LogicOption () {
	
}

LogicOption.inherits (LogicList);

function LogicText () {
	
}

LogicText.inherits (LogicTreeNode);

//all remaining logic is executed after changing zones
function LogicZoneChange () {
	
}

LogicZoneChange.inherits (LogicTreeNode);

//all logic past this point is dropped from the remaining logic when changing zones
function LogicIgnorePoint () {
	
}

LogicIgnorePoint.inherits (LogicTreeNode);

function Zone (id, name, logicList) {
	
}

Zone.inherits (Entity);