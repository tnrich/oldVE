/**
 * Defines the Eugene Rules grid in the InspectorPanel. This allows us to 
 * use initComponent(), which assigns a new editing plugin to each instance of
 * the grid. This prevents multiple instances of the grid from sharing the plugin,
 * which prevents editing.
 */
Ext.define('Vede.view.de.EugeneRulesGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.eugenerulesgrid',

    initComponent: function() {
        Ext.apply(this, {
            viewConfig: {
                markDirty: false
            },
            layout: 'fit',
            plugins: Ext.create('Ext.grid.plugin.RowEditing',{
                clicksToEdit: 2
                // listeners: {
                //     edit: function () {
                //         Vede.application.fireEvent('editEugeneRule');
                //     }
                // }
            }),
            columnLines: true,
            rowLines: true,
            minHeight: 140,
            columns: [
                {
                    xtype: 'gridcolumn',
                    width: 100,
                    text: 'Name',
                    dataIndex: 'name',
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    }
                },
                {
                    xtype: 'gridcolumn',
                    text: 'Operand 1',
                    dataIndex: 'operand1_id',
                    renderer: function(id, metaData, rule) {
                        return rule.getOperand1().get("name");
                    }
                },
                {
                    xtype: 'booleancolumn',
                    text: 'NOT?',
                    dataIndex: 'negationOperator',
                    trueText: 'NOT',
                    falseText: null,
                    editor: {
                        xtype: 'checkbox'
                    }
                },
                {
                    xtype: 'gridcolumn',
                    text: 'Operator',
                    dataIndex: 'compositionalOperator',
                    editor: {
                        xtype: 'combobox',
                        store: Teselagen.constants.Constants.COMPOP_LIST
                    }
                },
                {
                    xtype: 'gridcolumn',
                    text: 'Operand 2',
                    dataIndex: 'operand2_id',
                    cls: "operand2_field",
                    editor: {
                        xtype: 'combobox',
                        store: [],
                        cls: "operand2_combobox"
                    },
                    renderer: function(id, metaData, rule) {
                        if(rule.get("operand2isNumber")) {
                            return rule.get("operand2Number");
                        } else {
                            return rule.getOperand2().get("name");
                        }
                    }
                    
                }
            ]
        });

        this.callParent(arguments);
    }
});
