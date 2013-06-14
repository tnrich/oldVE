/**
 * @class Teselagen.renderer.pie.Layer
 * Parent class for layer classes. The layer classes render selections, both
 * in progress and completed.
 * @author Nick Elsbree
 */
Ext.define("Teselagen.renderer.pie.Layer", {
    inheritableStatics: {
        STROKE_OPACITY: 0.8
    },

    config: {
        selectionSVG: null,
        sequenceManager: null,
        center: {},
        radius: 0
    },

    start: -1,
    end: -1,

    startAngle: 0,
    endAngle: 0,

    selecting: false,
    selected: false,

    /**
     * @param {Teselagen.manager.SequenceManager} sequenceManager The
     * sequenceManager instance to obtain sequence length from.
     * @param {Teselagen.bio.util.Point} center The center of the pie.
     * @param {Int} radius The radius of the pie.
     */
    constructor: function(inData) {
        this.initConfig(inData);
    },

    /**
     * Calls drawSelectionPie and sets relevant instance variables.
     * @param {Int} fromIndex The index where selection started.
     * @param {Int} toIndex The index where selection ended.
     */
    select: function(fromIndex, toIndex, pointerEvents) {
        this.drawSelectionPie(fromIndex, toIndex, pointerEvents);

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

        this.startAngle = 0;
        this.endAngle = 0;
        
        this.selected = false;
        this.selecting = false;
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
    drawSelectionPie: function(fromIndex, endIndex) {
    }
});
