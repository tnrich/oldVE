
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
     * Creates a new GenbankLocusKeyword from inData.
     * @param {String} locusName 
     * @param {Number} sequenceLength base pair length
     * @param {String} strandType ss or ds
     * @param {String} naType DNA or RNA
     * @param {Boolean} linear !linear = circular.
     * @param {String} divisionCode Three letter code in caps.
     * @param {String} date
     * @returns {GenbankLocusKeyword}
     * @memberOf GenbankLocusKeyword
     */
    constructor: function (inData) {
        //var that = this;
        
        this.keyword = "LOCUS";
        var locusName;
        var sequenceLength;
        var strandType;
        var naType;
        var linear; //boolean; cannot designate Tandem
        var circular; //boolean
        var divisionCode;
        var date;

        if (inData ) {
            locusName 		= inData.locusName || "";
            sequenceLength 	= inData.sequenceLength || "";
            strandType		= inData.strandType || "";
            naType			= inData.naType || "";
            linear			= inData.linear || false; // false or false; default is false, only a true can override this
            circular		= !inData.linear || false; //untested
            divisionCode	= inData.divisionCode || "";
            date			= inData.date || "";
        }
        /**
         * Get locusName
         * @returns {String} locusName
         */
        this.getLocusName = function() {
            return locusName;
        }
        /**
         * Set locusName
         * @param {String} locusName
         */
        this.setLocusName = function(pLocusName) {
            locusName = pLocusName;
        }
        /**
         * Get strandType
         * @returns {String} strandType
         */
        this.getStrandType = function() {
            return strandType;
        }
        /**
         * Set strandType
         * @param {String} strandType
         */
        this.setStrandType = function(pStrandType) {
            strandType = pStrandType;
        }
        /**
         * Get sequenceLength
         * @returns {String} sequenceLength
         */
        this.getSequenceLength = function() {
            return sequenceLength;
        }
        /**
         * Set SequenceLength
         * @param {String} sequenceLength
         */
        this.setSequenceLength = function(pSequenceLength) {
            sequenceLength = pSequenceLength;
        }
        /**
         * Get naType
         * @returns {String} naType
         */
        this.getNaType = function() {
            return naType;
        }
        /**
         * Set naType
         * @param {String} naType
         */
        this.setNaType = function(pNaType) {
            naType = pNaType;
        }
        /**
         * Get linear
         * @returns {Boolean} linear
         */
        this.getLinear = function() {
            return linear;
        }
        /**
         * Set linear
         * @param {Boolean} linear
         */
        this.setLinear = function(pLinear) {
            linear = pLinear;
            circular = !pLinear;
        }
        /** Get Circular
         * @returns {Boolean} circular
         */
        this.getCircular = function() {
            return circular;
        }
        /**
         * Set Circular
         * @param {Boolean} circular
         */
        this.setCircular = function(pCircular) {
            circular = pCircular;
            linear = !pCircular;
        }
        /**
         * Get divisionCode
         * @returns {String} divisionCode
         */
        this.getDivisionCode = function() {
            return divisionCode;
        }
        /**
         * Set DivisionCode
         * @param {String} divisionCode
         */
        this.setDivisionCode = function(pDivisionCode) {
            divisionCode = pDivisionCode;
        }
        /**
         * Get date
         * @returns {String} date
         */
        this.getDate = function() {
            return date;
        }
        /**
         * Set Date
         * @param {String} date
         */
        this.setDate = function(pDate) {
            date = pDate;
        }

        /**
         * Converts this GenbankLocusKeyword to Genbank file format string
         * @returns {String} genbankString
         */
        this.toString = function () {
            var tmp;

            var line = Teselagen.StringUtil.rpad("LOCUS"," ", 12);
            line += Teselagen.StringUtil.rpad(locusName," ", 16);
            line += " "; // T.H line 2778 of GenbankFormat.as col 29 space
            line += Teselagen.StringUtil.lpad(sequenceLength," ", 11);
            line += " bp "; // col 41
            if (strandType !== "") {
                tmp =  strandType + "-";
            } else {
                tmp = "";
            }
            line += Teselagen.StringUtil.lpad(tmp, " ", 3);
            line += Teselagen.StringUtil.rpad(naType," ",6);
            line += "  ";

            if (linear === true) {
                line += "linear  ";
                //line += "        ";
            } else {
                line += "circular";
            }

            line += " "; //col 64
            if (divisionCode !== undefined) {
                line += Teselagen.StringUtil.rpad(divisionCode," ", 3);
            } else {
                Teselagen.StringUtil.rpad(line, " ", 3);
            }
            line += " "; // col 68
            // DOES NOT PARSE DATE USEFULLY ORIGINALLY!
            line += date;
            //line += "\n";

            return line;
        }
        /**
         * Converts to JSON format.
         * @returns {Object} json
         */
        this.toJSON = function() {
            var json;
            json = {
                    keyword: this.keyword,
                    locusName: locusName,
                    sequenceLength: sequenceLength,
                    strandType: strandType,
                    naType: naType,
                    linear: linear,
                    divisionCode: divisionCode,
                    date: date
            };
            return json;
        }


        return this;
    }

});