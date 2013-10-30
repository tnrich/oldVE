/**
 * Confirmation window when deleting a part.
 * @class Vede.view.common.DeletePartConfirmationWindow
 */
Ext.define('Vede.view.common.DeletePartConfirmationWindow', {
    extend: 'Ext.window.Window',
    title: 'Affected Designs',
    callback: function() {},
    modal: true,
    resizable: false,
    width: 400,
    items: [{
        xtype: 'displayfield',
        hideLabel: true,
        value: 'This part will be deleted from the following designs:'
    }, {
        xtype: 'container',
        layout: {
            type: 'vbox'
        },
        items: [{
            xtype: 'gridpanel',
            width: 400,
            flex: 1,
            columnLines: true,
            hideHeaders: true,
            rowLines: true,
            sortableColumns: false,
            columns: [{
                xtype: 'gridcolumn',
                width: 400,
                dataIndex: 'name',
                renderer: function(id, metaData, designModel) {
                    var design = designModel.data.field1;
                    return design.name;
                }
            }]
        }, {
            xtype: 'container',
            layout: {
                type: 'hbox'
            },
            flex: 1,
            items: [{
                xtype: 'button',
                text: 'Ok',
                margin: 2,
                padding: 2,
                handler: function() {
                    this.up('window').callback();
                    this.up('window').close();
                }
            }, {
                xtype: 'button',
                text: 'Cancel',
                margin: 2,
                padding: 2,
                handler: function() {
                    this.up('window').close();
                }
            }]
        }]
    }]
});

