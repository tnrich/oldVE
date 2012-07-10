
/**
 * GenbankLocusKeyword. 
 * Stores the information from the LOCUS line of a Genbank file. 
 * Same level as GenbankKeyword, GebankFeaturesKeyword, and GenbankOriginKeyword.
 * Specificfor parsing the Locus line.
 * @author Diana Wong
 * @author Timothy Ham (original author)
 */

Ext.define("Teselagen.bio.parsers.GenbankLocusKeyword", {
    
    requires: ["Teselagen.bio.util.StringUtil"],
    
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
            //console.log(JSON.stringify(inData, null, " "));
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
         * @params {String} sequenceLength
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
         * @params {Boolean} linear
         */
        this.setLinear = function(pLinear) {
            linear = pLinear;
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
         * @params {String} divisionCode
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
         * @params {String} date
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