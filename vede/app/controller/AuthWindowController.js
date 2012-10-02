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
        Vede.application.authenticationManager.guestAuth();
    },
    init: function() {
        this.control({
            "#auth-login-btn": {
                click: this.onAuthLoginClick
            },
            "#auth-guest-btn": {
                click: this.onAuthGuestClick
            }
    	});
    }

});
