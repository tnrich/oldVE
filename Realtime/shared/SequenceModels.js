

Sequence = (function () {
	'use strict';
	
	// constructor
	var cls = function() {
		this.sequence = "";
		this.features = [];
	};
	
	cls.prototype.getSequenceLength = function() {
		return this.sequence.length;
	};
	
	cls.prototype.getNumOfFeatures = function() {
		return this.features.length;
	};
	
	cls.prototype.addFeature = function(feature) {
		this.features.push(feature);
	};
	
	cls.prototype.copy = function() {
		var copy = new Sequence();
		copy.sequence = this.sequence;
		for(var i=0;i<this.features.length;i++) {
			copy.features.push(this.features[i].copy());
		}
		return copy;
	};
	
	cls.prototype.equals = function(sequence) {
		if(!(this.sequence===sequence.sequence)) return false;
		for(var i=0;i<this.features.length;i++) {
			if(!this.features[i].equals(sequence.features[i])) return false;
		}
		return true;
	};
	
	cls.fromJson = function(seqJson) {
		var seq = new Sequence();
		seq.sequence = seqJson.sequence;
		for(var i=0;i<seqJson.features.length;i++) {
			var c = seqJson.features[i];
			var f = new Feature(c.name, c.start, c.end);
			seq.features[i] = f;
		}
		
		return seq;
	};
	
	return cls;
})();


Feature = (function () {
	'use strict';
	
	// constructor
	var cls = function(name, start, end) {
		if(name===undefined) this.name = "";
		else this.name = name;
		if(start===undefined) this.start = 0;
		else this.start = start;
		if(end===undefined) this.end = 0;
		else this.end = end;
	};
	
	cls.prototype.copy = function() {
		return new Feature(this.name, this.start, this.end);
	};
	
	cls.prototype.equals = function(feature) {
		return this.name===feature.name && this.start===feature.start
			&& this.end===feature.end;
	};
	
	return cls;
})();


if(typeof module === 'object') {
	module.exports = {
		Sequence: Sequence,
		Feature: Feature
	};
}




































