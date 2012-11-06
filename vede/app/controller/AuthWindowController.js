Ext.define('Vede.controller.AuthWindowController', {
    extend: 'Ext.app.Controller',
    require: ["Teselagen.event.AuthenticationEvent", "Teselagen.manager.AuthenticationManager"],

    onAuthLoginClick: function(button, e, options) {
        var authenticationManager = Teselagen.manager.AuthenticationManager;

		var form = Ext.getCmp('auth-form').getForm();
		var username = form.findField('username').getRawValue();
		var password = form.findField('password').getRawValue();
		var server = form.findField('server').getRawValue();

        Vede.application.authenticationManager.manualAuth(username,password,server);
    },
    onAuthGuestClick: function(button, e, options) {
        var authenticationManager = Teselagen.manager.AuthenticationManager;
		var form = Ext.getCmp('auth-form').getForm();
		var server = form.findField('server').getRawValue();
        Vede.application.authenticationManager.guestAuth(server);
    },
    onNoSessionClick: function(button, e, options) {
    	console.log('no auth');
        Vede.application.fireEvent(Teselagen.event.AuthenticationEvent.LOGGED_IN);
        Ext.getCmp('AuthWindow').destroy();
    },
    onLogoutClick: function(button, e, options){
        Ext.getBody().mask();
        var win = Ext.create('widget.window', {
            title: 'Session closed',
            closable: false,
            draggable: false,
            width: 300,
            height: 100,
            layout: 'border',
            bodyStyle: 'padding: 5px;',
            items: [{
                xtype: 'panel',
                layout: 'fit',
            }],
            listeners: {
                afterrender: function(){
                    console.log('Logging out');
                },
            }
        });
        win.show();
    },
    init: function() {
        var that = this;
        this.control({
            "#auth-login-btn": {
                click: this.onAuthLoginClick
            },
            "#auth-logout-btn": {
                click: this.onLogoutClick
            },
            "#auth-guest-btn": {
                click: this.onAuthGuestClick
            },
            "#auth-nosession-btn": {
                click: this.onNoSessionClick
            },
            "#auth-username-field": { 
                specialkey: function(field, e) { 
                if(e.getKey() == e.ENTER) that.onAuthLoginClick();
                }
            },
            "#auth-password-field": { 
                specialkey: function(field, e) { 
                if(e.getKey() == e.ENTER) that.onAuthLoginClick();
                }
            }
    	});
    }

});
