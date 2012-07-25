/**
 * @class Teselagen.renderer.pie.CutSiteRenderer
 * Class which creates sprites to draw all given cut sites.
 */
Ext.define("Teselagen.renderer.pie.CutSiteRenderer", {
    extend: "Teselagen.renderer.pie.PieRenderer",
    
    config: {
        cutSites: [],
        middlePoint: 0
    },

    /**
     * @param {Array<Teselagen.bio.enzymes.RestrictionCutSite>} cutSites The cut
     * sites to be rendered.
     */
    constructor: function(inData) {
        this.callParent(arguments);

        this.initConfig(inData);
    },

    /**
     * Generates sprites from the given cut sites.
     * @return {Array<Ext.draw.Sprite>} Sprites made from cut sites.
     */
    render: function() {
        Ext.each(this.getCutSites(), function(site) {
            var angle = site.getStart() * 2 * Math.PI / 
                        this.sequenceManager.getSequence().seqString().length;
            
            var middlePoint = this.GraphicUtils.pointOnCircle(this.center,
                                                              angle,
                                                              this.railRadius + 10);

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
                path: "M " + lineStart.x + " " + lineStart.y + 
                      "L " + lineEnd.x + " " + lineEnd.y,
                fill: this.FRAME_COLOR
            });
        }, this);
    },

    applyCutSites: function(pCutSites) {
        this.setNeedsMeasurement(true);
        this.invalidateDisplayList();

        return pCutSites;
    }
});
