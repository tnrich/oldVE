
    /**
    * GenbankFileModel class
    * @description This class sets up an empty shell object with Genbank information that is later populated by GenbankFormat.js
    * @author Diana Wong
    * @author Timothy Ham (original author)
    */

Ext.define('Teselagen.bio.parsers.GenbankFileModel', {
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
		var accession;
		var version;
		var keywordsTag;
		var keywords;
		
		locus	= Ext.create('Teselagen.bio.parsers.GenbankLocusKeyword');
		origin	= Ext.create('Teselagen.bio.parsers.GenbankOriginKeyword');
		features= Ext.create('Teselagen.bio.parsers.GenbankFeatureKeyword');
		//keywords= Ext.create('Teselagen.bio.parsers.Genbank');
		
		
		// ======== Getter and Setter function ========//
		//THESE DO NOT CHECK FOR NULL VALUES
		this.getAccession = function() {
			return this.accession;
		}
		this.setAccession = function(pAccession) {
			this.accession = pAccession;
		}
		
		this.getVersion = function() {
			return this.version;
		}
		this.set = function(pVersion) {
			this.version = pVersion;
		}

		this.getKeywordsTag = function() {
			return this.keywordsTag;
		}
		this.setKeywordsTag = function(pKeywordsTag) {
			this.keywordsTag = pKeywordsTag;
		}
		
		/*this.get = function() {
			return this.;
		}
		this.set = function() {
			this. = ;
		}*/
		
		
		return this;
    }

});