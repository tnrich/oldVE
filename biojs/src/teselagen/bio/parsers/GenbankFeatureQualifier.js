
/**
 * GenbankFeatureQualifier class 
 * Class for GenbankFeatureQualifier. Follows the '/key="value"' format
 * @author Diana Wong
 * @author Timothy Ham (original author)
 */

Ext.define("Teselagen.bio.parsers.GenbankFeatureQualifier", {
    
    requires: ["Teselagen.bio.util.StringUtil"],

    /**
     * Creates a new GenbankFeatureQualifier from inData.
     * @param {String} name
     * @param {String} value
     * @param {Boolean} quoted
     */
    constructor: function (inData) {
        var that = this;
        var name;
        var value;
        var quoted;
        if (inData) {
            name = inData.name;
            value = inData.value;
            quoted = inData.quoted; // boolean
        }
        /**
         * Get name
         */
        this.getName = function() {
            return name;
        }
        /**
         * Set name
         */
        this.setName = function(pName) {
            name = pName;
        }
        /**
         * Get value
         */
        this.getValue = function() {
            return value;
        }
        /**
         * Set value
         */
        this.setValue = function(pValue) {
            value = pValue;
        }
        /**
         * Get Quoted
         */
        this.getQuoted = function() {
            return quoted;
        }
        /**
         * Set Quoted
         */
        this.setQuoted = function(pQuoted) {
            quoted = pQuoted;
        }
        /**
         * Append a string to the value property
         * @param {String} append
         */
        this.appendValue = function(append){
            value += append;
        }
        /**
         * Converts this GenbankLocusKeyword to Genbank file format string
         */
        this.toString = function() {
            var line;
            if (quoted) {
                line = Teselagen.StringUtil.lpad("/", " ", 22) + name + "=\"" + value + "\"";
            } else {
                line = Teselagen.StringUtil.lpad("/"," ", 22) + name + "=" + value ;
            }
            return line;
        }
        /**
         * Converts to JSON format.
         */
        this.toJSON = function() {
            var json = {
                    name: name,
                    value: value
            }
            return json;
        }
        return this;
    }

});