/**
* @class Teselagen.bio.sequence.dna.DigestionFragment
* Digestion fragment holder. See Teselagen.bio.tools.DigestionCalculator.
* 
* @author Micah Lerner
* @author Joanna Chen (original author)
*/
Ext.define("Teselagen.bio.sequence.dna.DigestionFragment", {
	requires: ["Teselagen.bio.enzymes.RestrictionEnzyme"],

	/**
	* Contructor
	* 
	* @param start Fragment start position
	* @param end Fragment start position
	* @param length Fragment length
	* @param startRE Fragment start restriction enzyme
	* @param endRE Fragment end restriction enzyme
	*/
	constructor: function (inData) {
		if (inData) {
			var start = inData.start || 0;
			var end = inData.end || 0;
			var length = inData.length || 0;
			var startRE = inData.startRE || null;
			var endRE = inData.endRE || null;
		} else {
			Teselagen.bio.BioException.raise("Arguments needed");
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
		 * @method setStart
		 * @param {Integer} pStart set pStart
		 */
		this.setStart = function (pStart){
			start = pStart;
		}
		
		/**
		 * Returns end
		 * @method getEnd
		 * @return {Integer} returns pEnd
		 */
		this.getEnd = function(){
			return end;
		}

		/**
		 * Sets end
		 * @method setEnd
		 * @param {Integer} pEnd sets pEnd
		 */
		this.setEnd = function(pEnd){
			end = pEnd;
		}

		/**
		 * Returns _length
		 * @method getLength
		 * @return {Integer} Returns _length
		 */
		this.getLength = function(){
			return length;
		}

		/**
		 * Sets pLength
		 * @method setLength
		 * @param {Integer} pLength sets pLength
		 */
		this.setLength = function(pLength){
			length = pLength;
		}

		/**
		 * Returns Start Restriction Enzyme
		 * @method getStartRE
		 * @return {RestrictionEnzyme} Returns start restriction enzyme
		 */
		this.getStartRE = function(){
			return startRE;
		}

		/**
		 * Sets start restriction enzyme
		 * @method setStartRE
		 * @param {RestrictionEnzyme} pStartRE sets start restriction Enzyme
		 */
		this.setStartRE = function(pStartRE){
			startRE = pStartRE;
		}

		/**
		 * Returns End Restriction Enzyme
		 * @method getEndRE
		 * @return {RestrictionEnzyme} returns end restriction enzyme
		 */
		this.getEndRE = function(){
			return endRE;
		}

		/**
		 * Sets end Restriction Enzyme
		 * @method setEndRE
		 * @param {RestrictionEnzyme} pEndRE sets end restriction enzyme
		 */
		this.setEndRE = function(pEndRE){
			endRE = pEndRE;
		}
		
		return this;
	}
});
