/**
 * Select window controller
 * @class Vede.controller.VectorEditor.SelectWindowController
 */
Ext.define("Vede.controller.VectorEditor.SelectWindowController", {
    extend: "Ext.app.Controller",

    requires: ["Teselagen.event.SelectionEvent",
               "Teselagen.event.SequenceManagerEvent",
               "Teselagen.event.MenuItemEvent"],

    MenuItemEvent: null,
    SelectionEvent: null,

    selectWindow: null,
    sequenceManager: null,

    onSelectWindowOpened: function(window) {
        this.selectWindow = window;
    },

    onSequenceManagerChanged: function(sequenceManager) {
        this.sequenceManager = sequenceManager;
    },

    onOKButtonClick: function() {
        if(!this.sequenceManager) {
            this.selectWindow.close();
        }

        var from = Ext.getCmp("selectWindowFromField").getValue();
        var to = Ext.getCmp("selectWindowToField").getValue();
        var seqLen = this.sequenceManager.getSequence().toString().length;

        if(isNaN(from) || from > seqLen || from < 1) {
            Ext.getCmp("selectWindowFromField").setFieldStyle("border-color:red");
        } else if(isNaN(to) || to > seqLen || to < 1) {
            Ext.getCmp("selectWindowToField").setFieldStyle("border-color:red");
        } else {
            this.selectWindow.close();
            this.application.fireEvent(this.SelectionEvent.SELECTION_CHANGED,
                                       this, Number(from) - 1, Number(to));
        }
    },

    onTabChange: function(mainAppPanel, newTab) {
        if(newTab.initialCls === "VectorEditorPanel") {
            this.onSequenceManagerChanged(newTab.model);
        }
    },

    init: function() {
        this.control({
            "#mainAppPanel": {
                tabchange: this.onTabChange
            },
            "#selectWindowOKButton": {
                click: this.onOKButtonClick
            }
        });

        this.MenuItemEvent = Teselagen.event.MenuItemEvent;
        this.SelectionEvent = Teselagen.event.SelectionEvent;

        this.application.on(this.MenuItemEvent.SELECT_WINDOW_OPENED,
                            this.onSelectWindowOpened, this);
        this.application.on(Teselagen.event.SequenceManagerEvent.SEQUENCE_MANAGER_CHANGED, 
                            this.onSequenceManagerChanged, this);
    }
});
