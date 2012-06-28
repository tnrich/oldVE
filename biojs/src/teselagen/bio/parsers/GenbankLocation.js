
/**
 * GenbankLocation class 
 * Class for GenbankFeatureQualifier. Follows the 'complement(join(>start...end))' format
 * @author Diana Wong
 * @author Timothy Ham (original author)
 */
Ext.define("Teselagen.bio.parsers.GenbankLocation", {
	/* */

	/**
	 * Creates a new GenbankFeatureQualifier from inData.
	 * @param {Object} inData
	 * @param {IntString} start
	 * @param {IntString} end
	 */
	constructor: function (inData) {
		var that = this;
		
		if (inData) {
			var start	= inData.start;
			var end		= inData.end;
		} else {
			var start;
			var end;
		}
		
		/**
		 * Get start
		 */
		this.getStart = function() {
			return start;
		}
		/**
		 * Set start
		 */
		this.setStart = function(pStart) {
			start = pStart;
		}
		/**
		 * Get end
		 */
		this.getEnd = function() {
			return end;
		}
		/**
		 * Set end
		 */
		this.setEnd = function(pEnd) {
			end = pEnd;
		}
		
		/**
		 * Converts this GenbankLocusKeyword to Genbank file format string
		 */
		this.toString = function() {
			var line = start + ".." + end;
			return line;
		}
		/**
		 * Converts to JSON format.
		 */
		this.toJSON = function() {
			var json = {
				start: start,
				end: end
			}
			return json;
		}
		return this;
    }

});