
/**
  * Genbank class
  * Sets up an empty shell object with Genbank information and methods that is later populated by GenbankFormat.js
  * @author Diana Wong
  * @author Timothy Ham (original author of GenbankFileModel.js)
  */

Ext.define("Teselagen.bio.parsers.Genbank", {
	    
	/** 
	 * Creates new Genbank
	 * @param 
	 * */
	constructor: function () {
		var that = this;
		/*
		var locus;			//= Ext.create('Teselagen.bio.parsers.GenbankLocusKeyword');
		var accession;		//= Ext.create('Teselagen.bio.parsers.GenbankKeyword');// This is stupid, why not just put it in the keywords Array?
		var version;		//= Ext.create('Teselagen.bio.parsers.GenbankKeyword', {keyword: version)}; // This is stupid, why not just put it in the keywords Array?
		var features;		//= Ext.create('Teselagen.bio.parsers.GenbankFeatureKeyword');
		var origin;			//= Ext.create('Teselagen.bio.parsers.GenbankOriginKeyword');
		*/
		var keywordsTag	= new Array();	// List of Keywords being used
		/**
		 * @property [GenbankKeywords] Array of all the GenbankKeyword objects in a Genbank class
		 * (also includes GenbankLocusKeyword, GenbankFeaturesKeyword, GenbankOriginKeyword which inherit from GenbankKeyword).
		 */
		var keywords	= new Array();	
		
		
		// ======== Getter and Setter function ========//
		/**
		 * Finds and gets Keyword
		 * @param {String} key Keyword name. (e.g. "LOCUS", or "ORIGIN")
		 * @return {GenbankKeyword}
		 */
		this.findKeyword = function(key) {
			return find(key);
		}
		
		function find(key) {
			var entry;
			for (var i=0; i<keywords.length; i++) {
				if (keywords[i].keyword === key) {
					entry = keywords[i];
				}
			}
			return entry;
		}
		
		//THESE DO NOT CHECK FOR NULL VALUES
		/**
		 * Same as GB.findKeyword("LOCUS")
         * @param
         * @returns {GenbankLocusKeyword} 
         */
		this.getLocus = function() {
			//return locus;
			return find("LOCUS");
		}
		/**
		 * Same as GB.addKeyword(GenbankLocusKeyword}
         * @param {GenbankLocusKeyword} pLocus
         * @returns
         */
		this.setLocus = function(pLocus) {
			//console.log('set locus');
			//locus = pLocus;
			keywords.push(pLocus);
		}
		/**
		 * Same as GB.findKeyword("ORIGIN")
         * @param {}
         * @returns {GenbankOriginKeyword} 
         */
		this.getOrigin = function(pOrigin) {
			//return origin;
			return find("ORIGIN");
		}
		/**
		 * Same as GB.addKeyword(GenbankOriginKeyword}
         * @param {GenbankOriginKeyword}
         * @returns
         */
		this.setOrigin = function(pOrigin) {
			//origin = pOrigin;
			keywords.push(pOrigin);
		}
		/**
		 * Same as GB.findKeyword("FEATURES")
         * @param {}
         * @returns {GenbankFeaturesKeyword} 
         */
		this.getFeatures = function() {
			//return getFeatures;
			return find("FEATURES");
		}
		/**
		 * Same as GB.addKeyword(GenbankFeaturesKeyword}
         * @param {GenbankFeaturesKeyword}
         * @returns
         */
		this.setFeatures = function(pFeatures) {
			//features = pFeatures;
			keywords.push(pFeatures);
		}
		/*
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
		}*/
		/**
		 * Gets KeywordsTag
		 */
		this.getKeywordsTag = function() {
			return keywordsTag;
		}
		/**
		 * Sets KeywordsTag
		 */
		this.setKeywordsTag = function(pKeywordsTag) {
			keywordsTag = pKeywordsTag;
		}
		/**
		 * Get Keywords, an array
		 * @return keywords:ArrayList
		 */
		this.getKeywords = function() {
			return keywords;
		}
		/**
		 * Set Keywords, an array
		 * @param keywords:ArrayList
		 */
		this.setKeywords = function(pKeywords) {
			keywords = pKeywords;
		}
		/**
		 * Add a single GenbankKeyword to Genbank.keywords
         * @param {GenbankKeyword}
         * @returns 
         */
		this.addKeyword = function(pAddKeyword) {
			keywords.push(pAddKeyword);
		}
		/**
		 * Gets the last GenbankKeyword on the Kewords ArrayList
		 * @return {GenbankKeyword}
		 */
		this.getLastKeyword = function() {
			return keywords[keywords.length-1];
		}
		
		/**
		 * Add a single keyword name (String) to Genbank.KeywordTag
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
		
		this.toString2 = function() {
			var gbStr = "";
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