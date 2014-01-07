

DeOperation = (function () {
	'use strict';
	
	var DeOperation = function(gridOperation) {
		this.gridOperation = gridOperation;
	};
	
	DeOperation.prototype.toJson = function() {
		return this;
	};
	
	DeOperation.fromJson = function(json) {
		var gOp = GridOperation.fromJson(json.gridOperation);
		var deOp = new DeOperation(gOp);
		return deOp;
	};
	
	DeOperation.prototype.hasGridOperation = function() {
		return this.gridOperation !== undefined;
	};
	
	// Computes the inverse of an operation on a device.
	DeOperation.prototype.inverse = function(device) {
		var inverse = new DeOperation();
		if(this.hasGridOperation()) {
			inverse.gridOperation = this.gridOperation.inverse(device);
		}
		return inverse;
	};
	
	DeOperation.prototype.apply = function(device) {
		var newName = device.name;
		var newBins = this.hasGridOperation() ? this.gridOperation.apply(device) : device.copyBins();
		var newParts = device.copyParts();
		var newRules = device.copyRules();
		
		var newDevice = new Device(newName, newBins, newParts, newRules);
		return newDevice;
	};
	
	DeOperation.transform = function(op1, op2) {
		var gridOps;
		if(op1.hasGridOperation() && op2.hasGridOperation()) {
			gridOps = GridOperation.transform(op1.gridOperation, op2.gridOperation);
		} else if(op1.hasGridOperation()) {
			gridOps = [op1.gridOperation, new GridOperation()];
		} else if(op2.hasGridOperation()) {
			gridOps = [new GridOperation(), op2.gridOperation];
		} else {
			gridOps = [new GridOperation(), new GridOperation()];
		}
		
		var op1prime = new DeOperation(gridOps[0]);
		var op2prime = new DeOperation(gridOps[1]);
		return [op1prime, op2prime];
	};
	
	DeOperation.compose = function(op1, op2) {
		var gridOp = GridOperation.compose(op1.gridOperation, op2.gridOperation);
		return new DeOperation(gridOp);
	};
	
	return DeOperation;
})();


