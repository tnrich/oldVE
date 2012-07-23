
/**
 * @class Teselagen.bio.parsers.Keyword
 *
 * Super class for all Keywords that have a keyword-value pairs. 
 * Not used directly by Genbank.
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
	    /**
	     * @cfg {String} keyword
	     */
		keyword: null,
		/**
         * @cfg {String} value
         */
		value: null
	},
	/**
	 * Creates a new Keyword from inData. General super class for GenbankKeywords to inherit from.
	 * @param {String} keyword
	 * @param {String} value
	 * @memberOf Keyword
	 */
	constructor: function (inData) {
		var that = this;
		
		/**
		 *  @property {String} keyword
		 *  @property {String} value
		 */
		if (inData) {
			this.keyword = inData.keyword || null;
			this.value = inData.value || null;
		}
		
		/*
		 * Appends to existing parameter, value. THIS HAS BEEN MOVED TO CHILDREN.
		 * @param {String} value
		 *
		this.appendValue = function(pVal) {
			this.value += pVal;
		}*/
		
		return this;
	}

});