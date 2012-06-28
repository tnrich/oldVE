
/**
 * GenbankFeatureElement class 
 * Class for GenbankFeatureElement. An Element (e.g. CDS, mRNA, promoter, etc) spans some part of the sequence.
 * It's indices are defined by GenbankLocation and it's annotations by GenbankFeatureQualifier. 
 * @author Diana Wong
 * @author Timothy Ham (original author)
 */

Ext.define("Teselagen.bio.parsers.GenbankFeatureElement", {
	/* */

	/**
	 * Creates a new GenbankFeatureElement from inData.
	 * There can be multiple featureQualifier and featureLocations for each FeatureElement.
	 * @param {Object} inData
	 * @param {String} key
	 * @param {String} strand
	 * @param {Boolean} complement
	 * @param {Boolean} join
	 * @param [GenbankFeatureQualifier] featureQualifer
	 * @param [GenbankLocation] featureLoation
	 */
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
		/**
		 * Get keyword
		 */
		this.getKeyword = function() {
			return key;
		}
		/**
		 * Set keyword
		 */
		this.setKey = function(pKey) {
			key = pKey;
		}
		/**
		 * Get strand
		 */
		this.getStrand = function() {
			return strand;
		}
		/**
		 * Set strand
		 */
		this.setStrand = function(pStrand) {
			strand = pStrand;
		}
		/**
		 * Get featureQualifier
		 */
		this.getFeatureQualifier = function() {
			return featureQualifier;
		}
		/**
		 * Set featureQualifier
		 */
		this.setFeatureQualifier = function(pFeatureQualifier) {
			featureQualifier = pFeatureQualifier;
		}
		
		/**
		 * Add a single GenbankFeatureQualifier to the featureQualifier array
		 * @param {GenbankFeatureQualifer} pQual
		 */
		this.addFeatureQualifier= function(pQual) {
			if (featureQualifier === undefined ) {
				featureQualifier = [];
			}
			featureQualifier.push(pQual);
		}
		/**
		 * Get featureLocation
		 */
		this.getFeatureLocation = function() {
			return featureLocation;
		}
		/**
		 * Get featureLocation
		 */
		this.setFeatureLocation = function(pFeatureLocation) {
			featureLocation = pFeatureLocation;
		}
		/**
		 * Add a single GenbankLocation to the featureLocation array
		 * @param {GenbankLocation} pLoc
		 */
		this.addFeatureLocation = function(pLoc) {
			if (featureLocation === undefined ) {
				featureLocation = [];
			}
			featureLocation.push(pLoc);
		}
		
		/**
		 * Set Complement to be true or false
		 */
		this.setComplement = function(bool) {
			complement = bool;
		}
		/**
		 * Set Join to be true or false
		 */
		this.setJoin = function(bool) {
			join = bool;
		}
		/**
		 * Converts this GenbankLocusKeyword to Genbank file format string
		 */
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
		
		/**
		 * Converts to JSON format.
		 */
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