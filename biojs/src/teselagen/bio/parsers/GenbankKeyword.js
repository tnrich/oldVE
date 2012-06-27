
/**
 * GenbankKeyword class 
 * @description Superclass of all keywords, i.e. Locus, Features, Origin, and standard Keywords (e.g. Accession, Version).
 * @author Diana Wong
 * @author Timothy Ham (original author)
 */

Ext.define("Teselagen.bio.parsers.GenbankKeyword", {
	/* */

	/* 
	 * @constructor
	 * @param */

	config: {
		keyword: null,
		value: null,
		subKeywords: null,

		/*toJsonString: function() {
			return JSON.stringify(this, null, '  ');
		}*/
	},



	constructor: function (inData) {
		var that = this;

		if (inData) {
			this.keyword = inData.keyword;
			this.value = inData.value;
			this.subKeywords = inData.subKeywords;
		}

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
		
		this.addSubKeyword = function(subkey) {
			if (this.subKeywords === undefined) {
				//console.log("BLAH");
				this.subKeywords = [];
			}
			this.subKeywords.push(subkey);
		}
		
		this.appendValue = function(pVal) {
			value += pVal;
		}
		
		this.getLastSubKeyword = function() {
			if (this.subKeywords.length > 0) {
				return this.subKeywords[this.subKeywords.length-1];
			} else {
				return null;
			}
		}
		
		this.toString = function() {
			var width = 80-12;
			var line = this.keyword.rpad(" ", 12); // + this.value;
			line += this.value.substring(0,width)

			for (var i=width; i<this.value; i=i+width) {
				line += this.value.substring(i,width);
			}
			if (this.subKeywords !== undefined) {
				line += "\n";
				for (var i=0; i < this.subKeywords.length; i++) {
					line += this.subKeywords[i].toString();
					if (i<this.subKeywords.length - 1) { 
						line += "\n";
					}
				}
			}

			return line;
		}

		/*this.toJSON = function() {
			return null;
		}*/

		return this;
	}

});