
    /**
    * GenbankOriginKeyword class 
    * @description 
    * @author DWong
    */

Ext.define('Teselagen.biojs.bio.parsers.GenbankOriginKeyword', {
	/* */
	extend: 'Teselagen.biojs.bio.parsers.GenbankKeyword',
	/* 
	 * @constructor
	 * @param */
	constructor: function () {
		this.pubname = "origin";
		
		var mySequence;
		
		this.getSequence = function() {
			return this.mySequence;
		}
		this.setSequence = function(sequence) {
			this.mySequence = sequence;
		}
		
		return this;
    }

});