GridOperation = (function () {
	'use strict';
	
	var GridOperation = function() {
		this.components = [];
		
		// An operation's baseLength is the number of bins every device must have
	    // that the operation can be applied to.
	    this.baseLength = 0;
	    // The targetLength is the number of bins that results from applying
	    // the operation on a valid input device.
	    this.targetLength = 0;
	};
	
	var isRetain = GridOperation.isRetain = function(comp) {
		return comp!==undefined && comp.retain !== undefined;
	};
	
	var isInsert = GridOperation.isInsert = function(comp) {
		return comp!==undefined && comp.insert !== undefined;
	};
	
	var isDelete = GridOperation.isDelete = function(comp) {
		return comp!==undefined && comp['delete'] !== undefined;
	};
	
	var isModify = GridOperation.isModify = function(comp) {
		return comp!==undefined && comp.modify !== undefined;
	};
	
	GridOperation.prototype.toJson = function() {
		return this;
	};
	
	GridOperation.fromJson = function(json) {
		var gOp = new GridOperation();
		gOp.baseLength = json.baseLength;
		gOp.targetLength = json.targetLength;
		for(var i=0;i<json.components.length;i++) {
			var c = json.components[i];
			if(isModify(c)) {
				gOp.components[i] = {modify: BinOperation.fromJson(c.modify)};
			} else if(isInsert(c)) {
				gOp.components[i] = {insert: Bin.fromJson(c.insert)};
			} else {
				gOp.components[i] = c;
			}
		}
		return gOp;
	};
	
	GridOperation.prototype.getLastComp = function() {
		return this.components[this.components.length-1];
	};
	
	GridOperation.prototype.retain = function(n) {
		if(n === 0) {return this;}
		this.baseLength += n;
		this.targetLength += n;
		if(isRetain(this.getLastComp())) {
			this.getLastComp().retain += n;
		} else {
			this.components.push({retain: n});
		}
		return this;
	};
	
	GridOperation.prototype.insert = function(bin) {
		this.targetLength += 1;
		// If the inserted bin is to be modified, then apply
		// the modifications.
		if(isModify(this.getLastComp())) {
			this.getLastComp().modify.apply(bin);
			this.components.pop();
			this.components.push({insert: bin});
		} else {
			this.components.push({insert: bin});
		}
		return this;
	};
	
	GridOperation.prototype['delete'] = function(n) {
		if(n === 0) {return this;}
		if(n === undefined) {n = 1;}
		this.baseLength += n;
		if(isDelete(this.getLastComp())) {
			this.getLastComp()['delete'] += n;
		} else {
			this.components.push({'delete': n});
		}
		return this;
	};
	
	// Parameter is a BinOperation.
	GridOperation.prototype.modify = function(binOperation) {
		if(isModify(this.getLastComp())) {
			throw new Error("Define later.");
		} else {
			this.components.push({modify: binOperation});
		}
		return this;
	};
	
	GridOperation.prototype.isNoop = function() {
		return this.components.length===0 || (this.components.length===1 && isRetain(this.components[0]));
	};
	
	// Computes the inverse of an operation on a device.
	GridOperation.prototype.inverse = function(device) {
		var inverse = new GridOperation();
		if(this.isNoop()) { return inverse; }
		var comps = this.components;
		var bins = device.bins;
		var pos = 0;
		for(var i=0;i<comps.length;i++) {
			var comp = comps[i];
			if(isRetain(comp)) {
				inverse.retain(comp.retain);
				pos += comp.retain;
			} else if(isInsert(comp)) {
				inverse['delete'](1);
			} else if(isDelete(comp)) {
				for(var j=pos;j<pos+comp['delete'];j++) {
					inverse.insert(bins[j].copy());
				}
				pos += comp['delete'];
			} else if(isModify(comp)) {
				inverse.modify(comp.modify.inverse(bins[pos]));
			} else {
				console.error("Invalid operation component type.");
			}
		}
		return inverse;
	};
	
	GridOperation.prototype.apply = function(device) {
		// Return a copy of the bins if the operation does nothing.
		if(this.isNoop()) {
			var newBins = [];
			for(var i=0; i<device.bins.length; i++) {
				newBins[i] = device.bins[i].copy();
			}
			return newBins;
		}
		
		if(this.baseLength !== device.getNumOfBins()) {
			throw new Error("The operation's base length must be equal to the number of bins of the device.");
		}
		
		var newBins = [];
		var pos = 0;
		var comps = this.components;
		var modBuf = undefined;
		for(var i=0; i<comps.length; i++) {
			var comp = comps[i];
			if(isModify(comp)) {
				modBuf = comp.modify;
			} else if(isRetain(comp)) {
				if(modBuf === undefined) {
					for(var j=0;j<comp.retain;j++) {
						newBins.push(device.bins[pos+j].copy());
					}
				} else {
					newBins.push(modBuf.apply(device.bins[pos]));
					for(var j=1;j<comp.retain;j++) {
						newBins.push(device.bins[pos+j].copy());
					}
				}
				pos += comp.retain;
				modBuf = undefined;
			} else if(isInsert(comp)) {
				newBins.push(comp.insert.copy());
			} else if(isDelete(comp)) {
				modBuf = undefined;
				pos += comp['delete'];
			} else {
				console.error("Invalid operation component type.");
			}
		}
		
		return newBins;
	};
	
	GridOperation.transform = function(op1, op2) {
		var op1prime = new GridOperation();
		var op2prime = new GridOperation();
		if(op1.isNoop()) {
			op2prime = op2; // probably should copy
			return [op1prime, op2prime];
		} else if(op2.isNoop()) {
			op1prime = op1; // probably should copy
			return [op1prime, op2prime];
		}
		
		if (op1.baseLength !== op2.baseLength) {
	      throw new Error("Both operations have to have the same base length");
	    }
		
		var comps1 = op1.components;
		var comps2 = op2.components;
		var i1 = 0, i2 = 0;
		var c1 = 0, c2 = 0;
		while(true) {
			var comp1 = comps1[i1];
			var comp2 = comps2[i2];
			
			if(comp1===undefined && comp2===undefined) {
				break;
			}
			
			if(isModify(comp1) && isDelete(comp2)) {
				i1++;
				continue;
			}
			if(isModify(comp2) && isDelete(comp1)) {
				i2++;
				continue;
			}
			
			
			if(isModify(comp1) && isModify(comp2)
					&& isRetain(comps1[i1+1]) && isRetain(comps2[i2+1])) {
				var pair = BinOperation.transform(comp1, comp2);
				op1prime.modify(pair[0]);
				op2prime.modify(pair[1]);
				i1++;
				i2++;
				continue;
			}
			
			
			if(isModify(comp1)) {
				op1prime.modify(comp1.modify);
				i1++;
				continue;
			}
			
			if(isInsert(comp1)) {
				op1prime.insert(comp1.insert);
				op2prime.retain(1); // Because currently only 1 bin can be inserted at a time.
				i1++;
				continue;
			}
			
			
			if(isModify(comp2)) {
				op2prime.modify(comp2.modify);
				i2++;
				continue;
			}
			
			if(isInsert(comp2)) {
				op1prime.retain(1); // Because currently only 1 bin can be inserted at a time.
				op2prime.insert(comp2.insert);
				i2++;
				continue;
			}
			
			
			if(comp1===undefined) {
				throw new Error("Cannot compose operations: first operation is too short.");
			}
			if(comp2===undefined) {
				throw new Error("Cannot compose operations: first operation is too long.");
			}
			
			var minl, v1, v2;
			if(isRetain(comp1) && isRetain(comp2)) {
				v1 = comp1.retain - c1;
				v2 = comp2.retain - c2;
				if(v1 > v2) {
					minl = v2;
					c1 += v2;
					c2 = 0;
					i2++;
				} else if(v1 === v2) {
					minl = v1;
					c1 = c2 = 0;
					i1++;
					i2++;
				} else {
					minl = v1;
					c2 += v1;
					c1 = 0;
					i1++;
				}
				op1prime.retain(minl);
				op2prime.retain(minl);
			} else if(isDelete(comp1) && isDelete(comp2)) {
				v1 = comp1["delete"] - c1;
				v2 = comp2["delete"] - c2;
				if(v1 > v2) {
					c1 += v2;
					c2 = 0;
					i2++;
				} else if(v1 === v2) {
					c1 = c2 = 0;
					i1++;
					i2++;
				} else {
					c2 += v1;
					c1 = 0;
					i1++;
				}
			} else if(isDelete(comp1) && isRetain(comp2)) {
				v1 = comp1["delete"] - c1;
				v2 = comp2.retain - c2;
				if(v1 > v2) {
					minl = v2;
					c1 += v2;
					c2 = 0;
					i2++;
				} else if(v1 === v2) {
					minl = v1;
					c1 = c2 = 0;
					i1++;
					i2++;
				} else {
					minl = v1;
					c2 += v1;
					c1 = 0;
					i1++;
				}
				op1prime['delete'](minl);
			} else if(isRetain(comp1) && isDelete(comp2)) {
				v1 = comp1.retain - c1;
				v2 = comp2["delete"] - c2;
				if(v1 > v2) {
					minl = v2;
					c1 += v2;
					c2 = 0;
					i2++;
				} else if(v1 === v2) {
					minl = v1;
					c1 = c2 = 0;
					i1++;
					i2++;
				} else {
					minl = v1;
					c2 += v1;
					c1 = 0;
					i1++;
				}
				op2prime['delete'](minl);
			} else {
				throw new Error("The two components aren't compatible.");
			}
		}
		
		return [op1prime, op2prime];
	};
	
	/**
	 * Returns op such that op(S) = op2(op1(s));
	 */
	GridOperation.compose = function(op1, op2) {
		if(op1.targetLength !== op2.baseLength) {
			throw new Error("The base length of the second operation has to be the target length of the first operation.");
		}
		
		var comps1 = op1.components;
		var comps2 = op2.components;
		var op = new GridOperation();
		var i1 = 0, i2 = 0;
		var c1 = 0, c2 = 0;
		while(true) {
			var comp1 = comps1[i1];
			var comp2 = comps2[i2];
			if(comp1===undefined && comp2===undefined) {
				break;
			}
			
			// Something might be wrong with the 'modify' stuff.
			
			if(isModify(comp1)) {
				op.modify(comp1.modify);
				i1++;
				continue;
			}
			if(isDelete(comp1)) {
				op['delete'](comp1['delete']);
				i1++;
				continue;
			}
			
			if(isModify(comp2)) {
				op.modify(comp2.modify);
				i2++;
				continue;
			}
			if(isInsert(comp2)) {
				op.insert(comp2.insert);
				i2++;
				continue;
			}
			
			if(comp1===undefined) {
				throw new Error("Cannot compose operations: first operation is too short.");
			}
			if(comp2===undefined) {
				throw new Error("Cannot compose operations: first operation is too long.");
			}
			
			var v1, v2;
			if(isRetain(comp1) && isRetain(comp2)) {
				v1 = comp1.retain - c1;
				v2 = comp2.retain - c2;
				if(v1 > v2) {
					op.retain(v2);
					c1 += v2;
					c2 = 0;
					i2++;
				} else if(v1 === v2) {
					op.retain(v1);
					c1 = c2 = 0;
					i1++;
					i2++;
				} else {
					op.retain(v1);
					c2 += v1;
					c1 = 0;
					i1++;
				}
			} else if(isInsert(comp1) && isDelete(comp2)) {
				v1 = 1;
				v2 = comp2['delete'] - c2;
				if(v1 > v2) { // Currently, this can only happen v2===0
					c2 = 0;
					i2++;
				} else if(v1 === v2) {
					c1 = c2 = 0;
					i1++;
					i2++;
				} else {
					c2 += v1;
					c1 = 0;
					i1++;
				}
			} else if(isInsert(comp1) && isRetain(comp2)) {
				v1 = 1;
				v2 = comp2.retain - c2;
				if(v1 > v2) { // Currently, this can only happen v2===0
					c2 = 0;
					i2++;
				} else if(v1 === v2) {
					op.insert(comp1.insert);
					c1 = c2 = 0;
					i1++;
					i2++;
				} else {
					op.insert(comp1.insert);
					c2 += v1;
					c1 = 0;
					i1++;
				}
			} else if(isRetain(comp1) && isDelete(comp2)) {
				v1 = comp1.retain - c1;
				v2 = comp2['delete'] - c2;
				if(v1 > v2) {
					op['delete'](v2);
					c1 += v2;
					c2 = 0;
					i2++;
				} else if(v1 === v2) {
					op['delete'](v2);
					c1 = c2 = 0;
					i1++;
					i2++;
				} else {
					op['delete'](v1);
					c2 += v1;
					c1 = 0;
					i1++;
				}
			} else {
				throw new Error("Something went wrong.");
			}
		}
		
		return op;
	};
	
	return GridOperation;
})();


