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
				items: [{
					xtype: 'fieldset',
					margin: '10 10 10 10',
					items: [{
						xtype: 'textfield',
						anchor: '100%',
						width: '330px',
						fieldLabel: 'Username',
						name: 'username'
					}, {
						xtype: 'textfield',
						inputType: 'password',
						anchor: '100%',
						width: '330px',
						fieldLabel: 'Password',
						name: 'password'
					}]
				}, {
					xtype: 'fieldset',
					margin: 10,
					items: [{
						xtype: 'combobox',
						anchor: '100%',
						value: 'http://localhost:3000/',
						fieldLabel: 'Server',
						name: 'server',
						store: [
							['Local', 'http://localhost:3000/'],
							['Pushscience', 'http://rp.teselagen.com/api/']
						]
					}]
				},

				{
					xtype: 'checkboxfield',
					anchor: '100%',
					margin: 10,
					boxLabel: 'Remember',
					name: 'remember'
				}, {
					xtype: 'button',
					id: 'auth-login-btn',
					margin: '0 0 0 10',
					text: 'Login',
					name: 'login'
				}, {
					xtype: 'button',
					id: 'auth-guest-btn',
					margin: '0 10',
					text: 'Use Guest Account (Development)',
					style: {
						background: 'yellow;'
					}
				}]
			}]
		});

		me.callParent(arguments);
	}

});