
    /**
    * GenbankKeyword class 
    * @description Superclass of all keywords, i.e. Locus, Features, Origin, and standard Keywords (e.g. Accession, Version).
    * @author Diana Wong
    * @author Timothy Ham (original author)
    */

Ext.define('Teselagen.bio.parsers.GenbankKeyword', {
	/* */
    
	/* 
	 * @constructor
	 * @param */
	
	config: {
		keyword: null,
		value: null,
		subKeywords: null,
		
		toJsonString: function() {
			return JSON.stringify(this, null, '  ');
		}
	},
	
	
	
	constructor: function () {
		var that = this;
		
		/*var keyword;
		var value;
		var subKeywords; //This is under Vector (?)
		
		
		this.getKeyword = function() {
			return keyword;
		}
		this.setKeyword = function(pKeyword) {
			keyword = pKeyword;
		}
		
		this.getValue = function() {
			return value;
		}
		this.setValue = function(pValue) {
			value = pValue;
		}
		
		this.getSubKeywords = function() {
			return subKeywords;
		}
		this.setSubKeywords = function(pSubKeywords) {
			subKeywords = pSubKeywords;
		}*/
		
		
		/*this.toJsonString = function() {
			return JSON.stringify(that, null, '  ');
		}*/
		
		return this;
    }

});