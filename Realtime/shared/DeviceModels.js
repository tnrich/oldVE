

Device = (function () {
	'use strict';
	
	var Device = function(name, bins, parts, rules) {
		this.name = name===undefined ? "" : name;
		
		this.bins = bins===undefined ? [] : bins;
		this.parts = parts===undefined ? [] : parts;
		this.rules = rules===undefined ? [] : rules;
		
		this.partIdMap = {};
		for(var i=0;i<this.parts.length;i++) {
			var part = this.parts[i];
			this.partIdMap[part.id+""] = part;
		}
		
		for(var i=0;i<this.bins.length;i++) {
			var bin = this.bins[i];
			for(var j=0;j<bin.cells.length;j++) {
				var cell = bin.cells[j];
				if(cell.phantom !== true && cell.partId !== undefined) {
					cell.part = this.partIdMap[cell.partId+""];
				}
			}
		}
	};
	
	Device.prototype.getNumOfRows = function() {
		if(this.bins.length === 0) { return -1; }
		return this.bins[0].cells.length;
	};
	
	Device.prototype.getNumOfBins = function() {
		return this.bins.length;
	};
	
	Device.prototype.copy = function() {
		var bins = [];
		for(var i=0;i<this.bins.length;i++) {
			bins[i] = this.bins[i].copy();
		}
		
		var parts = [];
		for(var i=0;i<this.parts.length;i++) {
			parts[i] = this.parts[i].copy();
		}
		
		var rules = [];
		for(var i=0;i<this.rules.length;i++) {
			rules[i] = this.rules[i].copy();
		}
		
		var copy = new Device(this.name, bins, parts, rules);
		return copy;
	};
	
	Device.prototype.copyBins = function() {
		var bins = [];
		for(var i=0;i<this.bins.length;i++) {
			bins[i] = this.bins[i].copy();
		}
		return bins;
	};
	
	Device.prototype.copyParts = function() {
		var parts = [];
		for(var i=0;i<this.parts.length;i++) {
			parts[i] = this.parts[i].copy();
		}
		return parts;
	};
	
	Device.prototype.copyRules = function() {
		var rules = [];
		for(var i=0;i<this.rules.length;i++) {
			rules[i] = this.rules[i].copy();
		}
		return rules;
	};
	
	Device.prototype.equals = function(device) {
		if(device.name !== this.name) { return false; }
		
		if(device.bins.length !== this.bins.length) { return false; }
		for(var i=0;i<this.bins.length;i++) {
			if(!device.bins[i].equals(this.bins[i])) { return false; }
		}
		
		if(device.parts.length !== this.parts.length) { return false; }
		for(var i=0;i<this.parts.length;i++) {
			if(!device.parts[i].equals(this.parts[i])) { return false; }
		}
		
		if(device.rules.length !== this.rules.length) { return false; }
		for(var i=0;i<this.rules.length;i++) {
			if(!device.rules[i].equals(this.rules[i])) { return false; }
		}
		
		return true;
	};
	
	Device.prototype.toJson = function(device) {
		return this;
	};
	
	Device.fromJson = function(json) {
		var bins = [];
		var parts = [];
		var rules = [];
		
		for(var i=0;i<json.bins.length;i++) {
			bins.push(Bin.fromJson(json.bins[i]));
		}
		for(var i=0;i<json.parts.length;i++) {
			parts.push(Part.fromJson(json.parts[i]));
		}
		for(var i=0;i<json.rules.length;i++) {
			rules.push(Rule.fromJson(json.rules[i]));
		}
		
		var device = new Device(json.name, bins, parts, rules);
		return device;
	};
	
	return Device;
})();


