/**
 * Patches a bug in the EXT gridpanel.
 * see: http://www.sencha.com/forum/showthread.php?268135-Grid-error-on-delete-selected-row
 */
Ext.define('Ext.grid.plugin.override.RowExpander', {
    override: 'Ext.grid.plugin.RowExpander',

    beforeReconfigure: function(grid, store, columns, oldStore, oldColumns) {
        var expander = this.getHeaderConfig();
        expander.locked = true;
        grid.columns.unshift(expander);
    }
});

/**
 * Confirmation window when deleting a sequence.
 * @class Vede.view.common.DeleteSequenceConfirmationWindow
 */
Ext.define('Vede.view.common.DeleteSequenceConfirmationWindow', {
    extend: 'Ext.window.Window',
    requires: ['Ext.grid.plugin.RowExpander'],
    title: 'Affected Parts and Designs',
    callback: function() {},
    modal: true,
    resizable: false,
    width: 400,
    items: [{
        xtype: 'displayfield',
        hideLabel: true,
        value: 'Deleting this sequence will also delete the following parts and remove them from their designs:'
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
            rowLines: true,
            sortableColumns: false,
            columns: [{
                xtype: 'gridcolumn',
                flex: 1,
                text: 'Part',
                dataIndex: 'name',
                renderer: function(id, metaData, partModel) {
                    var part = partModel.data.field1;
                    return part.name;
                }
            }, {
                xtype: 'gridcolumn',
                width: 200,
                text: 'Designs Containing Part',
                dataIndex: 'designs',
                renderer: function(id, meta, partModel) {
                    var designs = partModel.data.field1.designs.map(function(design) {
                        return design.name;
                    });

                    if(designs.length > 0) {
                        return designs.join('<br>');
                    } else {
                        return 'This part is not in any designs.';
                    }
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


