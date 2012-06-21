
    /**
    * Genbank class
    * @description This class sets up an empty shell object with Genbank information that is later populated by GenbankFormat.js
    * @author Diana Wong
    * @author Timothy Ham (original author of GenbankFileModel.js)
    */

Ext.define('Teselagen.bio.parsers.Genbank', {
	/* */
	
	
	config: {
		// THESE SHOULD BE PRIVATE BUT THE AUTO CONFIG STUFF MAKES IT EASY...
		// DONT USE THIS. VARIABLES BECOME PUBLIC.
		/*locus: Ext.create('Teselagen.bio.parsers.GenbankLocusKeyword'),
		origin: Ext.create('Teselagen.bio.parsers.GenbankOriginKeyword'),
		features: Ext.create('Teselagen.bio.parsers.GenbankFeatureKeyword'),
		keywords: null*/
		//var accession;
		//var version;
		//var keywordsTag;
		//var keywords;
		//var features;

		
		// Automatically sets up:
			//myGenbank.getLocus() 
			//myGenbank.setLocus("new locus")
		
	},
	/*
	applyLocus: function(locus) {
        if (!Ext.isString(locus) || locus.length === 0) {
            alert('Error: LOCUS must be a valid non-empty string');
        }
        else {
            return locus;
        }
    },*/
    
	/* 
	 * @constructor
	 * @param */
	constructor: function () {
		var that = this;

		var locus		= Ext.create('Teselagen.bio.parsers.GenbankLocusKeyword');
		var accession;//	= Ext.create('Teselagen.bio.parsers.GenbankKeyword');// This is stupid, why not just put it in the keywords Array?
		var version;//		= Ext.create('Teselagen.bio.parsers.GenbankKeyword', {keyword: version)}; // This is stupid, why not just put it in the keywords Array?
		var features;//	= Ext.create('Teselagen.bio.parsers.GenbankFeatureKeyword');
		var origin		= Ext.create('Teselagen.bio.parsers.GenbankOriginKeyword');
		
		var keywordsTag	= new Array();	// List of Keywords being used
		var keywords	= new Array();	// Keyword Objects other than the ones here (ie locus, accession, features, origin, etc)	
		
		
		// ======== Getter and Setter function ========//
		//THESE DO NOT CHECK FOR NULL VALUES
		/* @function
         * @param {}
         * @returns {GenbankLocusKeyword} 
         */
		this.getLocus = function() {
			//console.log('get locus');
			return locus;
		}
		/* @function
         * @param {GenbankLocusKeyword}
         * @returns
         */
		this.setLocus = function(pLocus) {
			//console.log('set locus');
			locus = pLocus;
		}
		
		this.getOrigin = function(pOrigin) {
			return origin;
		}
		this.setOrigin = function(pOrigin) {
			origin = pOrigin;
		}
		
		this.getFeatures = function() {
			return getFeatures;
		}
		this.setFeatures = function(pFeatures) {
			features = pFeatures;
		}
		
		this.getAccession = function() {
			return accession;
		}
		this.setAccession = function(pAccession) {
			accession = pAccession;
		}
		
		this.getVersion = function() {
			return version;
		}
		this.set = function(pVersion) {
			version = pVersion;
		}

		this.getKeywordsTag = function() {
			return keywordsTag;
		}
		this.setKeywordsTag = function(pKeywordsTag) {
			keywordsTag = pKeywordsTag;
		}
		
		this.getKeywords = function() {
			return keywords;
		}
		this.setKeywords = function(pKeywords) {
			keywords = pKeywords;
		}
		
		this.addKeywordsTag = function(pAddKey) {
			keywordsTag.push(pAddKey);
		}
		this.addKeywords = function(pAddKey) {
			keywords.push(pAddKey);
		}
		
		/*this.get = function() {
			return ;
		}
		this.set = function() {
			 = ;
		}*/
		
		this.toString = function() {
			var gbStr = "";
			
			gbStr += locus.toString() + "\n";
			gbStr += "ACCESSION".rpad(" ", 12) + accession + "\n";
			gbStr += "VERSION".rpad(" ",12) + version + "\n";
			//gbStr += "KEYWORDS".rpad(" ", 12) + keywordsTag + "\n";
			//gbStr += references.toString();
			gbStr += origin.toString();
			
			
			return gbStr;
		}
		this.toString2 = function() {
			var gbStr = "";
			//console.log(kewords.length);
			for (var i=0; i < keywordsTag.length; i++) {
				key = keywordsTag[i];
				console.log(key);
				//key = keywords[i].getKeyword();
				//gbStr += key + "\n";
				
				switch (key) {
					case "LOCUS":
						gbStr += locus.toString() + "\n";
						break;
					case "DEFINITION":
						break;
					/*case "ACCESSION":
						//gbStr += key.rpad(" ",12) + accession.getValue() + "\n";
						//gbStr += (accession.getKeyword()).rpad(" ", 12) + accession.getValue() + "\n";
						break;
					case "VERSION":
						gbStr += "VERSION".rpad(" ",12) + version + "\n";
						break;
					case "KEYWORDS":
						gbStr += "KEYWORDS".rpad(" ", 12) + keywordsTag + "\n";
						break;
					case "SOURCE":
					*/
					case "REFERENCE":
						//gbStr += references.toString();
						break;
					case "FEATURES":
						break;
					case "ORIGIN":
						gbStr += origin.toString();
						break;
					default:
						//gbStr += keywords[i].toString();
						break;
				}
			}
			
			return gbStr;
		}
		
		this.toJSON = function() {
			var json = "not done yet with this overloaded function";
			
			return json;
		}
		
		return this;
    }

});