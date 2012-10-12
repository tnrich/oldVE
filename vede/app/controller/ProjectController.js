Ext.define("Vede.controller.ProjectController", {
    extend: "Ext.app.Controller",
    requires: ["Teselagen.event.ProjectEvent", "Teselagen.manager.ProjectManager"],

    openProject: function (project) {
        Vede.application.projectManager.openProject(project);
    },
    renderDesigns: function (designs) {
        console.log(designs.getModifiedRecords());
        Ext.getCmp('projectDesignPanel').getRootNode().removeAll();
        designs.data.items.forEach(function (rec) {
            Ext.getCmp('projectDesignPanel').getRootNode().appendChild({
                text: rec.data.DesignName,
                leaf: true,
                id: rec.data.id
            });
        });

        Ext.getCmp('projectDesignPanel').setLoading(false);

    },
    init: function () {
        this.application.on(Teselagen.event.ProjectEvent.OPEN_PROJECT,this.openProject, this);
    }
});