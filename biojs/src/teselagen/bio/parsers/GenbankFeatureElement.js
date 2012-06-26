
/**
 * GenbankFeatureElement class 
 * @description 
 * @author Diana Wong
 * @author Timothy Ham (original author)
 */

Ext.define("Teselagen.bio.parsers.GenbankFeatureElement", {
	/* */

	/* 
	 * @constructor
	 * @param
	 * There can be multiple featureQualifier and featureLocations for each FeatureElement */
	constructor: function (inData) {

		if (inData) {
			var key = inData.key;
			var strand = inData.strand;
			var complement = inData.complement;
			var join = inData.join;
			var featureQualifier = [];
			var featureLocation = [];
			
		} else {
			var key;
			var strand;
			var complement;
			var join;
			var featureQualifier;
			var featureLocation;
		}

		this.getKeyword = function() {
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
		
		this.addFeatureQualifier= function(pQual) {
			featureQualifier.push(pQual);
		}
		
		this.getFeatureLocation = function() {
			return featureLocation;
		}
		this.setFeatureLocation = function(pFeatureLocation) {
			featureLocation = pFeatureLocation;
		}
		this.addFeatureLocation = function(pLoc) {
			featureLocation.push(pLoc);
		}
		
		
		this.setComplement = function(bool) {
			complement = bool;
		}
		this.setJoin = function(bool) {
			join = bool;
		}

		this.toString = function() {
			var line = "     " + key.rpad(" ", 21);
			line += strand;
			return line;
		}

		this.toJSON = function() {
			var json = {
					key: key,
					strand: strand
			}
			
			if (featureLocation !== undefined) {
				json["location"] = [];
				for (var i = 0; i<featureLocation.length; i++) {
					json["location"].push(featureLocation[i]);
				}
			}
			
			if ( featureQualifier !== undefined ) {
				json["qualifier"] =[];
				for (var i = 0; i<featureQualifier.length; i++) {
					json["qualifier"].push(featureQualifier[i]);
				}
			}
			return json;
		}



		return this;
	}

});