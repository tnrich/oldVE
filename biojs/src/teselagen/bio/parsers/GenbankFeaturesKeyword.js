
/**
 * @class Teselagen.bio.parsers.GenbankFeaturesKeyword
 *
 * Stores an array of GenbankFeatureElements. Is created when parsing the line "FEATURES" from a Genbank file.
 * Same level as {@link Teselagen.bio.parsers.GenbankKeyword},
 * {@link Teselagen.bio.parsers.GenbankLocusKeyword},
 * and {@link Teselagen.bio.parsers.GenbankOriginKeyword}.
 * Simply holds GenbankFeatureElements in an array.
 * @author Diana Wong
 * @author Timothy Ham (original author)
 */

Ext.define("Teselagen.bio.parsers.GenbankFeaturesKeyword", {

    requires: ["Teselagen.bio.util.StringUtil"],

    extend: "Teselagen.bio.parsers.Keyword",

    /**
     * @cfg {Object} config
     * @cfg {Teselagen.bio.parsers.GenbankFeatureElement[]} featuresElements
     */
    config: {
        featuresElements: []
    },

    /**
     * Creates a new GenbankFeaturesKeyword from inData.
     * @returns {GenbankFeaturesKeyword}
     * @memberOf GenbankFeaturesKeyword
     */
    constructor: function () {
        /**
         *  @property {String} keyword
         */
        this.keyword = "FEATURES";
        this.featuresElements = [];

        return this;
    },

    /**
     * Add GenbankFeatureElement
     * @param {GenbankFeatureElement} element
     */
    addElement: function(pElement) {
        this.featuresElements.push(pElement);
    },

    /**
     * Get Last GenbankFeatureElement in featuresElements array
     * @returns {GenbankFeatureElement} element
     */
    getLastElement: function() {
        if (this.featuresElements.length > 0) {
            return this.featuresElements[this.featuresElements.length-1];
        } else {
            return null;
        }
    },
    /**
     * Converts this GenbankFeaturesKeyword to Genbank file format string
     * @returns {String} genbankString
     */
    toString : function() {
        var line = "FEATURES             Location/Qualifiers\n";

        for (var i=0; i < this.featuresElements.length; i++) {
            line += this.featuresElements[i].toString();
            if (i < this.featuresElements.length-1) {
                line += "\n";
            }
        }
        return line;
    },
    /**
     * Converts to JSON format.
     * @returns {Object} json
     */
    toJSON : function() {

        var json = {
                keyword: this.keyword
        };
        if (this.value  !== null) {
            json["value"] = this.value;
        }
        json["elements"] = [];
        for (var i=0; i < this.featuresElements.length; i++) {
            json["elements"].push(this.featuresElements[i]);
        }


        return json;
    },

    /**
     * Converts GenBank JSON back to GenBank model
     * @params {JSON} json GenbankFeatureQualifier in JSON form
     * @returns {Teselagen.bio.model.GenbankFeatureQualifier}
     */
    fromJSON: function(json) {
        this.keyword    = json["keyword"];
        this.featuresElements = json["elements"];
        return this;
    }


});