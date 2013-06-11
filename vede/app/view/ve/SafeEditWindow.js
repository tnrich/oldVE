/**
 * Confirmation window when editing the sequence inside a feature.
 * @class Vede.view.ve.SafeEditWindow
 */
Ext.define('Vede.view.ve.SafeEditWindow', {
    extend: 'Ext.window.Window',
    title: 'Editing...',
    modal: true,
    width: 400,
    resizable: false,
    items: [{
        xtype: 'container',
        layout: {
            type: 'vbox'
        },
        width: 400,
        items: [{
            xtype: 'gridpanel',
            cls: 'safeEditGrid',
            width: 400,
            layout: 'fit',
            title: 'Features Affected By Edit',
            columnLines: true,
            rowLines: true,
            sortableColumns: false,
            plugins: Ext.create('Ext.grid.plugin.CellEditing',{
                clicksToEdit: 1,
            }),
            selModel: {
                selType: 'checkboxmodel',
                injectCheckbox: 'last',
                showHeaderCheckbox: false,
                checkOnly: true,
                mode: 'MULTI'
            },
            columns: [{
                xtype: 'gridcolumn',
                text: 'Name',
                columnWidth: 200,
                dataIndex: 'name',
                renderer: function(id, metaData, featureModel) {
                    // ExtJS puts features into a store and makes them into a
                    // weird 'implicitModel'. This retrieves the original feature.
                    var feature = featureModel.data.field1;
                    return feature.getName();
                }
            }, {
                xtype: 'gridcolumn',
                text: 'Type',
                dataIndex: 'type',
                renderer: function(id, metaData, featureModel) {
                    var feature = featureModel.data.field1;
                    return feature.getType();
                }
            }, {
                xtype: 'gridcolumn',
                text: 'Position',
                renderer: function(id, metaData, featureModel) {
                    var feature = featureModel.data.field1;
                    return (feature.getStart() + 1) + ' - ' + (feature.getEnd() + 1);
                }
            }]
        }, {
            xtype: 'displayfield',
            hideLabel: true,
            value: '<a href="#">Turn off safe editing</a>',
            listeners: {
                render: function(field) {
                    field.getEl().on('click', function() {
                        field.fireEvent('click', field);
                    });
                }
            }
        }, {
            xtype: 'container',
            layout: {
                type: 'hbox'
            },
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
