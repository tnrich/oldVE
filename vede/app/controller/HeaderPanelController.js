Ext.define('Vede.controller.HeaderPanelController', {
    extend: 'Ext.app.Controller',
    requires: ["Teselagen.manager.ProjectManager","Teselagen.event.ProjectEvent"],
    ProjectManagerWindow : null,
    onProjectManagerBtnClick: function(button, e, options) {
    	console.log("HEY!");
        this.ProjectManagerWindow = Ext.create("Vede.view.ProjectManagerWindow").show();
        Ext.getCmp('projectGrid_Panel').reconfigure(Teselagen.manager.ProjectManager.currentUser.projects());
    },
    closeProjectManagerWindow : function(){
        this.ProjectManagerWindow.close();
    },

     init: function() {
     	this.control({
     		"#projectmanager_btn": {
     			click: this.onProjectManagerBtnClick
     		}
     	});

        this.application.on("openProjectManagerWindow",this.onProjectManagerBtnClick, this);
        this.application.on("closeProjectManagerWindow",this.closeProjectManagerWindow, this);
        this.application.on(Teselagen.event.ProjectEvent.OPEN_PROJECT,this.closeProjectManagerWindow, this);
    }
});
