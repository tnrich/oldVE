/**
 * Project controller
 * @class Vede.controller.ProjectExplorerController
 * @author Rodrigo Pavez
 */
Ext.define("Vede.controller.ProjectExplorerController", {
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
     */
    loadProjectTree: function (cb) {
        Teselagen.manager.ProjectExplorerManager.load(cb);
    },

    resolveAndopenDeviceDesign: function (record) {
        var oldTab = Ext.getCmp("mainAppPanel").getActiveTab();
        oldTab.el.mask("Loading design", "loader rspin");
        $(".loader").html("<span class='c'></span><span class='d spin'><span class='e'></span></span><span class='r r1'></span><span class='r r2'></span><span class='r r3'></span><span class='r r4'></span>");

        var design_id = record.data.id;
        var project_id = record.parentNode.data.id;
        Teselagen.manager.ProjectExplorerManager.openDesign(design_id,project_id,function(){
            oldTab.el.unmask();
        });
    },

    resolveAndOpenSequenceLibrary: function (record) {
        var tabPanel = Ext.getCmp("mainAppPanel");
        var dashPanel = Ext.getCmp("DashboardPanel");
        tabPanel.setActiveTab(0);
        dashPanel.setActiveTab(1);
    },

    resolveAndOpenPartLibrary: function (record) {
        var tabPanel = Ext.getCmp("mainAppPanel");
        var dashPanel = Ext.getCmp("DashboardPanel");

        tabPanel.setActiveTab(0);
        dashPanel.setActiveTab(2);
    },


    resolveAndOpenj5Reports: function (record) {
        var oldTab = Ext.getCmp("mainAppPanel").getActiveTab();
        oldTab.el.mask("Loading j5 report", "loader rspin");

        $(".loader").html("<span class='c'></span><span class='d spin'><span class='e'></span></span><span class='r r1'></span><span class='r r2'></span><span class='r r3'></span><span class='r r4'></span>");

        var design_id = record.data.id.replace("report","");
        var project_id = record.parentNode.parentNode.data.id;

        Teselagen.manager.ProjectExplorerManager.openJ5Report(design_id,project_id,function(){
            oldTab.el.unmask();
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
        Teselagen.manager.ProjectManager.createNewSequence();
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
                    newPart.setSequenceFile(newSequenceFile);
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
        Teselagen.manager.ProjectManager.sequences.load({
            id: sequence_id,
            callback: function (loadedsequence) {
                Teselagen.manager.ProjectManager.workingProject = project;
                Teselagen.manager.ProjectManager.openSequence(loadedsequence[0]);
                //Ext.getCmp("VectorEditorStatusPanel").down("tbtext[id=\"VectorEditorStatusBarAlert\"]").setText("");
                oldTab.el.unmask();
            }
        });
    },

    resolveAndOpenPart: function (record){
        var oldTab = Ext.getCmp("mainAppPanel").getActiveTab();
        oldTab.el.mask("Loading part", "loader rspin");
        $(".loader").html("<span class='c'></span><span class='d spin'><span class='e'></span></span><span class='r r1'></span><span class='r r2'></span><span class='r r3'></span><span class='r r4'></span>");

        var part_id = record.data.id.replace("part","");

        Teselagen.manager.ProjectExplorerManager.openPart(part_id,function(){
            oldTab.el.unmask();
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
        case "part":
            this.resolveAndOpenPart(record);
            break;
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
     * @member Vede.controller.ProjectExplorerController
     */
    init: function () {
        this.callParent();

        this.ProjectEvent = Teselagen.event.ProjectEvent;

        this.application.on(this.ProjectEvent.OPEN_PROJECT, this.openProject, this);
        this.application.on(this.ProjectEvent.LOAD_PROJECT_TREE, this.loadProjectTree, this);

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
            "#openSequenceLibraryBtn": {
                click: this.resolveAndOpenSequenceLibrary
            },
            "#openPartLibraryBtn": {
                click: this.resolveAndOpenPartLibrary
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
