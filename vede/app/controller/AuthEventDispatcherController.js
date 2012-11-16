Ext.define('Vede.controller.AuthEventDispatcherController', {
    extend: 'Ext.app.Controller',
    requires: ["Teselagen.event.AuthenticationEvent", "Teselagen.manager.AuthenticationManager"],

    dispatchLoggedInEvent: function() {
    	//console.log('Dispaching logged in');
    	Ext.getCmp("projectDesignPanel").store.load();   
    },

    init: function() {
        //console.log('Auth Events Dispatcher initialized.');
        this.application.on(Teselagen.event.AuthenticationEvent.LOGGED_IN,this.dispatchLoggedInEvent, this);
    }

});
