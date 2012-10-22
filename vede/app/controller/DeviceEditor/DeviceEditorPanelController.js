Ext.define('Vede.controller.DeviceEditor.DeviceEditorPanelController', {
    extend: 'Ext.app.Controller',
    requires: ["Ext.draw.*"],

    openProject: function(project) {
        Ext.getCmp('tabpanel').getActiveTab().model = project;
    },

    init: function () {
        this.callParent();
        this.application.on(Teselagen.event.ProjectEvent.OPEN_PROJECT,
                            this.openProject, this);

        this.control({
        });
    }
});
