/**
 * Authentication window controller
 * @class Vede.controller.AuthWindowController
 */
Ext.define('Vede.controller.AuthWindowController', {
    extend: 'Ext.app.Controller',
    require: ["Teselagen.event.AuthenticationEvent", "Teselagen.manager.AuthenticationManager"],

    rememberSession: false,

    onRegisterClick: function(){
        Ext.create('Vede.view.RegisterWindow').show();
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

        Teselagen.manager.AuthenticationManager.sendAuthRequest(params,null,this.rememberSession);
    },
    onNoSessionClick: function (button, e, options) {
        console.log('no auth');
        Vede.application.fireEvent(Teselagen.event.AuthenticationEvent.LOGGED_IN);
        Ext.getCmp('AuthWindow').destroy();
    },
    onLogoutClick: function (button, e, options) {

        var onLoggedOut = function(){

            if(Teselagen.manager.TasksMonitor && Teselagen.manager.TasksMonitor.socket)
            {
                Teselagen.manager.TasksMonitor.socket.disconnect()
                Teselagen.manager.TasksMonitor.socket = null;
            }
            Teselagen.manager.ProjectManager.currentUser = null;
            Ext.getCmp("mainAppPanel").items.items.map(function(tab){
                if(tab.xtype!="DashboardPanelView") return tab;
            }).forEach(function(tab){
                if(tab) tab.close();
            });

            Teselagen.manager.SessionManager.maskApp();
            Ext.create("Vede.view.AuthWindow").show();

        };

        var self = this;
        Ext.Ajax.request({
            url: Teselagen.manager.SessionManager.buildUrl("logout", ""),
            method: 'POST',
            success: function (response) {
                onLoggedOut();
            }
        });
    },

    onReconnectClick: function(){
        Teselagen.manager.AuthenticationManager.Login();
    },

    onForgotClick: function(){
        Ext.create('Vede.view.ForgotWindow').show();
    },

    onRequestError: function(connection, response, options, eOpts) {
        // If the Auth Window is not currently open, open it.
        if(response.status === 401 && !Ext.getCmp("AuthWindow")) {
            Ext.Msg.alert("Please Log In Again", "You have been logged out due to inactivity. Please re-enter your credentials.", function() {
                Ext.create("Vede.view.AuthWindow").show();
            });

            return false;
        }
    },

    //onRemember: function(el, newValue, oldValue, eOpts){
    //    if(newValue) 
    //    {
    //        this.rememberSession = true;
    //        // Remember case         
    //    }
    //},

    init: function () {
        var that = this;

        Ext.Ajax.on('requestexception', this.onRequestError, this);

        this.control({
            "#headerPanel": {
                afterrender: this.onRender
            },
            "#auth-login-btn": {
                click: this.onAuthLoginClick
            },
            // "#auth-register-btn": {
            //     click: this.onRegisterClick
            // },
             "#auth-forgot-btn": {
                 click: this.onForgotClick
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
                    if(e.getKey() === e.ENTER) {
                        that.onAuthLoginClick();
                    }
                }
            },
            "#auth-password-field": {
                specialkey: function (field, e) {
                    if(e.getKey() == e.ENTER) {
                        that.onAuthLoginClick();
                    } /*else if(e.getKey() === e.BACKSPACE) {
                        // Custom backspace functionality because Nick is stupid. //Ext is FUBAR.
                        var val = field.getValue();

                        if(val.length > 1) {
                            field.setValue(val.substr(0, val.length - 1));
                        } else {
                            field.setValue('');
                        }
                    }*/
                }
            },
            "#auth-config-btn": {
                click: this.onConfigClick
            }
        });
    },

    onRender: function() {
        Ext.get("auth-reconnect-btn").on('click', this.onReconnectClick);

        Ext.get("auth-logout-btn").on('click', this.onLogoutClick);
    }
});
