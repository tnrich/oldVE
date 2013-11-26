Ext.define('Vede.view.j5Report.buildDNAPanel', {
    extend: 'Ext.window.Window',

    height: 133,
    width: 513,
    title: 'Build DNA',
    modal : true,

            items: [
                {
                    xtype: 'form',
                    bodyPadding: 10,
                    title: '',
                    items: [
                        {
                            xtype: 'combobox',
                            anchor: '100%',
                            fieldLabel: 'Select lab',
                            name: 'server',
                            value: '127.0.0.1',
							store: [
								['127.0.0.1','Lab001 (San Francisco, CA)'],
								['127.0.0.1','Lab000 (Local)']
							]
                        },
                        {
                            xtype: 'textfield',
                            anchor: '100%',
                            inputType: 'password',
                            fieldLabel: 'Password',
                            name: 'password'
                        },
                        {
                            xtype: 'button',
                            text: 'Start build process',
                            name: 'start'
                        }
                    ]
                }
            ]

});