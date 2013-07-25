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
                errorSummary: false
            }),
            columns: [
                {
                    xtype: 'gridcolumn',
                    width: 100,
                    text: '<div data-qtip="Column Name">Column Name</div>',
                    dataIndex: 'binName',
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
                    dataIndex: 'directionForward',
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
                    text: '<div data-qtip="Items">Items</div>',
                    renderer: function(value, metadata, record) {
                        var numParts = 0;
                        var partsArray = record.cells().getRange();

                        for(var i = 0; i < partsArray.length; i++) {
                            if(!partsArray[i].get("phantom")) {
                                numParts++;
                            }
                        }

                        return numParts;
                    }
                },
                {
                    xtype: 'gridcolumn',
                    text: '<div data-qtip="Forced Assembly Strategy">FAS</div>',
                    dataIndex: 'fas',
                    renderer: function(value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';

                        if(record.cells().getRange().length > 0) {
                            metadata.tdAttr = 'data-qtip="' + record.cells().getRange()[0].get("fas") + '"';
                            return record.cells().getRange()[0].get("fas");
                        } else {
                            metadata.tdAttr = 'data-qtip="' + value + '"';
                            return value;
                        }
                    }
                },
                {
                    xtype: 'booleancolumn',
                    text: '<div data-qtip="Direct Synthesis Firewall">DSF</div>',
                    dataIndex: 'dsf',
                    editor: {
                        xtype: 'checkbox'
                    }
                },
                {
                    xtype: 'gridcolumn',
                    text: '<div data-qtip="Forced Relative Overhang">FRO</div>',
                    dataIndex: 'fro',
                    editor: {
                        xtype: 'textfield'
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
                    dataIndex: 'extra3PrimeBps',
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
