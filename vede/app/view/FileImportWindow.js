Ext.define('Vede.view.FileImportWindow', {
    extend: 'Ext.window.Window',

    height: 110,
    width: 400,
    layout: {
        type: 'anchor'
    },
    title: 'Import File',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'form',
                    bodyPadding: 10,
                    items: [
                        {
                            xtype: 'filefield',
                            name: 'importedFile',
                            allowBlank: false,
                            anchor: '100%'
                        },
                        {
                            xtype: 'toolbar',
                            ui: 'footer',
                            items: [
                                {
                                    xtype: 'button',
                                    text: 'Import',
                                    cls: 'ImportSequence',
                                    formBind: true
                                },
                                {
                                    xtype: 'button',
                                    text: 'Cancel'
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }

});