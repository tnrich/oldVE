
    /**
    * GenbankFileModel class
    * @description This class sets up an empty shell object with Genbank information that is later populated by GenbankFormat.js
    * @author DWong
    */

Ext.define('Teselagen.biojs.bio.parsers.GenbankFileModel', {
	/* */
	
	
	config: {
		// THESE SHOULD BE PRIVATE BUT THE AUTO CONFIG STUFF MAKES IT EASY...
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
			//myGenbankFileModel.getLocus() 
			//myGenbankFileModel.setLocus("new locus")
		
	},
    
	/* 
	 * @constructor
	 * @param */
	constructor: function () {
		//var locus;
		//var origin;
		//var features;
		var myAccession;
		var myVersion;
		var myKeywordsTag;
		var myKeywords;
		
		locus	= Ext.create('Teselagen.biojs.bio.parsers.GenbankLocusKeyword');
		origin	= Ext.create('Teselagen.biojs.bio.parsers.GenbankOriginKeyword');
		features= Ext.create('Teselagen.biojs.bio.parsers.GenbankFeatureKeyword');
		//keywords= Ext.create('Teselagen.biojs.bio.parsers.Genbank');
		
		
		// ======== Getter and Setter function ========//
		//THESE DO NOT CHECK FOR NULL VALUES
		this.getAccession = function() {
			return this.myAccession;
		}
		this.setAccession = function(accession) {
			this.myAccession = accession;
		}
		
		this.getVersion = function() {
			return this.myVersion;
		}
		this.set = function(version) {
			this.myVersion = version;
		}

		this.getKeywordsTag = function() {
			return this.myKeywordsTag;
		}
		this.setKeywordsTag = function(keywordsTag) {
			this.myKeywordsTag = keywordsTag;
		}
		
		/*this.get = function() {
			return this.my;
		}
		this.set = function() {
			this.my = ;
		}*/
		
		
		return this;
    }

});