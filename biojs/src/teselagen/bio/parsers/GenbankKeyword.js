
/**
 * GenbankKeyword class 
 * Class for Keywords. Same level as GebankLocusKeyword, GenbankFeaturesKeyword, and GenbankOriginKeyword.
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
     * @cfg {GenbankSubKeyword} subKeywords 
     */
    config: {
        //keyword: null,
        //value: null,
        subKeywords: null,
    },
    /**
     * Creates a new GenbankKeyword from inData.
     * @param {String} keyword
     * @param {String} value
     * @param {GenbankSubKeyword} subKeywords 
     * @returns {GenbankKeyword}
     */
    constructor: function (inData) {
        var that = this;

        if (inData) {
            that.keyword = inData.keyword;
            that.value = inData.value;
            that.subKeywords = inData.subKeywords;
        }

        /**
         * Adds a GenbankSubKeyword to subKeywords
         * @param {GenbankSubKeyword}
         */
        this.addSubKeyword = function(subkey) {
            if (that.subKeywords === undefined) {
                //console.log("BLAH");
                that.subKeywords = [];
            }
            that.subKeywords.push(subkey);
        }

        /**
         * Appends to existing parameter, value.
         * @param {String} pVal
         */
        this.appendValue = function(pVal) {
            that.value += pVal;
        }
        /**
         * Gets last SubKeyword on the subKeywords array.
         * @returns {GenbankSubKeyword}
         */
        this.getLastSubKeyword = function() {
            if ( that.subKeywords.length > 0 && that.subKeywords !== undefined) {
                return that.subKeywords[that.subKeywords.length-1];
            } else {
                return null;
            }
        }
        /**
         * Converts this GenbankKeywords to Genbank file format string
         * @returns	{String} line
         */
        this.toString = function() {
            var width = 80-12;
            var line = that.keyword.rpad(" ", 12); // + this.value;
            line += that.value;

            /*line += that.value.substring(0,width)

			for (var i=width; i<this.value; i=i+width) {
				line += this.value.substring(i,width);
			}*/
            if (this.subKeywords !== undefined) {
                line += "\n";
                for (var i=0; i < this.subKeywords.length; i++) {
                    line += this.subKeywords[i].toString();
                    if (i<this.subKeywords.length - 1) { 
                        line += "\n";
                    }
                }
            }

            return line;
        }

        /*this.toJSON = function() {
			return null;
		}*/

        return this;
    }

});