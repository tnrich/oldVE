/**
 * Window for registering new users.
 * @class Vede.view.RegisterWindow
 */
Ext.define('Vede.view.RegisterWindow', {
    extend: 'Ext.window.Window',
    requires: ['Teselagen.manager.AuthenticationManager','Teselagen.manager.SessionManager'],
    id: 'RegisterWindow',
    floating: true,
    closable: true,
    modal: true,
    title: 'Enter Your Credentials',

    items: [{
        xtype: 'form',
        url: Teselagen.manager.SessionManager.buildUrl("register", ""),
        id: 'registerForm',
        bodyStyle: 'background: none; border: 0 none;',
        padding: 10,
        items: [{
            xtype: 'textfield',
            id: 'registerFirstNameField',
            fieldLabel: 'First Name',
            name: 'firstName',
            allowBlank: false
        }, {
            xtype: 'textfield',
            id: 'registerLastNameField',
            fieldLabel: 'Last Name',
            name: 'lastName',
            allowBlank: false
        }, {
            xtype: 'combobox',
            id: 'registerOrganizationTypeComboBox',
            fieldLabel: 'Type Of Organization',
            allowBlank: false,
            forceSelection: true,
            name: 'orgType',
            store: ['Red Biotech', 'White Biotech', 'Green Biotech', 'Academic Lab', 'Gene Hacker', 'Other']
        }, {
            xtype: 'textfield',
            id: 'registerUsernameField',
            fieldLabel: 'Username',
            name: 'username',
            allowBlank: false
        }, {
            xtype: 'textfield',
            id: 'registerPasswordField',
            fieldLabel: 'Password',
            inputType: 'password',
            name: 'password',
            allowBlank: false
        }, {
            xtype: 'textfield',
            id: 'registerConfirmPasswordField',
            fieldLabel: 'Retype Password',
            inputType: 'password',
            allowBlank: false,
            validator: function(value) {
                return value === this.prev('#registerPasswordField').getValue();
            }
        }, {
            xtype: 'textfield',
            id: 'registerEmailField',
            fieldLabel: 'Email',
            allowBlank: false,
            name: 'email',
            vtype: 'email'
        }, {
            xtype: 'textfield',
            id: 'invitationCodeField',
            fieldLabel: 'Invitation Code',
            allowBlank: false,
            name: 'invitationCode',
        }],
        buttons: [{
            text: 'Submit',
            formBind: true,
            disabled: true,
            handler: function() {
                var form = this.up('form').getForm();
                var window = this.up('window');

                if(form.isValid()) {
                    form.submit({
                        success: function(form, action) {
                            window.close();
                            Teselagen.manager.AuthenticationManager.continueLogin(action.response);  
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
                this.up('#RegisterWindow').close();
            }
        }]
    }]
});
