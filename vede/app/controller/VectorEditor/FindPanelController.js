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
        this.activeTab.down("component[cls='FindPanel']").setVisible(!this.activeTab.down("component[cls='FindPanel']").isVisible());
        this.findField.focus(true, 10);
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
            this.activeTab.down("button[cls='findNextBtn']").enable();
        } else {
            this.activeTab.down("button[cls='findNextBtn']").disable();
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

                if(this.activeTab.down("button[cls='highlightAllBtn']").pressed) {
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
            "#mainAppPanel": {
                tabchange: this.onTabChange
            },
            "component[cls='findField']": {
                keyup: this.onFindFieldKeyup,
                validitychange: this.onFindFieldValidityChange
            },
            "component[cls='findNextBtn']": {
                click: this.onFindNextClick
            },
            "component[cls='highlightAllBtn']": {
                toggle: this.onToggleHighlight
            },
            "component[cls='findInSelector']": {
                change: this.onFindInSelectorChange
            },
            "component[cls='literalSelector']": {
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

    onTabChange: function(mainAppPanel, newTab, oldTab) {
        if(newTab.initialCls === "VectorEditorPanel") {
            this.activeTab = newTab;

            this.findField = newTab.down("component[cls='findField']");
            this.findInSelector = newTab.down("component[cls='findInSelector']");
            this.literalSelector = newTab.down("component[cls='literalSelector']");

            this.findManager = Ext.create("Teselagen.manager.FindManager");
            this.findManager.setAAManager(Teselagen.manager.AAManager);

            this.onSequenceManagerChanged(newTab.model);
        }
    }
});
