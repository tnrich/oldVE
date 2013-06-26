/**
 * Authentication window
 * @class Vede.view.AuthWindow
 */
Ext.define('Vede.view.AuthWindow', {
	extend: 'Ext.window.Window',
	id: 'AuthWindow',
	floating: true,
	frame: false,
	style: 'z-index:8000',
	bodyBorder: false,
	closable: false,
	title: 'Authentication',
	x: 80,
	y: 30,

	initComponent: function() {
		var me = this;

		Ext.applyIf(me, {
			items: [{
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
							readOnly: false,
							width: 300
						}]
					}, {
						xtype: 'button',
						id: 'auth-login-btn',
						margin: '0 0 0 15',
						text: 'Login',
						name: 'login'
					}, {
						xtype: 'button',
						id: 'auth-register-btn',
						margin: '0 0 0 15',
						text: 'Register',
						name: 'register'
					}, {
						xtype: 'button',
						id: 'auth-config-btn',
						margin: '0 0 0 15',
						text: 'Config',
						name: 'Config'
					}, {
						xtype: 'fieldset',
						hidden: true,
						id: 'auth-config',
						margin: 10,
						width: 400,
						items: [{
							xtype: 'combobox',
							anchor: '100%',
							id: 'select-server-combo',
							width: 300,
							value: 'http://teselagen.local/api/',
							fieldLabel: 'Server to connect:',
							name: 'server',
							store: [
								['Local', 'http://teselagen.local/api/'],
								['Dev', 'http://dev.teselagen.com/api/']
							]
						}, {
							xtype: 'fieldcontainer',
							fieldLabel: 'Keep me signed in',
							defaultType: 'checkboxfield',
							items: [{
								name: 'remember',
								inputValue: '1',
								id: 'checkbox1'
							}]
						}]
					},
					{
						xtype: 'container',
						id: 'auth-response',
						border: 0,
						width: 350
					}

					]
				}, {
					xtype: 'panel',
					flex: 1,
					html: '<div style="padding:10px"><div class="welcome_sub">Welcome to Teselagen BioCAD.</div><p>Please login using your credentials</p><p>For questions visit:<a href="http://teselagen.com">Teselagen Biotechnologies website</a></p></div>',
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