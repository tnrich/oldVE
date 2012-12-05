
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
 *      complement(join(2691..4571,4918..5163))
 * is acceptable, and:
 *      join(complement(4918..5163),complement(2691..4571))
 * is also acceptable, but assumes every location (i.e. the feature) is a complement. However:
 *      join(complement(4918..5163),2691..4571)
 * would not be acceptable and all location pairs would be stored as complement.  (Is this biologically possible?)
 *
 * @author Diana Wong
 * @author Timothy Ham (original author)
 */

Ext.define("Teselagen.bio.parsers.GenbankFeatureElement", {

    requires: ["Teselagen.bio.util.StringUtil"],

    /**
     * @cfg {Object} config
     * @cfg {String} keyword
     * @cfg {String} strand
     * @cfg {Boolean} complement
     * @cfg {Boolean} join
     * @cfg {Teselagen.bio.parsers.GenbankFeatureQualifier[]} featureQualifier
     * @cfg {Teselagen.bio.parsers.GenbankFeatureLocation[]} featureLocation
     */

    config: {
        keyword: null,
        strand: null,
        complement: false,
        join: false,
        featureQualifier: [],
        featureLocation: []
    },

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

        if (inData !== undefined) {
            this.keyword = inData.keyword || null;
            this.strand = inData.strand || null;
            this.complement = inData.complement || false;
            this.join = inData.join || false;
            this.featureQualifier = inData.featureQualifier || [];
            this.featureLocation = inData.featureLocation || [];
        }
        return this;
    },

    /**
     * Get Last GenbankFeatureElement in features array
     * @returns {Teselagen.bio.parsers.GenbankFeatureElement} element
     */
    getLastFeatureQualifier: function() {
        if (this.featureQualifier.length > 0) {
            return this.featureQualifier[this.featureQualifier.length-1];
        } else {
            return null;
        }
    },

    /**
     * Add a single GenbankFeatureQualifier to the featureQualifier array
     * @param {Teselagen.bio.parsers.GenbankFeatureQualifer} qualifier
     */
    addFeatureQualifier: function(pQual) {
        if (this.featureQualifier === undefined ) {
            this.featureQualifier = [];
        }
        this.featureQualifier.push(pQual);
    },

    /**
     * Add a single GenbankFeatureLocation to the featureLocation array
     * @param {Teselagen.bio.parsers.GenbankFeatureLocation} location
     */
    addFeatureLocation: function(pLoc) {
        if (this.featureLocation === undefined ) {
            this.featureLocation = [];
        }
        this.featureLocation.push(pLoc);
    },

    /**
     * Within a Feature, locates the "label" in JbeiSeqXml model and "name" in
     * SequenceManager and FeaturedDNA data models.
     * This searches for the first Qualifier with the name (in this order):
     *
     * @returns {String} name Name of Qualifier as used in Sequence Manager, FeaturedDNA, and JbeiSeq
     */
    findLabel: function() {
        var name = "no_name";
        for (var i=0; i < this.getFeatureQualifier().length; i++) {
            var tmpName = this.getFeatureQualifier()[i].getName();

            if (tmpName === "label" || tmpName === "name" || tmpName === "ApEinfo_label" ||
                tmpName === "note" || tmpName === "gene" || tmpName === "organism" ) {

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
        
        var line = "     " + Teselagen.StringUtil.rpad(this.keyword, " ", 16);
        var loc = "";
        var qual = "";
        
        for (var i=0; i < this.featureLocation.length; i++) {
            loc += this.featureLocation[i].toString();
            if (i < this.featureLocation.length - 1) {
                loc += ",";
            } else {
                //loc += "\n";
            }
        }
        if (this.join === true) {  //explicit true because if complement is passed in a string, this won't work
            loc = "join(" + loc + ")";
        }
        if (this.complement === true) {
            loc = "complement(" + loc + ")";
        }

        for ( i=0; i < this.featureQualifier.length; i++) {
            qual += this.featureQualifier[i].toString();
            if (i < this.featureQualifier.length - 1) {
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
        var i;
        var json = {
                keyword: this.keyword,
                //complement: complement,
                strand: this.strand
        };

        if (this.featureLocation !== undefined && this.featureLocation.length > 0) {
            json["location"] = [];
            for ( i = 0; i < this.featureLocation.length; i++) {
                json["location"].push(this.featureLocation[i]);
            }
        }

        if ( this.featureQualifier !== undefined && this.featureQualifier.length > 0) {
            json["qualifier"] =[];
            for ( i = 0; i < this.featureQualifier.length; i++) {
                json["qualifier"].push(this.featureQualifier[i]);
            }
        }
        return json;
    },

    /**
     * Converts GenBank JSON back to GenBank model
     * @params {JSON} json GenbankFeatureElement in JSON form
     * @returns {Teselagen.bio.model.GenbankFeatureElement}
     */
    fromJSON: function(json) {
        var i, tmp;

        this.keyword    = json["keyword"];
        this.strand     = json["strand"];
        this.complement = json["complement"];
        this.join       = json["join"];

        this.featureLocation = [];
        var loc = json["location"];
        for ( i = 0; i < sub.length; i++) {
            tmp = Ext.create("Teselagen.bio.parsers.GenbankFeatureLocation");
            tmp.fromJSON(loc);
            this.featureLocation.push(tmp);
        }

        this.featureQualifier = [];
        var qual = json["qualifier"];
        for ( i = 0; i < sub.length; i++) {
            tmp = Ext.create("Teselagen.bio.parsers.GenbankFeatureQualifier");
            tmp.fromJSON(qual);
            this.featureQualifier.push(tmp);
        }

        return this;
    }


});