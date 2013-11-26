/**
 * @class Teselagen.manager.ProjectExplorerManager
 */
Ext.define("Teselagen.manager.ProjectExplorerManager", {
    requires: [],

    singleton: true,
    projectsData: {},

    load: function(cb){
        this.loadData(this.reRenderProjectExplorer,cb,this);
    },

    loadData: function(cb,cb2,scope){
        var self = scope;
        setTimeout(function(){
        Ext.Ajax.request({
            withCredentials: true,
            url: Teselagen.manager.SessionManager.buildUserResUrl("/projectExplorer/getData", ""),
            success: function(response){
                self.projectsData = JSON.parse(response.responseText);
                return cb(self,cb2);
            }
        });
    },5000);
    },

    reRenderProjectExplorer: function(scope,cb){
        var projects = scope.projectsData;
        var rootNode = Ext.getCmp("projectTreePanel").getRootNode(); // Set the root node

        rootNode.removeAll(); // Remove existing subnodes

        projects.forEach(function (project) {

            // Append existing project
            var projectNode = rootNode.appendChild({
                text: project.name,
                id: project.id,
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

            project.designs.forEach(function(design){

                    // Append design to project node
                    var designnode = projectNode.appendChild({
                        text: design.name,
                        type: "design",
                        leaf: false,
                        id: design.id,
                        hrefTarget: "opende",
                        icon: "resources/images/ux/design-tree-icon-leaf.png",
                        qtip: "Design " + design.name
                    });

                    // Append j5Report to design
                    designnode.appendChild({
                        text: "J5 Reports",
                        leaf: true,
                        type: "report",
                        id: design.id+"report",
                        hrefTarget: "j5reports",
                        icon: "resources/images/ux/j5-tree-icon-parent.png",
                        qtip: design.name + " Report"
                    });

                    // Append parts node to design
                    var partnode = designnode.appendChild({
                        text: "Parts",
                        leaf: false,
                        id: design.id+"parts",
                        icon: "resources/images/ux/circular.png",
                        qtip: design.name + " Parts"
                    });

                    design.parts.forEach(function(part){
                            partnode.appendChild({
                                text: part.name,
                                leaf: true,
                                id: part.id+"part",
                                hrefTarget: "part",
                                icon: "resources/images/ux/circular.png",
                                qtip: "Part " + part.name
                            });
                    });
                        });
        });
        if(typeof (cb) === "function") {cb(); }
        },

        openDesign: function(design_id,project_id,cb){
        var project = Teselagen.manager.ProjectManager.projects.getById(project_id);

        project.designs().load({
            id: design_id,
            callback: function(loadedDesign, operation, success) {
                if(success) {
                    Teselagen.manager.ProjectManager.workingProject = project;
                    Teselagen.manager.ProjectManager.openDeviceDesign(loadedDesign[0]);
                }
                if(typeof (cb) === "function") {cb(); }
            }
        });
    },

    openJ5Report: function(design_id,project_id,cb){
            var project = Teselagen.manager.ProjectManager.projects.getById(project_id);
    project.designs().load({
        id: design_id,
        callback: function (loadedDesign) {
            Teselagen.manager.ProjectManager.workingProject = project;
            var design = loadedDesign[0];
            //console.log(design);
            //var j5report = loadedDesign[0].j5runs();
            Teselagen.manager.ProjectManager.openj5Report(design);
            if(typeof (cb) === "function") {cb(); }
        }
    });	
    },

    openPart: function(part_id,cb){
    var continueProcess = function(part){
        part.getSequenceFile({
            callback: function (loadedsequence) {
                //Teselagen.manager.ProjectManager.workingProject = project;
                Vede.application.fireEvent(Teselagen.event.ProjectEvent.OPEN_SEQUENCE_IN_VE, loadedsequence, part);
                // Teselagen.manager.ProjectManager.openSequence(loadedsequence);
                if(typeof (cb) === "function") {cb(); }
            }
        });
    };

    var partsStore = Teselagen.manager.ProjectManager.parts;
    var part = partsStore.getById(part_id);

    if(part) continueProcess(part);
    else
    {
        partsStore.load({
            params: {
                id: part_id
            },
            callback: function(parts){
                continueProcess(parts[0]);
            }
        });
    }
    },


    onExplorerMenuItemClick: function(menuitem, record) {
        var selectedNode = record;
        var selectedPath = selectedNode.getPath();
        var selectedRecord = selectedNode.data;
        var selectedRecordType = selectedRecord.hrefTarget;
        var selectedRecordId = selectedRecord.id;
        var selectedProject;
        var self = this;

        var expandPathCallback = function(){
            Ext.getCmp("projectTreePanel").expandPath( selectedPath );
        };

        switch (menuitem.text) {
            case "Rename":
                switch(selectedRecordType) {
                    case "openproj":
                        selectedProject = Teselagen.manager.ProjectManager.projects.getById(selectedRecordId);
                        self.renameProject(selectedProject, expandPathCallback);
                        break;
                    case "opende":
                        selectedProject = Teselagen.manager.ProjectManager.projects.getById(selectedRecord.parentId);
                        selectedProject.designs().load({
                            id: selectedRecord.id,
                            params: {
                                includeEugeneRules: true
                            },
                            callback: function (loadedDesign) {
                                self.renameDesign( loadedDesign[0], expandPathCallback);
                            }
                        });
                        break;
                    case "part":
                        var designName = selectedNode.parentNode.parentNode.data.text;
                        var selectedPart = Teselagen.manager.ProjectManager.parts.getById(selectedRecord.id.replace("part",""));
                        self.renamePart(selectedPart, designName, expandPathCallback);
                        break;
                }
            break;
            case "Delete":
                switch(selectedRecordType) {
                    case "openproj":
                        console.log("delete project");
                        selectedProject = Teselagen.manager.ProjectManager.projects.getById(selectedRecord.id);
                        self.deleteProject(selectedProject, expandPathCallback);
                        break;
                    case "opende":
                        console.log("delete design");
                        selectedProject = Teselagen.manager.ProjectManager.projects.getById(selectedRecord.parentId);
                        selectedProject.designs().load({
                            id: selectedRecord.id,
                            callback: function (loadedDesign) {
                                self.deleteDesign( loadedDesign[0], expandPathCallback);
                            }
                        });

                        break;
                    case "opensequence":
                        console.log("delete sequence");
                        break;
                }
            break;
        }
    },

    renamePart: function(selectedPart, designName, cb){
        var GridController = Vede.application.getController("DeviceEditor.GridController");
        var self = this;
        self.promptName("Please enter a part name:",function(text){
            selectedPart.set('name',text);

            selectedPart.save({
                callback: function(){
                    self.load(function(){
                        if(typeof (cb) === "function") {cb();
                        GridController.ReRenderDevice();}
                    });
                }
            });

            Teselagen.manager.ProjectManager.renamePartinOpenDesigns(selectedPart, text);
        }, selectedPart.get('name'));
    },

    renameDesign: function(selectedDesign,cb){
        var self = this;

        var tab = Ext.getCmp("mainAppPanel").query("component[title='" + selectedDesign.get("name") + "']")[0];

        self.promptName("Please enter a design name:",function(text){
            selectedDesign.set('name',text);

            selectedDesign.save({
                callback: function(){
                    self.load(function(){
                        if(typeof (cb) === "function") {cb();}
                    });
                }
            });

            tab.model.set('name', selectedDesign.get('name'));
            tab.setTitle(selectedDesign.get('name'));
        }, selectedDesign.get('name'));
    },

    renameProject: function(selectedProject,cb){
        var self = this;
        self.promptName("Please enter a project name:",function(text){
            selectedProject.set('name',text);

            selectedProject.save({
                callback: function(){
                    self.load(function(){
                        if(typeof (cb) === "function") {cb();}
                    });
                }
            });
        }, selectedProject.get('name'));
    },

    promptName: function(promptText,cb, value){
        var onPromptClosed = function (btn, text){
            if(btn === "ok") {
                text = Ext.String.trim(text);
                if(text === "") {return Ext.MessageBox.prompt("Name", promptText, onPromptClosed, this);}
                cb(text);
            }
        };

        Ext.MessageBox.prompt("Name", promptText, onPromptClosed, this, false, value);
    },

    deleteDesign: function(selectedDesign, cb){
        var designName = selectedDesign.data.name;
        function DeleteDeviceDesignBtn (btn) {
            if (btn==="ok") {
                Teselagen.manager.ProjectManager.DeleteDeviceDesign(selectedDesign);
                toastr.options.onclick = null;
                
                toastr.info("Design '" + designName +  "' Deleted");
             }
         }

        Ext.Msg.show({
             title:"Are you sure you want to delete this design?",
             msg: "WARNING: This will remove design '" + designName + "'. This action is not undoable!",
             cls: "messageBox",
             buttons: Ext.Msg.OKCANCEL,
             fn: DeleteDeviceDesignBtn,
             icon: Ext.Msg.QUESTION
        });
    },

    deleteProject: function(selectedProject, cb){
        var projectName = selectedProject.data.name;
        function DeleteProjectBtn (btn) {
            if (btn==="ok") {
                Teselagen.manager.ProjectManager.deleteProject(selectedProject);
                toastr.options.onclick = null;
                
                toastr.info("Design '" + projectName +  "' Deleted");
             }
         }

        Ext.Msg.show({
             title:"Are you sure you want to delete this project?",
             msg: "WARNING: This will remove project '" + projectName + "'. This action is not undoable!",
             cls: "messageBox",
             buttons: Ext.Msg.OKCANCEL,
             fn: DeleteProjectBtn,
             icon: Ext.Msg.QUESTION
        });
    }
});
