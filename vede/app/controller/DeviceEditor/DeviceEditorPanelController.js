Ext.define('Vede.controller.DeviceEditor.DeviceEditorPanelController', {
    extend: 'Ext.app.Controller',
    requires: ["Ext.draw.*"],

    openProject: function(project) {
        Ext.getCmp('mainAppPanel').getActiveTab().model = project;
    },

    onDeviceEditorSaveBtnClick: function(){
        var activeTab = Ext.getCmp('mainAppPanel').getActiveTab();
        activeTab.el.mask('Loading');
        
        var design = activeTab.model.getDesign();

        var countParts = 36;

        design.getJ5Collection().bins().each(function(bin,binKey){
            bin.parts().each(function(part,partIndex){
                part.save({
                    callback:function(part){
                        if(partCounter==1) activeTab.el.unmask();
                        partCounter--;
                    }
                });
            });
        });

        
        /*
        activeTab.model.getDesign().save({ 
            callback: function(record, operation)
            {
                    console.log("Design Saved!");
                    activeTab.el.unmask();
            }
        });
        */
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
