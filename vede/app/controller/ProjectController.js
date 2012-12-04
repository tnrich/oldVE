Ext.define("Vede.controller.ProjectController", {
    extend: "Ext.app.Controller",
    requires: ["Teselagen.event.ProjectEvent", "Teselagen.manager.ProjectManager","Teselagen.models.DeviceEditorProject"],

    openProject: function (project) {
        Teselagen.manager.ProjectManager.openProject(project);
    },
    renderTree: function (deprojects) {

        Ext.getCmp('projectDesignPanel').getRootNode().removeAll();

        deprojects.each(function (deproject) {

            var rootNode = Ext.getCmp('projectDesignPanel').getRootNode();

            var designNode = rootNode.appendChild({
                text: deproject.data.name,
                leaf: false,
                id: deproject.data.id,
                hrefTarget: 'opende',
                icon: "resources/images/ux/design-tree-icon-leaf.png",
                expanded: true
            });

            designNode.appendChild({
                text: "Design",
                leaf: true,
                id: deproject.data.id,
                hrefTarget: 'opende',
                icon: "resources/images/ux/design-tree-icon-leaf.png",
            });

            designNode.appendChild({
                text: "J5 Reports",
                leaf: true,
                id: deproject.data.id,
                hrefTarget: 'j5report',
                icon: "resources/images/ux/j5-tree-icon-parent"

            });

            designNode.appendChild({
                text: "List Parts",
                leaf: true,
                id: deproject.data.id,
                icon: "resources/images/ux/parts-tree-icon-parent"
            });

            /*
            deproject.j5runs().each(function (run) {
                designNode.appendChild({
                    text: run.data.name,
                    leaf: true,
                    id: run.data.id
                });
            });*/

        });

        Ext.getCmp('projectDesignPanel').getRootNode().appendChild({
            text: 'Add design',
            leaf: true,
            hrefTarget: 'newde',
            icon: 'resources/images/add.png',
            id: 0
        });

        Ext.getCmp('designGrid_Panel').reconfigure(deprojects);

        Ext.getCmp('projectDesignPanel').setLoading(false);
    },

    onProjectPanelItemClick: function (store, record) { 
        switch(record.data.hrefTarget)
        {
            case 'newde':
                Teselagen.manager.ProjectManager.createNewDeviceEditorProject();
                break;
            case 'opende':
                Teselagen.manager.ProjectManager.openDesign(record);
                break;
            case 'j5report':
                Teselagen.manager.ProjectManager.openj5Report(record);
                break;
        }
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
            '#projectDesignPanel': {
                itemclick: this.onProjectPanelItemClick
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
