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
                            value: 'http://lab001.teselagen.com:8090/printdna',
							store: [
								['http://lab001.teselagen.com:8090/printdna','Lab001 (San Francisco, CA)'],
								['http://localhost:8090/printdna','Lab000 (Local)'],
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