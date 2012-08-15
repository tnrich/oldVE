/**
 * @class Teselagen.renderer.rail.CutSiteRenderer
 * Class which creates sprites to draw all given cut sites.
 */
Ext.define("Teselagen.renderer.rail.CutSiteRenderer", {
    extend: "Teselagen.renderer.rail.RailRenderer",

    statics: {
        CUTSITE_LINE_WIDTH: 0.5,
    },
    
    config: {
        cutSites: [],
        railWidth: null,
        railHeight:null,
        railGap: null,
        startPoints: null 
    },

    /**
     * @param {Array<Teselagen.bio.enzymes.RestrictionCutSite>} cutSites The cut
     * sites to be rendered.
     */
    constructor: function(inData) {
        this.callParent(arguments);

        this.initConfig(inData);

        this.startPoints = Ext.create("Ext.util.HashMap");
    },

    /**
     * Generates sprites from the given cut sites.
     * @return {Array<Ext.draw.Sprite>} Sprites made from cut sites.
     */
    render: function() {
        var sprites = [];
        var sitePos = {};
        
        Ext.each(this.getCutSites(), function(site) {
            var startPos = site.getStart()  / 
                        this.sequenceManager.getSequence().seqString().length;
            console.log(startPos);
            sitePos.x = startPos;
            sitePos.y = this.reference.y;
            
            this.startPoints.add(site, sitePos);
            
            var lineStart = Ext.create("Teselagen.bio.util.Point",
                this.reference.x + this.railWidth * start.x,
                this.reference.y - this.railHeight 
            );

            var lineEnd = Ext.create("Teselagen.bio.util.Point", 
                this.reference.x + (this.railWidth * startPos.x),
                this.reference.y - (this.railHeight + 10)
            );

            var siteSprite = Ext.create("Ext.draw.Sprite", {
                type: "path",
                path: "M" + lineStart.x + " " + lineStart.y + " " +
                      "L" + lineEnd.x + " " + lineEnd.y,
                stroke: this.self.FRAME_COLOR,
                "stroke-width": this.self.CUTSITE_LINE_WIDTH,
            });

            this.addToolTip(siteSprite, this.getToolTip(site));

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

        return pCutSites;
    }
});
