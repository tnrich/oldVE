Ext.define('Vede.view.ve.ImportSequenceWindow', {
    extend: 'Ext.window.Window',

    height: 188,
    width: 400,
    layout: {
        type: 'anchor'
    },
    title: 'Import File',

    initComponent: function () {
        var me = this;


        Ext.applyIf(me, {
            items: [{
                xtype: 'form',
                height: 153,
                bodyPadding: 10,
                title: '',
                items: [{
                    xtype: 'filefield',
                    anchor: '100%',
                    name: 'importedFile',
                    fieldLabel: 'Local file path'
                }, {
                    xtype: 'fieldset',
                    title: 'Sequence details (optional)',
                    items: [{
                        xtype: 'textfield',
                        anchor: '100%',
                        fieldLabel: 'Name',
                        name: 'sequenceName',
                        cls: 'sequenceName'
                    }, {
                        xtype: 'textfield',
                        anchor: '100%',
                        fieldLabel: 'Author',
                        name: 'sequenceAuthor',
                        cls: 'sequenceName'
                    }]
                }, {
                    xtype: 'button',
                    text: 'Import file',
                    cls: 'import',
                    formBind: true
                }, {
                    xtype: 'label',
                    margin: 10,
                    cls: 'importProgressLabel',
                    text: ''
                }]
            }]
        });

        me.callParent(arguments);
    }

});