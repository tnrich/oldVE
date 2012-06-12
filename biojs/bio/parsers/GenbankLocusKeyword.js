
    /**
    * GenbankLocusKeyword class 
    * @description 
    * @author DWong
    */

Ext.define('Teselagen.biojs.bio.parsers.GenbankLocusKeyword', {
	/* */
	extend: 'Teselagen.biojs.bio.parsers.GenbankKeyword',
    
	/* 
	 * @constructor
	 * @param */
	constructor: function () {
		
		var locusName;
		var strandType;
		var sequenceLength;
		var naType;
		var linear; //boolean
		var divisionCode;
		var date;
		
		
		
		this.pubname = "locus";
		return this;
    }

});