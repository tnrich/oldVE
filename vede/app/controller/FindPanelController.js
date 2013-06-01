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
        Ext.getCmp("findField").focus(true, 10);
    },

    onSequenceManagerChanged: function(pSeqMan) {
        this.sequenceManager = pSeqMan;
        this.findManager.setSequenceManager(pSeqMan);
    },

    onFindFieldKeyup: function(field, event) {
        if(event.getKey() === event.ENTER) {
            this.onFindNext();
        }
    },
    
    onFindFieldValidityChange: function(field, valid) {
        if(valid) {
            Ext.getCmp("findNextBtn").enable();
        } else {
            Ext.getCmp("findNextBtn").disable();
        }
    },

    onFindNext: function() {
        if(this.findField.isValid()) {
            var result = this.findManager.find(this.findField.getValue().toLowerCase(),
                                               this.findInSelector.getValue().toLowerCase(),
                                               this.literalSelector.getValue().toLowerCase(),
                                               this.caretIndex);

            if(result) {
                this.application.fireEvent(this.SelectionEvent.SELECTION_CHANGED,
                                           this, result.start, result.end);
            }
        }
    },

    onHighlightAll: function() {
        
    },

    validateFindField: function() {
        this.findField.validate();
    },

    init: function() {
        this.control({
            "#findField": {
                keyup: this.onFindFieldKeyup,
                validitychange: this.onFindFieldValidityChange
            },
            "#findNextBtn": {
                click: this.onFindNext
            },
            "#highlightAllBtn": {
                click: this.onHighlightAll
            },
            "#findInSelector": {
                change: this.validateFindField
            },
            "#literalSelector": {
                change: this.validateFindField
            }
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
