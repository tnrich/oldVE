
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
			if (featureQualifier === undefined ) {
				featureQualifier = [];
			}
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
			var line = "     " + key.rpad(" ", 16);
			var loc = "";
			var qual = "";
			//line += strand;
			for (var i=0; i < featureLocation.length; i++) {
				loc += featureLocation[i].toString();
				if (i<featureLocation.length - 1) { 
					loc += ",";
				}
			}
			if (join) { 
				loc = "join(" + loc + ")"; 
			}
			if (complement) {
				loc = "complement(" + loc + ")"; 
			}

			for (var i=0; i < featureQualifier.length; i++) {
				qual += featureQualifier[i].toString();
				if (i<featureQualifier.length - 1) { 
					qual += "\n";
				}
			}

			line = line + loc + "\n" + qual;
			return line;
		}

		this.toJSON = function() {
			var json = {
					key: key,
					strand: strand
			}
			
			if (featureLocation !== undefined && featureLocation.length > 0) {
				json["location"] = [];
				for (var i = 0; i<featureLocation.length; i++) {
					json["location"].push(featureLocation[i]);
				}
			}
			
			if ( featureQualifier !== undefined && featureQualifier.length > 0) {
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