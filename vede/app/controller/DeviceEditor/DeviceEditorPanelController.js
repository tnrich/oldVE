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

        var saveDesign = function(){
            console.log("Saving design");
            activeTab.model.getDesign().save({ 
                callback: function(record, operation)
                {
                        console.log("Design Saved!");
                        activeTab.el.unmask();
                }
            });
        };

        var countParts = 0;

        design.getJ5Collection().bins().each(function(bin,binKey){
            bin.parts().each(function(part,partIndex){
                countParts++;
            });
        });

        console.log("Count parts is: "+countParts);

        design.getJ5Collection().bins().each(function(bin,binKey){
            bin.parts().each(function(part,partIndex){
                if(part.isModified('name'))
                {
                    console.log("Saving part");
                    part.save({
                        callback:function(part){
                            if(countParts==1) saveDesign();
                            countParts--;
                        }
                    });
                }
                else
                {
                    if(countParts==1) saveDesign();
                    countParts--;
                }
            });
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
