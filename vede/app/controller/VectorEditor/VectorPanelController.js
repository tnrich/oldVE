/*global Vede*/
/**
 * @class Vede.controller.VectorEditor.VectorPanelController
 * Controller for Vector Panel
 */
Ext.define("Vede.controller.VectorEditor.VectorPanelController", {
    extend: "Ext.app.Controller",
    requires: ["Teselagen.event.SequenceManagerEvent",
               "Teselagen.manager.ProjectManager"],
    isRendered: false,

    onTabChange: function (tabPanel, newTab, oldTab) {
        var self = this;
        if(newTab.xtype == "VectorEditorPanel") {
            if(!Teselagen.manager.ProjectManager.workingSequence) {
                console.log("Opening VE Direct Mode");
                Teselagen.manager.ProjectManager.directVEEditingMode = true;

                //Create empty VEProject/Sequence
                Teselagen.manager.ProjectManager.workingSequence = Ext.create("Teselagen.models.VectorEditorProject", {
                    name: "Untitled VEProject",
                    dateCreated: new Date(),
                    dateModified: new Date()
                });

                Teselagen.manager.ProjectManager.workingSequence = Ext.create("Teselagen.models.SequenceFile", {
                    sequenceFileFormat: "GENBANK",
                    sequenceFileContent: "LOCUS       NO_NAME                    0 bp    DNA     circular     19-DEC-2012\nFEATURES             Location/Qualifiers\n\nNO ORIGIN\n//",
                    sequenceFileName: "untitled.gb",
                    partSource: "Untitled sequence"
                });

                //Teselagen.manager.ProjectManager.workingSequence.setVectorEditorProject(Teselagen.manager.ProjectManager.workingSequence);
                Vede.application.fireEvent("OpenVectorEditor",Teselagen.manager.ProjectManager.workingSequence);
            }
        }
    },

//    saveSequence: function () {
//        var self = this;
//        var onPromptClosed = function (btn, sequenceName) {
//                var self = this;
//                var selectWindow = Ext.create('Ext.window.Window', {
//                    title: 'Select Project',
//                    height: 200,
//                    width: 400,
//                    layout: 'fit',
//                    items: {
//                        xtype: 'grid',
//                        border: false,
//                        columns: {
//                            items: {
//                                text: "Name",
//                                dataIndex: "name"
//                            },
//                            defaults: {
//                                flex: 1
//                            }
//                        },
//                        store: Teselagen.manager.ProjectManager.projects,
//                        listeners: {
//                            "itemclick": function (grid, project, item) {
//                                Teselagen.manager.ProjectManager.workingSequence.set('name', sequenceName);
//                                project.veprojects().add(Teselagen.manager.ProjectManager.workingSequence);
//                                project.save({
//                                    callback: function () {
//                                        Teselagen.manager.ProjectManager.workingSequence.save({
//                                            callback: function () {
//                                                Teselagen.manager.ProjectManager.workingSequence.save({
//                                                    callback: function () {
//                                                        selectWindow.close();
//                                                        Vede.application.fireEvent(Teselagen.event.ProjectEvent.LOAD_PROJECT_TREE);
//                                                        self.saveSequenceBtn.un('click',self);
//                                                    }
//                                                });
//                                            }
//                                        });
//                                    }
//                                });
//                                selectWindow.close();
//                            }
//                        }
//                    }
//                }).show();
//            };
//
//
//        Ext.MessageBox.prompt('Name', 'Please enter a sequence name:', onPromptClosed, this);
//    },

    /**
     * @member Vede.controller.VectorEditor.VectorPanelController
     */
    init: function () {
        // this.application.on("TabOpen", this.onTabOpen);
        this.control({
            "#VectorPanel": {
                afterrender: this.onRender,
                resize: this.onResize,
                collapse: this.onCollapse
            }
        });
    },

    onLaunch: function () {
        this.tabPanel = Ext.getCmp("mainAppPanel");
        this.tabPanel.on("tabchange", this.onTabChange, this);
    },

    onRender: function () {
        if(!this.isRendered) {
            this.tabPanel = Ext.getCmp("mainAppPanel");
            this.tabPanel.setActiveTab(0);
            /*Vede.application.getController("VectorEditor.PieController").initPie();
            Vede.application.getController("VectorEditor.RailController").initRail();*/
            this.isRendered = true;
        }
    },

    onResize: function () {
        //        console.log("resize");
    },

    onCollapse: function () {
        var annotatePanel = Ext.getCmp("AnnotatePanel");
        if (annotatePanel.collapsed) {
            annotatePanel.expand([true])
        }
    }
});
