
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
		//this.pubname = "origin";
		
		var sequence;
		
		this.getSequence = function() {
			return this.sequence;
		}
		this.setSequence = function(pSequence) {
			this.sequence = pSequence;
		}
		
		return this;
    }

});