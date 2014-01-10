/**
 * Defines the collection info grid in the InspectorPanel. This allows us to 
 * use initComponent(), which assigns a new editing plugin to each instance of
 * the grid. This prevents multiple instances of the grid from sharing the plugin,
 * which prevents editing.
 */
Ext.define('Vede.view.de.InspectorCollectionInfoGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.collectioninfogrid',

    initComponent: function() {
        Ext.apply(this, {
            viewConfig: {
                markDirty: false
            },
            layout: 'fit',
            allowDeselect: true,
            autoScroll: true,
            columnLines: true,
            minHeight:132,
            plugins: Ext.create('Ext.grid.plugin.RowEditing',{
                clicksToEdit: 2,
                errorSummary: false,
                listeners: {
                	validateedit: function(editor, e) {
                		var oldBinName = e.originalValues.binName;
                		var oldDirectionForward = e.originalValues.directionForward;
                		var oldDsf = e.originalValues.dsf;
                		var oldExtra3PrimeBps = e.originalValues.extra3PrimeBps;
                		var oldExtra5PrimeBps = e.originalValues.extra5PrimeBps;
                		var oldFro = e.originalValues.fro;
                		
                		var newBinName = e.record.fields.get("binName").convert(e.newValues.binName);
                		var newDirectionForward = e.newValues.directionForward;
                		var newDsf = e.newValues.dsf;
                		var newExtra3PrimeBps = e.newValues.extra3PrimeBps;
                		var newExtra5PrimeBps = e.newValues.extra5PrimeBps;
                		var newFro = e.newValues.fro;
                		
                		if(oldBinName!==newBinName || oldDirectionForward!==newDirectionForward || oldDsf!==newDsf
                				|| oldExtra3PrimeBps!==newExtra3PrimeBps || oldExtra5PrimeBps!==newExtra5PrimeBps 
                				|| oldFro!==newFro) {
                			Teselagen.manager.GridCommandPatternManager.addCommand({
                	        	type: "BIN",
                	        	data: {
                	        		type: "EDIT",
                	        		x: e.rowIdx,
                	        		oldData: e.originalValues,
                	        		newData: e.newValues
                	        	}
                			});
                		}
                		
                	}
                }
            }),
            columns: [
                {
                    xtype: 'gridcolumn',
                    width: 120,
                    text: '<div data-qtip="Column Name">Column Name</div>',
                    dataIndex: 'binName',
                    sortable: false,
                    menuDisabled: true,
                    editor: {
                        xtype: 'textfield',
                        allowBlank: false
                    },
                    renderer: function(value, metadata) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    xtype: 'gridcolumn',
                    text: '<div data-qtip="Direction">Direction</div>',
                    menuDisabled: true,
                    sortable: false,
                    dataIndex: 'directionForward',
                    width: 80,
                    editor: {
                        xtype: 'combobox',
                        store: [[true, "Forward"], [false, "Reverse"]]
                    },
                    renderer: function(forward) {
                        if(forward) {
                            return "Forward";
                        } else {
                            return "Reverse";
                        }
                    }
                },
                {
                    xtype: 'numbercolumn',
                    width: 40,
                    menuDisabled: true,
                    sortable: false,
                    text: '<div data-qtip="Items">Items</div>',
                    renderer: function(value, metadata, record) {
                        var numParts = 0;
                        var cells = record.cells().getRange();

                        for(var i = 0; i < cells.length; i++) {
                            if(cells[i].getPart()) {
                                numParts++;
                            }
                        }

                        return numParts;
                    }
                },
                {
                    xtype: 'gridcolumn',
                    text: '<div data-qtip="Forced Assembly Strategy">FAS</div>',
                    menuDisabled: true,
                    sortable: false,
                    dataIndex: 'fas',
                    renderer: function(value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        if(record.cells().getRange().length > 0) {
                            for(var i=0; i < record.cells().getRange().length;i++) {
                                if(record.cells().getRange()[i].get("fas")) {
                                    var fas = record.cells().getRange()[i].get("fas");
                                    if(fas!="None") {
                                        metadata.tdAttr = 'data-qtip="' + fas + '"';
                                        return fas;
                                    }
                                }
                            }
                            metadata.tdAttr = 'data-qtip="' + fas + '"';
                            return fas;
                        } else {
                            metadata.tdAttr = 'data-qtip="' + value + '"';
                            return value;
                        }
                    }
                },
                {
                    xtype: 'booleancolumn',
                    text: '<div data-qtip="Direct Synthesis Firewall">DSF</div>',
                    menuDisabled: true,
                    sortable: false,
                    dataIndex: 'dsf',
                    editor: {
                        xtype: 'checkbox'
                    }
                },
                {
                    xtype: 'gridcolumn',
                    text: '<div data-qtip="Forced Relative Overhang">FRO</div>',
                    menuDisabled: true,
                    sortable: false,
                    dataIndex: 'fro',
                    editor: {
                        xtype: 'numberfield',
                        allowDecimals: false,
                        decimalPrecision: 1,
                        emptyText: '',
                        hideTrigger: true
                    },
                    renderer: function(value) {
                        if(value === 'None') {
                            return '';
                        } else {
                            return value;
                        }
                    }
                },
                {
                    xtype: 'numbercolumn',
                    text: '<div data-qtip="5\' Extra CPEC Overhang Bps">5\' Ex</div>',
                    menuDisabled: true,
                    sortable: false,
                    dataIndex: 'extra5PrimeBps',
                    editor: {
                        xtype: 'numberfield',
                        allowDecimals: false,
                        decimalPrecision: 1,
                        emptyText: '',
                        hideTrigger: true
                    },
                    renderer: Ext.util.Format.numberRenderer('0')
                },
                {
                    xtype: 'numbercolumn',
                    text: '<div data-qtip="3\' Extra CPEC Overhang Bps">3\' Ex</div>',
                    menuDisabled: true,
                    sortable: false,
                    dataIndex: 'extra3PrimeBps',
                    flex: 1,
                    editor: {
                        xtype: 'numberfield',
                        allowDecimals: false,
                        decimalPrecision: 1,
                        emptyText: '',
                        hideTrigger: true
                    },
                    renderer: Ext.util.Format.numberRenderer('0')
                }
            ]
        });

        this.callParent(arguments);
    }
});
