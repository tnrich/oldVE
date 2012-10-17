Ext.define("Vede.controller.ProjectController", {
    extend: "Ext.app.Controller",
    requires: ["Teselagen.event.ProjectEvent", "Teselagen.manager.ProjectManager"],

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
    renderPartsSection: function(project){
        Ext.getCmp('projectPartsPanel').getRootNode().removeAll();

        var parts = project.parts();
        parts.load({
            callback: function() {
            parts.each(function(part){
                Ext.getCmp('projectPartsPanel').getRootNode().appendChild({
                    text: part.data.name,
                    leaf: true,
                    id: part.data.id
                });
            });
        }});

    },
    renderJ5ResultsSection: function(designs){
        Ext.getCmp('projectAnalysisPanel').getRootNode().removeAll();

        designs.each(function(design){
            var designNode = Ext.getCmp('projectAnalysisPanel').getRootNode().appendChild({
                text: design.data.name,
                leaf: false,
                expanded: true
            });

            design.runs().each(function (run) {
                designNode.appendChild({
                    text: run.data.name,
                    leaf: true,
                    id: run.data.id
                });
            });
        });
    },
    init: function () {
        this.application.on(Teselagen.event.ProjectEvent.OPEN_PROJECT,this.openProject, this);
    }
});