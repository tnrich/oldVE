/**
 * @class Teselagen.bio.enzymes.RestrictionCutSite
 * Restriction cut site.
 * @author Nick Elsbree
 * @author Michael Fero
 * @author Zinovii Dmytriv (original author)
 */
Ext.define("Teselagen.bio.enzymes.RestrictionCutSite", {

    extend: "Teselagen.bio.sequence.common.StrandedAnnotation",

    /**
     * Constructor.
     * @param {Int} start Cut site start location.
     * @param {Int} end Index of the nucleotide AFTER the last nucleotide in the cut site.
     * @param {Teselagen.bio.enzymes.RestrictionEnzyme} restrictionEnzyme Restriction enzyme this cut site was created with.
     * @return {Teselagen.bio.enzymes.RestrictionCutSite} A RestrictionCutSite object.
     */
    constructor: function(inData) {
        var that = this;
        var restrictionEnzyme;
        var numCuts = 0;

        this.callParent([inData]);

        if (inData){
            that.start = inData.start;
            that.end = inData.end;
            restrictionEnzyme = inData.restrictionEnzyme;
        }

        /**
         * Get restriction enzyme.
         * @return {Teselagen.bio.enzymes.RestrictionEnzyme}
         */
        this.getRestrictionEnzyme = function(){
            return restrictionEnzyme;
        };

        /**
         * Set restriction enzyme.
         * @param {Teselagen.bio.enzymes.RestrictionEnzyme} pRestrictionEnzyme
         */
        this.setRestrictionEnzyme = function(pRestrictionEnzyme) {
            restrictionEnzyme = pRestrictionEnzyme;
        };

        /**
         * Get number of cuts.
         * @return {Int}
         */
        this.getNumCuts = function(){
            return numCuts;
        };

        /**
         * Set number of cuts.
         * @param {Int} pNumCuts
         */
        this.setNumCuts = function(pNumCuts){
            numCuts = pNumCuts;
        };

        this.toString = function() {
            return inData.start + ".." + inData.end + " " + 
                inData.restrictionEnzyme;
        };

        return this;
    },

    toJSON: function() {
        var start = this.getStart()+1;
        var end = this.getEnd();

        return {
            name: this.getRestrictionEnzyme().getName(),
            start: start,
            end: end,
            position: start +  "-"  + end,
            strand: this.getStrand(),
            palindromic: this.getRestrictionEnzyme().isPalindromic()
        };
    }
});
