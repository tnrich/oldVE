
/**
 * @class Teselagen.bio.parsers.GenbankFeatureLocation
 *
 * Stores the Feature Location from the Genbank formatted line:
 *      '     ELEMENTNAME               complement(join(>start...end))' .
 * Go to (@link http://www.insdc.org/documents/feature_table.html#3.4} for specifications of Genbank file.
 * This class does not assumes all locations of one feature are complement or not complement, join or not join.
 *
 * @author Diana Wong
 * @author Timothy Ham (original author)
 */

Ext.define("Teselagen.bio.parsers.GenbankFeatureLocation", {

    requires: ["Teselagen.bio.util.StringUtil"],

    /**
     * @cfg {Object} config
     * @cfg {Number} start
     * @cfg {String} preStart
     * @cfg {String} to
     * @cfg {Number} end
     * @cfg {String} preEnd
     */
    config: {
        start: 0,
        preStart: "",
        end: 0,
        preEnd: "",
        to: ""
    },

    /**
     * Creates a new GenbankFeatureQualifier from inData.
     * @param {String} preStart Prefix to start index. Indicates partial <
     * @param {int} start Start index.
     *                  "<" in front indicates that the exact lower boundary point of a feature is unknown.
     *                  A location with just a start and no end is annotation for a single base.
     * @param {String} preEnd Prefix to end index. Indicates partial >
     * @param {int} end End index. A ">" indicates that the feature continues beyond the end base.
     * @param {String} to This joins the start with end.
     *                  "start..end" means it is a continuous range.
     *                  "start.end" indicates exact location is unknown.
     *                  "start^end" points to a single point in that range.
     * @returns {GenbankFeatureQualifier}
     * @memberOf GenbankFeatureLocation
     */
    constructor: function (inData) {

        var start       = "";
        var preStart    = "";   // stores partials
        var end         = "";
        var preEnd      = "";   // stores partials
        var to          = "";   // stores how start and end are joined. ie start TO end
        var tmp;

        if (inData) {
            if (inData.start !== undefined) {
                this.start  = parseInt((inData.start).toString().replace(/\<|\>/, ""));
                tmp         = (inData.start).toString().match(/\</g);
                if (tmp) {
                    this.preStart  = tmp[0] || "";
                }
                /*if ( inData.start.match(/\>/g) ) {
                    throw Ext.create("Teselagen.bio.BioException", {
                        message: "Incorrect Usage of > in a start index in your Genbank file."
                    });
                }*/
            }
            if (inData.end !== undefined) {
                this.end    = parseInt((inData.end).toString().replace(/\<|\>/, ""));
                tmp         = (inData.end).toString().match(/\>/g);
                if (tmp) {
                    this.preEnd  = tmp[0] || "";
                }
                /*if ( inData.start.match(/\</g) ) {
                    throw Ext.create("Teselagen.bio.BioException", {
                        message: "Incorrect Usage of < in an end index in your Genbank file."
                    });
                }*/
            } else {
                this.end = this.start;  // If there is no end, make it the same as start
                this.to  = "..";
            }
            if (inData.preStart) {
                this.preStart    = inData.preStart || "";
            }
            if (inData.preEnd) {
                this.preEnd      = inData.preEnd || "";
            }

            if (inData.to) {
                this.to          = inData.to;
                // This joins the start and end. start..
            }
        }
        return this;
    },
    
    /**
     * Converts this GenbankFeatureLocation to Genbank file format string
     * @returns {String} genbankString
     */
    toString : function() {
        //put partials as suffix, warn for wrong usage
        
        //var line = preStart + start + sufStart + ".." + preEnd + end + sufEnd;
        var line = [ this.preStart, this.start];

        if (this.to) {
            line.push(this.to);
        }

        if (this.end) {
            line.push(this.preEnd);
            line.push(this.end);
        }
        return line.join("");
    },
    
    /**
     * Converts to JSON format.
     * @returns {Object} json
     */
    toJSON : function() {
        
        var json = {
                //preStart: this.preStart,
                start: this.start,
                to: this.to,
                //preEnd: this.preEnd,
                end: this.end
        };
        return json;
    },

    /**
     * Converts GenBank JSON back to GenBank model
     * @params {JSON} json GenbankFeatureLocation in JSON form
     * @returns {Teselagen.bio.model.GenbankFeatureLocation}
     */
    fromJSON: function(json) {
        this.keyword    = json["keyword"];
        //this.preStart   = json["preStart"];
        this.start      = json["start"];
        this.to         = json["to"];
        //this.preEnd     = json["preEnd"];
        this.end        = json["end"];
        return this;
    }


});