BinOperation = (function () {
	'use strict';
	
	var BinOperation = function(binHeaderOperation, binBodyOperation) {
		this.binHeaderOperation = binHeaderOperation;
		this.binBodyOperation = binBodyOperation;
	};
	
	BinOperation.prototype.toJson = function() {
		return this;
	};
	
	BinOperation.fromJson = function(json) {
		var binOp = new BinOperation();
		if(json.binHeaderOperation !== undefined) {
			binOp.binHeaderOperation = BinHeaderOperation.fromJson(json.binHeaderOperation);
		}
		if(json.binBodyOperation !== undefined) {
			binOp.binBodyOperation = BinBodyOperation.fromJson(json.binBodyOperation);
		}
		return binOp;
	};
	
	BinOperation.prototype.hasBinHeaderOperation = function() {
		return this.binHeaderOperation !== undefined;
	};
	
	BinOperation.prototype.hasBinBodyOperation = function() {
		return this.binBodyOperation !== undefined;
	};
	
	BinOperation.prototype.isNoop = function() {
		if(this.binHeaderOperation === undefined && this.binBodyOperation === undefined) { return true; }
		if(this.binHeaderOperation !== undefined && !this.binHeaderOperation.isNoop()) { return false; }
		if(this.binBodyOperation !== undefined && !this.binBodyOperation.isNoop()) { return false; }
		return true;
	};
	
	// Computes the inverse of an operation on a bin.
	BinOperation.prototype.inverse = function(bin) {
		var inverse = new BinOperation();
		if(this.isNoop()) { return inverse; }
		if(this.hasBinHeaderOperation()) {
			inverse.binHeaderOperation = this.binHeaderOperation.inverse(bin);
		}
		if(this.hasBinBodyOperation()) {
			inverse.binBodyOperation = this.binBodyOperation.inverse(bin);
		}
		return inverse;
	};
	
	BinOperation.prototype.apply = function(bin) {
		// Return a copy of the bin if the operation does nothing.
		if(this.isNoop()) {
			return bin.copy();
		}
		
		var newBin = bin.copyHeader();
		
		if(this.hasBinHeaderOperation()) {
			this.binHeaderOperation.apply(newBin);
		}
		
		if(this.hasBinBodyOperation()) {
			var newCells = this.binBodyOperation.apply(bin);
			newBin.setCells(newCells);
		}
		
		return newBin;
	};
	
	BinOperation.transform = function(op1, op2) {
		var headerOps = BinHeaderOperation.transform(op1.binHeaderOperation, op2.binHeaderOperation);
		var bodyOps = BinBodyOperation.transform(op1.binBodyOperation, op2.binBodyOperation);
		
		var op1prime = new BinOperation(headerOps[0], bodyOps[0]);
		var op2prime = new BinOperation(headerOps[1], bodyOps[1]);
		return [op1prime, op2prime];
	};
	
	/**
	 * Returns op such that op(S) = op2(op1(s));
	 */
	BinOperation.compose = function(op1, op2) {
		var headerOp = BinHeaderOperation.compose(op1.binHeaderOperation, op2.binHeaderOperation);
		var bodyOp = BinBodyOperation.compose(op1.binBodyOperation, op2.binBodyOperation);
		return new BinOperation(headerOp, bodyOp);
	};
	
	return BinOperation;
})();


