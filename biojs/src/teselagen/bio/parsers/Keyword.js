
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
		
		/**
		 * Appends to existing parameter, value. THIS MAY NOT WORK RIGHT NOW.
		 * @param {String} pVal
		 */
		this.appendValue = function(pVal) {
			that.value += pVal;
		}
		
		return this;
	}

});