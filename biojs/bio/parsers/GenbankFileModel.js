
    /**
    * GenbankFileModel class 
    * @description 
    * @author DWong
    */

Ext.define('Teselagen.biojs.bio.parsers.GenbankFileModel', {
	/* */
	
	
	config: {
		locus: null,
		origin: null,
		features: null,
		keywords: null
		//var accession;
		//var version;
		//var keywordsTag;
		//var keywords;
		//var features;
		
		// Automatically sets up:
			//myGenbankFileModel.getLocus() and myGenbankFileModel.setLocus("new locus")
		
	},
    
	/* 
	 * @constructor
	 * @param */
	constructor: function () {
		//var locus;
		//var origin;
		//var features;
		var accession;
		var version;
		var keywordsTag;
		var keywords;
		
		locus	= Ext.create('Teselagen.biojs.bio.parsers.GenbankLocusKeyword');
		origin	= Ext.create('Teselagen.biojs.bio.parsers.GenbankOriginKeyword');
		//features= Ext.create('Teselagen.biojs.bio.parsers.GenbankFeaturesKeyword');
		//keywords= Ext.create('Teselagen.biojs.bio.parsers.Genbank');
		return this;
    }

});