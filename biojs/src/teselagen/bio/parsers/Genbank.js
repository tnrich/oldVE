
/**
  * Genbank. 
  * Sets up an empty shell object with Genbank information and methods that is later populated by {@link Teselagen.bio.parsers.GenbankManager#parseGenbankFile}.
  * @author Diana Wong
  * @author Timothy Ham (original author of GenbankFileModel.js)
  */

Ext.define("Teselagen.bio.parsers.Genbank", {
	    
	/** 
	 * Creates new Genbank
	 * @returns {Genbank}
	 * @memberOf Genbank
	 * */
	constructor: function () {
		var that = this;
		/*
		var locus;			//= Ext.create('Teselagen.bio.parsers.GenbankLocusKeyword');
		var accession;		//= Ext.create('Teselagen.bio.parsers.GenbankKeyword');// This is stupid, why not just put it in the keywords Array?
		var version;		//= Ext.create('Teselagen.bio.parsers.GenbankKeyword', {keyword: version)}; // This is stupid, why not just put it in the keywords Array?
		var features;		//= Ext.create('Teselagen.bio.parsers.GenbankFeaturesKeyword');
		var origin;			//= Ext.create('Teselagen.bio.parsers.GenbankOriginKeyword');
		*/
		/**
         * @property {String[]} keywordTags Array of all the GenbankKeyword names in a Genbank class. 
         * THIS MAY BE DELETED SINCE SEARCHING FOR KEYWORDS[i].keyword WILL RESULT IN ALL THE KEYWORDS IN THE GB FILE.
         */
		var keywordsTag	= new Array();	// List of Keywords being used
		/**
		 * @property {GenbankKeywords[]} keywords Array of all the GenbankKeyword objects in a Genbank class
		 * (which also includes GenbankLocusKeyword, GenbankFeaturesKeyword, GenbankOriginKeyword which inherit from GenbankKeyword).
		 */
		var keywords	= new Array();	
		
		
		// ======== Getter and Setter function ========//
		/**
		 * Finds and gets Keyword
		 * @param {String} key Keyword name. (e.g. "LOCUS", or "ORIGIN")
		 * @return {GenbankKeyword} entry
		 */
		this.findKeyword = function(key) {
			return find(key);
		}
		
		function find(key) {
			var entry = null;
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
         * @returns {GenbankLocusKeyword}
         */
		this.getLocus = function() {
			//return locus;
			return find("LOCUS");
		}
		/**
		 * Same as GB.addKeyword(GenbankLocusKeyword}
         * @param {GenbankLocusKeyword} locus
         */
		this.setLocus = function(pLocus) {
			//locus = pLocus;
			keywords.push(pLocus);
		}
		/**
		 * Same as GB.findKeyword("ORIGIN")
         * @returns {GenbankOriginKeyword}
         */
		this.getOrigin = function() {
			//return origin;
			return find("ORIGIN");
		}
		/**
		 * Same as GB.addKeyword(GenbankOriginKeyword}
         * @param {GenbankOriginKeyword} origin
         */
		this.setOrigin = function(pOrigin) {
			//origin = pOrigin;
			keywords.push(pOrigin);
		}
		/**
		 * Same as GB.findKeyword("FEATURES")
         * @returns {GenbankFeaturesKeyword}
         */
		this.getFeatures = function() {
			//return getFeatures;
			return find("FEATURES");
		}
		/**
		 * Same as GB.addKeyword(GenbankFeaturesKeyword}
         * @param {GenbankFeaturesKeyword} features
         */
		this.setFeatures = function(pFeatures) {
			//features = pFeatures;
			keywords.push(pFeatures);
		}
		/**
		 * Gets KeywordsTag
		 * @return {[String]} keywordsTag
		 */
		this.getKeywordsTag = function() {
			return keywordsTag;
		}
		/**
		 * Sets KeywordsTag
		 * @param {String} keywordsTag
		 */
		this.setKeywordsTag = function(pKeywordsTag) {
			keywordsTag = pKeywordsTag;
		}
		/**
		 * Get Keywords, an array
		 * @return {[GenbankKeywords]} keywords:ArrayList
		 */
		this.getKeywords = function() {
			return keywords;
		}
		/**
		 * Set Keywords, an array
		 * @param {[GenbankKeywords]} keywords:ArrayList
		 */
		this.setKeywords = function(pKeywords) {
			keywords = pKeywords;
		}
		/**
		 * Add a single GenbankKeyword to Genbank.keywords
         * @param {GenbankKeyword} keyword
         */
		this.addKeyword = function(pAddKeyword) {
			keywords.push(pAddKeyword);
		}
		/**
		 * Gets the last GenbankKeyword on the Keywords ArrayList
		 * @return {GenbankKeyword}
		 */
		this.getLastKeyword = function() {
			return keywords[keywords.length-1];
		}
		
		/**
		 * Add a single keyword name (String) to Genbank.KeywordTag
         * @param {String} addKeywordsTag
         */
		this.addKeywordTag = function(pAddKeywordsTag) {
			keywordsTag.push(pAddKeywordsTag);
		}
		
		/**
		 * Converts this GenbankSubKeywords to Genbank file format string
		 * @returns {String} gbStr
		 */
		this.toString = function() {
			var gbStr = [];
			var entry;
			for (var i=0; i < keywords.length; i++) {
				entry = keywords[i];
				gbStr.push(keywords[i].toString() + "\n");
			}
			gbStr.push("//");
			return gbStr.join(" ");
		}
		
		/**
		 * Converts to JSON format. Overloads for JSON.stringify()
		 * @returns {Object} json
		 */
		this.toJSON = function() {
			var json = {};
			for (var i=0; i < keywords.length; i++) {
				var key = keywords[i].getKeyword();
				json[key] = keywords[i];
				
				//json.push(keywords[i]); //if you don't want the redundant keywords, but need to change json = []
			}
			
			return json;
		}
		
		return this;
    }

});