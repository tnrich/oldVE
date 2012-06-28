
/**
 * GenbankLocusKeyword class 
 * Class for GenbankLocusKeyword. Specificfor parsing the Locus line.
 * @author Diana Wong
 * @author Timothy Ham (original author)
 */

Ext.define("Teselagen.bio.parsers.GenbankLocusKeyword", {
	/* */
	extend: "Teselagen.bio.parsers.GenbankKeyword",

	/**
	 * Creates a new GenbankLocusKeyword from inData.
	 * @param {Object} inData
	 * @param {String} locusName 
	 * @param {String} sequenceLength
	 * @param {String} strandType
	 * @param {String} naType
	 * @param {String} linear
	 * @param {String} divisionCode
	 * @param {String} date
	 */
	constructor: function (inData) {
		var that = this;

		if (inData ) {
			//console.log(JSON.stringify(inData, null, " "));
			var locusName 		= inData.locusName;
			var sequenceLength 	= inData.sequenceLength;
			var strandType		= inData.strandType;
			var naType			= inData.naType;
			var linear			= inData.linear;
			var circular;//		= inData.circular;
			var divisionCode	= inData.divisionCode;
			var date			= inData.date;
		} else {
			var locusName;
			var sequenceLength;
			var strandType;
			var naType;
			var linear; //boolean; cannot designate Tandem
			var circular; //boolean
			var divisionCode;
			var date;
		}
		/**
		 * Get locusName
		 */
		this.getLocusName = function() {
			return locusName;
		}
		/**
		 * Set locusName
		 */
		this.setLocusName = function(pLocusName) {
			locusName = pLocusName;
		}
		/**
		 * Get strandType
		 */
		this.getStrandType = function() {
			return strandType;
		}
		/**
		 * Set strandType
		 */
		this.setStrandType = function(pStrandType) {
			strandType = pStrandType;
		}
		/**
		 * Get sequenceLength
		 */
		this.getSequenceLength = function() {
			return sequenceLength;
		}
		/**
		 * Set SequenceLength
		 */
		this.setSequenceLength = function(pSequenceLength) {
			sequenceLength = pSequenceLength;
		}
		/**
		 * Get naType
		 */
		this.getNaType = function() {
			return naType;
		}
		/**
		 * Set naType
		 */
		this.setNaType = function(pNaType) {
			naType = pNaType;
		}
		/**
		 * Get linear
		 */
		this.getLinear = function() {
			return linear;
		}
		/**
		 * Set linear
		 */
		this.setLinear = function(pLinear) {
			linear = pLinear;
		}
		
		this.getCircular = function() {
			return circular;
		}
		this.setCircular = function(pCircular) {
			circular = pCircular;
		}
		/**
		 * Get divisionCode
		 */
		this.getDivisionCode = function() {
			return divisionCode;
		}
		/**
		 * Set DivisionCode
		 */
		this.setDivisionCode = function(pDivisionCode) {
			divisionCode = pDivisionCode;
		}
		/**
		 * Get date
		 */
		this.getDate = function() {
			return date;
		}
		/**
		 * Set Date
		 */
		this.setDate = function(pDate) {
			date = pDate;
		}
		
		/**
		 * Converts this GenbankLocusKeyword to Genbank file format string
		 */
		this.toString = function () {
			var tmp;
			
			var line = "LOCUS".rpad(" ", 12);
			line += locusName.rpad(" ", 16);
			line += " "; // T.H line 2778 of GenbankFormat.as col 29 space
			line += sequenceLength.lpad(" ", 11);
			line += " bp "; // col 41
			if (strandType !== "") {
				tmp =  strandType + "-";
			} else {
				tmp = "";
			}
			line += tmp.lpad(" ", 3);
			line += naType.rpad(" ",6);
			line += "  ";

			if (linear === true) {
				line += "linear  ";
				//line += "        ";
			} else {
				line += "circular";
			}

			line += " "; //col 64
			if (divisionCode !== undefined) {
				line += divisionCode.rpad(" ", 3);
			} else {
				line.rpad(" ", 3);
			}
			line += " "; // col 68
			// DOES NOT PARSE DATE USEFULLY ORIGINALLY!
			line += date;
			//line += "\n";

			return line;
		}
		/**
		 * Converts to JSON format.
		 */
		this.toJSON = function() {
			var json;
			json = {
					keyword: that.keyword,
					locusName: locusName,
					sequenceLength: sequenceLength,
					strandType: strandType,
					naType: naType,
					linear: linear,
					divisionCode: divisionCode,
					date: date
			};
			//JSON.stringify(json, null, "  ")
			return json;
		}


		return this;
	}

});