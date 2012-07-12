
/**
 * GenbankOriginKeyword. 
 * Stores the information from the ORIGIN line of a Genbank file. 
 * Same level as {@link GenbankKeyword}, {@link GebankLocusKeyword}, and {@link GenbankFeaturesKeyword}.
 * Specifically for the Origin/Sequence part of the Genbank file
 * @author Diana Wong
 * @author Timothy Ham (original author)
 */

Ext.define("Teselagen.bio.parsers.GenbankOriginKeyword", {
    
    requires: ["Teselagen.bio.util.StringUtil"],
    
    extend: "Teselagen.bio.parsers.Keyword",

    /**
     * Creates a new GenbankOriginKeyword from inData.
     * @param {String} sequence
     * @returns {GenbankOriginKeyword}
     * @memberOf GenbankOriginKeyword
     */
    constructor: function (inData) {
        //var that = this;
        
        this.keyword = "ORIGIN";
        var sequence = "";

        if (inData) {
            sequence	= inData.sequence || "";
        }
        /**
         * Get sequence
         * @returns {String} sequence
         */
        this.getSequence = function() {
            return sequence;
        }
        /**
         * Set sequence
         * @param {String} sequence
         */
        this.setSequence = function(pSequence) {
            sequence = pSequence;
        }
        /**
         * Append more sequence to the sequence property
         * @param {String} line
         */
        this.appendSequence = function(line) {
            sequence += line;
        }
        /**
         * Converts this GenbankOriginKeyword to Genbank file format string
         * @returns {String} genbankString
         */
        this.toString = function() {
            if ( sequence === undefined || sequence === "" ) {
                return "NO ORIGIN";
            }

            var line = "";

            line += Teselagen.StringUtil.rpad("ORIGIN"," ", 12);
            if ( this.value != null) {
                line += this.value + "\n";
            } else {
                line += "\n";
            }

            for (var i=0 ; i < sequence.length; i=i+60) {
                var ind = i+1;
                var ind2 = Teselagen.StringUtil.lpad( (""+ind)," ", 9);
                line += ind2;

                for (var j=i; j < i+60; j=j+10) {
                    line += " " + sequence.substring(j,j+10);
                }
                line += "\n";
            }
            line.replace(/[\n]+$/,"");

            return line;

        }
        /**
         * Converts to JSON format.
         * @param {Object} json
         */
        this.toJSON = function() {
            json = {
                    keyword: this.keyword,
                    sequence: sequence
            }
            return json;
        }

        return this;
    }

});