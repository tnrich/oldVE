/**
 * Confirmation window when deleting a sequence.
 * @class Vede.view.common.DeleteSequenceConfirmationWindow
 */
Ext.define('Vede.view.common.DeleteSequenceConfirmationWindow', {
    extend: 'Ext.window.Window',
    title: 'Affected Parts and Designs',
    callback: function() {},
    modal: true,
    resizable: false,
    width: 400,
    items: [{
        xtype: 'displayfield',
        hideLabel: true,
        value: 'Deleting this sequence will also remove the following parts:'
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
                dataIndex: 'name',
                renderer: function(id, metaData, partModel) {
                    var part = partModel.data.field1;
                    return part.name;
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


