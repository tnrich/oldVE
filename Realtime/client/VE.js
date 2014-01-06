

var EVENTS = CONSTANTS.EVENTS;

VE = (function () {
	
	//var VE = function(socket) {
	var VE = function() {
		var me = this;
		
		//this.socket = socket;
		this.socket = io.connect('/sequences');
		
		this.sequence = undefined;
		this.cursor = 0;
		this.cursorStart = undefined;
		this.cursorEnd = undefined;
		this.isMouseDown = false;
		this.selectedFeature = null;
		
		this.revision = undefined;
		
		this.awaitingConfirm = undefined;
		this.operationCache = undefined;
		this.outstandingOperation = undefined;
		
		this.undoManager = new UndoManager();
		
		
	};
	
	VE.prototype.init = function() {
		var me = this;
		
		me.initView();
		me.addKeyListeners();
		me.initSocket();
	};
	
	VE.prototype.close = function() {
		this.mainDiv.remove();
		this.socket.disconnect();
	};
	
	
	VE.prototype.initSocket = function() {
		var me = this;
		var socket = me.socket;
		
		socket.on('connect', function() {
			console.log("VE Connected");
			
			socket.emit(EVENTS.GET_FULL_SEQUENCE, function(data) {
				var seq = data.sequence;
				me.revision = data.revision;
				me.sequence = Sequence.fromJson(seq);
				
				me.renderRail();
			});
			
			socket.on(EVENTS.SERVER_OPERATIONS, function(data) {
				var op = MachineOperation.fromJson(data.operation);
				me.applyServerOperation(op);
			});
			
			socket.on('disconnect', function() {
				console.log("VE Disconnected");
			});
			
		});
		
		// The following block of code was put in place as the VE
		// wouldn't trigger and/or receive a 'connect' event, which
		// would lead to no sequence being acquired. This fixes that
		// problem. I think the rest of the socket events don't require
		// anything like this, though.
		if(socket.socket.connected && this.sequence===undefined) {
			socket.emit(EVENTS.GET_FULL_SEQUENCE, function(data) {
				var seq = data.sequence;
				me.revision = data.revision;
				me.sequence = Sequence.fromJson(seq);
				
				me.renderRail();
			});
		}
	};
	
	
	VE.prototype.applyClientOperation = function(machineOperation) {
		var me = this;
		
		var inverse = machineOperation.inverse(me.sequence);
		me.undoManager.add(inverse);
		
		var seq2 = machineOperation.apply(me.sequence);
		me.sequence = seq2;
		me.renderRail();
		
		if(me.awaitingConfirm === true) {
			if(me.operationCache === undefined) {
				me.operationCache = machineOperation;
			} else {
				me.operationCache = MachineOperation.compose(me.operationCache, machineOperation);
			}
		} else {
			me.awaitingConfirm = true;
			me.outstandingOperation = machineOperation;
			me.sendOperation(machineOperation);
		}
	};
	
	VE.prototype.applyServerOperation = function(machineOperation) {
		var me = this;
		
		me.revision++;
		if(me.awaitingConfirm === true) {
			if(me.operationCache === undefined) {
				var pair = MachineOperation.transform(me.outstandingOperation, machineOperation);
				me.outstandingOperation = pair[0];
				var seq2 = pair[1].apply(me.sequence);
				me.sequence = seq2;
				me.transformCursor(pair[1]);
				me.undoManager.transform(pair[1]);
				me.renderRail();
			} else {
				var pair1 = MachineOperation.transform(me.outstandingOperation, machineOperation);
				var pair2 = MachineOperation.transform(me.operationCache, pair1[1]);
				me.outstandingOperation = pair1[0];
				me.operationCache = pair2[0];
				var seq2 = pair2[1].apply(me.sequence);
				me.sequence = seq2;
				me.transformCursor(pair2[1]);
				me.undoManager.transform(pair2[1]);
				me.renderRail();
			}
		} else {
			var seq2 = machineOperation.apply(me.sequence);
			me.sequence = seq2;
			me.transformCursor(machineOperation);
			me.undoManager.transform(machineOperation);
			me.renderRail();
		}
	};
	
	VE.prototype.sendOperation = function(op) {
		var me = this;
		
		var opJson = op.toJson();
		var message = {
			revision: me.revision,
			operation: opJson
		};
		me.socket.emit(EVENTS.POST_CLIENT_OPERATIONS, message, function(response) {
			// Add stuff here later.
			//var receivedOperation = response.operation;
			//console.log(receivedOperation);
			
			me.revision++;
			if(me.awaitingConfirm === true) {
				if(me.operationCache === undefined) {
					me.awaitingConfirm = false;
					me.outstandingOperation = undefined;
				} else {
					me.sendOperation(me.operationCache);
					me.outstandingOperation = me.operationCache;
					me.operationCache = undefined;
				}
			} else {
				console.error("There is no pending operation.");
			}
			
			
		});
		
	};
	
	
	// Is the undo stack not empty?
	VE.prototype.canUndo = function() {
		return this.undoManager.canUndo();
	};
	
	// Is the redo stack not empty?
	VE.prototype.canRedo = function () {
		return this.undoManager.canRedo();
	};
	
	VE.prototype.applyUnredo = function (operation) {
		// Maybe create method to transform cursor in cases
		// of undo/redo. (Like maybe select undone/redone stuff).
		this.transformCursor(operation);
		
		this.applyClientOperation(operation);
	};
	
	VE.prototype.undo = function() {
		var me = this;
		if(!me.canUndo()) { return; }
		me.undoManager.performUndo(function (o) { me.applyUnredo(o); });
	};
	
	VE.prototype.redo = function() {
		var me = this;
		if(!me.canRedo()) { return; }
		me.undoManager.performRedo(function (o) { me.applyUnredo(o); });
	};
	
	VE.prototype.undoHandler = function() {
		this.undo();
	};
	
	VE.prototype.redoHandler = function() {
		this.redo();
	};
	
	
	VE.prototype.canInsertFeature = function() {
		return this.cursorStart < this.cursorEnd;
	};
	
	VE.prototype.canDeleteFeature = function() {
		return this.selectedFeature !== null;
	};
	
	VE.prototype.insertFeatureHandler = function() {
		if(this.canInsertFeature()) {
			var feature = new Feature("", this.cursorStart, this.cursorEnd);
			var op = this.$insertFeature(feature);
			this.applyClientOperation(op);
		}
	};
	
	VE.prototype.deleteFeatureHandler = function() {
		if(this.canDeleteFeature()) {
			var op = this.$deleteFeature(this.selectedFeature);
			this.applyClientOperation(op);
		}
	};
	
	
	VE.prototype.$insertText = function(str) {
		var bpOp = new BpOperation();
		var fOp = new FeatureOperation();
		var me = this;
		if(me.cursorStart===me.cursorEnd) {
			bpOp.retain(this.cursor)
				.insert(str)
				.retain(this.sequence.getSequenceLength()-this.cursor);
			
			for(var i=0;i<this.sequence.getNumOfFeatures();i++) {
				var f = this.sequence.features[i];
				if(f.start>=this.cursor) {
					fOp.moveStart(str.length);
					fOp.moveEnd(str.length);
				} else if(f.end>this.cursor) {
					fOp.moveEnd(str.length);
				}
				fOp.retain(1);
			}
			
			me.cursor += str.length;
			me.cursorStart += str.length;
			me.cursorEnd += str.length;
		} else {
			bpOp.retain(this.cursorStart)
				['delete'](this.cursorEnd-this.cursorStart)
				.insert(str)
				.retain(this.sequence.getSequenceLength()-this.cursorEnd);
			
			var delLength = me.cursorEnd-me.cursorStart+str.length;
			for(var i=0;i<this.sequence.getNumOfFeatures();i++) {
				var f = this.sequence.features[i];
				if(f.start>=this.cursorEnd) {
					fOp.moveStart(-delLength);
					fOp.moveEnd(-delLength);
				} else if(f.start<=this.cursorStart && f.end>=this.cursorEnd) {
					fOp.moveEnd(-delLength);
				} else if(f.end<=this.cursorStart) {
					// do nothing
				} else {
					throw new Error("This is not defined yet.");
				}
				fOp.retain(1);
			}
			
			me.cursor = me.cursorStart+str.length;
			me.cursorStart = me.cursor;
			me.cursorEnd = me.cursor;
		}
		
		var mOp = new MachineOperation(bpOp, fOp);
		return mOp;
	};
	
	// Needs some more stuff with deleting features.
	VE.prototype.$deleteText = function() {
		var me = this;
		var bpOp = new BpOperation();
		var fOp = new FeatureOperation();
		if(me.cursorStart < me.cursorEnd) {
			var delLength = this.cursorEnd-this.cursorStart;
			bpOp.retain(this.cursorStart)
				['delete'](delLength)
				.retain(this.sequence.getSequenceLength()-this.cursorEnd);
			
			for(var i=0;i<this.sequence.getNumOfFeatures();i++) {
				var f = this.sequence.features[i];
				if(f.start>=this.cursorEnd) {
					fOp.moveStart(-delLength);
					fOp.moveEnd(-delLength);
				} else if(f.start>=this.cursorStart && f.end<=this.cursorEnd) {
					fOp['delete'](1);
					continue;
				} else if(f.start<=this.cursorStart && f.end>=this.cursorEnd) {
					fOp.moveEnd(-delLength);
				} else if(f.end<=this.cursorStart) {
					// do nothing
				} /*else if(me.cursorStart<f.end && me.cursorEnd<=f.start) {
					fOp.moveEnd(me.cursorStart-f.end);
				} else if(me.cursorEnd>f.start) {
					fOp.moveEnd(me.cursorStart-f.end-delLength);
					fOp.moveStart(me.cursorEnd-f.start);
				}*/ else {
					throw new Error("This is not defined yet.");
				}
				fOp.retain(1);
			}
			
		} else {
			bpOp.retain(this.sequence.getSequenceLength());
			fOp.retain(this.sequence.getNumOfFeatures());
		}
		me.cursor = me.cursorStart;
		me.cursorStart = me.cursor;
		me.cursorEnd = me.cursor;
		var mOp = new MachineOperation(bpOp, fOp);
		return mOp;
	};
	
	VE.prototype.$insertFeature = function(feature) {
		var bpOp = new BpOperation();
		var fOp = new FeatureOperation();
		
		bpOp.retain(this.sequence.getSequenceLength());
		
		fOp.retain(this.sequence.getNumOfFeatures());
		fOp.insert(feature);
		
		var mOp = new MachineOperation(bpOp, fOp);
		return mOp;
	};
	
	VE.prototype.$deleteFeature = function(feature) {
		var me = this;
		var index;
		if(typeof feature === 'number') {
			index = feature;
		} else if(typeof feature === 'object') {
			index = me.sequence.features.indexOf(feature);
			if(index === -1) { throw new Error("Feature not found."); }
		} else {
			throw new Error("Invalid type.");
		}
		
		var bpOp = new BpOperation();
		var fOp = new FeatureOperation();
		
		bpOp.retain(me.sequence.getSequenceLength());
		
		fOp.retain(index);
		fOp['delete'](1);
		fOp.retain(me.sequence.getNumOfFeatures()-index-1);
		
		var mOp = new MachineOperation(bpOp, fOp);
		return mOp;
	};
	
	
	VE.prototype.initView = function() {
		var me = this;
		
		var mainDiv = me.mainDiv = d3.select("body").append("div")
			//.style("overflow", "scroll") // not sure...
			.style("width", "900px")
			.style("height", "230px");
		
		
		
		me.toolBar = mainDiv.append("div")
			.style("background-color", "#f5f5f5")
			.style("width", "900px")
			.style("height", "25px");
		
		me.undoButton = me.toolBar.append("button")
			.attr("class", "VE_UndoButton")
			.attr("disabled", "")
			.text("Undo")
			.on("click", function() {
				me.undoHandler();
			});
		
		me.redoButton = me.toolBar.append("button")
			.attr("class", "VE_RedoButton")
			.attr("disabled", "")
			.text("Redo")
			.on("click", function() {
				me.redoHandler();
			});
		
		me.insertFeatureButton = me.toolBar.append("button")
			.attr("class", "VE_InsertFeatureButton")
			.attr("disabled", "")
			.text("Insert Feature")
			.on("click", function() {
				me.insertFeatureHandler();
			});
		
		me.deleteFeatureButton = me.toolBar.append("button")
			.attr("class", "VE_DeleteFeatureButton")
			.attr("disabled", "")
			.text("Delete Feature")
			.on("click", function() {
				me.deleteFeatureHandler();
			});
		
		
		var scrollDiv = mainDiv.append("div")
			.style("overflow", "scroll")
			.style({
				position: "relative", bottom: "0",
				width: "900px", height: "200px"
			});
		
		me.railCanvas = scrollDiv.append("svg")
			.attr("width", 900)
			.attr("height", 200)
			.property("VE", me)
			.on('click', function() {
				d3.select("body")
					.property("ActiveVE", me);
			});
	};
	
	var RAIL_CELL_WIDTH = 25;
	var RAIL_CELL_HEIGHT = 25;

	var RAIL_CELL_FILL = "rgb(255, 255, 255)";
	var RAIL_CELL_STROKE = "rgb(0, 0, 0)";

	var RAIL_CELL_FONT_SIZE = "20px";
	var RAIL_CELL_TEXT_COLOR = "rgb(30, 30, 30)";

	var RAIL_CELL_SELECTION_LAYER_FILL = "rgb(111, 209, 247)";
	var RAIL_CELL_SELECTION_LAYER_STROKE = "rgb(0, 22, 117)";

	VE.prototype.renderRail = function() {
		var me = this;
		var railCanvas = me.railCanvas;
		railCanvas.selectAll(".RailParent")
			.remove();
		var newWidth = 2*25+RAIL_CELL_WIDTH*me.sequence.getSequenceLength();
		railCanvas.attr("width", newWidth>900 ? newWidth : 900);
		me.renderSequenceRail1(railCanvas);
		me.renderRailFeatures();
		me.renderRailSelectionLayer(me);
		if(me.canUndo()) { me.undoButton.attr("disabled", null); }
		else { me.undoButton.attr("disabled", ""); }
		if(me.canRedo()) { me.redoButton.attr("disabled", null); }
		else { me.redoButton.attr("disabled", ""); }
	};

	VE.prototype.renderSequenceRail1 = function(railCanvas) {
		var me = this;
		if(railCanvas === undefined) {
			railCanvas = svg;
		}
		this.railCanvas = railCanvas
			.on("mousedown", function() {
				if(d3.event.button === 2) { return; }
				me.isMouseDown = true;
				me.selectedFeature = null;
				var x = d3.mouse(me.railContainer[0][0])[0];
				var rcIndex = Math.floor(x/RAIL_CELL_WIDTH+0.5);
				if(rcIndex < 0) {
					rcIndex = 0;
				}
				me.cursor = rcIndex;
				me.cursorStart = rcIndex;
			})
			.on("mouseup", function() {
				if(d3.event.button === 2) { return; }
				if(me.isMouseDown === true) {
					me.isMouseDown = false;
					var x = d3.mouse(me.railContainer[0][0])[0];
					var rcIndex = Math.floor(x/RAIL_CELL_WIDTH+0.5);
					if(me.cursor>rcIndex) {
						me.cursorStart = rcIndex;
						me.cursorEnd = me.cursor;
					} else {
						me.cursorStart = me.cursor;
						me.cursorEnd = rcIndex;
					}
					if(me.cursorStart < 0) {
						me.cursorStart = 0;
					}
					if(me.cursorEnd > me.sequence.getSequenceLength()) {
						me.cursorEnd = me.sequence.getSequenceLength();
					}
					me.renderRailSelectionLayer(me);
				}
			})
			.on("mousemove", function() {
				if(d3.event.button === 2) { return; }
				if(me.isMouseDown === true) {
					var x = d3.mouse(me.railContainer[0][0])[0];
					var rcIndex = Math.floor(x/RAIL_CELL_WIDTH+0.5);
					if(me.cursor>rcIndex) {
						me.cursorStart = rcIndex;
						me.cursorEnd = me.cursor;
					} else {
						me.cursorStart = me.cursor;
						me.cursorEnd = rcIndex;
					}
					if(me.cursorStart < 0) {
						me.cursorStart = 0;
					}
					if(me.cursorEnd > me.sequence.getSequenceLength()) {
						me.cursorEnd = me.sequence.getSequenceLength();
					}
					me.renderRailSelectionLayer(me);
				}
			});
		
		var railParent = this.railParent = railCanvas.append("g")
			.attr("class", "RailParent")
			.attr("transform", "translate(25,25)");
		
		var railContainer = this.railContainer = railParent.append("g")
			.attr("class", "RailContainer");
		
		var railCells = this.railCells = [];
		for(var i=0;i<this.sequence.getSequenceLength();i++) {
			var rc = {};
			rc.railCellRect = railContainer.append("rect")
				.attr("class", "RailCellRect")
				.attr("width", RAIL_CELL_WIDTH)
				.attr("height", RAIL_CELL_HEIGHT)
				.style({fill: RAIL_CELL_FILL, stroke: RAIL_CELL_STROKE, 'shape-rendering': "crispEdges"})
				.attr("transform", "translate("+i*RAIL_CELL_WIDTH+",0)");
			rc.railCellText = railContainer.append("text")
				.attr("class", "RailCellText")
				.text(this.sequence.sequence.charAt(i))
				.style({'font-family': "Lucida Console", 'font-size': RAIL_CELL_FONT_SIZE,
					'pointer-events': "none",
					'text-anchor': "middle", 'dominant-baseline': "central", fill: RAIL_CELL_TEXT_COLOR,
					'-webkit-touch-callout': "none",
					'-webkit-user-select': "none",
					'-khtml-user-select': "none",
					'-moz-user-select': "none",
					'-ms-user-select': "none",
					'user-select': "none"})
				.attr("transform", "translate("+(i+0.5)*RAIL_CELL_WIDTH+","+RAIL_CELL_HEIGHT*0.5+")");
			railCells[i] = rc;
		}
	};

	var RAIL_FEATURE_HEIGHT = 10;
	var RAIL_FEATURE_LAYER_HEIGHT = 16;
	var RAIL_FEATURE_VERT_PADDING = 3;
	var RAIL_FEATURE_POINT_LENGTH = 5;
	var RAIL_SEQUENCE_FEATURE_GAP = 4;

	var RAIL_FEATURE_FILL = "rgb(174, 197, 235)";
	var RAIL_FEATURE_STROKE = "black";

	VE.prototype.renderRailFeatures = function() {
		var me = this;
		var features = me.sequence.features;
		var a1 = MachineOperation.createSortedFeatureStartEndArray(features);
		var a2 = [];
		var i1 = 0, i2 = 0;
		var isOnFeature = false;
		var lvl = 0;
		while(a1.length>0) {
			var c1 = a1[i1];
			if(a2[lvl] === undefined) {
				a2[lvl] = [];
			}
			if(c1 === undefined) {
				i1 = 0;
				i2 = 0;
				lvl++;
				continue;
			}
			
			if(isOnFeature === false) {
				if(c1.type === "start") {
					isOnFeature = true;
					a2[lvl][i2] = c1.featureIndex;
					a1.splice(i1, 1);
				} else if(c1.type === "end") {
					i1++;
				} else {
					console.error("Invalid type.");
				}
			} else {
				if(c1.type === "start") {
					i1++;
				} else if(c1.type === "end") {
					isOnFeature = false;
					i2++;
					a1.splice(i1, 1);
				} else {
					console.error("Invalid type.");
				}
			}
		}
		
		me.railFeatureParent = me.railParent.append("g")
			.attr("class", "RailFeatureParent")
			.attr("transform", "translate(0, "+(RAIL_CELL_HEIGHT+RAIL_SEQUENCE_FEATURE_GAP)+")");
		for(var i=0;i<a2.length;i++) {
			var rfl = me.railFeatureParent.append("g")
				.attr("class", "RailFeatureLayer")
				.attr("transform", "translate(0, "+i*RAIL_FEATURE_LAYER_HEIGHT+")");
			for(var j=0;j<a2[i].length;j++) {
				var f = features[a2[i][j]];
				var start = f.start;
				var end = f.end;
				if(start >= end) { continue; }
				var railFeatureContainer = rfl.append("g")
					.attr("class", "RailFeatureContainer")
					.attr("transform", "translate("+start*RAIL_CELL_WIDTH+","+RAIL_FEATURE_VERT_PADDING+")");
				var h = RAIL_FEATURE_HEIGHT;
				var pl = RAIL_FEATURE_POINT_LENGTH;
				var cw = RAIL_CELL_WIDTH;
				var d = "M0 0 v0 "+h+" h"+(cw*(end-start)-pl)+" 0 l"+pl+" -"+h/2+
						" l-"+pl+" -"+h/2+" z";
				var railFeature = railFeatureContainer.append("path")
					.attr("class", "RailFeature")
					.attr("d", d)
					.style({fill: RAIL_FEATURE_FILL, stroke: RAIL_FEATURE_STROKE, 'shape-rendering': "crispEdges"})
					.property("feature", f)
					.on("click", function() {
						var f = d3.select(this).property("feature");
						me.cursor = undefined;
						me.cursorStart = f.start;
						me.cursorEnd = f.end;
						me.selectedFeature = f;
						me.renderRailSelectionLayer(me);
					});
				
			}
		}
		
		
	};

	var RAIL_CARET_HEIGHT = 35;
	var RAIL_CARET_OVERFLOW = 5;
	var RAIL_CARET_STROKE_WIDTH = 2;
	var RAIL_CARET_STROKE = "black";

	VE.prototype.renderRailSelectionLayer = function(me) {
		if(me === undefined) { me = this; }
//		if(me.cursor !== undefined) { return; }
		if(me.canInsertFeature()) { me.insertFeatureButton.attr("disabled", null); }
		else { me.insertFeatureButton.attr("disabled", ""); }
		if(me.canDeleteFeature()) { me.deleteFeatureButton.attr("disabled", null); }
		else { me.deleteFeatureButton.attr("disabled", ""); }
		for(var i=0;i<me.railCells.length;i++) {
			var rc = me.railCells[i];
			rc.railCellRect.style({fill: RAIL_CELL_FILL,
				stroke: RAIL_CELL_STROKE});
		}
		if(me.cursorStart===me.cursorEnd) {
			var cursorIndex = me.cursor;
			me.railParent.selectAll(".RailCaret")
				.remove();
			me.railParent.append("line")
				.attr("class", "RailCaret")
				.attr("x1", cursorIndex*RAIL_CELL_WIDTH)
				.attr("y1", -RAIL_CARET_OVERFLOW)
				.attr("x2", cursorIndex*RAIL_CELL_WIDTH)
				.attr("y2", RAIL_CARET_HEIGHT-RAIL_CARET_OVERFLOW)
				.style({stroke: RAIL_CARET_STROKE,
					'stroke-width': RAIL_CARET_STROKE_WIDTH,
					'shape-rendering': "crispEdges"});
		} else {
			me.railParent.selectAll(".RailCaret")
				.remove();
			for(var i=me.cursorStart;i<me.cursorEnd;i++) {
				var rc = me.railCells[i];
				rc.railCellRect.style({fill: RAIL_CELL_SELECTION_LAYER_FILL,
					stroke: RAIL_CELL_SELECTION_LAYER_STROKE});
			}
		}
		
	};
	
	var DELETE_KEY = 46;
	var BACKSPACE_KEY = 8;

	VE.prototype.addKeyListeners = function () {
		d3.select("body")
			.on("keydown", function() {
				var me = d3.select("body")
					.property("ActiveVE");
				d3.event.preventDefault();
				var keyCode = d3.event.keyCode;
				if(keyCode>=65 && keyCode<=90) {
					var key = String.fromCharCode(d3.event.keyCode);
					key = key.toUpperCase();
					if(d3.event.ctrlKey === true) {
						if(key === 'I') {
							if(me.cursorStart<me.cursorEnd) {
								var feature = new Feature("", me.cursorStart, me.cursorEnd);
								var op = me.$insertFeature(feature);
								me.applyClientOperation(op);
							}
						} else if(key === 'D') {
							if(me.selectedFeature !== null) {
								var op = me.$deleteFeature(me.selectedFeature);
								me.applyClientOperation(op);
							}
						} else if(key === 'Z') {
							me.undoHandler();
						} else if(key === 'Y') {
							me.redoHandler();
						}
					} else {
						var op = me.$insertText(key);
						me.applyClientOperation(op);
					}
				} else if(keyCode === DELETE_KEY) {
					var op;
					if(me.cursorStart===me.cursorEnd) {
						if(me.cursorEnd<me.sequence.getSequenceLength()) {
							me.cursorEnd += 1;
							op = me.$deleteText();
						}
					} else {
						op = me.$deleteText();
					}
					if(op !== undefined) {
						me.applyClientOperation(op);
					}
				} else if(keyCode === BACKSPACE_KEY) {
					var op;
					if(me.cursorStart===me.cursorEnd) {
						if(me.cursorStart>0) {
							me.cursorStart -= 1;
							op = me.$deleteText();
						}
					} else {
						op = me.$deleteText();
					}
					if(op !== undefined) {
						me.applyClientOperation(op);
					}
				}
			});
	};
	
	
	VE.prototype.transformCursor = function(op) {
		var me = this;
		var bpOp = op.bpOperation;
		var comps = bpOp.components;
		
		var xformIndex = function(index) {
			var pos = 0;
			var posShift = 0;
			for(var i=0;i<comps.length;i++) {
				var c = comps[i];
				if(c.retain !== undefined) {
					if(index>=pos && index<=pos+c.retain) {
						break;
					} else {
						pos += c.retain;
					}
				} else if(c.insert !== undefined) {
					posShift += c.insert.length;
				} else if(c['delete'] !== undefined) {
					if(index>=pos && index<=pos+c['delete']) {
						break;
					} else {
						posShift -= c['delete'];
					}
				}
			}
			
			return index + posShift;
		};
		
		if(me.cursorStart === me.cursorEnd) {
			var cursor = me.cursorStart;
			cursor = xformIndex(cursor);
			me.cursor = cursor;
			me.cursorStart = cursor;
			me.cursorEnd = cursor;
		} else {
			me.cursorStart = xformIndex(me.cursorStart);
			me.cursorEnd = xformIndex(me.cursorEnd);
			me.cursor = me.cursorStart;
		}
	};
	
	
	
	return VE;
})();





























































