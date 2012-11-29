Ext.define('Vede.controller.DeviceEditor.DeviceEditorPanelController', {
    extend: 'Ext.app.Controller',
    requires: ["Ext.draw.*","Teselagen.manager.DeviceDesignParsersManager"],

    openProject: function(project) {
        Ext.getCmp('mainAppPanel').getActiveTab().model = project;
    },

    onOpenExampleItemBtnClick: function( item, e, eOpts ){
        var selectedItem = item.text;
        var examplesMap = {
            "SLIC/Gibson/CPEC" : "resources/examples/SLIC_Gibson_CPEC.json",
            "Combinatorial SLIC/Gibson/CPEC" : "resources/examples/Combinatorial_SLIC_Gibson_CPEC.json",
            "Golden Gate" : "resources/examples/Golden_Gate.json",
            "Combinatorial Golden Gate" : "resources/examples/Combinatorial_Golden_Gate.json"
        };

        Ext.Ajax.request({
            url: examplesMap[selectedItem],
            method: 'GET',
            success: function(response){
                Teselagen.manager.DeviceDesignParsersManager.parseJSON(response.responseText,selectedItem.replace(" ","_"));
            }
        });

    },

    importDesignFromFormat: function(format,cb){
        var importModal = Ext.create("Ext.Window",{
            title : 'Import '+ format +' from File',
            closable : true,                           
            modal : true,
            width: '500px',
            items: [
                    {
                        xtype: 'form',
                        bodyPadding: 10,
                        items: [
                            {
                                xtype: 'filefield',
                                name: 'importedFile',
                                allowBlank: false,
                                anchor: '100%',
                                validator: function(val, field) {
                                    if(format=='JSON') fileName = /^.*\.json$/i;
                                    else if(format=='XML') fileName = /^.*\.xml$/i;
                                    if(!fileName.test(val)) return "Please select a " + format + " file.";
                                    return fileName.test(val);
                                }
                            },
                            {
                                xtype: 'toolbar',
                                ui: 'footer',
                                items: [
                                    {
                                        xtype: 'button',
                                        text: 'Import',
                                        cls: 'Import',
                                        formBind: true
                                    },
                                    {
                                        xtype: 'button',
                                        text: 'Cancel'
                                    }
                                ]
                            }
                        ]
                    }
                ]
        }).show();
        
        var fr,file;
        importModal.query('button[cls="Import"]')[0].on('click',function(){
            var form = importModal.down('form').getForm();
            var fileField = form.findField('importedFile');
            var fileInput = fileField.extractFileInput();
            file = fileInput.files[0];
            fr = new FileReader();
            fr.onload = processText;
            fr.readAsText(file);
        });

        function processText() {
            cb(fr.result,file.name);
            importModal.close();
        }
    },

    onimportXMLItemBtnClick: function(){
        this.importDesignFromFormat('XML',Teselagen.manager.DeviceDesignParsersManager.parseXML);
    },

    onimportJSONItemBtnClick: function(){
        this.importDesignFromFormat('JSON',Teselagen.manager.DeviceDesignParsersManager.parseJSON);
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
            "button[cls='fileMenu'] > menu > menuitem[text='Save Design']": {
                click: this.onDeviceEditorSaveBtnClick
            },
            "button[cls='importMenu'] > menu > menuitem[text='XML file']": {
                click: this.onimportXMLItemBtnClick
            },
            "button[cls='importMenu'] > menu > menuitem[text='JSON file']": {
                click: this.onimportJSONItemBtnClick
            },
            "button[cls='examplesMenu'] > menu > menuitem": {
                click: this.onOpenExampleItemBtnClick
            }
        });
    }
});
