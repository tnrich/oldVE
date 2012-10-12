Ext.define("Vede.controller.ProjectController", {
    extend: "Ext.app.Controller",
    requires: ["Teselagen.event.ProjectEvent", "Teselagen.manager.ProjectManager"],

    openProject: function (project) {
        Vede.application.projectManager.openProject(project);
    },
    renderProjectPaneSection: function (Collection,SectionPanelName) {
        Ext.getCmp(SectionPanelName).getRootNode().removeAll();
        Collection.data.items.forEach(function (rec) {
            Ext.getCmp(SectionPanelName).getRootNode().appendChild({
                text: rec.data.name,
                leaf: true,
                id: rec.data.id
            });
        });

        Ext.getCmp(SectionPanelName).setLoading(false);
    },
    init: function () {
        this.application.on(Teselagen.event.ProjectEvent.OPEN_PROJECT,this.openProject, this);
    }
});