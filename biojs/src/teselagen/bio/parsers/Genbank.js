
/**
 * @class Teselagen.bio.parsers.Genbank
 * Sets up an empty shell object with Genbank information and methods that is later populated by {@link Teselagen.bio.parsers.GenbankManager#parseGenbankFile}.
 * @author Diana Wong
 * @author Timothy Ham (original author of GenbankFileModel.js)
 */

Ext.define("Teselagen.bio.parsers.Genbank", {

    /**
     * Creates new Genbank
     * @returns {Genbank}
     * @memberOf Genbank
     * */
    constructor: function () {
        var that = this;
        /**
         * @property {String} [keywordTags] Array of all the GenbankKeyword names in a Genbank class.
         * This is redundant since iterating through keywords[i].keyword will regenerate this list.
         * @deprecated
         */
        var keywordsTag = [];   // List of Keywords being used
        /**
         * @property {GenbankKeywords} [keywords] Array of all the GenbankKeyword objects in a Genbank class
         * (which also includes {@link Teselagen.bio.parsers.GenbankLocusKeyword},
         * {@link Teselagen.bio.parsers.GenbankFeaturesKeyword},
         * {@link Teselagen.bio.parsers.GenbankOriginKeyword} which inherit from
         * {@link Teselagen.bio.parsers.GenbankKeyword}).
         */
        var keywords    = [];


        // ======== Getter and Setter function ========//
        /**
         * Finds and gets Keyword
         * @param {String} key Keyword name. (e.g. "LOCUS", or "ORIGIN")
         * @return {Teselagen.bio.parsers.GenbankKeyword} entry
         */
        this.self.prototype.findKeyword = function(key) {
            return find(key);
        }

        function find(key) {
            var entry = null;
            for (var i=0; i<keywords.length; i++) {
                if (keywords[i].keyword === key) {
                    entry = keywords[i];
                }
            }
            return entry;
        }

        //THESE DO NOT CHECK FOR NULL VALUES
        /**
         * Same as GB.findKeyword("LOCUS")
         * @returns {Teselagen.bio.parsers.GenbankLocusKeyword}
         */
        this.self.prototype.getLocus = function() {
            return find("LOCUS");
        }
        /**
         * Same as GB.addKeyword(GenbankLocusKeyword}
         * @param {Teselagen.bio.parsers.GenbankLocusKeyword} locus
         */
        this.self.prototype.setLocus = function(pLocus) {
            keywords.push(pLocus);
        }
        /**
         * Same as GB.findKeyword("ORIGIN")
         * @returns {Teselagen.bio.parsers.GenbankOriginKeyword}
         */
        this.self.prototype.getOrigin = function() {
            return find("ORIGIN");
        }
        /**
         * Same as GB.addKeyword(GenbankOriginKeyword}
         * @param {Teselagen.bio.parsers.GenbankOriginKeyword} origin
         */
        this.self.prototype.setOrigin = function(pOrigin) {
            keywords.push(pOrigin);
        }
        /**
         * Same as GB.findKeyword("FEATURES")
         * @returns {Teselagen.bio.parsers.GenbankFeaturesKeyword} [featureKeyword]
         */
        this.self.prototype.getFeatures = function() {
            return find("FEATURES");
        }
        /**
         * Same as GB.addKeyword(GenbankFeaturesKeyword}
         * @param {Teselagen.bio.parsers.GenbankFeaturesKeyword} [featureElements]
         */
        this.self.prototype.setFeatures = function(pFeatures) {
            keywords.push(pFeatures);
        }
        /**
         * Gets KeywordsTag
         * @return {String} [keywordsTag]
         * @deprecated
         */
        this.self.prototype.getKeywordsTag = function() {
            return keywordsTag;
        }
        /**
         * Sets KeywordsTag
         * @param {String} keywordsTag
         * @deprecated
         */
        this.self.prototype.setKeywordsTag = function(pKeywordsTag) {
            keywordsTag = pKeywordsTag;
        }
        /**
         * Get Keywords, an array
         * @return {Teselagen.bio.parsers.GenbankKeywords} [keywords:ArrayList]
         */
        this.self.prototype.getKeywords = function() {
            return keywords;
        }
        /**
         * Set Keywords, an array
         * @param {Teselagen.bio.parsers.GenbankKeywords} [keywords:ArrayList]
         */
        this.self.prototype.setKeywords = function(pKeywords) {
            keywords = pKeywords;
        }
        /**
         * Add a single GenbankKeyword to Genbank.keywords
         * @param {Teselagen.bio.parsers.GenbankKeyword} keyword
         */
        this.self.prototype.addKeyword = function(pAddKeyword) {
            keywords.push(pAddKeyword);
        }
        /**
         * Gets the last GenbankKeyword on the Keywords ArrayList
         * @return {Teselagen.bio.parsers.GenbankKeyword} keyword
         */
        this.self.prototype.getLastKeyword = function() {
            return keywords[keywords.length-1];
        }

        /**
         * Add a single keyword name (String) to Genbank.KeywordTag
         * @param {String} addKeywordsTag
         */
        this.self.prototype.addKeywordTag = function(pAddKeywordsTag) {
            keywordsTag.push(pAddKeywordsTag);
        }
        return this;
    },
    /**
     * Converts this GenbankSubKeywords to Genbank file format string
     * @returns {String} gbStr
     */
    toString: function() {
        var gbStr = ""; //= []; //The array thing is bad--regex for where to join may break when files have those symbols
        var entry;
        for (var i=0; i < this.getKeywords().length; i++) {
            entry = this.getKeywords()[i];
            //gbStr.push(this.getKeywords()[i].toString() + "\n");
            gbStr += this.getKeywords()[i].toString() + "\n";
        }
        //gbStr.push("//");
        gbStr += "//";
        //return gbStr.join(" ");
        return gbStr;
    },

    /**
     * Converts to JSON format. Overloads for JSON.stringify()
     * This version includes a redundant Keyword in the key-value pair.
     * @returns {Object} json
     */
    toJSON: function() {
        var json = {};
        for (var i=0; i < this.getKeywords().length; i++) {
            var key = this.getKeywords()[i].getKeyword();
            json[key] = this.getKeywords()[i];

            //json.push(keywords[i]); //if you don't want the redundant keywords, but need to change json = []
        }

        return json;
    }



});