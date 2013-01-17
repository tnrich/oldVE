
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
     * @cfg {Object} config
     * @cfg {String} name
     * @cfg {String} value
     * @cfg {Boolean} quoted
     */
    config: {
        name: "",
        value: "",
        quoted: true
    },

    /**
     * Creates a new GenbankFeatureQualifier from inData.
     * @param {String} name
     * @param {String} value
     * @param {Boolean} quoted
     * @returns {GenbankFeatureQualifier}
     * @member Teselagen.bio.parsers.GenbankFeatureQualifier
     */
    constructor: function (inData) {

        if (inData !== undefined) {
            this.name = inData.name || "";
            this.value = inData.value || "";
            this.quoted = inData.quoted || true; // boolean
        }

        if (typeof(this.value) === "string") {
            this.quoted = true;
        } else {
            this.quoted = false;
        }
        return this;
    },

    /**
     * Append a string to the value property
     * @param {String} append
     */
    appendValue: function(append){
        if (this.value) {
            this.value += append;
        } else {
            this.value = append;
        }
        //value += append;
    },

    /**
     * Converts this GenbankLocusKeyword to Genbank file format string
     * @returns {String} genbankString
     */
    toString: function() {
        var line;
        var name    = this.getName();
        var value   = this.getValue();
        var quoted  = this.getQuoted();
        
        if (quoted) {
            line = Teselagen.StringUtil.lpad("/", " ", 22) + this.name + "=\"" + this.value + "\"";
        } else {
            line = Teselagen.StringUtil.lpad("/"," ", 22) + this.name + "=" + this.value ;
        }
        return line;
    },

    /**
     * Converts to JSON format.
     * @returns {Object} json
     */
    toJSON : function() {

        var json = {
            name: this.name,
            value: this.value
        };
        return json;
    },

    /**
     * Converts GenBank JSON back to GenBank model
     * @param {Object} json GenbankFeatureQualifier in JSON form
     * @returns {Teselagen.bio.parsers.GenbankFeatureQualifier}
     */
    fromJSON: function(json) {
        //console.log(json);
        this.name   = json["name"];
        this.value  = json["value"];

        if (typeof(this.value) === "string") {
            this.quoted = true;
        } else {
            this.quoted = false;
        }
        return this;
    }


});