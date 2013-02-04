/*global Vede*/
/**
 * @class Vede.controller.VectorPanelController
 * Controller for Vector Panel
 */
Ext.define("Vede.controller.VectorPanelController", {
    extend: "Ext.app.Controller",
    require: ["Teselagen.manager.ProjectManager"],
    isRendered: false,
    saveSequenceBtn : null,
    onTabChange: function (tabPanel, newTab, oldTab) {
        var self = this;
        if(newTab.xtype == "VectorEditorPanel") {
            if(!Teselagen.manager.ProjectManager.workingSequence || !Teselagen.manager.ProjectManager.workingVEProject) {
                console.log("Creating empty VEProject/Sequence");

                //Create empty VEProject/Sequence
                Teselagen.manager.ProjectManager.workingVEProject = Ext.create("Teselagen.models.VectorEditorProject", {
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

                //project.veprojects().add(veproject);
                Teselagen.manager.ProjectManager.workingVEProject.setSequenceFile(Teselagen.manager.ProjectManager.workingSequence);
                self.saveSequenceBtn = Ext.getCmp('VectorEditorMainMenuBar').query('button[cls="saveNewSequenceBtn"]')[0].show();

                self.saveSequenceBtn.on("click", self.saveSequence,self);

            }
        }
    },

    saveSequence: function () {
        var self = this;
        var onPromptClosed = function (btn, sequenceName) {
                var self = this;
                var selectWindow = Ext.create('Ext.window.Window', {
                    title: 'Select Project',
                    height: 200,
                    width: 400,
                    layout: 'fit',
                    items: {
                        xtype: 'grid',
                        border: false,
                        columns: {
                            items: {
                                text: "Name",
                                dataIndex: "name"
                            },
                            defaults: {
                                flex: 1
                            }
                        },
                        store: Teselagen.manager.ProjectManager.projects,
                        listeners: {
                            "itemclick": function (grid, project, item) {
                                Teselagen.manager.ProjectManager.workingVEProject.set('name', sequenceName);
                                project.veprojects().add(Teselagen.manager.ProjectManager.workingVEProject);
                                project.save({
                                    callback: function () {
                                        Teselagen.manager.ProjectManager.workingVEProject.save({
                                            callback: function () {
                                                Teselagen.manager.ProjectManager.workingSequence.save({
                                                    callback: function () {
                                                        selectWindow.close();
                                                        Vede.application.fireEvent("renderProjectsTree");
                                                        self.saveSequenceBtn.un('click',self);
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                                selectWindow.close();
                            }
                        }
                    }
                }).show();
            };


        Ext.MessageBox.prompt('Name', 'Please enter a sequence name:', onPromptClosed, this);
    },

    /**
     * @member Vede.controller.VectorPanelController
     */
    init: function () {
        this.control({
            "#VectorPanel": {
                afterrender: this.onRender,
                resize: this.onResize
            }
        });
    },

    onLaunch: function () {
        this.tabPanel = Ext.getCmp("mainAppPanel");
        this.tabPanel.on("tabchange", this.onTabChange, this);
    },

    onRender: function () {
        if(!this.isRendered) {
            Vede.application.getController("PieController").initPie();
            Vede.application.getController("RailController").initRail();
            this.isRendered = true;
        }
    },

    onResize: function () {
        //        console.log("resize");
    }

});