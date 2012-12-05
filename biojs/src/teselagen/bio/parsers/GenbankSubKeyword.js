
/**
 * @class Teselagen.bio.parsers.GenbankSubKeyword class
 *
 * Stores the information from sub-keyword lines of a Genbank file.
 * These are for subkeywords not defined by {@link Teselagen.bio.parsers.GenbankFeatureElements}
 * (Qualifier and Location) and from the main section of the Genbank File (e.g. Source, Authors, etc.)
 * @author Diana Wong
 * @author Timothy Ham (original author)
 */

Ext.define("Teselagen.bio.parsers.GenbankSubKeyword", {
    
    requires: ["Teselagen.bio.util.StringUtil"],
    
    extend: "Teselagen.bio.parsers.Keyword",

    /**
     * @cfg {Object} config
     * @cfg {String} keyword
     * @cfg {String} value
     */
    config: {
        value: null
    },

    /**
     * Creates a new GenbankSubKeywords from inData.
     * @param {String} keyword
     * @param {String} value
     * @returns {GenbankSubKeywords}
     * @memberOf GenbankSubKeywords
     */
    constructor: function (inData) {

        if (inData !== undefined) {
            this.keyword    = inData.keyword || null;
            this.value      = inData.value || null;
        }
        return this;
    },
    /**
     * Appends pValue to existing value property
     * @param {String} value
     */
    appendValue: function(pVal) {
        if (this.value) {
            this.value += pVal;
        } else {
            this.value = pVal;
        }
    },

    /**
     * Converts this GenbankSubKeywords to Genbank file format string
     * This does not account for text wrapping.
     * @returns {String} genbankString
     */
    toString: function() {
        //var width = 80-12;
        var line = "  " + this.keyword;
        //line = line.lpad(" ", 2); // + this.value;
        line = Teselagen.StringUtil.rpad(line," ", 12);

        line += this.value;
        /*line += that.value.substring(0,width)

        for (var i=width; i<value; i=i+width) {
            line += that.value.substring(i,width);
        }*/

        return line;
    },

    /**
     * Converts to JSON format. Overloads for JSON.stringify()
     * @returns {Object} json
     */
    toJSON: function() {
        var json = {
                keyword: this.keyword,
                value: this.value
        };
        return json;
    },

    /**
     * Converts GenBank JSON back to GenBank model
     * @params {JSON} json Genbank SubKeyword in JSON form
     * @returns {Teselagen.bio.parsers.GenbankSubKeywords}
     */
    fromJSON: function(json) {
        this.keyword    = json["keyword"];
        this.value      = json["value"];
        return this;
    }

});