
    /**
    * GenbankLocusKeyword class 
    * @description 
    * @author Diana Wong
    * @author Timothy Ham (original author)
    */

Ext.define('Teselagen.bio.parsers.GenbankLocusKeyword', {
	/* */
	extend: 'Teselagen.bio.parsers.GenbankKeyword',
    
	/* 
	 * @constructor
	 * @param */
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
		
		
		this.getLocusName = function() {
			return locusName;
		}
		this.setLocusName = function(pLocusName) {
			locusName = pLocusName;
		}
		
		this.getStrandType = function() {
			return strandType;
		}
		this.setStrandType = function(pStrandType) {
			strandType = pStrandType;
		}
		
		this.getSequenceLength = function() {
			return sequenceLength;
		}
		this.setSequenceLength = function(pSequenceLength) {
			sequenceLength = pSequenceLength;
		}
		
		this.getNaType = function() {
			return naType;
		}
		this.setNaType = function(pNaType) {
			naType = pNaType;
		}
		
		this.getLinear = function() {
			return linear;
		}
		this.setLinear = function(pLinear) {
			linear = pLinear;
		}
		
		this.getCircular = function() {
			return circular;
		}
		this.setCircular = function(pCircular) {
			circular = pCircular;
		}
		
		this.getDivisionCode = function() {
			return divisionCode;
		}
		this.setDivisionCode = function(pDivisionCode) {
			divisionCode = pDivisionCode;
		}
		
		this.getDate = function() {
			return date;
		}
		this.setDate = function(pDate) {
			date = pDate;
		}
		
		
		this.toString = function () {
			var line = "LOCUS".rpad(" ", 12);
			line += locusName.rpad(" ", 16);
			line += " "; // T.H line 2778 of GenbankFormat.as col 29 space
			line += sequenceLength.lpad(" ", 11);
			line += " bp "; // col 41
			line += (strandType + "-").lpad(" ", 3);
			line += naType.rpad(" ",6);
			line += "  ";
			
			if (linear === true) {
				line += "linear  ";
			} else {
				line += "circular";
			}
			
			line += " "; //col 64
			if (divisionCode != null) {
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