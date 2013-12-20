/**
 * Authentication window
 * @class Vede.view.AuthWindow
 */
Ext.define('Vede.view.AuthWindow', {
    extend: 'Ext.window.Window',
    requires: ['Teselagen.manager.SessionManager'],
    id: 'AuthWindow',
    floating: true,
    modal: true,
    frame: false,
    style: 'z-index:8000',
    layout: {
        type: 'vbox',
        align: 'center'
    },
    bodyBorder: false,
    closable: false,
    title: 'Authentication',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                xtype: 'panel',
                id: 'browser-warning',
                html: 'Warning: TeselaGen Beta works best in a Google Chrome Browser.',
                height: 40,
                padding: 10,
                width: 800,
                margin: 10,
                hidden: true
                },
                {
                xtype: 'form',
                id: 'auth-form',
                height: 280,
                width: 800,
                layout: {
                    align: 'stretch',
                    type: 'hbox'
                },
                items: [{
                    xtype: 'panel',
                    height: 275,
                    width: 400,
                    items: [{
                        xtype: 'fieldset',
                        margin: '60 10 10 10',
                        items: [{
                            xtype: 'textfield',
                            anchor: '100%',
                            fieldLabel: 'Username',
                            name: 'username',
                            id: 'auth-username-field',
                            width: 300
                        }, {
                            xtype: 'textfield',
                            inputType: 'password',
                            anchor: '100%',
                            fieldLabel: 'Password',
                            name: 'password',
                            id: 'auth-password-field',
                            width: 300
                        }]
                    }, {
                        xtype: 'button',
                        id: 'auth-login-btn',
                        margin: '0 0 0 15',
                        text: 'Login',
                        padding: 3,
                        name: 'login'
                    }, {
                        xtype: 'button',
                        id: 'auth-register-btn',
                        margin: '0 0 0 15',
                        href: "http://beta.teselagen.com/signup",
                        padding: 3,
                        text: 'Register',
                        name: 'register'
                    }, {
                        xtype: 'button',
                        id: 'auth-forgot-btn',
                        margin: '0 0 0 15',
                        padding: 3,
                        text: 'Forgot your password?',
                        name: 'forgot'
                    },/* {
                        xtype: 'button',
                        id: 'auth-config-btn',
                        margin: '0 0 0 15',
                        padding: 3,
                        text: 'Config',
                        name: 'Config'
                    },

                    {
                        xtype: 'fieldset',
                        hidden: true,
                        id: 'auth-config',
                        margin: 10,
                        width: 370,
                        items: [{
                            xtype: 'combobox',
                            anchor: '100%',
                            id: 'select-server-combo',
                            width: 300,
                            value: 'http://app.teselagen.com/api/',
                            fieldLabel: 'Server to connect:',
                            name: 'server',
                            store: ['http://app.teselagen.com/api/',
                                'http://teselagen.local/api/',
                                'http://dev.teselagen.com/api/'
                            ],
                            listeners: {
                                change: function(combobox, newValue) {
                                    Teselagen.manager.SessionManager.baseURL = combobox.getValue();
                                },
                                render: function(combobox){
                                    if(Vede.application.paramsHost) 
                                    {
                                        combobox.setValue(Vede.application.paramsHost);
                                        Teselagen.manager.SessionManager.baseURL = combobox.getValue();
                                    }
                                }
                            }
                        }
                        */
                        //{
                        //    xtype: 'fieldcontainer',
                        //    fieldLabel: 'Keep me signed in',
                        //    defaultType: 'checkboxfield',
                        //    items: [{
                        //        name: 'remember',
                        //        inputValue: '1',
                        //        id: 'rememberSession'
                        //    }]
                        //}

                        //]
                    //},
                    {
                        xtype: 'displayfield',
                        id: 'auth-response',
                        border: 0,
                        width: 350,
                        margin: '0 0 0 20'
                    }

                    ]
                }, {
                    xtype: 'panel',
                    flex: 1,
                    listeners: {
                        render: function() {
                            var field = this;

                            Ext.Ajax.request({
                                url: Teselagen.manager.SessionManager.buildUrl('v', ''),
                                method: 'GET',
                                success: function(response) {
                                    var regex = /(\w+ \w+ \d+ \d+ .+) GMT[\-+]\d+ \((\w+)\)/g;
                                    var match = regex.exec(response.responseText);
                                    var lastBuildText = '';

                                    if(match && match[1]) {
                                        lastBuildText = 'Last Build: ' + match[1];
                                    }

                                    if(lastBuildText && match[2]) {
                                        lastBuildText += ' ' + match[2];
                                    }

                                    field.update(
                                        '<div style="padding:10px">' +
                                            '<div class="welcome_sub">' +
                                                'Welcome to Teselagen BioCAD.' +
                                            '</div>' +
                                            '<p>Please login using your credentials</p>' +
                                            '<p>For questions visit <a href="http://teselagen.com">Our Website</a>' +
                                            '</p>' +
                                            '<small>' + lastBuildText + '</small>' +
                                        '</div>' +
                                        '<div class="auth-footer" style="margin-top: 110px;">' +
                                            '<ul style="list-style:none; display="inline-block">' +
                                                '<li style="float:left; margin-right: 5px;">' +
                                                    '<a href="http://teselagen.com">Home</a>' +
                                                '</li>' +
                                                '<li style="float:left; margin-right: 5px;">' +
                                                    '<a href="http://teselagen.com/about">About</a>' +
                                                '</li>' +
                                                '<li style="float:left; margin-right: 5px;">' +
                                                    '<a href="http://teselagen.com/faq">FAQ</a></li>' +
                                                '<li style="float:left; margin-right: 5px;">' +
                                                    '<a href="http://teselagen.com/contact">Contact</a>' +
                                                '</li>' +
                                                '<li style="float:left; margin-right: 5px;">' +
                                                    '<a href="http://help.teselagen.com/manual/">Manual</a>' +
                                                '</li>' +
                                                '<li style="float:left; margin-right: 5px;">' +
                                                    '<a href="http://teselagen.com/terms">Terms</a>' +
                                                '</li>' +
                                                '<li style="float:left; margin-right: 5px;">' +
                                                    '<a href="http://teselagen.com/privacy">Privacy</a>' +
                                                '</li>' +
                                            '</ul>' +
                                        '</div>');
                                }
                            });
                        }
                    }
                }]
            }]
        });

        me.callParent(arguments);
    }
});


/*
                , {
                    xtype: 'button',
                    id: 'auth-nosession-btn',
                    margin: '0 10',
                    text: 'No session (Dev)',
                    style: {
                        background: 'yellow;'
                    }
                }
                */
