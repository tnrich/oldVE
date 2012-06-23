
    /**
    * GenbankOriginKeyword class 
    * @description 
    * @author Diana Wong
    * @author Timothy Ham (original author)
    */

Ext.define('Teselagen.bio.parsers.GenbankOriginKeyword', {
	/* */
	extend: 'Teselagen.bio.parsers.GenbankKeyword',
	
	/* 
	 * @constructor
	 * @param */
	constructor: function (inData) {
		var that = this;
		
		if (inData) {
			var sequence	= inData.sequence;
			//var keyword		= inData.keyword;
			//var value		= inData.value;
		} else {
			var sequence = "";
			//var keyword;
			//var value;
		}
		
		this.getSequence = function() {
			return sequence;
		}
		this.setSequence = function(pSequence) {
			sequence = pSequence;
		}
		
		this.appendSequence = function(line) {
			//if (sequence) {
				sequence += line;
			//} else {
			//	sequence = line;
			//}
			
		}
		
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