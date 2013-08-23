/**
 * @class Teselagen.renderer.common.AnnotationRenderer
 * Parent class of all renderers. Each annotation type has a renderer class for
 * both the pie and the rail views. The renderers take in a list of their
 * annotation type and return an array of sprites which will represent the
 * annotations when rendered.
 * @author Nick Elsbree
 * @author Zinovii Dmytriv (original author)
 */
Ext.define("Teselagen.renderer.common.AnnotationRenderer", {
    requires: ["Teselagen.renderer.common.Alignment",
               "Teselagen.bio.sequence.common.StrandType",
               "Teselagen.event.ContextMenuEvent"],

    inheritableStatics: {
        FRAME_COLOR: "#606060"
    },

    config: {
        sequenceManager: null,
        needsMeasurement: true
    },

    Alignment: null,
    StrandType: null,

    /**
     * @param {Teselagen.manager.SequenceManager} sequenceManager The
     * SequenceManager object to obtain data from.
     * @param {Boolean} needsMeasurement Set to true when data changes and the
     * render must be redone. Not sure if this is necessary in the port.
     */
    constructor: function(inData) {
        this.initConfig(inData);
        this.Alignment = Teselagen.renderer.common.Alignment;
        this.StrandType = Teselagen.bio.sequence.common.StrandType;
    },

    applySequenceManager: function(pSeqMan) {
        this.setNeedsMeasurement(true);

        return pSeqMan;
    },

    applyCenter: function(pCenter) {
        this.setNeedsMeasurement(true);

        return pCenter;
    },

    /**
     * Adds a tooltip to a given sprite. Since a sprite can't have a tooltip
     * until it's been rendered, we have to add an event listener for the 
     * render event and then register the tooltip in the event handler.
     * @param {Ext.draw.Sprite} sprite The sprite to add the tooltip to.
     * @param {String} tooltip The tooltip text.
     */
    addToolTip: function(sprite, tooltip) {
        sprite.tooltip = tooltip;
        sprite.on("render", function(me) {
            var tip = Ext.create("Ext.tip.ToolTip", {
                target: me.el,
                html: me.tooltip
            });
        });
    },
    
    /**
     * Returns a function which fires an application event
     * with the start and end as arguments. This allows the controllers to
     * select the annotation when it is clicked.
     */
    getClickListener: function(start, end) {
        return function() {
            Vede.application.fireEvent("VectorPanelAnnotationClicked", start, end);
        };
    },
    
    /**
     * @private
     * Generates the tooltip label for an ORF
     * @param {Teselagen.bio.orf.ORF} orf The orf to calculate a tooltip for.
     * @return {String} The calculated tooltip.
     */
    getORFTooltipLabel: function(orf) {
        var bp = Math.abs(orf.getEnd() - orf.getStart());
        var aa = Math.floor(bp / 3);
        var complimentary = "";
        var orfDisplay = orf.toJSON();
        
        if(orf.getStrand() === 1 && orf.getStartCodons().length > 1) {
            complimentary = ", complimentary";
        }

        var tooltipLabel = orfDisplay.start + ".." + orfDisplay.end +
            ", frame: " + orfDisplay.frame +
            ", length: " + bp + " BP" +
            ", " + aa + " AA" + complimentary;

        if(orf.getStartCodons().length > 1) {
            tooltipLabel += "\nStart Codons: ";
            
            var codonsArray = [];
            var codonString;
            Ext.each(orf.getStartCodons(), function(codon, index) {
                if(index !== orf.getStartCodons().length - 1) {
                    codonString = (codon + 1) + ", ";
                } else {
                    codonString = codon + 1;
                }

                codonsArray.push(codonString);
            });

            tooltipLabel = [tooltipLabel].concat(codonsArray).join("");
        }

        return tooltipLabel;
    },

    /**
     * Creates a right click listener for a feature
     */
    getRightClickListener: function(feature) {
        var sequenceManager = this.sequenceManager;
        return function() {
        	d3.event.preventDefault();
        	//console.log("Annotation Rendered did 'getRightClickListener'")
            Vede.application.fireEvent(Teselagen.event.ContextMenuEvent.PIE_ANNOTATION_RIGHT_CLICKED, feature);
            /*var contextMenu = Ext.create('Ext.menu.Menu',{
                  items: [{
                    text: 'Edit Sequence Feature',
                    handler: function() {
                        var editSequenceFeatureWindow = Ext.create(
                        "Vede.view.ve.EditSequenceFeatureWindow");
                        
                        editSequenceFeatureWindow.show();
                        editSequenceFeatureWindow.center();
                    }
                  },{
                    text: 'Delete Sequence Feature',
                    handler: function() {
                        sequenceManager.removeFeature(feature,false);
                    }
                  }]
            });                  
            contextMenu.show(); 
            contextMenu.setPagePosition(d3.event.pageX+1, d3.event.pageY - 5);*/
        };
    }

});



