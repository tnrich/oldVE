/**
 * @class Teselagen.renderer.rail.CutSiteRenderer
 * Class which creates sprites to draw all given cut sites.
 */
Ext.define("Teselagen.renderer.rail.CutSiteRenderer", {
    reqires: ["Teselagen.bio.util.Point"],
    
    extend: "Teselagen.renderer.rail.RailRenderer",

    statics: {
        CUTSITE_LINE_WIDTH: 0.5,
    },
    
    config: {
        cutSiteSVG: null,
        cutSites: [],
        railWidth: null,
        railHeight:null,
        railGap: null,
        startPoints: null,
        reference: null,
    },

    /**
     * @param {Teselagen.bio.enzymes.RestrictionCutSite[]} cutSites The cut
     * sites to be rendered.
     */
    constructor: function(inData) {
        this.callParent(arguments);

        this.initConfig(inData);

        this.startPoints = Ext.create("Ext.util.HashMap");
    },

    /**
     * Generates sprites from the given cut sites.
     * @return {Ext.draw.Sprite[]} Sprites made from cut sites.
     */
    render: function() {
        var labelPos = {};
        var path;
        
        Ext.each(this.getCutSites(), function(site) {
            var startPos = site.getStart()  / 
                        this.sequenceManager.getSequence().seqString().length;

            var xStartPosition =  this.reference.x + (startPos*this.railWidth);
            var yPosition = this.reference.y;
            labelPos = {x:xStartPosition, y:yPosition};
            this.startPoints.add(site, labelPos);
            
            var lineStart = Ext.create("Teselagen.bio.util.Point",
                xStartPosition,
                this.reference.y - this.railHeight 
            );

            var lineEnd = Ext.create("Teselagen.bio.util.Point", 
                xStartPosition,
                this.reference.y - (this.railHeight + 8)
            );

            path = "M" + lineStart.x + " " + lineStart.y + " " +
                   "L" + lineEnd.x + " " + lineEnd.y;

            this.cutSiteSVG.append("svg:path")
                           .attr("stroke", this.self.FRAME_COLOR)
                           .attr("stroke-width", this.self.CUTSITE_LINE_WIDTH)
                           .attr("d", path)
                           .on("mousedown", this.getClickListener(site.getStart(),
                                                                  site.getEnd()))
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

        return pCutSites;
    }
});
