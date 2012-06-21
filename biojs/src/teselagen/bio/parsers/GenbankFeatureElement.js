
    /**
    * GenbankFeatureElement class 
    * @description 
    * @author Diana Wong
    * @author Timothy Ham (original author)
    */

Ext.define('Teselagen.bio.parsers.GenbankFeatureElement', {
	/* */

	/* 
	 * @constructor
	 * @param */
	constructor: function () {
		var key;
		var strand;
		var featureQualifier;
		var featureLocation;
		
		this.getKey = function() {
			return key;
		}
		this.setKey = function(pKey) {
			key = pKey;
		}

		this.getStrand = function() {
			return strand;
		}
		this.setStrand = function(pStrand) {
			strand = pStrand;
		}
		
		this.getFeatureQualifier = function() {
			return featureQualifier;
		}
		this.setFeatureQualifier = function(pFeatureQualifier) {
			featureQualifier = pFeatureQualifier;
		}
		
		this.getFeatureLocation = function() {
			return FeatureLocation;
		}
		this.setFeatureLocation = function(pFeatureLocation) {
			featureLocation = pFeatureLocation;
		}

		return this;
    }

});