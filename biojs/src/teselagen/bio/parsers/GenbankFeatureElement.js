
/**
 * GenbankFeatureElement class 
 * Class for GenbankFeatureElement. Stored in an array in GenbankFeaturesKeyword
 * An Element (e.g. CDS, mRNA, promoter, etc) spans some part of the sequence.
 * Its indices are defined by GenbankFeatureLocation and it's annotations by GenbankFeatureQualifier. 
 * @author Diana Wong
 * @author Timothy Ham (original author)
 */
//Ext.require("Teselagen.bio.util.StringUtil");

Ext.define("Teselagen.bio.parsers.GenbankFeatureElement", {
    requires: ["Teselagen.bio.util.StringUtil"],
    
    /**
     * Creates a new GenbankFeatureElement from inData.
     * There can be multiple featureQualifier and featureLocations for each FeatureElement.
     * @param {String} keyword
     * @param {String} strand
     * @param {Boolean} complement
     * @param {Boolean} join
     * @param [GenbankFeatureQualifier] featureQualifer
     * @param [GenbankFeatureLocation] featureLoation
     */
    constructor: function (inData) {
        var keyword;
        var strand;
        var complement = false;
        var join = false;
        var featureQualifier;
        var featureLocation;

        if (inData) {
            keyword = inData.keyword;
            strand = inData.strand;
            complement = inData.complement;
            join = inData.join;
            featureQualifier = [];
            featureLocation = [];
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
         * Get Last GenbankFeatureElement in features array
         * @returns {GenbankFeatureElement} element
         */
        this.getLastFeatureQualifier = function() {
            if (featureQualifier.length > 0) {
                return featureQualifier[featureQualifier.length-1];
            } else {
                return null;
            }
        }

        /**
         * Add a single GenbankFeatureQualifier to the featureQualifier array
         * @param {GenbankFeatureQualifer} qual
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
         * Add a single GenbankFeatureLocation to the featureLocation array
         * @param {GenbankFeatureLocation} pLoc
         */
        this.addFeatureLocation = function(pLoc) {
            if (featureLocation === undefined ) {
                featureLocation = [];
            }
            featureLocation.push(pLoc);
        }

        /**
         * Get Complement
         * @return {Boolean}
         */
        this.getComplement = function() {
            return complement;
        }

        /**
         * Set Complement to be true or false
         * @param {Boolean}
         */
        this.setComplement = function(bool) {
            complement = bool;
        }

        /**
         * Get Join
         * @return {Boolean}
         */
        this.getJoin = function() {
            return join;
        }
        /**
         * Set Join to be true or false
         * @param {Boolean}
         */
        this.setJoin = function(bool) {
            join = bool;
        }
        /**
         * Converts this GenbankLocusKeyword to Genbank file format string
         * @returns {String}
         */
        this.toString = function() {
            var line = "     " + keyword.rpad(" ", 16);
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
         * @returns {Object}
         */
        this.toJSON = function() {
            var json = {
                    keyword: keyword,
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