/**
 * @class Teselagen.renderer.pie.CutSiteRenderer
 * Class which creates sprites to draw all given cut sites.
 */
Ext.define("Teselagen.renderer.pie.CutSiteRenderer", {
    extend: "Teselagen.renderer.pie.PieRenderer",

    statics: {
        CUTSITE_LINE_WIDTH: 0.5,
    },
    
    config: {
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
        var sprites = [];

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

            var siteSprite = Ext.create("Ext.draw.Sprite", {
                type: "path",
                path: "M" + lineStart.x + " " + lineStart.y + " " +
                      "L" + lineEnd.x + " " + lineEnd.y,
                stroke: this.self.FRAME_COLOR,
                "stroke-width": this.self.CUTSITE_LINE_WIDTH,
            });

            this.addToolTip(siteSprite, this.getToolTip(site));
            this.addClickListener(siteSprite, site.getStart(), site.getEnd());

            sprites.push(siteSprite);
        }, this);

        return sprites;
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
