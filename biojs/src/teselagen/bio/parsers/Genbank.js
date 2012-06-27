
    /**
    * Genbank class
    * @description This class sets up an empty shell object with Genbank information that is later populated by GenbankFormat.js
    * @author Diana Wong
    * @author Timothy Ham (original author of GenbankFileModel.js)
    */

Ext.define("Teselagen.bio.parsers.Genbank", {
	/* */
	    
	/* 
	 * @constructor
	 * @param */
	constructor: function () {
		var that = this;

		var locus;//		= Ext.create('Teselagen.bio.parsers.GenbankLocusKeyword');
		var accession;//	= Ext.create('Teselagen.bio.parsers.GenbankKeyword');// This is stupid, why not just put it in the keywords Array?
		var version;//		= Ext.create('Teselagen.bio.parsers.GenbankKeyword', {keyword: version)}; // This is stupid, why not just put it in the keywords Array?
		var features;//	= Ext.create('Teselagen.bio.parsers.GenbankFeatureKeyword');
		var origin;//		= Ext.create('Teselagen.bio.parsers.GenbankOriginKeyword');
		
		var keywordsTag	= new Array();	// List of Keywords being used
		var keywords	= new Array();	// Keyword Objects other than the ones here (ie locus, accession, features, origin, etc)	
		
		
		// ======== Getter and Setter function ========//
		
		this.findKeyword = function(key) {
			return find(key);
		}
		
		function find(key) {
			var entry;
			for (var i=0; i<keywords.length; i++) {
				if (keywords[i].keyword === key) {
					entry = keywords[i];
					//console.log(entry);
				}
			}
			return entry;
		}
		
		//THESE DO NOT CHECK FOR NULL VALUES
		/* @function Same as GB.findKeyword("LOCUS")
         * @param {}
         * @returns {GenbankLocusKeyword} 
         */
		this.getLocus = function() {
			//return locus;
			return find("LOCUS");
		}
		/* @function Same as GB.addKeyword(GenbankLocusKeyword}
         * @param {GenbankLocusKeyword}
         * @returns
         */
		this.setLocus = function(pLocus) {
			//console.log('set locus');
			//locus = pLocus;
			keywords.push(pLocus);
		}
		
		this.getOrigin = function(pOrigin) {
			//return origin;
			return find("ORIGIN");
		}
		this.setOrigin = function(pOrigin) {
			//origin = pOrigin;
			keywords.push(pOrigin);
		}
		
		this.getFeatures = function() {
			//return getFeatures;
			return find("FEATURES");
		}
		this.setFeatures = function(pFeatures) {
			//features = pFeatures;
			keywords.push(pFeatures);
		}
		
		this.getAccession = function() {
			//return accession;
			return find("ACCESSION");
		}
		this.setAccession = function(pAccession) {
			//accession = pAccession;
			keywords.push(pAccession);
		}
		
		this.getVersion = function() {
			//return version;
			return find("VERSION");
		}
		this.setVersion = function(pVersion) {
			//version = pVersion;
			keywords.push(pVersion);
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
		/* @function Add a single GenbankKeyword to Genbank.Keywords
         * @param {GenbankKeyword}
         * @returns 
         */
		this.addKeyword = function(pAddKeyword) {
			keywords.push(pAddKeyword);
		}
		this.getLastKeyword = function() {
			return keywords[keywords.length-1];
		}
		
		/* @function Add a single keyword String to Genbank.KeywordTag
         * @param {String}
         * @returns 
         */
		this.addKeywordTag = function(pAddKeywordsTag) {
			keywordsTag.push(pAddKeywordsTag);
		}
		
		
		/*this.get = function() {
			return ;
		}
		this.set = function() {
			 = ;
		}*/
		
		this.toStringBADWAY = function() {
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
						gbStr += find("LOCUS").toString() + "\n";
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
						gbStr += find("ORIGIN").toString();
						break;
					default:
						//gbStr += keywords[i].toString();
						break;
				}
			}
			
			return gbStr;
		}
		
		this.toString = function() {
			var gbStr = "";
			var entry;
			for (var i=0; i < keywords.length; i++) {
				entry = keywords[i];
				console.log(entry);
				gbStr += keywords[i].toString() + "\n";
				//console.log(Ext.getClassName(keywords[i]));
			}
			gbStr += "//";
			return gbStr;
		}
		
		
		this.toJSON = function() {
			var json = new Object();
			for (var i=0; i < keywords.length; i++) {
				var key = keywords[i].getKeyword();
				json[key] = keywords[i];
			}
			
			return json;
		}
		
		return this;
    }

});