
    /**
    * GenbankKeyword class 
    * @description Superclass of all keywords, i.e. Locus, Features, Origin, and standard Keywords (e.g. Accession, Version).
    * @author DWong
    */

Ext.define('Teselagen.biojs.bio.parsers.GenbankKeyword', {
	/* */
    
	/* 
	 * @constructor
	 * @param */
	constructor: function () {
		this.pubname = "keyword";
		
		var myKeyword;
		var myValue;
		var mySubKeywords; //This is under Vector (?)
		
		
		this.getKeyword = function() {
			return this.myKeyword;
		}
		this.setKeyword = function(keyword) {
			this.myKeyword = keyword;
		}
		
		this.getValue = function() {
			return this.myValue;
		}
		this.setValue = function(value) {
			this.myValue = value;
		}
		
		this.getSubKeywords = function() {
			return this.mySubKeywords;
		}
		this.setSubKeywords = function(subKeywords) {
			this.mySubKeywords = subKeywords;
		}
		
		return this;
    }

});