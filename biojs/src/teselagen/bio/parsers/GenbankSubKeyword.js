
/**
 * GenbankSubKeyword class 
 * Class for SubKeywords not defined by GenbankFeatureElements (Qualifier and Location).
 * @author Diana Wong
 * @author Timothy Ham (original author)
 */

Ext.define("Teselagen.bio.parsers.GenbankSubKeyword", {
	/* */

	/**
	 * Creates a new GenbankSubKeywords from inData.
	 * @param {Object} inData
	 * @param {String} keyword
	 * @param {String} value
	 */
	constructor: function (inData) {
		var that = this;

		if (inData) {
			var keyword   = inData.keyword;
			var value = inData.value;
		} else {
			var keyword;
			var value;
		}
		/**
		 * Get keyword
		 */
		this.getKeyword = function() {
			return keyword;
		}
		/**
		 * Set keyword
		 */
		this.setKeyword = function(pKeyword) {
			keyword = pKeyword;
		}
		/**
		 * Get value
		 */
		this.getValue = function() {
			return value;
		}
		/**
		 * Set value
		 */
		this.setValue = function(pValue) {
			value = pValue;
		}
		/**
		 * Appends pValue to existing value property
		 * @param {String} pVal
		 */
		this.appendValue = function(pVal) {
			value += pVal;
		}
		
		/**
		 * Converts this GenbankSubKeywords to Genbank file format string
		 */
		this.toString = function() {
			var width = 80-12;
			var line = "  " + keyword;
			//line = line.lpad(" ", 2); // + this.value;
			line = line.rpad(" ", 12);
			
			line += value;
			/*line += value.substring(0,width)

			for (var i=width; i<value; i=i+width) {
				line += value.substring(i,width);
			}*/

			return line;
		}
		
		/**
		 * Converts to JSON format. Overloads for JSON.stringify()
		 */
		this.toJSON = function() {
			var json = {
					keyword: keyword,
					value: value
			}
			return json;
		}
		
		
		return this;
	}

});