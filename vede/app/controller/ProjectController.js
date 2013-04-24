/**
 * Project controller
 * @class Vede.controller.ProjectController
 */
Ext.define("Vede.controller.ProjectController", {
    extend: "Ext.app.Controller",
    requires: ["Teselagen.event.ProjectEvent", "Teselagen.manager.ProjectManager", "Teselagen.models.DeviceEditorProject", "Teselagen.models.SequenceFile", "Teselagen.models.Part", "Teselagen.models.VectorEditorProject"],

    sequenceStore: null,

    openProject: function (project) {
        Teselagen.manager.ProjectManager.openProject(project);
    },

    renderProjectsTree: function (cb) {

        var self = this;

        var rootNode = Ext.getCmp('projectTreePanel').getRootNode();
        rootNode.removeAll();

        rootNode.appendChild({
            text: 'Create project',
            leaf: true,
            hrefTarget: 'newproj',
            icon: 'resources/images/add.png',
            id: 0
        });

        var projects = Teselagen.manager.ProjectManager.projects;

        projects.each(function (project) {
            var projectNode = rootNode.appendChild({
                text: project.data.name,
                id: project.data.id,
                hrefTarget: 'openproj'
            });

            projectNode.appendChild({
                text: 'Create design',
                leaf: true,
                hrefTarget: 'newde',
                icon: 'resources/images/add.png',
                id: 0
            });

            projectNode.appendChild({
                text: 'Create sequence',
                leaf: true,
                hrefTarget: 'newsequence',
                icon: 'resources/images/add.png',
                id: 0
            });

            var designs = project.designs();
            designs.load({
                callback: function () {
                    designs.each(function (design) {

                        var designnode = projectNode.appendChild({
                            text: design.data.name,
                            leaf: false,
                            id: design.data.id,
                            hrefTarget: "opende",
                            icon: "resources/images/ux/design-tree-icon-leaf.png"
                        });

                        var j5resultsNode = designnode.appendChild({
                            text: "J5 Reports",
                            leaf: true,
                            id: design.data.id,
                            hrefTarget: "j5reports",
                            icon: "resources/images/ux/j5-tree-icon-parent.png"
                        });

                    });
                }
            });


            self.sequenceStore = Ext.create('Ext.data.Store', {
                model: 'Teselagen.models.VectorEditorProject'
            });

            Teselagen.manager.ProjectManager.sequenceStore =
                Ext.create('Ext.data.Store', {
                    model: 'Teselagen.models.VectorEditorProject'
            });
            /*
            var veprojects = project.veprojects();
            veprojects.load({
                callback: function () {
                    veprojects.each(function (veproject) {
                        self.sequenceStore.add(veproject);
                        Teselagen.manager.ProjectManager.sequenceStore.add(veproject);

                        var veprojectnode = projectNode.appendChild({
                            text: veproject.data.name,
                            leaf: true,
                            id: veproject.data.id,
                            hrefTarget: 'opensequence',
                            icon: "resources/images/ux/sequence-tree-icon-leaf.png"
                        });


                        partsRootNode.appendChild({
                            text: veproject.data.name,
                            leaf: true,
                            id: veproject.data.id,
                            hrefTarget: 'opensequence',
                            icon: "resources/images/ux/sequence-tree-icon-leaf.png"
                        });
                    });
                }
            });
            */
        });

        //Ext.getCmp('designGrid_Panel').reconfigure(lastDEProjects);
        if(typeof (cb) == "function") cb();
    },

    resolveAndOpenDEProject: function (record) {
        var deproject_id = record.data.id;
        var project_id = record.parentNode.data.id;
        var project = Teselagen.manager.ProjectManager.projects.getById(project_id);
        var deprojects = project.designs().load({
            callback: function () {
                var deproject = deprojects.getById(deproject_id);
                Teselagen.manager.ProjectManager.workingProject = project;
                Teselagen.manager.ProjectManager.openDEProject(deproject);
            }
        });

    },

    resolveAndOpenj5Report: function (record) {
        var deproject_id = record.parentNode.parentNode.data.id;
        var project_id = record.parentNode.parentNode.parentNode.data.id;
        var project = Teselagen.manager.ProjectManager.projects.getById(project_id);
        var deprojects = project.deprojects().load({
            callback: function () {
                var deproject = deprojects.getById(deproject_id);
                Teselagen.manager.ProjectManager.openj5Report(deproject);
            }
        });
    },

    resolveAndOpenj5Reports: function (record) {
        var deproject_id = record.parentNode.data.id;
        var project_id = record.parentNode.parentNode.data.id;
        var project = Teselagen.manager.ProjectManager.projects.getById(project_id);
        var deprojects = project.deprojects().load({
            callback: function () {
                var deproject = deprojects.getById(deproject_id);
                Teselagen.manager.ProjectManager.openj5Report(deproject, record);
            }
        });
    },

    resolveAndCreateDEProject: function (record) {
        var project_id = record.parentNode.data.id;
        var project = Teselagen.manager.ProjectManager.projects.getById(project_id);
        var projectNames = [];
        project.designs().load().each(function (design) {
            projectNames.push(design.data.name);
        });
        Teselagen.manager.ProjectManager.createNewDEProjectAtProject(project, projectNames);
    },

    createProject: function (record) {
        Teselagen.manager.ProjectManager.createNewProject();
    },

    /* Creates a veproject and an associated sequence */
    createSequence: function (record) {
        var project_id = record.parentNode.data.id;
        var project = Teselagen.manager.ProjectManager.projects.getById(project_id);
        var veprojectNames = [];
        project.veprojects().load().each(function (veproject) {
                    veprojectNames.push(veproject.data.name);
        });
        Teselagen.manager.ProjectManager.createNewSequence(project, veprojectNames);
    },

    promptPartName: function(cb){
        var onPromptClosed = function (btn, text) {
                if(btn == 'ok') {
                    if(text === '') return Ext.MessageBox.prompt('Name', 'Please enter a project name:', onPromptClosed, this);
                    else return cb(text);
                }
        };

        Ext.MessageBox.prompt('Name', 'Please enter a part name:', onPromptClosed, this);
    },

    addPart: function (record) {
        var self = this;
        var project_id = record.parentNode.parentNode.data.id;
        var veproject_id = record.parentNode.data.id;
        var project = Teselagen.manager.ProjectManager.projects.getById(project_id);
        var selectedVEProject = project.veprojects().getById(veproject_id);

        this.promptPartName(function(partName){

            var newSequenceFile = Ext.create("Teselagen.models.SequenceFile", {
                sequenceFileFormat: "GENBANK",
                sequenceFileContent: "LOCUS       NO_NAME                    0 bp    DNA     circular     19-DEC-2012\nFEATURES             Location/Qualifiers\n\nNO ORIGIN\n//",
                sequenceFileName: "untitled.gb",
                partSource: "Untitled sequence"
            });

            var newPart = Ext.create("Teselagen.models.Part", {
                name: partName,
                genbankStartBP: 1,
                endBP: 7
            });

            newSequenceFile.save({
                callback: function () {
                    newPart.setSequenceFileModel(newSequenceFile);
                    var selectedVEProjectID = selectedVEProject.data.id;
                    newPart.set('veproject_id', selectedVEProjectID);
                    selectedVEProject.set('id',selectedVEProjectID);
                    newPart.save({
                        callback: function () {
                            selectedVEProject.parts().add(newPart);
                            selectedVEProject.save({
                                callback: function () {
                                    Vede.application.fireEvent("renderProjectsTree", function () {
                                        Ext.getCmp('projectTreePanel').expandPath('/root/' + project.data.id + '/' + selectedVEProject.data.id);
                                    });
                                    Teselagen.manager.ProjectManager.workingSequence = newSequenceFile;
                                    Vede.application.fireEvent("openVectorEditor", newSequenceFile);
                                }
                            });
                        }
                    });
                }
            });
        });
        
    },

    resolveAndOpenSequence: function (record) {
        Ext.getCmp('mainAppPanel').getActiveTab().el.mask('Loading Sequence');
        var veproject_id = record.data.id;
        var project_id = record.parentNode.data.id;
        var project = Teselagen.manager.ProjectManager.projects.getById(project_id);
        var veprojects = project.veprojects().load({
            callback: function () {
                var veproject = veprojects.getById(veproject_id);
                Teselagen.manager.ProjectManager.openVEProject(veproject);
            }
        });
    },

    expandProject: function (record) {
        if(record.isExpanded()) record.collapse();
        else record.expand();
    },

    onProjectPanelItemClick: function (store, record) {
        switch(record.data.hrefTarget) {
        case 'openproj':
            this.expandProject(record);
            break;
        case 'newproj':
            this.createProject(record);
            break;
        case 'newsequence':
            this.createSequence(record);
            break;
        case 'newde':
            this.resolveAndCreateDEProject(record);
            break;
        case 'opende':
            this.resolveAndOpenDEProject(record);
            break;
        case 'opensequence':
            this.resolveAndOpenSequence(record);
            break;
        case 'j5report':
            this.resolveAndOpenj5Report(record);
            break;
        case 'j5reports':
            this.resolveAndOpenj5Reports(record);
            break;
        case 'addpart':
            this.addPart(record);
            break;
        }
    },

    onProjectPartsPanelItemClick: function (store, record) {
        switch(record.data.hrefTarget) {
        case 'addpart':
            this.addPart(record);
            break;
        case 'openpart':
            this.resolveAndOpenPart(record);
            break;
        }
    },

    onNewProjectClick: function () {
        Teselagen.manager.ProjectManager.createNewProject();
    },

    onNewDEClick: function () {
        if(!Teselagen.manager.ProjectManager.workingProject) return Ext.MessageBox.alert('Alert', 'First select or create a Project.');
        Teselagen.manager.ProjectManager.createNewDeviceEditorProject();
    },

    onOpenSequenceFileClick: function () {
        Teselagen.manager.ProjectManager.openSequenceFile();
    },
    onRemoveProjectClick: function () {

    },

    init: function () {
        this.callParent();
        this.application.on(Teselagen.event.ProjectEvent.OPEN_PROJECT, this.openProject, this);
        this.application.on("renderProjectsTree", this.renderProjectsTree, this);

        this.control({
            '#projectTreePanel': {
                itemclick: this.onProjectPanelItemClick
            },
            '#projectPartsPanel': {
                itemclick: this.onProjectPartsPanelItemClick
            },
            "#newProject_Btn": {
                click: this.onNewProjectClick
            },
            "#newDE_Btn": {
                click: this.onNewDEClick
            },
            "#openSequenceFile_Btn": {
                click: this.onOpenSequenceFileClick
            },
            "#removeProject_Btn": {
                click: this.onRemoveProjectClick
            }
        });
    }
});
