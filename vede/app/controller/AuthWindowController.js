/**
 * Authentication window controller
 * @class Vede.controller.AuthWindowController
 */
Ext.define('Vede.controller.AuthWindowController', {
    extend: 'Ext.app.Controller',
    require: ["Teselagen.event.AuthenticationEvent", "Teselagen.manager.AuthenticationManager"],

    onRegisterClick: function(){
        console.log("Register");  
    },

    onConfigClick: function(){
        Ext.get('auth-config').show();
    },

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
        
        Ext.util.Cookies.clear('session');
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

    onReconnectClick: function(){
        Teselagen.manager.AuthenticationManager.Login();
    },

    onRemember: function(el, newValue, oldValue, eOpts){
        if(newValue) 
        {
            // Remember case
            //Ext.util.Cookies.set( name, value, [expires], [path], [domain], [secure] )
            //var date = new Date();
            //date.setTime(date.getTime()+(30*1000));
            
            var sampleSession = JSON.parse('{"username":"eabeliuk","sessionId":"ccbd7666da980471870af9a232e9a6c5","userId":"3"}');
            console.warn("Setting test sampleSession");
            Ext.util.Cookies.set( "session", JSON.stringify(sampleSession) );            
        }
        else
        {
            // Not remember case
            Ext.util.Cookies.clear('session');
        }
    },

    init: function () {
        var that = this;
        this.control({
            "#headerPanel": {
                afterrender: this.onRender
            },
            "#auth-login-btn": {
                click: this.onAuthLoginClick
            },
            "#auth-register-btn": {
                click: this.onRegisterClick
            },
            "#auth-logout-btn": {
                click: this.onLogoutClick
            },
            "#auth-reconnect-btn": {
                click: this.onReconnectClick
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
            },
            "#auth-config-btn": {
                click: this.onConfigClick
            },
            "#rememberSession": {
                change: this.onRemember
            }
        });
    },

    onRender: function() {
        Ext.get("auth-reconnect-btn").on('click', this.onReconnectClick);

        Ext.get("auth-logout-btn").on('click', this.onLogoutClick);
    }



});