
/**
 * GenbankFeatureLocation. 
 * Stores the Feature Location from the Genbank formatted line:  'ELEMENTNAME               complement(join(>start...end))' .
 * @author Diana Wong
 * @author Timothy Ham (original author)
 */

Ext.define("Teselagen.bio.parsers.GenbankFeatureLocation", {
    
    requires: ["Teselagen.bio.util.StringUtil"],

    /**
     * Creates a new GenbankFeatureQualifier from inData.
     * @param {int} start
     * @param {int} end
     * @param {String} preStart
     * @param {String} preEnd
     * @returns {GenbankFeatureQualifier}
     * @memberOf GenbankFeatureLocation
     */
    constructor: function (inData) {
        //var that = this;

        var start = "";
        var preStart = "";
        var sufStart = "";
        var end = "";
        var preEnd = "";
        var sufEnd = "";

        if (inData !== undefined) {
            if (inData.start !== undefined ) {
                start		= inData.start.replace(/\<|\>/, "") || "";
                preStart	= inData.start.match(/<\<|<\>/, "") || "";
                sufStart	= inData.start.match(/\<$|\>$/, "") || "";
            }
            if (inData.end !== undefined) {
                end         = inData.end.replace(/\<|\>/, "") || "";
                preEnd      = inData.end.match(/^\<|^\>/, "") || "";
                sufEnd      = inData.end.match(/\<$|\>$/, "") || "";
            }
        }
        /**
         * Get start
         * @returns {int} start
         */
        this.getStart = function() {
            return start;
        }
        /**
         * Set start
         * @param {int} start
         */
        this.setStart = function(pStart) {
            start = pStart;
        }
        /**
         * Get end
         * @returns {int} end
         */
        this.getEnd = function() {
            return end;
        }
        /**
         * Set end
         * @param {int} end
         */
        this.setEnd = function(pEnd) {
            end = pEnd;
        }

        /**
         * Converts this GenbankLocusKeyword to Genbank file format string
         * @returns {String} genbankString
         */
        this.toString = function() {
            //var line = preStart + start + sufStart + ".." + preEnd + end + sufEnd;
            var line = start;
            if (end !== "" ) {
                line += ".." + end ;
            }
            return line;
        }
        /**
         * Converts to JSON format.
         * @returns {Object} json
         */
        this.toJSON = function() {
            var json = {
                    start: start,
                    end: end
            }
            return json;
        }
        return this;
    }

});