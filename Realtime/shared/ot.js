

/*if(typeof ot === 'undefined') {
	var ot = {};
}

if(typeof module === 'object') {
	module.exports = ot;
}*/


MachineOperation = (function () {
	'use strict';
	
	function MachineOperation(bpOperation, featureOperation) {
		this.bpOperation = bpOperation;
		this.featureOperation = featureOperation;
	};
	
	MachineOperation.prototype.toJson = function() {
		var me = this;
		var json = {
			bpOperation: me.bpOperation.toJson(),
			featureOperation: me.featureOperation.toJson()
		};
		return json;
	};
	
	MachineOperation.fromJson = function(json) {
		var mOp = new MachineOperation();
		mOp.bpOperation = BpOperation.fromJson(json.bpOperation);
		mOp.featureOperation = FeatureOperation.fromJson(json.featureOperation);
		return mOp;
	};
	
	// Generates an operation that has no effect.
	MachineOperation.generateNoop = function(sequence) {
		var bpOp = new BpOperation()
			.retain(sequence.getSequenceLength());
		var fOp = new FeatureOperation()
			.retain(sequence.getNumOfFeatures());
		return new MachineOperation(bpOp, fOp);
	};
	
	MachineOperation.prototype.apply = function(sequence) {
		var ret = new Sequence();
		ret.sequence = this.bpOperation.apply(sequence);
		ret.features = this.featureOperation.apply(sequence);
		return ret;
	};
	
	// Computes the inverse of an operation on a sequence.
	MachineOperation.prototype.inverse = function(sequence) {
		var invBpOp = this.bpOperation.inverse(sequence);
		var invFOp = this.featureOperation.inverse(sequence);
		return new MachineOperation(invBpOp, invFOp);
	};
	
	MachineOperation.transform = function(op1, op2) {
		var bpOps = BpOperation.transform(op1.bpOperation, op2.bpOperation);
		var fOps = FeatureOperation.transform(op1.featureOperation, op2.featureOperation);
		
		if(op1.featureOperation.hasInsertedFeatures()) {
			MachineOperation.$helpTransform1(op1.featureOperation, bpOps[1]);
		}
		if(op2.featureOperation.hasInsertedFeatures()) {
			MachineOperation.$helpTransform1(op2.featureOperation, bpOps[0]);
		}
		
		var op1prime = new MachineOperation(bpOps[0], fOps[0]);
		var op2prime = new MachineOperation(bpOps[1], fOps[1]);
		return [op1prime, op2prime];
	};
	
	/**
	 * Returns op such that op(S) = op2(op1(S));
	 */
	MachineOperation.compose = function(op1, op2) {
		var bpOp = BpOperation.compose(op1.bpOperation, op2.bpOperation);
		var fOp = FeatureOperation.compose(op1.featureOperation, op2.featureOperation);
		return new MachineOperation(bpOp, fOp);
	};
	
	MachineOperation.prototype.isNoop = function() {
		return this.bpOperation.isNoop() && this.featureOperation.isNoop();
	};
	
	MachineOperation.createSortedFeatureStartEndArray = function(arrayOfFeatures) {
		var features = arrayOfFeatures;
		var a1 = [];
		for(var i=0;i<features.length;i++) {
			var f = features[i];
			a1.push({featureIndex: i, type: "start", pos: f.start});
			a1.push({featureIndex: i, type: "end", pos: f.end});
		}
		a1.sort(function(a,b){
			return a.pos-b.pos;
		});
		return a1;
	};
	
	/**
	 * Helps transform some feature operations against bp operations.
	 */
	MachineOperation.$helpTransform1 = function(fOpA, bpOpBprime) {
		var insertedFeatures = fOpA.insertedFeatures;
		var a1 = MachineOperation.createSortedFeatureStartEndArray(insertedFeatures);
		var i1 = 0;
		var pos = 0;
		var posShift = 0;
		for(var i=0;i<bpOpBprime.components.length;i++) {
			var comp = bpOpBprime.components[i];
			var nextPos = pos;
			if(comp.retain !== undefined) {
				nextPos += comp.retain;
				// Not sure about the difference between < and <=
				while(a1[i1]!==undefined && a1[i1].pos<nextPos) {
					var c1 = a1[i1];
					// Not sure about the difference between < and <=
					if(c1.pos<nextPos) {
						c1.pos += posShift;
						i1++;
					} else {
						break;
					}
				}
			} else if(comp.insert !== undefined) {
				posShift += comp.insert.length;
			} else if(comp['delete'] !== undefined) {
				posShift -= comp['delete'];
				nextPos += comp['delete'];
				// Not sure about the difference between < and <=
				while(a1[i1]!==undefined && a1[i1].pos<=nextPos) {
					var c1 = a1[i1];
					// Not sure about the difference between < and <=
					if(c1.pos<=nextPos) {
						a1[i1] = {'delete': c1};
						i1++;
					} else {
						break;
					}
				}
			} else {
				console.error("Invalid operation component type.");
			}
			pos = nextPos;
		}
		
		for(var i=0;i<a1.length;i++) {
			var c1 = a1[i];
			if(c1['delete'] !== undefined) {
				var fIndex = c1['delete'].featureIndex;
				var f = insertedFeatures[fIndex];
				if(f !== null) {
					fOpA.targetLength--;
					//insertedFeatures[fIndex] = null; // Need better way to delete inserted features, this won't work.
					f.name = false; // Need better way to delete inserted features, this won't work.
				}
			} else {
				var fIndex = c1.featureIndex;
				var f = insertedFeatures[fIndex];
				if(f === null) {
					continue;
				}
				if(c1.type === 'start') {
					f.start = c1.pos;
				} else if(c1.type === 'end') {
					f.end = c1.pos;
				} else {
					console.error("Invalid type.");
				}
			}
		}
	};
	
	return MachineOperation;
})();

