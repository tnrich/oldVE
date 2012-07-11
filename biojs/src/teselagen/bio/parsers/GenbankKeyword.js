
/**
 * GenbankKeyword. 
 * Stores information for each keyword in Genbank. 
 * Same level as {@link GebankLocusKeyword}, {@link GenbankFeaturesKeyword}, and {@link GenbankOriginKeyword}.
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
     * @cfg {[GenbankSubKeyword]} subKeywords 
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

        if (inData) {
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
            this.value += pVal;
        }
        /**
         * Gets last SubKeyword on the subKeywords array.
         * @returns {GenbankSubKeyword} subKeyword
         */
        this.getLastSubKeyword = function() {
            if ( !this.subKeywords && this.subKeywords.length > 0 ) {
                return this.subKeywords[this.subKeywords.length-1];
            } else {
                return null;
            }
        }
        /**
         * Converts this GenbankKeywords to Genbank file format string
         * @returns	{String} genbankString
         */
        this.toString = function() {
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
        }

        /**
         * Converts to JSON format.
         * @returns {Object} json
         */
        this.toJSON = function() {
            var json = {
                    keyword: this.keyword,
                    value: this.value
            }
            if (this.subKeywords.length > 0) {
            	json[subKeywords] = this.subKeywords
            }
            return json;
        }
        
        return this;
    }

});