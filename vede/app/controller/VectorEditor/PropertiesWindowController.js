Ext.define("Vede.controller.VectorEditor.PropertiesWindowController", {
    extend: "Ext.app.Controller",

    requires: ["Teselagen.event.MenuItemEvent",
               "Teselagen.event.VisibilityEvent",
               "Teselagen.manager.ProjectManager",
               "Teselagen.manager.SequenceManager",
               "Teselagen.manager.VectorEditorManager",
               "Teselagen.manager.RestrictionEnzymeManager",
               "Teselagen.manager.ORFManager",
               "Teselagen.utils.FormatUtils",
               "Vede.view.ve.RestrictionEnzymesManagerWindow",
               "Vede.view.ve.PropertiesWindow",
               "Teselagen.models.DNAFeature",
               "Teselagen.models.CutSite",
               "Teselagen.models.ORF"],

    FormatUtils: null,
    MenuItemEvent: null,
    ProjectManager: null,
    RestrictionEnzymeManager: null,
    SequenceManagerEvent: null,
    SequenceManager: null,
    SequenceController: null,
    sequenceFeatures: null,
    VEManager: null,
    VisibilityEvent: null,

    onPropertiesMenuItemClick: function() {
        var propertiesWindow = Ext.create("Vede.view.ve.PropertiesWindow");

        var userName = Teselagen.manager.UserManager.getUser().data.username;
        var sequence = this.ProjectManager.workingSequence;
        var description = sequence.get("description");
        var dateCreated = sequence.get("dateCreated") || "---";
        var dateModified = sequence.get("dateModified") || "---";
        var sequenceName = sequence.get("name");
        var sequenceManager = this.SequenceController.getActiveTab().sequenceManager;
        var circular = sequenceManager.getCircular();

        var sequenceFeatures = sequenceManager.getFeaturesJSON();
        var sequenceFeaturesStore = Ext.create("Ext.data.Store", {
            model: "Teselagen.models.DNAFeature",
            data: sequenceFeatures
        });

        var cutSiteData = this.RestrictionEnzymeManager.getCutSitesForProperties();
        var cutSitesStore = Ext.create("Ext.data.Store", {
            model: "Teselagen.models.CutSite",
            data: cutSiteData,
            sorters: [{
                property: "name",
                direction: "ASC"
            },{
                property: "numCuts",
                direction: "DESC"
            }]
        });
        cutSitesStore.filterBy(function (record) {
            if (record.data.numCuts) {
                return true;
            }
        });
        if (cutSitesStore.data.items.length === 0) {
            var expandAllCutSitesBtn = Ext.ComponentQuery.query("button[cls='expandAllCutSites']")[0];
            expandAllCutSitesBtn.disable();
        }

        var orfs = Teselagen.manager.ORFManager.getOrfsJSON();
        var orfsStore = Ext.create("Ext.data.Store", {
            model: "Teselagen.models.ORF",
            data: orfs
        });
        var minOrfLength = Teselagen.manager.ORFManager.getMinORFSize();

        propertiesWindow.down("component[cls='propertiesWindowDescriptionArea']").setValue(description);
        propertiesWindow.down("component[cls='propertiesWindowCreatedField']").setValue(dateCreated);
        propertiesWindow.down("component[cls='propertiesWindowLastModifiedField']").setValue(dateModified);
        propertiesWindow.down("component[cls='propertiesWindowSequenceNameField']").setValue(sequenceName);
        propertiesWindow.down("component[cls='propertiesWindowCircularField']").setValue(circular);
        propertiesWindow.down("component[cls='propertiesWindowOwnerField']").setValue(userName);
        propertiesWindow.down("gridpanel[name='featuresGridPanel']").reconfigure(sequenceFeaturesStore);
        propertiesWindow.down("gridpanel[name='cutSitesGridPanel']").reconfigure(cutSitesStore);
        propertiesWindow.down("gridpanel[name='ORFsGridPanel']").reconfigure(orfsStore);
        propertiesWindow.down("component[cls='minORFLengthField']").setValue(minOrfLength);

        propertiesWindow.show();
        propertiesWindow.center();
    },

    onRerenderFeaturesGrid: function() {
        var propertiesWindow = Ext.ComponentQuery.query("window[cls='PropertiesWindow']")[0];
        if (propertiesWindow) {
            var featuresGrid = propertiesWindow.down("gridpanel[name='featuresGridPanel']");
            var featureSearchField = propertiesWindow.down("textfield[cls='featureSearchField']");
            var sequenceFeatures = Vede.application.getVectorEditorSequenceControllerController().Managers[0].getSequenceManager().getFeaturesJSON();
            var sequenceFeaturesStore = Ext.create("Ext.data.Store", {
                model: "Teselagen.models.DNAFeature",
                data: sequenceFeatures
            });

            featuresGrid.reconfigure(sequenceFeaturesStore);
            featureSearchField.setValue("");
        }
    },

    onToggleFeatureEditOptions: function() {
        var editFeatureButton = Ext.ComponentQuery.query("button[cls='featuresEditButton']")[0];
        var removeFeatureButton = Ext.ComponentQuery.query("button[cls='featuresRemoveButton']")[0];

        if(editFeatureButton) {
            editFeatureButton.disable();
        }

        if(removeFeatureButton) {
            removeFeatureButton.disable();
        }
    },

    onFeatureSearchFieldKeyup: function(textfield) {
        var featuresGrid = Ext.ComponentQuery.query("window[cls='PropertiesWindow']")[0].down("gridpanel[name='featuresGridPanel']");
        var fieldValue = textfield.getValue();
        featuresGrid.store.filterBy(function(record) {
            if (record.data.name.toLowerCase().indexOf(fieldValue) !== -1 || record.data.type.toLowerCase().indexOf(fieldValue) !== -1) {
                return true;
            }
        });
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
        for (var i=0; i < featureCount; i++) {
            if (features[i].getName() === selection.data.name) {
                featureObj = features[i];
            }
        }
        Vede.application.fireEvent("getSelectedFeatureFromProperties", featureObj);
    },

    onToggleShowCutSites: function (row) {
        var propertiesWindow = Ext.ComponentQuery.query("window[cls='PropertiesWindow']")[0];
        var rowIsParent = row.selected.items[0].data.numCuts;
        if (rowIsParent) {
            var currentStore = propertiesWindow.down("gridpanel[name='cutSitesGridPanel']").store;
            var currentStoreCount = currentStore.data.items.length;
            var currentStoreData = currentStore.data;
            var selectedName = row.selected.items[0].data.name;
            var duplicates = 0;
            var duplicateNames = [];
            var duplicateData = [];

            for (var i=0; i < currentStoreCount; i++) {
                if (currentStoreData.items[i].data.numCuts) {
                    var name = currentStoreData.items[i].data.name;
                    for (var j=0; j < currentStoreCount; j++) {
                        if (name === currentStoreData.items[j].data.name) {
                            duplicateData.push(currentStoreData.items[j].data);
                            duplicates++;
                        }
                    }
                    if (duplicates > 1) {
                        for (var k=0; k < duplicateData.length; k++) {
                            if (duplicateData[k].numCuts) {
                                duplicateNames.push(duplicateData[k].name);
                            }
                        }
                    }
                    duplicates = 0;
                    duplicateData = [];
                }
            }

            var cutSiteData = this.RestrictionEnzymeManager.getCutSitesForProperties();
            var cutSitesStore = Ext.create("Ext.data.Store", {
                model: "Teselagen.models.CutSite",
                data: cutSiteData,
                sorters: [{
                    property: "name",
                    direction: "ASC"
                },{
                    property: "numCuts",
                    direction: "DESC"
                }]
            });

            var duplicateNamesCount = duplicateNames.length;

            cutSitesStore.filterBy(function (record) {
                var restrictionEnzyme = record.data.name;
                var numCuts = record.data.numCuts;
                if (duplicateNamesCount > 0) {
                    var match = 0;
                    for (var l=0; l < duplicateNamesCount; l++) {
                        if (restrictionEnzyme === duplicateNames[l]) {
                            match++;
                        }
                    }
                    if (restrictionEnzyme !== selectedName && match > 0) {
                        return true;
                    } else if (match === 0 && restrictionEnzyme === selectedName) {
                        return true;
                    }
                    match = 0;
                } else {
                    if (restrictionEnzyme === selectedName && !numCuts) {
                        return true;
                    }
                }
                if (numCuts) {
                    return true;
                }
            });

            propertiesWindow.down("gridpanel[name='cutSitesGridPanel']").reconfigure(cutSitesStore);

            var collapseAllCutSitesBtn = Ext.ComponentQuery.query("button[cls='collapseAllCutSites']")[0];
            var expandAllCutSitesBtn = Ext.ComponentQuery.query("button[cls='expandAllCutSites']")[0];
            var newStore = propertiesWindow.down("gridpanel[name='cutSitesGridPanel']").store;
            var newStoreCount = newStore.data.items.length;
            var newStoreData = newStore.data;
            var oldStoreCount = newStore.snapshot.items.length;
            var children = 0;

            for (var n=0; n<newStoreCount; n++) {
                if (!newStoreData.items[n].numCuts) {
                    children++;
                }
            }

            if (children > 0) {
                collapseAllCutSitesBtn.enable();
            } else {
                collapseAllCutSitesBtn.disable();
            }
            if (newStoreCount === oldStoreCount) {
                expandAllCutSitesBtn.disable();
            } else {
                expandAllCutSitesBtn.enable();
            }
        }
    },

    onSetRestrictionEnzymeRowCls: function (record) {
        var cutSiteDataStore = record.store.data;
        var cutSiteDataStoreCount = cutSiteDataStore.length;
        var recordName = record.data.name;
        var childCutSites = -1;
        var expanded = false;

        for (var i=0; i < cutSiteDataStoreCount; i++) {
            var renderedName = cutSiteDataStore.items[i].raw.name;
            if (recordName === renderedName) {
                childCutSites++;
            }
        }

        if (childCutSites > 0) {
            expanded = true;
        }

        return expanded;
    },

    onExpandAllCutSites: function () {
        var propertiesWindow = Ext.ComponentQuery.query("window[cls='PropertiesWindow']")[0];
        var cutSiteData = this.RestrictionEnzymeManager.getCutSitesForProperties();
        var cutSitesStore = Ext.create("Ext.data.Store", {
            model: "Teselagen.models.CutSite",
            data: cutSiteData,
            sorters: [{
                property: "name",
                direction: "ASC"
            },{
                property: "numCuts",
                direction: "DESC"
            }]
        });

        propertiesWindow.down("gridpanel[name='cutSitesGridPanel']").reconfigure(cutSitesStore);

        var expandAllCutSitesBtn = Ext.ComponentQuery.query("button[cls='expandAllCutSites']")[0];
        var collapseAllCutSitesBtn = Ext.ComponentQuery.query("button[cls='collapseAllCutSites']")[0];
        expandAllCutSitesBtn.disable();
        collapseAllCutSitesBtn.enable();
    },

    onCollapseAllCutSites: function () {
        var propertiesWindow = Ext.ComponentQuery.query("window[cls='PropertiesWindow']")[0];
        var cutSiteData = this.RestrictionEnzymeManager.getCutSitesForProperties();
        var cutSitesStore = Ext.create("Ext.data.Store", {
            model: "Teselagen.models.CutSite",
            data: cutSiteData,
            sorters: [{
                property: "name",
                direction: "ASC"
            },{
                property: "numCuts",
                direction: "DESC"
            }]
        });

        cutSitesStore.filterBy(function (record) {
            if (record.data.numCuts) {
                return true;
            }
        });

        propertiesWindow.down("gridpanel[name='cutSitesGridPanel']").reconfigure(cutSitesStore);

        var expandAllCutSitesBtn = Ext.ComponentQuery.query("button[cls='expandAllCutSites']")[0];
        var collapseAllCutSitesBtn = Ext.ComponentQuery.query("button[cls='collapseAllCutSites']")[0];
        expandAllCutSitesBtn.enable();
        collapseAllCutSitesBtn.disable();
    },

    onPropertiesWindowOKButtonClick: function() {
        var propertiesWindow = Ext.ComponentQuery.query("window[cls='PropertiesWindow']")[0];
        var name = propertiesWindow.down("component[cls='propertiesWindowSequenceNameField']").getValue();
        var description = propertiesWindow.down("component[cls='propertiesWindowDescriptionArea']").getValue();
        var circular = propertiesWindow.down("component[cls='propertiesWindowCircularField']").getValue();
        var workingSequence = Teselagen.manager.ProjectManager.workingSequence;
        var sequenceManager = this.SequenceController.getActiveTab().sequenceManager;
        var sequenceLinearBtn = this.SequenceController.getActiveTab().query("component[identifier*='sequenceLinearMenuItem']");
        var viewMode;

        if(name === null || name.match(/^\s*$/) || name.length===0) {
            propertiesWindow.down("component[cls='propertiesWindowSequenceNameField']").setFieldStyle("border-color:red");
        } else {
            workingSequence.set("name", name);
            workingSequence.set("description", description);
            sequenceManager.setName(name);
            if (circular !== sequenceManager.getCircular()) {
                sequenceManager.setCircular(circular);
                viewMode = circular ? "circular" : "linear";

                if(viewMode == "linear") {
                    for(var i = 0; i < sequenceLinearBtn.length; i++) {
                        sequenceLinearBtn[i].setChecked(true, true);
                    }
                } else {
                    for(var i = 0; i < sequenceLinearBtn.length; i++) {
                        sequenceLinearBtn[i].setChecked(false, true);
                    }
                }

                this.application.fireEvent(this.VisibilityEvent.VIEW_MODE_CHANGED, viewMode);
            }
            workingSequence.setSequenceManager(sequenceManager);

            if (workingSequence.dirty) {
                workingSequence.save({
                    callback: function () {
                    }
                });
            }

            propertiesWindow.close();
//            var selectedProj = Teselagen.manager.ProjectManager.workingProject;
//            var workingSequence = Teselagen.manager.ProjectManager.workingSequence;
//            var serialize = workingSequence.get("serialize");
//
//            serialize.inData.name = name;
//
//            workingSequence.set({
//                name: name,
//                partSource: name,
//                sequenceFileName: name,
//                serialize: serialize
//            });
//
//            workingSequence.save({
//                success: function () {
//                    var duplicated = JSON.parse(arguments[1].response.responseText).duplicated;
//
//                    if(!duplicated) {
//                        Vede.application.fireEvent(Teselagen.event.ProjectEvent.LOAD_PROJECT_TREE, function () {
//                            if(selectedProj) {
//                                var projectTreePanel = Ext.ComponentQuery.query("component[id='projectTreePanel']")[0];
//                                projectTreePanel.expandPath("/root/" + selectedProj.data.id + "/" + workingSequence.data.id);
//                            }
//                        });
//
//                        Ext.getCmp("mainAppPanel").getActiveTab().model.setName(name);
//
//                        propertiesWindow.close();
//                    } else {
//                	    Ext.MessageBox.alert('', 'A sequence with the name "' +
//                            name + '" already exists. \nPlease select another name.');
//                    }
//                },
//                failure: function() {
//                    Ext.MessageBox.alert('', 'Error saving sequence. Please try again.');
//                }
//            });
        }
    },

    onTabChange: function(pTabpanel, pNewCard) {
        if (pNewCard.cls === "propertiesGenBank") {
            this.onSelectGenbank();
        }
    },

    onSelectGenbank: function() {
        var sequenceManager = this.SequenceController.getActiveTab().sequenceManager;
        var genbankData = this.FormatUtils.sequenceManagerToGenbank(sequenceManager);
        var propertiesWindow = Ext.ComponentQuery.query("window[cls='PropertiesWindow']")[0];
        propertiesWindow.down("component[cls='propertiesWindowGenBankData']").setValue(genbankData);
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
            },
            "textfield[cls='featureSearchField']": {
                keyup: this.onFeatureSearchFieldKeyup
            },
            "gridpanel[name='cutSitesGridPanel']": {
                select: this.onToggleShowCutSites,
            },
            "tabpanel[cls='propertiesWindowTabpanel']": {
                tabchange: this.onTabChange
            }
        });

        this.application.on("rerenderFeaturesGrid", this.onRerenderFeaturesGrid, this);
        this.application.on("toggleFeatureEditOptions", this.onToggleFeatureEditOptions, this);
        this.application.on("setRestrictionEnzymeRowCls", this.onSetRestrictionEnzymeRowCls, this);
        this.application.on("expandAllCutSites", this.onExpandAllCutSites, this);
        this.application.on("collapseAllCutSites", this.onCollapseAllCutSites, this);

        this.FormatUtils = Teselagen.utils.FormatUtils;
        this.MenuItemEvent = Teselagen.event.MenuItemEvent;
        this.ProjectManager = Teselagen.manager.ProjectManager;
        this.RestrictionEnzymeManager = Teselagen.manager.RestrictionEnzymeManager;
        this.SequenceController = this.application.getVectorEditorSequenceControllerController();
        this.VisibilityEvent = Teselagen.event.VisibilityEvent;
    }
});
