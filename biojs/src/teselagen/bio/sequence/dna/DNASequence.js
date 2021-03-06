/**
 * @class Teselagen.bio.sequence.dna.DNASequence
 * DNA sequence with extra meta information
 * 
 * @author Micah Lerner
 * @author Zinovii Dmytriv (original author)
 * @extends Teselagen.bio.sequence.common.Sequence
 * @requires Teselagen.bio.sequence.common.Sequence
 * @requires Teselagen.bio.sequence.common.SymbolList
 */
Ext.define("Teselagen.bio.sequence.dna.DNASequence", {
    requires: ["Teselagen.bio.sequence.common.Sequence", "Teselagen.bio.sequence.common.SymbolList"],
    extend: "Teselagen.bio.sequence.common.Sequence",

    /**
     * Constructor
     * 
     * @param symbolList DNA sequence
     * @param name Sequence name
     * @param circular Defines if sequence is circular or not. Default <code>false</code>
     * @param accession Sequence accession number
     * @param version Version
     * @param seqVersion Sequence version
     */
    constructor: function (inData) {
        if (inData) {
            var symbolList = inData.symbolList || null;
            var name = inData.name || "";
            var circular = inData.circular || false;
            var accession = inData.accession || "";
            var version = inData.version || 1;
            var seqVersion = inData.seqVersion || 0.0;
            this.callParent([inData]);
        } else {
            Teselagen.bio.BioException.raise("Arguments needed");
        }

        /**
         * Get Accession
         * @method getAccession
         * @return {String}
         */
        this.getAccession = function(){
            return accession;
        }

        /**
         * Set Accession
         * @method setAccession
         * @param {String} accession
         */
        this.setAccession= function (pAccession){
            accession = pAccession;
        }


        /**
         * Get Version
         * @method getVersion
         * @return {Number}
         */
        this.getVersion = function(){
            return version;
        }


        /**
         * Set Version
         * @method setVersion
         * @param {Number} version
         */
        this.setVersion= function (pVersion){
            version = pVersion;
        }

        /**
         * Get Sequence Version
         * @method getSeqVersion
         * @return {Number}
         */
        this.getSeqVersion = function(){
            return seqVersion;
        }

        /**
         * Set Sequence Version
         * @method setSeqVersion
         * @param {Number} seqVersion
         */
        this.setSeqVersion= function (pSeqVersion){
            seqVersion = pSeqVersion;
        }

        /**
         * Get Circular
         * @method getCircular
         * @return {Boolean}
         */
        this.getCircular = function(){
            return circular;
        }

        /**
         * Set circular
         * @method setCircular
         * @param {Boolean} circular
         */
        this.setCircular = function (pCircular){
            circular = pCircular;
        }

        return this;
    }
});