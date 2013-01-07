/**
 * @class Teselagen.manager.ProjectManager
 * @author Rodrigo Pavez
 */
Ext.define("Teselagen.manager.ProjectManager", {

    requires: ["Teselagen.event.ProjectEvent", "Teselagen.store.UserStore", "Vede.view.de.DeviceEditor", "Teselagen.manager.SessionManager", "Teselagen.manager.DeviceDesignManager", "Teselagen.utils.FormatUtils", "Teselagen.models.J5Bin", "Teselagen.models.Part","Teselagen.models.VectorEditorProject", 'Ext.window.MessageBox'],
    alias: "ProjectManager",
    mixins: {
        observable: "Ext.util.Observable"
    },
    singleton: true,
    currentUser: null,
    projects: null,
    workingVEProject: null,
    workingSequence: null,
    workingSequenceFileManager: null,

    /**
     * Load User Info
     */
    loadUser: function () {
        if(Ext.getCmp('headerUserIcon')) Ext.getCmp('headerUserIcon').setText(Teselagen.manager.AuthenticationManager.username);
        var users = Ext.create("Teselagen.store.UserStore");
        var self = this;
        var projects;
        users.load({
            callback: function (records, operation, success) {
                if(!success || !records) {
                    console.log('Error loading user');
                } else {
                    self.currentUser = users.first();
                    projects = self.currentUser.projects();
                    projects.load({
                        callback: function (record, operation, success) {
                            if(success) {
                                self.projects = projects;
                                Vede.application.fireEvent("renderProjectsTree");
                            } else {
                                console.log("Error loading projects");
                            }
                        }
                    });
                }
            }
        });
    },

    checkDuplicatedTabs: function (model, tabName, cb) {
        var tabPanel = Ext.getCmp('mainAppPanel');
        var tabs = Ext.getCmp('mainAppPanel').query('component[cls=DeviceEditorTab]');
        var duplicated = false;
        var ModelId = model.data.id;
        tabPanel.items.items.forEach(function (tab, key) {
            if(tab.model && tab.initialCls == tabName) {
                if(tab.model.data.id == ModelId) {
                    duplicated = true;
                    tabPanel.setActiveTab(key);
                }
            }
        });
        if(!duplicated) return cb(tabPanel);
    },

    openj5Report: function (selectedDEProject) {
        this.checkDuplicatedTabs(selectedDEProject, "j5ReportTab", function () {
            var tabPanel = Ext.getCmp('mainAppPanel');
            var newj5ReportPanel = Ext.create('Vede.view.j5Report.j5ReportPanel', {
                title: selectedDEProject.data.name + ' j5 Report',
                model: selectedDEProject
            });
            tabPanel.add(newj5ReportPanel).show();
            tabPanel.setActiveTab(newj5ReportPanel);
        });
    },

    openDEProject: function (selectedDEProject) {
        this.checkDuplicatedTabs(selectedDEProject, "DeviceEditorTab", function (tabPanel) {
            Ext.getCmp('mainAppPanel').getActiveTab().el.mask('Loading Design');
            var self = this;
            var selectedDesign = selectedDEProject.getDesign({
                callback: function (record, operation) {
                    Ext.getCmp('mainAppPanel').getActiveTab().el.unmask();
                    selectedDesign = selectedDEProject.getDesign();
                    tabPanel.add(Ext.create('Vede.view.de.DeviceEditor', {
                        title: selectedDEProject.data.name,
                        model: selectedDEProject,
                        modelId: selectedDEProject.data.id
                    })).show();
                    Ext.getCmp('projectTreePanel').expandPath('/root/' + selectedDEProject.data.project_id + '/' + selectedDEProject.data.id);
                }
            });
        });
    },

    deleteDEProject: function (deproject, tab) {
        console.log("Deleting deproject");
        var self = this;
        this.workingProject.deprojects().remove(deproject);
        this.workingProject.deprojects().sync({
            callback: function () {
                self.loadDesignAndChildResources();
                Ext.getCmp('mainAppPanel').remove(tab);
            }
        });
    },

    openSequence: function (sequence) {
        console.log("Opening Sequence");
        this.workingSequence = sequence;
        //this.workingVEProject = veproject;
        Vede.application.fireEvent("VectorEditorProjectMode", this.workingSequence);
    },

    openPart: function (part) {
        console.log("Opening Sequence Associated to Part");
        var self = this;
        var associatedSequence = part.getSequenceFile({
            callback: function (record, operation) {
                self.workingSequence = part.getSequenceFile();
                var tabPanel = Ext.getCmp('mainAppPanel');
                tabPanel.setActiveTab(1);
                var gb = Teselagen.bio.parsers.GenbankManager.parseGenbankFile(self.workingSequence.data.sequenceFileContent);
                seqMgr = Teselagen.utils.FormatUtils.genbankToSequenceManager(gb);
                Vede.application.fireEvent("SequenceManagerChanged", seqMgr);
            }
        });
    },

    openVEProject: function(veproject){
        console.log("Opening Sequence Associated to VEProject");
        var self = this;
        var associatedSequence = veproject.getSequenceFile({
            callback: function (record, operation) {
                self.workingSequence = veproject.getSequenceFile();
                self.workingVEProject = veproject;
                Vede.application.fireEvent("VectorEditorProjectMode", self.workingSequence);
            }
        });
    },

    createNewProject: function () {

        var onPromptClosed = function (btn, text) {
                if(btn == 'ok') {
                    if(text === '') return Ext.MessageBox.prompt('Name', 'Please enter a project name:', onPromptClosed, this);
                    Ext.getCmp('mainAppPanel').getActiveTab().el.mask('Creating new project');
                    var self = this;
                    var project = Ext.create("Teselagen.models.Project", {
                        name: text,
                        dateCreated: new Date(),
                        dateModified: new Date()
                    });

                    this.currentUser.projects().add(project);
                    project.save({
                        callback: function () {
                            self.workingProject = project;
                            Vede.application.fireEvent("renderProjectsTree", function () {
                                console.log("Callback reached");
                                Ext.getCmp('projectTreePanel').expandPath('/root/' + project.data.id);
                                Ext.getCmp('mainAppPanel').getActiveTab().el.unmask();
                            });
                        }
                    });
                } else {
                    return false;
                }
            };

        Ext.MessageBox.prompt('Name', 'Please enter a project name:', onPromptClosed, this);
    },

    createNewSequence: function (project) {
        var self = this;
        var onPromptClosed = function (btn, text) {
                if(btn == 'ok') {
                    if(text === '') return Ext.MessageBox.prompt('Name', 'Please enter a vector editor project name:', onPromptClosed, this);
                    Ext.getCmp('mainAppPanel').getActiveTab().el.mask('Creating new ve project');
                    var self = this;
                    var veproject = Ext.create("Teselagen.models.VectorEditorProject", {
                        name: text,
                        dateCreated: new Date(),
                        dateModified: new Date()
                    });

                    var newSequenceFile = Ext.create("Teselagen.models.SequenceFile", {
                        sequenceFileFormat: "GENBANK",
                        sequenceFileContent: "LOCUS       NO_NAME                    0 bp    DNA     circular     19-DEC-2012\nFEATURES             Location/Qualifiers\n\nNO ORIGIN\n//",
                        sequenceFileName: "untitled.gb",
                        partSource: "Untitled sequence"
                    });

                    project.veprojects().add(veproject);
                    veproject.setSequenceFile(newSequenceFile);
                    veproject.save({callback: function(){

                        newSequenceFile.setVectorEditorProject(veproject);
                        newSequenceFile.set('veproject_id',veproject.data.id);

                        newSequenceFile.save({
                            callback: function () {

                                veproject.set('sequencefile_id',newSequenceFile.data.id);
                                veproject.save();

                                Vede.application.fireEvent("renderProjectsTree", function () {
                                    Ext.getCmp('projectTreePanel').expandPath('/root/' + project.data.id + '/' + veproject.data.id);
                                    Ext.getCmp('mainAppPanel').getActiveTab().el.unmask();
                                    self.openVEProject(veproject);
                                });
                            }
                        });
                    }});

                } else {
                    return false;
                }
            };

        Ext.MessageBox.prompt('Name', 'Please enter a project name:', onPromptClosed, this);
    },

    createNewDEProjectAtProject: function (project) {
        var onPromptClosed = function (btn, text) {
                if(btn == 'ok') {
                    if(text === '') return Ext.MessageBox.prompt('Name', 'Please enter a design name:', onPromptClosed, this);
                    Ext.getCmp('mainAppPanel').getActiveTab().el.mask('Generating Design');
                    var self = this;
                    if(project) {
                        deproject = Ext.create("Teselagen.models.DeviceEditorProject", {
                            name: text,
                            dateCreated: new Date(),
                            dateModified: new Date()
                        });

                        var binsArray = [];
                        var parts = [];

                        for(var binIndex = 0; binIndex < 1; binIndex++) {
                            var newBin = Ext.create("Teselagen.models.J5Bin", {
                                binName: "bin" + binIndex + 1
                            });
                            var tempParts = [];
                            for(var i = 0; i < 2; i++) {
                                var newPart = Ext.create("Teselagen.models.Part", {
                                    name: "",
                                    genbankStartBP: 1,
                                    endBP: 7
                                });
                                parts.push(newPart);
                                tempParts.push(newPart);
                            }
                            newBin.addToParts(tempParts);
                            binsArray.push(newBin);
                        }

                        var afterPartsSaved = function () {

                                var design = Teselagen.manager.DeviceDesignManager.createDeviceDesignFromBins(binsArray);
                                deproject.setDesign(design);
                                project.deprojects().add(deproject);

                                deproject.save({
                                    callback: function () {
                                        design.set('deproject_id', deproject.get('id'));
                                        design.save({
                                            callback: function () {
                                                Vede.application.fireEvent("renderProjectsTree", function () {
                                                    console.log("Expanding " + '/root/' + project.data.id + '/' + deproject.data.id);
                                                    Ext.getCmp('projectTreePanel').expandPath('/root/' + project.data.id);
                                                    Ext.getCmp('projectTreePanel').selectPath('/root/' + project.data.id + '/' + deproject.data.id);
                                                });
                                                self.openDEProject(deproject);
                                            }
                                        });
                                    }
                                });
                            };

                        parts.forEach(function (part, partIndex) {
                            part.save({
                                callback: function () {
                                    if(partIndex == parts.length - 1) afterPartsSaved();
                                }
                            });
                        });

                    }
                } else return false;

            };

        Ext.MessageBox.prompt('Name', 'Please enter a design name:', onPromptClosed, this);

    },
    /*
    openSequenceFile: function () {
        var self = this;
        Ext.getCmp('ProjectPanel').setActiveTab(2);
        if(this.workingProject) {
            var veproject = Ext.create("Teselagen.models.VectorEditorProject", {
                name: "Untitled Project"
            });

            this.workingProject.deprojects().add(veproject);

            veproject.save({
                callback: function () {
                    console.log("VE project saved");
                    var tabPanel = Ext.getCmp('mainAppPanel');
                    tabPanel.setActiveTab(1);
                    Vede.application.fireEvent("ImportSequenceToProject", veproject);
                    self.loadDesignAndChildResources();
                }
            });
        }
    }
    */
});