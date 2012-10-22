Ext.define("Vede.controller.ProjectController", {
    extend: "Ext.app.Controller",
    requires: ["Teselagen.event.ProjectEvent", "Teselagen.manager.ProjectManager","Teselagen.models.DeviceEditorProject"],

    openProject: function (project) {
        Vede.application.projectManager.openProject(project);
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
        Ext.getCmp('projectAnalysisPanel').getRootNode().removeAll();

        deprojects.each(function(deproject){
            var designNode = Ext.getCmp('projectAnalysisPanel').getRootNode().appendChild({
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
        Vede.application.projectManager.openDesign(record); 
    },

    init: function () {
        this.callParent();
        this.application.on(Teselagen.event.ProjectEvent.OPEN_PROJECT, 
                            this.openProject, this);

        this.control({
            '#projectDesignPanel': {
                itemclick: this.onProjectDesignPanelItemClick
            }
        });
    }
});
