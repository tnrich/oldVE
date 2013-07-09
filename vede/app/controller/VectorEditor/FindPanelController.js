/**
 * Find panel controller
 * @class Vede.controller.VectorEditor.FindPanelController
 */
Ext.define('Vede.controller.VectorEditor.FindPanelController', {
    extend: 'Ext.app.Controller',

    requires: ['Teselagen.event.CaretEvent',
               'Teselagen.event.MenuItemEvent',
               'Teselagen.event.SelectionLayerEvent',
               'Teselagen.event.SequenceManagerEvent',
               'Teselagen.manager.FindManager'],

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

        this.findManager.getAAManager().setSequenceManager(pSeqMan);
    },

    onFindFieldKeyup: function(field, event) {
        if(field.getValue() && event.getKey() === event.ENTER) {
            this.find(this.caretIndex + 1, this.caretIndex + 2);
        } else if(field.getValue() && event.getKey() !== event.ENTER) {
            this.find();
        } else {
            this.application.fireEvent(this.SelectionEvent.SELECTION_CANCELED);
            this.application.fireEvent(this.SelectionEvent.CLEAR_HIGHLIGHT);
            this.findField.setFieldStyle("background-color:white");
        }
    },
    
    onFindFieldValidityChange: function(field, valid) {
        if(valid) {
            Ext.getCmp("findNextBtn").enable();
        } else {
            Ext.getCmp("findNextBtn").disable();
            this.findField.setFieldStyle("background-color:#ff6666");
        }
    },

    onFindNextClick: function() {
        this.find(this.caretIndex + 1, this.caretIndex + 2);
    },

    find: function(startIndex, aaStartIndex) {
        if(this.findField.isValid()) {
            var result = this.findManager.findOne(this.findField.getValue(),
                                               this.findInSelector.getValue(),
                                               this.literalSelector.getValue(),
                                               startIndex || this.caretIndex,
                                               aaStartIndex);

            if(result) {
                this.findField.setFieldStyle("background-color:white");
                this.application.fireEvent(this.SelectionEvent.SELECTION_CHANGED,
                                           this, result.start, result.end);

                if(Ext.getCmp("highlightAllBtn").pressed) {
                    this.highlightMatches();
                }
            } else {
                this.findField.setFieldStyle("background-color:#ff6666");
                this.application.fireEvent(this.SelectionEvent.SELECTION_CANCELED);

                this.application.fireEvent(this.SelectionEvent.CLEAR_HIGHLIGHT);
            }
        }
    },

    onToggleHighlight: function(button, pressed) {
        if(pressed) {
            this.highlightMatches();
        } else {
            this.application.fireEvent(this.SelectionEvent.CLEAR_HIGHLIGHT);
        }
    },

    onFindInSelectorChange: function() {
        this.validateFindField();
        this.find();
    },

    highlightMatches: function() {
        var matches = this.findManager.findAll(this.findField.getValue(),
                                               this.findInSelector.getValue(),
                                               this.literalSelector.getValue());

        if(matches) {
            this.application.fireEvent(this.SelectionEvent.HIGHLIGHT, matches);
        }
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
                click: this.onFindNextClick
            },
            "#highlightAllBtn": {
                toggle: this.onToggleHighlight
            },
            "#findInSelector": {
                change: this.onFindInSelectorChange
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
        this.findManager.setAAManager(Teselagen.manager.AAManager);
    },
});