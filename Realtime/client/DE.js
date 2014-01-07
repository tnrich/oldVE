

var EVENTS = CONSTANTS.EVENTS;

DE = (function () {
	
	var DE = function() {
		
		this.socket = io.connect('/devices');
		
		this.device = undefined;
		
		this.selectedBin = undefined;
		this.selectedBinIndex = undefined;
		
		this.selectedCell = undefined;
		this.selectedCellIndex = undefined;
		
		this.selectedPart = undefined;
		
		this.revision = undefined;
		
		this.awaitingConfirm = undefined;
		this.operationCache = undefined;
		this.outstandingOperation = undefined;
		
		this.undoManager = new UndoManager();
	};
	
	DE.prototype.init = function() {
		this.initView();
//		this.addKeyListeners();
		this.initSocket();
	};
	
	DE.prototype.close = function() {
		this.mainDiv.remove();
		this.socket.disconnect();
	};
	
	DE.prototype.initSocket = function() {
		var me = this;
		var socket = me.socket;
		
		socket.on('connect', function() {
			console.log("DE Connected");
			
			socket.emit(EVENTS.GET_FULL_DEVICE, function(data) {
				var device = data.device;
				me.revision = data.revision;
				me.device = Device.fromJson(device);
				me.renderGrid();
			});
			
			socket.on(EVENTS.SERVER_OPERATIONS, function(data) {
				var op = DeOperation.fromJson(data.operation);
				me.applyServerOperation(op);
			});
			
			socket.on('disconnect', function() {
				console.log("DE Disconnected");
			});
			
		});
		
		// The following block of code was put in place as the DE
		// wouldn't trigger and/or receive a 'connect' event, which
		// would lead to no device being acquired. This fixes that
		// problem. I think the rest of the socket events don't require
		// anything like this, though.
		if(socket.socket.connected && this.device===undefined) {
			socket.emit(EVENTS.GET_FULL_DEVICE, function(data) {
				var device = data.device;
				me.revision = data.revision;
				me.device = Device.fromJson(device);
				me.renderGrid();
			});
		}
	};
	
	
	DE.prototype.applyClientOperation = function(deOp) {
		var inverse = deOp.inverse(this.device);
		this.undoManager.add(inverse);
		
		var newDevice = deOp.apply(this.device);
		this.device = newDevice;
		this.renderGrid();
		
		if(this.awaitingConfirm === true) {
			if(this.operationCache === undefined) {
				this.operationCache = deOp;
			} else {
				this.operationCache = DeOperation.compose(this.operationCache, deOp);
			}
		} else {
			this.awaitingConfirm = true;
			this.outstandingOperation = deOp;
			this.sendOperation(deOp);
		}
	};
	
	DE.prototype.applyServerOperation = function(deOp) {
		this.revision++;
		if(this.awaitingConfirm === true) {
			if(this.operationCache === undefined) {
				var pair = DeOperation.transform(this.outstandingOperation, deOp);
				this.outstandingOperation = pair[0];
				var newDevice = pair[1].apply(this.device);
				this.device = newDevice;
//				this.transformSelectionIndex(pair[1]);
				this.undoManager.transform(pair[1]);
				this.renderGrid();
			} else {
				var pair1 = DeOperation.transform(this.outstandingOperation, deOp);
				var pair2 = DeOperation.transform(this.operationCache, pair1[1]);
				this.outstandingOperation = pair1[0];
				this.operationCache = pair2[0];
				var newDevice = pair2[1].apply(this.device);
				this.device = newDevice;
//				this.transformSelectionIndex(pair2[1]);
				this.undoManager.transform(pair2[1]);
				this.renderGrid();
			}
		} else {
			var newDevice = deOp.apply(this.device);
			this.device = newDevice;
//			this.transformSelectionIndex(deOp);
			this.undoManager.transform(deOp);
			this.renderGrid();
		}
	};
	
	DE.prototype.sendOperation = function(op) {
		var me = this;
		var opJson = op.toJson();
		var message = {
			revision: me.revision,
			operation: opJson
		};
		me.socket.emit(EVENTS.POST_CLIENT_OPERATIONS, message, function(response) {
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
	
	
	DE.prototype.getSelectedXIndex = function() {
		if(this.selectedBinIndex !== undefined) {
			return this.selectedBinIndex;
		} else if(this.selectedCellIndex !== undefined) {
			return this.selectedCellIndex[0];
		}
		return undefined;
	};
	
	DE.prototype.getSelectedYIndex = function() {
		if(this.selectedCellIndex !== undefined) {
			return this.selectedCellIndex[1];
		}
		return undefined;
	};
	
	
	// Is the undo stack not empty?
	DE.prototype.canUndo = function() {
		return this.undoManager.canUndo();
	};
	
	// Is the redo stack not empty?
	DE.prototype.canRedo = function () {
		return this.undoManager.canRedo();
	};
	
	DE.prototype.canInsertBinLeft = function() {
		var x = this.getSelectedXIndex();
		if(x === undefined) { return false; }
		return true;
	};
	
	DE.prototype.canInsertBinRight = function() {
		var x = this.getSelectedXIndex();
		if(x === undefined) { return false; }
		return true;
	};
	
	DE.prototype.canDeleteBin = function() {
		if(this.selectedBinIndex === undefined) { return false; }
		return true;
	};
	
	DE.prototype.canInsertRowAbove = function() {
		var y = this.getSelectedYIndex();
		if(y === undefined) { return false; }
		return true;
	};
	
	DE.prototype.canInsertRowBelow = function() {
		var y = this.getSelectedYIndex();
		if(y === undefined) { return false; }
		return true;
	};
	
	DE.prototype.canDeleteRow = function() {
		var y = this.getSelectedYIndex();
		if(y === undefined) { return false; }
		return true;
	};
	
	DE.prototype.canClearCell = function() {
		if(this.selectedCell === undefined) { return false; }
		return true;
	};
	
	
	DE.prototype.applyUnredo = function (operation) {
		// Maybe create method to transform cursor in cases
		// of undo/redo. (Like maybe select undone/redone stuff).
//		this.transformCursor(operation);
		
		this.applyClientOperation(operation);
	};
	
	DE.prototype.undo = function() {
		var me = this;
		if(!me.canUndo()) { return; }
		me.undoManager.performUndo(function (o) { me.applyUnredo(o); });
	};
	
	DE.prototype.redo = function() {
		var me = this;
		if(!me.canRedo()) { return; }
		me.undoManager.performRedo(function (o) { me.applyUnredo(o); });
	};
	
	DE.prototype.undoHandler = function() {
		this.undo();
	};
	
	DE.prototype.redoHandler = function() {
		this.redo();
	};
	
	
	DE.prototype.insertBinLeftHandler = function() {
		if(this.canInsertBinLeft()) {
			var bin = this.generateDefaultNewBin();
			var op = this.$insertBin(bin, this.getSelectedXIndex());
			this.applyClientOperation(op);
			this.selectBin(this.getSelectedXIndex());
		}
	};
	
	DE.prototype.insertBinRightHandler = function() {
		if(this.canInsertBinRight()) {
			var bin = this.generateDefaultNewBin();
			var op = this.$insertBin(bin, this.getSelectedXIndex()+1);
			this.applyClientOperation(op);
			this.selectBin(this.getSelectedXIndex()+1);
		}
	};
	
	DE.prototype.deleteBinHandler = function() {
		if(this.canDeleteBin()) {
			var op = this.$deleteBin();
			this.applyClientOperation(op);
		}
	};
	
	
	DE.prototype.insertRowAboveHandler = function() {
		if(this.canInsertRowAbove()) {
			var op = this.$insertRow(this.getSelectedYIndex());
			this.applyClientOperation(op);
			this.selectCell(this.getSelectedXIndex(), this.getSelectedYIndex()+1);
		}
	};
	
	DE.prototype.insertRowBelowHandler = function() {
		if(this.canInsertRowBelow()) {
			var op = this.$insertRow(this.getSelectedYIndex()+1);
			this.applyClientOperation(op);
		}
	};
	
	DE.prototype.deleteRowHandler = function() {
		if(this.canDeleteRow()) {
			var op = this.$deleteRow();
			this.applyClientOperation(op);
		}
	};
	
	
	DE.prototype.clearCellHandler = function() {
		if(this.canClearCell()) {
			var op = this.$clearCell();
			this.applyClientOperation(op);
		}
	};
	
	
	
	DE.prototype.$insertBin = function(bin, index) {
		var gOp = new GridOperation();
		gOp.retain(index)
			.insert(bin)
			.retain(this.device.getNumOfBins()-index);
		
		var deOp = new DeOperation(gOp);
		return deOp;
	};
	
	DE.prototype.$deleteBin = function() {
		var index = this.selectedBinIndex;
		var gOp = new GridOperation();
		gOp.retain(index)
			['delete'](1)
			.retain(this.device.getNumOfBins()-index-1);
		
		var deOp = new DeOperation(gOp);
		return deOp;
	};
	
	DE.prototype.$insertRow = function(index, row) {
		if(row !== undefined) { throw new Error("Not yet defined."); }
		
		var numOfRows = this.device.getNumOfRows();
		var gOp = new GridOperation();
		for(var i=0;i<this.device.getNumOfBins();i++) {
			var bbOp = new BinBodyOperation();
			bbOp.retain(index)
				.insert(new Cell())
				.retain(numOfRows-index);
			
			var binOp = new BinOperation(undefined, bbOp);
			gOp.modify(binOp);
			gOp.retain(1);
		}
		
		var deOp = new DeOperation(gOp);
		return deOp;
	};
	
	DE.prototype.$deleteRow = function() {
		var index = this.getSelectedYIndex();
		var numOfRows = this.device.getNumOfRows();
		var gOp = new GridOperation();
		for(var i=0;i<this.device.getNumOfBins();i++) {
			var bbOp = new BinBodyOperation();
			bbOp.retain(index)
				['delete'](1)
				.retain(numOfRows-index-1);
			
			var binOp = new BinOperation(undefined, bbOp);
			gOp.modify(binOp);
			gOp.retain(1);
		}
		
		var deOp = new DeOperation(gOp);
		return deOp;
	};
	
	DE.prototype.$clearCell = function() {
		var x = this.getSelectedXIndex();
		var y = this.getSelectedYIndex();
		
		var cellOp = new CellOperation();
		//cellOp.phantomize();
		cellOp.changePhantom(true);
		
		var bbOp = new BinBodyOperation();
		bbOp.retain(y)
			.modify(cellOp)
			.retain(this.device.getNumOfRows()-y);
		
		var binOp = new BinOperation(undefined, bbOp);
		
		var gOp = new GridOperation();
		gOp.retain(x)
			.modify(binOp)
			.retain(this.device.getNumOfBins()-x);
		
		var deOp = new DeOperation(gOp);
		return deOp;
	};
	
	
	DE.prototype.toggleButtons = function() {
		var me = this;
		
		if(me.canUndo()) { me.undoButton.attr("disabled", null); }
		else { me.undoButton.attr("disabled", ""); }
		
		if(me.canRedo()) { me.redoButton.attr("disabled", null); }
		else { me.redoButton.attr("disabled", ""); }
		
		if(me.canInsertBinLeft()) { me.insertBinLeftButton.attr("disabled", null); }
		else { me.insertBinLeftButton.attr("disabled", ""); }
		
		if(me.canInsertBinRight()) { me.insertBinRightButton.attr("disabled", null); }
		else { me.insertBinRightButton.attr("disabled", ""); }
		
		if(me.canDeleteBin()) { me.deleteBinButton.attr("disabled", null); }
		else { me.deleteBinButton.attr("disabled", ""); }

		if(me.canInsertRowAbove()) { me.insertRowAboveButton.attr("disabled", null); }
		else { me.insertRowAboveButton.attr("disabled", ""); }

		if(me.canInsertRowBelow()) { me.insertRowBelowButton.attr("disabled", null); }
		else { me.insertRowBelowButton.attr("disabled", ""); }

		if(me.canDeleteRow()) { me.deleteRowButton.attr("disabled", null); }
		else { me.deleteRowButton.attr("disabled", ""); }

		if(me.canClearCell()) { me.clearCellButton.attr("disabled", null); }
		else { me.clearCellButton.attr("disabled", ""); }
	};
	
	
	DE.prototype.initView = function() {
		var me = this;
		
		me.mainDiv = d3.select("body").append("div")
			.style("width", "900px")
			.style("height", "500px");
		
		
		me.toolBar = me.mainDiv.append("div")
			.style({
				'background-color': "#f5f5f5",
				float: "left",
				width: "125px",
				height: "500px"
			});
		
		
		me.undoButton = me.toolBar.append("button")
			.attr("class", "DE_UndoButton")
			.attr("disabled", "")
			.text("Undo")
			.on("click", function() {
				me.undoHandler();
			});
		
		me.redoButton = me.toolBar.append("button")
			.attr("class", "DE_RedoButton")
			.attr("disabled", "")
			.text("Redo")
			.on("click", function() {
				me.redoHandler();
			});
		
		
		me.toolBar.append("div").style("height", "5px");
		
		
		me.insertBinLeftButton = me.toolBar.append("button")
			.attr("class", "DE_"+"InsertBinLeftButton")
			.attr("disabled", "")
			.text("Insert Bin Left")
			.on("click", function() {
				me.insertBinLeftHandler();
			});
		
		me.insertBinRightButton = me.toolBar.append("button")
			.attr("class", "DE_"+"InsertBinRightButton")
			.attr("disabled", "")
			.text("Insert Bin Right")
			.on("click", function() {
				me.insertBinRightHandler();
			});
		
		me.deleteBinButton = me.toolBar.append("button")
			.attr("class", "DE_"+"DeleteBinButton")
			.attr("disabled", "")
			.text("Delete Bin")
			.on("click", function() {
				me.deleteBinHandler();
			});
		
		
		me.toolBar.append("div").style("height", "5px");
		
		
		me.insertRowAboveButton = me.toolBar.append("button")
			.attr("class", "DE_"+"InsertRowAboveButton")
			.attr("disabled", "")
			.text("Insert Row Above")
			.on("click", function() {
				me.insertRowAboveHandler();
			});
		
		me.insertRowBelowButton = me.toolBar.append("button")
			.attr("class", "DE_"+"InsertRowBelowButton")
			.attr("disabled", "")
			.text("Insert Row Below")
			.on("click", function() {
				me.insertRowBelowHandler();
			});
		
		me.deleteRowButton = me.toolBar.append("button")
			.attr("class", "DE_"+"DeleteRowButton")
			.attr("disabled", "")
			.text("Delete Row")
			.on("click", function() {
				me.deleteRowHandler();
			});
		

		me.toolBar.append("div").style("height", "5px");
		
		
		me.clearCellButton = me.toolBar.append("button")
			.attr("class", "DE_"+"ClearCellButton")
			.attr("disabled", "")
			.text("Clear Cell")
			.on("click", function() {
				me.clearCellHandler();
			});
		
		
		me.scrollDiv = me.mainDiv.append("div")
			.style("overflow", "scroll")
			.style({
				float: "left",
				width: "775px", height: "500px"
			});
		
		me.gridCanvas = me.scrollDiv.append("svg")
			.attr("width", 775)
			.attr("height", 500)
			.property("DE", me);
		
	};
	
	
	var CELL_WIDTH = 125;
	var HEADER_CELL_HEIGHT = 100;
	var BODY_CELL_HEIGHT = 40;
	var HEADER_BODY_GAP = 25;
	
	var CELL_FILL = "#fbfbfb";
	var CELL_STROKE = "#919191";
	var SELECTED_CELL_FILL = "#e2e2e2";
	var SELECTED_CELL_STROKE = "#090909";
	
	var HEADER_TEXT_FONT_SIZE = "15px";
	var HEADER_TEXT_COLOR = "black";
	
	var HEADER_ICON_SIZE = "50px";
	var HEADER_ICON_COLOR = "black";
	
	var BODY_CELL_TEXT_FONT_SIZE = "15px";
	var BODY_CELL_TEXT_COLOR = "black";
	
	DE.prototype.renderGrid = function() {
		var me = this;
		
		this.gridCanvas.selectAll(".GridParent").remove();
		var newWidth = 2*25+CELL_WIDTH*this.device.bins.length;
//		this.gridCanvas.attr("width", newWidth>900 ? newWidth : 900);
		this.gridCanvas.attr("width", newWidth>775 ? newWidth : 775);
		
		this.gridParent = this.gridCanvas.append("g")
			.attr("class", "GridParent")
			.attr("transform", "translate(25,25)");
		
		this.gridHeaderContainer = this.gridParent.append("g")
			.attr("class", "GridHeaderContainer");
		
		this.gridBodyContainer = this.gridParent.append("g")
			.attr("class", "GridBodyContainer")
			.attr("transform", "translate(0,"+(HEADER_CELL_HEIGHT+HEADER_BODY_GAP)+")");
		
		for(var i=0;i<this.device.bins.length;i++) {
			var bin = this.device.bins[i];
			
			var headerCellContainer = this.gridHeaderContainer.append("g")
				.attr("class", "HeaderCellContainer")
				.attr("transform", "translate("+(i*CELL_WIDTH)+",0)");
			
			var headerCellRect = headerCellContainer.append("rect")
				.attr("class", "HeaderCellRect")
				.attr("width", CELL_WIDTH-1)
				.attr("height", HEADER_CELL_HEIGHT)
				.style({fill: CELL_FILL, stroke: CELL_STROKE, 'shape-rendering': "crispEdges"})
				.on("click", function() {
					if(d3.event.button === 2) { return; }
					var x = d3.mouse(me.gridHeaderContainer[0][0])[0];
					var binIndex = Math.floor(x/CELL_WIDTH);
					me.selectBin(binIndex);
				});
			
			var headerCellText = headerCellContainer.append("text")
				.attr("class", "HeaderCellText")
				.text(bin.name)
				.style({'font-family': "Lucida Console", 'font-size': HEADER_TEXT_FONT_SIZE,
					'pointer-events': "none",
					'text-anchor': "middle", 'dominant-baseline': "auto", fill: HEADER_TEXT_COLOR,
					'-webkit-touch-callout': "none",
					'-webkit-user-select': "none",
					'-khtml-user-select': "none",
					'-moz-user-select': "none",
					'-ms-user-select': "none",
					'user-select': "none"})
				.attr("transform", "translate("+(0.5*CELL_WIDTH)+","+(HEADER_CELL_HEIGHT-10)+")");
			
			var headerCellIcon = headerCellContainer.append("text")
				.attr("class", "HeaderCellIcon")
				.text(bin.icon)
				.style({'font-family': "wingdings", 'font-size': HEADER_ICON_SIZE,
					'pointer-events': "none",
					'text-anchor': "middle", 'dominant-baseline': "central", fill: HEADER_ICON_COLOR,
					'-webkit-touch-callout': "none",
					'-webkit-user-select': "none",
					'-khtml-user-select': "none",
					'-moz-user-select': "none",
					'-ms-user-select': "none",
					'user-select': "none"})
			.attr("transform", "translate("+(0.5*CELL_WIDTH)+","+(15+25)+")");
			
			
			var cells = bin.cells;
			
			var bodyCellParent = this.gridBodyContainer.append("g")
				.attr("class", "BodyCellParent")
				.attr("transform", "translate("+(i*CELL_WIDTH)+",0)");
			
			for(var j=0;j<cells.length;j++) {
				var cell = cells[j];
				
				var bodyCellContainer = bodyCellParent.append("g")
					.attr("class", "BodyCellContainer")
					.attr("transform", "translate(0,"+(j*BODY_CELL_HEIGHT)+")");
				
				var bodyCellRect = bodyCellContainer.append("rect")
					.attr("class", "BodyCellRect")
					.attr("width", CELL_WIDTH-1)
					.attr("height", BODY_CELL_HEIGHT-1)
					.style({fill: CELL_FILL, stroke: CELL_STROKE, 'shape-rendering': "crispEdges"})
					.on("click", function() {
						if(d3.event.button === 2) { return; }
						var xy = d3.mouse(me.gridBodyContainer[0][0]);
						var xIndex = Math.floor(xy[0]/CELL_WIDTH);
						var yIndex = Math.floor(xy[1]/BODY_CELL_HEIGHT);
						me.selectCell(xIndex, yIndex);
					});
				
				if(cell.phantom !== true) {
					var part = cell.getPart();
					
					var bodyCellText = bodyCellContainer.append("text")
						.attr("class", "BodyCellText")
						.text(part.name)
						.style({'font-family': "Lucida Console", 'font-size': BODY_CELL_TEXT_FONT_SIZE,
							'pointer-events': "none",
							'text-anchor': "middle", 'dominant-baseline': "central", fill: BODY_CELL_TEXT_COLOR,
							'-webkit-touch-callout': "none",
							'-webkit-user-select': "none",
							'-khtml-user-select': "none",
							'-moz-user-select': "none",
							'-ms-user-select': "none",
							'user-select': "none"})
						.attr("transform", "translate("+(0.5*CELL_WIDTH)+","+(0.5*BODY_CELL_HEIGHT)+")");
					
				}
				
			}
			
			
			
			
		}
		
		this.renderSelectionLayer();
		this.toggleButtons();
	};
	
	DE.prototype.removeSelectionLayer = function() {
		this.gridParent.selectAll(".HeaderCellRect")
			.style({fill: CELL_FILL, stroke: CELL_STROKE});
		
		this.gridParent.selectAll(".HeaderCellText")
			.style({'font-weight': 'normal'});
		
		this.gridParent.selectAll(".BodyCellRect")
			.style({fill: CELL_FILL, stroke: CELL_STROKE});
		
		this.gridParent.selectAll(".BodyCellText")
			.style({'font-weight': 'normal'});
	};
	
	DE.prototype.renderSelectionLayer = function() {
		if(this.selectedBin !== undefined) {
			var binIndex = this.selectedBinIndex;
			var selectedHeaderCellContainer = d3.select(this.gridParent.selectAll(".HeaderCellContainer")[0][binIndex]);
			selectedHeaderCellContainer.selectAll(".HeaderCellRect")
				.style({fill: SELECTED_CELL_FILL, stroke: SELECTED_CELL_STROKE});
			selectedHeaderCellContainer.selectAll(".HeaderCellText")
				.style({'font-weight': 'bold'});
			
			var selectedBodyCellParent = d3.select(this.gridParent.selectAll(".BodyCellParent")[0][binIndex]);
			selectedBodyCellParent.selectAll(".BodyCellRect")
				.style({fill: SELECTED_CELL_FILL, stroke: SELECTED_CELL_STROKE});
			selectedBodyCellParent.selectAll(".BodyCellText")
				.style({'font-weight': 'bold'});
		} else if(this.selectedCell !== undefined) {
			var xIndex = this.selectedCellIndex[0];
			var yIndex = this.selectedCellIndex[1];
			var a = d3.select(this.gridParent.selectAll(".BodyCellParent")[0][xIndex]).selectAll(".BodyCellContainer");
			var selectedBodyCellContainer = d3.select(a[0][yIndex]);
			selectedBodyCellContainer.selectAll(".BodyCellRect")
				.style({fill: SELECTED_CELL_FILL, stroke: SELECTED_CELL_STROKE});
			selectedBodyCellContainer.selectAll(".BodyCellText")
				.style({'font-weight': 'bold'});
		}
	};
	
	DE.prototype.selectBin = function(binIndex) {
		this.removeSelectionLayer();
		
		this.selectedBin = this.device.bins[binIndex];
		this.selectedBinIndex = binIndex;
		
		this.selectedCell = undefined;
		this.selectedCellIndex = undefined;
		
		this.selectedPart = undefined;
		
		this.renderSelectionLayer();
		this.toggleButtons();
	};
	
	DE.prototype.selectCell = function(xIndex, yIndex) {
		this.removeSelectionLayer();
		
		this.selectedBin = undefined;
		this.selectedBinIndex = undefined;
		
		this.selectedCell = this.device.bins[xIndex].cells[yIndex];
		this.selectedCellIndex = [xIndex, yIndex];
		
		this.selectedPart = this.selectedCell.getPart();
		
		this.renderSelectionLayer();
		this.toggleButtons();
	};
	
	
	DE.prototype.generateDefaultNewBin = function() {
		if(this.newBinNameSuffix === undefined) {
			this.newBinNameSuffix = 1;
		}
		var name = "New Bin "+this.newBinNameSuffix++;
		var bin = new Bin(name);
		for(var i=0;i<this.device.getNumOfRows();i++) {
			bin.cells.push(new Cell());
		}
		return bin;
	};
	
	
	// Probably needs fixing.
	DE.prototype.transformSelectionIndex = function(deOp) {
		var xformIndex = function(index, comps) {
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
		
		var gOp = deOp.gridOperation;
		if(this.selectedBinIndex !== undefined) {
			this.selectedBinIndex = xformIndex(this.selectedBinIndex, gOp.components);
		} else if(this.selectedCellIndex !== undefined) {
			this.selectedCellIndex[0] = xformIndex(this.selectedCellIndex[0], gOp.components);
			
			// It is assumed that any transformation of the y index
			// would result from the insertion or deletion of a row.
			// Therefore, each bin would have a BinBodyOperation that 
			// shifts the y index the same amount.
			for(var i=0;i<gOp.components.length;i++) {
				var comp = gOp.components[i];
				if(comp.modify !== undefined) {
					var binOp = comp.modify;
					if(!binOp.hasBinBodyOperation()) { break; }
					var bbOp = binOp.binBodyOperation;
					this.selectedCellIndex[1] = xformIndex(this.selectedCellIndex[1], bbOp.components);
					break;
				} else if(comp.retain !== undefined) {
					break;
				}
			}
		}
	};
	
	
	return DE;
})();














