BinHeaderOperation = (function () {
	'use strict';
	
	var BinHeaderOperation = function() {
		this.components = {};
	};
	
	BinHeaderOperation.prototype.hasRename = function() {
		return this.components.rename !== undefined;
	};
	
	BinHeaderOperation.prototype.hasChangeIcon = function() {
		return this.components.changeIcon !== undefined;
	};
	
	BinHeaderOperation.prototype.hasChangeDsf = function() {
		return this.components.changeDsf !== undefined;
	};
	
	BinHeaderOperation.prototype.hasChangeDir = function() {
		return this.components.changeDir !== undefined;
	};
	
	BinHeaderOperation.prototype.isNoop = function() {
		for(var x in this.components) { return false; }
		return true;
	};
	
	BinHeaderOperation.prototype.rename = function(newName) {
		this.components.rename = newName;
		return this;
	};
	
	BinHeaderOperation.prototype.changeIcon = function(newIcon) {
		this.components.changeIcon = newIcon;
		return this;
	};
	
	BinHeaderOperation.prototype.changeDsf = function(newDsf) {
		this.components.changeDsf = newDsf;
		return this;
	};
	
	BinHeaderOperation.prototype.changeDir = function(newDir) {
		this.components.changeDir = newDir;
		return this;
	};
	
	BinHeaderOperation.prototype.copy = function() {
		var copy = new BinHeaderOperation();
		if(this.hasRename()) { copy.rename(this.components.rename); }
		if(this.hasChangeIcon()) { copy.changeIcon(this.components.changeIcon); }
		if(this.hasChangeDsf()) { copy.changeDsf(this.components.changeDsf); }
		if(this.hasChangeDir()) { copy.changeDir(this.components.changeDir); }
		return copy;
	};
	
	BinHeaderOperation.prototype.toJson = function() {
		return this;
	};
	
	BinHeaderOperation.fromJson = function(json) {
		var gho = new BinHeaderOperation();
		gho.components = json.components;
		return gho;
	};
	
	// Computes the inverse of an operation on a bin.
	BinHeaderOperation.prototype.inverse = function(bin) {
		var inverse = new BinHeaderOperation();
		if(this.isNoop()) { return inverse; }
		if(this.hasRename()) { inverse.rename(bin.name); }
		if(this.hasChangeIcon()) { inverse.changeIcon(bin.icon); }
		if(this.hasChangeDsf()) { inverse.changeDsf(bin.dsf); }
		if(this.hasChangeDir()) { inverse.changeDir(bin.dir); }
		return inverse;
	};
	
	// This will modify the bin that the operation is applied to.
	BinHeaderOperation.prototype.apply = function(bin) {
		if(this.hasRename()) { bin.name = this.components.rename; }
		if(this.hasChangeIcon()) { bin.icon = this.components.changeIcon; }
		if(this.hasChangeDsf()) { bin.dsf = this.components.changeDsf; }
		if(this.hasChangeDir()) { bin.dir = this.components.changeDir; }
		return bin;
	};
	
	// In cases requiring a tiebreaker, op1 gets priority.
	// Currently untested.
	BinHeaderOperation.transform = function(op1, op2) {
		var op1prime = new BinHeaderOperation();
		var op2prime = new BinHeaderOperation();
		
		if(op1.isNoop()) {
			op2prime = op2.copy();
			return [op1prime, op2prime];
		} else if(op2.isNoop()) {
			op1prime = op1.copy();
			return [op1prime, op2prime];
		}
		
		if(op1.hasRename()) {
			op1prime.rename(op1.components.rename);
		} else if(op2.hasRename()) {
			op2prime.rename(op2.components.rename);
		}
		
		if(op1.hasChangeIcon()) {
			op1prime.changeIcon(op1.components.changeIcon);
		} else if(op2.hasChangeIcon()) {
			op2prime.changeIcon(op2.components.changeIcon);
		}
		
		if(op1.hasChangeDsf()) {
			op1prime.changeDsf(op1.components.changeDsf);
		} else if(op2.hasChangeDsf()) {
			op2prime.changeDsf(op2.components.changeDsf);
		}
		
		if(op1.hasChangeDir()) {
			op1prime.changeDir(op1.components.changeDir);
		} else if(op2.hasChangeDir()) {
			op2prime.changeDir(op2.components.changeDir);
		}
		
		return [op1prime, op2prime];
	};
	
	/**
	 * Returns op such that op(S) = op2(op1(s));
	 */
	BinHeaderOperation.compose = function(op1, op2) {
		var op = op1.copy();
		if(op2.hasRename()) { op.rename(op2.components.rename); }
		if(op2.hasChangeIcon()) { op.changeIcon(op2.components.changeIcon); }
		if(op2.hasChangeDsf()) { op.changeDsf(op2.components.changeDsf); }
		if(op2.hasChangeDir()) { op.changeDir(op2.components.changeDir); }
		return op;
	};
	
	return BinHeaderOperation;
})();


