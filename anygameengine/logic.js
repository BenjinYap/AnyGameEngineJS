function Entity () {
	
}

function LogicTreeNode () {
	this.derivedClass = 'LogicTreeNode';

	this.clone = function (parent) {
		var clone = new window [this.derivedClass];

		for (var prop in this) {
			if (prop === 'clone' || prop === 'prev' || prop === 'next' || prop === 'nodes') {
				continue;
			}

			clone [prop] = this [prop];

			if (this [prop] instanceof Array) {
				clone [prop] = [];

				for (var i = 0; i < this [prop].length; i++) {
					clone [prop].push (this [prop][i]);
				}
			}
		}

		clone.parent = parent;
		clone.prev = null;
		clone.next = null;
		clone.nodes = [];

		for (var i = 0; i < this.nodes.length; i++) {
			clone.nodes.push (this.nodes [i].clone (clone));

			if (i > 0) {
				clone.nodes [i].prev = clone.nodes [i - 1];
				clone.nodes [i - 1].next = clone.nodes [i];
			}
		}

		return clone;
	};

	/*this.setSaveNextLogic = function (save) {
		if (this.next === null) {
			save.currentLogic = this.getParentNextSibling ();
		} else {
			save.currentLogic = save.currentLogic.next;
		}
	}*/

	this.getNextLogic = function () {
		if (this.next === null) {
			if (this.parent instanceof LogicLoop) {
				return this.parent;
			} else if (this.parent instanceof LogicOption) {
				return this.parent.parent.next;
			} else {
				return this.parent === null ? null : this.parent.next;
			}
		} else {
			return this.next;
		}
	}

	/*this.getParentNextSibling = function () {
		var parent = this.parent;

		if (parent instanceof LogicOption) {
			parent = parent.parent;
		}

		return parent === null ? null : parent.next;
	}*/
}

LogicTreeNode.inherits (Entity);

//----------------------------------
//FLOW & STRUCTURE
//----------------------------------
function LogicPointer () {
	this.derivedClass = 'LogicPointer';
}

LogicPointer.inherits (LogicTreeNode);

function LogicList () {
	this.derivedClass = 'LogicList';
}

LogicList.inherits (LogicTreeNode);

function LogicOptionList () {
	this.derivedClass = 'LogicOptionList';
}

LogicOptionList.inherits (LogicList);

function LogicOption () {
	this.derivedClass = 'LogicOption';
}

LogicOption.inherits (LogicList);

//all logic past this point is dropped from the remaining logic when changing zones
function LogicIgnorePoint () {
	this.derivedClass = 'LogicIgnorePoint';
}

LogicIgnorePoint.inherits (LogicTreeNode);

function LogicBackUpOptionList () {
	this.derivedClass = 'LogicBackUpOptionList';
}

LogicBackUpOptionList.inherits (LogicTreeNode);

function LogicLoop () {
	this.derivedClass = 'LogicLoop';
}

LogicLoop.inherits (LogicList);

function LogicLoopContinue () {
	this.derivedClass = 'LogicLoopContinue';
}

LogicLoopContinue.inherits (LogicTreeNode);

function LogicLoopBreak () {
	this.derivedClass = 'LogicLoopBreak';
}

LogicLoopBreak.inherits (LogicTreeNode);
//----------------------------------
//ACTIONS
//----------------------------------
function LogicText () {
	this.derivedClass = 'LogicText';
}

LogicText.inherits (LogicTreeNode);

//all remaining logic is executed after changing zones
function LogicZoneChange () {
	this.derivedClass = 'LogicZoneChange';
}

LogicZoneChange.inherits (LogicTreeNode);

function Zone (id, name, logicList) {
	this.derivedClass = 'Zone';
}

Zone.inherits (Entity);