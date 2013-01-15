
/**
 * @class Teselagen.bio.parsers.GenbankLocusKeyword
 *
 * Stores the information from the LOCUS line of a Genbank file.
 * Same level as {@link Teselagen.bio.parsers.GenbankKeyword},
 * {@link Teselagen.bio.parsers.GenbankFeaturesKeyword},
 * and {@link Teselagen.bio.parsers.GenbankOriginKeyword}.
 * Specifically for parsing the Locus line.
 *
 * When parsing through GenbankManager, the Locus line must be in this order with no white space in each term.
 * The spaces between the terms (either spaces or tabs or other white space) between terms do not:
 *      LOCUS <locusName> <sequenceLength> bp <strandType>-<nucleic acid type> <linear/circular> <division code> <date>
 *
 * Sequence Length:     Number of base pairs. Required.
 * Strand Type:         Single strand (ss) or double strand. Not required
 * Nucleic Acid Type:   DNA or RNA. Required.
 * Linear/Circular:     When absent, default is Linear
 * Division Code:       Three letter, all caps. Not required.
 * Date:                Date. Not required.
 *
 *
 * @author Diana Wong
 * @author Timothy Ham (original author)
 */

Ext.define("Teselagen.bio.parsers.GenbankLocusKeyword", {
    
    requires: ["Teselagen.bio.util.StringUtil"],
    
    extend: "Teselagen.bio.parsers.Keyword",

    /**
     * @cfg {Object} config
     * @cfg {String} keyword
     * @cfg {String} locusName
     * @cfg {Number} sequenceLength
     * @cfg {String} strandType
     * @cfg {String} naType
     * @cfg {Boolean} lnear
     * @cfg {Boolean} circular
     * @cfg {String} divisionCode
     * @cfg {String} date
     */
    config: {
        //keyword: "LOCUS",
        locusName: "",
        sequenceLength: 0,
        strandType: "",
        naType: "DNA",
        linear: false,
        circular: true,
        divisionCode: "",
        date: ""
    },

    /**
     * Creates a new GenbankLocusKeyword from inData.
     * @param {String} locusName
     * @param {Number} sequenceLength base pair length
     * @param {String} strandType ss or ds
     * @param {String} naType DNA or RNA
     * @param {Boolean} linear !linear = circular.
     * @param {String} divisionCode Three letter code in caps.
     * @param {String} date
     * @returns {GenbankLocusKeyword}
     * @member GenbankLocusKeyword
     */
    constructor: function (inData) {
        //var that = this;
        
        this.keyword = "LOCUS";
        //var locusName;
        //var sequenceLength;
        //var strandType;
        //var naType;
        //var linear; //boolean; cannot designate Tandem
        //var circular; //boolean
        //var divisionCode;
        // date;

        if (inData !== undefined) {
            this.locusName       = inData.locusName || "";
            this.sequenceLength  = inData.sequenceLength || 0;
            this.strandType      = inData.strandType || "";
            this.naType          = inData.naType || "DNA";
            this.linear          = inData.linear || false; // false or false; default is false, only a true can override this
            this.circular        = inData.circular || !inData.linear; //untested
            this.divisionCode    = inData.divisionCode || "";
            this.date            = inData.date || "";
        }

        return this;
    },

    /**
     * Converts this GenbankLocusKeyword to Genbank file format string
     * @returns {String} genbankString
     */
    toString: function () {
        var tmp;

        var line = Teselagen.StringUtil.rpad("LOCUS"," ", 12);
        line += Teselagen.StringUtil.rpad(this.locusName," ", 16);
        line += " "; // T.H line 2778 of GenbankFormat.as col 29 space
        line += Teselagen.StringUtil.lpad(String(this.sequenceLength)," ", 11);
        line += " bp "; // col 41
        if (this.strandType !== "") {
            tmp =  this.strandType + "-";
        } else {
            tmp = "";
        }
        line += Teselagen.StringUtil.lpad(tmp, " ", 3);
        line += Teselagen.StringUtil.rpad(this.naType," ",6);
        line += "  ";

        if (this.linear === true) {
            line += "linear  ";
            //line += "        ";
        } else {
            line += "circular";
        }

        line += " "; //col 64
        if (this.divisionCode !== undefined) {
            line += Teselagen.StringUtil.rpad(this.divisionCode," ", 3);
        } else {
            Teselagen.StringUtil.rpad(line, " ", 3);
        }
        line += " "; // col 68
        // DOES NOT PARSE DATE USEFULLY ORIGINALLY!
        line += this.date;
        //line += "\n";

        return line;
    },

    /**
     * Converts to JSON format.
     * @returns {Object} json
     */
    toJSON: function() {
        var json = {
                keyword: this.keyword,
                locusName: this.locusName,
                sequenceLength: this.sequenceLength,
                strandType: this.strandType,
                naType: this.naType,
                linear: this.linear,
                divisionCode: this.divisionCode,
                date: this.date
        };
        return json;
    },

    /**
     * Converts GenBank JSON back to GenBank model
     * @param {JSON} json Genbank Locus in JSON form
     * @returns {Teselagen.bio.parsers.GenbankLocusKeyword}
     */
    fromJSON: function(json) {
        this.setKeyword(json["keyword"]);
        this.setLocusName(json["locusName"]);
        this.setSequenceLength(json["sequenceLength"]);
        this.setStrandType(json["strandType"]);
        this.setNaType(json["naType"]);
        this.setLinear(json["linear"]);
        this.setDivisionCode(json["divisionCode"]);
        this.setDate(json["date"]);

        return this;
    }

});