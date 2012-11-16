Ext.define("Vede.controller.ProjectController", {
    extend: "Ext.app.Controller",
    requires: ["Teselagen.event.ProjectEvent", "Teselagen.manager.ProjectManager","Teselagen.models.DeviceEditorProject"],

    openProject: function (project) {
        Teselagen.manager.ProjectManager.openProject(project);
    },
    renderDesignsSection: function (Collection) {
        Ext.getCmp('projectDesignPanel').getRootNode().removeAll();
        Collection.data.items.forEach(function (rec) {
            Ext.getCmp('projectDesignPanel').getRootNode().appendChild({
                text: rec.data.name,
                leaf: true,
                id: rec.data.id
            });
        });

        Ext.getCmp('designGrid_Panel').reconfigure(Collection);

        Ext.getCmp('projectDesignPanel').setLoading(false);
    },
    renderPartsSection: function(veprojects){
        Ext.getCmp('projectPartsPanel').getRootNode().removeAll();

        veprojects.each(function(veproject){
            Ext.getCmp('projectPartsPanel').getRootNode().appendChild({
                text: veproject.data.name,
                leaf: true,
                id: veproject.data.id
            });
        });

    },
    renderJ5ResultsSection: function(deprojects){
        deprojects.each(function(deproject){
            var designNode = Ext.getCmp('j5ResultsPanel').getRootNode().appendChild({
                text: deproject.data.name,
                leaf: false,
                expanded: true
            });

            deproject.j5runs().each(function (run) {
                designNode.appendChild({
                    text: run.data.name,
                    leaf: true,
                    id: run.data.id
                });
            });
        });
        
    },

    onProjectDesignPanelItemClick: function (store, record) { 
        Teselagen.manager.ProjectManager.openDesign(record); 
    },

    onProjectPartsPanelItemClick: function (store, record) { 
        Teselagen.manager.ProjectManager.openVEProject(record); 
    },

    onNewProjectClick: function(){
        Teselagen.manager.ProjectManager.createNewProject();
    },

    onNewDEClick: function(){
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
