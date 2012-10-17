Ext.define('Vede.controller.DeviceEditor.DeviceEditorPanelController', {
    extend: 'Ext.app.Controller',

    onLaunch: function() {

    },
    init: function () {
        this.callParent();
        //this.application.on(Teselagen.event.ProjectEvent.OPEN_PROJECT,this.openProject, this);

        //console.log(Ext.getCmp('tabpanel').getActiveTab().query('textfield[cls=partNameField]'));
        
        this.control({
            'textfield[cls="partNameField"]': {
            	keydown: function(field, e){
            		console.log(e);
                            if(e.getKey() == e.ENTER){
                                e.stopEvent();
                                console.log('Enter pressed');
                            }
                },
                focus: function( ) { 
                	var currentModel = Ext.getCmp('tabpanel').getActiveTab().model;
                	console.log(currentModel);
                }
        }            
        });
        
    }

});
