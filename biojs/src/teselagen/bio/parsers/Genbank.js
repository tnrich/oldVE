
/**
 * @class Teselagen.bio.parsers.Genbank
 * Sets up an empty shell object with Genbank information and methods that is later populated by {@link Teselagen.bio.parsers.GenbankManager#parseGenbankFile}.
 * @author Diana Wong
 * @author Timothy Ham (original author of GenbankFileModel.js)
 */

Ext.define("Teselagen.bio.parsers.Genbank", {

    /**
     * @cfg {Object} config
     * @cfg {String[]} keywordTags Array of all the GenbankKeyword names in a Genbank class.
     * @cfg {Teselagen.bio.parsers.GenbankKeywords[]} keywords] Array of all the GenbankKeyword objects in a Genbank class which also include:
     * {@link Teselagen.bio.parsers.GenbankLocusKeyword},
     * {@link Teselagen.bio.parsers.GenbankFeaturesKeyword},
     * {@link Teselagen.bio.parsers.GenbankOriginKeyword} which inherit from
     * {@link Teselagen.bio.parsers.GenbankKeyword}).
     */
    config: {
        keywordsTag: [],
        keywords: []
    },

    /**
     * Creates new Genbank
     * @returns {Genbank}
     * @member Teselagen.bio.parsers.Genbank
     * */
    constructor: function () {

        this.keywords = [];
        this.keywordsTag = [];
        
        return this;
    },



    /**
     * Finds and gets Keyword Model.
     * @param {String} key Keyword name. (e.g. "LOCUS", or "ORIGIN")
     * @return {Teselagen.bio.parsers.GenbankKeyword} entry
     */
    findKeyword: function(key) {
        var entry = null;
        for (var i=0; i < this.keywords.length; i++) {
            if (this.keywords[i].keyword === key) {
                entry = this.keywords[i];
            }
        }
        return entry;
    },

    /**
     * Same as GB.findKeyword("LOCUS")
     * @returns {Teselagen.bio.parsers.GenbankLocusKeyword}
     */
    getLocus: function() {
        return this.findKeyword("LOCUS");
    },
    /**
     * Same as GB.addKeyword(GenbankLocusKeyword}
     * @param {Teselagen.bio.parsers.GenbankLocusKeyword} locus
     */
    setLocus: function(pLocus) {
        this.keywords.push(pLocus);
    },
    /**
     * Same as GB.findKeyword("ORIGIN")
     * @returns {Teselagen.bio.parsers.GenbankOriginKeyword}
     */
    getOrigin: function() {
        return this.findKeyword("ORIGIN");
    },
    /**
     * Same as GB.addKeyword(GenbankOriginKeyword}
     * @param {Teselagen.bio.parsers.GenbankOriginKeyword} origin
     */
    setOrigin: function(pOrigin) {
        this.keywords.push(pOrigin);
    },
    /**
     * Same as GB.findKeyword("FEATURES")
     * @returns {Teselagen.bio.parsers.GenbankFeaturesKeyword} [featureKeyword]
     */
    getFeatures: function() {
        return this.findKeyword("FEATURES");
    },




    // Specialized Set/Add methods that are not defined by config.
    /**
     * Sets the Features array
     * @param {Teselagen.bio.parsers.GenbankFeaturesKeyword} [featureElements]
     */
    setFeatures: function(pFeatures) {
        this.keywords.push(pFeatures);
    },

    /**
     * Same as genbank.addKeyword(GenbankFeaturesKeyword}
     * @param {Teselagen.bio.parsers.GenbankFeaturesKeyword} [featureElements]
     *
    addFeature: function(pFeature) {
        this.keywords.push(pFeatures);
    },*/

    /**
     * Add a single GenbankKeyword to Genbank.keywords
     * @param {Teselagen.bio.parsers.GenbankKeyword} keyword
     */
    addKeyword: function(pAddKeyword) {
        this.keywords.push(pAddKeyword);
    },
    /**
     * Gets the last GenbankKeyword on the Keywords ArrayList
     * @return {Teselagen.bio.parsers.GenbankKeyword} keyword
     */
    getLastKeyword: function() {
        return this.keywords[this.keywords.length-1];
    },

    /**
     * Add a single keyword name (String) to Genbank.KeywordTag
     * @param {String} addKeywordsTag
     */
    addKeywordTag: function(pAddKeywordsTag) {
        this.keywordsTag.push(pAddKeywordsTag);
    },

    /**
     * Converts this GenbankSubKeywords to Genbank file format string
     * @returns {String} gbStr
     */
    toString: function() {
        var gbStr = "";
        var entry;
        for (var i=0; i < this.getKeywords().length; i++) {
            entry = this.getKeywords()[i];
            //gbStr.push(this.getKeywords()[i].toString() + "\n");
            gbStr += this.getKeywords()[i].toString() + "\n";
        }
        gbStr += "//";
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
            json[key] = this.getKeywords()[i].toJSON();

            //json.push(keywords[i]); //if you don't want the redundant keywords, but need to change json = []
        }

        return json;
    },

    /**
     * Converts GenBank JSON back to GenBank model
     * @param {Object} json Genbank in JSON form
     * @returns {Teselagen.bio.parsers.Genbank}
     */
    fromJSON: function(json) {
        var keyword;

        //console.log("Genbank.fromJSON");
        for (var key in json) {
            var obj = json[key];
            
            switch (key) {
            case "LOCUS": //this.self.LOCUS_TAG:
                keyword = Ext.create("Teselagen.bio.parsers.GenbankLocusKeyword");
                //console.log(obj);
                keyword.fromJSON(obj);
                this.addKeyword(keyword);
                this.addKeywordTag(key);
                break;
            case "FEATURES": //this.self.FEATURES_TAG:
                keyword = Ext.create("Teselagen.bio.parsers.GenbankFeaturesKeyword");
                //console.log(obj);
                keyword.fromJSON(obj);
                //console.log(keyword);
                this.addKeyword(keyword);
                this.addKeywordTag(key);
                break;
            case "ORIGIN": //this.self.ORIGIN_TAG:
                keyword = Ext.create("Teselagen.bio.parsers.GenbankOriginKeyword");
                //console.log(obj);
                keyword.fromJSON(obj);
                this.addKeyword(keyword);
                this.addKeywordTag(key);
                break;
            default:
                keyword = Ext.create("Teselagen.bio.parsers.GenbankKeyword");
                //console.log(obj);
                keyword.fromJSON(obj);
                //console.log(keyword);
                this.addKeyword(keyword);
                this.addKeywordTag(key);
            }
        }

    }



});