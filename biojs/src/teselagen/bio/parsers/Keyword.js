
/**
 * Keyword class 
 * Super class for all Keywords that have a keyword-value pairs. Not used directly by Genbank
 * @author Diana Wong
 */

Ext.define("Teselagen.bio.parsers.Keyword", {
	/* */

	/**
	 * @cfg {Object} config
	 * @cfg {String} keyword
	 * @cfg {String} value
	 */
	config: {
		keyword: null,
		value: null
	},
	/**
	 * Creates a new Keyword from inData. General super class for GenbankKeywords to inherit from.
	 * @param {Object} inData
	 * @param {String} keyword
	 * @param {String} value
	 */
	constructor: function (inData) {
		var that = this;
		
		/**
		 *  @property {String} keyword
		 *  @property {String} value
		 */
		if (inData) {
			this.keyword = inData.keyword;
			this.value = inData.value;
		}
		
		/*
		 * Get keyword
		 * @returns {String} keyword
		 *
		this.getKeyword = function() {
			return this.keyword;
		}
		/*
		 * Set keyword
		 * @param {String} pKeyword
		 *
		this.setKeyword = function(pKeyword) {
			this.keyword = pKeyword;
		}
		/*
		 * Get value
		 * @returns {String} value
		 *
		this.getValue = function() {
			return this.value;
		}
		/*
		 * Set value
		 * @param {String} pValue
		 *
		this.setValue = function(pValue) {
			this.value = pValue;
		}*/
		
		
		/**
		 * Appends to existing parameter, value.
		 * @param {String} pVal
		 */
		this.appendValue2 = function(pVal) {
			this.value += pVal;
		}
		
		return this;
	}

});