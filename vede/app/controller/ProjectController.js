Ext.define("Vede.controller.ProjectController", {
    extend: "Ext.app.Controller",
    requires: ["Teselagen.event.ProjectEvent", "Teselagen.manager.ProjectManager","Teselagen.models.DeviceEditorProject"],

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
                    /*
                    var j5runs = deproject.j5runs();
                    j5runs.load({callback: function(){
                        deproject.j5runs().each(function(j5run){
                            var j5resultNode = j5resultsNode.appendChild({
                                text: j5run.data.date,
                                leaf: true,
                                id: deproject.data.id,
                                hrefTarget: 'j5report'
                            });
                        });

                    }});
                    */
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
        //if(typeof(cb) == "function") cb();
    },

    renderPartsPanel: function(cb){
        var rootNode = Ext.getCmp('projectPartsPanel').getRootNode();
        rootNode.removeAll();

        rootNode.appendChild({
            text: 'Add project',
            leaf: true,
            hrefTarget: 'newproj',
            icon: 'resources/images/add.png',
            id: 0
        });
        
        var projects = Teselagen.manager.ProjectManager.projects;
        projects.each(function(project) {
            var projectNode = rootNode.appendChild({
                text: project.data.name,
                id: project.data.id,
                hrefTarget: 'openproj'
            });

            var veprojects = project.veprojects();
            veprojects.load({callback: function(){
                veprojects.each(function(deproject){
                    var veprojectnode = projectNode.appendChild({
                        text: veproject.data.name,
                        leaf: false,
                        id: veproject.data.id,
                        hrefTarget: 'openve',
                        icon: "resources/images/ux/design-tree-icon-leaf.png"
                    });

                });
            }});

            projectNode.appendChild({
                text: 'Add part',
                leaf: true,
                hrefTarget: 'newve',
                icon: 'resources/images/add.png',
                id: 0
            });
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

    createVEProject: function(){
        var veproject = Ext.create("Teselagen.models.VectorEditorProject", {
            name: "Untitled Project"
        });
        var projects = Teselagen.manager.ProjectManager.projects;
        projects.deprojects().add(veproject);

        veproject.save({
            callback: function(){
                Ext.getCmp('mainAppPanel').setActiveTab(1);
                Vede.application.fireEvent("ImportSequenceToProject",veproject);
            }
        });
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
            case 'newve':
                this.createVEProject(record);
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
            '#projectDesignPanel': {
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
