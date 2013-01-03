Ext.define('Vede.controller.DeviceEditor.DeviceEditorPanelController', {
    extend: 'Ext.app.Controller',
    requires: ["Ext.draw.*", "Teselagen.manager.DeviceDesignParsersManager", "Teselagen.manager.ProjectManager", "Teselagen.event.DeviceEvent", "Teselagen.manager.DeviceDesignManager"],

    DeviceDesignManager: null,
    DeviceEvent: null,

    openProject: function (project) {
        Ext.getCmp('mainAppPanel').getActiveTab().model = project;
    },

    onDeviceEditorRenameBtnClick: function () {
        var deproject = Ext.getCmp('mainAppPanel').getActiveTab().model;

        var onPromptClosed = function (answer, text) {
                deproject.set('name', text);
                deproject.save({
                    callback: function () {
                        Ext.getCmp('mainAppPanel').getActiveTab().setTitle(text);
                        Ext.getCmp('mainAppPanel').getActiveTab().down('label[cls="designName"]').setText(text);
                        Vede.application.fireEvent("renderProjectsTree", function () {
                            Ext.getCmp('projectTreePanel').expandPath('/root/' + deproject.data.project_id + '/' + deproject.data.id);
                        });
                    }
                });
            };

        Ext.MessageBox.prompt("Rename Design", 'New name:', onPromptClosed, this);
    },

    onDeviceEditorDeleteBtnClick: function () {
        var activeTab = Ext.getCmp('mainAppPanel').getActiveTab();
        Teselagen.manager.ProjectManager.deleteDEProject(activeTab.model, activeTab);
    },

    onOpenExampleItemBtnClick: function (item, e, eOpts) {
        var selectedItem = item.text;
        var examplesMap = {
            "SLIC/Gibson/CPEC": "resources/examples/SLIC_Gibson_CPEC.json",
            "Combinatorial SLIC/Gibson/CPEC": "resources/examples/Combinatorial_SLIC_Gibson_CPEC.json",
            "Golden Gate": "resources/examples/Golden_Gate.json",
            "Combinatorial Golden Gate": "resources/examples/Combinatorial_Golden_Gate.json"
        };

        Ext.Ajax.request({
            url: examplesMap[selectedItem],
            method: 'GET',
            success: function (response) {
                Teselagen.manager.DeviceDesignParsersManager.parseJSON(response.responseText, selectedItem.replace(" ", "_"));
            }
        });
    },

    importDesignFromFormat: function (format, cb) {
        var importModal = Ext.create("Ext.Window", {
            title: 'Import ' + format + ' from File',
            closable: true,
            modal: true,
            width: '500px',
            items: [{
                xtype: 'form',
                bodyPadding: 10,
                items: [{
                    xtype: 'filefield',
                    name: 'importedFile',
                    allowBlank: false,
                    anchor: '100%',
                    validator: function (val, field) {
                        if(format == 'JSON') fileName = /^.*\.json$/i;
                        else if(format == 'XML') fileName = /^.*\.xml$/i;
                        if(!fileName.test(val)) return "Please select a " + format + " file.";
                        return fileName.test(val);
                    }
                }, {
                    xtype: 'toolbar',
                    ui: 'footer',
                    items: [{
                        xtype: 'button',
                        text: 'Import',
                        cls: 'Import',
                        formBind: true
                    }, {
                        xtype: 'button',
                        text: 'Cancel'
                    }]
                }]
            }]
        }).show();

        var fr, file;
        importModal.query('button[cls="Import"]')[0].on('click', function () {
            var form = importModal.down('form').getForm();
            var fileField = form.findField('importedFile');
            var fileInput = fileField.extractFileInput();
            file = fileInput.files[0];
            fr = new FileReader();
            fr.onload = processText;
            fr.readAsText(file);
        });

        function processText() {
            cb(fr.result, file.name);
            importModal.close();
        }
    },

    onimportXMLItemBtnClick: function () {
        this.importDesignFromFormat('XML', Teselagen.manager.DeviceDesignParsersManager.parseXML);
    },

    onimportJSONItemBtnClick: function () {
        this.importDesignFromFormat('JSON', Teselagen.manager.DeviceDesignParsersManager.parseJSON);
    },

    saveDEProject: function (cb) {
        var activeTab = Ext.getCmp('mainAppPanel').getActiveTab();
        var deproject = activeTab.model;
        deproject.save({
            callback: function () {
                var design = deproject.getDesign();

                var saveAssociatedSequence = function (part, cb) {
                        //console.log(part);
                        console.log(part.getSequenceFile());
                        part.getSequenceFile().save({
                            callback: function (sequencefile) {
                                console.log(sequencefile.get('id'));
                                part.set("sequencefile_id", sequencefile.get('id'));
                                part.save({
                                    callback: function () {
                                        cb();
                                    }
                                });

                            }
                        });

                    };

                var saveDesign = function () {
                        console.log("Saving design");
                        activeTab.model.getDesign().save({
                            callback: function (record, operation) {
                                console.log("Design Saved!");
                                if(typeof (cb) == "function") cb();
                            }
                        });
                    };

                var countParts = 0;

                design.getJ5Collection().bins().each(function (bin, binKey) {
                    bin.parts().each(function (part, partIndex) {
                        countParts++;
                    });
                });

                //console.log("Count parts is: "+countParts);
                design.getJ5Collection().bins().each(function (bin, binKey) {
                    bin.parts().each(function (part, partIndex) {
                        if(Object.keys(part.getChanges()).length > 0 || !part.data.id) {
                            console.log("Saving part");
                            part.save({
                                callback: function (part) {
                                    saveAssociatedSequence(part, function () {
                                        if(countParts == 1) saveDesign();
                                        countParts--;
                                    });
                                }
                            });
                        } else {
                            saveAssociatedSequence(part,function(){
                            if(countParts == 1) saveDesign();
                            countParts--;
                            });
                        }
                    });
                });
            }
        });
    },

    onDeviceEditorSaveBtnClick: function () {
        var activeTab = Ext.getCmp('mainAppPanel').getActiveTab();
        activeTab.el.mask('Loading');
        this.saveDEProject(function () {
            activeTab.el.unmask();
        });
    },

    onDeviceEditorSaveEvent: function (arg) {
        this.saveDEProject(arg);
    },


    onAddRowClick: function () {
        this.application.fireEvent(this.DeviceEvent.ADD_ROW, null);
    },

    onAddColumnClick: function () {
        this.application.fireEvent(this.DeviceEvent.ADD_COLUMN);
    },

    onJ5buttonClick: function (button, e, options) {
        Vede.application.fireEvent("openj5");
    },

    init: function () {
        this.callParent();
        this.application.on(Teselagen.event.ProjectEvent.OPEN_PROJECT, this.openProject, this);

        this.application.on("saveDesignEvent", this.onDeviceEditorSaveEvent, this);

        this.control({
            "button[cls='fileMenu'] > menu > menuitem[text='Save Design']": {
                click: this.onDeviceEditorSaveEvent
            },
            "button[cls='fileMenu'] > menu > menuitem[text='Delete Design']": {
                click: this.onDeviceEditorDeleteBtnClick
            },
            "button[cls='fileMenu'] > menu > menuitem[text='Rename Design']": {
                click: this.onDeviceEditorRenameBtnClick
            },
            "button[cls='importMenu'] > menu > menuitem[text='XML file']": {
                click: this.onimportXMLItemBtnClick
            },
            "button[cls='importMenu'] > menu > menuitem[text='JSON file']": {
                click: this.onimportJSONItemBtnClick
            },
            "button[cls='insertMenu'] > menu > menuitem[text='Row']": {
                click: this.onAddRowClick
            },
            "button[cls='insertMenu'] > menu > menuitem[text='Column']": {
                click: this.onAddColumnClick
            },
            "button[cls='examplesMenu'] > menu > menuitem": {
                click: this.onOpenExampleItemBtnClick
            },
            "button[cls='j5button']": {
                click: this.onJ5buttonClick
            }
        });

        this.DeviceDesignManager = Teselagen.manager.DeviceDesignManager;
        this.DeviceEvent = Teselagen.event.DeviceEvent;
    }
});