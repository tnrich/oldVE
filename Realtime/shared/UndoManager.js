

UndoManager = (function () {
	'use strict';
	
	var NORMAL_STATE = 'normal';
	var UNDOING_STATE = 'undoing';
	var REDOING_STATE = 'redoing';
	
	var UndoManager = function(maxItems) {
		var me = this;
		
		this.maxItems = maxItems; // Can be left undefined for infinite max number
		this.state = NORMAL_STATE;
		this.undoStack = [];
		this.redoStack = [];
	};
	
	UndoManager.NORMAL_STATE = NORMAL_STATE;
	UndoManager.UNDOING_STATE = UNDOING_STATE;
	UndoManager.REDOING_STATE = REDOING_STATE;
	
	// Op should be inverse of last client edit.
	UndoManager.prototype.add = function(op) {
		var me = this;
		if(me.state === UndoManager.NORMAL_STATE) {
			me.undoStack.push(op);
			if(me.undoStack.length > me.maxItems) { me.undoStack.shift(); }
			me.redoStack = [];
		} else if(me.state === UndoManager.UNDOING_STATE) {
			me.redoStack.push(op);
		} else if(me.state === UndoManager.REDOING_STATE) {
			me.undoStack.push(op);
		} else {
			console.error("Invalid state.");
		}
	};
	
	var transformStack = function(stack, operation) {
		var newStack = [];
		for(var i=stack.length-1;i>=0;i--) {
			//var pair = MachineOperation.transform(stack[i], operation);
			var pair = operation.constructor.transform(stack[i], operation);
			if(typeof pair[0].isNoop !== 'function' || !pair[0].isNoop()) {
				newStack.push(pair[0]);
			}
			operation = pair[1];
		}
		return newStack.reverse();
	};
	
	UndoManager.prototype.transform = function(operation) {
		this.undoStack = transformStack(this.undoStack, operation);
		this.redoStack = transformStack(this.redoStack, operation);
	};
	
	// Perform an undo by calling a function with the latest operation on the undo
	// stack. The function is expected to call the `add` method with the inverse
	// of the operation, which pushes the inverse on the redo stack.
	UndoManager.prototype.performUndo = function (fn) {
		this.state = UndoManager.UNDOING_STATE;
		if(!this.canUndo()) { throw new Error("Undo not possible."); }
		fn(this.undoStack.pop());
		this.state = UndoManager.NORMAL_STATE;
	};
	
	// The inverse of `performUndo`.
	UndoManager.prototype.performRedo = function (fn) {
		this.state = UndoManager.REDOING_STATE;
		if(!this.canRedo()) { throw new Error("Redo not possible."); }
		fn(this.redoStack.pop());
		this.state = UndoManager.NORMAL_STATE;
	};
	
	// Is the undo stack not empty?
	UndoManager.prototype.canUndo = function() {
		return this.undoStack.length !== 0;
	};
	
	// Is the redo stack not empty?
	UndoManager.prototype.canRedo = function () {
		return this.redoStack.length !== 0;
	};
	
	return UndoManager;
})();


if(typeof module === 'object') {
	module.exports = {
		UndoManager: UndoManager
	};
}





































