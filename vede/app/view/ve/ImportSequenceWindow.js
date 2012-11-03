Ext.define('Vede.view.ve.ImportSequenceWindow', {
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
                            xtype: 'textfield',
                            name: 'Sequence name (optional)',
                            cls: 'sequenceName',
                            allowBlank: true,
                            anchor: '100%'
                        },
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
                                    cls: 'import',
                                    text: 'Import To Project',
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