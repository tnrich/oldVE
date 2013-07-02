/**
 * @class Teselagen.renderer.rail.Layer
 * Parent class for layer classes. The layer classes render selections, both
 * in progress and completed.
 * @author Nick Elsbree
 */
Ext.define("Teselagen.renderer.rail.Layer", {
    inheritableStatics: {
        STROKE_OPACITY: 0.8
    },

    config: {
        sequenceManager: null,
        reference: {},
        radius: 0,
        railWidth: null,
    },

    start: -1,
    end: -1,

    startPos: 0,
    endPos: 0,

    selecting: false,
    selected: false,

    selectionSprite: null,

    /**
     * @param {Teselagen.manager.SequenceManager} sequenceManager The
     * sequenceManager instance to obtain sequence length from.
     * @param {Teselagen.bio.util.Point} center The center of the rail.
     * @param {Int} radius The radius of the rail.
     */
    constructor: function(inData) {
        this.initConfig(inData);
    },

    /**
     * Calls drawSelectionRail and sets relevant instance variables.
     * @param {Int} fromIndex The index where selection started.
     * @param {Int} toIndex The index where selection ended.
     */
    select: function(fromIndex, toIndex) {
        this.drawSelectionRail(fromIndex, toIndex);

        this.selected = true;
        this.start = fromIndex;
        this.end = toIndex;
    },

    /**
     * Deselects any current selection and sets instance variables to appropriate
     * values.
     */
    deselect: function() {
        this.start = -1;
        this.end = -1;

        this.startPos = 0;
        this.endPos = 0;
        
        this.selected = false;
        this.selecting = false;

        if(this.selectionSprite) {
            this.selectionSprite.destroy();
        }
    },

    startSelecting: function() {
        this.selecting = true;
    },

    endSelecting: function() {
        this.selecting = false;
    },

    /**
     * @private
     * Draws the wedge-shaped selection.
     */
    drawSelectionRail: function(fromIndex, endIndex) {
    }
});
