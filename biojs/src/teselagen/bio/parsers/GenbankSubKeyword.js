
/**
 * GenbankSubKeyword class. 
 * Stores the information from sub-keyword lines of a Genbank file.
 * These are for subkeywords not defined by GenbankFeatureElements (Qualifier and Location)
 * and from the main section of the Genbank File (e.g. Source, Authors, etc.)
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
     * @returns {GenbankSubKeywords}
     * @memberOf GenbankSubKeywords
     */
    constructor: function (inData) {
        //var that = this;

        if (inData) {
            this.keyword    = inData.keyword || null;
            this.value      = inData.value || null;
        }

        /**
         * Appends pValue to existing value property
         * @param {String} value
         */
		this.appendValue = function(pVal) {
			this.value += pVal;
		}

        /**
         * Converts this GenbankSubKeywords to Genbank file format string
         * @returns {String} genbankString
         */
        this.toString = function() {
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
        }

        /**
         * Converts to JSON format. Overloads for JSON.stringify()
         * @returns {Object} json
         */
        this.toJSON = function() {
            var json = {
                    keyword: this.keyword,
                    value: this.value
            }
            return json;
        }


        return this;
    }

});