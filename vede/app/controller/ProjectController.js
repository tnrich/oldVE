/**
 * Project controller
 * @class Vede.controller.ProjectController
 * @author Rodrigo Pavez
 */
Ext.define("Vede.controller.ProjectController", {
    extend: "Ext.app.Controller",
    requires: ["Teselagen.event.ProjectEvent", "Teselagen.manager.ProjectManager", "Teselagen.models.DeviceEditorProject", "Teselagen.models.SequenceFile", "Teselagen.models.Part", "Teselagen.models.VectorEditorProject"],


    /**
     * Call openProject when triggered by ProjectEvent.OPEN_PROJECT
     * @param {Teselagen.models.Project} Project Model.
     */
    openProject: function (project) {
        Teselagen.manager.ProjectManager.openProject(project);
    },

    /**
     * Load the projectTree in ProjectExplorer Panel, method triggered by 
     * @param {callback} Callback function (optional).
     * @return {Teselagen.bio.enzymes.RestrictionCutSite} A RestrictionCutSite object.
     */
    loadProjectTree: function (cb) {

        var self = this;

        var rootNode = Ext.getCmp("projectTreePanel").getRootNode(); // Set the root node
        rootNode.removeAll(); // Remove existing subnodes   

        // Append create project at the top
        rootNode.appendChild({
            text: "Create project",
            leaf: true,
            hrefTarget: "newproj",
            icon: "resources/images/add.png",
            id: 0
        });

        var projects = Teselagen.manager.ProjectManager.projects; // Get projects store

        // Iterate over projects
        projects.each(function (project) {

            // Append existing project
            var projectNode = rootNode.appendChild({
                text: project.data.name,
                id: project.data.id,
                hrefTarget: "openproj"
            });

            // Append design to project node
            projectNode.appendChild({
                text: "Create design",
                leaf: true,
                hrefTarget: "newde",
                icon: "resources/images/add.png",
                id: 0
            });

            // Append sequence to project node
            projectNode.appendChild({
                text: "Create sequence",
                leaf: true,
                hrefTarget: "newsequence",
                icon: "resources/images/add.png",
                id: 0
            });

            var designs = project.designs(); // Get designs store from current project
            designs.load({ // Load designs
                callback: function () {

                    // Iterate over designs
                    designs.each(function (design) {
                        // Append design to project node
                        var designnode = projectNode.appendChild({
                            text: design.data.name,
                            leaf: false,
                            id: design.data.id,
                            hrefTarget: "opende",
                            icon: "resources/images/ux/design-tree-icon-leaf.png"
                        });

                        // Append j5Report to design
                        designnode.appendChild({
                            text: "J5 Reports",
                            leaf: true,
                            id: design.data.id,
                            hrefTarget: "j5reports",
                            icon: "resources/images/ux/j5-tree-icon-parent.png"
                        });
                    });
                }
            });

            // Empty sequenceFile store

            Teselagen.manager.ProjectManager.sequenceStore =
                Ext.create("Ext.data.Store", {
                model: "Teselagen.models.SequenceFile"
            });
            
            var sequences = project.sequences(); // Get sequences store from current project
            sequences.load({ // Load sequences store
                callback: function () {

                    // Iterate over sequences
                    sequences.each(function (sequence) {
                        Teselagen.manager.ProjectManager.sequenceStore.add(sequence); // Add sequence to sequences store

                        // Append sequence to project store
                        projectNode.appendChild({
                            text: sequence.data.name,
                            leaf: true,
                            id: sequence.data.id,
                            hrefTarget: "opensequence",
                            icon: "resources/images/ux/sequence-tree-icon-leaf.png"
                        });
                    });
                }
            });
            
        });

        // For testing, execute callback
        if(typeof (cb) === "function") { cb(); }
    },

    resolveAndopenDeviceDesign: function (record) {
        var design_id = record.data.id;
        var project_id = record.parentNode.data.id;
        var project = Teselagen.manager.ProjectManager.projects.getById(project_id);
        project.designs().load({
            id: design_id,
            callback: function (loadedDesign) {
                Teselagen.manager.ProjectManager.workingProject = project;
                Teselagen.manager.ProjectManager.openDeviceDesign(loadedDesign[0]);
            }
        });

    },
    /*
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
    */

    resolveAndOpenj5Reports: function (record) {
        var design_id = record.data.id;
        var project_id = record.parentNode.parentNode.data.id;
        var project = Teselagen.manager.ProjectManager.projects.getById(project_id);
        project.designs().load({
            id: design_id,
            callback: function (loadedDesign) {
                Teselagen.manager.ProjectManager.workingProject = project;
                var design = loadedDesign[0];
                //console.log(design);
                //var j5report = loadedDesign[0].j5runs();
                Teselagen.manager.ProjectManager.openj5Report(design);
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
        Teselagen.manager.ProjectManager.workingProject = project;
        Teselagen.manager.ProjectManager.createNewDeviceDesignAtProject(project, projectNames);
    },

    createProject: function () {
        Teselagen.manager.ProjectManager.createNewProject();
    },

    /* Creates a sequence and an associated sequence */
    createSequence: function (record) {
        var project_id = record.parentNode.data.id;
        var project = Teselagen.manager.ProjectManager.projects.getById(project_id);
        var sequencesNames = [];
        project.sequences().load().each(function (sequence) {
            sequencesNames.push(sequence.data.name);
        });
        Teselagen.manager.ProjectManager.createNewSequence(project, sequencesNames);
    },

    promptPartName: function(cb){
        var onPromptClosed = function (btn, text) {
            if(btn === "ok") {
                if(text === "") { return Ext.MessageBox.prompt("Name", "Please enter a project name:", onPromptClosed, this); }
                else { return cb(text); }
            }
        };

        Ext.MessageBox.prompt("Name", "Please enter a part name:", onPromptClosed, this);
    },

    addPart: function (record) {
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
                    newPart.set("veproject_id", selectedVEProjectID);
                    selectedVEProject.set("id",selectedVEProjectID);
                    newPart.save({
                        callback: function () {
                            selectedVEProject.parts().add(newPart);
                            selectedVEProject.save({
                                callback: function () {
                                    Vede.application.fireEvent(Teselagen.event.ProjectEvent.LOAD_PROJECT_TREE, function () {
                                        Ext.getCmp("projectTreePanel").expandPath("/root/" + project.data.id + "/" + selectedVEProject.data.id);
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
        Ext.getCmp("mainAppPanel").getActiveTab().el.mask("Loading Sequence");

        var sequence_id = record.data.id;
        var project_id = record.parentNode.data.id;
        var project = Teselagen.manager.ProjectManager.projects.getById(project_id);
        project.sequences().load({
            id: sequence_id,
            callback: function (loadedsequence) {
                Teselagen.manager.ProjectManager.workingProject = project;
                Teselagen.manager.ProjectManager.openSequence(loadedsequence[0]);
            }
        });

    },

    expandProject: function (record) {
        if(record.isExpanded()) { record.collapse(); }
        else { record.expand(); }
    },

    onProjectPanelItemClick: function (store, record) {
        switch(record.data.hrefTarget) {
        case "openproj":
            this.expandProject(record);
            break;
        case "newproj":
            this.createProject(record);
            break;
        case "newsequence":
            this.createSequence(record);
            break;
        case "newde":
            this.resolveAndCreateDEProject(record);
            break;
        case "opende":
            this.resolveAndopenDeviceDesign(record);
            break;
        case "opensequence":
            this.resolveAndOpenSequence(record);
            break;
       // case "j5report":
       //     this.resolveAndOpenj5Report(record);
       //     break;
        case "j5reports":
            this.resolveAndOpenj5Reports(record);
            break;
        case "addpart":
            this.addPart(record);
            break;
        }
    },

    onProjectPartsPanelItemClick: function (store, record) {
        switch(record.data.hrefTarget) {
        case "addpart":
            this.addPart(record);
            break;
        case "openpart":
            this.resolveAndOpenPart(record);
            break;
        }
    },

    onNewProjectClick: function () {
        Teselagen.manager.ProjectManager.createNewProject();
    },

    onNewDEClick: function () {
        if(!Teselagen.manager.ProjectManager.workingProject) { return Ext.MessageBox.alert("Alert", "First select or create a Project."); }
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
        this.application.on(Teselagen.event.ProjectEvent.LOAD_PROJECT_TREE, this.loadProjectTree, this);

        this.control({
            "#projectTreePanel": {
                itemclick: this.onProjectPanelItemClick
            },
            "#projectPartsPanel": {
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