BpOperation = (function () {
	// constructor
	var cls = function() {
		this.components = [];
		// An operation's baseLength is the length of every string the operation
	    // can be applied to.
	    this.baseLength = 0;
	    // The targetLength is the length of every string that results from applying
	    // the operation on a valid input string.
	    this.targetLength = 0;
	};
	
	var isRetain = function(comp) {
		return comp!==undefined && comp.retain !== undefined;
	};
	
	var isInsert = function(comp) {
		return comp!==undefined && comp.insert !== undefined;
	};
	
	var isDelete = function(comp) {
		return comp!==undefined && comp['delete'] !== undefined;
	};
	
	// Skip over a given number of BPs.
	cls.prototype.retain = function(n) {
		if(n === 0) {return this;}
		this.baseLength += n;
		this.targetLength += n;
		if(isRetain(this.components[this.components.length-1])) {
			this.components[this.components.length-1].retain += n;
		} else {
			this.components.push({retain: n});
		}
		return this;
	};
	
	// Insert a string at the current position.
	cls.prototype.insert = function(str) {
		if(str === '') {return this;}
		this.targetLength += str.length;
		if(isInsert(this.components[this.components.length-1])) {
			this.components[this.components.length-1].insert += str;
		} else {
			this.components.push({insert: str});
		}
		return this;
	};
	
	// Delete a string at the current position.
	cls.prototype['delete'] = function(n) {
		if(n === 0) {return this;}
		this.baseLength += n;
		if(isDelete(this.components[this.components.length-1])) {
			this.components[this.components.length-1]['delete'] += n;
		} else {
			this.components.push({'delete': n});
		}
		return this;
	};
	
	cls.prototype.toJson = function() {
		return this;
	};
	
	cls.fromJson = function(json) {
		var bpOp = new BpOperation();
		bpOp.baseLength = json.baseLength;
		bpOp.targetLength = json.targetLength;
		bpOp.components = json.components;
		return bpOp;
	};
	
	cls.prototype.isNoop = function() {
		return this.components.length===0 || (this.components.length===1 && isRetain(this.components[0]));
	};
	
	cls.prototype.apply = function(sequence) {
		// This part is just to make testing easier.
		if(typeof sequence === 'string') {
			var q = sequence;
			sequence = {'sequence': q};
			//sequence.sequence = sequence;
			if(this.baseLength !== sequence.sequence.length) {
				throw new Error("The operation's base length must be equal to the sequence's length.");
			}
		} else {
			// Don't remove this part.
			if(this.baseLength !== sequence.getSequenceLength()) {
				throw new Error("The operation's base length must be equal to the sequence's length.");
			}
		}
		
		var newSeq = [];
		var pos = 0, j = 0;
		var comps = this.components;
		for(var i=0; i<comps.length; i++) {
			var comp = comps[i];
			if(comp.retain !== undefined) {
				newSeq[j++] = sequence.sequence.slice(pos, pos + comp.retain);
				pos += comp.retain;
			} else if(comp.insert !== undefined) {
				newSeq[j++] = comp.insert;
			} else if(comp['delete'] !== undefined) {
				pos += comp['delete'];
			} else {
				console.error("Invalid operation component type.");
			}
		}
		
		return newSeq.join("");
	};
	
	// Computes the inverse of an operation on a sequence.
	cls.prototype.inverse = function(sequence) {
		var inverse = new BpOperation();
		var comps = this.components;
		var str = sequence.sequence;
		var pos = 0;
		for(var i=0;i<comps.length;i++) {
			var comp = comps[i];
			if(isRetain(comp)) {
				inverse.retain(comp.retain);
				pos += comp.retain;
			} else if(isInsert(comp)) {
				inverse['delete'](comp.insert.length);
			} else if(isDelete(comp)) {
				inverse.insert(str.slice(pos, pos + comp['delete']));
				pos += comp['delete'];
			} else {
				console.error("Invalid operation component type.");
			}
		}
		return inverse;
	};
	
	cls.prototype.apply2 = function(sequence) {
		if(this.baseLength !== sequence.getSequenceLength()) {
			throw new Error("The operation's base length must be equal to the sequence's length.");
		}
		
		var editingModel = MachineOperation.toEditingModel(sequence);
		var newModel = [];
		var i1 = 0, i2 = 0;
		var comps = this.components;
		var c1 = editingModel[i1];
		var c2 = 0;
		//CHANGE THE PARAMS OF THE WHILE LOOP; THEY ARE WRONG.
		while(i2<comps.length) {
			var comp = comps[i2];
			
			if(typeof c1 === 'object') {
				if(isDelete(comp)) {
					var v2 = comp['delete'] - c2;
					if(v2 > 0) {
						newModel.push({'delete': c1});
					} else {
						newModel.push(c1);
					}
				} else {
					newModel.push(c1);
				}
				
				c1 = editingModel[++i1];;
				continue;
			}
			
			if(isRetain(comp)) {
				var v1 = c1.length;
				var v2 = comp.retain - c2;
				if(v1 > v2) {
					newModel.push(c1.slice(0, v2));
					c1 = c1.slice(v2);
					c2 = 0;
					i2++;
				} else if(v1 === v2) {
					newModel.push(c1);
					c1 = editingModel[++i1];
					c2 = 0;
					i2++;
				} else {
					newModel.push(c1);
					c1 = editingModel[++i1];
					c2 += v1;
				}
			} else if(isInsert(comp)) {
				newModel.push(comp.insert);
				i2++;
			} else if(isDelete(comp)) {
				var v1 = c1.length;
				var v2 = comp['delete'] - c2;
				if(v1 > v2) {
					c1 = c1.slice(v2);
					c2 = 0;
					i2++;
				} else if(v1 === v2) {
					c1 = editingModel[++i1];
					c2 = 0;
					i2++;
				} else {
					c1 = editingModel[++i1];
					c2 += v1;
				}
				
			} else {
				throw new Error("Invalid operation component type.");
			}
		}
		
		var newStr = [];
		var newFeatures = [];
		var deletedFeatures = [];
		for(var i=0;i<sequence.features.length;i++) {
			newFeatures[i] = sequence.features[i].copy();
		}
		var pos = 0;
		for(var i=0;i<newModel.length;i++) {
			var c = newModel[i];
			if(typeof c === 'string') {
				newStr.push(c);
				pos += c.length;
			} else {
				if(c['delete'] !== undefined) {
					deletedFeatures.push(c['delete'].featureIndex);
				} else {
					if(c.type === 'start') {
						newFeatures[c.featureIndex].start = pos;
					} else if(c.type === 'end') {
						newFeatures[c.featureIndex].end = pos;
					} else {
						console.error("Invalid type.");
					}
				}
			}
		}
		deletedFeatures.sort(function(a,b){return b-a;});
		for(var i=0;i<deletedFeatures.length;i++) {
			var v = deletedFeatures[i];
			newFeatures.splice(v, 1);
			while(deletedFeatures[i+1]===v) {
				i++;
			}
		}
		
		var newSeq = new Sequence();
		newSeq.sequence = newStr.join("");
		newSeq.features = newFeatures;
		
		return newSeq;
	};
	
	cls.transform = function(op1, op2) {
		if (op1.baseLength !== op2.baseLength) {
	      throw new Error("Both operations have to have the same base length");
	    }
		
		var comps1 = op1.components;
		var comps2 = op2.components;
		var op1prime = new BpOperation();
		var op2prime = new BpOperation();
		var i1 = 0, i2 = 0;
		var c1 = 0, c2 = 0;
		while(i1<comps1.length && i2<comps2.length) {
			var comp1 = comps1[i1];
			var comp2 = comps2[i2];
			
			if(isInsert(comp1)) {
				op1prime.insert(comp1.insert);
				op2prime.retain(comp1.insert.length);
				i1++;
				continue;
			}
			if(isInsert(comp2)) {
				op1prime.retain(comp2.insert.length);
				op2prime.insert(comp2.insert);
				i2++;
				continue;
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
	 * Returns op such that op(S) = op2(op1(S));
	 */
	cls.compose = function(op1, op2) {
		if(op1.targetLength !== op2.baseLength) {
			throw new Error("The base length of the second operation has to be the target length of the first operation.");
		}
		
		var comps1 = op1.components;
		var comps2 = op2.components;
		var op = new BpOperation();
		var i1 = 0, i2 = 0;
		var c1 = 0, c2 = 0;
		while(true) {
			var comp1 = comps1[i1];
			var comp2 = comps2[i2];
			if(comp1===undefined && comp2===undefined) {
				break;
			}
			
			if(isDelete(comp1)) {
				op['delete'](comp1['delete']);
				i1++;
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
				if(typeof c1 !== 'string') {c1 = comp1.insert;}
				v1 = c1.length;
				v2 = comp2['delete'] - c2;
				if(v1 > v2) {
					c1 = c1.slice(v2);
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
				if(typeof c1 !== 'string') {c1 = comp1.insert;}
				v1 = c1.length;
				v2 = comp2.retain - c2;
				if(v1 > v2) {
					op.insert(c1.slice(0, v2));
					c1 = c1.slice(v2);
					c2 = 0;
					i2++;
				} else if(v1 === v2) {
					op.insert(c1);
					c1 = c2 = 0;
					i1++;
					i2++;
				} else {
					op.insert(c1);
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
	
	return cls;
})();


FeatureOperation = (function () {
	// constructor
	var cls = function() {
		this.components = [];
		// An operation's baseLength is the length of every array of Features the operation
	    // can be applied to.
	    this.baseLength = 0;
	    // The targetLength is the length of every array of Features that results from applying
	    // the operation on a valid input array of Features .
	    this.targetLength = 0;
	    
	    this.insertedFeatures = [];
	};
	
	var isRetain = function(comp) {
		return comp!==undefined && comp.retain !== undefined;
	};
	
	var isInsert = function(comp) {
		return comp!==undefined && comp.insert !== undefined;
	};
	
	var isDelete = function(comp) {
		return comp!==undefined && comp['delete'] !== undefined;
	};
	
	/*var isRename = function(comp) {
		return comp.rename !== undefined;
	};
	
	var isMoveStart = function(comp) {
		return comp.moveStart !== undefined;
	};
	
	var isMoveEnd = function(comp) {
		return comp.moveEnd !== undefined;
	};
	
	var isModify = function(comp) {
		return isRename(comp) || isMoveStart(comp) || isMoveEnd(comp);
	};*/
	
	var isModify = function(comp) {
		return comp!==undefined && comp.modify !== undefined;
	};
	
	cls.prototype.hasInsertedFeatures = function() {
		if(this.insertedFeatures.length===0) {
			return false;
		} else {
			return true;
		}
	};
	
	// Skip over a given number of Features.
	cls.prototype.retain = function(n) {
		if(n === 0) {return this;}
		this.baseLength += n;
		this.targetLength += n;
		if(isRetain(this.components[this.components.length-1])) {
			this.components[this.components.length-1].retain += n;
		} else {
			this.components.push({retain: n});
		}
		return this;
	};
	
	// Insert a Feature at the current position.
	// Maybe change later to accept array of features rather than single feature.
	cls.prototype.insert = function(feature) {
		this.targetLength += 1;
		// If the inserted feature is to be modified, then apply
		// the modifications.
		if(isModify(this.components[this.components.length-1])) {
			var mod = this.components[this.components.length-1].modify;
			if(mod.rename !== undefined) {
				feature.name = mod.rename;
			}
			if(mod.moveStart !== undefined) {
				feature.start += mod.moveStart;
			}
			if(mod.moveEnd !== undefined) {
				feature.end += mod.moveEnd;
			}
			this.components.pop();
			this.components.push({insert: feature});
		} else {
			this.components.push({insert: feature});
		}
		this.insertedFeatures.push(feature);
		return this;
	};
	
	// Delete the Feature at the current position.
	cls.prototype['delete'] = function(n) {
		if(n === 0) {return this;}
		if(n === undefined) {n = 1;}
		this.baseLength += n;
		if(isDelete(this.components[this.components.length-1])) {
			this.components[this.components.length-1]['delete'] += n;
		} else {
			this.components.push({'delete': n});
		}
		return this;
	};
	
	/*// Rename the Feature at the current position.
	cls.prototype.rename = function(str) {
		this.components.push({rename: str});
		return this;
	};
	
	// Move the start of the Feature at the current position.
	cls.prototype.moveStart = function(n) {
		if(n === 0) {return this;}
		this.components.push({moveStart: n});
		return this;
	};
	
	// Move the end of the Feature at the current position.
	cls.prototype.moveEnd = function(n) {
		if(n === 0) {return this;}
		this.components.push({moveEnd: n});
		return this;
	};*/
	
	// Modify the Feature at the current position.
	cls.prototype.modify = function(modParams) {
		if(isModify(this.components[this.components.length-1])) {
			var mod = this.components[this.components.length-1].modify;
			if(modParams.rename !== undefined) {
				mod.rename = modParams.rename;
			}
			if(modParams.moveStart !== undefined) {
				if(mod.moveStart === undefined) {
					mod.moveStart = modParams.moveStart;
				} else {
					mod.moveStart += modParams.moveStart;
				}
			}
			if(modParams.moveEnd !== undefined) {
				if(mod.moveEnd === undefined) {
					mod.moveEnd = modParams.moveEnd;
				} else {
					mod.moveEnd += modParams.moveEnd;
				}
			}
		} else {
			var modParamsCopy = JSON.parse(JSON.stringify(modParams));
			this.components.push({modify: modParamsCopy});
		}
		return this;
	};
	
	// Rename the Feature at the current position.
	cls.prototype.rename = function(str) {
		if(isModify(this.components[this.components.length-1])) {
			var mod = this.components[this.components.length-1].modify;
			mod.rename = str;
		} else {
			this.components.push({modify: {rename: str}});
		}
		return this;
	};
	
	// Move the start of the Feature at the current position.
	cls.prototype.moveStart = function(n) {
		if(n === 0) {return this;}
		if(isModify(this.components[this.components.length-1])) {
			var mod = this.components[this.components.length-1].modify;
			if(mod.moveStart === undefined) {
				mod.moveStart = n;
			} else {
				mod.moveStart += n;
			}
		} else {
			this.components.push({modify: {moveStart: n}});
		}
		return this;
	};
	
	// Move the end of the Feature at the current position.
	cls.prototype.moveEnd = function(n) {
		if(n === 0) {return this;}
		if(isModify(this.components[this.components.length-1])) {
			var mod = this.components[this.components.length-1].modify;
			if(mod.moveEnd === undefined) {
				mod.moveEnd = n;
			} else {
				mod.moveEnd += n;
			}
		} else {
			this.components.push({modify: {moveEnd: n}});
		}
		return this;
	};
	
	cls.prototype.toJson = function() {
		var json = {};
		json.baseLength = this.baseLength;
		json.targetLength = this.targetLength;
		json.insertedFeatures = this.insertedFeatures;
		json.components = [];
		for(var i=0;i<this.components.length;i++) {
			var c = this.components[i];
			if(isInsert(c)) {
				var index = this.insertedFeatures.indexOf(c.insert);
				json.components[i] = {insert: index};
			} else {
				json.components[i] = c;
			}
		}
		return json;
	};
	
	cls.fromJson = function(json) {
		var fOp = new FeatureOperation();
		fOp.baseLength = json.baseLength;
		fOp.targetLength = json.targetLength;
		fOp.insertedFeatures = json.insertedFeatures;
		fOp.components = [];
		for(var i=0;i<json.components.length;i++) {
			var c = json.components[i];
			if(isInsert(c)) {
				//var index = json.insertedFeatures.indexOf(c.insert);
				var f = json.insertedFeatures[c.insert];
				var feature = new Feature(f.name, f.start, f.end);
				fOp.components[i] = {insert: feature};
			} else {
				fOp.components[i] = c;
			}
		}
		return fOp;
	};
	
	cls.prototype.isNoop = function() {
		return this.components.length===0 || (this.components.length===1 && isRetain(this.components[0]));
	};
	
	var inverseOfModify = function(comp, feature) {
		var modParams = comp.modify;
		var inverseParams = {};
		
		if(modParams.rename !== undefined) {
			inverseParams.rename = feature.name;
		}
		if(modParams.moveStart !== undefined) {
			inverseParams.moveStart = -modParams.moveStart;
		}
		if(modParams.moveEnd !== undefined) {
			inverseParams.moveEnd = -modParams.moveEnd;
		}
		
		return inverseParams;
	};
	
	// Computes the inverse of an operation on a sequence.
	cls.prototype.inverse = function(sequence) {
		var inverse = new FeatureOperation();
		var comps = this.components;
		var features = sequence.features;
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
					inverse.insert(features[j].copy());
				}
				pos += comp['delete'];
			} else if(isModify(comp)) {
				inverse.modify(inverseOfModify(comp, features[pos]));
			} else {
				console.error("Invalid operation component type.");
			}
		}
		return inverse;
	};
	
	cls.prototype.apply = function(sequence) {
		if(this.baseLength !== sequence.getNumOfFeatures()) {
			throw new Error("The operation's base length must be equal to the number of features.");
		}
		
		var newFeatures = [];
		var pos = 0, j = 0;
		var comps = this.components;
		var modBuf = [];
		for(var i=0; i<comps.length; i++) {
			var comp = comps[i];
			if(isModify(comp)) {
				modBuf.push(comp.modify);
			} else if(comp.retain !== undefined) {
				for(var k=0;k<comp.retain;k++) {
					newFeatures[j++] = sequence.features[pos + k].copy();
				}
				for(var k=0;k<modBuf.length;k++) {
					if(modBuf[k].rename !== undefined) {
						newFeatures[j-comp.retain].name = modBuf[k].rename;
					}
					if(modBuf[k].moveStart !== undefined) {
						newFeatures[j-comp.retain].start += modBuf[k].moveStart;
					}
					if(modBuf[k].moveEnd !== undefined) {
						newFeatures[j-comp.retain].end += modBuf[k].moveEnd;
					}
				}
				pos += comp.retain;
				modBuf = [];
			} else if(comp.insert !== undefined) {
				newFeatures[j++] = comp.insert.copy();
				for(var k=0;k<modBuf.length;k++) {
					if(modBuf[k].rename !== undefined) {
						newFeatures[j-1].name = modBuf[k].rename;
					}
					if(modBuf[k].moveStart !== undefined) {
						newFeatures[j-1].start += modBuf[k].moveStart;
					}
					if(modBuf[k].moveEnd !== undefined) {
						newFeatures[j-1].end += modBuf[k].moveEnd;
					}
				}
				modBuf = [];
			} else if(comp['delete'] !== undefined) {
				pos += comp['delete'];
				modBuf = [];
			} else {
				console.error("Invalid operation component type.");
			}
		}
		/*for(var i=0; i<comps.length; i++) {
			var comp = comps[i];
			if(comp.retain !== undefined) {
				for(var k=0;k<comp.retain;k++) {
					newFeatures[j++] = sequence.features[pos + k].copy();
				}
				pos += comp.retain;
			} else if(comp.insert !== undefined) {
				newFeatures[j++] = comp.insert.copy();
			} else if(comp['delete'] !== undefined) {
				pos += comp['delete'];
			} else if(comp.rename !== undefined) {
				newFeatures[j-1].name = comp.rename;
			} else if(comp.moveStart !== undefined) {
				newFeatures[j-1].start += comp.moveStart;
			} else if(comp.moveEnd !== undefined) {
				newFeatures[j-1].end += comp.moveEnd;
			} else {
				console.error("Invalid operation component type.");
			}
		}*/
		
		return newFeatures;
	};
	
	cls.transform = function(op1, op2) {
		if (op1.baseLength !== op2.baseLength) {
	      throw new Error("Both operations have to have the same base length");
	    }
		
		var comps1 = op1.components;
		var comps2 = op2.components;
		var op1prime = new FeatureOperation();
		var op2prime = new FeatureOperation();
		var i1 = 0, i2 = 0;
		var c1 = 0, c2 = 0;
		//while(i1<comps1.length && i2<comps2.length) {
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
				op1prime.modify(comp1.modify);
				op2prime.modify(comp2.modify);
				if(comp1.modify.rename !== undefined &&
						comp2.modify.rename !== undefined) {
					op2prime.rename(comp1.modify.rename);
				}
				i1++;
				i2++;
				continue;
			}
			
			/*if(isRename(comp1) && isRename(comp2)) {
				op1prime.rename(comp1.rename);
				i1++;
				i2++;
				continue;
			} 
			
			if(isRename(comp1)) {
				op1prime.rename(comp1.rename);
				i1++;
				continue;
			}
			if(isMoveStart(comp1)) {
				op1prime.moveStart(comp1.moveStart);
				i1++;
				continue;
			}
			if(isMoveEnd(comp1)) {
				op1prime.moveEnd(comp1.moveEnd);
				i1++;
				continue;
			}*/
			
			if(isModify(comp1)) {
				op1prime.modify(comp1.modify);
				i1++;
				continue;
			}
			
			if(isInsert(comp1)) {
				op1prime.insert(comp1.insert);
				op2prime.retain(1); // Because currently only 1 feature can be inserted at a time.
				i1++;
				continue;
			}
			
			/*if(isRename(comp2)) {
				op2prime.rename(comp2.rename);
				i2++;
				continue;
			}
			if(isMoveStart(comp2)) {
				op2prime.moveStart(comp2.moveStart);
				i2++;
				continue;
			}
			if(isMoveEnd(comp2)) {
				op2prime.moveEnd(comp2.moveEnd);
				i2++;
				continue;
			}*/
			
			if(isModify(comp2)) {
				op2prime.modify(comp2.modify);
				i2++;
				continue;
			}
			
			if(isInsert(comp2)) {
				op1prime.retain(1); // Because currently only 1 feature can be inserted at a time.
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
	cls.compose = function(op1, op2) {
		if(op1.targetLength !== op2.baseLength) {
			throw new Error("The base length of the second operation has to be the target length of the first operation.");
		}
		
		var comps1 = op1.components;
		var comps2 = op2.components;
		var op = new FeatureOperation();
		var i1 = 0, i2 = 0;
		var c1 = 0, c2 = 0;
		while(true) {
			var comp1 = comps1[i1];
			var comp2 = comps2[i2];
			if(comp1===undefined && comp2===undefined) {
				break;
			}
			
			/**
			 * Almost definitely something wrong with the modify stuff.
			 * CHANGE LATER.
			 */
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
	
	return cls;
})();



if(typeof module === 'object') {
	module.exports = {
		MachineOperation: MachineOperation,
		BpOperation: BpOperation,
		FeatureOperation: FeatureOperation
	};
}












































