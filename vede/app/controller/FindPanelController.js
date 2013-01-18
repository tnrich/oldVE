/**
 * Find panel controller
 * @class Vede.controller.FindPanelController
 */
Ext.define('Vede.controller.FindPanelController', {
    extend: 'Ext.app.Controller',

    requires: ['Teselagen.event.CaretEvent',
               'Teselagen.event.MenuItemEvent',
               'Teselagen.event.SelectionEvent',
               'Teselagen.event.SequenceManagerEvent'],

    CaretEvent: null,
    MenuItemEvent: null,
    SelectionEvent: null,
    SequenceManagerEvent: null,

    findManager: null,
    sequenceManager: null,

    findField: null,
    findInSelector: null,
    literalSelector: null,

    caretIndex: 0,

    onCaretPositionChanged: function(scope, index) {
        this.caretIndex = index;
    },

    onFindPanelOpened: function() {
        Ext.getCmp("FindPanel").setVisible(!Ext.getCmp("FindPanel").isVisible());
    },

    onSequenceManagerChanged: function(pSeqMan) {
        this.sequenceManager = pSeqMan;
        this.findManager.setSequenceManager(pSeqMan);
    },

    onFindNext: function() {
        var result = this.findManager.find(this.findField.getValue().toLowerCase(),
                                           this.findInSelector.getValue().toLowerCase(),
                                           this.literalSelector.getValue().toLowerCase(),
                                           this.caretIndex);

        console.log(result);

        if(result) {
            this.application.fireEvent(this.SelectionEvent.SELECTION_CHANGED,
                                       this, result.start, result.end);
        }
    },

    onHighlightAll: function() {

    },

    init: function() {
        this.control({
            "#findNextBtn": {
                click: this.onFindNext
            },
            "#highlightAllBtn": {
                click: this.onHighlightAll
            },
        });

        this.CaretEvent = Teselagen.event.CaretEvent;
        this.MenuItemEvent = Teselagen.event.MenuItemEvent;
        this.SelectionEvent = Teselagen.event.SelectionEvent;
        this.SequenceManagerEvent = Teselagen.event.SequenceManagerEvent;

        this.application.on(this.CaretEvent.CARET_POSITION_CHANGED,
                            this.onCaretPositionChanged, this);
        this.application.on(this.MenuItemEvent.FIND_PANEL_OPENED,
                            this.onFindPanelOpened, this);
        this.application.on(this.SequenceManagerEvent.SEQUENCE_MANAGER_CHANGED,
                            this.onSequenceManagerChanged, this);
    },

    onLaunch: function() {
        this.findField = Ext.getCmp("findField");
        this.findInSelector = Ext.getCmp("findInSelector");
        this.literalSelector = Ext.getCmp("literalSelector");

        this.findManager = Ext.create("Teselagen.manager.FindManager");
    },
});
