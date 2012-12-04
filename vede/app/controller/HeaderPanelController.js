Ext.define('Vede.controller.HeaderPanelController', {
    extend: 'Ext.app.Controller',

    onProjectManagerBtnClick: function(button, e, options) {
    	console.log("HEY!");
        Ext.create("Vede.view.ProjectManagerWindow").show();
    },

     init: function() {
     	this.control({
     		"#projectmanager_btn": {
     			click: this.onProjectManagerBtnClick
     		}
     	});
    }
});
