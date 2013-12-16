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
            layout: 'fit',
            viewConfig: {
                markDirty: false
            },
            plugins: Ext.create('Ext.grid.plugin.CellEditing',{
                clicksToEdit: 2,
                pluginId: 'cellplugin',
                listeners: {
                    validateedit: function (editor, e, eOpts) {
                        var updatedField = e.field;
                        var cancel = e.cancel;
                        if (updatedField === "name" && e.originalValue != e.value) {
                            var newName = e.value;
                            duplicate = Vede.application.fireEvent('ruleNameChanged', newName, cancel);
                            if (!duplicate) {return false;}
                        };
                    },
                    edit: function (editor, e, eOpts) {
                        var updatedField = e.field;
                        var operand1Id = e.record.operand1.internalId;
                        var ruleName = e.record.data.name;
                        
                        if (updatedField === "operand2_id") {
                            var oldId = e.originalValue;
                            var newId = e.value;
                            Vede.application.fireEvent('operand2Changed', operand1Id, newId, ruleName, oldId, e);
                        } else if (updatedField === "compositionalOperator") {
                            var record = e.record;
                            var column = e.column;
                            var oldOperand2 = e.record.operand2;
                            var newCompOperator = e.value;
                            var oldCompOperator = e.originalValue;
                            Vede.application.fireEvent('changeCompOperator', record, column, ruleName, oldOperand2, operand1Id, oldCompOperator, newCompOperator); 
                        }
                    }
                },
                
            }),
            columnLines: true,
            rowLines: true,
            minHeight: 12   0,
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
                        editable: false,
                        store: Teselagen.constants.Constants.COMPOP_LIST
                    }
                },
                {
                    xtype: 'gridcolumn',
                    text: 'Operand 2',
                    flex: 1,
                    dataIndex: 'operand2_id',
                    cls: "operand2_field",
                    listeners: {
                        dblclick: function (event, target, options) {
                            var column = this;
                            Vede.application.fireEvent('setOperand2Editor', column);
                        },
                        /*render: function(column) {
                            this.getEditor = function(record) {
                                if(record.get("operand2isNumber")) {
                                    return Ext.create("Ext.form.field.Number", {
                                        allowBlank: false,
                                        allowDecimals: false,
                                        minValue: 0,
                                        value: record.get("operand2Number") || 0
                                    });
                                } else {
                                    var activeProject = Ext.getCmp("mainAppPanel").getActiveTab().model;
                                    var operand1 = Teselagen.manager.DeviceDesignManager.getPartById(activeProject, record.get("operand1_id"));
                                    var allParts = Teselagen.manager.DeviceDesignManager.getAllParts(activeProject, operand1);
                                    var partsStore = [];
                                    Ext.each(allParts, function(part) {
                                        partsStore = partsStore.concat([[part.get('id'), part.get('name')]]);
                                    });

                                    return Ext.create("Ext.form.field.ComboBox", {
                                        store: partsStore,
                                        allowBlank: false,
                                        editable: false,
                                        displayField: 'name',
                                        valueField: 'id',
                                        cls: 'operand2_namefield'
                                    });
                                }
                            };
                        },*/
                    },
                    renderer: function(id, metaData, rule) {
                        if (rule.get("compositionalOperator") === "MORETHAN") {
                            rule.set("operand2isNumber", true);
                            return rule.get("operand2Number");
                        } else {
                            rule.set("operand2isNumber", false);
                            return rule.getOperand2().get("name");
                        }
                        if(rule.get("operand2isNumber")) {
                            return rule.get("operand2Number");
                        } else {
                            return rule.getOperand2().get("name");
                        }
                    }
                },
            ]
        });

        this.callParent(arguments);
    }
});
