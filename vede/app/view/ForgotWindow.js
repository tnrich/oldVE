/**
 * Window for registering new users.
 * @class Vede.view.ForgotWindow
 */
Ext.define('Vede.view.ForgotWindow', {
    extend: 'Ext.window.Window',
    requires: ['Teselagen.manager.AuthenticationManager','Teselagen.manager.SessionManager'],
    id: 'ForgotWindow',
    floating: true,
    closable: true,
    modal: true,
    title: 'Enter Your Email',

    items: [{
        xtype: 'form',
        url: Teselagen.manager.SessionManager.buildUrl("forgot", ""),
        id: 'forgotForm',
        bodyStyle: 'background: none; border: 0 none;',
        padding: 10,
        items: [{
            xtype: 'textfield',
            id: 'forgotEmailField',
            fieldLabel: 'Email',
            allowBlank: false,
            name: 'email',
            vtype: 'email'
        }],
        buttons: [{
            text: 'Reset password',
            formBind: true,
            disabled: true,
            handler: function() {
                var form = this.up('form').getForm();
                var window = this.up('window');

                if(form.isValid()) {
                    form.submit({
                        success: function(form, action) {
                            window.close();
                            Ext.Msg.alert('Success', "Please check your email.");
                        },
                        failure: function(form, action) {
                            if(action && action.result) {
                                Ext.Msg.alert('Error', action.result.msg);
                            } else {
                                Ext.Msg.alert('Error', "Request timed out.");
                            }
                        }
                    });
                }
            }
        }, {
            text: 'Cancel',
            handler: function() {
                this.up('#ForgotWindow').close();
            }
        }]
    }]
});
