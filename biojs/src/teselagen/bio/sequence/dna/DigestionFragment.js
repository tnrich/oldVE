

Ext.define("Teselagen.bio.sequence.dna.DigestionFragment", {
	requires: ["Teselagen.bio.enzymes.RestrictionEnzyme"],

	constructor: function (inData) {
		if (inData) {
			var start = inData.start || 0;
			var end = inData.end || 0;
			var length = inData.length || 0;
			var startRE = inData.startRE || null;
			var endRE = inData.endRE || null;
		} else {
			throw Ext.create("Teselagen.bio.BioException", {
				message: "Incorrect arguments provided"
			});
		}

		/**
		 * Returns start
		 * @return {Integer} returns pStart
		 */				
		this.getStart = function(){
			return start;
		}
	
		/**
		 * Sets Start
		 * @param {Integer} pStart set pStart
		 */
		this.setStart = function (pStart){
			start = pStart;
		}
		
		/**
		 * Returns end
		 * @return {Integer} returns pEnd
		 */
		this.getEnd = function(){
			return this.end;
		}

		/**
		 * Sets end
		 * @param {Integer} pEnd sets pEnd
		 */
		this.setEnd = function(pEnd){
			end = pEnd;
		}

		/**
		 * Returns _length
		 * @return {Integer]} Returns _length
		 */
		this.getLength = function(){
			return length;
		}

		/**
		 * Sets pLength
		 * @param {Integer} pLength sets pLength
		 */
		this.setLength = function(pLength){
			length = pLength;
		}

		/**
		 * Returns Start Restriction Enzyme
		 * @return {RestrictionEnzyme} Returns start restriction enzyme
		 */
		this.getStartRE = function(){
			return startRE;
		}

		/**
		 * Sets start restriction enzyme
		 * @param {RestrictionEnzyme} pStartRE sets start restriction Enzyme
		 */
		this.setStartRE = function(pStartRE){
			startRE = pStartRE;
		}

		/**
		 * Returns End Restriction Enzyme
		 * @return {RestrictionEnzyme} returns end restriction enzyme
		 */
		this.getEndRE = function(){
			return endRE;
		}

		/**
		 * Sets end Restriction Enzyme
		 * @param {RestrictionEnzyme} pEndRE sets end restriction enzyme
		 */
		this.setEndRE = function(pEndRE){
			endRE = pEndRE;
		}
		
		return this;
	}
});