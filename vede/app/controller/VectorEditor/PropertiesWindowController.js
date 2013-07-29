Ext.define("Vede.controller.VectorEditor.PropertiesWindowController", {
    extend: "Ext.app.Controller",

    requires: ['Teselagen.event.MenuItemEvent',
               'Teselagen.manager.ProjectManager',
               'Teselagen.manager.SequenceManager',
               'Teselagen.manager.VectorEditorManager',
               'Teselagen.utils.FormatUtils',
               "Vede.view.ve.RestrictionEnzymesManagerWindow",
               "Vede.view.ve.PropertiesWindow",
               "Teselagen.models.DNAFeature"],

    MenuItemEvent: null,
    ProjectManager: null,
    SequenceManagerEvent: null,
    SequenceManager: null,
    sequenceFeatures: null,
    VEManager: null,  

    onRerenderFeaturesGrid: function() {
        var propertiesWindow = Ext.ComponentQuery.query('window[cls="PropertiesWindow"]')[0];
        if (propertiesWindow) {
            var featuresGrid = propertiesWindow.down('gridpanel[name="featuresGridPanel"]');
            var sequenceFeatures = Vede.application.getVectorEditorSequenceControllerController().Managers[0].getSequenceManager().getFeaturesJSON();
            var sequenceFeaturesStore = Ext.create('Ext.data.Store', {
                model: 'Teselagen.models.DNAFeature',
                data: sequenceFeatures
            });

            featuresGrid.reconfigure(sequenceFeaturesStore);
        }
    },  

    onToggleFeatureEditOptions: function() {
        var editFeatureButton = Ext.ComponentQuery.query("button[cls='featuresEditButton']")[0];
        var removeFeatureButton = Ext.ComponentQuery.query("button[cls='featuresRemoveButton']")[0];
        editFeatureButton.disable();
        removeFeatureButton.disable();
    },      

    onPropertiesMenuItemClick: function() {
        var propertiesWindow = Ext.create("Vede.view.ve.PropertiesWindow");

        var sequenceName = Teselagen.manager.ProjectManager.workingSequence.get("name");
        var genbankData = Teselagen.manager.ProjectManager.workingSequence.data.sequenceFileContent;
        var sequenceFeatures = Vede.application.getVectorEditorSequenceControllerController().Managers[0].getSequenceManager().getFeaturesJSON();
        var sequenceFeaturesStore = Ext.create('Ext.data.Store', {
            model: 'Teselagen.models.DNAFeature',
            data: sequenceFeatures
        });

        propertiesWindow.down('component[cls="propertiesWindowSequenceNameField"]').setValue(sequenceName);
        propertiesWindow.down('component[cls="propertiesWindowGenBankData"]').setValue(genbankData);
        propertiesWindow.down('gridpanel[name="featuresGridPanel"]').reconfigure(sequenceFeaturesStore);

        propertiesWindow.show();
        propertiesWindow.center();
    },

    onFeatureSelect: function () {
        var editFeatureButton = Ext.ComponentQuery.query("button[cls='featuresEditButton']")[0];
        var removeFeatureButton = Ext.ComponentQuery.query("button[cls='featuresRemoveButton']")[0];
        editFeatureButton.enable();
        removeFeatureButton.enable();
        
        var features = Vede.application.getVectorEditorSequenceControllerController().Managers[0].getSequenceManager().features;
        var featureCount = Vede.application.getVectorEditorSequenceControllerController().Managers[0].getSequenceManager().features.length;
        var selection = Ext.ComponentQuery.query("gridpanel[name='featuresGridPanel']")[0].getSelectionModel().selected.items[0];
        var featureObj;
        for (i = 0; i < featureCount; i++) {
            if (features[i].getName() === selection.data.name) {
                featureObj = features[i]
            }
        };
        Vede.application.fireEvent('getSelectedFeatureFromProperties', featureObj);
    },
    
    onPropertiesWindowOKButtonClick: function() {
        var propertiesWindow = Ext.ComponentQuery.query('window[cls="PropertiesWindow"]')[0];
        var name = propertiesWindow.down('component[cls="propertiesWindowSequenceNameField"]').getValue();
        
        if(name == null || name.match(/^\s*$/) || name.length==0) {
            propertiesWindow.down('component[cls="propertiesWindowSequenceNameField"]').setFieldStyle("border-color:red");
        } else {
            var selectedProj = Teselagen.manager.ProjectManager.workingProject;
            var sequenceStore = Teselagen.manager.ProjectManager.sequenceStore;
            var sequenceCount = sequenceStore.data.items.length;
            var workingSequence = Teselagen.manager.ProjectManager.workingSequence;
            var oldName = workingSequence.data.name;

            // It is very likely that the following code contains inconsistencies in what the name means.
            for (var i=0; i<sequenceCount; i++) {
                if (name == sequenceStore.data.items[i].data.name && selectedProj.internalId == sequenceStore.data.items[i].data.project_id) {
                    if (name != oldName) {
                        Ext.MessageBox.show({
                            title: "Name conflict",
                            msg: 'A sequence with the name "'+name+'" already exists in this project. <p> Please enter another name.',
                            buttons: Ext.MessageBox.OK,
                        });                                      
                        return Ext.MessageBox;
                    }
                }
            }

            console.log(Teselagen.manager.SequenceManager());
            workingSequence.set("name", name);
            workingSequence.save({
                callback: function () {
                    Vede.application.fireEvent(Teselagen.event.ProjectEvent.LOAD_PROJECT_TREE, function () {
                        var projectTreePanel = Ext.ComponentQuery.query("component[id='projectTreePanel']")[0];
                        projectTreePanel.expandPath("/root/" + selectedProj.data.id + "/" + workingSequence.data.id);
                    });
                }
            });
            
            propertiesWindow.close();
        }
    },

    init: function() {
        this.control({
            "component[identifier*='propertiesMenuItem']": {
                click: this.onPropertiesMenuItemClick
            },
            "component[cls='propertiesWindowOKButton']": {
                click: this.onPropertiesWindowOKButtonClick
            },
            "gridpanel[name='featuresGridPanel']": {
                select: this.onFeatureSelect
            }
        });

        this.application.on('rerenderFeaturesGrid', this.onRerenderFeaturesGrid, this);
        this.application.on('toggleFeatureEditOptions', this.onToggleFeatureEditOptions, this);

        this.MenuItemEvent = Teselagen.event.MenuItemEvent;
        this.ProjectManager = Teselagen.manager.ProjectManager;
    }
});