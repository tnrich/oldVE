
    /**
    * GenbankFeatureKeyword class 
    * @description 
    * @author Diana Wong
    * @author Timothy Ham (original author)
    */

Ext.define('Teselagen.bio.parsers.GenbankFeatureKeyword', {
	/* */
	extend: 'Teselagen.bio.parsers.GenbankKeyword',
	/* 
	 * @constructor
	 * @param */
	constructor: function () {
		var features;
		
		this.getFeatures = function() {
			return features;
		}
		this.setFeatures = function(pFeatures) {
			features = pFeatures;
		}

		return this;
    }

});