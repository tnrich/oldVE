

Ext.define("Teselagen.bio.sequence.dna.DigestionFragment", {
	requires: ["Teselagen.bio.enzymes.RestrictionEnzyme"],

	constructor: function (inData) {
		if (inData) {
			var start = inData.start || 0;
			var end = inData.end || 0;
			var length = inData._length || 0;
			var startRE = inData.startRE || null;
			var endRE = inData.endRE || null;
		} else {
			throw Ext.create("Teselagen.bio.BioException", {
				message: "Incorrect arguments provided"
			});
		}

		this.getStart = function(){
			return start;
		}

		this.setStart = function (pStart){
			start = pStart;
		}

		this.getEnd = function(){
			return this.end;
		}

		this.setEnd = function(pEnd){
			end = pEnd;
		}

		this.getLength = function(){
			return _length;
		}

		this.setLength = function(pLength){
			_length = pLength;
		}

		this.getStartRE = function(){
			return startRE;
		}

		this.setStartRE = function(pStartRE){
			startRE = pStartRE;
		}

		this.getEndRE = function(){
			return endRE;
		}

		this.setEndRE = function(pEndRE){
			endRE = pEndRE;
		}
		return this;
	}
});