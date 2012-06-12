
    /**
    * GenbankFeatureKeyword class 
    * @description 
    * @author DWong
    */

Ext.define('Teselagen.biojs.bio.parsers.GenbankFeatureKeyword', {
	/* */
	extend: 'Teselagen.biojs.bio.parsers.GenbankKeyword',
	/* 
	 * @constructor
	 * @param */
	constructor: function () {
		this.pubname = "feature";
		return this;
    }

});