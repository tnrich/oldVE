
/**
 * @class Teselagen.bio.parsers.GenbankFeatureElement 
 *
 * Stores an array of Feature Elements in {@link Teselagen.bio.parsers.GenbankFeaturesKeyword}. 
 * An Element (e.g. CDS, mRNA, promoter, etc) spans some part of the sequence.
 * Its indices are defined by GenbankFeatureLocation and it's annotations by 
 * {@link Teselagen.bio.parsers.GenbankFeatureQualifier}. 
 * 
 * Go to {@link http://www.insdc.org/documents/feature_table.html#3.4} for specifications of Genbank file. 
 * This class does not assumes all locations of one feature are complement or not complement, join or not join.
 * This means: 
 * 		complement(join(2691..4571,4918..5163))
 * is acceptable, and:
 * 		join(complement(4918..5163),complement(2691..4571))
 * is also acceptable, but assumes every location (i.e. the feature) is a complement. However:
 * 		join(complement(4918..5163),2691..4571)
 * would not be acceptable and all location pairs would be stored as complement.  (Is this biologically possible?)
 * 
 * @author Diana Wong
 * @author Timothy Ham (original author)
 */

Ext.define("Teselagen.bio.parsers.GenbankFeatureElement", {
    requires: ["Teselagen.bio.util.StringUtil"],

    /**
     * Creates a new GenbankFeatureElement from inData.
     * There can be multiple featureQualifier and featureLocations for each FeatureElement.
     * @param {String} keyword e.g. source, CDS. Equivalent to a "Type"
     * @param {String} strand 1 for normal read, -1 for complement
     * @param {Boolean} complement On complementary strand
     * @param {Boolean} join Location is not continuous
     * @param {Teselagen.bio.parsers.GenbankFeatureQualifier} [featureQualifer] Array of GenbankFeatureQualifiers
     * @param {Teselagen.bio.parsers.GenbankFeatureLocation} [featureLocation] Array of GenbankFeatureLocations
     * @returns {Teselagen.bio.parsers.GenbankFeatureElement}
     * @memberOf GenbankFeatureElement
     */
    constructor: function (inData) {
        var keyword;
        var strand;
        var complement = false;
        var join = false;
        var featureQualifier;
        var featureLocation;

        if (inData !== undefined) {
            keyword = inData.keyword || null;
            strand = inData.strand || null;
            complement = inData.complement || false;
            join = inData.join || false;
            featureQualifier = inData.featureQualifier || [];
            featureLocation = inData.featureLocation || [];
        }
        /**
         * Get keyword
         * @returns {String} keyword
         */
        this.getKeyword = function() {
            return keyword;
        }
        /**
         * Set keyword
         * @param {String} keyword
         */
        this.setKeyword = function(pKeyword) {
            keyword = pKeyword;
        }
        /**
         * Get strand
         * @returns {String} strand
         */
        this.getStrand = function() {
            return strand;
        }
        /**
         * Set strand
         * @param {String} strand
         */
        this.setStrand = function(pStrand) {
            strand = pStrand;
        }
        /**
         * Get featureQualifier
         * This should be featureQualifiers since it is an array.
         * @returns {Teselagen.bio.parsers.GenbankFeatureQualifier[]} featureQualifer An array of Feature Qualifiers
         */
        this.getFeatureQualifier = function() {
            return featureQualifier;
        }
        /**
         * Set featureQualifier
         * This should be featureQualifiers since it is an array.
         * @param {Teselagen.bio.parsers.GenbankFeatureQualifier[]} featureQualifer An array of Feature Qualifiers
         */
        this.setFeatureQualifier = function(pFeatureQualifier) {
            featureQualifier = pFeatureQualifier;
        }

        /**
         * Get Last GenbankFeatureElement in features array
         * @returns {Teselagen.bio.parsers.GenbankFeatureElement} element
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
         * @param {Teselagen.bio.parsers.GenbankFeatureQualifer} qualifier
         */
        this.addFeatureQualifier= function(pQual) {
            if (featureQualifier === undefined ) {
                featureQualifier = [];
            }
            featureQualifier.push(pQual);
        }
        /**
         * Get featureLocation
         * This should be featureLocations since it is an array.
         * @returns {Teselagen.bio.parsers.GenbankFeatureLocation[]} featureLocation An array of Feature Locations
         */
        this.getFeatureLocation = function() {
            return featureLocation;
        }
        /**
         * Get featureLocation
         * This should be featureLocations since it is an array.
         * @param {Teselagen.bio.parsers.GenbankFeatureLocation[]} featureLocation An array of Feature Locations
         */
        this.setFeatureLocation = function(pFeatureLocation) {
            featureLocation = pFeatureLocation;
        }
        /**
         * Add a single GenbankFeatureLocation to the featureLocation array
         * @param {Teselagen.bio.parsers.GenbankFeatureLocation} location
         */
        this.addFeatureLocation = function(pLoc) {
            if (featureLocation === undefined ) {
                featureLocation = [];
            }
            featureLocation.push(pLoc);
        }

        /**
         * Get Complement
         * @return {Boolean} complement
         */
        this.getComplement = function() {
            return complement;
        }

        /**
         * Set Complement to be true or false
         * @param {Boolean} complement
         */
        this.setComplement = function(bool) {
            complement = bool;
        }

        /**
         * Get Join
         * @return {Boolean} join
         */
        this.getJoin = function() {
            return join;
        }
        /**
         * Set Join to be true or false
         * @param {Boolean} join
         */
        this.setJoin = function(bool) {
            join = bool;
        }
        return this;
    },

    /**
     * Within a Feature, locates the "label" in JbeiSeqXml model and "name" in
     * SequenceManager and FeaturedDNA data models.
     * This searches for the first Qualifier with the name (in this order):
     *
     * @param 
     * @returns {String} name Name of Qualifier as used in Sequence Manager, FeaturedDNA, and JbeiSeq
     */
    findLabel: function() {
        var name = "no_name";
        for (var i=0; i < this.getFeatureQualifier().length; i++) {
            var tmpName = this.getFeatureQualifier()[i].getName();

            if (tmpName === "label" | tmpName === "ApEinfo_label" ||
                    tmpName === "note" || tmpName === "gene" || 
                    tmpName === "organism" || tmpName === "name" ) {

                    name = this.getFeatureQualifier()[i].getValue();
                }
            }
        return name;
    },

    /**
     * Converts this GenbankLocusKeyword to Genbank file format string
     * @returns {String} genbankString
     */
    toString: function() {
        var keyword = this.getKeyword();
        var featureLocation = this.getFeatureLocation();
        var featureQualifier = this.getFeatureQualifier();
        var join = this.getJoin()
        var complement = this.getComplement();
        
        var line = "     " + Teselagen.StringUtil.rpad(keyword, " ", 16);
        var loc = "";
        var qual = "";
        
        for (var i=0; i < featureLocation.length; i++) {
            loc += featureLocation[i].toString();
            if (i<featureLocation.length - 1) { 
                loc += ",";
            } else {
                //loc += "\n";
            }
        }
        if (join === true) {  //explicit true because if complement is passed in a string, this won't work
            loc = "join(" + loc + ")"; 
        }
        if (complement === true) {
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
    },

    /**
     * Converts to JSON format.
     * @returns {Object} json
     */
    toJSON: function() {
        var keyword = this.getKeyword();
        var strand = this.getStrand();
        var featureLocation = this.getFeatureLocation();
        var featureQualifier = this.getFeatureQualifier();
        var join = this.getJoin()
        var complement = this.getComplement();
        
        var json = {
                keyword: keyword,
                //complement: complement,
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


});