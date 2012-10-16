Ext.define('Vede.view.de.InspectorPanel', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.InspectorPanel',


    //id: 'InspectorPanel',
    maxWidth: 400,
    collapseDirection: 'right',
    collapsed: false,
    collapsible: true,
    headerPosition: 'left',
    hideCollapseTool: false,
    title: 'Inspector',
    titleCollapse: true,
    activeTab: 0,
    minTabWidth: 130,
    plain: false,
    removePanelHeader: false,
    items: [{
        xtype: 'panel',
        layout: {
            align: 'stretch',
            type: 'vbox'
        },
        title: 'Part Info',
        preventHeader: true,
        items: [{
            xtype: 'form',
            flex: 1,
            height: 200,
            //id: 'PartPropertiesForm',
            maxHeight: 200,
            width: 287,
            layout: {
                align: 'stretch',
                type: 'vbox'
            },
            bodyPadding: 10,
            title: 'Properties',
            items: [{
                xtype: 'textfield',
                height: 25,
                //id: 'partNameField',
                fieldLabel: 'Part Name',
                labelWidth: 150
            }, {
                xtype: 'displayfield',
                height: 25,
                //id: 'partSourceField',
                fieldLabel: 'Part Source',
                labelWidth: 150
            }, {
                xtype: 'displayfield',
                height: 25,
                //id: 'reverseComplementField',
                fieldLabel: 'Reverse Complement',
                labelWidth: 150
            }, {
                xtype: 'displayfield',
                height: 25,
                //id: 'startBPField',
                fieldLabel: 'Start BP',
                labelWidth: 150
            }, {
                xtype: 'displayfield',
                height: 25,
                //id: 'stopBPField',
                fieldLabel: 'End BP',
                labelWidth: 150
            }]
        }, {
            xtype: 'form',
            flex: 1,
            maxHeight: 80,
            bodyPadding: 10,
            title: 'Forced Assembly Strategy',
            items: [{
                xtype: 'combobox',
                anchor: '100%'
            }]
        }, {
            xtype: 'form',
            flex: 1,
            bodyPadding: 10,
            title: 'Eugene Rules',
            dockedItems: [{
                xtype: 'button',
                dock: 'top',
                text: 'Add Rule'
            }, {
                xtype: 'button',
                dock: 'top',
                text: 'List'
            }]
        }]
    }, {
        xtype: 'panel',
        layout: {
            type: 'fit'
        },
        title: 'Collection Info',
        items: [{
            xtype: 'form',
            //id: 'collectionInfoForm',
            bodyBorder: false,
            bodyPadding: 10,
            items: [{
                xtype: 'displayfield',
                anchor: '100%',
                //id: 'j5_ready_field',
                value: 'Display Field',
                fieldLabel: 'j5 Ready'
            }, {
                xtype: 'displayfield',
                anchor: '100%',
                //id: 'combinatorial_field',
                value: 'Display Field',
                fieldLabel: 'Combinatorial'
            }, {
                xtype: 'radiogroup',
                //id: 'plasmid_geometry',
                fieldLabel: 'Plasmid Type',
                allowBlank: false,
                items: [{
                    xtype: 'radiofield',
                    //id: 'circular_plasmid_radio',
                    name: 'plasmidtype',
                    boxLabel: 'Circular',
                    checked: true
                }, {
                    xtype: 'radiofield',
                    //id: 'linear_plasmid_radio',
                    name: 'plasmidtype',
                    boxLabel: 'Linear'
                }]
            }, {
                xtype: 'gridpanel',
                margin: 10,
                autoScroll: true,
                columnLines: true,
                columns: [{
                    xtype: 'rownumberer',
                    width: 50,
                    text: 'Column'
                }, {
                    xtype: 'gridcolumn',
                    text: 'Direction'
                }, {
                    xtype: 'numbercolumn',
                    text: 'Items'
                }, {
                    xtype: 'gridcolumn',
                    text: 'FAS'
                }, {
                    xtype: 'booleancolumn',
                    text: 'DSF'
                }, {
                    xtype: 'gridcolumn',
                    text: 'FRO'
                }, {
                    xtype: 'numbercolumn',
                    text: '5\' Ex'
                }, {
                    xtype: 'numbercolumn',
                    text: '3\' Ex'
                }],
                viewConfig: {

                }
            }, {
                xtype: 'container',
                //id: 'inspector_containerActions',
                margin: 10,
                items: [{
                    xtype: 'button',
                    text: 'Add Column'
                }, {
                    xtype: 'button',
                    width: 100,
                    text: 'Remove Column'
                }]
            }, {
                xtype: 'textfield',
                anchor: '100%',
                height: 200,
                margin: 10,
                width: 269,
                fieldLabel: 'Column Content',
                labelAlign: 'top'
            }]
        }]
    }]
}


);