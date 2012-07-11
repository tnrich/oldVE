
/**
 * GenbankFeatureLocation. 
 * Stores the Feature Location from the Genbank formatted line:  
 * 'ELEMENTNAME               complement(join(>start...end))' .
 * Go to http://www.insdc.org/documents/feature_table.html#3.4 for specifications of Genbank file. 
 * This class does not assumes all locations of one feature are complement or not complement, join or not join.
 * 
 * @author Diana Wong
 * @author Timothy Ham (original author)
 */

Ext.define("Teselagen.bio.parsers.GenbankFeatureLocation", {
    
    requires: ["Teselagen.bio.util.StringUtil"],

    /**
     * Creates a new GenbankFeatureQualifier from inData.
     * @param {int} start Start index. 
     * 					"<" in front indicates that the exact lower boundary point of a feature is unknown. 
     * 					A location with just a start and no end is annotation for a single base.
     * @param {int} end End index. A ">" indicates that the feature continues beyond the end base.
     * @param {String} to This joins the start with end. 
     * 					"start..end" means it is a continuous range. 
     * 					"start.end" indicates exact location is unknown. 
     * 					"start^end" points to a single point in that range.
     * @returns {GenbankFeatureQualifier}
     * @memberOf GenbankFeatureLocation
     */
    constructor: function (inData) {

        var start 		= "";
        var preStart 	= "";	// stores partials
        var end 		= "";
        var preEnd 		= "";	// stores partials
        var to			= "";	// stores how start and end are joined. ie start TO end
        
        if (inData) {
            if (inData.start) {
                start		= inData.start.replace(/\<|\>/, "") || "";
                preStart	= inData.start.match(/\</, "") || "";
                /*if ( inData.start.match(/\>/g) ) {
                	throw Ext.create("Teselagen.bio.BioException", {
        				message: "Incorrect Usage of > in a start index in your Genbank file."
        			});
                }*/
            }
            if (inData.end) {
                end         = inData.end.replace(/\<|\>/, "") || "";
                preEnd      = inData.end.match(/\>/, "") || "";
                /*if ( inData.start.match(/\</g) ) {
                	throw Ext.create("Teselagen.bio.BioException", {
        				message: "Incorrect Usage of < in an end index in your Genbank file."
        			});
                }*/
            }
            if (inData.to) {
            	to			= inData.to; 
            	// This joins the start and end. start..
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
        	//put partials as suffix, warn for wrong usage
            //var line = preStart + start + sufStart + ".." + preEnd + end + sufEnd;
            var line = [ preStart, start];
            
            if (to) {
            	line.push(to);
            	console.log(to);
            }
            
            if (end) {
                line.push(preEnd);
                line.push(   end);
            }
            return line.join("");
        }
        /**
         * Converts to JSON format.
         * @returns {Object} json
         */
        this.toJSON = function() {
            var json = {
                    start: start,
                    to: to,
                    end: end
            }
            return json;
        }
        return this;
    }

});