/**
 * @class Teselagen.renderer.pie.CutSiteLabel
 * Generates labels for RestrictionCutSite objects.
 * @author Nick Elsbree
 * @author Zinovii Dmytriv (original author)
 */
Ext.define("Teselagen.renderer.pie.CutSiteLabel", {
    extend: "Teselagen.renderer.common.Label",

    config: {
        center: null,
    },

    constructor: function(inData) {
        this.callParent(arguments);

        this.initConfig(inData);
    },

    /**
     * Generates text for the cut site's label, which is just the enzyme name.
     * @return {String} The cut site label.
     */
    labelText: function() {
        return this.annotation.getRestrictionEnzyme().getName();
    },
});
