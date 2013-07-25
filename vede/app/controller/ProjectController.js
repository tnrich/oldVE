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
    loadProjectTree: function (cb,cb2) {
        var self = this;

        var projects = Teselagen.manager.ProjectManager.projects; // Get projects store


        var storesCounter = 0;

        var finishedPreloading = function(){
            if(storesCounter === 0)
            {


                var rootNode = Ext.getCmp("projectTreePanel").getRootNode(); // Set the root node
                rootNode.removeAll(); // Remove existing subnodes

                // Append create project at the top
                // rootNode.appendChild({
                //     text: "Create project",
                //     leaf: true,
                //     hrefTarget: "newproj",
                //     icon: "resources/images/add.png"
                // });

                // Iterate over projects
                projects.each(function (project) {

                    // Append existing project
                    var projectNode = rootNode.appendChild({
                        text: project.data.name,
                        id: project.data.id,
                        type: "project",
                        hrefTarget: "openproj"
                    });

                    // Append design to project node
                    projectNode.appendChild({
                        text: "Create design",
                        leaf: true,
                        hrefTarget: "newde",
                        icon: "resources/images/add.png"
                    });

                    // Append sequence to project node
                    projectNode.appendChild({
                        text: "Create sequence",
                        leaf: true,
                        hrefTarget: "newsequence",
                        icon: "resources/images/add.png"
                        //id: 0
                    });

                    var designs = project.designs(); // Get designs store from current project


                            // Iterate over designs
                            designs.each(function (design) {
                                // Append design to project node
                                var designnode = projectNode.appendChild({
                                    text: design.data.name,
                                    type: "design",
                                    leaf: false,
                                    id: design.data.id,
                                    hrefTarget: "opende",
                                    icon: "resources/images/ux/design-tree-icon-leaf.png",
                                    qtip: "Design " + design.data.name
                                });

                                // Append j5Report to design
                                designnode.appendChild({
                                    text: "J5 Reports",
                                    leaf: true,
                                    type: "report",
                                    id: design.data.id+"report",
                                    hrefTarget: "j5reports",
                                    icon: "resources/images/ux/j5-tree-icon-parent.png",
                                    qtip: design.data.name + " Report"
                                });

                                // Append parts to design
                                designnode.appendChild({
                                    text: "Parts",
                                    leaf: false,
                                    id: design.data.id+"parts",
                                    icon: "resources/images/ux/circular.png",
                                    qtip: design.data.name + " Parts"
                                });
                            });



                            
                            if(typeof (cb2) === "function") {cb2(); }

                    // Empty sequenceFile store

                    Teselagen.manager.ProjectManager.sequenceStore =
                        Ext.create("Ext.data.Store", {
                        model: "Teselagen.models.SequenceFile"
                    });
                                
                    var sequences = project.sequences(); // Get sequences store from current project

                    // Iterate over sequences
                    sequences.each(function (sequence) {
                        sequence.data.parentProject = project.data.name;
                        Teselagen.manager.ProjectManager.sequenceStore.add(sequence); // Add sequence to sequences store
                    });

                    
                });

                // For testing, execute callback
                if(typeof (cb) === "function") {cb(); }
            }
        };

        //console.log("Preloading data");

        // PRELOAD DATA
        projects.load({
            callback: function(){
                if(projects.count()===0) { finishedPreloading(); }
                projects.each(function(project){
                    storesCounter++;
                    project.designs().load({
                        callback: function(){
                            storesCounter--;
                            finishedPreloading();
                        }
                    });
                    storesCounter++;
                    project.sequences().load({
                        callback: function(){
                            storesCounter--;
                            finishedPreloading();
                        }
                    });
                });
            }
        });

    },

    resolveAndopenDeviceDesign: function (record) {
    	var oldTab = Ext.getCmp("mainAppPanel").getActiveTab();
    	oldTab.el.mask("Loading design", "loader rspin");
        $(".loader").html("<span class='c'></span><span class='d spin'><span class='e'></span></span><span class='r r1'></span><span class='r r2'></span><span class='r r3'></span><span class='r r4'></span>");

    	var design_id = record.data.id;
        var project_id = record.parentNode.data.id;
        var project = Teselagen.manager.ProjectManager.projects.getById(project_id);
        project.designs().load({
            id: design_id,
            callback: function (loadedDesign) {
                Teselagen.manager.ProjectManager.workingProject = project;
                Teselagen.manager.ProjectManager.openDeviceDesign(loadedDesign[0]);
                oldTab.el.unmask();
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

    resolveAndOpenSequenceLibrary: function (record) {
        var tabPanel = Ext.getCmp("mainAppPanel");
        var dashPanel = Ext.getCmp("DashboardPanel");
        tabPanel.setActiveTab(0);
        dashPanel.setActiveTab(1);
    },

    resolveAndOpenj5Reports: function (record) {
    	var oldTab = Ext.getCmp("mainAppPanel").getActiveTab();
    	oldTab.el.mask("Loading j5 report", "loader rspin");
    	
        $(".loader").html("<span class='c'></span><span class='d spin'><span class='e'></span></span><span class='r r1'></span><span class='r r2'></span><span class='r r3'></span><span class='r r4'></span>");

    	var design_id = record.data.id.replace("report","");
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
                oldTab.el.unmask();
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
                if(text === "") {return Ext.MessageBox.prompt("Name", "Please enter a project name:", onPromptClosed, this); }
                else {return cb(text); }
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
                                    Vede.application.fireEvent(this.ProjectEvent.LOAD_PROJECT_TREE, function () {
                                        Ext.getCmp("projectTreePanel").expandPath("/root/" + project.data.id + "/" + selectedVEProject.data.id);
                                    });
                                    Teselagen.manager.ProjectManager.workingSequence = newSequenceFile;
                                    Vede.application.fireEvent(this.ProjectEvent.OPEN_SEQUENCE_IN_VE, newSequenceFile);
                                }
                            });
                        }
                    });
                }
            });
        });

    },

    resolveAndOpenSequence: function (record) {
    	var oldTab = Ext.getCmp("mainAppPanel").getActiveTab();
    	oldTab.el.mask("Loading sequence", "loader rspin");
        $(".loader").html("<span class='c'></span><span class='d spin'><span class='e'></span></span><span class='r r1'></span><span class='r r2'></span><span class='r r3'></span><span class='r r4'></span>");
    	
        var sequence_id = record.data.id;
        var project_id = record.parentNode.data.id;
        var project = Teselagen.manager.ProjectManager.projects.getById(project_id);
        project.sequences().load({
            id: sequence_id,
            callback: function (loadedsequence) {
                Teselagen.manager.ProjectManager.workingProject = project;
                Teselagen.manager.ProjectManager.openSequence(loadedsequence[0]);
                //Ext.getCmp("VectorEditorStatusPanel").down("tbtext[id=\"VectorEditorStatusBarAlert\"]").setText("");
                oldTab.el.unmask();
            }
        });
    },

    expandProject: function (record) {
        if(record.isExpanded()) {record.collapse(); }
        else {record.expand(); }
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
    
    onProjectPanelItemContextMenu: function(store, record, item, index, e) {
    	e.preventDefault();
        var contextMenu = Ext.create('Ext.menu.Menu',{
        	  items: [{
        	    text: 'Open'
        	    //handler: this.resolveAndOpenSequence(record)
        	  },{
          	    text: 'Open in New Tab'/*,
          	    handler: function() {
          	    	sequenceManager.removeFeature(feature,false);
          	    }*/
          	  }]
        });                  
        contextMenu.show(); 
        contextMenu.setPagePosition(e.getX(),e.getY()-5);
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
        if(!Teselagen.manager.ProjectManager.workingProject) {return Ext.MessageBox.alert("Alert", "First select or create a Project."); }
        Teselagen.manager.ProjectManager.createNewDeviceEditorProject();
    },

    onOpenSequenceFileClick: function () {
        Teselagen.manager.ProjectManager.openSequenceFile();
    },
    onRemoveProjectClick: function () {

    },

    /**
     * @member Vede.controller.ProjectController
     */
    init: function () {
        this.callParent();

        this.ProjectEvent = Teselagen.event.ProjectEvent;

        this.application.on(this.ProjectEvent.OPEN_PROJECT, this.openProject, this);
        this.application.on(this.ProjectEvent.LOAD_PROJECT_TREE, this.loadProjectTree, this);

        this.control({
            "#projectTreePanel": {
                itemclick: this.onProjectPanelItemClick
                //itemcontextmenu: this.onProjectPanelItemContextMenu
            },
            "#projectPartsPanel": {
                itemclick: this.onProjectPartsPanelItemClick
            },
            "#newProject_Btn": {
                click: this.onNewProjectClick
            },
            "#openSequenceLibraryBtn": {
                click: this.resolveAndOpenSequenceLibrary
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
