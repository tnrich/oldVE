Ext.define("Vede.controller.ProjectController", {
    extend: "Ext.app.Controller",
    requires: ["Teselagen.event.ProjectEvent", "Teselagen.manager.ProjectManager","Teselagen.models.DeviceEditorProject",
    "Teselagen.models.SequenceFile","Teselagen.models.Part","Teselagen.models.VectorEditorProject"],

    partsStore: null,

    openProject: function (project) {
        Teselagen.manager.ProjectManager.openProject(project);
    },

    renderProjectsTree: function(cb){
        var rootNode = Ext.getCmp('projectTreePanel').getRootNode();
        rootNode.removeAll();

        rootNode.appendChild({
            text: 'Add project',
            leaf: true,
            hrefTarget: 'newproj',
            icon: 'resources/images/add.png',
            id: 0
        });

        var lastDEProjects = Ext.create('Ext.data.Store',{model: 'Teselagen.models.DeviceEditorProject'});
        var projects = Teselagen.manager.ProjectManager.projects;
        projects.each(function(project) {
            var projectNode = rootNode.appendChild({
                text: project.data.name,
                id: project.data.id,
                hrefTarget: 'openproj'
            });

            var deprojects = project.deprojects();
            deprojects.load({callback: function(){
                deprojects.each(function(deproject){
                    lastDEProjects.add(deproject);
                    var deprojectnode = projectNode.appendChild({
                        text: deproject.data.name,
                        leaf: false,
                        id: deproject.data.id,
                        hrefTarget: 'opende',
                        icon: "resources/images/ux/design-tree-icon-leaf.png"
                    });

                    var j5resultsNode = deprojectnode.appendChild({
                        text: "J5 Reports",
                        leaf: true,
                        id: deproject.data.id,
                        hrefTarget: 'j5reports',
                        icon: "resources/images/ux/j5-tree-icon-parent"
                    });
                });
            }});

            projectNode.appendChild({
                text: 'Add design',
                leaf: true,
                hrefTarget: 'newde',
                icon: 'resources/images/add.png',
                id: 0
            });
        });

        Ext.getCmp('designGrid_Panel').reconfigure(lastDEProjects);

        this.renderPartsPanel(cb);
    },

    renderPartsPanel: function(cb){
        var self = this;
        self.partsStore = Ext.create('Ext.data.Store',{model: 'Teselagen.models.Part'});
        var rootNode = Ext.getCmp('projectPartsPanel').getRootNode();
        rootNode.removeAll();

        rootNode.appendChild({
            text: 'Add Part',
            leaf: true,
            hrefTarget: 'addpart',
            icon: 'resources/images/add.png',
            id: 0
        });
        
        var projects = Teselagen.manager.ProjectManager.projects;
        projects.each(function(project) {
            var veprojects = project.veprojects();
            veprojects.load({callback: function(){
                veprojects.each(function(veproject){
                    var parts = veproject.parts();
                    parts.load({
                        callback: function(){
                            parts.each(function(part){
                                self.partsStore.add(part);
                                rootNode.appendChild({
                                    text: part.data.name,
                                    leaf: true,
                                    id: part.data.id,
                                    hrefTarget: 'openpart',
                                    icon: "resources/images/ux/design-tree-icon-leaf.png"
                                });
                            });
                        }
                    });
                });
            }});
            
        });

        if(typeof(cb) == "function") cb();
    },

    resolveAndOpenDEProject: function(record){
        var deproject_id = record.data.id;
        var project_id = record.parentNode.data.id;
        var project = Teselagen.manager.ProjectManager.projects.getById(project_id);
        var deprojects = project.deprojects().load({
            callback : function(){
                var deproject = deprojects.getById(deproject_id);
                Teselagen.manager.ProjectManager.openDEProject(deproject);
            }
        });

    },

    resolveAndOpenj5Report: function(record){
        var deproject_id = record.parentNode.parentNode.data.id;
        var project_id = record.parentNode.parentNode.parentNode.data.id;
        var project = Teselagen.manager.ProjectManager.projects.getById(project_id);
        var deprojects = project.deprojects().load({
            callback : function(){
                var deproject = deprojects.getById(deproject_id);
                Teselagen.manager.ProjectManager.openj5Report(deproject);
            }
        });
    },

    resolveAndOpenj5Reports: function(record){
        var deproject_id = record.parentNode.data.id;
        var project_id = record.parentNode.parentNode.data.id;
        var project = Teselagen.manager.ProjectManager.projects.getById(project_id);
        var deprojects = project.deprojects().load({
            callback : function(){
                var deproject = deprojects.getById(deproject_id);
                Teselagen.manager.ProjectManager.openj5Report(deproject,record);
            }
        });
    },

    resolveAndCreateDEProject: function(record){
        var project_id = record.parentNode.data.id;
        var project = Teselagen.manager.ProjectManager.projects.getById(project_id);
        Teselagen.manager.ProjectManager.createNewDEProjectAtProject(project);
    },

    createProject: function(record){
        Teselagen.manager.ProjectManager.createNewProject();
    },

    addPart: function(){
        var self = this;
        var projects = Teselagen.manager.ProjectManager.projects;
        selectedproject = projects.last();
        if(selectedproject)
        {

            var newSequenceFile = Ext.create("Teselagen.models.SequenceFile", {
                sequenceFileFormat: "Genbank",
                sequenceFileContent: "LOCUS       NO_NAME                  1 bp    DNA     circular     03-DEC-2012\nFEATURES             Location/Qualifiers\n\nORIGIN      \n        1 g     \n\n//",
                sequenceFileName: "untitled.gb",
                partSource: "New Part"
            });
     
            var newPart = Ext.create("Teselagen.models.Part", {
                name: "Untitled Part",
                genbankStartBP: 1,
                endBP: 7
            });


            var newVEProject = Ext.create("Teselagen.models.VectorEditorProject", {
                name: "Untitled VEProject"
            });

            selectedproject.veprojects().add(newVEProject);
            newVEProject.save({callback:function(){
                newSequenceFile.save({
                    callback: function(){
                        newPart.setSequenceFileModel(newSequenceFile);
                        newPart.set('veproject_id',newVEProject.data.id);
                        newPart.save({callback: function(){
                            newVEProject.parts().add(newPart);
                            newVEProject.save({callback:function(){
                                self.renderPartsPanel();
                                var activeTab = Ext.getCmp('mainAppPanel').getActiveTab();
                                Vede.application.fireEvent("VectorEditorEditingMode",newPart,activeTab);
                            }});
                        }});
                    }
                });
            }});
        }
        else this.createProject();
    },

    resolveAndOpenPart: function(record){
        var part_id = record.data.id;
        var selectedPart = this.partsStore.getById(part_id);
        var activeTab = Ext.getCmp('mainAppPanel').getActiveTab();
        Vede.application.fireEvent("VectorEditorEditingMode",selectedPart,activeTab);
    },

    expandProject: function(record){
        if(record.isExpanded()) record.collapse();
        else record.expand();
    },

    onProjectPanelItemClick: function (store, record) {
        switch(record.data.hrefTarget)
        {
            case 'openproj':
                this.expandProject(record);
                break;
            case 'newproj':
                this.createProject(record);
                break;
            case 'newde':
                this.resolveAndCreateDEProject(record);
                break;
            case 'opende':
                this.resolveAndOpenDEProject(record);
                break;
            case 'j5report':
                this.resolveAndOpenj5Report(record);
                break;
            case 'j5reports':
                this.resolveAndOpenj5Reports(record);
                break;
        }
    },

    onProjectPartsPanelItemClick: function (store, record) {
        switch(record.data.hrefTarget)
        {
            case 'addpart':
                this.addPart(record);
                break;
            case 'openpart':
                this.resolveAndOpenPart(record);
                break;
        }
    },

    onNewProjectClick: function(){
        Teselagen.manager.ProjectManager.createNewProject();
    },

    onNewDEClick: function(){
        if(!Teselagen.manager.ProjectManager.workingProject) return Ext.MessageBox.alert('Alert', 'First select or create a Project.');
        Teselagen.manager.ProjectManager.createNewDeviceEditorProject();
    },

    onOpenSequenceFileClick: function(){
        Teselagen.manager.ProjectManager.openSequenceFile();
    },
    onRemoveProjectClick:function(){
        
    },

    init: function() {
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
