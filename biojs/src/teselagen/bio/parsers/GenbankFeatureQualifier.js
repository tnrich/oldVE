
/**
 * @class Teselagen.bio.parsers.GenbankFeatureQualifier
 *
 * Stores the Feature Qualifier from the Genbank formatted line: '/key="value"'
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
     * @returns {GenbankFeatureQualifer}
     * @memberOf GenbankFeatureQualifer
     */
    constructor: function (inData) {

        var name;
        var value;
        var quoted;
        if (inData) {
            name = inData.name || null;
            value = inData.value || null;
            quoted = inData.quoted || false; // boolean
        }
        /**
         * Get name
         * @returns {String} name
         */
        this.getName = function() {
            return name;
        }
        /**
         * Set name
         * @param {String} name
         */
        this.setName = function(pName) {
            name = pName;
        }
        /**
         * Get value
         * @returns {String} value
         */
        this.getValue = function() {
            return value;
        }
        /**
         * Set value
         * @param {String} value
         */
        this.setValue = function(pValue) {
            value = pValue;
        }
        /**
         * Get Quoted
         * @returns {Boolean} quoted
         */
        this.getQuoted = function() {
            return quoted;
        }
        /**
         * Set Quoted
         * @param {Boolean} quoted
         */
        this.setQuoted = function(pQuoted) {
            quoted = pQuoted;
        }
        /**
         * Append a string to the value property
         * @param {String} append
         */
        this.appendValue = function(append){
            if (value) {
                value += append;
            } else {
                value = append;
            }
            //value += append;
        }
        return this;
    },
    /**
     * Converts this GenbankLocusKeyword to Genbank file format string
     * @returns {String} genbankString
     */
    toString : function() {
        var line;
        var name    = this.getName();
        var value   = this.getValue();
        var quoted  = this.getQuoted();
        
        if (quoted) {
            line = Teselagen.StringUtil.lpad("/", " ", 22) + name + "=\"" + value + "\"";
        } else {
            line = Teselagen.StringUtil.lpad("/"," ", 22) + name + "=" + value ;
        }
        return line;
    },
    /**
     * Converts to JSON format.
     * @returns {Object} json
     */
    toJSON : function() {
        var name    = this.getName();
        var value   = this.getValue();
        var quoted  = this.getQuoted();
        
        var json = {
                name: name,
                value: value
        }
        return json;
    }


});