
/**
 * GenbankLocusKeyword class. 
 * Class for GenbankLocusKeyword. Same level as GenbankKeyword, GebankFeaturesKeyword, and GenbankOriginKeyword.
 * Specificfor parsing the Locus line.
 * @author Diana Wong
 * @author Timothy Ham (original author)
 */

Ext.define("Teselagen.bio.parsers.GenbankLocusKeyword", {
    /* */
    extend: "Teselagen.bio.parsers.Keyword",

    /**
     * Creates a new GenbankLocusKeyword from inData.
     * @param {String} locusName 
     * @param {String} sequenceLength
     * @param {String} strandType
     * @param {String} naType
     * @param {String} linear
     * @param {String} divisionCode
     * @param {String} date
     */
    constructor: function (inData) {
        var that = this;
        that.keyword = "LOCUS";
        var locusName;
        var sequenceLength;
        var strandType;
        var naType;
        var linear; //boolean; cannot designate Tandem
        var circular; //boolean
        var divisionCode;
        var date;

        if (inData ) {
            //console.log(JSON.stringify(inData, null, " "));
            locusName 		= inData.locusName;
            sequenceLength 	= inData.sequenceLength;
            strandType		= inData.strandType;
            naType			= inData.naType;
            linear			= inData.linear;
            circular;//		= inData.circular;
            divisionCode	= inData.divisionCode;
            date			= inData.date;
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
         * @params {String} locusName
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
         * @params {String} pStrandType
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
         * @params {String}
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
         * @params {String} naType
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
         * @params {String}
         */
        this.setLinear = function(pLinear) {
            linear = pLinear;
        }

        this.getCircular = function() {
            return circular;
        }
        this.setCircular = function(pCircular) {
            circular = pCircular;
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
         * @params {String}
         */
        this.setDivisionCode = function(pDivisionCode) {
            divisionCode = pDivisionCode;
        }
        /**
         * Get date
         * 
         * @returns {String} date
         */
        this.getDate = function() {
            return date;
        }
        /**
         * Set Date
         * @params {String}
         */
        this.setDate = function(pDate) {
            date = pDate;
        }

        /**
         * Converts this GenbankLocusKeyword to Genbank file format string
         * @returns {String}
         */
        this.toString = function () {
            var tmp;

            var line = "LOCUS".rpad(" ", 12);
            line += locusName.rpad(" ", 16);
            line += " "; // T.H line 2778 of GenbankFormat.as col 29 space
            line += sequenceLength.lpad(" ", 11);
            line += " bp "; // col 41
            if (strandType !== "") {
                tmp =  strandType + "-";
            } else {
                tmp = "";
            }
            line += tmp.lpad(" ", 3);
            line += naType.rpad(" ",6);
            line += "  ";

            if (linear === true) {
                line += "linear  ";
                //line += "        ";
            } else {
                line += "circular";
            }

            line += " "; //col 64
            if (divisionCode !== undefined) {
                line += divisionCode.rpad(" ", 3);
            } else {
                line.rpad(" ", 3);
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
                    keyword: that.keyword,
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