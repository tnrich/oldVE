
/**
 * @class Teselagen.bio.parsers.GenbankKeyword
 * 
 * Stores information for each keyword in Genbank. 
 * Same level as {@link Teselagen.bio.parsers.GenbankLocusKeyword}, 
 * {@link Teselagen.bio.parsers.GenbankFeaturesKeyword}, and {@link Teselagen.bio.parsers.GenbankOriginKeyword}.
 * @author Diana Wong
 * @author Timothy Ham (original author)
 */

Ext.define("Teselagen.bio.parsers.GenbankKeyword", {

    requires: ["Teselagen.bio.util.StringUtil"],

    extend: "Teselagen.bio.parsers.Keyword",

    /**
     * @cfg {Object} config
     * @cfg {String} keyword
     * @cfg {String} value
     * @cfg {GenbankSubKeyword} [subKeywords]
     */
    config: {
        //keyword: null,
        //value: null,
        /**
         * @cfg {[GenbankSubKeyword]} subKeywords 
         */ 
        subKeywords: null
    },
    /**
     * Creates a new GenbankKeyword from inData.
     * @param {String} keyword
     * @param {String} value
     * @param {[GenbankSubKeyword]} subKeywords 
     * @returns {GenbankKeyword}
     * @memberOf GenbankKeyword
     */
    constructor: function (inData) {
        //var that = this;

        if (inData !== undefined) {
            this.keyword = inData.keyword || null;
            this.value = inData.value || null;
            this.subKeywords = inData.subKeywords || [];
        }

        /**
         * Adds a GenbankSubKeyword to subKeywords
         * @param {GenbankSubKeyword} subKeyword
         */
        this.addSubKeyword = function(subkey) {
            if (this.subKeywords === undefined) {
                this.subKeywords = [];
            }
            this.subKeywords.push(subkey);
        }

        /**
         * Appends to existing parameter, value.
         * @param {String} value
         */
        this.appendValue = function(pVal) {
            if (this.value) {
                this.value += pVal;
            } else {
                this.value = pVal;
            }
        }
        /**
         * Gets last SubKeyword on the subKeywords array.
         * @returns {GenbankSubKeyword} subKeyword
         */
        this.getLastSubKeyword = function() {
            if ( this.subKeywords.length > 0 ) {
                return this.subKeywords[this.subKeywords.length-1];
            } else {
                return null;
            }
        }
        return this;
    },

    /**
     * Converts this GenbankKeywords to Genbank file format string.
     * Currently does not recalculate wrapping.
     * @returns	{String} genbankString
     */
    toString : function() {
        var subKeywords = this.getSubKeywords();
        var width = 80-12;
        var line = Teselagen.StringUtil.rpad(this.keyword, " ", 12); // + this.value;
        line += this.value;

        /*line += this.value.substring(0,width)

			for (var i=width; i<this.value; i=i+width) {
				line += this.value.substring(i,width);
			}*/
        if ( this.subKeywords.length > 0) {
            line += "\n";
            for (var i=0; i < this.subKeywords.length; i++) {
                line += this.subKeywords[i].toString();
                if (i<this.subKeywords.length - 1) { 
                    line += "\n";
                }
            }
        }

        return line;
    },

    /**
     * Converts to JSON format.
     * @returns {Object} json
     */
    toJSON : function() {
        var subKeywords = this.getSubKeywords();
        var json = {
                keyword: this.keyword,
                value: this.value
        }
        if ( this.subKeywords.length > 0) {
            json["subKeywords"] = this.subKeywords;
        }
        return json;
    }


});