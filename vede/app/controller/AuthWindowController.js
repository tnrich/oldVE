Ext.define('Vede.controller.AuthWindowController', {
    extend: 'Ext.app.Controller',
    require: ["Teselagen.event.AuthenticationEvent", "Teselagen.manager.AuthenticationManager"],

    onAuthLoginClick: function(button, e, options) {
        var authenticationManager = Ext.get("Teselagen.manager.AuthenticationManager");

		var form = Ext.getCmp('auth-form').getForm();
		var username = form.findField('username').getRawValue();
		var password = form.findField('password').getRawValue();
		var server = form.findField('server').getRawValue();

        Vede.application.authenticationManager.manualAuth(username,password,server);
    },
    onAuthGuestClick: function(button, e, options) {
        var authenticationManager = Ext.get("Teselagen.manager.AuthenticationManager");
		var form = Ext.getCmp('auth-form').getForm();
		var server = form.findField('server').getRawValue();
        Vede.application.authenticationManager.guestAuth(server);
    },
    onNoSessionClick: function(button, e, options) {
    	console.log('no auth');
        Vede.application.fireEvent(Teselagen.event.AuthenticationEvent.LOGGED_IN);
        Ext.getCmp('AuthWindow').destroy();
    },
    init: function() {
        var that = this;
        this.control({
            "#auth-login-btn": {
                click: this.onAuthLoginClick
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
