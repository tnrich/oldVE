/**
 * @class Teselagen.renderer.rail.CutSiteLabel
 * Generates labels for RestrictionCutSite objects.
 * @author Nick Elsbree
 * @author Zinovii Dmytriv (original author)
 */
Ext.define("Teselagen.renderer.rail.CutSiteLabel", {
    extend: "Teselagen.renderer.common.Label",

    config: {
        start: null,
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