BinBodyOperation = (function () {
	'use strict';
	
	var BinBodyOperation = function() {
		this.components = [];
		
		// An operation's baseLength is the number of cells every bin must have
	    // that the operation can be applied to.
	    this.baseLength = 0;
	    // The targetLength is the number of cells that results from applying
	    // the operation on a valid input bin.
	    this.targetLength = 0;
	};
	
	var isRetain = BinBodyOperation.isRetain = function(comp) {
		return comp!==undefined && comp.retain !== undefined;
	};
	
	var isInsert = BinBodyOperation.isInsert = function(comp) {
		return comp!==undefined && comp.insert !== undefined;
	};
	
	var isDelete = BinBodyOperation.isDelete = function(comp) {
		return comp!==undefined && comp['delete'] !== undefined;
	};
	
	var isModify = BinBodyOperation.isModify = function(comp) {
		return comp!==undefined && comp.modify !== undefined;
	};
	
	BinBodyOperation.prototype.toJson = function() {
		return this;
	};
	
	BinBodyOperation.fromJson = function(json) {
		var bbOp = new BinBodyOperation();
		bbOp.baseLength = json.baseLength;
		bbOp.targetLength = json.targetLength;
		for(var i=0;i<json.components.length;i++) {
			var c = json.components[i];
			if(isModify(c)) {
				bbOp.components[i] = {modify: CellOperation.fromJson(c.modify)};
			} else if(isInsert(c)) {
				bbOp.components[i] = {insert: Cell.fromJson(c.insert)};
			} else {
				bbOp.components[i] = c;
			}
		}
		return bbOp;
	};
	
	BinBodyOperation.prototype.getLastComp = function() {
		return this.components[this.components.length-1];
	};
	
	BinBodyOperation.prototype.retain = function(n) {
		if(n === 0) {return this;}
		this.baseLength += n;
		this.targetLength += n;
		if(isRetain(this.getLastComp())) {
			this.getLastComp().retain += n;
		} else {
			this.components.push({retain: n});
		}
		return this;
	};
	
	BinBodyOperation.prototype.insert = function(cell) {
		this.targetLength += 1;
		// If the inserted cell is to be modified, then apply
		// the modifications.
		if(isModify(this.getLastComp())) {
			this.getLastComp().modify.apply(cell);
			this.components.pop();
			this.components.push({insert: cell});
		} else {
			this.components.push({insert: cell});
		}
		return this;
	};
	
	BinBodyOperation.prototype['delete'] = function(n) {
		if(n === 0) {return this;}
		if(n === undefined) {n = 1;}
		this.baseLength += n;
		if(isDelete(this.getLastComp())) {
			this.getLastComp()['delete'] += n;
		} else {
			this.components.push({'delete': n});
		}
		return this;
	};
	
	// Parameter is a CellOperation.
	BinBodyOperation.prototype.modify = function(cellOperation) {
		if(isModify(this.getLastComp())) {
			throw new Error("Define later.");
		} else {
			this.components.push({modify: cellOperation});
		}
		return this;
	};
	
	BinBodyOperation.prototype.isNoop = function() {
		return this.components.length===0 || (this.components.length===1 && isRetain(this.components[0]));
	};
	
	// Computes the inverse of an operation on a bin.
	BinBodyOperation.prototype.inverse = function(bin) {
		var inverse = new BinBodyOperation();
		if(this.isNoop()) { return inverse; }
		var comps = this.components;
		var cells = bin.cells;
		var pos = 0;
		for(var i=0;i<comps.length;i++) {
			var comp = comps[i];
			if(isRetain(comp)) {
				inverse.retain(comp.retain);
				pos += comp.retain;
			} else if(isInsert(comp)) {
				inverse['delete'](1);
			} else if(isDelete(comp)) {
				for(var j=pos;j<pos+comp['delete'];j++) {
					inverse.insert(cells[j].copy());
				}
				pos += comp['delete'];
			} else if(isModify(comp)) {
				inverse.modify(comp.modify.inverse(cells[pos]));
			} else {
				console.error("Invalid operation component type.");
			}
		}
		return inverse;
	};
	
	BinBodyOperation.prototype.apply = function(bin) {
		if(this.baseLength !== bin.getNumOfCells()) {
			throw new Error("The operation's base length must be equal to the number of cells of the bin.");
		}
		
		// Return a copy of the cells if the operation does nothing.
		if(this.isNoop()) {
			var newCells = [];
			for(var i=0; i<bin.cells.length; i++) {
				newCells[i] = bin.cells[i].copy();
			}
			return newCells;
		}

		var newCells = [];
		var pos = 0;
		var comps = this.components;
		var modBuf = undefined;
		for(var i=0; i<comps.length; i++) {
			var comp = comps[i];
			if(isModify(comp)) {
				modBuf = comp.modify;
			} else if(isRetain(comp)) {
				if(modBuf === undefined) {
					for(var j=0;j<comp.retain;j++) {
						newCells.push(bin.cells[pos+j].copy());
					}
				} else {
					newCells.push(modBuf.apply(bin.cells[pos].copy()));
					for(var j=1;j<comp.retain;j++) {
						newCells.push(bin.cells[pos+j].copy());
					}
				}
				pos += comp.retain;
				modBuf = undefined;
			} else if(isInsert(comp)) {
				newCells.push(comp.insert.copy());
			} else if(isDelete(comp)) {
				modBuf = undefined;
				pos += comp['delete'];
			} else {
				console.error("Invalid operation component type.");
			}
		}
		
		return newCells;
	};
	
	BinBodyOperation.transform = function(op1, op2) {
		var op1prime = new BinBodyOperation();
		var op2prime = new BinBodyOperation();
		if(op1.isNoop()) {
			op2prime = op2; // probably should copy
			return [op1prime, op2prime];
		} else if(op2.isNoop()) {
			op1prime = op1; // probably should copy
			return [op1prime, op2prime];
		}
		
		if (op1.baseLength !== op2.baseLength) {
	      throw new Error("Both operations have to have the same base length");
	    }
		
		var comps1 = op1.components;
		var comps2 = op2.components;
		var i1 = 0, i2 = 0;
		var c1 = 0, c2 = 0;
		while(true) {
			var comp1 = comps1[i1];
			var comp2 = comps2[i2];
			
			if(comp1===undefined && comp2===undefined) {
				break;
			}
			
			if(isModify(comp1) && isDelete(comp2)) {
				i1++;
				continue;
			}
			if(isModify(comp2) && isDelete(comp1)) {
				i2++;
				continue;
			}
			
			
			if(isModify(comp1) && isModify(comp2)
					&& isRetain(comps1[i1+1]) && isRetain(comps2[i2+1])) {
				var pair = CellOperation.transform(comp1, comp2);
				op1prime.modify(pair[0]);
				op2prime.modify(pair[1]);
				i1++;
				i2++;
				continue;
			}
			
			
			if(isModify(comp1)) {
				op1prime.modify(comp1.modify);
				i1++;
				continue;
			}
			
			if(isInsert(comp1)) {
				op1prime.insert(comp1.insert);
				op2prime.retain(1); // Because currently only 1 cell can be inserted at a time.
				i1++;
				continue;
			}
			
			
			if(isModify(comp2)) {
				op2prime.modify(comp2.modify);
				i2++;
				continue;
			}
			
			if(isInsert(comp2)) {
				op1prime.retain(1); // Because currently only 1 cell can be inserted at a time.
				op2prime.insert(comp2.insert);
				i2++;
				continue;
			}
			
			
			if(comp1===undefined) {
				throw new Error("Cannot compose operations: first operation is too short.");
			}
			if(comp2===undefined) {
				throw new Error("Cannot compose operations: first operation is too long.");
			}
			
			var minl, v1, v2;
			if(isRetain(comp1) && isRetain(comp2)) {
				v1 = comp1.retain - c1;
				v2 = comp2.retain - c2;
				if(v1 > v2) {
					minl = v2;
					c1 += v2;
					c2 = 0;
					i2++;
				} else if(v1 === v2) {
					minl = v1;
					c1 = c2 = 0;
					i1++;
					i2++;
				} else {
					minl = v1;
					c2 += v1;
					c1 = 0;
					i1++;
				}
				op1prime.retain(minl);
				op2prime.retain(minl);
			} else if(isDelete(comp1) && isDelete(comp2)) {
				v1 = comp1["delete"] - c1;
				v2 = comp2["delete"] - c2;
				if(v1 > v2) {
					c1 += v2;
					c2 = 0;
					i2++;
				} else if(v1 === v2) {
					c1 = c2 = 0;
					i1++;
					i2++;
				} else {
					c2 += v1;
					c1 = 0;
					i1++;
				}
			} else if(isDelete(comp1) && isRetain(comp2)) {
				v1 = comp1["delete"] - c1;
				v2 = comp2.retain - c2;
				if(v1 > v2) {
					minl = v2;
					c1 += v2;
					c2 = 0;
					i2++;
				} else if(v1 === v2) {
					minl = v1;
					c1 = c2 = 0;
					i1++;
					i2++;
				} else {
					minl = v1;
					c2 += v1;
					c1 = 0;
					i1++;
				}
				op1prime['delete'](minl);
			} else if(isRetain(comp1) && isDelete(comp2)) {
				v1 = comp1.retain - c1;
				v2 = comp2["delete"] - c2;
				if(v1 > v2) {
					minl = v2;
					c1 += v2;
					c2 = 0;
					i2++;
				} else if(v1 === v2) {
					minl = v1;
					c1 = c2 = 0;
					i1++;
					i2++;
				} else {
					minl = v1;
					c2 += v1;
					c1 = 0;
					i1++;
				}
				op2prime['delete'](minl);
			} else {
				throw new Error("The two components aren't compatible.");
			}
		}
		
		return [op1prime, op2prime];
	};
	
	/**
	 * Returns op such that op(S) = op2(op1(s));
	 */
	BinBodyOperation.compose = function(op1, op2) {
		if(op1.targetLength !== op2.baseLength) {
			throw new Error("The base length of the second operation has to be the target length of the first operation.");
		}
		
		var comps1 = op1.components;
		var comps2 = op2.components;
		var op = new BinBodyOperation();
		var i1 = 0, i2 = 0;
		var c1 = 0, c2 = 0;
		while(true) {
			var comp1 = comps1[i1];
			var comp2 = comps2[i2];
			if(comp1===undefined && comp2===undefined) {
				break;
			}
			
			// Something might be wrong with the 'modify' stuff.
			
			if(isModify(comp1)) {
				op.modify(comp1.modify);
				i1++;
				continue;
			}
			if(isDelete(comp1)) {
				op['delete'](comp1['delete']);
				i1++;
				continue;
			}
			
			if(isModify(comp2)) {
				op.modify(comp2.modify);
				i2++;
				continue;
			}
			if(isInsert(comp2)) {
				op.insert(comp2.insert);
				i2++;
				continue;
			}
			
			if(comp1===undefined) {
				throw new Error("Cannot compose operations: first operation is too short.");
			}
			if(comp2===undefined) {
				throw new Error("Cannot compose operations: first operation is too long.");
			}
			
			var v1, v2;
			if(isRetain(comp1) && isRetain(comp2)) {
				v1 = comp1.retain - c1;
				v2 = comp2.retain - c2;
				if(v1 > v2) {
					op.retain(v2);
					c1 += v2;
					c2 = 0;
					i2++;
				} else if(v1 === v2) {
					op.retain(v1);
					c1 = c2 = 0;
					i1++;
					i2++;
				} else {
					op.retain(v1);
					c2 += v1;
					c1 = 0;
					i1++;
				}
			} else if(isInsert(comp1) && isDelete(comp2)) {
				v1 = 1;
				v2 = comp2['delete'] - c2;
				if(v1 > v2) { // Currently, this can only happen v2===0
					c2 = 0;
					i2++;
				} else if(v1 === v2) {
					c1 = c2 = 0;
					i1++;
					i2++;
				} else {
					c2 += v1;
					c1 = 0;
					i1++;
				}
			} else if(isInsert(comp1) && isRetain(comp2)) {
				v1 = 1;
				v2 = comp2.retain - c2;
				if(v1 > v2) { // Currently, this can only happen v2===0
					c2 = 0;
					i2++;
				} else if(v1 === v2) {
					op.insert(comp1.insert);
					c1 = c2 = 0;
					i1++;
					i2++;
				} else {
					op.insert(comp1.insert);
					c2 += v1;
					c1 = 0;
					i1++;
				}
			} else if(isRetain(comp1) && isDelete(comp2)) {
				v1 = comp1.retain - c1;
				v2 = comp2['delete'] - c2;
				if(v1 > v2) {
					op['delete'](v2);
					c1 += v2;
					c2 = 0;
					i2++;
				} else if(v1 === v2) {
					op['delete'](v2);
					c1 = c2 = 0;
					i1++;
					i2++;
				} else {
					op['delete'](v1);
					c2 += v1;
					c1 = 0;
					i1++;
				}
			} else {
				throw new Error("Something went wrong.");
			}
		}
		
		return op;
	};
	
	return BinBodyOperation;
})();


