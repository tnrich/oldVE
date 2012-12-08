Ext.define('Vede.controller.AuthWindowController', {
    extend: 'Ext.app.Controller',
    require: ["Teselagen.event.AuthenticationEvent", "Teselagen.manager.AuthenticationManager"],

    onAuthLoginClick: function (button, e, options) {
        var form = Ext.getCmp('auth-form').getForm();
        var params = {};
        params.username = form.findField('username').getRawValue();
        params.password = form.findField('password').getRawValue();
        if(form.findField('server')) params.server = form.findField('server').getRawValue();

        Teselagen.manager.AuthenticationManager.sendAuthRequest(params);
    },
    onNoSessionClick: function (button, e, options) {
        console.log('no auth');
        Vede.application.fireEvent(Teselagen.event.AuthenticationEvent.LOGGED_IN);
        Ext.getCmp('AuthWindow').destroy();
    },
    onLogoutClick: function (button, e, options) {
        var self = this;
        Ext.Ajax.request({
            url: '/api/logout',
            method: 'POST',
            success: function (response) {
                Ext.getBody().mask();
                self.window.close();
            }
        });

    },
    init: function () {
        var that = this;
        this.control({
            "#auth-login-btn": {
                click: this.onAuthLoginClick
            },
            "#auth-logout-btn": {
                click: this.onLogoutClick
            },
            "#auth-nosession-btn": {
                click: this.onNoSessionClick
            },
            "#auth-username-field": {
                specialkey: function (field, e) {
                    if(e.getKey() == e.ENTER) that.onAuthLoginClick();
                }
            },
            "#auth-password-field": {
                specialkey: function (field, e) {
                    if(e.getKey() == e.ENTER) that.onAuthLoginClick();
                }
            }
        });
    }

});