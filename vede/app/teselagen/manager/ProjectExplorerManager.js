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
		Ext.Ajax.request({
		    url: Teselagen.manager.SessionManager.buildUserResUrl("/projectExplorer/getData", ""),
		    success: function(response){
		        self.projectsData = JSON.parse(response.responseText);
		        return cb(self,cb2);
		    }
		});
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
            callback: function (loadedDesign) {
                Teselagen.manager.ProjectManager.workingProject = project;
                Teselagen.manager.ProjectManager.openDeviceDesign(loadedDesign[0]);
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
        var part = Teselagen.manager.ProjectManager.currentUser.parts().getById(part_id);
        part.getSequenceFile({
            callback: function (loadedsequence) {
                //Teselagen.manager.ProjectManager.workingProject = project;
                Teselagen.manager.ProjectManager.openSequence(loadedsequence);
                if(typeof (cb) === "function") {cb(); }
            }
        });   
	},


    onExplorerMenuItemClick: function(menuitem, record) {
        var selectedNode = record;
        var selectedPath = selectedNode.getPath();
        var selectedRecord = selectedNode.data;
        var selectedRecordType = selectedRecord.hrefTarget;
        var selectedRecordId = selectedRecord.id;
        var self = this;

        var expandPathCallback = function(){
            Ext.getCmp("projectTreePanel").expandPath( selectedPath );
        };

        switch (menuitem.text) {
            case "Rename": 
                switch(selectedRecordType) {
                    case "openproj":
                        var selectedProject = Teselagen.manager.ProjectManager.projects.getById(selectedRecordId);
                        self.renameProject(selectedProject, expandPathCallback);
                        break;
                    case "opende":
                        var selectedProject = Teselagen.manager.ProjectManager.projects.getById(selectedRecord.parentId);
                        selectedProject.designs().load({
                            id: selectedRecord.id,
                            callback: function (loadedDesign) {
                                self.renameDesign( loadedDesign[0], expandPathCallback);
                            }
                        });
                        break;
                    case "part":
                        var selectedPart = Teselagen.manager.ProjectManager.parts.getById(selectedRecord.id.replace("part",""));
                        self.renamePart(selectedPart,expandPathCallback);
                        break;
                }
            break;
            case "Delete":
                switch(recordType) {
                    case "openproj":
                        console.log("delete project");
                        break;
                    case "opende":
                        console.log("delete design");
                        break;
                    case "opensequence":
                        console.log("delete sequence");
                        break;
                }
            break;
        }
    },

    renamePart: function(selectedPart,cb){

        var self = this;
        self.promptName("Please enter a part name:",function(text){
            selectedPart.set('name',text);

            selectedPart.save({
                callback: function(){
                    self.load(function(){
                        if(typeof (cb) === "function") {cb();}
                    });
                }
            });
        });
    },

    renameDesign: function(selectedDesign,cb){
        var self = this;
        self.promptName("Please enter a design name:",function(text){
            selectedDesign.set('name',text);

            selectedDesign.save({
                callback: function(){
                    self.load(function(){
                        if(typeof (cb) === "function") {cb();}
                    });
                }
            });
        });
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
        });
    },

    promptName: function(promptText,cb){
        var onPromptClosed = function (btn, text){
            if(btn === "ok") {
                text = Ext.String.trim(text);
                if(text === "") { return Ext.MessageBox.prompt("Name", promptText, onPromptClosed, this); }
                cb(text);
            }
        };

        Ext.MessageBox.prompt("Name", promptText, onPromptClosed, this);
    }



});







