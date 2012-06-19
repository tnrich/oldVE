
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
	constructor: function () {
		
		var sequence;
		var keyword;
		var value;
		
		this.getSequence = function() {
			return sequence;
		}
		this.setSequence = function(pSequence) {
			sequence = pSequence;
		}
		
		this.appendSequence = function(line) {
			sequence += line;
		}
		
		return this;
    }

});