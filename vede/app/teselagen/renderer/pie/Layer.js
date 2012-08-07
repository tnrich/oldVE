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
        sequenceManager: null,
        center: {},
        radius: 0
    },

    start: -1,
    end: -1,

    selecting: false,
    selected: false,

    selectionSprite: null,

    constructor: function(inData) {
        this.initConfig(inData);
    },

    select: function(fromIndex, toIndex, direction) {
        this.drawSelectionPie(fromIndex, toIndex, direction);

        this.selected = true;
        this.start = fromIndex;
        this.end = toIndex;
    },

    deselect: function() {
        this.start = -1;
        this.end = -1;
        
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

    drawSelectionPie: function(fromIndex, endIndex, direction) {
    }
});
