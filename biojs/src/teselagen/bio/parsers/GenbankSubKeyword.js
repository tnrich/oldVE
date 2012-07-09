
/**
 * GenbankSubKeyword class. 
 * Class for SubKeywords not defined by GenbankFeatureElements (Qualifier and Location).
 * @author Diana Wong
 * @author Timothy Ham (original author)
 */

Ext.define("Teselagen.bio.parsers.GenbankSubKeyword", {
    
    requires: ["Teselagen.bio.util.StringUtil"],
    
    extend: "Teselagen.bio.parsers.Keyword",

    /**
     * Creates a new GenbankSubKeywords from inData.
     * @param {String} keyword
     * @param {String} value
     */
    constructor: function (inData) {
        var that = this;

        if (inData) {
            that.keyword   = inData.keyword || null;
            that.value = inData.value || null;
        }
        /*
         * Get keyword
         *
        this.getKeyword = function() {
            return that.keyword;
        }*/

        /*
         * Appends pValue to existing value property
         * @param {String} pVal
         *
		this.appendValue = function(pVal) {
			that.value += pVal;
		}*/

        /**
         * Converts this GenbankSubKeywords to Genbank file format string
         * @returns {String}
         */
        this.toString = function() {
            //var width = 80-12;
            var line = "  " + that.keyword;
            //line = line.lpad(" ", 2); // + this.value;
            line = Teselagen.StringUtil.rpad(line," ", 12);

            line += that.value;
            /*line += that.value.substring(0,width)

			for (var i=width; i<value; i=i+width) {
				line += that.value.substring(i,width);
			}*/

            return line;
        }

        /**
         * Converts to JSON format. Overloads for JSON.stringify()
         * @returns {Object} json
         */
        this.toJSON = function() {
            var json = {
                    keyword: that.keyword,
                    value: that.value
            }
            return json;
        }


        return this;
    }

});