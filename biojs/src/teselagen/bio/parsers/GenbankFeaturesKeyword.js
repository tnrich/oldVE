
/**
 * GenbankFeaturesKeyword. 
 * Stores an array of GenbankFeatureElements. Is created when parsing the line "FEATURES" from a Genbank file.
 * Same level as {@link GenbankKeyword}, {@link GebankLocusKeyword}, and {@link GenbankOriginKeyword}.
 * Simply holds GenbankFeatureElements in an array.
 * @author Diana Wong
 * @author Timothy Ham (original author)
 */

Ext.define("Teselagen.bio.parsers.GenbankFeaturesKeyword", {
    
    requires: ["Teselagen.bio.util.StringUtil"],
    
    extend: "Teselagen.bio.parsers.Keyword",

    /**
     * Creates a new GenbankFeaturesKeyword from inData.
     * @returns {GenbankFeaturesKeyword}
     * @memberOf GenbankFeaturesKeyword
     */
    constructor: function () {
        //var that = this;
        /**
         *  @property {String} keyword
         */
        this.keyword = "FEATURES";
        /**
         *  @property [GenbankFeatureElements] featuresElements
         */
        var featuresElements = [];


        /**
         * Get featuresElements
         * @returns {GenbankFeaturesKeyword} featuresElements
         */
        this.getFeaturesElements = function() {
            return featuresElements;
        }
        /**
         * Set featuresElements
         * @param {[GenbankFeaturesKeyword]} featuresElements
         */
        this.setFeaturesElements = function(pFeaturesElements) {
            featuresElements = pFeaturesElements;
        }

        /**
         * Add GenbankFeatureElement
         * @param {GenbankFeatureElement} element
         */
        this.addElement = function(pElement) {
            featuresElements.push(pElement);
        }

        /**
         * Get Last GenbankFeatureElement in featuresElements array
         * @returns {GenbankFeatureElement} element
         */
        this.getLastElement = function() {
            if (featuresElements.length > 0) {
                return featuresElements[featuresElements.length-1];
            } else {
                return null;
            }
        }
        /**
         * Converts this GenbankFeaturesKeyword to Genbank file format string
         * @returns {String} genbankString
         */
        this.toString = function() {
            var line = "FEATURES             Location/Qualifiers\n";

            for (var i=0; i < featuresElements.length; i++) {
                line += featuresElements[i].toString();
                if (i < featuresElements.length-1) {
                    line += "\n";
                }
            }
            return line;
        }
        /**
         * Converts to JSON format.
         * @returns {Object} json
         */
        this.toJSON = function() {
            var json = {
                    keyword: this.keyword,
            }
            if (this.value  !== null) {
                json["value"] = this.value;
            }
            json["elements"] = [];
            for (var i=0; i <featuresElements.length; i++) {
                json["elements"].push(featuresElements[i]);
            }


            return json;
        }

        return this;
    }

});