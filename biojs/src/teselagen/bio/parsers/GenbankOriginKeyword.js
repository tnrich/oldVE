
/**
 * @class Teselagen.bio.parsers.GenbankOriginKeyword
 *
 * Stores the information from the ORIGIN line of a Genbank file.
 * Same level as {@link Teselagen.bio.parsers.GenbankKeyword},
 * {@link Teselagen.bio.parsers.GenbankLocusKeyword}, and
 * {@link Teselagen.bio.parsers.GenbankFeaturesKeyword}.
 * Specifically for the Origin/Sequence part of the Genbank file.
 *
 * @author Diana Wong
 * @author Timothy Ham (original author)
 */

Ext.define("Teselagen.bio.parsers.GenbankOriginKeyword", {
    
    requires: ["Teselagen.bio.util.StringUtil"],
    
    extend: "Teselagen.bio.parsers.Keyword",

    /**
     * @cfg {Object} config
     * @cfg {String} keyword
     * @cfg {String} sequence
     */
    config: {
        sequence: ""
    },

    /**
     * Creates a new GenbankOriginKeyword from inData.
     * @param {String} sequence
     * @returns {GenbankOriginKeyword}
     * @member GenbankOriginKeyword
     */
    constructor: function (inData) {

        this.keyword = "ORIGIN";

        if (inData !== undefined) {
            this.sequence	= inData.sequence || "";
        }
        return this;
    },

    /**
     * Append more sequence to the sequence property
     * @param {String} line
     */
    appendSequence: function(line) {
        this.sequence += line;
    },

    /**
     * Converts this GenbankOriginKeyword to Genbank file format string
     * @returns {String} genbankString
     */
    toString: function() {
        if ( this.sequence === undefined || this.sequence === "" ) {
            return "NO ORIGIN";
        }

        var line = "";

        line += Teselagen.StringUtil.rpad("ORIGIN"," ", 12);
        if ( this.value !== null) {
            line += this.value + "\n";
        } else {
            line += "\n";
        }

        for (var i=0 ; i < this.sequence.length; i=i+60) {
            var ind = i+1;
            var ind2 = Teselagen.StringUtil.lpad( (""+ind)," ", 9);
            line += ind2;

            for (var j=i; j < i+60; j=j+10) {
                line += " " + this.sequence.substring(j,j+10);
            }
            line += "\n";
        }
        //line.replace(/[\n]+$/,"");

        return line;

    },

    /**
     * Converts to JSON format.
     * @param {Object} json
     */
    toJSON: function() {
        json = {
                keyword: this.keyword,
                sequence: this.sequence
        };
        return json;
    },

    /**
     * Converts GenBank JSON back to GenBank model
     * @param {JSON} json Genbank OriginKeyword in JSON form
     * @returns {Teselagen.bio.parsers.GenbankOriginKeyword}
     */
    fromJSON: function(json) {
        this.keyword    = json["keyword"];
        this.sequence   = json["sequence"];
        return this;
    }

});