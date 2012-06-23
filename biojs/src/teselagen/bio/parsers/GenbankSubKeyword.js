
    /**
    * GenbankSubKeyword class 
    * @description 
    * @author Diana Wong
    * @author Timothy Ham (original author)
    */

Ext.define('Teselagen.bio.parsers.GenbankSubKeyword', {
	/* */

	/* 
	 * @constructor
	 * @param {String, String}
	 */
	constructor: function (inData) {
		var that = this;
		
		if (inData) {
			var key   = inData.key;
			var value = inData.value;
		} else {
			var key;
			var value;
		}
		
		this.getKey = function() {
			return key;
		}
		this.setKey = function(pKeyword) {
			key = pKey;
		}
		
		this.getValue = function() {
			return value;
		}
		this.setValue = function(pValue) {
			value = pValue;
		}

		return this;
    }

});