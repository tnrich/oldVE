/**
 * @class Teselagen.renderer.pie.CutSiteRenderer
 * Class which creates sprites to draw all given cut sites.
 */
Ext.define("Teselagen.renderer.pie.CutSiteRenderer", {
    requires: ["Teselagen.bio.util.Point"],
    
    extend: "Teselagen.renderer.pie.PieRenderer",

    statics: {
        CUTSITE_LINE_WIDTH: 0.5,
    },
    
    config: {
        cutSiteSVG: null,
        cutSites: [],
        middlePoints: null 
    },

    /**
     * @param {Teselagen.bio.enzymes.RestrictionCutSite[]} cutSites The cut
     * sites to be rendered.
     */
    constructor: function(inData) {
        this.callParent(arguments);

        this.initConfig(inData);

        this.middlePoints = Ext.create("Ext.util.HashMap");
    },

    /**
     * Generates sprites from the given cut sites.
     * @return {Ext.draw.Sprite[]} Sprites made from cut sites.
     */
    render: function() {
        Ext.each(this.getCutSites(), function(site) {
            var angle = site.getStart() * 2 * Math.PI / 
                        this.sequenceManager.getSequence().seqString().length;
            
            this.middlePoints.add(site, this.GraphicUtils.pointOnCircle(
                                            this.center, angle,
                                            this.railRadius + 10));

            var lineStart = Ext.create("Teselagen.bio.util.Point",
                this.center.x + this.railRadius * Math.sin(angle),
                this.center.y - this.railRadius * Math.cos(angle)
            );

            var lineEnd = Ext.create("Teselagen.bio.util.Point", 
                this.center.x + (this.railRadius + 10) * Math.sin(angle),
                this.center.y - (this.railRadius + 10) * Math.cos(angle)
            );

            path = "M" + lineStart.x + " " + lineStart.y + " " +
                   "L" + lineEnd.x + " " + lineEnd.y;

            this.cutSiteSVG.append("svg:path")
                           .attr("stroke", this.self.FRAME_COLOR)
                           .attr("stroke-width", this.self.CUTSITE_LINE_WIDTH)
                           .attr("d", path)
                           .on("mousedown", function() {
                               Vede.application.fireEvent("VectorPanelAnnotationClicked",
                                                          site.getStart(),
                                                          site.getEnd());
                           })
                           .append("svg:title")
                           .text(this.getToolTip(site));
        }, this);
    },

    /**
     * Generates a tooltip for the given cut site.
     * @param {Teselagen.bio.enzymes.RestrictionCutSite} cutSite The site to get
     * a tooltip for.
     */
    getToolTip: function(cutSite) {
        var complement = ", complement";
        if(cutSite.getStrand() == 1) {
            complement = "";
        }

        var toolTip = cutSite.getRestrictionEnzyme().getName() + ": " + 
                      (cutSite.getStart() + 1) + ".." + (cutSite.getEnd()) +
                      complement + ", cuts " + cutSite.getNumCuts() + " times";

        return toolTip;
    },

    applyCutSites: function(pCutSites) {
        this.setNeedsMeasurement(true);

        return pCutSites;
    }
});
