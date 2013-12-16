Ext.define('Vede.view.de.SaveAsWindow', {
    extend: 'Ext.window.Window',
    title: 'Save As...',
    modal: true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    height: 400,
    width: 600,
    items: [
        {
            xtype: 'gridpanel',
            forceFit: true,
            flex: 1,
            id: 'saveAsWindowDesignsGrid',
            scroll: 'vertical',
            columns: [{
                    text: 'Designs',
                    dataIndex: 'name'
                }, {
                    text: 'Last Modified',
                    dataIndex: 'dateModified',
                    renderer: Ext.util.Format.dateRenderer('F d, Y g:i A')
                }
            ],
            dockedItems: [{
                xtype: 'pagingtoolbar',
                dock: 'bottom',
                displayInfo: true
            }]
        }, {
            xtype: 'textfield',
            fieldLabel: 'Save As:',
            maxHeight: 30,
            id: 'saveAsWindowDesignNameField',
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
                        var window = this.up('window');

                        window.down('grid').store.clearFilter();
                        window.down('grid').store.load();
                        window.close();
                    }
                }, {
                    xtype: 'tbseparator'
                }, {
                    xtype: 'button',
                    id: 'saveAsWindowOKButton',
                    margin: 10,
                    text: 'Ok'
                }
            ]
        }
    ]
});
