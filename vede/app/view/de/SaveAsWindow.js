Ext.define('Vede.view.de.SaveAsWindow', {
    extend: 'Ext.window.Window',
    cls: 'deviceEditorSaveAsWindow',
    title: 'Save As...',
    modal: true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    height: 100,
    width: 400,
    items: [
        {
            xtype: 'textfield',
            fieldLabel: 'Save As:',
            maxHeight: 30,
            cls: 'saveAsWindowDesignNameField',
            allowBlank: false
        }, {
            xtype: 'container',
            maxHeight: 40,
            layout: {
                pack: 'end',
                type: 'hbox'
            },
            items: [
                {
                    xtype: 'button',
                    margin: 10,
                    text: 'Cancel',
                    handler: function() {
                        this.up('window').close();
                    }
                }, {
                    xtype: 'tbseparator'
                }, {
                    xtype: 'button',
                    cls: 'saveDeviceAsWindowOKButton',
                    margin: 10,
                    text: 'Ok'
                }
            ]
        }
    ]
});
