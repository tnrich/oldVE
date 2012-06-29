
/**
 * GenbankOriginKeyword class. 
 * Class for GenbankOriginKeyword. Specifically for the Origin/Sequence part of the Genbank file
 * @author Diana Wong
 * @author Timothy Ham (original author)
 */

Ext.define("Teselagen.bio.parsers.GenbankOriginKeyword", {
	/* */
	extend: "Teselagen.bio.parsers.Keyword",

	/**
	 * Creates a new GenbankLocusKeyword from inData.
	 * @param {String} sequence
	 */
	constructor: function (inData) {
		var that = this;
		that.keyword = "ORIGIN";

		if (inData) {
			var sequence	= inData.sequence;
			//var keyword		= inData.keyword;
			//var value		= inData.value;
		} else {
			var sequence = "";
			//var keyword;
			//var value;
		}
		/**
		 * Get sequence
		 * @returns {String} sequence
		 */
		this.getSequence = function() {
			return sequence;
		}
		/**
		 * Set sequence
		 * @param {String} pSequence
		 */
		this.setSequence = function(pSequence) {
			sequence = pSequence;
		}
		/**
		 * Append more sequence to the sequence property
		 * @param {String} line
		 */
		this.appendSequence = function(line) {
			sequence += line;
		}
		/**
		 * Converts this GenbankOriginKeyword to Genbank file format string
		 * @returns {String}
		 */
		this.toString = function() {
			if ( sequence === undefined || sequence === "" ) {
				return "NO ORIGIN";
			}

			var line = "";

			line += "ORIGIN".rpad(" ", 12);
			if ( that.value != null) {
				line += that.value + "\n";
			} else {
				line += "\n";
			}

			for (var i=0 ; i < sequence.length; i=i+60) {
				var ind = i+1;
				var ind2 = (""+ind).lpad(" ", 9);
				line += ind2;

				for (var j=i; j < i+60; j=j+10) {
					line += " " + sequence.substring(j,j+10);
				}
				line += "\n";
			}

			return line;

		}
		/**
		 * Converts to JSON format.
		 * @param {Object} json
		 */
		this.toJSON = function() {
			json = {
					keyword: that.keyword,
					sequence: sequence
			}
			return json;
		}



		return this;
	}

});