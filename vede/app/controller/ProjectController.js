Ext.define("Vede.controller.ProjectController", {
    extend: "Ext.app.Controller",
    requires: ["Teselagen.event.ProjectEvent", "Teselagen.manager.ProjectManager","Teselagen.models.DeviceEditorProject"],

    openProject: function (project) {
        Teselagen.manager.ProjectManager.openProject(project);
    },
    renderTree: function (deprojects) {

        Ext.getCmp('projectDesignPanel').getRootNode().removeAll();

        deprojects.each(function (deproject) {
            var designNode = Ext.getCmp('projectDesignPanel').getRootNode().appendChild({
                text: deproject.data.name,
                leaf: true,
                id: deproject.data.id
            });

            console.log(deproject.j5runs());

            deproject.j5runs().each(function (run) {
                designNode.appendChild({
                    text: run.data.name,
                    leaf: true,
                    id: run.data.id
                });
            });

        });

        Ext.getCmp('projectDesignPanel').getRootNode().appendChild({
            text: 'Add design',
            leaf: true,
            icon: 'resources/images/add.png',
            id: 0
        });

        Ext.getCmp('designGrid_Panel').reconfigure(deprojects);

        Ext.getCmp('projectDesignPanel').setLoading(false);
    },

    onProjectDesignPanelItemClick: function (store, record) { 
        if(record.data.id!=0) Teselagen.manager.ProjectManager.openDesign(record); 
        else Teselagen.manager.ProjectManager.createNewDeviceEditorProject();
    },

    onProjectPartsPanelItemClick: function (store, record) { 
        Teselagen.manager.ProjectManager.openVEProject(record); 
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
        this.application.on(Teselagen.event.ProjectEvent.OPEN_PROJECT, 
                            this.openProject, this);

        this.control({
            '#projectPartsPanel': {
                itemclick: this.onProjectPartsPanelItemClick
            },
            '#projectDesignPanel': {
                itemclick: this.onProjectDesignPanelItemClick
            },
            '#designGrid_Panel': {
                itemclick: this.onProjectDesignPanelItemClick
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
