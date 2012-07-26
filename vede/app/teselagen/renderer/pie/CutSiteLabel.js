/**
 * @class Teselagen.renderer.pie.CutSiteLabel
 * Generates labels for RestrictionCutSite objects.
 * @author Nick Elsbree
 * @author Zinovii Dmytriv (original author)
 */
Ext.define("Teselagen.renderer.pie.CutSiteLabel", {
    extend: "Teselagen.renderer.common.Label",

    constructor: function(inData) {
        this.callParent(arguments);

        if(this.annotation.getRestrictionEnzyme().getName() == null ||
           this.annotation.getRestrictionEnzyme().getName() == "" ||
           this.StringUtil.trim(this.annotation.getRestrictionEnzyme().getName()) == "") {

            this.includeInView = false;
        }
    },

    /**
     * Generates text for the cut site's tooltip.
     * @return {String} The cut site tooltip.
     */
    tipText: function() {
        var strand = ", complement";
        if(this.annotation.getStrand() == 1) {
            strand = "";
        }

        return this.annotation.getRestrictionEnzyme().getName() + ": " +
            (this.annotation.getStart() + 1) + ".." + this.annotation.getEnd() +
            strand + ", cuts " + this.annotation.getNumCuts() + " times";
    },

    /**
     * Generates text for the cut site's label.
     * @return {String} The cut site label.
     */
    labelText: function() {
        return this.annotation.getRestrictionEnzyme().getName();
    },
});