CellOperation = (function () {
	'use strict';
	
	var CellOperation = function() {
		this.components = {};
	};
	
	/*CellOperation.prototype.hasPhantomize = function() {
		return this.components.phantomize !== undefined;
	};*/
	
	CellOperation.prototype.hasChangePhantom = function() {
		return this.components.changePhantom !== undefined;
	};
	
	CellOperation.prototype.hasChangePartId = function() {
		return this.components.changePartId !== undefined;
	};
	
	CellOperation.prototype.hasChangeFas = function() {
		return this.components.changeFas !== undefined;
	};
	
	CellOperation.prototype.isNoop = function() {
		for(var x in this.components) { return false; }
		return true;
	};
	
	/*CellOperation.prototype.phantomize = function() {
		this.components.phantomize = true;
		return this;
	};*/
	
	CellOperation.prototype.changePhantom = function(phantom) {
		this.components.changePhantom = phantom;
		return this;
	};
	
	CellOperation.prototype.changePartId = function(newPartId) {
		this.components.changePartId = newPartId;
		return this;
	};
	
	CellOperation.prototype.changeFas = function(newFas) {
		this.components.changeFas = newFas;
		return this;
	};
	
	CellOperation.prototype.copy = function() {
		var copy = new CellOperation();
		//if(this.hasPhantomize()) { copy.phantomize(); }
		if(this.hasChangePhantom()) { copy.changePhantom(this.components.changePhantom); }
		if(this.hasChangePartId()) { copy.changePartId(this.components.changePartId); }
		if(this.hasChangeFas()) { copy.changeFas(this.components.changeFas); }
		return copy;
	};
	
	CellOperation.prototype.toJson = function() {
		return this;
	};
	
	CellOperation.fromJson = function(json) {
		var gco = new CellOperation();
		gco.components = json.components;
		return gco;
	};
	
	// Computes the inverse of an operation on a cell.
	// Currently untested.
	CellOperation.prototype.inverse = function(cell) {
		var inverse = new CellOperation();
		if(this.isNoop()) { return inverse; }
		if(this.hasChangePhantom()) {
			if(this.components.changePhantom === true) {
				inverse.changePhantom(cell.phantom);
				inverse.changePartId(cell.partId);
				inverse.changeFas(cell.fas);
				return inverse;
			} else {
				inverse.changePhantom(cell.phantom);
			}
		}
		if(this.hasChangePartId()) { inverse.changePartId(cell.partId); }
		if(this.hasChangeFas()) { inverse.changeFas(cell.fas); }
		return inverse;
	};
	
	// This will modify the cell that the operation is applied to.
	CellOperation.prototype.apply = function(cell) {
		//if(this.hasPhantomize()) { cell.phantomize(); }
		if(this.hasChangePhantom()) { cell.setPhantom(this.components.changePhantom); }
		if(this.hasChangePartId()) { cell.changePartId(this.components.changePartId); }
		if(this.hasChangeFas()) { cell.setFas(this.components.changeFas); }
		return cell;
	};
	
	// In cases requiring a tiebreaker, op1 gets priority.
	// Currently untested.
	CellOperation.transform = function(op1, op2) {
		var op1prime = new CellOperation();
		var op2prime = new CellOperation();
		
		if(op1.isNoop()) {
			op2prime = op2.copy();
			return [op1prime, op2prime];
		} else if(op2.isNoop()) {
			op1prime = op1.copy();
			return [op1prime, op2prime];
		}
		
		/*if(op1.hasPhantomize()) {
			op1prime = op1.copy();
			return [op1prime, op2prime];
		} else if(op2.hasPhantomize()) {
			op2prime = op2.copy();
			return [op1prime, op2prime];
		}*/
		if(op1.hasChangePhantom() && op1.components.changePhantom === true) {
			op1prime = op1.copy();
			return [op1prime, op2prime];
		} else if(op2.hasChangePhantom() && op2.components.changePhantom === true) {
			op2prime = op2.copy();
			return [op1prime, op2prime];
		}
		if(op1.hasChangePhantom() && !op2.hasChangePhantom()) {
			op1prime.changePhantom(false);
		} else if(op2.hasChangePhantom() && !op1.hasChangePhantom()) {
			op2prime.changePhantom(false);
		}
		
		
		
		if(op1.hasChangePartId()) {
			op1prime.changePartId(op1.components.changePartId);
		} else if(op2.hasChangePartId()) {
			op2prime.changePartId(op2.components.changePartId);
		}
		
		if(op1.hasChangeFas()) {
			op1prime.changeFas(op1.components.changeFas);
		} else if(op2.hasChangeFas()) {
			op2prime.changeFas(op2.components.changeFas);
		}
		
		return [op1prime, op2prime];
	};
	
	/**
	 * Returns op such that op(S) = op2(op1(s));
	 */
	CellOperation.compose = function(op1, op2) {
		var op = new CellOperation();
		/*if(op2.hasPhantomize()) {
			op.phantomize();
			if(op2.hasChangePartId()) { op.changePartId(op2.components.changePartId); }
			if(op2.hasChangeFas()) { op.changeFas(op2.components.changeFas); }
		} else {
			if(op1.hasPhantomize()) { op.phantomize(); }
			if(op1.hasChangePartId()) { op.changePartId(op1.components.changePartId); }
			if(op1.hasChangeFas()) { op.changeFas(op1.components.changeFas); }
			
			if(op2.hasChangePartId()) { op.changePartId(op2.components.changePartId); }
			if(op2.hasChangeFas()) { op.changeFas(op2.components.changeFas); }
		}*/
		if(op2.hasChangePhantom() && op2.components.changePhantom === true) {
			op.changePhantom(true);
			if(op2.hasChangePartId()) { op.changePartId(op2.components.changePartId); }
			if(op2.hasChangeFas()) { op.changeFas(op2.components.changeFas); }
		} else {
			if(op1.hasChangePhantom()) { op.changePhantom(op1.components.changePhantom); }
			if(op1.hasChangePartId()) { op.changePartId(op1.components.changePartId); }
			if(op1.hasChangeFas()) { op.changeFas(op1.components.changeFas); }
			
			if(op2.hasChangePhantom()) { op.changePhantom(op2.components.changePhantom); }
			if(op2.hasChangePartId()) { op.changePartId(op2.components.changePartId); }
			if(op2.hasChangeFas()) { op.changeFas(op2.components.changeFas); }
		}
		
		return op;
	};
	
	
	
	return CellOperation;
})();



if(typeof module === 'object') {
	module.exports = {
		DeOperation: DeOperation,
		GridOperation: GridOperation,
		BinOperation: BinOperation,
		BinHeaderOperation: BinHeaderOperation,
		BinBodyOperation: BinBodyOperation,
		CellOperation: CellOperation
	};
}



























