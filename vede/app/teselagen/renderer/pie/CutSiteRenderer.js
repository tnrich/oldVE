/**
 * @class Teselagen.renderer.pie.CutSiteRenderer
 * Class which creates sprites to draw all given cut sites.
 */
Ext.define("Teselagen.renderer.pie.CutSiteRenderer", {
    extend: "Teselagen.renderer.pie.PieRenderer",
    
    config: {
        cutSites: [],
        middlePoints: null 
    },

    /**
     * @param {Array<Teselagen.bio.enzymes.RestrictionCutSite>} cutSites The cut
     * sites to be rendered.
     */
    constructor: function(inData) {
        this.callParent(arguments);

        this.initConfig(inData);

        this.middlePoints = Ext.create("Ext.util.HashMap");
    },

    /**
     * Generates sprites from the given cut sites.
     * @return {Array<Ext.draw.Sprite>} Sprites made from cut sites.
     */
    render: function() {
        var sprites = [];

        Ext.each(this.getCutSites(), function(site) {
            var angle = site.getStart() * 2 * Math.PI / 
                        this.sequenceManager.getSequence().seqString().length;
            
            this.middlePoints.add(site, this.GraphicUtils.pointOnCircle(this.center,
                                                              angle,
                                                              this.railRadius + 10));

            var lineStart = {
                x: this.center.x + this.railRadius * Math.sin(angle),
                y: this.center.y - this.railRadius * Math.cos(angle),
            };

            var lineEnd = {
                x: this.center.x + (this.railRadius + 10) * Math.sin(angle),
                y: this.center.y + (this.railRadius + 10) * Math.cos(angle)
            };

            var siteSprite = Ext.create("Ext.draw.Sprite", {
                type: "path",
                path: "M" + lineStart.x + " " + lineStart.y + " " +
                      "L" + lineEnd.x + " " + lineEnd.y,
                fill: this.FRAME_COLOR,
                tooltip: this.getToolTip(site),
                listeners: {
                    render: function(me) {
                        Ext.QuickTip.register({
                            target: me.el,
                            text: me.tooltip
                        });
                    }
                }
            });

            // Create a tooltip for the sprite. Hopefully.
            var tooltip = this.getToolTip(site);
            Ext.create("Ext.tip.ToolTip", {
                target: site,
                html: tooltip
            });

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
    },

    applyCutSites: function(pCutSites) {
        this.setNeedsMeasurement(true);

        return pCutSites;
    }
});
