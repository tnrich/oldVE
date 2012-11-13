Ext.define('Vede.controller.DeviceEditor.DeviceEditorPanelController', {
    extend: 'Ext.app.Controller',
    requires: ["Ext.draw.*"],

    openProject: function(project) {
        Ext.getCmp('mainAppPanel').getActiveTab().model = project;
    },

    onDeviceEditorSaveBtnClick: function(){
        var activeTab = Ext.getCmp('mainAppPanel').getActiveTab();
        activeTab.el.mask('Loading');
        activeTab.model.getDesign().save({ 
            success: function(record, operation)
            {
                    console.log("Design Saved!");
                    activeTab.el.unmask();
            },
            failure: function(record, operation)
            {
                //handle failure(s) here
            }
        });
    },

    init: function () {
        this.callParent();
        this.application.on(Teselagen.event.ProjectEvent.OPEN_PROJECT,
                            this.openProject, this);
        this.control({
            "button[cls='DeviceEditorSaveBtn']": {
                click: this.onDeviceEditorSaveBtnClick
            }
        });
    }
});