Bin = (function () {
	'use strict';
	
	var FORWARD = true;
	var REVERSE = false;
	var DEFAULT_ICON = "z";
	
	var Bin = function(name, icon, dsf, dir) {
		this.name = name===undefined ? "" : name;
		this.icon = icon===undefined ? DEFAULT_ICON : icon; // One-character string to be rendered in wingdings.
		this.dsf = dsf===true;
		this.dir = dir!==REVERSE ? FORWARD : REVERSE;
		
		this.cells = [];
	};
	
	Bin.FORWARD = FORWARD;
	Bin.REVERSE = REVERSE;
	
	Bin.prototype.setCells = function(cells) {
		this.cells = cells;
	};
	
	Bin.prototype.getNumOfCells = function() {
		return this.cells.length;
	};
	
	Bin.prototype.copy = function() {
		var copy = new Bin(this.name, this.icon, this.dsf, this.dir);
		for(var i=0;i<this.cells.length;i++) {
			copy.cells.push(this.cells[i].copy());
		}
		return copy;
	};
	
	Bin.prototype.equals = function(bin) {
		var eq = bin.name===this.name && bin.icon===this.icon && bin.dsf===this.dsf && bin.dir===this.dir;
		if(eq === false) { return false; }
		if(bin.cells.length !== this.cells.length) { return false; }
		for(var i=0;i<this.cells.length;i++) {
			if(!bin.cells[i].equals(this.cells[i])) { return false; }
		}
		return true;
	};
	
	Bin.prototype.copyHeader = function() {
		var copy = new Bin(this.name, this.icon, this.dsf, this.dir);
		return copy;
	};
	
	Bin.fromJson = function(json) {
		var bin = new Bin(json.name, json.icon, json.dsf, json.dir);
		for(var i=0;i<json.cells.length;i++) {
			bin.cells.push(Cell.fromJson(json.cells[i]));
		}
		return bin;
	};
	
	return Bin;
})();


Cell = (function () {
	'use strict';
	
	var Cell = function(partId, fas) {
		if(partId===undefined && fas===undefined) { this.phantom = true; } 
		else { this.phantom = false; }
		this.partId = partId;
		this.fas = fas; // Whole number
		
		this.part = undefined; // Pointer to part.
	};
	
	Cell.prototype.copy = function() {
		var copy = new Cell();
		copy.phantom = this.phantom;
		copy.fas = this.fas;
		copy.partId = this.partId;
		copy.part = this.part;
		return copy;
	};
	
	Cell.prototype.equals = function(cell) {
		var eq =
			cell.phantom === this.phantom &&
			cell.fas === this.fas &&
			cell.partId === this.partId;
		
		if(eq === true && cell.part !== this.part) {
			console.warn("The cells only differed by the pointer to a part.");
			return false;
		}
		return eq;
	};
	
	Cell.fromJson = function(json) {
		if(json.phantom === true) {
			return new Cell();
		} else {
			return new Cell(json.partId, json.fas);
		}
	};
	
	Cell.prototype.getPart = function() {
		return this.part;
	};
	
	Cell.prototype.phantomize = function() {
		this.phantom = true;
		this.partId = undefined;
		this.fas = undefined;
		this.part = undefined;
		return this;
	};
	
	Cell.prototype.setPhantom = function(phantom) {
		if(phantom === true) {
			this.phantom = true;
			this.partId = undefined;
			this.fas = undefined;
			this.part = undefined;
		} else {
			this.phantom = false;
		}
		return this;
	};
	
	Cell.prototype.changePartId = function(partId) {
		if(this.phantom !== true && this.partId !== partId) {
			this.partId = partId;
			this.part = undefined;
		}
		return this;
	};
	
	Cell.prototype.setFas = function(fas) {
		if(this.phantom !== true) { this.fas = fas; }
		return this;
	};
	
	return Cell;
})();


Part = (function () {
	'use strict';
	
	var Part = function(id, name) {
		this.id = id;
		this.name = name===undefined ? "" : name;
	};
	
	Part.prototype.copy = function() {
		var copy = new Part(this.id, this.name);
		return copy;
	};
	
	Part.prototype.equals = function(part) {
		return part.id===this.id && part.name===this.name;
	};
	
	Part.fromJson = function(json) {
		return new Part(json.id, json.name);
	};
	
	return Part;
})();


Rule = (function () {
	'use strict';
	
	var Rule = function(name, op1, op2, type) {
		this.name = name===undefined ? "" : name;
		this.op1 = op1;
		this.op2 = op2;
		this.type = type;
	};
	
	Rule.prototype.copy = function() {
		var copy = new Rule(this.name, this.op1, this.op2, this.type);
		return copy;
	};
	
	Rule.prototype.equals = function(rule) {
		return rule.name===this.name && rule.op1===this.op1 && rule.op2===this.op2 && rule.type===this.type;
	};
	
	Rule.fromJson = function(json) {
		return new Rule(json.name, json.op1, json.op2, json.type);
	};
	
	return Rule;
})();



if(typeof module === 'object') {
	module.exports = {
		Device: Device,
		Bin: Bin,
		Cell: Cell,
		Rule: Rule,
		Part: Part
	};
}






















